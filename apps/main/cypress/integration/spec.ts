it('loads examples', () => {
  cy.visit('/')
  cy.contains('main app is running')
})
