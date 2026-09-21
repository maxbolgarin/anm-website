import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Production (ukanm.ru, domain root) vs. GitHub Pages test copy (/anm-website).
// Build production with:  DEPLOY_TARGET=production pnpm build
const isProduction = process.env.DEPLOY_TARGET === 'production';

export default defineConfig({
  site: isProduction ? 'https://ukanm.ru' : 'https://maxbolgarin.github.io',
  base: isProduction ? '/' : '/anm-website',
  output: 'static',
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'ru',
        locales: {
          ru: 'ru-RU',
          en: 'en-US',
        },
      },
    }),
  ],
  build: {
    format: 'directory',
  },
  vite: {
    define: {
      'import.meta.env.PUBLIC_DEPLOY_TARGET': JSON.stringify(isProduction ? 'production' : 'staging'),
    },
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
