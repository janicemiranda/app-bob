document.addEventListener('DOMContentLoaded', function () {
	// Elementos del DOM
	const btnNuevoCliente = document.getElementById('btnNuevoCliente');
	const modalRegistroClients = document.getElementById('modalRegistroClients');
	const closeModalRegistroClients = document.getElementById('closeModalRegistroClients');
	const cancelarRegistroClients = document.getElementById('cancelarRegistroClients');


	// Mostrar modal al hacer clic en "Nuevo Cliente"
	btnNuevoCliente.addEventListener('click', function() {
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
});



