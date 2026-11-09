#!/usr/bin/env python3
"""Convert one of Lee's Word articles into the site's content format.

    python3 scripts/import-word.py <file.docx> <slug>

Writes src/mocks/imported/word/<slug>.json (title, body, sources) and copies the document's images to
public/images/articles/<slug>/. The mock content uses that JSON in place of the old-site import.

It follows the layout Lee uses in Word:
- an image, then centred italic lines below it: a figure and its caption ("Illustration by ..." is the credit)
- the centred title and the "By ..." line: skipped (the site prints its own title and byline)
- indented or italic paragraphs: quotations; a short, far-indented line after one: who wrote it and when
- paragraphs that start with a date ("20 August 1754 ...", "June 1755 ..."): chronology entries, grouped
  by year into a timeline, with the quotations between them
- "Sources": every paragraph after it is a source
- five or more lines shaped "Name- description": a table (name, company, notes)

Word layout is loose (spaces used for indents, lines broken by hand), so read the output before
committing it and fix anything the rules got wrong by hand in the JSON.
"""

import json
import re
import shutil
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
ROOT = Path(__file__).resolve().parent.parent

MONTH = r'(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?'
DATE = re.compile(
    rf'^((?:\d{{1,2}}(?:-\d{{1,2}})? )?{MONTH}(?: \d{{1,2}})?,? \d{{4}}'          # 20 August 1754, 15-24 November 1758, May 1756
    rf'(?:\s*(?:-|–|to)\s*(?:\d{{1,2}} )?(?:{MONTH} )?(?:\d{{1,2}},? )?\d{{4}})?'  # ... - October 1754, ...-April 1759
    rf'|{MONTH} \d{{1,2}} to \d{{1,2}} {MONTH} \d{{4}}'                              # August 26 to 17 Sep 1758.
    rf'|{MONTH}\s*-\s*{MONTH} \d{{4}})\.?\s+(.*)$'                                  # August-November 1764
)
ROSTER = re.compile(r'^([A-Z][^-–]{2,40}?)\s*[-–]\s*(.+)$')
RANK = re.compile(r'^(Captain|Lieutenant|Colonel|Major|Ensign|General)(\s+Colonel)?\s+[A-Z]')
CREDIT = re.compile(r'^(Illustration|Drawing|Photo|Photograph|Painting|Map) by |^Courtesy ', re.I)


def tidy(text):
    return re.sub(r'\s+', ' ', text.replace('\xa0', ' ')).strip()


def paragraphs(doc, rels):
    for p in doc.iter(W + 'p'):
        ppr = p.find(W + 'pPr')
        left = centred = 0
        if ppr is not None:
            ind = ppr.find(W + 'ind')
            if ind is not None:
                left = int(ind.get(W + 'left') or ind.get(W + 'start') or 0)
            jc = ppr.find(W + 'jc')
            centred = jc is not None and jc.get(W + 'val') == 'center'
        raw, italic_chars, images = '', 0, []
        for run in p.iter(W + 'r'):
            text = ''.join(x.text or '' if x.tag == W + 't' else ' ' if x.tag in (W + 'tab', W + 'br') else '' for x in run)
            rpr = run.find(W + 'rPr')
            i = rpr.find(W + 'i') if rpr is not None else None
            if i is not None and i.get(W + 'val') not in ('0', 'false'):
                italic_chars += len(text.strip())
            raw += text
            for blip in run.iter(A + 'blip'):
                images.append(rels[blip.get(R + 'embed')])
        text = tidy(raw)
        lead = len(raw) - len(raw.lstrip(' \xa0\t'))
        yield {
            'text': text,
            'lead': lead,
            'left': left,
            'centred': centred,
            'italic': bool(text) and italic_chars >= 0.6 * len(text.replace(' ', '')),
            'images': images,
        }


def roster_run(paras, i):
    run = 0
    while i + run < len(paras) and ROSTER.match(paras[i + run]['text']) and not paras[i + run]['images']:
        run += 1
    return run


def convert(docx_path, slug):
    out_images = ROOT / 'public' / 'images' / 'articles' / slug
    with zipfile.ZipFile(docx_path) as z:
        doc = ET.fromstring(z.read('word/document.xml'))
        rel_root = ET.fromstring(z.read('word/_rels/document.xml.rels'))
        rels = {r.get('Id'): r.get('Target') for r in rel_root}
        paras = [p for p in paragraphs(doc, rels) if p['text'] or p['images']]

        blocks, sources, title = [], [], None
        figure_count = 0
        i = 0
        in_sources = False
        while i < len(paras):
            p = paras[i]
            text = p['text']

            # Five or more "Name- description" lines in a row: a roster table
            run = roster_run(paras, i)
            if run >= 5:
                # The paragraph just before the list introduces it; give the list its own heading
                intro = blocks.pop() if blocks and blocks[-1]['type'] == 'paragraph' else None
                blocks.append({'type': 'heading', 'level': 2, 'text': 'Participants'})
                if intro:
                    blocks.append(intro)
                rows = []
                for q in paras[i:i + run]:
                    name, rest = ROSTER.match(q['text']).groups()
                    possible = '(?)' in rest
                    rest = tidy(rest.replace('(?)', ''))
                    company, _, notes = rest.partition('Company')
                    if _:
                        company = tidy(company + 'Company').replace('Fullers', 'Fuller’s')
                        notes = tidy(notes.lstrip('- –'))
                    else:
                        company, notes = '', rest
                    notes = '; '.join(x for x in ['Possible participant' if possible else '', notes] if x)
                    rows.append([tidy(name), company, notes])
                blocks.append({'type': 'table', 'caption': 'Participants', 'columns': ['Name', 'Company', 'Notes'], 'rows': rows})
                in_sources = False
                i += run
                continue

            if p['images']:
                for target in p['images']:
                    figure_count += 1
                    src = Path(target).name
                    out_images.mkdir(parents=True, exist_ok=True)
                    name = f'figure-{figure_count}{Path(src).suffix.lower()}'
                    (out_images / name).write_bytes(z.read('word/' + target))
                    caption, credit = [], ''
                    while i + 1 < len(paras) and paras[i + 1]['centred'] and paras[i + 1]['text'] and len(paras[i + 1]['text']) < 120 and not paras[i + 1]['images']:
                        line = paras[i + 1]['text']
                        if line.startswith('By ') or (title is None and not paras[i + 1]['italic']):
                            break
                        if CREDIT.match(line):
                            credit = line
                        else:
                            caption.append(line)
                        i += 1
                    figure = {'type': 'figure', 'src': f'/images/articles/{slug}/{name}', 'alt': ' '.join(caption) or 'Image', 'caption': ' '.join(caption)}
                    if credit:
                        figure['credit'] = credit
                    blocks.append(figure)
                i += 1
                continue

            if title is None and p['centred'] and not text.startswith('By '):
                title = text
                i += 1
                continue
            if text.startswith('By ') and len(text) < 80:
                i += 1
                continue

            if text.lower() == 'sources':
                in_sources = True
                i += 1
                continue
            if in_sources and roster_run(paras, i + 1) < 5:
                sources.append(text)
                i += 1
                continue

            if in_sources:
                in_sources = False  # the paragraph introducing a roster

            prev = blocks[-1] if blocks else None
            # Who wrote the quotation above, and when
            if prev and prev['type'] == 'quote' and len(text) < 120 and not text.startswith(('“', '"', '‘')) \
                    and (p['lead'] >= 12 or p['centred'] or (p['lead'] >= 3 and not p['italic'])):
                prev['cite'] = f"{prev['cite'].rstrip(',')}, {text}" if prev.get('cite') else text
                i += 1
                continue

            date = DATE.match(text)
            if date and not p['italic'] and p['left'] < 720:
                lines = [date.group(2)]
                while i + 1 < len(paras) and paras[i + 1]['lead'] >= 8 and not paras[i + 1]['italic'] and paras[i + 1]['left'] < 720 \
                        and not DATE.match(paras[i + 1]['text']) and not paras[i + 1]['images'] and len(paras[i + 1]['text']) < 110:
                    lines.append(paras[i + 1]['text'])
                    i += 1
                blocks.append({'type': 'event', 'date': date.group(1), 'lines': lines})
                i += 1
                continue

            if p['left'] >= 720 or p['italic']:
                if prev and prev['type'] == 'quote' and not prev.get('cite'):
                    prev['text'] += '\n\n' + text
                else:
                    blocks.append({'type': 'quote', 'text': text})
                i += 1
                continue

            blocks.append({'type': 'paragraph', 'text': text})
            i += 1

    return title, timeline(blocks), sources


def heading(line):
    line = line.rstrip(':')
    return line[:1].upper() + line[1:]


def event(block):
    """A chronology entry. Its first line may wrap onto the next; a line ending in ':' or a short
    heading followed by names starts a list, one item per line."""
    first, *rest = block['lines']
    if not rest:
        return {'date': block['date'], 'text': first}
    if all(RANK.match(r) or r[0].isdigit() for r in rest):
        # A list of companies or officers (or casualties): under a heading, or all one list when the
        # first line is an item too
        if RANK.match(first) and 'Company' in first:
            return {'date': block['date'], 'text': '\n'.join([first, *rest])}
        return {'date': block['date'], 'title': heading(first), 'text': '\n'.join(rest)}
    # Wrapped lines: join them, until a line ending in ':' starts a list
    text, items = first, []
    for line in rest:
        if items or text.endswith(':'):
            items.append(line)
        elif RANK.match(line):
            text += '\n' + line  # a new sentence about another unit
        else:
            text += ' ' + line
    if not items:
        return {'date': block['date'], 'text': text}
    return {'date': block['date'], 'title': heading(text), 'text': '\n'.join(items)}

def timeline(blocks):
    """With five or more dated entries, everything from the first one on becomes a timeline grouped by year"""
    events = [b for b in blocks if b['type'] == 'event']
    if len(events) < 5:
        return [b for b in blocks if b['type'] != 'event']
    start = blocks.index(events[0])
    years = [re.findall(r'\d{4}', e['date'])[0] for e in events]
    groups, n = [], 0
    for b in blocks[start:]:
        if b['type'] == 'event':
            year = years[n]
            n += 1
            # An entry dated out of order (usually a typo, e.g. 1757 among the 1754 entries) stays in the
            # current group: it is later than the entry after it, or earlier than the group
            out_of_order = groups and (year < groups[-1]['label'] or (n < len(years) and year > years[n]))
            if not groups or (groups[-1]['label'] != year and not out_of_order):
                groups.append({'label': year, 'events': []})
            groups[-1]['events'].append(event(b))
        elif b['type'] == 'quote':
            groups[-1]['events'].append({'kind': 'quote', 'text': b['text'], **({'cite': b['cite']} if b.get('cite') else {})})
        elif b['type'] == 'paragraph':
            groups[-1]['events'].append({'text': b['text']})
    return blocks[:start] + [{'type': 'heading', 'level': 2, 'text': 'Chronology'}, {'type': 'timeline', 'groups': groups}]


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    docx, slug = sys.argv[1], sys.argv[2]
    title, body, sources = convert(docx, slug)
    out = ROOT / 'src' / 'mocks' / 'imported' / 'word' / f'{slug}.json'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({'title': title, 'source': Path(docx).name, 'body': body, 'sources': sources}, ensure_ascii=False, indent=1) + '\n')
    print(f'{out.relative_to(ROOT)}: {len(body)} blocks, {len(sources)} sources')
