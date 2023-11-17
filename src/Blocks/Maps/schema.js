import { defineMessages } from 'react-intl';

const messages = defineMessages({
  CSSHeight: {
    id: 'CSS height',
    defineMessages: 'CSS height',
  },
  CSSHeightDescription: {
    id: 'Iframe height',
    defineMessages: 'Iframe height',
  },
});

export const MapsSchema = (props) => {
  return {
    title: props.intl.messages['Maps'],
    block: 'Maps',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['url', 'title', 'align', 'height'],
      },
    ],

    properties: {
      url: {
        title: props.intl.messages['Maps URL'],
        widget: 'url',
      },
      title: {
        title: props.intl.messages['Alt text'],
      },
      align: {
        title: props.intl.messages['Alignment'],
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
        description: props.intl.formatMessage(messages.CSSHeightDescription),
      },
    },
    required: [],
  };
};
