import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";

  let usuario;
  let cpfCnpj = '86263935804'
  let idPrePedido = '2071406'
  var fakerBr = require('faker-br');  
  
describe('Grupo de teste Atendimento Alteração de dados TAC', () => { 
    
    beforeEach(() => {
        cy.fixture('usuario').then((data) => {
          usuario = data;
        });
        cy.reload();  
        cy.viewport(1280, 720);
        cy.wait(2000)  
      });

  // ------ Abrir Atendimento de Alteração de dados ------//
    it('Iniciando os testes', () => {
      
        //Logar na página com o usuario       
        cy.login(usuario.cpf, usuario.senha) 
        
        //Clicar na opção Regularização RNTRC no menu lateral
        cy.regularizacao();
        //Selecionando o tipo de atendimento Renovação RNTRC
        cy.get(path.regularizacaoPage.tipoAtendimentoAlteracaoDados).click();
        //
        cy.get(path.criarPedidoAlteracaoDados.inputTransportador)
          .click({force: true})
          .xpath(
            path.criarPedidoAlteracaoDados.tipoTransportadorTAC,
            
          ).should('have.text', 'Autônomo').click()
        
        cy.get(path.criarPedidoAlteracaoDados.cpf).type(cpfCnpj);
        cy.get(path.generic.botaoSubmit).click({ force: true });
        
        cy.notificacao(mensagem.AtendimentoCriadoSucesso)    
      
        cy.get(path.generic.idAtendimento, {timeout: 10000}).then((element)=> {          
          idPrePedido = element.text().substring(14,21);
          expect(element.text()).to.be.equal(` Atendimento #${idPrePedido}`)
        })
      
    });
      
      // ------ Criar operação Salvar transportador -----//
      it('Criar operação Salvar transportador', () => { 
        cy.login(usuario.cpf, usuario.senha) 
        cy.acessarPedido(idPrePedido)       
        cy.salvarTransportador(fakerBr, 'TAC')
        cy.notificacao(mensagem.SalvarTransportador)      
      });
      
      //-------- Criar operação Enviar documentos do tipo Identidade ------//              
      it('Criar operação Enviar documentos do tipo Identidade', () => {  
      cy.login(usuario.cpf, usuario.senha)      
      cy.acessarPedido(idPrePedido)      
      cy.enviarDocumentosIdentidade('D:/Imagens para teste/Apresentação .pdf')
      cy.get(path.generic.mensagemFechar).click();      
      });

      // ------ Criar operação Incluir Contato Email ------//
      it('Criar operação Incluir Contato Email', () => { 
      cy.login(usuario.cpf, usuario.senha)
      cy.acessarPedido(idPrePedido)       
      cy.incluirContatoEmail(faker)
      cy.get(path.generic.mensagemFechar).click(); 
      });
      
      // ------ Criar operação Excluir Contato Celular -----//
      it('Criar operação Excluir Contato Celular', () => {
      cy.login(usuario.cpf, usuario.senha)  
      cy.acessarPedido(idPrePedido)        
      cy.excluirContatoCelular(fakerBr,'11952634251')   
      cy.get(path.generic.mensagemFechar).click();
      
      //TODO não está encontrando o titulo da página
      });

      // ------ Criar operação Excluir Contato Telefone -----//
      it('Criar operação Excluir Contato Telefone', () => {   
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)     
      cy.excluirContatoTelefone(fakerBr, '(11)2200-2200')  
      cy.get(path.generic.mensagemFechar).click();    
      //TODO  
      });
      
      // ------ Criar operação Incluir Contato Telefone -----//
      it.only('Criar operação Incluir Contato Telefone', () => {   
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)     
      cy.incluirContatoTelefone(faker)  
      cy.get(path.generic.mensagemFechar).click();      
      });
      
      // ------- Criar operação Incluir Contato Fax -------//
      it('Criar operação Incluir Contato Fax', () => {
        cy.login(usuario.cpf, usuario.senha)      
      cy.acessarPedido(idPrePedido)    
      cy.incluirContatoFax(faker)     
      cy.get(path.generic.mensagemFechar).click();      
      });       
      
      // -------- Criar operação Alterar Endereço Comercial --------//
      it('Criar operação Alterar Endereço Correspondência', () => { 
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)        
        cy.alterarEnderecoComercial(fakerBr)
        cy.get(path.generic.mensagemFechar).click();      
      });  

      // -------- Criar operação Alterar Endereço Correspondência --------//
      it('Criar operação Incluir Endereço Correspondência', () => { 
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)        
      cy.incluirEnderecoCorrespondencia(fakerBr)
      cy.get(path.generic.mensagemFechar).click();      
    });  

     // --------- Criar operacao Incluir Motorista -----//
     it('Criar operacao Incluir Motorista', () => {
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)
        cy.incluirMotorista(fakerBr)
        cy.get(path.generic.mensagemFechar).click();
     });  
     
     // --------- Criar operacao Alterar Motorista -----//
     it('Criar operacao Alterar Motorista', () => {
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)
      cy.alterarMotorista(fakerBr, '38489604860')
      cy.get(path.generic.mensagemFechar).click();
    });    
      
      
      // ------- Selecionar o sindicato responsável -------//        
      it('Selecionar o sindicato responsável', () => {
            cy.login(usuario.cpf, usuario.senha)
            cy.acessarPedido(idPrePedido)          
          cy.get(path.generic.botaoConfirmar, {timeout: 10000}).trigger('mouseover').click({force: true})
          
          cy.get(path.generic.title, {timeout: 10000})
          .should('have.text', 'Selecione o Ponto de Atendimento').wait(2000)
          
          cy.get(path.confirmarAtendimento.pontosAtendimento, {timeout: 10000}).clear()                        
          .type('FETAC-MG').xpath('/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span', {timeout: 10000}).should('have.text', 'FETAC-MG')
          .click({force: true})         

          // cy.xpath('/html/body/div[8]/div', {timeout: 10000})
          // .each((ele, index, list) => {
          //     let value = ele.text()
          //     if (value === 'FETAC-MG') 
          //     cy.wrap($ele).click();     
          // })
          
          cy.get(path.generic.tabela, {timeout: 10000})
          .then((ele) => {
            
            cy.log(ele.text())
            
              cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Alteração de Dados do Transportador (Gratuito)')
              cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$0.00')
              cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '1')
              cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$0.00')
          
              
              cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$0.00')          
            
          });
          
          cy.get(path.generic.botaoConfirmar).click({multiple: true});
      });
      
      
      // ------ Validação do pedido - Pedido rejeitado por não ter anexo na inclusão do veiculo BSG1253 -------//         
      it('Validação e finalização do pre-pedido', () => {
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)  
        cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible')
        .click({force: true});
        
        cy.get(path.generic.title, {timeout: 10000})
        .should('have.text', 'Selecione o Ponto de Atendimento').wait(2000)      

        cy.get(path.confirmarAtendimento.pontosAtendimento, {timeout: 10000}).clear()                        
        .type('FETAC-MG').xpath('/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span', {timeout: 10000}).should('have.text', 'FETAC-MG')
        .click({force: true})

        // cy.xpath('/html/body/div[8]/div', {timeout: 10000})
        // .each((ele, index, list) => {
        //     let value = ele.text()
        //     if (value === 'FETAC-MG') 
        //     cy.wrap($ele).click();     
        // })
        
        cy.get(path.generic.tabela, {timeout: 20000})        
        .then((ele) => {
          
          cy.log(ele.text())
          
          cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Alteração de Dados do Transportador (Gratuito)')
          cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$0.00')
          cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '1')
          cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$0.00')          
          
        })
        
        cy.get(path.generic.botaoConfirmar).click({multiple: true});
        cy.get('.q-stepper__tab--active > .q-stepper__label > .q-stepper__title')
        .should('have.text', 'Validação do Pedido');
        
        cy.get('.text-6').should('have.text', ' Atendimento Válido ');       
        
        cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[3]/button[1]/span[2]/span', {timeout: 10000}).should('have.text', 'Confirmar').click({force: true})
        
        cy.get(path.generic.title, {timeout: 10000}).should('have.text', 'Confira o resumo do pedido');
        
        cy.get(path.generic.tabela, {timeout: 20000})        
        .then((ele) => {
          
          cy.log(ele.text())
          
          cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Alteração de Dados do Transportador (Gratuito)')
          cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$0.00')
          cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '1')
          cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$0.00')
            
            cy.get(path.generic.finalizar).click()

            cy.get('.q-ml-sm').should('have.text', 'Confirma a finalização do atendimento?')
            cy.get('.q-card__actions > :nth-child(1) > .q-btn__content').should('have.text', 'OK').click()                     

        })     
      });  
      
    

});