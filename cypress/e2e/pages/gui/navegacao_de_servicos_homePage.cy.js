/// <reference types="Cypress"/>
import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../../selectors/path.sel.cy';
import mensagem from "../../../support/mensagemAlertEnum";

const usuario = Cypress.env('usuario')
describe('Grupo de testes navegação de serviços', () => {
    beforeEach(() => {        
        cy.reload();  
        cy.viewport(1920, 1080);
      });

      it('Emitir novo RNTRC', () => {
        cy.visit('/')
        cy.getElementList(path.institucionalPage.tipoAtendimento, 'Emitir Novo RNTRC')
        //login
        cy.get(path.loginPage.cpf, {timeout:20000}).type(usuario.cpf);
        cy.get(path.loginPage.senha).type(usuario.senha);
        cy.get(path.generic.botaoSubmit).click({force: true});
        cy.get(path.generic.title, {timeout: 20000}).contains('Novo RNTRC')
      });

      //RenovaçãoRNTRC

      it.only('Renovação RNTRC', () => {
        cy.visit('/')
        cy.getElementList(path.institucionalPage.tipoAtendimento, 'RenovaçãoRNTRC')
        //login
        cy.get(path.loginPage.cpf, {timeout:20000}).type(usuario.cpf);
        cy.get(path.loginPage.senha).type(usuario.senha);
        cy.get(path.generic.botaoSubmit).click({force: true});
        cy.get(path.generic.title, {timeout: 20000}).contains('Renovação RNTRC')

      });

      //Gestão de Frota

      it('Gestão de Frota', () => {
        cy.visit('/')
        cy.getElementList(path.institucionalPage.tipoAtendimento, 'Gerenciamento deFrota')
        //login
        cy.get(path.loginPage.cpf, {timeout:20000}).type(usuario.cpf);
        cy.get(path.loginPage.senha).type(usuario.senha);
        cy.get(path.generic.botaoSubmit).click({force: true});
        cy.get(path.generic.title, {timeout: 20000}).contains('Gestão de Frota')
        //cy.get(path.criarPedidoPage).should('have.text', 'Tipo de Atendimento: Gerenciamento de Frota')
        //TODO no aguardo para o novo layout para o serviço de gerenciamento de frota    
      });

      //Consulta RNTRCe Frota

      it('Consulta RNTRC e Frota', () => {
        cy.visit('/')
        cy.getElementList(path.institucionalPage.tipoAtendimento, 'Consulta RNTRCe Frota')
        //login
        cy.get(path.loginPage.cpf, {timeout:20000}).type(usuario.cpf);
        cy.get(path.loginPage.senha).type(usuario.senha);
        cy.get(path.generic.botaoSubmit).click({force: true});
        cy.get(path.generic.title, {timeout: 20000}).contains('Consulta RNTRC')
        //cy.get(path.criarPedidoPage).should('have.text', 'Tipo de Atendimento: Renovação RNTRC')

      });
      //Emissão deDocumentos

      it('Emissão de Documentos', () => {
        cy.visit('/')
        cy.getElementList(path.institucionalPage.tipoAtendimento, 'Emissão deDocumentos')
        //login
        cy.get(path.loginPage.cpf, {timeout:20000}).type(usuario.cpf);
        cy.get(path.loginPage.senha).type(usuario.senha);
        cy.get(path.generic.botaoSubmit).click({force: true});
        cy.get(path.generic.title, {timeout: 20000}).contains('Consultar Atendimentos')

      });
      //Outros

      it('Outros', () => {
        cy.visit('/')

        cy.get(path.institucionalPage.tipoAtendimento).contains('Outros').click()
        //cy.getElementList(path.institucionalPage.tipoAtendimento, 'Outros ')
        //login
        cy.get(path.loginPage.cpf, {timeout:20000}).type(usuario.cpf);
        cy.get(path.loginPage.senha).type(usuario.senha);
        cy.get(path.generic.botaoSubmit).click({force: true});
        cy.get(path.generic.title, {timeout: 20000}).contains('Consultar Atendimentos')

      });
      


});