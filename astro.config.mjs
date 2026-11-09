// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import react from '@astrojs/react';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// The site's public address, used for canonical links, the sitemap and social previews.
// Set SITE_URL in Cloudflare's build variables (the workers.dev address until the domain is connected);
// locally it falls back to the dev server
const site = process.env.SITE_URL ?? 'http://localhost:4321';

// Pages that exist but shouldn't be found through search engines
const hiddenPages = ['/dev/', '/contact/thanks/', '/404', '/preview/'];

export default defineConfig({
    site,
    // Pages are static; only /preview (the Storyblok Visual Editor) and /api/contact run on request, in a
    // Cloudflare Worker. platformProxy gives local dev the same bindings (e.g. the email binding)
    adapter: cloudflare({ platformProxy: { enabled: true }, imageService: 'passthrough' }),
    integrations: [
        react(),
        icon(),
        sitemap({
            filter: (page) => !hiddenPages.some((path) => new URL(page).pathname.startsWith(path)),
        }),
    ],
    vite: {
        // Node built-ins used by the preview; available on Cloudflare through the nodejs_compat flag
        ssr: { external: ['node:crypto', 'node:async_hooks'] },
        resolve: {
            alias: {
                '@icons': fileURLToPath(new URL('./src/icons', import.meta.url)),
            },
        },
    },
});
