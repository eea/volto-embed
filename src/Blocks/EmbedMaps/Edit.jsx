import React from 'react';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import { SidebarPortal } from '@plone/volto/components';
import View from './View';
import getSchema from './schema';

const Edit = (props) => {
  const { block, data, selected, onChangeBlock } = props;
  const schema = React.useMemo(() => getSchema(props), [props]);

  return (
    <React.Fragment>
      <View {...props} mode="edit" />
      <SidebarPortal selected={selected}>
        <BlockDataForm
          block={block}
          schema={schema}
          title={schema.title}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          onChangeBlock={onChangeBlock}
          formData={data}
        />
      </SidebarPortal>
    </React.Fragment>
  );
};

export default compose(injectIntl)(Edit);
