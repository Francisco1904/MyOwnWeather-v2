describe('Dialog Accessibility Tests', () => {
  it('should have properly accessible favorites dialog in settings', () => {
    // Visit the settings page
    cy.visit('/settings');

    // Find and click the Manage Favorites button
    cy.contains('button', 'Manage Favorites').click();

    // Verify the favorites dialog has a title
    cy.get('[role="dialog"]')
      .should('be.visible')
      .find('[id="favorites-dialog-title"]')
      .should('exist')
      .and('have.text', 'Favorite Locations');

    // Verify dialog has the right aria attributes
    cy.get('[role="dialog"]')
      .should('have.attr', 'aria-modal', 'true')
      .and('have.attr', 'aria-labelledby', 'favorites-dialog-title');

    // Close the dialog
    cy.get('[aria-label="Close favorites modal"]').first().click();
  });
});
