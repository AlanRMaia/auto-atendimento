
import path from '../../selectors/path.sel.cy';
import mensagem from "../../support/mensagemAlertEnum";
import urls from '../../support/urls';

let usuario;


describe('', () => {
    beforeEach(() => {
        cy.viewport(1280, 720)
        cy.fixture('usuario').then((data) => {
            usuario = data;
          });
    });
    
    it('Consultando Empresa pela localidade ', () => {

        cy.login(usuario.cpf, usuario.senha)        
        //Clicar na opção Consulta RNTRC no menu lateral
        cy.consultaRNTRC()
        cy.get(path.consultaRNTRCPage.radioPorLocalidade).click({force:true});

        cy.get(path.consultaRNTRCPage.tipoTransportador).click({force: true})
        .xpath('/html/body/div[8]/div/div[2]/div[3]/div[2]/div/span')
        .should('have.text', 'Cooperativa').click({force: true})        

        cy.get(path.consultaRNTRCPage.uf).click({force: true})  
        .xpath('/html/body/div[8]/div/div[2]/div[19]/div[2]/div/span')
        .should('have.text', 'Rio de Janeiro').click({force: true})

        cy.get(path.consultaRNTRCPage.municipios).click({force: true}).type('DUQUE DE CAXIAS')  
        .xpath('/html/body/div[8]/div/div[2]/div/div[2]/div/span')
        .should('have.text', 'DUQUE DE CAXIAS').click({force: true})
        //Logar na página com o usuario       

        cy.get(path.generic.botaoSubmit).click({force: true})

        cy.get('tbody > :nth-child(1) > :nth-child(1)').should('have.text', 'COONAST - COOPERATIVA NACIONAL DE SERVIÇOS E TRANSPORTES LTDA')
        cy.get('tbody > :nth-child(1) > :nth-child(2)').should('have.text', '15.024.004/0001-87')
        cy.get('tbody > :nth-child(1) > .text-left').should('have.text', '046589893')
        cy.get('tbody > :nth-child(1) > :nth-child(4)').should('have.text', '19/06/2013')
        cy.get('tbody > :nth-child(1) > :nth-child(5)').should('have.text', 'PENDENTE')
        cy.get(':nth-child(3) > .q-table__bottom-item').should('have.text', '1-4 de 4')
           
    });

    

});