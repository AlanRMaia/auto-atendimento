import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";
import situacao from "../../support/SituacaoEnum";
var fakerBr = require('faker-br');  

let doc;

  let idPrePedido = '2071119'; 
  let idPrePedidoFinalizado = '2071119'; 
  const celular = '(21) 99999-9998';
  const telefone = '(11) 4338-0201';
  const fax = '(21) 8999-9999'
  const email = 'nailtonnivaldosoares@gmail.com'

  const transportador = {
    cpfCnpj: "143.854.008-65",
    nome: "TAC - NAILTON NIVALDO SOARES",
    rntrc: "000010100",
    situacao: "ATIVO",
    saldo: "R$ 0,00",
    sigla: "TAC",
    tipo: "Autônomo"
  };

  const motorista = {
    cpf: '963.141.920-72',
    nome: 'MARCELO ANTONIO ZULIAN',
    dataNascimento: '26/11/1978',
    cnh: '11111111111',
    categoria: 'C',    
  }

  const sindicato = {
    perfil: "FETAC-MG - Master",
    sigla: "FETAC-MG",
    path: path.generic.perfilSitcarga.FETACMGMaster
  }

describe('', () => {
    beforeEach(() => {
        cy.fixture("data/doc/documentos").then((data) => {
            doc = data
          })     
          
          cy.viewport(1920, 1080);
          

          cy.login()
    });
    
    describe('Iniciando os testes para a criação do pedido', () => {


        it.skip('', () => {

            describe('Verificar se o filtro com o campo Numero atendimento está trazendo o atendimento correto', () => {
                cy.intercept('GET', 'https://sitcargaapitest/rntrc/PrePedido/listarpedidos**').as('listapedidos')
                cy.wait('@listapedidos')
                cy.get(path.atendimentoPage.numeroAtendimento).type(idPrePedidoFinalizado)
                cy.get(path.generic.botaoSubmit).click({ force: true });

                cy.get(path.generic.idAtendimento, {timeout: 10000}).then((element)=> {          
                    idPrePedido = element.text().substring(1);
                    expect(element.text()).to.be.equal(`#${idPrePedido}`)
                })
            });
            
        });

        it.skip('Testando o filtro da consulta com o CPF/CNPJ', () => { 
          cy.intercept('GET', 'https://sitcargaapitest/rntrc/PrePedido/listarpedidos**').as('listapedidos')
            cy.wait('@listapedidos')           
            // cy.get('.q-table tbody tr').then(($list) =>{
                //     let quantidade = 0;
                //     cy.wrap($list).each(($ele) => {
                    //             if (cy.wrap($ele).find('td[class="q-td text-center"] ').contains(transportador.cpfCnpj)) {
                        //                 quantidade++
                        //             }
                        //     })
                        //     if (quantidade == 1) {
                            //         cy.get(path.atendimentoPage.cpfCnpj).type(transportador.cpfCnpj, {force: true})
                            //         cy.get(path.generic.botaoSubmit).click({ force: true });
            //         cy.get('.q-pl-sm strong', {timeout: 10000}).contains(transportador.cpfCnpj)
            //     }
            // })
            cy.get(path.atendimentoPage.cpfCnpj).type(transportador.cpfCnpj, {force: true})
            cy.get(path.generic.botaoSubmit).click({ force: true });
            cy.intercept('GET', 'https://sitcargaapitest/rntrc/PrePedido/**').as('pedido')
            cy.get('.q-table tbody tr').each(($ele, index, list)=> {                
                
                if (cy.wrap($ele).find('td[class="q-td text-center"] ').contains(transportador.cpfCnpj)) {
                    
                    cy.wrap($ele).find('>td .q-btn').click()
                    
                    return false
                } else {
                    cy.log('Valor não encontrado:', cy.wrap($ele).find('td[class="q-td text-center"] ').invoke('text'))
                }                
            })
            cy.wait('@pedido')
            cy.get('.q-pl-sm strong', {timeout: 10000}).contains(transportador.cpfCnpj)
        });

        it.skip('Testando o filtro da consulta com a Situação AGUARDANDO PAGAMENTO', () => {
          cy.intercept('GET', 'https://sitcargaapitest/rntrc/PrePedido/listarpedidos**').as('listapedidos')
            cy.get(path.atendimentoPage.situacao).click({force: true})
            .get(path.generic.listaVirtual).contains(situacao.AGUARDANDOPAGAMENTO).click({force: true})
            cy.get(path.generic.botaoSubmit).click({ force: true });
            cy.wait('@listapedidos')
            cy.get('.q-table tbody tr').each(($ele, index, list)=> {   
               
                cy.wrap($ele).find('td[class="q-td text-center"] > span ').contains(situacao.AGUARDANDOPAGAMENTO)                  
                           
            })

        });

        it.skip('Testando o filtro da consulta com a Situação EM CADASTRAMENTO', () => {
          cy.intercept('GET', 'https://sitcargaapitest/rntrc/PrePedido/listarpedidos**').as('listapedidos')

            //cy.intercept('GET', 'https://sitcargaapitest/rntrc/PrePedido/listarpedidos?pageSize=10&pageNumber=1&sortBy=idPedido&sortDesc=true&idPedido=&cpfCnpjTransportador=&situacao=CAD').as('emcadastramento')
            cy.get(path.atendimentoPage.situacao).click({force: true})
            .get(path.generic.listaVirtual).contains(situacao.EMCADASTRAMENTO).click({force: true})
            cy.get(path.generic.botaoSubmit).click({ force: true });
            cy.wait('@listapedidos')
            //cy.wait('@emcadastramento')
            cy.get('.q-table tbody tr').each(($ele, index, list)=> {   
                
                cy.wrap($ele).find('td[class="q-td text-center"] > span ').contains(situacao.EMCADASTRAMENTO)                  
                           
            })

        });

        it.skip('Testando o filtro da consulta com a Situação EM CANCELADO', () => {
            cy.intercept('GET', 'https://sitcargaapitest/rntrc/PrePedido/listarpedidos**').as('listapedidos')
  
              cy.get(path.atendimentoPage.situacao).click({force: true})
              .get(path.generic.listaVirtual).contains(situacao.CANCELADO).click({force: true})
              cy.get(path.generic.botaoSubmit).click({ force: true });
              cy.wait('@listapedidos')
              cy.get('.q-table tbody tr').each(($ele, index, list)=> {   
                  
                  cy.wrap($ele).find('td[class="q-td text-center"] > span ').contains(situacao.CANCELADO)                  
                             
              })
  
          });

          it.skip('Testando o filtro da consulta com a Situação PAGAMENTO EFETUADO', () => {
            cy.intercept('GET', 'https://sitcargaapitest/rntrc/PrePedido/listarpedidos**').as('listapedidos')
  
              cy.get(path.atendimentoPage.situacao).click({force: true})
              .get(path.generic.listaVirtual).contains(situacao.PAGAMENTOEFETUADO).click({force: true})
              cy.get(path.generic.botaoSubmit).click({ force: true });
              cy.wait('@listapedidos')
              cy.get('.q-table tbody tr').each(($ele, index, list)=> {   
                 
                  cy.wrap($ele).find('td[class="q-td text-center"] > span ').contains(situacao.PAGAMENTOEFETUADO)                  
                             
              })
  
          });

          it.skip('Testando o filtro da consulta com a Situação PEDIDO FINALIZADO', () => {
            cy.intercept('GET', 'https://sitcargaapitest/rntrc/PrePedido/listarpedidos**').as('listapedidos')
  
              cy.get(path.atendimentoPage.situacao).click({force: true})
              .get(path.generic.listaVirtual).contains(situacao.PEDIDOFINALIZADO).click({force: true})
              cy.get(path.generic.botaoSubmit).click({ force: true });
              cy.wait('@listapedidos')
              cy.get('.q-table tbody tr').each(($ele, index, list)=> {   
                  
                  cy.wrap($ele).find('td[class="q-td text-center"] > span ').contains(situacao.PEDIDOFINALIZADO)                  
                             
              })
  
          });

          it.skip('Testando o filtro da consulta com a Situação PEDIDO FINALIZADO', () => {
            cy.intercept('GET', 'https://sitcargaapitest/rntrc/PrePedido/listarpedidos**').as('listapedidos')
  
              cy.get(path.atendimentoPage.situacao).click({force: true})
              .get(path.generic.listaVirtual).contains(situacao.PEDIDOREJEITADO).click({force: true})
              cy.get(path.generic.botaoSubmit).click({ force: true });
              cy.wait('@listapedidos')
              cy.get('.q-table tbody tr').each(($ele, index, $list)=> {   
                  
                  cy.wrap($ele).find('td[class="q-td text-center"] > span ').contains(situacao.PEDIDOREJEITADO)                  
                             
              })
  
          });

          it('Testando o filtro da consulta com a data Situação', () => {
            cy.intercept('GET', 'https://sitcargaapitest/rntrc/PrePedido/listarpedidos**').as('listapedidos')
  
              cy.get(path.atendimentoPage.dataInicioSituacao).type('26/09/2023')
              cy.get(path.atendimentoPage.dataFimSituacao).type('26/09/2023')
              cy.get(path.generic.botaoSubmit).click({ force: true });
              cy.wait('@listapedidos')
              cy.get('.q-table tbody tr').each(($ele, index, list)=> {                
                
                cy.wrap($ele).find('td[class="q-td text-center"] ').contains('26/09/2023') 
                    
            })
  
          });
        

    //         // ------ Abrir Atendimento de Alteração de dados ------//
    //         describe('Criar pedido Alteração de dados TAC', () => {
    //             //cy.log(`Testes sendo executados no ambiente de ${Cypress.env('ENVIRONMENT')}`)       
    //             //Logar na página com o usuario         
    //             //Clicar na opção Regularização RNTRC no menu lateral
    //             cy.get(path.atendimentoPage.regularizacao, {timeout: 30000}).click({force: true});
    //             //Selecionando o tipo de atendimento Renovação RNTRC
    //             cy.atendimentosRegularizacao('Alteração de Dados')         
    //             //
    //             cy.get(path.criarPedidoPage.inputTipoTransportador)
    //                 .click({force: true})
    //                 .get(path.criarPedidoPage.tipoTransportador).contains('Autônomo', {timeout: 200}).click({force: true})        
    //             cy.get(path.criarPedidoPage.cpfCnpj).type(transportador.cpfCnpj);
    //             cy.get(path.generic.botaoSubmit).click({ force: true });
                
    //             cy.notificacao(mensagem.AtendimentoCriadoSucesso)    
                
    //             cy.get(path.generic.idAtendimento, {timeout: 10000}).then((element)=> {          
    //                 idPrePedido = element.text().substring(1);
    //                 expect(element.text()).to.be.equal(`#${idPrePedido}`)
    //             })
                
    //         });
                
    //             // ------ Criar operação Salvar transportador -----//
    //             describe.skip('Criar operação Salvar transportador', () => { 
    //             cy.acessarPedido(idPrePedido)       
    //             cy.operacaoTransportador(fakerBr, transportador.sigla)
    //             cy.notificacao(mensagem.TransportadorSucesso)      
    //             });
                
    //             //-------- Criar operação Enviar documentos do tipo Identidade ------//              
    //             describe('Criar operação Enviar documentos do tipo Identidade', () => {  
    //             cy.acessarPedido(idPrePedido)      
    //             cy.documentosIdentidade(doc.rg)
    //             cy.notificacao(mensagem.ArquivoInclusoSucesso, doc.rg)      
    //             });

    //             // ------ Criar operação Incluir Contato Email ------//
    //             describe('Criar operação Incluir Contato Email', () => { 
    //             cy.acessarPedido(idPrePedido)       
    //             cy.incluirContatoEmail(faker)
    //             cy.notificacao(mensagem.DadosSalvoSucesso) 
    //             });
                
    //             // ------ Criar operação Excluir Contato Email ------//
    //             describe('Criar operação Excluir Contato Email', () => { 
    //             cy.acessarPedido(idPrePedido)       
    //             cy.incluirContatoEmail(faker, email)
    //             cy.notificacao(mensagem.DadosSalvoSucesso) 
    //             });

                
    //             // ------ Criar operação Excluir Contato Celular -----//
    //             describe('Criar operação Excluir Contato Celular', () => {         
    //             cy.acessarPedido(idPrePedido)        
    //             cy.excluirContatoCelular(fakerBr, celular)   
    //             cy.notificacao(mensagem.DadosSalvoSucesso);
    //             });

    //             // ------ Criar operação Excluir Contato Telefone -----//
    //             describe('Criar operação Excluir Contato Telefone', () => {         
    //             cy.acessarPedido(idPrePedido)     
    //             cy.excluirContatoTelefone(faker, telefone)  
    //             cy.notificacao(mensagem.DadosSalvoSucesso);       
    //             });
                
    //             // ------ Criar operação Incluir Contato Telefone -----//
    //             describe('Criar operação Incluir Contato Telefone', () => {   
    //             cy.acessarPedido(idPrePedido)     
    //             cy.incluirContatoTelefone(faker)  
    //             cy.notificacao(mensagem.DadosSalvoSucesso);      
    //             });
                
    //             // ------- Criar operação Incluir Contato Fax -------//
    //             describe('Criar operação Incluir Contato Fax', () => {
    //             cy.acessarPedido(idPrePedido)    
    //             cy.incluirContatoFax(faker)     
    //             cy.notificacao(mensagem.DadosSalvoSucesso);      
    //             });       
                
    //             // ------- Criar operação Excluir Contato Fax -------//
    //             describe('Criar operação Excluir Contato Fax', () => {
    //             cy.acessarPedido(idPrePedido)    
    //             cy.incluirContatoFax(faker, fax)     
    //             cy.notificacao(mensagem.DadosSalvoSucesso);      
    //             }); 

    //             // -------- Criar operação Alterar Endereço Comercial --------//
    //             describe.skip('Criar operação Alterar Endereço Correspondência', () => { 
    //             cy.acessarPedido(idPrePedido)        
    //             cy.alterarEnderecoComercial(fakerBr)
    //             cy.notificacao(mensagem.DadosSalvoSucesso);      
    //             });  

    //             // -------- Criar operação Alterar Endereço Correspondência --------//
    //             describe.skip('Criar operação Incluir Endereço Correspondência', () => { 
    //             cy.acessarPedido(idPrePedido)        
    //             cy.incluirEnderecoCorrespondencia(fakerBr)
    //             cy.notificacao(mensagem.DadosSalvoSucesso);      
    //             });  

    //             // --------- Criar operacao Incluir Motorista -----//
    //             describe('Criar operacao Incluir Motorista', () => {
    //                 cy.acessarPedido(idPrePedido)
    //                 cy.incluirMotorista(fakerBr)
    //                 cy.notificacao(mensagem.DadosSalvoSucesso);
    //             });  
            
    //             // --------- Criar operacao Alterar Motorista -----//
    //             describe('Criar operacao Alterar Motorista', () => {        
    //                 cy.acessarPedido(idPrePedido)
    //                 cy.alterarMotorista(fakerBr, motorista)
    //                 cy.notificacao(mensagem.DadosSalvoSucesso);
    //             });    
            
        
            
    //     describe('Selecionar o sindicato e gerar valor e anexar documento no veiculo inválido', () => {
            
    //         // ------- Selecionar o sindicato responsável -------//        
    //         describe('Selecionar o sindicato responsável', () => {
    //             cy.acessarPedido(idPrePedido)          
    //             cy.get(path.generic.botaoConfirmar, {timeout: 10000}).trigger('mouseover').click({force: true})
                
    //             cy.get(path.generic.title, {timeout: 10000})
    //             .contains('Selecione o Ponto de Atendimento', {timeout: 10000})
                
    //             cy.get(path.checkoutAtendimentoPage.pontosAtendimento, {timeout: 10000}).clear().type(sindicato.sigla, {timeout: 10000})
    //             cy.get(path.checkoutAtendimentoPage.listaSindicatos, {timeout: 10000}).contains(sindicato.sigla, {timeout: 10000})
    //             .click({force: true})         
            
    //             // cy.xpath('/html/body/div[8]/div', {timeout: 10000})
    //             // .each((ele, index, list) => {
    //             //     let value = ele.text()
    //             //     if (value === 'FETAC-MG') 
    //             //     cy.wrap($ele).click();     
    //             // })
                
    //             cy.get(path.generic.tabela, {timeout: 30000})
    //             .then((ele) => {
                
    //             cy.log(ele.text())
                
    //                 cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Alteração de Dados do Transportador (Gratuito)')
    //                 cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$0.00')
    //                 cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '1')
    //                 cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$0.00')
                
                    
    //                 cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$0.00')          
                
    //             });
                
    //             cy.get(path.generic.botaoConfirmar).click({multiple: true});
    //         });
            
            
    //         // ------ Validação do pedido - Pedido rejeitado por não ter anexo na inclusão do veiculo BSG1253 -------//         
    //         describe('Validação e finalização do pre-pedido', () => {
    //         cy.acessarPedido(idPrePedido)  
    //         cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible')
    //         .click({force: true});
            
    //         cy.get(path.generic.title, {timeout: 10000})
    //         .contains('Selecione o Ponto de Atendimento', {timeout: 10000})      
            
    //         cy.get(path.checkoutAtendimentoPage.pontosAtendimento, {timeout: 10000}).clear().type(sindicato.sigla, {timeout: 10000})
    //         cy.get(path.checkoutAtendimentoPage.listaSindicatos, {timeout: 10000}).contains(sindicato.sigla, {timeout: 10000})
    //         .click({force: true})
            
    //         // cy.xpath('/html/body/div[8]/div', {timeout: 10000})
    //         // .each((ele, index, list) => {
    //         //     let value = ele.text()
    //         //     if (value === 'FETAC-MG') 
    //         //     cy.wrap($ele).click();     
    //         // })
            
    //         cy.get(path.generic.tabela, {timeout: 30000})        
    //         .then((ele) => {
                
    //             cy.log(ele.text())
                
    //             cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Alteração de Dados do Transportador (Gratuito)')
    //             cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$0.00')
    //             cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '1')
    //             cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$0.00')          
                
    //         })
            
    //         cy.get(path.generic.botaoConfirmar).click({multiple: true});
    //         cy.get('.q-stepper__tab--active > .q-stepper__label > .q-stepper__title')
    //         .should('have.text', 'Validação do Pedido');
            
    //         cy.get('.text-6').contains('Atendimento Válido', {timeout: 10000});       
            
    //         cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[3]/button[1]/span[2]/span', {timeout: 10000}).should('have.text', 'Confirmar').click({force: true})
            
    //         cy.get(path.generic.title, {timeout: 10000}).should('have.text', 'Confira o resumo do pedido');
            
    //         cy.get(path.generic.tabela, {timeout: 30000})        
    //         .then((ele) => {
                
    //             cy.log(ele.text())
                
    //             cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Alteração de Dados do Transportador (Gratuito)')
    //             cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$0.00')
    //             cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '1')
    //             cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$0.00')
                
    //             cy.get(path.generic.finalizar).click({force: true})
            
    //             cy.get('.q-ml-sm').should('have.text', 'Confirma a finalização do atendimento?')
    //             cy.get('.q-card__actions > :nth-child(1) > .q-btn__content').should('have.text', 'OK').click({force: true})                     
            
    //         })     
    //         });  
    //     });
    });
    
    
});