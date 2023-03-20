const schema = {
  title: 'Embed external content',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['url', 'align', 'height'],
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
    height: {
      title: (
        <a
          rel="noreferrer"
          target="_blank"
          href="https://developer.mozilla.org/en-US/docs/Web/CSS/height"
        >
          CSS height
        </a>
      ),
      default: '45vh',
      description: 'Iframe height',
    },
  },

  required: ['url'],
};

export default schema;
