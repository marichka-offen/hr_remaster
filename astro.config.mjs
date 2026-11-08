// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import react from '@astrojs/react';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

// The site's public address, used for canonical links, the sitemap and social previews.
// Netlify sets URL to the primary domain on every build; locally it falls back to the dev server
const site = process.env.URL ?? 'http://localhost:4321';

// Pages that exist but shouldn't be found through search engines
const hiddenPages = ['/dev/', '/contact/thanks/', '/404'];

export default defineConfig({
    site,
    integrations: [
        react(),
        icon(),
        sitemap({
            filter: (page) => !hiddenPages.some((path) => new URL(page).pathname.startsWith(path)),
        }),
    ],
    vite: {
        resolve: {
            alias: {
                '@icons': fileURLToPath(new URL('./src/icons', import.meta.url)),
            },
        },
    },
});
