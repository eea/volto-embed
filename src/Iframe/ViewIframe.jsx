/**
 * View map block.
 * @module components/manage/Blocks/Maps/View
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { PrivacyProtection } from '../PrivacyProtection';

const messages = defineMessages({
  EmbededGoogleMaps: {
    id: 'Embeded Google Maps',
    defaultMessage: 'Embeded Google Maps',
  },
});

/**
 * View image block class.
 * @class View
 * @extends Component
 */

const View = ({ data, intl, id }) => {
  return (
    <div
      className={cx(
        'block maps align',
        {
          center: !Boolean(data.align),
        },
        data.align,
      )}
      style={
        data.align === 'full' ? { position: 'static', height: data.height } : {}
      }
    >
      <div
        className={cx({
          'full-width-block': data.align === 'full',
        })}
        style={{ height: '100%' }}
      >
        <PrivacyProtection data={data} id={id}>
          <iframe
            title={intl.formatMessage(messages.EmbededGoogleMaps)}
            src={data.url}
            className="google-map"
            frameBorder="0"
            allowFullScreen
            style={{ height: data.height }}
          />
        </PrivacyProtection>
      </div>
    </div>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default injectIntl(View);
