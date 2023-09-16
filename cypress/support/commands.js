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
import operacao from "./OperacaoEnum";
require('cypress-xpath');

Cypress.Commands.add('getByData', (selector) => {
  return cy.get(`[data-test=${selector}]`);
});

Cypress.Commands.add('login', (cpf, senha) => {
  
  cy.visit(urls.login, {timeout: 20000});

  cy.get(path.loginPage.cpf, {timeout:20000}).type(cpf);
  cy.get(path.loginPage.senha).type(senha);
  cy.get(path.generic.botaoSubmit).click({force: true});
  cy.get(path.generic.title, {timeout: 20000}).should('have.text', 'Atendimentos')
  
});

Cypress.Commands.add('regularizacao', () => {
  cy.get(path.atendimentoPage.regularizacao).click({force: true});
});

Cypress.Commands.add('consultaRNTRC', () => {
  cy.get(path.atendimentoPage.consultaRNTRC).click({force: true});
});



Cypress.Commands.add('getElementListXpath', (xpath, element) => {
  cy.xpath(xpath, {timeout: 10000}).each(($ele, index, list) => {
    let value = $ele.text()
    if (value === element) {
      cy.log('Elemento encontrado');
      cy.wrap($ele).click({force: true});
      cy.log('Valor atual', value);
    } else {
      cy.log('Elemento não encontrado');
      cy.log('Valor esperado', element);
      cy.log('Valor atual', value);
    }
  });
});

Cypress.Commands.add('getElementList', (selector, element) => {
  cy.get(selector).each(($ele, index, list) => {
    let value = $ele.text()
    if (value === element) {
      cy.log('Elemento encontrado');
      cy.wrap($ele).click({force: true});
      cy.log('Valor atual', value);
    } else {
      cy.log('Elemento não encontrado');
      cy.log('Valor esperado', element);
      cy.log('Valor atual', value);
    }
  });
});

Cypress.Commands.add('acessarPedido', (idPedido) => { 
  cy.get(path.atendimentoPage.numeroPedido).type(idPedido).get(path.generic.botaoSubmit).click({force: true})
  .get(path.generic.idAtendimento, {timeout: 20000}).should('have.text', `#${idPedido}`);
});

Cypress.Commands.add('anexarDocumentosVeiculo', (selectFile, veiculo) =>{
  cy.document().wait(5000).then((doc) => {
      const element = doc.querySelector(path.detalhamentoAtendimentoPage.gridOperacoes).children
      cy.wrap(element).each((ele, index, list)=> {
        cy.wrap(list.length)       
        cy.wrap(ele).find(path.detalhamentoAtendimentoPage.descricaoOperacao).then((text) => {
          let placa = text.text().substring(0, 7)
          cy.log('valor da placa:',placa)          
          if (placa == veiculo.placa) {
            cy.wrap(ele)
            .find(path.detalhamentoAtendimentoPage.anexarDocumentoVeiculo).click({force: true})
          } else {
            cy.log(`não encontrou o valor: ${placa}`)
          }
        })
      }) 
      
    })
  
  
  
  cy.get(path.generic.title).should('have.text', ` Arquivos Veículo ${veiculo.placa}`)

  if (veiculo.propriedade != 'Arrendado') {
    cy.get(path.anexarDocumentoVeiculo.crlv, {timeout: 10000}).selectFile(selectFile.crlv)
  } else {
    cy.get(path.anexarDocumentoVeiculo.contratoArrendamento, {timeout: 10000})
    .selectFile(selectFile.contrato)
    cy.get(path.anexarDocumentoVeiculo.crlv, {timeout: 10000}).selectFile(selectFile.crlv)
        
  }
  cy.get(path.generic.botaoSubmit).click({force: true})
  })


Cypress.Commands.add('notificacao', (mensagem) => {
  cy.get(path.generic.mensagemNotificacao, {timeout: 20000}).then((element) => {      
    expect(mensagem).to.be.equal(element.text())
    cy.get(path.generic.mensagemFechar).click({force: true});      
  }     
)
})