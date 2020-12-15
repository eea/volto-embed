import { setupBeforeEach, tearDownAfterEach } from '../support';
import { changePageTitle, addBlock, selectBlock } from '../helpers';
import { openSidebarTab } from '../helpers';

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
    });
  });
});
