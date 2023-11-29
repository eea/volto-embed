import { uniqBy } from 'lodash';
import installMaps from './Maps';
import installEmbedMaps from './EmbedMaps';

export default function installBlocks(config) {
  config.blocks.groupBlocksOrder = uniqBy(
    [
      ...config.blocks.groupBlocksOrder,
      { id: 'data_visualizations', title: 'Data Visualizations' },
    ],
    'id',
  );

  return [installMaps, installEmbedMaps].reduce(
    (acc, apply) => apply(acc),
    config,
  );
}
