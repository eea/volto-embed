import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';
import { getContent } from '@plone/volto/actions';
import { flattenToAppURL } from '@plone/volto/helpers';
import Map from '@eeacms/volto-embed/Map/Map';
import { pickMetadata } from '@eeacms/volto-embed/helpers';

function View(props) {
  const { getContent } = props;
  const {
    url,
    useVisibilitySensor = true,
    with_notes = true,
    with_sources = true,
    with_more_info = true,
    with_share = true,
    with_enlarge = true,
  } = props.data;

  const maps = useMemo(() => {
    if (props.mapsContent?.maps) {
      return {
        ...props.mapsContent.maps,
        ...pickMetadata(props.mapsContent),
      };
    }
    if (props.data.maps) {
      return props.data.maps;
    }
    return undefined;
  }, [props.data.maps, props.mapsContent]);

  useEffect(() => {
    if (
      props.mode === 'edit' &&
      props.data.url &&
      props.data.url !== props.mapsContent?.['@id']
    ) {
      getContent(flattenToAppURL(props.data.url), null, props.id);
    }
  }, [getContent, props.id, props.mapsContent, props.mode, props.data.url]);

  if (props.mode === 'edit' && !url) {
    return <Message>Please select a map from block editor.</Message>;
  }

  if (!maps) {
    return null;
  }

  return (
    <div className="embed-map">
      <Map
        data={{
          ...maps,
          useVisibilitySensor,
          with_notes,
          with_sources,
          with_more_info,
          with_share,
          with_enlarge,
        }}
        id={props.id}
      />
    </div>
  );
}

export default connect(
  (state, props) => ({
    mapsContent: state.content.subrequests?.[props.id]?.data,
  }),
  { getContent },
)(View);
