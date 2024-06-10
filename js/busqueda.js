document.getElementById('formularioBusqueda').addEventListener('submit', function(event) {
    event.preventDefault();
    const terminoBusqueda = document.getElementById('buscar').value;
    console.log('Término de búsqueda enviado:', terminoBusqueda);
    // Limpiar el campo de búsqueda y mostrar el ícono de carga
    document.getElementById('buscar').value = '';
    const lista = document.getElementById('productosBaratos');
    const tituloResultados = document.getElementById('tituloResultados');
    const seccionResultados = document.querySelector('.resultados');
    const formulario = document.getElementById('formularioBusqueda');
    const loadingIcon = document.createElement('i');
    
    loadingIcon.classList.add('bi', 'bi-arrow-repeat', 'loading-icon');
    loadingIcon.innerHTML = ' Cargando...';

    // Ocultar el formulario y mostrar el icono de carga
    formulario.style.display = 'none';
    formulario.insertAdjacentElement('afterend', loadingIcon);
    loadingIcon.style.display = 'inline-block';
    tituloResultados.textContent = '';
    lista.innerHTML = '';


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

            tituloResultados.textContent = 'Productos más baratos:';
            const item = document.createElement('li');
            
            const imagen = document.createElement('img');
            imagen.src = producto.img;
            imagen.alt = producto.titulo;

            const texto = document.createElement('div');
            texto.innerHTML = `<b>${producto.titulo}</b><br> $${producto.precio} Pesos<br>${producto.descripcion}`;

            item.appendChild(imagen);
            item.appendChild(texto);
            lista.appendChild(item);
            seccionResultados.style.display = 'block';
        });

        
    })
    .catch(error => {
        console.error('Error:', error);
        tituloResultados.textContent = 'Error al obtener los productos. Inténtalo de nuevo más tarde.';
        lista.innerHTML = '';
        seccionResultados.style.display = 'block';
    })
    .finally(() => {
        // Rehabilitar el formulario y esconder el icono de carga
        formulario.style.display = 'block';
        loadingIcon.style.display = 'none';
        formulario.parentElement.removeChild(loadingIcon);
    });
});

