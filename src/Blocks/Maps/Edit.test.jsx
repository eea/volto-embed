import React from 'react';
import config from '@plone/volto/registry';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-intl-redux';
import configureStore from 'redux-mock-store';
import Edit from './Edit';
import '@testing-library/jest-dom/extend-expect';

const mockStore = configureStore();

const store = mockStore(() => ({
  connected_data_parameters: {},
  router: {
    location: {
      pathname: '',
    },
  },
  intl: {
    locale: 'en',
    messages: {},
  },
}));

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

jest.mock(
  '@eeacms/volto-embed/PrivacyProtection/PrivacyProtection',
  () => ({ children }) => children,
);

describe('Edit', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <Edit
          selected={false}
          block="block"
          index={1}
          data={{
            '@type': 'maps',
            url:
              'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3027.7835278268726!2d14.38842915203974!3d40.634655679238854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133b994881d943cb%3A0x6ab93db57d3272f0!2sHotel+Mediterraneo+Sorrento!5e0!3m2!1sen!2ses!4v1550168740166',
          }}
          pathname="/"
          onChangeBlock={() => {}}
          onSelectBlock={() => {}}
          onDeleteBlock={() => {}}
          onFocusPreviousBlock={() => {}}
          onFocusNextBlock={() => {}}
          handleKeyDown={() => {}}
        />
      </Provider>,
    );
  });

  it('submits url when button is clicked', async () => {
    const url =
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3027.7835278268726!2d14.38842915203974!3d40.634655679238854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133b994881d943cb%3A0x6ab93db57d3272f0!2sHotel+Mediterraneo+Sorrento!5e0!3m2!1sen!2ses!4v1550168740166';

    const { container, getByPlaceholderText } = render(
      <Provider store={store}>
        <Edit
          selected={false}
          block="block"
          index={1}
          data={{
            '@type': 'maps',
            dataprotection: {
              privacy_statement: 'test',
            },
          }}
          pathname="/"
          onChangeBlock={() => {}}
          onSelectBlock={() => {}}
          onDeleteBlock={() => {}}
          onFocusPreviousBlock={() => {}}
          onFocusNextBlock={() => {}}
          handleKeyDown={() => {}}
        />
      </Provider>,
    );

    const input = getByPlaceholderText('Enter map Embed Code');

    fireEvent.click(input);
    fireEvent.change(input, { target: { value: url } });
    // screen.debug();
    // expect(input.value).toBe(url);

    // fireEvent.click(container.querySelector('button.cancel'));

    // fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    // fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
    // fireEvent.keyDown(input, { key: 'KeyA', code: 'KeyA' });

    // fireEvent.change(input, { target: { value: '<iframe src="test"/>' } });
    // fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // const button = container.querySelector('button.ui.basic.primary.button');
    // fireEvent.click(button);
  });
});
