import urls from "../urls";


Cypress.Commands.add("loginAPI", () => {
  cy.api({
    method: "POST",
    url: `${urls.api}/acesso/Identity/login`,
    body: {
      cpf: Cypress.env('usuario').cpf,
      senha: Cypress.env('usuario').senha,
    },
  });
});

Cypress.Commands.add("criarPrePedidoAPI", (transportador, codigoTipo) => {
  cy.loginAPI().then(response => {
    cy.api({
      method: "POST",
      url: `${urls.api}/rntrc/PrePedido`,
  
      body: {
        codigoTipo: codigoTipo,
        codigoTipoTransportador: transportador.sigla,
        cpfCnpj: transportador.cpfCnpj,
        transportador: transportador.nome,
        ipOrigem: "01",
      },
      headers: { Authorization: `Bearer ${response.body.access_token}` },
    });
  })
});

Cypress.Commands.add("finalizarPrePedidoAPI", (idPrePedido) => {
  cy.loginAPI().then(response => {
    cy.api({
      method: "PUT",
      url: `${urls.api}/rntrc/PrePedido/${idPrePedido}/finalizar`,  
     
      headers: { Authorization: `Bearer ${response.body.access_token}` },
    });
  })
});

Cypress.Commands.add("cancelarPrePedidoAPI", (idPrePedido) => {
  cy.loginAPI().then(response => {
    cy.api({
      method: "PUT",
      url: `${urls.api}/rntrc/PrePedido/${idPrePedido}/cancelar`,  
     
      headers: { Authorization: `Bearer ${response.body.access_token}` },
    });
  })
});

Cypress.Commands.add("entidadePrePedidoAPI", (idEntidade, id) => {
  cy.loginAPI().then(response => {
    cy.api({
      method: "POST",
      url: `${urls.api}/rntrc/PrePedido/${id}/entidade`,  
      body: {
        "idEntidade": idEntidade
      },
      headers: { Authorization: `Bearer ${response.body.access_token}` },
    });
  })
});

Cypress.Commands.add("contatoPrePedidoAPI", (id, tipoContato, valor) => {
  cy.loginAPI().then(response => {
    cy.api({
      method: "POST", 
      url: `${urls.api}/rntrc/PrePedido/${id}/contato/salvar`,  
      body: {
        "tipoContato": tipoContato,
        "valor": valor,
        "descricao": "",
        "principal": true
      },
      headers: { Authorization: `Bearer ${response.body.access_token}` },
    });
  })
});

Cypress.Commands.add("criarOperacaoTransportadorAPI", (transportador, id) => {
  cy.loginAPI().then(response => {
    cy.api({
      method: "POST",
      url: `${urls.api}/rntrc/PrePedido/${id}/transportador`,  
      body: {
        "nome": transportador.dadosTransportador.nome,
        "declaracaoCapacidadeFinanceira": true,
        "numeroIdentidade": transportador.dadosTransportador.rg,
        "nomeFantasia": transportador.dadosTransportador.nomeFantasia,
        "inscricaoEstadual": transportador.dadosTransportador.inscricaoEstadual,
        "avisoEmailMovimentacaoFrota": true,
        "registroJunta": transportador.dadosTransportador.registroJunta,
        "inscricaoOCB": transportador.dadosTransportador.inscricaoOCB,
        "transporteInternacional": true,
        "adimplenteAssociacao": true,
        "possuiAnexo": true
    },
      headers: { Authorization: `Bearer ${response.body.access_token}` },
    });
  })
});

Cypress.Commands.add("criarOperacaoGestorAPI", (gestor,tipoVinculo, id) => {
  cy.loginAPI().then(response => {
    cy.api({
      method: "POST",
      url: `${urls.api}/rntrc/PrePedido/${id}/gestor/salvar`,  
      body: {
        "tipoVinculo": tipoVinculo,
        "cpfCnpj": gestor.cpfCnpj,
        "nome": gestor.nome,
        "email": gestor.email,
        "telefone": gestor.telefone,
        "cargo": gestor.cargo,
        "idoneo2": true,
        "dataNascimento": gestor.dataNascimento
      },
      headers: { Authorization: `Bearer ${response.body.access_token}` },
    });
  })
});

Cypress.Commands.add("criarOperacaoDocumentoPrePedidoAPI", (doc, id) => {
  cy.loginAPI().then(response => {
    cy.api({
      method: "POST",
      url: `${urls.api}/rntrc/PrePedido/${id}/imagem`,  
      body: {
        "tipoImagem": doc.tipoImagem,
        "imagemBase64": doc.imagemBase64,
        "extensao": doc.extensao,
        "tipoConteudoImagem": doc.tipoConteudoImagem,
        "descricao": doc.descricao
      },
      headers: { Authorization: `Bearer ${response.body.access_token}` },
    });
  })
});

Cypress.Commands.add("criarOperacaoIncluirVeiculoPrePedidoAPI", (placa, id) => {
  cy.loginAPI().then(response => {
    cy.api({
      method: "POST",
      url: `${urls.api}/rntrc/PrePedido/${id}/veiculo/salvar`,  
      body: {
        "placa": placa.placa,
        "renavam": placa.renavam,
        "tipoPropriedadeVeiculo": placa.tipoPropriedadeVeiculo,
        "cpfCnpjProprietario": placa.cpfCnpjProprietario,
        "idInstituicaoFinanceira": placa.idInstituicaoFinanceira,
        "tipoVeiculo": placa.tipoVeiculo
      },
      headers: { Authorization: `Bearer ${response.body.access_token}` },
    });
  })
});

Cypress.Commands.add("criarOperacaoDocumentoVeiculoPrePedidoAPI", (placa, doc, id) => {
  cy.loginAPI().then(response => {
    cy.api({
      method: "POST",
      url: `${urls.api}/rntrc/PrePedido/${id}/veiculo/${placa}/imagem`,  
      body: {
        "tipoImagem": doc.tipoImagem,
        "imagemBase64": doc.imagemBase64,
        "extensao": doc.extensao,
        "tipoConteudoImagem": doc.tipoConteudoImagem
      },
      headers: { Authorization: `Bearer ${response.body.access_token}` },
    });
  })
});

Cypress.Commands.add("criarOperacaoFilialPrePedidoAPI", (id) => {
  cy.loginAPI().then(response => {
    cy.api({
      method: "POST", 
      url: `${urls.api}/rntrc/PrePedido/${id}/contato/salvar`,  
      body: {
        "cnpj": "string",
        "nome": "string",
        "valorCapitalSocial": 0,
        "siglaUF": "string",
        "idCidade": 0
      },
      headers: { Authorization: `Bearer ${response.body.access_token}` },
    });
  })
});


