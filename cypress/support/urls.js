//Ambiente de desenvolvimento
var dev = {
  login: 'login',
 atendimentos: 'login',
 regularizacao: 'regularizacao',
 home: '/',
 sitcargaInitial: 'https://homologacao.sitcarga.com.br/',
 sitcargaHome: 'https://homologacao.sitcarga.com.br/home'
}
var test = {
   login: 'login',
  atendimentos: 'login',
  regularizacao: 'regularizacao',
  home: '/',
  sitcargaInitial: 'https://homologacao.sitcarga.com.br/',
  sitcargaHome: 'https://homologacao.sitcarga.com.br/home'
}
//Ambiente de homologação
var homolog = {
  login: 'login',
  atendimentos: 'login',
  regularizacao: 'regularizacao',
  home: '/',
  sitcargaInitial: 'https://homologacao.sitcarga.com.br/',
  sitcargaHome: 'https://homologacao.sitcarga.com.br/home'
}

//serve para trocar o ambiente para teste, se for no ambiente de desenvolvimento coloque a variável dev, se for homologação coloque homolog

var ambiente = Cypress.env('ENVIRONMENT') === 'dev'? dev : test;

module.exports = {  
  login : ambiente.login,
  atendimentos : ambiente.atendimentos,
  regularizacao : ambiente.regularizacao,
  home: ambiente.home,
  sitcargaInitial: ambiente.sitcargaInitial,
  sitcargaHome: ambiente.sitcargaHome
};

// "test": "npm run test:homolog && npm run test:dev",
//     "homolog": "cypress open --env configFile=homolog",
//     "dev": "cypress open",
//     "test:homolog": "cypress run --env configFile=homolog",
//     "test:dev": "cypress run"