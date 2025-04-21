class Client{
    constructor(id, nombre, razonSocial, tipoDocumento, numeroDocumento, correo, observaciones, activo ) {
        this.id = id || this.generateId();
        this.correo = correo;
        this.razonSocial = razonSocial;
        this.tipoDocumento = tipoDocumento;
        this.numeroDocumento = numeroDocumento;
        this.observaciones = observaciones;
        this.saldoSoles = 0;
        this.saldoDolares = 0;
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
