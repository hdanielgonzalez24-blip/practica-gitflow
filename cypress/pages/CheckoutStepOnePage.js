// ============================================================
// Page Object del PASO 1 DEL CHECKOUT (datos del comprador)
// Pantalla que representa:
//   https://www.saucedemo.com/checkout-step-one.html
// Contiene el formulario con First Name, Last Name y Zip.
// ============================================================
class CheckoutStepOnePage {

  // ----------------------------------------------------------
  // ELEMENTOS DE LA PANTALLA (getters)
  // ----------------------------------------------------------

  // Campo de texto "First Name" (nombre)
  get firstNameInput() {
    return cy.get('[data-test="firstName"]');
  }

  // Campo de texto "Last Name" (apellido)
  get lastNameInput() {
    return cy.get('[data-test="lastName"]');
  }

  // Campo de texto "Zip/Postal Code" (código postal)
  get postalCodeInput() {
    return cy.get('[data-test="postalCode"]');
  }

  // Botón "Continue": envía el formulario y avanza al resumen
  get continueButton() {
    return cy.get('[data-test="continue"]');
  }

  // Botón "Cancel": cancela el proceso y regresa al carrito
  get cancelButton() {
    return cy.get('[data-test="cancel"]');
  }

  // Mensaje de error que aparece cuando falta algún dato
  // (ej. "Error: First Name is required")
  get errorMessage() {
    return cy.get('[data-test="error"]');
  }

  // ----------------------------------------------------------
  // ACCIONES (métodos)
  // ----------------------------------------------------------

  // Llena el formulario con los datos recibidos.
  // Los tres parámetros son opcionales: si mandamos undefined en
  // alguno, ese campo se deja vacío. Así podemos probar los
  // mensajes de error de campos obligatorios.
  fillForm(firstName, lastName, postalCode) {
    // Solo escribimos si el valor tiene texto, porque cy.type()
    // marca error cuando recibe una cadena vacía
    if (firstName) this.firstNameInput.type(firstName);
    if (lastName) this.lastNameInput.type(lastName);
    if (postalCode) this.postalCodeInput.type(postalCode);
  }

  // Da clic en "Continue" para enviar el formulario
  continue() {
    this.continueButton.click();
  }

  // Da clic en "Cancel" para regresar al carrito
  cancel() {
    this.cancelButton.click();
  }
}

// Exportamos una instancia lista para importar desde las pruebas
export default new CheckoutStepOnePage();