describe('Social login', () => {
  it('Logs in with Facebook', () => {
    cy.visit(Cypress.env('loginUrl'));
    cy.get('button[aria-label="facebook"]').click();
  })
})