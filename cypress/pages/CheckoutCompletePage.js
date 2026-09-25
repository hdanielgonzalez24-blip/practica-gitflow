// ============================================================
// Page Object de la PANTALLA FINAL (confirmación de la compra)
// Pantalla que representa:
//   https://www.saucedemo.com/checkout-complete.html
// Aparece cuando la compra se completó con éxito.
// ============================================================
class CheckoutCompletePage {

  // ----------------------------------------------------------
  // ELEMENTOS DE LA PANTALLA (getters)
  // ----------------------------------------------------------

  // Encabezado de agradecimiento: "Thank you for your order!"
  // Es lo que usamos para comprobar que la compra terminó bien
  get completeHeader() {
    return cy.get('[data-test="complete-header"]');
  }

  // Botón "Back Home": regresa a la lista de productos
  get backHomeButton() {
    return cy.get('[data-test="back-to-products"]');
  }

  // ----------------------------------------------------------
  // ACCIONES (métodos)
  // ----------------------------------------------------------

  // Da clic en "Back Home" para volver a /inventory.html
  backHome() {
    this.backHomeButton.click();
  }
}

// Exportamos una instancia lista para importar desde las pruebas
export default new CheckoutCompletePage();