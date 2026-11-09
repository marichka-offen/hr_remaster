"""Converts the old site's articles (Vue templates) into the new site's content model.

Usage:
    gh repo clone marichka-offen/history-reconsidered /tmp/old-site -- --depth 1
    python3 scripts/import-old-site.py /tmp/old-site

Writes src/mocks/imported/articles.json (read by src/mocks/articles.ts) and prints a report of anything
that needs a human look. Conversion rules are listed in docs/CONTENT-INVENTORY.md.
"""

import html
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'src/mocks/imported/articles.json'
# Images stay in the public old-site repo until their rights are checked and they move to Storyblok
IMAGE_BASE = 'https://raw.githubusercontent.com/marichka-offen/history-reconsidered/master/src/assets/images/'

# file -> (new slug, old URL path, topic slug)
ARTICLES = {
    'ColonialHistory/BritAmerica.vue': ('british-military-presence-america', '/colonial-history/british-america', 'colonial-history'),
    'ColonialHistory/RegularsVA.vue': ('british-regulars-virginia', '/colonial-history/regulars-va', 'colonial-history'),
    'ColonialHistory/MarylandForces.vue': ('maryland-forces-1754-1764', '/colonial-history/maryland-forces', 'colonial-history'),
    'ColonialHistory/VARangers.vue': ('virginia-ranger-companies', '/colonial-history/va-rangers', 'colonial-history'),
    'ColonialHistory/Severn.vue': ('battle-of-the-severn', '/colonial-history/severn-battle', 'colonial-history'),
    'KentMilitia/KentMilitia.vue': ('kent-county-militia', '/kent-militia', 'colonial-history'),
    'Maryland/Maryland.vue': ('military-history-of-maryland', '/maryland', 'colonial-history'),
    'CzechoSlovakLegion/CzechoslovakLegion.vue': ('czechoslovak-legion', '/czechoslovak-legion', 'world-war-i'),
    'DutchHistory/EightyYearsWar.vue': ('eighty-years-war', '/dutch-history/eighty-years-war', 'dutch-history'),
    'DutchHistory/NewNetherlans.vue': ('dutch-military-new-netherland', '/dutch-history/new-netherlands', 'dutch-history'),
    'Hussites/Hussites.vue': ('the-hussites', '/hussites', 'medieval'),
    'IrishHistory/ThreeKingdoms.vue': ('war-of-three-kingdoms-ireland', '/irish-history/three-kingdoms', 'irish-history'),
    'IrishHistory/ONeilRebelion.vue': ('oneils-rebellion', '/irish-history/oneils-rebelion', 'irish-history'),
    'IrishHistory/Ireland.vue': ('ireland-1652-1688', '/irish-history/ireland-1652-1688', 'irish-history'),
    'IrishHistory/WilliamiteWar.vue': ('williamite-war', '/irish-history/williamite-war', 'irish-history'),
    'IrishHistory/IrishMilEstabl.vue': ('irish-military-establishment', '/irish-history/irish-military', 'irish-history'),
    'ScottishHistory/MacKay.vue': ('mackays-regiment', '/scottish-history/mackeys-regiment', 'scottish-history'),
    'ScottishHistory/Dumbarton.vue': ('dumbartons-regiment', '/scottish-history/dumbartons-regiment', 'scottish-history'),
    'ScottishHistory/Stuart.vue': ('house-of-stuart', '/scottish-history/house-stuart', 'scottish-history'),
}

INLINE = {'b': 'strong', 'strong': 'strong', 'i': 'em', 'em': 'em', 'sup': 'sup', 'sub': 'sub', 'a': 'a', 'span': None, 'small': None, 'u': None}
VOID = {'br', 'img', 'hr', 'input', 'meta', 'link'}
# A bold line opener counts as a date if it starts with a digit or c./circa, or with a month, season or
# early/late/mid followed by a number ("Jan 1568", "Spring 1566"), so a name like "Jan Hus" isn't a date
DATE = re.compile(r'^(c\.|ca\.|circa\s|\d|(early|late|mid|spring|summer|autumn|fall|winter|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?[\s-]+\d)', re.I)

# Long chronologies with no headings of their own are split into eras, taken from the design mocks.
# Each entry: (last year in the era, label, name)
ERAS = {
    'eighty-years-war': [
        (1554, 'Before 1555', 'Background'),
        (1567, '1555–1567', 'Gathering Storm'),
        (1573, '1568–1573', 'Open Revolt'),
        (1579, '1574–1579', 'Independence Takes Shape'),
        (1588, '1580–1588', 'Survival & Sovereignty'),
        (1620, '1589–1620', "Maurice's Campaigns & the Twelve Years Truce"),
        (9999, '1621–1648', 'Final Phase & Peace of Westphalia'),
    ],
}


def split_into_eras(blocks, eras):
    used = set()  # an era interrupted by a paragraph continues in the next timeline block
    for block in blocks:
        if block.get('type') != 'timeline':
            continue
        groups, current, era_index = [], None, 0
        for group in block['groups']:
            for event in group['events']:
                year = re.search(r'\b(1[0-9]{3})\b', event.get('date') or '')
                if year:
                    era_index = next(i for i, (last, _, _) in enumerate(eras) if int(year.group(1)) <= last)
                _, label, title = eras[era_index]
                if current is None or current['era'] != label:
                    shown = f'{label} (continued)' if label in used else label
                    used.add(label)
                    current = {'era': label, 'label': shown, 'title': title, 'events': []}
                    groups.append(current)
                current['events'].append(event)  # a quote stays with the event before it
        for group in groups:
            group.pop('era')
            group['collapsed'] = group['label'] != eras[0][1]  # only the first era starts open
        block['groups'] = groups
SOURCES_HEADING = re.compile(r'source|bibliograph|research resources|references', re.I)


# ---------------------------------------------------------------- Minimal DOM

class Node:
    def __init__(self, tag, attrs=None, parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, dict(attrs or {}), parent, []


class Builder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('root')
        self.current = self.root

    def handle_starttag(self, tag, attrs):
        node = Node(tag.lower(), attrs, self.current)
        self.current.children.append(node)
        if node.tag not in VOID:
            self.current = node

    def handle_startendtag(self, tag, attrs):
        self.current.children.append(Node(tag.lower(), attrs, self.current))

    def handle_endtag(self, tag):
        node = self.current
        while node is not self.root and node.tag != tag.lower():
            node = node.parent
        if node is not self.root:
            self.current = node.parent

    def handle_data(self, data):
        self.current.children.append(data)


def text_of(node):
    if isinstance(node, str):
        # Line wraps in the source files mean nothing; only <br> is a real break
        return re.sub(r'\s+', ' ', node)
    if node.tag == 'br':
        return '\n'
    return ''.join(text_of(child) for child in node.children)


def clean(value):
    # Plain text has no line breaks; <br> survives only in the html version
    return re.sub(r'\s+', ' ', value.replace('\u00a0', ' ')).strip()


def inline_html(nodes):
    out = []
    for node in nodes:
        if isinstance(node, str):
            out.append(html.escape(re.sub(r'\s+', ' ', node), quote=False))
        elif node.tag == 'br':
            out.append('\n')
        elif node.tag in INLINE:
            inner = inline_html(node.children)
            tag = INLINE[node.tag]
            if tag == 'a':
                href = node.attrs.get('href', '')
                out.append(f'<a href="{html.escape(href)}">{inner}</a>' if re.match(r'^(https?:|mailto:)', href) else inner)
            elif tag:
                out.append(f'<{tag}>{inner}</{tag}>' if inner.strip() else inner)
            else:
                out.append(inner)
        else:
            out.append(inline_html(node.children))
    return ''.join(out)


def paragraph(nodes):
    """One paragraph block from inline nodes; html only when it carries formatting."""
    text = clean(''.join(text_of(n) for n in nodes))
    if not text:
        return None
    markup = re.sub(r' *\n *', '<br>', re.sub(r'[ \t]+', ' ', inline_html(nodes))).strip()
    plain_markup = html.escape(text, quote=False)
    block = {'type': 'paragraph', 'text': text}
    if markup != plain_markup:
        block['html'] = markup
    return block


def split_lines(nodes):
    """Splits inline content on <br> into lines (lists of nodes). Empty lines mark breaks."""
    lines, line = [], []
    for node in nodes:
        if not isinstance(node, str) and node.tag == 'br':
            lines.append(line)
            line = []
        else:
            line.append(node)
    lines.append(line)
    return lines


def leading_bold(line):
    """Returns (date, rest) when a line starts with a bold date, else None."""
    items = [n for n in line if not (isinstance(n, str) and not n.strip())]
    if not items or isinstance(items[0], str) or items[0].tag not in ('b', 'strong'):
        return None
    date = clean(text_of(items[0])).rstrip(':,')
    if not date or not DATE.match(date) or len(date) > 40:
        return None
    rest = items[1:]
    return date, rest


# ---------------------------------------------------------------- Article conversion

class Converter:
    def __init__(self, rel):
        self.rel = rel
        self.blocks, self.sources, self.warnings = [], [], []
        self.title = None
        self.section_heading = ''
        self.in_sources = False
        self.timeline = None  # open timeline group
        self.pending_figures = []
        self.last_quote = None
        self.images = 0

    # Timelines --------------------------------------------------------
    def open_timeline(self):
        if self.timeline is None:
            # Period labels are subheadings, so a chronology needs a section heading above it
            if not any(b.get('type') == 'heading' for b in self.blocks):
                self.blocks.append({'type': 'heading', 'level': 2, 'text': 'Chronology'})
            self.timeline = {'label': self.section_heading or 'Chronology', 'events': []}

    def close_timeline(self):
        if self.timeline and self.timeline['events']:
            previous = self.blocks[-1] if self.blocks else None
            # Label the period by the years it covers ("1754–1764"); fall back to the section heading
            years = [int(y) for e in self.timeline['events'] for y in re.findall(r'\b(1[0-9]{3})\b', e.get('date') or '')]
            label = (f'{min(years)}–{max(years)}' if min(years) != max(years) else str(min(years))) if years else self.timeline['label']
            group = {'label': label, 'events': self.timeline['events']}
            if previous and previous.get('type') == 'timeline':
                previous['groups'].append(group)
            else:
                self.blocks.append({'type': 'timeline', 'groups': [group]})
        self.timeline = None
        self.blocks.extend(self.pending_figures)
        self.pending_figures = []

    # Blocks -----------------------------------------------------------
    def add(self, block):
        if block:
            self.close_timeline()
            self.blocks.append(block)

    def heading(self, node, level):
        text = clean(text_of(node))
        if not text:
            return
        # The title is the first h2, or the first h3 on pages that start with one
        if self.title is None and (node.tag == 'h2' or (node.tag == 'h3' and not self.blocks)):
            self.title = text
            return
        self.close_timeline()
        self.section_heading = text
        self.in_sources = bool(SOURCES_HEADING.search(text))
        if self.in_sources:
            return  # sources get their own section on the new site
        self.blocks.append({'type': 'heading', 'level': level, 'text': text.rstrip(':')})
        self.last_quote = None

    def figure(self, node, caption=None):
        src = node.attrs.get('src', '')
        if src.startswith('@/assets/images/'):
            src = IMAGE_BASE + src[len('@/assets/images/'):]
        elif not src.startswith('http'):
            self.warnings.append(f'image with unknown path: {src}')
            return
        self.images += 1
        block = {'type': 'figure', 'src': src, 'alt': clean(node.attrs.get('alt', '')) or (caption or '')}
        if caption:
            block['caption'] = caption
        # Images inside a chronology are placed after it, since a timeline can't hold images
        (self.pending_figures if self.timeline else self.blocks).append(block)

    def quote(self, node):
        text = clean(text_of(node))
        if not text:
            return
        block = {'type': 'quote', 'text': text}
        markup = clean(inline_html(node.children)).replace('\n', '<br>')
        if markup != html.escape(text, quote=False):
            block['html'] = markup
        if self.timeline is not None:
            event = {'kind': 'quote', 'text': text}
            self.timeline['events'].append(event)
            self.last_quote = event
        else:
            self.add(block)
            self.last_quote = block

    def cite(self, node):
        text = clean(text_of(node)).lstrip('–—- ').strip()
        if self.last_quote is not None and 'cite' not in self.last_quote:
            self.last_quote['cite'] = text
        elif text:
            self.add({'type': 'paragraph', 'text': text, 'html': f'<em>{html.escape(text, quote=False)}</em>'})
        self.last_quote = None

    def list_item(self, node):
        text = clean(text_of(node))
        if not text:
            return
        if self.in_sources:
            self.sources.append(text)
            return
        markup = clean(inline_html(node.children)).replace('\n', '<br>')
        item = {'text': text}
        if markup != html.escape(text, quote=False):
            item['html'] = markup
        previous = self.blocks[-1] if self.blocks and self.timeline is None else None
        if previous and previous.get('type') == 'list':
            previous['items'].append(item)
        else:
            self.add({'type': 'list', 'items': [item]})

    def table(self, node):
        rows = []
        def walk(n):
            for child in n.children:
                if isinstance(child, Node):
                    if child.tag == 'tr':
                        rows.append([clean(text_of(c)) for c in child.children if isinstance(c, Node) and c.tag in ('td', 'th')])
                    else:
                        walk(child)
        walk(node)
        rows = [r for r in rows if any(r)]
        if not rows:
            return
        caption = self.section_heading or 'Table'
        self.add({'type': 'table', 'caption': caption, 'columns': rows[0], 'rows': rows[1:]})

    def inline_run(self, nodes):
        """A run of inline content (a <p> or loose text): chronology lines or paragraphs."""
        lines = split_lines(nodes)
        paragraph_buffer = []

        def flush_paragraph():
            if paragraph_buffer:
                joined = []
                for i, line in enumerate(paragraph_buffer):
                    if i:
                        joined.append(Node('br'))
                    joined.extend(line)
                block = paragraph(joined)
                if block:
                    self.add(block)
                paragraph_buffer.clear()

        for line in lines:
            if not ''.join(text_of(n) for n in line).strip():
                flush_paragraph()
                continue
            dated = leading_bold(line)
            if dated:
                flush_paragraph()
                date, rest = dated
                self.open_timeline()
                text = clean(''.join(text_of(n) for n in rest)).lstrip(',:– ').strip()
                self.timeline['events'].append({'date': date, 'text': text})
            elif self.timeline is not None and self.timeline['events'] and self.timeline['events'][-1].get('date'):
                # A plain line inside a chronology continues the previous event (often a list of units)
                event = self.timeline['events'][-1]
                extra = clean(''.join(text_of(n) for n in line))
                event['text'] = f"{event['text']}; {extra}" if event['text'] else extra
            else:
                paragraph_buffer.append(line)
        flush_paragraph()

    def walk(self, node):
        inline_buffer = []

        def flush_inline():
            if inline_buffer and ''.join(text_of(n) for n in inline_buffer).strip():
                self.inline_run(list(inline_buffer))
            inline_buffer.clear()

        children = node.children
        i = 0
        while i < len(children):
            child = children[i]
            if isinstance(child, str) or child.tag in INLINE or child.tag == 'br':
                inline_buffer.append(child)
                i += 1
                continue
            flush_inline()
            tag = child.tag
            if tag in ('h1', 'h2', 'h3', 'h4'):
                self.heading(child, 2 if tag in ('h2', 'h3') else 3)
            elif tag == 'h5':
                text = clean(text_of(child))
                if text:
                    self.add({'type': 'paragraph', 'text': text, 'html': f'<strong>{html.escape(text, quote=False)}</strong>'})
            elif tag == 'h6':
                self.cite(child)
            elif tag == 'blockquote':
                self.quote(child)
            elif tag == 'img':
                # Caption: an <h5> inside the <i> (or directly) that follows the image
                caption = None
                j = i + 1
                while j < len(children) and isinstance(children[j], str) and not children[j].strip():
                    j += 1
                if j < len(children) and isinstance(children[j], Node):
                    nxt = children[j]
                    h5 = nxt if nxt.tag == 'h5' else next((c for c in nxt.children if isinstance(c, Node) and c.tag == 'h5'), None) if nxt.tag in ('i', 'em', 'div', 'figcaption') else None
                    if h5 is not None:
                        caption = clean(text_of(h5))
                        i = j
                self.figure(child, caption)
            elif tag == 'li':
                self.list_item(child)
            elif tag == 'table':
                self.table(child)
            elif tag == 'p':
                if any(isinstance(c, Node) and c.tag in ('img', 'blockquote', 'table', 'h3', 'h4', 'h5', 'h6', 'li') for c in child.children):
                    self.walk(child)
                else:
                    self.inline_run(child.children)
            elif tag in ('hr', 'script', 'style', 'router-link'):
                pass
            elif tag == 'slider':
                self.slider()
            else:
                self.walk(child)  # div, section, ul, ol, i wrapping blocks...
            i += 1
        flush_inline()

    def slider(self):
        # The Czechoslovak Legion page shows img1–img9 in a slider: "images from my personal collection"
        for n in range(1, 10):
            self.blocks.append({
                'type': 'figure',
                'src': f'{IMAGE_BASE}CzechoslovakLegion/img{n}.jpg',
                'alt': 'Photograph from Lee G. Offen’s collection, Czechoslovak Legion',
                'credit': 'From the author’s collection',
            })
            self.images += 1


def normalise_headings(blocks):
    """Subheadings that come before any section heading become section headings, so no level is skipped."""
    for block in blocks:
        if block.get('type') == 'heading':
            if block['level'] == 2:
                return
            block['level'] = 2


def convert(path, rel):
    source = path.read_text()
    template = re.search(r'<template>(.*)</template>', source, re.S).group(1)
    builder = Builder()
    builder.feed(template)
    converter = Converter(rel)
    converter.walk(builder.root)
    converter.close_timeline()
    normalise_headings(converter.blocks)
    return converter


def excerpt_from(blocks, limit=220):
    for block in blocks:
        if block.get('type') == 'paragraph' and len(block['text']) > 80:
            text = block['text']
            if len(text) <= limit:
                return text
            cut = text[:limit]
            end = max(cut.rfind('. '), cut.rfind('? '))
            return cut[: end + 1] if end > 80 else cut.rsplit(' ', 1)[0] + '…'
    return ''


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    views = Path(sys.argv[1]) / 'src/views/HistoryArticles'
    articles, report = [], []
    for rel, (slug, old_path, topic) in ARTICLES.items():
        c = convert(views / rel, rel)
        if slug in ERAS:
            split_into_eras(c.blocks, ERAS[slug])
        title = c.title or slug
        year = re.search(r'\b(1[0-9]{3})\b', title)
        counts = {}
        for b in c.blocks:
            counts[b['type']] = counts.get(b['type'], 0) + 1
        events = sum(len(g['events']) for b in c.blocks if b['type'] == 'timeline' for g in b['groups'])
        words = sum(len(b.get('text', '').split()) for b in c.blocks) + sum(
            len(e['text'].split()) for b in c.blocks if b['type'] == 'timeline' for g in b['groups'] for e in g['events'])
        articles.append({
            'slug': slug,
            'oldPath': old_path,
            'title': title,
            'topicSlug': topic,
            'startYear': int(year.group(1)) if year else None,
            'excerpt': excerpt_from(c.blocks),
            'body': c.blocks,
            'sources': c.sources,
        })
        report.append((slug, words, counts, events, len(c.sources), c.images, c.warnings))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(articles, ensure_ascii=False, indent=1))
    print(f'Wrote {OUT.relative_to(ROOT)}: {len(articles)} articles\n')
    for slug, words, counts, events, sources, images, warnings in report:
        summary = ', '.join(f'{k} {v}' for k, v in sorted(counts.items()))
        print(f'{slug:36} {words:6} words | {summary} | events {events} | sources {sources} | images {images}')
        for w in warnings:
            print(f'    ! {w}')


if __name__ == '__main__':
    main()
