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
// The measurement missed one thing, and it is quarantined rather than
// waved through (AFK rule): nine underscore-emphasis spans across seven
// documents. `options.emphasis` renders them as `<em>`; without it they
// are refused like any other unknown syntax. See MR-R6-1 in
// docs/MINI_ROUNDS.md.
//
// Usage: node gates/site/markdown.mjs   (renders all 24 stories, prints the census)

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

/** @typedef {{ text: string, line: number }} Line */
/** @typedef {{ headings: number, bold: number, code: number, links: number, ordered: number, bullets: number, quotes: number, emphasis: number }} Census */
/** @typedef {{ file: string, emphasis: boolean, counts: Census }} Ctx */

/** Thrown for syntax outside the seven. Its own class so a caller can tell it from a bug in here. */
export class MarkdownRefusal extends Error {}

/**
 * @param {Ctx} ctx
 * @param {number} line
 * @param {string} what
 * @returns {never}
 */
function refuse(ctx, line, what) {
    throw new MarkdownRefusal(`${ctx.file}:${line}: ${what}`);
}

/** @param {string} text */
function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** @param {string} text */
function countNewlines(text) {
    let n = 0;
    for (const ch of text) if (ch === '\n') n++;
    return n;
}

/** @returns {Census} */
function emptyCensus() {
    return { headings: 0, bold: 0, code: 0, links: 0, ordered: 0, bullets: 0, quotes: 0, emphasis: 0 };
}

/**
 * What the source says it contains, counted with regexes rather than by
 * the renderer [AR26]. The renderer's own tally is compared against this,
 * so "rendered nothing" cannot read as success.
 *
 * @param {string} source
 * @returns {Census}
 */
export function census(source) {
    const lines = source.split('\n');
    const counts = emptyCensus();
    for (const text of lines) {
        if (/^#{1,6} /.test(text)) counts.headings++;
        if (/^\s*\d+\. /.test(text)) counts.ordered++;
        if (/^\s*- /.test(text)) counts.bullets++;
        if (/^>/.test(text)) counts.quotes++;
    }
    counts.bold = (source.match(/\*\*[^*]+\*\*/g) ?? []).length;
    // Links first: their text may hold a code span, and a code span may
    // hold brackets, so counting them independently double-counts.
    const withoutLinks = source.replace(/\[[^\]]*\]\([^)\s]+\)/g, (m) => {
        counts.links++;
        return '';
    });
    counts.code = (withoutLinks.match(/`[^`]+`/g) ?? []).length;
    counts.emphasis = (source.match(/(?:^|[\s(«"])_[^_\n]+_(?=[\s.,;:)»"!?]|$)/gm) ?? []).length;
    return counts;
}

/**
 * The seven constructs, applied to one run of text.
 *
 * Runs span line breaks, because the stories are hard-wrapped prose and a
 * paragraph is one run. The line number is carried along rather than
 * derived afterwards, so a refusal points at the line the syntax is on
 * and not at the top of the paragraph.
 *
 * @param {string} text
 * @param {number} startLine
 * @param {Ctx} ctx
 */
function renderInline(text, startLine, ctx) {
    let out = '';
    let line = startLine;
    let i = 0;

    while (i < text.length) {
        const ch = text[i];

        if (ch === '\n') {
            out += '\n';
            line++;
            i++;
            continue;
        }

        if (ch === '`') {
            const end = text.indexOf('`', i + 1);
            if (end < 0) refuse(ctx, line, 'an inline code span that never closes. Backticks come in pairs.');
            const code = text.slice(i + 1, end);
            if (code.includes('\n')) refuse(ctx, line, 'an inline code span crossing a line break, which the stories do not use.');
            out += `<code>${escapeHtml(code)}</code>`;
            ctx.counts.code++;
            i = end + 1;
            continue;
        }

        if (ch === '*') {
            if (text.startsWith('**', i)) {
                const end = text.indexOf('**', i + 2);
                if (end < 0) refuse(ctx, line, 'a bold span that never closes. Bold is **like this**.');
                const inner = text.slice(i + 2, end);
                out += `<strong>${renderInline(inner, line, ctx)}</strong>`;
                ctx.counts.bold++;
                line += countNewlines(inner);
                i = end + 2;
                continue;
            }
            refuse(ctx, line, 'a single * — emphasis with asterisks is not one of the seven constructs; bold is **like this**.');
        }

        if (ch === '_') {
            const before = i === 0 ? '\n' : text[i - 1];
            const after = text[i + 1] ?? '';
            const opens = /[\s("'«—-]/.test(before ?? '\n') && /\S/.test(after) && after !== '_';
            const closing = opens ? /_(?=[\s.,;:!?)»"']|$)/.exec(text.slice(i + 1)) : null;
            if (opens && closing) {
                const end = i + 1 + closing.index;
                const inner = text.slice(i + 1, end);
                if (!inner.includes('\n')) {
                    if (!ctx.emphasis) {
                        refuse(
                            ctx,
                            line,
                            `underscore emphasis (_${inner}_). T10 measured seven constructs and this is an eighth: nine spans across seven ` +
                                'stories that the count missed. Quarantined as MR-R6-1 in docs/MINI_ROUNDS.md — pass { emphasis: true } to render it as <em>.',
                        );
                    }
                    out += `<em>${renderInline(inner, line, ctx)}</em>`;
                    ctx.counts.emphasis++;
                    i = end + 1;
                    continue;
                }
            }
            // An underscore inside a word — `TAB_CHANGE_EVENT` written in
            // prose — is a literal underscore in every markdown dialect,
            // so passing it through is the rendering, not a fallback.
            out += '_';
            i++;
            continue;
        }

        if (ch === '!' && text[i + 1] === '[') {
            refuse(ctx, line, 'an image. The stories carry no images and the site renders live colour, not pictures of it [TH102].');
        }

        if (ch === '[') {
            const link = /^\[([^\]]*)\]\(([^)\s]+)\)/.exec(text.slice(i));
            if (!link) refuse(ctx, line, 'a [ that does not open a [text](url) link. A literal bracket is not something the stories use.');
            const label = link[1] ?? '';
            const href = link[2] ?? '';
            // A URL is an executable position; the stories link to
            // documents, and anything else is a mistake worth stopping on.
            if (/^\s*javascript:/i.test(href)) refuse(ctx, line, `a javascript: URL (${href}).`);
            out += `<a href="${escapeHtml(href)}">${renderInline(label, line, ctx)}</a>`;
            ctx.counts.links++;
            line += countNewlines(link[0]);
            i += link[0].length;
            continue;
        }

        if (ch === '<' && /[a-zA-Z/]/.test(text[i + 1] ?? '') && text.slice(i).includes('>')) {
            refuse(ctx, line, 'raw HTML. The stories are markdown; the markup around them is the site generator’s.');
        }

        out += escapeHtml(ch ?? '');
        i++;
    }

    return out;
}

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
 * @param {{ file?: string, emphasis?: boolean }} [options]
 * @returns {{ html: string, counts: Census }}
 */
export function renderMarkdown(source, options = {}) {
    /** @type {Ctx} */
    const ctx = { file: options.file ?? '<string>', emphasis: options.emphasis === true, counts: emptyCensus() };
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
            const { counts } = renderMarkdown(source, { file: path, emphasis: true });
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
