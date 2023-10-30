let path = require("../../../selectors/path.sel.cy");
import { faker } from "@faker-js/faker";


describe("Suite de testes no compartilhamento do ferfil dos sindicatos com os usuários", () => {

  beforeEach(() => {
    
    cy.reload();
    cy.intercept("POST", "/acesso/identity/login").as("loginacesso");
    cy.viewport(1920, 1080);
  });

  it("Criar pre-pedido e identificar se o sindicato FETAC-MG foi selecionado automaticamente", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");
    const usuario = require("../../../fixtures/usuario.json");
    let idPrePedido;
    const sindicato = {
      idEntidade: 1534,
      perfil: "FETAC-MG - Master",
      sigla: "FETAC-MG",
      path: path.generic.perfilSitcarga.FETACMGMaster,
    };
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    //Acessando a página inicial
    cy.visit(`?ponto=${sindicato.idEntidade}`);

    //fazendo o login de acesso
    cy.get('[href="#/login"]').click();
    cy.get(path.loginPage.cpf, { timeout: 20000 }).type(usuario.cpf);
    cy.get(path.loginPage.senha).type(usuario.senha);
    cy.get(path.generic.botaoSubmit).click({ force: true });
    cy.wait("@loginacesso", { timeout: 90000 });
    cy.get(path.generic.title, { timeout: 20000 }).should(
      "have.text",
      " Consultar Atendimentos "
    );

    // criando pedido pela API.
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

          // ------ Criar operação Incluir Contato Telefone  pela API -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            2,
            transportador.contatos.telefone
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Criar operação Excluir Contato Email -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            4,
            transportador.contatos.email
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          //Verificar se o sindicato aparece já incluso no campo Pontos de Atendimento
          cy.visit(`regularizacao/${idPrePedido}/checkout`);

          cy.get("span.ellipsis").contains(sindicato.sigla);

          // ----- Cancelar o pedido ---- //
          cy.cancelarPrePedidoAPI(idPrePedido).then((response) => {
            expect(response.status).to.equal(200);
          });
        });
      }
    );
  });

  it("O sistema deverá vincular o sindicato automaticamente através do peril compratilhado quando o acesso é feito pelo atalho de serviços da página inicial", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");
    const placa = require('../../../fixtures/data/veiculos/GFV9E78API.json');
    const crlv = require('../../../fixtures/data/doc/doc_crlvAPI.json');
    const usuario = require("../../../fixtures/usuario.json");
    let idPrePedido;
    const sindicato = {
      idEntidade: 1534,
      perfil: "FETAC-MG - Master",
      sigla: "FETAC-MG",
      path: path.generic.perfilSitcarga.FETACMGMaster,
    };
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    //Acessando a página inicial
    cy.visit(`?ponto=${sindicato.idEntidade}`);
    cy.getElementList(path.institucionalPage.tipoAtendimento, 'Gerenciamento deFrota')    

    //fazendo o login de acesso
    cy.get(path.loginPage.cpf, { timeout: 20000 }).type(usuario.cpf);
    cy.get(path.loginPage.senha).type(usuario.senha);
    cy.get(path.generic.botaoSubmit).click({ force: true });
    cy.wait("@loginacesso", { timeout: 90000 });
    cy.get(path.generic.title, { timeout: 20000 }).should(
      "have.text",
      "Gestão de Frota"
    );

    // criando pedido pela API.
    cy.criarPrePedidoAPI(transportador.dadosTransportador, "AFR").then(
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

          cy.criarOperacaoIncluirVeiculoPrePedidoAPI(placa, idPrePedido).then( response => {
            expect(response.status).to.equal(200); 
          })

          cy.criarOperacaoDocumentoVeiculoPrePedidoAPI( placa.placa, crlv, idPrePedido ).then( response => {
            expect(response.status).to.equal(200);            
          })

          //Verificar se o sindicato aparece já incluso no campo Pontos de Atendimento
          cy.visit(`regularizacao/${idPrePedido}/checkout`);

          cy.get("span.ellipsis").contains(sindicato.sigla);

          // ----- Cancelar o pedido ---- //
          cy.cancelarPrePedidoAPI(idPrePedido).then((response) => {
            expect(response.status).to.equal(200);
          });
        });
      }
    );
  });

  it("O sistema deve finalizar o pre-pedido sem erros quando o pre-pedido foi criado dentro de uma sessão feita através do perfil compartilhado com um sindicato", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");
    const usuario = require("../../../fixtures/usuario.json");
    let idPrePedido;
    const sindicato = {
      idEntidade: 1534,
      perfil: "FETAC-MG - Master",
      sigla: "FETAC-MG",
      path: path.generic.perfilSitcarga.FETACMGMaster,
    };
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    //Acessando a página inicial
    cy.visit(`?ponto=${sindicato.idEntidade}`);

    //fazendo o login de acesso
    cy.get('[href="#/login"]').click();
    cy.get(path.loginPage.cpf, { timeout: 20000 }).type(usuario.cpf);
    cy.get(path.loginPage.senha).type(usuario.senha);
    cy.get(path.generic.botaoSubmit).click({ force: true });
    cy.wait("@loginacesso", { timeout: 90000 });
    cy.get(path.generic.title, { timeout: 20000 }).should(
      "have.text",
      " Consultar Atendimentos "
    );

    // criando pedido pela API.
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

          // ------ Criar operação Incluir Contato Telefone  pela API -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            2,
            transportador.contatos.telefone
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Criar operação Excluir Contato Email -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            4,
            transportador.contatos.email
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          //Verificar se o sindicato aparece já incluso no campo Pontos de Atendimento
          cy.visit(`regularizacao/${idPrePedido}/checkout`);

          cy.get("span.ellipsis").contains(sindicato.sigla);

          cy.finalizarPrePedidoAPI(idPrePedido).then((response) => {
            expect(response.status).to.equal(200);
          });
        });
      }
    );
  });

  it("O sistema deve finalizar o pre-pedido sem erros quando o sindicato já vinculado é substituido manualmente para o sindicato que compartilhada seu perfil", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");
    const usuario = require("../../../fixtures/usuario.json");
    let idPrePedido;
    const sindicato = {
      idEntidade:{
        banco: 21,
        sitcarga: 1534
      },
      perfil: "FETAC-MG - Master",
      sigla: "FETAC-MG",
      path: path.generic.perfilSitcarga.FETACMGMaster,
    };
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    // Criando o pedido pela API
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

          // ------ Criar operação Incluir Contato Telefone  pela API -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            2,
            transportador.contatos.telefone
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Criar operação Excluir Contato Email -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            4,
            transportador.contatos.email
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Incluindo Entidade no pedido ----- //
          const idEntidadeVinculada = {
            banco: 166,
            sitcarga: 1280,
          };
          cy.entidadePrePedidoAPI(idEntidadeVinculada.banco, idPrePedido).then(
            (response) => {
              expect(response.status).to.equal(200);
            }
          );

          cy.visit(`?ponto=${sindicato.idEntidade}`);

          //fazendo o login de acesso
          cy.get('[href="#/login"]').click();
          cy.get(path.loginPage.cpf, { timeout: 20000 }).type(usuario.cpf);
          cy.get(path.loginPage.senha).type(usuario.senha);
          cy.get(path.generic.botaoSubmit).click({ force: true });
          cy.wait("@loginacesso", { timeout: 90000 });
          cy.get(path.generic.title, { timeout: 20000 }).should(
            "have.text",
            " Consultar Atendimentos "
          );

          cy.visit(`atendimento/${idPrePedido}/detalhe`);
          cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
            (element) => {
              expect(element.text()).to.be.equal(`#${idPrePedido}`);
            }
          );

          //Verificar se o sindicato aparece já incluso no campo Pontos de Atendimento
          cy.visit(`regularizacao/${idPrePedido}/checkout`);

          cy.get("span.ellipsis")
            .should("exist")
            .and("contain.text", idEntidadeVinculada.sitcarga)
            .get(".q-chip > .q-icon")
            .click();

          cy.get(path.checkoutAtendimentoPage.pontosAtendimento)
            .click()
            .type(sindicato.sigla)
            .get(path.checkoutAtendimentoPage.listaSindicatos)
            .contains(sindicato.sigla)
            .click();

          cy.get("span.ellipsis")
            .should("exist")
            .and("contain.text", sindicato.idEntidade);

          cy.finalizarPrePedidoAPI(idPrePedido).then((response) => {
            expect(response.status).to.equal(200);
          });
        });
      }
    );
  });

  it("O sistema não deve vincular a entidade FETAC-MG no pedido porque o transportador é de tipo ETC", () => {
    const transportador = require("../../../fixtures/data/transportador/etc_ativo/88832738000166");
    const usuario = require("../../../fixtures/usuario.json");
    let idPrePedido;
    const sindicato = {
      idEntidade: 1534,
      perfil: "FETAC-MG - Master",
      sigla: "FETAC-MG",
      path: path.generic.perfilSitcarga.FETACMGMaster,
    };
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    //Acessando a página inicial
    cy.visit(`?ponto=${sindicato.idEntidade}`);

    //fazendo o login de acesso
    cy.get('[href="#/login"]').click();
    cy.get(path.loginPage.cpf, { timeout: 20000 }).type(usuario.cpf);
    cy.get(path.loginPage.senha).type(usuario.senha);
    cy.get(path.generic.botaoSubmit).click({ force: true });
    cy.wait("@loginacesso", { timeout: 90000 });
    cy.get(path.generic.title, { timeout: 20000 }).should(
      "have.text",
      " Consultar Atendimentos "
    );

    // criando pedido pela API.
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

          // ------ Criar operação Incluir Contato Telefone  pela API -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            2,
            transportador.contatos.telefone
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Criar operação Excluir Contato Email -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            4,
            transportador.contatos.email
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          //Verificar se o sindicato aparece já incluso no campo Pontos de Atendimento
          cy.visit(`regularizacao/${idPrePedido}/checkout`);
          cy.get("div.q-banner .text-body2").should(
            "contain.text",
            `Você realizou o acesso ao RNTRC.COM utilizando o link do Ponto de Atendimento. Entretanto, o Ponto de Atendimento não tem permissão para atender este pedido. Por favor, escolha uma das entidades disponíveis para prosseguir.`
          );
          cy.get("span.ellipsis").should("not.exist");

          // ----- Cancelar o pedido ---- //
          cy.cancelarPrePedidoAPI(idPrePedido).then((response) => {
            expect(response.status).to.equal(200);
          });
        });
      }
    );
  });

  it("O sistema não deve trocar o sindicato FETAC-MG que já foi vinculado ao pre-pedido para o perfil compartilhado", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");
    const usuario = require("../../../fixtures/usuario.json");
    let idPrePedido;
    const sindicato = {
      idEntidade: 1534,
      perfil: "FETAC-MG - Master",
      sigla: "FETAC-MG",
      path: path.generic.perfilSitcarga.FETACMGMaster,
    };
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    //Acessando a página inicial

    // criando pedido pela API.
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

          // ------ Criar operação Incluir Contato Telefone  pela API -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            2,
            transportador.contatos.telefone
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Criar operação Excluir Contato Email -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            4,
            transportador.contatos.email
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Incluindo Entidade no pedido ----- //
          const idEntidadeVinculada = {
            banco: 166,
            sitcarga: 1280,
          };
          cy.entidadePrePedidoAPI(idEntidadeVinculada.banco, idPrePedido).then(
            (response) => {
              expect(response.status).to.equal(200);
            }
          );

          cy.visit(`?ponto=${sindicato.idEntidade}`);

          //fazendo o login de acesso
          cy.get('[href="#/login"]').click();
          cy.get(path.loginPage.cpf, { timeout: 20000 }).type(usuario.cpf);
          cy.get(path.loginPage.senha).type(usuario.senha);
          cy.get(path.generic.botaoSubmit).click({ force: true });
          cy.wait("@loginacesso", { timeout: 90000 });
          cy.get(path.generic.title, { timeout: 20000 }).should(
            "have.text",
            " Consultar Atendimentos "
          );

          cy.visit(`atendimento/${idPrePedido}/detalhe`);
          cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
            (element) => {
              expect(element.text()).to.be.equal(`#${idPrePedido}`);
            }
          );

          //Verificar se o sindicato aparece já incluso no campo Pontos de Atendimento
          cy.visit(`regularizacao/${idPrePedido}/checkout`);

          cy.get("span.ellipsis")
            .should("exist")
            .and("contain.text", idEntidadeVinculada.sitcarga);

          // ----- Cancelar o pedido ---- //
          cy.cancelarPrePedidoAPI(idPrePedido).then((response) => {
            expect(response.status).to.equal(200);
          });
        });
      }
    );
  });

  it("Criar pre-pedido e identificar se o sindicato SETCAL foi selecionado automaticamente", () => {
    const transportador = require("../../../fixtures/data/transportador/etc_ativo/88832738000166");
    const usuario = require("../../../fixtures/usuario.json");
    let idPrePedido;
    const sindicato = {
      idEntidade: 116,
      perfil: "SETCAL  - Operador",
      sigla: "SETCAL",
      path: path.generic.perfilSitcarga.SETCALOperador,
    };
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    //Acessando a página inicial
    cy.visit(`?ponto=${sindicato.idEntidade}`);

    //fazendo o login de acesso
    cy.get('[href="#/login"]').click();
    cy.get(path.loginPage.cpf, { timeout: 20000 }).type(usuario.cpf);
    cy.get(path.loginPage.senha).type(usuario.senha);
    cy.get(path.generic.botaoSubmit).click({ force: true });
    cy.wait("@loginacesso", { timeout: 90000 });
    cy.get(path.generic.title, { timeout: 20000 }).should(
      "have.text",
      " Consultar Atendimentos "
    );

    // criando pedido pela API.
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

          // ------ Criar operação Incluir Contato Telefone  pela API -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            2,
            transportador.contatos.telefone
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Criar operação Excluir Contato Email -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            4,
            transportador.contatos.email
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          //Verificar se o sindicato aparece já incluso no campo Pontos de Atendimento
          cy.visit(`regularizacao/${idPrePedido}/checkout`);

          cy.get("span.ellipsis").contains(sindicato.sigla);

          // ----- Cancelar o pedido ---- //
          cy.cancelarPrePedidoAPI(idPrePedido).then((response) => {
            expect(response.status).to.equal(200);
          });
        });
      }
    );
  });

  it("O sistema deve finalizar o pre-pedido sem erros quando o pre-pedido foi criado dentro de uma sessão feita através do perfil compartilhado com um sindicato", () => {
    const transportador = require("../../../fixtures/data/transportador/etc_ativo/88832738000166");
    const usuario = require("../../../fixtures/usuario.json");
    let idPrePedido;
    const sindicato = {
      idEntidade: 116,
      perfil: "SETCAL  - Operador",
      sigla: "SETCAL",
      path: path.generic.perfilSitcarga.SETCALOperador,
    };
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    //Acessando a página inicial
    cy.visit(`?ponto=${sindicato.idEntidade}`);

    //fazendo o login de acesso
    cy.get('[href="#/login"]').click();
    cy.get(path.loginPage.cpf, { timeout: 20000 }).type(usuario.cpf);
    cy.get(path.loginPage.senha).type(usuario.senha);
    cy.get(path.generic.botaoSubmit).click({ force: true });
    cy.wait("@loginacesso", { timeout: 90000 });
    cy.get(path.generic.title, { timeout: 20000 }).should(
      "have.text",
      " Consultar Atendimentos "
    );

    // criando pedido pela API.
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

          // ------ Criar operação Incluir Contato Telefone  pela API -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            2,
            transportador.contatos.telefone
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Criar operação Excluir Contato Email -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            4,
            transportador.contatos.email
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          //Verificar se o sindicato aparece já incluso no campo Pontos de Atendimento
          cy.visit(`regularizacao/${idPrePedido}/checkout`);

          cy.get("span.ellipsis").contains(sindicato.sigla);

          cy.finalizarPrePedidoAPI(idPrePedido).then((response) => {
            expect(response.status).to.equal(200);
          });
        });
      }
    );
  });

  it("O sistema não deve vincular a entidade SETCAL no pedido porque o transportador é de tipo TAC", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");
    const usuario = require("../../../fixtures/usuario.json");
    let idPrePedido;
    const sindicato = {
      idEntidade: 116,
      perfil: "SETCAL  - Operador",
      sigla: "SETCAL",
      path: path.generic.perfilSitcarga.SETCALOperador,
    };
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    //Acessando a página inicial
    cy.visit(`?ponto=${sindicato.idEntidade}`);

    //fazendo o login de acesso
    cy.get('[href="#/login"]').click();
    cy.get(path.loginPage.cpf, { timeout: 20000 }).type(usuario.cpf);
    cy.get(path.loginPage.senha).type(usuario.senha);
    cy.get(path.generic.botaoSubmit).click({ force: true });
    cy.wait("@loginacesso", { timeout: 90000 });
    cy.get(path.generic.title, { timeout: 20000 }).should(
      "have.text",
      " Consultar Atendimentos "
    );

    // criando pedido pela API.
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

          // ------ Criar operação Incluir Contato Telefone  pela API -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            2,
            transportador.contatos.telefone
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Criar operação Excluir Contato Email -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            4,
            transportador.contatos.email
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          //Verificar se o sindicato aparece já incluso no campo Pontos de Atendimento
          cy.visit(`regularizacao/${idPrePedido}/checkout`);
          cy.get("div.q-banner .text-body2").should(
            "contain.text",
            `Você realizou o acesso ao RNTRC.COM utilizando o link do Ponto de Atendimento. Entretanto, o Ponto de Atendimento não tem permissão para atender este pedido. Por favor, escolha uma das entidades disponíveis para prosseguir.`
          );
          cy.get("span.ellipsis").should("not.exist");

          // ----- Cancelar o pedido ---- //
          cy.cancelarPrePedidoAPI(idPrePedido).then((response) => {
            expect(response.status).to.equal(200);
          });
        });
      }
    );
  });

  it("O sistema não deve trocar o sindicato SETCAL que já foi vinculado ao pre-pedido para o perfil compartilhado", () => {
    const transportador = require("../../../fixtures/data/transportador/etc_ativo/88832738000166");
    const usuario = require("../../../fixtures/usuario.json");
    let idPrePedido;
    const sindicato = {
      idEntidade: 116,
      perfil: "SETCAL  - Operador",
      sigla: "SETCAL",
      path: path.generic.perfilSitcarga.SETCALOperador,
    };
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    //Acessando a página inicial

    // criando pedido pela API.
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

          // ------ Criar operação Incluir Contato Telefone  pela API -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            2,
            transportador.contatos.telefone
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Criar operação Excluir Contato Email -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            4,
            transportador.contatos.email
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Incluindo Entidade no pedido ----- //
          const idEntidadeVinculada = {
            banco: 75,
            sitcarga: 76,
          };
          cy.entidadePrePedidoAPI(idEntidadeVinculada.banco, idPrePedido).then(
            (response) => {
              expect(response.status).to.equal(200);
            }
          );

          cy.visit(`?ponto=${sindicato.idEntidade}`);

          //fazendo o login de acesso
          cy.get('[href="#/login"]').click();
          cy.get(path.loginPage.cpf, { timeout: 20000 }).type(usuario.cpf);
          cy.get(path.loginPage.senha).type(usuario.senha);
          cy.get(path.generic.botaoSubmit).click({ force: true });
          cy.wait("@loginacesso", { timeout: 90000 });
          cy.get(path.generic.title, { timeout: 20000 }).should(
            "have.text",
            " Consultar Atendimentos "
          );

          cy.visit(`atendimento/${idPrePedido}/detalhe`);
          cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
            (element) => {
              expect(element.text()).to.be.equal(`#${idPrePedido}`);
            }
          );

          //Verificar se o sindicato aparece já incluso no campo Pontos de Atendimento
          cy.visit(`regularizacao/${idPrePedido}/checkout`);

          cy.get("span.ellipsis")
            .should("exist")
            .and("contain.text", idEntidadeVinculada.sitcarga);

          // ----- Cancelar o pedido ---- //
          cy.cancelarPrePedidoAPI(idPrePedido).then((response) => {
            expect(response.status).to.equal(200);
          });
        });
      }
    );
  });

  it("O sistema deverá vincular automaticamente sindicato SETCAL a um pre-pedido que já estava aberto no sistema", () => {
    const transportador = require("../../../fixtures/data/transportador/etc_ativo/88832738000166");
    const usuario = require("../../../fixtures/usuario.json");
    let idPrePedido;
    const sindicato = {
      idEntidade: 116,
      perfil: "SETCAL  - Operador",
      sigla: "SETCAL",
      path: path.generic.perfilSitcarga.SETCALOperador,
    };
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    //Acessando a página inicial

    // criando pedido pela API.
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

          // ------ Criar operação Incluir Contato Telefone  pela API -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            2,
            transportador.contatos.telefone
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Criar operação Excluir Contato Email -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            4,
            transportador.contatos.email
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Incluindo Entidade no pedido ----- //
          const idEntidadeVinculada = {
            banco: 75,
            sitcarga: 76,
          };
          cy.entidadePrePedidoAPI(idEntidadeVinculada.banco, idPrePedido).then(
            (response) => {
              expect(response.status).to.equal(200);
            }
          );

          cy.visit(`?ponto=${sindicato.idEntidade}`);

          //fazendo o login de acesso
          cy.get('[href="#/login"]').click();
          cy.get(path.loginPage.cpf, { timeout: 20000 }).type(usuario.cpf);
          cy.get(path.loginPage.senha).type(usuario.senha);
          cy.get(path.generic.botaoSubmit).click({ force: true });
          cy.wait("@loginacesso", { timeout: 90000 });
          cy.get(path.generic.title, { timeout: 20000 }).should(
            "have.text",
            " Consultar Atendimentos "
          );

          cy.visit(`atendimento/${idPrePedido}/detalhe`);
          cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
            (element) => {
              expect(element.text()).to.be.equal(`#${idPrePedido}`);
            }
          );

          //Verificar se o sindicato aparece já incluso no campo Pontos de Atendimento
          cy.visit(`regularizacao/${idPrePedido}/checkout`);

          cy.get("span.ellipsis")
            .should("exist")
            .and("contain.text", idEntidadeVinculada.sitcarga);

          // ----- Cancelar o pedido ---- //
          cy.cancelarPrePedidoAPI(idPrePedido).then((response) => {
            expect(response.status).to.equal(200);
          });
        });
      }
    );
  });

  it("Criar pre-pedido e identificar se o sindicato OCERGS foi selecionado automaticamente", () => {
    const transportador = require("../../../fixtures/data/transportador/ctc_ativo/87573952000182");
    const doc = require("../../../fixtures/data/doc/doc_identidadeAPI.json");
    const usuario = require("../../../fixtures/usuario.json");
    let idPrePedido;
    const sindicato = {
      idEntidade: 653,
      perfil: "OCERGS - Master",
      sigla: "OCERGS",
      path: path.generic.perfilSitcarga.OCERGSMAster,
    };
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    //Acessando a página inicial
    cy.visit(`?ponto=${sindicato.idEntidade}`);

    //fazendo o login de acesso
    cy.get('[href="#/login"]').click();
    cy.get(path.loginPage.cpf, { timeout: 20000 }).type(usuario.cpf);
    cy.get(path.loginPage.senha).type(usuario.senha);
    cy.get(path.generic.botaoSubmit).click({ force: true });
    cy.wait("@loginacesso", { timeout: 90000 });
    cy.get(path.generic.title, { timeout: 20000 }).should(
      "have.text",
      " Consultar Atendimentos "
    );

    // criando pedido pela API.
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

          // ------ Criar operação Incluir Contato Telefone  pela API -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            2,
            transportador.contatos.telefone
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Criar operação Excluir Contato Email -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            4,
            transportador.contatos.email
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          cy.criarOperacaoGestorAPI(transportador.gestor, 4, idPrePedido).then(
            (response) => {
              expect(response.status).to.equal(200);
            }
          );

          cy.criarOperacaoDocumentoPrePedidoAPI(doc, idPrePedido).then(
            (response) => {
              expect(response.status).to.equal(200);
            }
          );

          //Verificar se o sindicato aparece já incluso no campo Pontos de Atendimento
          cy.visit(`regularizacao/${idPrePedido}/checkout`);

          cy.get("span.ellipsis").contains(sindicato.sigla);

          // ----- Cancelar o pedido ---- //
          cy.cancelarPrePedidoAPI(idPrePedido).then((response) => {
            expect(response.status).to.equal(200);
          });
        });
      }
    );
  });

  it("O sistema deve finalizar o pre-pedido sem erros quando o pre-pedido foi criado dentro de uma sessão feita através do perfil compartilhado com um sindicato", () => {
    const transportador = require("../../../fixtures/data/transportador/ctc_ativo/87573952000182");
    const doc = require("../../../fixtures/data/doc/doc_identidadeAPI.json");
    const usuario = require("../../../fixtures/usuario.json");
    let idPrePedido;
    const sindicato = {
      idEntidade: 653,
      perfil: "OCERGS - Master",
      sigla: "OCERGS",
      path: path.generic.perfilSitcarga.OCERGSMAster,
    };
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    //Acessando a página inicial
    cy.visit(`?ponto=${sindicato.idEntidade}`);

    //fazendo o login de acesso
    cy.get('[href="#/login"]').click();
    cy.get(path.loginPage.cpf, { timeout: 20000 }).type(usuario.cpf);
    cy.get(path.loginPage.senha).type(usuario.senha);
    cy.get(path.generic.botaoSubmit).click({ force: true });
    cy.wait("@loginacesso", { timeout: 90000 });
    cy.get(path.generic.title, { timeout: 20000 }).should(
      "have.text",
      " Consultar Atendimentos "
    );

    // criando pedido pela API.
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

          // ------ Criar operação Incluir Contato Telefone  pela API -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            2,
            transportador.contatos.telefone
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Criar operação Excluir Contato Email -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            4,
            transportador.contatos.email
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          cy.criarOperacaoGestorAPI(transportador.gestor, 4, idPrePedido).then(
            (response) => {
              expect(response.status).to.equal(200);
            }
          );

          cy.criarOperacaoDocumentoPrePedidoAPI(doc, idPrePedido).then(
            (response) => {
              expect(response.status).to.equal(200);
            }
          );

          //Verificar se o sindicato aparece já incluso no campo Pontos de Atendimento
          cy.visit(`regularizacao/${idPrePedido}/checkout`);

          cy.get("span.ellipsis").contains(sindicato.sigla);

          cy.finalizarPrePedidoAPI(idPrePedido).then((response) => {
            expect(response.status).to.equal(200);
          });
        });
      }
    );
  });

  it("O sistema não deve vincular a entidade OCERGS no pedido porque o transportador é de tipo ETC", () => {
    const transportador = require("../../../fixtures/data/transportador/etc_ativo/49025695000155");
    const usuario = require("../../../fixtures/usuario.json");
    let idPrePedido;
    const sindicato = {
      idEntidade: 653,
      perfil: "OCERGS - Master",
      sigla: "OCERGS",
      path: path.generic.perfilSitcarga.OCERGSMAster,
    };
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    //Acessando a página inicial
    cy.visit(`?ponto=${sindicato.idEntidade}`);

    //fazendo o login de acesso
    cy.get('[href="#/login"]').click();
    cy.get(path.loginPage.cpf, { timeout: 20000 }).type(usuario.cpf);
    cy.get(path.loginPage.senha).type(usuario.senha);
    cy.get(path.generic.botaoSubmit).click({ force: true });
    cy.wait("@loginacesso", { timeout: 90000 });
    cy.get(path.generic.title, { timeout: 20000 }).should(
      "have.text",
      " Consultar Atendimentos "
    );

    // criando pedido pela API.
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

          // ------ Criar operação Incluir Contato Telefone  pela API -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            2,
            transportador.contatos.telefone
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Criar operação Excluir Contato Email -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            4,
            transportador.contatos.email
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          //Verificar se o sindicato aparece já incluso no campo Pontos de Atendimento
          cy.visit(`regularizacao/${idPrePedido}/checkout`);
          cy.get("div.q-banner .text-body2").should(
            "contain.text",
            `Você realizou o acesso ao RNTRC.COM utilizando o link do Ponto de Atendimento. Entretanto, o Ponto de Atendimento não tem permissão para atender este pedido. Por favor, escolha uma das entidades disponíveis para prosseguir.`
          );
          cy.get("span.ellipsis").should("not.exist");

          // ----- Cancelar o pedido ---- //
          cy.cancelarPrePedidoAPI(idPrePedido).then((response) => {
            expect(response.status).to.equal(200);
          });
        });
      }
    );
  });

  it("O sistema não deve trocar o sindicato OCERGS que já foi vinculado ao pre-pedido para o perfil compartilhado", () => {
    const transportador = require("../../../fixtures/data/transportador/ctc_ativo/87573952000182");
    const doc = require("../../../fixtures/data/doc/doc_identidadeAPI.json");
    const usuario = require("../../../fixtures/usuario.json");
    let idPrePedido;
    const sindicato = {
      idEntidade: 653,
      perfil: "OCERGS - Master",
      sigla: "OCERGS",
      path: path.generic.perfilSitcarga.OCERGSMAster,
    };
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );

    // criando pedido pela API.
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

          // ------ Criar operação Incluir Contato Telefone  pela API -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            2,
            transportador.contatos.telefone
          ).then((response) => {
            expect(response.status).to.equal(200);
          });

          // ------ Criar operação Incluir Contato Email pela API -----//
          cy.contatoPrePedidoAPI(
            idPrePedido,
            4,
            transportador.contatos.email
          ).then((response) => {
            expect(response.status).to.equal(200);
          });
          // -------- Criar operação Incluir Gestor pela API ----- //
          cy.criarOperacaoGestorAPI(transportador.gestor, 4, idPrePedido).then(
            (response) => {
              expect(response.status).to.equal(200);
            }
          );

          cy.criarOperacaoDocumentoPrePedidoAPI(doc, idPrePedido).then(
            (response) => {
              expect(response.status).to.equal(200);
            }
          );

          // ------ Incluindo Entidade no pedido ----- //
          const idEntidadeVinculada = {
            banco: 19,
            sitcarga: 628,
          };
          cy.entidadePrePedidoAPI(idEntidadeVinculada.banco, idPrePedido).then(
            (response) => {
              expect(response.status).to.equal(200);
            }
          );

          cy.visit(`?ponto=${sindicato.idEntidade}`);

          //fazendo o login de acesso
          cy.get('[href="#/login"]').click();
          cy.get(path.loginPage.cpf, { timeout: 20000 }).type(usuario.cpf);
          cy.get(path.loginPage.senha).type(usuario.senha);
          cy.get(path.generic.botaoSubmit).click({ force: true });
          cy.wait("@loginacesso", { timeout: 90000 });
          cy.get(path.generic.title, { timeout: 20000 }).should(
            "have.text",
            " Consultar Atendimentos "
          );

          cy.visit(`atendimento/${idPrePedido}/detalhe`);
          cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
            (element) => {
              expect(element.text()).to.be.equal(`#${idPrePedido}`);
            }
          );

          //Verificar se o sindicato aparece já incluso no campo Pontos de Atendimento
          cy.visit(`regularizacao/${idPrePedido}/checkout`);

          cy.get("span.ellipsis")
            .should("exist")
            .and("contain.text", idEntidadeVinculada.sitcarga);

          // ----- Cancelar o pedido ---- //
          cy.cancelarPrePedidoAPI(idPrePedido).then((response) => {
            expect(response.status).to.equal(200);
          });
        });
      }
    );
  });
});
