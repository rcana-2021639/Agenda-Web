
// Esperar a que el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la navegación móvil
    inicializarMenuMovil();
    
    // Cargar datos iniciales si no existen
    cargarDatosIniciales();
});

// ===== NAVEGACIÓN MÓVIL =====
function inicializarMenuMovil() {
    var menuToggle = document.getElementById('menu-toggle');
    var sidebar = document.getElementById('sidebar');
    var sidebarOverlay = document.getElementById('sidebar-overlay');
    var closeSidebar = document.getElementById('close-sidebar');
    
    // Verificar que los elementos existan
    if (!menuToggle || !sidebar) {
        return;
    }
    
    // Abrir menú
    menuToggle.addEventListener('click', function() {
        sidebar.classList.add('active');
        if (sidebarOverlay) {
            sidebarOverlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    });
    
    // Cerrar menú con el botón X
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function() {
            cerrarMenu();
        });
    }
    
    // Cerrar menú al hacer clic en el overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            cerrarMenu();
        });
    }
    
    // Función para cerrar el menú
    function cerrarMenu() {
        sidebar.classList.remove('active');
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
}

// ===== DATOS INICIALES =====
function cargarDatosIniciales() {
    // Verificar si ya hay contactos guardados
    var contactosGuardados = localStorage.getItem('contactos');
    
    // Si no hay contactos, crear los contactos iniciales
    if (!contactosGuardados) {
        var contactosIniciales = [
            {
                id: 1,
                nombre: 'María García López',
                telefono: '+502 5555-1234',
                email: 'maria.garcia@email.com',
                empresa: 'Tech Solutions',
                direccion: 'Zona 10, Guatemala',
                notas: 'Contacto de trabajo',
                favorito: true
            },
            {
                id: 2,
                nombre: 'Carlos Hernández',
                telefono: '+502 4444-5678',
                email: 'carlos.h@gmail.com',
                empresa: 'Marketing Digital',
                direccion: 'Zona 14, Guatemala',
                notas: 'Amigo de la universidad',
                favorito: true
            },
            {
                id: 3,
                nombre: 'Ana Martínez',
                telefono: '+502 3333-9012',
                email: 'ana.martinez@hotmail.com',
                empresa: 'Diseño Creativo',
                direccion: 'Zona 4, Guatemala',
                notas: 'Diseñadora freelance',
                favorito: false
            },
            {
                id: 4,
                nombre: 'Roberto Pérez',
                telefono: '+502 2222-3456',
                email: 'roberto.p@empresa.com',
                empresa: 'Construcciones S.A.',
                direccion: 'Mixco, Guatemala',
                notas: 'Cliente importante',
                favorito: false
            },
            {
                id: 5,
                nombre: 'Laura Rodríguez',
                telefono: '+502 1111-7890',
                email: 'laura.rod@gmail.com',
                empresa: 'Consultora ABC',
                direccion: 'Zona 9, Guatemala',
                notas: 'Consultora de negocios',
                favorito: true
            },
            {
                id: 6,
                nombre: 'José López Mejía',
                telefono: '+502 6666-1122',
                email: 'jose.lopez@trabajo.com',
                empresa: 'Banco Nacional',
                direccion: 'Zona 1, Guatemala',
                notas: 'Asesor financiero',
                favorito: false
            }
        ];
        
        // Guardar en localStorage
        localStorage.setItem('contactos', JSON.stringify(contactosIniciales));
    }
    
    // Verificar si ya hay tareas guardadas
    var tareasGuardadas = localStorage.getItem('tareas');
    
    // Si no hay tareas, crear las tareas iniciales
    if (!tareasGuardadas) {
        var tareasIniciales = [
            {
                id: 1,
                titulo: 'Revisar propuesta de proyecto',
                descripcion: 'Analizar la propuesta enviada por el cliente y preparar respuesta',
                prioridad: 'high',
                fecha: obtenerFechaFutura(2),
                completada: false
            },
            {
                id: 2,
                titulo: 'Reunión con equipo de diseño',
                descripcion: 'Discutir los nuevos mockups para la aplicación móvil',
                prioridad: 'medium',
                fecha: obtenerFechaFutura(1),
                completada: false
            },
            {
                id: 3,
                titulo: 'Actualizar documentación',
                descripcion: 'Actualizar la documentación del proyecto con los últimos cambios',
                prioridad: 'low',
                fecha: obtenerFechaFutura(5),
                completada: true
            },
            {
                id: 4,
                titulo: 'Llamar al proveedor',
                descripcion: 'Consultar sobre los precios de los nuevos servicios',
                prioridad: 'high',
                fecha: obtenerFechaFutura(0),
                completada: false
            }
        ];
        
        // Guardar en localStorage
        localStorage.setItem('tareas', JSON.stringify(tareasIniciales));
    }
    
    // Verificar si ya hay perfil guardado
    var perfilGuardado = localStorage.getItem('perfil');
    
    // Si no hay perfil, crear uno por defecto
    if (!perfilGuardado) {
        var perfilInicial = {
            nombre: 'Juan',
            apellido: 'Pérez',
            email: 'admin@agendapro.com',
            telefono: '+502 1234-5678',
            direccion: 'Guatemala City, Guatemala',
            fechaNacimiento: '1995-05-15',
            ocupacion: 'Desarrollador de Software',
            biografia: 'Apasionado por la tecnología y el desarrollo de aplicaciones.',
            avatar: null
        };
        
        // Guardar en localStorage
        localStorage.setItem('perfil', JSON.stringify(perfilInicial));
    }
}

// Función para obtener una fecha futura
function obtenerFechaFutura(dias) {
    var fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    
    var año = fecha.getFullYear();
    var mes = String(fecha.getMonth() + 1).padStart(2, '0');
    var dia = String(fecha.getDate()).padStart(2, '0');
    
    return año + '-' + mes + '-' + dia;
}

// ===== FUNCIONES DE UTILIDAD =====

// Obtener las iniciales de un nombre
function obtenerIniciales(nombre) {
    if (!nombre) return '?';
    
    var palabras = nombre.trim().split(' ');
    var iniciales = '';
    
    if (palabras.length >= 2) {
        iniciales = palabras[0].charAt(0) + palabras[1].charAt(0);
    } else {
        iniciales = palabras[0].charAt(0);
    }
    
    return iniciales.toUpperCase();
}

// Formatear fecha para mostrar
function formatearFecha(fechaString) {
    if (!fechaString) return 'Sin fecha';
    
    var fecha = new Date(fechaString + 'T00:00:00');
    var opciones = { day: 'numeric', month: 'short', year: 'numeric' };
    
    return fecha.toLocaleDateString('es-ES', opciones);
}

// Verificar si una fecha ya pasó
function fechaPasada(fechaString) {
    if (!fechaString) return false;
    
    var hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    var fecha = new Date(fechaString + 'T00:00:00');
    
    return fecha < hoy;
}

// Generar un ID único
function generarId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// Mostrar notificación toast
function mostrarToast(mensaje) {
    var toast = document.getElementById('toast');
    var toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
        toastMessage.textContent = mensaje;
        toast.classList.add('active');
        
        // Ocultar después de 3 segundos
        setTimeout(function() {
            toast.classList.remove('active');
        }, 3000);
    }
}
