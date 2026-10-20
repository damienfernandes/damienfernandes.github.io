import { defineConfig } from 'astro/config';
import target from './config/target.json' with { type: 'json' };
const base = process.env.SITE_BASE || target.base;
if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base))
  throw new Error('Invalid SITE_BASE');
export default defineConfig({
  site: target.site,
  base,
  output: 'static',
  integrations: [
    {
      name: 'dev-style-guide-and-review',
      hooks: {
        'astro:config:setup': ({ command, injectRoute }) => {
          if (command === 'dev') {
            injectRoute({
              pattern: '/style-guide',
              entrypoint: './src/dev/style-guide.astro',
            });
            injectRoute({
              pattern: '/review',
              entrypoint: './src/dev/review.astro',
            });
          }
        },
      },
    },
  ],
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: { build: { sourcemap: false } },
});
