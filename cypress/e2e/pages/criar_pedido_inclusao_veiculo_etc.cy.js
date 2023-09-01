import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";

let usuario;
  let cpfCnpjATI = '54834007000138'
  let cpfCnpjVEN = '05060965000193' 
  let cpfCnpjEXC = '05341154000160' 
  let cpfCnpjPEN = '06970188000187' 
  let cpfCnpjSUS = '90710435000112' 

  let idPrePedido = '2071397'
  var fakerBr = require('faker-br');

  let veiculoIAQ9412 = {
    placa: 'IAQ9412',
    renavam: '00562957308',
    tipoVeiculo: 'Automotor',
    propriedade: 'Leasing',
    proprietario: ''
   }
   let veiculoCPJ3491EXC = {
    placa: 'CPJ3491',
        renavam: '00722870752',
        tipoVeiculo: 'Implemento',
        propriedade: 'Próprio',
        proprietario: '54834007000138'
   }

  let veiculoCDF1258ALT = {
    placa: 'CDF1258',
        renavam: '00918239168',
        tipoVeiculo: 'Automotor',
        propriedade: 'Próprio',
        proprietario: '54834007000138'
  }
  let veiculoAOS3628 = {
        placa: 'AOS3628',
        renavam: '00918239168',
        tipoVeiculo: 'Implemento',
        propriedade: 'Próprio',
        proprietario: '04886737000104'
  }          

     let selectFileIAQ9412 = {
      crlv: 'D:/Imagens para teste/Apresentação .pdf',
      contratoArrendamento: 'D:/Imagens para teste/ALAN MAIA - INFORME REND 2022.pdf'
     }        
     let selectFileCDF1258 = {
      crlv: 'D:/Imagens para teste/Apresentação .pdf',
      contratoArrendamento: 'D:/Imagens para teste/ALAN MAIA - INFORME REND 2022.pdf'
     }
     let selectFileCPJ3491 = {
      crlv: 'D:/Imagens para teste/Apresentação .pdf',
      contratoArrendamento: 'D:/Imagens para teste/ALAN MAIA - INFORME REND 2022.pdf'
     }
     let selectFileAOS3628 = {
      crlv: 'D:/Imagens para teste/Apresentação .pdf',
      contratoArrendamento: 'D:/Imagens para teste/ALAN MAIA - INFORME REND 2022.pdf'
     }         
  
  
beforeEach(() => {
  cy.fixture('usuario').then((data) => {
    usuario = data;
  });
  cy.reload();  
  cy.viewport(1280, 720);
  cy.wait(2000)
  
});
describe('Grupo de testes para inclusão de veículo ETC', () => {

    it('Inclusão de veiculo Cadastro ativo placa próprio', () => {
        cy.login(usuario.cpf, usuario.senha)
          //Clicar na opção Regularização RNTRC no menu lateral
        cy.regularizacao();
        //Selecionando o tipo de atendimento Cadastro RNTRC
        cy.get(path.regularizacaoPage.tipoAtendimentoInclusaoVeiculo).click({force: true});

        cy.get(path.criarPedidoCadastro.inputTransportador)
          .click({force: true})
          .getElementListXpath(
            '/html/body/div[8]/div/div[2]/div[2]/div[2]/div/span',
            'Empresa'
          ); 
        
          cy.get(path.criarPedidoInclusaoVeiculo.cnpj).type(cpfCnpjATI)
          cy.get(path.generic.botaoSubmit).click({ force: true });
        
            cy.notificacao(mensagem.AtendimentoCriadoSucesso)
      
        cy.get(path.generic.idAtendimento, {timeout: 20000}).then((element)=> {          
          idPrePedido = element.text().substring(14,21);
          expect(element.text()).to.be.equal(` Atendimento #${idPrePedido}`)
        })           

    });
         //----- inclusão de veiculo AOS3628 ------//

    it('inclusão de veiculo AOS3628', () =>  {
        cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)
         //----- inclusão de veiculo AOS3628 ------//
         cy.incluirVeiculo(veiculoAOS3628)
         cy.notificacao(mensagem.VeiculoSalvoSucesso)
         //----- Anexar documentos -----//
        cy.anexarDocumentosVeiculo(selectFileAOS3628, veiculoAOS3628)
        cy.get(path.generic.mensagemFechar, {timeout: 5000}).click({force: true})
    })
        //----- inclusão de veiculo IAQ9412 -----//

    it('inclusão de veiculo IAQ9412', () => {
        cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)
        //----- inclusão de veiculo IAQ9412 -----//
        cy.incluirVeiculo(veiculoIAQ9412)
        cy.notificacao(mensagem.VeiculoSalvoSucesso)
        //----- Anexar documetnos -----//
        cy.anexarDocumentosVeiculo(selectFileIAQ9412, veiculoIAQ9412)
        cy.get(path.generic.mensagemFechar, {timeout: 5000}).click({force: true})
    })
        //----- Exclusão de veiculo CPJ3491 -----//

    it('Exclusão de veiculo CPJ3491', () => {
        cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)
        //----- Exclusão de veiculo CPJ3491 -----//
        cy.excluirVeiculo(veiculoCPJ3491EXC)
        cy.notificacao(mensagem.VeiculoExcluidoSucesso)
        cy.get(path.generic.mensagemFechar, {timeout: 5000}).click({force: true})
    })
        //----- ALteração de veiculo CDF1258 -----//

    it('Alteração de veiculo CDF1258', () => {
        cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)
        //----- ALteração de veiculo CDF1258 -----//
        cy.alterarVeiculo(veiculoCDF1258ALT)
        cy.notificacao(mensagem.VeiculoAlteracaoSucesso)
        //----- Anexar documetnos -----//
        cy.anexarDocumentosVeiculo(selectFileCDF1258, veiculoCDF1258ALT)
        cy.notificacao(mensagem.CRLVSucesso)
    })

    it('Validação de do Pedido', () => {

      cy.login(usuario.cpf, usuario.senha)
      cy.acessarPedido(idPrePedido)

      cy.get(path.generic.botaoConfirmar, {timeout: 20000}).click({force: true})        

      cy.get(path.generic.title, {timeout: 10000})
      .should('have.text', 'Selecione o Ponto de Atendimento').wait(2000)

      cy.get(path.confirmarAtendimento.pontosAtendimento, {timeout: 10000}).clear()                        
      .type('SETCAL').xpath('/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span', {timeout: 10000}).should('have.text', 'SETCAL ')
      .click({force: true})      
      
      cy.get(path.generic.tabela, {timeout: 10000})
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

      cy.get(path.generic.tabela, {timeout: 10000})
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
   

    // it('Meio de pagamento', () => {
    //      //----- Meio de pagamento ------//           
    //     cy.get(path.generic.pagamento, {timeout: 20000}).click({force: true})
         
    //      cy.get(path.componentePagamento.pagamentoPix).should('have.text', ' Pagamento por PIX ')
    
    //      cy.get(path.componentePagamento.pagamentoBoleto).should('have.text', ' Pagamento por Boleto ')
         
    //      cy.get(path.componentePagamento.codigoPix, {timeout: 20000}).then(ele => {
    //        let value = ele.val()
    //        cy.log(value)
    //        expect(value).not.be.null
    //      })     
 
    //      cy.get(path.componentePagamento.codigoBarra).then(ele =>{
    //        let value = ele.val()
    //        cy.log(value)
    //        expect(ele).not.be.null
    //      })    
    // });
});