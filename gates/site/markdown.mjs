// The markdown the theme stories are written in, and nothing else [T10, TH102].
//
// The 24 `themes/*/anatomy.md` documents were measured before this was
// written: 323 bold spans, 189 inline code spans, 128 headings, 97 ordered
// items, 76 bullets, 54 quote lines, 26 links — and zero tables, zero
// fenced code blocks, zero images, zero raw HTML. Seven constructs, none
// of them the hard ones, which is why T10 says an own renderer rather
// than a dependency (T6).
//
// The property that matters is the refusal. A renderer that meets syntax
// it does not know and emits the literal characters is the silent
// fallback AR25 exists to remove: the page would show `| a | b |` in the
// middle of a sentence and nothing would go red. So every construct
// outside the seven throws, naming the file and the line.
//
// There are eight constructs, not the seven T10 first wrote down. That
// decision was a measurement, and the measurement had miscounted: bold
// is 327 rather than 323, inline code 193 rather than 189, and
// underscore emphasis -- nine spans across six documents -- was missed
// entirely. T10 carries the corrected census in a dated amendment
// (MR-R6-1, 2026-09-07). The boundary T10 is actually about is
// unchanged: no tables, no fenced code, no raw HTML, and refuse rather
// than pass through.
//
// Usage: node gates/site/markdown.mjs   (renders all 24 stories, prints the census)

import { readFileSync, readdirSync } from 'node:fs';

import { fileURLToPath } from 'node:url';

import process from 'node:process';
import { census, emptyCensus, refuse, renderInline } from './markdown-inline.mjs';
/** @typedef {import('./markdown-inline.mjs').Line} Line */
/** @typedef {import('./markdown-inline.mjs').Census} Census */
/** @typedef {import('./markdown-inline.mjs').Ctx} Ctx */

export { MarkdownRefusal, census } from './markdown-inline.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

/** Everything a block opener looks like, so a paragraph knows where it ends. */
const OPENS_BLOCK = /^(?:#{1,6} |> |>$|\d+\. |- |```|\||\s*$)/;

/**
 * @param {Line} line
 * @param {Ctx} ctx
 */
function refuseUnsupportedBlock(line, ctx) {
    const text = line.text;
    if (/^```/.test(text))
        refuse(ctx, line.line, 'a fenced code block. The stories contain none; a snippet on the site comes from a real file [AR19].');
    if (/^\|/.test(text)) refuse(ctx, line.line, 'a table. The stories contain none.');
    if (/^[-*_](?:\s*[-*_]){2,}\s*$/.test(text)) refuse(ctx, line.line, 'a thematic break. Headings separate the sections of a story.');
    if (/^={2,}\s*$/.test(text)) refuse(ctx, line.line, 'a setext heading underline. Headings are written with #.');
    if (/^#{7,}/.test(text)) refuse(ctx, line.line, 'a heading deeper than six levels.');
    if (/^#{1,6}[^ #]/.test(text)) refuse(ctx, line.line, 'a # with no space after it, which is not a heading.');
    if (/^ {4,}\S/.test(text)) refuse(ctx, line.line, 'an indented code block. Indentation outside a list item is not a construct here.');
    if (/^\s*[*+] /.test(text)) refuse(ctx, line.line, 'a bullet written with * or +. The stories write bullets with -.');
}

/**
 * A list, ordered or not. An item runs until the next marker, a blank
 * line or a line that is not indented under it — the shape the stories
 * use, where continuation lines sit three spaces in.
 *
 * @param {Line[]} lines
 * @param {number} start
 * @param {Ctx} ctx
 * @param {RegExp} marker
 * @returns {{ html: string, next: number }}
 */
function renderList(lines, start, ctx, marker) {
    const ordered = marker.source.startsWith('^\\d');
    /** @type {string[]} */
    const items = [];
    let i = start;

    while (i < lines.length) {
        const line = lines[i];
        if (!line || !marker.test(line.text)) break;
        const first = line.text.replace(marker, '');
        /** @type {Line[]} */
        const rest = [];
        i++;
        while (i < lines.length) {
            const cont = lines[i];
            if (!cont || cont.text.trim() === '' || marker.test(cont.text) || !/^ {1,}\S/.test(cont.text)) break;
            rest.push({ text: cont.text.trim(), line: cont.line });
            i++;
        }
        const text = [first, ...rest.map((r) => r.text)].join('\n');
        items.push(`<li>${renderInline(text, line.line, ctx)}</li>`);
        if (ordered) ctx.counts.ordered++;
        else ctx.counts.bullets++;
    }

    const tag = ordered ? 'ol' : 'ul';
    return { html: `<${tag}>\n${items.join('\n')}\n</${tag}>`, next: i };
}

/**
 * @param {Line[]} lines
 * @param {Ctx} ctx
 * @returns {string}
 */
function renderBlocks(lines, ctx) {
    /** @type {string[]} */
    const out = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        if (!line) break;
        if (line.text.trim() === '') {
            i++;
            continue;
        }
        refuseUnsupportedBlock(line, ctx);

        const heading = /^(#{1,6}) +(.*)$/.exec(line.text);
        if (heading) {
            const depth = (heading[1] ?? '#').length;
            out.push(`<h${depth}>${renderInline((heading[2] ?? '').trim(), line.line, ctx)}</h${depth}>`);
            ctx.counts.headings++;
            i++;
            continue;
        }

        if (/^>/.test(line.text)) {
            /** @type {Line[]} */
            const quoted = [];
            while (i < lines.length) {
                const q = lines[i];
                if (!q || !/^>/.test(q.text)) break;
                quoted.push({ text: q.text.replace(/^> ?/, ''), line: q.line });
                ctx.counts.quotes++;
                i++;
            }
            out.push(`<blockquote>\n${renderBlocks(quoted, ctx)}\n</blockquote>`);
            continue;
        }

        if (/^\d+\. /.test(line.text)) {
            const list = renderList(lines.slice(i), 0, ctx, /^\d+\. /);
            out.push(list.html);
            i += list.next;
            continue;
        }

        if (/^- /.test(line.text)) {
            const list = renderList(lines.slice(i), 0, ctx, /^- /);
            out.push(list.html);
            i += list.next;
            continue;
        }

        /** @type {Line[]} */
        const paragraph = [];
        while (i < lines.length) {
            const p = lines[i];
            if (!p || (paragraph.length > 0 && OPENS_BLOCK.test(p.text))) break;
            refuseUnsupportedBlock(p, ctx);
            paragraph.push(p);
            i++;
        }
        const first = paragraph[0];
        if (first) out.push(`<p>${renderInline(paragraph.map((p) => p.text).join('\n'), first.line, ctx)}</p>`);
    }

    return out.join('\n');
}

/**
 * @param {string} source
 * @param {{ file?: string }} [options]
 * @returns {{ html: string, counts: Census }}
 */
export function renderMarkdown(source, options = {}) {
    /** @type {Ctx} */
    const ctx = { file: options.file ?? '<string>', counts: emptyCensus() };
    const lines = source.split('\n').map((text, index) => ({ text: text.replace(/\s+$/, ''), line: index + 1 }));
    const html = renderBlocks(lines, ctx);
    return { html, counts: ctx.counts };
}

/** The stories, in the order the registry keeps them. */
export function storyPaths() {
    /** @type {string[]} */
    const order = JSON.parse(readFileSync(new URL('../../themes/order.json', import.meta.url), 'utf8'));
    return order.map((name) => `themes/${name}/anatomy.md`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const paths = storyPaths();
    const themes = readdirSync(new URL('../../themes/', import.meta.url), { withFileTypes: true }).filter((e) => e.isDirectory()).length;
    if (paths.length !== themes) {
        console.error(`Renderer: order.json lists ${paths.length} themes and themes/ holds ${themes} directories.`);
        process.exit(1);
    }

    const total = emptyCensus();
    const expected = emptyCensus();
    let failed = 0;
    for (const path of paths) {
        const source = readFileSync(ROOT + path, 'utf8');
        const want = census(source);
        try {
            const { counts } = renderMarkdown(source, { file: path });
            for (const key of /** @type {(keyof Census)[]} */ (Object.keys(total))) {
                total[key] += counts[key];
                expected[key] += want[key];
            }
        } catch (error) {
            failed++;
            console.error(String(error instanceof Error ? error.message : error));
        }
    }

    // AR26: the expectation comes from the sources, so a renderer that
    // quietly produced empty pages cannot report success.
    const shortfall = /** @type {(keyof Census)[]} */ (Object.keys(total)).filter((key) => total[key] < expected[key]);
    console.log(
        `Renderer: ${paths.length - failed}/${paths.length} stories, constructs rendered ${JSON.stringify(total)} against a source census of ${JSON.stringify(expected)}.`,
    );
    if (failed > 0 || shortfall.length > 0) {
        if (shortfall.length > 0) console.error(`Rendered fewer than the source contains: ${shortfall.join(', ')}.`);
        process.exit(1);
    }
}
