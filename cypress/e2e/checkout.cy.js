// ============================================================
// PRUEBAS DE CHECKOUT en SauceDemo
// Cubre el flujo completo: carrito -> datos del comprador ->
// resumen -> confirmación, además de validaciones del formulario.
// ============================================================

// ------------------------------------------------------------
// IMPORTACIONES
// Traemos los Page Objects que vamos a usar. Cada uno representa
// una pantalla distinta del flujo de compra.
// "../pages/" sube un nivel desde e2e y entra a la carpeta pages.
// ------------------------------------------------------------
import LoginPage from '../pages/LoginPage';
import CartPage from '../pages/CartPage';
import CheckoutStepOnePage from '../pages/CheckoutStepOnePage';
import CheckoutStepTwoPage from '../pages/CheckoutStepTwoPage';
import CheckoutCompletePage from '../pages/CheckoutCompletePage';

// describe() agrupa todas las pruebas relacionadas bajo un mismo nombre
describe('SauceDemo - Checkout', () => {

  // ----------------------------------------------------------
  // PRECONDICIONES
  // beforeEach corre antes de CADA prueba (it). Así cada prueba
  // arranca desde el mismo estado: con sesión iniciada y un
  // producto en el carrito, y ninguna depende de otra.
  // ----------------------------------------------------------
  beforeEach(() => {
    // Abrimos la página de login e iniciamos sesión con el usuario estándar
    // (si tu LoginPage usa otros nombres de método, ajústalos aquí)
    LoginPage.visit();
    LoginPage.login('standard_user', 'secret_sauce');

    // Agregamos la mochila al carrito dando clic en su botón "Add to cart"
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // Abrimos el carrito dando clic en el ícono del header
    cy.get('[data-test="shopping-cart-link"]').click();

    // Confirmamos que realmente estamos en la pantalla del carrito
    cy.url().should('include', '/cart.html');
  });

  // ----------------------------------------------------------
  // PRUEBA 1: compra exitosa de principio a fin (caso feliz)
  // ----------------------------------------------------------
  it('completa una compra exitosa de principio a fin', () => {
    // Pantalla del carrito: damos clic en "Checkout"
    CartPage.goToCheckout();

    // Ya debemos estar en el paso 1 del checkout
    cy.url().should('include', '/checkout-step-one.html');

    // Paso 1: llenamos los tres campos con datos válidos y continuamos
    CheckoutStepOnePage.fillForm('Héctor', 'Prueba', '77500');
    CheckoutStepOnePage.continue();

    // Ya debemos estar en el paso 2 (resumen de la compra)
    cy.url().should('include', '/checkout-step-two.html');

    // Verificamos que el resumen muestre exactamente un producto
    // y que sea la mochila que agregamos
    CheckoutStepTwoPage.itemNames
      .should('have.length', 1)
      .and('contain.text', 'Sauce Labs Backpack');

    // Paso 2: confirmamos la compra con "Finish"
    CheckoutStepTwoPage.finish();

    // Pantalla final: validamos la URL y el mensaje de agradecimiento
    cy.url().should('include', '/checkout-complete.html');
    CheckoutCompletePage.completeHeader.should('have.text', 'Thank you for your order!');
  });

  // ----------------------------------------------------------
  // PRUEBA 2: falta el First Name
  // ----------------------------------------------------------
  it('muestra error cuando falta el First Name', () => {
    CartPage.goToCheckout();

    // Mandamos undefined en el nombre: ese campo queda vacío
    CheckoutStepOnePage.fillForm(undefined, 'Prueba', '77500');
    CheckoutStepOnePage.continue();

    // La app debe mostrar el mensaje de error de campo obligatorio
    CheckoutStepOnePage.errorMessage
      .should('be.visible')
      .and('contain', 'First Name is required');

    // Y no debe avanzar: seguimos en el paso 1
    cy.url().should('include', '/checkout-step-one.html');
  });

  // ----------------------------------------------------------
  // PRUEBA 3: falta el Last Name
  // ----------------------------------------------------------
  it('muestra error cuando falta el Last Name', () => {
    CartPage.goToCheckout();

    // Dejamos vacío el apellido (segunda posición)
    CheckoutStepOnePage.fillForm('Héctor', undefined, '77500');
    CheckoutStepOnePage.continue();

    CheckoutStepOnePage.errorMessage
      .should('be.visible')
      .and('contain', 'Last Name is required');
  });

  // ----------------------------------------------------------
  // PRUEBA 4: falta el Zip/Postal Code
  // ----------------------------------------------------------
  it('muestra error cuando falta el Zip/Postal Code', () => {
    CartPage.goToCheckout();

    // Dejamos vacío el código postal (tercera posición)
    CheckoutStepOnePage.fillForm('Héctor', 'Prueba', undefined);
    CheckoutStepOnePage.continue();

    CheckoutStepOnePage.errorMessage
      .should('be.visible')
      .and('contain', 'Postal Code is required');
  });

  // ----------------------------------------------------------
  // PRUEBA 5: el total del resumen = subtotal + impuesto
  // ----------------------------------------------------------
  it('el total del resumen es subtotal + impuesto', () => {
    // Llegamos al resumen con datos válidos
    CartPage.goToCheckout();
    CheckoutStepOnePage.fillForm('Héctor', 'Prueba', '77500');
    CheckoutStepOnePage.continue();

    // Leemos el texto de cada etiqueta (invoke('text') devuelve su contenido).
    // Los .then anidados son necesarios porque Cypress trabaja de forma
    // asíncrona: solo dentro del .then ya tenemos el valor disponible.
    CheckoutStepTwoPage.subtotalLabel.invoke('text').then((subtotalText) => {
      CheckoutStepTwoPage.taxLabel.invoke('text').then((taxText) => {
        CheckoutStepTwoPage.totalLabel.invoke('text').then((totalText) => {

          // Convertimos "Item total: $29.99" en el número 29.99, y así con los demás
          const subtotal = CheckoutStepTwoPage.parseAmount(subtotalText);
          const tax = CheckoutStepTwoPage.parseAmount(taxText);
          const total = CheckoutStepTwoPage.parseAmount(totalText);

          // Comparamos: el total debe ser subtotal + impuesto.
          // closeTo acepta una diferencia máxima de 0.01 para
          // tolerar redondeos de decimales.
          expect(total).to.be.closeTo(subtotal + tax, 0.01);
        });
      });
    });
  });

  // ----------------------------------------------------------
  // PRUEBA 6: el botón Cancel regresa al carrito
  // ----------------------------------------------------------
  it('el botón Cancel regresa al carrito', () => {
    CartPage.goToCheckout();

    // Estando en el paso 1, damos clic en "Cancel"
    CheckoutStepOnePage.cancel();

    // Debe volver al carrito y el producto debe seguir ahí
    cy.url().should('include', '/cart.html');
    CartPage.cartItems.should('have.length', 1);
  });
});