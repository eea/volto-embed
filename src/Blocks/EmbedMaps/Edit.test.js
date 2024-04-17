import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-intl-redux';
import config from '@plone/volto/registry';

import Edit from './Edit';
import installEmbedMaps from '.';
import '@testing-library/jest-dom/extend-expect';

installEmbedMaps(config);

jest.mock('@plone/volto/components', () => ({
  SidebarPortal: ({ children }) => (
    <div data-testid="sidebar-portal">{children}</div>
  ),
  UniversalLink: ({ children, href }) => <a href={href}>{children}</a>,
}));

jest.mock(
  '@plone/volto/components/manage/Form/BlockDataForm',
  () => (props) => (
    <div data-testid="block-data-form">
      <p>Mocked BlockDataForm</p>
      <input data-testid="block-data-input" onChange={props.onChangeField} />
    </div>
  ),
);

jest.mock('./View', () =>
  jest.fn((props) => (
    <div>
      <div data-testid="view-component" mode={props.mode}>
        Mocked View Component
      </div>
      {props.children}
    </div>
  )),
);

describe('Edit component', () => {
  const mockOnChangeBlock = jest.fn();
  const props = {
    id: 'my-map',
    data: {
      '@type': 'embed_maps',
      with_notes: false,
      with_sources: false,
      with_more_info: true,
      with_share: true,
      with_enlarge: true,
      url: '/path/to/map',
      maps: {
        '@id': '/path/to/map',
        title: 'My map',
        url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3027.7835278268726!2d14.38842915203974!3d40.634655679238854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133b994881d943cb%3A0x6ab93db57d3272f0!2sHotel+Mediterraneo+Sorrento!5e0!3m2!1sen!2ses!4v1550168740166',
      },
      dataprotection: {
        enabled: false,
      },
      useVisibilitySensor: false,
    },
    pathname: '/news',
    selected: true,
    block: '1234',
    index: 1,
    onChangeBlock: jest.fn(),
    onSelectBlock: jest.fn(),
    onDeleteBlock: jest.fn(),
    onFocusPreviousBlock: jest.fn(),
    onFocusNextBlock: jest.fn(),
    handleKeyDown: jest.fn(),
    content: {},
  };

  it('should render View component with mode set to edit', () => {
    const { getByTestId } = render(
      <Provider store={global.store}>
        <Edit {...props} />
      </Provider>,
    );

    const viewComponent = getByTestId('view-component');
    expect(viewComponent).toBeInTheDocument();
    expect(viewComponent).toHaveAttribute('mode', 'edit');
  });

  it('should render SidebarPortal when selected is true', () => {
    const { getByTestId } = render(
      <Provider store={global.store}>
        <Edit {...props} />
      </Provider>,
    );
    const sidebarPortal = getByTestId('sidebar-portal');
    expect(sidebarPortal).toBeInTheDocument();
  });

  it('should render SidebarPortal and BlockDataForm', () => {
    const { getByTestId } = render(
      <Provider store={global.store}>
        <Edit {...props} />
      </Provider>,
    );

    const sidebarPortal = getByTestId('sidebar-portal');
    const blockDataForm = getByTestId('block-data-form');
    expect(sidebarPortal).toBeInTheDocument();
    expect(blockDataForm).toBeInTheDocument();
  });

  it('should call onChangeBlock when onChangeField is triggered', () => {
    const { getByTestId } = render(
      <Provider store={global.store}>
        <Edit {...props} onChangeBlock={mockOnChangeBlock} />
      </Provider>,
    );

    const inputField = getByTestId('block-data-input');
    fireEvent.change(inputField, { target: { value: 'new value' } });

    expect(mockOnChangeBlock).toHaveBeenCalled();
  });
});
