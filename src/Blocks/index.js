import installMaps from './Maps';
import installEmbedMaps from './EmbedMaps';

export default function installBlocks(config) {
  return [installMaps, installEmbedMaps].reduce(
    (acc, apply) => apply(acc),
    config,
  );
}
