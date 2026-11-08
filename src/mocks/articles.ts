import type { Article } from '@app-types/article'
import { eightyYearsWarBody, hussitesFigures, irelandBody, virginiaBody, virginiaSources } from './article-bodies'

// Titles, summaries and bodies are taken from the designs/ mocks. Where a mock has no body text,
// the body is an explicit placeholder rather than invented text.

const author: Article['author'] = {
    name: 'Lee G. Offen',
    role: 'Military Historian & Retired Soldier',
    initials: 'LO',
    bio: [
        {
            type: 'paragraph',
            text: 'A lifelong student of military history and a retired soldier, Lee brings both academic rigor and personal experience to his writing. Every article is thoroughly sourced, respecting the intelligence of the reader.',
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
        // Placeholder: no text for this article exists in designs/ yet
        body: [{ type: 'paragraph', text: 'Article text to come.' }],
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
        body: virginiaBody,
        sources: virginiaSources,
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
        body: irelandBody,
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
        body: eightyYearsWarBody,
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
        // Text from designs/hussites-redesign.html
        body: [
            { type: 'heading', level: 2, text: 'Background', id: 'background' },
            {
                type: 'paragraph',
                text: 'The Kingdom of Bohemia was predominantly Slavic in ethnicity, having been established by the Slavs who settled in what had been a Celtic region of Eastern Europe. In the 13th century, the presence of large silver deposits and the willingness of its rulers to encourage ethnic Germans to exploit and develop this wealth resulted in a large German minority in Bohemia. The Germans came to occupy positions of prominence in the trade guilds and churches in the urban areas like Prague, Kutná Hora (Kuttenberg), and Německý Brod (Deutschbrod). This influx of Germans, and their subsequent prominent role, created considerable resentment in the Slavic native population.',
            },
            hussitesFigures[0],
            { type: 'heading', level: 2, text: 'Jan Hus (1371–1415)', id: 'jan-hus' },
            hussitesFigures[1],
            {
                type: 'paragraph',
                text: 'Jan Hus, an ethnic Slav, graduated from Charles University (Univerzita Karlova) in Prague and in 1398 began lecturing there. He served as rector from 1402–03 and 1409–10 and was an extremely popular clergyman among the Slavs, both noble and peasant, preaching to all on the hills outside Prague. He became a proponent of the ideas of the English reformer and theologian John Wycliffe. Hus, like Wycliffe, denounced the immorality of clergy, the sale of indulgences, the accumulation of wealth by the clergy and the church, and saw the Bible as the final authority in ecclesiastical matters.',
            },
            {
                type: 'paragraph',
                text: 'He was a proponent of the laity taking communion in both kinds — that is to say the bread and the wine — at a time when only the clergy received communion in both kinds. He translated the Bible into the language of the people and said "Women were made in the image of God and should fear no man," setting the stage for women to preach at Hussite services, participate in governing councils, and fight beside their men in battle. It was his teaching and writing about these radical ideas that brought the attention of the Pope to Jan Hus. Hus was commanded by one of (at the time) two Popes to appear before a General Council of the Church in November 1414 at Constance in Germany.',
            },
            {
                type: 'paragraph',
                text: "The Holy Roman Emperor, Sigismund, granted him a safe conduct to travel from Prague to Constance and back. Upon his arrival at Constance, Hus was immediately imprisoned and the Council convened to try him for heresy. A group of 452 nobles from the Kingdom of Bohemia and Poland-Lithuania attempted to intercede on Hus's behalf, but to no avail.",
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
        // Text from designs/british-military-presence-redesign.html
        body: [
            { type: 'heading', level: 2, text: 'Background', id: 'background' },
            {
                type: 'paragraph',
                text: 'The presence of British regular army forces in the American colonies in the late 17th century and early 18th century was sporadic at best. This period in which Britain was becoming an empire at war intermittently with other European Powers, was a time when defending colonial possessions was becoming, but was not yet, a major priority.',
            },
            { type: 'heading', level: 3, text: 'Regular Regiments', id: 'regular-regiments' },
            {
                type: 'paragraph',
                text: 'Regular regiments, in whole or in part, were involved in both garrison and expeditionary missions in North America and the Caribbean. How the regiments were equipped was a function of how much the regimental commander was willing to spend on his soldiers and where the British army was generally in its transition away from pike to bayonet, from matchlock to firelock, bandoleer of charges to cartridge boxes.',
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
        // Placeholder: no text for this article exists in designs/ yet
        body: [{ type: 'paragraph', text: 'Article text to come.' }],
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
        // Placeholder: no text for this article exists in designs/ yet
        body: [{ type: 'paragraph', text: 'Article text to come.' }],
    },
]
