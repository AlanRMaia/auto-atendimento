/// <reference types="Cypress"/>
import { faker } from "@faker-js/faker";
//import { fakerBR } from 'fakerbr';
import path from "../../../selectors/path.sel.cy";
import mensagem from "../../../support/enum/mensagemAlertEnum";
var fakerBr = require("faker-br");

const email = "fiscal@agropan.com.br";
const email02 = "volfe@agropan.coop.br";
const telefone = "(55) 3272-1919";
const telefone2 = "(55) 3272-8982";
const cep = "60430-971";
let doc;
let idPrePedido = "2071396";

const gestor = {
  cpfCnpj: "305.693.200-97",
  nome: "JUAREZ BAY DO NASCIMENTO",
  cargo: "Responsável Legal",
  telefone: "2188888888",
  email: faker.internet.email(),
  nascimento: "20/02/20000",
};

const gestorSocioIncluir = {
  cpfCnpj: fakerBr.br.cpf(),
  nome: "ANA CAROLINA DIAS DE SOUZA",
  cargo: "Sócio",
  telefone: "2188888888",
  email: faker.internet.email(),
  nascimento: "20/02/20000",
};

const gestorRLegalincluir = {
  cpfCnpj: fakerBr.br.cnpj(),
  nome: "ANA CAROLINA DIAS DE SOUZA",
  cargo: "Responsável Legal",
  telefone: "2188888888",
  email: faker.internet.email(),
  nascimento: "20/02/20000",
};

const rt = {
  cpf: "529.519.600-34",
  nome: "ALZEMIR MARTINS DA ROSA",
  identidade: "8039017441",
  dataNascimento: "14/03/1967",
};

const rtIncluir = {
  cpf: "28155637034",
  nome: "JOAO SCARIOTT",
  identidade: "4008781736",
  dataNascimento: "22/06/1956",
};

const transportador = {
  cpfCnpj: "87.573.952/0001-82",
  nome: "CTC - COOPERATIVA AGRICOLA TUPANCIRETA LTDA",
  rntrc: "002136678",
  situacao: "ATIVO",
  saldo: "R$ 0,00",
  sigla: "CTC",
  tipo: "Cooperativa",
};
const sindicato = {
  perfil: "OCERGS - Master",
  sigla: "OCERGS",
  path: path.generic.perfilSitcarga.OCERGSMAster,
};

describe("Grupo de teste Atendimento Alteração de dados CTC", () => {
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
  describe("Iniciando testes Autoatendimento", () => {
    // ------ Abrir Atendimento de Alteração de dados ------//
    it("Criar pedido Alteração de dados CTC", () => {
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
        .contains(transportador.tipo)
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
      cy.operacaoTransportador(faker, transportador.sigla);
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

    // // ------ Criar operação Excluir Contato Celular -----//
    // it('Criar operação Excluir Contato Celular', () => {
    //   cy.acessarPedido(idPrePedido)
    //   cy.url().should('include', `detalhe`)
    //   cy.wait('@detalheGridOperacao')
    //   cy.excluirContatoCelular(fakerBr, celular)
    //   cy.notificacao(mensagem.DadosSalvoSucesso);
    // });

    // ------ Criar operação Excluir Contato Telefone -----//
    it("Criar operação Excluir Contato Telefone", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.excluirContatoTelefone(faker, telefone);
      cy.notificacao(mensagem.DadosSalvoSucesso);
    });

    // ------ Criar operação Excluir Contato Telefone -----//
    it("Criar operação Excluir Contato Telefone", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.excluirContatoTelefone(faker, telefone2);
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

    // // ------- Criar operação Incluir Contato Fax -------//
    // it('Criar operação Incluir Contato Fax', () => {
    //   cy.acessarPedido(idPrePedido)
    //   cy.url().should('include', `detalhe`)
    //   cy.wait('@detalheGridOperacao')
    //   cy.incluirContatoFax(faker)
    //   cy.notificacao(mensagem.DadosSalvoSucesso);
    // });

    // // ------- Criar operação Excluir Contato Fax -------//
    // it('Criar operação Excluir Contato Fax', () => {
    //   cy.acessarPedido(idPrePedido)
    //   cy.url().should('include', `detalhe`)
    //   cy.wait('@detalheGridOperacao')
    //   cy.incluirContatoFax(faker, fax)
    //   cy.notificacao(mensagem.DadosSalvoSucesso);
    // });

    // --------- Criar operacao Incluir Gestor Responsável Legal -----//
    it("Criar operacao Incluir Gestor Responsável Legal", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.incluirGestor(gestorRLegalincluir, transportador.sigla);
      cy.notificacao(mensagem.DadosSalvoSucesso);
    });

    // --------- Criar operacao Alterar Gestor Responsável Legal -----//
    it("Criar operacao Alterar Gestor Responsável Legal", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.alterarGestor(gestor, transportador.sigla);
      cy.notificacao(mensagem.DadosSalvoSucesso);
    });

    // -------- Criar operação Incluir Filial ------//
    it("Criar operação Incluir Filial", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.incluirFilial();
      cy.notificacao(mensagem.DadosSalvoSucesso);
    });

    // ---------- Criar operação Incluir Responsável Técnico --------//
    it("Criar operação Incluir Responsável Técnico", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.incluirResponsavelTecnico(fakerBr, rtIncluir);
      cy.notificacao(mensagem.DadosSalvoSucesso);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.enviarDocumentosRT(doc.rg);
      cy.notificacao(mensagem.ArquivoInclusoSucesso, doc.rg);
    });

    // ---------- Criar operação ALterar Responsável Técnico --------//
    it("Criar operação Alterar Responsável Técnico", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.alterarResponsavelTecnico(fakerBr, rt);
      cy.notificacao(mensagem.DadosSalvoSucesso);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.enviarDocumentosRT(doc.rg);
      cy.notificacao(mensagem.ArquivoInclusoSucesso, doc.rg);
    });

    // -------- Criar operação Alterar Endereço Comercial --------//
    it.skip("Criar operação Alterar Endereço Comercial", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.alterarEnderecoComercial(fakerBr, cep);
      //cy.notificacao(mensagem.DadosSalvoSucesso);
    });

    // -------- Criar operação Incluir Endereço Correspondência --------//
    it.skip("Criar operação Incluir Endereço Correspondência", () => {
      cy.acessarPedido(idPrePedido);
      cy.url().should("include", `detalhe`);
      cy.wait("@detalheGridOperacao");
      cy.incluirEnderecoCorrespondencia(fakerBr, cep);
      //cy.notificacao(mensagem.DadosSalvoSucesso);
    });
  });

  describe("Selecionar o sindicato, gerar valor e validar o pedido", () => {
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
