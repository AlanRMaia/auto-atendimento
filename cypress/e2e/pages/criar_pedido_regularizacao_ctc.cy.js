import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";
var fakerBr = require('faker-br');  

let veiculo01;
let veiculo02;
let veiculo03;
let veiculoImplemento;
let veiculoAutomotor;
let index = 0;
let doc; 
const telefone = '(55) 3221-7614'
const celular = '(21) 98789-5463';
const fax = '(68) 3221-7614';
const email = 'cristiane.souza@jdcocenzo.com.br';
let idPrePedido = '2071070';

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

const correspondencia = {
  tipo: "Comercial",
  cep: "48700000",
  logradouro: "AV VALDETE CARNEIRO",
  bairro: "CENTRO",
  municipio: "Serrinha",
  uf: "BA",
  numero: "S/N",
  complemento: "CASA",
};

const endereco = {
  tipo: "Comercial",
  cep: "48700000",
  logradouro: "AV VIA VERDE",
  bairro: "AMAPA",
  municipio: "Rio Branco",
  uf: "AC",
  numero: "2277",
  complemento: "ESTRADA DO AMAPA",
};
const gestor = {
  cpfCnpj: fakerBr.br.cnpj(),
  nome: 'PARQUE DE VAQUEJADA MARIA DO CARMO LTDA',
  cargo: 'Responsável Legal',
  telefone: '2188888888',
  email: 'texte#@teste.com',
  nascimento: '06/04/1948'
}



const gestorIncluir = {
  cpfCnpj: '09562140709',
  nome: 'Alan teste',
  cargo: 'Sócio',
  telefone: '2188888888',
  email: 'texte#@teste.com',
  nascimento: '06/04/1948'
}

const rt = {
  cpf: '180.246.295-34',
  nome: 'DIVALDO JOSÉ MATOS DE LIMA',
  identidade: '1674903',
  dataNascimento: '06/04/1948'  
}
const rtIncluir = {
  cpf: fakerBr.br.cpf(),
  nome: 'Alan teste',
  identidade: '1674903',
  dataNascimento: '06/04/1948'  
}
const transportador = {
  cpfCnpj: "06.100.426/0001-01",
  nome: "CTC - COOPERATIVADOS PROPRIETARIOS DE VEICULO E MÁQUINAS",
  rntrc: "011581100",
  situacao: "VENCIDO",
  saldo: "R$ 0,00",
  sigla: "CTC",
  tipo: "Cooperativa"
};
const sindicato = {
  perfil: "OCERGS - Master",
  sigla: "OCERGS",
  path: path.generic.perfilSitcarga.OCERGSMAster
}  
describe('Grupo de teste Atendimento Renovação CTC', () => {  

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

  cy.reload();  
  cy.viewport(1920, 1080);
  cy.login()
  
 });
 it('Iniciando os testes na criação do pedido e inclusão das operações', () => {
    
  // ------ Abrir Atendimento de Renovação ------//
      describe('Acessando a página e criando pedido', () => {
        cy.log(`Testes sendo executados no ambiente de ${Cypress.env('ENVIRONMENT')}`)
          //Logar na página com o usuario       
                 
          //Clicar na opção Regularização RNTRC no menu lateral
          cy.get(path.atendimentoPage.regularizacao, {timeout: 30000}).click({force: true});
          //Selecionando o tipo de atendimento Renovação RNTRC
          cy.atendimentosRegularizacao('Renovação RNTRC')
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
        describe('Criar operação Salvar transportador', () => {              
          cy.operacaoTransportador(faker, transportador.sigla, idPrePedido)
          cy.notificacao(mensagem.TransportadorSucesso)      
        });
        
        // ------ Criar operação Enviar documentos do tipo Identidade -----//              
        describe('Criar operação Enviar documentos do tipo Identidade', () => {                
          cy.documentosIdentidade(doc.rg)
          cy.notificacao(mensagem.ArquivoInclusoSucesso, doc.rg)
        });

        // ------ Criar operação Incluir Contato Email ------//
        describe('Criar operação Incluir Contato Email', () => {          
          cy.incluirContatoEmail(faker)
          cy.notificacao(mensagem.DadosSalvoSucesso) 
        });
        
        // // ------ Criar operação Excluir Contato Email ------//
        // it('Criar operação Excluir Contato Email', () => { 
        //   
        //   cy.acessarPedido(idPrePedido)       
        //   cy.excluirContatoEmail(faker, )
        //   cy.get(path.generic.mensagemFechar).click({force: true}); 
        //   });

        // ------ Criar operação Incluir Contato Celular -----//
        it('Criar operação Incluir Contato Celular', () => {            
          cy.incluirContatoCelular(faker)   
          cy.notificacao(mensagem.DadosSalvoSucesso)      
        });

        // it('Criar operação Alterar Contato Celular', () => {
        //     
        //   cy.acessarPedido(idPrePedido)        
        //   cy.incluirContatoCelular(faker)   
        //   cy.get(path.generic.mensagemFechar).click({force: true});      
        //   });
        
        // ------ Criar operação Incluir Contato Telefone -----//
        describe('Criar operação Incluir Contato Telefone', () => {            
          cy.incluirContatoTelefone(faker)  
          cy.notificacao(mensagem.DadosSalvoSucesso)      
        });
        // ------ Criar operação Excluir Contato Telefone -----//
        describe('Criar operação Excluir Contato Telefone', () => {           
          cy.excluirContatoTelefone(faker, telefone)  
          cy.notificacao(mensagem.DadosSalvoSucesso)      
        });
        
        // ------- Criar operação Incluir Contato Fax -------//
        describe('Criar operação Incluir Contato Fax', () => {                  
          cy.incluirContatoFax(faker)     
          cy.notificacao(mensagem.DadosSalvoSucesso)      
        });
        
        // ------- Criar operação Excluir Contato Fax -------//
        describe('Criar operação Excluir Contato Fax', () => {                  
          cy.excluirContatoFax(faker)     
          cy.notificacao(mensagem.DadosSalvoSucesso)      
        });
                
          // ------- Criar operação Incluir Gestor Responsável legal ------// 
        describe('Criar operação Incluir Gestor Responsável legal', () => {           
          cy.incluirGestor(gestorResponsavelLegalIncluir, transportador.sigla)
          cy.notificacao(mensagem.DadosSalvoSucesso)     
              
        });

      // ------- Criar operação Excluir Gestor Responsável legal------// 
        // describe('Criar operação Excluir Gestor Responsável legal', () => {                      
        //   cy.excluirGestor(gestor, transportador.sigla)
        //   cy.notificacao(mensagem.DadosSalvoSucesso)      
        // });     
        
        // -------- Criar operação Incluir Veiculo Automotor/Leasing e Automotor/arrendado -------//        
        describe('Criar operação Incluir Veiculo Automotor/Leasing e Automotor/arrendado', () => {            
          cy.incluirVeiculo(veiculo01)
          cy.notificacao(mensagem.VeiculoSalvoSucesso)      
          
          cy.incluirVeiculo(veiculo02)
          cy.notificacao(mensagem.VeiculoSalvoSucesso)  
          cy.anexarDocumentosVeiculo(doc, veiculo02 )
          cy.notificacao(mensagem.CRLVSucesso)  
        });     
    
    // -------- Criar operação Incluir Veiculo SEMI-REBOQUE/Arrendado ------//
        describe('Criar operação Incluir Veiculo Implemento/Arrendado', () => {
          cy.incluirVeiculo(veiculoImplemento)
          cy.notificacao(mensagem.VeiculoSalvoSucesso)
          cy.anexarDocumentosVeiculo(doc, veiculoImplemento )
          cy.notificacao(mensagem.CRLVSucesso)      
          index++
        });

        describe('Criar operação Incluir Veiculo Automotor/Arrendado', () => {
          cy.incluirVeiculo(veiculoAutomotor)
          cy.notificacao(mensagem.VeiculoSalvoSucesso)
          cy.anexarDocumentosVeiculo(doc, veiculoAutomotor )
          cy.notificacao(mensagem.CRLVSucesso)      
          index++
        });

        describe('Criar operação Incluir Veiculo Automotor/Arrendado', () => {
          cy.incluirVeiculo(veiculoAutomotor)
          cy.notificacao(mensagem.VeiculoSalvoSucesso)
          cy.anexarDocumentosVeiculo(doc, veiculoAutomotor )
          cy.notificacao(mensagem.CRLVSucesso)      
          index++
        });
    
        describe('Criar operação Incluir Veiculo Implemento/Arrendado', () => {
          cy.incluirVeiculo(veiculoImplemento)
          cy.notificacao(mensagem.VeiculoSalvoSucesso)
          cy.anexarDocumentosVeiculo(doc, veiculoImplemento )
          cy.notificacao(mensagem.CRLVSucesso)      
          index++
        });
    
    // --------- Anexar crlv na operação de inclusão de veículo -------//        
        describe('Anexar crlv na operação de inclusão de veículo', () => {            
          cy.anexarDocumentosVeiculo(doc, veiculo01 )
          cy.notificacao(mensagem.CRLVSucesso)      
        });

        // -------- Criar operação Incluir Filial ------//
        describe('Criar operação Incluir Filial', () => { 
          cy.incluirFilial(fakerBr)
          cy.notificacao(mensagem.DadosSalvoSucesso)      
        });
        
        // ---------- Criar operação Incluir Responsável Técnico --------//
        describe('Criar operação Incluir Responsável Técnico', () => {           
          cy.incluirResponsavelTecnico(fakerBr, rtIncluir)
          cy.notificacao(mensagem.DadosSalvoSucesso)      
        }); 
        
        // ---------- Criar operação Excluir Responsável Técnico --------//
        // describe('Criar operação Excluir Responsável Técnico', () => {           
        //   cy.excluirResponsavelTecnico(fakerBr, rt)
        //   cy.notificacao(mensagem.DadosSalvoSucesso)      
        // }); 

        // // ---------- Criar operação Alterar Responsável Técnico --------//
        // it('Criar operação Alterar Responsável Técnico', () => { 
      
        //   const rt = {
        //     cpf: '42453708074',
        //     nome: 'Alan Maia',
        //     identidade: '2334667895',
        //     dataNascimento: '20/05/2005'

        //   }
          
        //   cy.acessarPedido(idPrePedido)        
        // cy.alterarResponsavelTecnico(fakerBr, rt)
        // cy.get(path.generic.mensagemFechar, {timeout:8000}).click({force: true});      
        // }); 

         // ------ Criar operação Documentos Responsável Técnico -----//              
         describe('Criar operação Documentos Responsável Técnico', () => {                  
            cy.enviarDocumentosRT(doc.rg)
            cy.notificacao(mensagem.ArquivoInclusoSucesso, doc.rg)
          });
          //-------- Criar operação Incluir Endereço Correspondência --------//
          describe('Criar operação Incluir Endereço Correspondência', () => {               
            cy.incluirEnderecoCorrespondencia(fakerBr)
            //cy.notificacao(mensagem.DadosSalvoSucesso)      
          });  

      //-------- Criar operação Incluir Endereço Comercial --------//
          describe('Criar operação Incluir Endereço Comercial', () => {               
            cy.incluirEnderecoComercial(fakerBr)
            //cy.notificacao(mensagem.DadosSalvoSucesso)      
          });
        
  });     
    
    
  it('Selecionar o sindicato e gerar valor e anexar documento no veiculo inválido', () => {
    cy.intercept('GET', 'https://sitcargaapitest/rntrc/PrePedido/listarentidadesdisponiveis**').as('listaSindicatos')
    cy.intercept('GET', '**/valor**').as('tabela')
      // ------- Selecionar o sindicato e gerar valor -------//        
    describe('Selecionar o sindicato e gerar valor', () => {
      cy.acessarPedido(idPrePedido)          
      cy.get(path.generic.botaoConfirmar, {timeout: 10000}).trigger('mouseover').click({force: true})
      
      cy.get(path.generic.title, {timeout: 10000})
      .should('have.text', 'Selecione o Ponto de Atendimento').wait(2000)
      
      cy.get(path.checkoutAtendimentoPage.pontosAtendimento, {timeout: 10000}).clear().type(sindicato.sigla, {force: true})
      cy.wait('@listaSindicatos')
      cy.get(path.checkoutAtendimentoPage.listaSindicatos, {timeout: 10000}).contains(sindicato.sigla, {timeout: 10000})
      .click({force: true})         
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
        
      });
      
      cy.get(path.checkoutAtendimentoPage.botaoConfirmar1).click({force: true});
    }); 
    
    // ------ Validação do pedido - Pedido rejeitado por não ter anexo na inclusão do veiculo BSG1253 -------//         
    describe('Validação do pedido - Pedido rejeitado por não ter anexo na inclusão do veiculo BSG1253', () => {      
      
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
      
      cy.notificacao(mensagem.ContratoArrendamentoSucesso)
      cy.notificacao(mensagem.CRLVSucesso)

      cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible').click({force: true})        
      
      cy.get(path.checkoutAtendimentoPage.botaoConfirmar1, {timeout: 10000}).should('be.visible').click({force: true})
      
      cy.get('.text-6').should('have.text', ' Atendimento Válido ')
      cy.wait('@listaSindicatos')
      cy.get(path.checkoutAtendimentoPage.botaoConfirmar2, {timeout: 10000}).click({force: true})
      
      cy.get(path.generic.title, {timeout: 10000}).should('have.text', 'Confira o resumo do pedido');
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

          cy.get(path.generic.email).type(faker.internet.email())

          cy.get(path.generic.finalizar).click({force: true})

          cy.get('.q-ml-sm').should('have.text', 'Confirma a finalização do atendimento?')
          cy.get('.q-card__actions > :nth-child(1) > .q-btn__content').should('have.text', 'OK').click({force: true})

          // cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]', {timeout: 20000}).should('be.visible')

          // cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]', {timeout: 20000}).should('not.exist')          
          cy.wait('@finalizarpedido')
      })     
    });  
    
            
    describe('Meio de pagamento', () => {
          cy.get(path.generic.pagamento, {timeout: 20000}).click({force: true})
  
          cy.get(path.componentePagamento.pagamentoPix, {timeout: 10000}).contains('Pagamento por PIX')
  
          cy.get(path.componentePagamento.pagamentoBoleto, {timeout: 10000}).contains('Pagamento por Boleto')
          
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
});