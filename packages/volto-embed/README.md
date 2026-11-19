# @eeacms/volto-embed

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

## Upgrade

### Upgrading to 12.x

> This version requires `Volto 18` or `Volto 19` and Node.js 22.

This release adds Volto 19 support, and the published package moves to `packages/volto-embed`. The maps widget now renders its block icon with Volto's `Image` component instead of the `semantic-ui-react` one; the exports, the block schemas and the widget registration stay the same.

#### Breaking changes

- **Node.js 22 or newer is required** (`engines.node >= 22`), 11.x declared no engine.
- **React 18 is required.** The package declares `react` and `react-dom` as `^18.2.0` peers, 11.x declared no peers.

## Requirements

### Backend

- [Plone](https://plone.org/download)
- [plone.restapi](https://pypi.org/project/plone.restapi/)

### Frontend

- Node.js: `>=22.0.0`

## Installation

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "dependencies": {
       "@eeacms/volto-embed": "*"
   }
   ```

   and `volto.config.js`:

   ```JavaScript
   const addons = ['@eeacms/volto-embed'];
   ```

* If not, create one with Cookieplone, as recommended by the official Plone documentation for Volto 18+:

   ```
   uvx cookieplone project
   cd project-title
   ```

1. Install or update dependencies, then start the project:

   ```
   make install
   ```

   For a Cookieplone project, start the backend and frontend in separate terminals:

   ```
   make backend-start
   make frontend-start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## License

See [LICENSE.md](LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
