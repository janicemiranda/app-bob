// Dashboard selectors
const totalClienteStats = document.getElementById('totalClientes');
const totalClientesHoy = document.getElementById('clientesHoy');
const totalGarantias = document.getElementById('totalGarantias');
const totalGarantiasHoy = document.getElementById('garantiasHoy');

// Selectors for the mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

// Event listener for the mobile menu toggle
menuToggle.addEventListener('click', () => {
	mobileMenu.classList.toggle('hidden');
});

function getYearMonthDay() {
	const today = new Date();
	const day = today.getDate();
	const month = today.getMonth(); // 0-based index, matches your meses array
	const year = today.getFullYear();
	return { year, month, day };
}
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
	const today = getYearMonthDay();

	const diaSemana = dias[hoy.getDay()];
	const mes = meses[today.month];

	const fechaFormateada = `${diaSemana} ${today.day} de ${mes} ${today.year}`;
	document.getElementById('current-date').textContent = fechaFormateada;
}

setFechaActual();

function updateTotalTransactionsCounter() {
	// Check if transaction store exists
	if (window.transactionStore) {
		// Get all transactions
		const allTransactions = window.transactionStore.getState();

		// Get the counter element
		const totalGarantiasElement = document.getElementById('totalGarantias');

		// Update the counter if element exists
		if (totalGarantiasElement) {
			totalGarantiasElement.textContent = allTransactions.length;
		}
	} else {
		console.warn('Transaction store not initialized yet');
	}
}

// Function to get and display today's transactions
function updateTodaysTransactionsCounter() {
	// Check if transaction store exists
	if (window.transactionStore) {
		// Get all transactions
		const allTransactions = window.transactionStore.getState();

		// Get today's date components
		const today = getYearMonthDay();

		// Filter transactions for today
		const todaysTransactions = allTransactions.filter((transaction) => {
			const transactionDate = new Date(transaction.createdAt);
			return (
				transactionDate.getDate() === today.day &&
				transactionDate.getMonth() === today.month &&
				transactionDate.getFullYear() === today.year
			);
		});

		// Get the counter element
		const garantiasHoyElement = document.getElementById('garantiasHoy');

		// Update the counter if element exists
		if (garantiasHoyElement) {
			garantiasHoyElement.textContent = todaysTransactions.length;
		}
	} else {
		console.warn('Transaction store not initialized yet');
	}
}

// Function to update the total number of clients
document.addEventListener('DOMContentLoaded', () => {
	// Get the total number of clients
	const clients = window.getAllClients();
	const totalClients = clients ? clients.length : 0;

	// Update the DOM element with the total number of clients
	if (totalClienteStats) {
		totalClienteStats.textContent = totalClients;
	}
	if (totalClientesHoy) {
		const today = getYearMonthDay();
		const clientsToday = clients.filter((client) => {
			const clientDate = new Date(client.createdAt);
			return (
				clientDate.getDate() === today.day &&
				clientDate.getMonth() === today.month &&
				clientDate.getFullYear() === today.year
			);
		});
		totalClientesHoy.textContent = clientsToday.length;
	}

	if (!window.transactionStore) {
		window.transactionStore = new Store('transactions', loadTransactions, saveTransactions);
	}

	// Update the total transactions counter
	updateTotalTransactionsCounter();
	updateTodaysTransactionsCounter();
});
