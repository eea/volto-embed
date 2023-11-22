import EmbedMap from '@eeacms/volto-embed/EmbedMap/EmbedMap';

export default function MapsViewWidget({ id, value }) {
  return <EmbedMap data={value} id={id} />;
}
