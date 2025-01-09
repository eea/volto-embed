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
  defaultLabel: {
    id: 'mapDefaultLabel',
    defaultMessage: 'Default',
  },
  valueLabel: {
    id: 'mapValueLabel',
    defaultMessage: 'Value',
  },
  embedInteractiveMap: {
    id: 'embedInteractiveMap',
    defaultMessage: 'Embed interactive Map',
  },
  toolbar: {
    id: 'toolbar',
    defaultMessage: 'Toolbar',
  },
  mapUrl: {
    id: 'mapUrl',
    defaultMessage: 'Map url',
  },
  cssHeight: {
    id: 'cssHeight',
    defaultMessage: 'CSS Height',
  },
  cssMapHeightDescription: {
    id: 'cssMapHeightDescription',
    defaultMessage: 'Set the height of the map component using CSS height values.',
  },
  showNote: {
    id: 'showNote',
    defaultMessage: 'Show note',
  },
  showSources: {
    id: 'showSources',
    defaultMessage: 'Show sources',
  },
  showSourcesDescription: {
    id: 'showSourcesDescription',
    defaultMessage: 'Will show sources set in this page Data provenance',
  },
  showMoreInfo: {
    id: 'showMoreInfo',
    defaultMessage: 'Show more info',
  },
  showEnlargeButton: {
    id: 'showEnlargeButton',
    defaultMessage: 'Show enlarge button',
  },
  showShareButton: {
    id: 'showShareButton',
    defaultMessage: 'Show share button',
  },
  parametersTitle: {
    id: 'parametersTitle',
    defaultMessage: 'Parameters',
  },
  parametersDescription: {
    id: 'parametersDescription',
    defaultMessage: 'Set a list of parameters.',
  },
});

const parameters = (intl) => ({
  title: 'Parameter',
  fieldsets: [{ id: 'default', title: intl.formatMessage(messages.defaultLabel), fields: ['field', 'value'] }],
  properties: {
    field: {
      title: 'Name',
      type: 'text',
    },
    value: {
      title: intl.formatMessage(messages.valueLabel),
      type: 'text',
    },
  },
  required: [],
});

const getSchema = (props) => {
  return {
    title: props.intl.formatMessage(messages.embedInteractiveMap),
    fieldsets: [
      {
        id: 'default',
        title: props.intl.formatMessage(messages.defaultLabel),
        fields: ['url', 'height'],
      },
      {
        id: 'toolbar',
        title: props.intl.formatMessage(messages.toolbar),
        fields: ['with_notes', 'with_more_info', 'with_share', 'with_enlarge'],
      },
      {
        id: 'parameters',
        title: props.intl.formatMessage(messages.parametersTitle),
        fields: ['parameters'],
      },
    ],
    properties: {
      url: {
        title: props.intl.formatMessage(messages.mapUrl),
        widget: 'internal_url',
      },
      height: {
        title: (
          <a
            rel="noreferrer"
            target="_blank"
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/height"
          >
            {props.intl.formatMessage(messages.cssHeight)}
          </a>
        ),
        description: props.intl.formatMessage(messages.cssMapHeightDescription),
      },
      with_notes: {
        title: props.intl.formatMessage(messages.showNote),
        type: 'boolean',
        defaultValue: true,
      },
      with_sources: {
        title: props.intl.formatMessage(messages.showSources),
        description: props.intl.formatMessage(messages.showSourcesDescription),
        type: 'boolean',
        defaultValue: true,
      },
      with_more_info: {
        title: props.intl.formatMessage(messages.showMoreInfo),
        type: 'boolean',
        defaultValue: true,
      },
      with_enlarge: {
        title: props.intl.formatMessage(messages.showEnlargeButton),
        type: 'boolean',
        defaultValue: true,
      },
      with_share: {
        title: props.intl.formatMessage(messages.showShareButton),
        type: 'boolean',
        defaultValue: true,
      },
      parameters: {
        title: props.intl.formatMessage(messages.parametersTitle),
        widget: 'object_list',
        schema: parameters(props.intl),
        description: props.intl.formatMessage(messages.parametersDescription),
      },
    },

    required: [],
  };
};

export default getSchema;
