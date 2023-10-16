/// <reference types="Cypress"/>
import path from '../../../selectors/path.sel.cy';
import mensagem from "../../../support/mensagemAlertEnum";
import urls from '../../../support/urls';

const transportador = {
    cpfCnpj: "87.573.952/0001-82",
    nome: "CTC - COOPERATIVA AGRICOLA TUPANCIRETA LTDA",
    rntrc: "002136678",
    situacao: "ATIVO",
    saldo: "R$ 0,00",
    sigla: "CTC",
    tipo: "Cooperativa"
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
    
    it('Consultando Empresa pela localidade ', () => {

        //Clicar na opção Consulta RNTRC no menu lateral
        cy.consultaRNTRC()
        cy.wait('@gridoperacao')
        cy.get(path.consultaRNTRCPage.radioPorLocalidade).click({force:true});

        cy.get(path.consultaRNTRCPage.tipoTransportador).click({force: true})
        .get(path.generic.listaVirtual)
        .contains('Cooperativa').click({force: true})        

        cy.get(path.consultaRNTRCPage.uf).click({force: true}).type('Rio de Janeiro')  
        .get(path.generic.listaVirtual)        
        .contains('Rio de Janeiro').click({force: true})
        cy.wait('@cidade') 
        
        cy.get(path.consultaRNTRCPage.municipios).type('DUQUE DE CAXIAS', {force: true})
        cy.wait('@cidade')
        
        cy.get(path.generic.listaVirtual)       
        .contains('DUQUE DE CAXIAS',{timeout: 20000}).click({force: true})       
        //Logar na página com o usuario       

        cy.get(path.generic.botaoSubmit).click({force: true})
        cy.wait('@lista')

        cy.get('tbody > :nth-child(1) > :nth-child(1)').should('have.text', 'COONAST - COOPERATIVA NACIONAL DE SERVIÇOS E TRANSPORTES LTDA')
        cy.get('tbody > :nth-child(1) > :nth-child(2)').should('have.text', '15.024.004/0001-87')
        cy.get('tbody > :nth-child(1) > .text-left').should('have.text', '046589893')
        cy.get('tbody > :nth-child(1) > :nth-child(4)').should('have.text', '19/06/2013')
        cy.get('tbody > :nth-child(1) > :nth-child(5)').should('have.text', 'PENDENTE')
        cy.get(':nth-child(3) > .q-table__bottom-item').should('have.text', '1-4 de 4')

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