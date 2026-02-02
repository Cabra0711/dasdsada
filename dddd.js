function filtrarProductos() {
    const textoBusqueda = document.getElementById('buscador').value.toLowerCase();
    const categoriaActiva = document.querySelector('.btn-filtro.active')?.dataset.categoria || 'todos';
    
    const productos = document.querySelectorAll('.producto');

    productos.forEach(producto => {
        const nombre = producto.dataset.nombre.toLowerCase();
        const categoria = producto.dataset.categoria;

        // Condición 1: ¿El nombre coincide con lo que escribieron?
        const coincideNombre = nombre.includes(textoBusqueda);
        
        // Condición 2: ¿La categoría coincide o es "todos"?
        const coincideCategoria = (categoriaActiva === 'todos' || categoria === categoriaActiva);

        // Si cumple AMBAS, se muestra, si no, se esconde
        if (coincideNombre && coincideCategoria) {
            producto.style.display = "block";
        } else {
            producto.style.display = "none";
        }
    });
}

// --- Eventos para los filtros ---
document.addEventListener('DOMContentLoaded', () => {
    const buscador = document.getElementById('buscador');
    const botonesFiltro = document.querySelectorAll('.btn-filtro');

    // Escuchar cuando escriben en el input
    if (buscador) {
        buscador.addEventListener('input', filtrarProductos);
    }

    // Escuchar los clicks en los botones de categoría
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
            // Quitamos la clase 'active' de otros y se la ponemos al actual
            botonesFiltro.forEach(b => b.classList.remove('active'));
            boton.classList.add('active');
            
            filtrarProductos();
        });
    });
});
