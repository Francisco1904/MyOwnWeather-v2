describe('Basic Navigation', () => {
  it('should load the application', () => {
    cy.visit('/');

    // Wait for application to load
    cy.contains('Weather').should('be.visible');
  });

  it('should load the search page', () => {
    cy.visit('/search');

    // Verify the search page loads
    cy.contains('Search Locations').should('be.visible');
    cy.get('input[placeholder="Search for a city..."]').should('exist');
  });
});
