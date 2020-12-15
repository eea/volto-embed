# volto-embed
[![Releases](https://img.shields.io/github/v/release/eea/volto-embed)](https://github.com/eea/volto-embed/releases)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-embed%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-embed/job/master/display/redirect)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-embed%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-embed/job/develop/display/redirect)

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
   $ yo @plone/volto my-volto-project --addon @eeacms/volto-embed

   $ cd my-volto-project
   $ yarn add -W @eeacms/volto-embed
   ```

1. If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "@eeacms/volto-embed"
   ],

   "dependencies": {
       "@eeacms/volto-embed": "^1.0.0"
   }
   ```

1. Install new add-ons and restart Volto:

   ```
   $ yarn
   $ yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-embed/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-embed/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)