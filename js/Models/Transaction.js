class Transaction{
    constructor(id, clienteId, fecha, hora, tipo, medio, banco, moneda, importe, concepto  ) {
        this.id = id;
        this.fecha = fecha;
        this.hora = hora;
        this.clienteId = clienteId;
        this.tipo = tipo;
        this.medio = medio;
        this.banco = banco;
        this.moneda = moneda;
        this.monto = importe;
        this.concepto = concepto;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}