it('Should redirect to auth', () => {
  cy.visit('/')
  cy.url().should('contain', '/auth')
})
