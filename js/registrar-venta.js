document.addEventListener("DOMContentLoaded", () => {
    COCO.protegerPagina();

    const productos = COCO.obtenerProductos();
    const cantidadInput = document.getElementById("cantidad-productos-vendidos");
    const listaFilas = document.getElementById("productos-vendidos-lista");
    const selectEstado = document.getElementById("estado-venta");
    const campoReserva = document.getElementById("campo-valor-reserva");
    const totalGeneralSpan = document.getElementById("total-general-venta");
    const formulario = document.getElementById("form-registrar-venta");
    const fechaInput = document.getElementById("fecha-venta");

    fechaInput.value = new Date().toISOString().slice(0, 10);

    cantidadInput.addEventListener("input", () => {
        generarFilasProductos(Number(cantidadInput.value) || 0, listaFilas, productos);
        actualizarTotalGeneral(listaFilas, totalGeneralSpan);
    });

    listaFilas.addEventListener("input", () => actualizarTotalGeneral(listaFilas, totalGeneralSpan));
    listaFilas.addEventListener("change", (evento) => {
        if (evento.target.classList.contains("select-producto")) {
            autocompletarPrecio(evento.target, productos);
            actualizarTotalGeneral(listaFilas, totalGeneralSpan);
        }
    });

    selectEstado.addEventListener("change", () => {
        const requiereReserva = selectEstado.value === "Reserva con adelanto" || selectEstado.value === "Reserva sin adelanto";
        campoReserva.classList.toggle("visible", requiereReserva);
    });

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const filas = Array.from(listaFilas.querySelectorAll(".producto-vendido-fila"));
        if (filas.length === 0) {
            COCO.mostrarToast("Agrega al menos un producto vendido");
            return;
        }

        const cliente = document.getElementById("cliente-venta").value.trim();
        const fecha = fechaInput.value;
        const metodoPago = document.getElementById("metodo-pago").value;
        const estado = selectEstado.value;
        const valorReserva = campoReserva.classList.contains("visible")
            ? Number(document.getElementById("valor-reserva").value) || 0
            : 0;
        const observacion = document.getElementById("observacion-venta").value.trim();

        const nuevasFilas = filas.map((fila) => {
            const select = fila.querySelector(".select-producto");
            const producto = productos.find((p) => p.id === select.value);
            const cantidad = Number(fila.querySelector(".input-cantidad").value) || 0;
            const precioUnitario = Number(fila.querySelector(".input-precio-unitario").value) || 0;

            return {
                fecha,
                cliente,
                idProducto: producto ? producto.id : "",
                producto: producto ? producto.nombre : "",
                cantidad,
                precioUnitario,
                total: cantidad * precioUnitario,
                metodoPago,
                estado,
                valorReserva,
                observacion
            };
        });

        COCO.agregarVentas(nuevasFilas);
        COCO.mostrarToast("Venta registrada con éxito");
        formulario.reset();
        listaFilas.innerHTML = "";
        campoReserva.classList.remove("visible");
        totalGeneralSpan.textContent = "0 Bs";

        setTimeout(() => {
            window.location.href = "ventas.html";
        }, 900);
    });
});

function generarFilasProductos(cantidad, contenedor, productos) {
    contenedor.innerHTML = "";
    const opciones = productos.map((p) => `<option value="${p.id}">${p.nombre}</option>`).join("");

    for (let i = 1; i <= cantidad; i++) {
        const fila = document.createElement("div");
        fila.className = "producto-vendido-fila";
        fila.innerHTML = `
            <div class="campo">
                <label>Producto ${i}</label>
                <select class="select-producto">
                    <option value="" disabled selected>Selecciona un producto</option>
                    ${opciones}
                </select>
            </div>
            <div class="campo">
                <label>Cantidad</label>
                <input type="number" class="input-cantidad" min="1" value="1">
            </div>
            <div class="campo">
                <label>Precio unitario (Bs)</label>
                <input type="number" class="input-precio-unitario" min="0" step="0.01">
            </div>
            <div></div>
            <p class="producto-subtotal">Subtotal: 0 Bs</p>
        `;
        contenedor.appendChild(fila);
    }
}

function autocompletarPrecio(select, productos) {
    const fila = select.closest(".producto-vendido-fila");
    const producto = productos.find((p) => p.id === select.value);
    if (producto) {
        fila.querySelector(".input-precio-unitario").value = producto.precio;
    }
}

function actualizarTotalGeneral(contenedor, totalGeneralSpan) {
    let totalGeneral = 0;

    contenedor.querySelectorAll(".producto-vendido-fila").forEach((fila) => {
        const cantidad = Number(fila.querySelector(".input-cantidad").value) || 0;
        const precio = Number(fila.querySelector(".input-precio-unitario").value) || 0;
        const subtotal = cantidad * precio;
        fila.querySelector(".producto-subtotal").textContent = `Subtotal: ${subtotal.toLocaleString("es-BO")} Bs`;
        totalGeneral += subtotal;
    });

    totalGeneralSpan.textContent = `${totalGeneral.toLocaleString("es-BO")} Bs`;
}
