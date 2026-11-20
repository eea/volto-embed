import Edit from './Edit';
import View from './View';

export default function installHeroBlock(config) {
  config.blocks.blocksConfig.maps = {
    ...config.blocks.blocksConfig.maps,
    edit: Edit,
    view: View,
  };

  return config;
}
