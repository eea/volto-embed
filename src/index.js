import installBlocks from './Blocks';
export {
  PrivacyProtection,
  addPrivacyProtectionToSchema,
} from './PrivacyProtection';

export default function applyConfig(config) {
  config.settings.allowed_cors_destinations = [
    ...config.settings.allowed_cors_destinations,
    'screenshot.eea.europa.eu',
  ];
  return [installBlocks].reduce((acc, apply) => apply(acc), config);
}
