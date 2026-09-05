const NUMERO_WHATSAPP_TIENDA = "59165510162"; // reemplaza por el número real de la tienda

document.addEventListener("DOMContentLoaded", () => {
    const productos = COCO.obtenerProductos();

    ["vestidos", "blusas", "chompas", "jeans"].forEach((categoria) => {
        const contenedor = document.getElementById(`grid-${categoria}`);
        if (contenedor) {
            renderizarGrid(contenedor, productos.filter((p) => p.categoria === categoria));
        }
    });

    document.getElementById("whatsapp-flotante")?.setAttribute(
        "href",
        COCO.enlaceWhatsApp(NUMERO_WHATSAPP_TIENDA, "Hola, quiero más información sobre Coco Boutique.")
    );
});

function renderizarGrid(contenedor, productos) {
    contenedor.innerHTML = "";

    if (productos.length === 0) {
        contenedor.innerHTML = `<p class="catalogo-vacio">Muy pronto nuevas prendas en esta categoría.</p>`;
        return;
    }

    productos.forEach((producto) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "producto-card";

        const imagenHTML = producto.imagen
            ? `<img src="${producto.imagen}" alt="${producto.nombre}">`
            : `<span>${producto.nombre}</span>`;

        const mensajeWhatsApp = `Hola, me interesa el producto "${producto.nombre}" (${COCO.formatearBs(producto.precio)} Bs). ¿Está disponible?`;

        tarjeta.innerHTML = `
            <div class="producto-card-imagen">${imagenHTML}</div>
            <div class="producto-card-cuerpo">
                <p class="producto-card-nombre">${producto.nombre}</p>
                <p class="producto-card-precio">${COCO.formatearBs(producto.precio)} Bs</p>
                <p class="producto-card-descripcion">${producto.descripcion || ""}</p>
                <div class="producto-card-tallas">
                    ${producto.tallas.map((t) => `<span>${t}</span>`).join("")}
                </div>
                <a class="btn btn-whatsapp" target="_blank" rel="noopener" href="${COCO.enlaceWhatsApp(NUMERO_WHATSAPP_TIENDA, mensajeWhatsApp)}">
                    Consultar por WhatsApp
                </a>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}
