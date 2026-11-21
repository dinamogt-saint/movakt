import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://movakt.com',
  adapter: cloudflare(),
  i18n: { locales: ['ru', 'en'], defaultLocale: 'ru', routing: { prefixDefaultLocale: false } },
});
