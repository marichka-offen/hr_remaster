import type { Article } from '@app-types/article'

// Copy is taken from the designs/ mocks. Bodies are trimmed placeholders until real content lands.

const author: Article['author'] = {
    name: 'Lee G. Offen',
    role: 'Military Historian & Retired Soldier',
    initials: 'LO',
    bio: [
        {
            type: 'paragraph',
            text: 'A lifelong student of military history and a retired U.S. Army Major, Lee brings both academic rigor and personal experience to the writing. Every article is thoroughly sourced, respecting the intelligence of the reader.',
        },
    ],
}

const topics = {
    colonial: { category: 'Colonial History', topicSlug: 'colonial-history', gradientFrom: '#243044', gradientTo: '#5a1520' },
    european: { category: 'European Wars', topicSlug: 'european-wars', gradientFrom: '#1a2332', gradientTo: '#7d5c17' },
    britishIsles: { category: 'British Isles', topicSlug: 'british-isles', gradientFrom: '#243044', gradientTo: '#8b2635' },
    medieval: { category: 'Medieval', topicSlug: 'medieval', gradientFrom: '#5a1520', gradientTo: '#1a2332' },
    ww1: { category: 'World War I', topicSlug: 'world-war-i', gradientFrom: '#1a2332', gradientTo: '#8b2635' },
} as const

export const articles: Article[] = [
    {
        title: 'The Czechoslovak Legion, 1914–1920',
        slug: 'czechoslovak-legion',
        subtitle: 'European Military History · WWI Era',
        period: '1914',
        ...topics.ww1,
        tags: ['WWI'],
        excerpt:
            'The extraordinary story of Czech and Slovak immigrants who formed a military organization under Russian officers — and earned nationhood for the Czechoslovak people through an epic 4,000-mile journey across Russia.',
        readTime: '15 min read',
        layoutType: 'prose',
        author,
        body: [
            {
                type: 'paragraph',
                text: 'When war broke out in 1914, Czech and Slovak immigrants living in the Russian Empire petitioned the Tsar to let them fight against Austria-Hungary. What began as a single company of volunteers grew into an army of tens of thousands.',
            },
            { type: 'heading', level: 2, text: 'The Družina', id: 'druzina' },
            {
                type: 'paragraph',
                text: 'The first unit, the Česká družina, was raised in Kiev in the autumn of 1914 and served largely as scouts and interpreters on the Galician front.',
            },
            {
                type: 'quote',
                text: 'None shall pass us by in silence.',
                cite: 'Legionnaire motto',
            },
            { type: 'heading', level: 2, text: 'The Anabasis', id: 'anabasis' },
            {
                type: 'paragraph',
                text: 'After the Bolshevik revolution the Legion set out to reach the Western Front the long way round — across Siberia to Vladivostok — seizing much of the Trans-Siberian Railway along the way.',
            },
        ],
    },
    {
        title: 'British Regulars in Virginia, 1677–1682',
        slug: 'british-regulars-virginia',
        subtitle: 'Primary Source Research',
        period: '1677',
        ...topics.colonial,
        tags: ['Virginia', 'British Army'],
        excerpt:
            "The formation, deployment and dissolution of Jeffreys' Regiment of Foot — one of the first British regular army units sent to colonial America.",
        readTime: '25 min read',
        layoutType: 'prose',
        author,
        body: [
            { type: 'heading', level: 2, text: 'The Call to Arms', id: 'call-to-arms' },
            {
                type: 'paragraph',
                text: 'In late September 1676, the ship Rebecca arrived in London with dispatches from the Vice Governor of Virginia, Sir William Berkeley, with word of a rebellion by the colonists. The Governor, Thomas Lord Culpepper, had been the governor for life since 1675 but had not yet even seen the colony.',
            },
            {
                type: 'paragraph',
                text: "Acting with uncharacteristic speed, by 1 October King Charles II had resolved to send a thousand men to quell the mutineers. For the time, this was a major expedition incurring considerable cost for a government always short of money. Within four more days, commissions for five foot companies — one each from existing standing regiments — were signed, and Jeffreys' Regiment of Foot came into being.",
            },
        ],
    },
    {
        title: 'The War of Three Kingdoms in Ireland, 1641–1648',
        slug: 'war-of-three-kingdoms-ireland',
        subtitle: '17th Century',
        period: 'IRL',
        ...topics.britishIsles,
        tags: ['Irish History'],
        excerpt:
            'The Irish rebellion, the Scottish Army of Ulster, and the tangled web of Catholic, Protestant, Royalist, and Parliamentary factions that tore Ireland apart.',
        readTime: '45 min read',
        layoutType: 'prose',
        author,
        body: [
            { type: 'heading', level: 2, text: 'Background', id: 'background' },
            {
                type: 'paragraph',
                text: 'Ireland in 1641 was home to four overlapping communities — the native Irish, the Old English, the Antrim Scots and the newer English and Scottish settlers — each with its own loyalties and grievances.',
            },
        ],
    },
    {
        title: 'The Eighty Years War',
        slug: 'eighty-years-war',
        subtitle: 'Early Modern Europe',
        period: 'NL',
        ...topics.european,
        tags: ['Dutch History'],
        excerpt:
            'The Dutch revolt against Hapsburg Spain — a conflict spanning eight decades that birthed a nation, transformed European warfare, and reshaped the balance of power across the continent.',
        readTime: '60 min read',
        layoutType: 'timeline',
        author,
        body: [
            {
                type: 'paragraph',
                text: 'Between 1568 and 1648 the seventeen provinces of the Low Countries fought, negotiated and fought again for independence from Spain.',
            },
        ],
    },
    {
        title: 'The Hussites',
        slug: 'the-hussites',
        subtitle: '15th Century Bohemia',
        period: 'HUS',
        ...topics.medieval,
        tags: ['Medieval'],
        excerpt:
            'The revolutionary military tactics and religious fervor of the Hussite Wars in 15th century Bohemia.',
        readTime: '14 min read',
        layoutType: 'prose',
        author,
        body: [
            { type: 'heading', level: 2, text: 'Background', id: 'background' },
            {
                type: 'paragraph',
                text: 'The execution of Jan Hus at the Council of Constance in 1415 set Bohemia alight. Within five years the Hussites were fielding armies that defeated crusade after crusade.',
            },
        ],
    },
    {
        title: 'The British Military Presence in America, 1660–1720',
        slug: 'british-military-presence-america',
        subtitle: 'British Army · Caribbean',
        period: '1660',
        ...topics.colonial,
        tags: ['British Army'],
        excerpt:
            "Regular regiments, independent companies, and militia forces across the North American colonies and the Caribbean — a comprehensive survey of Britain's early military footprint.",
        readTime: '35 min read',
        layoutType: 'timeline',
        author,
        body: [
            {
                type: 'paragraph',
                text: 'Before the great colonial wars of the eighteenth century, Britain kept only a thin scattering of regular troops in the Americas.',
            },
        ],
    },
    {
        title: "Gooch's American Regiment, 1740–1742",
        slug: 'goochs-american-regiment',
        subtitle: 'Colonial America',
        period: '1740',
        ...topics.colonial,
        tags: ['Colonial America'],
        excerpt:
            'A reconsideration of one of the earliest American military formations and its significance in colonial military history.',
        readTime: '8 min read',
        layoutType: 'prose',
        author,
        body: [
            {
                type: 'paragraph',
                text: 'Raised in nine North American colonies and placed on the British Army Establishment as a Regiment of Foot, Gooch’s Regiment was the first military formation to be described as “American.”',
            },
        ],
    },
    {
        title: 'Scottish Military Traditions',
        slug: 'scottish-military-traditions',
        subtitle: 'British Isles',
        period: 'SCT',
        ...topics.britishIsles,
        tags: ['Scottish History'],
        excerpt: 'From Highland clans to renowned regiments — the martial heritage that shaped Scotland.',
        readTime: '11 min read',
        layoutType: 'prose',
        author,
        body: [
            {
                type: 'paragraph',
                text: 'Scotland exported soldiers long before it raised its own famous regiments.',
            },
        ],
    },
]
