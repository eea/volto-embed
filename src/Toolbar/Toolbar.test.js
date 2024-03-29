import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-intl-redux';
import config from '@plone/volto/registry';
import '@testing-library/jest-dom/extend-expect';

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
