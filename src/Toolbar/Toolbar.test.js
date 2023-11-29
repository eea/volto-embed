import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-intl-redux';
import config from '@plone/volto/registry';

import { Enlarge, FigureNote, MoreInfo, Share, Sources } from '.';

config.blocks.blocksConfig = {
  ...config.blocks.blocksConfig,
  maps: {
    id: 'maps',
    title: 'Maps',
    group: 'media',
    extensions: {},
    variations: [],
    restricted: false,
    mostUsed: true,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  },
};

test('renders toolbar components', () => {
  const component = renderer.create(
    <Provider store={global.store}>
      <div className="visualization-toolbar">
        <div className="left-col">
          <FigureNote
            notes={[{ type: 'p', children: [{ text: 'This is a note' }] }]}
          />
          <Sources sources={[]} />
          <MoreInfo href={'/path/to/embeded/content'} />
        </div>
        <div className="right-col">
          <Enlarge className="enlarge-embed-maps">
            <div>Some enlarged content</div>
          </Enlarge>
          <Share href="/path/to/embeded/content" />
        </div>
      </div>
    </Provider>,
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
