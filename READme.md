## Coco Boutique
Tienda virtual de ropa hecha solo con HTML5, CSS y JavaScript. 

Tiene una parte comercial pública (catálogo con contacto por WhatsApp) y una parte administrativa (login, dashboard, gestión de productos y ventas).

## Acceso administrador (demostrativo)
Usuario: `admin`
Contraseña: `coco2026`
Las credenciales están fijas en `js/login.js` porque el proyecto no tiene
backend. Cuando conectes un servidor real, reemplaza `validarCredenciales()`
por una llamada a una API.

## Cómo funcionan los datos
El proyecto no usa una base de datos real: usa `localStorage` del navegador como almacenamiento, a través de las funciones del archivo `js/main.js` (objeto `COCO`). Esto significa que los datos que registres (productos y ventas) se guardan en tu navegador y persisten entre páginas, pero no se comparten entre dispositivos ni navegadores distintos.
`cocoProductos`: array de productos.
`cocoVentas`: array de ventas (cada fila de la tabla es un registro).
`cocoSesionAdmin`: bandera de sesión activa (se borra al cerrar sesión).
Las carpetas `data/productos.json` y `data/ventas.json` son solo de referencia — muestran la forma de los datos y sirven de documentación para cuando migres esto a un backend real (Node, PHP, Firebase, etc.). El sitio no los lee directamente para evitar problemas de CORS al abrir los archivos sin servidor.


## Estructura de archivos
```
Coco Boutique/
├── index.html                 Seccion publica
├── login.html                 Login administrativo
├── dashboard.html             Panel principal con estadísticas
├── productos.html             Gestión / listado de productos
├── registrar-producto.html    Formulario para nuevo producto
├── ventas.html                Gestión / listado de ventas
├── registrar-venta.html       Formulario para nueva venta
├── catalogo.html              Catálogo público (clientes)
├── css/
│   ├── style.css              Tokens de color, reset, botones (base de TODO)
│   ├── sidebar.css            Sidebar administrativo compartido
│   ├── tablas.css             Tarjetas de stats + tablas compartidas
│   ├── formularios.css        Estilos de formularios compartidos
│   ├── login.css
│   ├── dashboard.css
│   ├── productos.css
│   ├── registrar-productos.css
│   ├── ventas.css
│   ├── registrar-venta.css
│   └── catalogo.css           Tienda pública / landing
├── js/
│   ├── main.js                Almacenamiento (localStorage), formatos, sesión
│   ├── login.js
│   ├── dashboard.js
│   ├── productos.js
│   ├── registrar-producto.js
│   ├── ventas.js
│   ├── registrar-venta.js
│   └── catalogo.js
├── data/
│   ├── productos.json          Datos de referencia
│   └── ventas.json
└── imagenes/
    ├── logo/                   (el logo actual es texto, no requiere imagen)
    ├── productos/               Agrega aquí las fotos reales de tus prendas
    └── iconos/                  (WhatsApp/Facebook/TikTok van como SVG inline)
```
> Nota sobre los CSS compartidos: además de los archivos que pedía la estructura original, se agregaron `sidebar.css`, `tablas.css` y `formularios.css` para no repetir el mismo código en cada página. Cada  HTML enlaza `style.css` primero, luego los parciales compartidos que necesita, y al final su propio CSS específico.
Próximos pasos sugeridos
Sube fotos reales de las prendas: al registrar un producto en `registrar-producto.html` puedes subir una imagen y se guarda automáticamente (como base64) en el navegador. Cuando quieras usuarios reales, tallas por color/stock detallado o pedidoscompartidos entre dispositivos, vas a necesitar un backend.