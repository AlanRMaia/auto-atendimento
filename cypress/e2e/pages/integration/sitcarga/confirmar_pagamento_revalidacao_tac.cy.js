/// <reference types="Cypress"/>
//import { fakerBR } from 'fakerbr';
import path from '../../../../selectors/path.sel.cy';
import urls from '../../../../support/urls';

  let idPrePedido = '2071541'
  
  let boleto = {
    codigoBarra : '',
    nossoNumero : '16030416',
    valorPago: 'R$ 750,00',
    meioPagamento: 'Boleto',
    dataEmissao: '13/10/2023',
    utilizacao: 'NÃO UTILIZADO',
    valorBoleto: 'R$ 750,00',
    situacao: 'PAGO'    
  };
  const transportador = {
    cpfCnpj: "253.635.438-50",
    nome: "MARIA APARECIDA PEDROSO",
    rntrc: "002331850",
    situacao: "VENCIDO",
    saldo: "R$ 0,00",
    sigla: "TAC",
    tipo: "Autônomo"
  };
  const sindicato = {
    perfil: "FETAC-MG - Master",
    sigla: "FETAC-MG",
    path: path.generic.perfilSitcarga.FETACMGMaster
  }  
  

describe('Grupo de teste Atendimento Renovação TAC', () => {  

  beforeEach(() => { 
    
    cy.reload();  
    cy.viewport(1920, 1080);
    
  });
  

      describe('Iniciando o acesso ao Sitcarga', () => {
          it('Consultando se o pagamento do boleto foi compensado', () => {
            cy.intercept('POST', '/autoatendimento/prepedido/consultar?gridName=grid').as('listaPrepedido')
            cy.intercept('POST', '/autoatendimento/prepedido/gerarpedido/').as('gerarpedido')
            cy.intercept('POST', 'https://sac-evoservicosfinanceiros.ascbrazil.com.br/site-visitantes/monitor-visitante').as('visitante')
            cy.intercept('POST', '/institucional/authsca').as('autenticacao')
            cy.intercept('POST', '**/rntrc/veiculopedido/listarservicos').as('listaServicos')
            cy.intercept('POST', '/financeiro/consultarpagamentos/consultar/').as('consultarpagamentos')  
            cy.intercept('POST', '/financeiro/consultarpagamentos/consultarlistaboletos?gridName=grid').as('listaboletos')
            cy.intercept('POST', '/financeiro/consultarpagamentos/consultarlistacartoes?gridName=gridCartao').as('listacartao')

            cy.visit(urls.sitcargaInitial);
            cy.get('.cookie-message > :nth-child(1) > p', {timeout: 10000})
            .should('be.visible')
            .contains('Utilizamos cookies essenciais e tecnologias semelhantes para melhorar a sua experiência no nosso site. Para maiores informações, acesse nossa Política de Privacidade.')
            .get('#btnAccept').click({force: true})           
            cy.loginSitcarga()
            cy.get('.logo > img', {timeout: 30000}).should('have.attr','src', path.sitcargaHomePage.imgLogon)
            cy.get(':nth-child(1) > .m-r-sm').contains(Cypress.env('usuario').nome.toUpperCase()) 
            cy.get('.dropdown-toggle').click({force: true})
            .get('#niveis-usuario > li > a').contains(sindicato.perfil, {timeout: 10000}).click({force: true}) 
            cy.get('.dropdown-toggle').contains(sindicato.perfil, {timeout: 10000})
            cy.wait('@visitante') 

            cy.get('#side-menu > li > a > span').contains('Financeiro', {timeout: 10000}).click({force: true}).click({force: true})
            .get('a[href="/financeiro/consultarpagamentos"]', {timeout: 10000}).contains('Consultar Pagamentos', {timeout: 10000}).click({force: true})
            cy.wait('@visitante') 
            
            cy.get(':nth-child(1) > .col-lg-12 > .ibox > .ibox-title > h5').contains('Consulta de Pagamentos Os campos com (*) são obrigatórios')
            cy.get(path.sitcargaConsultaPagamentosPage.pesquisaTransportador).click({force: true})
            cy.get('#CPFCNPJ', {timeout: 30000} ).type(transportador.cpfCnpj)
            cy.get('#btn-consultar').click()
            cy.wait('@consultarpagamentos')
            cy.wait('@listaboletos')
            cy.wait('@listacartao')

            cy.get('#resultado > .col-lg-12 > .ibox > :nth-child(1) > h5').should('have.text', ' Detalhes do Pagamento')
            cy.get('#div_dados_transportador > :nth-child(1) > .page-header', {timeout: 20000}).contains('Dados do Transportador')
            cy.get('#CpfCnpj').should('have.text', transportador.cpfCnpj)
            cy.get('#CodigoTipoTransportador').should('have.text', transportador.sigla)
            cy.get('#NomeTransportador').should('have.text',transportador.nome)
            cy.get('#Rntrc').should('have.text', transportador.rntrc)
            cy.get('#DescricaoSituacaoRNTRC').should('have.text', transportador.situacao)
            cy.get('#ValorSaldoCartaoPrePago').should('have.text', transportador.saldo)

            cy.get(':nth-child(3) > .col-lg-5 > #NossoNumero').should('have.text', boleto.nossoNumero)
            cy.get('#DescricaoSituacao').should('have.text', boleto.situacao)
            cy.get(':nth-child(2) > .col-lg-5 > #NossoNumero').should('have.text', boleto.meioPagamento)
            cy.get('#ValorPago').should('have.text', boleto.valorPago)
            cy.get('#ValorBoleto').should('have.text', boleto.valorBoleto )
            cy.get('#DataEmissao').should('have.text', boleto.dataEmissao)
            cy.get('#DescricaoUtilizacao').should('have.text', boleto.utilizacao)

            
          });
      });

});