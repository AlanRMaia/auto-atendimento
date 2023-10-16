/// <reference types="Cypress"/>

const urls = require("../../../support/urls");

//import { fakerPT_BR as faker} from '@faker-js/faker';

describe('Teste Funcional de login', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it('Deve realizar o login com sucesso', () => {
    cy.login();
    cy.visit(urls.atendimentos)
  });
  
});
