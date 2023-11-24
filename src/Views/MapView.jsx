import React from 'react';
import { Container } from 'semantic-ui-react';
import { hasBlocksData } from '@plone/volto/helpers';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import EmbedMap from '@eeacms/volto-embed/EmbedMap/EmbedMap';
import { pickMetadata } from '@eeacms/volto-embed/helpers';

const MapView = (props) => {
  return (
    <Container id="page-document" className="view-wrapper visualization-view">
      {hasBlocksData(props.content) ? (
        <RenderBlocks {...props} />
      ) : (
        <EmbedMap
          data={{
            ...(props.content.maps || {}),
            ...pickMetadata(props.content),
            with_share: true,
          }}
          id="map-view"
        />
      )}
    </Container>
  );
};

export default MapView;
