/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Add accessibility testing with axe-core
import 'cypress-axe';

// Adds accessibility checking commands
Cypress.Commands.add('checkA11y', (context, options) => {
  cy.checkA11y(context, options);
});

export {};
