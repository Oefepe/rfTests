import { defineConfig } from 'cypress';
const { env } = Cypress;

const avbobUser = {
  username: 'mtini@avbob.co.za',
  password: 'avbob2023',
};

const ssoProviders = [
  {
    name: 'netready',
    url: 'http://localhost:4000',
    username: '#username',
  },
];

describe('Login with IDP', () => {
  it('Login with valid NetReady user', () => {
    cy.visit(`${env('apiUrl')}/auth/netready?type=login`);
    cy.get('#username').type(avbobUser.username);
    cy.get('#password').type(avbobUser.password);
    cy.get('button[type=submit]').click();
    cy.get('button').contains('Logout').should('exist');
  });

  it('Login with invalid NetReady user', () => {
    cy.visit(`${env('apiUrl')}/auth/netready?type=login`);
    cy.get('#username').type(`${Math.floor(Math.random() * 1e6)}@bb.cc`);
    cy.get('#password').type(avbobUser.password);
    cy.get('button[type=submit]').click();
    cy.get('h2').contains('Check login or password').should('exist');
    cy.get('button').contains('Logout').should('not.exist');
  });
});

describe('Signup with NetReady user', () => {
  it('Signup with valid NetReady user', () => {
    cy.visit(`${env('apiUrl')}/auth/netready?type=signup`);
    cy.get('#username').type(avbobUser.username);
    cy.get('#password').type(avbobUser.password);
    cy.get('button[type=submit]').click();
    cy.get('button').contains('Logout').should('exist');
  });

  it('Signup with invalid NetReady user', () => {
    cy.visit(`${env('apiUrl')}/auth/netready?type=signup`);
    cy.get('#username').type(`${Math.floor(Math.random() * 1e6)}@bb.cc`);
    cy.get('#password').type(avbobUser.password);
    cy.get('button[type=submit]').click();
    cy.get('h2').contains('Check login or password').should('exist');
    cy.get('button').contains('Logout').should('not.exist');
  });
});

describe('SSO authentication', () => {
  ssoProviders.forEach(({ name, url, username }) => {
    it(`Should validate UI for ${name} page on login`, () => {
      cy.visit({
        url: `${env('authUrl')}/${name}?type=login`,
      });
      cy.get(username).should('exist');
      cy.location('origin').should('eq', url);
    });
  });
  ssoProviders.forEach(({ name, url, username }) => {
    it(`Should validate UI for ${name} page on signup`, () => {
      cy.visit({
        url: `${env('authUrl')}/${name}?type=signup`,
      });
      cy.get(username).should('exist');
      cy.location('origin').should('eq', url);
    });
  });
});
