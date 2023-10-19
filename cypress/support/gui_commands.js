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
const each = require('cypress-recurse');
require('cypress-xpath');

Cypress.Commands.add('getByData', (selector) => {
  return cy.get(`[data-test=${selector}]`);
});

Cypress.Commands.add('login', (usuario = Cypress.env('usuario')) => {
  // cy.session(usuario, () => {
    cy.intercept('POST', '/acesso/identity/login').as('loginacesso')
    cy.visit(urls.login, {timeout: 20000});
  
    cy.get(path.loginPage.cpf, {timeout:20000}).type(usuario.cpf);
    cy.get(path.loginPage.senha).type(usuario.senha);
    cy.get(path.generic.botaoSubmit).click({force: true}); 
    cy.wait('@loginacesso', {timeout: 90000})

    cy.get(path.generic.title, {timeout: 20000}).should('have.text', ' Consultar Atendimentos ')
  // },
  // {cacheAcrossSpecs: true}
  // )  
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

Cypress.Commands.add('acessarPedido', (idPrePedido) => { 
  cy.intercept('GET', `/rntrc/PrePedido/${idPrePedido}`).as('acessarPrePedido')
  cy.get(path.atendimentoPage.numeroAtendimento).type(idPrePedido).get(path.generic.botaoSubmit).click({force: true})
  cy.wait('@acessarPrePedido')
  cy.get(path.generic.idAtendimento, {timeout: 20000}).should('have.text', `#${idPrePedido}`);
});



Cypress.Commands.add('anexarDocumentosVeiculo', (selectFile, veiculo) =>{  
  cy.intercept('POST', '**/imagem').as('salvarcrlv')
    cy.intercept('GET', '**?retornaImagens=true').as('salvarcontrato')
    cy.get(path.detalhamentoAtendimentoPage.operacaoVeiculoCard,{timeout: 20000}).should('be.visible')
    cy.document({timeout:20000}).then((doc) => {      
       let found;
        return new Cypress.Promise(resolve => {
          
          const element = doc.querySelector(path.detalhamentoAtendimentoPage.gridOperacoes).children
          resolve(element)
          cy.wrap(element).each((ele, index, list)=> {
            return new Cypress.Promise(resolve => {
              cy.wrap(ele).find(path.detalhamentoAtendimentoPage.descricaoOperacao, {timeout: 20000}).then((text) => {
                  let placa = text.text().substring(0, 7)
                  cy.log('valor da placa:',veiculo.placa)          
                  if (placa == veiculo.placa) {                  
                    found = index                  
                  }               
                })
                resolve(found)
            })          
          }) 
          cy.wrap(element).then((ele)=>{
            cy.wrap(ele[found]).find(path.detalhamentoAtendimentoPage.anexarDocumentoVeiculo, {timeout: 20000}).click({force: true})
          })    
        })
      })  
    
    cy.get(path.generic.title).contains('Documento do Veículo', {timeout: 20000})

    if (veiculo.propriedade != 'Arrendado') {
      cy.get(path.anexarDocumentoVeiculo.crlv, {timeout: 10000}).selectFile(selectFile.crlv, {force: true})
    } else {
      cy.get(path.anexarDocumentoVeiculo.contratoArrendamento, {timeout: 10000})
      .selectFile(selectFile.contrato)
      cy.get(path.anexarDocumentoVeiculo.crlv, {timeout: 10000}).selectFile(selectFile.crlv)          
    }
    cy.get(path.generic.botaoSubmit).click({force: true})
    cy.wait('@salvarcontrato')
    cy.wait('@salvarcrlv', {timeout: 10000})
  })


Cypress.Commands.add('notificacao', (mensagem, arquivo) => {
  if (typeof arquivo === "undefined") {
    cy.get(path.generic.mensagemNotificacao, {timeout: 20000}).should('be.visible').then((element) => {
      cy.get(path.generic.mensagemNotificacao).should('be.visible')
      expect(mensagem).to.be.contains(element.text())
      cy.get(path.generic.mensagemFechar).wait(2000).click({multiple: true});      
    }     
  )
  } else {
    const caminho = require('path')
    cy.get(path.generic.mensagemNotificacao, {timeout: 20000}).should('be.visible').then((element) => {
      cy.get(path.generic.mensagemNotificacao).should('be.visible')      
      expect(`Arquivo ${caminho.basename(arquivo)} ${mensagem}`).to.be.contains(element.text())
      cy.get(path.generic.mensagemFechar).wait(2000).click({multiple: true});      
    }     
  )
  }
  
})

Cypress.Commands.add('atendimentosRegularizacao', (atendimento) =>{
  cy.document({timeout: 10000}).wait(5000).then((doc) => {
          const element = doc.querySelector(path.regularizacaoPage.listaAtendimento).children
            cy.wrap(element).each((ele, index, list)=>  {
              cy.wrap(ele).find(path.regularizacaoPage.atendimento, {timeout: 10000}).then((text) => {
                let valor = text.text()
                cy.log('Atendimento:', atendimento)          
                if (valor === atendimento) {
                  cy.wrap(ele).find(path.generic.botaoSubmit).click({force: true}) 
                  return false                                  
                } else {
                  cy.log('Valor encontrado', valor)                  
                }                
              })             
              
            }) 
        })  
      
    })

    Cypress.Commands.add('gerarDadosResponsePrePedido', (prePedido, transportador) => {
    
      cy.writeFile('cypress/fixtures/intercept/gerarResponsePrePedido.json', {
        id: `${prePedido.id}`,
        tipo: prePedido.tipo, //ALT 
        tipoDescricao: prePedido.tipoDescricao , //tipo de pedido 'Cadastro, Alteração de dados ...'
        codSituacao: prePedido.codSituacao, //CAD
        situacao: prePedido.situacao, //EM CADASTRAMENTO
        cpfCnpjTransportador: transportador.dadosTransportador.cpfCnpj,
        transportador: transportador.dadosTransportador.nome,
        tipoTransportador: transportador.dadosTransportador.sigla, //TAC ETC CTC
        tipoTransportadorDescricao: transportador.dadosTransportador.tipo, //Autônomo Empresa Cooperativa
        usuarioNivelAbertura: 249809,
        motivoRejeicao: prePedido.motivoRejeicao,
        
      })
    })

    Cypress.Commands.add('gerarDadosResponseAcessarPrePedido', (prePedido, transportador) => {
    
      cy.writeFile('cypress/fixtures/intercept/gerarResponseAcessarPrePedido.json', {
        id: `${prePedido.id}`,
        tipo: prePedido.tipo, //ALT 
        tipoDescricao: prePedido.tipoDescricao , //tipo de pedido 'Cadastro, Alteração de dados ...'
        codSituacao: prePedido.codSituacao, //CAD
        situacao: prePedido.situacao, //EM CADASTRAMENTO
        cpfCnpjTransportador: transportador.dadosTransportador.cpfCnpj,
        transportador: transportador.dadosTransportador.nome,
        tipoTransportador: transportador.dadosTransportador.sigla, //TAC ETC CTC
        tipoTransportadorDescricao: transportador.dadosTransportador.tipo, //Autônomo Empresa Cooperativa
        usuarioNivelAbertura: 249809,
        motivoRejeicao: prePedido.motivoRejeicao,
        
      })
    })

    Cypress.Commands.add('gerarDadosOperacaoTransportador', (prePedido, transportador) => {
    
      cy.writeFile('cypress/fixtures/intercept/gerarDadosOperacaoTransportador.json', {
        nome: transportador.dadosTransportador.nome,
          declaracaoCapacidadeFinanceira: true,
          numeroIdentidade: transportador.dadosTransportador.rg,
          nomeFantasia: transportador.dadosTransportador.nomeFantasia,
          inscricaoEstadual: transportador.dadosTransportador.inscricaoEstadual,
          avisoEmailMovimentacaoFrota: true,
          registroJunta: transportador.dadosTransportador.registroJunta,
          inscricaoOCB: transportador.dadosTransportador.inscricaoOCB,
          transporteInternacional: true,
          adimplenteAssociacao: true,
          possuiAnexo: true,        
      })
    })
    
    Cypress.Commands.add('gerarDadosResponseOperacaoTransportadorPrePedido', (prePedido, transportador) => {
    
      cy.writeFile('cypress/fixtures/intercept/gerarDadosResponseOperacaoTransportadorPrePedido.json', {
        id: prePedido.id,
        tipo: prePedido.tipo, //ALT
        tipoDescricao: prePedido.tipoDescricao , //tipo de pedido 'Cadastro, Alteração de dados ...'
        codSituacao: prePedido.codSituacao, //CAD
        situacao: prePedido.situacao, //EM CADASTRAMENTO
        cpfCnpjTransportador: transportador.dadosTransportador.cpfCnpj,
        transportador: transportador.dadosTransportador.nome,
        tipoTransportador: transportador.dadosTransportador.sigla, //TAC ETC CTC
        tipoTransportadorDescricao: transportador.dadosTransportador.tipo, //Autônomo Empresa Cooperativa
        usuarioNivelAbertura: 249809,
        motivoRejeicao: prePedido.motivoRejeicao,
        transportadorPedido: {
          nome: transportador.dadosTransportador.nome,
          declaracaoCapacidadeFinanceira: true,
          numeroIdentidade: transportador.dadosTransportador.rg,
          nomeFantasia: transportador.dadosTransportador.nomeFantasia,
          inscricaoEstadual: transportador.dadosTransportador.inscricaoEstadual,
          avisoEmailMovimentacaoFrota: true,
          registroJunta: transportador.dadosTransportador.registroJunta,
          inscricaoOCB: transportador.dadosTransportador.inscricaoOCB,
          transporteInternacional: true,
          adimplenteAssociacao: true,
          possuiAnexo: true,
        },        
      })
    })        

    