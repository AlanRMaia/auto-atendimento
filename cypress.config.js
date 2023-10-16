const { defineConfig } = require("cypress");

module.exports = defineConfig({
  
  projectId: 'zzfjpx',
  e2e: {    
    experimentalOriginDependencies: true,
    chromeWebSecurity: false,
    requestTimeout: 30000,
    responseTimeout: 60000,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      experimentalModifyObstructiveThirdPartyCode: true,
      idPrePedido: {
        id: ''
      },
      hideCredentials: true,
      hideCredentialsOptions: {
        headers: ['Authorization'],
        body: ['cpf', 'senha', "access_token"],        
      },
      requestMode: true,
      snapshotOnly : true 
    },
    video: true
  },
});
