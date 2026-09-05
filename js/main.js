const COCO = (() => {

    const CLAVE_PRODUCTOS = "cocoProductos";
    const CLAVE_VENTAS = "cocoVentas";
    const CLAVE_SESION = "cocoSesionAdmin";

    const productosSemilla = [
        {
            id: "P001",
            nombre: "Vestido de verano",
            categoria: "vestidos",
            precio: 100,
            stock: 8,
            tallas: ["S", "M", "L"],
            colores: ["Durazno", "Blanco"],
            descripcion: "Vestido ligero de algodón, ideal para el día a día.",
            imagen: "imagenes/productos/P001.jpg"
        },
        {
            id: "P002",
            nombre: "Camisa de manga larga",
            categoria: "blusas",
            precio: 100,
            stock: 5,
            tallas: ["M", "L", "XL"],
            colores: ["Lila"],
            descripcion: "Camisa fresca de manga larga, corte holgado.",
            imagen: "imagenes/productos/P002.jpg"
        },
        {
            id: "P003",
            nombre: "Chompa tejida oversize",
            categoria: "chompas",
            precio: 150,
            stock: 6,
            tallas: ["S", "M", "L", "XL"],
            colores: ["Beige", "Lila"],
            descripcion: "Chompa tejida de punto grueso, calidez y estilo.",
            imagen: "imagenes/productos/P003.jpg"
        },
        {
            id: "P004",
            nombre: "Jean mom fit",
            categoria: "jeans",
            precio: 180,
            stock: 10,
            tallas: ["S", "M", "L"],
            colores: ["Azul clásico"],
            descripcion: "Jean de tiro alto, silueta cómoda y versátil.",
            imagen: "imagenes/productos/P004.jpg"
        }
    ];

    const ventasSemilla = [
        { id: "V0001", fecha: fechaHoyISO(-3), cliente: "María Torrez", idProducto: "P001", producto: "Vestido de verano", cantidad: 2, precioUnitario: 100, total: 200, metodoPago: "Qr", estado: "Completado", valorReserva: 0, observacion: "" },
        { id: "V0002", fecha: fechaHoyISO(-1), cliente: "Ana Quiroga", idProducto: "P002", producto: "Camisa de manga larga", cantidad: 1, precioUnitario: 100, total: 100, metodoPago: "Efectivo", estado: "Reserva sin adelanto", valorReserva: 0, observacion: "Retira el viernes" }
    ];

    function fechaHoyISO(offsetDias = 0) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + offsetDias);
        return fecha.toISOString().slice(0, 10);
    }

    function obtenerProductos() {
        const guardados = localStorage.getItem(CLAVE_PRODUCTOS);
        if (guardados === null) {
            localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productosSemilla));
            return [...productosSemilla];
        }
        try {
            return JSON.parse(guardados);
        } catch {
            return [];
        }
    }

    function guardarProductos(productos) {
        localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
    }

    function agregarProducto(producto) {
        const productos = obtenerProductos();
        producto.id = generarId("P", productos);
        productos.push(producto);
        guardarProductos(productos);
        return producto;
    }

    function eliminarProducto(id) {
        const productos = obtenerProductos().filter((p) => p.id !== id);
        guardarProductos(productos);
    }

    /* ---------- Ventas ---------- */

    function obtenerVentas() {
        const guardadas = localStorage.getItem(CLAVE_VENTAS);
        if (guardadas === null) {
            localStorage.setItem(CLAVE_VENTAS, JSON.stringify(ventasSemilla));
            return [...ventasSemilla];
        }
        try {
            return JSON.parse(guardadas);
        } catch {
            return [];
        }
    }

    function guardarVentas(ventas) {
        localStorage.setItem(CLAVE_VENTAS, JSON.stringify(ventas));
    }

    function agregarVentas(nuevasFilas) {
        const ventas = obtenerVentas();
        nuevasFilas.forEach((fila) => {
            fila.id = generarId("V", ventas);
            ventas.push(fila);
        });
        guardarVentas(ventas);
        return ventas;
    }

    function eliminarVenta(id) {
        const ventas = obtenerVentas().filter((v) => v.id !== id);
        guardarVentas(ventas);
    }


    function generarId(prefijo, lista) {
        const numeros = lista
            .map((item) => item.id)
            .filter((id) => typeof id === "string" && id.startsWith(prefijo))
            .map((id) => parseInt(id.slice(prefijo.length), 10))
            .filter((n) => !isNaN(n));
        const siguiente = numeros.length > 0 ? Math.max(...numeros) + 1 : 1;
        return prefijo + String(siguiente).padStart(4, "0");
    }

    function formatearBs(numero) {
        const valor = Number(numero) || 0;
        return valor.toLocaleString("es-BO");
    }

    function formatearFecha(fechaISO) {
        const [anio, mes, dia] = fechaISO.split("-");
        return `${dia}/${mes}/${anio}`;
    }

    function claseBadgeEstado(estado) {
        if (estado === "Completado") return "badge-completado";
        if (estado === "Reserva con adelanto") return "badge-reserva-adelanto";
        return "badge-reserva-sin-adelanto";
    }

    function mostrarToast(mensaje) {
        let toast = document.querySelector(".toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.className = "toast";
            document.body.appendChild(toast);
        }
        toast.textContent = mensaje;
        toast.classList.add("is-visible");
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => toast.classList.remove("is-visible"), 2600);
    }

    function enlaceWhatsApp(numero, mensaje) {
        return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    }


    function iniciarSesion() {
        sessionStorage.setItem(CLAVE_SESION, "1");
    }

    function cerrarSesion() {
        sessionStorage.removeItem(CLAVE_SESION);
        window.location.href = "login.html";
    }

    function haySesionActiva() {
        return sessionStorage.getItem(CLAVE_SESION) === "1";
    }

    function protegerPagina() {
        if (!haySesionActiva()) {
            window.location.href = "login.html";
        }
    }

    return {
        obtenerProductos, guardarProductos, agregarProducto, eliminarProducto,
        obtenerVentas, guardarVentas, agregarVentas, eliminarVenta,
        formatearBs, formatearFecha, claseBadgeEstado, mostrarToast, enlaceWhatsApp,
        iniciarSesion, cerrarSesion, haySesionActiva, protegerPagina
    };
})();
