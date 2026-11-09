import type { Book } from '@app-types/book'

// Copy from designs/about-book-pages-redesign.html. The mock's Amazon and excerpt links are "#";
// the real URLs are still needed.

export const books: Book[] = [
    {
        title: "America's First Marines",
        slug: 'americas-first-marines',
        subtitle: "Gooch's American Regiment, 1740–1742",
        author: 'Lee G. Offen',
        coverLabel: 'Available Now',
        // The real cover, from the old site's preview images
        coverImageUrl: 'https://raw.githubusercontent.com/marichka-offen/history-reconsidered/master/src/assets/images/book/book-ss1.png',
        coverImageAlt: 'Cover of America’s First Marines',
        status: 'Published · Available Now',
        excerpt:
            "The first ever comprehensive regimental history of America's First Marines. Making extensive use of primary source material, this account reveals how these men formed a separate identity — becoming “Americans.”",
        description: [
            {
                type: 'paragraph',
                text: "Gooch's Regiment was raised in nine North American colonies and placed on the British Army Establishment as a Regiment of Foot. Since the late 17th century, both Foot Regiments and Marine Regiments were responsible for shipboard operations such as ship-to-shore operations, boarding party operations, and assisting with the ship's guns.",
            },
            {
                type: 'quote',
                text: 'They were the first military formation described as such, since the first colonists landed in North America. It was a distinction worth noting because it was the first time it was made and clearly not the last.',
            },
            {
                type: 'paragraph',
                text: 'The identification of Gooch\'s Regiment as an "American Regiment" came from the leadership of the expedition, the men of the regiment and the media of the time. Had the Regiment been seen as a British Regiment, their hardships might have not been taken to heart by the American colonists and made the lasting impression they did.',
            },
        ],
        details: [
            { label: 'Author', value: 'Lee G. Offen' },
            { label: 'Publisher', value: 'Westholme Publishing' },
            { label: 'Subject', value: 'American Military History' },
            { label: 'Period', value: '1740–1742' },
            { label: 'Format', value: 'Hardcover & Paperback' },
            { label: 'Availability', value: 'Amazon' },
        ],
        previewPages: [{ alt: 'Map 1' }, { alt: 'Map 2' }, { alt: 'Interior 1' }, { alt: 'Interior 2' }],
        cta: { text: 'Buy on Amazon', link: '#' },
        secondaryCta: { text: 'Read an Excerpt', link: '#' },
    },
    {
        title: 'None Shall Pass Us by in Silence',
        slug: 'none-shall-pass-us-by-in-silence',
        subtitle: 'The Czechoslovak Legion, 1914–1920',
        author: 'Lee G. Offen',
        coverLabel: 'Forthcoming',
        status: 'Forthcoming',
        excerpt:
            'The full story of the Czechoslovak Legion — a military formation that fought across 4,000 miles of Russia, captured the imagination of Allied nations, and earned nationhood for the Czechoslovak people.',
        description: [
            {
                type: 'paragraph',
                text: 'The full story of the Czechoslovak Legion, 1914–1920 — a military formation that fought across 4,000 miles of Russia, captured the imagination of Allied nations, and earned nationhood for the Czechoslovak people.',
            },
        ],
    },
]
