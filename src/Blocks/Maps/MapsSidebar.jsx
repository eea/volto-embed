import React from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { Icon, BlockDataForm } from '@plone/volto/components';
import globeSVG from '@plone/volto/icons/globe.svg';
import { Segment } from 'semantic-ui-react';
import { addPrivacyProtectionToSchema } from '@eeacms/volto-embed';
import { MapsSchema } from './schema';

const messages = defineMessages({
  Maps: {
    id: 'Maps',
    defaultMessage: 'Maps',
  },
  NoMaps: {
    id: 'No map selected',
    defaultMessage: 'No map selected',
  },
});

const MapsSidebar = (props) => {
  const { data, block, onChangeBlock } = props;
  const intl = useIntl();
  const schema = addPrivacyProtectionToSchema(
    MapsSchema({ ...props, intl }),
    intl,
  );

  return (
    <>
      {!data.url ? (
        <Segment className="sidebar-metadata-container" secondary>
          {props.intl.formatMessage(messages.NoMaps)}
          <Icon name={globeSVG} size="100px" color="#b8c6c8" />
        </Segment>
      ) : (
        <BlockDataForm
          schema={schema}
          title={intl.formatMessage(messages.Maps)}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          onChangeBlock={onChangeBlock}
          formData={data}
          block={block}
        />
      )}
    </>
  );
};

export default MapsSidebar;
