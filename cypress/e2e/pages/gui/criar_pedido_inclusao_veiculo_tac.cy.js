/// <reference types="Cypress"/>
import path from '../../../selectors/path.sel.cy';
import mensagem from "../../../support/mensagemAlertEnum";
import urls from "../../../support/urls";
var fakerBr = require('faker-br');

  let veiculo01;
  let veiculo02;
  let veiculoImplemento;
  let veiculoAutomotor;
  let veiculo04;
  let veiculo05;
  let index = 0;
  let doc; 
  let idPrePedido = '2071357';
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
    cpfCnpj: "313.594.347-04",
    nome: "TAC - RENALDO ARRUDA DE ALMEIDA",
    rntrc: "000041330",
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
  

describe('Grupo de testes para inclusão de veículo TAC', () => {
  beforeEach(() => {
    cy.reload()
    cy.fixture("data/doc/documentos").then( (data) => {
      doc = data
    })
  
    cy.fixture("data/veiculos/BSG1253").then((bsg1253) => {
      veiculo01 = bsg1253
      veiculo01.crlv = doc.crlv
      veiculo01.contrato = doc.contrato
  
    })
  
    cy.fixture("data/veiculos/DAY7G42").then((day7g42) => {
      veiculo02 = day7g42
      veiculo02.crlv = doc.crlv
      veiculo02.contrato = doc.contrato
    })
  
    cy.fixture("data/veiculos/veiculo_lista_implemento").then(  (implementosList) => {
      veiculoImplemento =  implementosList[index]
      veiculoImplemento.crlv = doc.crlv
      veiculoImplemento.contrato = doc.contrato
    })
    
    cy.fixture("data/veiculos/veiculo_lista_automotor").then((automotorList) => {
      veiculoAutomotor = automotorList[index]
      veiculoAutomotor.crlv = doc.crlv
      veiculoAutomotor.contrato = doc.contrato
    })
  
    cy.fixture("data/veiculos/MCK8858").then((mck8858) => {
      veiculo04 = mck8858
      veiculo04.crlv = doc.crlv
      veiculo04.contrato = doc.contrato
    })
    
    cy.fixture("data/veiculos/GFV9E78").then((gfv9e78) => {
      veiculo05 = gfv9e78
      veiculo05.crlv = doc.crlv
      veiculo05.contrato = doc.contrato
    })
    
    cy.intercept('GET', '**/validarpedido').as('validarpedido')
    cy.intercept('POST', '**/gerarpagamentopedido').as('finalizarpedido')
    cy.intercept('GET', `**/rntrc/PrePedido/**`).as('gridoperacao') 

    cy.viewport(1920, 1080);
    cy.login()    
    
  });
  describe('Iniciando os testes para a criação do pedido e inclusão das operações', () => {
      
    it('Criação do pedido',() => {
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
       cy.get(path.generic.idAtendimento, {timeout: 10000}).then( async (element)=> {          
         idPrePedido = await element.text().substring(1);
         expect(element.text()).to.be.equal(`#${idPrePedido}`)
       })  

    });       
      
      //-------- Criar operação Incluir Veiculo SEMI-REBOQUE/Arrendado ------//
      it('Criar operação Incluir Veiculo AFF5514 SEMI-REBOQUE/Arrendado', () => {
        cy.acessarPedido(idPrePedido)
        cy.url().should('include', `detalhe`)
        cy.wait('@gridoperacao')
        cy.incluirVeiculo(veiculoImplemento)
        cy.notificacao(mensagem.VeiculoSalvoSucesso)
        cy.url().should('include', `detalhe`)
        cy.wait('@gridoperacao')
        cy.anexarDocumentosVeiculo(doc, veiculoImplemento )        
        cy.notificacao(mensagem.CRLVContratoSucesso)
        index++
      }); 

       // -------- Criar operação Incluir Veiculo SEMI-Implemento/Arrendado ------//
       it('Criar operação Incluir Veiculo AJS0258 Implemento/Arrendado', () => {
        cy.acessarPedido(idPrePedido)
        cy.url().should('include', `detalhe`)
        cy.wait('@gridoperacao')
        cy.incluirVeiculo(veiculoImplemento)
        cy.notificacao(mensagem.VeiculoSalvoSucesso)
        cy.url().should('include', `detalhe`)
        cy.wait('@gridoperacao')
        cy.anexarDocumentosVeiculo(doc, veiculoImplemento )        
        cy.notificacao(mensagem.CRLVContratoSucesso)      
        index++
      }); 

        // -------- Criar operação Incluir Veiculo SEMI-Implemento/Arrendado ------//
      it('Criar operação Incluir Veiculo Implemento/Arrendado', () => {
        cy.acessarPedido(idPrePedido)
        cy.url().should('include', `detalhe`)
        cy.wait('@gridoperacao')
        cy.incluirVeiculo(veiculoImplemento)
        cy.notificacao(mensagem.VeiculoSalvoSucesso)
        cy.url().should('include', `detalhe`)
        cy.wait('@gridoperacao')
        cy.anexarDocumentosVeiculo(doc, veiculoImplemento )        
        cy.notificacao(mensagem.CRLVContratoSucesso)             
        index++
      }); 

      //   // -------- Criar operação Incluir Veiculo SEMI-Implemento/Arrendado ------//
      // describe('Criar operação Incluir Veiculo Implemento/Arrendado', () => {
      //   cy.url().should('include', `detalhe`)
      //   cy.wait('@gridoperacao')
      //   cy.incluirVeiculo(veiculoImplemento)
      //   cy.notificacao(mensagem.VeiculoSalvoSucesso)
      //   cy.wait('@gridoperacao')
      //   cy.anexarDocumentosVeiculo(doc, veiculoImplemento )        
      //   cy.notificacao(mensagem.CRLVSucesso)      
      //   cy.notificacao(mensagem.ContratoArrendamentoSucesso)      
      //   index++
      // });

      //   // -------- Criar operação Incluir Veiculo SEMI-Implemento/Arrendado ------//
      // describe('Criar operação Incluir Veiculo Implemento/Arrendado', () => {
      //   cy.url().should('include', `detalhe`)
      //   cy.wait('@gridoperacao')
      //   cy.incluirVeiculo(veiculoImplemento)
      //   cy.notificacao(mensagem.VeiculoSalvoSucesso)
      //   cy.wait('@gridoperacao')
      //   cy.anexarDocumentosVeiculo(doc, veiculoImplemento )        
      //   cy.notificacao(mensagem.CRLVSucesso)      
      //   cy.notificacao(mensagem.ContratoArrendamentoSucesso)      
      //   index++
      // });
      
      //   // -------- Criar operação Incluir Veiculo SEMI-Implemento/Arrendado ------//
      // describe('Criar operação Incluir Veiculo Implemento/Arrendado', () => {
      //   cy.url().should('include', `detalhe`)
      //   cy.wait('@gridoperacao')
      //   cy.incluirVeiculo(veiculoImplemento)
      //   cy.notificacao(mensagem.VeiculoSalvoSucesso)
      //   cy.wait('@gridoperacao')
      //   cy.anexarDocumentosVeiculo(doc, veiculoImplemento )        
      //   cy.notificacao(mensagem.CRLVSucesso)      
      //   cy.notificacao(mensagem.ContratoArrendamentoSucesso)      
      //   index++
      // });

      // // -------- Criar operação Incluir Veiculo SEMI-Implemento/Arrendado ------//
      // describe('Criar operação Incluir Veiculo Implemento/Arrendado', () => {
      //   cy.url().should('include', `detalhe`)
      //   cy.wait('@gridoperacao')
      //   cy.incluirVeiculo(veiculoImplemento)
      //   cy.notificacao(mensagem.VeiculoSalvoSucesso)
      //   cy.wait('@gridoperacao')
      //   cy.anexarDocumentosVeiculo(doc, veiculoImplemento )        
      //   cy.notificacao(mensagem.CRLVSucesso)      
      //   cy.notificacao(mensagem.ContratoArrendamentoSucesso)      
      //   index++
      // });

      // // -------- Criar operação Incluir Veiculo SEMI-Implemento/Arrendado ------//
      // describe('Criar operação Incluir Veiculo Implemento/Arrendado', () => {
      //   cy.url().should('include', `detalhe`)
      //   cy.wait('@gridoperacao')
      //   cy.incluirVeiculo(veiculoImplemento)
      //   cy.notificacao(mensagem.VeiculoSalvoSucesso)
      //   cy.wait('@gridoperacao')
      //   cy.anexarDocumentosVeiculo(doc, veiculoImplemento )        
      //   cy.notificacao(mensagem.CRLVSucesso)      
      //   cy.notificacao(mensagem.ContratoArrendamentoSucesso)      
      //   index++
      // });
      
      // -------- Criar operação Incluir Veiculo Automotor/Arrendado ------//
      it('Criar operação Incluir Veiculo Automotor/Arrendado', () => {
        cy.acessarPedido(idPrePedido)
        cy.url().should('include', `detalhe`)
        veiculoImplemento.placa = 'GIZ7148'
        veiculoImplemento.renavam = '01146947299'
        veiculoImplemento.tipoVeiculo = 'Automotor'
        cy.wait('@gridoperacao')
        cy.incluirVeiculo(veiculoImplemento)
        cy.notificacao(mensagem.VeiculoSalvoSucesso)
        cy.wait('@gridoperacao')
        cy.anexarDocumentosVeiculo(doc, veiculoImplemento )
        cy.notificacao(mensagem.CRLVContratoSucesso) 
        index++
      });
      
      // -------- Criar operação Incluir Veiculo Automotor/Arrendado ------//
      it('Criar operação Incluir Veiculo Automotor/Arrendado', () => {
        cy.acessarPedido(idPrePedido)
        cy.url().should('include', `detalhe`)        
        veiculoImplemento.placa = 'FIM9923'
        veiculoImplemento.renavam = '01087459874'
        veiculoImplemento.tipoVeiculo = 'Automotor'
        cy.wait('@gridoperacao')
        cy.incluirVeiculo(veiculoImplemento)
        cy.notificacao(mensagem.VeiculoSalvoSucesso)
        cy.wait('@gridoperacao')
        cy.anexarDocumentosVeiculo(doc, veiculoImplemento )
        cy.notificacao(mensagem.CRLVContratoSucesso)      
        index++
      });

      // describe('Criar operação Incluir Veiculo Automotor/Arrendado', () => {
      //   cy.url().should('include', `detalhe`)
      //   cy.wait('@gridoperacao')
      //   cy.incluirVeiculo(veiculoAutomotor)
      //   cy.notificacao(mensagem.VeiculoSalvoSucesso)
      //   cy.wait('@gridoperacao')
      //   cy.anexarDocumentosVeiculo(doc, veiculoAutomotor)        
      //   cy.notificacao(mensagem.CRLVSucesso)      
      //   cy.notificacao(mensagem.ContratoArrendamentoSucesso)      
      //   index++
      // });

      // describe('Criar operação Incluir Veiculo Automotor/Arrendado', () => {
      //   cy.url().should('include', `detalhe`)
      //   cy.wait('@gridoperacao')
      //   cy.incluirVeiculo(veiculoAutomotor)
      //   cy.notificacao(mensagem.VeiculoSalvoSucesso)
      //   cy.wait('@gridoperacao')
      //   cy.anexarDocumentosVeiculo(doc, veiculoAutomotor )        
      //   cy.notificacao(mensagem.CRLVSucesso)      
      //   cy.notificacao(mensagem.ContratoArrendamentoSucesso)      
      //   index++
      // });
      // --------- Anexar crlv na operação de inclusão de veículo -------//        
      // it('Anexar crlv na operação de inclusão de veículo', () => {
      //   cy.acessarPedido(idPrePedido)

      //   cy.url().should('include', `detalhe`)
      //   cy.wait('@gridoperacao')
      //   cy.anexarDocumentosVeiculo(doc, veiculo01 )
      //   cy.notificacao(mensagem.CRLVContratoSucesso)
      // });

      //--------- Anexar crlv na operação de inclusão de veículo -------//        
      // it('Anexar crlv na operação de inclusão de veículo', () => {
      //   cy.acessarPedido(idPrePedido)

      //   cy.url().should('include', `detalhe`)
      //   cy.wait('@gridoperacao')
      //   cy.anexarDocumentosVeiculo(doc, veiculoImplemento )
      //   cy.notificacao(mensagem.CRLVContratoSucesso)
      // });
  });

  describe('Validação do pedido e inclusão do sindicato', () => {
      
      it('Validação de do Pedido', () => {
        cy.intercept('GET', `**/rntrc/PrePedido/listarentidadesdisponiveis?idPedido=${idPrePedido}`).as('listaSindicatos')
        cy.intercept('PUT', '**/entidade').as('entidadePUT')
        cy.intercept('POST', '**/entidade').as('entidadePOST')
        cy.intercept('GET', '**/valor**').as('tabela')   
        cy.acessarPedido(idPrePedido)
        cy.url().should('include', `detalhe`)
        cy.wait('@gridoperacao')
        
        cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible').click({force: true})
  
  
        cy.get(path.generic.title, {timeout: 10000})
        .contains('Escolha Ponto de Atendimento')
        
        cy.get(path.checkoutAtendimentoPage.pontosAtendimento, {timeout: 10000}).click()
          .type(sindicato.sigla).wait(5000)
          .get(path.checkoutAtendimentoPage.listaSindicatos, {timeout: 10000})
          .contains(sindicato.sigla, {timeout: 10000}).click()
          
          cy.wait('@gridoperacao') 
          cy.wait('@listaSindicatos') 
          cy.wait('@entidadePOST')           
          cy.wait('@tabela')           

        cy.get(path.generic.tabela, {timeout: 30000})
        .then((ele) => {
          
          cy.log(ele.text())            

            cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Inclusão de Automotor')
            cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$150.00')
            cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '2')
            cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$300.00') 
          
            cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-left`).should('have.text', 'Inclusão de Implemento')
            cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(2)`).should('have.text', 'R$150.00')
            cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-center`).should('have.text', '3')
            cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(4)`).should('have.text', 'R$450.00')            
            
            cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$750.00')          
          
        });
    
        cy.get(path.checkoutAtendimentoPage.botaoConfirmar1).click({force: true});
    
        cy.get('.q-stepper__tab--active > .q-stepper__label > .q-stepper__title')
        .contains('Validar Atendimento');
    
        cy.get('.text-6').contains('Atendimento Válido')
        cy.wait('@validarpedido')        
        cy.get(path.checkoutAtendimentoPage.botaoConfirmar2, {timeout: 10000}).click({force: true})
    
        cy.get(path.generic.title, {timeout: 10000}).contains('Confira o Resumo do Pedido');
    
        cy.get(path.generic.tabela, {timeout: 30000})
        .then((ele) => {
          
          cy.log(ele.text())
          
          cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Inclusão de Automotor')
          cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$150.00')
          cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '2')
          cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$300.00') 
        
          cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-left`).should('have.text', 'Inclusão de Implemento')
          cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(2)`).should('have.text', 'R$150.00')
          cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-center`).should('have.text', '3')
          cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(4)`).should('have.text', 'R$450.00')            
          
          cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$750.00')            
            
            cy.get(path.generic.email).type(fakerBr.internet.email())
    
            cy.get(path.generic.finalizar).click({force: true})
    
            cy.get('.q-ml-sm').should('have.text', 'Confirma a finalização do atendimento?')
            cy.get('.q-card__actions > :nth-child(1) > .q-btn__content').should('have.text', 'OK').click()
    
            // cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]', {timeout: 20000}).should('be.visible')
    
            // cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]', {timeout: 20000}).should('not.exist')*/
            cy.wait('@validarpedido')
            cy.wait('@finalizarpedido', {timeout: 120000})
            cy.notificacao(mensagem.AtendimentofinalizadoSucesso)
        });
          
      });

       
      it('Meio de pagamento', () => {
        cy.acessarPedido(idPrePedido)

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

});