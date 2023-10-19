/// <reference types="Cypress"/>
import { faker } from '@faker-js/faker'
//import { fakerBR } from 'fakerbr';
import path from "../../../selectors/path.sel.cy";
import mensagem from "../../../support/mensagemAlertEnum";
var fakerBr = require("faker-br");

const transportador = {
  cpfCnpj: "143.854.008-65",
  nome: "TAC - NAILTON NIVALDO SOARES",
  rntrc: "000010100",
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

const teste = {
  tipo: "ALT",
  tipoDescricao: "Alteração de Dados",
  codSituacao: "CAD",
};

describe("Incluir uma operação de transportador em um pedido", () => {
  const transportador = require("../../../fixtures/data/transportador/tac_ativo/14385400865");
  let idPrePedido = faker.number.int({min:200000, max: 300000});
  const prePedido = {
    id: `${idPrePedido}`,
    tipo: "ALT", //ALT
    tipoDescricao: "Alteração de dados", //tipo de pedido 'Cadastro, Alteração de dados ...'
    codSituacao: "CAD", //CAD
    situacao: "EM CADASTRAMENTO", //EM CADASTRAMENTO
    usuarioNivelAbertura: 249809,
    motivoRejeicao: "",
  };

  beforeEach(() => {
    cy.gerarDadosResponsePrePedido(prePedido, transportador);
    cy.gerarDadosResponseAcessarPrePedido(prePedido, transportador);
    cy.gerarDadosResponseOperacaoTransportadorPrePedido(prePedido, transportador);
    cy.gerarDadosOperacaoTransportador(prePedido, transportador);

    cy.viewport(1920, 1080);
    cy.login();
  });

  it("Criando pedido e incluir uma operação de Transportadr TAC", () => {
    describe("Criando pedido", () => {
      cy.intercept("POST", "**/rntrc/PrePedido", {
        fixture: "/intercept/gerarResponsePrePedido.json",
      }).as("postprepedido");
      cy.intercept(
        "GET",
        `**/rntrc/PrePedido/${idPrePedido}`,
        {
          fixture: "/intercept/gerarResponseAcessarPrePedido",
        }
      ).as("getacessoprepedido");
      cy.log(
        `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
      );
      //Logar na página com o usuario
      //Clicar na opção Regularização RNTRC no menu lateral
      cy.get(path.atendimentoPage.regularizacao, { timeout: 30000 }).click({
        force: true,
      });
      //Selecionando o tipo de atendimento Renovação RNTRC
      cy.atendimentosRegularizacao("Alteração de Dados");
      //
      cy.get(path.criarPedidoPage.inputTipoTransportador)
        .click({ force: true })
        .get(path.criarPedidoPage.tipoTransportador)
        .contains(transportador.dadosTransportador.tipo, { timeout: 2000 })
        .click({ force: true });
      cy.get(path.criarPedidoPage.cpfCnpj).type(transportador.dadosTransportador.cpfCnpj);
      cy.get(path.generic.botaoSubmit).click({ force: true });

      cy.notificacao(mensagem.AtendimentoCriadoSucesso);

      cy.get(path.generic.idAtendimento, { timeout: 10000 }).then((element) => {
        idPrePedido = element.text().substring(1);
        expect(element.text()).to.be.equal(`#${idPrePedido}`);
      });
    });

    describe("Incluindo operação Transportador", () => {
      cy.intercept(
        "POST",
        `**/rntrc/prepedido/${idPrePedido}/transportador`,
        []
      ).as("posttransportador");
      cy.intercept(
        "PUT",
        `**/rntrc/prepedido/${idPrePedido}/transportador`,
        {
          fixture: '/intercept/gerarDadosOperacaoTransportador'
        }
      ).as("posttransportador");
      cy.intercept(
        "GET",
        `**/rntrc/PrePedido/${idPrePedido}/transportador`,
        {
          fixture: '/intercept/gerarDadosOperacaoTransportador'
        }
      ).as("detalhartransportador");
      cy.intercept(
        "GET",
        `**/rntrc/PrePedido/${idPrePedido}`,
        {
          fixture: '/intercept/gerarDadosResponseOperacaoTransportadorPrePedido'
        }
      ).as("gettransportador");

      cy.url().should("include", `detalhe`);

      cy.wait("@getacessoprepedido");
      cy.operacaoTransportador(fakerBr, transportador.dadosTransportador.sigla);
      cy.wait("@posttransportador")

      cy.wait("@gettransportador")

      cy.notificacao(mensagem.EdicaoTransportador);

      cy.wait("@detalhartransportador");
    });
  });
});
