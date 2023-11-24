import { connect } from 'react-redux';
import { pickMetadata } from '@eeacms/volto-embed/helpers';
import EmbedMap from '@eeacms/volto-embed/EmbedMap/EmbedMap';

function MapsViewWidget({ id, value, content }) {
  return (
    <EmbedMap
      data={{
        ...(value || {}),
        ...pickMetadata(content),
        with_share: true,
      }}
      id={id}
    />
  );
}

export default connect((state) => ({ content: state.content.data }))(
  MapsViewWidget,
);
