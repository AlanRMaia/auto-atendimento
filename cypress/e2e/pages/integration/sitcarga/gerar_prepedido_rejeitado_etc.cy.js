/// <reference types="Cypress"/>
import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../../../selectors/path.sel.cy';
import mensagem from "../../../../support/mensagemAlertEnum";
import  urls  from "../../../../support/urls";
import  situacao  from "../../../../support/SituacaoEnum";
var fakerBr = require('faker-br');  
   
let doc; 
let idPrePedido = '2071165';
const celular = '(21) 98789-5463';
const telefone = '(17) 2138-1100';
const fax = '(21) 2165-7894';
const email = 'cristiane.souza@jdcocenzo.com.br';

const rt = {
  cpf: '161.182.198-34',
  nome: 'JOSE DOMINGOS COCENZO',
  identidade: '4263470',
  dataNascimento: '06/04/1948'  
}

const gestor = {
  cpfCnpj: '161.182.198-34',
  nome: 'JOSE DOMINGOS COCENZO',
  cargo: 'Sócio',
  telefone: '2188888888',
  email: 'texte#@teste.com',
  nascimento: '06/04/1948'
}

let enderecoComercial = {
  cep: '12236670',
  logradouro: 'AVENIDA ERNANI PIRES DOMINGUES',
  municipio: 'São José do Rio Preto',
  uf: 'SP',
  numero: '1.700',
  bairro: 'N S DA PENHA',    
};

let enderecoResidencial = {
  cep: '12236670',
  logradouro: 'RUA JOSEFA ALBUQUERQUE DOS SANTOS',
  municipio: 'São José dos Campos',
  uf: 'SP',
  numero: '513',
  bairro: 'CIDADE MORUMBI',    
};

const transportador = {
  cpfCnpj: "49.025.695/0001-55",
  nome: "J D COCENZO E CIA LTDA",
  rntrc: "000010185",
  situacao: "ATIVO",
  saldo: "R$ 0,00",
  sigla: "ETC",
  tipo: "Empresa"
};
const sindicato = {
  perfil: "SETCAL - Operador",
  sigla: "SETCAL",
  path: path.generic.perfilSitcarga.SETCALOperador
} 

describe('Gerar pedido após confirmação do pagamento pre-pedido Movimentação de forta', () => {
      beforeEach(() => {
        cy.fixture("data/doc/documentos").then((data) => {
            doc = data
          })
            
          cy.intercept('GET', '**/validarpedido').as('validarpedido')
          cy.intercept('PUT', '**/finalizar').as('finalizarpedido')

          cy.viewport(1920, 1080);
          cy.login()
          //cy.acessarPedido(idPrePedido)
      });

  describe('criação do pedido e inclusão de operações', () => {
    it('Iniciando so testes', () => {
            
      describe('Criar pedido Alteração de dados ETC', () => {
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
        
        //------ Criar operação Salvar transportador -----//
        describe('Criar operação Salvar transportador', () => { 
          cy.operacaoTransportador(fakerBr, transportador.sigla)
          cy.notificacao(mensagem.TransportadorSucesso)      
        });
        
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

      // --------- Criar operacao Incluir Gestor Sócio -----//
      describe('Criar operacao Incluir Gestor Sócio', () => {
          cy.incluirGestor(gestor, transportador.tipo )
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
         // -------- Criar operação Incluir Filial ------//
        it.skip('Criar operação Incluir Filial', () => {                 
          cy.incluirFilial()
          cy.notificacao(mensagem.DadosSalvoSucesso)      
        });
        
        // ---------- Criar operação Incluir Responsável Técnico --------//
        it('Criar operação Incluir Responsável Técnico', () => {          
          cy.incluirResponsavelTecnico(fakerBr, rt)
          cy.notificacao(mensagem.DadosSalvoSucesso)
          cy.enviarDocumentosRT(doc.rg)
          cy.notificacao(mensagem.ArquivoInclusoSucesso, doc.rg)
        });  

        // -------- Criar operação Alterar Endereço Comercial --------//
        describe('Criar operação Alterar Endereço Comercial', () => { 
          cy.alterarEnderecoComercial(fakerBr, enderecoComercial.cep)
          //cy.notificacao(mensagem.DadosSalvoSucesso);      
      }); 
              
          describe('Selecionar o sindicato e gerar valor e anexar documento no veiculo inválido', () => {
              
            // ------- Selecionar o sindicato responsável -------//        
            describe('Selecionar o sindicato responsável', () => {
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
                         
                cy.get('#IdPedido').type(idPrePedido, {force: true})
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
                cy.get('.alert alert-danger > b').contains('Rejeição: Esse CPF não está cadastrado ou não está ativo na Receita Federal do Brasil.')
              
            });
          }); 
    });
  
});