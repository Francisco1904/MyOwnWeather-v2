describe('Accessibility Tests with axe', () => {
  function logViolations(violations: any[]) {
    // Format and print violations to console
    cy.task('log', `${violations.length} accessibility violations were detected`);

    violations.forEach(violation => {
      const nodes = violation.nodes.map((node: any) => {
        return {
          target: node.target,
          html: node.html,
          impact: node.impact,
        };
      });

      cy.task('log', {
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        nodes: nodes,
      });
    });
  }

  // Test the home page for accessibility issues
  it('should pass accessibility tests on home page', () => {
    cy.visit('/');
    cy.injectAxe();
    cy.wait(500); // Wait for page to fully load
    cy.checkA11y(
      undefined,
      {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'],
        },
      },
      logViolations,
      true // Log to console
    );
  });

  // Test the search page
  it('should pass accessibility tests on search page', () => {
    cy.visit('/search');
    cy.injectAxe();
    cy.wait(500); // Wait for page to fully load
    cy.checkA11y(
      undefined,
      {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'],
        },
      },
      logViolations,
      true // Log to console
    );
  });

  // Test the settings page
  it('should pass accessibility tests on settings page', () => {
    cy.visit('/settings');
    cy.injectAxe();
    cy.wait(500); // Wait for page to fully load
    cy.checkA11y(
      undefined,
      {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'],
        },
      },
      logViolations,
      true // Log to console
    );
  });

  // Test login form accessibility
  it('should pass accessibility tests on login page', () => {
    cy.visit('/auth/login');
    cy.injectAxe();
    cy.wait(500); // Wait for page to fully load
    cy.checkA11y(
      undefined,
      {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'],
        },
      },
      logViolations,
      true // Log to console
    );
  });

  // Test signup form accessibility
  it('should pass accessibility tests on signup page', () => {
    cy.visit('/auth/signup');
    cy.injectAxe();
    cy.wait(500); // Wait for page to fully load
    cy.checkA11y(
      undefined,
      {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'],
        },
      },
      logViolations,
      true // Log to console
    );
  });
});
