import React from 'react';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import { SidebarPortal } from '@plone/volto/components';
import View from './View';
import getSchema from './schema';

const Edit = (props) => {
  const schema = React.useMemo(() => getSchema(props), [props]);

  return (
    <React.Fragment>
      <View {...props} mode="edit" />
      <SidebarPortal selected={props.selected}>
        <BlockDataForm
          block={props.block}
          schema={schema}
          title={schema.title}
          onChangeField={(id, value) => {
            props.onChangeBlock(props.block, {
              ...props.data,
              [id]: value,
            });
          }}
          formData={props.data}
        />
      </SidebarPortal>
    </React.Fragment>
  );
};

export default Edit;
