import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-intl-redux';
import config from '@plone/volto/registry';

import View from './View';
import installEmbedMaps from '.';

installEmbedMaps(config);

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

describe('Test Maps Block rendering', () => {
  const data = {
    '@type': 'maps',
    url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3027.7835278268726!2d14.38842915203974!3d40.634655679238854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133b994881d943cb%3A0x6ab93db57d3272f0!2sHotel+Mediterraneo+Sorrento!5e0!3m2!1sen!2ses!4v1550168740166',
    useVisibilitySensor: false,
    dataprotection: {
      enabled: false,
    },
  };

  test('test-1', () => {
    const component = renderer.create(
      <Provider store={global.store}>
        <View data={data} />
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  test('test-2', () => {
    const component = renderer.create(
      <Provider store={global.store}>
        <View
          data={{
            ...data,
            height: '100vh',
          }}
        />
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  test('test-3', () => {
    const Component = (props) => (
      <Provider store={global.store}>
        <View
          data={{
            ...data,
            dataprotection: {
              ...data.dataprotection,
              enabled: true,
            },
            height: '100vh',
            useVisibilitySensor: false,
          }}
        />
      </Provider>
    );
    const { container, rerender } = render(<Component />);

    expect(container).toMatchSnapshot();

    container.querySelector('.privacy-button button').click();

    rerender(<Component />);
    expect(container).toMatchSnapshot();
  });
});
