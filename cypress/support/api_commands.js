
Cypress.Commands.add("loginAPI", () => {
  cy.api({
    method: "POST",
    url: "**/acesso/Identity/login",
    body: {
      cpf: Cypress.env('usuario').cpf,
      senha: Cypress.env('usuario').senha,
    },
  });
});

Cypress.Commands.add("criarPedidoAPI", (transportador, codigoTipo) => {
  cy.loginAPI().then(response => {
    cy.api({
      method: "POST",
      url: "**/rntrc/PrePedido",
  
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

