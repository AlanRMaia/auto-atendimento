// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import urls from './urls';
import path from '../selectors/path.sel.cy';
require('cypress-xpath');

Cypress.Commands.add('getByData', (selector) => {
  return cy.get(`[data-test=${selector}]`);
});

Cypress.Commands.add('login', (cpf, senha) => {
  cy.visit(urls.login);

  cy.get(path.loginPage.cpf).type(cpf);
  cy.get(path.loginPage.senha).type(senha);
  cy.get(path.generic.botaoSubmit).click();
  cy.get(path.generic.title, {timeout: 20000}).should('have.text', 'Atendimentos')
  
});

Cypress.Commands.add('regularizacao', () => {
  cy.get(path.atendimentoPage.regularizacao).click();
});

Cypress.Commands.add('getElementListXpath', (xpath, element) => {
  cy.xpath(xpath).each(($ele, index, list) => {
    if ($ele.text() === element) {
      cy.log('Elemento encontrado');
      cy.wrap($ele).click();
      cy.log('Valor atual', $ele.text());
    } else {
      cy.log('Elemento não encontrado');
      cy.log('Valor esperado', element);
      cy.log('Valor atual', $ele.text());
    }
  });
});

Cypress.Commands.add('getElementList', (selector, element) => {
  cy.get(selector).each(($ele, index, list) => {
    if ($ele.text() === element) {
      cy.log('Elemento encontrado');
      cy.wrap($ele).click();
      cy.log('Valor atual', $ele.text());
    } else {
      cy.log('Elemento não encontrado');
      cy.log('Valor esperado', element);
      cy.log('Valor atual', $ele.text());
    }
  });
});
