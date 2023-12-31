/// <reference types="Cypress"/>
import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../../../selectors/path.sel.cy';
import mensagem from "../../../../support/enum/mensagemAlertEnum";
import  urls  from "../../../../support/urls";
import  situacao  from "../../../../support/enum/SituacaoEnum";
var fakerBr = require('faker-br');  


//   let veiculoImplemento;
//   let veiculoAutomotor;  
//   let index = 0;
//   let doc; 
//   let idPrePedido = '2071588';
//   const celular = '(21) 98878-7878';
//   const telefone = '(12) 3937-6191';
//   const fax = '(21) 9764-9386';
//   const email = 'gghary@hjgay.com';

//   const motorista = {
//     cpf: '019.726.838-29',
//     nome: 'TAC - DELMAR BATISTA DE OLIVEIRA',
//     dataNascimento: '26/11/1978',
//     cnh: '11111111111',
//     categoria: 'C',    
//   };

//   let enderecoComercial = {
//     cep: '12236670',
//     logradouro: 'RUA JOSEFA ALBUQUERQUE DOS SANTOS',
//     municipio: 'São José dos Campos',
//     uf: 'SP',
//     numero: '513',
//     bairro: 'CIDADE MORUMBI',    
//   };

//   let enderecoResidencial = {
//     cep: '12236670',
//     logradouro: 'RUA JOSEFA ALBUQUERQUE DOS SANTOS',
//     municipio: 'São José dos Campos',
//     uf: 'SP',
//     numero: '513',
//     bairro: 'CIDADE MORUMBI',    
//   };

// let boleto = {
//     codigoBarra : '',
//     nossoNumero : '',
//     valorPago: '',
//     meioPagamento: '',
//     dataEmissao: '',
//     utilizacao: '',
//     valorBoleto: '',
//     situacao: ''    
//   };
//   const transportador = {
//     cpfCnpj: "253.635.438-50",
//     nome: "TAC - MARIA APARECIDA PEDROSO",
//     rntrc: "002331850",
//     situacao: "VENCIDO",
//     saldo: "R$ 0,00",
//     sigla: "TAC",
//     tipo: "Autônomo",
//   };
   

describe('Gerar pedido após confirmação do pagamento pre-pedido Movimentação de forta', () => {
  const transportador = require("../../../../fixtures/data/transportador/tac_ativo/14385400865");
  const sindicato = {
    perfil: "FETAC-MG - Master",
    sigla: "FETAC-MG",
    path: path.generic.perfilSitcarga.FETACMGMaster,
  };
      beforeEach(() => {
        cy.reload()
        // cy.fixture("data/doc/documentos").then((data) => {
        //   doc = data
        // })
        
        // cy.intercept('GET', '**/validarpedido').as('validarpedido')
        // cy.intercept('PUT', '**/finalizar').as('finalizarpedido')
        // cy.intercept('GET', `**/rntrc/PrePedido/**`).as('gridoperacao') 

        cy.viewport(1920, 1080);
        //cy.login()          
      });

    
            
    // describe('Iniciando testes Autoatendimento', () => {

    //         //------ Abrir Atendimento de Alteração de dados ------//
    //           it('Criar pedido Alteração de dados TAC', () => {
    //             cy.log(`Testes sendo executados no ambiente de ${Cypress.env('ENVIRONMENT')}`)       
    //               //Logar na página com o usuario         
    //               //Clicar na opção Regularização RNTRC no menu lateral
    //               cy.get(path.atendimentoPage.regularizacao, {timeout: 30000}).click({force: true});
    //               //Selecionando o tipo de atendimento Renovação RNTRC
    //               cy.atendimentosRegularizacao('Alteração de Dados')         
    //               //
    //               cy.get(path.criarPedidoPage.inputTipoTransportador)
    //                 .click({force: true})
    //                 .get(path.criarPedidoPage.tipoTransportador).contains(transportador.tipo, {timeout: 200}).click({force: true})        
    //               cy.get(path.criarPedidoPage.cpfCnpj).type(transportador.cpfCnpj);
    //               cy.get(path.generic.botaoSubmit).click({ force: true });
                  
    //               cy.notificacao(mensagem.AtendimentoCriadoSucesso)    
                
    //               cy.get(path.generic.idAtendimento, {timeout: 10000}).then((element)=> {          
    //                 idPrePedido = element.text().substring(1);
    //                 expect(element.text()).to.be.equal(`#${idPrePedido}`)
    //               })
                
    //           });
                
    //       // ------ Criar operação Salvar transportador -----//
    //     it('Criar operação Salvar transportador', () => {           
    //       cy.acessarPedido(idPrePedido)       
    //       cy.url().should('include', `detalhe`)
    //       cy.wait('@gridoperacao')
    //       cy.operacaoTransportador(fakerBr, transportador.sigla)         
    //       cy.notificacao(mensagem.TransportadorSucesso)                     
    //     })   
        
    //     //-------- Criar operação Enviar documentos do tipo Identidade ------//              
    //     it('Criar operação Enviar documentos do tipo Identidade', () => { 
    //       cy.acessarPedido(idPrePedido)       
    //       cy.url().should('include', `detalhe`)
    //       cy.wait('@gridoperacao') 
    //       cy.documentosIdentidade(doc.rg)
    //       cy.notificacao(mensagem.ArquivoInclusoSucesso, doc.rg)      
    //     });

    //     // ------ Criar operação Incluir Contato Email ------//
    //     it('Criar operação Incluir Contato Email', () => { 
    //       cy.acessarPedido(idPrePedido)       
    //       cy.url().should('include', `detalhe`)
    //       cy.wait('@gridoperacao')
    //       cy.incluirContatoEmail(faker)
    //       cy.notificacao(mensagem.DadosSalvoSucesso) 
    //     });
        
    //     // ------ Criar operação Excluir Contato Email ------//
    //     it('Criar operação Excluir Contato Email', () => { 
    //       cy.acessarPedido(idPrePedido)       
    //       cy.url().should('include', `detalhe`)
    //       cy.wait('@gridoperacao')
    //       cy.incluirContatoEmail(faker, email)
    //       cy.notificacao(mensagem.DadosSalvoSucesso) 
    //     });

        
    //     // ------ Criar operação Excluir Contato Celular -----//
    //     it('Criar operação Excluir Contato Celular', () => { 
    //       cy.acessarPedido(idPrePedido)       
    //       cy.url().should('include', `detalhe`)
    //       cy.wait('@gridoperacao')        
    //       cy.excluirContatoCelular(fakerBr, celular)   
    //       cy.notificacao(mensagem.DadosSalvoSucesso);
    //     });

    //     // ------ Criar operação Excluir Contato Telefone -----//
    //     it('Criar operação Excluir Contato Telefone', () => { 
    //       cy.acessarPedido(idPrePedido)       
    //       cy.url().should('include', `detalhe`)
    //       cy.wait('@gridoperacao')        
    //       cy.excluirContatoTelefone(faker, telefone)  
    //       cy.notificacao(mensagem.DadosSalvoSucesso);       
    //     });
        
    //     // ------ Criar operação Incluir Contato Telefone -----//
    //     it('Criar operação Incluir Contato Telefone', () => {
    //       cy.acessarPedido(idPrePedido)       
    //       cy.url().should('include', `detalhe`)
    //       cy.wait('@gridoperacao')   
    //       cy.incluirContatoTelefone(faker)  
    //       cy.notificacao(mensagem.DadosSalvoSucesso);      
    //     });
        
    //     // ------- Criar operação Incluir Contato Fax -------//
    //     it('Criar operação Incluir Contato Fax', () => {
    //       cy.acessarPedido(idPrePedido)       
    //       cy.url().should('include', `detalhe`)
    //       cy.wait('@gridoperacao')
    //       cy.incluirContatoFax(faker)     
    //       cy.notificacao(mensagem.DadosSalvoSucesso);      
    //     });       
        
    //     // ------- Criar operação Excluir Contato Fax -------//
    //     it('Criar operação Excluir Contato Fax', () => {
    //       cy.acessarPedido(idPrePedido)       
    //       cy.url().should('include', `detalhe`)
    //       cy.wait('@gridoperacao')
    //       cy.incluirContatoFax(faker, fax)     
    //       cy.notificacao(mensagem.DadosSalvoSucesso);      
    //     }); 

    //     // -------- Criar operação Alterar Endereço Residencial --------//
    //     it.skip('Criar operação Alterar Endereço Residencial', () => { 
    //       cy.acessarPedido(idPrePedido)       
    //       cy.url().should('include', `detalhe`)
    //       cy.wait('@gridoperacao')
    //       cy.alterarEnderecoResidencial(fakerBr, cep)
    //       //cy.notificacao(mensagem.DadosSalvoSucesso);      
    //     });  

    //     // -------- Criar operação Alterar Endereço Correspondência --------//
    //     it.skip('Criar operação Incluir Endereço Correspondência', () => { 
    //       cy.acessarPedido(idPrePedido)       
    //       cy.url().should('include', `detalhe`)
    //       cy.wait('@gridoperacao')
    //       cy.incluirEnderecoCorrespondenciaTAC(fakerBr, cep)
    //       //cy.notificacao(mensagem.DadosSalvoSucesso);      
    //     });  

    //   // --------- Criar operacao Incluir Motorista -----//
    //     it.skip('Criar operacao Incluir Motorista', () => {
    //         cy.acessarPedido(idPrePedido)       
    //         cy.url().should('include', `detalhe`)
    //         cy.wait('@gridoperacao')
    //         cy.incluirMotorista(fakerBr)
    //         cy.notificacao(mensagem.DadosSalvoSucesso);
    //     });  
      
    //   // --------- Criar operacao Alterar Motorista -----//
    //     it.skip('Criar operacao Alterar Motorista', () => {
    //         cy.acessarPedido(idPrePedido)       
    //         cy.url().should('include', `detalhe`)
    //         cy.wait('@gridoperacao')        
    //         cy.alterarMotorista(fakerBr, motorista.cpf)
    //         cy.notificacao(mensagem.DadosSalvoSucesso);
    //     });     
              
    // });
              
    // describe('Selecionar o sindicato e gerar valor e anexar documento no veiculo inválido', () => {
              
    //         // ------- Selecionar o sindicato responsável -------//        
    //         it('Selecionar o sindicato responsável', () => {
    //           cy.intercept('GET', `**/rntrc/PrePedido/listarentidadesdisponiveis?idPedido=${idPrePedido}`).as('listaSindicatos')
    //           cy.intercept('PUT', '**/entidade').as('entidadePUT')
    //           cy.intercept('POST', '**/entidade').as('entidadePOST')
    //           cy.intercept('GET', '**/valor**').as('tabela')   

    //           cy.acessarPedido(idPrePedido)
    //           cy.url().should('include', `detalhe`)
    //           cy.wait('@gridoperacao')
              
    //           cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible').click({force: true})

    //           cy.get(path.generic.title, {timeout: 10000})
    //           .contains('Escolha Ponto de Atendimento')
              
    //           cy.get(path.checkoutAtendimentoPage.pontosAtendimento, {timeout: 10000}).click()
    //           .type(sindicato.sigla).wait(5000)
    //           .get(path.checkoutAtendimentoPage.listaSindicatos, {timeout: 10000})
    //           .contains(sindicato.sigla, {timeout: 10000}).click()
                
    //           cy.wait('@gridoperacao') 
    //           cy.wait('@listaSindicatos') 
    //           cy.wait('@entidadePOST')           
    //           cy.wait('@tabela')   
                
    //             cy.get(path.generic.tabela, {timeout: 30000})
    //             .then((ele) => {
                  
    //               cy.log(ele.text())
                  
    //                 cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Alteração de Dados do Transportador (Gratuito)')
    //                 cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$0.00')
    //                 cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '1')
    //                 cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$0.00')
                
                    
    //                 cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$0.00')          
                  
    //             });
                
    //           cy.get(path.checkoutAtendimentoPage.botaoConfirmar1).click({force: true});            
            
    //           cy.wait('@validarpedido')
    //           cy.get(path.checkoutAtendimentoPage.botaoConfirmar2, {timeout: 10000}).should('be.visible').click({force: true});
    //           cy.get(path.generic.title, {timeout: 10000})
    //           .contains('Confira o Resumo do pedido', {timeout: 10000})             
              
    //           cy.get(path.generic.tabela, {timeout: 30000})
    //             .then((ele) => {
                  
    //               cy.log(ele.text())
                  
    //                 cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Alteração de Dados do Transportador (Gratuito)')
    //                 cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$0.00')
    //                 cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '1')
    //                 cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$0.00')
                
                    
    //                 cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$0.00')          
                  
    //             });
              
    //           cy.get(path.generic.finalizar).click({force: true});
              
    //           cy.get('.q-ml-sm').contains('Confirma a finalização do atendimento?')
    //           .get(path.generic.botaoOk).click({force: true})
    //             cy.wait('@validarpedido')
    //             cy.wait('@finalizarpedido', {timeout: 120000})
              
    //         });         
          
    // }); 
        

                
  it('Consultando se o pagamento do boleto foi compensado', () => {
    cy.intercept('POST', '/autoatendimento/prepedido/consultar?gridName=grid').as('listaPrepedido')
      cy.intercept('POST', '/autoatendimento/prepedido/gerarpedido/').as('gerarpedido')
      cy.intercept('POST', 'https://sac-evoservicosfinanceiros.ascbrazil.com.br/site-visitantes/monitor-visitante').as('visitante')
      cy.intercept('POST', '/institucional/authsca').as('autenticacao')
      cy.intercept('GET', 'https://sac-evoservicosfinanceiros.ascbrazil.com.br/socket.io/**').as('socketio')   
    
    let idPrePedido;
    const idEntidade = 21
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
              resolve(response.body.id)
              idPrePedido = response.body.id

              cy.criarOperacaoTransportadorAPI(transportador, idPrePedido).then(response => {
                expect(response.status).to.equal(200);
              })

              cy.entidadePrePedidoAPI(idEntidade, idPrePedido).then(response => {
                expect(response.status).to.equal(200);
              })

              cy.finalizarPrePedidoAPI(idPrePedido).then(response => {
                 expect(response.status).to.equal(200);
              })

              cy.visit(urls.sitcargaInitial);
              cy.get('.cookie-message > :nth-child(1) > p', {timeout: 10000})
              .should('be.visible')
              .contains('Utilizamos cookies essenciais e tecnologias semelhantes para melhorar a sua experiência no nosso site. Para maiores informações, acesse nossa Política de Privacidade.')
              .get('#btnAccept').click({force: true})           
              cy.loginSitcarga()
              cy.get('.logo > img', {timeout: 30000}).should('have.attr','src', path.sitcargaHomePage.imgLogon)
              cy.get(':nth-child(1) > .m-r-sm').contains(Cypress.env('usuario').nome.toUpperCase()) 
              cy.get('.dropdown-toggle').click({force: true})
              .get('#niveis-usuario > li > a').contains(sindicato.perfil, {timeout: 10000}).click({force: true}) 
              cy.get('.dropdown-toggle').contains(sindicato.perfil, {timeout: 10000})
              cy.wait('@visitante')
              cy.get('#side-menu > li > a > span').contains('Auto Atendimento', {timeout: 10000}).click({force: true}).click({force: true})
              .get('a[href="/autoatendimento/prepedido"]', {timeout: 10000}).contains('Acompanhamento', {timeout: 10000}).click({force: true})
                       
              cy.get('#IdPedido').type(idPrePedido)
              cy.get('#btn-consultar').click({force: true})  
              cy.wait('@listaPrepedido')
              cy.get('table > tbody > tr', {timeout: 10000}).each(($ele)=>{
                cy.get($ele).find('td', {timeout: 10000}).each(($td, index, list) => {
                  let texto = $td.text()
                  cy.log('ID:', idPrePedido)
                  if (texto == idPrePedido) {
                    cy.log('valor encontrado', texto)
                    cy.wrap($ele).find('i[class="i i-search"]', {timeout: 10000}).click({force: true}) 
                    return false
                  }else {
                    cy.log('Valor não encontrado:', texto)
                  }
                })                
              })
      
              cy.wait('@autenticacao')
              cy.wait('@socketio')  
              cy.wait('@visitante')
              cy.get('#situacao', {timeout: 20000}).contains(situacao.PAGAMENTOEFETUADO, {timeout: 20000})
              .get('#btn-gerar-pedido', {timeout:20000}).click({force: true})
              //cy.get('#confirm-ok').click({force: true}) 
              cy.wait('@gerarpedido')
              //cy.get('.alert')

            })            
            
            // cy.wait("@listapedidos");
            // cy.wait(2000);
            // cy.get(path.atendimentoPage.numeroAtendimento).type(idPrePedido, {
            //   force: true,
            // });
            // cy.get(path.generic.botaoSubmit)
            //   .click({ force: true })
            //   .wait("@gridoperacao");
            // cy.get(path.generic.idAtendimento, { timeout: 10000 }).then(
            //   (element) => {
            //     expect(element.text()).to.be.equal(`#${idPrePedido}`);
            //   }
            // );            
          }
        );    
      
  });
  
});