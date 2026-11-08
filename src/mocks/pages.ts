import type { ContactPage, Page, SiteSettings } from '@app-types/content'
import { articles } from './articles'
import { books } from './books'
import { eightyYearsWarBody } from './article-bodies'

const bySlug = (slug: string) => {
    const article = articles.find((a) => a.slug === slug)
    if (!article) throw new Error(`Mock article "${slug}" not found`)
    return article
}

const forthcoming = books[1]

// A few real events from the Eighty Years War mock, to show a small timeline as a home page section
const eightyYearsTimeline = eightyYearsWarBody.find((block) => block.type === 'timeline')
const homeTimelineEvents =
    eightyYearsTimeline?.type === 'timeline' ? eightyYearsTimeline.groups[0].events.filter((e) => e.kind && e.kind !== 'quote').slice(0, 4) : []

export const siteSettings: SiteSettings = {
    header: {
        logoTitle: 'History Reconsidered',
        logoSubtitle: 'Military History & Research',
        navigation: [
            { label: 'Home', href: '/' },
            { label: 'Articles', href: '/articles' },
            { label: 'Books', href: '/books' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
        ],
    },
    footer: {
        description:
            'Reconsidering significant historical decisions and actions with rigorous research and source-supported analysis.',
        topicsTitle: 'Topics',
        topics: [
            { label: 'Colonial History', href: '/articles?topic=colonial-history' },
            { label: 'European Wars', href: '/articles?topic=european-wars' },
            { label: 'British Isles', href: '/articles?topic=british-isles' },
            { label: 'Medieval', href: '/articles?topic=medieval' },
            { label: 'World War I', href: '/articles?topic=world-war-i' },
        ],
        copyright: `© 2010–${new Date().getFullYear()} History Reconsidered, LLC`,
        copyrightNote: 'All rights reserved',
    },
}

export const home: Page = {
    title: 'History Reconsidered',
    description:
        'Military history research by Lee G. Offen — significant decisions and actions that deserve another look.',
    sections: [
        {
            _type: 'hero',
            label: 'Est. 2010 · Military History Journal',
            title: 'History Reconsidered',
            quote: 'The further backward you look, the further forward you can see.',
            quoteAuthor: 'Winston Churchill',
            cta: { text: 'Explore Articles', link: '/articles' },
        },
        {
            _type: 'featured',
            label: 'Featured',
            heading: 'Latest Research',
            article: bySlug('czechoslovak-legion'),
        },
        {
            _type: 'articleGrid',
            label: 'Archive',
            heading: 'History Articles',
            showCategoryFilter: true,
            articles: articles.filter((a) => a.slug !== 'czechoslovak-legion').slice(0, 6),
            cta: { text: 'View All Articles', link: '/articles' },
        },
        {
            _type: 'authorCard',
            name: 'Lee G. Offen',
            role: 'Military Historian & Retired Soldier',
            initials: 'LO',
            bio: [
                {
                    type: 'paragraph',
                    text: 'A lifelong student of military history and a retired soldier, Lee brings both academic rigor and personal experience to his writing. Every article is thoroughly sourced, respecting the intelligence of the reader.',
                },
                {
                    type: 'paragraph',
                    text: 'History Reconsidered examines significant historical decisions and actions that deserve another look — events that have never been examined or haven’t been examined thoroughly enough.',
                },
            ],
            cta: { text: 'Read Full Bio', link: '/about' },
        },
        {
            _type: 'bookPromo',
            label: 'Upcoming Book',
            coverLabel: forthcoming.coverLabel,
            title: forthcoming.title,
            subtitle: forthcoming.subtitle,
            description: forthcoming.excerpt,
            cta: { text: 'Learn More', link: `/books/${forthcoming.slug}` },
        },
        {
            _type: 'content',
            label: 'From the archive',
            heading: 'The Eighty Years War',
            blocks: [
                {
                    type: 'timeline',
                    groups: [{ id: 'home-timeline', label: '1555–1567', title: 'Gathering Storm', events: homeTimelineEvents }],
                },
            ],
        },
    ],
}

export const about: Page = {
    title: 'About',
    description: 'Lee G. Offen — retired U.S. Army Major, military historian and reenactor.',
    sections: [
        {
            _type: 'authorBio',
            label: 'About the Author',
            name: 'Lee G. Offen',
            role: 'Retired U.S. Army Major · Military Historian · Reenactor',
            initials: 'LO',
            bio: [
                {
                    type: 'paragraph',
                    text: "Lee is a retired U.S. Army Major who resides in Springfield, Virginia. He is an Armored Cavalry Combat Veteran, former Airborne Infantryman and a recipient of the Bronze Star. He holds a Master's Degree in Government from Campbell University and was Assistant Professor of Military Science at Georgetown University and George Mason University.",
                },
            ],
            credentials: [
                {
                    icon: 'medal',
                    label: 'Military Service',
                    title: 'Combat Veteran & Bronze Star Recipient',
                    description:
                        'Armored Cavalry Combat Veteran and former Airborne Infantryman. Retired as a U.S. Army Major after distinguished service.',
                },
                {
                    icon: 'graduation-cap',
                    label: 'Academic',
                    title: 'Georgetown & George Mason University',
                    description:
                        "Master's Degree in Government from Campbell University. Assistant Professor of Military Science at Georgetown University and George Mason University.",
                },
                {
                    icon: 'pen',
                    label: 'Research & Writing',
                    title: 'Published Author & Reenactor',
                    description:
                        'Author of "America\'s First Marines" — published by Westholme. A graduate of the U.S. Army Military History Instructors Course and an avid historical reenactor of 17th and 18th century history.',
                },
            ],
        },
        {
            _type: 'philosophyBlock',
            quote: 'History needs to be made accessible, supported with graphics and pictures when possible, while respecting the intelligence of the reader. No dumbing down here mislabeled as accessibility!',
            body: [
                {
                    type: 'paragraph',
                    text: 'History Reconsidered examines significant historical decisions and actions that deserve another look — because they have never been examined, or have not been examined thoroughly. Sources matter too. Every article is documented with primary and secondary sources so readers can continue their journey through a subject.',
                },
            ],
        },
        {
            _type: 'pageCta',
            label: 'Start Reading',
            heading: 'Explore the Articles',
            subtext:
                'From the Czechoslovak Legion to the War of Three Kingdoms — rigorous research into the overlooked corners of military history.',
            cta: { text: 'Browse All Articles', link: '/articles' },
        },
    ],
}

export const articlesPage: Page = {
    title: 'Articles',
    description: 'The full archive of History Reconsidered articles.',
    sections: [],
}

export const booksPage: Page = {
    title: 'Books',
    description: 'Books by Lee G. Offen.',
    sections: [],
}

export const contact: ContactPage = {
    title: 'Contact',
    description: 'Get in touch with History Reconsidered.',
    label: 'Contact',
    heading: 'Get in Touch',
    subheading:
        "For research inquiries, speaking engagements, or general correspondence — send a message and we'll respond as soon as possible.",
}
