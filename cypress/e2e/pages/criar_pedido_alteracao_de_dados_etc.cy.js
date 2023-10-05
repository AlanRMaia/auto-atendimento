import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";
var fakerBr = require('faker-br');  

  let usuario;
  let veiculo01;
  let veiculo02;
  let veiculo03;
  let doc; 
  let idPrePedido = '2071477'; 
  
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
  
  
describe('Grupo de teste Atendimento Alteração de dados ETC', () => { 
    
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
    
        cy.fixture("data/veiculos/BSG1253").then((bsg1253) => {
          veiculo03 = bsg1253
          veiculo03.crlv = doc.crlv
          veiculo03.contrato = doc.contrato
        })
        
    
        cy.fixture('usuario').then((data) => {
          usuario = data;
        });

        cy.intercept('GET', '**/validarpedido').as('validarpedido')
          cy.intercept('PUT', '**/finalizar').as('finalizarpedido')
        cy.reload();  
        cy.viewport(1920, 1080);
        cy.wait(2000)  
      });
describe('Iniciando testes Autoatendimento', () => {
    
  // ------ Abrir Atendimento de Alteração de dados ------//
    it.only('Criar pedido Alteração de dados ETC', () => {
      
        //Logar na página com o usuario       
        cy.login(usuario.cpf, usuario.senha)        
        //Clicar na opção Regularização RNTRC no menu lateral
        cy.get(path.atendimentoPage.regularizacao, {timeout: 30000}).click({force: true});;
        //Selecionando o tipo de atendimento Renovação RNTRC
        cy.atendimentosRegularizacao('Alteração de Dados')                   
        
        //
        cy.get(path.criarPedidoPage.inputTipoTransportador)
          .click({force: true})
          .get(path.criarPedidoPage.tipoTransportador).contains(transportador.tipo).click({force: true})        
        cy.get(path.criarPedidoPage.cpfCnpj).type(transportador.cpfCnpj);
        cy.get(path.generic.botaoSubmit).click({ force: true });
        
        cy.notificacao(mensagem.AtendimentoCriadoSucesso)    
      
        cy.get(path.generic.idAtendimento, {timeout: 10000}).then((element)=> {          
          idPrePedido = element.text().substring(1);
          expect(element.text()).to.be.equal(`#${idPrePedido}`)
        })      
    });
      
      // ------ Criar operação Salvar transportador -----//
      it('Criar operação Salvar transportador', () => { 
        cy.login(usuario.cpf, usuario.senha) 
        cy.acessarPedido(idPrePedido)       
        cy.operacaoTransportador(faker, transportador.sigla)
        cy.notificacao(mensagem.TransportadorSucesso)      
      });
      
      //-------- Criar operação Enviar documentos do tipo Identidade ------//              
      it('Criar operação Enviar documentos do tipo Identidade', () => {  
        cy.login(usuario.cpf, usuario.senha)      
        cy.acessarPedido(idPrePedido)      
        cy.documentosIdentidade(doc.rg)
        cy.get(path.generic.mensagemFechar).click({force: true});      
      });

       // -------- Criar operação Enviar documento do tipo Registro RT ------//        
      it('Criar operação Enviar documento do tipo Registro RT', () => { 
        cy.login(usuario.cpf, usuario.senha)      
        cy.acessarPedido(idPrePedido)       
        cy.enviarDocumentosRT(doc.rg)
        cy.get(path.generic.mensagemFechar).click({force: true});      
      });

      // ------ Criar operação Incluir Contato Email ------//
      it('Criar operação Incluir Contato Email', () => { 
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)       
        cy.incluirContatoEmail(faker)
        cy.get(path.generic.mensagemFechar).click({force: true}); 
      });
      
      // ------ Criar operação Excluir Contato Celular -----//
      it('Criar operação Excluir Contato Celular', () => {
        const celular = '11952634251'
      cy.login(usuario.cpf, usuario.senha)  
      cy.acessarPedido(idPrePedido)        
      cy.excluirContatoCelular(fakerBr, celular)   
      cy.get(path.generic.mensagemFechar).click();
      
      });

      // ------ Criar operação Excluir Contato Telefone -----//
      it('Criar operação Excluir Contato Telefone', () => {
        const telefone = '(11)2200-2200';   
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)     
      cy.excluirContatoTelefone(fakerBr, telefone)  
      cy.get(path.generic.mensagemFechar).click();    
      
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
      
      // -------- Criar operação Alterar Endereço Comercial --------//
      it('Criar operação Alterar Endereço Comercial', () => { 
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)        
        cy.alterarEnderecoComercial(fakerBr)
        cy.get(path.generic.mensagemFechar).click({force: true});      
      });  

      // -------- Criar operação Alterar Endereço Correspondência --------//
      it('Criar operação Incluir Endereço Correspondência', () => { 
          cy.login(usuario.cpf, usuario.senha)
          cy.acessarPedido(idPrePedido)        
        cy.incluirEnderecoCorrespondencia(fakerBr)
        cy.get(path.generic.mensagemFechar).click({force: true});      
      });  

     // ------- Criar operação Incluir Gestor Sócio ------// 
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
    
});
  // ------- Selecionar o sindicato responsável -------//        
  it('Selecionar o sindicato responsável', () => {
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)          
      cy.get(path.generic.botaoConfirmar, {timeout: 10000}).trigger('mouseover').click({force: true})
      
      cy.get(path.generic.title, {timeout: 10000})
      .should('have.text', 'Selecione o Ponto de Atendimento').wait(2000)
      
      cy.get(path.checkoutAtendimentoPage.pontosAtendimento, {timeout: 10000}).clear().type(sindicato.sigla).wait(2000)
      cy.get(path.checkoutAtendimentoPage.listaSindicatos, {timeout: 10000}).should('have.text', sindicato.sigla)
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
        
          cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Alteração de Dados do Transportador (Gratuito)')
          cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$0.00')
          cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '1')
          cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$0.00')
      
          
          cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$0.00')          
        
      });
      
      cy.get(path.checkoutAtendimentoPage.botaoConfirmar1).click({force: true});
  });


  // ------ Validação do pedido - Pedido rejeitado por não ter anexo na inclusão do veiculo BSG1253 -------//         
  it('Validação e finalização do pre-pedido', () => {
      cy.login(usuario.cpf, usuario.senha)
      cy.acessarPedido(idPrePedido)  
    cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible')
    .click({force: true});
    
    cy.get(path.generic.title, {timeout: 10000})
    .should('have.text', 'Selecione o Ponto de Atendimento').wait(2000)      

    cy.get(path.checkoutAtendimentoPage.pontosAtendimento, {timeout: 10000}).clear().type(sindicato.sigla).wait(2000)
    cy.get(path.checkoutAtendimentoPage.listaSindicatos, {timeout: 10000}).should('have.text', sindicato.sigla)
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
      
      cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Alteração de Dados do Transportador (Gratuito)')
      cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$0.00')
      cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '1')
      cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$0.00')          
      
    })
    
    cy.get(path.checkoutAtendimentoPage.botaoConfirmar1).click({force: true});
    cy.get('.q-stepper__tab--active > .q-stepper__label > .q-stepper__title')
    .should('have.text', 'Validação do Pedido');
    
    cy.get('.text-6').should('have.text', ' Atendimento Válido ');       
    
    cy.get(path.checkoutAtendimentoPage.botaoConfirmar2, {timeout: 10000}).click({force: true})
    
    cy.get(path.generic.title, {timeout: 10000}).should('have.text', 'Confira o resumo do pedido');
    
    cy.get(path.generic.tabela, {timeout: 30000})        
    .then((ele) => {
      
      cy.log(ele.text())
      
      cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Alteração de Dados do Transportador (Gratuito)')
      cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$0.00')
      cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '1')
      cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$0.00')
        
        cy.get(path.generic.finalizar).click({force: true})

        cy.get('.q-ml-sm').should('have.text', 'Confirma a finalização do atendimento?')
        cy.get('.q-card__actions > :nth-child(1) > .q-btn__content').should('have.text', 'OK').click({force: true})                     

    })     
  });    

});