// Creates or updates every block from storyblok/components.mjs in the Storyblok space.
// Safe to run repeatedly: existing blocks are updated in place, nothing is deleted.
//
// Needs in .env:
//   STORYBLOK_SPACE_ID
//   STORYBLOK_PERSONAL_ACCESS_TOKEN  (Storyblok > My account > Account settings > Personal access token)
//   STORYBLOK_REGION                  (eu, us, ap, ca)
//
// Run: npm run storyblok:push

import { components } from '../storyblok/components.mjs'
import { managementApi } from './storyblok-mapi.mjs'

const api = managementApi()
const existing = new Map((await api.get('/components/')).components.map((c) => [c.name, c]))

for (const component of components) {
    const current = existing.get(component.name)
    if (current) {
        await api.put(`/components/${current.id}`, { component: { ...component, id: current.id } })
        console.log(`updated  ${component.name}`)
    } else {
        await api.post('/components/', { component })
        console.log(`created  ${component.name}`)
    }
}

const defined = new Set(components.map((c) => c.name))
const extra = [...existing.keys()].filter((name) => !defined.has(name))
if (extra.length) console.log(`\nIn the space but not in components.mjs (left untouched): ${extra.join(', ')}`)
console.log(`\nDone: ${components.length} blocks`)
