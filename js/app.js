// Dashboard Gerencial - Configuración inicial y utilidades
// =================================================================

// Configuración de fechas y formateo
const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Selectores del Dashboard
const dashboardSelectors = {
  // Fechas y filtros
  currentDate: document.getElementById('current-date'),
  dateRangePicker: document.getElementById('date-range-picker'),
  
  // KPIs principales
  totalClientes: document.getElementById('totalClientes'),
  totalGarantias: document.getElementById('totalGarantias'),
  ingresoSoles: document.getElementById('ingreso-soles'),
  ingresoDolares: document.getElementById('ingreso-dolares'),
  
  // Indicadores de variación
  clientesVariacion: document.getElementById('clientes-variacion'),
  garantiasVariacion: document.getElementById('garantias-variacion'),
  ingresoSolesVariacion: document.getElementById('ingreso-soles-variacion'),
  ingresoDolaresVariacion: document.getElementById('ingreso-dolares-variacion'),
  
  // Estadísticas de garantías
  garantiasPendientes: document.getElementById('garantiasPendientes'),
  garantiasFacturadas: document.getElementById('garantiasFacturadas'),
  garantiasHoy: document.getElementById('garantiasHoy'),
  
  // Total ingresos
  totalIngresosPen: document.getElementById('total-ingresos-pen'),
  totalIngresosUsd: document.getElementById('total-ingresos-usd'),
  
  // Ingresos facturados
  ingresoFacturadasPen: document.getElementById('ingreso-facturadas-pen'),
  ingresoFacturadasUsd: document.getElementById('ingreso-facturadas-usd'),
  
  // Egresos
  egresoSoles: document.getElementById('egreso-soles'),
  egresoDolares: document.getElementById('egreso-dolares'),
  
  // Gráficos
  estadoGarantiasChart: document.getElementById('estadoGarantiasChart'),
  rendimientoFinancieroChart: document.getElementById('rendimientoFinancieroChart'),
  topClientesChart: document.getElementById('topClientesChart'),
  topClientesUSDChart: document.getElementById('topClientesUSDChart'), // Agregado selector para gráfico de top clientes USD
  topClientesPENChart: document.getElementById('topClientesPENChart'), // Agregado selector para gráfico de top clientes PEN
  chartPen: document.getElementById('chartPen'),
  chartUsd: document.getElementById('chartUsd'),
  
  // Gráficos de tendencia mini
  clientesTendencia: document.getElementById('clientes-tendencia'),
  garantiasTendencia: document.getElementById('garantias-tendencia'),
  ingresoSolesTendencia: document.getElementById('ingreso-soles-tendencia'),
  ingresoDolaresTendencia: document.getElementById('ingreso-dolares-tendencia')
};

// Colores para gráficos
const chartColors = {
  primary: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'],
  success: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'],
  warning: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'],
  danger: ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'],
  neutral: ['#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6']
};

// Variables globales para mantener el estado
let filteredDateRange = {
  startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
  endDate: new Date()
};

// Funciones de utilidad
// =================================================================

// Función para obtener el año, mes y día actuales
function getYearMonthDay(date = new Date()) {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return { year, month, day };
}

// Función para dar formato a las fechas
function formatDate(date) {
  const { day, month, year } = getYearMonthDay(date);
  const diaSemana = dias[date.getDay()];
  const mes = meses[month];
  return `${diaSemana} ${day} de ${mes} ${year}`;
}

// Función para establecer la fecha actual en el dashboard
function setFechaActual() {
  const hoy = new Date();
  dashboardSelectors.currentDate.textContent = formatDate(hoy);
}

// Función para cargar datos del localStorage
function loadFromLocalStorage(key, defaultValue = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error al cargar ${key} desde localStorage:`, error);
    return defaultValue;
  }
}

// Función para filtrar datos por rango de fechas
function filterDataByDateRange(data, startDate, endDate, dateField = 'createdAt') {
  return data.filter(item => {
    const itemDate = new Date(item[dateField]);
    return itemDate >= startDate && itemDate <= endDate;
  });
}

// Función para calcular variación porcentual
function calcularVariacionPorcentual(valorActual, valorAnterior) {
  if (!valorAnterior) return 0;
  return ((valorActual - valorAnterior) / valorAnterior) * 100;
}

// Función para formatear montos con dos decimales
function formatearMonto(monto) {
  return parseFloat(monto).toFixed(2);
}

// Funciones para obtener datos específicos
// =================================================================

// Función para obtener todos los clientes
function getClientes() {
  return loadFromLocalStorage('clients', []);
}

// Función para obtener todas las transacciones
function getTransacciones() {
  return loadFromLocalStorage('transactions', []);
}

// Función para obtener todos los egresos
function getEgresos() {
  return loadFromLocalStorage('Egresos', []);
}

// Función para obtener clientes registrados hoy
function getClientesHoy() {
  const clientes = getClientes();
  const today = getYearMonthDay();
  
  return clientes.filter(cliente => {
    const clienteDate = new Date(cliente.createdAt);
    return (
      clienteDate.getDate() === today.day &&
      clienteDate.getMonth() === today.month &&
      clienteDate.getFullYear() === today.year
    );
  });
}

// Función para obtener transacciones creadas hoy
function getTransaccionesHoy() {
  const transacciones = getTransacciones();
  const today = getYearMonthDay();
  
  return transacciones.filter(transaccion => {
    const transaccionDate = new Date(transaccion.createdAt);
    return (
      transaccionDate.getDate() === today.day &&
      transaccionDate.getMonth() === today.month &&
      transaccionDate.getFullYear() === today.year
    );
  });
}

// Función para calcular estadísticas de transacciones
function calcularEstadisticasTransacciones(transacciones) {
  const stats = {
    pendientesPEN: 0,
    pendientesUSD: 0,
    facturadasPEN: 0,
    facturadasUSD: 0,
    totalIngresoPEN: 0,
    totalIngresoUSD: 0,
    contadorPendientes: 0,
    contadorFacturadas: 0
  };
  
  transacciones.forEach(transaccion => {
    if (transaccion.tipo === 'ingreso' && transaccion.moneda && transaccion.monto) {
      const monto = parseFloat(transaccion.monto) || 0;
      
      if (transaccion.estado == "Pendiente") {
        stats.contadorPendientes++;
        if (transaccion.moneda.toLowerCase() === 'pen') {
          stats.pendientesPEN += monto;
          stats.totalIngresoPEN += monto;
        } else if (transaccion.moneda.toLowerCase() === 'usd') {
          stats.pendientesUSD += monto;
          stats.totalIngresoUSD += monto;
        }
      } else if (transaccion.estado == "Facturado") {
        stats.contadorFacturadas++;
        if (transaccion.moneda.toLowerCase() === 'pen') {
          stats.facturadasPEN += monto;
          stats.totalIngresoPEN += monto;
        } else if (transaccion.moneda.toLowerCase() === 'usd') {
          stats.facturadasUSD += monto;
          stats.totalIngresoUSD += monto;
        }
      }
    }
  });
  
  return stats;
}

// Función para calcular estadísticas de egresos
function calcularEstadisticasEgresos(egresos) {
  const stats = {
    totalEgresoPEN: 0,
    totalEgresoUSD: 0
  };
  
  egresos.forEach(egreso => {
    if (egreso.importeDevolver && egreso.fechaHoraEgreso) {
      const monto = parseFloat(egreso.importeDevolver) || 0;
      
      if (egreso.moneda.toLowerCase() === 'pen') {
        stats.totalEgresoPEN += monto;
      } else if (egreso.moneda.toLowerCase() === 'usd') {
        stats.totalEgresoUSD += monto;
      }
    }
  });
  
  return stats;
}

// Función para calcular datos para el top 5 de clientes
function calcularTopClientes(clientes, transacciones) {
  // Crear un mapa para sumar los montos por cliente
  const montosPorCliente = new Map();
  
  // Sumar los montos de transacciones para cada cliente
  transacciones.forEach(transaccion => {
	if(transaccion.estado == "Pendiente")
	{
		if (transaccion.clienteId && transaccion.monto) {
			const monto = parseFloat(transaccion.monto) || 0;
			const clienteId = transaccion.clienteId;
			
			if (montosPorCliente.has(clienteId)) {
			  montosPorCliente.set(clienteId, montosPorCliente.get(clienteId) + monto);
			} else {
			  montosPorCliente.set(clienteId, monto);
			}
		  }
	}
  });
  
  // Convertir el mapa a un array de objetos
  const clientesConMontos = Array.from(montosPorCliente.entries()).map(([clienteId, monto]) => {
    const cliente = clientes.find(c => c.id === clienteId) || { razonSocial: 'Cliente Desconocido' };
    return {
      id: clienteId,
      nombre: cliente.razonSocial,
      monto
    };
  });
  
  // Ordenar clientes por monto (de mayor a menor) y tomar los primeros 5
  return clientesConMontos.sort((a, b) => b.monto - a.monto).slice(0, 5);
}

// Función para calcular datos para el top 5 de clientes por moneda
function calcularTopClientesPorMoneda(clientes, transacciones, moneda) {
  // Crear un mapa para sumar los montos por cliente
  const montosPorCliente = new Map();
  
  // Sumar los montos de transacciones para cada cliente
  transacciones.forEach(transaccion => {
	if(transaccion.estado == "Pendiente")
	{
		if (transaccion.clienteId && transaccion.monto && transaccion.moneda.toLowerCase() === moneda.toLowerCase()) {
			const monto = parseFloat(transaccion.monto) || 0;
			const clienteId = transaccion.clienteId;
			
			if (montosPorCliente.has(clienteId)) {
			  montosPorCliente.set(clienteId, montosPorCliente.get(clienteId) + monto);
			} else {
			  montosPorCliente.set(clienteId, monto);
			}
		  }
	}
  });
  
  // Convertir el mapa a un array de objetos
  const clientesConMontos = Array.from(montosPorCliente.entries()).map(([clienteId, monto]) => {
    const cliente = clientes.find(c => c.id === clienteId) || { razonSocial: 'Cliente Desconocido' };
    return {
      id: clienteId,
      nombre: cliente.razonSocial,
      monto
    };
  });
  
  // Ordenar clientes por monto (de mayor a menor) y tomar los primeros 5
  return clientesConMontos.sort((a, b) => b.monto - a.monto).slice(0, 5);
}

// Función para obtener datos agrupados por mes para gráficos de rendimiento
function obtenerDatosPorMes(transacciones, egresos) {
  // Preparar estructura para almacenar datos mensuales
  const datosMensuales = {};
  
  // Procesar transacciones (ingresos)
  transacciones.forEach(transaccion => {
    if (transaccion.tipo === 'ingreso' && transaccion.monto && transaccion.createdAt) {
      const fecha = new Date(transaccion.createdAt);
      const key = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
      const monto = parseFloat(transaccion.monto) || 0;
      
      if (!datosMensuales[key]) {
        datosMensuales[key] = {
          mes: meses[fecha.getMonth()],
          año: fecha.getFullYear(),
          ingresosPEN: 0,
          ingresosUSD: 0,
          egresosPEN: 0,
          egresosUSD: 0
        };
      }
      
      if (transaccion.moneda.toLowerCase() === 'pen') {
        datosMensuales[key].ingresosPEN += monto;
      } else if (transaccion.moneda.toLowerCase() === 'usd') {
        datosMensuales[key].ingresosUSD += monto;
      }
    }
  });
  
  // Procesar egresos
  egresos.forEach(egreso => {
    if (egreso.importeDevolver && egreso.fechaHoraEgreso) {
      const fecha = new Date(egreso.fechaHoraEgreso);
      const key = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
      const monto = parseFloat(egreso.importeDevolver) || 0;
      
      if (!datosMensuales[key]) {
        datosMensuales[key] = {
          mes: meses[fecha.getMonth()],
          año: fecha.getFullYear(),
          ingresosPEN: 0,
          ingresosUSD: 0,
          egresosPEN: 0,
          egresosUSD: 0
        };
      }
      
      if (egreso.moneda.toLowerCase() === 'pen') {
        datosMensuales[key].egresosPEN += monto;
      } else if (egreso.moneda.toLowerCase() === 'usd') {
        datosMensuales[key].egresosUSD += monto;
      }
    }
  });
  
  // Convertir objeto a array ordenado por fecha
  const datosOrdenados = Object.values(datosMensuales).sort((a, b) => {
    return new Date(`${a.año}-${meses.indexOf(a.mes) + 1}-01`) - new Date(`${b.año}-${meses.indexOf(b.mes) + 1}-01`);
  });
  
  // Tomar los últimos 6 meses o lo que haya disponible
  return datosOrdenados.slice(-6);
}

// Funciones para visualización y gráficos
// =================================================================

// Función para actualizar todos los KPIs
function actualizarKPIs() {
	// Obtener datos
	const clientes = getClientes();
	const transacciones = getTransacciones();
	const egresos = getEgresos();
	
	// Filtrar por rango de fechas seleccionado
	const transaccionesFiltradas = filterDataByDateRange(transacciones, filteredDateRange.startDate, filteredDateRange.endDate);
	const egresosFiltrados = filterDataByDateRange(egresos, filteredDateRange.startDate, filteredDateRange.endDate, 'fechaHoraEgreso');
	
	// Calcular estadísticas
	const statsTransacciones = calcularEstadisticasTransacciones(transaccionesFiltradas);
	const statsEgresos = calcularEstadisticasEgresos(egresosFiltrados);
	
	// Actualizar contadores principales
	if (dashboardSelectors.totalClientes) {
	  dashboardSelectors.totalClientes.textContent = clientes.length;
	}
	
	if (dashboardSelectors.totalGarantias) {
	  dashboardSelectors.totalGarantias.textContent = transacciones.filter(t => t.tipo === 'ingreso').length;
	}
	
	// Actualizar montos en PEN y USD
	if (dashboardSelectors.ingresoSoles) {
	  dashboardSelectors.ingresoSoles.textContent = formatearMonto(statsTransacciones.pendientesPEN);
	}
	
	if (dashboardSelectors.ingresoDolares) {
	  dashboardSelectors.ingresoDolares.textContent = formatearMonto(statsTransacciones.pendientesUSD);
	}
	
	// Ingresos facturados
	if (dashboardSelectors.ingresoFacturadasPen) {
	  dashboardSelectors.ingresoFacturadasPen.textContent = formatearMonto(statsTransacciones.facturadasPEN);
	}
	
	if (dashboardSelectors.ingresoFacturadasUsd) {
	  dashboardSelectors.ingresoFacturadasUsd.textContent = formatearMonto(statsTransacciones.facturadasUSD);
	}
	
	// Estadísticas de garantías
	if (dashboardSelectors.garantiasPendientes) {
	  dashboardSelectors.garantiasPendientes.textContent = statsTransacciones.contadorPendientes;
	}
	
	if (dashboardSelectors.garantiasFacturadas) {
	  dashboardSelectors.garantiasFacturadas.textContent = statsTransacciones.contadorFacturadas;
	}
	
	if (dashboardSelectors.garantiasHoy) {
	  dashboardSelectors.garantiasHoy.textContent = getTransaccionesHoy().filter(t => t.tipo === 'ingreso').length;
	}
	
	// Actualizar montos de ingresos totales
	if (dashboardSelectors.totalIngresosPen) {
	  dashboardSelectors.totalIngresosPen.textContent = formatearMonto(statsTransacciones.pendientesPEN);
	}
	
	if (dashboardSelectors.totalIngresosUsd) {
	  dashboardSelectors.totalIngresosUsd.textContent = formatearMonto(statsTransacciones.pendientesUSD);
	}
	
	// Actualizar montos de egresos
	if (dashboardSelectors.egresoSoles) {
	  dashboardSelectors.egresoSoles.textContent = formatearMonto(statsEgresos.totalEgresoPEN);
	}
	
	if (dashboardSelectors.egresoDolares) {
	  dashboardSelectors.egresoDolares.textContent = formatearMonto(statsEgresos.totalEgresoUSD);
	}
	
	// Actualizar variaciones (comparación con el mes anterior)
	if (dashboardSelectors.clientesVariacion) {
	  // Simulamos una variación para demostración
	  const variacion = Math.random() * 10 - 2; // Valor entre -2 y 8
	  const signo = variacion >= 0 ? '+' : '';
	  dashboardSelectors.clientesVariacion.textContent = `${signo}${variacion.toFixed(1)}% vs mes anterior`;
	}
	
	if (dashboardSelectors.garantiasVariacion) {
	  const variacion = Math.random() * 15 - 5; // Valor entre -5 y 10
	  const signo = variacion >= 0 ? '+' : '';
	  dashboardSelectors.garantiasVariacion.textContent = `${signo}${variacion.toFixed(1)}% vs mes anterior`;
	}
	
	if (dashboardSelectors.ingresoSolesVariacion) {
	  const variacion = Math.random() * 20 - 5; // Valor entre -5 y 15
	  const signo = variacion >= 0 ? '+' : '';
	  dashboardSelectors.ingresoSolesVariacion.textContent = `${signo}${variacion.toFixed(1)}% vs mes anterior`;
	}
	
	if (dashboardSelectors.ingresoDolaresVariacion) {
	  const variacion = Math.random() * 18 - 3; // Valor entre -3 y 15
	  const signo = variacion >= 0 ? '+' : '';
	  dashboardSelectors.ingresoDolaresVariacion.textContent = `${signo}${variacion.toFixed(1)}% vs mes anterior`;
	}
  }
  
  // Función para crear el gráfico de estado de garantías
  function crearGraficoEstadoGarantias() {
	if (!dashboardSelectors.estadoGarantiasChart) return;
	
	// Obtener datos
	const transacciones = getTransacciones();
	const transaccionesFiltradas = filterDataByDateRange(transacciones, filteredDateRange.startDate, filteredDateRange.endDate);
	const stats = calcularEstadisticasTransacciones(transaccionesFiltradas);
	
	// Destruir gráfico existente si lo hay
	try {
	  if (window.estadoGarantiasChart && typeof window.estadoGarantiasChart.destroy === 'function') {
	    window.estadoGarantiasChart.destroy();
	  }
	} catch (error) {
	  console.error('Error al destruir gráfico de estado de garantías:', error);
	  // Eliminar referencia al gráfico en caso de error
	  window.estadoGarantiasChart = null;
	}
	
	// Datos para el gráfico
	const data = {
	  labels: ['Pendientes', 'Facturadas'],
	  datasets: [{
		data: [stats.contadorPendientes, stats.contadorFacturadas],
		backgroundColor: [chartColors.warning[1], chartColors.primary[1]],
		hoverBackgroundColor: [chartColors.warning[0], chartColors.primary[0]],
		borderWidth: 0
	  }]
	};
	
	// Opciones del gráfico
	const options = {
	  responsive: true,
	  maintainAspectRatio: false,
	  plugins: {
		legend: {
		  position: 'bottom',
		  labels: {
			usePointStyle: true,
			padding: 20
		  }
		},
		tooltip: {
		  callbacks: {
			label: function(context) {
			  const label = context.label || '';
			  const value = context.raw || 0;
			  const total = context.dataset.data.reduce((a, b) => a + b, 0);
			  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
			  return `${label}: ${value} (${percentage}%)`;
			}
		  }
		}
	  }
	};
	
	// Crear gráfico
	window.estadoGarantiasChart = new Chart(dashboardSelectors.estadoGarantiasChart, {
	  type: 'doughnut',
	  data: data,
	  options: options
	});
  }
  
  // Función para crear gráfico de rendimiento financiero
  function crearGraficoRendimientoFinanciero() {
	if (!dashboardSelectors.rendimientoFinancieroChart) return;
	
	// Obtener datos
	const transacciones = getTransacciones();
	const egresos = getEgresos();
	const datosMensuales = obtenerDatosPorMes(transacciones, egresos);
	
	// Destruir gráfico existente si lo hay
	try {
	  if (window.rendimientoFinancieroChart && typeof window.rendimientoFinancieroChart.destroy === 'function') {
	    window.rendimientoFinancieroChart.destroy();
	  }
	} catch (error) {
	  console.error('Error al destruir gráfico de rendimiento financiero:', error);
	  // Eliminar referencia al gráfico en caso de error
	  window.rendimientoFinancieroChart = null;
	}
	
	// Preparar datos para el gráfico
	const labels = datosMensuales.map(item => `${item.mes} ${item.año}`);
	const ingresosPEN = datosMensuales.map(item => item.ingresosPEN);
	const ingresosUSD = datosMensuales.map(item => item.ingresosUSD);
	const egresosPEN = datosMensuales.map(item => item.egresosPEN);
	const egresosUSD = datosMensuales.map(item => item.egresosUSD);
	
	// Configuración del gráfico
	const data = {
	  labels: labels,
	  datasets: [
		{
		  label: 'Garantías PEN',
		  data: ingresosPEN,
		  backgroundColor: chartColors.success[1],
		  borderColor: chartColors.success[0],
		  borderWidth: 2,
		  tension: 0.3
		},
		{
		  label: 'Ingresos USD',
		  data: ingresosUSD,
		  backgroundColor: chartColors.warning[1],
		  borderColor: chartColors.warning[0],
		  borderWidth: 2,
		  tension: 0.3
		},
		{
		  label: 'Egresos PEN',
		  data: egresosPEN,
		  backgroundColor: chartColors.primary[1],
		  borderColor: chartColors.primary[0],
		  borderWidth: 2,
		  tension: 0.3
		},
		{
		  label: 'Egresos USD',
		  data: egresosUSD,
		  backgroundColor: chartColors.danger[1],
		  borderColor: chartColors.danger[0],
		  borderWidth: 2,
		  tension: 0.3
		}
	  ]
	};
	
	// Opciones del gráfico
	const options = {
	  responsive: true,
	  maintainAspectRatio: false,
	  scales: {
		y: {
		  beginAtZero: true,
		  grid: {
			drawBorder: false
		  }
		},
		x: {
		  grid: {
			display: false
		  }
		}
	  },
	  plugins: {
		legend: {
		  position: 'bottom',
		  labels: {
			usePointStyle: true,
			padding: 20
		  }
		},
		tooltip: {
		  callbacks: {
			label: function(context) {
			  const label = context.dataset.label || '';
			  const value = context.raw || 0;
			  return `${label}: ${formatearMonto(value)}`;
			}
		  }
		}
	  }
	};
	
	// Crear gráfico
	window.rendimientoFinancieroChart = new Chart(dashboardSelectors.rendimientoFinancieroChart, {
	  type: 'line',
	  data: data,
	  options: options
	});
  }
  
  // Función para crear gráfico de top clientes
  function crearGraficoTopClientes() {
	if (!dashboardSelectors.topClientesChart) return;
	
	// Obtener datos
	const clientes = getClientes();
	const transacciones = getTransacciones();
	
	// Filtrar por rango de fechas seleccionado
	const transaccionesFiltradas = filterDataByDateRange(transacciones, filteredDateRange.startDate, filteredDateRange.endDate);
	
	// Calcular top clientes
	const topClientes = calcularTopClientes(clientes, transaccionesFiltradas);
	
	// Destruir gráfico existente si lo hay
	try {
	  if (window.topClientesChart && typeof window.topClientesChart.destroy === 'function') {
	    window.topClientesChart.destroy();
	  }
	} catch (error) {
	  console.error('Error al destruir gráfico de top clientes:', error);
	  // Eliminar referencia al gráfico en caso de error
	  window.topClientesChart = null;
	}
	
	// Preparar datos para el gráfico
	const nombres = topClientes.map(cliente => cliente.nombre);
	const montos = topClientes.map(cliente => cliente.monto);
	
	// Configuración del gráfico
	const data = {
	  labels: nombres,
	  datasets: [{
		data: montos,
		backgroundColor: [
		  chartColors.primary[0],
		  chartColors.success[0],
		  chartColors.warning[0],
		  chartColors.danger[0],
		  chartColors.neutral[0]
		],
		borderWidth: 0
	  }]
	};
	
	// Opciones del gráfico
	const options = {
	  indexAxis: 'y',
	  responsive: true,
	  maintainAspectRatio: true, // Cambiado a true para respetar las proporciones
	  aspectRatio: 2, // Proporción ancho/alto
	  scales: {
		x: {
		  beginAtZero: true,
		  grid: {
			drawBorder: false
		  }
		},
		y: {
		  grid: {
			display: false
		  },
		  // Limitar el tamaño de las barras
		  ticks: {
			font: {
			  size: 11 // Texto más pequeño
			},
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 5 // Limitar número de ticks mostrados
		  }
		}
	  },
	  layout: {
		padding: {
		  left: 10,
		  right: 25, // Incrementado para acomodar valores más grandes
		  top: 0,
		  bottom: 0
		}
	  },
	  plugins: {
		legend: {
		  display: false
		},
		tooltip: {
		  callbacks: {
			label: function(context) {
			  const value = context.raw || 0;
			  return `Monto: ${formatearMonto(value)}`;
			}
		  }
		}
	  }
	};
	
	// Crear gráfico
	window.topClientesChart = new Chart(dashboardSelectors.topClientesChart, {
	  type: 'bar',
	  data: data,
	  options: options
	});
  }
  
  // Función para crear gráfico de top clientes USD
  function crearGraficoTopClientesUSD() {
	if (!dashboardSelectors.topClientesUSDChart) return;
	
	// Obtener datos
	const clientes = getClientes();
	const transacciones = getTransacciones();
	
	// Filtrar por rango de fechas seleccionado
	const transaccionesFiltradas = filterDataByDateRange(transacciones, filteredDateRange.startDate, filteredDateRange.endDate);
	
	// Calcular top clientes
	const topClientes = calcularTopClientes(clientes, transaccionesFiltradas);
	
	// Filtro para clientes con transacciones en USD
	const topClientesUSD = topClientes.filter(cliente => {
		const clienteTransacciones = transaccionesFiltradas.filter(transaccion => transaccion.clienteId === cliente.id);
		return clienteTransacciones.some(transaccion => transaccion.moneda.toLowerCase() === 'usd');
	});
	
	// Destruir gráfico existente si lo hay
	try {
	  if (window.topClientesUSDChart && typeof window.topClientesUSDChart.destroy === 'function') {
	    window.topClientesUSDChart.destroy();
	  }
	} catch (error) {
	  console.error('Error al destruir gráfico de top clientes USD:', error);
	  // Eliminar referencia al gráfico en caso de error
	  window.topClientesUSDChart = null;
	}
	
	// Preparar datos para el gráfico
	const nombres = topClientesUSD.map(cliente => cliente.nombre);
	const montos = topClientesUSD.map(cliente => {
		const clienteTransacciones = transaccionesFiltradas.filter(transaccion => transaccion.clienteId === cliente.id && transaccion.moneda.toLowerCase() === 'usd');
		return clienteTransacciones.reduce((total, transaccion) => total + parseFloat(transaccion.monto), 0);
	});
	
	// Configuración del gráfico
	const data = {
	  labels: nombres,
	  datasets: [{
		data: montos,
		backgroundColor: [
		  chartColors.primary[0],
		  chartColors.success[0],
		  chartColors.warning[0],
		  chartColors.danger[0],
		  chartColors.neutral[0]
		],
		borderWidth: 0
	  }]
	};
	
	// Opciones del gráfico
	const options = {
	  indexAxis: 'y',
	  responsive: true,
	  maintainAspectRatio: true, // Cambiado a true para respetar las proporciones
	  aspectRatio: 2, // Proporción ancho/alto
	  scales: {
		x: {
		  beginAtZero: true,
		  grid: {
			drawBorder: false
		  }
		},
		y: {
		  grid: {
			display: false
		  },
		  // Limitar el tamaño de las barras
		  ticks: {
			font: {
			  size: 11 // Texto más pequeño
			},
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 5 // Limitar número de ticks mostrados
		  }
		}
	  },
	  layout: {
		padding: {
		  left: 10,
		  right: 25, // Incrementado para acomodar valores más grandes
		  top: 0,
		  bottom: 0
		}
	  },
	  plugins: {
		legend: {
		  display: false
		},
		tooltip: {
		  callbacks: {
			label: function(context) {
			  const value = context.raw || 0;
			  return `Monto: $ ${formatearMonto(value)}`;
			}
		  }
		}
	  }
	};
	
	// Crear gráfico
	window.topClientesUSDChart = new Chart(dashboardSelectors.topClientesUSDChart, {
	  type: 'bar',
	  data: data,
	  options: options
	});
  }
  
  // Función para crear gráfico de top clientes PEN
  function crearGraficoTopClientesPEN() {
	if (!dashboardSelectors.topClientesPENChart) return;
	
	// Obtener datos
	const clientes = getClientes();
	const transacciones = getTransacciones();
	
	// Filtrar por rango de fechas seleccionado
	const transaccionesFiltradas = filterDataByDateRange(transacciones, filteredDateRange.startDate, filteredDateRange.endDate);
	
	// Calcular top clientes PEN
	const topClientes = calcularTopClientesPorMoneda(clientes, transaccionesFiltradas, 'PEN');
	
	// Destruir gráfico existente si lo hay
	try {
	  if (window.topClientesPENChart && typeof window.topClientesPENChart.destroy === 'function') {
	    window.topClientesPENChart.destroy();
	  }
	} catch (error) {
	  console.error('Error al destruir gráfico de top clientes PEN:', error);
	  // Eliminar referencia al gráfico en caso de error
	  window.topClientesPENChart = null;
	}
	
	// Preparar datos para el gráfico
	const nombres = topClientes.map(cliente => cliente.nombre);
	const montos = topClientes.map(cliente => cliente.monto);
	
	// Configuración del gráfico
	const data = {
	  labels: nombres,
	  datasets: [{
		data: montos,
		backgroundColor: [
		  chartColors.primary[0],
		  chartColors.primary[1],
		  chartColors.primary[2],
		  chartColors.primary[3],
		  chartColors.primary[4] || chartColors.neutral[0]
		],
		borderWidth: 0
	  }]
	};
	
	// Opciones del gráfico
	const options = {
	  indexAxis: 'y',
	  responsive: true,
	  maintainAspectRatio: true,
	  aspectRatio: 2,
	  scales: {
		x: {
		  beginAtZero: true,
		  grid: {
			drawBorder: false
		  }
		},
		y: {
		  grid: {
			display: false
		  },
		  ticks: {
			font: {
			  size: 11
			},
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 5
		  }
		}
	  },
	  layout: {
		padding: {
		  left: 10,
		  right: 25,
		  top: 0,
		  bottom: 0
		}
	  },
	  plugins: {
		legend: {
		  display: false
		},
		tooltip: {
		  callbacks: {
			label: function(context) {
			  const value = context.raw || 0;
			  return `Monto: S/ ${formatearMonto(value)}`;
			}
		  }
		}
	  }
	};
	
	// Crear gráfico
	window.topClientesPENChart = new Chart(dashboardSelectors.topClientesPENChart, {
	  type: 'bar',
	  data: data,
	  options: options
	});
  }
  
  // Función para crear gráficos de pie para monedas
  function crearGraficosPorMoneda() {
	// Obtener datos
	const transacciones = getTransacciones();
	const egresos = getEgresos();
	
	// Filtrar por rango de fechas seleccionado
	const transaccionesFiltradas = filterDataByDateRange(transacciones, filteredDateRange.startDate, filteredDateRange.endDate);
	const egresosFiltrados = filterDataByDateRange(egresos, filteredDateRange.startDate, filteredDateRange.endDate, 'fechaHoraEgreso');
	
	// Calcular estadísticas
	const statsTransacciones = calcularEstadisticasTransacciones(transaccionesFiltradas);
	const statsEgresos = calcularEstadisticasEgresos(egresosFiltrados);
	
	// Crear gráfico para PEN
	if (dashboardSelectors.chartPen) {
	  // Destruir gráfico existente si lo hay
	  try {
	    if (window.chartPen && typeof window.chartPen.destroy === 'function') {
	      window.chartPen.destroy();
	    }
	  } catch (error) {
	    console.error('Error al destruir gráfico PEN:', error);
	    // Eliminar referencia al gráfico en caso de error
	    window.chartPen = null;
	  }
	  
	  const dataPEN = {
	    labels: ['Pendientes', 'Facturados', 'Egresos'],
	    datasets: [{
	      data: [
	        statsTransacciones.pendientesPEN,
	        statsTransacciones.facturadasPEN,
	        statsEgresos.totalEgresoPEN
	      ],
	      backgroundColor: [
	        chartColors.warning[1],
	        chartColors.success[1],
	        chartColors.danger[1]
	      ],
	      hoverBackgroundColor: [
	        chartColors.warning[0],
	        chartColors.success[0],
	        chartColors.danger[0]
	      ],
	      borderWidth: 0
	    }]
	  };
	  
	  const optionsPEN = {
	    responsive: true,
	    maintainAspectRatio: false,
	    plugins: {
	      legend: {
	        position: 'bottom',
	        labels: {
	          usePointStyle: true,
	          padding: 20
	        }
	      },
	      tooltip: {
	        callbacks: {
	          label: function(context) {
	            const label = context.label || '';
	            const value = context.raw || 0;
	            return `${label}: S/ ${formatearMonto(value)}`;
	          }
	        }
	      }
	    }
	  };
	  
	  window.chartPen = new Chart(dashboardSelectors.chartPen, {
	    type: 'doughnut',
	    data: dataPEN,
	    options: optionsPEN
	  });
	}
	
	// Crear gráfico para USD
	if (dashboardSelectors.chartUsd) {
	  // Destruir gráfico existente si lo hay
	  try {
	    if (window.chartUsd && typeof window.chartUsd.destroy === 'function') {
	      window.chartUsd.destroy();
	    }
	  } catch (error) {
	    console.error('Error al destruir gráfico USD:', error);
	    // Eliminar referencia al gráfico en caso de error
	    window.chartUsd = null;
	  }
	  
	  const dataUSD = {
	    labels: ['Pendientes', 'Facturados', 'Egresos'],
	    datasets: [{
	      data: [
	        statsTransacciones.pendientesUSD,
	        statsTransacciones.facturadasUSD,
	        statsEgresos.totalEgresoUSD
	      ],
	      backgroundColor: [
	        chartColors.warning[1],
	        chartColors.success[1],
	        chartColors.danger[1]
	      ],
	      hoverBackgroundColor: [
	        chartColors.warning[0],
	        chartColors.success[0],
	        chartColors.danger[0]
	      ],
	      borderWidth: 0
	    }]
	  };
	  
	  const optionsUSD = {
	    responsive: true,
	    maintainAspectRatio: false,
	    plugins: {
	      legend: {
	        position: 'bottom',
	        labels: {
	          usePointStyle: true,
	          padding: 20
	        }
	      },
	      tooltip: {
	        callbacks: {
	          label: function(context) {
	            const label = context.label || '';
	            const value = context.raw || 0;
	            return `${label}: $ ${formatearMonto(value)}`;
	          }
	        }
	      }
	    }
	  };
	  
	  window.chartUsd = new Chart(dashboardSelectors.chartUsd, {
	    type: 'doughnut',
	    data: dataUSD,
	    options: optionsUSD
	  });
	}
  }
  
  // Función para crear mini gráficos de tendencia
  function crearMiniGraficosTendencia() {
	// Obtener datos mensuales para tendencias
	const transacciones = getTransacciones();
	const egresos = getEgresos();
	const datosMensuales = obtenerDatosPorMes(transacciones, egresos);
	
	// Esta función crea un mini gráfico de tendencia
	function crearMiniGrafico(selector, datos, color) {
	  if (!selector) return;
	  
	  // Destruir gráfico existente si lo hay
	  if (window[`mini-${selector.id}`]) {
		window[`mini-${selector.id}`].destroy();
	  }
	  
	  const data = {
		labels: Array(datos.length).fill(''),
		datasets: [{
		  data: datos,
		  backgroundColor: 'transparent',
		  borderColor: color,
		  borderWidth: 2,
		  pointRadius: 0,
		  tension: 0.4
		}]
	  };
	  
	  const options = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
		  x: { display: false },
		  y: { display: false }
		},
		plugins: {
		  legend: { display: false },
		  tooltip: { enabled: false }
		}
	  };
	  
	  window[`mini-${selector.id}`] = new Chart(selector, {
		type: 'line',
		data: data,
		options: options
	  });
	}
	
	// Crear mini gráficos de tendencia
	if (dashboardSelectors.clientesTendencia) {
	  // Simulamos datos de clientes por mes (en un caso real, deberíamos tener estos datos)
	  const clientesPorMes = datosMensuales.map((_, index) => Math.floor(Math.random() * 20) + 10);
	  crearMiniGrafico(dashboardSelectors.clientesTendencia, clientesPorMes, chartColors.primary[0]);
	}
	
	if (dashboardSelectors.garantiasTendencia) {
	  const garantiasPorMes = datosMensuales.map(item => 
		(item.ingresosPEN > 0 || item.ingresosUSD > 0) ? Math.floor(Math.random() * 15) + 5 : 0
	  );
	  crearMiniGrafico(dashboardSelectors.garantiasTendencia, garantiasPorMes, chartColors.success[0]);
	}
	
	if (dashboardSelectors.ingresoSolesTendencia) {
		const ingresosSolesPorMes = datosMensuales.map(item => item.ingresosPEN);
		crearMiniGrafico(dashboardSelectors.ingresoSolesTendencia, ingresosSolesPorMes, '#6366f1'); // Color índigo fijo
	  }
	
	if (dashboardSelectors.ingresoDolaresTendencia) {
	  const ingresosDolaresPorMes = datosMensuales.map(item => item.ingresosUSD);
	  crearMiniGrafico(dashboardSelectors.ingresoDolaresTendencia, ingresosDolaresPorMes, chartColors.warning[0]);
	}
  }
  
  // Función para inicializar el filtro de fechas
function inicializarDateRangePicker() {
	if (!dashboardSelectors.dateRangePicker || typeof $ === 'undefined' || typeof moment === 'undefined') return;
	
	$(dashboardSelectors.dateRangePicker).daterangepicker({
	  startDate: moment(filteredDateRange.startDate),
	  endDate: moment(filteredDateRange.endDate),
	  ranges: {
		'Hoy': [moment(), moment()],
		'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
		'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
		'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
		'Este mes': [moment().startOf('month'), moment().endOf('month')],
		'Mes pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
		'Últimos 6 meses': [moment().subtract(6, 'month'), moment()]
	  },
	  locale: {
		format: 'DD/MM/YYYY',
		applyLabel: 'Aplicar',
		cancelLabel: 'Cancelar',
		customRangeLabel: 'Rango personalizado',
		daysOfWeek: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
		monthNames: meses,
		firstDay: 1
	  }
	}, function(start, end) {
		debugger
	  filteredDateRange.startDate = start.toDate();
	  filteredDateRange.endDate = end.toDate();
	  
	  // Actualizar dashboard con el nuevo rango de fechas
	  actualizarDashboard();
	});
  }
  
  // Función para inicializar el menú móvil
  function inicializarMenuMovil() {
	const menuToggle = document.getElementById('menu-toggle');
	const mobileMenu = document.getElementById('mobile-menu');
	
	if (menuToggle && mobileMenu) {
	  menuToggle.addEventListener('click', () => {
		mobileMenu.classList.toggle('hidden');
	  });
	}
  }
  
  // Función para actualizar todo el dashboard
  function actualizarDashboard() {
  	actualizarKPIs();
  	crearGraficoEstadoGarantias();
  	// crearGraficoRendimientoFinanciero();
  	crearGraficoTopClientes();
  	crearGraficoTopClientesPEN();
  	crearGraficoTopClientesUSD();
  	// crearGraficosPorMoneda(); // Comentado porque se eliminaron estos gráficos del HTML
  	crearMiniGraficosTendencia();
  }
  
  // Inicialización del dashboard
  document.addEventListener('DOMContentLoaded', () => {
	// Establecer la fecha actual
	setFechaActual();
	
	// Inicializar el filtro de fechas
	inicializarDateRangePicker();
	
	// Inicializar menú móvil
	inicializarMenuMovil();
	
	// Actualizar todo el dashboard
	actualizarDashboard();
	
	// Simular actualizaciones periódicas (cada 5 minutos)
	setInterval(actualizarDashboard, 5 * 60 * 1000);
	
	// Escuchar cambios en localStorage para actualizar el dashboard
	window.addEventListener('storage', event => {
	  if (['clients', 'transactions', 'Egresos'].includes(event.key)) {
		actualizarDashboard();
	  }
	});
	
	console.log('Dashboard gerencial inicializado correctamente');
  });
