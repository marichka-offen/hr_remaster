import type { APIRoute } from 'astro'

// Generated at build time so the sitemap address always matches the site's real domain
export const GET: APIRoute = ({ site }) => {
    const sitemap = new URL('sitemap-index.xml', site).href
    return new Response(`User-agent: *\nAllow: /\nDisallow: /dev/\n\nSitemap: ${sitemap}\n`, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
}
