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

/**
 * Funciones CRUD para Transacciones
 */

// Crear nueva transacción
function addTransaction(transactionData) {
    const newTransaction = new Transaction(
        null, // El ID se generará automáticamente
        appStateTransactions.currentClientId, // ID del cliente actual
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
    if (!appStateTransactions.currentClientId) return [];
    
    return window.transactionStore.getState().filter(
        transaction => transaction.clienteId === appStateTransactions.currentClientId
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
        if (transaction.tipo === 'ingreso') {
            client.saldoSoles += amount;
        } else if (transaction.tipo === 'egreso') {
            client.saldoSoles -= amount;
        }
    } else if (transaction.moneda === 'usd') {
        if (transaction.tipo === 'ingreso') {
            client.saldoDolares += amount;
        } else if (transaction.tipo === 'egreso') {
            client.saldoDolares -= amount;
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
                    <button class="text-blue-600 hover:text-blue-800" data-action="edit-transaction" data-id="${transaction.id}" title="Editar Transacción">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </button>
                    ${transaction.estado !== 'Pagado' ? 
                    `<button class="text-green-600 hover:text-green-800" data-action="change-state" data-id="${transaction.id}" title="Marcar como Pagado">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>` : ''
                    }
                    <button class="text-red-600 hover:text-red-800" data-action="delete-transaction" data-id="${transaction.id}" title="Eliminar Transacción">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
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
    
    // Actualizar los elementos HTML con los totales
    document.getElementById('total-ingresos-soles').textContent = (totalIngresosSoles - totalGarantiasSoles).toFixed(2);
    document.getElementById('total-ingresos-dolares').textContent = (totalIngresosDolares - totalGarantiasDolares).toFixed(2);
    document.getElementById('total-egresos-soles').textContent = totalEgresosSoles.toFixed(2);
    document.getElementById('total-egresos-dolares').textContent = totalEgresosDolares.toFixed(2);
    document.getElementById('total-garantias-soles').textContent = totalGarantiasSoles.toFixed(2);
    document.getElementById('total-garantias-dolares').textContent = totalGarantiasDolares.toFixed(2);
    
    const totalSoles = totalIngresosSoles - totalEgresosSoles - totalGarantiasSoles;
    const totalDolares = totalIngresosDolares - totalEgresosDolares - totalGarantiasDolares;
    // Actualizar el gráfico de balance
    updateBalanceChart(totalSoles, totalDolares);
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
        movimiento: formData.get('movimiento'),
        placaVehiculo: formData.get('placaVehiculo'),
        empresaVehiculo: formData.get('empresaVehiculo'),
        nombreEmpresaVehiculo: formData.get('nombreEmpresaVehiculo'),
        fechaSubasta: formData.get('fechaSubasta'),
        moneda: formData.get('moneda'),
        importe: formData.get('importe'),
        nombreEntidadFinanciera: formData.get('nombreEntidadFinanciera'),
        nombreEntidadFinancieraOtros: formData.get('nombreEntidadFinancieraOtros'),
        numeroCuenta: formData.get('numeroCuenta'),
        datosFacturacionNumero: formData.get('datosFacturacionNumero'),
        datosFacturacionNombre: formData.get('datosFacturacionNombre'),
        comentario: formData.get('comentario')
    };
    
    if (appStateTransactions.isEditing) {
        // Actualizar transacción existente
        updateTransaction(appStateTransactions.currentTransactionId, transactionData);
        showNotification('Transacción actualizada correctamente');
    } else {
        // Crear nueva transacción
        addTransaction(transactionData);
        showNotification('Transacción registrada correctamente');
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
    
    // Cambiar estado de la aplicación
    appStateTransactions.isEditing = true;
    appStateTransactions.currentTransactionId = id;
    
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
    
    // Configurar color según tipo
    notification.className = 'notification fixed bottom-4 right-4 text-white rounded-lg px-4 py-3 z-50 max-w-sm';
    
    if (type === 'success') {
        notification.classList.add('bg-emerald-500');
    } else if (type === 'error') {
        notification.classList.add('bg-red-500');
    } else if (type === 'warning') {
        notification.classList.add('bg-amber-500');
    }
    
    // Mostrar nueva notificación
    notificationMessage.textContent = message;
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
}

// Inicializar el store de transacciones
function initTransactionStore() {
    if (!window.transactionStore) {
        window.transactionStore = new Store('transactions', loadTransactions, saveTransactions);
    }
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
});