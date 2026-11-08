/// <reference types="astro/client" />

// Server-side environment variables (from .env locally, Netlify's settings in production)
interface ImportMetaEnv {
    readonly CONTENT_SOURCE?: 'mock' | 'storyblok'
    readonly STORYBLOK_DELIVERY_API_TOKEN?: string
    readonly STORYBLOK_SPACE_ID?: string
    readonly STORYBLOK_REGION?: 'eu' | 'us' | 'ap' | 'ca'
    readonly STORYBLOK_VERSION?: 'draft' | 'published'
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
