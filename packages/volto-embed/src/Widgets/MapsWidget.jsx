import { useEffect, useMemo, useRef, useState } from 'react';
import { useIntl, FormattedMessage, defineMessages } from 'react-intl';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import Image from '@plone/volto/components/theme/Image/Image';
import { Button, Modal, Grid, Label, Input, Message } from 'semantic-ui-react';
import map from 'lodash/map';
import omit from 'lodash/omit';
import FormFieldWrapper from '@plone/volto/components/manage/Widgets/FormFieldWrapper';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { addPrivacyProtectionToSchema } from '@eeacms/volto-embed';
import EmbedMap from '@eeacms/volto-embed/EmbedMap/EmbedMap';
import { MapsSchema } from '@eeacms/volto-embed/Blocks/Maps/schema';
import { getPortalItem, renderMapPreview } from './mapPreview';

import clearSVG from '@plone/volto/icons/clear.svg';
import aheadSVG from '@plone/volto/icons/ahead.svg';
import mapsBlockSVG from '@plone/volto/components/manage/Blocks/Maps/block-maps.svg';
import './style.less';

const messages = defineMessages({
  MapsBlockInputPlaceholder: {
    id: 'Enter map Embed Code',
    defaultMessage: 'Enter map Embed Code',
  },
  previewLoading: {
    id: 'Generating the preview image…',
    defaultMessage: 'Generating the preview image…',
  },
  previewDone: {
    id: 'Preview image generated. It will be saved unless a preview image was uploaded.',
    defaultMessage:
      'Preview image generated. It will be saved unless a preview image was uploaded.',
  },
  previewError: {
    id: 'The preview image could not be generated. You can upload one in the Preview image field.',
    defaultMessage:
      'The preview image could not be generated. You can upload one in the Preview image field.',
  },
});

function MapEditorModal({ id, onClose, onChange, ...rest }) {
  const intl = useIntl();
  const [value, setValue] = useState(rest.value || {});
  const [url, setUrl] = useState(rest.value?.url || '');
  const [error, setError] = useState(false);

  const schema = useMemo(
    () => addPrivacyProtectionToSchema(MapsSchema({ intl }), intl),
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
    <Modal open={true} className="editor-modal" size="fullscreen">
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
                <Image src={mapsBlockSVG} alt="" loading="lazy" />
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

// A render normally takes 10-20s; give up rather than spin on a hung server
const PREVIEW_TIMEOUT = 60000;

// Renders a preview of the map whenever its URL changes. The preview_image
// middleware stores it as the content's preview image on save.
function useMapPreview(id, value, onChange) {
  const intl = useIntl();
  const savedUrl = useRef(value?.url);
  const latestValue = useRef(value);
  const [status, setStatus] = useState(null);
  latestValue.current = value;
  const url = value?.url;

  useEffect(() => {
    if (!url || url === savedUrl.current || !getPortalItem(url)) {
      setStatus(null);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(new Error('Preview timed out')),
      PREVIEW_TIMEOUT,
    );
    setStatus('previewLoading');
    renderMapPreview(url, { signal: controller.signal })
      .then((preview) => {
        if (!preview) return setStatus(null);
        onChange(id, { ...latestValue.current, preview });
        setStatus('previewDone');
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setStatus('previewError');
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return status && intl.formatMessage(messages[status]);
}

export default function MapsWidget(props) {
  const { id, title, description, error, value, onChange } = props;
  const [mapEditor, setMapEditor] = useState(false);
  const previewStatus = useMapPreview(id, value, onChange);

  function onChangeMap(newValue) {
    // A preview of the previous map no longer applies
    onChange(
      id,
      newValue.url === value?.url ? newValue : omit(newValue, ['preview']),
    );
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
      {previewStatus && <p className="help">{previewStatus}</p>}
      {value?.url && <EmbedMap {...props} data={value} />}
      {mapEditor && (
        <MapEditorModal
          id={id}
          value={value || {}}
          onChange={onChangeMap}
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
