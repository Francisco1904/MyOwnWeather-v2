describe('Keyboard Navigation', () => {
  beforeEach(() => {
    // This ensures we start with a fresh state for each test
    cy.viewport(1280, 720);
  });

  it('should move focus to the next element with a single Tab press', () => {
    // Visit the app
    cy.visit('/');

    // Check that Tab navigation works correctly
    cy.focused().should('not.exist'); // No element should be focused initially

    // Use cy.tab() to press tab - this simulates pressing the Tab key
    cy.get('body').trigger('keydown', { keyCode: 9, which: 9, key: 'Tab' });

    // An element should now be focused
    cy.focused().should('exist');

    // Store the currently focused element and press Tab again
    cy.focused().then($firstFocused => {
      // Get the focused element's tag name for debugging
      const firstTag = $firstFocused.prop('tagName');

      // Press Tab again
      cy.get('body').trigger('keydown', { keyCode: 9, which: 9, key: 'Tab' });

      // Check that a different element is now focused
      cy.wait(100); // Small wait to ensure focus has changed
      cy.focused()
        .should('exist')
        .then($secondFocused => {
          const secondTag = $secondFocused.prop('tagName');
          // Verify it's not the same element
          expect($secondFocused[0]).not.to.equal($firstFocused[0]);
          cy.log(`Focus moved from ${firstTag} to ${secondTag}`);
        });
    });
  });

  it('should navigate through the search page with keyboard', () => {
    // Visit the search page
    cy.visit('/search');

    // Check that the search input gets focused with Tab
    cy.get('body').trigger('keydown', { keyCode: 9, which: 9, key: 'Tab' });

    // The search input should be focused
    cy.get('input[placeholder="Search for a city..."]').should('be.focused');

    // Type something to make the clear button appear
    cy.focused().type('test');

    // Tab should move to the clear button
    cy.get('body').trigger('keydown', { keyCode: 9, which: 9, key: 'Tab' });

    // Wait to ensure focus has changed
    cy.wait(100);
    cy.focused().then($el => {
      // The clear button should have an aria-label
      cy.wrap($el).should('have.attr', 'aria-label', 'Clear search');
    });

    // Another Tab should move to the first search result or recent search item
    cy.get('body').trigger('keydown', { keyCode: 9, which: 9, key: 'Tab' });

    // Wait to ensure focus has changed
    cy.wait(100);
    cy.focused()
      .should('exist')
      .then($el => {
        // Should be a button role element
        cy.wrap($el).should('have.attr', 'role', 'button');
      });
  });
});
