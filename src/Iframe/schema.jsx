const IframeSchema = {
  title: 'Embed external content',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['url', 'align'],
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
  },

  required: ['url'],
};

export default IframeSchema;
