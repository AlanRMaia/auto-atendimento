//Ambiente de desenvolvimento
var dev = {
   login: 'http://localhost:9000/#/login',
  atendimentos: 'http://localhost:9000/#/login',
  regularizacao: 'http://localhost:9000/#/regularizacao',
}
//Ambiente de homologação
var homolog = {
  login: 'https://sitcarga-spa-homologacao.azurewebsites.net/#/login',
  atendimentos: 'https://sitcarga-spa-homologacao.azurewebsites.net/#/login',
  regularizacao: 'https://sitcarga-spa-homologacao.azurewebsites.net/#/regularizacao'
}

//serve para trocar o ambiente para teste, se for no ambiente de desenvolvimento coloque a variável dev, se for homologação coloque homolog
var ambiente = dev;

module.exports = {
  
  login : ambiente.login,
  atendimentos : ambiente.atendimentos,
  regularizacao : ambiente.regularizacao
};
