import { defineMessages } from 'react-intl';

const messages = defineMessages({
  Maps: {
    id: 'Maps',
    defaultMessage: 'Maps',
  },
  AltText: {
    id: 'Alt text',
    defaultMessage: 'Alt text',
  },
  MapsURL: {
    id: 'Maps URL',
    defaultMessage: 'Maps URL',
  },
  Alignment: {
    id: 'Alignment',
    defaultMessage: 'Alignment',
  },
  CSSHeight: {
    id: 'CSS height',
    defaultMessage: 'CSS height',
  },
  CSSMapHeightDescription: {
    id: 'Map height',
    defaultMessage: 'Map height',
  },
  useScreenHeight: {
    id: 'Use screen height',
    defaultMessage: 'Use screen height',
  },
  imagePreview: {
    id: 'Image preview',
    defaultMessage: 'Image preview',
  },
  imagePreviewDescription: {
    id: 'Image preview description',
    defaultMessage: 'Image preview used for print and PDF export.',
  },
});

export const MapsSchema = (props) => {
  return {
    title: props.intl.formatMessage(messages.Maps),
    block: 'Maps',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'url',
          'title',
          'align',
          'height',
          'useScreenHeight',
          'image_preview',
        ],
      },
    ],

    properties: {
      url: {
        title: props.intl.formatMessage(messages.MapsURL),
        widget: 'url',
      },
      title: {
        title: props.intl.formatMessage(messages.AltText),
      },
      align: {
        title: props.intl.formatMessage(messages.Alignment),
        widget: 'align',
      },
      height: {
        title: (
          <a
            rel="noreferrer"
            target="_blank"
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/height"
          >
            {props.intl.formatMessage(messages.CSSHeight)}
          </a>
        ),
        description: props.intl.formatMessage(messages.CSSMapHeightDescription),
      },
      useScreenHeight: {
        title: props.intl.formatMessage(messages.useScreenHeight),
        type: 'boolean',
        default: false,
      },
      image_preview: {
        title: props.intl.formatMessage(messages.imagePreview),
        description: props.intl.formatMessage(messages.imagePreviewDescription),
        widget: 'file',
      },
    },
    required: [],
  };
};
