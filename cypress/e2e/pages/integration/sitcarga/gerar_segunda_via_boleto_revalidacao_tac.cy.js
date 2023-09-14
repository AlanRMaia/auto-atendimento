
import path from '../../../../selectors/path.sel.cy';
import urls from '../../../../support/urls';

let usuario;
 

let boleto = {
  codigoBarra : '',
  nossoNumero : '15801753',
  valorPago: 'R$ 231,00',
  meioPagamento: 'Boleto',
  dataEmissao: '01/08/2023',
  utilizacao: 'NÃO UTILIZADO',
  valorBoleto: 'R$ 231,00',
  situacao: 'PAGO'    
};
const transportador = {
  cpfCnpj: "03.584.489/0001-84",
  nome: "SOMECO S/A SOCIEDADE DE MELHORAMENTOS E COLONIZAÇÃO",
  rntrc: "002253582",
  situacao: "VENCIDO",
  saldo: "R$ 231,00",
  sigla: "ETC",
  tipo: "Empresa"
};
const sindicato = {
  perfil: "SETCAL  - Operador",
  sigla: "SETCAL",
  path: path.generic.perfilSitcarga.SETCALOperador
}

describe('Iniciando o acesso ao Sitcarga', () => {
  beforeEach(() => {
    cy.fixture('usuario').then((data) => {
      usuario = data;
    });
    cy.reload();  
    cy.viewport(1920, 1080);
    cy.wait(2000)  
  });
  
  
  it('Consultando se o pagamento do boleto foi compensado', () => {
    cy.visit(urls.sitcargaInitial);
    cy.get('.cookie-message > :nth-child(1) > p')
    .should('be.visible')
    .contains('Utilizamos cookies essenciais e tecnologias semelhantes para melhorar a sua experiência no nosso site. Para maiores informações, acesse nossa Política de Privacidade.')
    .get('#btnAccept').click({force: true})

    cy.get('.middle-box > :nth-child(1) > .font-bold').should('have.text', 'FAÇA SEU LOGIN')
    cy.get('#CPF').type(usuario.cpf)
    cy.get('#Senha').type(usuario.senha)
    cy.get('#btn-login').click({force: true})

    cy.get('.logo > img', {timeout: 30000}).should('have.attr','src', path.sitcargaHomePage.imgLogon)
    cy.get(':nth-child(1) > .m-r-sm').contains(usuario.nome.toUpperCase()) 
    cy.get('.dropdown-toggle').click({force: true})
    .get(sindicato.path).should('have.text', sindicato.perfil).click({force: true}) 
    //.get('#niveis-usuario > :nth-child(10) > a').click({force: true})
    cy.get('.dropdown-toggle').should('have.text', `${sindicato.perfil} `)
    cy.get(':nth-child(8) > [href="#"] > .nav-label', {timeout: 10000}).contains('Financeiro').click({force: true})
    cy.get('.active > .nav > :nth-child(2) > a').contains('Consultar Pagamentos').click({force: true})
    cy.get(':nth-child(1) > .col-lg-12 > .ibox > .ibox-title > h5').contains('Consulta de Pagamentos Os campos com (*) são obrigatórios')
    cy.get(path.sitcargaConsultaPagamentosPage.pesquisaTransportador).click({force: true})
    cy.get('#CPFCNPJ', {timeout: 30000} ).type(transportador.cpfCnpj)
    cy.get('#btn-consultar').click()

    cy.get('#resultado > .col-lg-12 > .ibox > :nth-child(1) > h5').should('have.text', ' Detalhes do Pagamento')
    cy.get('#div_dados_transportador > :nth-child(1) > .page-header', {timeout: 20000}).contains('Dados do Transportador')
    cy.get('#CpfCnpj').should('have.text', transportador.cpfCnpj)
    cy.get('#CodigoTipoTransportador').should('have.text', transportador.sigla)
    cy.get('#NomeTransportador').should('have.text',transportador.nome)
    cy.get('#Rntrc').should('have.text', transportador.rntrc)
    cy.get('#DescricaoSituacaoRNTRC').should('have.text', transportador.situacao)
    cy.get('#ValorSaldoCartaoPrePago').then((saldo)=> {       
      if (saldo >= boleto.valorBoleto) {        
        return true
        
      } else {          
          return false
      }
    }).should('be.true')

    

    
  });
});