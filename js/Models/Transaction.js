class Transaction{
    constructor(id, clienteId, fecha, hora, tipo, medio, banco, moneda, importe, concepto  ) {
        this.id = id;
        this.clienteId = clienteId;
        this.fecha = fecha;
        this.hora = hora;
        this.tipo = tipo;
        this.medio = medio;
        this.banco = banco;
        this.moneda = moneda;
        this.monto = importe;
        this.concepto = concepto;
    }
}