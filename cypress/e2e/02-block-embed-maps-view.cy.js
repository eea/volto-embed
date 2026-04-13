import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Embed Maps Block: View Mode Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Embed Maps Block: Add and save', () => {
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Embed Maps Test');
    cy.get('.documentFirstHeading').contains('Embed Maps Test');

    cy.getSlate().click();

    // Add embed maps block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Data Visualizations').click();
    cy.get('.content.active.data_visualizations .button.embed_maps')
      .click({ force: true });

    // Save
    cy.get('#toolbar-save').click();
    cy.contains('Embed Maps Test');
  });
});