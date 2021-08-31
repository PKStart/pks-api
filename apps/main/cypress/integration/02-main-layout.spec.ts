import { appBarPo } from '../support/page-objects/main-layout.po'

describe('Main page layout', () => {
  beforeEach(() => {
    cy.login()
  })

  it('Should have all the default elements', () => {
    appBarPo.appBar().should('be.visible')
    appBarPo.pLogo().should('be.visible')
    appBarPo.weatherBtn().should('be.visible')
    appBarPo.koreanBtn().should('be.visible')
    appBarPo.personalDataBtn().should('be.visible')
    appBarPo.birthdaysBtn().should('be.visible')
    appBarPo.moreBtn().should('be.visible')
    appBarPo.notesBtn().should('not.exist')
  })
})
