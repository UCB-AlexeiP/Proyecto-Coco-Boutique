document.addEventListener("DOMContentLoaded", () => {
    COCO.protegerPagina();

    const buscador = document.getElementById("buscador-productos");
    const filtroCategoria = document.getElementById("filtro-categoria");

    renderizarProductos();

    buscador.addEventListener("input", renderizarProductos);
    filtroCategoria.addEventListener("change", renderizarProductos);
    document.getElementById("btn-cerrar-sesion")?.addEventListener("click", COCO.cerrarSesion);
});

function renderizarProductos() {
    const cuerpo = document.getElementById("tabla-productos-body");
    const vacio = document.getElementById("productos-vacio");
    const texto = document.getElementById("buscador-productos").value.trim().toLowerCase();
    const categoria = document.getElementById("filtro-categoria").value;

    let productos = COCO.obtenerProductos();

    if (categoria !== "todas") {
        productos = productos.filter((p) => p.categoria === categoria);
    }
    if (texto) {
        productos = productos.filter((p) => p.nombre.toLowerCase().includes(texto));
    }

    document.getElementById("stat-total-productos").textContent = COCO.obtenerProductos().length;

    cuerpo.innerHTML = "";

    if (productos.length === 0) {
        vacio.hidden = false;
        return;
    }
    vacio.hidden = true;

    productos.forEach((producto) => {
        const fila = document.createElement("tr");
        const stockClase = Number(producto.stock) <= 3 ? "stock-bajo" : "";

        fila.innerHTML = `
            <td>
                <div class="producto-nombre-celda">
                    <img class="tabla-imagen-miniatura" src="${producto.imagen || ''}" onerror="this.style.visibility='hidden'" alt="">
                    <div>
                        <strong>${producto.nombre}</strong>
                        <span>${producto.id}</span>
                    </div>
                </div>
            </td>
            <td>${capitalizar(producto.categoria)}</td>
            <td>${COCO.formatearBs(producto.precio)} Bs</td>
            <td class="${stockClase}">${producto.stock}</td>
            <td><div class="tallas-celda">${producto.tallas.map((t) => `<span class="talla-tag">${t}</span>`).join("")}</div></td>
            <td>
                <div class="tabla-acciones">
                    <button class="tabla-accion-btn eliminar" data-id="${producto.id}">Eliminar</button>
                </div>
            </td>
        `;
        cuerpo.appendChild(fila);
    });

    cuerpo.querySelectorAll(".eliminar").forEach((boton) => {
        boton.addEventListener("click", () => {
            if (confirm("¿Eliminar este producto del catálogo?")) {
                COCO.eliminarProducto(boton.dataset.id);
                COCO.mostrarToast("Producto eliminado");
                renderizarProductos();
            }
        });
    });
}

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}
