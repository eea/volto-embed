/**
 * Preview images for embedded ArcGIS apps.
 *
 * The map is shown in a cross-origin iframe, so the browser can't capture
 * it. Every ArcGIS app (Experience Builder, Dashboards, Web AppBuilder,
 * instant apps) is backed by a web map: a JSON spec of basemap and layers
 * that the ArcGIS "Export Web Map" print task renders to an image.
 */

export const PRINT_URL =
  'https://water.discomap.eea.europa.eu/arcgis/rest/services/Utilities/' +
  'PrintingTools/GPServer/Export%20Web%20Map%20Task/execute';

const OUTPUT_SIZE = [1200, 800];
const ITEM_ID = /(?:[?&](?:id|appid|webmap)=|\/dashboards\/)([0-9a-f]{32})/;

/**
 * The portal REST base URL and item id of an ArcGIS portal app, or null.
 */
export function getPortalItem(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const match = url.match(ITEM_ID);
  if (
    parsed.protocol !== 'https:' ||
    !parsed.pathname.startsWith('/arcgis/') ||
    !match
  ) {
    return null;
  }
  return { rest: `https://${parsed.host}/arcgis/sharing/rest`, id: match[1] };
}

async function getJSON(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`${response.status} from ${url}`);
  }
  const data = await response.json();
  if (data?.error) {
    throw new Error(`ArcGIS error from ${url}: ${data.error.message}`);
  }
  return data;
}

function findDashboardMap(data) {
  if (Array.isArray(data)) {
    for (const value of data) {
      const found = findDashboardMap(value);
      if (found) return found;
    }
  } else if (data && typeof data === 'object') {
    if (data.type === 'mapWidget' && data.itemId) return data.itemId;
    return findDashboardMap(Object.values(data));
  }
  return null;
}

/**
 * The web map item id referenced by an ArcGIS app config, or null.
 */
export function findWebmap(appData) {
  const webMapSource = Object.values(appData.dataSources || {}).find(
    (source) => source.type === 'WEB_MAP' && source.itemId,
  ); // Experience Builder
  return (
    webMapSource?.itemId ||
    appData.values?.webmap || // instant apps
    appData.map?.itemId || // Web AppBuilder
    findDashboardMap(appData) // Dashboards
  );
}

function toMercator([lon, lat]) {
  const clamped = Math.max(Math.min(lat, 85), -85);
  return [
    (lon * 20037508.34) / 180,
    (Math.log(Math.tan(((90 + clamped) * Math.PI) / 360)) * 20037508.34) /
      Math.PI,
  ];
}

/**
 * The Export Web Map task input: the web map at its saved initial view,
 * falling back to the item's extent.
 */
export function getWebMapAsJSON(webmap, itemExtent) {
  let extent = webmap.initialState?.viewpoint?.targetGeometry;
  if (!extent && itemExtent) {
    const [[xmin, ymin], [xmax, ymax]] = itemExtent.map(toMercator);
    extent = { xmin, ymin, xmax, ymax, spatialReference: { wkid: 3857 } };
  }
  return {
    mapOptions: { extent },
    operationalLayers: [
      ...(webmap.baseMap?.baseMapLayers || []),
      ...(webmap.operationalLayers || []),
    ],
    exportOptions: { outputSize: OUTPUT_SIZE, dpi: 96 },
  };
}

function toDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * A PNG data URL of the app's web map, or null if `url` is not an ArcGIS
 * portal app. Rejects on network, ArcGIS or print errors.
 */
export async function renderMapPreview(
  url,
  { signal, printUrl = PRINT_URL } = {},
) {
  const portalItem = getPortalItem(url);
  if (!portalItem) return null;
  const items = `${portalItem.rest}/content/items`;

  let webmapId = portalItem.id;
  let item = await getJSON(`${items}/${webmapId}?f=json`, { signal });
  if (item.type !== 'Web Map') {
    const appData = await getJSON(`${items}/${webmapId}/data?f=json`, {
      signal,
    });
    webmapId = findWebmap(appData);
    if (!webmapId) return null;
    item = await getJSON(`${items}/${webmapId}?f=json`, { signal });
  }
  const webmap = await getJSON(`${items}/${webmapId}/data?f=json`, { signal });

  const result = await getJSON(printUrl, {
    method: 'POST',
    body: new URLSearchParams({
      Web_Map_as_JSON: JSON.stringify(getWebMapAsJSON(webmap, item.extent)),
      Format: 'PNG32',
      Layout_Template: 'MAP_ONLY',
      f: 'json',
    }),
    signal,
  });
  const image = await fetch(result.results[0].value.url, { signal });
  if (!image.ok) {
    throw new Error(`${image.status} from ${image.url}`);
  }
  const blob = await image.blob();
  if (blob.type !== 'image/png') {
    throw new Error(`Print output is not a PNG: ${blob.type}`);
  }
  return toDataURL(blob);
}
