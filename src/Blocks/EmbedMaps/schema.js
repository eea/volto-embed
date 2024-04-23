import { defineMessages } from 'react-intl';

const messages = defineMessages({
  CSSHeight: {
    id: 'CSS height',
    defaultMessage: 'CSS height',
  },
  CSSMapHeightDescription: {
    id: 'Map height',
    defaultMessage: 'Map height',
  },
});

const parameters = {
  title: 'Parameter',
  fieldsets: [{ id: 'default', title: 'Default', fields: ['field', 'value'] }],
  properties: {
    field: {
      title: 'Name',
      type: 'text',
    },
    value: {
      title: 'Value',
      type: 'text',
    },
  },
  required: [],
};

const getSchema = (props) => {
  return {
    title: 'Embed interactive Map',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['url', 'height'],
      },
      {
        id: 'toolbar',
        title: 'Toolbar',
        fields: ['with_notes', 'with_more_info', 'with_share', 'with_enlarge'],
      },
      {
        id: 'parameters',
        title: 'Parameters',
        fields: ['parameters'],
      },
    ],
    properties: {
      url: {
        title: 'Map url',
        widget: 'internal_url',
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
      with_notes: {
        title: 'Show note',
        type: 'boolean',
        defaultValue: true,
      },
      with_sources: {
        title: 'Show sources',
        description: 'Will show sources set in this page Data provenance',
        type: 'boolean',
        defaultValue: true,
      },
      with_more_info: {
        title: 'Show more info',
        type: 'boolean',
        defaultValue: true,
      },
      with_enlarge: {
        title: 'Show enlarge button',
        type: 'boolean',
        defaultValue: true,
      },
      with_share: {
        title: 'Show share button',
        type: 'boolean',
        defaultValue: true,
      },
      parameters: {
        title: 'Parameters',
        widget: 'object_list',
        schema: parameters,
        description: 'Set a list of parameters.',
      },
    },

    required: [],
  };
};

export default getSchema;
