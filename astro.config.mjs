// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import react from '@astrojs/react';
import icon from 'astro-icon';
export default defineConfig({
    integrations: [react(), icon()],
    vite: {
        resolve: {
            alias: {
                '@icons': fileURLToPath(new URL('./src/icons', import.meta.url)),
            },
        },
    },
});