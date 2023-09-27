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
  let idPrePedido = '2071100';
  const telefone = '(55) 3261-2695'
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
    cy.viewport(1920, 1080);
    cy.login()   
  });
  describe.only('Iniciando os testes na criação do pedido e inclusão das operações', () => {
      
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
            cy.operacaoTransportador(faker, transportador.sigla, idPrePedido)
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
          
          // // ------ Criar operação Excluir Contato Email ------//
          // it('Criar operação Excluir Contato Email', () => { 
          //   
          //   cy.acessarPedido(idPrePedido)       
          //   cy.excluirContatoEmail(faker, )
          //   cy.get(path.generic.mensagemFechar).click({force: true}); 
          //   });

          // ------ Criar operação Incluir Contato Celular -----//
          it('Criar operação Incluir Contato Celular', () => {            
            cy.acessarPedido(idPrePedido)        
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
          it.only('Criar operação Incluir Contato Telefone', () => {            
            cy.acessarPedido(idPrePedido)     
            cy.incluirContatoTelefone(faker)  
            cy.notificacao(mensagem.DadosSalvoSucesso)      
          });
          // ------ Criar operação Excluir Contato Telefone -----//
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
          
          // ------- Criar operação Excluir Contato Fax -------//
          it('Criar operação Excluir Contato Fax', () => {                  
            cy.acessarPedido(idPrePedido)    
            cy.incluirContatoFax(faker)     
            cy.notificacao(mensagem.DadosSalvoSucesso)      
          });       
          
          //-------- Criar operação Incluir Endereço Correspondência --------//
          it.skip('Criar operação Incluir Endereço Correspondência', () => {               
              cy.acessarPedido(idPrePedido)        
            cy.incluirEnderecoCorrespondencia(fakerBr)
            cy.notificacao(mensagem.DadosSalvoSucesso)      
          });  

          //-------- Criar operação Incluir Endereço Comercial --------//
          it.skip('Criar operação Incluir Endereço Comercial', () => { 
              
              cy.acessarPedido(idPrePedido)        
            cy.incluirEnderecoComercial(fakerBr)
            cy.notificacao(mensagem.DadosSalvoSucesso)      
          });
  
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
            
            cy.acessarPedido(idPrePedido)               
          cy.incluirGestor(gestor, transportador.sigla)
          cy.notificacao(mensagem.DadosSalvoSucesso)     
                
        }); 
        
        // ------- Criar operação Alterar Gestor Sócio------// 
        it('Criar operação Alterar Gestor Sócio', () => {
          const gestor = {
            cpfCnpj: '42453708074',
            nome: 'Alan Maia',
            cargo: 'Sócio',
            telefone: '2188888888',
            email: 'texte#@teste.com',
            nascimento: '20/02/20000'
          }
          
          cy.acessarPedido(idPrePedido)               
        cy.alterarGestor(gestor, transportador.sigla)
        cy.notificacao(mensagem.DadosSalvoSucesso)      
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
            
            cy.acessarPedido(idPrePedido)               
          cy.incluirGestor(gestor, transportador.sigla)
          cy.notificacao(mensagem.DadosSalvoSucesso)     
                
        });
  
        // ------- Criar operação Excluir Gestor Responsável legal------// 
        it('Criar operação Excluir Gestor Responsável legal', () => {
          const gestor = {
            cpfCnpj: '18024629534',
            nome: 'DIVALDO JOSÉ MATOS DE LIMA',            
            dataNascimento: '20/05/2005',
            telefone: '2188888888',
            email: 'texte#@teste.com',
            cargo: 'Responsável Legal',
          }
          
          cy.acessarPedido(idPrePedido)               
        cy.excluirGestor(gestor, transportador.sigla)
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
  
          // -------- Criar operação Incluir Filial ------//
          it('Criar operação Incluir Filial', () => { 
            
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
            
            cy.acessarPedido(idPrePedido)        
            cy.excluirResponsavelTecnico(fakerBr, rt)
            cy.notificacao(mensagem.DadosSalvoSucesso)      
          }); 

          // ---------- Criar operação Alterar Responsável Técnico --------//
          it('Criar operação Alterar Responsável Técnico', () => { 
        
            const rt = {
              cpf: '42453708074',
              nome: 'Alan Maia',
              identidade: '2334667895',
              dataNascimento: '20/05/2005'
  
            }
            
            cy.acessarPedido(idPrePedido)        
          cy.alterarResponsavelTecnico(fakerBr, rt)
          cy.get(path.generic.mensagemFechar, {timeout:8000}).click({force: true});      
          }); 

           // ------ Criar operação Documentos Responsável Técnico -----//              
           it('Criar operação Documentos Responsável Técnico', () => {  
                  
            cy.acessarPedido(idPrePedido)      
            cy.enviarDocumentosRT(doc.rg)
            cy.notificacao(mensagem.ArquivoInclusoSucesso, doc.rg)
            });
  
          
  });     
      
      
      describe('Selecionar o sindicato e gerar valor e anexar documento no veiculo inválido', () => {
          
        // ------- Selecionar o sindicato e gerar valor -------//        
        it('Selecionar o sindicato e gerar valor', () => {
          
          cy.acessarPedido(idPrePedido)          
        cy.get(path.generic.botaoConfirmar, {timeout: 10000}).trigger('mouseover').click({force: true})
        
        cy.get(path.generic.title, {timeout: 10000})
        .should('have.text', 'Selecione o Ponto de Atendimento').wait(2000)
        
        cy.get(path.checkoutAtendimentoPage.pontosAtendimento, {timeout: 10000}).clear().type(sindicato.sigla).wait(2000)
        cy.get(path.checkoutAtendimentoPage.listaSindicatos, {timeout: 10000}).should('have.text', sindicato.sigla)
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
      cy.get(path.checkoutAtendimentoPage.listaSindicatos, {timeout: 10000}).should('have.text', sindicato.sigla)
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
      
      cy.anexarDocumentosVeiculo(doc, veiculo03 )
      
      cy.notificacao(mensagem.ContratoArrendamentoSucesso)
      cy.notificacao(mensagem.CRLVSucesso)

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
        describe('Finalizar pedido', () => {
            
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
                  boleto.codigoBarra = value
                  cy.log(value)
                  expect(ele).not.be.null
                })    
              
            });
        });

});