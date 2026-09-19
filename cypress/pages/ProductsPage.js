// Esta clase representa la pantalla de PRODUCTOS (inventory.html).
// Aquí viven los selectores y acciones de: ver la lista de productos,
// agregarlos/quitarlos del carrito, y ordenarlos.
class ProductsPage {

  elements = {
    // Todos los nombres de producto en la lista
    productNames: () => cy.get('[data-test="inventory-item-name"]'),

    // Todos los precios en la lista
    productPrices: () => cy.get('[data-test="inventory-item-price"]'),

    // El dropdown de ordenamiento (Name A-Z, Z-A, precio, etc.)
    sortDropdown: () => cy.get('[data-test="product-sort-container"]'),

    // El ícono del carrito, arriba a la derecha
    cartLink: () => cy.get('[data-test="shopping-cart-link"]'),

    // El numerito rojo que muestra cuántos productos hay en el carrito
    cartBadge: () => cy.get('[data-test="shopping-cart-badge"]'),
  };

  // Recibe el "slug" (nombre técnico) de un producto, ej. "sauce-labs-backpack",
  // y regresa el botón de "Add to cart" correspondiente a ESE producto.
  addToCartButton(productSlug) {
    return cy.get(`[data-test="add-to-cart-${productSlug}"]`);
  }

  // Igual, pero para el botón "Remove" (mismo botón, otro estado).
  removeButton(productSlug) {
    return cy.get(`[data-test="remove-${productSlug}"]`);
  }

  // Acción: agregar un producto al carrito, dado su slug.
  addProductToCart(productSlug) {
    this.addToCartButton(productSlug).click();
  }

  // Acción: cambiar el orden de la lista usando el dropdown.
  // "select()" elige una opción del <select> por su atributo "value".
  sortBy(optionValue) {
    this.elements.sortDropdown().select(optionValue);
  }

  // Devuelve el texto de TODOS los nombres de producto, como array de strings.
  // Sirve para comparar el orden antes/después de aplicar un sort.
  getAllProductNames() {
    return this.elements.productNames().then(($elements) => {
      // Cypress._.map() (Lodash) recorre cada elemento y nos deja
      // quedarnos solo con su texto visible (innerText).
      return Cypress._.map($elements, (el) => el.innerText);
    });
  }

  // Igual, pero para los precios, convirtiéndolos a números reales
  // para poder hacer comparaciones matemáticas de orden.
  getAllProductPrices() {
    return this.elements.productPrices().then(($elements) => {
      return Cypress._.map($elements, (el) =>
        // .replace quita el símbolo "$", parseFloat convierte a número decimal
        parseFloat(el.innerText.replace('$', ''))
      );
    });
  }
}

// Exportamos UNA instancia ya creada, para reutilizarla en todas las pruebas.
export default new ProductsPage();