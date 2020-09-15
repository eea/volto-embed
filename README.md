# volto-embed

GDPR-compliant external resource embedding components for Volto.

Right now it does several things:

- it replaces the Map default block with a variant that's data-protected
- it provides a component `<PrivacyProtection>` which can be used to wrap other
  components that wrap sensitive content
- it provides a function `addPrivacyProtectionToSchema` which adds the fields
  that are required to configure the "data protection" for any component
  wrapped in `<PrivacyProtection>`.

See `src/Iframe/ViewIframe` for details on how to implement.
