import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import VisibilitySensor from 'react-visibility-sensor';
import { Placeholder, Dimmer, Loader } from 'semantic-ui-react';
import cookie from 'react-cookie';

//import { find, without } from 'lodash';
import { serializeNodes } from 'volto-slate/editor/render';
import { Button, Checkbox } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import config from '@plone/volto/registry';
import { getBaseUrl } from '@plone/volto/helpers';
import { Toast } from '@plone/volto/components';
import { getConnectedDataParametersForContext } from '@eeacms/volto-datablocks/helpers';

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

function saveCookie(domain_key) {
  const date = new Date();
  date.setDate(date.getDate() + getExpDays());

  cookie.save(key(domain_key), 'true', {
    path: '/',
    expires: date,
  });
}

function canShow(domain_key) {
  return cookie.load(key(domain_key)) === 'true';
}

const cookieExist = (domain_key) => cookie.load(key(domain_key));

const CookieWatcher = (cookie, pollingRate = 250) => {
  // state for cookie existence
  const [exist, setExist] = useState(cookieExist(cookie));

  React.useEffect(() => {
    const interval = setInterval(
      () => setExist(cookieExist(cookie)),
      pollingRate,
    );
    return () => clearInterval(interval);
  });

  return exist;
};

const getFilteredURL = (url, connected_data_parameters = []) => {
  if (!connected_data_parameters?.length) return url;
  let decodedURL = decodeURIComponent(url);
  const queries = decodedURL.match(/(?<=(<<))(.*?)(?=(>>))/g);
  if (!queries?.length) return url;
  const keys = connected_data_parameters.map((param) => param.i);
  for (let poz in queries) {
    const key = queries[poz];
    const paramPoz = keys.indexOf(key);
    if (paramPoz > -1) {
      decodedURL = decodedURL.replace(
        `<<${key}>>`,
        connected_data_parameters[paramPoz].v[0],
      );

      continue;
    }
  }
  return decodedURL;
};

export default injectIntl(
  ({
    children,
    data = {},
    id,
    isEditMode,
    onChangeBlock,
    intl,
    path,
    properties,
    ...rest
  }) => {
    const { dataprotection = {}, height } = data;
    const { background_image: bgImg, enabled = false } = dataprotection;
    const [image, setImage] = React.useState(null);
    const [visible, setVisibility] = useState(false);
    const defaultShow = canShow(dataprotection.privacy_cookie_key);
    const [show, setShow] = useState(defaultShow);
    const [remember, setRemember] = useState(
      cookieExist(dataprotection.privacy_cookie_key) ? defaultShow : true,
    );
    const dispatch = useDispatch();
    const checkExistance = CookieWatcher(dataprotection.privacy_cookie_key);
    const connected_data_parameters = useSelector((state) => {
      return getConnectedDataParametersForContext(
        state?.connected_data_parameters,
        state.router?.location?.pathname,
      );
    });

    const url = getFilteredURL(data.url, connected_data_parameters);

    const styles = {
      minHeight: `${height || 200}px`,
      position: 'relative',
    };
    React.useEffect(() => {
      if (bgImg) {
        setImage(createImageUrl(bgImg)); //create imageUrl from uploaded image
      }
    }, [bgImg]);

    //Effect hook for polling the cookie_key
    React.useEffect(
      () => {
        if (!isEditMode && defaultShow) {
          setShow(true);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [checkExistance],
    );

    //screenshot api
    React.useEffect(() => {
      if (enabled && !bgImg && !show) {
        fetch(
          `${getBaseUrl(
            '',
          )}/cors-proxy/https://screenshot.eea.europa.eu/api/v1/retrieve_image_for_url?url=${encodeURIComponent(
            url,
          )}&w=1920&waitfor=4000`,
        )
          .then((e) => e.blob())
          .then((blob) => {
            setImage(URL.createObjectURL(blob));
            if (isEditMode) {
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
    }, [enabled, url, path, dispatch, bgImg, show, intl, isEditMode]);

    return (
      <VisibilitySensor
        onChange={(isVisible) => {
          !visible && isVisible && setVisibility(true);
        }}
        partialVisibility={true}
        offset={{ bottom: 200 }}
      >
        {visible ? (
          <div className="privacy-protection-wrapper" style={styles}>
            {!dataprotection.enabled || show ? (
              children
            ) : !__DEVELOPMENT__ && !image ? (
              <Dimmer active>
                <Loader />
              </Dimmer>
            ) : (
              <div
                className="privacy-protection"
                {...rest}
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
                            saveCookie(dataprotection.privacy_cookie_key);
                          }
                        }}
                      >
                        Show external content
                      </Button>
                    </div>

                    {!isEditMode && (
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
                        dataprotection.privacy_statement ||
                          ProtectionSchema().properties.privacy_statement
                            .defaultValue,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Placeholder style={{ height: '100%', width: '100%' }}>
            <Placeholder.Image rectangular />
          </Placeholder>
        )}
      </VisibilitySensor>
    );
  },
);
