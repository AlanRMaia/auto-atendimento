const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'eso993',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
