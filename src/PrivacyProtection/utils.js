import { ProtectionSchema } from './schema';

export const addPrivacyProtectionToSchema = (schema) => {
  return {
    ...schema,
    fieldsets: [
      ...schema.fieldsets,
      {
        fields: ['dataprotection'],
        title: 'Data Protection'
      },
    ],
    properties: {
      ...schema.properties,
      dataprotection: {
        widget: 'object',
        schema: ProtectionSchema(),
      },
    },
  };
};
