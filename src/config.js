import ViewIframeBlock from './Iframe/ViewIframe.jsx';
import EditIframeBlock from './Iframe/EditIframe.jsx';

export function applyConfig(config) {
  config.blocks.blocksConfig.maps = {
    ...config.blocks.blocksConfig.maps,
    view: ViewIframeBlock,
    edit: EditIframeBlock,
  };
  return config;
}
