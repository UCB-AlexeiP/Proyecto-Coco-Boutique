document.addEventListener("DOMContentLoaded", () => {
    COCO.protegerPagina();

    const filtroEstado = document.getElementById("filtro-estado");
    const buscador = document.getElementById("buscador-ventas");

    renderizarVentas();

    filtroEstado.addEventListener("change", renderizarVentas);
    buscador.addEventListener("input", renderizarVentas);
    document.getElementById("btn-cerrar-sesion")?.addEventListener("click", COCO.cerrarSesion);
});

function renderizarVentas() {
    const cuerpo = document.getElementById("tabla-ventas-completas-body");
    const vacio = document.getElementById("ventas-vacio");
    const estado = document.getElementById("filtro-estado").value;
    const texto = document.getElementById("buscador-ventas").value.trim().toLowerCase();

    let ventas = COCO.obtenerVentas();

    const totalGeneral = ventas.reduce((suma, v) => suma + Number(v.total), 0);
    document.getElementById("resumen-total-ventas").textContent = ventas.length;
    document.getElementById("resumen-ingresos-totales").textContent = COCO.formatearBs(totalGeneral) + " Bs";

    if (estado !== "todos") {
        ventas = ventas.filter((v) => v.estado === estado);
    }
    if (texto) {
        ventas = ventas.filter((v) =>
            v.cliente.toLowerCase().includes(texto) || v.producto.toLowerCase().includes(texto)
        );
    }

    cuerpo.innerHTML = "";

    if (ventas.length === 0) {
        vacio.hidden = false;
        return;
    }
    vacio.hidden = true;

    ventas
        .slice()
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .forEach((venta) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${COCO.formatearFecha(venta.fecha)}</td>
                <td>${venta.cliente}</td>
                <td>${venta.idProducto}</td>
                <td>${venta.producto}</td>
                <td>${venta.cantidad}</td>
                <td>${COCO.formatearBs(venta.total)} Bs</td>
                <td>${venta.metodoPago}</td>
                <td><span class="badge ${COCO.claseBadgeEstado(venta.estado)}">${venta.estado}</span></td>
                <td>
                    <div class="tabla-acciones">
                        <button class="tabla-accion-btn eliminar" data-id="${venta.id}">Eliminar</button>
                    </div>
                </td>
            `;
            cuerpo.appendChild(fila);
        });

    cuerpo.querySelectorAll(".eliminar").forEach((boton) => {
        boton.addEventListener("click", () => {
            if (confirm("¿Eliminar este registro de venta?")) {
                COCO.eliminarVenta(boton.dataset.id);
                COCO.mostrarToast("Venta eliminada");
                renderizarVentas();
            }
        });
    });
}
