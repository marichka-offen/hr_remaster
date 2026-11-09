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
        // Title from Lee's draft cover (the old site used the working title "None Shall Pass Us by in Silence")
        title: 'They Shall Not Pass By Us in Silence',
        slug: 'they-shall-not-pass-by-us-in-silence',
        subtitle: 'The Czechoslovak Legion in Russia, 1914–1920',
        author: 'Lee G. Offen',
        coverLabel: 'Forthcoming',
        coverImageUrl: '/images/books/they-shall-not-pass/cover.jpg',
        coverImageAlt: 'Cover of They Shall Not Pass By Us in Silence: period photographs of Czechoslovak legionnaires on a map of Russia',
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
    {
        // From Lee's "Hostile Frontier website content" document
        title: 'Hostile Frontier',
        slug: 'hostile-frontier',
        subtitle: 'The Colony of Virginia at War, 1754 to 1764',
        author: 'Lee G. Offen',
        coverLabel: 'Available Now',
        status: 'Published · Available Now',
        excerpt:
            'A decade at war for the Colony of Virginia — the French and Indian War, the war with the Cherokee, and “Pontiac’s Rebellion” — told in its entirety in one volume for the first time.',
        description: [
            {
                type: 'paragraph',
                text: 'In 1753, a young, inexperienced Major of Militia was sent by the Colony of Virginia to order French soldiers to depart from territory that could have been French, or British. The French did not comply and a year later this same Major, now a Lieutenant Colonel, returned in force. This marked the beginning of a decade spent at war for the Colony of Virginia.',
            },
            {
                type: 'paragraph',
                text: 'Virginia is the only British North American Colony to have been subjected to the ravages of, and participated in, the French and Indian War, War with the Cherokee and the war known as “Pontiac’s Rebellion” which was neither Pontiac’s nor a rebellion. Virginia also participated, with volunteers, in the expedition to the Ohio Country to recover captives taken in a decade of war against British America. Parts of this story have been told in numerous books, but it has never been told in its entirety in one volume until now.',
            },
            {
                type: 'figure',
                src: '/images/books/hostile-frontier/fry-jefferson-map.jpg',
                alt: 'Eighteenth-century map of Virginia and Maryland, with the Appalachian ridges running across it',
                caption: 'A Map of the Most Inhabited Part of Virginia, by Joshua Fry and Peter Jefferson, 1751',
            },
            {
                type: 'figure',
                src: '/images/books/hostile-frontier/fort-ligonier-plan.jpg',
                alt: 'Engraved plan of Fort Ligonier and its entrenched camp beside Loyalhanna Creek, with a lettered key',
                caption: 'Plan of the Retrenched Camp at Fort Ligonier',
            },
            {
                type: 'figure',
                src: '/images/books/hostile-frontier/frontier-forest.jpg',
                alt: 'Forest on a hillside below a mossy rock ledge',
            },
        ],
        details: [
            { label: 'Author', value: 'Lee G. Offen' },
            { label: 'Subject', value: 'Colonial American Military History' },
            { label: 'Period', value: '1754–1764' },
            { label: 'ISBN-10', value: '0578950960' },
            { label: 'Availability', value: 'Amazon' },
        ],
        cta: { text: 'Buy on Amazon', link: 'https://www.amazon.com/dp/0578950960' },
    },
]
