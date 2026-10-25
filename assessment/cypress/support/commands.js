// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Handle cross-origin errors gracefully
Cypress.on("uncaught:exception", (err) => {
  // returning false here prevents Cypress from failing the test
  if (
    err.message.includes("cross-origin") ||
    err.message.includes("ResizeObserver loop")
  ) {
    return false;
  }
  return true;
});

// Custom command for API calls to the backend
Cypress.Commands.add("backendRequest", (options) => {
  const backendUrl = Cypress.env("backendUrl");

  // Modify URL to use the backend URL if it's a relative path
  if (options.url && options.url.startsWith("/")) {
    options.url = `${backendUrl}${options.url}`;
  }

  return cy.request(options);
});

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
