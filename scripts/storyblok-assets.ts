// Uploads the images the mock content uses into Storyblok's asset library, so stories can point at
// Storyblok's own copies instead of the old site's GitHub files.
// Safe to run again: each image gets a stable file name (its own name plus a short hash of where it came
// from), and images already in the library are reused, not uploaded twice.
// On its own it only uploads (no stories change, nothing is published):  npm run storyblok:assets
// The seed calls it first and then fills in the image fields.

import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

type Api = { get: (path: string) => Promise<any>; post: (path: string, body: unknown) => Promise<any> }

// The value Storyblok stores in an asset field
export type AssetField = { id: number; filename: string; alt: string; name: string; title: string; copyright: string; focus: string; fieldtype: 'asset'; is_external_url: false }

const IMAGE_KEYS = new Set(['src', 'imageUrl', 'coverImageUrl'])
const PUBLIC_DIR = fileURLToPath(new URL('../public/', import.meta.url))
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Every image address in the content: fields named src, imageUrl or coverImageUrl, at any depth
export function collectImageUrls(...sources: unknown[]): string[] {
    const found = new Set<string>()
    const walk = (value: unknown, key = '') => {
        if (typeof value === 'string') {
            if (IMAGE_KEYS.has(key) && value) found.add(value)
        } else if (Array.isArray(value)) {
            value.forEach((item) => walk(item, key))
        } else if (value && typeof value === 'object') {
            for (const [k, v] of Object.entries(value)) walk(v, k)
        }
    }
    sources.forEach((source) => walk(source))
    return [...found]
}

// "Img1.JPG" from https://raw.githubusercontent.com/.../Img1.JPG becomes "img1-3f2a9c1b.jpg"
function libraryName(url: string): string {
    const path = url.startsWith('/') ? url : new URL(url).pathname
    const file = decodeURIComponent(path.split('/').pop() ?? 'image')
    const dot = file.lastIndexOf('.')
    const stem = (dot > 0 ? file.slice(0, dot) : file).replace(/[^a-zA-Z0-9-]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'image'
    const ext = dot > 0 ? file.slice(dot).toLowerCase() : '.jpg'
    const hash = createHash('sha1').update(url).digest('hex').slice(0, 8)
    // Lower case, because Storyblok lowercases file names on upload and they must match on the next run
    return `${stem}-${hash}${ext}`.toLowerCase()
}

async function download(url: string): Promise<Buffer> {
    if (url.startsWith('/')) return readFile(PUBLIC_DIR + url.slice(1))
    for (let attempt = 0; attempt < 5; attempt++) {
        // Wikimedia asks automated clients to name themselves and rate-limits bursts
        const response = await fetch(url, { headers: { 'User-Agent': 'HistoriesReconsidered-seed/1.0 (Storyblok asset upload)' } })
        if (response.status === 429) {
            await sleep(5000 * (attempt + 1))
            continue
        }
        if (!response.ok) throw new Error(`Download failed (${response.status}): ${url}`)
        return Buffer.from(await response.arrayBuffer())
    }
    throw new Error(`Download still rate limited: ${url}`)
}

// Storyblok returns protocol-relative or S3-style addresses depending on the call; store the public CDN one
const publicUrl = (address: string) => {
    const url = address.startsWith('//') ? `https:${address}` : address
    return url.replace(/^https?:\/\/s3\.amazonaws\.com\//, 'https://')
}

async function existingAssets(api: Api): Promise<Map<string, { id: number; filename: string }>> {
    const byName = new Map<string, { id: number; filename: string }>()
    for (let page = 1; ; page++) {
        const { assets } = await api.get(`/assets/?per_page=100&page=${page}`)
        for (const asset of assets) byName.set(asset.filename.split('/').pop(), { id: asset.id, filename: publicUrl(asset.filename) })
        if (assets.length < 100) return byName
    }
}

async function upload(api: Api, name: string, bytes: Buffer): Promise<{ id: number; filename: string }> {
    const { width, height } = await sharp(bytes).metadata()
    const signed = await api.post('/assets/', { filename: name, size: width && height ? `${width}x${height}` : undefined })
    const form = new FormData()
    for (const [key, value] of Object.entries(signed.fields as Record<string, string>)) form.append(key, value)
    form.append('file', new Blob([new Uint8Array(bytes)]), name)
    const response = await fetch(signed.post_url, { method: 'POST', body: form })
    if (!response.ok) throw new Error(`Upload failed (${response.status}) for ${name}`)
    await api.get(`/assets/${signed.id}/finish_upload`)
    return { id: signed.id, filename: publicUrl(signed.pretty_url) }
}

// Uploads whatever isn't in the library yet. Returns a lookup from the original address to an asset
// field value; addresses that fail to download are reported and left out (their fields stay empty)
export async function prepareAssets(api: Api, urls: string[]) {
    const library = await existingAssets(api)
    const byUrl = new Map<string, { id: number; filename: string }>()
    let uploaded = 0
    for (const url of urls) {
        const name = libraryName(url)
        try {
            let asset = library.get(name)
            if (!asset) {
                asset = await upload(api, name, await download(url))
                library.set(name, asset)
                uploaded++
                console.log(`uploaded  ${name}`)
            }
            byUrl.set(url, asset)
        } catch (error) {
            console.warn(`skipped   ${url}: ${(error as Error).message}`)
        }
    }
    console.log(`Images: ${uploaded} uploaded, ${byUrl.size - uploaded} already in the library, ${urls.length - byUrl.size} skipped\n`)

    // The asset field value for an image address, or an empty field when there is no image
    return (url?: string, alt = ''): AssetField | Record<string, never> => {
        const asset = url ? byUrl.get(url) : undefined
        if (!asset) return {}
        return { id: asset.id, filename: asset.filename, alt, name: '', title: '', copyright: '', focus: '', fieldtype: 'asset', is_external_url: false }
    }
}

// Run directly: upload only
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
    const { managementApi } = await import('./storyblok-mapi.mjs')
    const { articles } = await import('../src/mocks/articles')
    const { books } = await import('../src/mocks/books')
    const pages = await import('../src/mocks/pages')
    const urls = collectImageUrls(articles, books, pages)
    console.log(`${urls.length} images in the content`)
    await prepareAssets(managementApi(), urls)
}
