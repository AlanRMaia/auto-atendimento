module.exports = {
  generic :{
    
    mensagemNotificacao : '.q-notification__message',
    mensagemFechar: '.q-notification__actions > .q-btn > .q-btn__content > .q-icon',
    title: '[data-cy=title]',
    botaoSubmit: '[data-cy=submit]',
    botaoVoltar: '[data-cy=voltar]',
    floatButton:  '[data-cy=floatButton]', //'/html/body/div[1]/div/div[2]/div/main/div[3]/div/button',
    idAtendimento: '[data-cy=idAtendimento]',
    botaoConfirmar: '[data-cy=confirmar]',
    tabela: '[data-cy=tabela]',
    corrigir: '[data-cy=corrigir]',
    finalizar: '[data-cy=finalizar]',
    lista: '[data-cy=lista]',   
    gridOperacao: '[data-cy=gridOperacoes]', 
    isLoading: '[data-cy=isLoading]',
    alert: '[data-cy=alert]',
    pagamento: '[data-cy=pagamento]',
    email: '[data-cy=email]',    
    perfilSitcarga: {
      SETCALOperador : ':nth-child(20) > a',
      FETACMGMaster: '#niveis-usuario > :nth-child(10) > a'
    },

    
    uf : [
      {path: '/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span', nome: 'Acre'},
      {path: '/html/body/div[8]/div/div[2]/div[2]/div[2]/div/span', nome: 'Alagoas'},
      {path: '/html/body/div[8]/div/div[2]/div[3]/div[2]/div/span', nome: 'Amazonas'},
      {path: '/html/body/div[8]/div/div[2]/div[4]/div[2]/div/span', nome: 'Amapá'},
      {path: '/html/body/div[8]/div/div[2]/div[5]/div[2]/div/span', nome: 'Bahia'},
      {path: '/html/body/div[8]/div/div[2]/div[6]/div[2]/div/span', nome: 'Ceará'},
      {path: '/html/body/div[8]/div/div[2]/div[7]/div[2]/div/span', nome: 'Distrito Federal'},
      {path:'/html/body/div[8]/div/div[2]/div[8]/div[2]/div/span', nome: 'Espírito santo' },
      {path: '/html/body/div[8]/div/div[2]/div[9]/div[2]/div/span', nome: 'Goiás'},
      {path: '/html/body/div[8]/div/div[2]/div[10]/div[2]/div/span', nome: 'Maranhão'},
      {path: '/html/body/div[8]/div/div[2]/div[11]/div[2]/div/span', nome: 'Minas Gerais'},
      {path: '/html/body/div[8]/div/div[2]/div[12]/div[2]/div/span', nome: 'Mato Grosso do Sul'},
      {path: '/html/body/div[8]/div/div[2]/div[13]/div[2]/div/span', nome: 'Mato Grosso'},
      {path: '/html/body/div[8]/div/div[2]/div[14]/div[2]/div/span', nome: 'Pará'},
      {path: '/html/body/div[8]/div/div[2]/div[15]/div[2]/div/span', nome: 'Paraíba'},
      {path: '/html/body/div[8]/div/div[2]/div[16]/div[2]/div/span', nome: 'Pernambuco'},
      {path: '/html/body/div[8]/div/div[2]/div[17]/div[2]/div/span', nome: 'Piauí'},
      {path: '/html/body/div[8]/div/div[2]/div[18]/div[2]/div/span', nome: 'Paraná'},
      {path: '/html/body/div[8]/div/div[2]/div[19]/div[2]/div/span', nome: 'Rio de Janeiro'},
      {path: '/html/body/div[8]/div/div[2]/div[20]/div[2]/div/span', nome: 'Rio Grande do Norte'},
      {path: '/html/body/div[8]/div/div[2]/div[21]/div[2]/div/span', nome: 'Rondônia'},
      {path: '/html/body/div[8]/div/div[2]/div[22]/div[2]/div/span', nome: 'Roraima'},
      {path: '/html/body/div[8]/div/div[2]/div[23]/div[2]/div/span', nome: 'Rio Grande do Sul'},
      {path: '/html/body/div[8]/div/div[2]/div[24]/div[2]/div/span', nome: 'Santa Catarina'},
      {path: '/html/body/div[8]/div/div[2]/div[25]/div[2]/div/span', nome: 'Sergipe'},
      {path: '/html/body/div[8]/div/div[2]/div[26]/div[2]/div/span', nome: 'São Paulo'},
      {path: '/html/body/div[8]/div/div[2]/div[27]/div[2]/div/span', nome: 'Tocantins'}
    ],
  },

  loginPage: {
    sejaBemVindo: '[data-cy=sejaBemVindo]',
    cpf: '[data-cy=cpf]',
    senha: '[data-cy=senha]',
    esqueceuSenha: '[data-cy=esqueceuSenha]',
    cadastreSe: '[data-cy=cadastreSe]',
  },

  loginCadatsro: {
    sejaBemVindo: '[data-cy=sejaBemVindo]',
    nome: '[data-cy=nome]',
    cpf: '[data-cy=cpf]',
    email: '[data-cy=email]',
    celular: '[data-cy=celular]',
    senha: '[data-cy=senha]',
    verSenha: '[data-cy=verSenha]',
    confirmeSenha: '[data-cy=confirmeSenha]',
    verConfirmado: '[data-cy=verConfirmado]',
    cnpj: '[data-cy=cnpj]',
    facaLogin: '[data-cy=facaLogin]',    
  },

  esqueceuSenhaPage: {
    cpf: '[data-cy=cpf]',
    esqueceuSenha: '[data-cy=esqueceuSenha]',
    voltarLoginPage: '[data-cy=voltarLoginPage]', 
    validacao: '[data-cy=validacao]'
  },

  redefinirSenhaPage: {

  },

  atendimentoPage: {
    //regularizacao: "[data-cy=regularizacao]",
    regularizacao: '[href="#/regularizacao"]',
    numeroPedido: '[data-cy=numeroAtendimento]',
    consultaRNTRC: '[href="#/consulta"]'
  },
  regularizacaoPage: {
    //tipoAtendimento: '[data-cy=tipoAtendimento]',
    tipoAtendimentoCadastro: '.text-size-16 > :nth-child(1)',
    tipoAtendimentoRenovacao: '.text-size-16 > :nth-child(2)',
    tipoAtendimentoInclusaoVeiculo: '.text-size-16 > :nth-child(4)',
    tipoAtendimentoAlteracaoDados: '.text-size-16 > :nth-child(3)'
  },
  consultaRNTRCPage: {
    radioPorTransportador: '[data-cy=radioPorTransportador]',
    radioPorLocalidade: '[data-cy=radioPorLocalidade]',
    cpfCnpj: '[data-cy=cpfCnpj]',
    rntrc: '[data-cy=rntrc]',
    tipoTransportador: '[data-cy=tipoTransportador]',
    uf: '[data-cy=uf]',
    municipios: '[data-cy=municipios]',    
  },

  criarPedidoRenovacao: {
    //tipoTransportador: '[data-cy=tipoTransportador]',
    inputTransportador: '.q-select > .q-field__inner > .q-field__control > .q-field__control-container',
    tipoTransportador: '',    
    cnpj: '[data-cy=cnpj]',
    cpf: '[data-cy=cpf]',
  },
  criarPedidoCadastro: {
    inputTransportador: '.q-select > .q-field__inner > .q-field__control > .q-field__control-container',
    tipoTransportador: '/html/body/div[8]/div/div[2]/div[2]/div[2]/div/span',
    cnpj: '[data-cy=cnpj]',
    cpf: '[data-cy=cpf]',
    tipoAtendimentoDescricao: '[data-cy=tipoAtendimentoDescricao]'
  },
  criarPedidoInclusaoVeiculo: {
    inputTransportador: '.q-select > .q-field__inner > .q-field__control > .q-field__control-container',
    cnpj: '[data-cy=cnpj]',
    cpf: '[data-cy=cpf]',
  },
  
  criarPedidoAlteracaoDados: {
    inputTransportador: '.q-select > .q-field__inner > .q-field__control > .q-field__control-container',
    cnpj: '[data-cy=cnpj]',
    cpf: '[data-cy=cpf]',
    tipoTransportadorTAC: '/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span',
    tipoTransportadorETC: '/html/body/div[8]/div/div[2]/div[2]/div[2]/div/span',
    tipoTransportadorCTC: '/html/body/div[8]/div/div[2]/div[3]/div[2]/div/span'
  },

  componentePagamento: {
    pagamentoPix: '[data-cy=pagamentoPix]',
    pagamentoBoleto: '[data-cy=pagamentoBoleto]',
    codigoPix: '[data-cy=codigoPix]',
    codigoBarra: '[data-cy=codigoBarra]'
  },
  //src/pages/DetalheAtendimentoPage.vue
  detalhamentoAtendimentoRenovacao: {
    operacao: '[data-cy=operacao]',
    operacaoSalvarTransportador: '/html/body/div[8]/div/div/a[1]/div[3]/div',
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
    registroRT: '/html/body/div[8]/div/div[2]/div[2]/div[2]/div/span',
    documentoIdentidade: '/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span',
    anexarDocumento: '[data-cy=documento]',
    tipoDocumento :  '[data-cy=tipoDocumento]',
  },

  operacaoContato:{
    tipoContato: '[data-cy=tipoContato]',
    tipoContatoValor: '[data-cy=tipoContatoValor]',
    tipoDescricao: '[data-cy=contatoDescricao]',
    email: '/html/body/div[8]/div/div[2]/div[4]/div[2]/div/span',
    fax: '/html/body/div[8]/div/div[2]/div[3]/div[2]/div/span',
    celular: '/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span',
    telefone: '/html/body/div[8]/div/div[2]/div[2]/div[2]/div/span'
  },

  operacaoEndereco: {
    tipoEndereco: '[data-cy=tipoEndereco]',
    comercial: '/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span',
    correspondencia: '/html/body/div[8]/div/div[2]/div[2]/div[2]/div/span',
    cep: '[data-cy=cepInput]',
    logradouro: '[data-cy=logradouroInput]',
    numero: '[data-cy=numeroInput]',
    complemento: '[data-cy=complementoInput]',
    bairro: '[data-cy=bairroInput]',
    cidade: '[data-cy=cidadeInput]',
    pontoDeReferencia: '[data-cy=pontoReferenciaInput]',
    uf: '[data-cy="ufInput"]',
    rj: '/html/body/div[8]/div/div[2]/div[19]/div[2]/div/span'
  },

  operacaoGestor: {
    tipoVinculo: '[data-cy=tipoVinculo]',
    cpfCnpj: '[data-cy=cpfCnpj]',
    nome: '[data-cy=nome]',
    email: '[data-cy=email]',
    telefone: '[data-cy=telefone]',
    cargo: '[data-cy=cargo]',
    dataNascimento: '[data-cy=dataNascimento]'
  },

  operacaoFilial: {
    cnpj: '[data-cy=cnpj]',
    nome: '[data-cy=nome]',
    capitalSocial: '[data-cy=capitalSocial]',
    uf: '[data-cy=uf]'
  },

  operacaoResponsavelTecnico: {
    cpf: '[data-cy=cpf]',
    nome: '[data-cy=nome]',
    email: '[data-cy=email]',
    telefone: '[data-cy=telefone]',
    identidade: '[data-cy=identidade]',
    orgaoEmissor: '[data-cy=orgaoEmissor]',
    dataNascimento: '[data-cy=dataNascimento]',
    uf: '[data-cy=uf]'
  },

  operacaoVeiculo: {
    placa: '[data-cy=placa]',
    renavam: '[data-cy=renavam]',
    tipoPropriedade: '[data-cy=tipoPropriedade]',
    cpfCnpjProprietario: '[data-cy=cpfCnpjProprietario]',
    instituicoesFinanceiras: '[data-cy=instituicoesFinanceiras]',
    radioAutomotor: '[data-cy=radioAutomotor]',
    radioImplemento: '[data-cy=radioImplemento]',
    tipoPropriedadeProprio: '/html/body/div[8]/div/div[2]/div[1]/div[2]/div/span',
    tipoPropriedadeArrendado: '/html/body/div[8]/div/div[2]/div[2]/div[2]/div/span',
    tipoPropriedadeLeasing: '/html/body/div[8]/div/div[2]/div[3]/div[2]/div/span'
  },

  anexarDocumentoVeiculo: {
    contratoArrendamento: '[data-cy=contratoArrendamento]',
    crlv: '[data-cy=crlv]',    
  },

  confirmarAtendimento: {
    pontosAtendimento: '[data-cy=pontosAtendimento]',
  },

  validacaoPedido: {
    atendimentoValido: '[data-cy=atendimentoValido]',
    atendimentoInvalido: '[data-cy=atendimentoInvalido]',

  },

  resumoPedido: {

  },

  operacaoMotorista: {
    cpf: '[data-cy=cpf]',
    nome: '[data-cy=nome]',
    dataNascimento: '[data-cy=dataNascimento]',
    dataPopup: '[data-cy=dataPopup]',
    email: '[data-cy=email]',
    telefone: '[data-cy=telefone]',
    cnh: '[data-cy=cnh]',
    categoria: '[data-cy=categoria]',
    radioMasculino: '[data-cy=radioMasculino]',
    radioFeminino: '[data-cy=radioFeminino]',
    categoria: '[data-cy="categotia"]'
  }, 

  institucionalPage: {
    login:   '.q-tabs__content > .q-btn > .q-btn__content > .block',   //[data-cy=login]',
    cadastro: 'a.q-tab > .q-tab__content > .q-tab__label',  //'[data-cy=cadastro]'
    tipoAtendimento : '[data-cy=tipoAtendimento]', 
    emitirRNTRC: '[data-cy=emitirRNTRC]',
    tipoTransportador: '[data-cy=tipoTransportador]',
    uf: '[data-cy=uf]',
    faleConoscoEmail: '[data-cy=faleConoscoEmail]',
    chat: '[data-cy=chat]'    
  },

  pontosAtendimentoPage : {
    tipoTransportador: '[data-cy=tipoTransportador]',
    uf: '[data-cy=uf]',
    pontosAtendimentoList: '[data-cy=pontosAtendimentoList]',
    sigla: '[data-cy=sigla]',
    
  },

  sitcargaInitialPage: {
    imgLogon: '/content/img/sitcarga_logo.png',
    logon: '/html/body/div[2]/nav/div/div[1]/a/span/img',
    facaLogin: '/html/body/section[2]/div/div/div/div/div/div/h2',


  },

  sitcargaHomePage: {
    home: 'https://homologacao.sitcarga.com.br/home',
    imgLogon: '/Content/img/logo-sitcarga.png',
    

  }

};
