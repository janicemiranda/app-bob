// Elementos del DOM
const btnNuevoMovimiento = document.getElementById('btnNuevoMovimiento');
const modalRegistro = document.getElementById('modalRegistro');
const closeModalRegistro = document.getElementById('closeModalRegistro');
const cancelarRegistro = document.getElementById('cancelarRegistro');


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
document.getElementById('fecha').value = formattedDate;

// Estado de la aplicación
const appStateTransactions = {
    notificationTimeout: null, // Para controlar el timeout de las notificaciones
    isEditing: false, // Para controlar si estamos editando o agregando
    searchTerm: "", // Término de búsqueda para filtrar transacciones
}



