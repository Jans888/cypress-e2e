import 'cypress-file-upload'

const localTimeOut = 1500

declare namespace Cypress {
    interface Chainable<Subject> {
      generateToken(secret: any): Cypress.Chainable<void>;
    }
  }

  function generateToken(secret: any): void {
    // Generate token
  }
  
  Cypress.Commands.add('generateToken', generateToken);