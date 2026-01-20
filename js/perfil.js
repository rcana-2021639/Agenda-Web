
// Esperar a que el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del perfil
    cargarPerfil();
    
    // Inicializar formulario
    inicializarFormularioPerfil();
    
    // Inicializar carga de avatar
    inicializarAvatar();
    
    // Inicializar configuraciones
    inicializarConfiguraciones();
    
    // Cargar estadísticas
    cargarEstadisticasPerfil();
});

// ===== CARGAR PERFIL =====
function cargarPerfil() {
    var perfil = obtenerPerfil();
    
    // Actualizar display de nombre y email
    var nombreCompleto = '';
    if (perfil.nombre) {
        nombreCompleto = perfil.nombre;
        if (perfil.apellido) {
            nombreCompleto += ' ' + perfil.apellido;
        }
    }
    
    document.getElementById('display-name').textContent = nombreCompleto || 'Usuario';
    document.getElementById('display-email').textContent = perfil.email || 'usuario@correo.com';
    
    // Llenar formulario
    document.getElementById('profile-firstname').value = perfil.nombre || '';
    document.getElementById('profile-lastname').value = perfil.apellido || '';
    document.getElementById('profile-email-input').value = perfil.email || '';
    document.getElementById('profile-phone').value = perfil.telefono || '';
    document.getElementById('profile-address').value = perfil.direccion || '';
    document.getElementById('profile-birthdate').value = perfil.fechaNacimiento || '';
    document.getElementById('profile-occupation').value = perfil.ocupacion || '';
    document.getElementById('profile-bio').value = perfil.biografia || '';
    
    // Cargar avatar
    if (perfil.avatar) {
        document.getElementById('profile-avatar').src = perfil.avatar;
    }
}

// Obtener perfil del localStorage
function obtenerPerfil() {
    var perfilGuardado = localStorage.getItem('perfil');
    
    if (perfilGuardado) {
        return JSON.parse(perfilGuardado);
    }
    
    return {
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        fechaNacimiento: '',
        ocupacion: '',
        biografia: '',
        avatar: null
    };
}

// Guardar perfil en localStorage
function guardarPerfil(perfil) {
    localStorage.setItem('perfil', JSON.stringify(perfil));
}

// Cargar estadísticas del perfil
function cargarEstadisticasPerfil() {
    // Contar contactos
    var contactos = localStorage.getItem('contactos');
    var totalContactos = 0;
    var totalFavoritos = 0;
    
    if (contactos) {
        var listaContactos = JSON.parse(contactos);
        totalContactos = listaContactos.length;
        
        for (var i = 0; i < listaContactos.length; i++) {
            if (listaContactos[i].favorito) {
                totalFavoritos++;
            }
        }
    }
    
    // Contar tareas
    var tareas = localStorage.getItem('tareas');
    var totalTareas = 0;
    
    if (tareas) {
        totalTareas = JSON.parse(tareas).length;
    }
    
    // Actualizar UI
    document.getElementById('profile-contacts').textContent = totalContactos;
    document.getElementById('profile-favorites').textContent = totalFavoritos;
    document.getElementById('profile-tasks').textContent = totalTareas;
}

// ===== FORMULARIO DE PERFIL =====
function inicializarFormularioPerfil() {
    var formulario = document.getElementById('profile-form');
    var btnRestaurar = document.getElementById('reset-profile');
    
    // Guardar cambios
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        guardarCambiosPerfil();
    });
    
    // Restaurar valores originales
    btnRestaurar.addEventListener('click', function() {
        cargarPerfil();
        mostrarToast('Valores restaurados');
    });
}

// Guardar cambios del perfil
function guardarCambiosPerfil() {
    var perfil = obtenerPerfil();
    
    // Obtener valores del formulario
    perfil.nombre = document.getElementById('profile-firstname').value;
    perfil.apellido = document.getElementById('profile-lastname').value;
    perfil.email = document.getElementById('profile-email-input').value;
    perfil.telefono = document.getElementById('profile-phone').value;
    perfil.direccion = document.getElementById('profile-address').value;
    perfil.fechaNacimiento = document.getElementById('profile-birthdate').value;
    perfil.ocupacion = document.getElementById('profile-occupation').value;
    perfil.biografia = document.getElementById('profile-bio').value;
    
    // Guardar
    guardarPerfil(perfil);
    
    // Actualizar displays
    var nombreCompleto = '';
    if (perfil.nombre) {
        nombreCompleto = perfil.nombre;
        if (perfil.apellido) {
            nombreCompleto += ' ' + perfil.apellido;
        }
    }
    
    document.getElementById('display-name').textContent = nombreCompleto || 'Usuario';
    document.getElementById('display-email').textContent = perfil.email || 'usuario@correo.com';
    
    // Mostrar notificación
    mostrarToast('Perfil actualizado correctamente');
}

// ===== AVATAR =====
function inicializarAvatar() {
    var inputAvatar = document.getElementById('avatar-input');
    
    inputAvatar.addEventListener('change', function(e) {
        var archivo = e.target.files[0];
        
        if (!archivo) return;
        
        // Validar que sea una imagen
        if (!archivo.type.match('image.*')) {
            alert('Por favor, selecciona una imagen válida');
            return;
        }
        
        // Validar tamaño (máximo 2MB)
        if (archivo.size > 2 * 1024 * 1024) {
            alert('La imagen es muy grande. Máximo 2MB.');
            return;
        }
        
        // Leer el archivo
        var lector = new FileReader();
        
        lector.onload = function(evento) {
            var imagenBase64 = evento.target.result;
            
            // Actualizar imagen en la página
            document.getElementById('profile-avatar').src = imagenBase64;
            
            // Guardar en el perfil
            var perfil = obtenerPerfil();
            perfil.avatar = imagenBase64;
            guardarPerfil(perfil);
            
            // Mostrar notificación
            mostrarToast('Foto de perfil actualizada');
        };
        
        lector.readAsDataURL(archivo);
    });
}

// ===== CONFIGURACIONES =====
function inicializarConfiguraciones() {
    // Cargar configuraciones guardadas
    var configuraciones = obtenerConfiguraciones();
    
    var checkNotificaciones = document.getElementById('setting-notifications');
    var checkDarkmode = document.getElementById('setting-darkmode');
    var checkPrivacidad = document.getElementById('setting-privacy');
    
    // Establecer valores
    checkNotificaciones.checked = configuraciones.notificaciones;
    checkDarkmode.checked = configuraciones.modoOscuro;
    checkPrivacidad.checked = configuraciones.privacidad;
    
    // Aplicar modo oscuro si está activo
    if (configuraciones.modoOscuro) {
        document.body.classList.add('dark-mode');
    }
    
    // Eventos de cambio
    checkNotificaciones.addEventListener('change', function() {
        configuraciones.notificaciones = this.checked;
        guardarConfiguraciones(configuraciones);
        mostrarToast('Configuración actualizada');
    });
    
    checkDarkmode.addEventListener('change', function() {
        configuraciones.modoOscuro = this.checked;
        guardarConfiguraciones(configuraciones);
        
        if (this.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        mostrarToast('Configuración actualizada');
    });
    
    checkPrivacidad.addEventListener('change', function() {
        configuraciones.privacidad = this.checked;
        guardarConfiguraciones(configuraciones);
        mostrarToast('Configuración actualizada');
    });
}

// Obtener configuraciones
function obtenerConfiguraciones() {
    var configuracionesGuardadas = localStorage.getItem('configuraciones');
    
    if (configuracionesGuardadas) {
        return JSON.parse(configuracionesGuardadas);
    }
    
    return {
        notificaciones: true,
        modoOscuro: false,
        privacidad: true
    };
}

// Guardar configuraciones
function guardarConfiguraciones(configuraciones) {
    localStorage.setItem('configuraciones', JSON.stringify(configuraciones));
}

// Función para mostrar toast
function mostrarToast(mensaje) {
    // Implementación de mostrar toast
    alert(mensaje); // Simplificación para el ejemplo
}
