
import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";
import urls from '../../support/urls';

let usuario;
var fakerBr = require('faker-br');


describe('', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.fixture('usuarioDespachante01').then((data) => {
            usuario = data;
          });
    });
    
    
    it('Acesso a página home e clicar em Cadastre-se', () => {
        cy.visit(urls.home)
        cy.get(path.institucionalPage.cadastro).should('have.text', 'Cadastre-se').click({force: true})  
        cy.get(path.loginCadatsro.sejaBemVindo, {timeout: 20000}).should('have.text', ' Seja bem-vindo(a)! ')  
    });

    it('Preencher o formulário e clicar em Cadastrar', () => {
        cy.visit(urls.home)
        cy.get(path.institucionalPage.cadastro).should('have.text', 'Cadastre-se').click({force: true})  
        cy.get(path.loginCadatsro.sejaBemVindo, {timeout: 20000}).should('have.text', ' Seja bem-vindo(a)! ')
        cy.get(path.loginCadatsro.nome).type(usuario.nome)
        cy.get(path.loginCadatsro.cpf).type(fakerBr.br.cpf())
        cy.get(path.loginCadatsro.email).type(usuario.email)
        cy.get(path.loginCadatsro.celular).type(usuario.celular)
        cy.get(path.loginCadatsro.senha).type(usuario.senha)
        cy.get(path.loginCadatsro.confirmeSenha).type(usuario.senha)
        cy.get(path.loginCadatsro.cnpj).type(fakerBr.br.cnpj())

        cy.get(path.generic.botaoSubmit).click({force: true});
        cy.notificacao(mensagem.CadastroSucesso)
    });

    it.only('Clicando no link Faça login', () => {
        cy.visit(urls.home)
        cy.get(path.institucionalPage.cadastro).should('have.text', 'Cadastre-se').click({force: true})  
        cy.get(path.loginCadatsro.sejaBemVindo, {timeout: 20000}).should('have.text', ' Seja bem-vindo(a)! ')

        cy.get(path.loginCadatsro.facaLogin).should('have.text', 'Faça o login').click({force: true})
    });

});