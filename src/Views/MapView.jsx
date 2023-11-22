import React from 'react';
import { Container } from 'semantic-ui-react';
import EmbedMap from '@eeacms/volto-embed/EmbedMap/EmbedMap';

const MapView = (props) => {
  return (
    <Container>
      <EmbedMap data={props.content.maps} id={props.content['@id']} />
    </Container>
  );
};

export default MapView;
