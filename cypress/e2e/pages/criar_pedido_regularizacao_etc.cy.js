import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";
var fakerBr = require('faker-br'); 

  let veiculo01;
  let veiculo02;
  let veiculoImplemento;
  let veiculoAutomotor;
  let index = 0;
  let doc; 
  const telefone = '(55) 3261-2695'
  const celular = '(21) 98789-5463';
  const fax = '(75) 3261-2695';
  const email = 'cristiane.souza@jdcocenzo.com.br';
  const cep = '79106-677'

  let idPrePedido = '2071404';
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

  const endereco = {
    tipo: "Comercial",
    cep: "48700000",
    logradouro: "AV VALDETE CARNEIRO",
    bairro: "CENTRO",
    municipio: "Serrinha",
    uf: "BA",
    numero: "S/N",
    complemento: "CASA",
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
  const gestorResponsavelLegalIncluir = {
    cpfCnpj: fakerBr.br.cnpj(),
    nome: 'PARQUE DE VAQUEJADA MARIA DO CARMO LTDA',
    cargo: 'Responsável Legal',
    telefone: '2188888888',
    email: 'texte#@teste.com',
    nascimento: '06/04/1948'
  }
  const gestorResponsavelLegal = {
    cpfCnpj: '02.672.529/0001-87',
    nome: 'PARQUE DE VAQUEJADA MARIA DO CARMO LTDA',
    cargo: 'Responsável Legal',
    telefone: '2188888888',
    email: 'texte#@teste.com',
    nascimento: '06/04/1948'
  }
  const gestor = {
    cpfCnpj: '180.246.295-34',
    nome: 'DIVALDO JOSÉ MATOS DE LIMA',
    cargo: 'Sócio',
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
    cy.reload()
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

    cy.fixture("data/veiculos/DDD4654").then((ddd4654) => {
      veiculo02 = ddd4654
      veiculo02.crlv = doc.crlv
      veiculo02.contrato = doc.contrato
    })
    
    cy.intercept('GET', '**/validarpedido').as('validarpedido')
    cy.intercept('POST', '**/gerarpagamentopedido').as('finalizarpedido')
    cy.intercept('GET', `https://sitcargaapitest/rntrc/PrePedido/**`).as('gridoperacao') 

    cy.viewport(1920, 1080);
    cy.login()   
  });
  describe('Iniciando os testes na criação do pedido e inclusão das operações', () => {
      
    // ------ Abrir Atendimento de Renovação ------//
        it('Acessando a página e criando pedido', () => {
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
         it('Criar operação Salvar transportador', () => { 
          cy.acessarPedido(idPrePedido)       
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')
          cy.operacaoTransportador(faker, transportador.sigla)
          cy.notificacao(mensagem.TransportadorSucesso)      
        });
        
        //-------- Criar operação Enviar documentos do tipo Identidade ------//              
        it('Criar operação Enviar documentos do tipo Identidade', () => { 
          cy.acessarPedido(idPrePedido)       
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao') 
          cy.documentosIdentidade(doc.rg)
          cy.notificacao(mensagem.ArquivoInclusoSucesso, doc.rg)      
        });

        // ------ Criar operação Incluir Contato Email ------//
        it('Criar operação Incluir Contato Email', () => { 
          cy.acessarPedido(idPrePedido)       
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')
          cy.incluirContatoEmail(faker)
          cy.notificacao(mensagem.DadosSalvoSucesso) 
        });
        
        // ------ Criar operação Excluir Contato Email ------//
        it('Criar operação Excluir Contato Email', () => { 
          cy.acessarPedido(idPrePedido)       
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')
          cy.incluirContatoEmail(faker, email)
          cy.notificacao(mensagem.DadosSalvoSucesso) 
        });

        // ------ Criar operação Incluir Contato Celular ------//
        it('Criar operação Incluir Contato Celular', () => { 
          cy.acessarPedido(idPrePedido)       
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')
          cy.incluirContatoCelular(faker)
          cy.notificacao(mensagem.DadosSalvoSucesso) 
        });

        
        //------ Criar operação Excluir Contato Celular -----//
        // it('Criar operação Excluir Contato Celular', () => { 
        //   cy.acessarPedido(idPrePedido)       
        //   cy.url().should('include', `detalhe`)
        //   cy.wait('@gridoperacao')        
        //   cy.excluirContatoCelular(fakerBr, celular)   
        //   cy.notificacao(mensagem.DadosSalvoSucesso);
        // });

        // ------ Criar operação Excluir Contato Telefone -----//
        it('Criar operação Excluir Contato Telefone', () => { 
          cy.acessarPedido(idPrePedido)       
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')        
          cy.excluirContatoTelefone(faker, telefone)  
          cy.notificacao(mensagem.DadosSalvoSucesso);       
        });
        
        // ------ Criar operação Incluir Contato Telefone -----//
        it('Criar operação Incluir Contato Telefone', () => {
          cy.acessarPedido(idPrePedido)       
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')   
          cy.incluirContatoTelefone(faker)  
          cy.notificacao(mensagem.DadosSalvoSucesso);      
        });
        
        // ------- Criar operação Incluir Contato Fax -------//
        it('Criar operação Incluir Contato Fax', () => {
          cy.acessarPedido(idPrePedido)       
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')
          cy.incluirContatoFax(faker)     
          cy.notificacao(mensagem.DadosSalvoSucesso);      
        });       
        
        //------- Criar operação Excluir Contato Fax -------//
        it('Criar operação Excluir Contato Fax', () => {
          cy.acessarPedido(idPrePedido)       
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')
          cy.incluirContatoFax(faker, fax)     
          cy.notificacao(mensagem.DadosSalvoSucesso);      
        }); 

        // -------- Criar operação Alterar Endereço Comercial --------//
        it('Criar operação Alterar Endereço Comercial', () => { 
          cy.acessarPedido(idPrePedido)       
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')
          cy.alterarEnderecoComercial(fakerBr, cep)
          //cy.notificacao(mensagem.DadosSalvoSucesso);      
        });  

        // -------- Criar operação Alterar Endereço Correspondência --------//
        it('Criar operação Incluir Endereço Correspondência', () => { 
          cy.acessarPedido(idPrePedido)       
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')
          cy.incluirEnderecoCorrespondencia(fakerBr, cep)
          //cy.notificacao(mensagem.DadosSalvoSucesso);      
        });  

      // --------- Criar operacao Incluir Gestor -----//
        it('Criar operacao Incluir Gestor', () => {
            cy.acessarPedido(idPrePedido)       
            cy.url().should('include', `detalhe`)
            cy.wait('@gridoperacao')
            cy.incluirGestor(gestor, transportador.sigla)
            cy.notificacao(mensagem.DadosSalvoSucesso);
        });  
      
      // --------- Criar operacao Alterar Gestor Sòcio -----//
        it('Criar operacao Alterar Gestor Sócio', () => {
            cy.acessarPedido(idPrePedido)       
            cy.url().should('include', `detalhe`)
            cy.wait('@gridoperacao')        
            cy.alterarGestor(gestor, transportador.sigla )
            cy.notificacao(mensagem.DadosSalvoSucesso);
        }); 
        
        // --------- Criar operacao Incluir Gestor Responsável legal -----//
        it('Criar operacao Incluir Gestor Responsável legal', () => {
          cy.acessarPedido(idPrePedido)       
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')
          cy.incluirGestor(gestorResponsavelLegalIncluir, transportador.sigla)
          cy.notificacao(mensagem.DadosSalvoSucesso);
        });

        // --------- Criar operacao Alterar Gestor Responsável legal -----//
        it('Criar operacao Alterar Gestor Responsável legal', () => {
          cy.acessarPedido(idPrePedido)       
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')        
          cy.alterarGestor(gestorResponsavelLegal, transportador.sigla )
          cy.notificacao(mensagem.DadosSalvoSucesso);
        });

      // -------- Criar operação Incluir Filial ------//
        it('Criar operação Incluir Filial', () => {
          cy.acessarPedido(idPrePedido)
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao') 
          cy.incluirFilial(fakerBr)
          cy.notificacao(mensagem.DadosSalvoSucesso)      
        });
        
        
        // -------- Criar operação Incluir Veiculo Automotor/Leasing e Automotor/arrendado -------//        
        it('Criar operação Incluir Veiculo Automotor/Leasing e Automotor/arrendado', () => {            
          cy.acessarPedido(idPrePedido)
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')          
          cy.incluirVeiculo(veiculo01)
          cy.notificacao(mensagem.VeiculoSalvoSucesso)
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')      
          cy.anexarDocumentosVeiculo(doc, veiculo01 )
          cy.notificacao(mensagem.CRLVSucesso)  
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')
          cy.incluirVeiculo(veiculo02)
          cy.notificacao(mensagem.VeiculoSalvoSucesso)
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')  
          cy.anexarDocumentosVeiculo(doc, veiculo02 )
          cy.notificacao(mensagem.CRLVContratoSucesso)
        });     
      
      // -------- Criar operação Incluir Veiculo SEMI-REBOQUE/Arrendado ------//
        it('Criar operação Incluir Veiculo Implemento/Arrendado', () => {
          cy.acessarPedido(idPrePedido)
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')        
          cy.incluirVeiculo(veiculoImplemento)
          cy.notificacao(mensagem.VeiculoSalvoSucesso)
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')
          cy.anexarDocumentosVeiculo(doc, veiculoImplemento )
          cy.notificacao(mensagem.CRLVContratoSucesso)      
          index++
        });
  
      it('Criar operação Incluir Veiculo Automotor/Arrendado', () => {
        cy.acessarPedido(idPrePedido)
        cy.url().should('include', `detalhe`)
        cy.wait('@gridoperacao')        
        cy.incluirVeiculo(veiculoAutomotor)
        cy.notificacao(mensagem.VeiculoSalvoSucesso)
        cy.url().should('include', `detalhe`)
        cy.wait('@gridoperacao')
        cy.anexarDocumentosVeiculo(doc, veiculoAutomotor )
        cy.notificacao(mensagem.CRLVContratoSucesso)      
        index++
      });    
      
      it('Criar operação Incluir Veiculo Implemento/Arrendado', () => {
        cy.acessarPedido(idPrePedido) 
        cy.url().should('include', `detalhe`)
        cy.wait('@gridoperacao')       
        cy.incluirVeiculo(veiculoImplemento)
        cy.notificacao(mensagem.VeiculoSalvoSucesso)
        cy.url().should('include', `detalhe`)
        cy.wait('@gridoperacao')
        cy.anexarDocumentosVeiculo(doc, veiculoImplemento )
        cy.notificacao(mensagem.CRLVContratoSucesso)      
        index++
      });
  });     
      
  describe.only('Selecionando o sindicato e validando o pedido', () => {
          
        // ------- Selecionar o sindicato e gerar valor -------// 
        it('Selecionar o sindicato e gerar valor', () => {
          cy.intercept('GET', 'https://sitcargaapitest/rntrc/PrePedido/listarentidadesdisponiveis**').as('listaSindicatos')
          cy.intercept('GET', '**/valor**').as('tabela')   
          cy.acessarPedido(idPrePedido)
          cy.url().should('include', `detalhe`)
          cy.wait('@gridoperacao')
          
          cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible').click({force: true})
  
  
          cy.get(path.generic.title, {timeout: 10000})
          .contains('Escolha Ponto de Atendimento')
          
          cy.get(path.checkoutAtendimentoPage.pontosAtendimento, {timeout: 10000}).click({force: true})
          cy.wait('@listaSindicatos')
          cy.get(path.checkoutAtendimentoPage.listaSindicatos, {timeout: 10000}).contains(sindicato.sigla, {timeout: 20000})
          .click({force: true})         
          cy.wait('@tabela')        
          
          cy.get(path.generic.tabela, {timeout: 30000})
          .then((ele) => {
            
            cy.log(ele.text())
            
              cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Inclusão de Automotor')
              cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$231.00')
              cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '3')
              cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$693.00')
          
              cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-left`).should('have.text', 'Revalidação de Transportador (Gratuito)')
              cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(2)`).should('have.text', 'R$0.00')
              cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-center`).should('have.text', '1')
              cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(4)`).should('have.text', 'R$0.00')
          
              cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-left`).should('have.text', 'Inclusão de Implemento')
              cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(2)`).should('have.text', 'R$154.00')
              cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-center`).should('have.text', '2')
              cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(4)`).should('have.text', 'R$308.00')
              cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$1001.00')          
            
          });
          
          cy.get(path.checkoutAtendimentoPage.botaoConfirmar1).click({force: true});
        
        
                                  // ------ Validação do pedido  -------//         
             
            
         
          cy.get('.q-stepper__tab--active > .q-stepper__label > .q-stepper__title')
          .contains('Validar Atendimento');
      
          cy.get('.text-6').contains('Atendimento Válido')
          cy.wait('@validarpedido')        
          cy.get(path.checkoutAtendimentoPage.botaoConfirmar2, {timeout: 10000}).click({force: true})
      
          cy.get(path.generic.title, {timeout: 10000}).contains('Confira o Resumo do Pedido');
      
          cy.get(path.generic.tabela, {timeout: 30000})
          .then((ele) => {
            
            cy.log(ele.text())
            
            cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Inclusão de Automotor')
            cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$231.00')
            cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '3')
            cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$693.00')
        
            cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-left`).should('have.text', 'Revalidação de Transportador (Gratuito)')
            cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(2)`).should('have.text', 'R$0.00')
            cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-center`).should('have.text', '1')
            cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(4)`).should('have.text', 'R$0.00')
        
            cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-left`).should('have.text', 'Inclusão de Implemento')
            cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(2)`).should('have.text', 'R$154.00')
            cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-center`).should('have.text', '2')
            cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(4)`).should('have.text', 'R$308.00')
            cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$1001.00')            
              
              cy.get(path.generic.email).type(fakerBr.internet.email())
      
              cy.get(path.generic.finalizar).click({force: true})
      
              cy.get('.q-ml-sm').should('have.text', 'Confirma a finalização do atendimento?')
              //cy.get('.q-card__actions > :nth-child(1) > .q-btn__content').should('have.text', 'OK').click()
      
              // cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]', {timeout: 20000}).should('be.visible')
      
              // cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]', {timeout: 20000}).should('not.exist')*/
              cy.wait('@finalizarpedido', {timeout: 120000})
  
          })     
      });
         
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

