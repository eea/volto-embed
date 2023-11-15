import React from 'react';
import { Container } from 'semantic-ui-react';
import Map from '@eeacms/volto-embed/Map/Map';

const MapView = (props) => {
  return (
    <Container>
      <Map data={props.content.maps} id={props.content['@id']} />
    </Container>
  );
};

export default MapView;
