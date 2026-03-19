import { createClient } from '@sanity/client'

export const sanityClient = createClient({
    projectId: import.meta.env.SANITY_PROJECT_ID,
    dataset: import.meta.env.SANITY_DATASET,
    apiVersion: '2026-03-18',
    useCdn: true,
})
