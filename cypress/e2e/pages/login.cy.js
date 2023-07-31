/// <reference types="Cypress"/>
//import { fakerPT_BR as faker} from '@faker-js/faker';

describe('Teste Funcional de login', () => {
  let usuario;

  beforeEach(() => {
    cy.fixture('usuario').then((data) => {
      usuario = data;
    });
    cy.reload();
  });

  it('Deve realizar o login com sucesso', () => {
    cy.viewport(1280, 720);

    cy.login(usuario.cpf, usuario.senha);
  });

  /*it('Deve acessar a página de regularizacao e abrir um atendimento de renovação para empresa ', () => {
      cy.viewport(1280, 720 );
      cy.login(usuario.cpf, usuario.senha);
      cy.regularizacao();
      cy.get(':nth-child(2) > .page-all__card-img').click({force: true})
      cy.get(".q-select > .q-field__inner > .q-field__control > .q-field__control-container > .q-field__native")
      .click({force: true})
      cy.getElementList("/html/body/div[3]/div/div[2]/div[2]/div[2]/div/span", 'Empresa')
      cy.xpath('/html/body/div[1]/div/div[2]/div[2]/div/div/div/form/div[1]/label/div/div[1]/div/input').type('02382953000197')
      cy.get('button.q-btn > .q-btn__content > .block').click({force: true})
      cy.xpath('/html/body/div[2]/div/div[6]/div/div/div/div').should('have.text', 'Atendimento criado com sucesso!' )
    });

   /* it('Testtando API', () => {
      cy.request({
        method: 'POST',
        url: 'https://localhost:7007/swagger/v1/swagger.json/acesso/Identity/login',
        headers: {"Content-type": "application/json"},
        body: {
          cpf: "09562140709",
          senha: "a"
        }
      }).then((response) => {
        expect(response.status).to.equal(200)
      } );
    });*/
});
