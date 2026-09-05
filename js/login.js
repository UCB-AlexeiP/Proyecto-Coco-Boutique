document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-login");
    const mensajeError = document.getElementById("login-error");

    const USUARIO_DEMO = "admin";
    const PASSWORD_DEMO = "coco2026";

    function validarCredenciales(usuario, password) {
        return usuario.trim() === USUARIO_DEMO && password === PASSWORD_DEMO;
    }

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const usuario = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (validarCredenciales(usuario, password)) {
            mensajeError.classList.remove("visible");
            COCO.iniciarSesion();
            window.location.href = "dashboard.html";
        } else {
            mensajeError.textContent = "Usuario o contraseña incorrectos.";
            mensajeError.classList.add("visible");
        }
    });
});
