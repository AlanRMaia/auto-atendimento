const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'zzfjpx',
  e2e: {    
    setupNodeEvents(on, config) {
      // implement node event listeners here

    },
    video: true
  },
});
