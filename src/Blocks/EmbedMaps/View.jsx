import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';
import { getContent } from '@plone/volto/actions';
import { flattenToAppURL } from '@plone/volto/helpers';
import EmbedMap from '@eeacms/volto-embed/EmbedMap/EmbedMap';
import { pickMetadata } from '@eeacms/volto-embed/helpers';

function getMaps(props) {
  let maps = {},
    content = {};
  const { isBlock } = props;
  if (!isBlock && props.content?.maps) {
    content = pickMetadata(props.content);
    maps = props.content.maps;
  } else if (props.mapsContent) {
    content = pickMetadata(props.mapsContent);
    maps = props.mapsContent.maps;
  } else if (props.data.maps) {
    maps = props.data.maps;
  }
  return {
    ...content,
    ...maps,
  };
}

function View(props) {
  const { id, isBlock, getContent, mode } = props;
  const {
    useVisibilitySensor = true,
    with_notes = true,
    with_sources = true,
    with_more_info = true,
    with_share = true,
    with_enlarge = true,
  } = props.data;

  const url = flattenToAppURL(props.data.url || '');

  const maps = getMaps(props);

  useEffect(() => {
    const mapsId = maps['@id'] ? flattenToAppURL(maps['@id']) : undefined;
    if (isBlock && mode === 'edit' && url && url !== mapsId) {
      getContent(url, null, id);
    }
  }, [id, isBlock, getContent, mode, url, maps]);

  if (props.mode === 'edit' && !url) {
    return <Message>Please select a map from block editor.</Message>;
  }

  if (!maps) {
    return null;
  }

  return (
    <div className="embed-map">
      <EmbedMap
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
    isBlock: !!props.data?.['@type'],
  }),
  { getContent },
)(View);
