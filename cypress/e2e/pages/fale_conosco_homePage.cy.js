
import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";

  let usuario;

describe('Grupo de testes fale conosco', () => {
    beforeEach(() => {
        cy.fixture('usuario').then((data) => {
          usuario = data;
        });
        cy.reload();  
        cy.viewport(1280, 720);
        cy.wait(2000)  
      });

      it('Fale conosco email', () => {
        
        //let uf = faker.helpers.arrayElement(path.generic.uf)
        cy.visit('http://localhost:9000/#/')
        cy.get(path.institucionalPage.faleConoscoEmail).click({force: true})         
        cy.get('.loader')
        .should('not.exist')
      });

      it('Fale conosco chat', () => {
        let uf = {
          nome: 'Rio Grande do Sul',
          path: '/html/body/div[8]/div/div[2]/div[23]/div[2]/div/span'
        }
        //let uf = faker.helpers.arrayElement(path.generic.uf)
        cy.visit('http://localhost:9000/#/')
        cy.get(path.institucionalPage.chat).click({force: true})
        

      });
      
});