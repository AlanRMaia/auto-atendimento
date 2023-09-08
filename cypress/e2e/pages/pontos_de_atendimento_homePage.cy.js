
import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";

  let usuario;

describe('Grupo de testes navegação de serviços', () => {
    beforeEach(() => {
        cy.fixture('usuario').then((data) => {
          usuario = data;
        });
        cy.reload();  
        cy.viewport(1280, 720);
        cy.wait(2000)  
      });

      it('Estado com pontos de atendimento', () => {
        let uf = {
          nome: 'Rio Grande do Sul',
          path: '/html/body/div[8]/div/div[2]/div[23]/div[2]/div/span'
        }
        //let uf = faker.helpers.arrayElement(path.generic.uf)
        cy.visit('http://localhost:9000/#/')
        cy.get(path.institucionalPage.tipoTransportador).click()
        .xpath('/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span').should('have.text', 'Autônomo').click()
        cy.log(`nome: ${uf.nome}`)
        cy.get(path.institucionalPage.uf).click({force: true}).xpath(uf.path).should('have.text', uf.nome).click({force: true})
        cy.get(path.generic.botaoSubmit).click({force: true})

        cy.get(path.generic.title).should('have.text', 'Pontos de Atendimento')
        cy.getElementList(path.pontosAtendimentoPage.pontosAtendimentoList, 'Nenhum ponto de atendimento foi encontrado.' )
        cy.get(path.pontosAtendimentoPage.tipoTransportador).should('have.text', 'Autônomo')
        cy.get(path.pontosAtendimentoPage.uf).should('have.text', uf.nome);

      });
      
});