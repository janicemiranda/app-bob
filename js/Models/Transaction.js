class Transaction{
    constructor(id, clienteId, tipo, placaVehiculo, empresaVehiculo, fechaSubasta, moneda, importe, banco, numCuentaDeposito, concepto, dtFacDocumento, dtNroFacDocumento, estado ) {
        this.id = id || this.generateId();
        this.clienteId = clienteId;
        this.tipo = tipo; // Ingreso o Egreso
        this.placaVehiculo = placaVehiculo; // Placa Vehículo
        this.empresaVehiculo = empresaVehiculo; // Empresa Vehículo
        this.fechaSubasta = fechaSubasta; // Fecha Subasta
        this.moneda = moneda; // SOL - DOLAr
        this.monto = importe; // El monto
        this.banco = banco; // BCP - Interbank - BBVA - Otros
        this.numCuentaDeposito = numCuentaDeposito; // Número de Cuenta Deposito
        this.concepto = concepto; // Comentario o Notas del movimiento
        this.dtFacDocumento = dtFacDocumento; // Documento Fac
        this.dtNroFacDocumento = dtNroFacDocumento; // Número de Documento Fac
        this.estado = estado;
        this.activo = true;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.AnuladoAt = new Date();
    }

    generateId() {
        return (
          Date.now().toString(36) +
          Math.random().toString(36).substr(2, 9)
        );
      }
}