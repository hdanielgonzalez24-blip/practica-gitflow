// Esta clase representa la PANTALLA de login.
// Su trabajo es saber "cómo" interactuar con esta pantalla:
// dónde están los campos, botones, y mensajes.
class LoginPage {

  // "elements" guarda TODOS los selectores de esta pantalla.
  // Cada propiedad es una función que busca ese elemento en el DOM.
  elements = {
    usernameInput: () => cy.get('#user-name'),
    passwordInput: () => cy.get('#password'),
    loginButton: () => cy.get('#login-button'),
    errorMessage: () => cy.get('[data-test="error"]'),
  };

  // Va directo a la página de login.
  visit() {
    cy.visit('https://www.saucedemo.com/');
  }

  // Login normal: escribe usuario, contraseña, y da clic.
  // Se ejecuta completo cada vez (sin caché).
  // Úsalo cuando la prueba trata sobre el login mismo.
  login(username, password) {
    this.elements.usernameInput().type(username);
    this.elements.passwordInput().type(password);
    this.elements.loginButton().click();
  }

  // Regresa el mensaje de error de la pantalla.
  getErrorMessage() {
    return this.elements.errorMessage();
  }

  // Login CON CACHE de sesion.
  // Usalo cuando la prueba NO es sobre el login,
  // solo necesita estar autenticada (ej. productos, carrito).
  loginWithSession(username, password) {

    // cy.session recibe un identificador de la sesion
    // y una funcion que dice como hacer login la primera vez.
    cy.session([username, password], () => {

      // Este bloque solo corre la primera vez.
      this.visit();
      this.login(username, password);

      // Confirmamos que el login funciono antes de guardarla.
      cy.url().should('include', '/inventory.html');
    });

    // De la segunda llamada en adelante, Cypress restaura
    // las cookies guardadas al instante, sin repetir el proceso.
  }
}

// Exportamos una sola instancia ya creada de esta clase.
export default new LoginPage();