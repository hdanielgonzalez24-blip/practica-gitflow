// Importamos los Page Objects que necesitamos en este archivo.
// LoginPage: para poder autenticarnos antes de cada prueba
// (no se puede ver la página de productos sin haber iniciado sesión).
// ProductsPage: es la pantalla que realmente estamos probando aquí.
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';

// "describe" agrupa bajo un mismo nombre todas las pruebas relacionadas
// con un mismo tema — aquí, todo lo que tiene que ver con la pantalla
// de productos (inventory.html).
describe('Página de productos en SauceDemo', () => {

// Este bloque se ejecuta AUTOMÁTICAMENTE antes de CADA una de las
// 5 pruebas ("it") de este archivo.
beforeEach(() => {

  // NOTA: intentamos usar loginWithSession() (con caché) aquí,
  // pero SauceDemo no lo soporta bien: al recargar la página con
  // cy.visit(), la app siempre regresa a la pantalla de login,
  // sin importar que la sesión/cookies ya existan. Por eso usamos
  // el login normal y completo en cada prueba, como en login.cy.js.
  LoginPage.visit();
  LoginPage.login('standard_user', 'secret_sauce');
});
  // --- PRUEBA 1: verificar que la lista muestra el número correcto de productos ---
  it('Debe mostrar 6 productos en la lista', () => {
    // "productNames()" regresa TODOS los elementos que coincidan con el selector
    // (uno por cada producto visible). "have.length" verifica que sean
    // EXACTAMENTE 6 — si el catálogo cambiara, esta prueba lo detectaría.
    ProductsPage.elements.productNames().should('have.length', 6);
  });

  // --- PRUEBA 2: agregar UN producto y verificar que el contador se actualiza ---
  it('Debe poder agregar un producto al carrito y actualizar el contador', () => {
    // Le pasamos el "slug" (nombre técnico) del producto, tal como
    // aparece en su data-test real: "sauce-labs-backpack"
    ProductsPage.addProductToCart('sauce-labs-backpack');

    // Verificamos que el numerito rojo del carrito ahora contenga "1".
    // Usamos "contain" en vez de "equal" por si el texto trajera
    // espacios extra u otro contenido alrededor del número.
    ProductsPage.elements.cartBadge().should('contain', '1');

    // Verificamos también que el botón cambió de estado:
    // ya no debería decir "Add to cart", sino "Remove"
    // (es el MISMO botón en el HTML, solo cambia su texto/data-test).
    ProductsPage.removeButton('sauce-labs-backpack').should('be.visible');
  });

  // --- PRUEBA 3: agregar VARIOS productos y verificar que la suma es correcta ---
  it('Debe poder agregar varios productos y sumar correctamente', () => {
    // Agregamos dos productos DISTINTOS, uno por uno.
    ProductsPage.addProductToCart('sauce-labs-backpack');
    ProductsPage.addProductToCart('sauce-labs-bike-light');

    // El contador debe reflejar la SUMA de ambos: debe decir "2".
    // Esto confirma que el carrito ACUMULA productos, en vez de
    // sobrescribir el conteo cada vez que agregas uno nuevo.
    ProductsPage.elements.cartBadge().should('contain', '2');
  });

  // --- PRUEBA 4: verificar que el ordenamiento Z-A realmente reordena la lista ---
  it('Debe ordenar los productos de la Z a la A correctamente', () => {

    // Primero, ANTES de tocar nada, guardamos cómo están los nombres
    // en su orden ORIGINAL (por defecto, SauceDemo carga en A-Z).
    // Usamos ".then()" porque getAllProductNames() regresa una PROMESA:
    // el código de adentro solo se ejecuta cuando el dato ya está listo.
    ProductsPage.getAllProductNames().then((originalNames) => {

      // Ahora sí, le decimos a la página que ordene de Z a A,
      // usando el value real "za" que confirmamos en el HTML del dropdown.
      ProductsPage.sortBy('za');

      // Volvemos a leer los nombres, esta vez YA reordenados por la página.
      ProductsPage.getAllProductNames().then((sortedNames) => {

        // Calculamos NOSOTROS MISMOS cuál debería ser el orden correcto:
        // [...originalNames] hace una COPIA del array (para no modificar
        // el original por accidente), .sort() lo ordena alfabéticamente
        // de forma ascendente, y .reverse() lo invierte para dejarlo Z-A.
        const expectedOrder = [...originalNames].sort().reverse();

        // "deep.equal" compara el array COMPLETO, elemento por elemento
        // y en el MISMO orden. Si un solo producto quedara mal ubicado,
        // esta prueba fallaría — es una validación bastante estricta.
        expect(sortedNames).to.deep.equal(expectedOrder);
      });
    });
  });

  // --- PRUEBA 5: verificar que el ordenamiento por precio (menor a mayor) funciona ---
  it('Debe ordenar los productos por precio de menor a mayor', () => {

    // Aplicamos el ordenamiento "low to high" directamente,
    // usando el value real "lohi" confirmado en el HTML.
    ProductsPage.sortBy('lohi');

    // Obtenemos los precios YA convertidos a números
    // (esto lo hace getAllProductPrices() dentro del Page Object,
    // quitándoles el símbolo "$" con parseFloat).
    ProductsPage.getAllProductPrices().then((prices) => {

      // Creamos una copia ordenada de MENOR A MAYOR nosotros mismos,
      // usando una función de comparación numérica: (a, b) => a - b.
      // Esto es necesario porque .sort() sin esa función ordenaría
      // los números como si fueran TEXTO (lo cual pondría, por ejemplo,
      // "10" antes que "9", que sería incorrecto numéricamente).
      const expectedOrder = [...prices].sort((a, b) => a - b);

      // Comparamos: lo que la página REALMENTE muestra
      // vs. lo que matemáticamente debería ser el orden correcto.
      expect(prices).to.deep.equal(expectedOrder);
    });
  });

});