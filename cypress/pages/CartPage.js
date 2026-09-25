// ============================================================
// Page Object del CARRITO DE COMPRAS
// Pantalla que representa: https://www.saucedemo.com/cart.html
// ------------------------------------------------------------
// Un Page Object es una clase que guarda dos cosas de una pantalla:
//   1) Los selectores de sus elementos (botones, campos, textos)
//   2) Las acciones que se pueden hacer en ella (clics, escribir)
// Las pruebas usan esta clase y así no repiten selectores.
// ============================================================
class CartPage {

  // ----------------------------------------------------------
  // ELEMENTOS DE LA PANTALLA (getters)
  // "get" convierte el método en una propiedad: se usa como
  // CartPage.checkoutButton (sin paréntesis).
  // Cada vez que se usa, ejecuta cy.get() de nuevo, así Cypress
  // siempre busca el elemento actual en la página y evita errores
  // de "elemento desactualizado".
  // ----------------------------------------------------------

  // Botón "Checkout" que lleva al formulario de datos del comprador
  get checkoutButton() {
    // [data-test="checkout"] es el atributo que SauceDemo pone
    // para que los QA encuentren el elemento de forma estable
    return cy.get('[data-test="checkout"]');
  }

  // Nombres de los productos que están dentro del carrito
  // Puede devolver varios elementos si hay más de un producto
  get cartItems() {
    return cy.get('[data-test="inventory-item-name"]');
  }

  // ----------------------------------------------------------
  // ACCIONES (métodos)
  // Representan lo que un usuario hace en esta pantalla.
  // Las pruebas llaman al método y no se preocupan del selector.
  // ----------------------------------------------------------

  // Da clic en "Checkout" para pasar al paso 1 del pago
  goToCheckout() {
    // Cypress espera solo a que el botón sea visible y clickeable
    this.checkoutButton.click();
  }
}

// ------------------------------------------------------------
// EXPORTACIÓN
// "new CartPage()" crea un objeto listo para usar, y
// "export default" permite importarlo desde otros archivos:
//   import CartPage from '../pages/CartPage';
// Es el mismo estilo que usan LoginPage y ProductsPage.
// ------------------------------------------------------------
export default new CartPage();