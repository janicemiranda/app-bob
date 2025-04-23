// Elementos del DOM
const btnNuevoMovimiento = document.getElementById('btnNuevoMovimiento');
const modalRegistro = document.getElementById('modalRegistro');
const closeModalRegistro = document.getElementById('closeModalRegistro');
const cancelarRegistro = document.getElementById('cancelarRegistro');
const empresaVehiculoSelect = document.getElementById('empresaVehiculo');
const nombreEmpresaVehiculoDiv = document.querySelector('#nombreEmpresaVehiculoDiv');
const nombreEmpresaVehiculoInput = document.getElementById('nombreEmpresaVehiculo');
const entidadFinancieraSelect = document.getElementById('nombreEntidadFinanciera');
const nombreEntidadFinancieraDiv = document.querySelector('#nombreEntidadFinancieraDiv');
const nombreEntidadFinancieraInput = document.getElementById('nombreEntidadFinancieraInput');


// Mostrar modal al hacer clic en "Nuevo Movimiento"
btnNuevoMovimiento.addEventListener('click', function() {
	modalRegistro.removeAttribute('hidden');
});

// Ocultar modal al hacer clic en el botón de cierre
closeModalRegistro.addEventListener('click', function() {
	modalRegistro.setAttribute('hidden', '');
});

// Ocultar modal al hacer clic en "Cancelar" (si existe)
if (cancelarRegistro) {
	cancelarRegistro.addEventListener('click', function() {
		modalRegistro.setAttribute('hidden', '');
	});
}

const today = new Date();
const formattedDate = today.toISOString().split('T')[0]; // yyyy-mm-dd
document.getElementById('fechaSubasta').value = formattedDate;

// Estado de la aplicación
const appStateTransactions = {
    notificationTimeout: null, // Para controlar el timeout de las notificaciones
    isEditing: false, // Para controlar si estamos editando o agregando
    searchTerm: "", // Término de búsqueda para filtrar transacciones
    currentClientId: null, // ID del cliente actual
}

// Función para mostrar u ocultar campos adicionales cuando se selecciona 'otros'
function toggleAdditionalFields() {
    // Para el campo Empresa Vehículo
    empresaVehiculoSelect.addEventListener('change', function() {
        if (this.value === 'otros') {
            nombreEmpresaVehiculoDiv.removeAttribute('hidden');
            nombreEmpresaVehiculoInput.setAttribute('required', 'required');
        } else {
            nombreEmpresaVehiculoDiv.setAttribute('hidden', '');
            nombreEmpresaVehiculoInput.removeAttribute('required');
            nombreEmpresaVehiculoInput.value = ''; // Limpiar el campo
        }
    });

    // Para el campo Entidad Financiera
    entidadFinancieraSelect.addEventListener('change', function() {
        if (this.value === 'otros') {
            nombreEntidadFinancieraDiv.removeAttribute('hidden');
            nombreEntidadFinancieraInput.setAttribute('required', 'required');
        } else {
            nombreEntidadFinancieraDiv.setAttribute('hidden', '');
            nombreEntidadFinancieraInput.removeAttribute('required');
            nombreEntidadFinancieraInput.value = ''; // Limpiar el campo
        }
    });
}

// Función para obtener parámetros de la URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Función para cargar datos del cliente desde la URL
function loadClientData() {
    const clientId = getUrlParameter('clientId');
    
    if (clientId) {
        appStateTransactions.currentClientId = clientId;
        
        // Obtener datos del cliente desde el store
        const client = window.clientStore.getById(clientId);
        
        if (client) {
            // Actualizar los campos en la vista details.html
            document.getElementById('client-name').textContent = client.razonSocial;
            document.getElementById('client-email').textContent = client.correo;
            document.getElementById('client-email').href = `mailto:${client.correo}`;
            document.getElementById('client-tipo-documento').textContent = `${client.tipoDocumento.toUpperCase()}:`;
            document.getElementById('client-numero-documento').textContent = client.numeroDocumento;
        }

        // Ocultar el botón de nuevo movimiento si el cliente esta inactivo
        if (!client.activo) {
            btnNuevoMovimiento.setAttribute('hidden', '');
        }
    }
}

// Inicializar la funcionalidad cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    toggleAdditionalFields();
    loadClientData(); // Cargar datos del cliente al iniciar la página
});
