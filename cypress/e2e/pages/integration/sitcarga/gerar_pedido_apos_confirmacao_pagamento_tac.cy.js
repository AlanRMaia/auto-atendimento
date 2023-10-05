import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../../../selectors/path.sel.cy';
import mensagem from "../../../../support/mensagemAlertEnum";
import  urls  from "../../../../support/urls";
import  situacao  from "../../../../support/SituacaoEnum";
var fakerBr = require('faker-br');  


  let veiculoImplemento;
  let veiculoAutomotor;  
  let index = 0;
  let doc; 
  let idPrePedido = '2071163';
  const celular = '(21) 98878-7878';
  const telefone = '(12) 3937-6191';
  const fax = '(21) 9764-9386';
  const email = 'gghary@hjgay.com';

  const motorista = {
    cpf: '019.726.838-29',
    nome: 'TAC - DELMAR BATISTA DE OLIVEIRA',
    dataNascimento: '26/11/1978',
    cnh: '11111111111',
    categoria: 'C',    
  };

  let enderecoComercial = {
    cep: '12236670',
    logradouro: 'RUA JOSEFA ALBUQUERQUE DOS SANTOS',
    municipio: 'São José dos Campos',
    uf: 'SP',
    numero: '513',
    bairro: 'CIDADE MORUMBI',    
  };

  let enderecoResidencial = {
    cep: '12236670',
    logradouro: 'RUA JOSEFA ALBUQUERQUE DOS SANTOS',
    municipio: 'São José dos Campos',
    uf: 'SP',
    numero: '513',
    bairro: 'CIDADE MORUMBI',    
  };

let boleto = {
    codigoBarra : '',
    nossoNumero : '',
    valorPago: '',
    meioPagamento: '',
    dataEmissao: '',
    utilizacao: '',
    valorBoleto: '',
    situacao: ''    
  };
  const transportador = {
    cpfCnpj: "019.726.838-29",
    nome: "TAC - DELMAR BATISTA DE OLIVEIRA",
    rntrc: "000012862",
    situacao: "ATIVO",
    saldo: "R$ 0,00",
    sigla: "TAC",
    tipo: "Autônomo"
  };
  const sindicato = {
    perfil: "FETAC-MG - Master",
    sigla: "FETAC-MG",
    path: path.generic.perfilSitcarga.FETACMGMaster
  }  

describe('Gerar pedido após confirmação do pagamento pre-pedido Movimentação de forta', () => {
      beforeEach(() => {
        cy.fixture("data/doc/documentos").then((data) => {
            doc = data
          })

          cy.fixture("data/veiculos/veiculo_lista_implemento").then((implementosList) => {
            veiculoImplemento = implementosList[index]
            veiculoImplemento.crlv = doc.crlv
            veiculoImplemento.contrato = doc.contrato
          })
          
          cy.fixture("data/veiculos/veiculo_lista_automotor").then((automotorList) => {
            veiculoImplemento = automotorList[index]
            veiculoImplemento.crlv = doc.crlv
            veiculoImplemento.contrato = doc.contrato
          })  
          cy.intercept('GET', '**/validarpedido').as('validarpedido')
          cy.intercept('PUT', '**/finalizar').as('finalizarpedido')

          cy.viewport(1920, 1080);
          cy.login()
          //cy.acessarPedido(idPrePedido)
      });

  describe('criação do pedido e inclusão de operações', () => {
    it('Iniciando so testes', () => {
            
          describe('Iniciando testes Autoatendimento', () => {

            //------ Abrir Atendimento de Alteração de dados ------//
              describe('Criar pedido Alteração de dados TAC', () => {
                cy.log(`Testes sendo executados no ambiente de ${Cypress.env('ENVIRONMENT')}`)       
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
                
          //       //------ Criar operação Salvar transportador -----//
          //       // describe('Criar operação Salvar transportador', () => { 
          //       //   cy.operacaoTransportador(fakerBr, transportador.sigla)
          //       //   cy.notificacao(mensagem.TransportadorSucesso)      
          //       // });
                
                //-------- Criar operação Enviar documentos do tipo Identidade ------//              
                describe('Criar operação Enviar documentos do tipo Identidade', () => {  
                  cy.documentosIdentidade(doc.rg)
                  cy.notificacao(mensagem.ArquivoInclusoSucesso, doc.rg)      
                });
        
                // ------ Criar operação Incluir Contato Email ------//
                describe('Criar operação Incluir Contato Email', () => { 
                  cy.incluirContatoEmail(faker)
                  cy.notificacao(mensagem.DadosSalvoSucesso) 
                });
                
                // ------ Criar operação Excluir Contato Email ------//
                describe('Criar operação Excluir Contato Email', () => { 
                  cy.excluirContatoEmail(faker, email)
                  cy.notificacao(mensagem.DadosSalvoSucesso) 
                });
        
                
                // ------ Criar operação Excluir Contato Celular -----//
                describe('Criar operação Excluir Contato Celular', () => {         
                  cy.excluirContatoCelular(fakerBr, celular)   
                  cy.notificacao(mensagem.DadosSalvoSucesso);
                });
        
                // ------ Criar operação Excluir Contato Telefone -----//
                describe('Criar operação Excluir Contato Telefone', () => {         
                  cy.excluirContatoTelefone(faker, telefone)  
                  cy.notificacao(mensagem.DadosSalvoSucesso);       
                });
                
                // ------ Criar operação Incluir Contato Telefone -----//
                describe('Criar operação Incluir Contato Telefone', () => {   
                  cy.incluirContatoTelefone(faker)  
                  cy.notificacao(mensagem.DadosSalvoSucesso);      
                });
                
                // ------- Criar operação Incluir Contato Fax -------//
                describe('Criar operação Incluir Contato Fax', () => {
                  cy.incluirContatoFax(faker)     
                  cy.notificacao(mensagem.DadosSalvoSucesso);      
                });       
                
                // ------- Criar operação Excluir Contato Fax -------//
                describe('Criar operação Excluir Contato Fax', () => {
                  cy.excluirContatoFax(faker, fax)     
                  cy.notificacao(mensagem.DadosSalvoSucesso);      
                });              
        
              // --------- Criar operacao Incluir Motorista -----//
              describe('Criar operacao Incluir Motorista', () => {
                  cy.incluirMotorista(fakerBr, motorista.cpf)
                  cy.notificacao(mensagem.DadosSalvoSucesso);
              });  
              
          //     // // --------- Criar operacao Alterar Motorista -----//
          //     // describe('Criar operacao Alterar Motorista', () => {        
          //     //   cy.alterarMotorista(fakerBr, motorista)
          //     //   cy.notificacao(mensagem.DadosSalvoSucesso);
          //     // });   
              
          //      //   // -------- Criar operação Alterar Endereço Comercial --------//
          //     //   describe('Criar operação Alterar Endereço Comercial', () => { 
          //     //     cy.alterarEnderecoResidencial(fakerBr, enderecoComercial.cep )
          //     //     cy.notificacao(mensagem.DadosSalvoSucesso);      
          //     //   });  
        
                // -------- Criar operação Alterar Endereço Correspondência --------//
                describe('Criar operação Incluir Endereço Residencial', () => { 
                  cy.incluirEnderecoResidencial(fakerBr, enderecoResidencial.cep)
                  //cy.notificacao(mensagem.DadosSalvoSucesso);      
              }); 
              
          });
              
          describe('Selecionar o sindicato e gerar valor e anexar documento no veiculo inválido', () => {
              
            // ------- Selecionar o sindicato responsável -------//        
            describe('Selecionar o sindicato responsável', () => {
                cy.get(path.generic.botaoConfirmar, {timeout: 10000}).trigger('mouseover').click({force: true})
                
                cy.get(path.generic.title, {timeout: 10000})
                .contains('Selecione o Ponto de Atendimento', {timeout: 10000})
                cy.intercept('GET', 'https://sitcargaapitest/rntrc/PrePedido/listarentidadesdisponiveis**').as('listaSindicatos')
                cy.intercept('GET', '**/valor**').as('tabela')
                
                cy.get(path.checkoutAtendimentoPage.pontosAtendimento, {timeout: 10000}).clear().click({force: true})
                cy.wait('@listaSindicatos')
                cy.get(path.checkoutAtendimentoPage.listaSindicatos, {timeout: 10000}).contains(sindicato.sigla, {timeout: 10000})
                .click({force: true})          
                
                cy.wait('@tabela')
                
                cy.get(path.generic.tabela, {timeout: 30000})
                .then((ele) => {
                  
                  cy.log(ele.text())
                  
                    cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Alteração de Dados do Transportador (Gratuito)')
                    cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$0.00')
                    cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '1')
                    cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$0.00')
                
                    
                    cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$0.00')          
                  
                });
                
                cy.get(path.checkoutAtendimentoPage.botaoConfirmar1).click({force: true});
              

            });            
            
            // ------ Validação do pedido - Pedido rejeitado por não ter anexo na inclusão do veiculo BSG1253 -------//         
            describe('Validação e finalização do pre-pedido', () => {
              cy.wait('@validarpedido')
              cy.get(path.checkoutAtendimentoPage.botaoConfirmar2, {timeout: 10000}).should('be.visible').click({force: true});
              cy.get(path.generic.title, {timeout: 10000})
              .contains('Confira o resumo do pedido', {timeout: 10000})             
              
              cy.get(path.generic.tabela, {timeout: 30000})
                .then((ele) => {
                  
                  cy.log(ele.text())
                  
                    cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Alteração de Dados do Transportador (Gratuito)')
                    cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$0.00')
                    cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '1')
                    cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$0.00')
                
                    
                    cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$0.00')          
                  
                });
              
              cy.get(path.generic.finalizar).click({force: true});
              
              cy.get('.q-ml-sm').contains('Confirma a finalização do atendimento?')
              .get(path.generic.botaoOk).click({force: true})
                cy.wait('@finalizarpedido')
            });  
          });
    });
            
          it('Iniciando oa testes no Sitcarga', () => {
                
            describe('Consultando se o pagamento do boleto foi compensado', () => {
              
              cy.visit(urls.sitcargaInitial);
              cy.get('.cookie-message > :nth-child(1) > p', {timeout: 10000})
                .should('be.visible')
                .contains('Utilizamos cookies essenciais e tecnologias semelhantes para melhorar a sua experiência no nosso site. Para maiores informações, acesse nossa Política de Privacidade.')
                .get('#btnAccept').click({force: true})           
                cy.loginSitcarga()
                cy.get('.logo > img', {timeout: 30000}).should('have.attr','src', path.sitcargaHomePage.imgLogon)
                cy.get(':nth-child(1) > .m-r-sm').contains(usuario.nome.toUpperCase()) 
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
                cy.get('#situacao', {timeout: 20000}).contains(situacao.PAGAMENTOEFETUADO, {timeout: 20000})
                .get('#btn-gerar-pedido', {timeout:20000}).click({force: true})
                cy.get('#confirm-ok').click({force: true}) 
                cy.wait('@gerarpedido')
                //cy.get('.alert')
              
            });
          }); 
    });
  
});