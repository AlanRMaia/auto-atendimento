/// <reference types="Cypress"/>
import { faker } from "@faker-js/faker";
//import { fakerBR } from 'fakerbr';
import path from "../../../selectors/path.sel.cy";
import mensagem from "../../../support/enum/mensagemAlertEnum";
var fakerBr = require("faker-br");



describe("Suite de teste Operação Filial ETC", () => {
  beforeEach(() => {  

    cy.viewport(1920, 1080);
    cy.login();
  });

  // ------ Abrir Atendimento de Renovação ------//
  it("Criando pedido API e incluindo operação Incluir Filial", () => {
    const transportador = require("../../../fixtures/data/transportador/etc_ativo/88832738000166");
    const usuario = require("../../../fixtures/usuario.json");
    let idPrePedido;
    const sindicato = {
      idEntidade: {
        sitcarga: 116,
        banco: 37
      },
      perfil: "SETCAL  - Operador",
      sigla: "SETCAL",
      path: path.generic.perfilSitcarga.SETCALOperador,
    };
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
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
        
        cy.url().should('include', `detalhe`)        
        cy.incluirFilial() 
        cy.notificacao(mensagem.DadosSalvoSucesso)                            

        cy.cancelarPrePedidoAPI(idPrePedido).then(response => {
          expect(response.status).to.equal(200);
        })  
      });
    });
      
  });
  
});
