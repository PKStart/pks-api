export const appBarPo = {
  appBar: () => cy.get('pk-app-bar'),
  pLogo: () => cy.get('mat-toolbar a[mattooltip="P-kin.com"]'),
  weatherBtn: () => cy.get('pk-app-bar-weather button'),
  koreanBtn: () => cy.get('pk-app-bar button[mattooltip="Korean"]'),
  notesBtn: () => cy.get('pk-app-bar button[mattooltip="Notes"]'),
  personalDataBtn: () => cy.get('pk-app-bar button[mattooltip="Personal data"]'),
  birthdaysBtn: () => cy.get('pk-app-bar button[mattooltip="Birthdays"]'),
  moreBtn: () => cy.get('pk-app-bar button[mattooltip="More..."]'),
}
