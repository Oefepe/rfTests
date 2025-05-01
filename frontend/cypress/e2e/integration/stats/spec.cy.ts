import { defineConfig } from "cypress";

describe("Open landing page", () => {
  it("passes", () => {
    cy.visit(Cypress.env("rootURL"));
  });
});

describe("Check if Active Inactive Graph Header Exist", () => {
  it("passes", () => {
    cy.visit(Cypress.env('inActiveContactStatsUrl')).contains(
      'Number of Active and Inactive Contacts in Each Stage'
    );
  });
});

describe('Check if Transitioned Graph Header Exist', () => {
  it('passes', () => {
    cy.visit(Cypress.env('inActiveContactStatsUrl')).contains(
      'Percentage of Transitioned Contacts in Each Stage'
    );
  });
});

describe('Check if Time Spend Graph Header Exist', () => {
  it('passes', () => {
    cy.visit(Cypress.env('inActiveContactStatsUrl')).contains(
      'Average Time Spent by Contacts in Each Stage'
    );
  });
});

describe("Check Graph Base Class Exit", () => {
  it("passes", () => {
    cy.visit(Cypress.env('inActiveContactStatsUrl')).get('.recharts-surface');
  });
});

describe("Check Graph Body Class Exist", () => {
  it("passes", () => {
    cy.visit(Cypress.env('inActiveContactStatsUrl')).get('.recharts-wrapper');
  });
});
