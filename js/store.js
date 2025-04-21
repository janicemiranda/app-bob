/**
 * Clase Store genérica para gestionar colecciones de datos
 * Implementa un patrón de diseño basado en un estado centralizado
 * para facilitar operaciones CRUD (Create, Read, Update, Delete)
 */
class Store {
  constructor(storeName, saveFunction, initialState = []) {
    this.storeName = storeName;
    this.saveFunction = saveFunction;
    this._state = initialState;
    this._callbacks = [];
  }

  /**
   * Notifica a todos los suscriptores sobre cambios en el estado
   */
  _notify() {
    this._callbacks.forEach(callback => callback(this._state));
    
    // Guarda los cambios en localStorage
    if (this.saveFunction) {
      this.saveFunction();
    }
  }

  /**
   * Obtiene el estado actual
   * @returns {Array} El estado actual
   */
  getState() {
    return this._state;
  }

  /**
   * Suscribe una función para recibir notificaciones de cambios
   * @param {Function} callback Función a ejecutar cuando el estado cambie
   * @returns {Function} Función para cancelar la suscripción
   */
  subscribe(callback) {
    this._callbacks.push(callback);
    
    // Devuelve una función para desuscribirse
    return () => {
      this._callbacks = this._callbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Añade un nuevo elemento a la colección
   * @param {Object} item Elemento a añadir
   * @returns {Object} El elemento añadido
   */
  add(item) {
    this._state = [...this._state, item];
    this._notify();
    return item;
  }

  /**
   * Actualiza un elemento existente
   * @param {String} id ID del elemento a actualizar
   * @param {Object} updatedItem Objeto con las propiedades a actualizar
   * @returns {Object|null} El elemento actualizado o null si no se encuentra
   */
  update(id, updatedItem) {
    const index = this._state.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }

    // Actualiza solo las propiedades proporcionadas
    const updated = { 
      ...this._state[index], 
      ...updatedItem,
      updatedAt: new Date() // Actualiza la marca de tiempo
    };
    
    this._state = [
      ...this._state.slice(0, index),
      updated,
      ...this._state.slice(index + 1)
    ];
    
    this._notify();
    return updated;
  }

  /**
   * Elimina un elemento de la colección
   * @param {String} id ID del elemento a eliminar
   * @returns {Boolean} true si el elemento fue eliminado, false en caso contrario
   */
  remove(id) {
    const initialLength = this._state.length;
    this._state = this._state.filter(item => item.id !== id);
    
    if (this._state.length !== initialLength) {
      this._notify();
      return true;
    }
    
    return false;
  }

  /**
   * Restablece el estado de la tienda (store) con nuevos datos
   * @param {Array} newState Nuevo estado
   */
  setState(newState) {
    this._state = newState;
    this._notify();
  }

  /**
   * Busca un elemento por su ID
   * @param {String} id ID del elemento a buscar
   * @returns {Object|null} El elemento encontrado o null
   */
  getById(id) {
    return this._state.find(item => item.id === id) || null;
  }

  /**
   * Filtra los elementos según una función de predicado
   * @param {Function} predicate Función que determina qué elementos incluir
   * @returns {Array} Lista de elementos que cumplen con el predicado
   */
  filter(predicate) {
    return this._state.filter(predicate);
  }

  /**
   * Cambia el estado activo de un elemento (activar/inactivar)
   * @param {String} id ID del elemento a cambiar
   * @param {Boolean} active Estado activo (true/false)
   * @returns {Object|null} El elemento actualizado o null si no se encuentra
   */
  toggleActive(id, active = false) {
    const index = this._state.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }

    const updated = { 
      ...this._state[index],
      activo: active,
      updatedAt: new Date()
    };
    
    // Si se está inactivando, actualizar el campo AnuladoAt
    if (!active) {
      updated.AnuladoAt = new Date();
    }
    
    this._state = [
      ...this._state.slice(0, index),
      updated,
      ...this._state.slice(index + 1)
    ];
    
    this._notify();
    return updated;
  }
}

// Inicializa store de clientes
window.clientStore = new Store('clients', saveClients, []);

// Inicializa store de transacciones
window.transactionStore = new Store('transactions', saveTransactions, []);

// Cargar datos guardados en localStorage (si existen)
document.addEventListener('DOMContentLoaded', function() {
  // Cargar clientes
  const savedClients = localStorage.getItem('clients');
  if (savedClients) {
    window.clientStore.setState(JSON.parse(savedClients));
  }
  
  // Cargar transacciones
  const savedTransactions = localStorage.getItem('transactions');
  if (savedTransactions) {
    window.transactionStore.setState(JSON.parse(savedTransactions));
  }
});