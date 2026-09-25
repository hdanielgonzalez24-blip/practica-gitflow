// ============================================================
// Page Object del PASO 2 DEL CHECKOUT (resumen de la compra)
// Pantalla que representa:
//   https://www.saucedemo.com/checkout-step-two.html
// Muestra los productos, el subtotal, el impuesto y el total.
// ============================================================
class CheckoutStepTwoPage {

  // ----------------------------------------------------------
  // ELEMENTOS DE LA PANTALLA (getters)
  // ----------------------------------------------------------

  // Nombres de los productos que aparecen en el resumen
  get itemNames() {
    return cy.get('[data-test="inventory-item-name"]');
  }

  // Etiqueta del subtotal, con texto como "Item total: $29.99"
  get subtotalLabel() {
    return cy.get('[data-test="subtotal-label"]');
  }

  // Etiqueta del impuesto, con texto como "Tax: $2.40"
  get taxLabel() {
    return cy.get('[data-test="tax-label"]');
  }

  // Etiqueta del total, con texto como "Total: $32.39"
  get totalLabel() {
    return cy.get('[data-test="total-label"]');
  }

  // Botón "Finish": confirma y finaliza la compra
  get finishButton() {
    return cy.get('[data-test="finish"]');
  }

  // ----------------------------------------------------------
  // ACCIONES (métodos)
  // ----------------------------------------------------------

  // Da clic en "Finish" para completar la compra
  finish() {
    this.finishButton.click();
  }

  // ----------------------------------------------------------
  // MÉTODO AUXILIAR
  // ----------------------------------------------------------

  // Convierte un texto como "Total: $32.39" en el número 32.39.
  // Lo necesitamos porque las etiquetas traen letras y el símbolo $,
  // y para sumar (subtotal + impuesto) hay que trabajar con números.
  parseAmount(text) {
    // text.match(/[\d.]+/) busca la primera secuencia de dígitos
    // y puntos decimales dentro del texto; [0] toma esa coincidencia
    // (ej. "32.39") y parseFloat la convierte de texto a número
    return parseFloat(text.match(/[\d.]+/)[0]);
  }
}

// Exportamos una instancia lista para importar desde las pruebas
export default new CheckoutStepTwoPage();