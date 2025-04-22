class Transaction{
    constructor(id, clienteId, fecha, hora, tipo, medio, banco, moneda, importe, concepto, placaVehiculo, empresaVehiculo, fechaSubasta, numCuentaDeposito, dtFacDocumento, dtNroFacDocumento, estado ) {
        this.id = id;
        this.tipo = tipo; // Ingreso o Egreso
        this.clienteId = clienteId;
        this.medio = medio; // Yape - Plin - Transferencia - Deposito - Otros
        this.banco = banco; // BCP - Interbank - BBVA - Otros
        this.moneda = moneda; // SOL - DOLAr
        this.monto = importe; // El monto
        this.concepto = concepto; // Comentario o Notas del movimiento
        // Otros datos
        this.placaVehiculo = placaVehiculo;
        this.empresaVehiculo = empresaVehiculo;
        this.fechaSubasta = fechaSubasta;
        this.numCuentaDeposito = numCuentaDeposito;
        this.dtFacDocumento = dtFacDocumento;
        this.dtNroFacDocumento = dtNroFacDocumento;
        this.estado = estado;
        //
        this.activo = true;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.AnuladoAt = new Date();
    }
}