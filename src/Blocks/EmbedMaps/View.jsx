import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';
import Map from '@eeacms/volto-embed/Map/Map';

import { getContent } from '@plone/volto/actions';

function View(props) {
  const {
    url,
    with_notes = true,
    with_sources = true,
    with_more_info = true,
    with_share = true,
    with_enlarge = true,
  } = props.data;

  const maps = useMemo(() => {
    if (props.data.maps) {
      return props.data.maps;
    }
    if (props.mapsContent?.maps) {
      return {
        ...props.mapsContent.maps,
        '@id': props.mapsContent['@id'],
        title: props.mapsContent['title'],
        publisher: props.mapsContent['publisher'],
        geo_coverage: props.mapsContent['geo_coverage'],
        temporal_coverage: props.mapsContent['temporal_coverage'],
        other_organisations: props.mapsContent['other_organisations'],
        data_provenance: props.mapsContent['data_provenance'],
        figure_note: props.mapsContent['figure_note'],
      };
    }
    return undefined;
  }, [props.data.maps, props.mapsContent]);

  useEffect(() => {
    if (props.data.url && !props.data.maps) {
      props.getContent(flattenToAppURL(props.data.url), null, props.id);
    }
    /* eslint-disable-next-line */
  }, [props.data.url]);

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
