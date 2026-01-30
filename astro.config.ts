import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://cloudnativedays.at',
  integrations: [sitemap(), preact({ compat: true })],
});
