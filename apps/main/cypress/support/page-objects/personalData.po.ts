export const personalDataPo = {
  box: () => cy.get('pk-personal-data'),
  header: () => cy.get('pk-personal-data header'),
  actions: () => cy.get('pk-personal-data header .main-box-actions button'),
  closeBtn: () => cy.get('pk-personal-data header button[mattooltip="Close"]'),
  addNewBtn: () => cy.get('pk-personal-data header button[mattooltip="Add new"]'),
}
