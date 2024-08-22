import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MapsViewWidget from './MapsViewWidget';
import EmbedMap from '@eeacms/volto-embed/EmbedMap/EmbedMap';
import { pickMetadata } from '@eeacms/volto-embed/helpers';
import '@testing-library/jest-dom/extend-expect'; // Importă jest-dom

jest.mock('@eeacms/volto-embed/EmbedMap/EmbedMap', () =>
  jest.fn(() => <div>Mocked EmbedMap</div>),
);
jest.mock('@eeacms/volto-embed/helpers', () => ({
  pickMetadata: jest.fn(),
}));

const mockStore = configureStore([]);

describe('MapsViewWidget', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      content: {
        data: {
          metadata: {
            title: 'Test Title',
            description: 'Test Description',
          },
        },
      },
    });
  });

  it('should render EmbedMap with the correct data props', () => {
    const mockValue = {
      map_url: 'http://example.com/map',
    };
    const mockId = 'map-widget-1';

    pickMetadata.mockReturnValue({
      title: 'Test Title',
      description: 'Test Description',
    });

    const { getByText } = render(
      <Provider store={store}>
        <MapsViewWidget id={mockId} value={mockValue} />
      </Provider>,
    );

    expect(EmbedMap).toHaveBeenCalledWith(
      {
        data: {
          map_url: 'http://example.com/map',
          title: 'Test Title',
          description: 'Test Description',
          with_share: true,
        },
        id: mockId,
      },
      {},
    );

    expect(getByText('Mocked EmbedMap')).toBeInTheDocument(); // Verifică dacă elementul este în document
  });

  it('should handle empty value prop correctly', () => {
    const mockId = 'map-widget-2';

    pickMetadata.mockReturnValue({
      title: 'Test Title',
      description: 'Test Description',
    });

    const { getByText } = render(
      <Provider store={store}>
        <MapsViewWidget id={mockId} value={null} />
      </Provider>,
    );

    expect(EmbedMap).toHaveBeenCalledWith(
      {
        data: {
          title: 'Test Title',
          description: 'Test Description',
          with_share: true,
        },
        id: mockId,
      },
      {},
    );

    expect(getByText('Mocked EmbedMap')).toBeInTheDocument(); // Verifică dacă elementul este în document
  });
});
