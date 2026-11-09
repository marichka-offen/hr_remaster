import type { ContactPage, Page, SiteSettings } from '@app-types/content'
import { articles } from './articles'
import { books } from './books'

const bySlug = (slug: string) => {
    const article = articles.find((a) => a.slug === slug)
    if (!article) throw new Error(`Mock article "${slug}" not found`)
    return article
}



export const siteSettings: SiteSettings = {
    header: {
        logoTitle: 'History Reconsidered',
        logoSubtitle: 'Military history by Lee G. Offen',
        navigation: [
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
            { label: 'Maryland Colonial History', href: '/articles?topic=maryland-colonial-history' },
            { label: 'Virginia Colonial History', href: '/articles?topic=virginia-colonial-history' },
            { label: 'Irish History', href: '/articles?topic=irish-history' },
            { label: 'Dutch History', href: '/articles?topic=dutch-history' },
            { label: 'Scottish History', href: '/articles?topic=scottish-history' },
            { label: 'British History', href: '/articles?topic=british-history' },
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
            // Draft wording for Lee to approve (see the "For Lee" list on the design canvas)
            label: 'Military history from the sources',
            title: 'Wars, regiments and campaigns, 1419–1920',
            text: `${articles.length} researched articles on Europe and colonial America by Lee G. Offen, retired U.S. Army Major. Every article is documented with primary and secondary sources.`,
            imageUrl: 'https://raw.githubusercontent.com/marichka-offen/history-reconsidered/master/src/assets/images/DutchHistory/heiligerlee.jpg',
            imageAlt: 'Etching of the Battle of Heiligerlee, 1568',
            imageCaption: 'The Battle of Heiligerlee, 1568. Etching, Museum Boijmans Van Beuningen, Rotterdam. From The Eighty Years War',
            cta: { text: 'Browse the archive', link: '/articles' },
            secondaryCta: { text: 'About Lee', link: '/about' },
        },
        {
            _type: 'readingPaths',
            heading: 'Read in order',
            intro: 'Several articles follow one story across decades. Read them in sequence.',
            paths: [
                {
                    title: 'Ireland at war',
                    articles: ['oneils-rebellion', 'war-of-three-kingdoms-ireland', 'ireland-1652-1688', 'irish-military-establishment', 'williamite-war'].map(bySlug),
                },
                {
                    title: 'Colonial Maryland and Virginia',
                    articles: ['military-history-of-maryland', 'battle-of-the-severn', 'british-military-presence-america', 'british-regulars-virginia', 'maryland-forces-1754-1764', 'virginia-ranger-companies'].map(bySlug),
                },
                {
                    title: 'Scotland and the Stuarts',
                    articles: ['house-of-stuart', 'mackays-regiment', 'dumbartons-regiment'].map(bySlug),
                },
            ],
        },
        {
            _type: 'featured',
            heading: 'Latest research',
            article: bySlug('czechoslovak-legion'),
        },
        {
            _type: 'articleGrid',
            heading: 'From the archive',
            showCategoryFilter: true,
            articles: ['eighty-years-war', 'williamite-war', 'war-of-three-kingdoms-ireland', 'the-hussites', 'british-regulars-virginia', 'dumbartons-regiment'].map(bySlug),
            cta: { text: `All ${articles.length} articles`, link: '/articles' },
        },
        {
            _type: 'authorCard',
            label: 'The author',
            name: 'Lee G. Offen',
            imageUrl: '/images/lee-and-kathleen.webp',
            imageAlt: 'Lee G. Offen and Kathleen in historical reenactment dress',
            imageCaption: 'Lee and Kathleen in reenactment dress',
            bio: [
                {
                    type: 'paragraph',
                    text: 'History Reconsidered examines significant historical decisions and actions that deserve another look — events that have never been examined or haven’t been examined thoroughly enough.',
                },
            ],
            credentials: [
                'Retired U.S. Army Major; Armored Cavalry combat veteran, Bronze Star',
                'Assistant Professor of Military Science at Georgetown and George Mason',
                'Master’s Degree in Government, Campbell University',
                'Author of America’s First Marines (Westholme)',
            ],
            cta: { text: 'Full biography', link: '/about' },
        },
        {
            _type: 'books',
            heading: 'Books',
            cta: { text: 'All books', link: '/books' },
            books,
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
    description:
        'Research articles on military history by Lee G. Offen, from the Hussite Wars and the Eighty Years War to colonial Virginia and the Czechoslovak Legion.',
    sections: [],
}

export const booksPage: Page = {
    title: 'Books',
    description:
        "Books by Lee G. Offen: America's First Marines, a regimental history of Gooch's American Regiment, and the forthcoming history of the Czechoslovak Legion.",
    sections: [],
}

export const contact: ContactPage = {
    title: 'Contact',
    description: 'Contact History Reconsidered for research inquiries, speaking engagements or general correspondence.',
    label: 'Contact',
    heading: 'Get in Touch',
    subheading:
        "For research inquiries, speaking engagements, or general correspondence — send a message and we'll respond as soon as possible.",
    // The real address isn't in the designs yet; the email line stays hidden until it's set
}
