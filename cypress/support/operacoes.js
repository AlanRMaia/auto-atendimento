import urls from './urls';
import path, { operacaoEnviarDocumentos, operacaoContato } from '../selectors/path.sel.cy';
import operacao from './OperacaoEnum';
import ufEnum from "./uf";
require('cypress-xpath');

Cypress.Commands.add('salvarTransportador', (faker) => {    
    
    //Criar operação Salvar transportador       
    cy.xpath(path.generic.floatButton, {timeout: 10000}).click({force: true})
    .get(path.detalhamentoAtendimentoRenovacao.operacao).each((ele, index, list)=>{
      let value = ele.text()
       if(value === operacao.SalvarTransportador)
          cy.wrap(ele).click();      
    })
    //.xpath(path.detalhamentoAtendimentoRenovacao.operacaoSalvarTransportador).click();  
    //Na janela para incluir o Transportador no atendimento
    cy.get(path.generic.title).should('have.text', operacao.SalvarTransportador)   
   //Razão Social
   cy.get(path.operacaoSalvarTransportador.razaoSocial ).clear().type(faker.company.name());
   //Nome fantasia
   cy.get(path.operacaoSalvarTransportador.nomeFantasia ).clear().type(faker.company.name());
   //inscrição estadual
   cy.get(path.operacaoSalvarTransportador.inscricaoEstadual).clear().type(faker.number.int({ min: 1000, max: 2000 }));
   //checkBox comunicado ANTT
   cy.get(path.operacaoSalvarTransportador.checkBoxComunicacaoANTT).should('not.be.checked')
   //checkbox capacidade financeira
   cy.get(path.operacaoSalvarTransportador.checkBoxCapacidadeFinanceira).should('not.be.checked')
   //botao Salvar
   cy.get(path.generic.botaoSubmit).click({ force: true });  
    
})

Cypress.Commands.add('enviarDocumentosIdentidade', (selectFile) => {

  cy.xpath(path.generic.floatButton, {timeout: 10000}).click({force: true})
      .get(path.detalhamentoAtendimentoRenovacao.operacao).each((ele, index, list)=>{
        let value = ele.text()
         if(value === operacao.EnviarDocumentos)
            cy.wrap(ele).click();      
        
      })
      //Confirmar titulo
      cy.get(path.generic.title).should('have.text', operacao.EnviarDocumentos)
      cy.wait(1000);
      //selecionando o tipo de documento
      cy.get(path.operacaoEnviarDocumentos.tipoDocumento, {timeout: 10000}
        ).click()         
      
      cy.getElementListXpath(
         path.operacaoEnviarDocumentos.documentoIdentidade,
        'Documento de Identidade'
       );  
  
      //Anexando o documento Identidade
      cy.get(path.operacaoEnviarDocumentos.anexarDocumento
        ).selectFile(
          selectFile
        );
        //Salvando a operação  
        cy.get(path.generic.botaoSubmit).click();
})

Cypress.Commands.add('enviarDocumentosRT', (selectFile) => {

  cy.xpath(path.generic.floatButton, {timeout: 10000}).click({force: true})
      .get(path.detalhamentoAtendimentoRenovacao.operacao).each((ele, index, list)=>{
        let value = ele.text()
         if(value === operacao.EnviarDocumentos)
            cy.wrap(ele).click();      
        
      })
      //Confirmar titulo
      cy.get(path.generic.title).should('have.text', 'Enviar Documentos')
      //selecionando o tipo de documento
      cy.wait(1000);
      cy.get(path.operacaoEnviarDocumentos.tipoDocumento, {timeout: 10000}
      ).click()         
      
      cy.getElementListXpath(
         path.operacaoEnviarDocumentos.registroRT,
        'Registro de RT'
       );  
  
      //Anexando o documento Identidade
      cy.get(path.operacaoEnviarDocumentos.anexarDocumento
        ).selectFile(
          selectFile
        );
        //Salvando a operação  
        cy.get(path.generic.botaoSubmit).click();
})

Cypress.Commands.add('incluirContatoEmail', (faker)=>{  

      cy.xpath(path.generic.floatButton, {timeout: 10000}).click({force: true})
      .get(path.detalhamentoAtendimentoRenovacao.operacao).each((ele, index, list)=>{
        let value = ele.text()
         if(value === operacao.IncluirContato)
            cy.wrap(ele).click();      
        
      })
      cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirContato)
      cy.get(path.operacaoContato.tipoContato).click()
      cy.xpath('/html/body/div[8]/div/div[2]/div[4]/div[2]/div/span').should('have.text', 'Email').click()           
      cy.get(path.operacaoContato.tipoContatoValor).type(faker.internet.email())    
      cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
      cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('incluirContatoFax', (faker)=>{  

  cy.xpath(path.generic.floatButton, {timeout: 10000}).click({force: true})
  .get(path.detalhamentoAtendimentoRenovacao.operacao).each((ele, index, list)=>{
    let value = ele.text()
     if(value === operacao.IncluirContato)
        cy.wrap(ele).click();      
    
  })
  cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirContato)
  cy.get(path.operacaoContato.tipoContato).click()
  cy.xpath('/html/body/div[8]/div/div[2]/div[3]/div[2]/div/span').should('have.text', 'Fax').click()     
  cy.get(path.operacaoContato.tipoContatoValor).type(faker.phone.number())    
  cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
  cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('incluirContatoCelular', (faker)=>{  

  cy.xpath(path.generic.floatButton, {timeout: 10000}).click({force: true})
  .get(path.detalhamentoAtendimentoRenovacao.operacao).each((ele, index, list)=>{
    let value = ele.text()
     if(value === operacao.IncluirContato)
        cy.wrap(ele).click();      
    
  })
  cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirContato)
  cy.get(path.operacaoContato.tipoContato).click()
  cy.xpath('/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span').should('have.text', 'Celular').click()     
  cy.get(path.operacaoContato.tipoContatoValor).type(faker.phone.number())    
  cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
  cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('incluirContatoTelefone', (faker)=>{  

  cy.xpath(path.generic.floatButton, {timeout: 10000}).click({force: true})
  .get(path.detalhamentoAtendimentoRenovacao.operacao).each((ele, index, list)=>{
    let value = ele.text()
     if(value === operacao.IncluirContato)
        cy.wrap(ele).click();      
    
  })
  cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirContato)
  cy.get(path.operacaoContato.tipoContato).click()
  cy.xpath('/html/body/div[8]/div/div[2]/div[2]/div[2]/div/span').should('have.text', 'Telefone').click()     
  cy.get(path.operacaoContato.tipoContatoValor).type(faker.phone.number())    
  cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
  cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('incluirEnderecoComercial', (faker) => {
  let uf = faker.random.arrayElement(path.generic.uf)

  cy.xpath(path.generic.floatButton, {timeout: 10000}).click({force: true})
        .get(path.detalhamentoAtendimentoRenovacao.operacao, {timeout: 10000})   
        .each(($ele, index, list) => {
            if ($ele.text() === operacao.IncluirEndereco) 
            cy.wrap($ele).click();      
        })
        cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirEndereco)
        cy.get(path.operacaoEndereco.tipoEndereco).click()
        .xpath(path.operacaoEndereco.comercial)
        .should('have.text', 'Comercial').click()

        cy.get(path.operacaoEndereco.cep)
        .type(faker.address.zipCodeValid())

        cy.get(path.operacaoEndereco.logradouro)
        .type(faker.address.streetAddress())

        cy.get(path.operacaoEndereco.numero)
        .type(faker.random.number())

        cy.get(path.operacaoEndereco.complemento)
        .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.bairro)
        .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.cidade)
        .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.pontoDeReferencia)
        .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.uf).click()        
        .xpath(uf.path)        
        .should('have.text', uf.nome).click()              
        
        cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('incluirEnderecoCorrespondencia', (faker) => {
  let uf = faker.random.arrayElement(path.generic.uf)
  cy.xpath(path.generic.floatButton, {timeout: 10000}).click({force: true})
        .get(path.detalhamentoAtendimentoRenovacao.operacao, {timeout: 10000})   
        .each(($ele, index, list) => {
            if ($ele.text() === operacao.IncluirEndereco) 
            cy.wrap($ele).click();      
        })
        cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirEndereco)
        cy.get(path.operacaoEndereco.tipoEndereco).click()
        .xpath(path.operacaoEndereco.correspondencia)
        .should('have.text', 'Correspondência').click()

        cy.get(path.operacaoEndereco.cep)
        .type(faker.address.zipCodeValid())

        cy.get(path.operacaoEndereco.logradouro)
        .type(faker.address.streetAddress())

        cy.get(path.operacaoEndereco.numero)
        .type(faker.random.number())

        cy.get(path.operacaoEndereco.complemento)
        .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.bairro)
        .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.cidade)
        .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.pontoDeReferencia)
        .type(faker.lorem.word({strategy: 'shortext'}))

        cy.get(path.operacaoEndereco.uf).click()        
        .xpath(uf.path)        
        .should('have.text', uf.nome).click()              
        
        cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('incluirGestor', (faker)=>{
  cy.xpath(path.generic.floatButton, {timeout: 10000}).click({force: true})
        .get(path.detalhamentoAtendimentoRenovacao.operacao, {timeout: 10000})   
        .each(($ele, index, list) => {
            if ($ele.text() === operacao.IncluirGestor) 
            cy.wrap($ele).click();      
        })
          
  cy.get(path.generic.title).should('have.text', operacao.IncluirGestor)
  cy.get(path.operacaoGestor.tipoVinculo).click()
  .xpath('/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span')
  .should('have.text', 'Sócio').click()

  cy.get(path.operacaoGestor.cpfCnpj).type(faker.br.cpf())
  cy.get(path.operacaoGestor.nome).type(`${faker.name.firstName()} ${faker.name.lastName()}`)
  cy.get(path.operacaoGestor.email).type(faker.internet.email())
  cy.get(path.operacaoGestor.telefone).type(faker.phone.phoneNumber())
  cy.get(path.operacaoGestor.cargo).type(faker.company.catchPhraseDescriptor())

  cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('incluirFilial', (faker)=>{
  let uf = faker.random.arrayElement(path.generic.uf)
  
  cy.xpath(path.generic.floatButton, {timeout: 10000}).click({force: true})
        .get(path.detalhamentoAtendimentoRenovacao.operacao, {timeout: 10000})   
        .each(($ele, index, list) => {
            if ($ele.text() === operacao.IncluirFilial) 
            cy.wrap($ele).click();      
        })
          
  cy.get(path.generic.title).should('have.text', operacao.IncluirFilial)  

  cy.get(path.operacaoFilial.cnpj).type(faker.br.cnpj())
  cy.get(path.operacaoFilial.nome).type(faker.company.companyName())
  cy.get(path.operacaoFilial.capitalSocial).type(faker.random.number())
  cy.get(path.operacaoFilial.uf).click()  
  .xpath(uf.path)
  .should('have.text', uf.nome).click()

  cy.get(path.generic.botaoSubmit).click()
})