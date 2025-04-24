/**
 * * Funcion que guarda mis clients en el localStorage
 */
function saveClients() {
    localStorage.setItem(
      "clients",
      JSON.stringify(window.clientStore.getState())
    );
  }

  function saveTransactions() {
    localStorage.setItem(
      "transactions",
      JSON.stringify(window.transactionStore.getState())
    );
  }