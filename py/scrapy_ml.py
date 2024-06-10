from scrapy.item import Field
from scrapy.item import Item
from scrapy.spiders import CrawlSpider, Rule
from scrapy.loader.processors import MapCompose
from scrapy.linkextractors import LinkExtractor
from scrapy.loader import ItemLoader


class Articulo(Item):
    titulo = Field()
    precio = Field()
    descripcion = Field()
    img = Field()

class MLOFERTASCrawler(CrawlSpider):
    name = 'MLOFERTAS'
    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
        'CLOSESPIDER_PAGECOUNT': 20
    }
    
    download_delay = 1

    allowed_domains = ['listado.mercadolibre.com.ar','www.mercadolibre.com.ar', 'articulo.mercadolibre.com.ar']
    

    def __init__(self, termino='', *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.start_urls = [f'https://listado.mercadolibre.com.ar/{termino}']

    rules = (
        # Regla para llevar a cabo la paginacion
        Rule (
            LinkExtractor (
                allow=r'/_Desde_'
                ), follow=True
                
                ),
        # Regla para el detalle de los articulos
        Rule (
            LinkExtractor (
                allow=r'/MLA'
                ), follow=True, callback='parse_items'
                
                ),
    )

    def limpiarTexto(self, texto):
        nuevoTexto = texto.replace('\n',' ').replace('\r',' ').replace('\t',' ').replace('\"',' ').strip()
        return nuevoTexto

    def parse_items(self, response):
        
        item = ItemLoader(Articulo(), response)  

        titulo = item.get_xpath('//h1/text()', MapCompose(self.limpiarTexto))
        if titulo:  # Solo guarda el item si el título existe
            item.add_value('titulo', titulo)
            item.add_xpath('descripcion', '//p[@class="ui-pdp-description__content"]/text()',MapCompose(self.limpiarTexto))
            item.add_xpath('precio', '(//span[@class="andes-money-amount ui-pdp-price__part andes-money-amount--cents-superscript andes-money-amount--compact"]//span[@class="andes-money-amount__fraction"]/text())[1]')
            item.add_xpath('img','(//span[@class="ui-pdp-gallery__wrapper"]//figure[@class="ui-pdp-gallery__figure"]//img//@src)[1]')
            
            yield item.load_item()
