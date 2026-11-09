// Storyblok block definitions, kept in the repo so they are versioned and reviewed like code.
// Push them to the space with: npm run storyblok:push   (needs STORYBLOK_PERSONAL_ACCESS_TOKEN in .env)
//
// Field names match the site's content types (src/types/*.ts); display names and descriptions are
// what Lee sees in the editor, so they use plain words.
//
// Kinds of blocks:
//   content type ("root")  a kind of story: a page, an article, a book
//   nestable               a block placed inside a list field: a page section, a timeline event

let pos = 0
const field = (type, display_name, extra = {}) => ({ type, display_name, pos: pos++, ...extra })
const text = (name, extra) => field('text', name, extra)
const textarea = (name, extra) => field('textarea', name, extra)
const bool = (name, extra) => field('boolean', name, extra)
const number = (name, extra) => field('number', name, extra)
const asset = (name, extra) => field('asset', name, { filetypes: ['images'], ...extra })
const link = (name, extra) => field('multilink', name, { allow_target_blank: true, ...extra })
const choice = (name, options, extra) =>
    field('option', name, { options: options.map(([value, label]) => ({ value, name: label })), ...extra })
const blocks = (name, allowed, extra) => field('bloks', name, { restrict_components: true, component_whitelist: allowed, ...extra })
const storyRef = (name, contentType, extra) =>
    field('option', name, { source: 'internal_stories', filter_content_type: [contentType], ...extra })
const storyRefs = (name, contentType, extra) =>
    field('options', name, { source: 'internal_stories', filter_content_type: [contentType], ...extra })

// Blocks that can appear inside article text and in a "Text and content" section
export const CONTENT_BLOCKS = ['quote', 'figure', 'callout', 'collapsible', 'timeline', 'factCards', 'dataList', 'dataTable']
const richText = (name, extra) =>
    field('richtext', name, { restrict_components: true, component_whitelist: CONTENT_BLOCKS, allow_target_blank: true, ...extra })

// Sections a page can be built from, in the order they appear in the "add section" menu
export const PAGE_SECTIONS = [
    'hero',
    'featured',
    'articleGrid',
    'authorCard',
    'bookPromo',
    'authorBio',
    'philosophyBlock',
    'pageCta',
    'contentSection',
]

const define = (name, display_name, schema, { root = false, preview_field, description } = {}) => {
    pos = 0
    return {
        name,
        display_name,
        description,
        is_root: root,
        is_nestable: !root,
        preview_field,
        schema: typeof schema === 'function' ? schema() : schema,
    }
}

export const components = [
    // ---------------------------------------------------------------- Content types
    define(
        'page',
        'Page',
        () => ({
            title: text('Page title', { required: true, description: 'Shown in the browser tab and search results' }),
            description: textarea('Search description', { description: 'One or two sentences for search results, about 155 characters' }),
            sections: blocks('Sections', PAGE_SECTIONS, { description: 'Drag to reorder' }),
        }),
        { root: true },
    ),
    define(
        'article',
        'Article',
        () => ({
            title: text('Title', { required: true }),
            subtitle: text('Subtitle', { description: 'Short line above the title, e.g. "Primary Source Research"' }),
            topic: storyRef('Topic', 'topic', { required: true, folder_slug: 'topics/' }),
            tags: text('Tags', { description: 'Separated by commas, e.g. Virginia, British Army' }),
            period: text('Period code', { description: 'Short code shown on cards without an image, e.g. 1677 or HUS' }),
            startYear: number('First year covered', { description: 'Used for sorting by period, e.g. 1677' }),
            image: asset('Main image'),
            excerpt: textarea('Summary', { required: true, description: 'Shown on cards and under the title' }),
            seoDescription: textarea('Search description', { description: 'Optional shorter summary for search results (about 155 characters)' }),
            body: richText('Article text', { description: 'Write or import from Word. Use the + button to insert a timeline, table, fact cards or other block' }),
            sources: blocks('Sources', ['source'], { description: 'One entry per work cited' }),
            readTime: text('Read time (fallback)', { description: 'Only used while the text is shorter than 200 words, e.g. "25 min read"' }),
        }),
        { root: true },
    ),
    define(
        'book',
        'Book',
        () => ({
            title: text('Title', { required: true }),
            subtitle: text('Subtitle'),
            author: text('Author', { default_value: 'Lee G. Offen' }),
            coverLabel: text('Badge', { description: 'Short label on the cover, e.g. "Available Now" or "Forthcoming"' }),
            status: text('Status line', { description: 'Shown above the title, e.g. "Published · Available Now"' }),
            coverImage: asset('Cover image'),
            excerpt: textarea('Summary', { required: true }),
            seoDescription: textarea('Search description', { description: 'Optional shorter summary for search results' }),
            description: richText('About the book'),
            details: blocks('Book details', ['detailRow'], { description: 'Publisher, format, period and so on' }),
            previewPages: field('multiasset', 'Preview pages', { filetypes: ['images'] }),
            ctaText: text('Main button text', { description: 'e.g. Buy on Amazon' }),
            ctaLink: link('Main button link'),
            secondaryCtaText: text('Second button text', { description: 'e.g. Read an Excerpt' }),
            secondaryCtaLink: link('Second button link'),
        }),
        { root: true },
    ),
    define(
        'topic',
        'Topic',
        () => ({
            name: text('Name', { required: true, description: 'e.g. Colonial History' }),
            gradientFrom: text('Card colour 1', { description: 'Hex colour for cards without an image, e.g. #243044' }),
            gradientTo: text('Card colour 2', { description: 'e.g. #5a1520' }),
        }),
        { root: true, description: 'Article topics. The story slug is used in links, e.g. /articles?topic=colonial-history' },
    ),
    define(
        'contactPage',
        'Contact page',
        () => ({
            title: text('Page title', { required: true }),
            description: textarea('Search description'),
            label: text('Small label above the heading', { default_value: 'Contact' }),
            heading: text('Heading', { required: true }),
            subheading: textarea('Text under the heading'),
            email: text('Email address shown under the form', { description: 'Optional' }),
        }),
        { root: true },
    ),
    define(
        'settings',
        'Site settings',
        () => ({
            logoTitle: text('Site name', { default_value: 'History Reconsidered' }),
            logoSubtitle: text('Site subtitle', { default_value: 'Military History & Research' }),
            navigation: blocks('Menu', ['navItem']),
            footerDescription: textarea('Footer text'),
            topicsTitle: text('Footer topics heading', { default_value: 'Topics' }),
            footerTopics: storyRefs('Footer topics', 'topic', { folder_slug: 'topics/' }),
            copyright: text('Copyright line', { description: 'Use {year} for the current year, e.g. © 2010–{year} History Reconsidered, LLC' }),
            copyrightNote: text('Copyright note'),
            authorName: text('Author name', { default_value: 'Lee G. Offen' }),
            authorRole: text('Author role', { description: 'Shown in the author box at the end of each article' }),
            authorBio: richText('Author bio (short)'),
            authorImage: asset('Author portrait'),
            authorInitials: text('Author initials', { description: 'Shown when there is no portrait' }),
        }),
        { root: true, description: 'One story for the whole site: menu, footer and the author box' },
    ),

    // ---------------------------------------------------------------- Page sections
    define('hero', 'Hero', () => ({
        label: text('Small label', { description: 'e.g. Est. 2010 · Military History Journal' }),
        title: text('Title', { required: true }),
        quote: textarea('Quote'),
        quoteAuthor: text('Who said it'),
        image: asset('Background image'),
        ctaText: text('Button text'),
        ctaLink: link('Button link'),
    }), { preview_field: 'title' }),
    define('featured', 'Featured article', () => ({
        label: text('Small label', { default_value: 'Featured' }),
        heading: text('Heading'),
        article: storyRef('Article', 'article', { required: true, folder_slug: 'articles/' }),
    }), { preview_field: 'heading' }),
    define('articleGrid', 'Article grid', () => ({
        label: text('Small label'),
        heading: text('Heading'),
        articles: storyRefs('Articles', 'article', { folder_slug: 'articles/', description: 'Leave empty to show all articles, newest first' }),
        limit: number('How many to show when empty', { description: 'Leave empty for all' }),
        showCategoryFilter: bool('Show topic filter'),
        ctaText: text('Button text'),
        ctaLink: link('Button link'),
    }), { preview_field: 'heading' }),
    define('authorCard', 'Author card', () => ({
        name: text('Name', { required: true }),
        role: text('Role'),
        bio: richText('Bio'),
        image: asset('Portrait'),
        initials: text('Initials', { description: 'Shown when there is no portrait' }),
        ctaText: text('Link text', { description: 'e.g. Read Full Bio' }),
        ctaLink: link('Link'),
    }), { preview_field: 'name' }),
    define('bookPromo', 'Book promotion', () => ({
        label: text('Small label', { description: 'e.g. Upcoming Book' }),
        book: storyRef('Book', 'book', { folder_slug: 'books/', description: 'Title, cover and summary come from the book' }),
        ctaText: text('Button text', { default_value: 'Learn More' }),
    }), { preview_field: 'label' }),
    define('authorBio', 'Author biography', () => ({
        label: text('Small label', { default_value: 'About the Author' }),
        name: text('Name', { required: true }),
        role: text('Role'),
        bio: richText('Biography'),
        image: asset('Portrait'),
        initials: text('Initials'),
        credentials: blocks('Credentials', ['credential']),
    }), { preview_field: 'name' }),
    define('philosophyBlock', 'Large quote', () => ({
        quote: textarea('Quote', { required: true }),
        body: richText('Text under the quote'),
    }), { preview_field: 'quote' }),
    define('pageCta', 'Call to action', () => ({
        label: text('Small label'),
        heading: text('Heading', { required: true }),
        subtext: textarea('Text'),
        ctaText: text('Button text'),
        ctaLink: link('Button link'),
    }), { preview_field: 'heading' }),
    define('contentSection', 'Text and content', () => ({
        label: text('Small label'),
        heading: text('Heading'),
        body: richText('Content', { description: 'Text, plus any block: timeline, table, fact cards, figure…' }),
    }), { preview_field: 'heading' }),

    // ---------------------------------------------------------------- Content blocks (inside text)
    define('quote', 'Quote or primary source', () => ({
        text: textarea('Quote', { required: true }),
        cite: text('Source or who said it', { description: 'e.g. Commissioners to the King, June 1677' }),
    }), { preview_field: 'cite' }),
    define('figure', 'Image', () => ({
        image: asset('Image'),
        alt: text('Description for screen readers', { required: true, description: 'What the image shows, in a sentence' }),
        caption: text('Caption'),
        credit: text('Credit'),
        aspect: choice('Shape', [['landscape', 'Landscape'], ['portrait', 'Portrait'], ['square', 'Square']], { default_value: 'landscape' }),
    }), { preview_field: 'caption' }),
    define('callout', 'Callout box', () => ({
        variant: choice('Kind', [['note', 'Note'], ['insight', 'Open question'], ['reading', 'How to read this article']], { default_value: 'note', required: true }),
        title: text('Title', { description: 'Optional; a default title is used for each kind' }),
        text: textarea('Text', { required: true }),
    }), { preview_field: 'title' }),
    define('collapsible', 'Collapsible section', () => ({
        title: text('Title', { required: true }),
        body: richText('Content'),
        open: bool('Open by default'),
    }), { preview_field: 'title' }),
    define('timeline', 'Timeline', () => ({
        periods: blocks('Periods', ['timelinePeriod'], { description: 'Each period appears in the contents list and can be collapsed' }),
    })),
    define('timelinePeriod', 'Timeline period', () => ({
        label: text('Years', { required: true, description: 'e.g. 1568–1573' }),
        title: text('Name', { description: 'e.g. Open Revolt' }),
        collapsed: bool('Start collapsed'),
        events: blocks('Events', ['timelineEvent', 'timelineQuote']),
    }), { preview_field: 'label' }),
    define('timelineEvent', 'Event', () => ({
        kind: choice('Kind', [['event', 'General event'], ['battle', 'Battle or siege'], ['political', 'Political event'], ['treaty', 'Treaty or peace']], { default_value: 'event' }),
        date: text('Date', { description: 'e.g. 23 May 1568' }),
        title: text('Title', { description: 'Optional' }),
        text: textarea('Text', { description: 'Optional: a date on its own can mark the start of a period' }),
    }), { preview_field: 'date' }),
    define('timelineQuote', 'Quote in timeline', () => ({
        text: textarea('Quote', { required: true }),
        cite: text('Who said it'),
    }), { preview_field: 'cite' }),
    define('factCards', 'Fact cards', () => ({
        cards: blocks('Cards', ['factCard']),
    })),
    define('factCard', 'Fact card', () => ({
        title: text('Title', { required: true }),
        badge: text('Badge', { description: 'Small label above the title' }),
        meta: text('Line under the title', { description: 'e.g. Yellow saltire on black background' }),
        rows: blocks('Facts', ['detailRow']),
        text: textarea('Text'),
    }), { preview_field: 'title' }),
    define('dataList', 'Figures list', () => ({
        title: text('Title', { required: true }),
        note: text('Note'),
        bars: bool('Show bars', { description: 'Draws numeric values to scale' }),
        rows: blocks('Rows', ['dataRow']),
        totalLabel: text('Total label', { description: 'Optional, e.g. Total officers and men' }),
        totalValue: text('Total value'),
    }), { preview_field: 'title' }),
    define('dataTable', 'Table', () => ({
        caption: text('Title', { required: true }),
        table: field('table', 'Table', { description: 'The first row is the header; the first column is row labels' }),
        note: text('Note'),
    }), { preview_field: 'caption' }),

    // ---------------------------------------------------------------- Small helpers
    define('source', 'Source', () => ({
        text: textarea('Citation', { required: true }),
        link: link('Online copy', { description: 'Optional link to a scan or catalogue record' }),
    }), { preview_field: 'text' }),
    define('detailRow', 'Label and value', () => ({
        label: text('Label', { required: true }),
        value: text('Value', { required: true }),
    }), { preview_field: 'label' }),
    define('dataRow', 'Row', () => ({
        label: text('Label', { required: true }),
        value: text('Value', { required: true, description: 'Numbers are drawn as bars when the list has bars' }),
        detail: text('Detail', { description: 'Small text under the label' }),
    }), { preview_field: 'label' }),
    define('credential', 'Credential', () => ({
        icon: choice('Icon', [['medal', 'Medal'], ['graduation-cap', 'Graduation cap'], ['pen', 'Pen'], ['star', 'Star'], ['book-open', 'Book'], ['shield', 'Shield']], { default_value: 'medal' }),
        label: text('Small label', { required: true }),
        title: text('Title', { required: true }),
        description: textarea('Description'),
    }), { preview_field: 'title' }),
    define('navItem', 'Menu item', () => ({
        label: text('Label', { required: true }),
        link: link('Link', { required: true }),
    }), { preview_field: 'label' }),
]
