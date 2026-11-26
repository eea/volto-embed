import {
  PRINT_URL,
  findWebmap,
  getPortalItem,
  getWebMapAsJSON,
  renderMapPreview,
} from './mapPreview';

const PORTAL = 'https://portal.discomap.eea.europa.eu/arcgis';
const ITEMS = `${PORTAL}/sharing/rest/content/items`;
const APP_ID = '4866816a1ae14283a754a3c6cb369aae';
const WEBMAP_ID = '72b12bf1d5dd41a28a41f8173632e2e9';
const APP_URL = `${PORTAL}/apps/experiencebuilder/experience/?id=${APP_ID}`;
const OUTPUT_URL = 'https://water.discomap.eea.europa.eu/out/_ags_1.png';
const VIEW = { xmin: 1, ymin: 2, xmax: 3, ymax: 4 };

const ARCGIS = {
  [`${ITEMS}/${APP_ID}?f=json`]: { type: 'Web Experience' },
  [`${ITEMS}/${APP_ID}/data?f=json`]: {
    dataSources: { ds: { type: 'WEB_MAP', itemId: WEBMAP_ID } },
  },
  [`${ITEMS}/${WEBMAP_ID}?f=json`]: {
    type: 'Web Map',
    extent: [
      [0, 0],
      [1, 1],
    ],
  },
  [`${ITEMS}/${WEBMAP_ID}/data?f=json`]: {
    initialState: { viewpoint: { targetGeometry: VIEW } },
    baseMap: { baseMapLayers: [{ id: 'base' }] },
    operationalLayers: [{ id: 'data' }],
  },
  [PRINT_URL]: { results: [{ value: { url: OUTPUT_URL } }] },
};

const respond = (url, body) => ({
  ok: true,
  url,
  json: async () => body,
  blob: async () => new Blob(['png'], { type: 'image/png' }),
});

describe('getPortalItem', () => {
  it('accepts ArcGIS portal app urls', () => {
    expect(getPortalItem(APP_URL)).toEqual({
      rest: `${PORTAL}/sharing/rest`,
      id: APP_ID,
    });
    expect(getPortalItem(`${PORTAL}/apps/dashboards/${APP_ID}`).id).toBe(
      APP_ID,
    );
  });

  it('rejects other urls', () => {
    [
      'https://adventure.discomap.eea.europa.eu/experience/13',
      `http://portal.discomap.eea.europa.eu/arcgis/apps/dashboards/${APP_ID}`,
      'not a url',
      '',
      undefined,
    ].forEach((url) => expect(getPortalItem(url)).toBeNull());
  });
});

describe('findWebmap', () => {
  it('finds the web map of each ArcGIS app type', () => {
    [
      { dataSources: { a: { type: 'WEB_MAP', itemId: 'wm' } } },
      { values: { webmap: 'wm' } },
      { map: { itemId: 'wm' } },
      { desktopView: { widgets: [{ type: 'mapWidget', itemId: 'wm' }] } },
    ].forEach((appData) => expect(findWebmap(appData)).toBe('wm'));
    expect(findWebmap({ widgets: [] })).toBeNull();
  });
});

describe('getWebMapAsJSON', () => {
  it('falls back to the item extent', () => {
    const { extent } = getWebMapAsJSON({}, [
      [0, 0],
      [10, 10],
    ]).mapOptions;
    expect(extent.xmin).toBeCloseTo(0);
    expect(extent.xmax).toBeCloseTo(1113194.9, 0);
  });
});

describe('renderMapPreview', () => {
  beforeEach(() => {
    global.fetch = vi.fn(async (url) =>
      url === OUTPUT_URL ? respond(url) : respond(url, ARCGIS[url]),
    );
  });

  it("renders the app's web map at its saved view as a PNG data url", async () => {
    const preview = await renderMapPreview(APP_URL);

    expect(preview).toMatch(/^data:image\/png;base64,/);
    const [, { body }] = global.fetch.mock.calls.find(
      ([url]) => url === PRINT_URL,
    );
    const webMap = JSON.parse(body.get('Web_Map_as_JSON'));
    expect(webMap.mapOptions.extent).toEqual(VIEW);
    expect(webMap.operationalLayers.map((layer) => layer.id)).toEqual([
      'base',
      'data',
    ]);
    expect(body.get('Layout_Template')).toBe('MAP_ONLY');
  });

  it('returns null for urls that are not ArcGIS portal apps', async () => {
    expect(await renderMapPreview('https://example.com/map')).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('rejects on ArcGIS errors', async () => {
    global.fetch = vi.fn(async (url) =>
      respond(url, { error: { message: 'Item does not exist' } }),
    );
    await expect(renderMapPreview(APP_URL)).rejects.toThrow(
      'Item does not exist',
    );
  });

  it('rejects when the print output is not a PNG', async () => {
    const fetchArcgis = global.fetch;
    global.fetch = vi.fn(async (url) =>
      url === OUTPUT_URL
        ? { ok: true, url, blob: async () => new Blob(['<html>']) }
        : fetchArcgis(url),
    );
    await expect(renderMapPreview(APP_URL)).rejects.toThrow('not a PNG');
  });
});
