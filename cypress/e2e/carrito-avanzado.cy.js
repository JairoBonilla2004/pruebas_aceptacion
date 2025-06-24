describe('Prueba de aceptación carrito avanzado', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5500'); // Cambia a tu url local
    cy.clearLocalStorage();
  });

  it('Agrega productos con cantidades correctas y calcula total', () => {
    // Agregar 2 laptops
    cy.get('.producto').contains('Laptop').parent().within(() => {
      cy.get('.cantidad').clear().type('2');
      cy.contains('Agregar al carrito').click();
    });

    // Agregar 3 mouse
    cy.get('.producto').contains('Mouse').parent().within(() => {
      cy.get('.cantidad').clear().type('3');
      cy.contains('Agregar al carrito').click();
    });

    // Validar fila Laptop
    cy.get('#carrito tbody tr').contains('Laptop').parent().within(() => {
      cy.get('td').eq(1).should('have.text', '2');        // cantidad
      cy.get('td').eq(2).should('have.text', '$1000');   // precio unitario
      cy.get('td').eq(3).should('have.text', '$2000.00'); // subtotal
    });

    // Validar fila Mouse
    cy.get('#carrito tbody tr').contains('Mouse').parent().within(() => {
      cy.get('td').eq(1).should('have.text', '3');
      cy.get('td').eq(2).should('have.text', '$25');
      cy.get('td').eq(3).should('have.text', '$75.00');
    });

    // Validar total
    cy.get('#total').should('have.text', '2075.00');
  });

  it('Elimina un producto y actualiza total', () => {
    // Agregar 1 teclado
    cy.get('.producto').contains('Teclado').parent().within(() => {
      cy.get('.cantidad').clear().type('1');
      cy.contains('Agregar al carrito').click();
    });

    // Agregar 1 mouse
    cy.get('.producto').contains('Mouse').parent().within(() => {
      cy.get('.cantidad').clear().type('1');
      cy.contains('Agregar al carrito').click();
    });

    // Validar total
    cy.get('#total').should('have.text', '70.00');

    // Eliminar Mouse
    cy.get('#carrito tbody tr').contains('Mouse').parent().within(() => {
      cy.get('button.btn-eliminar').click();
    });

    // Validar que Mouse no exista en carrito
    cy.get('#carrito tbody tr').contains('Mouse').should('not.exist');

    // Validar total actualizado
    cy.get('#total').should('have.text', '45.00');
  });

  it('Valida cantidad inválida y no agrega producto', () => {
    cy.get('.producto').contains('Laptop').parent().within(() => {
      cy.get('.cantidad').clear().type('0');
      cy.contains('Agregar al carrito').click();
    });

    // No debe agregar ningún producto (tabla vacía)
    cy.get('#carrito tbody tr').should('have.length', 0);
    cy.get('#total').should('have.text', '0');
  });
});
