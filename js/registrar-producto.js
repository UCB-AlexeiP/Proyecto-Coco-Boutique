document.addEventListener("DOMContentLoaded", () => {
    COCO.protegerPagina();

    const cantidadColoresInput = document.getElementById("cantidad-colores");
    const coloresLista = document.getElementById("colores-lista");
    const inputImagen = document.getElementById("imagen-producto");
    const preview = document.getElementById("imagen-preview");
    const formulario = document.getElementById("form-registrar-producto");

    let imagenBase64 = "";

    cantidadColoresInput.addEventListener("input", () => {
        generarCamposColores(Number(cantidadColoresInput.value) || 0, coloresLista);
    });

    inputImagen.addEventListener("change", () => {
        const archivo = inputImagen.files[0];
        if (!archivo) return;

        const lector = new FileReader();
        lector.onload = () => {
            imagenBase64 = lector.result;
            preview.innerHTML = `<img src="${imagenBase64}" alt="Vista previa del producto">`;
        };
        lector.readAsDataURL(archivo);
    });

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const tallas = Array.from(formulario.querySelectorAll('input[name="talla"]:checked')).map((c) => c.value);
        const colores = Array.from(coloresLista.querySelectorAll('input[type="text"]'))
            .map((input) => input.value.trim())
            .filter(Boolean);

        if (tallas.length === 0) {
            COCO.mostrarToast("Selecciona al menos una talla");
            return;
        }

        const producto = {
            nombre: document.getElementById("nombre-producto").value.trim(),
            categoria: document.getElementById("categoria-producto").value,
            precio: Number(document.getElementById("precio-producto").value),
            stock: Number(document.getElementById("stock-producto").value),
            tallas,
            colores,
            descripcion: document.getElementById("descripcion-producto").value.trim(),
            imagen: imagenBase64
        };

        COCO.agregarProducto(producto);
        COCO.mostrarToast("Producto registrado con éxito");
        formulario.reset();
        coloresLista.innerHTML = "";
        preview.innerHTML = "Sin imagen";

        setTimeout(() => {
            window.location.href = "productos.html";
        }, 900);
    });
});

function generarCamposColores(cantidad, contenedor) {
    contenedor.innerHTML = "";
    for (let i = 1; i <= cantidad; i++) {
        const fila = document.createElement("div");
        fila.className = "color-item";
        fila.innerHTML = `
            <input type="color" value="#b673fa" aria-label="Color ${i}">
            <input type="text" placeholder="Nombre del color ${i}">
        `;
        contenedor.appendChild(fila);
    }
}
