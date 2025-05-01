import { defineConfig } from "cypress"

describe('Open landing page', () => {
  it('passes', () => {
    cy.visit(Cypress.env('rootURL'))
  })
})

describe('Open smart connectors page', () => {
  it('passes', () => {
    cy.visit(Cypress.env('smartConnectorUrl'))
  })
})

describe('Add Smart connector, Stage and An Action', () => {
  it('passes', () => {
    // Visit the smart connector page
    cy.visit(Cypress.env('smartConnectorUrl'))

    // Open the modal for adding new smart connector.
    cy.get('#addNewSC').click();

    // Check if modal opens and contains the form title.
    cy.get('#formTitle').contains('New Smart Connector');

    // Form submit without name to check for validation.
    cy.get('#saveSC').click();

    // Checks validation message.
    cy.contains('Name is required');

    // Checks validation message for description.
    cy.contains('Description is required');

    // Create a random string.
    const name:string = 'RapidFunnel SC ' + (Math.random() + 1).toString(36).substring(7);
    const description:string = 'SC Description ' + (Math.random() + 1).toString(36).substring(7);

    // Type the smart connector name.
    cy.get('#name').type(name);
    cy.get('#description').type(description);

    // Save the form.
    cy.get('#saveSC').click();

    // Validate we have added the smart connector with typed name.
    cy.contains(name);
    // Check that new smarrt connector is unpublished
    cy.contains('Publish');
    // click on the link so that smart connector will be published.
    cy.get('#publishButton').click();
    // Check that new smarrt connector is now published
    cy.contains('Unpublish');

    // click on the link so that it will go to the smart connector stages page.
    cy.get('#addNewStage').click();
    // Check if modal opens and contains the form title.
    cy.get('#scStageTitle').contains('Add New Stage');

    cy.get('#saveSC').click();

    // Checks validation message.
    cy.contains('Please enter the stage name');

    const stageName:string = 'RapidFunnel Stage ' + (Math.random() + 1).toString(36).substring(7);
    cy.get('#name').type(stageName);
    cy.get('#saveSC').click();

    cy.get('#addNewAction').click();
    // Check if modal opens and contains the form title.
    cy.get('#scStageTitle').contains('Add New Action');

    // Form submit without name to check for validation.
    cy.get('#saveSC').click();

    // Checks validation message.
    cy.contains('Please enter the action name');

    const actionName:string = 'action';
    cy.get('#name').type(actionName);
    cy.get('#saveSC').click();

    // Check for edit action
    const updatedActionName:string = 'EditedAction';
    cy.get('#EditAction').click();
    cy.get('#scStageTitle').contains('Edit Action');
    cy.get('#name').type(updatedActionName);
    cy.get('#saveSC').click();
    cy.get('#root').contains(updatedActionName);
  })
})
