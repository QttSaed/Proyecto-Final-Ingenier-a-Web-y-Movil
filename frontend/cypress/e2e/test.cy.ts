describe('Inicio', () => {
  it('redirige la raíz y muestra el catálogo', () => {
    cy.viewport(1440, 900);
    cy.visit('/');
    cy.location('pathname').should('eq', '/home');
    cy.get('.banner-large img').scrollIntoView().should('be.visible');
  });
});
