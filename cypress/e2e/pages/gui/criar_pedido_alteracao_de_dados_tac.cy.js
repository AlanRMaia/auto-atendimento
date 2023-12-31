/// <reference types="Cypress"/>
import { faker } from "@faker-js/faker";
//import { fakerBR } from 'fakerbr';
import path from "../../../selectors/path.sel.cy";
import mensagem from "../../../support/enum/mensagemAlertEnum";
var fakerBr = require("faker-br");

let doc;

let idPrePedido = "2071510";
const celular = "(21) 99999-9998";
const telefone = "(11) 4338-0201";
const fax = "(21) 89999-9999";
const email = "nailtonnivaldosoares@gmail.com";
const cep = "79106-677";

const transportador = {
  cpfCnpj: "143.854.008-65",
  nome: "TAC - NAILTON NIVALDO SOARES",
  rntrc: "000010100",
  situacao: "ATIVO",
  saldo: "R$ 0,00",
  sigla: "TAC",
  tipo: "Autônomo",
};

const motorista = {
  cpf: "963.141.920-72",
  nome: "MARCELO ANTONIO ZULIAN",
  dataNascimento: "26/11/1978",
  cnh: "11111111111",
  categoria: "C",
};

const sindicato = {
  perfil: "FETAC-MG - Master",
  sigla: "FETAC-MG",
  path: path.generic.perfilSitcarga.FETACMGMaster,
};

describe("Grupo de teste Atendimento Alteração de dados TAC", () => {
  beforeEach(() => {
    cy.reload();
    cy.fixture("data/doc/documentos").then((data) => {
      doc = data;
    });

    cy.intercept("GET", "**/validarpedido").as("validarpedido");
    cy.intercept("PUT", "**/finalizar").as("finalizarpedido");
    cy.intercept('GET', `/rntrc/PrePedido/${idPrePedido}/detalhar`).as('detalheGridOperacao')

    cy.viewport(1920, 1080);
    cy.login();
  });

  describe("Criando o pedido e incluindo as operações", () => {
    // ------ Abrir Atendimento de Alteração de dados ------//
    it("Criar pedido Alteração de dados TAC", () => {
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
        .contains(transportador.tipo, { timeout: 200 })
        .click({ force: true });
      cy.get(path.criarPedidoPage.cpfCnpj).type(transportador.cpfCnpj);
      cy.get(path.generic.botaoSubmit).click({ force: true });

      cy.notificacao(mensagem.AtendimentoCriadoSucesso);

      cy.get(path.generic.idAtendimento, { timeout: 10000 }).then((element) => {
        idPrePedido = element.text().substring(1);
        expect(element.text()).to.be.equal(`#${idPrePedido}`);
      });
    });

    // ------ Criar operação Salvar transportador -----//
    it("Criar operação Salvar transportador", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.operacaoTransportador(fakerBr, transportador.sigla);
      cy.notificacao(mensagem.TransportadorSucesso);
    });

    //-------- Criar operação Enviar documentos do tipo Identidade ------//
    it("Criar operação Enviar documentos do tipo Identidade", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.documentosIdentidade(doc.rg);
      cy.notificacao(mensagem.ArquivoInclusoSucesso, doc.rg);
    });

    // ------ Criar operação Incluir Contato Email ------//
    it("Criar operação Incluir Contato Email", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.incluirContatoEmail(faker);
      cy.notificacao(mensagem.DadosSalvoSucesso);
    });

    // ------ Criar operação Excluir Contato Email ------//
    it("Criar operação Excluir Contato Email", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.incluirContatoEmail(faker, email);
      cy.notificacao(mensagem.DadosSalvoSucesso);
    });

    // ------ Criar operação Excluir Contato Celular -----//
    it("Criar operação Excluir Contato Celular", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.excluirContatoCelular(fakerBr, celular);
      cy.notificacao(mensagem.DadosSalvoSucesso);
    });

    // ------ Criar operação Excluir Contato Telefone -----//
    it("Criar operação Excluir Contato Telefone", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.excluirContatoTelefone(faker, telefone);
      cy.notificacao(mensagem.DadosSalvoSucesso);
    });

    // ------ Criar operação Incluir Contato Telefone -----//
    it("Criar operação Incluir Contato Telefone", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.incluirContatoTelefone(faker);
      cy.notificacao(mensagem.DadosSalvoSucesso);
    });

    // ------- Criar operação Incluir Contato Fax -------//
    it("Criar operação Incluir Contato Fax", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.incluirContatoFax(faker);
      cy.notificacao(mensagem.DadosSalvoSucesso);
    });

    // ------- Criar operação Excluir Contato Fax -------//
    it("Criar operação Excluir Contato Fax", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.incluirContatoFax(faker, fax);
      cy.notificacao(mensagem.DadosSalvoSucesso);
    });

    // -------- Criar operação Alterar Endereço Residencial --------//
    it.skip("Criar operação Alterar Endereço Residencial", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.alterarEnderecoResidencial(fakerBr, cep);
      //cy.notificacao(mensagem.DadosSalvoSucesso);
    });

    // -------- Criar operação Alterar Endereço Correspondência --------//
    it.skip("Criar operação Incluir Endereço Correspondência", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.incluirEnderecoCorrespondenciaTAC(fakerBr, cep);
      //cy.notificacao(mensagem.DadosSalvoSucesso);
    });

    // --------- Criar operacao Incluir Motorista -----//
    it.skip("Criar operacao Incluir Motorista", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.incluirMotorista(fakerBr);
      cy.notificacao(mensagem.DadosSalvoSucesso);
    });

    // --------- Criar operacao Alterar Motorista -----//
    it.skip("Criar operacao Alterar Motorista", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.alterarMotorista(fakerBr, motorista.cpf);
      cy.notificacao(mensagem.DadosSalvoSucesso);
    });
  });

  describe("Selecionar o sindicato, gerar valor e validar o pedido", () => {
    // ------- Selecionar o sindicato responsável -------//
    it("Selecionar o sindicato e gerar valor", () => {
      cy.intercept(
        "GET",
        `**/rntrc/PrePedido/listarentidadesdisponiveis?idPedido=${idPrePedido}`
      ).as("listaSindicatos");
      cy.intercept("PUT", "**/entidade").as("entidadePUT");
      cy.intercept("POST", "**/entidade").as("entidadePOST");
      cy.intercept("GET", "**/valor**").as("tabela");
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");

      cy.get(path.generic.botaoConfirmar, { timeout: 10000 })
        .should("be.visible")
        .click({ force: true });

      cy.get(path.generic.title, { timeout: 10000 }).contains(
        "Escolha Ponto de Atendimento"
      );

      cy.get(path.checkoutAtendimentoPage.pontosAtendimento, { timeout: 10000 })
        .click()
        .type(sindicato.sigla)
        .wait(5000)
        .get(path.checkoutAtendimentoPage.listaSindicatos, { timeout: 10000 })
        .contains(sindicato.sigla, { timeout: 10000 })
        .click();

      cy.wait("@listaSindicatos");
      cy.wait("@entidadePOST");
      cy.wait("@tabela");

      cy.get(path.generic.tabela, { timeout: 30000 }).then((ele) => {
        cy.log(ele.text());

        cy.wrap(ele)
          .get(`tbody>:nth-child(${1})>.text-left`)
          .should(
            "have.text",
            "Alteração de Dados do Transportador (Gratuito)"
          );
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
          .should(
            "have.text",
            "Alteração de Dados do Transportador (Gratuito)"
          );
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
});
