import urls from './urls';
import path, { operacaoEnviarDocumentos, operacaoContato } from '../selectors/path.sel.cy';
import operacao from './OperacaoEnum';
import ufEnum from "./uf";
require('cypress-xpath');

Cypress.Commands.add('salvarTransportador', (faker, tipoTransportador) => {    
    
    //Criar operação Salvar transportador       
    cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
    .get(path.detalhamentoAtendimentoRenovacao.operacao).each((ele, index, list)=>{
      let value = ele.text()
       if(value === operacao.SalvarTransportador)
          cy.wrap(ele).click();      
    })
    //.xpath(path.detalhamentoAtendimentoRenovacao.operacaoSalvarTransportador).click();  
    //Na janela para incluir o Transportador no atendimento
    cy.get(path.generic.title).should('have.text', operacao.SalvarTransportador) 
    if (tipoTransportador == 'ETC') {
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
    } else if (tipoTransportador == 'CTC') {
       //Razão Social
       cy.get(path.operacaoSalvarTransportador.razaoSocial ).clear().type(faker.company.name());
       //Nome fantasia
       cy.get(path.operacaoSalvarTransportador.nomeFantasia ).clear().type(faker.company.name()); 
       //inscrição estadual
       cy.get(path.operacaoSalvarTransportador.inscricaoEstadual).clear().type(faker.number.int({ min: 1000, max: 2000 }));
       //junta comercial
       cy.get(path.operacaoSalvarTransportador.juntaComercial).clear().type(faker.number.int({ min: 1000, max: 2000 }));
       //inscricao OCB
       cy.get(path.operacaoSalvarTransportador.inscricaoOCB).clear().type(faker.number.int({ min: 1000, max: 2000 }));

    } else {
      //Nome
      cy.get(path.operacaoSalvarTransportador.razaoSocial ).clear().type(`${faker.name.firstName()} ${faker.name.lastName()}`);
      //identidade
      cy.get(path.operacaoSalvarTransportador.identidade ).clear().type(faker.random.number());
    }    
  
   //botao Salvar
   cy.get(path.generic.botaoSubmit).click({ force: true });  
    
})

Cypress.Commands.add('enviarDocumentosIdentidade', (selectFile) => {

  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
      .get(path.detalhamentoAtendimentoRenovacao.operacao).each((ele, index, list)=>{
        let value = ele.text()
         if(value === operacao.EnviarDocumentos)
            cy.wrap(ele).click();      
        
      })
      //Confirmar titulo
      cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.EnviarDocumentos)
      .wait(5000)
      //selecionando o tipo de documento
      cy.get(path.operacaoEnviarDocumentos.tipoDocumento).click()       
      
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

  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
      .get(path.detalhamentoAtendimentoRenovacao.operacao).each((ele, index, list)=>{
        let value = ele.text()
         if(value === operacao.EnviarDocumentos)
            cy.wrap(ele).click();      
        
      })
      //Confirmar titulo
      cy.get(path.generic.title, {timeout: 10000}).should('have.text', 'Enviar Documentos')
      .wait(5000)
      //selecionando o tipo de documento
      cy.get(path.operacaoEnviarDocumentos.tipoDocumento).click()       
      
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

      cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
      .get(path.detalhamentoAtendimentoRenovacao.operacao).each((ele, index, list)=>{
        let value = ele.text()
         if(value === operacao.IncluirContato)
            cy.wrap(ele).click();      
        
      })
      cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirContato)
      cy.get(path.operacaoContato.tipoContato).click()
      cy.xpath(path.operacaoContato.email).should('have.text', 'Email').click()           
      cy.get(path.operacaoContato.tipoContatoValor).type(faker.internet.email())    
      cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
      cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('incluirContatoFax', (faker)=>{  

  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
  .get(path.detalhamentoAtendimentoRenovacao.operacao).each((ele, index, list)=>{
    let value = ele.text()
     if(value === operacao.IncluirContato)
        cy.wrap(ele).click();      
    
  })
  cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirContato)
  cy.get(path.operacaoContato.tipoContato).click()
  cy.xpath(path.operacaoContato.fax).should('have.text', 'Fax').click()     
  cy.get(path.operacaoContato.tipoContatoValor).type(faker.phone.number())    
  cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
  cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('incluirContatoCelular', (faker)=>{  

  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
  .get(path.detalhamentoAtendimentoRenovacao.operacao).each((ele, index, list)=>{
    let value = ele.text()
     if(value === operacao.IncluirContato)
        cy.wrap(ele).click();      
    
  })
  cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirContato)
  cy.get(path.operacaoContato.tipoContato).click()
  cy.xpath(path.operacaoContato.celular).should('have.text', 'Celular').click()     
  cy.get(path.operacaoContato.tipoContatoValor).type(faker.phone.number())    
  cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
  cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('incluirContatoTelefone', (faker)=>{  

  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
  .get(path.detalhamentoAtendimentoRenovacao.operacao).each((ele, index, list)=>{
    let value = ele.text()
     if(value === operacao.IncluirContato)
        cy.wrap(ele).click();     
    
  })
  cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirContato)
  cy.get(path.operacaoContato.tipoContato).click()
  cy.xpath(path.operacaoContato.telefone).should('have.text', 'Telefone').click()     
  cy.get(path.operacaoContato.tipoContatoValor).type(faker.phone.number())    
  cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
  cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('excluirContatoFax', (faker, phone) =>{
  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
        .get(path.detalhamentoAtendimentoRenovacao.operacao, {timeout: 10000})   
        .each(($ele, index, list) => {
            if ($ele.text() === operacao.ExcluirContato) 
            cy.wrap($ele).click();      
        })
        cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.ExcluirContato)
        cy.get(path.operacaoContato.tipoContato).click()
        .xpath(path.operacaoContato.fax).should('have.text', 'Fax').click()      
        cy.get(path.operacaoContato.tipoContatoValor).type(phone)    
        cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
        cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('excluirContatoCelular', (faker, phone) => {
  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
        .get(path.detalhamentoAtendimentoRenovacao.operacao, {timeout: 10000})   
        .each(($ele, index, list) => {
            if ($ele.text() === operacao.ExcluirContato) 
            cy.wrap($ele).click();      
        })   
           
        //cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.ExcluirContato)
        cy.get(path.operacaoContato.tipoContato).click()
        .xpath(path.operacaoContato.celular).should('have.text', 'Celular').click()      
        cy.get(path.operacaoContato.tipoContatoValor).type(phone)    
        cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
        cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('excluirContatoEmail', (faker, email) => {
  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
        .get(path.detalhamentoAtendimentoRenovacao.operacao, {timeout: 10000})   
        .each(($ele, index, list) => {
            if ($ele.text() === operacao.ExcluirContato) 
            cy.wrap($ele).click();      
        })
        cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.ExcluirContato)
        cy.get(path.operacaoContato.tipoContato).click()
        .xpath(path.operacaoContato.email).should('have.text', 'Email').click()      
        cy.get(path.operacaoContato.tipoContatoValor).type(email)    
        cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
        cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('excluirContatoTelefone', (faker, phone) => {
  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
      .get(path.detalhamentoAtendimentoRenovacao.operacao, {timeout: 10000})   
      .each(($ele, index, list) => {
          if ($ele.text() === operacao.ExcluirContato) 
          cy.wrap($ele).click();      
      })
      cy.get(path.generic.title, {timeout: 10000}).then( ele => {
        expect(ele).to.be.equal(operacao.ExcluirContato).debug()
      })
      cy.get(path.operacaoContato.tipoContato).click()
      .xpath(path.operacaoContato.telefone).should('have.text', 'Telefone').click()      
      cy.get(path.operacaoContato.tipoContatoValor).type(phone)    
      cy.get(path.operacaoContato.tipoDescricao).type(faker.lorem.word({strategy: 'shortext'}))
      cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('incluirEnderecoComercial', (faker) => {
  let uf = faker.random.arrayElement(path.generic.uf)

  cy.get(path.generic.floatButton, {timeout: 20000}).click({force: true})
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

        cy.get('.q-inner-loading', {timeout: 20000}).should('be.visible')

        cy.get('.q-inner-loading', {timeout: 20000}).should('not.exist')

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
        
        cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('alterarEnderecoComercial', (faker) => {
  let uf = faker.random.arrayElement(path.generic.uf)

  cy.get(path.generic.floatButton, {timeout: 20000}).click({force: true})
        .get(path.detalhamentoAtendimentoRenovacao.operacao, {timeout: 10000})   
        .each(($ele, index, list) => {
            if ($ele.text() === operacao.AlterarEndereco) 
            cy.wrap($ele).click();      
        })
        cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.AlterarEndereco)
        cy.get(path.operacaoEndereco.tipoEndereco).click()
        .xpath(path.operacaoEndereco.comercial)
        .should('have.text', 'Comercial').click()

        cy.get(path.operacaoEndereco.cep)
        .type(faker.address.zipCodeValid())

        cy.get(path.operacaoEndereco.logradouro)
        .type(faker.address.streetAddress())

        cy.get('.q-inner-loading', {timeout: 20000}).should('be.visible')

        cy.get('.q-inner-loading', {timeout: 20000}).should('not.exist')

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
        
        cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('incluirEnderecoCorrespondencia', (faker) => {
  let uf = faker.random.arrayElement(path.generic.uf)
  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
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
        .type(faker.address.zipCodeValid()).next()
        cy.get(path.operacaoEndereco.logradouro, {timeout: 20000}).trigger('mouseover').click()
        cy.get('.q-inner-loading', {timeout: 20000}).should('be.visible')

        cy.get('.q-inner-loading', {timeout: 20000}).should('not.exist')

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
        
        cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('incluirGestor', (faker, gestor, tipoTransportador)=>{
  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
        .get(path.detalhamentoAtendimentoRenovacao.operacao, {timeout: 10000})   
        .each(($ele, index, list) => {
            if ($ele.text() === operacao.IncluirGestor) 
            cy.wrap($ele).click();      
        })
          
  cy.get(path.generic.title).should('have.text', operacao.IncluirGestor).wait(3000)
  
        
    if (tipoTransportador == 'ETC' && gestor == 'Responsável Legal') {  

        cy.get(path.operacaoGestor.tipoVinculo, {timeout: 10000}).type(gestor)
        cy.xpath('/html/body/div[8]/div/div[2]/div[2]')                
         .click({force: true})
        cy.get(path.operacaoGestor.cpfCnpj).type(faker.br.cpf())
        cy.get(path.operacaoGestor.nome).type(`${faker.name.firstName()} ${faker.name.lastName()}`)
        //cy.get(path.operacaoGestor.dataNascimento).type('20/05/2005')
        cy.get(path.operacaoGestor.cargo).type(faker.company.catchPhraseDescriptor())  
        cy.get(path.operacaoGestor.telefone).type(faker.phone.phoneNumber())
        cy.get(path.operacaoGestor.email).type(faker.internet.email())

    }else if (tipoTransportador == 'ETC' && gestor == 'Sócio'){

      cy.get(path.operacaoGestor.cpfCnpj).type(faker.br.cpf())
      cy.get(path.operacaoGestor.nome).type(`${faker.name.firstName()} ${faker.name.lastName()}`)
      cy.get(path.operacaoGestor.dataNascimento).type('20/05/2005')
      cy.get(path.operacaoGestor.cargo).type(faker.company.catchPhraseDescriptor())  
      cy.get(path.operacaoGestor.telefone).type(faker.phone.phoneNumber())
      cy.get(path.operacaoGestor.email).type(faker.internet.email())

    }else{
      cy.get(path.operacaoGestor.cpfCnpj).type(faker.br.cpf())
      cy.get(path.operacaoGestor.nome).type(`${faker.name.firstName()} ${faker.name.lastName()}`)
      cy.get(path.operacaoGestor.dataNascimento).type('20/05/2005')
      cy.get(path.operacaoGestor.cargo).type(faker.company.catchPhraseDescriptor())  
      cy.get(path.operacaoGestor.telefone).type(faker.phone.phoneNumber())
      cy.get(path.operacaoGestor.email).type(faker.internet.email())
    }   

  cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('incluirMotorista', (faker) => {
  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
        .get(path.detalhamentoAtendimentoRenovacao.operacao, {timeout: 10000})   
        .each(($ele, index, list) => {
            if ($ele.text() === operacao.IncluirMotorista) 
            cy.wrap($ele).click();      
        })
          
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

  cy.get(path.operacaoMotorista.radioFeminino).click().wait(1000)
  cy.get(path.operacaoMotorista.radioMasculino, {timeout: 10000}).click()

  cy.get(path.generic.botaoSubmit).click();

})

Cypress.Commands.add('alterarMotorista', (faker, cpf) => {
  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
        .get(path.detalhamentoAtendimentoRenovacao.operacao, {timeout: 10000})   
        .each(($ele, index, list) => {
            if ($ele.text() === operacao.AlterarMotorista) 
            cy.wrap($ele).click();      
        })
          
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

  cy.get(path.operacaoMotorista.radioFeminino).click().wait(1000)
  cy.get(path.operacaoMotorista.radioMasculino, {timeout: 10000}).click()

  cy.get(path.generic.botaoSubmit).click();

})

Cypress.Commands.add('excluirMotorista', (faker, cpf) => {
  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
        .get(path.detalhamentoAtendimentoRenovacao.operacao, {timeout: 10000})   
        .each(($ele, index, list) => {
            if ($ele.text() === operacao.ExcluirMotorista) 
            cy.wrap($ele).click();      
        })
          
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

  cy.get(path.operacaoMotorista.radioFeminino).click().wait(1000)
  cy.get(path.operacaoMotorista.radioMasculino, {timeout: 10000}).click()

  cy.get(path.generic.botaoSubmit).click();

})



// Cypress.Commands.add('incluirFilial', (faker)=>{
//   let uf = faker.random.arrayElement(path.generic.uf)
  
//   cy.xpath(path.generic.floatButton, {timeout: 10000}).click({force: true})
//         .get(path.detalhamentoAtendimentoRenovacao.operacao, {timeout: 10000})   
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
  
  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
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

Cypress.Commands.add('incluirResponsavelTecnico', (fakerBr, faker)=>{
  let uf = fakerBr.random.arrayElement(path.generic.uf)
  let dataFaker = '20/02/2000'
  
  
  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
        .get(path.detalhamentoAtendimentoRenovacao.operacao, {timeout: 10000})   
        .each(($ele, index, list) => {
            if ($ele.text() === operacao.IncluirResponsavelTecnico) 
            cy.wrap($ele).click();      
        })
          
  cy.get(path.generic.title).should('have.text', operacao.IncluirResponsavelTecnico)  

  cy.get(path.operacaoResponsavelTecnico.cpf).type(fakerBr.br.cpf())
  cy.get(path.operacaoResponsavelTecnico.nome).type(fakerBr.company.companyName())
  cy.get(path.operacaoResponsavelTecnico.email).type(fakerBr.internet.email())
  cy.get(path.operacaoResponsavelTecnico.telefone).type(fakerBr.phone.phoneNumber())
  cy.get(path.operacaoResponsavelTecnico.identidade).type(fakerBr.random.number())
  cy.get(path.operacaoResponsavelTecnico.orgaoEmissor).type(fakerBr.lorem.word({length: {min: 3, max: 5}}))
  cy.get(path.operacaoResponsavelTecnico.dataNascimento).type(dataFaker)      
  cy.get(path.operacaoFilial.uf).click()  
  .xpath(uf.path)
  .should('have.text', uf.nome).click()

  cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('incluirVeiculo', (veiculo)=>{ 
  
  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
        .get(path.detalhamentoAtendimentoRenovacao.operacao, {timeout: 10000})   
        .each(($ele, index, list) => {
            if ($ele.text() === operacao.IncluirVeiculo) 
            cy.wrap($ele).click();      
        })
          
  cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.IncluirVeiculo)  

  cy.get(path.operacaoVeiculo.placa).type(veiculo.placa)
  cy.get(path.operacaoVeiculo.renavam).type(veiculo.renavam)
  cy.get(path.operacaoVeiculo.radioAutomotor).click();

  veiculo.tipoVeiculo != 'Implemento' ?
    cy.get(path.operacaoVeiculo.radioAutomotor).click():
    cy.get(path.operacaoVeiculo.radioImplemento).click()
      
  cy.get(path.operacaoVeiculo.tipoPropriedade).click()

  switch (veiculo.propriedade) {
    case 'Próprio':
      cy.xpath(path.operacaoVeiculo.tipoPropriedadeProprio)
      .should('have.text', veiculo.propriedade).click()
      .get(path.operacaoVeiculo.tipoPropriedade)
      .should('have.text', veiculo.propriedade)      
      break;

    case 'Arrendado':
      cy.xpath(path.operacaoVeiculo.tipoPropriedadeArrendado)
      .should('have.text', veiculo.propriedade).click()
      .get(path.operacaoVeiculo.tipoPropriedade)
      .should('have.text', veiculo.propriedade)   
      
      cy.get(path.operacaoVeiculo.cpfCnpjProprietario).type(veiculo.proprietario);
      break;
  
    case 'Leasing':
      cy.xpath(path.operacaoVeiculo.tipoPropriedadeLeasing)
      .should('have.text', veiculo.propriedade).click()
      .get(path.operacaoVeiculo.tipoPropriedade)
      .should('have.text', veiculo.propriedade)

      cy.get(path.operacaoVeiculo.instituicoesFinanceiras).click()
      .xpath('/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span')
      .should('have.text', 'BANCO POTTENCIAL S.A.').click();
      break;   

      default:
        cy.log(` ---- Propriedade digitada incorretamente:${veiculo.propriedade} ----`)
        break
  }


  cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('excluirVeiculo', (veiculo)=>{ 
  
  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
        .get(path.detalhamentoAtendimentoRenovacao.operacao, {timeout: 10000})   
        .each(($ele, index, list) => {
            if ($ele.text() === operacao.ExcluirVeiculo) 
            cy.wrap($ele).click();      
        })
          
  cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.ExcluirVeiculo)  

  cy.get(path.operacaoVeiculo.placa).type(veiculo.placa)
  cy.get(path.operacaoVeiculo.renavam).type(veiculo.renavam)

  veiculo.tipoVeiculo != 'Implemento' ?
    cy.get(path.operacaoVeiculo.radioAutomotor).click():
    cy.get(path.operacaoVeiculo.radioImplemento).click()
      
  cy.get(path.generic.botaoSubmit).click()
})

Cypress.Commands.add('alterarVeiculo', (veiculo)=>{ 
  
  cy.get(path.generic.floatButton, {timeout: 10000}).click({force: true})
        .get(path.detalhamentoAtendimentoRenovacao.operacao, {timeout: 10000})   
        .each(($ele, index, list) => {
            if ($ele.text() === operacao.AlterarVeiculo) 
            cy.wrap($ele).click();      
        })
          
  cy.get(path.generic.title, {timeout: 10000}).should('have.text', operacao.AlterarVeiculo)  

  cy.get(path.operacaoVeiculo.placa).type(veiculo.placa)
  cy.get(path.operacaoVeiculo.renavam).type(veiculo.renavam)
  cy.get(path.operacaoVeiculo.radioAutomotor).click();

  veiculo.tipoVeiculo != 'Implemento' ?
    cy.get(path.operacaoVeiculo.radioAutomotor).click():
    cy.get(path.operacaoVeiculo.radioImplemento).click()
      
  cy.get(path.operacaoVeiculo.tipoPropriedade).click()

  switch (veiculo.propriedade) {
    case 'Próprio':
      cy.xpath(path.operacaoVeiculo.tipoPropriedadeProprio)
      .should('have.text', veiculo.propriedade).click()
      .get(path.operacaoVeiculo.tipoPropriedade)
      .should('have.text', veiculo.propriedade)      
      break;

    case 'Arrendado':
      cy.xpath(path.operacaoVeiculo.tipoPropriedadeArrendado)
      .should('have.text', veiculo.propriedade).click()
      .get(path.operacaoVeiculo.tipoPropriedade)
      .should('have.text', veiculo.propriedade)   
      
      cy.get(path.operacaoVeiculo.cpfCnpjProprietario).type(veiculo.proprietario);
      break;
  
    case 'Leasing':
      cy.xpath(path.operacaoVeiculo.tipoPropriedadeLeasing)
      .should('have.text', veiculo.propriedade).click()
      .get(path.operacaoVeiculo.tipoPropriedade)
      .should('have.text', veiculo.propriedade)

      cy.get(path.operacaoVeiculo.instituicoesFinanceiras).click()
      .xpath('/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span')
      .should('have.text', 'BANCO POTTENCIAL S.A.').click();
      break;   

      default:
        cy.log(` ---- Propriedade digitada incorretamente:${veiculo.propriedade} ----`)
        break
  }


  cy.get(path.generic.botaoSubmit).click()
})



