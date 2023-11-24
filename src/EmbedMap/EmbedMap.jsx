import React, { useEffect, useState, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import {
  FigureNote,
  Sources,
  MoreInfo,
  Share,
  Enlarge,
} from '@eeacms/volto-embed/Toolbar';
import PrivacyProtection from '@eeacms/volto-embed/PrivacyProtection/PrivacyProtection';

import './style.less';

const messages = defineMessages({
  EmbededGoogleMaps: {
    id: 'Embeded Google Maps',
    defaultMessage: 'Embeded Google Maps',
  },
});

function EmbedMap({ data, intl, id, screen }) {
  const el = useRef();
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    if (el.current) {
      const visWidth = el.current.offsetWidth;

      if (visWidth < 600 && !mobile) {
        setMobile(true);
      } else if (visWidth >= 600 && mobile) {
        setMobile(false);
      }
    }
  }, [screen, mobile]);

  console.log('HERE', data);
  if (!data.url) return null;

  return (
    <div
      ref={el}
      className={cx(
        'block maps align',
        {
          center: !Boolean(data.align),
        },
        data.align,
      )}
    >
      <div
        className={cx('maps-inner', {
          'full-width': data.align === 'full',
        })}
      >
        <PrivacyProtection
          data={data}
          id={id}
          height={data.height}
          useVisibilitySensor={data.useVisibilitySensor ?? true}
        >
          <iframe
            title={intl.formatMessage(messages.EmbededGoogleMaps)}
            src={data.url}
            className="google-map"
            frameBorder="0"
            allowFullScreen
            style={data.height ? { height: data.height } : {}}
          />
        </PrivacyProtection>
      </div>
      <div className={cx('visualization-toolbar', { mobile })}>
        <div className="left-col">
          {data.with_notes && <FigureNote notes={data.figure_note || []} />}
          {data.with_sources && (
            <Sources sources={data.data_provenance?.data} />
          )}
          {data.with_more_info && <MoreInfo href={data['@id']} />}
        </div>
        <div className="right-col">
          {data.with_enlarge && (
            <Enlarge className="enlarge-embed-maps">
              <EmbedMap
                data={{
                  ...data,
                  height: '100%',
                  with_notes: false,
                  with_sources: false,
                  with_more_info: false,
                  with_share: false,
                  with_enlarge: false,
                }}
                id={id}
                intl={intl}
              />
            </Enlarge>
          )}
          {data.with_share && <Share href={data['@id']} />}
        </div>
      </div>
    </div>
  );
}

export default compose(
  injectIntl,
  connect((state) => ({ screen: state.screen })),
)(EmbedMap);
