// Variables globales
var vistaActualFav = 'grid';

// Función para obtener iniciales del nombre
function obtenerIniciales(nombre) {
    if (!nombre || typeof nombre !== 'string') {
        return '?';
    }
    var nombres = nombre.trim().split(' ');
    var iniciales = '';
    for (var i = 0; i < nombres.length && i < 2; i++) {
        if (nombres[i]) {
            iniciales += nombres[i][0].toUpperCase();
        }
    }
    return iniciales || '?';
}

// Esperar a que el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar favoritos
    cargarFavoritos();
    
    // Inicializar búsqueda
    inicializarBusquedaFavoritos();
    
    // Inicializar cambio de vista
    inicializarVistaFavoritos();
    
    // Inicializar modal de detalles
    inicializarModalDetallesFav();
});

// ===== CARGAR FAVORITOS =====
function cargarFavoritos() {
    var contactos = obtenerContactosFavoritos();
    var contenedor = document.getElementById('favorites-container');
    var contadorFav = document.getElementById('favorites-count');
    var estadoVacio = document.getElementById('empty-favorites');
    
    // Filtrar solo favoritos
    var favoritos = [];
    for (var i = 0; i < contactos.length; i++) {
        if (contactos[i].favorito) {
            favoritos.push(contactos[i]);
        }
    }
    
    // Actualizar contador
    contadorFav.textContent = favoritos.length;
    
    // Limpiar contenedor
    contenedor.innerHTML = '';
    
    // Mostrar estado vacío si no hay favoritos
    if (favoritos.length === 0) {
        contenedor.classList.add('hidden');
        estadoVacio.classList.remove('hidden');
        return;
    }
    
    contenedor.classList.remove('hidden');
    estadoVacio.classList.add('hidden');
    
    // Mostrar cada favorito
    for (var j = 0; j < favoritos.length; j++) {
        var contacto = favoritos[j];
        var tarjeta = crearTarjetaFavorito(contacto);
        contenedor.appendChild(tarjeta);
    }
}

// Obtener contactos del localStorage
function obtenerContactosFavoritos() {
    var contactosGuardados = localStorage.getItem('contactos');
    
    if (contactosGuardados) {
        return JSON.parse(contactosGuardados);
    }
    
    return [];
}

// Guardar contactos en localStorage
function guardarContactosFavoritos(contactos) {
    localStorage.setItem('contactos', JSON.stringify(contactos));
}

// Crear tarjeta de favorito
function crearTarjetaFavorito(contacto) {
    var tarjeta = document.createElement('div');
    tarjeta.className = 'contact-card';
    tarjeta.setAttribute('data-id', contacto.id);
    
    var iniciales = obtenerIniciales(contacto.nombre);
    
    tarjeta.innerHTML = 
        '<div class="contact-header">' +
            '<div class="contact-avatar">' + iniciales + '</div>' +
            '<div class="contact-info">' +
                '<h3>' + contacto.nombre + '</h3>' +
                '<p>' + (contacto.empresa || 'Sin empresa') + '</p>' +
            '</div>' +
        '</div>' +
        '<div class="contact-details">' +
            '<div class="contact-detail">' +
                '<i class="fas fa-phone"></i>' +
                '<span>' + contacto.telefono + '</span>' +
            '</div>' +
            '<div class="contact-detail">' +
                '<i class="fas fa-envelope"></i>' +
                '<span>' + (contacto.email || 'Sin correo') + '</span>' +
            '</div>' +
        '</div>' +
        '<div class="contact-actions">' +
            '<button class="contact-action-btn ver-detalle" title="Ver detalles">' +
                '<i class="fas fa-eye"></i>' +
            '</button>' +
            '<button class="contact-action-btn favorite active" title="Quitar de favoritos">' +
                '<i class="fas fa-star"></i>' +
            '</button>' +
        '</div>';
    
    // Agregar eventos a los botones
    var btnVerDetalle = tarjeta.querySelector('.ver-detalle');
    var btnFavorito = tarjeta.querySelector('.favorite');
    
    btnVerDetalle.addEventListener('click', function(e) {
        e.stopPropagation();
        mostrarDetalleFavorito(contacto.id);
    });
    
    btnFavorito.addEventListener('click', function(e) {
        e.stopPropagation();
        quitarDeFavoritos(contacto.id);
    });
    
    // Hacer clic en la tarjeta muestra detalles
    tarjeta.addEventListener('click', function() {
        mostrarDetalleFavorito(contacto.id);
    });
    
    return tarjeta;
}

// Quitar de favoritos
function quitarDeFavoritos(id) {
    var contactos = obtenerContactosFavoritos();
    
    for (var i = 0; i < contactos.length; i++) {
        if (contactos[i].id === id) {
            contactos[i].favorito = false;
            break;
        }
    }
    
    guardarContactosFavoritos(contactos);
    cargarFavoritos();
}
