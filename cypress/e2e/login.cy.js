// Importamos el Page Object que acabamos de crear.
// La ruta '../pages/LoginPage' significa: "sube un nivel de carpeta (..),
// entra a 'pages', y toma el archivo LoginPage.js"
import LoginPage from '../pages/LoginPage';

// "describe" agrupa un conjunto de pruebas relacionadas bajo un mismo tema.
// Aquí, todo lo que tenga que ver con el login de SauceDemo.
describe('Login en SauceDemo', () => {

  // "beforeEach" es un bloque que se ejecuta AUTOMÁTICAMENTE
  // antes de CADA prueba ("it") de este archivo.
  // Así evitamos repetir "ir a la página" en cada caso de prueba.
  beforeEach(() => {
    LoginPage.visit(); // usamos el método del Page Object, no cy.visit() directo
  });

  // Cada bloque "it" es UN CASO DE PRUEBA independiente.
  // El texto entre comillas es la descripción de qué se está probando
  // (aparece así en los reportes de Cypress).
  it('Debe hacer login exitoso con credenciales válidas', () => {
    // Usamos el método login() del Page Object, pasándole
    // el usuario válido y la contraseña correcta de SauceDemo.
    LoginPage.login('standard_user', 'secret_sauce');

    // "cy.url().should(...)" es una ASERCIÓN: verifica que algo sea cierto.
    // Aquí comprobamos que, después del login, la URL cambió
    // a la página de productos (esto confirma que el login funcionó).
    cy.url().should('include', '/inventory.html');

    // También verificamos que el título de la página diga "Products".
    // Esto es una segunda validación, por si la URL cambiara mañana
    // pero el contenido no cargara bien.
    cy.get('.title').should('contain', 'Products');
  });

  it('Debe mostrar error con credenciales incorrectas', () => {
    // Intentamos entrar con datos que NO existen en el sistema.
    LoginPage.login('usuario_invalido', 'password_incorrecto');

    // Verificamos que el mensaje de error SÍ sea visible en pantalla.
    LoginPage.getErrorMessage().should('be.visible');

    // Además, verificamos que el TEXTO del mensaje sea el correcto,
    // no solo que exista algún error genérico.
    LoginPage.getErrorMessage().should('contain', 'Username and password do not match');
  });

  it('Debe mostrar error con usuario bloqueado', () => {
    // Este es un caso de prueba especial: SauceDemo tiene un usuario
    // llamado "locked_out_user" hecho a propósito para simular
    // una cuenta bloqueada (la contraseña sí es correcta).
    LoginPage.login('locked_out_user', 'secret_sauce');

    // Verificamos que el mensaje de error sea el específico de "bloqueado",
    // y no el genérico de "usuario/contraseña incorrectos".
    // Esto es importante: si el sistema muestra el mensaje equivocado,
    // esta prueba lo detectaría como un fallo.
    LoginPage.getErrorMessage().should('contain', 'Sorry, this user has been locked out');
  });

});