# volto-embed

[![Releases](https://img.shields.io/github/v/release/eea/volto-embed)](https://github.com/eea/volto-embed/releases)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-embed%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-embed/job/master/display/redirect)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-embed&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-embed)

GDPR-compliant external resource embedding components for Volto.
Right now it does several things:
- it replaces the Map default block with a variant that's data-protected
- it provides a component `<PrivacyProtection>` which can be used to wrap other
  components that wrap sensitive content
- it provides a function `addPrivacyProtectionToSchema` which adds the fields
  that are required to configure the "data protection" for any component
  wrapped in `<PrivacyProtection>`.
See `src/Iframe/ViewIframe` for details on how to implement.

The add-on package lives in [`packages/volto-embed`](packages/volto-embed),
its [README](packages/volto-embed/README.md) documents installation and usage.

## Development

See [DEVELOP.md](DEVELOP.md).

## Release

See [RELEASE.md](RELEASE.md).

## License

See [LICENSE.md](LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
