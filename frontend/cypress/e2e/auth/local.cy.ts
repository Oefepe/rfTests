import { defineConfig } from 'cypress';
import { ResponseCode } from '../../../src/config';
const { env } = Cypress;

describe('Login with local accounts', () => {
  let validEmail;
  let invalidEmail;

  before(() => {
    cy.fixture('users.json').then((res) => {
      invalidEmail = res.invalidEmail;
      validEmail = res.validEmail;

      cy.request('POST', `${env('apiUrl')}/auth/email?type=signup`, validEmail).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.status).to.be.oneOf([ResponseCode.success, ResponseCode.userExist]);
      });
    });
  });

  it('Login with valid email', () => {
    cy.visit(env('loginUrl'));
    cy.get('button').contains('Logout').should('not.exist');
    cy.get('#signup-email-phone').type(validEmail.email);
    cy.get('input[type=password]').type(validEmail.password);
    cy.get('button').contains('Log In').click();
  });

  it('Login with invalid email', () => {
    cy.visit(env('loginUrl'));
    cy.get('button').contains('Logout').should('not.exist');
    cy.get('#signup-email-phone').type(invalidEmail.email);
    cy.get('input[type=password]').type(invalidEmail.password);
    cy.get('button').contains('Log In').click();
    cy.get('div').contains('Incorrect email or password, please try again.').should('exist');
  });
});

describe('Signup with local accounts', () => {
  let validEmail;
  let malformedEmail;

  before(() => {
    cy.fixture('users.json').then((res) => {
      validEmail = res.validEmail;
      validEmail.email = `${Math.floor(Math.random() * 1e6)}-mail@cypre.ss`;
      malformedEmail = res.malformedEmail;
    });
  });

  it('Signup with valid email', () => {
    cy.visit(env('signupUrl'));
    cy.get('button').contains('Logout').should('not.exist');
    cy.get('#signup-email-phone').type(validEmail.email);
    cy.get('button').contains('Next').click();
    cy.location('pathname').should('eq', '/signup/name');
    cy.get('input[placeholder="First Name"]').type(validEmail.firstName);
    cy.get('input[placeholder="Last Name"]').type(validEmail.lastName);
    cy.get('button').contains('Next').click();
    cy.location('pathname').should('eq', '/signup/password');
    cy.get('input[id="password"]').type(validEmail.password);
    cy.get('input[id="confirm-password"]').type(validEmail.password);
    cy.get('button').contains('Next').click();
  });

  it('Signup with malformed email', () => {
    cy.visit(env('signupUrl'));
    cy.get('button').contains('Logout').should('not.exist');
    cy.get('#signup-email-phone').type(malformedEmail.email);
    cy.get('button').contains('Next').click();
    cy.location('pathname').should('eq', '/signup');
    cy.get('p').contains('Invalid email').should('exist');
  });
});
