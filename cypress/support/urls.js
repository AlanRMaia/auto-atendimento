var env;

switch (Cypress.env('ENVIRONMENT')) {
  case 'test':
      env = {
        login : 'login',
        atendimentos : 'atendimentos',
        regularizacao : 'regularizacao',
        home: '/',
        sitcargaInitial: 'https://wwwsitcargateste/',
        sitcargaHome: 'https://wwwsitcargateste/home',
        api: 'https://sitcargaapitest'
        }   
      
      
    break; 
    case 'homolog':
      env = {
        login : 'login',
        atendimentos : 'atendimentos',
        regularizacao : 'regularizacao',
        home: '/',
        sitcargaInitial: 'https://homologacao.sitcarga.com.br',
        sitcargaHome: 'https://homologacao.sitcarga.com.br/home',
        api: 'https://sitcarga-api-homologacao.azurewebsites.net'
        }
      
      
      
    break;
    case 'dev':
      env = {
        login : 'login',
        atendimentos : 'atendimentos',
        regularizacao : 'regularizacao',
        home: '/',
        sitcargaInitial: 'https://homologacao.sitcarga.com.br',
        sitcargaHome: 'https://homologacao.sitcarga.com.br/home',
        api: 'http://localhost:9000'
        }
      
    break;
    default:
      console.log('Ambiente não configurado')
    break;
}    
    
module.exports = {  
  login : env.login,
  atendimentos : env.atendimentos,
  regularizacao : env.regularizacao,
  home: env.home,
  sitcargaInitial: env.sitcargaInitial,
  sitcargaHome: env.sitcargaHome,
  api: env.api
};