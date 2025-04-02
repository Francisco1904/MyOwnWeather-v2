describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('should have no accessibility violations on the home page', () => {
    cy.checkA11y();
  });

  // Test specific components/elements individually
  it('should have no accessibility violations in the navigation', () => {
    cy.get('nav').checkA11y();
  });

  // Test other routes
  it('should have no accessibility violations on the search page', () => {
    cy.visit('/search');
    cy.injectAxe();
    cy.checkA11y();
  });

  it('should have no accessibility violations on the settings page', () => {
    cy.visit('/settings');
    cy.injectAxe();
    cy.checkA11y();
  });
});
