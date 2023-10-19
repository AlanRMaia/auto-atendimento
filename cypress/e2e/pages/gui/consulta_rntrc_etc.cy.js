/// <reference types="Cypress"/>
import path from '../../../selectors/path.sel.cy';
import mensagem from "../../../support/mensagemAlertEnum";
import urls from '../../../support/urls';

const transportador = {
    cpfCnpj: "88.832.738/0001-66",
    nome: "ETC - RODOVIÁRIO CORSO LTDA-EPP",
    rntrc: "000010227",
    situacao: "ATIVO",
    saldo: "R$ 0,00",
    sigla: "ETC",
    tipo: "Empresa"
  };
  const revalidacao = 'Aguarde, a Revalidação Ordinária ainda não é necessária.'

describe('', () => {
    beforeEach(() => {

        cy.reload()     
         cy.intercept('GET', `**/rntrc/PrePedido/**`).as('gridoperacao')
         cy.intercept('GET', '**/rntrc/cidade/listarCidades**').as('cidade') 
         cy.intercept('GET', '**/rntrc/Transportador/Consultar/porlocalidade?**').as('lista')  
         cy.intercept('GET', '**/rntrc/Transportador/Consultar?cpfCnpj=**').as('consultarTRP')
         cy.viewport(1920, 1080);
         cy.login()    
         
       });
    
    it('Consultando Empresa pela localidade ', () => {

        //Clicar na opção Consulta RNTRC no menu lateral
        cy.consultaRNTRC()
        cy.wait('@gridoperacao')
        cy.get(path.consultaRNTRCPage.radioPorLocalidade).click({force:true});

        cy.get(path.consultaRNTRCPage.tipoTransportador).click({force: true})
        .get(path.generic.listaVirtual)
        .contains('Empresa').click({force: true})               

        cy.get(path.consultaRNTRCPage.uf).click({force: true}).type('São Paulo')  
        .get(path.generic.listaVirtual)        
        .contains('São Paulo').click({force: true})
        cy.wait('@cidade')

        cy.get(path.consultaRNTRCPage.municipios).type('ALTO ALEGRE',{force: true})
        cy.wait('@cidade')
        cy.get(path.generic.listaVirtual)        
        .contains('ALTO ALEGRE').click({force: true})        
        //Logar na página com o usuario       
        cy.get(path.generic.botaoSubmit).click({force: true})
        cy.wait('@lista')        

        cy.get('tbody > :nth-child(1) > :nth-child(1)').should('have.text', 'ALTO MATÃO TRANSPORTES RODOVIARIOS LTDA - EPP')
        cy.get('tbody > :nth-child(1) > :nth-child(2)').should('have.text', '08.738.291/0001-21')
        cy.get('tbody > :nth-child(1) > .text-left').should('have.text', '047990526')
        cy.get('tbody > :nth-child(1) > :nth-child(4)').should('have.text', '08/10/2014')
        cy.get('tbody > :nth-child(1) > :nth-child(5)').should('have.text', 'ATIVO')
        cy.get(':nth-child(3) > .q-table__bottom-item').should('have.text', '1-10 de 23')

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