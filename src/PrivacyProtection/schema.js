export const ProtectionSchema = () => ({
  title: 'Data Protection',

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
      title: 'Privacy statement',
      description: 'Short notification text',
      widget: 'slate_richtext',
      className: 'slate-Widget',
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
    background_image: {
      title: 'Background image',
      description:
        'Set a placeholder image. This will override the existing one',
      widget: 'file',
    },
  },

  required: [],
});
