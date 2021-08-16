import { ViewIframe, EditIframe } from './Iframe';

export {
  PrivacyProtection,
  addPrivacyProtectionToSchema,
} from './PrivacyProtection';

export default (config) => {
  config.blocks.blocksConfig.maps = {
    ...config.blocks.blocksConfig.maps,
    view: ViewIframe,
    edit: EditIframe,
  };
  config.settings.allowed_cors_destinations = [
    ...config.settings.allowed_cors_destinations,
    'screenshot.eea.europa.eu',
  ];
  return config;
};
