import React, { useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { Placeholder } from 'semantic-ui-react';
import cookie from 'react-cookie';
import { Button, Checkbox } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import '../css/embed-styles.css';
import { createImageUrl } from './helpers';

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

export default ({ children, data = {}, block, ...rest }) => {
  const { dataprotection = {} } = data;
  const { background_image: bgImg } = dataprotection;
  const [image, setImage] = React.useState(null);

  React.useEffect(() => {
    if (bgImg) {
      setImage(createImageUrl(bgImg));
    }
  }, [bgImg]);

  const [visible, setVisibility] = useState(false);
  const defaultShow = canShow(dataprotection.privacy_cookie_key);
  const [show, setShow] = useState(defaultShow);
  const [remember, setRemember] = useState(defaultShow);

  return (
    <VisibilitySensor
      onChange={(isVisible) => {
        !visible && isVisible && setVisibility(true);
      }}
      partialVisibility={true}
      offset={{ bottom: 200 }}
    >
      {visible ? (
        <div>
          {!dataprotection.enabled || show ? (
            children
          ) : (
            <div
              className="privacy-protection"
              {...rest}
              style={
                bgImg
                  ? {
                      backgroundImage: `url(${image})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }
                  : {}
              }
            >
              <div className="overlay">
                <div className="wrapped">
                  <div
                    className="privacy-statement"
                    dangerouslySetInnerHTML={{
                      __html: dataprotection.privacy_statement,
                    }}
                  />
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

                  <div className="privacy-toggle">
                    <Checkbox
                      toggle
                      label="Remember my choice"
                      id={`remember-choice-${block}`}
                      onChange={(ev, { checked }) => {
                        setRemember(checked);
                      }}
                      checked={remember}
                    />
                  </div>

                  <p className="discreet">
                    Your choice will be saved in a cookie managed by{' '}
                    {config.settings.ownDomain || '.eea.europa.eu'} that will
                    expire in {getExpDays()} days.
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
};
