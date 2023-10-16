/// <reference types="Cypress"/>
import path from '../../../selectors/path.sel.cy';
import mensagem from "../../../support/mensagemAlertEnum";
import urls from '../../../support/urls';

const transportador = {
    cpfCnpj: "143.854.008-65",
    nome: "TAC - NAILTON NIVALDO SOARES",
    rntrc: "000010100",
    situacao: "ATIVO",
    saldo: "R$ 0,00",
    sigla: "TAC",
    tipo: "Autônomo"
  };

  const revalidacao = 'Aguarde, a Revalidação Ordinária ainda não é necessária.'


describe('', () => {
    beforeEach(() => {
     cy.reload()     
      cy.intercept('GET', `https://sitcargaapitest/rntrc/PrePedido/**`).as('gridoperacao')
      cy.intercept('GET', 'https://sitcargaapitest/rntrc/cidade/listarCidades**').as('cidade') 
      cy.intercept('GET', 'https://sitcargaapitest/rntrc/Transportador/Consultar/porlocalidade?**').as('lista')  
      cy.intercept('GET', 'https://sitcargaapitest/rntrc/Transportador/Consultar?cpfCnpj=**').as('consultarTRP')      
      cy.viewport(1920, 1080);
      cy.login()  
      
    });
    
    it('Consultando Autômotor pela localidade ', () => {

        //Clicar na opção Consulta RNTRC no menu lateral
        cy.consultaRNTRC()
        cy.wait('@gridoperacao')
        cy.get(path.consultaRNTRCPage.radioPorLocalidade).click({force:true});

        cy.get(path.consultaRNTRCPage.tipoTransportador).click({force: true})
        .get(path.generic.listaVirtual)
        .contains('Autônomo').click({force: true})        

        cy.get(path.consultaRNTRCPage.uf).click({force: true}).type('Espírito Santo')  
        .get(path.generic.listaVirtual)        
        .contains('Espírito Santo').click({force: true})
        cy.wait('@cidade')
        
        cy.get(path.consultaRNTRCPage.municipios).type('ALEGRE',{force: true})
        cy.wait('@cidade')
        cy.get(path.generic.listaVirtual)        
        .contains('ALEGRE').click({force: true})
        //Logar na página com o usuario
        cy.get(path.generic.botaoSubmit).click({force: true})
        cy.wait('@lista')

        cy.get('tbody > :nth-child(1) > :nth-child(1)').should('have.text', 'ABELINO ANTONIO ROGAI')
        cy.get('tbody > :nth-child(1) > :nth-child(2)').should('have.text', '031.750.407-05')
        cy.get('tbody > :nth-child(1) > .text-left').should('have.text', '000879803')
        cy.get('tbody > :nth-child(1) > :nth-child(4)').should('have.text', '30/11/2004')
        cy.get('tbody > :nth-child(1) > :nth-child(5)').should('have.text', 'ATIVO')
        cy.get(':nth-child(3) > .q-table__bottom-item').should('have.text', '1-10 de 223')

        cy.get(path.consultaRNTRCPage.radioPorTransportador).click({force: true});
        cy.get(path.consultaRNTRCPage.cpfCnpj).type(transportador.cpfCnpj, {force: true})

        cy.get(path.generic.botaoSubmit).click({force: true})
        cy.wait('@consultarTRP', {timeout: 180000})

        cy.get(path.consultaRNTRCPage.cpfCnpjResultado).contains(transportador.cpfCnpj)
        cy.get(path.consultaRNTRCPage.rntrcResultado).then((texto) => {
            const valor  = texto.text()
            expect(valor).to.be.contains(`RNTRC: ${transportador.rntrc}`)
        })       
        
        cy.get('.q-pt-md > :nth-child(2) > strong').contains(revalidacao)
        
        cy.get(path.consultaRNTRCPage.rntrc).type(transportador.rntrc)

        cy.get(path.generic.botaoSubmit).click({force: true})
        cy.wait('@consultarTRP', {timeout: 180000})


        cy.get(path.consultaRNTRCPage.cpfCnpjResultado).contains(transportador.cpfCnpj)
        cy.get(path.consultaRNTRCPage.rntrcResultado).then((texto) => {
            const valor  = texto.text()
            expect(valor).to.be.contains(`RNTRC: ${transportador.rntrc}`)
        }) 
        
        cy.get(path.consultaRNTRCPage.cpfCnpj).clear()

        cy.get(path.consultaRNTRCPage.rntrc).type(transportador.rntrc)

        cy.get(path.generic.botaoSubmit).click({force: true})
        cy.wait('@consultarTRP', {timeout: 180000})

        cy.get(path.consultaRNTRCPage.cpfCnpjResultado).contains(transportador.cpfCnpj)
        cy.get(path.consultaRNTRCPage.rntrcResultado).then((texto) => {
            const valor  = texto.text()
            expect(valor).to.be.contains(`RNTRC: ${transportador.rntrc}`)
        })
           
    });

    

});