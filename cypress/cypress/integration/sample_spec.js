describe('My First Test', () => {
    it('Visits Sofa and test the fields', () => {
      cy.visit('http://localhost:3000/')

      cy.get('#card-number')
      .type('4553453463453534')
      .should('have.value', '4553453463453534')

      cy.get('#card-month')
      .type('12')
      .should('have.value', '12')

      cy.get('#card-year')
      .type('2021')
      .should('have.value', '2021')

      cy.get('#card-cvv')
      .type('111')
      .should('have.value', '111')

      cy.get('#card-name')
      .type('Jhon Doe')
      .should('have.value', 'Jhon Doe')

      cy.get('#checkout-button').click()
    })
  })
  