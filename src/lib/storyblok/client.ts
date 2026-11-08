// Reads stories from Storyblok's Content Delivery API (read-only). The site is small, so every story is
// fetched once per build and kept in memory; pages then look stories up locally, and references between
// stories (featured article, topics) are resolved by uuid without extra requests.

export interface Story<C = Record<string, unknown>> {
    uuid: string
    slug: string
    full_slug: string
    first_published_at: string | null
    published_at: string | null
    created_at: string
    content: C & { component: string; _uid: string }
}

const HOSTS: Record<string, string> = {
    eu: 'https://api.storyblok.com/v2',
    us: 'https://api-us.storyblok.com/v2',
    ap: 'https://api-ap.storyblok.com/v2',
    ca: 'https://api-ca.storyblok.com/v2',
}

const env = import.meta.env
const token = env.STORYBLOK_DELIVERY_API_TOKEN as string | undefined
const host = HOSTS[String(env.STORYBLOK_REGION ?? 'eu').toLowerCase()] ?? HOSTS.eu

// Drafts while developing or on a preview build (STORYBLOK_VERSION=draft); only published content otherwise
const version = env.STORYBLOK_VERSION ?? (env.DEV ? 'draft' : 'published')

let cache: Promise<Story[]> | undefined

async function fetchAll(): Promise<Story[]> {
    if (!token) throw new Error('STORYBLOK_DELIVERY_API_TOKEN is not set (see .env)')
    const stories: Story[] = []
    // cv (cache version) makes Storyblok's CDN return the latest content instead of a cached copy
    const cv = Date.now()
    for (let page = 1; ; page++) {
        const params = new URLSearchParams({ token, version, per_page: '100', page: String(page), cv: String(cv) })
        const response = await fetch(`${host}/cdn/stories?${params}`)
        if (!response.ok) throw new Error(`Storyblok: ${response.status} ${await response.text()}`)
        const data = (await response.json()) as { stories: Story[] }
        stories.push(...data.stories)
        const total = Number(response.headers.get('total') ?? stories.length)
        if (stories.length >= total || data.stories.length === 0) break
    }
    return stories
}

export function allStories(): Promise<Story[]> {
    cache ??= fetchAll()
    return cache
}

export async function storiesOfType<C>(component: string): Promise<Story<C>[]> {
    return (await allStories()).filter((story) => story.content.component === component) as Story<C>[]
}

export async function storyBySlug<C>(fullSlug: string): Promise<Story<C> | undefined> {
    return (await allStories()).find((story) => story.full_slug === fullSlug) as Story<C> | undefined
}

export async function storyByUuid<C>(uuid: string | undefined): Promise<Story<C> | undefined> {
    if (!uuid) return undefined
    return (await allStories()).find((story) => story.uuid === uuid) as Story<C> | undefined
}
