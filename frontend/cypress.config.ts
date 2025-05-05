import { defineConfig } from 'cypress';

const rootURL = 'http://localhost:3000';
const apiURL = 'http://localhost:4000/api';
const authUrl = 'http://localhost:4000/api/auth'

export default defineConfig({
  defaultCommandTimeout: 10000,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      rootURL: rootURL,
      apiUrl: apiURL,
      authUrl: authUrl,
      smartConnectorUrl: `${rootURL}/smart-connectors`,
      smartConnectorAPI: `${apiURL}/smart-connectors/1/all`,
      contactUrl: '/contacts',
      inActiveContactStatsUrl: `${rootURL}/statistics`,
      loginUrl: `${rootURL}/login`,
      signupUrl: `${rootURL}/signup`,
    },
  },
});
