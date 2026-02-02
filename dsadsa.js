<!DOCTYPE html>
<html lang="es">
<head>
    <title>Catálogo - Nuestra Tienda</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav>
        <button id="btnLogout">Cerrar Sesión</button>
    </nav>

    <div class="container">
        <h1>Nuestros Productos</h1>

        <div class="filtros-box">
            <input type="text" id="buscador" placeholder="Busque su antojo...">
            <div class="categorias">
                <button class="btn-filtro active" data-categoria="todos">Todos</button>
                <button class="btn-filtro" data-categoria="comida">Comida</button>
                <button class="btn-filtro" data-categoria="bebida">Bebidas</button>
            </div>
        </div>

        <div id="lista-productos" class="grid-productos">
            <div class="producto" data-nombre="Arepa con Queso" data-categoria="comida">
                <h3>Arepa con Queso</h3>
                <p>Precio: $5000</p>
                <button class="btn-agregar" data-id="101" data-nombre="Arepa con Queso" data-precio="5000">Agregar</button>
            </div>
            <div class="producto" data-nombre="Jugo de Mora" data-categoria="bebida">
                <h3>Jugo de Mora</h3>
                <p>Precio: $3500</p>
                <button class="btn-agregar" data-id="102" data-nombre="Jugo de Mora" data-precio="3500">Agregar</button>
            </div>
        </div>

        <div class="carrito-box">
            <h2>Su Carrito</h2>
            <div id="lista-carrito"></div>
            <button id="btnOrdenar">🚀 ¡Ordenar Ahora!</button>
        </div>
    </div>

    <script src="main.js"></script>
</body>
</html>
