/// <reference types="Cypress"/>
import { faker } from "@faker-js/faker";
//import { fakerBR } from 'fakerbr';
import path from "../../../selectors/path.sel.cy";
import mensagem from "../../../support/enum/mensagemAlertEnum";
var fakerBr = require("faker-br");
const celular = '(61)9990-67527'



describe("Grupo de teste Atendimento Renovação TAC", () => {
  beforeEach(() => {
    
    cy.intercept(
      "GET",
      `**/rntrc/PrePedido/listarentidadesdisponiveis**`
    ).as("listaSindicatos");

    cy.viewport(1920, 1080);
    cy.login();
  });

  // ------ Abrir Atendimento de Renovação ------//
  it("Criando pedido API e incluindo operação Endereço Residêncial", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");
    const sindicato = {
      perfil: "FETAC-MG - Master",
      sigla: "FETAC-MG",
      path: path.generic.perfilSitcarga.FETACMGMaster,
    };

    let idPrePedido;
    const idEntidade = 21 
    cy.intercept('GET', `/rntrc/PrePedido/${idPrePedido}/detalhar`).as('detalheGridOperacao') 
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );

    //? Arrange

    cy.criarPrePedidoAPI(transportador.dadosTransportador, "ALT").then((response) => {
      return new Cypress.Promise((resolve) => {
        expect(response.status).to.equal(200);
        expect(response.body.cpfCnpjTransportador).to.equal(
          transportador.dadosTransportador.cpfCnpj
        );
        expect(response.body.transportador).to.equal(transportador.dadosTransportador.nome);
        expect(response.body.situacao).to.equal("EM CADASTRAMENTO");
        expect(response.body.codSituacao).to.equal("CAD");
        idPrePedido = response.body.id;
        resolve(idPrePedido);
        cy.visit(`atendimento/${idPrePedido}/detalhe`);
        cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
          (element) => {
            expect(element.text()).to.be.equal(`#${idPrePedido}`);
          }
        );

        // ------ Criar operação Incluir Contato Telefone -----//
        cy.contatoPrePedidoAPI(idPrePedido, 2, transportador.contatos.telefone).then(response => {
          expect(response.status).to.equal(200);
        })

        // ------ Criar operação Excluir Contato Email -----//
        cy.contatoPrePedidoAPI(idPrePedido, 4, transportador.contatos.email).then(response => {
          expect(response.status).to.equal(200);
        }) 
        
        // ------- Incluir Entidade no pedido ----- //
        cy.entidadePrePedidoAPI(idEntidade, idPrePedido).then(response => {
          expect(response.status).to.equal(200);
        })

        //? Act
        //-------- Criar operação Incluir endereço Residencial ---------- //
        cy.url().should("include", `detalhe`);
        cy.incluirEnderecoResidencial(faker)

        //? Assert
        cy.notificacao(mensagem.DadosSalvoSucesso);        

        // // ------ Detalhar operação Contato Telefone -----/  
        // cy.url().should("include", `detalhe`);
        // cy.detalharOperacaoMotorista(transportador.motorista);
        
        
        // ------ Finalizando o pedido ------ //
        cy.finalizarPrePedidoAPI(idPrePedido).then(response => {
          expect(response.status).to.equal(200);
        })
        
        cy.get(path.generic.botaoVoltar).click({force: true})
      });
    });      
  });
  
});
