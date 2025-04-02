describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should have the correct title", () => {
    cy.title().should("include", "Weather App");
  });

  it("should display the main content", () => {
    cy.get("main").should("exist");
  });

  // Add more tests specific to your application here
});
