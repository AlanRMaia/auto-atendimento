import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../../selectors/path.sel.cy';
import mensagem from "../../../support/mensagemAlertEnum";
var fakerBr = require('faker-br');

let idPrePedido = '1000000';

const transportador = {
    cpfCnpj: "143.854.008-65",
    nome: "TAC - NAILTON NIVALDO SOARES",
    rntrc: "000010100",
    situacao: "ATIVO",
    saldo: "R$ 0,00",
    sigla: "TAC",
    tipo: "Autônomo"
  };

  const sindicato = {
    perfil: "FETAC-MG - Master",
    sigla: "FETAC-MG",
    path: path.generic.perfilSitcarga.FETACMGMaster
  }

  const teste = {
    "tipo": "ALT",
    "tipoDescricao": "Alteração de Dados",
    "codSituacao": "CAD",    
  }

describe('Incluir uma operação de transportador em um pedido', () => {
    beforeEach(() => {
        cy.reload()
        cy.viewport(1920, 1080);
        cy.login()

    });
    
    it('Criando pedido e incluir uma operação de Transportadr TAC', () => {
        describe('Criando pedido', () => {
            cy.intercept('POST', 'https://sitcargaapitest/rntrc/PrePedido', {
                "id": idPrePedido,
                "tipo": "ALT",
                "tipoDescricao": "Alteração de Dados",
                "codSituacao": "CAD",
                "situacao": "EM CADASTRAMENTO",
                "cpfCnpjTransportador": "14385400865",
                "transportador": "NAILTON NIVALDO SOARES",
                "tipoTransportador": "TAC",
                "tipoTransportadorDescricao": "Autônomo",
                "usuarioNivelAbertura": 249809,
                "motivoRejeicao": "string",
                }).as('postprepedido')

                
            
                cy.intercept('GET', `https://sitcargaapitest/rntrc/PrePedido/${idPrePedido}`, {
                "id": idPrePedido,
                    ...teste,
                
                "situacao": "EM CADASTRAMENTO",
                "cpfCnpjTransportador": "14385400865",
                "transportador": "NAILTON NIVALDO SOARES",
                "tipoTransportador": "TAC",
                "tipoTransportadorDescricao": "Autônomo",
                "usuarioNivelAbertura": 249809,
                "motivoRejeicao": "string"
                
                } ).as('getacessoprepedido')
          cy.log(`Testes sendo executados no ambiente de ${Cypress.env('ENVIRONMENT')}`)       
          //Logar na página com o usuario         
          //Clicar na opção Regularização RNTRC no menu lateral
          cy.get(path.atendimentoPage.regularizacao, {timeout: 30000}).click({force: true});
          //Selecionando o tipo de atendimento Renovação RNTRC
          cy.atendimentosRegularizacao('Alteração de Dados')         
          //
          cy.get(path.criarPedidoPage.inputTipoTransportador)
            .click({force: true})
            .get(path.criarPedidoPage.tipoTransportador).contains(transportador.tipo, {timeout: 200}).click({force: true})        
          cy.get(path.criarPedidoPage.cpfCnpj).type(transportador.cpfCnpj);
          cy.get(path.generic.botaoSubmit).click({ force: true });
          
          cy.notificacao(mensagem.AtendimentoCriadoSucesso)    
        
          cy.get(path.generic.idAtendimento, {timeout: 10000}).then((element)=> {          
            idPrePedido = element.text().substring(1);
            expect(element.text()).to.be.equal(`#${idPrePedido}`)
          })
                
        });
          
        describe('Incluindo operação Transportador', () => {
            cy.intercept('POST', `https://sitcargaapitest/rntrc/prepedido/${idPrePedido}/transportador`, []).as('posttransportador')
          cy.intercept('PUT', `https://sitcargaapitest/rntrc/prepedido/${idPrePedido}/transportador`, {
            "nome": "Alan Maia",
            "declaracaoCapacidadeFinanceira": true,
            "numeroIdentidade": "234667855",
            "nomeFantasia": "string",
            "inscricaoEstadual": "string",
            "avisoEmailMovimentacaoFrota": true,
            "registroJunta": "string",
            "inscricaoOCB": "string",
            "transporteInternacional": true,
            "adimplenteAssociacao": true,
            "possuiAnexo": true
          }).as('posttransportador')
          cy.intercept('GET', `https://sitcargaapitest/rntrc/PrePedido/${idPrePedido}/transportador`, {
            
              "nome": "Alan Maia",
              "declaracaoCapacidadeFinanceira": true,
              "numeroIdentidade": "234667855",
              "nomeFantasia": "string",
              "inscricaoEstadual": "string",
              "avisoEmailMovimentacaoFrota": true,
              "registroJunta": "string",
              "inscricaoOCB": "string",
              "transporteInternacional": true,
              "adimplenteAssociacao": true,
              "possuiAnexo": true
            
          }).as('detalhartransportador')
          cy.intercept('GET', `https://sitcargaapitest/rntrc/PrePedido/${idPrePedido}`, {
            "id": idPrePedido,
            "tipo": "ALT",
            "tipoDescricao": "Alteração de Dados",
            "codSituacao": "CAD",
            "situacao": "EM CADASTRAMENTO",
            "cpfCnpjTransportador": "14385400865",
            "transportador": "NAILTON NIVALDO SOARES",
            "tipoTransportador": "TAC",
            "tipoTransportadorDescricao": "Autônomo",
            "usuarioNivelAbertura": 249809,
            "motivoRejeicao": "string",
            "transportadorPedido": {
              "nome": "Alan Maia",
              "declaracaoCapacidadeFinanceira": true,
              "numeroIdentidade": "234667855",
              "nomeFantasia": "string",
              "inscricaoEstadual": "string",
              "avisoEmailMovimentacaoFrota": true,
              "registroJunta": "string",
              "inscricaoOCB": "string",
              "transporteInternacional": true,
              "adimplenteAssociacao": true,
              "possuiAnexo": true
            }}).as('gettransportador')

          cy.url().should('include', `detalhe`)

          cy.wait('@getacessoprepedido')
          cy.operacaoTransportador(fakerBr, transportador.sigla)
          cy.wait('@posttransportador').then(response => {
            const {
              id,
              codSituacao,
              cpfCnpjTransportador,
              entidadePedido,
              situacao,
              tipo,
              tipoDescricao,
              tipoTransportador,
              tipoTransportadorDescricao,
              transportador,
              transportadorPedido,
               usuarioNivelAbertura } = response.response.body

                        
          })
          
          cy.wait('@gettransportador').then((response) => {
            const { 
                   id, 
                   codSituacao,
                   cpfCnpjTransportador,
                   entidadePedido,
                   situacao,
                   tipo,
                   tipoDescricao,
                   tipoTransportador,
                   tipoTransportadorDescricao,
                   transportador,
                   transportadorPedido,
                   usuarioNivelAbertura } = response.response.body 

                cy.log('Resposta ID:', id)
                cy.log('Resposta codSituacao: ', codSituacao )
                cy.log('Resposta cpfCnpjTransportador:', cpfCnpjTransportador)
                cy.log('Resposta entidadePedido:', entidadePedido)
                cy.log('Resposta situacao:', situacao)
                cy.log('Resposta tipo:', tipo)
                cy.log('Resposta tipoDescricao:', tipoDescricao)
                cy.log('Resposta tipoTransportador:', tipoTransportador)
                cy.log('Resposta tipoTransportadorDescricao:', tipoTransportadorDescricao)
                cy.log('Resposta transportador:', transportador)
                cy.log('Resposta transportadorPedido:', transportadorPedido)
                cy.log('Resposta usuarioNivelAbertura:', usuarioNivelAbertura)            
          })

          cy.notificacao(mensagem.TransportadorSucesso)  

          cy.wait('@detalhartransportador')
        });
    });
    
});