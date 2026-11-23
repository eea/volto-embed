/**
 * View map block.
 * @module components/manage/Blocks/Maps/View
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withBlockExtensions } from '@plone/volto/helpers//Extensions';
import PrivacyProtection from '@eeacms/volto-embed/PrivacyProtection/PrivacyProtection';
import PreviewImage from '@eeacms/volto-embed/EmbedMap/PreviewImage';

const messages = defineMessages({
  EmbededESRIMaps: {
    id: 'Embeded ESRI Maps',
    defaultMessage: 'Embeded ESRI Maps',
  },
});

/**
 * View image block class.
 * @class View
 * @extends Component
 */

export const View = ({ data, intl, id, isPrint }) => {
  return (
    <div
      className={cx(
        'block maps align',
        {
          center: !data.align,
        },
        data.align,
      )}
    >
      <div
        className={cx('maps-inner', {
          'full-width': data.align === 'full',
        })}
      >
        {isPrint && data.image_preview ? (
          <PreviewImage
            image={data.image_preview}
            alt={data.title || intl.formatMessage(messages.EmbededESRIMaps)}
          />
        ) : (
          <PrivacyProtection
            data={data}
            id={id}
            useVisibilitySensor={
              isPrint ? false : data.useVisibilitySensor ?? true
            }
          >
            <iframe
              title={intl.formatMessage(messages.EmbededESRIMaps)}
              src={data.url}
              className="google-map"
              frameBorder="0"
              allowFullScreen
              style={data.height ? { height: data.height } : {}}
            />
          </PrivacyProtection>
        )}
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

export default compose(
  injectIntl,
  withBlockExtensions,
  connect((state) => ({
    isPrint: state.print?.isPrint || false,
  })),
)(View);
