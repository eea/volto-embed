import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-intl-redux';
import config from '@plone/volto/registry';

import Edit from './Edit';

describe('Test Maps Block editing', () => {
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

  const data = {
    '@type': 'maps',
    url:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11255.043736345397!2d24.6862147!3d45.15143895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474d3248f30cd7b5%3A0x307c5acf21ded9e3!2sHotel%20Posada!5e0!3m2!1sro!2sro!4v1701254795494!5m2!1sro!2sro" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    dataprotection: {
      enabled: false,
      privacy_statement: 'This is a privacy statement',
    },
    useVisibilitySensor: false,
  };

  test('test-1', () => {
    const component = renderer.create(
      <Provider store={global.store}>
        <Edit
          data={data}
          pathname="/news"
          selected={false}
          block="1234"
          index={1}
          onChangeBlock={() => {}}
          onSelectBlock={() => {}}
          onDeleteBlock={() => {}}
          onFocusPreviousBlock={() => {}}
          onFocusNextBlock={() => {}}
          handleKeyDown={() => {}}
          content={{}}
        />
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  test('test-2', () => {
    const component = renderer.create(
      <Provider store={global.store}>
        <Edit
          data={data}
          pathname="/news"
          selected={true}
          block="1234"
          index={1}
          onChangeBlock={() => {}}
          onSelectBlock={() => {}}
          onDeleteBlock={() => {}}
          onFocusPreviousBlock={() => {}}
          onFocusNextBlock={() => {}}
          handleKeyDown={() => {}}
          content={{}}
        />
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
