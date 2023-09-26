
import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";
import urls from '../../support/urls';
var fakerBr = require('faker-br');

let senha;
let cpf;


describe('Iniciando so testes de criação de login e acessar a página', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        senha = faker.internet.password()      
        cpf = fakerBr.br.cpf()
    });
    
    
    it('Acesso a página home e clicar em Cadastre-se', () => {  
        cy.visit(urls.home)
        cy.get(path.institucionalPage.cadastro).contains('Cadastre-se').click({force: true})

        cy.get(path.loginCadatsro.sejaBemVindo, {timeout: 20000}).should('have.text', ' Seja bem-vindo(a)! ')
        cy.get(path.loginCadatsro.nome).type(fakerBr.name.firstName())
        cy.get(path.loginCadatsro.cpf).type(cpf)
        cy.get(path.loginCadatsro.email).type(faker.internet.email())
        cy.get(path.loginCadatsro.celular).type(faker.phone.number('(##)#####-####'))
        
        cy.get(path.loginCadatsro.senha).type(senha)
        cy.get(path.loginCadatsro.confirmeSenha).type(senha)
        cy.get(path.loginCadatsro.cnpj).type(fakerBr.br.cnpj())

        cy.get(path.generic.botaoSubmit).click({force: true});
        cy.notificacao(mensagem.CadastroSucesso)   

        cy.get(path.loginPage.sejaBemVindo, {timeout: 20000}).should('have.text', ' Seja bem-vindo(a)! ')
        cy.get(path.loginPage.cpf).type(cpf)
        cy.get(path.loginPage.senha).type(senha)
        cy.get(path.generic.botaoSubmit).click({force: true});

    });

});