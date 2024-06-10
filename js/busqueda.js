document.getElementById('formularioBusqueda').addEventListener('submit', function(event) {
    event.preventDefault();
    const terminoBusqueda = document.getElementById('buscar').value;
    console.log('Término de búsqueda enviado:', terminoBusqueda);

    fetch('http://localhost:3000/buscar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ termino: terminoBusqueda })
    })
    .then(response =>{
        console.log('Respuesta del servidor recibida:', response);
        return response.json()
    } )
    .then(productosBaratos => {
        console.log('Productos más baratos recibidos:', productosBaratos);  // Log para depuración
        const lista = document.getElementById('productosBaratos');
        lista.innerHTML = '';  // Limpiar la lista antes de agregar nuevos elementos
        productosBaratos.forEach(producto => {
            const item = document.createElement('li');
            item.textContent = `${producto.titulo}. A $${producto.precio} Pesos`;
            lista.appendChild(item);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        // Añadir un mensaje de error en la página si ocurre un error
        const lista = document.getElementById('productosBaratos');
        lista.innerHTML = '<li>Error al obtener los productos. Inténtalo de nuevo más tarde.</li>';
    });
});

/*

document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formularioBusqueda');

    formulario.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío del formulario

        const inputBusqueda = document.getElementById('buscar');
        const textoBusqueda = inputBusqueda.value;

        console.log(textoBusqueda); // Muestra el texto en la consola
        // Leer el archivo
        fs.readFile('./py/scrapy_ml.py', 'utf8', function(err, data) {
            if (err) {
                return console.log(err);
            }
            
            // Dividir el contenido en líneas
            let lines = data.split('\n');
            
            // Reemplazar una línea específica (por ejemplo, la línea 10)
            let lineNumber = 25;  // Los índices de array en JavaScript empiezan en 0
            lines[lineNumber] = ''+textoBusqueda+'';
            
            // Unir las líneas de nuevo
            let result = lines.join('\n');
            
            // Escribir el nuevo contenido en el archivo
            fs.writeFile('scrapy.py', result, 'utf8', function(err) {
                if (err) return console.log(err);
            });
        });

        fetch('./assets/data/productos.json')
        .then(response => response.json())
        .then(data => {
            // Ordenar los productos por precio de menor a mayor
            data.sort((a, b) => a.precio - b.precio);

            // Obtener los 3 productos más baratos
            const productosBaratos = data.slice(0, 3);

              // Mostrar los productos más baratos en la página
            const lista = document.getElementById('productosBaratos');
            productosBaratos.forEach(producto => {
                const item = document.createElement('li');
                item.textContent = `${producto.descripcion}: $${producto.precio}`;
                lista.appendChild(item);
            });

            // Muestrar los productos más baratos en la consola
            console.log(productosBaratos);
        })
        .catch(error => console.error('Error al cargar el JSON:', error));
    });
});

/*const fs = require('fs');
const { exec } = require("child_process");

// Leer el archivo
fs.readFile('scrapy.py', 'utf8', function(err, data) {
    if (err) {
        return console.log(err);
    }

    // Dividir el contenido en líneas
    let lines = data.split('\n');

    // Reemplazar una línea específica (por ejemplo, la línea 10)
    let lineNumber = 0;  // Los índices de array en JavaScript empiezan en 0
    lines[lineNumber] = 'print("hola mundo")';

    // Unir las líneas de nuevo
    let result = lines.join('\n');

    // Escribir el nuevo contenido en el archivo
    fs.writeFile('scrapy.py', result, 'utf8', function(err) {
        if (err) return console.log(err);
    });
});


//ejecucion del python
exec("py scrapy.py", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});*/