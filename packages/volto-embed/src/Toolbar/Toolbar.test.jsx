import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-intl-redux';
import config from '@plone/volto/registry';
import '@testing-library/jest-dom';

import { Enlarge, FigureNote, MoreInfo, Share, Sources } from '.';

vi.mock('@plone/volto/components/manage/UniversalLink/UniversalLink', () => {
  return {
    default: ({ children, href, ...rest }) => (
      <a href={href} {...rest}>
        {children}
      </a>
    ),
  };
});

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
  const { container } = render(
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

  expect(screen.getByText('Note')).toBeInTheDocument();
  expect(screen.getByText('Sources')).toBeInTheDocument();
  expect(screen.getByText('More info')).toBeInTheDocument();
  expect(screen.getByText('Share')).toBeInTheDocument();
  expect(screen.getByText('Enlarge')).toBeInTheDocument();
  expect(
    screen.getByDisplayValue('/path/to/embeded/content'),
  ).toBeInTheDocument();
  expect(screen.getByText('Copy')).toBeInTheDocument();
  expect(container.querySelector('.figure-note')).toBeInTheDocument();
  expect(container.querySelector('.sources')).toBeInTheDocument();
  expect(container.querySelector('.more-info')).toBeInTheDocument();
  expect(container.querySelector('.enlarge')).toBeInTheDocument();
  expect(container.querySelector('.share')).toBeInTheDocument();
  expect(container.querySelector('p')).toHaveTextContent('This is a note');
  expect(
    screen.getByText('Data provenance is not set for this visualization.'),
  ).toBeInTheDocument();
  expect(container.querySelector('a')).toHaveAttribute(
    'href',
    '/path/to/embeded/content',
  );
  expect(
    container.querySelector('i.ri-external-link-line'),
  ).toBeInTheDocument();
  expect(container.querySelector('i.ri-fullscreen-line')).toBeInTheDocument();
  expect(container.querySelector('i.ri-share-fill')).toBeInTheDocument();
  expect(container.querySelector('input')).toHaveAttribute(
    'value',
    '/path/to/embeded/content',
  );
  expect(container.querySelector('button.copy-button')).toBeInTheDocument();
});

const setClipboard = (writeText) => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
};

const renderShare = () =>
  render(
    <Provider store={global.store}>
      <Share href="/path/to/embeded/content" />
    </Provider>,
  );

test('Share reports a successful copy', async () => {
  setClipboard(vi.fn().mockResolvedValue());
  renderShare();

  fireEvent.click(screen.getByText('Copy'));

  await waitFor(() => expect(screen.getByText('Copied!')).toBeInTheDocument());
});

test('Share reports a failed copy', async () => {
  setClipboard(vi.fn().mockRejectedValue(new Error('clipboard unavailable')));
  renderShare();

  fireEvent.click(screen.getByText('Copy'));

  await waitFor(() =>
    expect(
      screen.getByText('Copy failed. Please try again.'),
    ).toBeInTheDocument(),
  );
});

test('Enlarge opens a modal with the enlarged content', () => {
  render(
    <Provider store={global.store}>
      <Enlarge className="enlarge-embed-maps">
        <div>Some enlarged content</div>
      </Enlarge>
    </Provider>,
  );

  fireEvent.click(screen.getByText('Enlarge'));

  expect(screen.getByText('Some enlarged content')).toBeInTheDocument();
});

test('Enlarge closes the modal through the close icon', () => {
  render(
    <Provider store={global.store}>
      <Enlarge className="enlarge-embed-maps">
        <div>Some enlarged content</div>
      </Enlarge>
    </Provider>,
  );

  fireEvent.click(screen.getByText('Enlarge'));

  const closeIcon = document.querySelector('.enlarge-modal .close.icon');
  expect(closeIcon).toBeInTheDocument();

  fireEvent.click(closeIcon);
  expect(screen.queryByText('Some enlarged content')).not.toBeInTheDocument();
});

test('Enlarge forwards a custom onClick with a setOpen callback', () => {
  const onClick = vi.fn();
  render(
    <Provider store={global.store}>
      <Enlarge onClick={onClick}>
        <div>Some enlarged content</div>
      </Enlarge>
    </Provider>,
  );

  fireEvent.click(screen.getByText('Enlarge'));

  expect(onClick).toHaveBeenCalledWith({ setOpen: expect.any(Function) });
});

test('Enlarge does not render a modal without children', () => {
  const { container } = render(
    <Provider store={global.store}>
      <Enlarge />
    </Provider>,
  );

  fireEvent.click(screen.getByText('Enlarge'));

  expect(container.querySelector('.enlarge-modal')).not.toBeInTheDocument();
});
