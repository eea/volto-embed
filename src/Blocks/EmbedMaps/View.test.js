import React from 'react';
import { Provider } from 'react-intl-redux';
import config from '@plone/volto/registry';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import View from './View';
import installEmbedMaps from '.';

installEmbedMaps(config);

describe('EmbedMaps Block View', () => {
  it('renders a view embed map block component', () => {
    render(
      <Provider store={global.store}>
        <View
          id="my-map"
          data={{
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
            parameters: {
              '@id': '647e4a0f-d4a0-4b8a-9965-0a016f017ebd',
              field: 'zoomtocountry',
              value: 'RO',
            },
            height: '800',
          }}
          data_query={[
            {
              i: 'Country',
              o: 'plone.app.querystring.operation.selection.is',
              v: ['RO'],
            },
          ]}
        />
      </Provider>,
    );
    expect(screen.getByTitle('Embeded ESRI Maps')).toBeInTheDocument();
    expect(screen.getByText('Sources')).toBeInTheDocument();
    expect(screen.getByText('More info')).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(screen.getByText('Enlarge')).toBeInTheDocument();
  });

  it('renders an edit view embed map block component', () => {
    render(
      <Provider store={global.store}>
        <View
          id="my-map"
          mode="edit"
          data={{
            '@type': 'embed_maps',
            url: '',
            maps: {},
          }}
        />
      </Provider>,
    );
    expect(
      screen.getByText('Please select a map from block editor.'),
    ).toBeInTheDocument();
  });

  it('handles map error', () => {
    render(
      <Provider store={global.store}>
        <View
          id="my-map"
          data={{
            '@type': 'embed_maps',
            maps: {
              error: 'Error message',
            },
          }}
        />
      </Provider>,
    );

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('handles share button click', () => {
    render(
      <Provider store={global.store}>
        <View
          id="my-map"
          data={{
            '@type': 'embed_maps',
            with_share: true,
            url: '/path/to/map',
            maps: {
              '@id': '/path/to/map',
              title: 'My map',
              url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3027.7835278268726!2d14.38842915203974!3d40.634655679238854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133b994881d943cb%3A0x6ab93db57d3272f0!2sHotel+Mediterraneo+Sorrento!5e0!3m2!1sen!2ses!4v1550168740166',
            },
          }}
        />
      </Provider>,
    );

    fireEvent.click(screen.getByText('Share'));
    expect(screen.getByDisplayValue('/path/to/map')).toBeInTheDocument();
  });
});
