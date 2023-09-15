import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";

  let usuario;
  let cpfCnpj = '47788828000110'
  let idPrePedido = ''
  var fakerBr = require('faker-br');

  let veiculoIAQ9412 = {
    placa: 'IAQ9412',
    renavam: '00562957308',
    tipoVeiculo: 'Automotor',
    propriedade: 'Leasing',
    proprietario: ''
   }

   let veiculoDAY7G42 = {
     placa: 'DAY7G42',
     renavam: '00772718105',
     tipoVeiculo: 'Automotor',
     propriedade: 'Arrendado',
     proprietario: '09562140709'
    }      
  let veiculoBSG1253 = {
      placa: 'BSG1253',
      renavam: '00411395718',
      tipoVeiculo: 'Implemento',
      propriedade: 'Arrendado',
      proprietario: '07866722000172'
     }        

     let selectFileIAQ9412 = {
      crlv: 'D:/Imagens para teste/Apresentação .pdf',
      contratoArrendamento: 'D:/Imagens para teste/ALAN MAIA - INFORME REND 2022.pdf'
     }        
     let selectFileBSG1253 = {
      crlv: 'D:/Imagens para teste/Apresentação .pdf',
      contratoArrendamento: 'D:/Imagens para teste/ALAN MAIA - INFORME REND 2022.pdf'
     }       
     let selectFileDAY7G42 = {
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

describe('Grupo de teste Atendimento Cadastro CTC', () => {  
  // ------ Abrir Atendimento de Cadastro ------//
  it('Iniciando os testes', () => {
      
    //Logar na página com o usuario       
    cy.login(usuario.cpf, usuario.senha) 
    
    //Clicar na opção Regularização RNTRC no menu lateral
    cy.regularizacao();
    //Selecionando o tipo de atendimento Cadastro RNTRC
    cy.get(path.regularizacaoPage.tipoAtendimentoCadastro).click({force: true});
    //
    cy.get(path.criarPedidoPage.inputTipoTransportador).click({force: true})
        get(path.criarPedidoPage.tipoTransportador)
        .constains('Cooperativa').click({force: true})
    
    cy.get(path.criarPedidoPage.cpfCnpj).type(cpfCnpj);
    cy.get(path.generic.botaoSubmit).click({ force: true });
    
        cy.notificacao(mensagem.AtendimentoCriadoSucesso)
  
    cy.get(path.generic.idAtendimento).then((element)=> {          
      idPrePedido = element.text().substring(14,21);
      expect(element.text()).to.be.equal(` Atendimento #${idPrePedido}`)
    })
  
  });
  
  // ------ Criar operação Salvar transportador -----//
  it('Criar operação Salvar transportador', () => { 
  cy.login(usuario.cpf, usuario.senha) 
  cy.acessarPedido(idPrePedido)       
  cy.operacaoTransportador(faker, 'CTC')
  cy.notificacao(mensagem.TransportadorSucesso)
  });
  
  //-------- Criar operação Enviar documentos do tipo Identidade ------//             
  it('Criar operação Enviar documentos do tipo Identidade', () => {  
  cy.login(usuario.cpf, usuario.senha)      
  cy.acessarPedido(idPrePedido)      
  cy.documentosIdentidade('D:/Imagens para teste/Apresentação .pdf')
  cy.get(path.generic.mensagemFechar).click({force: true});      
  });
  
  // -------- Criar operação Enviar documento do tipo Registro RT ------//        
  it('Criar operação Enviar documento do tipo Registro RT', () => { 
  cy.login(usuario.cpf, usuario.senha)      
  cy.acessarPedido(idPrePedido)       
  cy.enviarDocumentosRT('D:/Imagens para teste/Apresentação .pdf')
  cy.get(path.generic.mensagemFechar).click({force: true});      
  });
  
  // ------ Criar operação Incluir Contato Email ------//
  it('Criar operação Incluir Contato Email', () => { 
  cy.login(usuario.cpf, usuario.senha)
  cy.acessarPedido(idPrePedido)       
  cy.incluirContatoEmail(faker)
  cy.get(path.generic.mensagemFechar).click({force: true}); 
  });
  
  // ------ Criar operação Incluir Contato Celular -----//
  it('Criar operação Incluir Contato Celular', () => {
  cy.login(usuario.cpf, usuario.senha)  
  cy.acessarPedido(idPrePedido)        
  cy.incluirContatoCelular(faker)   
  cy.get(path.generic.mensagemFechar).click({force: true});      
  });
  
  // ------ Criar operação Incluir Contato Telefone -----//
  it('Criar operação Incluir Contato Telefone', () => {   
    cy.login(usuario.cpf, usuario.senha)
    cy.acessarPedido(idPrePedido)     
  cy.incluirContatoTelefone(faker)  
  cy.get(path.generic.mensagemFechar).click({force: true});      
  });
  
  // ------- Criar operação Incluir Contato Fax -------//
  it('Criar operação Incluir Contato Fax', () => {
      cy.login(usuario.cpf, usuario.senha)      
    cy.acessarPedido(idPrePedido)    
    cy.incluirContatoFax(faker)     
    cy.get(path.generic.mensagemFechar).click({force: true});      
  }); 
  
  // ------- Criar operação Incluir Endereço Comercial -------//
  it('Criar operação Incluir Endereço Comercial', () => {
      cy.login(usuario.cpf, usuario.senha)
      cy.acessarPedido(idPrePedido)  
    cy.incluirEnderecoComercial(fakerBr)
    cy.get(path.generic.mensagemFechar).click({force: true});
  });        
  
  // -------- Criar operação Incluir Endereço Correspondência --------//
  it('Criar operação Incluir Endereço Correspondência', () => { 
      cy.login(usuario.cpf, usuario.senha)
      cy.acessarPedido(idPrePedido)        
    cy.incluirEnderecoCorrespondencia(fakerBr)
    cy.get(path.generic.mensagemFechar).click({force: true});      
  });
  
  // ------- Criar operação Incluir Gestor Responsável legal ------// 
  it('Criar operação Incluir Gestor Responsável legal', () => {
    cy.login(usuario.cpf, usuario.senha)
    cy.acessarPedido(idPrePedido)               
  cy.incluirGestor(fakerBr,'Responsável legal', 'CTC')
  cy.get(path.generic.mensagemFechar).click({force: true});      
});
  // -------- Criar operação Incluir Filial ------//
  it('Criar operação Incluir Filial', () => { 
      cy.login(usuario.cpf, usuario.senha)
      cy.acessarPedido(idPrePedido)        
    cy.incluirFilial(fakerBr)
    cy.get(path.generic.mensagemFechar).click({force: true});      
  });
  
  // ---------- Criar operação Incluir Responsável Técnico --------//
  it('Criar operação Incluir Responsável Técnico', () => { 
      cy.login(usuario.cpf, usuario.senha)
      cy.acessarPedido(idPrePedido)        
    cy.incluirResponsavelTecnico(fakerBr, faker)
    cy.get(path.generic.mensagemFechar, {timeout:8000}).click({force: true});      
  }); 
  
  // -------- Criar operação Incluir Veiculo Automotor/Leasing e Automotor/arrendado -------//        
  it('Criar operação Incluir Veiculo Automotor/Leasing e Automotor/arrendado', () => {
      cy.login(usuario.cpf, usuario.senha)
      cy.acessarPedido(idPrePedido)          
    cy.incluirVeiculo(veiculoIAQ9412)
    cy.get(path.generic.mensagemFechar).click({force: true});      
    
    cy.incluirVeiculo(veiculoDAY7G42)
    cy.get(path.generic.mensagemFechar).click({force: true});
    cy.anexarDocumentosVeiculo(selectFileDAY7G42, veiculoDAY7G42) 
    cy.get(path.generic.mensagemFechar).click({force: true});

  }); 
  
  // -------- Criar operação Incluir Veiculo SEMI-REBOQUE/Arrendado ------//
  it('Criar operação Incluir Veiculo SEMI-REBOQUE/Arrendado', () => {
      cy.login(usuario.cpf, usuario.senha)
      cy.acessarPedido(idPrePedido)        
    cy.incluirVeiculo(veiculoBSG1253)
    cy.get(path.generic.mensagemFechar).click({force: true});      
  }); 
  
  // --------- Anexar crlv na operação de inclusão de veículo -------//        
  it('Anexar crlv na operação de inclusão de veículo', () => {
      cy.login(usuario.cpf, usuario.senha)
      cy.acessarPedido(idPrePedido)          
    cy.anexarDocumentosVeiculo(selectFileIAQ9412, veiculoIAQ9412 )
    cy.get(path.generic.mensagemFechar).click({force: true});      
  });
  
  // ------- Selecionar o sindicato e gerar valor -------//        
  it('Selecionar o sindicato e gerar valor', () => {
      cy.login(usuario.cpf, usuario.senha)
      cy.acessarPedido(idPrePedido)          
    cy.get(path.generic.botaoConfirmar, {timeout: 10000}).trigger('mouseover').click({force: true})
    
    cy.get(path.generic.title, {timeout: 10000})
    .should('have.text', 'Selecione o Ponto de Atendimento').wait(2000)

    cy.get(path.confirmarAtendimento.pontosAtendimento, {timeout: 10000}).clear().type('OCERGS').wait(2000)
    cy.xpath('/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span', {timeout: 10000}).should('have.text', 'OCERGS')
    .click({force: true})
    
    // cy.get(path.confirmarAtendimento.pontosAtendimento, {timeout: 10000}).wait(2000)
    // .each((ele, index, list) => {
    //     let value = ele.text()
    //     if (value === 'SETCAL') 
    //     cy.wrap($ele).click();      
    
    // })
    
    cy.get(path.generic.tabela, {timeout: 30000})
    .then((ele) => {
      
      cy.log(ele.text())
      
        cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Inclusão de Automotor')
        cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$60.00')
        cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '2')
        cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$120.00')
    
        cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-left`).should('have.text', 'Cadastro de Transportador (Gratuito)')
        cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(2)`).should('have.text', 'R$0.00')
        cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-center`).should('have.text', '1')
        cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(4)`).should('have.text', 'R$0.00')
    
        cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-left`).should('have.text', 'Inclusão de Implemento')
        cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(2)`).should('have.text', 'R$60.00')
        cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-center`).should('have.text', '1')
        cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(4)`).should('have.text', 'R$60.00')
        cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$180.00')          
      
    });
    
    cy.get(path.generic.botaoConfirmar).click({force: true});
  });
  
  
  // ------ Validação do pedido - Pedido rejeitado por não ter anexo na inclusão do veiculo BSG1253 -------//         
  it('Validação do pedido - Pedido rejeitado por não ter anexo na inclusão do veiculo BSG1253', () => {
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)  
      cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible')
      .trigger('mouseover').click({force: true}).click();
      
      cy.get(path.generic.title, {timeout: 10000})
      .should('have.text', 'Selecione o Ponto de Atendimento').wait(2000)

      cy.get(path.confirmarAtendimento.pontosAtendimento, {timeout: 10000}).clear().type('OCERGS').wait(2000)
      cy.xpath('/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span', {timeout: 10000}).should('have.text', 'OCERGS')
      .click({force: true})

      // cy.get(path.confirmarAtendimento.pontosAtendimento, {timeout: 10000}).wait(2000)
      // .each((ele, index, list) => {
      //     let value = ele.text()
      //     if (value === 'SETCAL') 
      //     cy.wrap($ele).click();      
      
      // })
      
      cy.get(path.generic.tabela, {timeout: 30000})        
      .then((ele) => {
        
        cy.log(ele.text())
        
          cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Inclusão de Automotor')
          cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$60.00')
          cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '2')
          cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$120.00')
      
          cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-left`).should('have.text', 'Cadastro de Transportador (Gratuito)')
          cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(2)`).should('have.text', 'R$0.00')
          cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-center`).should('have.text', '1')
          cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(4)`).should('have.text', 'R$0.00')
      
          cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-left`).should('have.text', 'Inclusão de Implemento')
          cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(2)`).should('have.text', 'R$60.00')
          cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-center`).should('have.text', '1')
          cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(4)`).should('have.text', 'R$60.00')
          cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$180.00')           
        
      })
      
      cy.get(path.generic.botaoConfirmar).click({force: true});
      cy.get('.q-stepper__tab--active > .q-stepper__label > .q-stepper__title')
      .should('have.text', 'Validação do Pedido');
      
      cy.get('.text-6').should('have.text', ' Atendimento Inválido ');
      
      cy.get('.q-stepper__step-inner > .q-list > :nth-child(1) > .q-item__section > :nth-child(1)')
      .should('have.text', 'Imagem de Contrato de Arrendamento Obrigatória.')
      cy.get('.q-stepper__step-inner > .q-list > :nth-child(1) > .q-item__section > .q-item__label--caption')
      .should('have.text', 'É necessário realizar upload do contrato de arrendamento para a placa BSG1253')
      
      cy.get('.q-stepper__step-inner > .q-list > :nth-child(3) > .q-item__section > :nth-child(1)')
      .should('have.text', 'Imagem do CLRV Obrigatória.')
      cy.get('.q-stepper__step-inner > .q-list > :nth-child(3) > .q-item__section > .q-item__label--caption')
      .should('have.text', 'É necessário realizar upload do CLRV para a placa BSG1253')
      
      cy.get(path.generic.corrigir).click({force: true}) 
      
      cy.anexarDocumentosVeiculo(selectFileBSG1253, veiculoBSG1253 )
      
      cy.get(path.generic.mensagemFechar, {timeout: 10000}).click({force: true}).wait(1000)
      cy.get(path.generic.mensagemFechar,{timeout: 10000}).click({force: true})
      
      cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible').click({force: true})        
      
      cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible').click({force: true})
      
      cy.get('.text-6').should('have.text', ' Atendimento Válido ')
      
      cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[3]/button[1]/span[2]/span', {timeout: 10000}).should('have.text', 'Confirmar').click({force: true})
      
      cy.get(path.generic.title, {timeout: 10000}).should('have.text', 'Confira o resumo do pedido');
      
      cy.get(path.generic.tabela, {timeout: 30000})        
      .then((ele) => {
        
        cy.log(ele.text())
        
          cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Inclusão de Automotor')
          cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$60.00')
          cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '2')
          cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$120.00')
      
          cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-left`).should('have.text', 'Cadastro de Transportador (Gratuito)')
          cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(2)`).should('have.text', 'R$0.00')
          cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-center`).should('have.text', '1')
          cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(4)`).should('have.text', 'R$0.00')
      
          cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-left`).should('have.text', 'Inclusão de Implemento')
          cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(2)`).should('have.text', 'R$60.00')
          cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-center`).should('have.text', '1')
          cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(4)`).should('have.text', 'R$60.00')
          cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$180.00')   
          
          cy.get(path.generic.email).type(faker.internet.email())

            cy.get(path.generic.finalizar).click({force: true})

            cy.get('.q-ml-sm').should('have.text', 'Confirma a finalização do atendimento?')
            cy.get('.q-card__actions > :nth-child(1) > .q-btn__content').should('have.text', 'OK').click({force: true})

            cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]', {timeout: 20000}).should('be.visible')

            cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]', {timeout: 20000}).should('not.exist')
        
      })     
  });
  
  it('Meio de pagamento', () => {
    cy.login(usuario.cpf, usuario.senha)
    cy.acessarPedido(idPrePedido)
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