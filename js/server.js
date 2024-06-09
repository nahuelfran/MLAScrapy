const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');// Importa el módulo cors
const app = express();
const path = require('path');

app.use(cors());  // Habilita CORS
app.use(express.json());  // Para poder leer el cuerpo de las solicitudes POST

app.post('/buscar', (req, res) => {
    const terminoBusqueda = req.body.termino;
    console.log(terminoBusqueda);
    const comandoScrapy = `scrapy runspider ../py/scrapy_ml.py -a termino=${terminoBusqueda} -O ../assets/data/productos.json` 
    //-a termino=${terminoBusqueda}`;
    
    exec(comandoScrapy, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al ejecutar el comando de Scrapy: ${error}`);
            return res.status(500).json({ error: 'Error al ejecutar el comando de Scrapy' });
        }

        // Ruta absoluta al archivo JSON
        const rutaJson = path.resolve(__dirname, '../assets/data/productos.json');
        // Lee el archivo JSON generado por el script de Python
        const resultados = require(rutaJson);
        // Ordena los resultados por precio y toma los tres primeros
        const productosBaratos = resultados.sort((a, b) => a.precio - b.precio).slice(0, 3);
        
        console.log(productosBaratos)
        
        // Retraso artificial de 5 segundos para depuración
        setTimeout(() => {
            res.json(productosBaratos);
        }, 5000);
    });
});

app.listen(3000, () => console.log('Servidor escuchando en el puerto 3000'));