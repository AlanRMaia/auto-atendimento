import { faker } from "@faker-js/faker";
//import { fakerBR } from 'fakerbr';
import path from "../../../selectors/path.sel.cy";
import mensagem from "../../../support/mensagemAlertEnum";
var fakerBr = require("faker-br");

describe("Criação de pedido via API", () => {
  const transportador = require("../../../fixtures/data/transportador/tac_ativo/14385400865");

  beforeEach(() => {
    cy.intercept("GET", "**/validarpedido").as("validarpedido");
    cy.intercept("PUT", "**/finalizar").as("finalizarpedido");
    cy.intercept("GET", `https://sitcargaapitest/rntrc/PrePedido/**`).as(
      "gridoperacao"
    );
    cy.intercept(
      "GET",
      "https://sitcargaapitest/rntrc/PrePedido/listarpedidos**"
    ).as("listapedidos");

    cy.viewport(1920, 1080);
    cy.login();
  });

  it("Abrindo pedido de Alteração de dados TAC", () => {    
    const tipo = 'ALT'    
    let idPrePedido;
    cy.criarPedidoAPI(transportador.dadosTransportador, tipo).then(response => {
        
            expect(response.status).to.equal(200)
            expect(response.body.cpfCnpjTransportador).to.equal(transportador.dadosTransportador.cpfCnpj)
            expect(response.body.transportador).to.equal(transportador.dadosTransportador.nome)
            expect(response.body.situacao).to.equal('EM CADASTRAMENTO')
            expect(response.body.tipoTransportador).to.equal(transportador.dadosTransportador.sigla)
            expect(response.body.tipoTransportador).to.equal(tipo)
            expect(response.body.codSituacao).to.equal('CAD')
            idPrePedido = response.body.id;             
    })
    cy.wait("@listapedidos");
    cy.wait(2000);
    cy.get(path.atendimentoPage.numeroAtendimento).type(idPrePedido);
    cy.get(path.generic.botaoSubmit)
      .click({ force: true })
      .wait("@gridoperacao");
    cy.get(path.generic.idAtendimento, { timeout: 10000 }).then((element) => {
      expect(element.text()).to.be.equal(`#${idPrePedido}`);
    });
    cy.get(path.generic.botaoCancelar).click({ force: true });
  });
});
