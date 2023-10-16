/// <reference types="Cypress"/>
import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../../selectors/path.sel.cy';
import mensagem from "../../../support/mensagemAlertEnum";


describe('Grupo de testes fale conosco', () => {
    beforeEach(() => {        
        cy.reload();  
        cy.viewport(1280, 720);
      });

      it.only('Fale conosco email', () => {
        
        let uf = faker.helpers.arrayElement(path.generic.uf)
        cy.visit('/')
        cy.get('.q-page-sticky > div > .q-btn').click({force: true})
        cy.get('.q-card__section--horiz > .q-card__section > .text-h6').contains('Fale com a gente no Chat Atendimento de segunda à sexta, das 09h às 18h.')
        cy.get(':nth-child(4) > .q-btn').trigger('mouseover').click({force: true}).click()
      });
      
});