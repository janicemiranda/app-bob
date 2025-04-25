// Selectors for the mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

// Event listener for the mobile menu toggle
menuToggle.addEventListener('click', () => {
	mobileMenu.classList.toggle('hidden');
});

// Minor function to update the current date in the dashboard
const meses = [
	'Enero',
	'Febrero',
	'Marzo',
	'Abril',
	'Mayo',
	'Junio',
	'Julio',
	'Agosto',
	'Septiembre',
	'Octubre',
	'Noviembre',
	'Diciembre',
];
const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function setFechaActual() {
	const hoy = new Date();
	const diaSemana = dias[hoy.getDay()];
	const dia = hoy.getDate();
	const mes = meses[hoy.getMonth()];
	const año = hoy.getFullYear();

	const fechaFormateada = `${diaSemana} ${dia} de ${mes} ${año}`;
	document.getElementById('current-date').textContent = fechaFormateada;
}

setFechaActual();
