const IframeSchema = {
  title: 'Embed external content',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['url', 'align', 'privacy_statement', 'privacy_cookie_key'],
    },
  ],

  properties: {
    url: {
      title: 'Embed URL',
    },
    align: {
      title: 'Alignment',
      widget: 'align',
      type: 'string',
    },
    privacy_statement: {
      title: 'Privacy statement',
      description: 'Short notification text',
      widget: 'cktext',
    },
    privacy_cookie_key: {
      title: 'Privacy cookie key',
      description: 'Identifies similar external content',
    },
  },

  required: ['url', 'privacy_statement', 'privacy_cookie_key'],
};

export default IframeSchema;
