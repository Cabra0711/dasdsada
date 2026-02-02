// ==========================================
// 1. SEGURIDAD Y SESIÓN
// ==========================================
function verificarYProteger(rolRequerido) {
    const usuarioRaw = localStorage.getItem('user');
    if (!usuarioRaw) {
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
        return null;
    }
    const usuario = JSON.parse(usuarioRaw);
    if (rolRequerido && usuario.role !== rolRequerido) {
        alert(`Acceso denegado. Usted es ${usuario.role}.`);
        window.location.href = usuario.role === 'admin' ? 'dashboard-admin.html' : 'landing-user.html';
    }
    return usuario;
}

// ==========================================
// 2. LOGUEO DE USUARIOS
// ==========================================
async function iniciarSesion(email, password) {
    try {
        const resp = await fetch(`http://localhost:3000/users?email=${email}&password=${password}`);
        const users = await resp.json();

        if (users.length > 0) {
            localStorage.setItem('user', JSON.stringify(users[0]));
            window.location.href = users[0].role === 'admin' ? 'dashboard-admin.html' : 'landing-user.html';
        } else {
            alert("Usuario o clave incorrectos.");
        }
    } catch (e) { console.error("Error en login", e); }
}

// ==========================================
// 3. CARRITO Y ÓRDENES
// ==========================================
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function agregarAlCarrito(producto) {
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) { existe.cantidad++; } 
    else { carrito.push({ ...producto, cantidad: 1 }); }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`${producto.nombre} agregado.`);
}

async function crearPedido() {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (!usuario) return alert("Hágase el login primero.");
    if (carrito.length === 0) return alert("Carrito vacío.");

    const nuevoPedido = {
        userId: usuario.id,
        cliente: usuario.email,
        productos: carrito,
        total: carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0),
        estado: "pendiente",
        fecha: new Date().toLocaleString()
    };

    const resp = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoPedido)
    });

    if (resp.ok) {
        localStorage.removeItem('carrito');
        carrito = [];
        alert("¡Pedido enviado! Revisá el Dashboard.");
        window.location.href = usuario.role === 'admin' ? 'dashboard-admin.html' : 'landing-user.html';
    }
}

// ==========================================
// 4. GESTIÓN DE PEDIDOS (DASHBOARD)
// ==========================================
async function cargarPedidosAdmin() {
    const contenedor = document.getElementById('contenedor-pedidos');
    if (!contenedor) return;

    const resp = await fetch('http://localhost:3000/orders');
    const pedidos = await resp.json();
    
    contenedor.innerHTML = pedidos.map(p => `
        <div style="border:1px solid #ccc; margin:10px; padding:10px;">
            <p><strong>Orden #${p.id}</strong> - ${p.cliente}</p>
            <p>Total: $${p.total}</p>
            <select onchange="cambiarEstado(${p.id}, this.value)">
                <option value="pendiente" ${p.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                <option value="en preparacion" ${p.estado === 'en preparacion' ? 'selected' : ''}>En preparación</option>
                <option value="saliendo" ${p.estado === 'saliendo' ? 'selected' : ''}>Saliendo</option>
                <option value="entregado" ${p.estado === 'entregado' ? 'selected' : ''}>Entregado</option>
                <option value="cancelado" ${p.estado === 'cancelado' ? 'selected' : ''}>Cancelado</option>
            </select>
        </div>
    `).join('');
}

async function cambiarEstado(id, nuevoEstado) {
    await fetch(`http://localhost:3000/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
    });
    alert("Estado actualizado.");
}

// ==========================================
// 5. INICIALIZADOR DE EVENTOS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Escuchar Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            iniciarSesion(document.getElementById('email').value, document.getElementById('password').value);
        });
    }

    // Escuchar Botón Ordenar
    const btnOrdenar = document.getElementById('btnOrdenar');
    if (btnOrdenar) btnOrdenar.addEventListener('click', crearPedido);

    // Escuchar Botón Logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }

    // Cargar pedidos si es el Dashboard Admin
    if (window.location.pathname.includes('dashboard-admin.html')) {
        verificarYProteger('admin');
        cargarPedidosAdmin();
    }

    // Proteger Landing de usuario
    if (window.location.pathname.includes('landing-user.html')) {
        verificarYProteger('user');
    }
})
