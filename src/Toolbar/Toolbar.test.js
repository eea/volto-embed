import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import config from '@plone/volto/registry';

import { Enlarge, FigureNote, MoreInfo, Share, Sources } from '.';

const mockStore = configureStore();

jest.mock('@plone/volto/components', () => ({
  __esModule: true,
  UniversalLink: ({ children, href }) => {
    return <a href={href}>{children}</a>;
  },
}));

jest.mock('@plone/volto-slate/editor/render', () => ({
  __esModule: true,
  serializeNodes: (nodes) => {
    return nodes.map((node, index) => {
      const Tag = node.type;
      return (
        <Tag key={`node-${index}`}>
          {node.children.map((item, index) => (
            <span key={`item-${index}`}>{item.text}</span>
          ))}
        </Tag>
      );
    });
  },
  serializeNodesToText: (nodes) => {
    return nodes
      .reduce((texts, node) => {
        if (node.children) {
          node.children.forEach((item) => {
            texts.push(item.text);
          });
        }
        return texts;
      }, [])
      .join('');
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

test('renders toolbar components', () => {
  const store = mockStore({
    intl: {
      locale: 'en',
      messages: {},
    },
    content: {
      create: {},
    },
    connected_data_parameters: {},
  });
  const component = renderer.create(
    <Provider store={store}>
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
