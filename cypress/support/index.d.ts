declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
    */
    generateToken({secret}: {secret: string}): void
    dataCy(value: string): Chainable<Element>
    attachFile(fixture: string, processingOpts: any): Chainable<Element>;
  }
}