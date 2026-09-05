document.addEventListener("DOMContentLoaded", () => {
    COCO.protegerPagina();
    actualizarDashboard();

    document.getElementById("btn-cerrar-sesion")?.addEventListener("click", COCO.cerrarSesion);

 
    window.addEventListener("storage", (evento) => {
        if (evento.key === "cocoVentas" || evento.key === "cocoProductos") {
            actualizarDashboard();
        }
    });
});

function actualizarDashboard() {
    const productos = COCO.obtenerProductos();
    const ventas = COCO.obtenerVentas();

    renderizarStats(productos, ventas);
    renderizarUltimasVentas(ventas);
}

function renderizarStats(productos, ventas) {
    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const anioActual = ahora.getFullYear();

    const prendasDisponibles = productos.reduce((suma, p) => suma + (Number(p.stock) || 0), 0);

    const ventasDelMes = ventas.filter((v) => {
        const fecha = new Date(v.fecha);
        return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
    });

    const ingresosDelMes = ventasDelMes.reduce((suma, v) => suma + Number(v.total), 0);

    document.getElementById("stat-prendas").textContent = prendasDisponibles;
    document.getElementById("stat-ventas-mes").textContent = ventasDelMes.length;
    document.getElementById("stat-ventas-totales").textContent = ventas.length;
    document.getElementById("stat-ingresos").textContent = COCO.formatearBs(ingresosDelMes);
}

function renderizarUltimasVentas(ventas) {
    const cuerpo = document.getElementById("tabla-ventas-body");
    const vacio = document.getElementById("tabla-vacia");
    cuerpo.innerHTML = "";

    const ultimas = ventas
        .slice()
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5);

    if (ultimas.length === 0) {
        vacio.hidden = false;
        return;
    }
    vacio.hidden = true;

    ultimas.forEach((venta) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${COCO.formatearFecha(venta.fecha)}</td>
            <td>${venta.idProducto}</td>
            <td>${venta.producto}</td>
            <td>${venta.cantidad}</td>
            <td>${COCO.formatearBs(venta.total)} Bs</td>
            <td><span class="badge ${COCO.claseBadgeEstado(venta.estado)}">${venta.estado}</span></td>
        `;
        cuerpo.appendChild(fila);
    });
}
