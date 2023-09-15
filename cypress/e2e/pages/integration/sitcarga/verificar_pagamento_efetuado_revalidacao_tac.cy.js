import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../../../selectors/path.sel.cy';
import mensagem from "../../../../support/mensagemAlertEnum";
import urls from '../../../../support/urls';
var fakerBr = require('faker-br');

  let usuario;
  let veiculo01;
  let veiculo02;
  let veiculo03;
  let doc; 
  let cpfCnpj = '76699668668';
  let idPrePedido = '2071350';
  let imagem;
  
  const transportador = {
    cpfCnpj: "766.996.686-68",
    nome: "TAC - MARIA ALEIXO BARBOSA MARTINS",
    rntrc: "000012397 ",
    situacao: "VENCIDO",
    saldo: "R$ 0,00",
    sigla: "TAC",
    tipo: "Autônomo"
  };

  const sindicato = {
    perfil: "FETAC-MG - Master",
    sigla: "FETAC-MG",
    path: path.generic.perfilSitcarga.FETACMGMaster
  }
     
  


describe('Grupo de teste Atendimento Renovação TAC', () => {  

  beforeEach(() => { 

    cy.fixture("data/images/imagem").then((imagem) => {
      this.imagem = imagem
    })
    
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

    cy.fixture("data/veiculos/BSG1253").then((bsg1253) => {
      veiculo03 = bsg1253
      veiculo03.crlv = doc.crlv
      veiculo03.contrato = doc.contrato
    })
    

    cy.fixture('usuario').then((data) => {
      usuario = data;
    });
    cy.reload();  
    cy.viewport(1280, 720);
    cy.wait(2000)  
  });

  // ------ Abrir Atendimento de Renovação ------//
    it('Iniciando os testes', () => {
         //Logar na página com o usuario       
        cy.login(usuario.cpf, usuario.senha)       
        //Clicar na opção Regularização RNTRC no menu lateral
        cy.regularizacao();
        //Selecionando o tipo de atendimento Renovação RNTRC
        cy.get(path.regularizacaoPage.tipoAtendimentoRenovacao).click({force: true});
        //selecionar o tipo de transportador Autônomo para a abertura do pre-pedido
        cy.get(path.criarPedidoPage.inputTipoTransportador)
          .click({force: true})
          .get(
            path.criarPedidoPage.tipoTransportador,
            
          ).contains('Autônomo').click({force: true})
        //inclusão de do cpf no input e submeter a requisição
        cy.get(path.criarPedidoPage.cpfCnpj).type(transportador.cpfCnpj);
        cy.get(path.generic.botaoSubmit).click({ force: true });
        //validando a mensagem da notificação "Atendimento Criado com Sucesso!"
        cy.notificacao(mensagem.AtendimentoCriadoSucesso)    
        //Validando se foi aberto o pre-pedido, acessando ele e, verificando se no titulo o ID confere com o que foi gerado na abertura   
        cy.get(path.generic.idAtendimento, {timeout: 10000}).then((element)=> {          
          idPrePedido = element.text().substring(1);
          expect(element.text()).to.be.equal(`#${idPrePedido}`)      
        });

    });
      
      // ------ Criar operação Salvar transportador -----//
      it('Criar operação Salvar transportador', () => { 
        cy.login(usuario.cpf, usuario.senha) 
        cy.acessarPedido(idPrePedido)       
        cy.operacaoTransportador(fakerBr, transportador.sigla)
        cy.notificacao(mensagem.TransportadorSucesso)      
      });
      
      //-------- Criar operação Enviar documentos do tipo Identidade ------//              
      it('Criar operação Enviar documentos do tipo Identidade', () => {  
      cy.login(usuario.cpf, usuario.senha)      
      cy.acessarPedido(idPrePedido)      
      cy.documentosIdentidade(doc.rg)
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
      
      // -------- Criar operação Incluir Endereço Correspondência --------//
      it('Criar operação Incluir Endereço Correspondência', () => { 
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)        
        cy.incluirEnderecoCorrespondencia(fakerBr)
        cy.get(path.generic.mensagemFechar).click({froce: true});      
      });  

     // --------- Criar operacao Incluir Motorista -----//
     it('Criar operacao Incluir Motorista', () => {
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)
        cy.incluirMotorista(fakerBr)
        cy.get(path.generic.mensagemFechar).click({force: true});
     });     
      
      // -------- Criar operação Incluir Veiculo Automotor/Leasing e Automotor/arrendado -------//        
      it('Criar operação Incluir Veiculo Automotor/Leasing e Automotor/arrendado', () => {
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)          
        cy.incluirVeiculo(veiculo01)
        cy.get(path.generic.mensagemFechar).click({force: true});      
        
        cy.incluirVeiculo(veiculo02)
        cy.get(path.generic.mensagemFechar).click({force: true});  
        cy.anexarDocumentosVeiculo(doc, veiculo02 )
        cy.get(path.generic.mensagemFechar).click({force: true});  
      });
      
      // --------- Criar operação Incluir Veiculo Automotor/Arrendado ---------//       
      // it('Criar operação Incluir Veiculo Automotor/Arrendado', () => {
      //     cy.login(usuario.cpf, usuario.senha)
      //     cy.acessarPedido(idPrePedido)          
      //   cy.incluirVeiculo(veiculoDAY7G42)
      //   cy.get(path.generic.mensagemFechar).click();
      // });
      
      // -------- Criar operação Incluir Veiculo SEMI-REBOQUE/Arrendado ------//
      it('Criar operação Incluir Veiculo SEMI-REBOQUE/Arrendado', () => {
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)        
        cy.incluirVeiculo(veiculo03)
        cy.get(path.generic.mensagemFechar).click({force: true});      
      }); 
      
      // --------- Anexar crlv na operação de inclusão de veículo -------//        
      it('Anexar crlv na operação de inclusão de veículo', () => {
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)          
        cy.anexarDocumentosVeiculo(doc, veiculo01 )
        cy.get(path.generic.mensagemFechar).click({force: true});      
      });
      
      // ------- Selecionar o sindicato e gerar valor -------//        
      it('Selecionar o sindicato e gerar valor', () => {
            cy.login(usuario.cpf, usuario.senha)
            cy.acessarPedido(idPrePedido)          
          cy.get(path.generic.botaoConfirmar, {timeout: 10000}).trigger('mouseover').click({force: true})
          
          cy.get(path.generic.title, {timeout: 10000})
          .should('have.text', 'Selecione o Ponto de Atendimento').wait(2000)
          
          cy.get(path.confirmarAtendimento.pontosAtendimento, {timeout: 10000}).clear().type(sindicato.sigla).wait(2000)
          cy.xpath('/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span', {timeout: 10000}).should('have.text', sindicato.sigla)
          //TODO lista virtual
          .click({force: true})         

          // cy.xpath('/html/body/div[8]/div', {timeout: 10000})
          // .each((ele, index, list) => {
          //     let value = ele.text()
          //     if (value === 'FETAC-MG') 
          //     cy.wrap($ele).click();     
          // })
          
          cy.get(path.generic.tabela, {timeout: 30000})
          .then((ele) => {
            
            cy.log(ele.text())
            
              cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Inclusão de Automotor')
              cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$150.00')
              cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '2')
              cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$300.00')
          
              cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-left`).should('have.text', 'Revalidação de Transportador (Gratuito)')
              cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(2)`).should('have.text', 'R$0.00')
              cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-center`).should('have.text', '1')
              cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(4)`).should('have.text', 'R$0.00')
          
              cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-left`).should('have.text', 'Inclusão de Implemento')
              cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(2)`).should('have.text', 'R$150.00')
              cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-center`).should('have.text', '1')
              cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(4)`).should('have.text', 'R$150.00')
              cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$450.00')          
            
          });
          
          cy.get(path.generic.botaoConfirmar).click({multiple: true});
      });
      
      
      // ------ Validação do pedido - Pedido rejeitado por não ter anexo na inclusão do veiculo BSG1253 -------//         
      it('Validação do pedido - Pedido rejeitado por não ter anexo na inclusão do veiculo BSG1253', () => {
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)  
        cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible')
        .click({force: true});
        
        cy.get(path.generic.title, {timeout: 10000})
        .should('have.text', 'Selecione o Ponto de Atendimento').wait(2000)      

        cy.get(path.confirmarAtendimento.pontosAtendimento, {timeout: 10000}).clear().type('FETAC-MG').wait(2000)
        cy.xpath('/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span', {timeout: 10000}).should('have.text', 'FETAC-MG')
        .click({force: true})

        // cy.xpath('/html/body/div[8]/div', {timeout: 10000})
        // .each((ele, index, list) => {
        //     let value = ele.text()
        //     if (value === 'FETAC-MG') 
        //     cy.wrap($ele).click();     
        // })
        
        cy.get(path.generic.tabela, {timeout: 30000})        
        .then((ele) => {
          
          cy.log(ele.text())
          
            cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Inclusão de Automotor')
            cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$150.00')
            cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '2')
            cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$300.00')
        
            cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-left`).should('have.text', 'Revalidação de Transportador (Gratuito)')
            cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(2)`).should('have.text', 'R$0.00')
            cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-center`).should('have.text', '1')
            cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(4)`).should('have.text', 'R$0.00')
        
            cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-left`).should('have.text', 'Inclusão de Implemento')
            cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(2)`).should('have.text', 'R$150.00')
            cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-center`).should('have.text', '1')
            cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(4)`).should('have.text', 'R$150.00')
            cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$450.00')           
          
        })
        
        cy.get(path.generic.botaoConfirmar).click({multiple: true});
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
        
        cy.anexarDocumentosVeiculo(doc, veiculo03 )
        
        cy.get(path.generic.mensagemFechar, {timeout: 10000}).click({force: true}).wait(1000)
        cy.get(path.generic.mensagemFechar,{timeout: 10000}).click({force: true})
        
        cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible').click({multiple: true})        
        
        cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible').click({multiple: true})
        
        cy.get('.text-6').should('have.text', ' Atendimento Válido ')
        
        cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[3]/button[1]/span[2]/span', {timeout: 10000}).should('have.text', 'Confirmar').click({force: true})
        
        cy.get(path.generic.title, {timeout: 10000}).should('have.text', 'Confira o resumo do pedido');
        
        cy.get(path.generic.tabela, {timeout: 30000})        
        .then((ele) => {
          
          cy.log(ele.text())
          
            cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Inclusão de Automotor')
            cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$150.00')
            cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '2')
            cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$300.00')
        
            cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-left`).should('have.text', 'Revalidação de Transportador (Gratuito)')
            cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(2)`).should('have.text', 'R$0.00')
            cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-center`).should('have.text', '1')
            cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(4)`).should('have.text', 'R$0.00')
        
            cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-left`).should('have.text', 'Inclusão de Implemento')
            cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(2)`).should('have.text', 'R$150.00')
            cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-center`).should('have.text', '1')
            cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(4)`).should('have.text', 'R$150.00')
            cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$450.00')           

            cy.get(path.generic.email).type(faker.internet.email())

            cy.get(path.generic.finalizar).click({force: true})

            cy.get('.q-ml-sm').should('have.text', 'Confirma a finalização do atendimento?')
            // cy.get('.q-card__actions > :nth-child(1) > .q-btn__content').should('have.text', 'OK').click({force: true})

            // cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]', {timeout: 20000}).should('be.visible')

            // cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]', {timeout: 20000}).should('not.exist')          

        })     
      });  
      
       // ----- Finalizar o pedido ----//
    // it('Meio de pagamento', () => {
    //     cy.login(usuario.cpf, usuario.senha)
    //     cy.acessarPedido(idPrePedido)
    //     cy.get(path.generic.pagamento, {timeout: 20000}).click({force: true})

    //     cy.get(path.componentePagamento.pagamentoPix).should('have.text', ' Pagamento por PIX ')

    //     cy.get(path.componentePagamento.pagamentoBoleto).should('have.text', ' Pagamento por Boleto ')
        
    //     cy.get(path.componentePagamento.codigoPix, {timeout: 20000}).then(ele => {
    //       let value = ele.val()
    //       cy.log(value)
    //       expect(value).not.be.null
    //     })     

    //     cy.get(path.componentePagamento.codigoBarra).then(ele =>{
    //       let value = ele.val()
    //       cy.log(value)
    //       expect(ele).not.be.null
    //     })    
      
    // });
      describe.only('Iniciando o acesso ao Sitcarga', () => {
          it.only('Logando na página Sitcarga', () => {
            cy.visit(urls.sitcargaInitial);
            cy.get('.cookie-message > :nth-child(1) > p')
            .should('be.visible').contains('Utilizamos cookies essenciais e tecnologias semelhantes para melhorar a sua experiência no nosso site. Para maiores informações, acesse nossa Política de Privacidade.')
            .get('#btnAccept').click({force: true})

            cy.get('.middle-box > :nth-child(1) > .font-bold').should('have.text', 'FAÇA SEU LOGIN')
            cy.get('#CPF').type(usuario.cpf)
            cy.get('#Senha').type(usuario.senha)
            cy.get('#btn-login').click({force: true})

            cy.get('.logo > img', {timeout: 30000}).should('have.attr','src', path.sitcargaHomePage.imgLogon)
            cy.get(':nth-child(1) > .m-r-sm').contains('ALAN RODRIGUES MAIA') 
            cy.get('.dropdown-toggle').click({force: true})           
            .get('#niveis-usuario > :nth-child(10) > a').click({force: true})
            cy.get('.dropdown-toggle').should('have.text', 'FETAC-MG - Master ')

            cy.get('#side-menu > :nth-child(9) > [href="#"]').contains('Financeiro').click({force: true})
            cy.get('.active > .nav > :nth-child(2) > a').contains('Consultar Pagamentos').click({force: true})
            cy.get(':nth-child(2) > .iradio_square-green > .iCheck-helper').click({force: true})
            cy.get('#CPFCNPJ').type(cpfCnpj)
            cy.get('#btn-consultar').click()
            
          });
      });

});