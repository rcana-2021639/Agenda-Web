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

