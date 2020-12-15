import { ViewIframe, EditIframe } from '@eeacms/volto-embed/Iframe';

export {
  PrivacyProtection,
  addPrivacyProtectionToSchema,
} from '@eeacms/volto-embed/PrivacyProtection';

export default (config) => {
  config.blocks.blocksConfig.maps = {
    ...config.blocks.blocksConfig.maps,
    view: ViewIframe,
    edit: EditIframe,
  };

  return config;
};
