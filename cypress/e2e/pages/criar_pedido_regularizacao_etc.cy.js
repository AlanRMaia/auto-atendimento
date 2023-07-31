import { faker } from '@faker-js/faker/locale/pt_BR';
//import { fakerBR } from 'fakerbr';
import path from '../../selectors/path.sel.cy';


describe('', () => {
  let usuario;
  beforeEach(() => {
    cy.fixture('usuario').then((data) => {
      usuario = data;
    });
    //cy.reload();
  });

  it('Deve acessar a página de regularizacao e abrir um atendimento de renovação para empresa ', () => {

    var fakerBr = require('faker-br');
    cy.viewport(1280, 720);
    //Logar na página com o usuario
    cy.login(usuario.cpf, usuario.senha);

    //Clicar na opção Regularização RNTRC no menu lateral
    cy.regularizacao();
    //Selecionando o tipo de atendimento Renovação RNTRC
    cy.get(path.regularizacaoPage.tipoAtendimento).click();
    //
    cy.get(path.criarPedidoRenovacao.inputTransportador)
      .click()
      .getElementListXpath(
        path.criarPedidoRenovacao.tipoTransportador,
        'Empresa'
      );
    
    cy.xpath(path.criarPedidoRenovacao.inputETC).type('02382953000197');
    cy.get(path.generic.botaoSubmit).click({ force: true });
    
    /*cy.get(path.generic.mensagemNotificacao).then((element) => {      
        expect(element).not.to.be.exist        
      }     
    )*/

    

    //Notificação de Transportador salvo com sucesso
    /*cy.get(path.generic.mensagemFeliz, {timeout: 10000}).then((element) => {
      //capturando a mensagem obtida na página
      const mensagemObtida = element.text();
      //comparando a mensagem
      expect(mensagemObtida).should('have.text', 'Transportador salvo com sucesso');
    });*/

    //Criar operação Salvar transportador       
    cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
    .xpath(path.detalhamentoAtendimentoRenovacao.operacaoSalvarTransportador).click();  
    //Na janela para incluir o Transportador no atendimento
    cy.get(path.generic.title).should('have.text', 'Salvar Transportador')   
   //Razão Social
   cy.get(path.operacaoSalvarTransportador.razaoSocial ).type(faker.company.name());
   //Nome fantasia
   cy.get(path.operacaoSalvarTransportador.nomeFantasia ).type(faker.company.name());
   //inscrição estadual
   cy.get(path.operacaoSalvarTransportador.inscricaoEstadual).type(faker.number.int({ min: 1000, max: 2000 }));
   //checkBox comunicado ANTT
   cy.get(path.operacaoSalvarTransportador.checkBoxComunicacaoANTT).should('not.be.checked')
   //checkbox capacidade financeira
   cy.get(path.operacaoSalvarTransportador.checkBoxCapacidadeFinanceira).should('not.be.checked')
   //botao Salvar
   cy.get(path.generic.botaoSubmit).click({ force: true });

     //operação de enviar documentos
    //Clicando no botão com a lista de operações e escolhendo a operação  Enviar Documentos  
    cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
    .xpath(path.detalhamentoAtendimentoRenovacao.operacaoEnviarDocumentos).click({
      force: true,
    });
    //Confirmar titulo
    cy.get(path.generic.title).should('have.text', 'Enviar Documentos')
    //selecionando o tipo de documento
    cy.xpath(path.operacaoEnviarDocumentos.tipoDocumento, {timeout: 10000}
    ).click().getElementListXpath(
      path.operacaoEnviarDocumentos.selecionarDocumento,
      'Documento de Identidade'
    );   
    //Anexando o documento Identidade
    cy.get(path.operacaoEnviarDocumentos.anexarDocumento
    ).selectFile(
      'D:/Imagens para teste/Apresentação .pdf'
    );
    //Salvando a operação  
    cy.get(path.generic.botaoSubmit).click();

    //operação de enviar documentos
    //Clicando no botão com a lista de operações e escolhendo a operação  Enviar Documentos  

    cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
    .xpath(path.detalhamentoAtendimentoRenovacao.operacaoEnviarDocumentos).click({
      force: true,
    });
    //Confirmar titulo
    cy.get(path.generic.title, {timeout: 10000}).should('have.text', 'Enviar Documentos')

    //selecionando o tipo de documento
    cy.xpath(path.operacaoEnviarDocumentos.tipoDocumento, {timeout: 10000}      
    ).click({force: true}).getElementListXpath(
      path.operacaoEnviarDocumentos.selecionarDocumento,
      'Registro de RT'
    );   
    
    //Anexando o documento RT
    cy.get(path.operacaoEnviarDocumentos.anexarDocumento
    ).selectFile(
      'D:/Imagens para teste/Apresentação .pdf'
    );
    //Salvando a operação  
    cy.get(path.generic.botaoSubmit).click();
  });
});