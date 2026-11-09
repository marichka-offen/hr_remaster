// Small client for Storyblok's Management API (read and write), shared by the push and seed scripts.
// Reads credentials from .env; never logs the token.

import { readFileSync } from 'node:fs'

function loadEnv() {
    const env = { ...process.env }
    try {
        for (const line of readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n')) {
            const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
            if (match && !(match[1] in process.env)) env[match[1]] = match[2].replace(/^["']|["']$/g, '')
        }
    } catch {
        // No .env file: rely on the environment
    }
    return env
}

const HOSTS = {
    eu: 'https://mapi.storyblok.com/v1',
    us: 'https://api-us.storyblok.com/v1',
    ap: 'https://api-ap.storyblok.com/v1',
    ca: 'https://api-ca.storyblok.com/v1',
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function managementApi() {
    const env = loadEnv()
    const token = env.STORYBLOK_PERSONAL_ACCESS_TOKEN
    const spaceId = env.STORYBLOK_SPACE_ID
    if (!token || !spaceId) {
        console.error('Missing STORYBLOK_PERSONAL_ACCESS_TOKEN or STORYBLOK_SPACE_ID in .env')
        console.error('Create a token in Storyblok: My account > Account settings > Personal access token')
        process.exit(1)
    }
    const base = `${HOSTS[(env.STORYBLOK_REGION ?? 'eu').toLowerCase()] ?? HOSTS.eu}/spaces/${spaceId}`

    // The Management API allows a few requests per second; a short pause keeps us under the limit
    const request = async (method, path, body) => {
        for (let attempt = 0; attempt < 5; attempt++) {
            await sleep(350)
            const response = await fetch(`${base}${path}`, {
                method,
                headers: { Authorization: token, 'Content-Type': 'application/json' },
                body: body ? JSON.stringify(body) : undefined,
            })
            if (response.status === 429) {
                await sleep(1500 * (attempt + 1))
                continue
            }
            if (!response.ok) throw new Error(`${method} ${path} failed: ${response.status} ${await response.text()}`)
            return response.status === 204 ? null : response.json()
        }
        throw new Error(`${method} ${path}: still rate limited after retries`)
    }

    return {
        get: (path) => request('GET', path),
        post: (path, body) => request('POST', path, body),
        put: (path, body) => request('PUT', path, body),
    }
}
