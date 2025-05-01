import { defineConfig } from 'cypress';
import contacts from '../../../fixtures/contacts.json';

// Please insert below data before running the test
// use devrfng
// db.contacts.deleteMany({})
// db.contacts.insertMany([{firstName: "John", lastName: "Smith", smartConnectorId: "SM_123", smartConnectorStatus: 1 }, {firstName: "Rahul", lastName: "Mishra", smartConnectorId: "SM_1234", smartConnectorStatus: 2 }, {firstName: "Jay", lastName: "Bahar", smartConnectorId: "SM_123", smartConnectorStatus: 3 }, {firstName: "Sarah", lastName: "Johnson", smartConnectorId: "SM_124", smartConnectorStatus: null }, {firstName: "Michael", lastName: "Brown", smartConnectorId: ""}, {firstName: "Subham", lastName: "Sha", smartConnectorId: "SM_125"}]);
// db.contacts.find({})

describe('Open landing page', () => {
  it('passes', () => {
    cy.visit(Cypress.env('rootURL'));
  });
});

describe('Open contact list page', () => {
  it('passes', () => {
    cy.visit(Cypress.env('contactUrl'));
  });
});

describe('Test contact list with smart connector', () => {
  [0 / 1];
  it('passes', () => {
      cy.visit(Cypress.env('contactUrl'))
        .contains('Contact List')
        .get('h4')
        .should('have.text', 'Contact List')
        .get('.MuiDataGrid-root')
        .get('[data-field="fullName"] > div > .contact-name-container > .contact-name')
        .get('.smartIcon > .svg-inline--fa')
        .get(
          '.active, .in-active, .action-due, .no-action-due, .waiting-for-response, .waiting-for-delay'
        );
    });
});
