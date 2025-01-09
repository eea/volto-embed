import { ProtectionSchema } from './schema';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
  dataProtection: {
    id: 'dataProtection',
    defaultMessage: 'Data Protection',
  }
})

export const addPrivacyProtectionToSchema = (schema, intl) => {
  return {
    ...schema,
    fieldsets: [
      ...schema.fieldsets,
      {
        fields: ['dataprotection'],
        title: intl.formatMessage(messages.dataProtection),
      },
    ],
    properties: {
      ...schema.properties,
      dataprotection: {
        widget: 'object',
        schema: ProtectionSchema(intl),
      },
    },
  };
};
