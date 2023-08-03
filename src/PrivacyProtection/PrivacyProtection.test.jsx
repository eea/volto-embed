import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-intl-redux';
import configureStore from 'redux-mock-store';
import PrivacyProtection from './PrivacyProtection';
import config from '@plone/volto/registry';
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

jest.mock('@plone/volto-slate/editor/render', () => ({
  serializeNodes: jest.fn(() => 'serialized nodes'),
}));

jest.mock('@eeacms/volto-datablocks/helpers', () => ({
  getFilteredURL: jest.fn(() => 'filtered url'),
  getConnectedDataParametersForContext: jest.fn(() => 'connected data params'),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    blob: () => Promise.resolve(new Blob(['test'])),
  }),
);

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

jest.mock('./helpers', () => ({
  createImageUrl: () => 'test',
}));

global.URL.createObjectURL = jest.fn(() => 'test');

jest.mock('react-visibility-sensor', () => ({
  __esModule: true,
  default: (props) => {
    return <div onChange={props.onChange(true)}>{props.children}</div>;
  },
}));

describe('PrivacyProtection', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <CookiesProvider>
          <PrivacyProtection />
        </CookiesProvider>
      </Provider>,
    );
  });

  it('renders loader', async () => {
    const props = {
      data: {
        dataprotection: {
          enabled: true,
        },
      },
      cookies: {
        get: () => 'false',
        getAll: () => {},
        addChangeListener: () => {},
        removeChangeListener: () => {},
      },
      editable: true,
    };
    const { container } = render(
      <Provider store={store}>
        <CookiesProvider>
          <PrivacyProtection {...props} />
        </CookiesProvider>
      </Provider>,
    );
    expect(container.querySelector('.ui.loader')).toBeInTheDocument();
  });

  it('renders loader', async () => {
    const props = {
      data: {
        dataprotection: {
          enabled: true,
        },
      },
      cookies: {
        get: () => 'false',
        getAll: () => {},
        addChangeListener: () => {},
        removeChangeListener: () => {},
      },
      editable: false,
    };
    const { container } = render(
      <Provider store={store}>
        <CookiesProvider>
          <PrivacyProtection {...props} />
        </CookiesProvider>
      </Provider>,
    );
    expect(container.querySelector('.ui.loader')).toBeInTheDocument();
  });

  it('renders the wrapper and children', async () => {
    const props = {
      data: {
        dataprotection: {
          enabled: false,
        },
      },
      cookies: {
        get: () => 'true',
        getAll: () => {},
        addChangeListener: () => {},
        removeChangeListener: () => {},
      },
      editable: false,
    };
    const { container, getByText } = render(
      <Provider store={store}>
        <CookiesProvider>
          <PrivacyProtection {...props}>
            <div>test test</div>
          </PrivacyProtection>
        </CookiesProvider>
      </Provider>,
    );
    expect(getByText('test test')).toBeInTheDocument();
    expect(
      container.querySelector('.privacy-protection-wrapper'),
    ).toBeInTheDocument();
  });

  it('renders the wrapper and children', async () => {
    config.settings = {
      embedCookieExpirationDays: 30,
    };
    const props = {
      data: {
        dataprotection: {
          enabled: true,
        },
      },
      cookies: {
        get: () => 'true',
        getAll: () => {},
        addChangeListener: () => {},
        removeChangeListener: () => {},
      },
    };
    const { container, getByText } = render(
      <Provider store={store}>
        <CookiesProvider>
          <PrivacyProtection {...props}>
            <div>test test</div>
          </PrivacyProtection>
        </CookiesProvider>
      </Provider>,
    );
    expect(getByText('test test')).toBeInTheDocument();
    expect(
      container.querySelector('.privacy-protection-wrapper'),
    ).toBeInTheDocument();
  });

  it('renders popup with external content, button', async () => {
    const props = {
      data: {
        dataprotection: {
          enabled: true,
          background_image: 'test',
          privacy_statement: {
            nodes: [],
            getAttributes: () => {},
          },
        },
      },
      cookies: {
        get: () => false,
        set: () => {},
        getAll: () => {},
        addChangeListener: () => {},
        removeChangeListener: () => {},
      },
    };
    const { container, queryByText, getByText } = render(
      <Provider store={store}>
        <CookiesProvider>
          <PrivacyProtection {...props}>
            <div>test test</div>
          </PrivacyProtection>
        </CookiesProvider>
      </Provider>,
    );
    expect(
      container.querySelector('.privacy-protection-wrapper'),
    ).toBeInTheDocument();
    expect(container.querySelector('.privacy-protection')).toBeInTheDocument();

    expect(
      container.querySelector(
        '.overlay .wrapped .privacy-button .primary.button',
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        '.overlay .wrapped .privacy-toggle .ui.toggle.checkbox input',
      ),
    ).toBeInTheDocument();

    expect(getByText('Show external content')).toBeInTheDocument();
    expect(getByText('Remember my choice')).toBeInTheDocument();
    expect(getByText('serialized nodes')).toBeInTheDocument();
    fireEvent.click(getByText('Show external content'));
    await act(() => Promise.resolve());
    expect(queryByText('Show external content')).toBe(null);
    expect(getByText('test test')).toBeInTheDocument();
  });

  it('renders popup with external content, button', async () => {
    const props = {
      data: {
        dataprotection: {
          enabled: true,
          background_image: 'test',
          privacy_statement: {
            nodes: [],
            getAttributes: () => {},
          },
        },
      },
      cookies: {
        get: () => 'false',
        set: () => {},
        getAll: () => {},
        addChangeListener: () => {},
        removeChangeListener: () => {},
      },
    };
    const { container, queryByText, getByText } = render(
      <Provider store={store}>
        <CookiesProvider>
          <PrivacyProtection {...props}>
            <div>test test</div>
          </PrivacyProtection>
        </CookiesProvider>
      </Provider>,
    );
    expect(
      container.querySelector('.privacy-protection-wrapper'),
    ).toBeInTheDocument();
    expect(container.querySelector('.privacy-protection')).toBeInTheDocument();

    expect(
      container.querySelector(
        '.overlay .wrapped .privacy-button .primary.button',
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        '.overlay .wrapped .privacy-toggle .ui.toggle.checkbox input',
      ),
    ).toBeInTheDocument();

    expect(getByText('Show external content')).toBeInTheDocument();
    expect(getByText('Remember my choice')).toBeInTheDocument();
    expect(getByText('serialized nodes')).toBeInTheDocument();
    fireEvent.click(getByText('Show external content'));
    await act(() => Promise.resolve());
    expect(queryByText('Show external content')).toBe(null);
    expect(getByText('test test')).toBeInTheDocument();
  });

  it('renders popup with external content, button', () => {
    const props = {
      data: {
        dataprotection: {
          enabled: true,
          background_image: 'test',
          privacy_statement: {
            nodes: [],
            getAttributes: () => {},
          },
        },
      },
      cookies: {
        get: () => 'false',
        set: () => {},
        getAll: () => {},
        addChangeListener: () => {},
        removeChangeListener: () => {},
      },
    };
    const { container, getByText } = render(
      <Provider store={store}>
        <CookiesProvider>
          <PrivacyProtection {...props}>
            <div>test test</div>
          </PrivacyProtection>
        </CookiesProvider>
      </Provider>,
    );
    expect(
      container.querySelector('.privacy-protection-wrapper'),
    ).toBeInTheDocument();
    expect(container.querySelector('.privacy-protection')).toBeInTheDocument();

    expect(
      container.querySelector(
        '.overlay .wrapped .privacy-button .primary.button',
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        '.overlay .wrapped .privacy-toggle .ui.toggle.checkbox input',
      ),
    ).toBeInTheDocument();

    expect(getByText('Show external content')).toBeInTheDocument();
    expect(getByText('Remember my choice')).toBeInTheDocument();
    expect(getByText('serialized nodes')).toBeInTheDocument();
    fireEvent.click(getByText('Remember my choice'));
  });
});
