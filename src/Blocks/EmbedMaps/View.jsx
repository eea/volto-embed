import React, { useEffect, useMemo, useState } from 'react';
import { reduce, isArray, isString } from 'lodash';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';
import { getContent } from '@plone/volto/actions';
import { flattenToAppURL } from '@plone/volto/helpers';
import EmbedMap from '@eeacms/volto-embed/EmbedMap/EmbedMap';
import { pickMetadata } from '@eeacms/volto-embed/helpers';

let timer;

const debounce = (func, ...args) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(func, 800, ...args);
};

function getMaps(props) {
  const content = props.mapsContent || {};
  const maps = content.maps || props.data?.maps || {};
  return {
    ...pickMetadata(content),
    ...maps,
  };
}

function getParameters({ parameters, data_query }) {
  return {
    ...reduce(
      data_query,
      (acc, { i, v }) => {
        if (i && v) {
          let value = isString(v) ? v : '';
          if (isArray(v)) {
            value = v.join(',');
          }
          return {
            ...acc,
            [i]: value,
          };
        }
        return acc;
      },
      {},
    ),
    ...reduce(
      parameters,
      (acc, { field, value }) => {
        if (field && value) {
          return {
            ...acc,
            [field]: value,
          };
        }
        return acc;
      },
      {},
    ),
  };
}

function View(props) {
  const { id, getContent, mode, data_query } = props;
  const {
    height,
    parameters,
    useVisibilitySensor = true,
    with_notes = true,
    with_sources = true,
    with_more_info = true,
    with_share = true,
    with_enlarge = true,
  } = props.data;

  const url = flattenToAppURL(props.data.url || '');

  const maps = useMemo(() => getMaps(props), [props]);

  const [queryParams, setQueryParams] = useState(() =>
    getParameters({ parameters, data_query }),
  );

  useEffect(() => {
    debounce(() => {
      setQueryParams(
        getParameters({
          parameters,
          data_query,
        }),
      );
    });
  }, [data_query, parameters]);

  useEffect(() => {
    const mapsId = maps['@id'] ? flattenToAppURL(maps['@id']) : undefined;
    if (url && url !== mapsId) {
      getContent(url, null, id);
    }
  }, [id, getContent, mode, url, maps]);

  if (mode === 'edit' && !url) {
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
          parameters: queryParams,
          height: height || maps.height,
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
    data_query: state.content?.data?.data_query,
  }),
  { getContent },
)(View);
