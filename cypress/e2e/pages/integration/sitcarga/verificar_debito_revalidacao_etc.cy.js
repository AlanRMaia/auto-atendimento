/// <reference types="Cypress"/>
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
  let cpfCnpj = '02.672.529/0001-87';
  let idPrePedido = '2071488';
  let codigoBarra = '03399841145810000015580180001010794340000046200';
  let nossoNumero = ''
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
    cpfCnpj: "02.672.529/0001-87",
    nome: "ETC - PARQUE DE VAQUEJADA MARIA DO CARMO LTDA",
    rntrc: "007675513 ",
    situacao: "VENCIDO",
    saldo: "R$ 0,00",
    sigla: "ETC",
    tipo: "Empresa"
  };
  const sindicato = {
    perfil: "SETCAL  - Operador",
    sigla: "SETCAL",
    path: path.generic.perfilSitcarga.SETCALOperador
  }  

describe('Grupo de teste Atendimento Renovação ETC', () => {  

  beforeEach(() => { 
    
    cy.fixture("data/doc/documentos").then((data) => {
      doc = data
    })

    cy.fixture("data/veiculos/IAQ9412").then((iaq9412) => {
      veiculo01 = iaq9412
      veiculo01.crlv = doc.crlv
      veiculo01.contrato = doc.contrato

    })

    cy.fixture("data/veiculos/DDD4654").then((dda4654) => {
      veiculo02 = dda4654
      veiculo02.crlv = doc.crlv
      veiculo02.contrato = doc.contrato
    })

    cy.fixture("data/veiculos/BSG1253").then((bsg1253) => {
      veiculo03 = bsg1253
      veiculo03.crlv = doc.crlv
      veiculo03.contrato = doc.contrato
    })

    cy.intercept('GET', '**/validarpedido').as('validarpedido')
    cy.intercept('PUT', '**/finalizar').as('finalizarpedido')
    

    cy.fixture('usuario').then((data) => {
      usuario = data;
    });
    cy.reload();  
    cy.viewport(1920, 1080);
    cy.wait(2000)  
  });
    describe.only('Iniciando testes Autoatendimento', () => {  
        
    
    // ------ Abrir Atendimento de Renovação ------//
      it.only('Acessando a página e criando pedido', () => {
        cy.log(`${Cypress.env('ENVIRONMENT')}`)
          //Logar na página com o usuario       
          cy.login(usuario.cpf, usuario.senha)       
          //Clicar na opção Regularização RNTRC no menu lateral
          cy.get(path.atendimentoPage.regularizacao, {timeout: 30000}).click({force: true});
          //Selecionando o tipo de atendimento Renovação RNTRC
          cy.get(path.regularizacaoPage.tipoAtendimentoRenovacao).click({force: true});
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
        
        // ------ Criar operação Salvar transportador -----//
        it('Criar operação Salvar transportador', () => { 
          cy.login(usuario.cpf, usuario.senha) 
          cy.acessarPedido(idPrePedido)   
          
          cy.operacaoTransportador(faker, transportador.sigla, idPrePedido)
          cy.notificacao(mensagem.TransportadorSucesso)      
        });
        
        // ------ Criar operação Enviar documentos do tipo Identidade -----//              
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
        // it('Criar operação Incluir Endereço Correspondência', () => { 
        //     cy.login(usuario.cpf, usuario.senha)
        //     cy.acessarPedido(idPrePedido)        
        //   cy.incluirEnderecoCorrespondencia(fakerBr)
        //   //cy.get(path.generic.mensagemFechar).click({froce: true});      
        // });  

        // ------- Criar operação Incluir Gestor Sócio------// 
        it('Criar operação Incluir Gestor Sócio', () => {
          const gestor = {
            cpfCnpj: '09562140709',
            nome: 'Alan Maia',
            cargo: 'Sócio',
            telefone: '2188888888',
            email: 'texte#@teste.com',
            nascimento: '20/02/20000'
          }
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)               
        cy.incluirGestor(gestor, transportador.sigla)
        //cy.get(path.generic.mensagemFechar).click({force: true});      
      }); 
      
          // ------- Criar operação Incluir Gestor Responsável legal ------// 
        it('Criar operação Incluir Gestor Responsável legal', () => {
          const gestor = {
            cpfCnpj: '86992187023',
            nome: 'Alan Maia',
            cargo: 'Responsável Legal',
            telefone: '2188888888',
            email: 'texte#@teste.com',
            nascimento: '20/02/20000'
          }
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)               
        cy.incluirGestor(gestor, transportador.sigla)
        cy.get(path.generic.mensagemFechar).click({force: true});      
      });

      // ------- Criar operação Excluir Gestor Responsável legal------// 
      it('Criar operação Excluir Gestor Responsável legal', () => {
        const gestor = {
          cpfCnpj: '300.515.790-30',
            nome: 'Alan Maia',
            cargo: 'Responsável legal',
            telefone: '2188888888',
            email: 'texte#@teste.com',
            nascimento: '20/02/20000'
        }
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)               
      cy.excluirGestor(gestor, transportador.sigla)
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

        // -------- Criar operação Incluir Filial ------//
        it('Criar operação Incluir Filial', () => { 
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)        
        cy.incluirFilial(fakerBr)
        cy.get(path.generic.mensagemFechar).click({force: true});      
        });
        
        // ---------- Criar operação Incluir Responsável Técnico --------//
        it('Criar operação Incluir Responsável Técnico', () => { 
      
          const rt = {
            cpf: '09562140709',
            nome: 'Alan Maia',
            identidade: '2334667895',
            dataNascimento: '20/05/2005'

          }
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)        
        cy.incluirResponsavelTecnico(fakerBr, rt)
        cy.get(path.generic.mensagemFechar, {timeout:8000}).click({force: true});      
        }); 
        
        // ---------- Criar operação Excluir Responsável Técnico --------//
        it('Criar operação Excluir Responsável Técnico', () => { 
      
          const rt = {
            cpf: '18024629534',
            nome: 'DIVALDO JOSÉ MATOS DE LIMA',
            identidade: '1674903',
            dataNascimento: '20/05/2005'

          }
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)        
        cy.excluirResponsavelTecnico(fakerBr, rt)
        cy.get(path.generic.mensagemFechar, {timeout:8000}).click({force: true});      
        }); 

        
        
      });
      
      describe('Selecionar o sindicato e gerar valor e anexar documento no veiculo inválido', () => {
          
        // ------- Selecionar o sindicato e gerar valor -------//        
        it('Selecionar o sindicato e gerar valor', () => {
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
          
          cy.get(path.checkoutAtendimentoPage.pontosAtendimento, {timeout: 10000}).click({force: true}).wait(5000)
          cy.wait('@gridoperacao') 
          cy.wait('@listaSindicatos') 
          cy.get(path.checkoutAtendimentoPage.listaSindicatos, {timeout: 10000}).contains(sindicato.sigla, {timeout: 20000})
          .click({force: true}).wait(1000)
          .wait('@entidadePOST')         
          .wait('@tabela')           
            
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
            
            cy.get(path.checkoutAtendimentoPage.botaoConfirmar1).click({force: true});
        });
        
        
        // ------ Validação do pedido - Pedido rejeitado por não ter anexo na inclusão do veiculo BSG1253 -------//         
        it('Validação do pedido - Pedido rejeitado por não ter anexo na inclusão do veiculo BSG1253', () => {
            cy.login(usuario.cpf, usuario.senha)
            cy.acessarPedido(idPrePedido)  
          cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible')
          .click({force: true});
          
          cy.get(path.generic.title, {timeout: 10000})
          .should('have.text', 'Selecione o Ponto de Atendimento').wait(2000)      
  
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
          
          cy.get(path.checkoutAtendimentoPage.botaoConfirmar1).click({force: true});
          
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
          
          cy.get(path.checkoutAtendimentoPage.botaoConfirmar1, {timeout: 10000}).should('be.visible').click({force: true})
          
          cy.get('.text-6').should('have.text', ' Atendimento Válido ')
          
          cy.get(path.checkoutAtendimentoPage.botaoConfirmar1, {timeout: 10000}).click({force: true})
          
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
              cy.get('.q-card__actions > :nth-child(1) > .q-btn__content').should('have.text', 'OK').click({force: true})
  
              cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]', {timeout: 20000}).should('be.visible')
  
              cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]', {timeout: 20000}).should('not.exist')          
  
          })     
        });  
      });
        describe('Finalizar pedido', () => {
            
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
                  boleto.codigoBarra = value
                  cy.log(value)
                  expect(ele).not.be.null
                })    
              
            });
        });
      // ----- Iniciando o acesso ao Sitcarga ----- //
      describe('Iniciando o acesso ao Sitcarga', () => {
          it('Logando na página Sitcarga', () => {
            cy.visit(urls.sitcargaInitial);
            cy.get('.cookie-message > :nth-child(1) > p')
            .should('be.visible')
            .contains('Utilizamos cookies essenciais e tecnologias semelhantes para melhorar a sua experiência no nosso site. Para maiores informações, acesse nossa Política de Privacidade.')
            .get('#btnAccept').click({force: true})

            cy.get('.middle-box > :nth-child(1) > .font-bold').should('have.text', 'FAÇA SEU LOGIN')
            cy.get('#CPF').type(usuario.cpf)
            cy.get('#Senha').type(usuario.senha)
            cy.get('#btn-login').click({force: true})

            cy.get('.logo > img', {timeout: 30000}).should('have.attr','src', path.sitcargaHomePage.imgLogon)
            cy.get(':nth-child(1) > .m-r-sm').contains(usuario.nome.toUpperCase()) 
            cy.get('.dropdown-toggle').click({force: true})
            .get(sindicato.path).should('have.text', sindicato.perfil).click({force: true}) 
            //.get('#niveis-usuario > :nth-child(10) > a').click({force: true})
            cy.get('.dropdown-toggle').should('have.text', `${sindicato.perfil} `)
            cy.xpath('/html/body/div[2]/nav/div/ul/li[9]/a/span[1]', {timeout: 10000}).contains('Financeiro').click({force: true})
            cy.get('.active > .nav > :nth-child(2) > a').contains('Consultar Pagamentos').click({force: true})
            cy.get(':nth-child(1) > .col-lg-12 > .ibox > .ibox-title > h5').contains('Consulta de Pagamentos Os campos com (*) são obrigatórios')
            cy.get(path.sitcargaConsultaPagamentosPage.pesquisaTransportador).click({force: true})
            cy.get('#CPFCNPJ', {timeout: 30000} ).type(transportador.cpfCnpj)
            cy.get('#btn-consultar').click()

            cy.get('#div_dados_transportador > :nth-child(1) > .page-header', {timeout: 20000}).contains('Dados do Transportador')
            cy.get('#CpfCnpj').should('have.text', transportador.cpfCnpj)
            cy.get('#CodigoTipoTransportador').should('have.text', transportador.sigla)
            cy.get('#NomeTransportador').should('have.text',transportador.nome)
            cy.get('#Rntrc').should('have.text', transportador.rntrc)
            cy.get('#DescricaoSituacaoRNTRC').should('have.text', transportador.situacao)
            cy.get('#ValorSaldoCartaoPrePago').should('have.text', transportador.saldo)
            
            let valor01 = boleto.codigoBarra.substring(18, 20)
            let valor02 = boleto.codigoBarra.substring(21, 27)
            boleto.nossoNumero = `${valor01}${valor02}`
            cy.get('#grid > table').contains('td', boleto.nossoNumero)        
            
          });
      });

});