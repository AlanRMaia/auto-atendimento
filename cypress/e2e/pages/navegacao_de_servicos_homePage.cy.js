
import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";

  let usuario;

describe('Grupo de testes navegação de serviços', () => {
    beforeEach(() => {
        cy.fixture('usuario').then((data) => {
          usuario = data;
        });
        cy.reload();  
        cy.viewport(1280, 720);
        cy.wait(2000)  
      });

      it('Emitir novo RNTRC', () => {
        cy.visit('http://localhost:9000/#/')
        cy.getElementList(path.institucionalPage.tipoAtendimento, 'Emitir Novo RNTRC')
        //login
        cy.get(path.loginPage.cpf, {timeout:20000}).type(usuario.cpf);
        cy.get(path.loginPage.senha).type(usuario.senha);
        cy.get(path.generic.botaoSubmit).click({force: true});
        cy.get(path.generic.title, {timeout: 20000}).should('have.text', ' Regularização RNTRC ')
        cy.get(path.criarPedidoPage).should('have.text', 'Tipo de Atendimento: Novo RNTRC')

      });

      //RenovaçãoRNTRC

      it('Renovação RNTRC', () => {
        cy.visit('http://localhost:9000/#/')
        cy.getElementList(path.institucionalPage.tipoAtendimento, 'RenovaçãoRNTRC')
        //login
        cy.get(path.loginPage.cpf, {timeout:20000}).type(usuario.cpf);
        cy.get(path.loginPage.senha).type(usuario.senha);
        cy.get(path.generic.botaoSubmit).click({force: true});
        cy.get(path.generic.title, {timeout: 20000}).should('have.text', ' Regularização RNTRC ')
        cy.get(path.criarPedidoPage).should('have.text', 'Tipo de Atendimento: Renovação RNTRC')

      });

      //Gerenciamento deFrota

      it('Gerenciamento de Frota', () => {
        cy.visit('http://localhost:9000/#/')
        cy.getElementList(path.institucionalPage.tipoAtendimento, 'Gerenciamento deFrota')
        //login
        cy.get(path.loginPage.cpf, {timeout:20000}).type(usuario.cpf);
        cy.get(path.loginPage.senha).type(usuario.senha);
        cy.get(path.generic.botaoSubmit).click({force: true});
        cy.get(path.generic.title, {timeout: 20000}).should('have.text', ' Regularização RNTRC ')
        //cy.get(path.criarPedidoPage).should('have.text', 'Tipo de Atendimento: Gerenciamento de Frota')
        //TODO no aguardo para o novo layout para o serviço de gerenciamento de frota    
      });

      //Consulta RNTRCe Frota

      it('Consulta RNTRC e Frota', () => {
        cy.visit('http://localhost:9000/#/')
        cy.getElementList(path.institucionalPage.tipoAtendimento, 'Consulta RNTRCe Frota')
        //login
        cy.get(path.loginPage.cpf, {timeout:20000}).type(usuario.cpf);
        cy.get(path.loginPage.senha).type(usuario.senha);
        cy.get(path.generic.botaoSubmit).click({force: true});
        cy.get(path.generic.title, {timeout: 20000}).should('have.text', 'Consulta RNTRC')
        //cy.get(path.criarPedidoPage).should('have.text', 'Tipo de Atendimento: Renovação RNTRC')

      });
      //Emissão deDocumentos

      it('Emissão de Documentos', () => {
        cy.visit('http://localhost:9000/#/')
        cy.getElementList(path.institucionalPage.tipoAtendimento, 'Emissão deDocumentos')
        //login
        cy.get(path.loginPage.cpf, {timeout:20000}).type(usuario.cpf);
        cy.get(path.loginPage.senha).type(usuario.senha);
        cy.get(path.generic.botaoSubmit).click({force: true});
        cy.get(path.generic.title, {timeout: 20000}).should('have.text', 'Atendimentos')

      });
      //Outros

      it.only('Outros', () => {
        cy.visit('http://localhost:9000/#/')

        cy.get(path.institucionalPage.tipoAtendimento).contains('Outros').click()
        //cy.getElementList(path.institucionalPage.tipoAtendimento, 'Outros ')
        //login
        cy.get(path.loginPage.cpf, {timeout:20000}).type(usuario.cpf);
        cy.get(path.loginPage.senha).type(usuario.senha);
        cy.get(path.generic.botaoSubmit).click({force: true});
        cy.get(path.generic.title, {timeout: 20000}).should('have.text', 'Atendimentos')

      });
      


});