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
      description: 'Defined in template. Change only if necessary',
      widget: 'slate_richtext',
      className: 'slate-Widget',
      defaultValue: [
        {
          children: [
            {
              text: 'This map is hosted by a third party, Environmental Systems Research Institute. By showing the external content you accept the terms and conditions of ',
            },
            {
              type: 'a',
              url: 'https://www.esri.com',
              children: [
                {
                  text: 'esri.com',
                },
              ],
            },
            {
              text: '. This includes their cookie policies, which we have no control over.',
            },
          ],
        },
      ],
    },
    privacy_cookie_key: {
      title: 'Privacy cookie key',
      description: 'Use default for Esri maps, otherwise change',
      defaultValue: 'esri-maps',
    },
    enabled: {
      title: 'Data protection disclaimer enabled',
      description: 'Enable/disable the privacy protection',
      type: 'boolean',
    },
    background_image: {
      title: 'Background image',
      description:
        'The component will automatically generate a static image as placeholder from the URL of the map defined. This image is refreshed on page edit. To override this, upload an image here',
      widget: 'file',
    },
  },

  required: [],
});
