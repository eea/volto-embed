import config from '@plone/volto/registry';

export const ProtectionSchema = () => ({
  title: 'Data Protection',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['privacy_statement', 'privacy_cookie_key', 'enabled'],
    },
  ],

  properties: {
    privacy_statement: {
      title: 'Privacy statement',
      description: 'Short notification text',
      widget: config.settings.defaultBlockType, // TODO: is it really applied?
    },
    privacy_cookie_key: {
      title: 'Privacy cookie key',
      description: 'Identifies similar external content',
    },
    enabled: {
      title: 'Use privacy screen?',
      description: 'Enable/disable the privacy protection',
      type: 'boolean',
    },
  },

  required: [],
});
