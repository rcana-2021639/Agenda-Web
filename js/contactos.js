// Variables globales
var contactoEditando = null;
var vistaActual = 'grid';

// Funciones auxiliares
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

function generarId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Esperar a que el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar contactos
    cargarContactos();
    
    // Inicializar modal
    inicializarModal();
    
    // Inicializar búsqueda
    inicializarBusqueda();
    
    // Inicializar cambio de vista
    inicializarVistaContactos();
    
    // Inicializar modal de detalles
    inicializarModalDetalles();
});

// ===== CARGAR CONTACTOS =====
function cargarContactos() {
    var contactos = obtenerContactos();
    var contenedor = document.getElementById('contacts-container');
    
    // Limpiar contenedor
    contenedor.innerHTML = '';
    
    // Actualizar estadísticas
    actualizarEstadisticas(contactos);
    
    // Mostrar cada contacto
    for (var j = 0; j < contactos.length; j++) {
        var card = crearTarjetaContacto(contactos[j]);
        contenedor.appendChild(card);
    }
}

// Obtener contactos del localStorage
function obtenerContactos() {
    var contactosGuardados = localStorage.getItem('contactos');
    
    if (contactosGuardados) {
        return JSON.parse(contactosGuardados);
    }
    
    return [];
}

// Guardar contactos en localStorage
function guardarContactos(contactos) {
    localStorage.setItem('contactos', JSON.stringify(contactos));
}

// Actualizar estadísticas
function actualizarEstadisticas(contactos) {
    var totalContactos = document.getElementById('total-contacts');
    var totalFavoritos = document.getElementById('total-favorites');
    var recentContacts = document.getElementById('recent-contacts');
    
    var favoritos = 0;
    for (var i = 0; i < contactos.length; i++) {
        if (contactos[i].favorito) {
            favoritos++;
        }
    }
    
    totalContactos.textContent = contactos.length;
    totalFavoritos.textContent = favoritos;
    recentContacts.textContent = Math.min(contactos.length, 3);
}

// Crear tarjeta de contacto
function crearTarjetaContacto(contacto) {
    var tarjeta = document.createElement('div');
    tarjeta.className = 'contact-card';
    tarjeta.setAttribute('data-id', contacto.id);
    
    var iniciales = obtenerIniciales(contacto.nombre);
    var favoritoClase = contacto.favorito ? 'active' : '';
    var favoritoIcono = contacto.favorito ? 'fas' : 'far';
    
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
            '<button class="contact-action-btn editar" title="Editar">' +
                '<i class="fas fa-edit"></i>' +
            '</button>' +
            '<button class="contact-action-btn favorite ' + favoritoClase + '" title="Favorito">' +
                '<i class="' + favoritoIcono + ' fa-star"></i>' +
            '</button>' +
            '<button class="contact-action-btn eliminar" title="Eliminar">' +
                '<i class="fas fa-trash"></i>' +
            '</button>' +
        '</div>';
    
    // Agregar eventos a los botones
    var btnVerDetalle = tarjeta.querySelector('.ver-detalle');
    var btnEditar = tarjeta.querySelector('.editar');
    var btnFavorito = tarjeta.querySelector('.favorite');
    var btnEliminar = tarjeta.querySelector('.eliminar');
    
    btnVerDetalle.addEventListener('click', function(e) {
        e.stopPropagation();
        mostrarDetalleContacto(contacto.id);
    });
    
    btnEditar.addEventListener('click', function(e) {
        e.stopPropagation();
        editarContacto(contacto.id);
    });
    
    btnFavorito.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleFavorito(contacto.id);
    });
    
    btnEliminar.addEventListener('click', function(e) {
        e.stopPropagation();
        eliminarContacto(contacto.id);
    });
    
    // Hacer clic en la tarjeta muestra detalles
    tarjeta.addEventListener('click', function() {
        mostrarDetalleContacto(contacto.id);
    });
    
    return tarjeta;
}

// ===== MODAL DE CONTACTO =====
function inicializarModal() {
    var modal = document.getElementById('contact-modal');
    var btnAgregar = document.getElementById('add-contact-btn');
    var btnCerrar = document.getElementById('close-modal');
    var btnCancelar = document.getElementById('cancel-contact');
    var formulario = document.getElementById('contact-form');
    
    if (!modal) {
        alert('Error: No se encontró el modal de contacto en el HTML. Revisa que el id="contact-modal" esté presente.');
        console.error('Modal contact-modal no encontrado');
        return;
    }
    
    // Abrir modal para nuevo contacto
    if (btnAgregar) {
        btnAgregar.addEventListener('click', function(e) {
            e.preventDefault();
            contactoEditando = null;
            document.getElementById('modal-title').textContent = 'Nuevo Contacto';
            if (formulario) formulario.reset();
            // Forzar visibilidad del modal
            modal.classList.add('active');
            modal.style.opacity = '1';
            modal.style.visibility = 'visible';
            modal.style.display = 'flex';
            modal.style.zIndex = '9999';
        });
    } else {
        alert('Error: No se encontró el botón para agregar contacto. Revisa que el id=\"add-contact-btn\" esté presente.');
        console.error('Botón add-contact-btn no encontrado');
    }
    
    // Cerrar modal con botón X
    if (btnCerrar) {
        btnCerrar.addEventListener('click', function(e) {
            e.preventDefault();
            modal.classList.remove('active');
            modal.removeAttribute('style');
        });
    }
    
    // Cerrar modal con botón Cancelar
    if (btnCancelar) {
        btnCancelar.addEventListener('click', function(e) {
            e.preventDefault();
            modal.classList.remove('active');
            modal.removeAttribute('style');
        });
    }
    
    // Cerrar al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            modal.removeAttribute('style');
        }
    });
    
    // Guardar contacto
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            guardarContacto();
        });
    } else {
        console.error('Formulario contact-form no encontrado');
    }
}

// Guardar contacto (nuevo o editado)
function guardarContacto() {
    var nombre = document.getElementById('contact-name').value;
    var telefono = document.getElementById('contact-phone').value;
    var email = document.getElementById('contact-email').value;
    var empresa = document.getElementById('contact-company').value;
    var direccion = document.getElementById('contact-address').value;
    var notas = document.getElementById('contact-notes').value;
    var favorito = document.getElementById('contact-favorite').checked;
    
    // Validar campos obligatorios
    if (nombre === '' || telefono === '') {
        alert('Por favor, completa los campos obligatorios');
        return;
    }
    
    var contactos = obtenerContactos();
    var esEdicion = contactoEditando !== null;
    
    if (esEdicion) {
        // Editar contacto existente
        for (var i = 0; i < contactos.length; i++) {
            if (contactos[i].id === contactoEditando) {
                contactos[i].nombre = nombre;
                contactos[i].telefono = telefono;
                contactos[i].email = email;
                contactos[i].empresa = empresa;
                contactos[i].direccion = direccion;
                contactos[i].notas = notas;
                contactos[i].favorito = favorito;
                break;
            }
        }
    } else {
        // Crear nuevo contacto
        var nuevoContacto = {
            id: generarId(),
            nombre: nombre,
            telefono: telefono,
            email: email,
            empresa: empresa,
            direccion: direccion,
            notas: notas,
            favorito: favorito
        };
        
        contactos.push(nuevoContacto);
    }
    
    // Guardar y recargar
    guardarContactos(contactos);
    cargarContactos();
    
    // Cerrar modal
    document.getElementById('contact-modal').classList.remove('active');
    
    // Mostrar mensaje antes de resetear
    alert(esEdicion ? 'Contacto actualizado' : 'Contacto agregado');
    
    // Resetear formulario y variables
    document.getElementById('contact-form').reset();
    contactoEditando = null;
}

// Editar contacto
function editarContacto(id) {
    var contactos = obtenerContactos();
    var contacto = null;
    
    for (var i = 0; i < contactos.length; i++) {
        if (contactos[i].id === id) {
            contacto = contactos[i];
            break;
        }
    }
    
    if (!contacto) return;
    
    contactoEditando = id;
    
    // Llenar formulario
    document.getElementById('contact-name').value = contacto.nombre;
    document.getElementById('contact-phone').value = contacto.telefono;
    document.getElementById('contact-email').value = contacto.email || '';
    document.getElementById('contact-company').value = contacto.empresa || '';
    document.getElementById('contact-address').value = contacto.direccion || '';
    document.getElementById('contact-notes').value = contacto.notas || '';
    document.getElementById('contact-favorite').checked = contacto.favorito;
    
    // Cambiar título
    document.getElementById('modal-title').textContent = 'Editar Contacto';
    
    // Abrir modal
    document.getElementById('contact-modal').classList.add('active');
}

// Eliminar contacto
function eliminarContacto(id) {
    if (!confirm('¿Estás seguro de eliminar este contacto?')) {
        return;
    }
    
    var contactos = obtenerContactos();
    var nuevosContactos = [];
    
    for (var i = 0; i < contactos.length; i++) {
        if (contactos[i].id !== id) {
            nuevosContactos.push(contactos[i]);
        }
    }
    
    guardarContactos(nuevosContactos);
    cargarContactos();
    
    alert('Contacto eliminado');
}

// Toggle favorito
function toggleFavorito(id) {
    var contactos = obtenerContactos();
    
    for (var i = 0; i < contactos.length; i++) {
        if (contactos[i].id === id) {
            contactos[i].favorito = !contactos[i].favorito;
            break;
        }
    }
    
    guardarContactos(contactos);
    cargarContactos();
}

// ===== MODAL DE DETALLES =====
function inicializarModalDetalles() {
    var modal = document.getElementById('detail-modal');
    var btnCerrar = document.getElementById('close-detail-modal');
    
    if (btnCerrar) {
        btnCerrar.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            cerrarModalDetalles();
        });
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarModalDetalles();
            }
        });
    }
}

function cerrarModalDetalles() {
    var modal = document.getElementById('detail-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.removeAttribute('style');
    }
}

// Mostrar detalle del contacto
function mostrarDetalleContacto(id) {
    var contactos = obtenerContactos();
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
    
    var badgeFavorito = contacto.favorito 
        ? '<div class="detail-favorite-badge"><i class="fas fa-star"></i> Favorito</div>'
        : '';
    
    contenedor.innerHTML = 
        '<div class="detail-header">' +
            '<div class="detail-avatar">' + iniciales + '</div>' +
            '<h2>' + contacto.nombre + '</h2>' +
            '<p>' + (contacto.empresa || 'Sin empresa') + '</p>' +
            badgeFavorito +
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
            '<button class="btn-secondary" onclick="cerrarDetalleYEditar(\'' + contacto.id + '\')">' +
                '<i class="fas fa-edit"></i> Editar' +
            '</button>' +
            '<button class="btn-primary" onclick="cerrarModalDetalles()">' +
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

// Cerrar detalle y abrir edición
function cerrarDetalleYEditar(id) {
    var modal = document.getElementById('detail-modal');
    modal.classList.remove('active');
    modal.removeAttribute('style');
    setTimeout(function() {
        editarContacto(id);
    }, 200);
}

// ===== BÚSQUEDA =====
function inicializarBusqueda() {
    var inputBusqueda = document.getElementById('search-contacts');
    
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', function() {
            var termino = this.value.toLowerCase();
            console.log('Buscando:', termino);
            buscarContactos(termino);
        });
    } else {
        console.error('Input search-contacts no encontrado');
    }
}

function buscarContactos(termino) {
    var contactos = obtenerContactos();
    var contenedor = document.getElementById('contacts-container');
    
    contenedor.innerHTML = '';
    
    if (termino === '') {
        // Si está vacío, mostrar todos
        for (var i = 0; i < contactos.length; i++) {
            var card = crearTarjetaContacto(contactos[i]);
            contenedor.appendChild(card);
        }
    } else {
        // Buscar por término
        for (var k = 0; k < contactos.length; k++) {
            var contacto = contactos[k];
            var coincide = contacto.nombre.toLowerCase().indexOf(termino) !== -1 ||
                           contacto.telefono.indexOf(termino) !== -1 ||
                           (contacto.email && contacto.email.toLowerCase().indexOf(termino) !== -1) ||
                           (contacto.empresa && contacto.empresa.toLowerCase().indexOf(termino) !== -1) ||
                           (contacto.direccion && contacto.direccion.toLowerCase().indexOf(termino) !== -1);
            
            if (coincide) {
                var card = crearTarjetaContacto(contacto);
                contenedor.appendChild(card);
            }
        }
    }
    
    // Actualizar estadísticas
    var resultados = contenedor.querySelectorAll('.contact-card');
    if (resultados.length === 0 && termino !== '') {
        contenedor.innerHTML = '<div class="no-results"><p>No se encontraron contactos</p></div>';
    }
}

// ===== CAMBIO DE VISTA =====
function inicializarVistaContactos() {
    var btnGrid = document.getElementById('grid-view');
    var btnList = document.getElementById('list-view');
    var contenedor = document.getElementById('contacts-container');
    
    btnGrid.addEventListener('click', function() {
        btnGrid.classList.add('active');
        btnList.classList.remove('active');
        contenedor.classList.remove('list-view');
        vistaActual = 'grid';
    });
    
    btnList.addEventListener('click', function() {
        btnList.classList.add('active');
        btnGrid.classList.remove('active');
        contenedor.classList.add('list-view');
        vistaActual = 'list';
    });
}
