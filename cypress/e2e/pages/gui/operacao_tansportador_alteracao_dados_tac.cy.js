/// <reference types="Cypress"/>
import { faker } from "@faker-js/faker";
//import { fakerBR } from 'fakerbr';
import path from "../../../selectors/path.sel.cy";
import mensagem from "../../../support/enum/mensagemAlertEnum";
var fakerBr = require("faker-br");

describe("Suite de testes operação Transportador", () => {
  
  beforeEach(() => { 
    cy.viewport(1920, 1080);
    cy.login();
  });

  it("Criando pedido API e incluindo operação transportador", () => {
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
        cy.visit(`atendimento/${idPrePedido}/detalhe`)
        cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
          (element) => {
            expect(element.text()).to.be.equal(`#${idPrePedido}`);
          }
        );

        // ------ Criar operação Salvar transportador -----//

        cy.url().should("include", `detalhe`);
        cy.operacaoTransportador(fakerBr, transportador.dadosTransportador.sigla);
        cy.notificacao(mensagem.TransportadorSucesso);

        cy.cancelarPrePedidoAPI(idPrePedido).then(response => {
      expect(response.status).to.equal(200);
    })  
      });
      
    });

    
  });

  

  it("Verificar se os campos da operação Transportador estão na posição correta", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");    
    let idPrePedido = 2071817;
    const listDataCy = [
      'razaoSocialInput',
      'identidadeInput'
    ];
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
        cy.visit(`atendimento/${idPrePedido}/detalhe`)
        cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
          (element) => {
            expect(element.text()).to.be.equal(`#${idPrePedido}`);
          }
        );

        // ------ operação Salvar transportador -----//
        cy.url().should("include", `detalhe`);
        cy.get(path.detalhamentoAtendimentoPage.operacaoTransportador)
        .contains('Transportador').click({force: true})

        //cy.acessarPedido(idPrePedido)        

        cy.get('.q-form').then((form) => {
          cy.wrap(form).find('.q-field__inner').each( (input, index, list) => {
              cy.wrap(input).find('input.q-field__native.q-placeholder').should('have.attr', 'data-cy', listDataCy[index])
          })
        })
        cy.cancelarPrePedidoAPI(idPrePedido).then(response => {
          expect(response.status).to.equal(200);
        })  
      });
      
    });

    
  });

  it("Verificar se o sistema está apresentando a mensagem de erro quando os campos não foram preenchidos", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");    
    let idPrePedido = 2071817;
    const listDataCy = [
      'razaoSocialInput',
      'identidadeInput'
    ];
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    //*
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
        cy.visit(`atendimento/${idPrePedido}/detalhe`)
        cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
          (element) => {
            expect(element.text()).to.be.equal(`#${idPrePedido}`);
          }
        );

         // ------ operação Salvar transportador -----//
         cy.url().should("include", `detalhe`);
         cy.get(path.detalhamentoAtendimentoPage.operacaoTransportador)
         .contains('Transportador').click({force: true})

        //cy.acessarPedido(idPrePedido)
        
        //*Action
        cy.get(path.operacaoTransportador.razaoSocial).click().tab()
        cy.get(path.operacaoTransportador.identidade).click().tab()
        
        //*Assert
        cy.get('.q-form').then((form) => {
          cy.wrap(form).find('.q-field__inner').each( (input, index, list) => {
              cy.wrap(input).find('.q-field__bottom > .q-field__messages >').should('contain.text', 'Campo obrigatório' )
          })
        })
        
        cy.cancelarPrePedidoAPI(idPrePedido).then(response => {
          expect(response.status).to.equal(200);
        })  
      });
      
    });

    
  });

  it("Verificar se o sistema está impedindo a criação da operação Transportador clicando no botão salvar quando o campo nome está em branco", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");    
    let idPrePedido = 2071817;
    const listDataCy = [
      'razaoSocialInput',
      'identidadeInput'
    ];
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    //*
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
        cy.visit(`atendimento/${idPrePedido}/detalhe`)
        cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
          (element) => {
            expect(element.text()).to.be.equal(`#${idPrePedido}`);
          }
        );

        // ------ operação Salvar transportador -----//
        cy.url().should("include", `detalhe`);
        cy.get(path.detalhamentoAtendimentoPage.operacaoTransportador)
        .contains('Transportador').click({force: true})

        //cy.acessarPedido(idPrePedido)
        
        //*Action
        cy.get(path.operacaoTransportador.identidade).type(transportador.dadosTransportador.rg);
        
        cy.get(path.generic.botaoSubmit).click()
        
        //*Assert
        cy.get('.q-form').then((form) => {
          cy.wrap(form).find('.q-field__inner').each( (input, index, list) => {
              cy.wrap(input).find('.q-field__bottom > .q-field__messages >').should('contain.text', 'Campo obrigatório' )
              return false
          })
        })
        
        cy.cancelarPrePedidoAPI(idPrePedido).then(response => {
          expect(response.status).to.equal(200);
        })  
      });
      
    });

    
  });

  it("Verificar se o sistema está impedindo a criação da operação Transportador clicando no botão salvar quando o campo identidade está em branco", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");    
    let idPrePedido = 2071829;
    const listDataCy = [
      'razaoSocialInput',
      'identidadeInput'
    ];
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    ); 
    //*
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
        cy.visit(`atendimento/${idPrePedido}/detalhe`)
        cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
          (element) => {
            expect(element.text()).to.be.equal(`#${idPrePedido}`);
          }
        );

        // ------ operação Salvar transportador -----//
        cy.url().should("include", `detalhe`);
        cy.get(path.detalhamentoAtendimentoPage.operacaoTransportador)
        .contains('Transportador').click({force: true})

        //cy.acessarPedido(idPrePedido)
        
        //*Action
        cy.get(path.operacaoTransportador.razaoSocial).type(transportador.dadosTransportador.nome)
        cy.get(path.generic.botaoSubmit).click()
        
        //*Assert
        cy.get(`form > div:nth-child(2) > label > div > div.q-field__bottom.row.items-start.q-field__bottom--animated > div > div`)
        .should('contain.text', 'Campo obrigatório' )
        
        cy.cancelarPrePedidoAPI(idPrePedido).then(response => {
          expect(response.status).to.equal(200);
        })  
      });
      
    });

    
  });

  it("Verificar se o campo identidade da operação transportador está aceitando o preenchimento de caracteres de texto", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");    
    let idPrePedido = 2071829;
    const listDataCy = [
      'razaoSocialInput',
      'identidadeInput'
    ];
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    ); 
    //*
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
        cy.visit(`atendimento/${idPrePedido}/detalhe`)
        cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
          (element) => {
            expect(element.text()).to.be.equal(`#${idPrePedido}`);
          }
        );

        // ------ operação Salvar transportador -----//
        cy.url().should("include", `detalhe`);
        cy.get(path.detalhamentoAtendimentoPage.operacaoTransportador)
        .contains('Transportador').click({force: true})

        //*Action
        cy.get(path.operacaoTransportador.identidade).type('testando campo identidade que não deve aceitar caracteres de texto')
        cy.get(path.operacaoTransportador.identidade).should('not.have.text')
        cy.get(path.generic.botaoSubmit).click()
        
        //*Assert
        cy.get(`form > div:nth-child(2) > label > div > div.q-field__bottom.row.items-start.q-field__bottom--animated > div > div`)
        .should('contain.text', 'Campo obrigatório' )
        
        cy.cancelarPrePedidoAPI(idPrePedido).then(response => {
          expect(response.status).to.equal(200);
        })  
      });
      
    });

    
  });

  it("Verificar se o detalhamento da operação está funcional", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");    
    let idPrePedido;
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
        // ------ Criar operação Salvar transportador -----//
        cy.criarOperacaoTransportadorAPI(transportador, idPrePedido).then( response => {
          
          expect(response.status).to.equal(200);

        })

        cy.visit(`atendimento/${idPrePedido}/detalhe`)
        cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
          (element) => {
            expect(element.text()).to.be.equal(`#${idPrePedido}`);
          }
        );

        cy.url().should("include", `detalhe`);        
        cy.detalharOperacaoTransportador(transportador.dadosTransportador)

        cy.cancelarPrePedidoAPI(idPrePedido).then(response => {
          expect(response.status).to.equal(200);
        })  
      });
      
    });
    
  });

  it("Verificar se o sistema está aceitando editar o nome e identidade na operação transportador sem erros", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");    
    let idPrePedido;
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
        // ------ Criar operação Salvar transportador -----//
        cy.criarOperacaoTransportadorAPI(transportador, idPrePedido).then( response => {
          
          expect(response.status).to.equal(200);

        })

        cy.visit(`atendimento/${idPrePedido}/detalhe`)
        cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
          (element) => {
            expect(element.text()).to.be.equal(`#${idPrePedido}`);
          }
        );        

        cy.visit(`atendimento/${idPrePedido}/transportador/transportador-detalhar?id=${transportador.dadosTransportador.sigla}`)
         const name = fakerBr.name.findName(); 
         const rg = fakerBr.random.number({max: 99999})
        //*Action
        cy.get(path.operacaoTransportador.razaoSocial).clear().type(name)
        cy.get(path.operacaoTransportador.identidade).clear().type(rg)
        cy.get(path.generic.botaoSubmit).click()  
        
        //*Assert
        cy.notificacao(mensagem.EdicaoTransportador);

        cy.cancelarPrePedidoAPI(idPrePedido).then(response => {
          expect(response.status).to.equal(200);
        })  
      });
      
    });
    
  });

  it("Verificar se após a edição de um transportador se o nome atualizado aparece no card da operação no grid de detalhamento do atendimento", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");    
    let idPrePedido = 2071863;
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
        /// ------ Criar operação Salvar transportador -----//
        cy.criarOperacaoTransportadorAPI(transportador, idPrePedido).then( response => {
          
          expect(response.status).to.equal(200);

        })

        cy.visit(`atendimento/${idPrePedido}/detalhe`)
        cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
          (element) => {
            expect(element.text()).to.be.equal(`#${idPrePedido}`);
          }
        );        

        cy.visit(`atendimento/${idPrePedido}/transportador/transportador-detalhar?id=${transportador.dadosTransportador.sigla}`)
         const name = fakerBr.name.findName(); 
         const rg = fakerBr.random.number({max: 99999})
        //*Action
        cy.get(path.operacaoTransportador.razaoSocial).clear().type(name)
        cy.get(path.operacaoTransportador.identidade).clear().type(rg)
        cy.get(path.generic.botaoSubmit).click()  
        cy.notificacao(mensagem.EdicaoTransportador)
        transportador.dadosTransportador.nome = name;
        transportador.dadosTransportador.rg = rg;

        //*Assert
        cy.url().should("include", `detalhe`);        
        cy.detalharOperacaoTransportador(transportador.dadosTransportador, 'Alteração')

        cy.cancelarPrePedidoAPI(idPrePedido).then(response => {
          expect(response.status).to.equal(200);
        })  
      });
      
    });
    
  });

  it("Verificar detalhando a operação Alterar transportador, se os dados salvos na edição do transportador correspondem aos que foram salvos", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");    
    let idPrePedido = 2071857;
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
        // ------ Criar operação Salvar transportador -----//
        cy.criarOperacaoTransportadorAPI(transportador, idPrePedido).then( response => {
          
          expect(response.status).to.equal(200);

        })

        cy.visit(`atendimento/${idPrePedido}/detalhe`)
        cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
          (element) => {
            expect(element.text()).to.be.equal(`#${idPrePedido}`);
          }
        );        

        cy.visit(`atendimento/${idPrePedido}/transportador/transportador-detalhar?id=${transportador.dadosTransportador.sigla}`)
         const name = fakerBr.name.findName(); 
         const rg = fakerBr.random.number({max: 99999})
        //*Action
        cy.get(path.operacaoTransportador.razaoSocial).clear().type(name)
        cy.get(path.operacaoTransportador.identidade).clear().type(rg)
        cy.get(path.generic.botaoSubmit).click()  
        
        //*Assert
        cy.notificacao(mensagem.EdicaoTransportador);
        cy.visit(`atendimento/${idPrePedido}/detalhe`)        
        cy.visit(`atendimento/${idPrePedido}/transportador/transportador-detalhar?id=${transportador.dadosTransportador.sigla}`)

        cy.get(path.operacaoTransportador.razaoSocial).should('contain.value', name)
        cy.get(path.operacaoTransportador.identidade).should('contain.value', rg)

        cy.cancelarPrePedidoAPI(idPrePedido).then(response => {
          expect(response.status).to.equal(200);
        })  
      });
      
    });
    
  });

  it("Verificar se os campos estão na posição correta no detalhamento da operação transportador", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");    
    let idPrePedido = 2071817;
    const listDataCy = [
      'razaoSocialInput',
      'identidadeInput'
    ];
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
        cy.visit(`atendimento/${idPrePedido}/detalhe`)
        cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
          (element) => {
            expect(element.text()).to.be.equal(`#${idPrePedido}`);
          }
        );

        // ------ operação Salvar transportador -----//
        
        cy.criarOperacaoTransportadorAPI(transportador, idPrePedido).then( response => {
          
          expect(response.status).to.equal(200);

        })

        cy.visit(`atendimento/${idPrePedido}/transportador/transportador-detalhar?id=${transportador.dadosTransportador.sigla}`)

        //cy.acessarPedido(idPrePedido)        

        cy.get('.q-form').then((form) => {
          cy.wrap(form).find('.q-field__inner').each( (input, index, list) => {
              cy.wrap(input).find('input.q-field__native.q-placeholder').should('have.attr', 'data-cy', listDataCy[index])
          })
        })
        cy.cancelarPrePedidoAPI(idPrePedido).then(response => {
          expect(response.status).to.equal(200);
        })  
      });
      
    });
    
  });

  it("Verificar se o sistema está apresentando mensagem de erro quando os campos não foram preenchidos dentro do detalhamento da operação transportador", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");    
    let idPrePedido = 2071817;
    const listDataCy = [
      'razaoSocialInput',
      'identidadeInput'
    ];
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    //*
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
        cy.visit(`atendimento/${idPrePedido}/detalhe`)
        cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
          (element) => {
            expect(element.text()).to.be.equal(`#${idPrePedido}`);
          }
        );

         // ------ operação Salvar transportador -----//
        
        cy.criarOperacaoTransportadorAPI(transportador, idPrePedido).then( response => {
          
          expect(response.status).to.equal(200);

        })

        cy.visit(`atendimento/${idPrePedido}/transportador/transportador-detalhar?id=${transportador.dadosTransportador.sigla}`)

        //cy.acessarPedido(idPrePedido)
        
        //*Action
        cy.get(path.operacaoTransportador.razaoSocial).clear().tab()
        cy.get(path.operacaoTransportador.identidade).clear().tab()
        
        //*Assert
        cy.get('.q-form').then((form) => {
          cy.wrap(form).find('.q-field__inner').each( (input, index, list) => {
              cy.wrap(input).find('.q-field__bottom > .q-field__messages >').should('contain.text', 'Campo obrigatório' )
          })
        })
        
        cy.cancelarPrePedidoAPI(idPrePedido).then(response => {
          expect(response.status).to.equal(200);
        })  
      });
      
    });

    
  });

  it.only("Verificar se ao clicar no botão para desfazer a operação se ela sai do grid de detalhamento do atendimento", () => {
    const transportador = require("../../../fixtures/data/transportador/tac_ativo/04265777104");    
    let idPrePedido = 2071865;
    cy.log(
      `Testes sendo executados no ambiente de ${Cypress.env("ENVIRONMENT")}`
    );
    //*     
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
        // ------ Criar operação Salvar transportador -----//
        cy.criarOperacaoTransportadorAPI(transportador, idPrePedido).then( response => {          
          expect(response.status).to.equal(200);
        })

        cy.visit(`atendimento/${idPrePedido}/detalhe`);
        cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
          (element) => {
            expect(element.text()).to.be.equal(`#${idPrePedido}`);
          }
        );
        cy.url().should('include', 'detalhe');    
          
        cy.desfazerOperacaoTransportador(transportador.dadosTransportador, 'Alteração');

        cy.cancelarPrePedidoAPI(idPrePedido).then(response => {
          expect(response.status).to.equal(200);
        })  
      });
      
    });
    
  });

  
  
});

