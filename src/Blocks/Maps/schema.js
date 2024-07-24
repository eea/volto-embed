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
});

export const MapsSchema = (props) => {
  return {
    title: props.intl.formatMessage(messages.Maps),
    block: 'Maps',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['url', 'title', 'align', 'height', 'useScreenHeight'],
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
        title: 'Use screen height',
        type: 'boolean',
        default: false,
      },
    },
    required: [],
  };
};
