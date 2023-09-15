import urls from './urls';
import path, { operacaoDocumentos, operacaoContato } from '../selectors/path.sel.cy';
import operacao from './OperacaoEnum';
import ufEnum from "./uf";
require('cypress-xpath');

Cypress.Commands.add('operacaoTransportador', (faker, tipoTransportador, idPedido) => {    
    
    //Criar operação Salvar transportador       
    //cy.get(`[href="#/atendimento/${idPedido}/transportador/detalhar"] > .q-tab__content > .q-tab__label`, {timeout: 10000})
    cy.get(path.detalhamentoAtendimentoPage.operacaoTransportador)
    .contains('Transportador').click({force: true})
    
    //.xpath(path.detalhamentoAtendimento.operacaoTransportador).click();  
    //Na janela para incluir o Transportador no atendimento
    cy.get(path.generic.title).should('have.text', operacao.Transportador) 
    if (tipoTransportador == 'ETC') {
       //Razão Social
      cy.get(path.operacaoTransportador.razaoSocial ).clear().type(faker.company.name());
      //Nome fantasia
      cy.get(path.operacaoTransportador.nomeFantasia ).clear().type(faker.company.name());

      //inscrição estadual
      cy.get(path.operacaoTransportador.inscricaoEstadual).clear().type(faker.number.int({ min: 1000, max: 2000 }));
      //checkBox comunicado ANTT
      cy.get(path.operacaoTransportador.checkBoxComunicacaoANTT).should('not.be.checked')
      //checkbox capacidade financeira
      //cy.get(path.operacaoTransportador.checkBoxCapacidadeFinanceira).should('not.be.checked')
    } else if (tipoTransportador == 'CTC') {
       //Razão Social
       cy.get(path.operacaoTransportador.razaoSocial ).clear().type(faker.company.name());
       //Nome fantasia
       cy.get(path.operacaoTransportador.nomeFantasia ).clear().type(faker.company.name()); 
       //inscrição estadual
       cy.get(path.operacaoTransportador.inscricaoEstadual).clear().type(faker.number.int({ min: 1000, max: 2000 }));
       //junta comercial
       cy.get(path.operacaoTransportador.juntaComercial).clear().type(faker.number.int({ min: 1000, max: 2000 }));
       //inscricao OCB
       cy.get(path.operacaoTransportador.inscricaoOCB).clear().type(faker.number.int({ min: 1000, max: 2000 }));

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

  cy.get(path.operacaoDocumentos.abrirOperacao)
  .contains('Documentos').click({force: true})

      //Confirmar titulo
      cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.Documentos)
      .wait(5000)
      //selecionando o tipo de documento
      cy.get(path.operacaoDocumentos.tipoDocumento).click({force: true})       
      
      cy.getElementList(
         path.operacaoDocumentos.documentoIdentidade,
        'Documento de Identidade'
       );  
  
      //Anexando o documento Identidade
      cy.get(path.operacaoDocumentos.anexarDocumento
        ).selectFile(
          selectFile
        );
        //Salvando a operação  
        cy.get(path.generic.botaoSubmit).click({force: true});
})

Cypress.Commands.add('enviarDocumentosRT', (selectFile) => {

  cy.get(path.detalhamentoAtendimentoPage.operacaoDocumentos)
  .contains('Documentos').click({force: true})
      //Confirmar titulo
      cy.get(path.generic.title, {timeout: 10000}).should('have.text', 'Enviar Documentos')
      .wait(5000)
      //selecionando o tipo de documento
      cy.get(path.operacaoDocumentos.tipoDocumento).click({force: true})       
      
      cy.getElementList(
         path.operacaoDocumentos.registroRT,
        'Registro de RT'
       );  
  
      //Anexando o documento Identidade
      cy.get(path.operacaoDocumentos.anexarDocumento
        ).selectFile(
          selectFile
        );
        //Salvando a operação  
        cy.get(path.generic.botaoSubmit).click({force: true});        
})

Cypress.Commands.add('incluirContatoEmail', (faker)=>{  
  
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Contato').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})

      cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirContato)
      cy.get(path.operacaoContato.tipoContato).click().wait(3000)            
      .get(path.operacaoContato.email).contains('Email').click({force: true})           
      cy.get(path.operacaoContato.tipoContatoValor).type(faker.internet.email())    
      cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
      cy.get(path.generic.botaoSubmit).click({froce: true})
})

Cypress.Commands.add('incluirContatoFax', (faker)=>{  

  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Contato').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})

  cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirContato)
  cy.get(path.operacaoContato.tipoContato).click().wait(3000)    
  .get(path.operacaoContato.fax).contains('Fax').click({force: true})     
  cy.get(path.operacaoContato.tipoContatoValor).type(faker.phone.number('(##)####-####'))    
  cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
  cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('incluirContatoCelular', (faker)=>{  

  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Contato').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})

  cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirContato)
  cy.get(path.operacaoContato.tipoContato).click().wait(3000)  
  .get(path.operacaoContato.celular).contains('Celular').click({force: true})     
  cy.get(path.operacaoContato.tipoContatoValor).type(faker.phone.number('(##)#####-####'))    
  cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
  cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('incluirContatoTelefone', (faker)=>{ 
  
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Contato').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})

  cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirContato).wait(2000)
  cy.get(path.operacaoContato.tipoContato).click().get(path.operacaoContato.telefone).contains('Telefone').click({force: true}) 
  //.xpath(path.operacaoContato.telefone).should('have.text', 'Telefone').click({force: true})     
  cy.get(path.operacaoContato.tipoContatoValor).type(faker.phone.number('(##)####-####'))    
  cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
  cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('excluirContatoFax', (faker, phone) =>{
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Contato').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})

        cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.ExcluirContato)
        cy.get(path.operacaoContato.tipoContato).click().wait(3000)        
        .get(path.operacaoContato.fax).contains('Fax').click({force: true})      
        cy.get(path.operacaoContato.tipoContatoValor).type(phone)    
        cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
        cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('excluirContatoCelular', (faker, phone) => {
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Contato').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})   
           
        //cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.ExcluirContato)
        cy.get(path.operacaoContato.tipoContato).click().wait(3000)               
        .get(path.operacaoContato.celular).contains('Celular').click({force: true})      
        cy.get(path.operacaoContato.tipoContatoValor).type(phone)    
        cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
        cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('excluirContatoEmail', (faker, email) => {
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Contato').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})

        cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.ExcluirContato)
        cy.get(path.operacaoContato.tipoContato).click().wait(3000)               
        .get(path.operacaoContato.email).contains('Email').click({force: true})      
        cy.get(path.operacaoContato.tipoContatoValor).type(email)    
        cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
        cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('excluirContatoTelefone', (faker, phone) => {
  cy.get(path.detalhamentoAtendimentoPage.abrirOperacao)
  .contains('Contato').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})
      cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.ExcluirContato)
      cy.get(path.operacaoContato.tipoContato).click().wait(3000)            
      .get(path.operacaoContato.telefone).contains('Telefone').click({force: true})      
      cy.get(path.operacaoContato.tipoContatoValor).type(phone)    
      cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
      cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('incluirEnderecoComercial', (faker) => {
  let uf = faker.random.arrayElement(path.generic.uf)

  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Endereço').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})

        cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirEndereco)
        cy.get(path.operacaoEndereco.tipoEndereco).click({froce: true})
        .get(path.operacaoEndereco.comercial)
        .contains('Comercial').click({force: true})

        cy.get(path.operacaoEndereco.cep)
        .type(faker.address.zipCodeValid())

        cy.get(path.operacaoEndereco.logradouro)
        .type(faker.address.streetAddress())

        cy.get('.q-inner-loading', {timeout: 30000}).should('be.visible')

        cy.get('.q-inner-loading', {timeout: 50000}).should('not.exist')

        cy.get(path.operacaoEndereco.numero)
        .type(faker.random.number(), {force: true})

        // cy.get(path.operacaoEndereco.complemento)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.bairro)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.cidade)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.pontoDeReferencia)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.uf).click()        
        // .xpath(uf.path)        
        // .should('have.text', uf.nome).click()              
        
        cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('alterarEnderecoComercial', (faker) => {
  let uf = faker.random.arrayElement(path.generic.uf)

  cy.get(path.detalhamentoAtendimentoPage.abrirOperacao)
  .contains('Endereço').click({force: true})
  .get(path.detalhamentoAtendimentoPage.operacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})

        cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.AlterarEndereco)
        cy.get(path.operacaoEndereco.tipoEndereco).click({force: true})
        .get(path.operacaoEndereco.comercial)
        .contains('Comercial').click({force: true})

        cy.get(path.operacaoEndereco.cep)
        .type(faker.address.zipCodeValid())

        cy.get(path.operacaoEndereco.logradouro)
        .type(faker.address.streetAddress())

        cy.get('.q-inner-loading', {timeout: 30000}).should('be.visible')

        cy.get('.q-inner-loading', {timeout: 50000}).should('not.exist')

        cy.get(path.operacaoEndereco.numero)
        .type(faker.random.number(), {force: true})

        // cy.get(path.operacaoEndereco.complemento)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.bairro)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.cidade)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.pontoDeReferencia)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.uf).click()        
        // .xpath(uf.path)        
        // .should('have.text', uf.nome).click()              
        
        cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('excluirEnderecoComercial', (faker) => {
  let uf = faker.random.arrayElement(path.generic.uf)

  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Endereço').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})
  
        cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.ExcluirEndereco)
        cy.get(path.operacaoEndereco.tipoEndereco).click({force: true})
        .get(path.operacaoEndereco.comercial)
        .contains('Comercial').click({force: true})

        cy.get(path.operacaoEndereco.cep)
        .type(faker.address.zipCodeValid())

        cy.get(path.operacaoEndereco.logradouro)
        .type(faker.address.streetAddress())

        cy.get('.q-inner-loading', {timeout: 30000}).should('be.visible')

        cy.get('.q-inner-loading', {timeout: 50000}).should('not.exist')

        cy.get(path.operacaoEndereco.numero)
        .type(faker.random.number(), {force: true})

        // cy.get(path.operacaoEndereco.complemento)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.bairro)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.cidade)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.pontoDeReferencia)
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.uf).click()        
        // .xpath(uf.path)        
        // .should('have.text', uf.nome).click()              
        
        cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('incluirEnderecoCorrespondencia', (faker) => {
  let uf = faker.random.arrayElement(path.generic.uf)
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Endereço').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})

        cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirEndereco).wait(3000)
        cy.get(path.operacaoEndereco.tipoEndereco).click({force: true})
        .get(path.operacaoEndereco.correspondencia)
        .contains('Correspondência').click({force: true})

        cy.get(path.operacaoEndereco.cep)
        .type(faker.address.zipCodeValid()).next()
        cy.get(path.operacaoEndereco.logradouro, {timeout: 20000}).trigger('mouseover').click({force: true})
        cy.get('.q-inner-loading', {timeout: 30000}).should('be.visible')

        cy.get('.q-inner-loading', {timeout: 50000}).should('not.exist')

        cy.get(path.operacaoEndereco.logradouro, {timeout: 20000})
        .type(faker.address.streetAddress())
        

        cy.get(path.operacaoEndereco.numero, {timeout: 20000})
        .type(faker.random.number())

        cy.get(path.operacaoEndereco.complemento, {timeout: 20000})
        .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.bairro, {timeout: 20000})
        .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.cidade, {timeout: 20000})
        .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.pontoDeReferencia, {timeout: 20000})
        .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.uf, {timeout: 20000}).click()        
        // .xpath(uf.nome)        
        // .should('have.text', uf.nome).click()              
        
        cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('excluirEnderecoCorrespondencia', (faker) => {
  let uf = faker.random.arrayElement(path.generic.uf)
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Endereço').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})
  
        cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.ExcluirEndereco)
        cy.get(path.operacaoEndereco.tipoEndereco).click({force: true})
        .get(path.operacaoEndereco.correspondencia)
        .contains('Correspondência').click({force: true})

        cy.get(path.operacaoEndereco.cep)
        .type(faker.address.zipCodeValid()).next()
        cy.get(path.operacaoEndereco.logradouro, {timeout: 20000}).trigger('mouseover').click({force: true})
        cy.get('.q-inner-loading', {timeout: 30000}).should('be.visible')

        cy.get('.q-inner-loading', {timeout: 50000}).should('not.exist')

        // cy.get(path.operacaoEndereco.logradouro, {timeout: 20000})
        // .type(faker.address.streetAddress())
        

        cy.get(path.operacaoEndereco.numero, {timeout: 20000})
        .type(faker.random.number())

        // cy.get(path.operacaoEndereco.complemento, {timeout: 20000})
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.bairro, {timeout: 20000})
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.cidade, {timeout: 20000})
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.pontoDeReferencia, {timeout: 20000})
        // .type(faker.lorem.word({strategy: 'shortext'}))

        // cy.get(path.operacaoEndereco.uf, {timeout: 20000}).click()        
        // .xpath(uf.path)        
        // .should('have.text', uf.nome).click()              
        
        cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('incluirGestor', (gestor, tipoTransportador)=>{
 
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Gestor').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})
          
  cy.get(path.generic.title).should('have.text', operacao.IncluirGestor).wait(3000)  
        cy.log('cargo do gestor:', gestor.cargo)
        cy.log('tipo transportador', tipoTransportador)
    if (tipoTransportador === 'ETC' && gestor.cargo === 'Responsável Legal') {  

        cy.get(path.operacaoGestor.tipoVinculo, {timeout: 10000}).click({force: true})        
        cy.get(path.operacaoGestor.listTipoVinculo).contains(gestor.cargo).click({force: true})
        cy.get(path.operacaoGestor.cpfCnpj).type(gestor.cpfCnpj)
        cy.get(path.operacaoGestor.nome).type(gestor.nome)
        cy.get(path.operacaoGestor.dataNascimento).type(gestor.nascimento)
        cy.get(path.operacaoGestor.cargo).type(gestor.cargo)  
        cy.get(path.operacaoGestor.telefone).type(gestor.telefone)
        cy.get(path.operacaoGestor.email).type(gestor.email)

    }else if (tipoTransportador == 'ETC' && gestor.cargo == 'Sócio'){

      cy.get(path.operacaoGestor.cpfCnpj).type(gestor.cpfCnpj)
        cy.get(path.operacaoGestor.nome).type(gestor.nome)
        cy.get(path.operacaoGestor.dataNascimento).type(gestor.nascimento)
        cy.get(path.operacaoGestor.cargo).type(gestor.cargo)  
        cy.get(path.operacaoGestor.telefone).type(gestor.telefone)
        cy.get(path.operacaoGestor.email).type(gestor.email)

    }else{
      cy.get(path.operacaoGestor.cpfCnpj).type(gestor.cpfCnpj)
        cy.get(path.operacaoGestor.nome).type(gestor.nome)
        cy.get(path.operacaoGestor.dataNascimento).type(gestor.nascimento)
        cy.get(path.operacaoGestor.cargo).type(gestor.cargo)  
        cy.get(path.operacaoGestor.telefone).type(gestor.telefone)
        cy.get(path.operacaoGestor.email).type(gestor.email)
    }   

  cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('excluirGestor', (gestor, tipoTransportador)=>{
 
  cy.get('[data-cy=btnOperacoes]')
  .contains('Gestor').click({force: true})
  .get('[data-cy=listIncluirAlterarExcluir]', {timeout: 10000}).contains('Excluir').click({force: true})
          
  cy.get(path.generic.title).should('have.text', operacao.Gestor).wait(3000)  
        
    if (tipoTransportador == 'ETC' && gestor.cargo == 'Responsável Legal') {  

        cy.get(path.operacaoGestor.tipoVinculo, {timeout: 10000}).click().type(gestor.cargo)
        cy.get(path.operacaoGestor.listTipoVinculo).contains(gestor.cargo)                
         .click({force: true})
         cy.get(path.operacaoGestor.cpfCnpj).type(gestor.cpfCnpj)
         cy.get(path.operacaoGestor.nome).type(gestor.nome)
         cy.get(path.operacaoGestor.dataNascimento).type(gestor.nascimento)
         cy.get(path.operacaoGestor.cargo).type(gestor.cargo)  
         cy.get(path.operacaoGestor.telefone).type(gestor.telefone)
         cy.get(path.operacaoGestor.email).type(gestor.email)

    }else if (tipoTransportador == 'ETC' && gestor.cargo == 'Sócio'){

      cy.get(path.operacaoGestor.cpfCnpj).type(gestor.cpfCnpj)
        cy.get(path.operacaoGestor.nome).type(gestor.nome)
        cy.get(path.operacaoGestor.dataNascimento).type(gestor.nascimento)
        cy.get(path.operacaoGestor.cargo).type(gestor.cargo)  
        cy.get(path.operacaoGestor.telefone).type(gestor.telefone)
        cy.get(path.operacaoGestor.email).type(gestor.email)

    }else{
      cy.get(path.operacaoGestor.cpfCnpj).type(gestor.cpfCnpj)
        cy.get(path.operacaoGestor.nome).type(gestor.nome)
        cy.get(path.operacaoGestor.dataNascimento).type(gestor.nascimento)
        cy.get(path.operacaoGestor.cargo).type(gestor.cargo)  
        cy.get(path.operacaoGestor.telefone).type(gestor.telefone)
        cy.get(path.operacaoGestor.email).type(gestor.email)
    }   

  cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('incluirMotorista', (faker) => {

  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Motorista').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})
          
  cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirMotorista)
  cy.get(path.operacaoMotorista.cpf).type(faker.br.cpf())
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

Cypress.Commands.add('alterarMotorista', (faker, cpf) => {
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Motorista').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})
          
  cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.AlterarMotorista)
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



// Cypress.Commands.add('incluirFilial', (faker)=>{
//   let uf = faker.random.arrayElement(path.generic.uf)
  
//   cy.xpath(path.generic.floatButton, {timeout: 10000}).click({force: true})
//         .get(path.detalhamentoAtendimento.operacao, {timeout: 10000})   
//         .each(($ele, index, list) => {
//             if ($ele.text() === operacao.IncluirFilial) 
//             cy.wrap($ele).click();      
//         })
          
//   cy.get(path.generic.title).should('have.text', operacao.IncluirFilial)  

//   cy.get(path.operacaoFilial.cnpj).type(faker.br.cnpj())
//   cy.get(path.operacaoFilial.nome).type(faker.company.companyName())
//   cy.get(path.operacaoFilial.capitalSocial).type(faker.random.number())
//   cy.get(path.operacaoFilial.uf).click()  
//   .xpath(uf.path)
//   .should('have.text', uf.nome).click()

//   cy.get(path.generic.botaoSubmit).click()
// })

Cypress.Commands.add('incluirFilial', (faker)=>{
  let uf = faker.random.arrayElement(path.generic.uf)
  
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Filial').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})
          
  cy.get(path.generic.title).should('have.text', operacao.IncluirFilial)  

  cy.get(path.operacaoFilial.cnpj).type(faker.br.cnpj())
  cy.get(path.operacaoFilial.nome).type(faker.company.companyName())
  cy.get(path.operacaoFilial.capitalSocial).type(faker.random.number())
  // cy.get(path.operacaoFilial.uf).click({force: true})  
  // .xpath(uf.path)
  // .should('have.text', uf.nome).click({force: true})

  cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('excluirFilial', (filial)=>{  
  
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Filial').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})
          
  cy.get(path.generic.title).should('have.text', operacao.ExcluirFilial)  

  cy.get(path.operacaoFilial.cnpj).type(filial.cnpj)
  cy.get(path.operacaoFilial.nome).type(filial.nome)
  cy.get(path.operacaoFilial.capitalSocial).type(filial.capitalSocial)
  cy.get(path.operacaoFilial.uf).type(filial.uf)

  cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('incluirResponsavelTecnico', (fakerBr, rt)=>{
  let uf = fakerBr.random.arrayElement(path.generic.uf)
  let dataFaker = '20/02/2000'
  
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Responsável Técnico').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})  

  cy.get(path.generic.title).should('have.text', operacao.IncluirResponsavelTecnico)  

  if (typeof rt === "undefined") {
      cy.get(path.operacaoResponsavelTecnico.cpf).type(fakerBr.br.cpf())
    cy.get(path.operacaoResponsavelTecnico.nome).type(fakerBr.company.companyName())
    cy.get(path.operacaoResponsavelTecnico.email).type(fakerBr.internet.email())
    cy.get(path.operacaoResponsavelTecnico.telefone).type(fakerBr.phone.phoneNumber())
    cy.get(path.operacaoResponsavelTecnico.identidade).type(fakerBr.random.number())
    cy.get(path.operacaoResponsavelTecnico.orgaoEmissor).type(fakerBr.lorem.word({length: {min: 3, max: 5}}))
    cy.get(path.operacaoResponsavelTecnico.dataNascimento).type(dataFaker)      
    // cy.get(path.operacaoFilial.uf).click({force: true})  
    // .xpath(uf.path)
    // .should('have.text', uf.nome).click({force: true})
  } else {
      cy.get(path.operacaoResponsavelTecnico.cpf).type(rt.cpf)
    cy.get(path.operacaoResponsavelTecnico.nome).type(rt.nome)
    cy.get(path.operacaoResponsavelTecnico.email).type(fakerBr.internet.email())
    cy.get(path.operacaoResponsavelTecnico.telefone).type(fakerBr.phone.phoneNumber())
    cy.get(path.operacaoResponsavelTecnico.identidade).type(rt.identidade)
    cy.get(path.operacaoResponsavelTecnico.orgaoEmissor).type(fakerBr.lorem.word({length: {min: 3, max: 5}}))
    cy.get(path.operacaoResponsavelTecnico.dataNascimento).type(rt.dataNascimento)      
    // cy.get(path.operacaoFilial.uf).click({force: true})  
    // .xpath(uf.path)
    // .should('have.text', uf.nome).click({force: true})
  }
  

  cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('excluirResponsavelTecnico', (fakerBr, rt)=>{
  let uf = fakerBr.random.arrayElement(path.generic.uf)
  let dataFaker = '20/02/2000'
  
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Responsável Técnico').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})  

  cy.get(path.generic.title).should('have.text', operacao.ExcluirResponsavelTecnico)

    cy.get(path.operacaoResponsavelTecnico.cpf).type(rt.cpf)
    cy.get(path.operacaoResponsavelTecnico.nome).type(rt.nome)
    cy.get(path.operacaoResponsavelTecnico.email).type(fakerBr.internet.email())
    cy.get(path.operacaoResponsavelTecnico.telefone).type(fakerBr.phone.phoneNumber())
    cy.get(path.operacaoResponsavelTecnico.identidade).type(rt.identidade)
    cy.get(path.operacaoResponsavelTecnico.orgaoEmissor).type(fakerBr.lorem.word({length: {min: 3, max: 5}}))
    cy.get(path.operacaoResponsavelTecnico.dataNascimento).type(rt.dataNascimento)      
    // cy.get(path.operacaoFilial.uf).click({force: true})  
    // .xpath(uf.path)
    // .should('have.text', uf.nome).click({force: true})

  cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('incluirVeiculo', (veiculo)=>{ 
  
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Veículos').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})
          
  cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirVeiculo)  

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
      
      cy.get(path.operacaoVeiculo.cpfCnpjProprietario).type(veiculo.proprietario);
      break;
  
    case 'Leasing':
      cy.get(path.operacaoVeiculo.tipoPropriedadeLeasing)
      .contains(veiculo.propriedade).click({force: true})
      .get(path.operacaoVeiculo.tipoPropriedade)
      .should('have.text', veiculo.propriedade)

      cy.get(path.operacaoVeiculo.instituicoesFinanceiras).click({force: true})
      .get(path.operacaoVeiculo.instituicaoFinanceiraSelecionada)
      .should('have.text', 'BANCO POTTENCIAL S.A.').click({force: true});
      break;   

      default:
        cy.log(` ---- Propriedade digitada incorretamente:${veiculo.propriedade} ----`)
        break
  }


  cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('excluirVeiculo', (veiculo)=>{ 
  
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Veículos').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Excluir').click({force: true})
          
  cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.ExcluirVeiculo)  

  cy.get(path.operacaoVeiculo.placa).type(veiculo.placa)
  cy.get(path.operacaoVeiculo.renavam).type(veiculo.renavam)

  veiculo.tipoVeiculo != 'Implemento' ?
    cy.get(path.operacaoVeiculo.radioAutomotor).click({force: true}):
    cy.get(path.operacaoVeiculo.radioImplemento).click({force: true})
      
  cy.get(path.generic.botaoSubmit).click({force: true})
})

Cypress.Commands.add('alterarVeiculo', (veiculo)=>{ 
  
  cy.get(path.detalhamentoAtendimentoPage.operacao)
  .contains('Veículos').click({force: true})
  .get(path.detalhamentoAtendimentoPage.abrirOperacao, {timeout: 10000}).contains('Incluir/Alterar').click({force: true})
          
  cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.AlterarVeiculo)  

  cy.get(path.operacaoVeiculo.placa).type(veiculo.placa)
  cy.get(path.operacaoVeiculo.renavam).type(veiculo.renavam)
  cy.get(path.operacaoVeiculo.radioAutomotor).click({force: true});

  veiculo.tipoVeiculo != 'Implemento' ?
    cy.get(path.operacaoVeiculo.radioAutomotor).click({force: true}):
    cy.get(path.operacaoVeiculo.radioImplemento).click({froce: true})
      
  cy.get(path.operacaoVeiculo.tipoPropriedade).click({force: true})

  switch (veiculo.propriedade) {
    case 'Próprio':
      cy.xpath(path.operacaoVeiculo.tipoPropriedadeProprio)
      .should('have.text', veiculo.propriedade).click({force: true})
      .get(path.operacaoVeiculo.tipoPropriedade)
      .should('have.text', veiculo.propriedade)      
      break;

    case 'Arrendado':
      cy.xpath(path.operacaoVeiculo.tipoPropriedadeArrendado)
      .should('have.text', veiculo.propriedade).click({force: true})
      .get(path.operacaoVeiculo.tipoPropriedade)
      .should('have.text', veiculo.propriedade)   
      
      cy.get(path.operacaoVeiculo.cpfCnpjProprietario).type(veiculo.proprietario);
      break;
  
    case 'Leasing':
      cy.xpath(path.operacaoVeiculo.tipoPropriedadeLeasing)
      .should('have.text', veiculo.propriedade).click({force: true})
      .get(path.operacaoVeiculo.tipoPropriedade)
      .should('have.text', veiculo.propriedade)

      cy.get(path.operacaoVeiculo.instituicoesFinanceiras).click({force: true})
      .xpath(path.operacaoVeiculo.instituicaoFinanceiraSelecionada)
      .should('have.text', 'BANCO POTTENCIAL S.A.').click({force: true});
      break;   

      default:
        cy.log(` ---- Propriedade digitada incorretamente:${veiculo.propriedade} ----`)
        break
  }


  cy.get(path.generic.botaoSubmit).click({force: true})
})



