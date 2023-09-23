import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";
var fakerBr = require('faker-br');  

const usuario = {
  cpf: '09562140709',
  senha: 'a'
};
let index = 0;
let veiculo01;
let veiculo02;
let veiculoImplemento;
let veiculoAutomotor;
let doc;
const telefone = '(13) 3355-4439';
const email = 'areiaovp@avreiaovp.com.br';
let cpfCnpj = '346.575.509-00';
let idPrePedido = '2071088';
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
  cpfCnpj: "253.635.438-50",
  nome: "TAC - MARIA APARECIDA PEDROSO",
  rntrc: "002331850",
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
    cy.fixture("data/doc/documentos").then((data) => {
      doc = data
    })

    cy.fixture("data/veiculos/veiculo_lista_implemento").then((implementosList) => {
      veiculoImplemento = implementosList[index]
      veiculoImplemento.crlv = doc.crlv
      veiculoImplemento.contrato = doc.contrato
    })

    cy.fixture("data/veiculos/veiculo_lista_automotor").then((automotorList) => {
      veiculoAutomotor = automotorList[index]
      veiculoAutomotor.crlv = doc.crlv
      veiculoAutomotor.contrato = doc.contrato
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
      veiculoImplemento = bsg1253
      veiculoImplemento.crlv = doc.crlv
      veiculoImplemento.contrato = doc.contrato
    })
    
  
    // cy.fixture('usuario').then((data) => {
    //   usuario = data;
    // });
    
    cy.viewport(1920, 1080);
    cy.login(usuario.cpf, usuario.senha)
  }); 
    describe.only('Iniciando os testes da abertura do pedido e inclusão de operações', () => {
        
        // ------ Abrir Atendimento de Renovação ------//
        it('Acessando a página e criando pedido', () => {            
        cy.log(`Testes sendo executados no ambiente de ${Cypress.env('ENVIRONMENT')}`)               
        //Clicar na opção Regularização RNTRC no menu lateral
        cy.regularizacao();
        //Selecionando o tipo de atendimento Renovação RNTRC
        cy.atendimentosRegularizacao('Renovação RNTRC')
        //selecionar o tipo de transportador Autônomo para a abertura do pre-pedido
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
          cy.acessarPedido(idPrePedido)          
          cy.operacaoTransportador(fakerBr, transportador.sigla, idPrePedido)
          cy.notificacao(mensagem.TransportadorSucesso)      
        });
        
        // ------ Criar operação Enviar documentos do tipo Identidade -----//              
        it('Criar operação Enviar documentos do tipo Identidade', () => {              
        cy.acessarPedido(idPrePedido)      
        cy.documentosIdentidade(doc.rg)
        cy.notificacao(mensagem.ArquivoInclusoSucesso, doc.rg)      
        });

        // ------ Criar operação Incluir Contato Email ------//
        it('Criar operação Incluir Contato Email', () => {        
        cy.acessarPedido(idPrePedido)       
        cy.incluirContatoEmail(faker)
        cy.notificacao(mensagem.DadosSalvoSucesso)
        });
        
        // ------ Criar operação Alterar Contato Email ------//
        it('Criar operação Alterar Contato Email', () => {           
          cy.acessarPedido(idPrePedido)       
          cy.alterarContatoEmail(faker, 'contal@hbinfo.com.br')
          cy.notificacao(mensagem.DadosSalvoSucesso) 
          });

          // ------ Criar operação Excluir Contato Email ------//
        it('Criar operação Excluir Contato Email', () => {          
          cy.acessarPedido(idPrePedido)       
          cy.excluirContatoEmail(faker, email)
          cy.notificacao(mensagem.DadosSalvoSucesso) 
          });

        
        // ------ Criar operação Incluir Contato Celular -----//
        it('Criar operação Incluir Contato Celular', () => {          
        cy.acessarPedido(idPrePedido)        
        cy.incluirContatoCelular(faker)   
        cy.notificacao(mensagem.DadosSalvoSucesso)      
        });

        it('Criar operação Alterar Contato Celular', () => {            
          cy.acessarPedido(idPrePedido)        
          cy.alterarContatoCelular(faker, '(49) 246-2783')   
          cy.notificacao(mensagem.DadosSalvoSucesso)      
          });

          // it('Criar operação Excluir Contato Celular', () => {              
          //   cy.acessarPedido(idPrePedido)        
          //   cy.excluirContatoCelular(faker)   
          //   cy.notificacao(mensagem.DadosSalvoSucesso)      
          //   });
        
        // ------ Criar operação Incluir Contato Telefone -----//
        it('Criar operação Incluir Contato Telefone', () => {          
          cy.acessarPedido(idPrePedido)     
        cy.incluirContatoTelefone(faker)  
        cy.notificacao(mensagem.DadosSalvoSucesso)      
        });

        it('Criar operação Alterar Contato Telefone', () => {          
          cy.acessarPedido(idPrePedido)     
        cy.alterarContatoTelefone(faker, telefone)  
        cy.notificacao(mensagem.DadosSalvoSucesso)      
        });

        it('Criar operação Excluir Contato Telefone', () => {          
          cy.acessarPedido(idPrePedido)     
        cy.excluirContatoTelefone(faker, telefone)  
        cy.notificacao(mensagem.DadosSalvoSucesso)      
        });
        
        // ------- Criar operação Incluir Contato Fax -------//
        it('Criar operação Incluir Contato Fax', () => {                
        cy.acessarPedido(idPrePedido)    
        cy.incluirContatoFax(faker)     
        cy.notificacao(mensagem.DadosSalvoSucesso)      
        });
        
        // it.only('Criar operação Alterar Contato Fax', () => {
        //         
        // cy.acessarPedido(idPrePedido)    
        // cy.alterarContatoFax(faker)     
        // cy.notificacao(mensagem.DadosSalvoSucesso)      
        // });

        // it('Criar operação Excluir Contato Fax', () => {                
        // cy.acessarPedido(idPrePedido)    
        // cy.excluirContatoFax(faker)     
        // cy.notificacao(mensagem.DadosSalvoSucesso)      
        // });
        
        // -------- Criar operação Incluir Endereço Correspondência --------//
        it('Criar operação Incluir Endereço Correspondência', () => {            
            cy.acessarPedido(idPrePedido)        
          cy.incluirEnderecoCorrespondencia(fakerBr)
          cy.notificacao(mensagem.DadosSalvoSucesso)      
        }); 
        
        // -------- Criar operação Incluir Endereço Residencial --------//
        it('Criar operação Incluir Endereço Residencial', () => {           
          cy.acessarPedido(idPrePedido)        
        cy.incluirEnderecoResidencial(fakerBr)
        cy.notificacao(mensagem.DadosSalvoSucesso)      
      }); 

      // --------- Criar operacao Incluir Motorista -----//
      it('Criar operacao Incluir Motorista', () => {            
            cy.acessarPedido(idPrePedido)
          cy.incluirMotorista(fakerBr)
          cy.notificacao(mensagem.DadosSalvoSucesso)
      }); 
      
      it('Criar operacao Alterar Motorista', () => {        
        cy.acessarPedido(idPrePedido)
      cy.alterarMotorista(fakerBr, '701.796.388-15')
      cy.notificacao(mensagem.DadosSalvoSucesso)
  });
        
        // -------- Criar operação Incluir Veiculo Automotor/Leasing e Automotor/arrendado -------//        
        it('Criar operação Incluir Veiculo Automotor/Leasing e Automotor/arrendado', () => {            
            cy.acessarPedido(idPrePedido)          
          cy.incluirVeiculo(veiculo01)
          cy.notificacao(mensagem.VeiculoSalvoSucesso)      
          
          cy.incluirVeiculo(veiculo02)
          cy.notificacao(mensagem.VeiculoSalvoSucesso)  
          cy.anexarDocumentosVeiculo(doc, veiculo02 )
          cy.notificacao(mensagem.CRLVSucesso)  
        });     
        
        // -------- Criar operação Incluir Veiculo SEMI-REBOQUE/Arrendado ------//
        it('Criar operação Incluir Veiculo Implemento/Arrendado', () => {
          cy.acessarPedido(idPrePedido)        
          cy.incluirVeiculo(veiculoImplemento)
          cy.notificacao(mensagem.VeiculoSalvoSucesso)
          cy.anexarDocumentosVeiculo(doc, veiculoImplemento )
          cy.notificacao(mensagem.CRLVSucesso)      
          index++
        });

        it('Criar operação Incluir Veiculo Automotor/Arrendado', () => {
          cy.acessarPedido(idPrePedido)        
          cy.incluirVeiculo(veiculoAutomotor)
          cy.notificacao(mensagem.VeiculoSalvoSucesso)
          cy.anexarDocumentosVeiculo(doc, veiculoAutomotor )
          cy.notificacao(mensagem.CRLVSucesso)      
          index++
        });

        it('Criar operação Incluir Veiculo Automotor/Arrendado', () => {
          cy.acessarPedido(idPrePedido)        
          cy.incluirVeiculo(veiculoAutomotor)
          cy.notificacao(mensagem.VeiculoSalvoSucesso)
          cy.anexarDocumentosVeiculo(doc, veiculoAutomotor )
          cy.notificacao(mensagem.CRLVSucesso)      
          index++
        });
        
        it('Criar operação Incluir Veiculo Implemento/Arrendado', () => {
          cy.acessarPedido(idPrePedido)        
          cy.incluirVeiculo(veiculoImplemento)
          cy.notificacao(mensagem.VeiculoSalvoSucesso)
          cy.anexarDocumentosVeiculo(doc, veiculoImplemento )
          cy.notificacao(mensagem.CRLVSucesso)      
          index++
        });
        
        // --------- Anexar crlv na operação de inclusão de veículo -------//        
        it('Anexar crlv na operação de inclusão de veículo', () => {            
            cy.acessarPedido(idPrePedido)          
          cy.anexarDocumentosVeiculo(doc, veiculo01 )
          cy.notificacao(mensagem.CRLVSucesso)      
        });
    });
      
      describe('Selecionando o sindicato e validando o pedido', () => {
          // ------- Selecionar o sindicato e gerar valor -------//        
          it('Selecionar o sindicato e gerar valor', () => {
            
            cy.acessarPedido(idPrePedido)          
          cy.get(path.generic.botaoConfirmar, {timeout: 10000}).trigger('mouseover').click({force: true})
          
          cy.get(path.generic.title, {timeout: 10000})
          .should('have.text', 'Selecione o Ponto de Atendimento').wait(2000)
          
          cy.get(path.checkoutAtendimentoPage.pontosAtendimento, {timeout: 10000}).clear().type(sindicato.sigla).wait(2000)
          cy.xpath(path.checkoutAtendimentoPage.listaSindicatos, {timeout: 10000}).should('have.text', sindicato.sigla)
          .click({force: true})         
          
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
          
          cy.acessarPedido(idPrePedido)  
        cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible')
        .click({force: true});
        
        cy.get(path.generic.title, {timeout: 10000})
        .should('have.text', 'Selecione o Ponto de Atendimento').wait(2000)      

        cy.get(path.checkoutAtendimentoPage.pontosAtendimento, {timeout: 10000}).clear().type(sindicato.sigla).wait(2000)
        cy.xpath(path.checkoutAtendimentoPage.listaSindicatos, {timeout: 10000}).should('have.text', sindicato.sigla)
        .click({force: true})       
        
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
        
        cy.anexarDocumentosVeiculo(doc, veiculoImplemento )
        
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
            cy.get('.q-card__actions > :nth-child(1) > .q-btn__content').should('have.text', 'OK').click({force: true})

            cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]', {timeout: 20000}).should('be.visible')

            cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]', {timeout: 20000}).should('not.exist')          

        })     
      });  
      });
       
     
      describe('Gerando os meios de pagamentos na pagina Meio pagamento', () => {
          
            // ----- Finalizar o pedido ----//
        it('Meio de pagamento', () => {
            
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

});