import React, { useState } from 'react';
import cx from 'classnames';
import { isNumber } from 'lodash';
import { compose } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import {
  Placeholder,
  Dimmer,
  Loader,
  Button,
  Checkbox,
} from 'semantic-ui-react';
import { withCookies } from 'react-cookie';
import { serializeNodes } from '@plone/volto-slate/editor/render';
import { defineMessages, injectIntl } from 'react-intl';
import { toast } from 'react-toastify';
import config from '@plone/volto/registry';
import { getBaseUrl, toPublicURL, isInternalURL } from '@plone/volto/helpers';
import { Toast } from '@plone/volto/components';
import {
  getConnectedDataParametersForContext,
  getFilteredURL,
} from '@eeacms/volto-datablocks/helpers';
import { VisibilitySensor } from '@eeacms/volto-datablocks/components';

import { createImageUrl } from './helpers';
import { ProtectionSchema } from './schema';

import './styles.less';

const messages = defineMessages({
  success: {
    id: 'Success',
    defaultMessage: 'Success',
  },
  image: {
    id: 'Live image generated',
    defaultMessage: 'Live image generated',
  },
});

const key = (domain_key) => `accept-${domain_key}`;

const getExpDays = () =>
  typeof config.settings.embedCookieExpirationDays !== 'undefined'
    ? config.settings.embedCookieExpirationDays
    : 90;

function saveCookie(domain_key, cookies) {
  const date = new Date();
  date.setDate(date.getDate() + getExpDays());

  cookies.set(key(domain_key), 'true', {
    path: '/',
    expires: date,
  });
}

function canShow(domain_key, cookies) {
  return cookies.get(key(domain_key)) === 'true';
}

const cookieExist = (domain_key, cookies) => cookies.get(key(domain_key));

const CookieWatcher = (domain_key, cookies, pollingRate = 250) => {
  // state for cookie existence
  const [exist, setExist] = useState(cookieExist(domain_key, cookies));

  React.useEffect(() => {
    const interval = setInterval(
      () => setExist(cookieExist(domain_key, cookies)),
      pollingRate,
    );
    return () => clearInterval(interval);
  });

  return exist;
};

const PrivacyProtection = (props) => {
  const {
    className,
    children,
    data = {},
    id,
    editable,
    intl,
    path,
    cookies,
    useVisibilitySensor = true,
  } = props;
  const {
    enabled = false,
    privacy_statement,
    background_image: bgImg,
    privacy_cookie_key = 'esri-maps',
  } = data.dataprotection || {};

  const [image, setImage] = React.useState(null);
  const defaultShow = canShow(privacy_cookie_key, cookies);
  const [show, setShow] = useState(defaultShow);
  const [remember, setRemember] = useState(
    cookieExist(privacy_cookie_key, cookies) ? defaultShow : true,
  );
  const dispatch = useDispatch();
  const checkExistance = CookieWatcher(privacy_cookie_key, cookies);
  const connected_data_parameters = useSelector((state) => {
    return getConnectedDataParametersForContext(
      state?.connected_data_parameters,
      state.router?.location?.pathname,
    );
  });
  const mapUrl = data.url || data.vis_url;
  const url = getFilteredURL(mapUrl, connected_data_parameters);

  const height = React.useMemo(() => {
    if (!props.height) return 'auto';
    try {
      const height = parseInt(props.height);
      if (isNumber(height) && !isNaN(height)) return `${props.height}px`;
    } catch {}
    return 'auto';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.height]);

  React.useEffect(() => {
    if (bgImg) {
      setImage(createImageUrl(bgImg)); //create imageUrl from uploaded image
    }
  }, [bgImg]);

  //Effect hook for polling the cookie_key
  React.useEffect(
    () => {
      if (!editable && defaultShow) {
        setShow(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkExistance],
  );

  const urlToScreenshot = isInternalURL(url) ? toPublicURL(url) : url;

  //screenshot api
  React.useEffect(() => {
    if (enabled && !bgImg && !show && url) {
      fetch(
        `${getBaseUrl(
          '',
        )}/cors-proxy/https://screenshot.eea.europa.eu/api/v1/retrieve_image_for_url?url=${encodeURIComponent(
          urlToScreenshot,
        )}&w=1920&h=1000&waitfor=4000`,
      )
        .then((e) => e.blob())
        .then((blob) => {
          setImage(URL.createObjectURL(blob));
          if (editable) {
            toast.success(
              <Toast
                success
                title={intl.formatMessage(messages.success)}
                content={intl.formatMessage(messages.image)}
              />,
            );
          }
        })
        .catch(() => {
          if (__DEVELOPMENT__) {
            /* eslint-disable-next-line */
            console.log('Please enable your VPN!');
          }
        });
    }
  }, [
    enabled,
    url,
    path,
    dispatch,
    bgImg,
    show,
    intl,
    editable,
    urlToScreenshot,
  ]);

  return (
    <VisibilitySensor
      Placeholder={() => (
        <Placeholder style={{ height: '100%', width: '100%' }}>
          <Placeholder.Image rectangular />
        </Placeholder>
      )}
      useVisibilitySensor={useVisibilitySensor}
    >
      <div
        className={cx('privacy-protection-wrapper', className)}
        style={{
          position: 'relative',
          overflow: 'hidden',
          height,
          minHeight: height !== 'auto' ? height : '200px',
        }}
      >
        {!enabled || show ? (
          children
        ) : !__DEVELOPMENT__ && !image && !process.env.JEST_WORKER_ID ? (
          <Dimmer active>
            <Loader />
          </Dimmer>
        ) : (
          <div
            className="privacy-protection"
            style={
              image
                ? {
                    backgroundImage: `url(${image})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center -70px',
                  }
                : {}
            }
          >
            <div className="overlay">
              <div className="wrapped">
                <div className="privacy-button">
                  <Button
                    primary
                    onClick={() => {
                      setShow(true);
                      if (remember) {
                        saveCookie(privacy_cookie_key, cookies);
                      }
                    }}
                  >
                    Show external content
                  </Button>
                </div>

                {!editable && (
                  <div className="privacy-toggle">
                    <Checkbox
                      toggle
                      label="Remember my choice"
                      id={`remember-choice-${id}`}
                      onChange={(ev, { checked }) => {
                        setRemember(checked);
                      }}
                      checked={remember}
                    />
                  </div>
                )}

                <p className="discreet">
                  Your choice will be saved in a cookie managed by{' '}
                  {config.settings.ownDomain || '.eea.europa.eu'} that will
                  expire in {getExpDays()} days.
                </p>
                <p className="discreet">
                  {serializeNodes(
                    privacy_statement ||
                      ProtectionSchema(intl).properties.privacy_statement
                        .defaultValue,
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </VisibilitySensor>
  );
};

export default compose(injectIntl, withCookies)(PrivacyProtection);
