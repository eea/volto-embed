import React, { useEffect, useState, useRef } from 'react';
import isNaN from 'lodash/isNaN';
import isNumber from 'lodash/isNumber';
import isEmpty from 'lodash/isEmpty';
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

function getHeight(data, screen) {
  const { height, useScreenHeight } = data;
  const asNumber = isNumber(Number(height)) && !isNaN(Number(height));
  if (asNumber) {
    return `${height}px`;
  }
  return (
    height ||
    (useScreenHeight && screen?.page?.height ? screen.page.height - 50 : 400)
  );
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
    const updateMobileLayout = () => {
      if (!el.current) return;

      const visWidth = el.current.offsetWidth;

      if (!visWidth) {
        return;
      }

      setMobile((isMobile) => {
        if (visWidth < 600 && !isMobile) {
          return true;
        }
        if (visWidth >= 600 && isMobile) {
          return false;
        }
        return isMobile;
      });
    };

    updateMobileLayout();

    if (typeof ResizeObserver === 'undefined' || !el.current) {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(updateMobileLayout);
    resizeObserver.observe(el.current);

    return () => resizeObserver.disconnect();
  }, [screen]);

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
          height={getHeight(data, screen)}
          useVisibilitySensor={data.useVisibilitySensor ?? true}
        >
          <iframe
            title={intl.formatMessage(messages.EmbededESRIMaps)}
            src={iframeSrc}
            className="google-map"
            frameBorder="0"
            allowFullScreen
            style={{ height: getHeight(data, screen) }}
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
