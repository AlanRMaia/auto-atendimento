
import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";
import urls from '../../support/urls';

let usuario;


describe('', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.fixture('usuario').then((data) => {
            usuario = data;
          });
    });
    
    it('Consultando Autômotor pela localidade ', () => {

        cy.login(usuario.cpf, usuario.senha)        
        //Clicar na opção COnsulta RNTRC no menu lateral
        cy.consultaRNTRC()
        cy.get(path.consultaRNTRCPage.radioPorLocalidade).click({force:true});

        cy.get(path.consultaRNTRCPage.tipoTransportador).click({force: true})
        .xpath('/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span')
        .should('have.text', 'Autônomo').click({force: true})        

        cy.get(path.consultaRNTRCPage.uf).click({force: true})  
        .xpath('/html/body/div[8]/div/div[2]/div[8]/div[2]/div/span')
        .should('have.text', 'Espírito santo').click({force: true})

        cy.get(path.consultaRNTRCPage.municipios).click({force: true})  
        .xpath('/html/body/div[8]/div/div[2]/div[7]/div[2]/div')
        .should('have.text', 'ALEGRE').click({force: true})
        //Logar na página com o usuario       

        cy.get(path.generic.botaoSubmit).click({force: true})

        cy.get('tbody > :nth-child(1) > :nth-child(1)').should('have.text', 'ABELINO ANTONIO ROGAI')
        cy.get('tbody > :nth-child(1) > :nth-child(2)').should('have.text', '031.750.407-05')
        cy.get('tbody > :nth-child(1) > .text-left').should('have.text', '000879803')
        cy.get('tbody > :nth-child(1) > :nth-child(4)').should('have.text', '30/11/2004')
        cy.get('tbody > :nth-child(1) > :nth-child(5)').should('have.text', 'ATIVO')
        cy.get(':nth-child(3) > .q-table__bottom-item').should('have.text', '1-10 de 223')
           
    });

    

});