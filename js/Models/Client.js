class Client{
    constructor(id, nombre, razonSocial, tipoDocumento, numeroDocumento, correo, observaciones, activo ) {
        this.id = id || this.generateId();
        this.nombre = nombre;
        this.razonSocial = razonSocial;
        this.tipoDocumento = tipoDocumento;
        this.numeroDocumento = numeroDocumento;
        this.correo = correo;
        this.observaciones = observaciones;
        this.activo = activo;
    }
    
    generateId() {
        return (
          Date.now().toString(36) +
          Math.random().toString(36).substr(2, 9)
        );
      }
}
