import React, { useState } from 'react';
import cookie from 'react-cookie';
// import getUrls from 'get-urls';
import { Button, Checkbox, Message } from 'semantic-ui-react';
import { settings } from '~/config';
import './../css/embed-styles.css';

const key = domain_key => `accept-${domain_key}`;

const getExpDays = () =>
  typeof settings.embedCookieExpirationDays !== 'undefined'
    ? settings.embedCookieExpirationDays
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

const PrivacyProtection = ({ children, data, block, ...props }) => {
  const defaultShow = canShow(data.privacy_cookie_key);
  const [show, setShow] = useState(defaultShow);
  const [remember, setRemember] = useState(defaultShow);

  return show ? (
    children
  ) : (
    <div className="privacy-protection" {...props}>
      <div className="wrapped">
        <Message>
          <div
            className="privacy-statement"
            dangerouslySetInnerHTML={{ __html: data.privacy_statement }}
          />
        </Message>

        <div class="privacy-button">
          <Button
            onClick={() => {
              setShow(true);
              if (remember) {
                saveCookie(data.privacy_cookie_key);
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
          {settings.ownDomain || '.eea.europa.eu'} that will expire in{' '}
          {getExpDays()} days.
        </p>
      </div>
    </div>
  );
};

export default PrivacyProtection;
