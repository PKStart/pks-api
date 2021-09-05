export const shortcutsPo = {
  menu: () => cy.get('pk-shortcuts-menu .shortcuts-menu'),
  menuButtons: () => cy.get('pk-shortcuts-menu button'),
  menuButton: (i: number) => cy.get('pk-shortcuts-menu button').eq(i),
}
