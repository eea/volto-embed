import Map from '@eeacms/volto-embed/Map/Map';

export default function MapsViewWidget({ id, value }) {
  return <Map data={value} id={id} />;
}
