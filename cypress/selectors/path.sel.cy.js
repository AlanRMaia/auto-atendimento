module.exports = {
  generic :{
    mensagemNotificacao : '.q-notification__message',
    mensagemFeliz: '.q-notification__content',
    title: '[data-cy=title]',
    botaoSubmit: '[data-cy=submit]',
    botaoVoltar: '[data-cy=voltar]',
    floatButton: '[data-cy=floatButton]' //cy.get('[data-cy="floatButton"] > div > .q-btn')
  },

  loginPage: {
    cpf: '[data-cy=cpf]',
    senha: '[data-cy=senha]',
    esqueciMinhaSenha: '[data-cy=esqueciMinhaSenha]',
    cadastreSe: '[data-cy=cadastreSe]',
  },
  atendimentoPage: {
    //regularizacao: "[data-cy=regularizacao]",
    regularizacao: '[href="#/regularizacao"]',
  },
  regularizacaoPage: {
    //tipoAtendimento: '[data-cy=tipoAtendimento]',
    tipoAtendimento: '.text-size-16 > :nth-child(2)',
  },
  criarPedidoRenovacao: {
    //tipoTransportador: '[data-cy=tipoTransportador]',
    inputTransportador: '.q-select > .q-field__inner > .q-field__control > .q-field__control-container',
    tipoTransportador: '/html/body/div[8]/div/div[2]/div[2]/div[2]/div/span',
    inputETC: '/html/body/div[1]/div/div[2]/div[2]/div/div/div/form/div[1]/label/div/div[1]/div/input',    //'[data-cy=inputETC]',
  },
  //src/pages/DetalheAtendimentoPage.vue
  detalhamentoAtendimentoRenovacao: {
    operacaoSalvarTransportador: '/html/body/div[8]/div/div/a[1]',
    operacaoEnviarDocumentos: '/html/body/div[8]/div/div/a[2]',
    operacaoIncluirContato: '/html/body/div[8]/div/div/a[3]',
    operacaoExcluirContato: '/html/body/div[8]/div/div/a[4]',
    operacaoIncluirEndereco: '/html/body/div[8]/div/div/a[5]',
    operacaoAlterarEndereco: '/html/body/div[8]/div/div/a[6]',
    operacaoExcluirEndereco: '/html/body/div[8]/div/div/a[7]',
    operacaoIncluirGestor: '/html/body/div[8]/div/div/a[8]',
    operacaoAlterarGestor: '/html/body/div[8]/div/div/a[9]',
    operacaoExcluirGestor: '/html/body/div[8]/div/div/a[10]',
    operacaoIncluirFilial: '/html/body/div[8]/div/div/a[11]',
    operacaoAlterarFilial: '/html/body/div[8]/div/div/a[12]',
    operacaoExcluirFilial: '/html/body/div[8]/div/div/a[13]',
    operacaoIncluirRT: '/html/body/div[8]/div/div/a[14]',
    operacaoAlterarRT: '/html/body/div[8]/div/div/a[15]',
    operacaoExcluirRT: '/html/body/div[8]/div/div/a[16]',
    operacaoIncluirVeiculo: '/html/body/div[8]/div/div/a[17]',
    operacaoAlterarVeiculo: '/html/body/div[8]/div/div/a[18]',
    operacaoExcluirVeiculo: '/html/body/div[8]/div/div/a[19]',
  },

  operacaoSalvarTransportador: {
    razaoSocial: '[data-cy=razaoSocialInput]',
    identidade: '[data-cy=identidadeInput]',
    nomeFantasia: '[data-cy=nomeFantasiaInput]',
    inscricaoEstadual: '[data-cy=inscricaoEstadualInput]',
    checkBoxComunicacaoANTT: '[data-cy=comunicacaoANTT]',
    juntaComercial: '[data-cy=juntaComercialInput]',
    inscricaoOCB: '[data-cy=inscricaoOCBInput]',
    checkBoxTrpInternacional: '[data-cy=trpInternacional]',
    checkBoxRegistroOCB: '[data-cy=registroOCB]',
    checkBoxPossuiAnexo: '[data-cy=possuiAnexo]',
    checkBoxCapacidadeFinanceira: '[data-cy=capacidadeFinanceira]',
  },

  operacaoEnviarDocumentos: {
    //selecionarDocumento: '.q-select > .q-field__inner > .q-field__control > .q-field__control-container',
    selecionarDocumento: '/html/body/div[8]/div/div[2]/div[1]',
    anexarDocumento: '[data-cy=documento]',
    tipoDocumento : '[data-cy=selecionarDocumento]', //'/html/body/div[1]/div/div[2]/div[2]/div/div/div/form/label[1]/div/div[1]'
  }
};
