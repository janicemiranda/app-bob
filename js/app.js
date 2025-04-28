// Dashboard selectors
const totalClienteStats = document.getElementById('totalClientes');
const totalClientesHoy = document.getElementById('clientesHoy');
const totalGarantias = document.getElementById('totalGarantias');
const totalGarantiasHoy = document.getElementById('garantiasHoy');
const ingresosSoles = document.getElementById('ingreso-soles');
const ingresosDolares = document.getElementById('ingreso-dolares');
const egresoSoles = document.getElementById('egreso-soles');
const egresosDolares = document.getElementById('egreso-dolares');
const pieChartCanvasSoles = document.getElementById('chartPen');
const pieChartCanvasDollars = document.getElementById('chartUsd');
const fechaActual = document.getElementById('current-date');

// Selectors for the mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

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

// Event listener for the mobile menu toggle
menuToggle.addEventListener('click', () => {
	mobileMenu.classList.toggle('hidden');
});

// Función para obtener el año, mes y día actuales
function getYearMonthDay() {
	const today = new Date(); // Crear un objeto Date con la fecha y hora actuales
	const day = today.getDate(); // Obtener el día del mes (1-31)
	const month = today.getMonth(); // Obtener el mes actual
	const year = today.getFullYear(); // Obtener el año completo
	return { year, month, day }; // Retornar un objeto con el año, mes y día
}

// Función para establecer y mostrar la fecha actual en un formato específico
function setFechaActual() {
	const hoy = new Date(); // Obtener la fecha actual
	const today = getYearMonthDay(); // Llamar a la función getYearMonthDay para obtener el año, mes y día
	const diaSemana = dias[hoy.getDay()]; // Obtener el nombre del día de la semana
	const mes = meses[today.month]; // Obtener el nombre del mes
	const fechaFormateada = `${diaSemana} ${today.day} de ${mes} ${today.year}`;
	fechaActual.textContent = fechaFormateada;
}

// Función para actualizar el contador de transacciones totales
function updateTotalTransactionsCounter() {
	// Verificar si el store de transacciones existe
	if (window.transactionStore) {
		// Obtener todas las transacciones del store
		const allTransactions = window.transactionStore.getState();

		// Actualizar el contador si el elemento existe
		if (totalGarantias) {
			totalGarantias.textContent = allTransactions.length;
		}
	} else {
		// Mostrar advertencia si el store de transacciones no ha sido inicializada
		console.warn('Transaction store not initialized yet');
	}
}

// Función para obtener y mostrar las transacciones de hoy
function updateTodaysTransactionsCounter() {
	// Verificar si el store de transacciones existe
	if (window.transactionStore) {
		// Obtener todas las transacciones del store
		const allTransactions = window.transactionStore.getState();

		// Obtener los componentes de la fecha actual
		const today = getYearMonthDay();

		// Filtrar las transacciones de hoy
		const todaysTransactions = allTransactions.filter((transaction) => {
			// Convertir la fecha de la transacción a un objeto Date
			const transactionDate = new Date(transaction.createdAt);
			// Comparar la fecha de la transacción con la fecha de hoy
			return (
				transactionDate.getDate() === today.day &&
				transactionDate.getMonth() === today.month &&
				transactionDate.getFullYear() === today.year
			);
		});

		// Actualizar el contador si el elemento existe
		if (totalGarantiasHoy) {
			totalGarantiasHoy.textContent = todaysTransactions.length;
		}
	} else {
		// Mostrar advertencia si el store de transacciones no ha sido inicializada
		console.warn('Transaction store not initialized yet');
	}
}

// // Función para mostrar el total de ingresos
// function displayIngresos() {
// 	// Inicializar las variables para almacenar los totales de ingresos en Soles (PEN) y Dólares (USD)
// 	let totalSoles = 0;
// 	let totalDolares = 0;

// 	// Verificar si existe el store de transacciones
// 	if (window.transactionStore) {
// 		// Obtener el estado de todas las transacciones desde el store
// 		const allTransactions = window.transactionStore.getState();

// 		// Iterar sobre todas las transacciones
// 		allTransactions.forEach((transaction) => {
// 			// Solo considerar las transacciones de tipo 'ingreso'
// 			if (transaction.tipo === 'ingreso') {
// 				// Si la moneda es 'pen', agregar el monto a totalSoles
// 				if (transaction.moneda === 'pen') {
// 					totalSoles += transaction.monto;
// 				}
// 				// Si la moneda es 'usd', agregar el monto a totalDolares
// 				else if (transaction.moneda === 'usd') {
// 					totalDolares += transaction.monto;
// 				}
// 			}
// 		});
// 	}

// 	// Actualizar los elementos del DOM con los totales de ingresos en Soles y Dólares
// 	if (ingresosSoles) ingresosSoles.textContent = totalSoles.toFixed(2);
// 	if (ingresosDolares) ingresosDolares.textContent = totalDolares.toFixed(2);
// }

// // Función para mostrar el total de egresos
// function displayEgresos() {
// 	// Inicializar las variables para almacenar los totales de egresos en Soles (PEN) y Dólares (USD)
// 	let totalSoles = 0;
// 	let totalDolares = 0;

// 	// Verificar si existe el store de transacciones
// 	if (window.transactionStore) {
// 		// Obtener el estado de todas las transacciones desde el store
// 		const allTransactions = window.transactionStore.getState();

// 		// Iterar sobre todas las transacciones
// 		allTransactions.forEach((transaction) => {
// 			// Solo considerar las transacciones de tipo 'egreso'
// 			if (transaction.tipo === 'egreso') {
// 				// Si la moneda es 'pen', agregar el monto a totalSoles
// 				if (transaction.moneda === 'pen') {
// 					totalSoles += transaction.monto;
// 				}
// 				// Si la moneda es 'usd', agregar el monto a totalDolares
// 				else if (transaction.moneda === 'usd') {
// 					totalDolares += transaction.monto;
// 				}
// 			}
// 		});
// 	}

// 	// Actualizar los elementos del DOM con los totales de egresos en Soles y Dólares
// 	if (egresoSoles) egresoSoles.textContent = totalSoles.toFixed(2);
// 	if (egresosDolares) egresosDolares.textContent = totalDolares.toFixed(2);
// }

function displayIngresos() {
	// Initialize variables to store totals for ingresos in Soles (PEN) and Dollars (USD)
	let totalSoles = 0;
	let totalDolares = 0;

	// Verify if the transaction store exists
	if (window.transactionStore) {
		// Get the state of all transactions from the store
		const allTransactions = window.transactionStore.getState();

		// Iterate over all transactions
		allTransactions.forEach((transaction) => {
			// Only consider transactions of type 'ingreso'
			if (transaction.tipo === 'ingreso' && transaction.moneda && transaction.monto) {
				// If the currency is 'pen', add the amount to totalSoles
				if (transaction.moneda.toLowerCase() === 'pen') {
					totalSoles += parseFloat(transaction.monto) || 0;
				}
				// If the currency is 'usd', add the amount to totalDolares
				else if (transaction.moneda.toLowerCase() === 'usd') {
					totalDolares += parseFloat(transaction.monto) || 0;
				}
			}
		});
	}

	// Update the DOM elements with the totals for ingresos in Soles and Dollars
	const ingresoSolesElement = document.getElementById('ingreso-soles');
	const ingresoDolaresElement = document.getElementById('ingreso-dolares');

	if (ingresoSolesElement) ingresoSolesElement.textContent = totalSoles.toFixed(2);
	if (ingresoDolaresElement) ingresoDolaresElement.textContent = totalDolares.toFixed(2);
}

function displayEgresos() {
	// Initialize variables to store totals for egresos in Soles (PEN) and Dollars (USD)
	let totalSoles = 0;
	let totalDolares = 0;

	// Verify if the transaction store exists
	if (window.transactionStore) {
		// Get the state of all transactions from the store
		const allTransactions = window.transactionStore.getState();

		// Iterate over all transactions
		allTransactions.forEach((transaction) => {
			// Only consider transactions of type 'egreso'
			if (transaction.tipo === 'egreso' && transaction.moneda && transaction.monto) {
				// If the currency is 'pen', add the amount to totalSoles
				if (transaction.moneda.toLowerCase() === 'pen') {
					totalSoles += parseFloat(transaction.monto) || 0;
				}
				// If the currency is 'usd', add the amount to totalDolares
				else if (transaction.moneda.toLowerCase() === 'usd') {
					totalDolares += parseFloat(transaction.monto) || 0;
				}
			}
		});
	}

	// Update the DOM elements with the totals for egresos in Soles and Dollars
	const egresoSolesElement = document.getElementById('egreso-soles');
	const egresoDolaresElement = document.getElementById('egreso-dolares');

	if (egresoSolesElement) egresoSolesElement.textContent = totalSoles.toFixed(2);
	if (egresoDolaresElement) egresoDolaresElement.textContent = totalDolares.toFixed(2);
}

// Función para obtener transacciones y filtrarlas según su moneda (PEN/USD)
function getTransactionsByCurrency(transactions, currency) {
	return transactions.filter((transaction) => transaction.moneda === currency);
}

// Función para actualizar los gráficos de pastel para Ingresos vs Egresos en PEN y USD
// function updateIngresosEgresosCharts(transactions) {
// 	// Variables para almacenar el total de ingresos y egresos por cada moneda
// 	let totalIngresosSoles = 0;
// 	let totalEgresosSoles = 0;
// 	let totalIngresosDollars = 0;
// 	let totalEgresosDollars = 0;

// 	// Filtrar y sumar las transacciones de 'ingreso' y 'egreso' para cada moneda
// 	const ingresosSoles = getTransactionsByCurrency(transactions, 'pen').filter(
// 		(transaction) => transaction.tipo === 'ingreso'
// 	);
// 	const egresosSoles = getTransactionsByCurrency(transactions, 'pen').filter(
// 		(transaction) => transaction.tipo === 'egreso'
// 	);
// 	const ingresosDollars = getTransactionsByCurrency(transactions, 'usd').filter(
// 		(transaction) => transaction.tipo === 'ingreso'
// 	);
// 	const egresosDollars = getTransactionsByCurrency(transactions, 'usd').filter(
// 		(transaction) => transaction.tipo === 'egreso'
// 	);

// 	// Sumar el total de ingresos y egresos para PEN
// 	ingresosSoles.forEach((transaction) => (totalIngresosSoles += transaction.monto));
// 	egresosSoles.forEach((transaction) => (totalEgresosSoles += transaction.monto));

// 	// Sumar el total de ingresos y egresos para USD
// 	ingresosDollars.forEach((transaction) => (totalIngresosDollars += transaction.monto));
// 	egresosDollars.forEach((transaction) => (totalEgresosDollars += transaction.monto));

// 	// Preparar los datos para los gráficos (Ingresos vs Egresos)
// 	const ingresosEgresosDataPEN = {
// 		labels: ['Ingresos', 'Egresos'],
// 		datasets: [
// 			{
// 				data: [totalIngresosSoles, totalEgresosSoles],
// 				backgroundColor: ['#86EFAC', '#FCA5A5'], // Verde para Ingresos, Rojo para Egresos
// 			},
// 		],
// 	};

// 	const ingresosEgresosDataUSD = {
// 		labels: ['Ingresos', 'Egresos'],
// 		datasets: [
// 			{
// 				data: [totalIngresosDollars, totalEgresosDollars],
// 				backgroundColor: ['#86EFAC', '#FCA5A5'], // Amarillo para Ingresos, Naranja para Egresos
// 			},
// 		],
// 	};

// 	// Renderizar el gráfico para PEN (Ingresos vs Egresos)
// 	if (pieChartCanvasSoles) {
// 		new Chart(pieChartCanvasSoles, {
// 			type: 'pie',
// 			data: ingresosEgresosDataPEN,
// 			options: {
// 				responsive: true,
// 				plugins: {
// 					legend: {
// 						position: 'top',
// 					},
// 					tooltip: {
// 						callbacks: {
// 							label: function (tooltipItem) {
// 								// Mostrar el monto de cada sector en el gráfico con dos decimales
// 								return `${tooltipItem.label}: S/. ${tooltipItem.raw.toFixed(2)}`;
// 							},
// 						},
// 					},
// 				},
// 			},
// 		});
// 	}

// 	// Renderizar el gráfico para USD (Ingresos vs Egresos)
// 	if (pieChartCanvasDollars) {
// 		new Chart(pieChartCanvasDollars, {
// 			type: 'pie',
// 			data: ingresosEgresosDataUSD,
// 			options: {
// 				responsive: true,
// 				plugins: {
// 					legend: {
// 						position: 'top',
// 					},
// 					tooltip: {
// 						callbacks: {
// 							label: function (tooltipItem) {
// 								// Mostrar el monto de cada sector en el gráfico con dos decimales
// 								return `${tooltipItem.label}: $ ${tooltipItem.raw.toFixed(2)}`;
// 							},
// 						},
// 					},
// 				},
// 			},
// 		});
// 	}
// }
// Function to update the pie charts for Ingresos vs Egresos in PEN and USD
function updateIngresosEgresosCharts(transactions) {
	// Variables to store the total amounts for ingresos and egresos in PEN and USD
	let totalIngresosSoles = 0;
	let totalEgresosSoles = 0;
	let totalIngresosDollars = 0;
	let totalEgresosDollars = 0;

	// Iterate over all transactions to calculate totals
	transactions.forEach((transaction) => {
		if (transaction.moneda && transaction.monto) {
			const monto = parseFloat(transaction.monto) || 0;
			if (transaction.moneda.toLowerCase() === 'pen') {
				if (transaction.tipo === 'ingreso') {
					totalIngresosSoles += monto;
				} else if (transaction.tipo === 'egreso') {
					totalEgresosSoles += monto;
				}
			} else if (transaction.moneda.toLowerCase() === 'usd') {
				if (transaction.tipo === 'ingreso') {
					totalIngresosDollars += monto;
				} else if (transaction.tipo === 'egreso') {
					totalEgresosDollars += monto;
				}
			}
		}
	});

	// Prepare the data for PEN (Soles)
	const ingresosEgresosDataPEN = {
		labels: ['Ingresos', 'Egresos'],
		datasets: [
			{
				data: [totalIngresosSoles, totalEgresosSoles],
				backgroundColor: ['#86EFAC', '#FCA5A5'], // Green and Red
			},
		],
	};

	// Prepare the data for USD
	const ingresosEgresosDataUSD = {
		labels: ['Ingresos', 'Egresos'],
		datasets: [
			{
				data: [totalIngresosDollars, totalEgresosDollars],
				backgroundColor: ['#86EFAC', '#FCA5A5'],
			},
		],
	};

	// Destroy existing charts if needed to avoid overlapping (optional, in case you update frequently)
	if (window.solesChart) {
		window.solesChart.destroy();
	}
	if (window.dollarsChart) {
		window.dollarsChart.destroy();
	}

	// Render the chart for PEN (Soles)
	if (pieChartCanvasSoles) {
		window.solesChart = new Chart(pieChartCanvasSoles, {
			type: 'pie',
			data: ingresosEgresosDataPEN,
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: 'top',
					},
					tooltip: {
						callbacks: {
							label: function (tooltipItem) {
								return `${tooltipItem.label}: S/. ${tooltipItem.raw.toFixed(2)}`;
							},
						},
					},
				},
			},
		});
	}

	// Render the chart for USD (Dollars)
	if (pieChartCanvasDollars) {
		window.dollarsChart = new Chart(pieChartCanvasDollars, {
			type: 'pie',
			data: ingresosEgresosDataUSD,
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: 'top',
					},
					tooltip: {
						callbacks: {
							label: function (tooltipItem) {
								return `${tooltipItem.label}: $ ${tooltipItem.raw.toFixed(2)}`;
							},
						},
					},
				},
			},
		});
	}
}

document.addEventListener('DOMContentLoaded', () => {
	// Obtener el total de clientes
	const clients = window.getAllClients();
	const totalClients = clients ? clients.length : 0;

	// Actualizar el elemento del DOM con el total de clientes
	if (totalClienteStats) {
		totalClienteStats.textContent = totalClients;
	}
	if (totalClientesHoy) {
		const today = getYearMonthDay();
		// Filtrar los clientes que se registraron hoy
		const clientsToday = clients.filter((client) => {
			const clientDate = new Date(client.createdAt);
			return (
				clientDate.getDate() === today.day &&
				clientDate.getMonth() === today.month &&
				clientDate.getFullYear() === today.year
			);
		});
		// Actualizar el contador de clientes registrados hoy
		totalClientesHoy.textContent = clientsToday.length;
	}

	// Verificar si hay transacciones existe
	if (!window.transactionStore) {
		// Si no existe, crear una nueva store de transacciones
		window.transactionStore = new Store('transactions', loadTransactions, saveTransactions);
	}
	// Si el store de transacciones está inicializada
	if (window.transactionStore) {
		const allTransactions = window.transactionStore.getState();

		// Actualizar los gráficos de Ingresos vs Egresos para PEN y USD
		updateIngresosEgresosCharts(allTransactions);
	} else {
		console.warn('Transacciones no está inicializada aún');
	}
	// Establecer la fecha actual en el dashboard
	setFechaActual();
	// Actualizar el contador de transacciones totales
	updateTotalTransactionsCounter();
	// Actualizar el contador de transacciones de hoy
	updateTodaysTransactionsCounter();
	// Mostrar los ingresos totales
	displayIngresos();
	// Mostrar los egresos totales
	displayEgresos();
});
