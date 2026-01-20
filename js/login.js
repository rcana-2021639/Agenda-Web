
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

// Procesar registro
function procesarRegistro() {
    var nombre = document.getElementById('register-name').value;
    var email = document.getElementById('register-email').value;
    var telefono = document.getElementById('register-phone').value;
    var direccion = document.getElementById('register-address').value || '';
    var fechaNacimiento = document.getElementById('register-birthdate').value || '';
    var ocupacion = document.getElementById('register-occupation').value || '';
    var password = document.getElementById('register-password').value;
    var confirmarPassword = document.getElementById('register-confirm').value;
    
    // Validar campos obligatorios
    if (nombre === '' || email === '' || telefono === '' || password === '' || confirmarPassword === '') {
        alert('Por favor, completa los campos obligatorios');
        return;
    }
    
    // Validar formato de email
    if (!validarEmail(email)) {
        alert('Por favor, ingresa un correo electrónico válido');
        return;
    }
    
    // Validar que las contraseñas coincidan
    if (password !== confirmarPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    // Validar longitud de contraseña
    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    // Obtener usuarios existentes
    var usuarios = obtenerUsuarios();
    
    // Verificar si el email ya está registrado
    for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].email === email) {
            alert('Este correo electrónico ya está registrado');
            return;
        }
    }
    
    // Crear nuevo usuario con todos los datos
    var nuevoUsuario = {
        id: Date.now(),
        nombre: nombre,
        email: email,
        telefono: telefono,
        direccion: direccion,
        fechaNacimiento: fechaNacimiento,
        ocupacion: ocupacion,
        password: password
    };
    
    // Agregar a la lista de usuarios
    usuarios.push(nuevoUsuario);
    
    // Guardar usuarios
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    // Separar nombre y apellido
    var nombreParts = nombre.trim().split(' ');
    var primerNombre = nombreParts[0] || '';
    var apellido = nombreParts.slice(1).join(' ') || '';
    
    // Crear y guardar perfil inicial con todos los datos
    var perfilInicial = {
        nombre: primerNombre,
        apellido: apellido,
        email: email,
        telefono: telefono,
        direccion: direccion,
        fechaNacimiento: fechaNacimiento,
        ocupacion: ocupacion,
        biografia: '',
        avatar: null
    };
    localStorage.setItem('perfil', JSON.stringify(perfilInicial));
    
    // Mostrar mensaje de éxito
    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
    
    // Cambiar a la pestaña de login
    document.getElementById('tab-login').click();
    
    // Limpiar formulario de registro
    document.getElementById('registerFormElement').reset();
    
    // Prellenar el email en el login
    document.getElementById('login-email').value = email;
}

// Obtener lista de usuarios
function obtenerUsuarios() {
    var usuariosGuardados = localStorage.getItem('usuarios');
    
    if (usuariosGuardados) {
        return JSON.parse(usuariosGuardados);
    }
    
    // Si no hay usuarios, crear el usuario demo
    var usuariosIniciales = [
        {
            id: 1,
            nombre: 'Admin Demo',
            email: 'admin@agendapro.com',
            telefono: '+502 1234-5678',
            password: '123456'
        }
    ];
    
    localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales));
    
    return usuariosIniciales;
}

// Validar formato de email
function validarEmail(email) {
    var patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patron.test(email);
}
