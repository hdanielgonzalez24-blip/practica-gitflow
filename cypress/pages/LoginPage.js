// Esta clase representa la PANTALLA de login.
// Su trabajo es saber "cómo" interactuar con esta pantalla específica:
// dónde están los campos, botones, y mensajes.
// Las pruebas (los archivos .cy.js) NO deberían saber estos detalles,
// solo deberían decir "haz login" sin preocuparse del cómo.
class LoginPage {

  // "elements" es un objeto donde guardamos TODOS los selectores de esta pantalla.
  // Cada propiedad es una función que, al llamarse, busca ese elemento en el DOM.
  // Ventaja: si el desarrollador cambia un id en el HTML, solo corriges AQUÍ,
  // y todas las pruebas que usan este Page Object se arreglan solas.
  elements = {
    usernameInput: () => cy.get('#user-name'),        // campo de texto del usuario
    passwordInput: () => cy.get('#password'),         // campo de texto de la contraseña
    loginButton: () => cy.get('#login-button'),       // botón para enviar el login
    errorMessage: () => cy.get('[data-test="error"]'), // caja roja de error que aparece si algo falla
  };

  // Método para ir directamente a la página de login.
  // Lo llamamos así en vez de escribir cy.visit(url) en cada prueba,
  // para que si la URL cambia algún día, solo la corrijas en un lugar.
  visit() {
    cy.visit('https://www.saucedemo.com/');
  }

  // Método que agrupa TODA la acción de "iniciar sesión":
  // escribir usuario, escribir contraseña, y dar clic en el botón.
  // Recibe los datos como parámetros, así que sirve para
  // login exitoso, login fallido, usuario bloqueado, etc.
  // solo cambiando qué le mandas.
  login(username, password) {
    this.elements.usernameInput().type(username);   // escribe el usuario
    this.elements.passwordInput().type(password);   // escribe la contraseña
    this.elements.loginButton().click();             // da clic en "Login"
  }

  // Método para obtener el mensaje de error.
  // Lo dejamos como método aparte (en vez de acceder directo a "elements")
  // porque así, si en el futuro cambia CÓMO se valida el error
  // (por ejemplo, si hay que esperar algo antes), lo ajustas aquí sin tocar las pruebas.
  getErrorMessage() {
    return this.elements.errorMessage();
  }
}

// Exportamos UNA sola instancia ya creada de esta clase (no la clase en sí).
// Así, cuando la importas en varios archivos de prueba,
// todos usan el mismo objeto — no hace falta escribir "new LoginPage()" cada vez.
export default new LoginPage();