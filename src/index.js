import installBlocks from './Blocks';
import MapView from './Views/MapView';
import MapsViewWidget from './Widgets/MapsViewWidget';
import MapsWidget from './Widgets/MapsWidget';
import { preview_image } from './middlewares/preview_image';
export {
  PrivacyProtection,
  addPrivacyProtectionToSchema,
} from './PrivacyProtection';

export default function applyConfig(config) {
  config.views.contentTypesViews.map = MapView;
  config.widgets.id.maps = MapsWidget;
  config.widgets.views.id.maps = MapsViewWidget;

  config.settings.allowed_cors_destinations = [
    ...config.settings.allowed_cors_destinations,
    'screenshot.eea.europa.eu',
  ];
  config.settings.storeExtenders = [
    ...(config.settings.storeExtenders || []),
    preview_image,
  ];
  return [installBlocks].reduce((acc, apply) => apply(acc), config);
}
