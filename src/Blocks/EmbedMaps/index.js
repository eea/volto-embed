import EmbedMap from './Edit';
import EmbedView from './View';

import sliderSVG from '@plone/volto/icons/slider.svg';

const applyConfig = (config) => {
  config.blocks.blocksConfig.embed_maps = {
    id: 'embed_maps',
    title: 'Embed interactive Map',
    icon: sliderSVG,
    group: 'common',
    edit: EmbedMap,
    view: EmbedView,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
  };

  return config;
};

export default applyConfig;
