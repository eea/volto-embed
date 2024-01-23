import React, { useMemo, useState } from 'react';
import { useIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Icon } from '@plone/volto/components';
import { Button, Modal, Grid, Label, Input, Message } from 'semantic-ui-react';
import { map } from 'lodash';
import { FormFieldWrapper, InlineForm } from '@plone/volto/components';
import { addPrivacyProtectionToSchema } from '@eeacms/volto-embed';
import EmbedMap from '@eeacms/volto-embed/EmbedMap/EmbedMap';
import { MapsSchema } from '@eeacms/volto-embed/Blocks/Maps/schema';

import clearSVG from '@plone/volto/icons/clear.svg';
import aheadSVG from '@plone/volto/icons/ahead.svg';
import mapsBlockSVG from '@plone/volto/components/manage/Blocks/Maps/block-maps.svg';

const messages = defineMessages({
  MapsBlockInputPlaceholder: {
    id: 'Enter map Embed Code',
    defaultMessage: 'Enter map Embed Code',
  },
});

function MapEditorModal({ id, onClose, onChange, ...rest }) {
  const intl = useIntl();
  const [value, setValue] = useState(rest.value || {});
  const [url, setUrl] = useState(rest.value?.url || '');
  const [error, setError] = useState(false);

  const schema = useMemo(
    () => addPrivacyProtectionToSchema(MapsSchema({ intl })),
    [intl],
  );

  const placeholder = useMemo(
    () =>
      value.placeholder ||
      intl.formatMessage(messages.MapsBlockInputPlaceholder),
    [value.placeholder, intl],
  );

  function getSrc(embed) {
    if (!embed || embed.trim() === 0) {
      setError(true);
      return '';
    }
    // Optimization, don't need the src
    if (!embed.trim().startsWith('<iframe')) {
      return embed;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(embed, 'text/html');
    const iframe = doc.getElementsByTagName('iframe');
    if (iframe.length === 0) {
      setError(true);
      return '';
    }
    setError(false);
    return iframe[0].src;
  }

  function onChangeUrl({ target }) {
    setUrl(target.value);
  }

  function onKeyDownVariantMenuForm(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      onSubmitUrl();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      // TODO: Do something on ESC key
    }
  }

  function onSubmitUrl() {
    setValue({
      ...value,
      url: getSrc(url),
    });
  }

  return (
    <Modal open={true} size="fullscreen" className="chart-editor-modal">
      <Modal.Content scrolling>
        <div className="block maps align center">
          {value.url && (
            <Grid>
              <Grid.Column
                mobile={4}
                tablet={4}
                computer={4}
                className="tableau-editor-column"
              >
                <InlineForm
                  schema={schema}
                  onChangeField={(id, fieldValue) => {
                    if (id === 'url' && fieldValue !== url) {
                      setUrl(fieldValue);
                    }
                    setValue((value) => ({
                      ...value,
                      [id]: fieldValue,
                    }));
                  }}
                  formData={value}
                />
              </Grid.Column>
              <Grid.Column
                mobile={8}
                tablet={8}
                computer={8}
                className="tableau-visualization-column"
              >
                <EmbedMap data={value} id={id} />
              </Grid.Column>
            </Grid>
          )}
          {!value.url && (
            <Message>
              <center>
                <img src={mapsBlockSVG} alt="" />
                <div className="toolbar-inner">
                  <Input
                    onKeyDown={onKeyDownVariantMenuForm}
                    onChange={onChangeUrl}
                    placeholder={placeholder}
                    value={url}
                    // Prevents propagation to the Dropzone and the opening
                    // of the upload browser dialog
                    onClick={(e) => e.stopPropagation()}
                  />
                  {url && (
                    <Button.Group>
                      <Button
                        basic
                        className="cancel"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUrl('');
                        }}
                      >
                        <Icon name={clearSVG} size="30px" />
                      </Button>
                    </Button.Group>
                  )}
                  <Button.Group>
                    <Button
                      basic
                      primary
                      onClick={(e) => {
                        e.stopPropagation();
                        onSubmitUrl();
                      }}
                    >
                      <Icon name={aheadSVG} size="30px" />
                    </Button>
                  </Button.Group>
                </div>
                <div className="message-text">
                  <FormattedMessage
                    id="Please enter the embed code or URL for the ESRI webmap."
                    defaultMessage="Please enter the embed code or URL for the ESRI webmap."
                  />
                  {error && (
                    <div style={{ color: 'red' }}>
                      <FormattedMessage
                        id="Embed code error, please follow the instructions and try again."
                        defaultMessage="Embed code error, please follow the instructions and try again."
                      />
                    </div>
                  )}
                </div>
              </center>
            </Message>
          )}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button primary floated="right" onClick={() => onChange(value)}>
          Apply changes
        </Button>
        <Button floated="right" onClick={onClose}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default function MapsWidget(props) {
  const { id, title, description, error, value } = props;
  const [mapEditor, setMapEditor] = useState(false);

  function onChange(value) {
    props.onChange(props.id, value);
    setMapEditor(false);
  }

  return (
    <FormFieldWrapper {...props} columns={1}>
      <div className="wrapper">
        <label htmlFor={`field-${id}`}>{title}</label>
        <Button
          floated="right"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMapEditor(true);
          }}
        >
          Open Map Editor
        </Button>
      </div>
      {description && <p className="help">{description}</p>}
      {value?.url && <EmbedMap {...props} data={value} />}
      {mapEditor && (
        <MapEditorModal
          id={id}
          value={value || {}}
          onChange={onChange}
          onClose={() => setMapEditor(false)}
        />
      )}
      {map(error, (message) => (
        <Label key={message} basic color="red" pointing>
          {message}
        </Label>
      ))}
    </FormFieldWrapper>
  );
}
