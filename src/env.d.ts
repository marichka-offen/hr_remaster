/// <reference types="astro/client" />

// Build-time environment variables (from .env locally, Cloudflare's build variables in production)
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

// Cloudflare runtime (Astro.locals.runtime.env): bindings and variables set in Cloudflare's dashboard
interface SendEmail {
    send(message: unknown): Promise<void>
}

interface CloudflareEnv {
    CONTACT_EMAIL?: SendEmail
    CONTACT_FROM?: string
    CONTACT_TO?: string
}

type Runtime = import('@astrojs/cloudflare').Runtime<CloudflareEnv>

declare namespace App {
    interface Locals extends Runtime {}
}

declare module 'cloudflare:email' {
    export class EmailMessage {
        constructor(from: string, to: string, raw: string)
    }
}
