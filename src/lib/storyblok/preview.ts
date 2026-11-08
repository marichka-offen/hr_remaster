// Checks that a preview request really comes from the Storyblok Visual Editor before drafts are shown.
// Storyblok signs each editor URL: _storyblok_tk[token] = sha1(`${spaceId}:${previewToken}:${timestamp}`).
// A request is valid when the hash matches and the timestamp is less than an hour old.
// https://www.storyblok.com/docs/concepts/visual-editor#verify-the-preview-token

import { createHash, timingSafeEqual } from 'node:crypto'

const MAX_AGE_SECONDS = 3600

export function isValidPreviewRequest(url: URL): boolean {
    const spaceId = import.meta.env.STORYBLOK_SPACE_ID
    const previewToken = import.meta.env.STORYBLOK_DELIVERY_API_TOKEN
    const requestSpace = url.searchParams.get('_storyblok_tk[space_id]')
    const timestamp = Number(url.searchParams.get('_storyblok_tk[timestamp]'))
    const token = url.searchParams.get('_storyblok_tk[token]') ?? ''

    if (!spaceId || !previewToken || requestSpace !== String(spaceId) || !timestamp || !token) return false
    if (timestamp < Math.floor(Date.now() / 1000) - MAX_AGE_SECONDS) return false

    const expected = createHash('sha1').update(`${spaceId}:${previewToken}:${timestamp}`).digest('hex')
    // Constant-time comparison, so the check doesn't leak how many characters matched
    return expected.length === token.length && timingSafeEqual(Buffer.from(expected), Buffer.from(token))
}
