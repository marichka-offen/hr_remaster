import type { APIRoute } from 'astro'

// Crawlers that collect pages to train AI models. Blocked at the author's request.
// AI *search* crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot) are not listed, so they stay
// allowed and the site can still be cited, with a link, in AI answers. Google-Extended only controls
// Gemini training; Google Search and AI Overviews are unaffected.
// robots.txt is a request that reputable crawlers honour, not an enforcement mechanism.
const AI_TRAINING_CRAWLERS = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'meta-externalagent']

// Generated at build time so the sitemap address always matches the site's real domain
export const GET: APIRoute = ({ site }) => {
    const sitemap = new URL('sitemap-index.xml', site).href
    const blocked = AI_TRAINING_CRAWLERS.map((bot) => `User-agent: ${bot}\nDisallow: /`).join('\n\n')
    const body = `# AI training crawlers: not permitted\n${blocked}\n\n# Everyone else, including search engines and AI search\nUser-agent: *\nAllow: /\nDisallow: /dev/\n\nSitemap: ${sitemap}\n`
    return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
