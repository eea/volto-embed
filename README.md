# volto-embed

[![Releases](https://img.shields.io/github/v/release/eea/volto-embed)](https://github.com/eea/volto-embed/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-embed%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-embed/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-embed-master&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-embed-master)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-embed-master&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-embed-master)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-embed-master&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-embed-master)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-embed-master&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-embed-master)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-embed%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-embed/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-embed-develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-embed-develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-embed-develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-embed-develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-embed-develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-embed-develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-embed-develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-embed-develop)

GDPR-compliant external resource embedding components for Volto.

Right now it does several things:

- it replaces the Map default block with a variant that's data-protected
- it provides a component `<PrivacyProtection>` which can be used to wrap other
  components that wrap sensitive content
- it provides a function `addPrivacyProtectionToSchema` which adds the fields
  that are required to configure the "data protection" for any component
  wrapped in `<PrivacyProtection>`.

See `src/Iframe/ViewIframe` for details on how to implement.

## Getting started

1. Create new volto project if you don't already have one:

   ```
   $ npm install -g yo @plone/generator-volto
   $ yo @plone/volto my-volto-project --addon volto-embed

   $ cd my-volto-project
   $ yarn add -W @eeacms/volto-embed      // Not yet available
   ```

1. If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
      "volto-embed"
   ],

   "dependencies": {
      "volto-embed": "github:eea/volto-embed#master"
   }
   ```

1. Install new add-ons and restart Volto:

   ```
   $ yarn
   $ yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## Release

See [RELEASE.md](https://github.com/eea/volto-embed/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-embed/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-embed/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
