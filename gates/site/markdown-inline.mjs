// The inline half of the documentation Markdown renderer (gates/site/markdown.mjs): the refusal, the census of what a source uses, and the inline syntax.


/** @typedef {{ text: string, line: number }} Line */
/** @typedef {{ headings: number, bold: number, code: number, links: number, ordered: number, bullets: number, quotes: number, emphasis: number }} Census */
/** @typedef {{ file: string, counts: Census }} Ctx */

/** Thrown for syntax outside the seven. Its own class so a caller can tell it from a bug in here. */
export class MarkdownRefusal extends Error {}

/**
 * @param {Ctx} ctx
 * @param {number} line
 * @param {string} what
 * @returns {never}
 */
export function refuse(ctx, line, what) {
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
export function emptyCensus() {
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
export function renderInline(text, startLine, ctx) {
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
