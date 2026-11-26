import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-intl-redux';
import '@testing-library/jest-dom';

import MapsWidget from './MapsWidget';
import { renderMapPreview } from './mapPreview';

vi.mock('./mapPreview', async (importOriginal) => ({
  ...(await importOriginal()),
  renderMapPreview: vi.fn(),
}));

vi.mock('@eeacms/volto-embed/EmbedMap/EmbedMap', () => ({
  default: vi.fn(() => <div data-testid="embed-map" />),
}));

vi.mock('@plone/volto/components/manage/Form/InlineForm', () => ({
  default: ({ onChangeField }) => (
    <div data-testid="inline-form">
      <button
        data-testid="inline-change-url"
        onClick={() => onChangeField('url', 'https://changed.example/map')}
      />
      <button
        data-testid="inline-change-title"
        onClick={() => onChangeField('title', 'Changed title')}
      />
    </div>
  ),
}));

vi.mock('@plone/volto/components/manage/Widgets/FormFieldWrapper', () => ({
  default: ({ children }) => (
    <div data-testid="form-field-wrapper">{children}</div>
  ),
}));

vi.mock('@eeacms/volto-embed', () => ({
  addPrivacyProtectionToSchema: vi.fn((schema) => schema),
}));

const renderWidget = (props = {}) =>
  render(
    <Provider store={global.store}>
      <MapsWidget
        id="map-1"
        title="Map"
        value={{}}
        onChange={vi.fn()}
        {...props}
      />
    </Provider>,
  );

const openEditor = () => fireEvent.click(screen.getByText('Open Map Editor'));

const errorText =
  'Embed code error, please follow the instructions and try again.';

describe('MapsWidget', () => {
  it('renders the label and editor button without an embed map', () => {
    renderWidget();

    expect(screen.getByText('Map')).toBeInTheDocument();
    expect(screen.getByText('Open Map Editor')).toBeInTheDocument();
    expect(screen.queryByTestId('embed-map')).not.toBeInTheDocument();
  });

  it('renders the description and embed map when a url is set', () => {
    renderWidget({
      description: 'Help text',
      value: { url: 'https://existing.example/map' },
    });

    expect(screen.getByText('Help text')).toBeInTheDocument();
    expect(screen.getByTestId('embed-map')).toBeInTheDocument();
  });

  it('renders error labels', () => {
    renderWidget({ error: ['Something went wrong'] });

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('opens the editor and handles empty/typed url input', () => {
    renderWidget();
    openEditor();

    const input = screen.getByPlaceholderText('Enter map Embed Code');
    expect(input).toHaveValue('');

    fireEvent.click(input);
    fireEvent.keyDown(input, { key: 'Escape' });
    fireEvent.keyDown(input, { key: 'a' });

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(errorText)).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'https://example.com/map' } });
    expect(document.querySelector('button.cancel')).toBeInTheDocument();

    fireEvent.click(document.querySelector('button.cancel'));
    expect(input).toHaveValue('');
  });

  it('uses a custom placeholder from the value', () => {
    renderWidget({ value: { placeholder: 'Custom map placeholder' } });
    openEditor();

    expect(
      screen.getByPlaceholderText('Custom map placeholder'),
    ).toBeInTheDocument();
  });

  it('submits a plain url and applies the changes', () => {
    const onChange = vi.fn();
    renderWidget({ onChange });
    openEditor();

    const input = screen.getByPlaceholderText('Enter map Embed Code');
    fireEvent.change(input, { target: { value: 'https://example.com/map' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(
      screen.queryByPlaceholderText('Enter map Embed Code'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('embed-map')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Apply changes'));

    expect(onChange).toHaveBeenCalledWith('map-1', {
      url: 'https://example.com/map',
    });
    expect(screen.queryByText('Apply changes')).not.toBeInTheDocument();
  });

  it('submits through the primary button in the toolbar', () => {
    const onChange = vi.fn();
    renderWidget({ onChange });
    openEditor();

    const input = screen.getByPlaceholderText('Enter map Embed Code');
    fireEvent.change(input, {
      target: { value: 'https://button.example/map' },
    });
    fireEvent.click(document.querySelector('.toolbar-inner button.primary'));
    fireEvent.click(screen.getByText('Apply changes'));

    expect(onChange).toHaveBeenCalledWith('map-1', {
      url: 'https://button.example/map',
    });
  });

  it('extracts the src from an iframe embed code', () => {
    const onChange = vi.fn();
    renderWidget({ onChange });
    openEditor();

    const input = screen.getByPlaceholderText('Enter map Embed Code');
    fireEvent.change(input, {
      target: { value: '<iframe src="https://embed.example/map"></iframe>' },
    });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.click(screen.getByText('Apply changes'));

    expect(onChange).toHaveBeenCalledWith('map-1', {
      url: 'https://embed.example/map',
    });
  });

  it('shows an error for an iframe embed code without an iframe', () => {
    renderWidget();
    openEditor();

    const input = screen.getByPlaceholderText('Enter map Embed Code');
    fireEvent.change(input, {
      target: { value: '<iframe-bogus src="https://embed.example/map">' },
    });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText(errorText)).toBeInTheDocument();
  });

  it('edits an existing url through the inline form and closes', () => {
    renderWidget({ value: { url: 'https://existing.example/map' } });
    openEditor();

    expect(screen.getByTestId('inline-form')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('inline-change-url'));
    fireEvent.click(screen.getByTestId('inline-change-title'));

    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('inline-form')).not.toBeInTheDocument();
  });
});

describe('MapsWidget preview', () => {
  const arcgisUrl =
    'https://portal.discomap.eea.europa.eu/arcgis/apps/dashboards/' +
    '9f1e6f5bea6946d8b4de09c340ad89c9';
  const preview = 'data:image/png;base64,cG5n';

  const renderWith = (value, onChange = vi.fn()) => {
    const props = { id: 'map-1', title: 'Map', onChange };
    const view = render(
      <Provider store={global.store}>
        <MapsWidget {...props} value={value} />
      </Provider>,
    );
    const setValue = (newValue) =>
      view.rerender(
        <Provider store={global.store}>
          <MapsWidget {...props} value={newValue} />
        </Provider>,
      );
    return { onChange, setValue };
  };

  beforeEach(() => renderMapPreview.mockReset());

  it('renders a preview when the map url changes', async () => {
    renderMapPreview.mockResolvedValue(preview);
    const { onChange, setValue } = renderWith({});

    setValue({ url: arcgisUrl, height: '600' });

    expect(renderMapPreview).toHaveBeenCalledWith(arcgisUrl, {
      signal: expect.any(AbortSignal),
    });
    expect(
      screen.getByText('Generating the preview image…'),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith('map-1', {
        url: arcgisUrl,
        height: '600',
        preview,
      }),
    );
    expect(screen.getByText(/Preview image generated/)).toBeInTheDocument();
  });

  it('does not render for the saved url or non-ArcGIS urls', () => {
    const { setValue } = renderWith({ url: arcgisUrl });
    setValue({ url: arcgisUrl, height: '700' });
    setValue({ url: 'https://example.com/map' });

    expect(renderMapPreview).not.toHaveBeenCalled();
  });

  it('tells the editor when the preview could not be generated', async () => {
    renderMapPreview.mockRejectedValue(new Error('print service down'));
    const { onChange, setValue } = renderWith({});

    setValue({ url: arcgisUrl });

    expect(
      await screen.findByText(/could not be generated/),
    ).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('gives up on a hung render after a timeout', async () => {
    vi.useFakeTimers();
    renderMapPreview.mockImplementation(
      (url, { signal }) =>
        new Promise((resolve, reject) =>
          signal.addEventListener('abort', () => reject(signal.reason)),
        ),
    );
    const { setValue } = renderWith({});
    setValue({ url: arcgisUrl });

    await vi.advanceTimersByTimeAsync(60000);
    vi.useRealTimers();

    expect(screen.getByText(/could not be generated/)).toBeInTheDocument();
  });

  it('drops the preview of the previous map when the url changes', () => {
    const { onChange } = renderWith({ url: arcgisUrl, preview });
    openEditor();
    fireEvent.click(screen.getByTestId('inline-change-url'));
    fireEvent.click(screen.getByText('Apply changes'));

    expect(onChange).toHaveBeenCalledWith('map-1', {
      url: 'https://changed.example/map',
    });
  });
});
