import { setupBeforeEach, tearDownAfterEach } from '../support';
import { changePageTitle, addBlock, selectBlock } from '../helpers';
import { openSidebarTab } from '../helpers';
import 'cypress-file-upload';

const group = {
  title: 'Common',
  id: 'common',
};

const blocksIds = ['maps'];

describe('Blocks Tests', () => {
  beforeEach(setupBeforeEach);
  afterEach(tearDownAfterEach);

  it('Add Block: Empty', () => {
    changePageTitle('Volto embed');
    blocksIds.forEach((id) => {
      addBlock(group.title, group.id, id);
      selectBlock('maps');
      openSidebarTab('Block');
      cy.get('#sidebar-properties header > h2')
        .first()
        .contains('Embed external content');

      cy.get('.field-wrapper-privacy_statement-0-dataprotection p').first().clear().type('Test text for privacy protection');
      cy.get('.field-wrapper-privacy_cookie_key-1-dataprotection');
      cy.get('.field-wrapper-enabled-2-dataprotection .checkbox').click();

      const imageFile = 'cat.jpg';
      cy.get('.field-wrapper-background_image-3-dataprotection .dropzone-placeholder').attachFile(imageFile);
      const embed_url = "<div class=\"mapouter\"><div class=\"gmap_canvas\"><iframe width=\"600\" height=\"500\" id=\"gmap_canvas\" src=\"https://maps.google.com/maps?q=2880%20Broadway,%20New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\"></iframe><a href=\"https://www.embedgooglemap.net/blog/divi-discount-code-elegant-themes-coupon/\"></a><br></div></div>";
      cy.get('.block.maps input').click().type(embed_url, { force: true })

      cy.get('.block-editor-text').last().click();
      cy.get('.block-add-button').first().click();
      cy.get('.blocks-chooser .title').contains('Common').click();
      cy.get('.ui.basic.icon.button.maps').contains('Maps').click();

      cy.get('.align-widget.field-wrapper-align button').first().click();
      cy.get('.block.maps input').last().click().type(embed_url, { force: true })
      cy.get('.field-wrapper-background_image-3-dataprotection .dropzone-placeholder').attachFile(imageFile);


      // Save
      cy.get('#toolbar-save').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

      // then the page view should contain our changes
      cy.get('.ui.loader');
      });
  });
});
