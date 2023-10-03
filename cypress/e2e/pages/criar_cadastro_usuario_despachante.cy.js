
import { faker } from '@faker-js/faker';
//import { fakerBR } from 'fakerbr';
import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";
import urls from '../../support/urls';
import  conta  from "../../support/TipoContaEnum";
var fakerBr = require('faker-br');

let senha;
let cpf;
let tipoConta;


describe('Iniciando so testes de criação de login e acessar a página', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        senha = faker.internet.password()      
        cpf = fakerBr.br.cpf()
        tipoConta = faker.helpers.enumValue(conta)
    });
    
    
    it('Acesso a página home e clicar em Cadastre-se', () => {  
        cy.visit(urls.home)
        cy.get(path.institucionalPage.cadastro).contains('Cadastre-se').click({force: true})

        cy.get(path.loginCadastro.sejaBemVindo, {timeout: 20000}).should('have.text', ' Seja bem-vindo(a)! ')
        cy.get(path.loginCadastro.codigoTipoConta, {timeout: 10000}).click({force: true});
        cy.get(path.generic.listaVirtual).contains(tipoConta, {timeout: 10000}).click({force: true});
        if (tipoConta == conta.RESPONSAVELLEGAL || tipoConta == conta.RESPONSAVELTECNICO) {
            cy.get(path.loginCadastro.cnpj).type(fakerBr.br.cnpj())            
        }
        cy.get(path.loginCadastro.nome).type(fakerBr.name.firstName())
        cy.get(path.loginCadastro.cpf).type(cpf)
        cy.get(path.loginCadastro.email).type(faker.internet.email())
        cy.get(path.loginCadastro.celular).type(faker.phone.number('(##)#####-####'))
        
        cy.get(path.loginCadastro.senha).type(senha)
        cy.get(path.loginCadastro.confirmeSenha).type(senha)

        cy.get('[type="checkbox"]').check({force: true});

        cy.get(path.generic.botaoSubmit).click({force: true});
        
        cy.get(path.cadastroValidacaoEmail.sejaBemVindo).contains('Código de Verificação do E-mail')

        cy.get(path.loginPage.cpf).type(cpf)
        cy.get(path.loginPage.senha).type(senha)
        cy.get(path.generic.botaoSubmit).click({force: true});

    });

});