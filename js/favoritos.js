
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

// ===== MODAL DE DETALLES =====
function inicializarModalDetallesFav() {
    var modal = document.getElementById('detail-modal');
    var btnCerrar = document.getElementById('close-detail-modal');
    
    if (btnCerrar) {
        btnCerrar.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            cerrarModalDetallesFav();
        });
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarModalDetallesFav();
            }
        });
    }
}

// Función para cerrar el modal de detalles
function cerrarModalDetallesFav() {
    var modal = document.getElementById('detail-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.removeAttribute('style');
    }
}

// Mostrar detalle del favorito
function mostrarDetalleFavorito(id) {
    var contactos = obtenerContactosFavoritos();
    var contacto = null;
    
    for (var i = 0; i < contactos.length; i++) {
        if (contactos[i].id === id) {
            contacto = contactos[i];
            break;
        }
    }
    
    if (!contacto) return;
    
    var contenedor = document.getElementById('contact-detail-body');
    var iniciales = obtenerIniciales(contacto.nombre);
    
    contenedor.innerHTML = 
        '<div class="detail-header">' +
            '<div class="detail-avatar">' + iniciales + '</div>' +
            '<h2>' + contacto.nombre + '</h2>' +
            '<p>' + (contacto.empresa || 'Sin empresa') + '</p>' +
            '<div class="detail-favorite-badge"><i class="fas fa-star"></i> Favorito</div>' +
        '</div>' +
        '<div class="detail-list">' +
            '<div class="detail-item">' +
                '<div class="detail-item-icon"><i class="fas fa-phone"></i></div>' +
                '<div class="detail-item-content">' +
                    '<div class="detail-item-label">Teléfono</div>' +
                    '<div class="detail-item-value">' + contacto.telefono + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="detail-item">' +
                '<div class="detail-item-icon"><i class="fas fa-envelope"></i></div>' +
                '<div class="detail-item-content">' +
                    '<div class="detail-item-label">Correo electrónico</div>' +
                    '<div class="detail-item-value">' + (contacto.email || 'No especificado') + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="detail-item">' +
                '<div class="detail-item-icon"><i class="fas fa-building"></i></div>' +
                '<div class="detail-item-content">' +
                    '<div class="detail-item-label">Empresa</div>' +
                    '<div class="detail-item-value">' + (contacto.empresa || 'No especificada') + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="detail-item">' +
                '<div class="detail-item-icon"><i class="fas fa-map-marker-alt"></i></div>' +
                '<div class="detail-item-content">' +
                    '<div class="detail-item-label">Dirección</div>' +
                    '<div class="detail-item-value">' + (contacto.direccion || 'No especificada') + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="detail-item">' +
                '<div class="detail-item-icon"><i class="fas fa-sticky-note"></i></div>' +
                '<div class="detail-item-content">' +
                    '<div class="detail-item-label">Notas</div>' +
                    '<div class="detail-item-value">' + (contacto.notas || 'Sin notas') + '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="detail-actions">' +
            '<button class="btn-primary" onclick="cerrarModalDetallesFav()">' +
                '<i class="fas fa-check"></i> Cerrar' +
            '</button>' +
        '</div>';
    
    var modal = document.getElementById('detail-modal');
    modal.classList.add('active');
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    modal.style.display = 'flex';
    modal.style.zIndex = '9999';
}

// ===== BÚSQUEDA =====
function inicializarBusquedaFavoritos() {
    var inputBusqueda = document.getElementById('search-favorites');
    
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', function() {
            var termino = this.value.toLowerCase();
            console.log('Buscando en favoritos:', termino);
            buscarFavoritos(termino);
        });
    } else {
        alert('Error: No se encontró el input de búsqueda en favoritos. Revisa que el id=\"search-favorites\" esté presente.');
        console.error('Input search-favorites no encontrado');
    }
}

function buscarFavoritos(termino) {
    var contactos = obtenerContactosFavoritos();
    var contenedor = document.getElementById('favorites-container');
    var estadoVacio = document.getElementById('empty-favorites');
    
    // Filtrar favoritos que coincidan
    var favoritos = [];
    for (var i = 0; i < contactos.length; i++) {
        var contacto = contactos[i];
        if (contacto.favorito) {
            var coincide = contacto.nombre.toLowerCase().indexOf(termino) !== -1 ||
                           contacto.telefono.indexOf(termino) !== -1 ||
                           (contacto.email && contacto.email.toLowerCase().indexOf(termino) !== -1);
            
            if (coincide) {
                favoritos.push(contacto);
            }
        }
    }
    
    // Limpiar y mostrar resultados
    contenedor.innerHTML = '';
    
    if (favoritos.length === 0) {
        contenedor.classList.add('hidden');
        estadoVacio.classList.remove('hidden');
    } else {
        contenedor.classList.remove('hidden');
        estadoVacio.classList.add('hidden');
        
        for (var j = 0; j < favoritos.length; j++) {
            var tarjeta = crearTarjetaFavorito(favoritos[j]);
            contenedor.appendChild(tarjeta);
        }
    }
}

// ===== CAMBIO DE VISTA =====
function inicializarVistaFavoritos() {
    var btnGrid = document.getElementById('grid-view');
    var btnList = document.getElementById('list-view');
    var contenedor = document.getElementById('favorites-container');
    
    btnGrid.addEventListener('click', function() {
        btnGrid.classList.add('active');
        btnList.classList.remove('active');
        contenedor.classList.remove('list-view');
        vistaActualFav = 'grid';
    });
    
    btnList.addEventListener('click', function() {
        btnList.classList.add('active');
        btnGrid.classList.remove('active');
        contenedor.classList.add('list-view');
        vistaActualFav = 'list';
    });
}
