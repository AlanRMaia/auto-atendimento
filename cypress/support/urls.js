//Ambiente de desenvolvimento
var dev = {
   login: 'http://localhost:9000/#/login',
  atendimentos: 'http://localhost:9000/#/login',
  regularizacao: 'http://localhost:9000/#/regularizacao',
  home: 'http://localhost:9000/#/',
  sitcargaInitial: 'https://homologacao.sitcarga.com.br/',
  sitcargaHome: 'https://homologacao.sitcarga.com.br/home'
}
//Ambiente de homologação
var homolog = {
  login: 'https://sitcarga-spa-homologacao.azurewebsites.net/#/login',
  atendimentos: 'https://sitcarga-spa-homologacao.azurewebsites.net/#/login',
  regularizacao: 'https://sitcarga-spa-homologacao.azurewebsites.net/#/regularizacao',
  home: 'https://sitcarga-spa-homologacao.azurewebsites.net/#/',
  sitcargaInitial: 'https://homologacao.sitcarga.com.br/',
  sitcargaHome: 'https://homologacao.sitcarga.com.br/home'
}

//serve para trocar o ambiente para teste, se for no ambiente de desenvolvimento coloque a variável dev, se for homologação coloque homolog
var ambiente = dev;

module.exports = {  
  login : ambiente.login,
  atendimentos : ambiente.atendimentos,
  regularizacao : ambiente.regularizacao,
  home: ambiente.home,
  sitcargaInitial: ambiente.sitcargaInitial,
  sitcargaHome: ambiente.sitcargaHome
};
