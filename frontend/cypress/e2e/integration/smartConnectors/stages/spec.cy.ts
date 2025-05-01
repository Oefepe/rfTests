import { defineConfig } from 'cypress';

describe('get the smart connector Id and set the variable', () => {
  var smartConnectorId: string = '';
  // Before creating stages create a smart connector.

  it.only('Set the Smart connector Id', () => {
    cy.request(Cypress.env('smartConnectorAPI')).as('smartConnector');

    cy.get('@smartConnector').should((response) => {
      // cy.log(response.body);
      smartConnectorId = response.body.SmartConnectors[0].id;
      console.log(smartConnectorId);
    });
  });

  it.only('Visit the stage Page', () => {
    let stageURL = `${Cypress.env(
      'smartConnectorUrl'
    )}/${smartConnectorId}/stages`;
    //console.log(stageUrl);
    cy.visit(stageURL);
  });

  //describe('Open add new stages connector', () => {

  it.only('Open the modal for adding a new smart connector', () => {
    let stageURL = `${Cypress.env(
      'smartConnectorUrl'
    )}/${smartConnectorId}/stages/start`;
    // Visit the smart connector page
    cy.visit(stageURL);

    // Open the modal for adding New Stage
    cy.get('#addNewStage').click();

    // Check if modal opens and contains the form title.
    cy.get('#scStageTitle').contains('Add New Stage');

    // Form submit without name to check for validation.
    cy.get('#saveSC').click();

    // Checks validation message.
    cy.contains('Please enter the stage name');

    // Create a random string.
    const name: String =
      'Stage  ' + (Math.random() + 1).toString(36).substring(7);

    // Type the smart connector name.
    cy.get('#name').type(name);

    // Save the form.
    cy.get('#saveSC').click();
  });

  //describe('Open update stage name dialog', () => {

  it.only('Open the modal for updating a new smart connector stage', () => {
    let stageURL = `${Cypress.env(
      'smartConnectorUrl'
    )}/${smartConnectorId}/stages/start`;
    // Visit the smart connector page
    cy.visit(stageURL);

    // Open the modal for adding New Stage
    cy.get('#addNewStage').click();

    // Check if modal opens and contains the form title.
    cy.get('#scStageTitle').contains('Add New Stage');

    // Form submit without name to check for validation.
    cy.get('#saveSC').click();

    // Checks validation message.
    cy.contains('Please enter the stage name');

    // Create a random string.
    const name: string =
      'Stage  ' + (Math.random() + 1).toString(36).substring(7);

    // Type the smart connector name.
    cy.get('#name').type(name);

    // Save the form.
    cy.get('#saveSC').click();

    // Open the modal for adding New Stage
    cy.get('#editStage').click();

    // Check if modal opens and contains the form title.
    cy.get('#scStageTitle').contains('Edit Stage');

    // Form submit without name to check for validation.
    cy.get('#saveSC').click();

    // Checks validation message.
    cy.contains('Please enter the stage name');

    // Create a random string.
    const updatedName: string =
      'Updated Stage  ' + (Math.random() + 1).toString(36).substring(7);

    // Type the smart connector name.
    cy.get('#name').type(updatedName);

    // Save the form.
    cy.get('#saveSC').click();
  });

  it.only('Click On the Back button', () => {
    let stageURL = `${Cypress.env(
      'smartConnectorUrl'
    )}/${smartConnectorId}/stages`;
    // Visit the smart connector page
    cy.visit(stageURL);

    // Open the modal for adding New Stage
    cy.get('#backBtn').click();
    cy.url().should('eq', Cypress.env('smartConnectorUrl'));

    //cy.location('pathname').should('eq', Cypress.env('smartConnectorUrl'));
  });
});
