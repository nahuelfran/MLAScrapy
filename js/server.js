const express = require('express');
const { exec } = require('child_process');
const cors = require('cors'); // Importa el módulo cors
const app = express();
const path = require('path');
const fs = require('fs-extra');

app.use(cors());  // Habilita CORS
app.use(express.json());  // Para poder leer el cuerpo de las solicitudes POST

app.post('/buscar', async (req, res) => {
    const terminoBusqueda = req.body.termino;
    console.log(terminoBusqueda);
    const comandoScrapy = `scrapy runspider ../py/scrapy_ml.py -a termino=${terminoBusqueda} -O ../assets/data/productos.json`;

    exec(comandoScrapy, async (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al ejecutar el comando de Scrapy: ${error}`);
            return res.status(500).json({ error: 'Error al ejecutar el comando de Scrapy' });
        }

        // Ruta absoluta al archivo JSON
        const rutaJson = path.resolve(__dirname, '../assets/data/productos.json');

        try {
            // Esperar a que el archivo sea escrito completamente
            await fs.ensureFile(rutaJson);  // Asegura que el archivo existe
            await fs.readFile(rutaJson, 'utf8'); // Espera a que el archivo se pueda leer

            const data = await fs.readFile(rutaJson, 'utf8');
            const resultados = JSON.parse(data);
            // Ordena los resultados por precio y toma los tres primeros
            const productosBaratos = resultados.sort((a, b) => Number(a.precio[0].replace(/\./g, '')) - Number(b.precio[0].replace(/\./g, ''))).slice(0, 5);
            res.json(productosBaratos);
        } catch (err) {
            console.error(`Error al leer el archivo JSON: ${err}`);
            res.status(500).json({ error: 'Error al leer el archivo JSON' });
        }
    });
});

app.listen(3000, () => console.log('Servidor escuchando en el puerto 3000'));
