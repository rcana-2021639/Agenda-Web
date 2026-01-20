// Variables globales
var tareaEditando = null;
var tareaEliminar = null;
var filtroActual = 'all';

// Funciones auxiliares
function fechaPasada(fecha) {
    var fechaActual = new Date();
    var fechaTarea = new Date(fecha);
    return fechaTarea < fechaActual;
}

function formatearFecha(fecha) {
    var fechaObj = new Date(fecha);
    var opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return fechaObj.toLocaleDateString(undefined, opciones);
}

function generarId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Esperar a que el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar tareas
    cargarTareas();
    
    // Inicializar modal de tarea
    inicializarModalTarea();
    
    // Inicializar filtros
    inicializarFiltros();
    
    // Inicializar modal de eliminación
    inicializarModalEliminar();
});

// ===== CARGAR TAREAS =====
function cargarTareas() {
    var tareas = obtenerTareas();
    var contenedor = document.getElementById('tasks-container');
    var estadoVacio = document.getElementById('empty-tasks');
    
    // Ordenar por prioridad
    tareas = ordenarPorPrioridad(tareas);
    
    // Filtrar según el filtro actual
    var tareasFiltradas = filtrarTareas(tareas);
    
    // Actualizar estadísticas
    actualizarEstadisticasTareas(tareas);
    
    // Limpiar contenedor
    contenedor.innerHTML = '';
    
    // Mostrar estado vacío si no hay tareas
    if (tareasFiltradas.length === 0) {
        contenedor.classList.add('hidden');
        estadoVacio.classList.remove('hidden');
        return;
    }
    
    contenedor.classList.remove('hidden');
    estadoVacio.classList.add('hidden');
    
    // Mostrar cada tarea
    for (var i = 0; i < tareasFiltradas.length; i++) {
        var tarea = tareasFiltradas[i];
        var elemento = crearElementoTarea(tarea);
        contenedor.appendChild(elemento);
    }
}

// Obtener tareas del localStorage
function obtenerTareas() {
    var tareasGuardadas = localStorage.getItem('tareas');
    
    if (tareasGuardadas) {
        return JSON.parse(tareasGuardadas);
    }
    
    return [];
}

// Guardar tareas en localStorage
function guardarTareas(tareas) {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

// Ordenar tareas por prioridad
function ordenarPorPrioridad(tareas) {
    var prioridadOrden = { high: 1, medium: 2, low: 3 };
    
    tareas.sort(function(a, b) {
        // Primero las no completadas
        if (a.completada !== b.completada) {
            return a.completada ? 1 : -1;
        }
        // Luego por prioridad
        return prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad];
    });
    
    return tareas;
}

// Filtrar tareas
function filtrarTareas(tareas) {
    if (filtroActual === 'all') {
        return tareas;
    }
    
    var tareasFiltradas = [];
    
    for (var i = 0; i < tareas.length; i++) {
        if (filtroActual === 'pending' && !tareas[i].completada) {
            tareasFiltradas.push(tareas[i]);
        } else if (filtroActual === 'completed' && tareas[i].completada) {
            tareasFiltradas.push(tareas[i]);
        }
    }
    
    return tareasFiltradas;
}

// Actualizar estadísticas
function actualizarEstadisticasTareas(tareas) {
    var total = tareas.length;
    var pendientes = 0;
    var completadas = 0;
    
    for (var i = 0; i < tareas.length; i++) {
        if (tareas[i].completada) {
            completadas++;
        } else {
            pendientes++;
        }
    }
    
    document.getElementById('total-tasks').textContent = total;
    document.getElementById('pending-tasks').textContent = pendientes;
    document.getElementById('completed-tasks').textContent = completadas;
}

// Crear elemento de tarea
function crearElementoTarea(tarea) {
    var elemento = document.createElement('div');
    elemento.className = 'task-item priority-' + tarea.prioridad;
    
    if (tarea.completada) {
        elemento.classList.add('completed');
    }
    
    elemento.setAttribute('data-id', tarea.id);
    
    var prioridadTexto = { high: 'Alta', medium: 'Media', low: 'Baja' };
    var checkado = tarea.completada ? 'checked' : '';
    
    // Verificar si la fecha ya pasó
    var clasesFecha = 'task-date';
    if (tarea.fecha && fechaPasada(tarea.fecha) && !tarea.completada) {
        clasesFecha += ' overdue';
    }
    
    elemento.innerHTML = 
        '<label class="task-checkbox">' +
            '<input type="checkbox" ' + checkado + '>' +
            '<span class="task-checkbox-custom"><i class="fas fa-check"></i></span>' +
        '</label>' +
        '<div class="task-content">' +
            '<div class="task-header">' +
                '<span class="task-title">' + tarea.titulo + '</span>' +
                '<span class="task-priority ' + tarea.prioridad + '">' + prioridadTexto[tarea.prioridad] + '</span>' +
            '</div>' +
            (tarea.descripcion ? '<p class="task-description">' + tarea.descripcion + '</p>' : '') +
            '<div class="task-meta">' +
                (tarea.fecha ? '<span class="' + clasesFecha + '"><i class="fas fa-calendar-alt"></i> ' + formatearFecha(tarea.fecha) + '</span>' : '') +
            '</div>' +
        '</div>' +
        '<div class="task-actions">' +
            '<button class="task-action-btn edit" title="Editar">' +
                '<i class="fas fa-edit"></i>' +
            '</button>' +
            '<button class="task-action-btn delete" title="Eliminar">' +
                '<i class="fas fa-trash"></i>' +
            '</button>' +
        '</div>';
    
    // Agregar eventos
    var checkbox = elemento.querySelector('input[type="checkbox"]');
    var btnEditar = elemento.querySelector('.edit');
    var btnEliminar = elemento.querySelector('.delete');
    
    checkbox.addEventListener('change', function() {
        toggleCompletarTarea(tarea.id);
    });
    
    btnEditar.addEventListener('click', function() {
        editarTarea(tarea.id);
    });
    
    btnEliminar.addEventListener('click', function() {
        confirmarEliminarTarea(tarea.id);
    });
    
    return elemento;
}

// ===== MODAL DE TAREA =====
function inicializarModalTarea() {
    var modal = document.getElementById('task-modal');
    var btnAgregar = document.getElementById('add-task-btn');
    var btnAgregarVacio = document.getElementById('add-task-empty');
    var btnCerrar = document.getElementById('close-task-modal');
    var btnCancelar = document.getElementById('cancel-task');
    var formulario = document.getElementById('task-form');
    
    // Abrir modal para nueva tarea
    function abrirModalNuevo() {
        tareaEditando = null;
        document.getElementById('task-modal-title').textContent = 'Nueva Tarea';
        formulario.reset();
        document.getElementById('task-id').value = '';
        modal.classList.add('active');
    }
    
    btnAgregar.addEventListener('click', abrirModalNuevo);
    
    if (btnAgregarVacio) {
        btnAgregarVacio.addEventListener('click', abrirModalNuevo);
    }
    
    // Cerrar modal
    btnCerrar.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    btnCancelar.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    // Cerrar al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Guardar tarea
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        guardarTarea();
    });
}

// Guardar tarea (nueva o editada)
function guardarTarea() {
    var titulo = document.getElementById('task-title').value;
    var descripcion = document.getElementById('task-description').value;
    var prioridad = document.getElementById('task-priority').value;
    var fecha = document.getElementById('task-date').value;
    
    // Validar campos obligatorios
    if (titulo === '' || prioridad === '') {
        alert('Por favor, completa los campos obligatorios');
        return;
    }
    
    var tareas = obtenerTareas();
    
    if (tareaEditando) {
        // Editar tarea existente
        for (var i = 0; i < tareas.length; i++) {
            if (tareas[i].id === tareaEditando) {
                tareas[i].titulo = titulo;
                tareas[i].descripcion = descripcion;
                tareas[i].prioridad = prioridad;
                tareas[i].fecha = fecha;
                break;
            }
        }
    } else {
        // Crear nueva tarea
        var nuevaTarea = {
            id: generarId(),
            titulo: titulo,
            descripcion: descripcion,
            prioridad: prioridad,
            fecha: fecha,
            completada: false
        };
        
        tareas.push(nuevaTarea);
    }
    
    // Guardar y recargar
    guardarTareas(tareas);
    cargarTareas();
    
    // Cerrar modal
    document.getElementById('task-modal').classList.remove('active');
    
    // Mostrar mensaje
    alert(tareaEditando ? 'Tarea actualizada' : 'Tarea agregada');
}

// Editar tarea
function editarTarea(id) {
    var tareas = obtenerTareas();
    var tarea = null;
    
    for (var i = 0; i < tareas.length; i++) {
        if (tareas[i].id === id) {
            tarea = tareas[i];
            break;
        }
    }
    
    if (!tarea) return;
    
    tareaEditando = id;
    
    // Llenar formulario
    document.getElementById('task-id').value = tarea.id;
    document.getElementById('task-title').value = tarea.titulo;
    document.getElementById('task-description').value = tarea.descripcion || '';
    document.getElementById('task-priority').value = tarea.prioridad;
    document.getElementById('task-date').value = tarea.fecha || '';
    
    // Cambiar título
    document.getElementById('task-modal-title').textContent = 'Editar Tarea';
    
    // Abrir modal
    document.getElementById('task-modal').classList.add('active');
}

// Toggle completar tarea
function toggleCompletarTarea(id) {
    var tareas = obtenerTareas();
    
    for (var i = 0; i < tareas.length; i++) {
        if (tareas[i].id === id) {
            tareas[i].completada = !tareas[i].completada;
            break;
        }
    }
    
    guardarTareas(tareas);
    
    // Pequeño delay para la animación del checkbox
    setTimeout(function() {
        cargarTareas();
    }, 200);
}

// ===== MODAL DE ELIMINACIÓN =====
function inicializarModalEliminar() {
    var modal = document.getElementById('delete-modal');
    var btnCerrar = document.getElementById('close-delete-modal');
    var btnCancelar = document.getElementById('cancel-delete');
    var btnConfirmar = document.getElementById('confirm-delete');
    
    btnCerrar.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    btnCancelar.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    btnConfirmar.addEventListener('click', function() {
        if (tareaEliminar) {
            eliminarTarea(tareaEliminar);
            modal.classList.remove('active');
        }
    });
}

// Confirmar eliminación
function confirmarEliminarTarea(id) {
    tareaEliminar = id;
    document.getElementById('delete-modal').classList.add('active');
}

// Eliminar tarea
function eliminarTarea(id) {
    var tareas = obtenerTareas();
    var nuevasTareas = [];
    
    for (var i = 0; i < tareas.length; i++) {
        if (tareas[i].id !== id) {
            nuevasTareas.push(tareas[i]);
        }
    }
    
    guardarTareas(nuevasTareas);
    cargarTareas();
    
    tareaEliminar = null;
}

// ===== FILTROS =====
function inicializarFiltros() {
    var botonesFiltro = document.querySelectorAll('.filter-btn');
    
    for (var i = 0; i < botonesFiltro.length; i++) {
        botonesFiltro[i].addEventListener('click', function() {
            // Remover activo de todos
            for (var j = 0; j < botonesFiltro.length; j++) {
                botonesFiltro[j].classList.remove('active');
            }
            
            // Agregar activo al actual
            this.classList.add('active');
            
            // Cambiar filtro y recargar
            filtroActual = this.getAttribute('data-filter');
            cargarTareas();
        });
    }
}
