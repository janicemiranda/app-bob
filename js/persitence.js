/**
 * * Funcion que guarda mis clients en el localStorage
 */
function saveClients() {
    localStorage.setItem(
      "clients",
      JSON.stringify(window.clientStore.getState())
    );
  }