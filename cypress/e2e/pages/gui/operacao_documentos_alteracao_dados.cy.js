/// <reference types="Cypress"/>
import { faker } from "@faker-js/faker";
//import { fakerBR } from 'fakerbr';
import path from "../../../selectors/path.sel.cy";
import mensagem from "../../../support/enum/mensagemAlertEnum";
var fakerBr = require("faker-br");
const celular = "(61)9990-67527";

describe("Grupo de teste Atendimento Renovação TAC", () => {
  beforeEach(() => {
    cy.intercept("GET", `**/rntrc/PrePedido/listarentidadesdisponiveis**`).as(
      "listaSindicatos"
    );

    cy.viewport(1920, 1080);
    cy.login();
  });

  // ------ Abrir Atendimento de Renovação ------//
  it("Criando pedido API e incluindo operação Documentos > Identidade", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");
    const doc = require("../../../fixtures/data/doc/documentos.json");
    const sindicato = {
      idEntidade:{
        banco: 21,
        sitcarga: 1534
      },
      perfil: "FETAC-MG - Master",
      sigla: "FETAC-MG",
      path: path.generic.perfilSitcarga.FETACMGMaster,
    };
    let idPrePedido;
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    cy.criarPrePedidoAPI(transportador.dadosTransportador, "ALT").then(
      (response) => {
        return new Cypress.Promise((resolve) => {
          expect(response.status).to.equal(200);
          expect(response.body.cpfCnpjTransportador).to.equal(
            transportador.dadosTransportador.cpfCnpj
          );
          expect(response.body.transportador).to.equal(
            transportador.dadosTransportador.nome
          );
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
          cy.contatoPrePedidoAPI(
            idPrePedido,
            2,
            transportador.contatos.telefone
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Criar operação Incluir Contato Email -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            4,
            transportador.contatos.email
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          //---- operação Documento Identidade ---- //
          cy.documentosIdentidade(doc.rg);
          cy.notificacao(mensagem.ArquivoInclusoSucesso, doc.rg);

          // ---- Inclusão de entidade no pedido ---- //
          cy.entidadePrePedidoAPI(sindicato.idEntidade.banco, idPrePedido).then(
            (response) => {
              expect(response.status).to.equal(200);
            }
          );

          // ---- Finalizar o pre-pedido ---- //
          cy.finalizarPrePedidoAPI(idPrePedido).then((response) => {
            expect(response.status).to.equal(200);
          });
        });
      }
    );
  });
});
