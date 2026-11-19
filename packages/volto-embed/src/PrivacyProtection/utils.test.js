import { addPrivacyProtectionToSchema } from './utils';

describe('addPrivacyProtectionToSchema', () => {
  const intl = {
    formatMessage: vi.fn((message) => message.defaultMessage),
  };

  it('appends the dataprotection fieldset and property to the schema', () => {
    const schema = {
      fieldsets: [{ id: 'default', title: 'Default', fields: ['url'] }],
      properties: { url: { title: 'URL' } },
    };

    const result = addPrivacyProtectionToSchema(schema, intl);

    expect(result.fieldsets).toHaveLength(2);
    expect(result.fieldsets[1]).toEqual({
      fields: ['dataprotection'],
      title: 'Data Protection',
    });
    expect(result.properties.url).toEqual({ title: 'URL' });
    expect(result.properties.dataprotection.widget).toBe('object');
    expect(result.properties.dataprotection.schema.properties).toHaveProperty(
      'enabled',
    );
  });
});
