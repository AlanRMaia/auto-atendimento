import urls from '../urls';
import path, { operacaoDocumentos, operacaoContato } from '../../selectors/path.sel.cy';
import operacao from '../enum/OperacaoEnum';
import ufEnum from "../enum/uf";
require('cypress-xpath');

Cypress.Commands.add('operacaoTransportador', (faker, tipoTransportador) => {      
  cy.intercept('GET', `**/transportador`).as('transportador')  
  //Criar operação Salvar transportador       
    cy.get(path.detalhamentoAtendimentoPage.operacaoTransportador)
    .contains('Transportador').click({force: true})
    //.xpath(path.detalhamentoAtendimento.operacaoTransportador).click();  
    //Na janela para incluir o Transportador no atendimento
    cy.wait('@transportador')
    cy.get(path.generic.title).contains(operacao.Transportador) 
    if (tipoTransportador == 'ETC') {
       //Razão Social
      cy.get(path.operacaoTransportador.razaoSocial ).clear().type(faker.company.companyName());
      //Nome fantasia
      cy.get(path.operacaoTransportador.nomeFantasia ).clear().type(faker.company.companyName());

      //inscrição estadual
      cy.get(path.operacaoTransportador.inscricaoEstadual).clear().type(faker.random.number());
      //checkBox comunicado ANTT
      cy.get(path.operacaoTransportador.checkBoxComunicacaoANTT).should('not.be.checked')
      //checkbox capacidade financeira
      //cy.get(path.operacaoTransportador.checkBoxCapacidadeFinanceira).should('not.be.checked')
    } else if (tipoTransportador == 'CTC') {
       //Razão Social
       cy.get(path.operacaoTransportador.razaoSocial ).clear().type(faker.company.companyName());
       //Nome fantasia
       cy.get(path.operacaoTransportador.nomeFantasia ).clear().type(faker.company.companyName()); 
       //inscrição estadual
       cy.get(path.operacaoTransportador.inscricaoEstadual).clear().type(faker.random.number());
       //junta comercial
       cy.get(path.operacaoTransportador.juntaComercial).clear().type(faker.random.number());
       //inscricao OCB
       cy.get(path.operacaoTransportador.inscricaoOCB).clear().type(faker.random.number());

    } else {
      //Nome
      cy.get(path.operacaoTransportador.razaoSocial ).clear().type(`${faker.name.firstName()} ${faker.name.lastName()}`);
      //identidade
      cy.get(path.operacaoTransportador.identidade ).clear().type(faker.random.number());
    }    
  
   //botao Salvar
   cy.get(path.generic.botaoSubmit).click({ force: true });  
    
})

Cypress.Commands.add('documentosIdentidade', (selectFile) => {

  cy.intercept('GET', '/rntrc/PrePedido/**').as('documentos')
  cy.get(path.detalhamentoAtendimentoPage.operacaoDocumentos)
  .contains('Documentos', {timeout: 10000}).click({force: true})
      //Confirmar titulo
      cy.get(path.generic.title, {timeout: 10000}).contains(operacao.Documentos, {timeout: 10000})
      
      //selecionando o tipo de documento
      //cy.wait('@documentos')      
      cy.get(path.operacaoDocumentos.tipoDocumento, {timeout: 10000}).click({waitForAnimations: true, force: true})       
      cy.get(path.operacaoDocumentos.documentoIdentidade, {timeout: 10000}        
       ).contains('Documento de Identidade', {timeout: 10000}).click({force: true})  
  
      //Anexando o documento Identidade
      cy.get(path.operacaoDocumentos.anexarDocumento, {timeout: 1000}
        ).selectFile(
          selectFile, {timeout: 20000}
        );
      //Salvando a operação  
        cy.get(path.generic.botaoSubmit).click({force: true});
})

Cypress.Commands.add('enviarDocumentosRT', (selectFile) => {
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('documentoRT')
  cy.intercept('POST', '**/imagem').as('salvarimagem')
  cy.get(path.detalhamentoAtendimentoPage.operacaoDocumentos)
  .contains('Documentos').click({force: true})
      //Confirmar titulo
      cy.get(path.generic.title, {timeout: 10000}).contains('Documento', {timeout: 20000})
      //selecionando o tipo de documento
      //cy.wait('@documentoRT')      
      cy.get(path.operacaoDocumentos.tipoDocumento).click({force: true})       
      cy.get(path.operacaoDocumentos.registroRT, {timeout: 10000}).contains('Registro de RT', {timeout: 20000}).click({force: true})  
      //Anexando o documento Responsável Técnico
      cy.get(path.operacaoDocumentos.anexarDocumento
        ).selectFile(
          selectFile
        );
        //Salvando a operação  
        cy.get(path.generic.botaoSubmit).click({force: true}); 
        cy.wait('@salvarimagem')       
})

Cypress.Commands.add('incluirContatoEmail', (faker)=>{   
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('incluirEmail')
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Contato', {timeout: 10000}).click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir').click({force: true})

      cy.get(path.generic.title, {timeout: 10000}).contains(operacao.IncluirContato, {timeout: 20000})
      cy.get(path.operacaoContato.tipoContato).click({force: true})            
      //cy.wait('@incluirEmail')
      cy.get(path.operacaoContato.email).contains('Email', {timeout: 10000}).click({force: true})           
      cy.get(path.operacaoContato.tipoContatoValor).type(faker.internet.email(), {force: true})    
      cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
      cy.get(path.generic.botaoSubmit).click({froce: true})
})


Cypress.Commands.add('excluirContatoEmail', (faker, email) => {
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('excluirEmail')
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Contato', {timeout: 10000}).click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})

        cy.get(path.generic.title, {timeout: 10000}).contains(operacao.ExcluirContato, {timeout: 20000})
        cy.get(path.operacaoContato.tipoContato).click({force: true})               
        //cy.wait('@excluirEmail')
        cy.get(path.operacaoContato.email).contains('Email', {timeout: 10000}).click({force: true})      
        cy.get(path.operacaoContato.tipoContatoValor).type(email, {force: true})    
        cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
        cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('incluirContatoFax', (faker, fax = faker.phone.number('(##)####-####') )=>{  
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('incluirFax')

  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Contato', {timeout: 10000}).click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir').click({force: true})

  cy.get(path.generic.title, {timeout: 10000}).contains(operacao.IncluirContato, {timeout: 20000})
  cy.get(path.operacaoContato.tipoContato).click({force: true})    
  //cy.wait('@incluirFax')
  .get(path.operacaoContato.fax).contains('Fax', {timeout: 10000}).click({force: true})     
  cy.get(path.operacaoContato.tipoContatoValor).type(fax, {force: true})    
  cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
  cy.get(path.generic.botaoSubmit).click({force: true})
})


Cypress.Commands.add('excluirContatoFax', (faker, fax) =>{
  cy.intercept('GET', '**/rntrc/PrePedido/**').as('excluirFax')
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Contato', {timeout: 10000}).click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})

        cy.get(path.generic.title, {timeout: 10000}).contains(operacao.ExcluirContato, {timeout: 20000})
        cy.get(path.operacaoContato.tipoContato).click({force: true})       
        cy.wait('@excluirFax')
        .get(path.operacaoContato.fax).contains('Fax', {timeout: 10000}).click({force: true})      
        cy.get(path.operacaoContato.tipoContatoValor).type(fax, {force: true})    
        cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
        cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('incluirContatoCelular', (faker)=>{  
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('incluirCelular')
  cy.intercept('GET', '**/contato').as('contato')
  cy.intercept('POST', '**/salvar').as('salvar')
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Contato').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir').click({force: true})

  cy.get(path.generic.title, {timeout: 10000}).contains(operacao.IncluirContato, {timeout: 20000})
  cy.get(path.operacaoContato.tipoContato).click({force: true})  
  //cy.wait('@incluirCelular')
  .get(path.operacaoContato.celular).contains('Celular', {timeout: 10000}).click({force: true})     
  cy.get(path.operacaoContato.tipoContatoValor).type(faker.phone.number('(##)#####-####'), {force: true})    
  cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
  cy.get(path.generic.botaoSubmit).click({force: true})
  cy.wait('@contato')
  cy.wait('@salvar')
})

Cypress.Commands.add('excluirContatoCelular', (faker, phone) => {
  cy.intercept('GET', '**/rntrc/PrePedido/**').as('excluirCelular')

  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Contato').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})   
           
        cy.get(path.generic.title, {timeout: 10000}).contains(operacao.ExcluirContato, {timeout: 20000})
        cy.get(path.operacaoContato.tipoContato).click({force: true})               
        cy.wait('@excluirCelular')
        .get(path.operacaoContato.celular).contains('Celular', {timeout: 10000}).click({force: true})      
        cy.get(path.operacaoContato.tipoContatoValor).type(phone, {force: true})    
        cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
        cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('incluirContatoTelefone', (faker)=>{ 
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('incluirTelefone')
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Contato', {timeout: 20000}).click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir').click({force: true})

  cy.get(path.generic.title, {timeout: 10000}).contains(operacao.IncluirContato, {timeout: 20000})
  cy.get(path.operacaoContato.tipoContato, {timeout: 10000}).click()
  //cy.wait('@incluirTelefone')
  .get(path.operacaoContato.telefone, {timeout: 10000}).contains('Telefone', {timeout: 10000}).click({force: true}) 
  cy.get(path.operacaoContato.tipoContatoValor).type(faker.phone.number('(##)####-####'), {force: true})    
  cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
  cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('excluirContatoTelefone', (faker, phone) => {
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('excluirTelefone')
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Contato', {timeout: 10000}).click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})  

      cy.get(path.generic.title, {timeout: 10000}).contains(operacao.ExcluirContato, {timeout: 20000})
      cy.get(path.operacaoContato.tipoContato, {timeout: 10000}).click()            
      //cy.wait('@excluirTelefone')
      .get(path.operacaoContato.telefone, {timeout: 10000}).contains('Telefone', {timeout: 10000}).click({force: true})      
      cy.get(path.operacaoContato.tipoContatoValor).type(phone, {force: true})    
      cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
      cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('incluirEnderecoComercial', (faker, cep = faker.helpers.arrayElement(require('../../fixtures/cep.json')).cep) => {
  //
  cy.intercept('GET', '**/util/Cep/**').as('cep')
  cy.intercept('GET', '**/endereco/COM').as('enderecoCOM')
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('endereco')
  cy.intercept('POST','**/endereco/salvar' ).as('salvarEndereco')

  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Endereço').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})

        cy.get(path.generic.title, {timeout: 10000}).contains(operacao.IncluirEndereco, {timeout: 20000})
        //cy.wait('@endereco')
        cy.get(path.operacaoEndereco.tipoEndereco).contains('Comercial', {timeout: 60000}).click({force: true})
        .get(path.operacaoEndereco.listaEndereco)
        .contains('Comercial').click({force: true})
        
        cy.get(path.operacaoEndereco.cep).click()
        .type(cep, {force: true})

        cy.get(path.operacaoEndereco.logradouro, {timeout: 20000})
        .type(faker.location.street())

        cy.wait('@cep')

        // cy.get('.q-inner-loading', {timeout: 30000}).should('be.visible')

        // cy.get('.q-inner-loading', {timeout: 50000}).should('not.exist')
        

        cy.get(path.operacaoEndereco.numero)
        .type(faker.random.numeric(5), {force: true})

        cy.get(path.operacaoEndereco.complemento)
        .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.bairro)
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.cidade)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.pontoDeReferencia)
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.uf).click()        
        // .get(path.generic.listaVirtual)        
        // .contains(uf.nome).click({force: true})              
        
        cy.get(path.generic.botaoSubmit).click({force: true})
        cy.wait('@enderecoCOM', {timeout: 30000})
        cy.wait('@salvarEndereco', {timeout:30000})
})

Cypress.Commands.add('alterarEnderecoComercial', (faker, cep = faker.helpers.arrayElement(require('../../fixtures/cep.json')).cep) => {
  //let uf = faker.helpers.arrayElement(path.generic.uf)
  cy.intercept('GET', '**/util/Cep/**').as('cep')
  cy.intercept('GET', '**/endereco/COM').as('enderecoCOM')
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('endereco')
  cy.intercept('POST','**/endereco/salvar' ).as('salvarEndereco')
  
  cy.get(path.detalhamentoAtendimentoPage.operacao, {timeout: 20000})
  .contains('Endereço').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})

        cy.get(path.generic.title, {timeout: 10000}).contains(operacao.IncluirEndereco)
        //cy.wait('@endereco')
        cy.get(path.operacaoEndereco.tipoEndereco).contains('Comercial', {timeout: 60000}).click({force: true})        
        .get(path.operacaoEndereco.listaEndereco)
        .contains('Comercial').click({force: true})

        cy.get(path.operacaoEndereco.cep).click()
        .type(cep, {force: true})

        cy.get(path.operacaoEndereco.logradouro, {timeout: 20000})
        .type(faker.location.street())

        // cy.get('.q-inner-loading', {timeout: 30000}).should('be.visible')

        // cy.get('.q-inner-loading', {timeout: 50000}).should('not.exist')
        cy.wait('@cep')        

        cy.get(path.operacaoEndereco.numero)
        .type(faker.random.numeric(5), {force: true})

        cy.get(path.operacaoEndereco.complemento)
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.bairro)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.cidade)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.pontoDeReferencia)
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.uf).click()        
        // .get(path.generic.listaVirtual)        
        // .contains(uf.nome).click({force: true})                
        
        cy.get(path.generic.botaoSubmit).click({force: true})
        cy.wait('@enderecoCOM', {timeout:30000})        
        cy.wait('@salvarEndereco', {timeout:30000})

})

Cypress.Commands.add('excluirEnderecoComercial', (faker, cep = faker.helpers.arrayElement(require('../../fixtures/cep.json')).cep) => {
  //
  cy.intercept('GET', '**/util/Cep/**').as('cep')
  cy.intercept('GET', '**/endereco/COM').as('enderecoCOM')
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('endereco')
  cy.intercept('POST','**/endereco/salvar' ).as('salvarEndereco')
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Endereço').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})
  
        cy.get(path.generic.title, {timeout: 10000}).contains(operacao.ExcluirEndereco, {timeout: 20000})
        //cy.wait('@endereco')
        cy.get(path.operacaoEndereco.tipoEndereco).contains('Comercial', {timeout: 60000}).click({force: true})
        .get(path.operacaoEndereco.listaEndereco)
        .contains('Comercial').click({force: true})

        cy.get(path.operacaoEndereco.cep).click()
        .type(cep, {force: true})

        cy.get(path.operacaoEndereco.logradouro, {timeout: 20000})
        .type(faker.location.street())

        // cy.get('.q-inner-loading', {timeout: 30000}).should('be.visible')

        // cy.get('.q-inner-loading', {timeout: 50000}).should('not.exist')
        cy.wait('@cep')

        // cy.get(path.operacaoEndereco.logradouro)
        // .type(faker.location.street())

        cy.get(path.operacaoEndereco.numero)
        .type(faker.random.numeric(5), {force: true})

        cy.get(path.operacaoEndereco.complemento)
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.bairro)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.cidade)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.pontoDeReferencia)
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.uf).click()        
        // .get(path.generic.listaVirtual)        
        // .contains(uf.nome).click({force: true})               
        
        cy.get(path.generic.botaoSubmit).click({force: true})
        cy.wait('@enderecoCOM', {timeout:30000})        
        cy.wait('@salvarEndereco', {timeout:30000})
})

Cypress.Commands.add('incluirEnderecoResidencial', (faker, cep = faker.helpers.arrayElement(require('../../fixtures/cep.json')).cep) => {
  //
  cy.intercept('GET', '**/util/Cep/**').as('cep')
  cy.intercept('GET', '**/endereco/COM').as('enderecoCOM')
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('endereco')
  cy.intercept('POST','**/endereco/salvar' ).as('salvarEndereco')
 
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Endereço').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})

        cy.get(path.generic.title, {timeout: 10000}).contains(operacao.IncluirEndereco, {timeout: 20000})
        //cy.wait('@endereco')        
        cy.get(path.operacaoEndereco.tipoEndereco).contains('Residencial', {timeout: 60000}).click({force: true})       
        .get(path.operacaoEndereco.listaEndereco)
        .contains('Residencial').click({force: true})

        cy.get(path.operacaoEndereco.cep).click()
        .type(cep, {force: true})

        cy.get(path.operacaoEndereco.logradouro, {timeout: 20000})
        .type(faker.location.street())

        // cy.get('.q-inner-loading', {timeout: 30000}).should('be.visible')

        // cy.get('.q-inner-loading', {timeout: 50000}).should('not.exist')
        cy.wait('@cep')
        // cy.get(path.operacaoEndereco.logradouro)
        // .type(faker.address.streetAddress())

        cy.get(path.operacaoEndereco.numero)
        .type(faker.random.numeric(5), {force: true})

        cy.get(path.operacaoEndereco.complemento)
        .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.bairro)
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.cidade)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.pontoDeReferencia)
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.uf).click()        
        // .get(path.generic.listaVirtual)        
        // .contains(uf.nome).click({force: true})              
        
        cy.get(path.generic.botaoSubmit).click({force: true})
        cy.wait('@enderecoCOM', {timeout:30000})        
        cy.wait('@salvarEndereco', {timeout:30000})
})

Cypress.Commands.add('alterarEnderecoResidencial', (faker, cep = faker.helpers.arrayElement(require('../../fixtures/cep.json')).cep) => {
  //let uf = faker.helpers.arrayElement(path.generic.uf)
  
  cy.intercept('GET', '**/util/Cep/**').as('cep')
  cy.intercept('GET', '**/endereco/COM').as('enderecoCOM')
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('endereco')
  cy.intercept('POST','**/endereco/salvar' ).as('salvarEndereco')  

  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Endereço').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})

        cy.get(path.generic.title, {timeout: 10000}).contains(operacao.IncluirEndereco, {timeout: 20000})
        //cy.wait('@endereco')        
        cy.get(path.operacaoEndereco.tipoEndereco).contains('Residencial', {timeout: 60000}).click({force: true})        
        .get(path.operacaoEndereco.listaEndereco)
        .contains('Residencial').click({force: true})

        cy.get(path.operacaoEndereco.cep).click()
        .type(cep, {force: true})

        cy.get(path.operacaoEndereco.logradouro, {timeout: 20000})
        .type(faker.location.street())

        // cy.get('.q-inner-loading', {timeout: 30000}).should('be.visible')

        // cy.get('.q-inner-loading', {timeout: 50000}).should('not.exist')
        cy.wait('@cep', {timeout: 90000})        

        cy.get(path.operacaoEndereco.numero)
        .type(faker.random.numeric(5), {force: true})

        cy.get(path.operacaoEndereco.complemento)
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.bairro)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.cidade)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.pontoDeReferencia)
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.uf).click()        
        // .get(path.generic.listaVirtual)        
        // .contains(uf.nome).click({force: true})              
        
        cy.get(path.generic.botaoSubmit).click({force: true})
        cy.wait('@enderecoCOM', {timeout:30000})        
        cy.wait('@salvarEndereco', {timeout:30000})
})

Cypress.Commands.add('excluirEnderecoResidencial', (faker, cep = faker.helpers.arrayElement(require('../../fixtures/cep.json')).cep) => {
  //let uf = faker.random.arrayElement(path.generic.uf)
  cy.intercept('GET', '**/util/Cep/**').as('cep')
  cy.intercept('GET', '**/endereco/COM').as('enderecoCOM')
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('endereco')
  cy.intercept('POST','**/endereco/salvar' ).as('salvarEndereco')
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Endereço').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})

        cy.get(path.generic.title, {timeout: 10000}).contains(operacao.IncluirEndereco, {timeout: 20000})
        //cy.wait('@endereco')
        cy.get(path.operacaoEndereco.tipoEndereco).contains('Residencial', {timeout: 60000}).click({force: true})        
        .get(path.operacaoEndereco.listaEndereco)
        .contains('Residencial').click({force: true})

        cy.get(path.operacaoEndereco.cep).click()
        .type(cep, {force: true})

        cy.get(path.operacaoEndereco.logradouro, {timeout: 20000})
        .type(faker.location.street())

        // cy.get('.q-inner-loading', {timeout: 30000}).should('be.visible')

        // cy.get('.q-inner-loading', {timeout: 50000}).should('not.exist')
        cy.wait('@cep')        

        cy.get(path.operacaoEndereco.numero)
        .type(faker.random.numeric(5), {force: true})

        cy.get(path.operacaoEndereco.complemento)
        .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.bairro)
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.cidade)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.pontoDeReferencia)
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.uf).click()        
        // .get(path.generic.listaVirtual)        
        // .contains(uf.nome).click({force: true})              
        
        cy.get(path.generic.botaoSubmit).click({force: true})
        cy.wait('@enderecoCOM', {timeout:30000})        
        cy.wait('@salvarEndereco', {timeout:30000})
})

Cypress.Commands.add('incluirEnderecoCorrespondenciaTAC', (faker, cep = faker.helpers.arrayElement(require('../../fixtures/cep.json')).cep) => {
  //let uf = faker.helpers.arrayElement(path.generic.uf)
  
  cy.intercept('GET', '**/util/Cep/**').as('cep')
  cy.intercept('GET', '**/endereco/COR').as('enderecoCOR')
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('endereco')
  cy.intercept('POST','**/endereco/salvar' ).as('salvarEndereco')

  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Endereço').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})

        cy.get(path.generic.title, {timeout: 10000}).contains(operacao.IncluirEndereco, {timeout: 20000})
        //cy.wait('@endereco')
        cy.get(path.operacaoEndereco.tipoEndereco).contains('Residencial', {timeout: 60000}).click({force: true})
        .get(path.operacaoEndereco.listaEndereco)
        .contains('Correspondência').click({force: true})

        cy.get(path.operacaoEndereco.cep).click()
        .type(cep, {force: true})

        cy.get(path.operacaoEndereco.logradouro, {timeout: 20000})
        .type(faker.location.street())

        // cy.get('.q-inner-loading', {timeout: 30000}).should('be.visible')

        // cy.get('.q-inner-loading', {timeout: 50000}).should('not.exist')
        cy.wait('@cep')
        // cy.get(path.operacaoEndereco.logradouro, {timeout: 20000})
        // .type(faker.address.streetAddress())        

        cy.get(path.operacaoEndereco.numero, {timeout: 20000})
        .type(faker.random.numeric(5))

        cy.get(path.operacaoEndereco.complemento, {timeout: 20000})
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.bairro, {timeout: 20000})
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.cidade, {timeout: 20000})
        // .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.pontoDeReferencia, {timeout: 20000})
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.uf).click()        
        // .get(path.generic.listaVirtual)        
        // .contains(uf.nome).click({force: true})               
        
        cy.get(path.generic.botaoSubmit).click({force: true})

        cy.wait('@enderecoCOR', {timeout:30000})
        cy.wait('@salvarEndereco', {timeout:30000})
})

Cypress.Commands.add('incluirEnderecoCorrespondencia', (faker, cep = faker.helpers.arrayElement(require('../../fixtures/cep.json')).cep) => {
  ////
  cy.intercept('GET', '**/util/Cep/**').as('cep')
  cy.intercept('GET', '**/endereco/COR').as('enderecoCOR')
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('endereco')
  cy.intercept('POST','**/endereco/salvar' ).as('salvarEndereco')

  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Endereço').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})

        cy.get(path.generic.title, {timeout: 10000}).contains(operacao.IncluirEndereco, {timeout: 20000})
        //cy.wait('@endereco')
        cy.get(path.operacaoEndereco.tipoEndereco).contains('Comercial', {timeout: 60000}).click({force: true})
        .get(path.operacaoEndereco.listaEndereco)
        .contains('Correspondência').click({force: true})

        cy.get(path.operacaoEndereco.cep).click()
        .type(cep, {force: true})

        cy.get(path.operacaoEndereco.logradouro, {timeout: 20000})
        .type(faker.location.street())        
        // cy.get('.q-inner-loading', {timeout: 30000}).should('be.visible')

        // cy.get('.q-inner-loading', {timeout: 50000}).should('not.exist')
        cy.wait('@cep')

        cy.get(path.operacaoEndereco.numero, {timeout: 20000})
        .type(faker.random.numeric(5))

        cy.get(path.operacaoEndereco.complemento, {timeout: 20000})
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.bairro, {timeout: 20000})
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.cidade, {timeout: 20000})
        // .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.pontoDeReferencia, {timeout: 20000})
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.uf).click()        
        // .get(path.generic.listaVirtual)        
        // .contains(uf.nome).click({force: true})               
        
        cy.get(path.generic.botaoSubmit).click({force: true})

        cy.wait('@enderecoCOR', {timeout:30000})
        cy.wait('@salvarEndereco', {timeout:30000})
})


Cypress.Commands.add('excluirEnderecoCorrespondencia', (faker, cep = faker.helpers.arrayElement(require('../../fixtures/cep.json')).cep) => {
  //
  cy.intercept('GET', '**/util/Cep/**').as('cep')
  cy.intercept('GET', '**/endereco/COR').as('enderecoCOR')
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('endereco')
  cy.intercept('POST','**/endereco/salvar' ).as('salvarEndereco')

  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Endereço').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})
  
        cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.ExcluirEndereco)
        //cy.wait('@endereco')
        cy.get(path.operacaoEndereco.tipoEndereco).contains(`Comercial|Residencial`, {timeout: 60000}).click({force: true})
        .get(path.operacaoEndereco.listaEndereco)
        .contains('Correspondência').click({force: true})

        cy.get(path.operacaoEndereco.cep).click()
        .type(cep, {force: true})

        cy.get(path.operacaoEndereco.logradouro, {timeout: 20000})
        .type(faker.location.street())
        // cy.get('.q-inner-loading', {timeout: 30000}).should('be.visible')

        // cy.get('.q-inner-loading', {timeout: 50000}).should('not.exist')

        cy.wait('@cep')

        

        cy.get(path.operacaoEndereco.numero, {timeout: 20000})
        .type(faker.random.numeric(5))

        cy.get(path.operacaoEndereco.complemento, {timeout: 20000})
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.bairro, {timeout: 20000})
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.cidade, {timeout: 20000})
        // .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.pontoDeReferencia, {timeout: 20000})
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.uf).click()        
        // .get(path.generic.listaVirtual)        
        // .contains(uf.nome).click({force: true})               
        
        cy.get(path.generic.botaoSubmit).click({force: true})
        cy.wait('@enderecoCOR', {timeout:30000})        
        cy.wait('@salvarEndereco', {timeout:30000})

})

Cypress.Commands.add('excluirEnderecoCorrespondenciaTAC', (faker, cep = faker.helpers.arrayElement(require('../../fixtures/cep.json')).cep) => {
  //
  cy.intercept('GET', '**/util/Cep/**').as('cep')
  cy.intercept('GET', '**/endereco/COR').as('enderecoCOR')
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('endereco')
  cy.intercept('POST','**/endereco/salvar' ).as('salvarEndereco')

  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Endereço').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})
  
        cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.ExcluirEndereco)
        //cy.wait('@endereco')
        cy.get(path.operacaoEndereco.tipoEndereco).contains(`Residencial`, {timeout: 60000}).click({force: true})
        .get(path.operacaoEndereco.listaEndereco)
        .contains('Correspondência').click({force: true})

        cy.get(path.operacaoEndereco.cep).click()
        .type(cep, {force: true})

        cy.get(path.operacaoEndereco.logradouro, {timeout: 20000})
        .type(faker.location.street())
        // cy.get('.q-inner-loading', {timeout: 30000}).should('be.visible')

        // cy.get('.q-inner-loading', {timeout: 50000}).should('not.exist')

        cy.wait('@cep')        

        cy.get(path.operacaoEndereco.numero, {timeout: 20000})
        .type(faker.random.numeric(5))

        cy.get(path.operacaoEndereco.complemento, {timeout: 20000})
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.bairro, {timeout: 20000})
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.cidade, {timeout: 20000})
        // .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.pontoDeReferencia, {timeout: 20000})
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.uf).click()        
        // .get(path.generic.listaVirtual)        
        // .contains(uf.nome).click({force: true})               
        
        cy.get(path.generic.botaoSubmit).click({force: true})
        cy.wait('@enderecoCOR', {timeout:30000})        
        cy.wait('@salvarEndereco', {timeout:30000})

})

Cypress.Commands.add('incluirGestor', (gestor, tipoTransportador) => {
 //cy.intercept('GET', '**/rntrc/PrePedido/**').as('tipogestor') 
 cy.intercept('POST', '**/salvar**').as('salvargestor')
 cy.intercept('GET', '**/gestor/**').as('gestor')
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Gestor').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})
   //cy.wait('@tipogestor')       
  cy.get(path.generic.title).contains(operacao.IncluirGestor, {timeout: 20000})  
        cy.log('cargo do gestor:', gestor.cargo)
        cy.log('tipo transportador', tipoTransportador)
    if (tipoTransportador === 'ETC' && gestor.cargo === 'Responsável Legal') {  

        cy.get(path.operacaoGestor.tipoVinculo, {timeout: 10000}).click({force: true})       
        cy.get(path.operacaoGestor.listTipoVinculo).contains(gestor.cargo).click({force: true})
        cy.get(path.operacaoGestor.cpfCnpj).type(gestor.cpfCnpj, {force: true})
       
        cy.get(path.operacaoGestor.nome).type(gestor.nome)
        
        cy.get('input[class="q-field__native q-placeholder"]').then((dataNascimento)=>{
          return new Cypress.Promise(resolve => {
            let valor = dataNascimento.length
            
            if ( valor === 5) {
              cy.log('segundo dentro')
              cy.get(path.operacaoGestor.dataNascimento).type(gestor.nascimento)
            } 
            cy.log('segundo fora')

            resolve()
            
          })
        })
        cy.get(path.operacaoGestor.cargo).type(gestor.cargo)  
        cy.get(path.operacaoGestor.telefone).type(gestor.telefone)
        cy.get(path.operacaoGestor.email).type(gestor.email)

    }else if (tipoTransportador == 'ETC' && gestor.cargo == 'Sócio'){
      
      cy.get(path.operacaoGestor.cpfCnpj).type(gestor.cpfCnpj, {force: true})
        cy.get(path.operacaoGestor.nome).type(gestor.nome)
        cy.get('input[class="q-field__native q-placeholder"]').then((dataNascimento)=>{
          return new Cypress.Promise(resolve => {
            let valor = dataNascimento.length
            
            if ( valor === 5) {
              cy.log('segundo dentro')
              cy.get(path.operacaoGestor.dataNascimento).type(gestor.nascimento)
            } 
            cy.log('segundo fora')

            resolve()
            
          })
        })
        cy.get(path.operacaoGestor.cargo).type(gestor.cargo)  
        cy.get(path.operacaoGestor.telefone).type(gestor.telefone)
        cy.get(path.operacaoGestor.email).type(gestor.email)

    }else{
      cy.get(path.operacaoGestor.cpfCnpj).type(gestor.cpfCnpj, {force: true})
        cy.get(path.operacaoGestor.nome).type(gestor.nome)
        cy.get('input[class="q-field__native q-placeholder"]').then((dataNascimento)=>{
          return new Cypress.Promise(resolve => {
            let valor = dataNascimento.length
            
            if ( valor === 5) {
              cy.log('segundo dentro')
              cy.get(path.operacaoGestor.dataNascimento).type(gestor.nascimento)
            } 
            cy.log('segundo fora')

            resolve()
            
          })
        })
        cy.get(path.operacaoGestor.cargo).type(gestor.cargo)  
        cy.get(path.operacaoGestor.telefone).type(gestor.telefone)
        cy.get(path.operacaoGestor.email).type(gestor.email)
    }   

  cy.get(path.generic.botaoSubmit).click({force: true})
  cy.wait('@gestor')
  cy.wait('@salvargestor')
})

Cypress.Commands.add('alterarGestor', (gestor, tipoTransportador)=>{
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('tipogestor') 
  cy.intercept('POST', '**/salvar**').as('salvargestor')
  cy.intercept('GET', '**/gestor/**').as('gestor')
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Gestor').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})
  //cy.wait('@tipogestor')          
  cy.get(path.generic.title).contains(operacao.IncluirGestor, {timeout: 20000}).wait(3000)  
        cy.log('cargo do gestor:', gestor.cargo)
        cy.log('tipo transportador', tipoTransportador)
    if (tipoTransportador === 'ETC' && gestor.cargo === 'Responsável Legal') {  

        cy.get(path.operacaoGestor.tipoVinculo, {timeout: 10000}).click({force: true})        
        cy.get(path.operacaoGestor.listTipoVinculo).contains(gestor.cargo).click({force: true})
        cy.get(path.operacaoGestor.cpfCnpj).type(gestor.cpfCnpj, {force: true})        
       
        cy.get(path.operacaoGestor.nome).type(gestor.nome)
        cy.get('input[class="q-field__native q-placeholder"]').then((dataNascimento)=>{
          return new Cypress.Promise(resolve => {
            let valor = dataNascimento.length
            
            if ( valor === 5) {
              cy.log('segundo dentro')
              cy.get(path.operacaoGestor.dataNascimento).type(gestor.nascimento)
            } 
            cy.log('segundo fora')

            resolve()
            
          })
        })
        cy.get(path.operacaoGestor.cargo).type(gestor.cargo)  
        cy.get(path.operacaoGestor.telefone).type(gestor.telefone)
        cy.get(path.operacaoGestor.email).type(gestor.email)

    }else if (tipoTransportador == 'ETC' && gestor.cargo == 'Sócio'){

      cy.get(path.operacaoGestor.cpfCnpj).type(gestor.cpfCnpj, {force: true})
        cy.get(path.operacaoGestor.nome).type(gestor.nome)
        cy.get('input[class="q-field__native q-placeholder"]').then((dataNascimento)=>{
          return new Cypress.Promise(resolve => {
            let valor = dataNascimento.length
            
            if ( valor === 5) {
              cy.log('segundo dentro')
              cy.get(path.operacaoGestor.dataNascimento).type(gestor.nascimento)
            } 
            cy.log('segundo fora')

            resolve()
            
          })
        })
        cy.get(path.operacaoGestor.cargo).type(gestor.cargo)  
        cy.get(path.operacaoGestor.telefone).type(gestor.telefone)
        cy.get(path.operacaoGestor.email).type(gestor.email)

    }else{
      cy.get(path.operacaoGestor.cpfCnpj).type(gestor.cpfCnpj, {force: true})
        cy.get(path.operacaoGestor.nome).type(gestor.nome)
        cy.get('input[class="q-field__native q-placeholder"]').then((dataNascimento)=>{
          return new Cypress.Promise(resolve => {
            let valor = dataNascimento.length
            
            if ( valor === 5) {
              cy.log('segundo dentro')
              cy.get(path.operacaoGestor.dataNascimento).type(gestor.nascimento)
            } 
            cy.log('segundo fora')

            resolve()
            
          })
        })
        cy.get(path.operacaoGestor.cargo).type(gestor.cargo)  
        cy.get(path.operacaoGestor.telefone).type(gestor.telefone)
        cy.get(path.operacaoGestor.email).type(gestor.email)
    }   

  cy.get(path.generic.botaoSubmit).click({force: true})
  cy.wait('@gestor')
  cy.wait('@salvargestor')
})

Cypress.Commands.add('excluirGestor', (gestor, tipoTransportador)=>{
  cy.intercept('GET', '**/rntrc/PrePedido/**').as('tipogestor') 
  cy.intercept('POST', '**/salvar**').as('salvargestor')
  cy.intercept('GET', '**/gestor/**').as('gestor') 
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Gestor').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})
  cy.wait('@tipogestor')         
  cy.get(path.generic.title).contains(operacao.IncluirGestor, {timeout: 20000}).wait(3000)  
        
    if (tipoTransportador == 'ETC' && gestor.cargo == 'Responsável Legal') {  

        cy.get(path.operacaoGestor.tipoVinculo, {timeout: 10000}).click().type(gestor.cargo)
        cy.get(path.operacaoGestor.listTipoVinculo).contains(gestor.cargo)                
         .click({force: true})
         cy.get(path.operacaoGestor.cpfCnpj).type(gestor.cpfCnpj, {force: true})
         cy.get(path.operacaoGestor.nome).type(gestor.nome)
         cy.get('input[class="q-field__native q-placeholder"]').then((dataNascimento)=>{
          return new Cypress.Promise(resolve => {
            let valor = dataNascimento.length
            
            if ( valor === 5) {
              cy.log('segundo dentro')
              cy.get(path.operacaoGestor.dataNascimento).type(gestor.nascimento)
            } 
            cy.log('segundo fora')

            resolve()
            
          })
        })
         cy.get(path.operacaoGestor.cargo).type(gestor.cargo)  
         cy.get(path.operacaoGestor.telefone).type(gestor.telefone)
         cy.get(path.operacaoGestor.email).type(gestor.email)

    }else if (tipoTransportador == 'ETC' && gestor.cargo == 'Sócio'){

      cy.get(path.operacaoGestor.cpfCnpj).type(gestor.cpfCnpj, {force: true})
        cy.get(path.operacaoGestor.nome).type(gestor.nome)
        cy.get('input[class="q-field__native q-placeholder"]').then((dataNascimento)=>{
          return new Cypress.Promise(resolve => {
            let valor = dataNascimento.length
            
            if ( valor === 5) {
              cy.log('segundo dentro')
              cy.get(path.operacaoGestor.dataNascimento).type(gestor.nascimento)
            } 
            cy.log('segundo fora')

            resolve()
            
          })
        })
        cy.get(path.operacaoGestor.cargo).type(gestor.cargo)  
        cy.get(path.operacaoGestor.telefone).type(gestor.telefone)
        cy.get(path.operacaoGestor.email).type(gestor.email)

    }else{
      cy.get(path.operacaoGestor.cpfCnpj).type(gestor.cpfCnpj, {force: true})
        cy.get(path.operacaoGestor.nome).type(gestor.nome)
        cy.get('input[class="q-field__native q-placeholder"]').then((dataNascimento)=>{
          return new Cypress.Promise(resolve => {
            let valor = dataNascimento.length
            
            if ( valor === 5) {
              cy.log('segundo dentro')
              cy.get(path.operacaoGestor.dataNascimento).type(gestor.nascimento)
            } 
            cy.log('segundo fora')

            resolve()
            
          })
        })
        cy.get(path.operacaoGestor.cargo).type(gestor.cargo)  
        cy.get(path.operacaoGestor.telefone).type(gestor.telefone)
        cy.get(path.operacaoGestor.email).type(gestor.email)
    }   

  cy.get(path.generic.botaoSubmit).click({force: true})
  cy.wait('@gestor')
  cy.wait('@salvargestor')
})

Cypress.Commands.add('incluirMotorista', (faker, cpf = faker.br.cpf()) => {
  cy.intercept('GET', `**/tacAuxiliar/${cpf}`).as('motorista')
  cy.intercept('POST', `**/tacAuxiliar/salvar`).as('salvarmotorista')
  
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Motorista', {timeout: 20000}).click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})
            
  cy.get(path.generic.title, {timeout: 10000}).contains(operacao.IncluirMotorista, {timeout: 20000})

  cy.get(path.operacaoMotorista.cpf).type(cpf)
  //cy.get(path.generic.alert).should('not.exist')
  cy.get(path.operacaoMotorista.nome).type(`${faker.name.firstName()} ${faker.name.lastName()}`)
  //cy.get(path.generic.alert).should('not.exist')
  cy.get(path.operacaoMotorista.dataNascimento).type('20/02/2005')
  //cy.get(path.generic.alert).should('not.exist')
  cy.get(path.operacaoMotorista.email).type(faker.internet.email())
  //cy.get(path.generic.alert).should('not.exist')
  cy.get(path.operacaoMotorista.telefone).type(faker.phone.phoneNumber())
  //cy.get(path.generic.alert).should('not.exist')
  cy.get(path.operacaoMotorista.cnh).type(faker.random.number())
  //cy.get(path.generic.alert).should('not.exist')
  cy.get(path.operacaoMotorista.categoria).type('B')
  //cy.get(path.generic.alert).should('not.exist')

  cy.get(path.operacaoMotorista.radioFeminino).click({force: true}).wait(1000)
  cy.get(path.operacaoMotorista.radioMasculino, {timeout: 10000}).click({force: true})

  cy.get(path.generic.botaoSubmit).click({force: true});
  cy.wait('@motorista')
  cy.wait('@salvarmotorista')

})

Cypress.Commands.add('alterarMotorista', (faker, cpf) => {
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Motorista').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})
          
  cy.get(path.generic.title, {timeout: 10000}).contains(operacao.AlterarMotorista, {timeout: 20000})
  cy.get(path.operacaoMotorista.cpf).type(cpf)
  //cy.get(path.generic.alert).should('not.exist')
  cy.get(path.operacaoMotorista.nome).type(`${faker.name.firstName()} ${faker.name.lastName()}`)
  //cy.get(path.generic.alert).should('not.exist')
  cy.get(path.operacaoMotorista.dataNascimento).type('20/02/2005')
  //cy.get(path.generic.alert).should('not.exist')
  cy.get(path.operacaoMotorista.email).type(faker.internet.email())
  //cy.get(path.generic.alert).should('not.exist')
  cy.get(path.operacaoMotorista.telefone).type(faker.phone.phoneNumber())
  //cy.get(path.generic.alert).should('not.exist')
  cy.get(path.operacaoMotorista.cnh).type(faker.random.number())
  //cy.get(path.generic.alert).should('not.exist')
  cy.get(path.operacaoMotorista.categoria).type('B')
  //cy.get(path.generic.alert).should('not.exist')

  cy.get(path.operacaoMotorista.radioFeminino).click({force: true}).wait(1000)
  cy.get(path.operacaoMotorista.radioMasculino, {timeout: 10000}).click({force: true})

  cy.get(path.generic.botaoSubmit).click({force: true});

})

Cypress.Commands.add('excluirMotorista', (faker, cpf) => {
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Motorista').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})
          
  cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.ExcluirMotorista)
  cy.get(path.operacaoMotorista.cpf).type(cpf)
  //cy.get(path.generic.alert).should('not.exist')
  cy.get(path.operacaoMotorista.nome).type(`${faker.name.firstName()} ${faker.name.lastName()}`)
  //cy.get(path.generic.alert).should('not.exist')
  cy.get(path.operacaoMotorista.dataNascimento).type('20/02/2005')
  //cy.get(path.generic.alert).should('not.exist')
  cy.get(path.operacaoMotorista.email).type(faker.internet.email())
  //cy.get(path.generic.alert).should('not.exist')
  cy.get(path.operacaoMotorista.telefone).type(faker.phone.phoneNumber())
  //cy.get(path.generic.alert).should('not.exist')
  cy.get(path.operacaoMotorista.cnh).type(faker.random.number())
  //cy.get(path.generic.alert).should('not.exist')
  cy.get(path.operacaoMotorista.categoria).type('B')
  //cy.get(path.generic.alert).should('not.exist')

  cy.get(path.operacaoMotorista.radioFeminino).click({force: true}).wait(1000)
  cy.get(path.operacaoMotorista.radioMasculino, {timeout: 10000}).click({force: true})

  cy.get(path.generic.botaoSubmit).click({force: true});

})

Cypress.Commands.add('incluirFilial', (faker)=>{
  let uf = faker.random.arrayElement(path.generic.uf)
  
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Filial').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})
          
  cy.get(path.generic.title).contains(operacao.IncluirFilial, {timeout: 20000})  

  cy.get(path.operacaoFilial.cnpj).type(faker.br.cnpj())
  cy.get(path.operacaoFilial.nome).type(faker.company.companyName())
  cy.get(path.operacaoFilial.capitalSocial).type(faker.random.number())
  cy.get(path.operacaoFilial.uf).click()        
        .get(path.generic.listaVirtual)        
        .contains(uf.nome).click({force: true}) 

  cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('alterarFilial', (faker, filial)=>{
  let uf = faker.random.arrayElement(path.generic.uf)  
  
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Filial').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})
          
  cy.get(path.generic.title).contains(operacao.IncluirFilial, {timeout: 20000})  

  cy.get(path.operacaoFilial.cnpj).type(filial)
  cy.get(path.operacaoFilial.nome).type(faker.company.companyName())
  cy.get(path.operacaoFilial.capitalSocial).type(faker.random.number())
  cy.get(path.operacaoFilial.uf).click()        
        .get(path.generic.listaVirtual)        
        .contains(uf.nome).click({force: true}) 

  cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('excluirFilial', (faker, filial)=>{
  let uf = faker.random.arrayElement(path.generic.uf)  
  
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Filial').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})
          
  cy.get(path.generic.title).contains(operacao.ExcluirFilial, {timeout: 20000})  

  cy.get(path.operacaoFilial.cnpj).type(filial)
  cy.get(path.operacaoFilial.nome).type(faker.company.companyName())
  cy.get(path.operacaoFilial.capitalSocial).type(faker.random.number())
  cy.get(path.operacaoFilial.uf).click()        
        .get(path.generic.listaVirtual)        
        .contains(uf.nome).click({force: true})

  cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('incluirResponsavelTecnico', (fakerBr, rt)=>{
  let uf = fakerBr.random.arrayElement(path.generic.uf)
  let dataFaker = '20/02/2000'
  //cy.intercept('GET', '**/rntrc/PrePedido/**').as('rt')
  cy.intercept('GET', '**/responsaveltecnico/**').as('rtsalvar')
  
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Responsável Técnico').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})  

  cy.get(path.generic.title).contains(operacao.IncluirResponsavelTecnico, {timeout: 30000})  
  //cy.wait('@rt')
  if (typeof rt === "undefined") {
    cy.get(path.operacaoResponsavelTecnico.cpf).type(fakerBr.br.cpf())
    cy.get(path.operacaoResponsavelTecnico.nome).type(fakerBr.company.companyName())
    cy.get(path.operacaoResponsavelTecnico.email).type(fakerBr.internet.email())
    cy.get(path.operacaoResponsavelTecnico.telefone).type(fakerBr.phone.phoneNumber())
    cy.get(path.operacaoResponsavelTecnico.identidade).type(fakerBr.random.number())
    cy.get(path.operacaoResponsavelTecnico.orgaoEmissor).type(fakerBr.lorem.word({length: {min: 3, max: 5}}))
    cy.get(path.operacaoResponsavelTecnico.dataNascimento).type(dataFaker)      
    cy.get(path.operacaoResponsavelTecnico.uf).click()        
        .get(path.generic.listaVirtual)        
        .contains(uf.nome).click({force: true}) 
  } else {
      cy.get(path.operacaoResponsavelTecnico.cpf).type(rt.cpf)
    cy.get(path.operacaoResponsavelTecnico.nome).type(rt.nome)
    cy.get(path.operacaoResponsavelTecnico.email).type(fakerBr.internet.email())
    cy.get(path.operacaoResponsavelTecnico.telefone).type(fakerBr.phone.phoneNumber())
    cy.get(path.operacaoResponsavelTecnico.identidade).type(rt.identidade)
    cy.get(path.operacaoResponsavelTecnico.orgaoEmissor).type(fakerBr.lorem.word({length: {min: 3, max: 5}}))
    cy.get(path.operacaoResponsavelTecnico.dataNascimento).type(rt.dataNascimento)      
    cy.get(path.operacaoResponsavelTecnico.uf).click()        
        .get(path.generic.listaVirtual)        
        .contains(uf.nome).click({force: true})
  }
  

  cy.get(path.generic.botaoSubmit).click({force: true})
  cy.wait('@rtsalvar')
})

Cypress.Commands.add('alterarResponsavelTecnico', (fakerBr, rt)=>{
  let uf = fakerBr.random.arrayElement(path.generic.uf)
  let dataFaker = '20/02/2000'
  cy.intercept('GET', '**/rntrc/PrePedido/**').as('rt')
  cy.intercept('GET', '**/responsaveltecnico/**').as('rtsalvar')
  
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Responsável Técnico').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})  

  cy.get(path.generic.title).contains(operacao.IncluirResponsavelTecnico, {timeout: 30000})  
  cy.wait('@rt')

  if (typeof rt === "undefined") {
      cy.get(path.operacaoResponsavelTecnico.cpf).type(fakerBr.br.cpf())
    cy.get(path.operacaoResponsavelTecnico.nome).type(fakerBr.company.companyName())
    cy.get(path.operacaoResponsavelTecnico.email).type(fakerBr.internet.email())
    cy.get(path.operacaoResponsavelTecnico.telefone).type(fakerBr.phone.phoneNumber())
    cy.get(path.operacaoResponsavelTecnico.identidade).type(fakerBr.random.number())
    cy.get(path.operacaoResponsavelTecnico.orgaoEmissor).type(fakerBr.lorem.word({length: {min: 3, max: 5}}))
    cy.get(path.operacaoResponsavelTecnico.dataNascimento).type(dataFaker)      
    cy.get(path.operacaoResponsavelTecnico.uf).click()        
        .get(path.generic.listaVirtual)        
        .contains(uf.nome).click({force: true}) 
  } else {
      cy.get(path.operacaoResponsavelTecnico.cpf).type(rt.cpf)
    cy.get(path.operacaoResponsavelTecnico.nome).type(rt.nome)
    cy.get(path.operacaoResponsavelTecnico.email).type(fakerBr.internet.email())
    cy.get(path.operacaoResponsavelTecnico.telefone).type(fakerBr.phone.phoneNumber())
    cy.get(path.operacaoResponsavelTecnico.identidade).type(rt.identidade)
    cy.get(path.operacaoResponsavelTecnico.orgaoEmissor).type(fakerBr.lorem.word({length: {min: 3, max: 5}}))
    cy.get(path.operacaoResponsavelTecnico.dataNascimento).type(rt.dataNascimento)      
    cy.get(path.operacaoResponsavelTecnico.uf).click()        
        .get(path.generic.listaVirtual)        
        .contains(uf.nome).click({force: true})
  }
  

  cy.get(path.generic.botaoSubmit).click({force: true})
  cy.wait('@rtsalvar')

})

Cypress.Commands.add('excluirResponsavelTecnico', (fakerBr, rt)=>{
  let uf = fakerBr.random.arrayElement(path.generic.uf)
  let dataFaker = '20/02/2000'

  cy.intercept('GET', '**/rntrc/PrePedido/**').as('rt')
  cy.intercept('GET', '**/responsaveltecnico/**').as('rtsalvar')
  
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Responsável Técnico').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})  

  cy.get(path.generic.title).should('have.text', operacao.ExcluirResponsavelTecnico)
  cy.wait('@rt')
    cy.get(path.operacaoResponsavelTecnico.cpf).type(rt.cpf)
    cy.get(path.operacaoResponsavelTecnico.nome).type(rt.nome)
    cy.get(path.operacaoResponsavelTecnico.email).type(fakerBr.internet.email())
    cy.get(path.operacaoResponsavelTecnico.telefone).type(fakerBr.phone.phoneNumber())
    cy.get(path.operacaoResponsavelTecnico.identidade).type(rt.identidade)
    cy.get(path.operacaoResponsavelTecnico.orgaoEmissor).type(fakerBr.lorem.word({length: {min: 3, max: 5}}))
    cy.get(path.operacaoResponsavelTecnico.dataNascimento).type(rt.dataNascimento)      
    cy.get(path.operacaoResponsavelTecnico.uf).click()        
        .get(path.generic.listaVirtual)        
        .contains(uf.nome).click({force: true})

  cy.get(path.generic.botaoSubmit).click({force: true})
  cy.wait('@rtsalvar')
})

Cypress.Commands.add('incluirVeiculo', (veiculo)=>{ 
  cy.intercept('POST', '**/veiculo/salvar').as('salvarveiculo')  
  cy.intercept('GET', '/rntrc/InstituicaoFinanceira/listarInstituicoes**').as('instituicaoFinanceira')  
  //cy.intercept('GET', '/rntrc/PrePedido/2071914/veiculo/**').as('imagemVeiculo')  
  cy.get(path.detalhamentoAtendimentoPage.operacao, {timeout: 20000})
  .contains('Veículos', {timeout: 20000}).click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})
          
  cy.get(path.generic.title, {timeout: 10000}).contains(operacao.IncluirVeiculo, {timeout: 20000})  

  cy.get(path.operacaoVeiculo.placa).type(veiculo.placa)
  cy.wait("@instituicaoFinanceira")
  cy.get(path.operacaoVeiculo.renavam).type(veiculo.renavam)
  cy.get(path.operacaoVeiculo.radioAutomotor).click({force: true});

  veiculo.tipoVeiculo != 'Implemento' ?
    cy.get(path.operacaoVeiculo.radioAutomotor).click({force: true}):
    cy.get(path.operacaoVeiculo.radioImplemento).click({force: true})
      
  cy.get(path.operacaoVeiculo.tipoPropriedade).click({force: true})

  switch (veiculo.propriedade) {
    case 'Próprio':
      cy.get(path.operacaoVeiculo.tipoPropriedadeProprio)
      .contains(veiculo.propriedade).click({force: true})
      .get(path.operacaoVeiculo.tipoPropriedade)
      .should('have.text', veiculo.propriedade)      
      break;

    case 'Arrendado':
      cy.get(path.operacaoVeiculo.tipoPropriedadeArrendado)
      .contains(veiculo.propriedade).click({force: true})
      .get(path.operacaoVeiculo.tipoPropriedade)
      .should('have.text', veiculo.propriedade)   
      
      cy.get(path.operacaoVeiculo.cpfCnpjProprietario).type(veiculo.proprietario, {force: true});
      break;
  
    case 'Leasing':
      cy.get(path.operacaoVeiculo.tipoPropriedadeLeasing)
      .contains(veiculo.propriedade).click({force: true})
      .get(path.operacaoVeiculo.tipoPropriedade)
      .should('have.text', veiculo.propriedade)

      cy.get(path.operacaoVeiculo.instituicoesFinanceiras).click({force: true})
      .get(path.operacaoVeiculo.instituicaoFinanceiraSelecionada)
      .contains('BANCO POTTENCIAL S.A.').click({force: true});
      break;   

      default:
        cy.log(` ---- Propriedade digitada incorretamente:${veiculo.propriedade} ----`)
        break
  }


  cy.get(path.generic.botaoSubmit).click({force: true})
  //cy.wait('@imagemVeiculo')
  cy.wait('@salvarveiculo')
})

Cypress.Commands.add('excluirVeiculo', (veiculo)=>{ 
  cy.intercept('POST', '**/veiculo/excluir').as('excluirveiculo')  
  
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Veículos').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})
          
  cy.get(path.generic.title, {timeout: 10000}).contains(operacao.ExcluirVeiculo, {timeout: 10000})  

  cy.get(path.operacaoVeiculo.placa).type(veiculo.placa)
  cy.get(path.operacaoVeiculo.renavam).type(veiculo.renavam)

  veiculo.tipoVeiculo != 'Implemento' ?
    cy.get(path.operacaoVeiculo.radioAutomotor).click({force: true}):
    cy.get(path.operacaoVeiculo.radioImplemento).click({force: true})
      
  cy.get(path.generic.botaoSubmit).click({force: true})
  cy.wait('@excluirveiculo')
})

Cypress.Commands.add('alterarVeiculo', (veiculo)=>{ 
  cy.intercept('POST', '**/veiculo/salvar').as('salvarveiculo')
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Veículos').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})
          
  cy.get(path.generic.title, {timeout: 10000}).contains(operacao.AlterarVeiculo, {timeout: 10000})  

  cy.get(path.operacaoVeiculo.placa).type(veiculo.placa)
  cy.get(path.operacaoVeiculo.renavam).type(veiculo.renavam)
  cy.get(path.operacaoVeiculo.radioAutomotor).click({force: true});

  veiculo.tipoVeiculo != 'Implemento' ?
    cy.get(path.operacaoVeiculo.radioAutomotor).click({force: true}):
    cy.get(path.operacaoVeiculo.radioImplemento).click({force: true})
      
  cy.get(path.operacaoVeiculo.tipoPropriedade).click({force: true})

  switch (veiculo.propriedade) {
    case 'Próprio':
      cy.get(path.operacaoVeiculo.tipoPropriedadeProprio)
      .contains(veiculo.propriedade).click({force: true})
      .get(path.operacaoVeiculo.tipoPropriedade)
      .should('have.text', veiculo.propriedade)      
      break;

    case 'Arrendado':
      cy.get(path.operacaoVeiculo.tipoPropriedadeArrendado)
      .contains(veiculo.propriedade).click({force: true})
      .get(path.operacaoVeiculo.tipoPropriedade)
      .should('have.text', veiculo.propriedade)   
      
      cy.get(path.operacaoVeiculo.cpfCnpjProprietario).type(veiculo.proprietario, {force: true});
      break;
  
    case 'Leasing':
      cy.get(path.operacaoVeiculo.tipoPropriedadeLeasing)
      .contains(veiculo.propriedade).click({force: true})
      .get(path.operacaoVeiculo.tipoPropriedade)
      .should('have.text', veiculo.propriedade)

      cy.get(path.operacaoVeiculo.instituicoesFinanceiras).click({force: true})
      .get(path.operacaoVeiculo.instituicaoFinanceiraSelecionada)
      .contains('BANCO POTTENCIAL S.A.').click({force: true});
      break;   

      default:
        cy.log(` ---- Propriedade digitada incorretamente:${veiculo.propriedade} ----`)
        break
  }


  cy.get(path.generic.botaoSubmit).click({force: true})
  cy.wait('@salvarveiculo')
})



