const { defineConfig } = require("cypress");

module.exports = defineConfig({
  
  projectId: 'zzfjpx',
  e2e: {    
    experimentalOriginDependencies: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      experimentalModifyObstructiveThirdPartyCode: true,
      idPrePedido: {
        id: ''
      }
    },
    video: true
  },
});
