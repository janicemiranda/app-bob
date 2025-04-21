// Elementos del DOM
const btnNuevoCliente = document.getElementById('btnNuevoCliente');
const modalRegistroClients = document.getElementById('modalRegistroClients');
const closeModalRegistroClients = document.getElementById('closeModalRegistroClients');
const cancelarRegistroClients = document.getElementById('cancelarRegistroClients');
const formRegistro = document.getElementById('formRegistro');
const clientesTableBody = document.getElementById('clientesTableBody');
const notification = document.querySelector("#notification");
const notificationMessage = document.querySelector("#notification-message");
const clientSearch = document.getElementById('clientSearch');
const statusFilter = document.getElementById('statusFilter');

// Estado de la aplicación
const appStateClients = {
    notificationTimeout: null, // Para controlar el timeout de las notificaciones
    isEditing: false, // Para controlar si estamos editando o agregando
    searchTerm: "", // Término de búsqueda para filtrar clientes
    statusFilter: "all", // Filtro de estado: "all", "active", "inactive"
    currentClientId: null, // ID del cliente que estamos editando actualmente
}

// Mostrar modal al hacer clic en "Nuevo Cliente"
btnNuevoCliente.addEventListener('click', function() {
    resetForm();
    appStateClients.isEditing = false;
    appStateClients.currentClientId = null;
    modalRegistroClients.removeAttribute('hidden');
});

// Ocultar modal al hacer clic en el botón de cierre
closeModalRegistroClients.addEventListener('click', function() {
    modalRegistroClients.setAttribute('hidden', '');
});

// Ocultar modal al hacer clic en "Cancelar" (si existe)
if (cancelarRegistroClients) {
    cancelarRegistroClients.addEventListener('click', function() {
        modalRegistroClients.setAttribute('hidden', '');
    });
}

// Manejar envío del formulario
formRegistro.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Obtener datos del formulario
    const formData = new FormData(formRegistro);
    const clientData = {
        correo: formData.get('correo'),
        razonSocial: formData.get('razonSocial'),
        tipoDocumento: formData.get('tipoDocumento'),
        numeroDocumento: formData.get('numeroDocumento'),
        observaciones: formData.get('observaciones'),
        activo: true
    };
    debugger
    if (appStateClients.isEditing) {
        // Actualizar cliente existente
        updateClient(appStateClients.currentClientId, clientData);
        showNotification('Cliente actualizado correctamente');
    } else {
        // Crear nuevo cliente
        addClient(clientData);
        showNotification('Cliente agregado correctamente');
    }
    
    // Cerrar modal y actualizar tabla
    modalRegistroClients.setAttribute('hidden', '');
    renderClientTable();
});

/**
 * Funciones CRUD para Clientes
 */

// Crear nuevo cliente
function addClient(clientData) {
    const newClient = new Client(
        null, // El ID se generará automáticamente
        null, // nombre no usado ahora (cambiamos a correo)
        clientData.razonSocial,
        clientData.tipoDocumento,
        clientData.numeroDocumento,
        clientData.correo,
        clientData.observaciones,
        clientData.activo
    );
    window.clientStore.add(newClient);
    return newClient;
}

// Actualizar cliente existente
function updateClient(id, clientData) {
    return window.clientStore.update(id, {
        correo: clientData.correo,
        razonSocial: clientData.razonSocial,
        tipoDocumento: clientData.tipoDocumento,
        numeroDocumento: clientData.numeroDocumento,
        observaciones: clientData.observaciones,
        updatedAt: new Date()
    });
}

// Eliminar cliente (inactivar)
function deleteClient(id) {
    return window.clientStore.toggleActive(id, false);
}

// Activar cliente
function activateClient(id) {
    return window.clientStore.toggleActive(id, true);
}

// Obtener todos los clientes
function getAllClients() {
    return window.clientStore.getState();
}

// Obtener cliente por ID
function getClientById(id) {
    return window.clientStore.getById(id);
}

// Filtrar clientes por término de búsqueda y estado
function filterClients(searchTerm, statusFilter) {
    // Obtener todos los clientes
    let filteredClients = getAllClients();
    
    // Filtrar por término de búsqueda si existe
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        debugger
        filteredClients = filteredClients.filter(client => 
            (client.razonSocial && client.razonSocial.toLowerCase().includes(term)) ||
            (client.numeroDocumento && client.numeroDocumento.toLowerCase().includes(term))
        );
    }
    
    // Filtrar por estado
    if (statusFilter !== "all") {
        const isActive = statusFilter === "active";
        filteredClients = filteredClients.filter(client => client.activo === isActive);
    }
    
    return filteredClients;
}

/**
 * Funciones de UI
 */

// Renderizar tabla de clientes
function renderClientTable() {
    const clients = filterClients(appStateClients.searchTerm, appStateClients.statusFilter);
    clientesTableBody.innerHTML = '';
    
    if (clients.length === 0) {
        clientesTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-4 py-3 text-center text-gray-500">
                    No hay clientes que coincidan con los criterios de búsqueda
                </td>
            </tr>
        `;
        return;
    }
    
    clients.forEach(client => {
        const row = document.createElement('tr');
        
        // Contenido común de la fila
        row.innerHTML = `
            <td class="px-4 py-3">${client.tipoDocumento.toUpperCase()}: ${client.numeroDocumento}</td>
            <td class="px-4 py-3">${client.razonSocial}</td>
            <td class="px-4 py-3">${client.correo}</td>
            <td class="px-4 py-3">${client.saldoSoles}</td>
            <td class="px-4 py-3">${client.saldoDolares}</td>
            <td class="px-4 py-3">${client.activo ? '<div class="bg-green-100 text-green-800 px-2 py-1 text-center rounded">Activo</div>' : '<div class="bg-red-100 text-red-800 px-2 py-1 text-center rounded"><p>Inactivo</p></div>'}</td>
            <td class="px-4 py-3">
                <div class="flex space-x-2">
                    ${client.activo ? 
                    `
                    <button class="text-blue-600 hover:text-blue-800" data-action="edit" data-id="${client.id}" title="Editar Cliente">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </button>
                    <a href="details.html?clientId=${client.id}" class="text-indigo-600 hover:text-indigo-800" title="Detalles Transacciones">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    </a>
                    <button class="text-red-600 hover:text-red-800" data-action="delete" data-id="${client.id}" title="Inactivar Cliente">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    ` 
                    : 
                    `
                    <button class="text-green-600 hover:text-green-800" data-action="activate" data-id="${client.id}" title="Activar Cliente">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
					<a href="details.html?clientId=${client.id}" class="text-indigo-600 hover:text-indigo-800" title="Detalles Transacciones">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    </a>
                    `}
                </div>
            </td>
        `;
        
        // Añadir event listeners según el estado del cliente
        if (client.activo) {
            // Eventos para clientes activos
            row.querySelector('[data-action="edit"]').addEventListener('click', () => {
                editClient(client.id);
            });
            
            row.querySelector('[data-action="delete"]').addEventListener('click', () => {
                confirmDeleteClient(client.id, client.razonSocial);
            });
        } else {
            // Evento para clientes inactivos
            row.querySelector('[data-action="activate"]').addEventListener('click', () => {
                confirmActivateClient(client.id, client.razonSocial);
            });
        }
        
        clientesTableBody.appendChild(row);
    });
}

// Cargar datos del cliente en el formulario para edición
function editClient(id) {
    const client = getClientById(id);
    if (!client) return;
    
    // Establecer el modo de edición
    appStateClients.isEditing = true;
    appStateClients.currentClientId = id;
    
    // Rellenar el formulario con los datos del cliente
    document.getElementById('correo').value = client.correo || '';
    document.getElementById('razonSocial').value = client.razonSocial || '';
    document.getElementById('tipoDocumento').value = client.tipoDocumento || 'dni';
    document.getElementById('numeroDocumento').value = client.numeroDocumento || '';
    document.getElementById('observaciones').value = client.observaciones || '';
    
    // Mostrar el modal
    modalRegistroClients.removeAttribute('hidden');
}

// Confirmar eliminación de cliente
function confirmDeleteClient(id, nombre) {
    document.getElementById('inactivar-confirm-message').textContent = `¿Estás seguro que deseas inactivar al cliente "${nombre}"?`;
    
    // Mostrar el modal de confirmación
    const inactivarModal = document.getElementById('inactivar-confirm-modal');
    inactivarModal.classList.remove('hidden');
    
    // Guardar el ID actual para uso posterior
    const tempClientId = id;
    
    // Configurar botones
    document.getElementById('confirm-inactivar').onclick = function() {
        deleteClient(tempClientId);
        inactivarModal.classList.add('hidden');
        renderClientTable();
        showNotification('Cliente inactivado correctamente');
    };
    
    document.getElementById('cancel-inactivar').onclick = function() {
        inactivarModal.classList.add('hidden');
    };
    
    document.getElementById('close-inactivar-modal').onclick = function() {
        inactivarModal.classList.add('hidden');
    };
}

// Confirmar activación de cliente
function confirmActivateClient(id, nombre) {
    document.getElementById('activar-confirm-message').textContent = `¿Estás seguro que deseas activar al cliente "${nombre}"?`;
    
    // Mostrar el modal de confirmación
    const activarModal = document.getElementById('activar-confirm-modal');
    activarModal.classList.remove('hidden');
    
    // Guardar el ID actual para uso posterior
    const tempClientId = id;
    
    // Configurar botones
    document.getElementById('confirm-activar').onclick = function() {
        activateClient(tempClientId);
        activarModal.classList.add('hidden');
        renderClientTable();
        showNotification('Cliente activado correctamente');
    };
    
    document.getElementById('cancel-activar').onclick = function() {
        activarModal.classList.add('hidden');
    };
    
    document.getElementById('close-activar-modal').onclick = function() {
        activarModal.classList.add('hidden');
    };
}

// Resetear formulario
function resetForm() {
    formRegistro.reset();
}

// Función para mostrar notificaciones temporales
function showNotification(message, duration = 3000) {
    // Limpiar cualquier timeout existente
    if (appStateClients.notificationTimeout) {
        clearTimeout(appStateClients.notificationTimeout);
    }

    // Establecer el mensaje
    notificationMessage.textContent = message;

    // Remuevo el hidden
    notification.classList.remove('hidden');
    // Mostrar la notificación
    notification.classList.add('show');

    // Ocultar después del tiempo especificado
    appStateClients.notificationTimeout = setTimeout(() => {
        // Remuevo el show
        notification.classList.remove('show');
        // Ocultar la notificación
        notification.classList.add('hidden');
    }, duration);
}

// Escuchar cambios en el almacén de clientes
window.clientStore.subscribe(() => {
    renderClientTable();
});

// Manejar búsqueda y filtrado
clientSearch.addEventListener('input', function(event) {
    appStateClients.searchTerm = event.target.value.trim();
    renderClientTable();
});

statusFilter.addEventListener('change', function(event) {
    appStateClients.statusFilter = event.target.value;
    renderClientTable();
});

// Inicializar tabla de clientes cuando el DOM se cargue
document.addEventListener('DOMContentLoaded', function() {
    renderClientTable();
    
    // Inicializar los filtros con valores por defecto
    clientSearch.value = appStateClients.searchTerm;
    statusFilter.value = appStateClients.statusFilter;
});
