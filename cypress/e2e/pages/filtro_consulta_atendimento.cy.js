/// <reference types="Cypress"/>
import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";
import situacao from "../../support/SituacaoEnum";
var fakerBr = require('faker-br');  

let doc;

  let idPrePedido = '2071518'; 
  let idPrePedidoFinalizado = '2071119'; 
  const celular = '(21) 99999-9998';
  const telefone = '(11) 4338-0201';
  const fax = '(21) 8999-9999'
  const email = 'nailtonnivaldosoares@gmail.com'

  const transportador = {
    cpfCnpj: "489.622.799-91",
    nome: "TAC - PAULO ROBERTO GALINDO",
    rntrc: "000016329",
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
          cy.intercept('GET', 'https://sitcargaapitest/rntrc/PrePedido/listarpedidos**').as('listapedidos')           
          cy.intercept('GET', `https://sitcargaapitest/rntrc/PrePedido/**`).as('gridoperacao') 
          cy.login()
    });
    
    describe('Iniciando os testes para a criação do pedido', () => {


        

            it('Verificar se o filtro com o campo Numero atendimento está trazendo o atendimento correto', () => {                
                cy.wait('@listapedidos')
                cy.wait(2000)
                cy.get(path.atendimentoPage.numeroAtendimento).type(idPrePedidoFinalizado)
                cy.get(path.generic.botaoSubmit).click({ force: true })
                .wait('@gridoperacao')    
                cy.get(path.generic.idAtendimento, {timeout: 10000}).then((element)=> {          
                    idPrePedido = element.text().substring(1);
                    expect(element.text()).to.be.equal(`#${idPrePedido}`)
                })
                cy.get(path.generic.botaoVoltar).click({ force: true });

            });
            
        

        it('Testando o filtro da consulta com o CPF/CNPJ', () => {           
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
            cy.get(path.generic.botaoSubmit).click({ force: true }).wait(2000)
            .wait('@listapedidos')                      
            cy.get('.q-table tbody tr').each(($ele, index, list)=> {                
                if (cy.wrap($ele).find('td[class="q-td text-center"] ').contains(transportador.cpfCnpj)) {
                    
                    cy.wrap($ele).find('>td .q-btn').click()
                    
                    return false
                } else {
                    cy.log('Valor não encontrado:', cy.wrap($ele).find('td[class="q-td text-center"] ').invoke('text'))
                }                
            })
            cy.wait('@gridoperacao')
            cy.get('.q-mb-sm > strong', {timeout: 10000}).contains(transportador.cpfCnpj)
            cy.get(path.generic.botaoVoltar).click({force: true})
        });

        it('Testando o filtro da consulta com a Situação AGUARDANDO PAGAMENTO', () => {          
            cy.get(path.atendimentoPage.situacao).click({force: true})
            .get(path.generic.listaVirtual).contains(situacao.AGUARDANDOPAGAMENTO).click({force: true})
            cy.get(path.generic.botaoSubmit).click({ force: true }).wait(2000)
            .wait('@listapedidos')            
            cy.get('.q-table tbody tr').each(($ele, index, list)=> {   
               
                
             cy.wrap($ele).find('td[class="q-td text-center"] > span ').contains(situacao.AGUARDANDOPAGAMENTO)
                                 
                      
            })

        });

        it('Testando o filtro da consulta com a Situação EM CADASTRAMENTO', () => {
            
            cy.get(path.atendimentoPage.situacao).click({force: true})
            .get(path.generic.listaVirtual).contains(situacao.EMCADASTRAMENTO).click({force: true})
            cy.get(path.generic.botaoSubmit).click({ force: true }).wait(2000)
            .wait('@listapedidos')                        
            cy.get('.q-table tbody tr').each(($ele, index, list)=> {   
                
                cy.wrap($ele).find('td[class="q-td text-center"] > span ').contains(situacao.EMCADASTRAMENTO)                  
                           
            })
        });

        it('Testando o filtro da consulta com a Situação EM CANCELADO', () => {            
  
              cy.get(path.atendimentoPage.situacao).click({force: true})
              .get(path.generic.listaVirtual).contains(situacao.CANCELADO).click({force: true})
              cy.get(path.generic.botaoSubmit).click({ force: true }).wait(2000)
              .wait('@listapedidos')              
              cy.get('.q-table tbody tr').each(($ele, index, list)=> {   
                  
                  cy.wrap($ele).find('td[class="q-td text-center"] > span ').contains(situacao.CANCELADO)                  
                             
              })
  
          });

          it('Testando o filtro da consulta com a Situação PAGAMENTO EFETUADO', () => {            
              cy.intercept('GET', 'https://sitcargaapitest/rntrc/PrePedido/listarpedidos?pageSize=10&pageNumber=1&sortBy=idPedido&sortDesc=true&idPedido=&cpfCnpjTransportador=&situacao=PAG').as('pagamentoefetuado')  
              cy.get(path.atendimentoPage.situacao).click({force: true})
              .get(path.generic.listaVirtual).contains(situacao.PAGAMENTOEFETUADO).click({force: true})
              cy.get(path.generic.botaoSubmit).click({ force: true }).wait(2000)
              .wait('@pagamentoefetuado')
              cy.get('.q-table tbody tr').each(($ele, index, list)=> {   
                  
                cy.wrap($ele).find('td[class="q-td text-center"] > span ').contains(situacao.PAGAMENTOEFETUADO)                  
                           
            })
  
          });

          it('Testando o filtro da consulta com a Situação PEDIDO FINALIZADO', () => {            
  
              cy.get(path.atendimentoPage.situacao).click({force: true})
              .get(path.generic.listaVirtual).contains(situacao.PEDIDOFINALIZADO).click({force: true})
              cy.get(path.generic.botaoSubmit).click({ force: true }).wait(2000)
              .wait('@listapedidos')
              cy.get('.q-table tbody tr').each(($ele, index, list)=> {   
                  
                  cy.wrap($ele).find('td[class="q-td text-center"] > span ').contains(situacao.PEDIDOFINALIZADO)                  
                             
              })
  
          });

          it.skip('Testando o filtro da consulta com a Situação PEDIDO REJEITADO', () => {            
  
              cy.get(path.atendimentoPage.situacao).click({force: true})
              .get(path.generic.listaVirtual).contains(situacao.PEDIDOREJEITADO).click({force: true})
              cy.get(path.generic.botaoSubmit).click({ force: true }).wait(2000)
              cy.wait('@listapedidos')              
              cy.get('.q-table tbody tr').each(($ele, index, $list)=> {   
                  
                  cy.wrap($ele).find('td[class="q-td text-center"] > span ').contains(situacao.PEDIDOREJEITADO)                  
                             
              })
  
          });

          it('Testando o filtro da consulta com a data Situação', () => {            
  
              cy.get(path.atendimentoPage.dataInicioSituacao).type('26/09/2023')
              cy.get(path.atendimentoPage.dataFimSituacao).type('26/09/2023')
              cy.get(path.generic.botaoSubmit).click({ force: true }).wait(2000)
              .wait('@listapedidos')              
              cy.wait('@gridoperacao')
              cy.get('.q-table tbody tr').each(($ele, index, list)=> {                
                
                cy.wrap($ele).find('td[class="q-td text-center"] ').contains('26/09/2023') 
                    
            })         
  
          });
        
          it('Criar pedido e consultar se ele aparece em primeiro na lista', () => {
            
              // ------ Abrir Atendimento de Alteração de dados ------//
              describe('Criar pedido Alteração de dados TAC', () => {
                  //cy.log(`Testes sendo executados no ambiente de ${Cypress.env('ENVIRONMENT')}`)       
                  //Logar na página com o usuario         
                  //Clicar na opção Regularização RNTRC no menu lateral
                  cy.get(path.atendimentoPage.regularizacao, {timeout: 30000}).click({force: true});
                  //Selecionando o tipo de atendimento Renovação RNTRC
                  cy.atendimentosRegularizacao('Alteração de Dados')         
                  //
                  cy.get(path.criarPedidoPage.inputTipoTransportador)
                      .click({force: true})
                      .get(path.criarPedidoPage.tipoTransportador).contains(transportador.tipo, {timeout: 200}).click({force: true})        
                  cy.get(path.criarPedidoPage.cpfCnpj).type(transportador.cpfCnpj);
                  cy.get(path.generic.botaoSubmit).click({ force: true });
                  
                  cy.notificacao(mensagem.AtendimentoCriadoSucesso)    
                  
                  cy.get(path.generic.idAtendimento, {timeout: 10000}).then((element)=> {          
                      idPrePedido = element.text().substring(1);
                      expect(element.text()).to.be.equal(`#${idPrePedido}`)
                  })
                  
              });
  
              describe('Consultando pelo filtro se o pedido aparece na lista', () => {  
                  cy.get(path.generic.botaoVoltar).click({force: true}).wait(2000)                  
                  .wait('@listapedidos')                 
                  cy.get('.q-table tbody tr', ).each(($ele, index, list)=> {
                      if (index == 0) {
                          cy.wrap($ele).find('td[class="q-td text-left"]').contains(idPrePedido)
                          cy.wrap($ele).find('td[class="q-td text-center"]').contains(transportador.cpfCnpj)
                          cy.wrap($ele).find('td[class="q-td text-center"] > span').contains(situacao.EMCADASTRAMENTO)
                      } else {
                          cy.wrap($ele).find('td[class="q-td text-left"]').should('not.have.text', idPrePedido)                        
                      }    
                  })
              });

            
            
                describe('Cancelar o pedido', () => {
                    
                    cy.wait('@listapedidos')
                    cy.wait(2000)
                    
                    cy.get('.q-table tbody tr').each(($ele)=> {                
                        
                        if (cy.wrap($ele).find('td[class="q-td text-left"]').contains(idPrePedido)) {
                            
                            cy.wrap($ele).find('> td .q-btn').click()
                            
                            return false
                        } else {
                            cy.log('Valor não encontrado:', cy.wrap($ele).find('td[class="q-td text-center"] ').invoke('text'))
                        }                
                    })
                    
                    cy.get(path.generic.idAtendimento, {timeout: 10000}).then((element)=> {          
                        idPrePedido = element.text().substring(1);
                        expect(element.text()).to.be.equal(`#${idPrePedido}`)
                    })
                    cy.get(path.generic.botaoCancelar).click({force: true})
                    cy.get(path.generic.botaoOk).should('have.text', 'OK').click({force: true}).wait(2000)
                    .wait('@listapedidos')                    
                    cy.get('.q-table tbody tr').each(($ele)=> {                
                        
                        if (cy.wrap($ele).find('td[class="q-td text-left"]').contains(idPrePedido)) {
                            
                            cy.wrap($ele).find('td[class="q-td text-center"]').contains(situacao.CANCELADO)
                            
                            return false
                        } else {
                            cy.log('Valor não encontrado:', cy.wrap($ele).find('td[class="q-td text-center"] ').invoke('text'))
                        }                
                    })
                });        
            });        
    });
    
    
});