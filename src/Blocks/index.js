import installMaps from './Maps';

export default function installBlocks(config) {
  return [installMaps].reduce((acc, apply) => apply(acc), config);
}
