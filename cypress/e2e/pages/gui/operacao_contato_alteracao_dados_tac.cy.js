/// <reference types="Cypress"/>
import { faker } from "@faker-js/faker";
//import { fakerBR } from 'fakerbr';
import path from "../../../selectors/path.sel.cy";
import mensagem from "../../../support/enum/mensagemAlertEnum";
var fakerBr = require("faker-br");
const celular = '(61)9990-67527'
const transportador = {
  cpfCnpj: "04265777104",
  nome: "ANTONIO DE JESUS SOUSA",
  rntrc: "000014838",
  situacao: "ATIVO",
  saldo: "R$ 0,00",
  sigla: "TAC",
  tipo: "Autônomo",
};
const sindicato = {
  perfil: "FETAC-MG - Master",
  sigla: "FETAC-MG",
  path: path.generic.perfilSitcarga.FETACMGMaster,
};

describe("Grupo de teste Atendimento Renovação TAC", () => {
  let idPrePedido = "";
  beforeEach(() => {
    cy.intercept("GET", "**/validarpedido").as("validarpedido");
    cy.intercept("PUT", "**/finalizar").as("finalizarpedido");
    cy.intercept("GET", `**/rntrc/PrePedido/**`).as(
      "gridoperacao"
    );
    cy.intercept(
      "GET",
      `**/rntrc/PrePedido/listarentidadesdisponiveis**`
    ).as("listaSindicatos");

    cy.viewport(1920, 1080);
    cy.login();
  });

  // ------ Abrir Atendimento de Renovação ------//
  it("Criando pedido API e incluindo operação transportador", () => {
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    cy.criarPrePedidoAPI(transportador, "ALT").then((response) => {
      return new Cypress.Promise((resolve) => {
        expect(response.status).to.equal(200);
        expect(response.body.cpfCnpjTransportador).to.equal(
          transportador.cpfCnpj
        );
        expect(response.body.transportador).to.equal(transportador.nome);
        expect(response.body.situacao).to.equal("EM CADASTRAMENTO");
        expect(response.body.codSituacao).to.equal("CAD");
        idPrePedido = response.body.id;
        resolve(idPrePedido);
        cy.visit(`atendimento/${idPrePedido}/detalhe`).wait("@gridoperacao");
        cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
          (element) => {
            expect(element.text()).to.be.equal(`#${idPrePedido}`);
          }
        );
      });
    });

    // ------ Criar operação Incluir Contato Email ------//
      cy.url().should("include", `detalhe`);
      cy.wait("@gridoperacao");
      cy.incluirContatoEmail(faker);
      cy.notificacao(mensagem.DadosSalvoSucesso);

      // ------ Criar operação Excluir Contato Telefone -----//
      cy.url().should("include", `detalhe`);
      cy.wait("@gridoperacao");
      cy.incluirContatoTelefone(faker);
      cy.notificacao(mensagem.DadosSalvoSucesso);

    
    cy.intercept("PUT", "**/entidade").as("entidadePUT");
    cy.intercept("POST", "**/entidade").as("entidadePOST");
    cy.intercept("GET", "**/valor**").as("tabela");
    cy.url().should("include", `detalhe`);
    cy.wait("@gridoperacao");

    cy.get(path.generic.botaoConfirmar, { timeout: 10000 })
      .should("be.visible")
      .click({ force: true });

    cy.get(path.generic.title, { timeout: 10000 }).contains(
      "Escolha Ponto de Atendimento"
    );

    cy.get(path.checkoutAtendimentoPage.pontosAtendimento, { timeout: 10000 })
      .click()      
      .type(sindicato.sigla)
      //.wait(5000)
      .wait('@listaSindicatos')
      .get(path.checkoutAtendimentoPage.listaSindicatos, { timeout: 10000 })
      .contains(sindicato.sigla, { timeout: 10000 })
      .click();

    cy.wait("@gridoperacao");
    cy.wait("@entidadePOST");
    cy.wait("@tabela");

    cy.get(path.generic.tabela, { timeout: 30000 }).then((ele) => {
      cy.log(ele.text());

      cy.wrap(ele)
        .get(`tbody>:nth-child(${1})>.text-left`)
        .should("have.text", "Alteração de Dados do Transportador (Gratuito)");
      cy.wrap(ele)
        .get(`tbody>:nth-child(${1})>:nth-child(2)`)
        .should("have.text", "R$0.00");
      cy.wrap(ele)
        .get(`tbody>:nth-child(${1})>.text-center`)
        .should("have.text", "1");
      cy.wrap(ele)
        .get(`tbody>:nth-child(${1})>:nth-child(4)`)
        .should("have.text", "R$0.00");

      cy.get(".q-table__bottom > .q-item__section--side").should(
        "have.text",
        " R$0.00"
      );
    });
    cy.get(path.checkoutAtendimentoPage.botaoConfirmar1).click({
      force: true,
    });

    // ------ Validação do pedido  -------//

    cy.get(
      ".q-stepper__tab--active > .q-stepper__label > .q-stepper__title"
    ).contains("Validar Atendimento");

    cy.get(".text-6").contains("Atendimento Válido");
    cy.wait("@validarpedido");
    cy.get(path.checkoutAtendimentoPage.botaoConfirmar2, {
      timeout: 10000,
    }).click({ force: true });

    cy.get(path.generic.title, { timeout: 10000 }).contains(
      "Confira o Resumo do Pedido"
    );

    cy.get(path.generic.tabela, { timeout: 30000 }).then((ele) => {
      cy.log(ele.text());

      cy.wrap(ele)
        .get(`tbody>:nth-child(${1})>.text-left`)
        .should("have.text", "Alteração de Dados do Transportador (Gratuito)");
      cy.wrap(ele)
        .get(`tbody>:nth-child(${1})>:nth-child(2)`)
        .should("have.text", "R$0.00");
      cy.wrap(ele)
        .get(`tbody>:nth-child(${1})>.text-center`)
        .should("have.text", "1");
      cy.wrap(ele)
        .get(`tbody>:nth-child(${1})>:nth-child(4)`)
        .should("have.text", "R$0.00");

      cy.get(".q-table__bottom > .q-item__section--side").should(
        "have.text",
        " R$0.00"
      );
    });

    cy.get(path.generic.finalizar).click({ force: true });

    cy.get(".q-ml-sm").should(
      "have.text",
      "Confirma a finalização do atendimento?"
    );
    cy.get(".q-card__actions > :nth-child(1) > .q-btn__content")
      .should("have.text", "OK")
      .click();

    // cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]', {timeout: 20000}).should('be.visible')

    // cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]', {timeout: 20000}).should('not.exist')*/
    cy.wait("@validarpedido");
    cy.wait("@finalizarpedido", { timeout: 120000 });
    cy.notificacao(mensagem.AtendimentofinalizadoSucesso);
  });
  
});
