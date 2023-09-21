import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";
var fakerBr = require('faker-br');

let usuario;
  let veiculo01;
  let veiculo02;
  let veiculo03;
  let veiculo04;
  let veiculo05;
  let doc; 
  let idPrePedido = '2071073';
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
    cpfCnpj: "13.579.271/0001-95",
    nome: "ETC - RAJAN TRANSPORTES COMÉRCIO E INDÚSTRIA LTDA",
    rntrc: "000013425",
    situacao: "ATIVO",
    saldo: "R$ 0,00",
    sigla: "ETC",
    tipo: "Empresa"
  };
  const sindicato = {
    perfil: "SETCAL  - Operador",
    sigla: "SETCAL",
    path: path.generic.perfilSitcarga.SETCALOperador
  }  
  
beforeEach(() => {
  cy.fixture("data/doc/documentos").then((data) => {
    doc = data
  })

  cy.fixture("data/veiculos/IAQ9412").then((iaq9412) => {
    veiculo01 = iaq9412
    veiculo01.crlv = doc.crlv
    veiculo01.contrato = doc.contrato

  })

  cy.fixture("data/veiculos/DAY7G42").then((day7g42) => {
    veiculo02 = day7g42
    veiculo02.crlv = doc.crlv
    veiculo02.contrato = doc.contrato
  })

  cy.fixture("data/veiculos/MCK8858").then((mck8858) => {
    veiculo03 = mck8858
    veiculo03.crlv = doc.crlv
    veiculo03.contrato = doc.contrato
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
  

  cy.fixture('usuario').then((data) => {
    usuario = data;
  });
  cy.reload();  
  cy.viewport(1920, 1080);
  cy.wait(2000) 
  
});
describe('Grupo de testes para inclusão de veículo ETC', () => {
  describe.only('Iniciando os testes para a criação do pedido e inclusão das operações', () => {
      
    it('Inclusão de veiculo Cadastro ativo placa próprio', () => {
      cy.log(`Testes sendo executados no ambiente de ${Cypress.env('ENVIRONMENT')}`)
       //Logar na página com o usuario       
       cy.login(usuario.cpf, usuario.senha)       
       //Clicar na opção Regularização RNTRC no menu lateral
       cy.regularizacao();
       //Selecionando o tipo de atendimento Cadastro
       cy.atendimentosRegularizacao('Gestão de Frota')
       //selecionar o tipo de transportador Empresa para a abertura do pre-pedido
       cy.get(path.criarPedidoPage.inputTipoTransportador)
         .click({force: true})
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
         // -------- Criar operação Incluir Veiculo Automotor/Leasing e Automotor/arrendado -------//        
        it.only('Criar operação Incluir Veiculo Automotor/Leasing e Automotor/arrendado', () => {
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)          
        cy.incluirVeiculo(veiculo01)
        cy.notificacao(mensagem.VeiculoSalvoSucesso)     
        
        cy.incluirVeiculo(veiculo02)
        cy.notificacao(mensagem.VeiculoSalvoSucesso)             
        cy.anexarDocumentosVeiculo(doc, veiculo02 )
        cy.notificacao(mensagem.CRLVSucesso)  
      });     
      
      // -------- Criar operação Incluir Veiculo SEMI-REBOQUE/Arrendado ------//
      it.only('Criar operação Incluir Veiculo SEMI-REBOQUE/Arrendado', () => {
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)        
        cy.incluirVeiculo(veiculo03)
        cy.notificacao(mensagem.VeiculoSalvoSucesso)      
      }); 
      
      // --------- Anexar crlv na operação de inclusão de veículo -------//        
      it.only('Anexar crlv na operação de inclusão de veículo', () => {
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)          
        cy.anexarDocumentosVeiculo(doc, veiculo01 )
        cy.notificacao(mensagem.CRLVSucesso)      
      });

      // --------- Anexar crlv na operação de inclusão de veículo -------//        
      it.only('Anexar crlv na operação de inclusão de veículo', () => {
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)          
      cy.anexarDocumentosVeiculo(doc, veiculo03 )
      cy.notificacao(mensagem.CRLVSucesso)      
    });
  });

  describe('Validação do pedido e inclusão do sindicato', () => {
      
      it('Validação de do Pedido', () => {
    
        cy.login(usuario.cpf, usuario.senha)
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

   describe('Finalização do pedido com a janela Meio pagamento', () => {
       
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

});