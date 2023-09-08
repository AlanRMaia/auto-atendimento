import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../../../selectors/path.sel.cy';
import mensagem from "../../../../support/mensagemAlertEnum";
import urls from '../../../../support/urls';

  let usuario;
  let veiculo01;
  let veiculo02;
  let veiculo03;
  let doc; 
  let cpfCnpj = '346.575.509-00';
  let idPrePedido = '2071350';
  let codigoBarra = '03399841145810000015580180001010794340000046200';
  let nossoNumero = ''
  var fakerBr = require('faker-br');
  const transportador = {
    cpfCnpj: "346.575.509-00",
    nome: "TAC - ODACIR NUNES PIRES",
    rntrc: "000010024",
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
    
    cy.fixture("data/doc/documentos").then((data) => {
      doc = data
    })

    cy.fixture("data/veiculos/IAQ9412").then((iaq9412) => {
      veiculo01 = iaq9412
      veiculo01.crlv = doc.crlv
      veiculo01.contrato = doc.contrato

    })

    cy.fixture("data/veiculos/DAY7G42").then((day7g42) => {
      veiculo02 = day7g42
      veiculo02.crlv = doc.crlv
      veiculo02.contrato = doc.contrato
    })

    cy.fixture("data/veiculos/BSG1253").then((bsg1253) => {
      veiculo03 = bsg1253
      veiculo03.crlv = doc.crlv
      veiculo03.contrato = doc.contrato
    })
    

    cy.fixture('usuario').then((data) => {
      usuario = data;
    });
    cy.reload();  
    cy.viewport(1920, 1080);
    cy.wait(2000)  
  });
  

      describe('Iniciando o acesso ao Sitcarga', () => {
          it('Logando na página Sitcarga', () => {
            cy.visit(urls.sitcargaInitial);
            cy.get('.cookie-message > :nth-child(1) > p')
            .should('be.visible')
            .contains('Utilizamos cookies essenciais e tecnologias semelhantes para melhorar a sua experiência no nosso site. Para maiores informações, acesse nossa Política de Privacidade.')
            .get('#btnAccept').click({force: true})

            cy.get('.middle-box > :nth-child(1) > .font-bold').should('have.text', 'FAÇA SEU LOGIN')
            cy.get('#CPF').type(usuario.cpf)
            cy.get('#Senha').type(usuario.senha)
            cy.get('#btn-login').click({force: true})

            cy.get('.logo > img', {timeout: 30000}).should('have.attr','src', path.sitcargaHomePage.imgLogon)
            cy.get(':nth-child(1) > .m-r-sm').contains(usuario.nome.toUpperCase()) 
            cy.get('.dropdown-toggle').click({force: true})
            .get(sindicato.path).should('have.text', sindicato.perfil).click({force: true}) 
            //.get('#niveis-usuario > :nth-child(10) > a').click({force: true})
            cy.get('.dropdown-toggle').should('have.text', `${sindicato.perfil} `)
            cy.xpath('/html/body/div[2]/nav/div/ul/li[9]/a/span[1]', {timeout: 10000}).contains('Financeiro').click({force: true})
            cy.get('.active > .nav > :nth-child(2) > a').contains('Consultar Pagamentos').click({force: true})
            cy.get(':nth-child(1) > .col-lg-12 > .ibox > .ibox-title > h5').contains('Consulta de Pagamentos Os campos com (*) são obrigatórios')
            cy.get(':nth-child(2) > .iradio_square-green > .iCheck-helper').click({force: true})
            cy.get('#CPFCNPJ', {timeout: 30000} ).type(transportador.cpfCnpj)
            cy.get('#btn-consultar').click()

            cy.get('#div_dados_transportador > :nth-child(1) > .page-header', {timeout: 20000}).contains('Dados do Transportador')
            cy.get('#CpfCnpj').should('have.text', transportador.cpfCnpj)
            cy.get('#CodigoTipoTransportador').should('have.text', transportador.sigla)
            cy.get('#NomeTransportador').should('have.text',transportador.nome)
            cy.get('#Rntrc').should('have.text', transportador.rntrc)
            cy.get('#DescricaoSituacaoRNTRC').should('have.text', transportador.situacao)
            cy.get('#ValorSaldoCartaoPrePago').should('have.text', 'R$ 924,00')
            
            let valor01 =   codigoBarra.substring(18, 20)
            let valor02 = codigoBarra.substring(21, 27)
            cy.get('#grid > table').contains('td', `${valor01}${valor02}`)        
            
          });
      });

});