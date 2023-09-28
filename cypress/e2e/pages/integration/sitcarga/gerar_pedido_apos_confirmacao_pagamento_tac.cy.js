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
  let idPrePedido = '2071122';
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
    cpfCnpj: "143.854.008-65",
    nome: "TAC - NAILTON NIVALDO SOARES",
    rntrc: "000010100",
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

          cy.viewport(1920, 1080);
          //cy.login()
      });

      describe.skip('criação do pedido e inclusão de operações', () => {
        it('Iniciando so testes', () => {
            
            describe('Criação do pedido', () => {
                cy.log(`Testes sendo executados no ambiente de ${Cypress.env('ENVIRONMENT')}`)
                 //Logar na página com o usuario 
                 cy.get(path.atendimentoPage.regularizacao, {timeout: 30000}).click({force: true});  
                 //Clicar na opção Regularização RNTRC no menu lateral       
                //cy.get(path.atendimentoPage.regularizacao, {timeout: 30000}).click({force: true});       
                 //Selecionando o tipo de atendimento Cadastro
                 cy.atendimentosRegularizacao('Gestão de Frota')
                 //selecionar o tipo de transportador Empresa para a abertura do pre-pedido
                 cy.get(path.criarPedidoPage.inputTipoTransportador).click({force: true})
                   .get(path.criarPedidoPage.tipoTransportador).contains(transportador.tipo).click({force: true})
                 //inclusão de do cpf no input e submeter a requisição
                 cy.get(path.criarPedidoPage.cpfCnpj).type(transportador.cpfCnpj);
                 cy.get(path.generic.botaoSubmit).click({ force: true });
                 //validando a mensagem da notificação "Atendimento Criado com Sucesso!"
                 cy.notificacao(mensagem.AtendimentoCriadoSucesso)    
                 //Validando se foi aberto o pre-pedido, acessando ele e, verificando se no titulo o ID confere com o que foi gerado na abertura   
                 cy.get(path.generic.idAtendimento, {timeout: 10000}).then((element)=> {          
                   idPrePedido = element.text().substring(1);
                   expect(element.text()).to.be.equal(`#${idPrePedido}`)
                 })  
          
              });
        
               // -------- Criar operação Incluir Veiculo SEMI-REBOQUE/Arrendado ------//
               describe('Criar operação Incluir Veiculo AFF5514 SEMI-REBOQUE/Arrendado', () => {
                cy.incluirVeiculo(veiculoImplemento)
                cy.notificacao(mensagem.VeiculoSalvoSucesso)
                cy.anexarDocumentosVeiculo(doc, veiculoImplemento )
                cy.notificacao(mensagem.CRLVSucesso)      
                index++
              }); 
        
               // -------- Criar operação Incluir Veiculo SEMI-Implemento/Arrendado ------//
               describe('Criar operação Incluir Veiculo AJS0258 Implemento/Arrendado', () => {
                 cy.incluirVeiculo(veiculoImplemento)
                 cy.notificacao(mensagem.VeiculoSalvoSucesso)
                 cy.anexarDocumentosVeiculo(doc, veiculoImplemento )
                 cy.notificacao(mensagem.CRLVSucesso)      
                 index++
              }); 
        
               // -------- Criar operação Incluir Veiculo Automotor/Arrendado ------//
               describe('Criar operação Incluir Veiculo Automotor/Arrendado', () => {
                cy.incluirVeiculo(veiculoAutomotor)
                cy.notificacao(mensagem.VeiculoSalvoSucesso)
                cy.anexarDocumentosVeiculo(doc, veiculoImplemento )
                cy.notificacao(mensagem.CRLVSucesso)      
                index++
              }); 
        
               // -------- Criar operação Incluir Veiculo Automotor/Arrendado ------//
               describe('Criar operação Incluir Veiculo Automotor/Arrendado', () => {
                 cy.incluirVeiculo(veiculoAutomotor)
                 cy.notificacao(mensagem.VeiculoSalvoSucesso)
                 cy.anexarDocumentosVeiculo(doc, veiculoImplemento )
                 cy.notificacao(mensagem.CRLVSucesso)      
                 index++
              }); 
        });    
          
      });

      describe.skip('Validação do pedido e inclusão do sindicato', () => {
      
        it('Validação de do Pedido', () => {
      
          cy.acessarPedido(idPrePedido)
      
          cy.get(path.generic.botaoConfirmar, {timeout: 20000}).click({force: true})        
      
          cy.get(path.generic.title, {timeout: 10000})
          .should('have.text', 'Selecione o Ponto de Atendimento').wait(2000)
      
          cy.get(path.checkoutAtendimentoPage.pontosAtendimento, {timeout: 10000}).clear().type(sindicato.sigla).wait(2000)
          cy.get(path.checkoutAtendimentoPage.listaSindicatos, {timeout: 10000}).should('have.text', sindicato.sigla)
          .click({force: true})      
          
          cy.get(path.generic.tabela, {timeout: 30000})
          .then((ele) => {
            
            cy.log(ele.text())
      
            cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Alteração de Dados')
            cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$0.00')
            cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '1')
            cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$0.00')  
            
              cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-left`).should('have.text', 'Inclusão de Automotor')
              cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(2)`).should('have.text', 'R$231.00')
              cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-center`).should('have.text', '1')
              cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(4)`).should('have.text', 'R$231.00')  
      
              cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-left`).should('have.text', 'Exclusão de Veículo')
              cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(2)`).should('have.text', 'R$0.00')
              cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-center`).should('have.text', '1')
              cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(4)`).should('have.text', 'R$0.00')
              
              cy.wrap(ele).get(`tbody>:nth-child(${4})>.text-left`).should('have.text', 'Inclusão de Implemento')
                cy.wrap(ele).get(`tbody>:nth-child(${4})>:nth-child(2)`).should('have.text', 'R$154.00')
                cy.wrap(ele).get(`tbody>:nth-child(${4})>.text-center`).should('have.text', '1')
                cy.wrap(ele).get(`tbody>:nth-child(${4})>:nth-child(4)`).should('have.text', 'R$154.00')
              
              cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$385.00')          
            
          });
      
          cy.get(path.generic.botaoConfirmar).click({force: true});
      
          cy.get('.q-stepper__tab--active > .q-stepper__label > .q-stepper__title')
          .should('have.text', 'Validação do Pedido');
      
          cy.get('.text-6').should('have.text', ' Atendimento Válido ')
      
          cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[3]/button[1]/span[2]/span', {timeout: 10000}).should('have.text', 'Confirmar').click({force: true})
      
          cy.get(path.generic.title, {timeout: 10000}).should('have.text', 'Confira o resumo do pedido');
      
          cy.get(path.generic.tabela, {timeout: 30000})
          .then((ele) => {
            
            cy.log(ele.text())
            
            cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Alteração de Dados')
            cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$0.00')
            cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '1')
            cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$0.00')  
            
              cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-left`).should('have.text', 'Inclusão de Automotor')
              cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(2)`).should('have.text', 'R$231.00')
              cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-center`).should('have.text', '1')
              cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(4)`).should('have.text', 'R$231.00')  
      
              cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-left`).should('have.text', 'Exclusão de Veículo')
              cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(2)`).should('have.text', 'R$0.00')
              cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-center`).should('have.text', '1')
              cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(4)`).should('have.text', 'R$0.00')
              
              cy.wrap(ele).get(`tbody>:nth-child(${4})>.text-left`).should('have.text', 'Inclusão de Implemento')
                cy.wrap(ele).get(`tbody>:nth-child(${4})>:nth-child(2)`).should('have.text', 'R$154.00')
                cy.wrap(ele).get(`tbody>:nth-child(${4})>.text-center`).should('have.text', '1')
                cy.wrap(ele).get(`tbody>:nth-child(${4})>:nth-child(4)`).should('have.text', 'R$154.00')
              
              cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$385.00')    
              
              cy.get(path.generic.email).type(fakerBr.internet.email())
      
              cy.get(path.generic.finalizar).click({force: true})
      
              cy.get('.q-ml-sm').should('have.text', 'Confirma a finalização do atendimento?')
              /*cy.get('.q-card__actions > :nth-child(1) > .q-btn__content').should('have.text', 'OK').click()
      
              cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]', {timeout: 20000}).should('be.visible')
      
              cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]', {timeout: 20000}).should('not.exist')*/
            
          });
            
        });
    });

    describe.skip('Finalização do pedido com a janela Meio pagamento', () => {
       
        it('Meio de pagamento', () => {
             //----- Meio de pagamento ------//           
            cy.get(path.generic.pagamento, {timeout: 20000}).click({force: true})
              
             cy.get(path.componentePagamento.pagamentoPix).should('have.text', ' Pagamento por PIX ')
        
             cy.get(path.componentePagamento.pagamentoBoleto).should('have.text', ' Pagamento por Boleto ')
              
             cy.get(path.componentePagamento.codigoPix, {timeout: 20000}).then(ele => {
               let value = ele.val()
               cy.log(value)
               expect(value).not.be.null
             })     
      
             cy.get(path.componentePagamento.codigoBarra).then(ele =>{
               let value = ele.val()
               cy.log(value)
               expect(ele).not.be.null
             })    
        });
     });
     describe.only('Iniciando oa testes no Sitcarga', () => {
         
          it('Consultando se o pagamento do boleto foi compensado', () => {
            cy.visit(urls.sitcargaInitial);
            cy.get('.cookie-message > :nth-child(1) > p')
            .should('be.visible')
            .contains('Utilizamos cookies essenciais e tecnologias semelhantes para melhorar a sua experiência no nosso site. Para maiores informações, acesse nossa Política de Privacidade.')
            .get('#btnAccept').click({force: true})           
            cy.loginSitcarga()
            cy.get('.logo > img', {timeout: 30000}).should('have.attr','src', path.sitcargaHomePage.imgLogon)
            cy.get(':nth-child(1) > .m-r-sm').contains(Cypress.env('usuario').nome.toUpperCase()) 
            cy.get('.dropdown-toggle').click({force: true})
            .get('#niveis-usuario > li > a').contains(sindicato.perfil).click({force: true}) 
            cy.get('.dropdown-toggle').should('have.text', `${sindicato.perfil} `)
            cy.get('#side-menu > li > a > span').contains('Auto Atendimento').click({force: true})
            .get('ul > li > a').contains('Acompanhamento').click({force: true})
            cy.intercept('POST', '/rntrc/pedido/consultar?gridName=grid').as('listaPrepedido')          
            cy.get('#CPFCNPJ').type(transportador.cpfCnpj)
            cy.get('#btn-consultar').click({force: true})  
            cy.wait('@listaPrepedido')
            cy.get('table > tbody > tr').each(($ele)=>{
               cy.get($ele).find('td').each(($td, index, list) => {
                let texto = $td.text()
                if (texto == idPrePedido) {
                  cy.log('valor encontrado', texto)
                  cy.wrap($ele).find('i[class="i i-search"]').click() 
                  return false
                }
                cy.log('Valor não encontrado:', texto)
               })                
            })
            
          });
     });
      
      
  });