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
    resetTransactionForm();
    document.querySelector('#modalRegistro h2').textContent = 'Nueva Garantía';
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
    clientId: null, // ID del cliente actual
    balanceChart: null // Referencia al objeto chart
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
        appStateTransactions.clientId = clientId;
        
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

/**
 * Funciones CRUD para Transacciones
 */

// Crear nueva transacción
function addTransaction(transactionData) {
    const newTransaction = new Transaction(
        null, // El ID se generará automáticamente
        appStateTransactions.clientId, // ID del cliente actual
        transactionData.movimiento, // tipo: Ingreso o Egreso
        transactionData.placaVehiculo,
        transactionData.empresaVehiculo === 'otros' ? transactionData.nombreEmpresaVehiculo : transactionData.empresaVehiculo,
        transactionData.fechaSubasta,
        transactionData.moneda, // PEN o USD
        parseFloat(transactionData.importe), // Convertir a número
        transactionData.nombreEntidadFinanciera === 'otros' ? transactionData.nombreEntidadFinancieraOtros : transactionData.nombreEntidadFinanciera,
        transactionData.numeroCuenta,
        transactionData.comentario,
        transactionData.datosFacturacionNumero, // Documento facturación (RUC/DNI)
        transactionData.datosFacturacionNombre, // Nombre facturación
        transactionData.movimiento === 'ingreso' ? 'Pendiente' : 'Devuelto' // Estado inicial
    );
    window.transactionStore.add(newTransaction);
    
    // Actualizar saldo del cliente según el tipo de transacción
    updateClientBalance(newTransaction);
    
    return newTransaction;
}

// Actualizar transacción existente
function updateTransaction(id, transactionData) {
    // Obtener transacción actual para comparar montos anteriores
    const currentTransaction = window.transactionStore.getById(id);
    
    // Revertir el balance anterior
    if (currentTransaction) {
        revertClientBalance(currentTransaction);
    }
    
    // Crear objeto con datos actualizados
    const updatedData = {
        tipo: transactionData.movimiento,
        placaVehiculo: transactionData.placaVehiculo,
        empresaVehiculo: transactionData.empresaVehiculo === 'otros' ? transactionData.nombreEmpresaVehiculo : transactionData.empresaVehiculo,
        fechaSubasta: transactionData.fechaSubasta,
        moneda: transactionData.moneda,
        monto: parseFloat(transactionData.importe),
        banco: transactionData.nombreEntidadFinanciera === 'otros' ? transactionData.nombreEntidadFinancieraOtros : transactionData.nombreEntidadFinanciera,
        numCuentaDeposito: transactionData.numeroCuenta,
        concepto: transactionData.comentario,
        dtFacDocumento: transactionData.datosFacturacionNumero,
        dtNroFacDocumento: transactionData.datosFacturacionNombre,
        updatedAt: new Date()
    };
    
    // Actualizar en el store
    const result = window.transactionStore.update(id, updatedData);
    
    // Actualizar saldo del cliente con la nueva transacción
    if (result) {
        updateClientBalance(result);
    }
    
    return result;
}

// Eliminar transacción
function deleteTransaction(id) {
    // Obtener transacción actual
    const transaction = window.transactionStore.getById(id);
    
    if (transaction) {
        // Revertir el balance del cliente
        revertClientBalance(transaction);
        
        // Eliminar la transacción completamente
        window.transactionStore.remove(id);
        return true;
    }
    
    return false;
}

// Cambiar estado de la transacción a "Pagado"
function changeTransactionToPaid(id) {
    const transaction = window.transactionStore.getById(id);
    
    if (!transaction) return null;
    
    // Actualizar el estado de la transacción a "Facturado"
    return window.transactionStore.update(id, {
        estado: 'Facturado',
        updatedAt: new Date()
    });
}

// Obtener todas las transacciones del cliente actual
function getClientTransactions() {
    if (!appStateTransactions.clientId) return [];
    
    return window.transactionStore.getState().filter(
        transaction => transaction.clienteId === appStateTransactions.clientId
    );
}

// Obtener transacción por ID
function getTransactionById(id) {
    return window.transactionStore.getById(id);
}

// Actualizar el saldo del cliente basado en la transacción
function updateClientBalance(transaction) {
    if (!transaction.activo) return; // No actualizar si la transacción está inactiva
    
    const client = window.clientStore.getById(transaction.clienteId);
    if (!client) return;
    
    const amount = parseFloat(transaction.monto);
    
    // Calcular nuevo saldo basado en moneda y tipo de transacción
    if (transaction.moneda === 'pen') {
        if (transaction.tipo === 'ingreso' && transaction.estado === 'Pendiente') {
            client.saldoSoles += amount;
        }
    } else if (transaction.moneda === 'usd') {
        if (transaction.tipo === 'ingreso' && transaction.estado === 'Pendiente') {
            client.saldoDolares += amount;
        }
    }
    // Actualizar cliente en el store
    window.clientStore.update(client.id, {
        saldoSoles: client.saldoSoles,
        saldoDolares: client.saldoDolares,
        updatedAt: new Date()
    });
}

// Revertir el saldo del cliente (para actualizaciones o eliminaciones)
function revertClientBalance(transaction) {
    if (!transaction.activo) return; // No revertir si ya estaba inactiva
    
    const client = window.clientStore.getById(transaction.clienteId);
    if (!client) return;
    
    const amount = parseFloat(transaction.monto);
    
    // Revertir el efecto de la transacción
    if (transaction.moneda === 'pen') {
        if (transaction.tipo === 'ingreso') {
            client.saldoSoles -= amount;
        } else if (transaction.tipo === 'egreso') {
            client.saldoSoles += amount;
        }
    } else if (transaction.moneda === 'usd') {
        if (transaction.tipo === 'ingreso') {
            client.saldoDolares -= amount;
        } else if (transaction.tipo === 'egreso') {
            client.saldoDolares += amount;
        }
    }
    
    // Actualizar cliente en el store
    window.clientStore.update(client.id, {
        saldoSoles: client.saldoSoles,
        saldoDolares: client.saldoDolares,
        updatedAt: new Date()
    });
}

/**
 * Funciones de UI para Transacciones
 */

// Renderizar tabla de transacciones
function renderTransactionTable() {
    const transactions = getClientTransactions();
    const transactionsTableBody = document.getElementById('clientesTableBody'); // El ID de la tabla en details.html
    
    transactionsTableBody.innerHTML = '';
    
    if (transactions.length === 0) {
        transactionsTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="px-4 py-3 text-center text-gray-500">
                    No hay transacciones registradas para este cliente
                </td>
            </tr>
        `;
        return;
    }
    
    // Ordenar transacciones por fecha (más reciente primero)
    transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        
        // Formatear fecha
        const fecha = new Date(transaction.fechaSubasta);
        const fechaFormateada = fecha.toLocaleDateString('es-ES');
        
        // Formatear importe con 2 decimales
        const importeFormateado = parseFloat(transaction.monto).toFixed(2);
        
        // Contenido de la fila
        row.innerHTML = `
            <td class="px-4 py-3">${transaction.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}</td>
            <td class="px-4 py-3">${fechaFormateada}</td>
            <td class="px-4 py-3">${transaction.banco.toUpperCase()}</td>
            <td class="px-4 py-3">${transaction.numCuentaDeposito}</td>
            <td class="px-4 py-3">${transaction.moneda === 'pen' ? 'Soles' : 'Dólares'}</td>
            <td class="px-4 py-3 font-medium ${transaction.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}">
                ${transaction.moneda === 'pen' ? 'S/' : '$'} ${importeFormateado}
            </td>
            <td class="px-4 py-3 ${transaction.estado === 'Facturado' ? 'text-green-600' : transaction.estado === 'Devuelto' ? 'text-red-600' : 'text-orange-600'}">${transaction.estado}</td>
            <td class="px-4 py-3">
                <div class="flex space-x-2">
                    
                    ${transaction.estado == 'Pendiente' ? 
                    `
                    <button class="text-blue-600 hover:text-blue-800" data-action="edit-transaction" data-id="${transaction.id}" title="Editar Transacción">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </button>
                    <button class="text-green-600 hover:text-green-800" data-action="change-state" data-id="${transaction.id}" title="Marcar como Pagado">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <button class="text-amber-600 hover:text-amber-800" data-action="devolver-transaction" data-id="${transaction.id}" title="Devolver Garantía">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                        </svg>
                    </button>
                    <button class="text-red-600 hover:text-red-800" data-action="delete-transaction" data-id="${transaction.id}" title="Eliminar Transacción">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                    ` : 
                    `
                    <button class="text-blue-600 hover:text-blue-800" data-action="detalle-transaction" data-id="${transaction.id}" title="Editar Transacción">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                    `
                    }
                </div>
            </td>
        `;
        
        transactionsTableBody.appendChild(row);
    });
    
    // Actualizar totales
    updateTotals(transactions);
}

// Actualizar totales mostrados en los contadores superiores
function updateTotals(transactions) {
    let totalIngresosSoles = 0;
    let totalIngresosDolares = 0;
    let totalEgresosSoles = 0;
    let totalEgresosDolares = 0;
    let totalGarantiasSoles = 0;
    let totalGarantiasDolares = 0;
    transactions.forEach(transaction => {
        if (!transaction.activo) return;
        
        const monto = parseFloat(transaction.monto);
        
        // Calcular ingresos y egresos totales (para todos los estados)
        if (transaction.moneda === 'pen') {
            if (transaction.tipo === 'ingreso') {
                totalIngresosSoles += monto;
            } else if (transaction.tipo === 'egreso') {
                totalEgresosSoles += monto;
            }
        } else if (transaction.moneda === 'usd') {
            if (transaction.tipo === 'ingreso') {
                totalIngresosDolares += monto;
            } else if (transaction.tipo === 'egreso') {
                totalEgresosDolares += monto;
            }
        }
        
        // Calcular garantías facturadas (solo estado "Facturado")
        if (transaction.estado === 'Facturado') {
            if (transaction.moneda === 'pen') {
                if (transaction.tipo === 'ingreso') {
                    totalGarantiasSoles += monto;
                } else if (transaction.tipo === 'egreso') {
                    totalGarantiasSoles -= monto;
                }
            } else if (transaction.moneda === 'usd') {
                if (transaction.tipo === 'ingreso') {
                    totalGarantiasDolares += monto;
                } else if (transaction.tipo === 'egreso') {
                    totalGarantiasDolares -= monto;
                }
            }
        }
    });
    
    // Calcular balance total (ingresos - egresos)
    const balanceSoles = totalIngresosSoles - totalEgresosSoles - totalGarantiasSoles;
    const balanceDolares = totalIngresosDolares - totalEgresosDolares - totalGarantiasDolares;
    
    // Actualizar los elementos HTML con los totales
    document.getElementById('total-balance-soles').textContent = balanceSoles.toFixed(2);
    document.getElementById('total-balance-dolares').textContent = balanceDolares.toFixed(2);
    document.getElementById('total-garantias-soles').textContent = totalGarantiasSoles.toFixed(2);
    document.getElementById('total-garantias-dolares').textContent = totalGarantiasDolares.toFixed(2);
    
    // Actualizar el gráfico de balance (balance sin las garantías facturadas)
    const totalSoles = balanceSoles;
    const totalDolares = balanceDolares;
    updateBalanceChart(totalSoles, totalDolares);
    debugger
    // Actualizar cliente en el store
    window.clientStore.update(appStateTransactions.clientId, {
        saldoSoles: balanceSoles,
        saldoDolares: balanceDolares,
        updatedAt: new Date()
    });
}

// Crear y actualizar el gráfico circular de balance
function updateBalanceChart(saldoSoles, saldoDolares) {
    const ctx = document.getElementById('balanceChart');
    
    if (!ctx) return; // Salir si el canvas no existe
    
    // Destruir el gráfico anterior si existe
    if (appStateTransactions.balanceChart) {
        appStateTransactions.balanceChart.destroy();
    }
    
    // Convertir dólares a soles para el total (usando un tipo de cambio aproximado)
    const tipoCambio = 3.7; // Tipo de cambio aproximado
    const saldoDolaresEnSoles = saldoDolares * tipoCambio;
    const totalEnSoles = saldoSoles + saldoDolaresEnSoles;
    
    // Calcular porcentajes para el gráfico
    let porcentajeSoles = 0;
    let porcentajeDolares = 0;
    
    if (totalEnSoles > 0) {
        porcentajeSoles = (saldoSoles / totalEnSoles) * 100;
        porcentajeDolares = (saldoDolaresEnSoles / totalEnSoles) * 100;
    }
    
    // Configurar datos para el gráfico
    const data = {
        labels: [
            `Soles: S/ ${saldoSoles.toFixed(2)} (${porcentajeSoles.toFixed(1)}%)`,
            `Dólares: $ ${saldoDolares.toFixed(2)} (${porcentajeDolares.toFixed(1)}%)`
        ],
        datasets: [{
            data: [saldoSoles, saldoDolaresEnSoles],
            backgroundColor: [
                'rgba(54, 162, 235, 0.8)',   // Azul para Soles
                'rgba(255, 159, 64, 0.8)'    // Naranja para Dólares
            ],
            borderColor: [
                'rgb(54, 162, 235)',
                'rgb(255, 159, 64)'
            ],
            borderWidth: 1,
            hoverOffset: 15
        }]
    };
    
    // Configurar opciones del gráfico
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Balance Total',
                font: {
                    size: 16
                }
            },
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 15
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        return label;
                    }
                }
            }
        }
    };
    
    // Crear el gráfico
    appStateTransactions.balanceChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });
}

// Manejar envío del formulario de transacción
function handleTransactionFormSubmit(event) {
    event.preventDefault();
    
    // Obtener datos del formulario
    const formData = new FormData(event.target);
    const transactionData = {
        movimiento: formData.get('movimiento').trim(),
        placaVehiculo: formData.get('placaVehiculo').trim(),
        empresaVehiculo: formData.get('empresaVehiculo').trim(),
        nombreEmpresaVehiculo: formData.get('nombreEmpresaVehiculo').trim(),
        fechaSubasta: formData.get('fechaSubasta').trim(),
        moneda: formData.get('moneda').trim(),
        importe: formData.get('importe').trim(),
        nombreEntidadFinanciera: formData.get('nombreEntidadFinanciera').trim(),
        nombreEntidadFinancieraOtros: formData.get('nombreEntidadFinancieraOtros').trim(),
        numeroCuenta: formData.get('numeroCuenta').trim(),
        datosFacturacionNumero: formData.get('datosFacturacionNumero').trim(),
        datosFacturacionNombre: formData.get('datosFacturacionNombre').trim(),
        comentario: formData.get('comentario').trim()
    };
    
    // Validar campos obligatorios
    if (!transactionData.movimiento) {
        showNotification('El campo Movimiento es obligatorio', 'error');
        return;
    }
    
    if (!transactionData.placaVehiculo) {
        showNotification('El campo Placa del Vehículo es obligatorio', 'error');
        return;
    }
    
    if (!transactionData.empresaVehiculo) {
        showNotification('El campo Empresa del Vehículo es obligatorio', 'error');
        return;
    }
    
    // Validar que si se seleccionó "otros" en empresa, se ingrese el nombre
    if (transactionData.empresaVehiculo === 'otros' && !transactionData.nombreEmpresaVehiculo) {
        showNotification('Debe ingresar el Nombre de la Empresa del Vehículo', 'error');
        return;
    }
    
    if (!transactionData.fechaSubasta) {
        showNotification('El campo Fecha de Subasta es obligatorio', 'error');
        return;
    }
    
    if (!transactionData.moneda) {
        showNotification('El campo Moneda es obligatorio', 'error');
        return;
    }
    
    if (!transactionData.importe) {
        showNotification('El campo Importe es obligatorio', 'error');
        return;
    }

    if (transactionData.importe <= 0) {
        showNotification('El campo Importe debe ser mayor a 0', 'error');
        return;
    }
    
    if (!transactionData.nombreEntidadFinanciera) {
        showNotification('El campo Entidad Financiera es obligatorio', 'error');
        return;
    }
    
    // Validar que si se seleccionó "otros" en entidad financiera, se ingrese el nombre
    if (transactionData.nombreEntidadFinanciera === 'otros' && !transactionData.nombreEntidadFinancieraOtros) {
        showNotification('Debe ingresar el Nombre de la Entidad Financiera', 'error');
        return;
    }
    
    if (!transactionData.numeroCuenta) {
        showNotification('El campo Número de Cuenta es obligatorio', 'error');
        return;
    }
    
    if (!transactionData.datosFacturacionNumero) {
        showNotification('El campo RUC/DNI Facturación es obligatorio', 'error');
        return;
    }
    
    if (!transactionData.datosFacturacionNombre) {
        showNotification('El campo Nombre Facturación es obligatorio', 'error');
        return;
    }
    
    if (appStateTransactions.isEditing) {
        // Actualizar transacción existente
        updateTransaction(appStateTransactions.currentTransactionId, transactionData);
        showNotification('Transacción actualizada correctamente', 'success');
    } else {
        // Crear nueva transacción
        addTransaction(transactionData);
        showNotification('Transacción registrada correctamente', 'success');
    }
    
    // Cerrar modal y actualizar tabla
    modalRegistro.setAttribute('hidden', '');
    resetTransactionForm();
    renderTransactionTable();
}

// Cargar datos de transacción en el formulario para edición
function editTransaction(id) {
    const transaction = getTransactionById(id);
    if (!transaction) return;
    
    // Resetear el formulario primero para asegurar que todos los campos estén habilitados
    resetTransactionForm();

    // Cambiar estado de la aplicación
    appStateTransactions.isEditing = true;
    appStateTransactions.currentTransactionId = id;
    
    // Cambiar título del modal
    document.querySelector('#modalRegistro h2').textContent = 'Editar Garantía';
    // Llenar el formulario con los datos de la transacción
    document.getElementById('movimiento').value = transaction.tipo;
    document.getElementById('placaVehiculo').value = transaction.placaVehiculo;
    
    // Manejar campo de empresa
    if (['santander', 'acceso'].includes(transaction.empresaVehiculo)) {
        document.getElementById('empresaVehiculo').value = transaction.empresaVehiculo;
        nombreEmpresaVehiculoDiv.setAttribute('hidden', '');
    } else {
        document.getElementById('empresaVehiculo').value = 'otros';
        nombreEmpresaVehiculoDiv.removeAttribute('hidden');
        document.getElementById('nombreEmpresaVehiculo').value = transaction.empresaVehiculo;
    }
    
    document.getElementById('fechaSubasta').value = transaction.fechaSubasta;
    document.getElementById('moneda').value = transaction.moneda;
    document.getElementById('importe').value = transaction.monto;
    
    // Manejar campo de entidad financiera
    if (['bcp', 'interbank'].includes(transaction.banco)) {
        document.getElementById('nombreEntidadFinanciera').value = transaction.banco;
        nombreEntidadFinancieraDiv.setAttribute('hidden', '');
    } else {
        document.getElementById('nombreEntidadFinanciera').value = 'otros';
        nombreEntidadFinancieraDiv.removeAttribute('hidden');
        document.getElementById('nombreEntidadFinancieraInput').value = transaction.banco;
    }
    
    document.getElementById('numeroCuenta').value = transaction.numCuentaDeposito;
    document.getElementById('datosFacturacionNumero').value = transaction.dtFacDocumento;
    document.getElementById('datosFacturacionNombre').value = transaction.dtNroFacDocumento;
    document.getElementById('comentario').value = transaction.concepto;
    
    // Mostrar modal
    modalRegistro.removeAttribute('hidden');
}

// Resetear formulario de transacción
function resetTransactionForm() {
    document.getElementById('formRegistro').reset();
    document.getElementById('fechaSubasta').value = formattedDate;
    
    // Ocultar campos adicionales
    nombreEmpresaVehiculoDiv.setAttribute('hidden', '');
    nombreEntidadFinancieraDiv.setAttribute('hidden', '');
    
    // Resetear estado
    appStateTransactions.isEditing = false;
    appStateTransactions.currentTransactionId = null;

    // Restaurar título del modal
    document.querySelector('#modalRegistro h2').textContent = 'Detalle Garantía';
    
    // Habilitar todos los campos del formulario
    const formElements = document.getElementById('formRegistro').elements;
    for (let i = 0; i < formElements.length; i++) {
        formElements[i].disabled = false;
    }
    
    // Mostrar botón de guardar y restaurar texto del botón cancelar
    const submitButton = document.querySelector('#formRegistro button[type="submit"]');
    if (submitButton) submitButton.style.display = '';
    
    const cancelButton = document.getElementById('cancelarRegistro');
    if (cancelButton) cancelButton.textContent = 'Cancelar';
}
// Función para mostrar notificaciones temporales
function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    if (!notification || !notificationMessage) return;
    
    // Limpiar timeout anterior si existe
    if (appStateTransactions.notificationTimeout) {
        clearTimeout(appStateTransactions.notificationTimeout);
    }
    
    // Establecer el mensaje
    notificationMessage.textContent = message;
    
    // Remuevo cualquier clase de tipo anterior
    notification.classList.remove('bg-emerald-500', 'bg-red-500', 'bg-amber-500');
    
    // Aplicar clases según el tipo de notificación
    if (type === 'error') {
        notification.classList.add('bg-red-500');
        // Cambiar el ícono para error
        const svgIcon = notification.querySelector('svg');
        if (svgIcon) {
            svgIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
        }
    } else if (type === 'warning') {
        notification.classList.add('bg-amber-500');
        // Cambiar ícono para advertencia
        const svgIcon = notification.querySelector('svg');
        if (svgIcon) {
            svgIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />';
        }
    } else {
        // Por defecto, success
        notification.classList.add('bg-emerald-500');
        // Restaurar el ícono de éxito
        const svgIcon = notification.querySelector('svg');
        if (svgIcon) {
            svgIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />';
        }
    }
    
    // Remuevo el hidden
    notification.classList.remove('hidden');
    
    // Ocultar después del tiempo especificado
    appStateTransactions.notificationTimeout = setTimeout(() => {
        notification.classList.add('hidden');
    }, duration);
}

// Confirmar eliminación de transacción
function confirmDeleteTransaction(id) {
    const transaction = getTransactionById(id);
    if (!transaction) return;
    
    // Preparar el modal
    document.getElementById('eliminar-transaction-id').value = id;
    
    // Mostrar modal
    const modal = document.getElementById('eliminar-transaccion-modal');
    modal.classList.remove('hidden');
}

// Confirmar cambio de estado a Pagado
function confirmChangeTransactionState(id) {
    const transaction = getTransactionById(id);
    if (!transaction) return;
    
    // Preparar el modal
    document.getElementById('estado-transaction-id').value = id;
    
    // Mostrar modal
    const modal = document.getElementById('cambiar-estado-modal');
    modal.classList.remove('hidden');
}

//visualización (solo lectura)
function viewTransactionDetails(id) {
    const transaction = getTransactionById(id);
    if (!transaction) return;
    
    // Cambiar título del modal
    document.querySelector('#modalRegistro h2').textContent = 'Detalle de Garantía';
    
    // Llenar el formulario con los datos de la transacción
    document.getElementById('movimiento').value = transaction.tipo;
    document.getElementById('placaVehiculo').value = transaction.placaVehiculo;
    
    // Manejar campo de empresa
    if (['santander', 'acceso'].includes(transaction.empresaVehiculo)) {
        document.getElementById('empresaVehiculo').value = transaction.empresaVehiculo;
        nombreEmpresaVehiculoDiv.setAttribute('hidden', '');
    } else {
        document.getElementById('empresaVehiculo').value = 'otros';
        nombreEmpresaVehiculoDiv.removeAttribute('hidden');
        document.getElementById('nombreEmpresaVehiculo').value = transaction.empresaVehiculo;
    }
    
    document.getElementById('fechaSubasta').value = transaction.fechaSubasta;
    document.getElementById('moneda').value = transaction.moneda;
    document.getElementById('importe').value = transaction.monto;
    
    // Manejar campo de entidad financiera
    if (['bcp', 'interbank'].includes(transaction.banco)) {
        document.getElementById('nombreEntidadFinanciera').value = transaction.banco;
        nombreEntidadFinancieraDiv.setAttribute('hidden', '');
    } else {
        document.getElementById('nombreEntidadFinanciera').value = 'otros';
        nombreEntidadFinancieraDiv.removeAttribute('hidden');
        document.getElementById('nombreEntidadFinancieraInput').value = transaction.banco;
    }
    
    document.getElementById('numeroCuenta').value = transaction.numCuentaDeposito;
    document.getElementById('datosFacturacionNumero').value = transaction.dtFacDocumento;
    document.getElementById('datosFacturacionNombre').value = transaction.dtNroFacDocumento;
    document.getElementById('comentario').value = transaction.concepto;
    
    // Deshabilitar todos los campos del formulario
    const formElements = document.getElementById('formRegistro').elements;
    for (let i = 0; i < formElements.length; i++) {
        formElements[i].disabled = true;
    }
    
    // Ocultar botón de guardar y cambiar texto del botón cancelar a "Cerrar"
    const submitButton = document.querySelector('#formRegistro button[type="submit"]');
    if (submitButton) submitButton.style.display = 'none';
    
    const cancelButton = document.getElementById('cancelarRegistro');
    if (cancelButton) {
        cancelButton.textContent = 'Cerrar';
        cancelButton.disabled = false;
    }
    // Mostrar modal
    modalRegistro.removeAttribute('hidden');
}

// Agregar event listeners para las acciones de la tabla
function setupTransactionTableListeners() {
    // Listener para botones en la tabla de transacciones
    document.getElementById('clientesTableBody').addEventListener('click', function(event) {
        const actionButton = event.target.closest('[data-action]');
        if (!actionButton) return;
        
        const action = actionButton.dataset.action;
        const id = actionButton.dataset.id;
        
        if (action === 'edit-transaction') {
            editTransaction(id);
        } else if (action === 'delete-transaction') {
            confirmDeleteTransaction(id);
        } else if (action === 'change-state') {
            confirmChangeTransactionState(id);
        } else if (action === 'devolver-transaction') {
            confirmDevolverTransaction(id);
        } else if (action === 'detalle-transaction') {
            viewTransactionDetails(id);
        }
        
    });
    
    // Listeners para modal de eliminación
    document.getElementById('close-eliminar-modal').addEventListener('click', function() {
        document.getElementById('eliminar-transaccion-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-eliminar').addEventListener('click', function() {
        document.getElementById('eliminar-transaccion-modal').classList.add('hidden');
    });
    
    document.getElementById('confirm-eliminar').addEventListener('click', function() {
        const id = document.getElementById('eliminar-transaction-id').value;
        
        if (deleteTransaction(id)) {
            showNotification('Transacción eliminada correctamente');
            renderTransactionTable();
        } else {
            showNotification('Error al eliminar la transacción', 'error');
        }
        
        document.getElementById('eliminar-transaccion-modal').classList.add('hidden');
    });
    
    // Listeners para modal de cambio de estado
    document.getElementById('close-estado-modal').addEventListener('click', function() {
        document.getElementById('cambiar-estado-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-estado').addEventListener('click', function() {
        document.getElementById('cambiar-estado-modal').classList.add('hidden');
    });
    
    document.getElementById('confirm-estado').addEventListener('click', function() {
        const id = document.getElementById('estado-transaction-id').value;
        
        if (changeTransactionToPaid(id)) {
            showNotification('Estado de transacción actualizado a Pagado');
            renderTransactionTable();
        } else {
            showNotification('Error al actualizar el estado de la transacción', 'error');
        }
        
        document.getElementById('cambiar-estado-modal').classList.add('hidden');
    });
    
    // Listeners para modal de devolución de garantía
    document.getElementById('close-devolver-modal').addEventListener('click', function() {
        document.getElementById('devolver-transaccion-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-devolver').addEventListener('click', function() {
        document.getElementById('devolver-transaccion-modal').classList.add('hidden');
    });
    
    document.getElementById('confirm-devolver').addEventListener('click', function() {
        const id = document.getElementById('devolver-transaction-id').value;
        
        if (devolverTransaction(id)) {
            showNotification('Garantía devuelta correctamente');
            renderTransactionTable();
        } else {
            showNotification('Error al devolver la garantía', 'error');
        }
        
        document.getElementById('devolver-transaccion-modal').classList.add('hidden');
    });
}

// Inicializar el store de transacciones
function initTransactionStore() {
    if (!window.transactionStore) {
        window.transactionStore = new Store('transactions', loadTransactions, saveTransactions);
    }
}

// Función para renderizar el historial de egresos
function renderEgresosHistory(clientId) {
    const egresos = getClienteEgresos(clientId);
    const tableBody = document.getElementById('historial-egresos-table-body');
    const noEgresosMessage = document.getElementById('no-egresos-message');
    
    tableBody.innerHTML = '';
    
    if (egresos.length === 0) {
        tableBody.innerHTML = '';
        noEgresosMessage.classList.remove('hidden');
        return;
    }
    
    noEgresosMessage.classList.add('hidden');
    
    // Ordenar egresos por fecha (más reciente primero)
    egresos.sort((a, b) => new Date(b.fechaHoraEgreso) - new Date(a.fechaHoraEgreso));
    
    egresos.forEach(egreso => {
        const row = document.createElement('tr');
        
        // Formatear fecha
        const fecha = new Date(egreso.fechaHoraEgreso);
        const fechaFormateada = fecha.toLocaleDateString('es-ES') + ' ' + fecha.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Formatear importe con 2 decimales
        const importeFormateado = parseFloat(egreso.importeDevolver).toFixed(2);
        
        // Contenido de la fila
        row.innerHTML = `
            <td class="px-4 py-3">${fechaFormateada}</td>
            <td class="px-4 py-3">${egreso.idGarantia}</td>
            <td class="px-4 py-3">${egreso.moneda === 'pen' ? 'Soles' : 'Dólares'}</td>
            <td class="px-4 py-3 font-medium text-red-600">
                ${egreso.moneda === 'pen' ? 'S/' : '$'} ${importeFormateado}
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la funcionalidad de campos adicionales
    toggleAdditionalFields();
    // Cargar datos del cliente
    loadClientData();
    // Inicializar el store de transacciones
    initTransactionStore();
    // Renderizar tabla de transacciones y actualizar gráfico
    renderTransactionTable();
    // Configurar listeners para la tabla y modales
    setupTransactionTableListeners();
    // Configurar listener para el formulario
    document.getElementById('formRegistro').addEventListener('submit', handleTransactionFormSubmit);
    
    // Configurar listeners para el historial de egresos
    document.getElementById('btn-historial-egresos').addEventListener('click', function() {
        // Cargar historial de egresos
        renderEgresosHistory(appStateTransactions.clientId);
        // Mostrar el modal
        document.getElementById('historial-egresos-modal').classList.remove('hidden');
    });
    
    document.getElementById('close-historial-modal').addEventListener('click', function() {
        document.getElementById('historial-egresos-modal').classList.add('hidden');
    });
    
    document.getElementById('close-historial-btn').addEventListener('click', function() {
        document.getElementById('historial-egresos-modal').classList.add('hidden');
    });
});
// Función para devolver garantía
function devolverTransaction(id) {
    const transactions = getClientTransactions();
    const transaction = getTransactionById(id);
    if (!transaction) return false;
    
    const montoDevolver = parseFloat(document.getElementById('monto-devolver').value);
    
    if (isNaN(montoDevolver) || montoDevolver <= 0) {
        showNotification('Por favor, ingrese un monto válido', 'error');
        return false;
    }
    
    // Verificar que el monto a devolver no sea mayor que el monto de la garantía
    if (montoDevolver > parseFloat(transaction.monto)) {
        showNotification('El monto a devolver no puede ser mayor que el monto de la garantía', 'error');
        return false;
    }
    
    // Si es una devolución parcial, actualizar el monto
    let nuevoMonto = parseFloat(transaction.monto) - montoDevolver;
    let nuevoEstado = nuevoMonto <= 0 ? 'Devuelto' : transaction.estado;
    
    // Guardar el registro de egreso (devolución)
    saveEgreso({
        id: generateUniqueId(),
        idGarantia: id,
        idCliente: transaction.clienteId,
        importeDevolver: montoDevolver,
        fechaHoraEgreso: new Date().toISOString(),
        moneda: transaction.moneda
    });
    
    // Actualizar el estado y monto de la transacción
    const updated = window.transactionStore.update(id, {
        estado: nuevoEstado,
        monto: nuevoMonto.toFixed(2),
        updatedAt: new Date().toISOString()
    });
    
    if (updated) {
        updateTotals(transactions);
        return true;
    }
    
    return false;
}

// Confirmar devolución de garantía
function confirmDevolverTransaction(id) {
    const transaction = getTransactionById(id);
    if (!transaction) return;
    
    // Preparar el modal
    document.getElementById('devolver-transaction-id').value = id;
    document.getElementById('monto-devolver').value = transaction.monto;
    
    // Mostrar modal
    const modal = document.getElementById('devolver-transaccion-modal');
    modal.classList.remove('hidden');
}

// Función para guardar egresos en localStorage
function saveEgreso(egreso) {
    let egresos = getEgresos();
    egresos.push(egreso);
    localStorage.setItem('Egresos', JSON.stringify(egresos));
}

// Función para obtener egresos de localStorage
function getEgresos() {
    const egresos = localStorage.getItem('Egresos');
    return egresos ? JSON.parse(egresos) : [];
}

// Función para obtener egresos de un cliente específico
function getClienteEgresos(idCliente) {
    const egresos = getEgresos();
    return egresos.filter(egreso => egreso.idCliente === idCliente);
}

// Función para generar un ID único
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}