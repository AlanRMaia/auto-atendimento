import { faker } from '@faker-js/faker/locale/pt_BR';
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
      
      it.only('Criar operação Incluir Endereço Correspondência', () => {
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
});