import { defineMessages } from 'react-intl';

const messages = defineMessages({
  dataProtection: {
    id: 'dataProtection',
    defaultMessage: 'Data Protection',
  },
  privacyStatement: {
    id: 'privacyStatement',
    defaultMessage: 'Privacy statement',
  },
  privacyStatementDescription: {
    id: 'privacyStatementDescription',
    defaultMessage: 'Defined in template. Change only if necessary',
  },
  privacyCookieKey: {
    id: 'privacyCookieKey',
    defaultMessage: 'Privacy cookie key',
  },
  privacyCookieKeyDescription: {
    id: 'privacyCookieKeyDescription',
    defaultMessage: 'Use default for Esri maps, otherwise change',
  },
  enabled: {
    id: 'enabled',
    defaultMessage: 'Data protection disclaimer enabled',
  },
  enabledDescription: {
    id: 'enabledDescription',
    defaultMessage: 'Enable/disable the privacy protection',
  },
  backgroundImage: {
    id: 'backgroundImage',
    defaultMessage: 'Background image',
  },
  backgroundImageDescription: {
    id: 'backgroundImageDescription',
    defaultMessage:
      'The component will automatically generate a static image as placeholder from the URL of the map defined. This image is refreshed on page edit. To override this, upload an image here',
  },
  privacyStatementPart1: {
    id: 'privacyStatementPart1',
    defaultMessage:
      'This map is hosted by a third party, Environmental Systems Research Institute. By showing the external content you accept the terms and conditions of ',
  },
  privacyStatementLink: {
    id: 'privacyStatementLink',
    defaultMessage: 'esri.com',
  },
  privacyStatementPart2: {
    id: 'privacyStatementPart2',
    defaultMessage:
      '. This includes their cookie policies, which we have no control over.',
  },
});

export const ProtectionSchema = (intl) => ({
  title: intl.formatMessage(messages.dataProtection),

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [
        'privacy_statement',
        'privacy_cookie_key',
        'enabled',
        'background_image',
      ],
    },
  ],

  properties: {
    privacy_statement: {
      title: intl.formatMessage(messages.privacyStatement),
      description: intl.formatMessage(messages.privacyStatementDescription),
      widget: 'slate_richtext',
      className: 'slate-Widget',
      defaultValue: [
        {
          children: [
            {
              text: intl.formatMessage(messages.privacyStatementPart1),
            },
            {
              type: 'a',
              url: 'https://www.esri.com',
              children: [
                {
                  text: intl.formatMessage(messages.privacyStatementLink),
                },
              ],
            },
            {
              text: intl.formatMessage(messages.privacyStatementPart2),
            },
          ],
        },
      ],
    },
    privacy_cookie_key: {
      title: intl.formatMessage(messages.privacyCookieKey),
      description: intl.formatMessage(messages.privacyCookieKeyDescription),
      defaultValue: 'esri-maps',
    },
    enabled: {
      title: intl.formatMessage(messages.enabled),
      description: intl.formatMessage(messages.enabledDescription),
      type: 'boolean',
    },
    background_image: {
      title: intl.formatMessage(messages.backgroundImage),
      description: intl.formatMessage(messages.backgroundImageDescription),
      widget: 'file',
    },
  },

  required: [],
});
