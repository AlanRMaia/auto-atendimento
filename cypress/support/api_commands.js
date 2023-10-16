
const accessToken = `Bearer ${Cypress.env('acess_token').token}`;

Cypress.Commands.add("criarPedidoAPI", (transportador, codigoTipo) => {
  cy.api({
    method: "POST",
    url: "https://sitcargaapitest/rntrc/PrePedido",

    body: {
      codigoTipo: codigoTipo,
      codigoTipoTransportador: transportador.sigla,
      cpfCnpj: transportador.cpfCnpj,
      transportador: transportador.nome,
      ipOrigem: ipOrigem,
    },
    headers: { Authorization: accessToken },
  });
});
