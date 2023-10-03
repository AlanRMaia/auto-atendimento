
import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";
import urls from '../../support/urls';

let usuario;
var fakerBr = require('faker-br');


describe('Grupo de teste para o processo de Esqueceu a senha', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.fixture('usuarioDespachante01').then((data) => {
            usuario = data;
          });
    });   
    

    it('clicar em Esqueceu a senha?', () => {
        cy.visit(urls.home)
        cy.get(path.institucionalPage.login).should('have.text', 'Entrar').click({force: true})  
        cy.get(path.loginPage.sejaBemVindo, {timeout: 20000}).should('have.text', ' Seja bem-vindo(a)! ')
        
        cy.get(path.loginPage.esqueceuSenha).should('have.text', 'Esqueceu a senha?').click({force: true});

        cy.get(path.loginCadastro.sejaBemVindo, {timeout: 20000}).should('have.text', ' Seja bem-vindo(a)! ')
    });

    it('Clicando no link Esqueceu a senha?', () => {
        cy.visit(urls.home)
        cy.get(path.institucionalPage.login).should('have.text', 'Entrar').click({force: true})  
        cy.get(path.loginPage.sejaBemVindo, {timeout: 20000}).should('have.text', ' Seja bem-vindo(a)! ')

        cy.get(path.loginPage.esqueceuSenha).should('have.text', 'Esqueceu a senha?').click({force: true})
        cy.get(path.esqueceuSenhaPage.validacao, {timeout: 20000})
        .should('have.text', ' Informe seu CPF e enviaremos as instruções de redefinição de senha para seu e-mail cadastrado. ')

        cy.get(path.esqueceuSenhaPage.cpf).type(usuario.cpf);
        cy.get(path.generic.botaoSubmit).should('have.text', 'Enviar').click({force: true});

        cy.intercept('POST', 'https://sitcargaapidevelop/gestao/usuario/esqueciminhasenha?usuario=66248686009').as('envioEmailStatus')    

        cy.wait('@envioEmailStatus').its('response.statusCode').then(response => {
            expect(response).to.be.equal(200)
        })

        cy.notificacao('Siga as instruções enviadas para o seu e-mail cadastrado.')        

    });    

});