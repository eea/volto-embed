import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, fireEvent } from '@testing-library/react';
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

describe('Edit', () => {
  it('renders without crashing', () => {
    act(() => {
      render(
        <Provider store={store}>
          <Provider store={store}>
            <Edit
              selected={false}
              block="block"
              index={1}
              data={{
                url: 'test',
              }}
              pathname="/"
              onChangeBlock={() => {}}
              onSelectBlock={() => {}}
              onDeleteBlock={() => {}}
              onFocusPreviousBlock={() => {}}
              onFocusNextBlock={() => {}}
              handleKeyDown={() => {}}
            />
          </Provider>
        </Provider>,
      );
    });
  });

  it('submits url when button is clicked', () => {
    let container, getByPlaceholderText;
    act(() => {
      const { _container, _getByPlaceholderText } = render(
        <Provider store={store}>
          <Provider store={store}>
            <Edit
              selected={false}
              block="block"
              index={1}
              data={{
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
          </Provider>
        </Provider>,
      );
      container = _container;
      getByPlaceholderText = _getByPlaceholderText;
    });

    const input = getByPlaceholderText('Enter map Embed Code');
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: 'test url' } });
    fireEvent.click(container.querySelector('button.cancel'));
    fireEvent.change(input, { target: { value: 'test url' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
    fireEvent.keyDown(input, { key: 'KeyA', code: 'KeyA' });

    fireEvent.change(input, { target: { value: '<iframe src="test"/>' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    const button = container.querySelector('button.ui.basic.primary.button');
    fireEvent.click(button);
  });
});
