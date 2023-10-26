/// <reference types="Cypress"/>
import { faker } from "@faker-js/faker";
//import { fakerBR } from 'fakerbr';
import path from "../../../../selectors/path.sel.cy";
import mensagem from "../../../../support/enum/mensagemAlertEnum";
import urls from "../../../../support/urls";
import situacao from "../../../../support/enum/SituacaoEnum";
import promisify from "cypress-promise";
var fakerBr = require("faker-br");

let veiculoImplemento;
let veiculoAutomotor;
let index = 0;
let doc;

const celular = "(21) 98789-5463";
const telefone = "(17) 2138-1100";
const fax = "(21) 2165-7894";
const email = "cristiane.souza@jdcocenzo.com.br";

const rt = {
  cpf: "161.182.198-34",
  nome: "JOSE DOMINGOS COCENZO",
  identidade: "4263470",
  dataNascimento: "06/04/1948",
};

const gestor = {
  cpfCnpj: "161.182.198-34",
  nome: "JOSE DOMINGOS COCENZO",
  cargo: "Sócio",
  telefone: "2188888888",
  email: "texte#@teste.com",
  nascimento: "06/04/1948",
};

let enderecoComercial = {
  cep: "12236670",
  logradouro: "AVENIDA ERNANI PIRES DOMINGUES",
  municipio: "São José do Rio Preto",
  uf: "SP",
  numero: "1.700",
  bairro: "N S DA PENHA",
};

let enderecoResidencial = {
  cep: "12236670",
  logradouro: "RUA JOSEFA ALBUQUERQUE DOS SANTOS",
  municipio: "São José dos Campos",
  uf: "SP",
  numero: "513",
  bairro: "CIDADE MORUMBI",
};

let boleto = {
  codigoBarra: "",
  nossoNumero: "",
  valorPago: "",
  meioPagamento: "",
  dataEmissao: "",
  utilizacao: "",
  valorBoleto: "",
  situacao: "",
};
const transportador = {
  cpfCnpj: "49.025.695/0001-55",
  nome: "J D COCENZO E CIA LTDA",
  rntrc: "000010185",
  situacao: "ATIVO",
  saldo: "R$ 0,00",
  sigla: "ETC",
  tipo: "Empresa",
};
const sindicato = {
  perfil: "SETCAL - Operador",
  sigla: "SETCAL",
  path: path.generic.perfilSitcarga.SETCALOperador,
};

describe("Gerar pedido após confirmação do pagamento no Sitcarga", () => {
  const transportador = require("../../../../fixtures/data/transportador/etc_ativo/49025695000155");
  const sindicato = {
    perfil: "SETCAL - Operador",
    sigla: "SETCAL",
    path: path.generic.perfilSitcarga.SETCALOperador,
  };

  beforeEach(() => {
    cy.viewport(1920, 1080);
    //cy.login()
  });

  it("Gerando pedido de Alteração de dados no Sitcarga", () => {
    cy.intercept(
      "POST",
      "/autoatendimento/prepedido/consultar?gridName=grid"
    ).as("listaPrepedido");
    cy.intercept("POST", "/autoatendimento/prepedido/gerarpedido/").as(
      "gerarpedido"
    );
    cy.intercept(
      "POST",
      "https://sac-evoservicosfinanceiros.ascbrazil.com.br/site-visitantes/monitor-visitante"
    ).as("visitante");
    cy.intercept("POST", "/institucional/authsca").as("autenticacao");
    cy.intercept(
      "GET",
      "https://sac-evoservicosfinanceiros.ascbrazil.com.br/socket.io/**"
    ).as("socketio");

    let idPrePedido;
    const idEntidade = 37;
    const tipo = "ALT";

    cy.criarPrePedidoAPI(transportador.dadosTransportador, tipo).then(
      (response) => {
        return new Cypress.Promise((resolve, reject) => {
          // do something custom here
          expect(response.status).to.equal(200);
          expect(response.body.cpfCnpjTransportador).to.equal(
            transportador.dadosTransportador.cpfCnpj
          );
          expect(response.body.transportador).to.equal(
            transportador.dadosTransportador.nome
          );
          expect(response.body.situacao).to.equal("EM CADASTRAMENTO");
          expect(response.body.codSituacao).to.equal("CAD");
          resolve(response.body.id);
          idPrePedido = response.body.id;

          cy.criarOperacaoTransportadorAPI(transportador, idPrePedido).then(
            (response) => {
              expect(response.status).to.equal(200);
            }
          );

          cy.entidadePrePedidoAPI(idEntidade, idPrePedido).then((response) => {
            expect(response.status).to.equal(200);
          });

          cy.finalizarPrePedidoAPI(idPrePedido).then((response) => {
            expect(response.status).to.equal(200);
          });

          cy.visit(urls.sitcargaInitial);
          cy.get(".cookie-message > :nth-child(1) > p", { timeout: 10000 })
            .should("be.visible")
            .contains(
              "Utilizamos cookies essenciais e tecnologias semelhantes para melhorar a sua experiência no nosso site. Para maiores informações, acesse nossa Política de Privacidade."
            )
            .get("#btnAccept")
            .click({ force: true });
          cy.loginSitcarga();
          cy.get(".logo > img", { timeout: 30000 }).should(
            "have.attr",
            "src",
            path.sitcargaHomePage.imgLogon
          );
          cy.get(":nth-child(1) > .m-r-sm").contains(
            Cypress.env("usuario").nome.toUpperCase()
          );
          cy.get(".dropdown-toggle")
            .click({ force: true })
            .get("#niveis-usuario > li > a")
            .contains(sindicato.perfil, { timeout: 10000 })
            .click({ force: true });
          cy.get(".dropdown-toggle").contains(sindicato.perfil, {
            timeout: 10000,
          });
          cy.wait("@visitante");
          cy.get("#side-menu > li > a > span")
            .contains("Auto Atendimento", { timeout: 10000 })
            .click({ force: true })
            .click({ force: true })
            .get('a[href="/autoatendimento/prepedido"]', { timeout: 10000 })
            .contains("Acompanhamento", { timeout: 10000 })
            .click({ force: true });

          cy.get("#IdPedido").type(idPrePedido);
          cy.get("#btn-consultar").click({ force: true });
          cy.wait("@listaPrepedido");
          cy.get("table > tbody > tr", { timeout: 10000 }).each(($ele) => {
            cy.get($ele)
              .find("td", { timeout: 10000 })
              .each(($td, index, list) => {
                let texto = $td.text();
                cy.log("ID:", idPrePedido);
                if (texto == idPrePedido) {
                  cy.log("valor encontrado", texto);
                  cy.wrap($ele)
                    .find('i[class="i i-search"]', { timeout: 10000 })
                    .click({ force: true });
                  return false;
                } else {
                  cy.log("Valor não encontrado:", texto);
                }
              });
          });

          cy.wait("@autenticacao");
          cy.wait("@socketio");
          cy.wait("@visitante");
          cy.get("#situacao", { timeout: 20000 })
            .contains(situacao.PAGAMENTOEFETUADO, { timeout: 20000 })
            .get("#btn-gerar-pedido", { timeout: 20000 })
            .click({ force: true });
          cy.get('#confirm-ok').click({force: true})
          cy.wait("@gerarpedido");
          cy.get('.alert').should('not.be.visible')
        });
      }
    );
  });
});
