import type { ExpoConfig } from 'expo/config';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { version } = require('./package.json') as { version: string };

export default (): ExpoConfig => ({
  name: 'Social Copilot',
  slug: 'social-copilot',
  version,
  orientation: 'portrait',
  platforms: ['ios', 'android'],
  extra: {},
});
