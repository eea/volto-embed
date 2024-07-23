import React, { useEffect, useState, useRef } from 'react';
import { isNaN, isNumber, isEmpty } from 'lodash';
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
  EmbededESRIMaps: {
    id: 'Embeded ESRI Maps',
    defaultMessage: 'Embeded ESRI Maps',
  },
});

function getHeight(height, screen) {
  const asNumber = isNumber(Number(height)) && !isNaN(Number(height));
  if (asNumber) {
    return `${height}px`;
  }
  return height || (screen ? screen.page.height - 50 : 400);
}

function EmbedMap({ data, intl, id, screen }) {
  const { parameters, url } = data;
  const el = useRef();
  const [mobile, setMobile] = useState(false);
  const [iframeSrc, setIframeSrc] = useState(url);

  useEffect(() => {
    const query_params = new URLSearchParams(parameters).toString();
    if (isEmpty(parameters)) {
      setIframeSrc(url);
    } else {
      setIframeSrc(url + '&' + query_params);
    }
  }, [url, parameters]);

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

  if (!url) return null;

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
          height={getHeight(data.height, screen)}
          useVisibilitySensor={data.useVisibilitySensor ?? true}
        >
          <iframe
            id="my-iframe"
            title={intl.formatMessage(messages.EmbededESRIMaps)}
            src={iframeSrc}
            className="google-map"
            frameBorder="0"
            allowFullScreen
            style={{ height: getHeight(data.height, screen) }}
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
          {data.with_share && <Share href={data['@id']} />}
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
        </div>
      </div>
    </div>
  );
}

export default compose(
  injectIntl,
  connect((state) => ({
    screen: state.screen,
  })),
)(EmbedMap);
