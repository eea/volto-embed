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

  return config;
};
