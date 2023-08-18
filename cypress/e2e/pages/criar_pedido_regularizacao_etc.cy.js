import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../selectors/path.sel.cy';

let usuario;
  let cpfCnpj = '03113177000192'
  let idPrePedido = '2071293'
  var fakerBr = require('faker-br');
  
beforeEach(() => {
  cy.fixture('usuario').then((data) => {
    usuario = data;
  });
  cy.reload();  
  cy.viewport(1280, 720);
  cy.wait(2000)
});

describe('Grupo de teste Atendimento Renovação', () => {  
  
    it(' Abrir Atendimento de Renovação', () => {
  
      cy.viewport(1280, 720);
      //Logar na página com o usuario
      cy.login(usuario.cpf, usuario.senha);
  
      //Clicar na opção Regularização RNTRC no menu lateral
      cy.regularizacao();
      //Selecionando o tipo de atendimento Renovação RNTRC
      cy.get(path.regularizacaoPage.tipoAtendimento).click();
      //
      cy.get(path.criarPedidoRenovacao.inputTransportador)
        .click()
        .getElementListXpath(
          path.criarPedidoRenovacao.tipoTransportador,
          'Empresa'
        );
      
      cy.xpath(path.criarPedidoRenovacao.inputETC).type(cpfCnpj);
      cy.get(path.generic.botaoSubmit).click({ force: true });
      
     cy.get(path.generic.mensagemFeliz).then((element) => {      
          expect('Atendimento criado com sucesso!').to.be.equal(element.text())
          cy.get(path.generic.mensagemFechar).click();      
        }     
      )
  
      cy.get(path.generic.idAtendimento).then((element)=> {
        idPrePedido = element.text();
        expect(`Atendimento #${idPrePedido}`).to.be.equal(`Atendimento #${idPrePedido}`)
      })
    });       
    
    it('Criar operação Salvar transportador', () => {
      cy.login(usuario.cpf, usuario.senha);
      cy.acessarPedido(idPrePedido);
        cy.salvarTransportador(faker)
    });  
      
    it('Criar operação Enviar documentos do tipo Identidade', () => {
        //operação de enviar documentos
      //Clicando no botão com a lista de operações e escolhendo a operação  Enviar Documentos  
      
      cy.login(usuario.cpf, usuario.senha);
      cy.acessarPedido(idPrePedido);
      cy.enviarDocumentosIdentidade('D:/Imagens para teste/Apresentação .pdf')
      
    });  
      
    it('Criar operação Enviar documento do tipo Registro RT ', () => {
        
      //operação de enviar documentos
      //Clicando no botão com a lista de operações e escolhendo a operação  Enviar Documentos  
      cy.login(usuario.cpf, usuario.senha);
      cy.acessarPedido(idPrePedido);
      cy.enviarDocumentosRT('D:/Imagens para teste/Apresentação .pdf')
     
    }); 
      
    it('Criar operação Incluir Contato Email', () => {
      cy.login(usuario.cpf, usuario.senha)
      cy.acessarPedido(idPrePedido)
      cy.incluirContatoEmail(faker)      
    }); 
  
    it('Criar operação Incluir Contato Celular', () => {
      cy.login(usuario.cpf, usuario.senha)
      cy.acessarPedido(idPrePedido)
      cy.incluirContatoCelular(faker)      
    });       
  
    it('Criar operação Incluir Contato Telefone', () => {
      cy.login(usuario.cpf, usuario.senha)
      cy.acessarPedido(idPrePedido)
      cy.incluirContatoTelefone(faker)     
    });   
      
    it('Criar operação Incluir Contato Fax', () => {
      cy.login(usuario.cpf, usuario.senha)
      cy.acessarPedido(idPrePedido)
      cy.incluirContatoFax(faker)     
    });    
      
    it('Criar operação Excluir Contato Email', () => {
      cy.login(usuario.cpf, usuario.senha)
      cy.acessarPedido(idPrePedido)
      cy.incluirContatoEmail(faker)      
    }); 
  
    it('Criar operação Excluir Contato Telefone', () => {
     // cy.login(usuario.cpf, usuario.senha)
      //cy.acessarPedido(idPrePedido)
      cy.xpath(path.generic.floatButton, {timeout: 10000}).click({force: true})
      .get('[data-cy=operacao]', {timeout: 10000})   
      .each(($ele, index, list) => {
          if ($ele.text() === 'Excluir Contato') 
          cy.wrap($ele).click();      
      })
      cy.get(path.generic.title, {timeout: 10000}).should('have.text', 'Excluir Contato')
      cy.get(path.operacaoIncluirContato.tipoContato).click()
      .xpath('/html/body/div[8]/div/div[2]/div[4]/div[2]/div/span')
      .should('have.text', 'Telefone').click()      
      cy.get(path.operacaoIncluirContato.tipoContatoValor).type(faker.internet.email(),)    
      cy.get(path.operacaoIncluirContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
      cy.get(path.generic.botaoSubmit).click()
    }); 
    
      it('Criar operação Excluir Contato Celular', () => {
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)
        cy.xpath(path.generic.floatButton, {timeout: 10000}).click({force: true})
        .get('[data-cy=operacao]', {timeout: 10000})   
        .each(($ele, index, list) => {
            if ($ele.text() === 'Excluir Contato') 
            cy.wrap($ele).click();      
        })
        cy.get(path.generic.title, {timeout: 10000}).should('have.text', 'Excluir Contato')
        cy.get(path.operacaoIncluirContato.tipoContato).click()
        .xpath('/html/body/div[8]/div/div[2]/div[4]/div[2]/div/span')
        .should('have.text', 'Celular').click()      
        cy.get(path.operacaoIncluirContato.tipoContatoValor).type(faker.internet.email(),)    
        cy.get(path.operacaoIncluirContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
        cy.get(path.generic.botaoSubmit).click()
      });   
    
      it('Criar operação Excluir Contato Fax', () => {
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)
        cy.xpath(path.generic.floatButton, {timeout: 10000}).click({force: true})
        .get('[data-cy=operacao]', {timeout: 10000})   
        .each(($ele, index, list) => {
            if ($ele.text() === 'Excluir Contato') 
            cy.wrap($ele).click();      
        })
        cy.get(path.generic.title, {timeout: 10000}).should('have.text', 'Excluir Contato')
        cy.get(path.operacaoIncluirContato.tipoContato).click()
        .xpath('/html/body/div[8]/div/div[2]/div[4]/div[2]/div/span')
        .should('have.text', 'Fax').click()      
        cy.get(path.operacaoIncluirContato.tipoContatoValor).type(faker.internet.email(),)    
        cy.get(path.operacaoIncluirContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
        cy.get(path.generic.botaoSubmit).click()
      }); 
    
      it('Criar operação Incluir Endereço Comercial', () => {
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)
        cy.incluirEnderecoComercial(fakerBr)
      });
      
      it('Criar operação Incluir Endereço Correspondência', () => {
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)
        cy.incluirEnderecoCorrespondencia(fakerBr)
      });
        
      it('Criar operação Incluir Gestor', () => {
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)
        cy.incluirGestor(fakerBr)
      });
      
      it('Criar operação Incluir Filial', () => {
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)
        cy.incluirFilial(fakerBr)
      });

      it('Criar operação Incluir Responsável Técnico', () => {
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)
        cy.incluirResponsavelTecnico(fakerBr, faker)
      });

      it('Criar operação Incluir Veiculo Automotor/Leasing e Automotor/arrendado', () => {
        let veiculo1 = {
         placa: 'IAQ-9412',
         renavam: '00562957308',
         tipoVeiculo: 'Automotor',
         propriedade: 'Leasing',
         proprietario: ''
        }

        let veiculo2 = {
          placa: 'DAY-7G42',
          renavam: '00772718105',
          tipoVeiculo: 'Automotor',
          propriedade: 'Arrendado',
          proprietario: '09562140709'
         }
        
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)
        cy.incluirVeiculo(veiculo1)
        cy.incluirVeiculo(veiculo2)
      });

      it('Criar operação Incluir Veiculo Automotor/Arrendado', () => {
        let veiculo = {
         placa: 'DAY-7G42',
         renavam: '00772718105',
         tipoVeiculo: 'Automotor',
         propriedade: 'Arrendado',
         proprietario: '09562140709'
        }
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)
        cy.incluirVeiculo(veiculo)
      });

      it('Criar operação Incluir Veiculo SEMI-REBOQUE/Arrendado', () => {
        let veiculo = {
         placa: 'BSG1253',
         renavam: '00411395718',
         tipoVeiculo: 'Implemento',
         propriedade: 'Arrendado',
         proprietario: '07866722000172'
        }
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)
        cy.incluirVeiculo(veiculo)
      });

      it('Anexar crlv na operação de inclusão de veículo', () => {
        let selectFile = {
         crlv: 'D:/Imagens para teste/Apresentação .pdf',
         contratoArrendamento: 'D:/Imagens para teste/ALAN MAIA - INFORME REND 2022.pdf'
        }        
        let veiculo = { placa: 'IAQ9412', propriedade: 'Próprio' } 

        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)
        cy.anexarDocumentosVeiculo(selectFile, veiculo )
      });

      it('Selecionar o sindicato e gerar valor  ', () => {
        
        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)
        cy.get(path.generic.botaoConfirmar, {timeout: 10000}).trigger('mouseover').click({force: true})

        cy.get(path.generic.title, {timeout: 10000})
        .should('have.text', 'Selecione o Ponto de Atendimento')

        cy.get(path.confirmarAtendimento.pontosAtendimento, {timeout: 10000})
        .each((ele, index, list) => {
            let value = ele.text()
            if (value === 'SETCAL') 
            cy.wrap($ele).click();      
        
        })

        cy.get(`[data-cy=tabela]`, {timeout: 10000})
        .then((ele) => {
          
          cy.log(ele.text())
           
             cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Inclusão de Automotor')
             cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$231.00')
             cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '2')
             cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$462.00')

             cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-left`).should('have.text', 'Revalidação de Transportador (Gratuito)')
             cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(2)`).should('have.text', 'R$0.00')
             cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-center`).should('have.text', '1')
             cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(4)`).should('have.text', 'R$0.00')

             cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-left`).should('have.text', 'Inclusão de Implemento')
             cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(2)`).should('have.text', 'R$154.00')
             cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-center`).should('have.text', '1')
             cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(4)`).should('have.text', 'R$154.00')
             cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(4)`).should('have.text', 'R$154.00')
             cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$616.00')

                 
            //  cy.wrap(ele).get(`tbody>:nth-child(${index + 1})>.text-left`).should('have.text', 'Inclusão de Automotor')
            //  cy.wrap(ele).get(`tbody>:nth-child(${index + 1})>:nth-child(2)`).should('have.text', 'R$231.00')
            //  cy.wrap(ele).get(`tbody>:nth-child(${index + 1})>.text-center`).should('have.text', '2')
            //  cy.wrap(ele).get(`tbody>:nth-child(${index + 1})>:nth-child(4)`).should('have.text', 'R$462.00')
           
        });

        cy.get(path.generic.botaoConfirmar).click({force: true});
      });

      it.only('Validação do pedido - Pedido rejeitado', () => {

        let selectFile = {
          crlv: 'D:/Imagens para teste/Apresentação .pdf',
          contratoArrendamento: 'D:/Imagens para teste/ALAN MAIA - INFORME REND 2022.pdf'
         }        
         let veiculo = { placa: 'BSG1253', propriedade: 'Arrendado' }

        cy.login(usuario.cpf, usuario.senha)
        cy.acessarPedido(idPrePedido)
        
        cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible').trigger('mouseover').click({force: true}).click();

        cy.get(path.generic.title, {timeout: 10000})
        .should('have.text', 'Selecione o Ponto de Atendimento')

        cy.get(path.confirmarAtendimento.pontosAtendimento, {timeout: 10000})
        .each((ele, index, list) => {
            let value = ele.text()
            if (value === 'SETCAL') 
            cy.wrap($ele).click();      
        
        })

        cy.get(`[data-cy=tabela]`, {timeout: 20000})
        .then((ele) => {
          
          cy.log(ele.text())
           
             cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-left`).should('have.text', 'Inclusão de Automotor')
             cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(2)`).should('have.text', 'R$231.00')
             cy.wrap(ele).get(`tbody>:nth-child(${1})>.text-center`).should('have.text', '2')
             cy.wrap(ele).get(`tbody>:nth-child(${1})>:nth-child(4)`).should('have.text', 'R$462.00')

             cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-left`).should('have.text', 'Revalidação de Transportador (Gratuito)')
             cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(2)`).should('have.text', 'R$0.00')
             cy.wrap(ele).get(`tbody>:nth-child(${2})>.text-center`).should('have.text', '1')
             cy.wrap(ele).get(`tbody>:nth-child(${2})>:nth-child(4)`).should('have.text', 'R$0.00')

             cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-left`).should('have.text', 'Inclusão de Implemento')
             cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(2)`).should('have.text', 'R$154.00')
             cy.wrap(ele).get(`tbody>:nth-child(${3})>.text-center`).should('have.text', '1')
             cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(4)`).should('have.text', 'R$154.00')
             cy.wrap(ele).get(`tbody>:nth-child(${3})>:nth-child(4)`).should('have.text', 'R$154.00')
             cy.get('.q-table__bottom > .q-item__section--side').should('have.text', ' R$616.00')

                 
            //  cy.wrap(ele).get(`tbody>:nth-child(${index + 1})>.text-left`).should('have.text', 'Inclusão de Automotor')
            //  cy.wrap(ele).get(`tbody>:nth-child(${index + 1})>:nth-child(2)`).should('have.text', 'R$231.00')
            //  cy.wrap(ele).get(`tbody>:nth-child(${index + 1})>.text-center`).should('have.text', '2')
            //  cy.wrap(ele).get(`tbody>:nth-child(${index + 1})>:nth-child(4)`).should('have.text', 'R$462.00')
           
        });

        cy.get(path.generic.botaoConfirmar).click({force: true});
        cy.get('.q-stepper__tab--active > .q-stepper__label > .q-stepper__title').should('have.text', 'Validação do Pedido');
        cy.get('.text-6').should('have.text', ' Atendimento Inválido ');
        cy.get('.q-stepper__step-inner > .q-list > :nth-child(1) > .q-item__section > :nth-child(1)')
        .should('have.text', 'Imagem de Contrato de Arrendamento Obrigatória.')
        cy.get('.q-stepper__step-inner > .q-list > :nth-child(1) > .q-item__section > .q-item__label--caption')
        .should('have.text', 'É necessário realizar upload do contrato de arrendamento para a placa BSG1253')

        cy.get('.q-stepper__step-inner > .q-list > :nth-child(3) > .q-item__section > :nth-child(1)')
        .should('have.text', 'Imagem do CLRV Obrigatória.')
        cy.get('.q-stepper__step-inner > .q-list > :nth-child(3) > .q-item__section > .q-item__label--caption')
        .should('have.text', 'É necessário realizar upload do CLRV para a placa BSG1253')
        
        cy.xpath('/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/div/div[4]/a').click() 
        
        cy.anexarDocumentosVeiculo(selectFile, veiculo )

        cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible').click()        

        cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible').click()

        cy.get('.text-6').should('have.text', 'Atendimento Válido')

        cy.get(path.generic.botaoConfirmar, {timeout: 10000}).should('be.visible').click()

        
      });

});