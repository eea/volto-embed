import { ProtectionSchema } from './schema';

export const addPrivacyProtectionToSchema = (schema) => {
  const [firstFieldset, ...rest] = schema.fieldsets;
  return {
    ...schema,
    fieldsets: [
      { ...firstFieldset, fields: [...firstFieldset.fields, 'dataprotection'] },
      ...rest,
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
