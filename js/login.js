// Esperar a que el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar las pestañas
    inicializarTabs();
    
    // Inicializar toggle de contraseña
    inicializarTogglePassword();
    
    // Inicializar formularios
    inicializarFormularios();
});

// ===== PESTAÑAS DE LOGIN/REGISTRO =====
function inicializarTabs() {
    var tabLogin = document.getElementById('tab-login');
    var tabRegister = document.getElementById('tab-register');
    var loginForm = document.getElementById('login-form');
    var registerForm = document.getElementById('register-form');
    
    // Cambiar a pestaña de login
    tabLogin.addEventListener('click', function() {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });
    
    // Cambiar a pestaña de registro
    tabRegister.addEventListener('click', function() {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });
}

// ===== TOGGLE DE CONTRASEÑA =====
function inicializarTogglePassword() {
    var toggleLoginPass = document.getElementById('toggle-login-pass');
    var loginPassword = document.getElementById('login-password');
    
    var toggleRegisterPass = document.getElementById('toggle-register-pass');
    var registerPassword = document.getElementById('register-password');
    
    // Toggle para login
    if (toggleLoginPass && loginPassword) {
        toggleLoginPass.addEventListener('click', function() {
            togglePasswordVisibility(loginPassword, toggleLoginPass);
        });
    }
    
    // Toggle para registro
    if (toggleRegisterPass && registerPassword) {
        toggleRegisterPass.addEventListener('click', function() {
            togglePasswordVisibility(registerPassword, toggleRegisterPass);
        });
    }
}

// Función para cambiar visibilidad de contraseña
function togglePasswordVisibility(inputElement, buttonElement) {
    var icono = buttonElement.querySelector('i');
    
    if (inputElement.type === 'password') {
        inputElement.type = 'text';
        icono.classList.remove('fa-eye');
        icono.classList.add('fa-eye-slash');
    } else {
        inputElement.type = 'password';
        icono.classList.remove('fa-eye-slash');
        icono.classList.add('fa-eye');
    }
}

// ===== FORMULARIOS =====
function inicializarFormularios() {
    var loginFormElement = document.getElementById('loginFormElement');
    var registerFormElement = document.getElementById('registerFormElement');
    
    // Formulario de login
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', function(evento) {
            evento.preventDefault();
            procesarLogin();
        });
    }
    
    // Formulario de registro
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', function(evento) {
            evento.preventDefault();
            procesarRegistro();
        });
    }
}

// Procesar inicio de sesión
function procesarLogin() {
    var email = document.getElementById('login-email').value;
    var password = document.getElementById('login-password').value;
    var recordar = document.getElementById('remember-me').checked;
    
    // Validar campos vacíos
    if (email === '' || password === '') {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    // Validar formato de email
    if (!validarEmail(email)) {
        alert('Por favor, ingresa un correo electrónico válido');
        return;
    }
    
    // Obtener usuarios registrados
    var usuarios = obtenerUsuarios();
    
    // Buscar el usuario
    var usuarioEncontrado = null;
    for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].email === email && usuarios[i].password === password) {
            usuarioEncontrado = usuarios[i];
            break;
        }
    }
    
    // Verificar si se encontró el usuario
    if (usuarioEncontrado) {
        // Guardar sesión
        if (recordar) {
            localStorage.setItem('sesionActiva', JSON.stringify(usuarioEncontrado));
        } else {
            sessionStorage.setItem('sesionActiva', JSON.stringify(usuarioEncontrado));
        }
        
        // Separar nombre y apellido
        var nombreParts = usuarioEncontrado.nombre.trim().split(' ');
        var primerNombre = nombreParts[0] || 'Usuario';
        var apellido = nombreParts.slice(1).join(' ') || '';
        
        // Actualizar perfil con los datos del usuario (incluyendo campos adicionales si existen)
        var perfil = {
            nombre: primerNombre,
            apellido: apellido,
            email: usuarioEncontrado.email,
            telefono: usuarioEncontrado.telefono || '+502 0000-0000',
            direccion: usuarioEncontrado.direccion || '',
            fechaNacimiento: usuarioEncontrado.fechaNacimiento || '',
            ocupacion: usuarioEncontrado.ocupacion || '',
            biografia: '',
            avatar: null
        };
        localStorage.setItem('perfil', JSON.stringify(perfil));
        
        // Redirigir a contactos
        window.location.href = 'contactos.html';
    } else {
        alert('Correo o contraseña incorrectos');
    }
}
