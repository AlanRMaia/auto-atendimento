// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import urls from '../urls';
import path from '../../selectors/path.sel.cy';
import operacao from "../enum/OperacaoEnum";
import mensagem from "../enum/mensagemAlertEnum";
import formatarCPFCNPJ from '../util/formatarCPF';
import formatarPLACA from '../util/formatarPLACA';
const each = require('cypress-recurse');
require('cypress-xpath');

Cypress.Commands.add('getByData', (selector) => {
  return cy.get(`[data-test=${selector}]`);
});

Cypress.Commands.add('login', (usuario = Cypress.env('usuario')) => {
  // cy.session(usuario, () => {
    cy.intercept('POST', '/acesso/identity/login').as('loginacesso')
    cy.visit(urls.login, {timeout: 20000});
  
    cy.get(path.loginPage.cpf, {timeout:20000}).type(usuario.cpf);
    cy.get(path.loginPage.senha).type(usuario.senha);
    cy.get(path.generic.botaoSubmit).click({force: true}); 
    cy.wait('@loginacesso', {timeout: 90000})

    cy.get(path.generic.title, {timeout: 20000}).should('have.text', ' Consultar Atendimentos ')
  // },
  // {cacheAcrossSpecs: true}
  // )  
});

Cypress.Commands.add('consultaRNTRC', () => {
  cy.get(path.atendimentoPage.consultaRNTRC).click({force: true});
});

Cypress.Commands.add('getElementListXpath', (xpath, element) => {
  cy.xpath(xpath, {timeout: 10000}).each(($ele, index, list) => {
    let value = $ele.text()
    if (value === element) {
      cy.log('Elemento encontrado');
      cy.wrap($ele).click({force: true});
      cy.log('Valor atual', value);
    } else {
      cy.log('Elemento não encontrado');
      cy.log('Valor esperado', element);
      cy.log('Valor atual', value);
    }
  });
});

Cypress.Commands.add('getElementList', (selector, element) => {
  cy.get(selector).each(($ele, index, list) => {
    let value = $ele.text()
    if (value === element) {
      cy.log('Elemento encontrado');
      cy.wrap($ele).click({force: true});
      cy.log('Valor atual', value);
    } else {
      cy.log('Elemento não encontrado');
      cy.log('Valor esperado', element);
      cy.log('Valor atual', value);
    }
  });
});

Cypress.Commands.add('acessarPedido', (idPrePedido) => { 
  cy.intercept('GET', `/rntrc/PrePedido/${idPrePedido}`).as('acessarPrePedido')
  cy.get(path.atendimentoPage.numeroAtendimento).type(idPrePedido).get(path.generic.botaoSubmit).click({force: true})
  cy.wait('@acessarPrePedido')
  cy.get(path.generic.idAtendimento, {timeout: 20000}).should('have.text', `#${idPrePedido}`);
});



Cypress.Commands.add('anexarDocumentosVeiculo', (selectFile, veiculo) =>{  
  cy.intercept('POST', '**/imagem').as('salvarcrlv')
    cy.intercept('GET', '**?retornaImagens=true').as('salvarcontrato')
    cy.get(path.detalhamentoAtendimentoPage.operacaoVeiculoCard,{timeout: 20000}).should('be.visible')
    cy.document({timeout:20000}).then((doc) => {      
       let found;
        return new Cypress.Promise(resolve => {
          
          const element = doc.querySelector(path.detalhamentoAtendimentoPage.gridOperacoes).children
          resolve(element)
          cy.wrap(element).each((ele, index, list)=> {
            return new Cypress.Promise(resolve => {
              cy.wrap(ele).find(path.detalhamentoAtendimentoPage.descricaoOperacao, {timeout: 20000}).then((text) => {
                  let placa = text.text().substring(0, 7)
                  cy.log('valor da placa:',veiculo.placa)          
                  if (placa == veiculo.placa) {                  
                    found = index                  
                  }               
                })
                resolve(found)
            })          
          }) 
          cy.wrap(element).then((ele)=>{
            cy.wrap(ele[found]).find(path.detalhamentoAtendimentoPage.anexarDocumentoVeiculo, {timeout: 20000}).click({force: true})
          })    
        })
      })  
    
    cy.get(path.generic.title).contains('Documento do Veículo', {timeout: 20000})

    if (veiculo.propriedade != 'Arrendado') {
      cy.get(path.anexarDocumentoVeiculo.crlv, {timeout: 10000}).selectFile(selectFile.crlv, {force: true})
    } else {
      cy.get(path.anexarDocumentoVeiculo.contratoArrendamento, {timeout: 10000})
      .selectFile(selectFile.contrato)
      cy.get(path.anexarDocumentoVeiculo.crlv, {timeout: 10000}).selectFile(selectFile.crlv)          
    }
    cy.get(path.generic.botaoSubmit).click({force: true})
    cy.wait('@salvarcontrato')
    cy.wait('@salvarcrlv', {timeout: 10000})
  })

  Cypress.Commands.add('detalharOperacaoMotorista', (motorista) =>{     
    
      cy.get(path.detalhamentoAtendimentoPage.operacaoVeiculoCard,{timeout: 20000}).should('be.visible')
      cy.document({timeout:20000}).then((doc) => {      
         let found;
          return new Cypress.Promise(resolve => {
            
            const element = doc.querySelector(path.detalhamentoAtendimentoPage.gridOperacoes).children
            resolve(element)
            cy.wrap(element).each((ele, index, list)=> {
              return new Cypress.Promise(resolve => {
                cy.wrap(ele).find(path.detalhamentoAtendimentoPage.descricaoOperacao, {timeout: 20000}).then((text) => {
                    return text.text().substring(0, 7)
                    // cy.log('valor da placa:', motorista.cpf)          
                    // if (descricao == motorista.nome ) {                  
                    //   found = index                  
                    // }               
                  }).then(descricao => {
                    cy.wrap(ele).find('.text-subtitle1').then(title => {
                      //&&   && descricao == motorista.nome
                        if (title.text() == 'Motorista' && cy.wrap(descricao).contains(motorista.nome) ) {
                          found = index
                          cy.log('Indice:', found)
                        }
                    })
                  })
                  resolve(found)
              })          
            }) 
            cy.wrap(element).then((ele)=>{
              cy.wrap(ele[found]).click()
            })    
          })
        })  
      
      cy.get(path.generic.title).eq(0).contains('Motorista', {timeout: 20000})
      cy.get(path.generic.title).eq(1).contains('Inclusão')
        
      cy.get(path.operacaoMotorista.cpf).should('have.value', formatarCPFCNPJ(motorista.cpf))
      
      cy.get(path.generic.botaoVoltar).contains('Voltar').click({force: true})

      
    })

    Cypress.Commands.add('detalharOperacaoGestor', (gestor, tipoOperacao) =>{
     
        cy.get(path.detalhamentoAtendimentoPage.operacaoVeiculoCard,{timeout: 20000}).should('be.visible')
        cy.document({timeout:20000}).then((doc) => {      
           let found;
            return new Cypress.Promise(resolve => {
              
              const element = doc.querySelector(path.detalhamentoAtendimentoPage.gridOperacoes).children
              resolve(element)
              cy.wrap(element).each((ele, index, list)=> {
                return new Cypress.Promise(resolve => {
                  cy.wrap(ele).find(path.detalhamentoAtendimentoPage.descricaoOperacao, {timeout: 20000}).then((text) => {
                      return text.text()
                      // cy.log('valor da placa:', motorista.cpf)          
                      // if (descricao == motorista.nome ) {                  
                      //   found = index                  
                      // }               
                    }).then(descricao => {
                      cy.wrap(ele).find('.text-subtitle1').then(title => {
                        //&&   && descricao == motorista.nome
                        let textoDescricao = descricao;
                          if (title.text() == 'Gestor' &&  textoDescricao == `${gestor.nome}${formatarCPFCNPJ(gestor.cpfCnpj)}${gestor.cargo}`) {
                            found = index
                            cy.log('Indice:', found)
                          }
                      })
                    })
                    resolve(found)
                })          
              }) 
              cy.wrap(element).then((ele)=>{
                cy.wrap(ele[found]).click()
              })    
            })
          })  
        
        cy.get(path.generic.title).eq(0).contains('Gestor', {timeout: 20000})
        cy.get(path.generic.title).eq(1).contains(tipoOperacao)
          
        cy.get(path.operacaoGestor.cpfCnpj).should('have.value', formatarCPFCNPJ(gestor.cpfCnpj))
        
        cy.get(path.generic.botaoVoltar).contains('Voltar').click({force: true})
  
        
      })

      Cypress.Commands.add('detalharOperacaoResponsavelTecnico', (responsavelTecnico, tipoOperacao) =>{
     
        cy.get(path.detalhamentoAtendimentoPage.operacaoVeiculoCard,{timeout: 20000}).should('be.visible')
        cy.document({timeout:20000}).then((doc) => {      
           let found;
            return new Cypress.Promise(resolve => {
              
              const element = doc.querySelector(path.detalhamentoAtendimentoPage.gridOperacoes).children
              resolve(element)
              cy.wrap(element).each((ele, index, list)=> {
                return new Cypress.Promise(resolve => {
                  cy.wrap(ele).find(path.detalhamentoAtendimentoPage.descricaoOperacao, {timeout: 20000}).then((text) => {
                      return text.text()
                                    
                    }).then(descricao => {
                      cy.wrap(ele).find('.text-subtitle1').then(title => {
                        let textoDescricao = descricao;
                        cy.log('Titulo:',title.text())
                          if (title.text() == 'Responsável Técnico' &&  textoDescricao == `${responsavelTecnico.nome}${formatarCPFCNPJ(responsavelTecnico.cpf)}${responsavelTecnico.email}`) {
                            found = index
                            cy.log('Indice:', found)
                          }
                      })
                    })
                    resolve(found)
                })          
              }) 
              cy.wrap(element).then((ele)=>{
                cy.wrap(ele[found]).click()
              })    
            })
          })  
        
        cy.get(path.generic.title).eq(0).contains('Responsável Técnico', {timeout: 20000})
        cy.get(path.generic.title).eq(1).contains(tipoOperacao)
          
        cy.get(path.operacaoResponsavelTecnico.cpf).should('have.value', formatarCPFCNPJ(responsavelTecnico.cpf))
        
        cy.get(path.generic.botaoVoltar).contains('Voltar').click({force: true})
  
        
      })

Cypress.Commands.add('detalharOperacaoIncluirVeiculo', (veiculo, tipoOperacao) =>{
     
        cy.get(path.detalhamentoAtendimentoPage.operacaoVeiculoCard,{timeout: 20000}).should('be.visible')
        cy.document({timeout:20000}).then((doc) => {      
           let found;
            return new Cypress.Promise(resolve => {
              
              const element = doc.querySelector(path.detalhamentoAtendimentoPage.gridOperacoes).children
              resolve(element)
              cy.wrap(element).each((ele, index, list)=> {
                return new Cypress.Promise(resolve => {
                  cy.wrap(ele).find(path.detalhamentoAtendimentoPage.descricaoOperacao, {timeout: 20000}).then((text) => {
                      return text.text()
                                    
                    }).then(descricao => {
                      cy.wrap(ele).find('.text-subtitle1').then(title => {
                        let textoDescricao = descricao;
                        cy.log('Titulo:',title.text())
                          if (title.text() == 'Veículo' &&  textoDescricao == `${veiculo.placa}${veiculo.renavam}${veiculo.propriedade}`) {
                            found = index
                            cy.log('Indice:', found)
                          }
                      })
                    })
                    resolve(found)
                })          
              }) 
              cy.wrap(element).then((ele)=>{
                cy.wrap(ele[found]).click()
              })    
            })
          })  
        
        cy.get(path.generic.title).eq(0).contains('Veículo', {timeout: 20000})
        cy.get(path.generic.title).eq(1).contains(tipoOperacao)
          
        cy.get(path.operacaoVeiculo.placa).should('have.value', formatarPLACA(veiculo.placa))
        
        cy.get(path.generic.botaoVoltar).contains('Voltar').click({force: true})
  
        
      })

    Cypress.Commands.add('detalharOperacaoIncluirFilial', (filial, tipoOperacao) =>{
    
      cy.get(path.detalhamentoAtendimentoPage.operacaoVeiculoCard,{timeout: 20000}).should('be.visible')
      cy.document({timeout:20000}).then((doc) => {      
         let found;
          return new Cypress.Promise(resolve => {
            
            const element = doc.querySelector(path.detalhamentoAtendimentoPage.gridOperacoes).children
            resolve(element)
            cy.wrap(element).each((ele, index, list)=> {
              return new Cypress.Promise(resolve => {
                cy.wrap(ele).find(path.detalhamentoAtendimentoPage.descricaoOperacao, {timeout: 20000}).then((text) => {
                    return text.text()
                                  
                  }).then(descricao => {
                    cy.wrap(ele).find('.text-subtitle1').then(title => {
                      let textoDescricao = descricao;
                      cy.log('Titulo:',title.text())
                        if (title.text() == 'Veículo' &&  textoDescricao == `${filial.nome}${filial.cnpj}${filial.estado}`) {
                          found = index
                          cy.log('Indice:', found)
                        }
                    })
                  })
                  resolve(found)
              })          
            }) 
            cy.wrap(element).then((ele)=>{
              cy.wrap(ele[found]).click()
            })    
          })
        })  
      
      cy.get(path.generic.title).eq(0).contains('Filial', {timeout: 20000})
      cy.get(path.generic.title).eq(1).contains(tipoOperacao)
        
      cy.get(path.operacaoFilial.cnpj).should('have.value', formatarCPFCNPJ(filial.cnpj))
      
      cy.get(path.generic.botaoVoltar).contains('Voltar').click({force: true})

      
    })

    Cypress.Commands.add('detalharOperacaoTransportador', (transportador, tipoOperacao) =>{
    
      cy.get(path.detalhamentoAtendimentoPage.operacaoVeiculoCard,{timeout: 20000}).should('be.visible')
      cy.document({timeout:20000}).then((doc) => {      
         let found;
          return new Cypress.Promise(resolve => {
            
            const element = doc.querySelector(path.detalhamentoAtendimentoPage.gridOperacoes).children
            resolve(element)
            cy.wrap(element).each((ele, index, list)=> {
              return new Cypress.Promise(resolve => {
                if (typeof tipoOperacao !== "undefined") {
                  cy.wrap(ele).find('span.text-bold.q-pb-sm.card-op-label-orange').should('contain.text', tipoOperacao)
                  cy.log('tipoOperação:', tipoOperacao)  
                }                             

                cy.wrap(ele).find(path.detalhamentoAtendimentoPage.descricaoOperacao, {timeout: 20000}).then((text) => {
                    return text.text()
                                  
                  }).then(descricao => {
                    cy.wrap(ele).find('.text-subtitle1').then(title => {
                      let textoDescricao = descricao;
                      cy.log('Descricao:', textoDescricao)
                        if (title.text() == 'Transportador' &&  textoDescricao == `${transportador.nome}`) {
                          found = index
                          cy.log('Indice:', found)
                        }
                    })
                  })
                  resolve(found)
              })          
            }) 
            cy.wrap(element).then((ele)=>{              
              cy.wrap(ele[found]).click()
            })    
          })
        })  
      
      cy.get(path.generic.title).eq(0).contains('Transportador', {timeout: 20000})
        
      cy.get(path.operacaoTransportador.identidade).should('have.value', transportador.rg)
      
      cy.get(path.generic.botaoVoltar).contains('Voltar').click({force: true})

      
    })

    Cypress.Commands.add('desfazerOperacaoTransportador', (transportador, tipoOperacao) => {
    
      cy.get(path.detalhamentoAtendimentoPage.operacaoVeiculoCard,{timeout: 20000}).should('be.visible')
      cy.document({timeout:20000}).then((doc) => {      
         let found;
          return new Cypress.Promise(resolve => {
            
            const element = doc.querySelector(path.detalhamentoAtendimentoPage.gridOperacoes).children
            resolve(element)
            cy.wrap(element).each((ele, index, list)=> {
              return new Cypress.Promise(resolve => {
                if (typeof tipoOperacao !== "undefined") {
                  cy.wrap(ele).find('span.text-bold.q-pb-sm.card-op-label-orange').should('contain.text', tipoOperacao)
                  cy.log('tipoOperação:', tipoOperacao)  
                }                             

                cy.wrap(ele).find(path.detalhamentoAtendimentoPage.descricaoOperacao, {timeout: 20000}).then((text) => {
                    return text.text()
                                  
                  }).then(descricao => {
                    cy.wrap(ele).find('.text-subtitle1').then(title => {
                      let textoDescricao = descricao;
                      cy.log('Descricao:', textoDescricao)
                        if (title.text() == 'Transportador' &&  textoDescricao == `${transportador.nome}`) {
                          found = index
                          cy.log('Indice:', found)
                        }
                    })
                  })
                  resolve(found)
              })          
            }) 
            cy.wrap(element).then((ele)=>{              
              cy.wrap(ele[found]).find('div.col-2.self-end i').should('have.attr', 'title', 'Cancelar').click()
              cy.get('.q-ml-sm').should('contain.text', 'Confirma o cancelamento da operação?').get(path.generic.botaoOk).click()              
            })    
          })
        })
        cy.notificacao(mensagem.OperacaoCanceladaSucesso);      
        cy.get(path.detalhamentoAtendimentoPage.operacaoVeiculoCard,{timeout: 20000}).should('not.exist')       
      
    })

Cypress.Commands.add('notificacao', (mensagem, arquivo) => {
  if (typeof arquivo === "undefined") {
    cy.get(path.generic.mensagemNotificacao, {timeout: 20000}).should('be.visible').then((element) => {
      cy.get(path.generic.mensagemNotificacao).should('be.visible')
      expect(mensagem).to.be.contains(element.text())
      cy.get(path.generic.mensagemFechar).wait(2000).click({multiple: true});      
    }     
  )
  } else {
    const caminho = require('path')
    cy.get(path.generic.mensagemNotificacao, {timeout: 20000}).should('be.visible').then((element) => {
      cy.get(path.generic.mensagemNotificacao).should('be.visible')      
      expect(`Arquivo ${caminho.basename(arquivo)} ${mensagem}`).to.be.contains(element.text())
      cy.get(path.generic.mensagemFechar).wait(2000).click({multiple: true});      
    }     
  )
  }
  
})

Cypress.Commands.add('atendimentosRegularizacao', (atendimento) =>{
  cy.document({timeout: 10000}).wait(5000).then((doc) => {
          const element = doc.querySelector(path.regularizacaoPage.listaAtendimento).children
            cy.wrap(element).each((ele, index, list)=>  {
              cy.wrap(ele).find(path.regularizacaoPage.atendimento, {timeout: 10000}).then((text) => {
                let valor = text.text()
                cy.log('Atendimento:', atendimento)          
                if (valor === atendimento) {
                  cy.wrap(ele).find(path.generic.botaoSubmit).click({force: true}) 
                  return false                                  
                } else {
                  cy.log('Valor encontrado', valor)                  
                }                
              })             
              
            }) 
        })  
      
    })

    Cypress.Commands.add('gerarDadosResponsePrePedido', (prePedido, transportador) => {
    
      cy.writeFile('cypress/fixtures/intercept/gerarResponsePrePedido.json', {
        id: `${prePedido.id}`,
        tipo: prePedido.tipo, //ALT 
        tipoDescricao: prePedido.tipoDescricao , //tipo de pedido 'Cadastro, Alteração de dados ...'
        codSituacao: prePedido.codSituacao, //CAD
        situacao: prePedido.situacao, //EM CADASTRAMENTO
        cpfCnpjTransportador: transportador.dadosTransportador.cpfCnpj,
        transportador: transportador.dadosTransportador.nome,
        tipoTransportador: transportador.dadosTransportador.sigla, //TAC ETC CTC
        tipoTransportadorDescricao: transportador.dadosTransportador.tipo, //Autônomo Empresa Cooperativa
        usuarioNivelAbertura: 249809,
        motivoRejeicao: prePedido.motivoRejeicao,
        
      })
    })

    Cypress.Commands.add('gerarDadosResponseAcessarPrePedido', (prePedido, transportador) => {
    
      cy.writeFile('cypress/fixtures/intercept/gerarResponseAcessarPrePedido.json', {
        id: `${prePedido.id}`,
        tipo: prePedido.tipo, //ALT 
        tipoDescricao: prePedido.tipoDescricao , //tipo de pedido 'Cadastro, Alteração de dados ...'
        codSituacao: prePedido.codSituacao, //CAD
        situacao: prePedido.situacao, //EM CADASTRAMENTO
        cpfCnpjTransportador: transportador.dadosTransportador.cpfCnpj,
        transportador: transportador.dadosTransportador.nome,
        tipoTransportador: transportador.dadosTransportador.sigla, //TAC ETC CTC
        tipoTransportadorDescricao: transportador.dadosTransportador.tipo, //Autônomo Empresa Cooperativa
        usuarioNivelAbertura: 249809,
        motivoRejeicao: prePedido.motivoRejeicao,
        
      })
    })

    Cypress.Commands.add('gerarDadosOperacaoTransportador', (prePedido, transportador) => {
    
      cy.writeFile('cypress/fixtures/intercept/gerarDadosOperacaoTransportador.json', {
        nome: transportador.dadosTransportador.nome,
          declaracaoCapacidadeFinanceira: true,
          numeroIdentidade: transportador.dadosTransportador.rg,
          nomeFantasia: transportador.dadosTransportador.nomeFantasia,
          inscricaoEstadual: transportador.dadosTransportador.inscricaoEstadual,
          avisoEmailMovimentacaoFrota: true,
          registroJunta: transportador.dadosTransportador.registroJunta,
          inscricaoOCB: transportador.dadosTransportador.inscricaoOCB,
          transporteInternacional: true,
          adimplenteAssociacao: true,
          possuiAnexo: true,        
      })
    })
    
    Cypress.Commands.add('gerarDadosResponseOperacaoTransportadorPrePedido', (prePedido, transportador) => {
    
      cy.writeFile('cypress/fixtures/intercept/gerarDadosResponseOperacaoTransportadorPrePedido.json', {
        id: prePedido.id,
        tipo: prePedido.tipo, //ALT
        tipoDescricao: prePedido.tipoDescricao , //tipo de pedido 'Cadastro, Alteração de dados ...'
        codSituacao: prePedido.codSituacao, //CAD
        situacao: prePedido.situacao, //EM CADASTRAMENTO
        cpfCnpjTransportador: transportador.dadosTransportador.cpfCnpj,
        transportador: transportador.dadosTransportador.nome,
        tipoTransportador: transportador.dadosTransportador.sigla, //TAC ETC CTC
        tipoTransportadorDescricao: transportador.dadosTransportador.tipo, //Autônomo Empresa Cooperativa
        usuarioNivelAbertura: 249809,
        motivoRejeicao: prePedido.motivoRejeicao,
        transportadorPedido: {
          nome: transportador.dadosTransportador.nome,
          declaracaoCapacidadeFinanceira: true,
          numeroIdentidade: transportador.dadosTransportador.rg,
          nomeFantasia: transportador.dadosTransportador.nomeFantasia,
          inscricaoEstadual: transportador.dadosTransportador.inscricaoEstadual,
          avisoEmailMovimentacaoFrota: true,
          registroJunta: transportador.dadosTransportador.registroJunta,
          inscricaoOCB: transportador.dadosTransportador.inscricaoOCB,
          transporteInternacional: true,
          adimplenteAssociacao: true,
          possuiAnexo: true,
        },        
      })
    })        

    