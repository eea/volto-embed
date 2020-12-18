import { ViewIframe, EditIframe } from 'volto-embed/Iframe';

export {
  PrivacyProtection,
  addPrivacyProtectionToSchema,
} from 'volto-embed/PrivacyProtection';

export default (config) => {
  config.blocks.blocksConfig.maps = {
    ...config.blocks.blocksConfig.maps,
    view: ViewIframe,
    edit: EditIframe,
  };

  return config;
};
