/// <reference types="Cypress"/>
import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../../selectors/path.sel.cy';

  let usuario;

describe('Grupo de testes navegação de serviços', () => {
    beforeEach(() => {
      cy.reload();  
      cy.viewport(1920, 1080);      
      cy.intercept('GET', '**/rntrc/entidade/pontosatendimento?tipoTransportador**').as('ponstosatendimento')
      cy.intercept('GET', 'https://maps.googleapis.com/maps/api/mapsjs/**').as('mpsjs')
      cy.intercept('POST', 'https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetViewportInfo').as('getViewportInfo')
      });

      it('Estado com pontos de atendimento', () => {
        const listaTrp = ['Autônomo', 'Empresa', 'Cooperativa']
        let tipoTransportador = faker.helpers.arrayElement(listaTrp)
        let uf = faker.helpers.arrayElement(path.generic.uf)
        cy.visit('/')
        cy.get(path.institucionalPage.tipoTransportador).click()
        .get(path.generic.listaVirtual).contains(tipoTransportador).click()
        cy.log(`nome: ${uf.nome}`)
        cy.get(path.institucionalPage.uf).click({force: true}).get(path.generic.listaVirtual).contains(uf.nome).click({force: true})
        cy.get(path.generic.botaoSubmit).click({force: true})
        cy.wait('@ponstosatendimento')


        cy.get(path.generic.title).contains('Pontos de Atendimento')
        cy.getElementList(path.pontosAtendimentoPage.pontosAtendimentoList, 'Nenhum ponto de atendimento foi encontrado.' )
        cy.get(path.pontosAtendimentoPage.tipoTransportador).contains(tipoTransportador)
        cy.get(path.pontosAtendimentoPage.uf).contains(uf.nome);
        cy.wait('@mpsjs')
        cy.wait('@getViewportInfo')

      });
      
});