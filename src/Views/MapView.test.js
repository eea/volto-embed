import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-intl-redux';
import config from '@plone/volto/registry';

import MapView from './MapView';

config.settings = {
  ...config.settings,
  publicURL: 'https://www.eea.europa.eu/',
};

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

test('renders map component', () => {
  const component = renderer.create(
    <Provider store={global.store}>
      <MapView
        content={{
          maps: {
            '@id': '/path/to/map',
            with_notes: false,
            with_sources: false,
            with_more_info: true,
            with_share: true,
            with_enlarge: true,
            url:
              'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3027.7835278268726!2d14.38842915203974!3d40.634655679238854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133b994881d943cb%3A0x6ab93db57d3272f0!2sHotel+Mediterraneo+Sorrento!5e0!3m2!1sen!2ses!4v1550168740166',
            useVisibilitySensor: false,
          },
        }}
      />
    </Provider>,
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
