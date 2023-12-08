import installBlocks from './Blocks';
import MapView from './Views/MapView';
import MapsViewWidget from './Widgets/MapsViewWidget';
import MapsWidget from './Widgets/MapsWidget';
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
  return [installBlocks].reduce((acc, apply) => apply(acc), config);
}
