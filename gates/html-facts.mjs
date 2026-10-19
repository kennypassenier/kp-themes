// A research demo's review facts read from its markup in Node, the way a browser's DOMParser reads them
// (research/_review/progress.js factsOf), for catalogue/agenda-index.json (gates/generate-agenda-index.mjs).
//
// Not a general HTML parser: a scanner that builds just enough of the tree to answer factsOf's questions — the
// attributes of <html>, every `[data-review-item]`, the first paragraph inside a header or main, the two review
// scripts — and the stylesheets and scripts a page links (progress.js fingerprintOf). Where the markup goes beyond
// what it reads exactly (an entity it does not know, CDATA, a carriage return in a value it returns), it says so by
// returning null, and the Agenda reads that demo live, as it always did. gates/measure-agenda-index.mjs compares it
// with Firefox's own reading for every research demo.

const VOID = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'source',
    'track',
    'wbr',
    'param',
    'keygen',
    'frame',
]);
/** Elements whose content is text up to their end tag, never markup. */
const RAW = new Set(['script', 'style', 'xmp', 'iframe', 'noembed', 'noframes', 'plaintext']);
/** Text with character references, but no markup. */
const RCDATA = new Set(['textarea', 'title']);
/** A start tag of one of these closes an open <p> (HTML's "close a p element"). */
const CLOSES_P = new Set([
    'address',
    'article',
    'aside',
    'blockquote',
    'center',
    'details',
    'dialog',
    'dir',
    'div',
    'dl',
    'fieldset',
    'figcaption',
    'figure',
    'footer',
    'form',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'header',
    'hgroup',
    'hr',
    'listing',
    'main',
    'menu',
    'nav',
    'ol',
    'p',
    'pre',
    'search',
    'section',
    'summary',
    'table',
    'ul',
    'xmp',
    'plaintext',
    'li',
    'dd',
    'dt',
]);
const NAMED = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
    middot: '·',
    mdash: '—',
    ndash: '–',
    hellip: '…',
    rsquo: '’',
    lsquo: '‘',
    rdquo: '”',
    ldquo: '“',
    times: '×',
    rarr: '→',
    larr: '←',
    uarr: '↑',
    darr: '↓',
    harr: '↔',
    nearr: '↗',
    nwarr: '↖',
    searr: '↘',
    swarr: '↙',
    copy: '©',
    reg: '®',
    trade: '™',
    deg: '°',
    plusmn: '±',
    minus: '−',
    bull: '•',
    check: '✓',
    euro: '€',
    shy: '­',
    zwj: '‍',
    zwnj: '‌',
    thinsp: ' ',
    ensp: ' ',
    emsp: ' ',
    hyphen: '‐',
    laquo: '«',
    raquo: '»',
    sect: '§',
    para: '¶',
    le: '≤',
    ge: '≥',
    ne: '≠',
    infin: '∞',
    frac12: '½',
    eacute: 'é',
    egrave: 'è',
    euml: 'ë',
    iuml: 'ï',
    ouml: 'ö',
    uuml: 'ü',
    auml: 'ä',
};

class Unsupported extends Error {}

/** Decode character references in text or an attribute value; unknown ones are refused. @param {string} text */
export function decode(text) {
    return text.replace(/&(#[0-9]+|#[xX][0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]*)(;?)/g, (whole, ref, semi) => {
        if (!semi) throw new Unsupported(`reference without a semicolon: ${whole}`);
        if (ref[0] === '#') {
            const code = ref[1] === 'x' || ref[1] === 'X' ? parseInt(ref.slice(2), 16) : parseInt(ref.slice(1), 10);
            if (!code || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff) || (code >= 0x80 && code <= 0x9f)) throw new Unsupported(whole);
            return String.fromCodePoint(code);
        }
        if (!(ref in NAMED)) throw new Unsupported(`unknown entity ${whole}`);
        return NAMED[/** @type {keyof typeof NAMED} */ (ref)];
    });
}

/**
 * @typedef {{ name: string, attrs: Map<string, string>, parent: Node | null, text: string[], inTemplate: boolean, foreign: boolean, start: number }} Node
 */

/** Parse a start tag's attributes. @param {string} src @param {number} i  after the tag name @returns {{ attrs: Map<string, string>, end: number, selfClosing: boolean }} */
function readAttributes(src, i) {
    /** @type {Map<string, string>} */
    const attrs = new Map();
    const n = src.length;
    for (;;) {
        while (i < n && /[\s/]/.test(src[i])) {
            if (src[i] === '/' && src[i + 1] === '>') return { attrs, end: i + 2, selfClosing: true };
            i++;
        }
        if (i >= n) throw new Unsupported('tag runs to the end');
        if (src[i] === '>') return { attrs, end: i + 1, selfClosing: false };
        let name = '';
        while (i < n && !/[\s/>=]/.test(src[i])) name += src[i++];
        name = name.toLowerCase();
        while (i < n && /\s/.test(src[i])) i++;
        let value = '';
        if (src[i] === '=') {
            i++;
            while (i < n && /\s/.test(src[i])) i++;
            const quote = src[i];
            if (quote === '"' || quote === "'") {
                const close = src.indexOf(quote, i + 1);
                if (close < 0) throw new Unsupported('unclosed attribute value');
                value = src.slice(i + 1, close);
                i = close + 1;
            } else {
                while (i < n && !/[\s>]/.test(src[i])) value += src[i++];
            }
        }
        // The first of two same-named attributes wins, as in the browser.
        if (name && !attrs.has(name)) attrs.set(name, value);
    }
}

/**
 * progress.js DemoFacts, written out here so the type check of gates/ does not take in the browser module.
 * @typedef {{ id: string | null, themes: string | null, ask: string | null, askText: string,
 *   sections: { item: string, themes: string | null, topic: string | null, mode: string | null }[],
 *   extra: string | null, round: string | null }} DemoFacts
 */

/**
 * The review facts of a demo's markup (progress.js factsOf), and the files it links (fingerprintOf), or null when the
 * markup goes beyond what this scanner reads exactly.
 * @param {string} src  the page as served
 * @returns {{ facts: DemoFacts, links: string[] } | null}
 */
export function factsFromHtml(src) {
    try {
        return scan(src);
    } catch (error) {
        if (error instanceof Unsupported) return null;
        throw error;
    }
}

/** @param {string} src */
function scan(src) {
    // The parser reads CR LF as LF before anything else; a value with a lone CR is refused below.
    src = src.replace(/^﻿/, '').replace(/\r\n/g, '\n');
    /** @type {Node} */
    const doc = { name: '#document', attrs: new Map(), parent: null, text: [], inTemplate: false, foreign: false, start: 0 };
    /** @type {Node[]} */
    const stack = [doc];
    /** @type {Map<string, string>} */
    let htmlAttrs = new Map();
    /** @type {{ node: Node, item: string, themes: string | null, topic: string | null, mode: string | null }[]} */
    const sections = [];
    /** @type {Node | null} */
    let askNode = null;
    /** @type {string | null} */
    let extra = null;
    /** @type {string | null} */
    let round = null;
    /** @type {string[]} */
    const links = [];
    const top = () => stack[stack.length - 1];
    /** Text reaches every open element (textContent of an ancestor includes it). @param {string} text */
    const addText = (text) => {
        if (askNode && stack.includes(askNode)) askNode.text.push(text);
    };
    const inTemplate = () => top().inTemplate || top().name === 'template';
    const closeTo = (/** @type {string} */ name) => {
        for (let k = stack.length - 1; k > 0; k--) {
            if (stack[k].name === name) {
                stack.length = k;
                return true;
            }
            // A <p> ends at its parent's end; nothing else crosses a template or a foreign root here.
            if (stack[k].name === 'template') return false;
        }
        return false;
    };
    const value = (/** @type {Map<string, string>} */ attrs, /** @type {string} */ name) => {
        const raw = attrs.get(name);
        if (raw === undefined) return null;
        if (raw.includes('\r')) throw new Unsupported('carriage return in a value');
        return decode(raw);
    };

    let i = 0;
    const n = src.length;
    while (i < n) {
        const lt = src.indexOf('<', i);
        if (lt < 0) {
            addText(decode(src.slice(i)));
            break;
        }
        if (lt > i) addText(decode(src.slice(i, lt)));
        i = lt;
        if (src.startsWith('<!--', i)) {
            const end = src.indexOf('-->', i + 4);
            if (end < 0) throw new Unsupported('unclosed comment');
            i = end + 3;
            continue;
        }
        if (src.startsWith('<![CDATA[', i)) throw new Unsupported('CDATA');
        if (src[i + 1] === '!' || src[i + 1] === '?') {
            const end = src.indexOf('>', i);
            if (end < 0) throw new Unsupported('unclosed declaration');
            i = end + 1;
            continue;
        }
        if (src[i + 1] === '/') {
            const m = /^<\/([A-Za-z][^\s/>]*)\s*>/.exec(src.slice(i, i + 200));
            if (!m) throw new Unsupported('end tag the scanner does not read');
            const name = m[1].toLowerCase();
            i += m[0].length;
            if (name === 'p' && !stack.some((node) => node.name === 'p')) {
                // `</p>` without an open p makes an empty one.
                continue;
            }
            if (['html', 'body', 'head'].includes(name)) continue;
            closeTo(name);
            continue;
        }
        const m = /^<([A-Za-z][^\s/>]*)/.exec(src.slice(i, i + 200));
        if (!m) {
            // A lone '<' is text.
            addText('<');
            i += 1;
            continue;
        }
        const name = m[1].toLowerCase();
        const { attrs, end, selfClosing } = readAttributes(src, i + m[0].length);
        i = end;
        if (name === 'html') {
            if (!htmlAttrs.size) htmlAttrs = attrs;
            continue;
        }
        if (name === 'head' || name === 'body') continue;
        const foreignParent = top().foreign;
        const foreign = foreignParent || name === 'svg' || name === 'math';
        if (!foreign && CLOSES_P.has(name) && stack.some((node) => node.name === 'p')) {
            // The p closes only when it is in button scope: no button, table or template between.
            for (let k = stack.length - 1; k > 0; k--) {
                if (stack[k].name === 'p') {
                    stack.length = k;
                    break;
                }
                if (['button', 'table', 'template', 'td', 'th', 'caption', 'object', 'marquee', 'applet', 'html'].includes(stack[k].name)) break;
            }
        }
        if (!foreign && (name === 'li' || name === 'dd' || name === 'dt')) {
            // Only what a p's text could depend on is modelled; a list item inside the ask paragraph is refused.
            if (askNode && stack.includes(askNode)) throw new Unsupported('list item inside the ask paragraph');
        }
        /** @type {Node} */
        const node = { name, attrs, parent: top(), text: [], inTemplate: inTemplate(), foreign, start: lt };
        const live = !node.inTemplate;
        if (live && attrs.has('data-review-item'))
            sections.push({
                node,
                item: value(attrs, 'data-review-item') ?? '',
                themes: value(attrs, 'data-review-themes'),
                topic: value(attrs, 'data-review-topic'),
                mode: value(attrs, 'data-review-mode'),
            });
        if (live && !foreign && name === 'p' && !askNode && stack.some((s) => s.name === 'header' || s.name === 'main')) askNode = node;
        if (live && name === 'script' && attrs.has('src')) links.push(value(attrs, 'src') || value(attrs, 'href') || '');
        if (live && name === 'link' && attrs.has('href') && (value(attrs, 'rel') ?? '').toLowerCase() === 'stylesheet')
            links.push(value(attrs, 'src') || value(attrs, 'href') || '');

        if (RAW.has(name) && !foreign) {
            const close = src.toLowerCase().indexOf(`</${name}`, i);
            if (close < 0) throw new Unsupported(`unclosed ${name}`);
            const text = src.slice(i, close);
            if (askNode && stack.includes(askNode)) addText(text);
            if (live && name === 'script') {
                if (attrs.has('data-review-extra') && extra === null) extra = text;
                if (attrs.has('data-review-round') && round === null) round = text;
            }
            const gt = src.indexOf('>', close);
            i = gt + 1;
            continue;
        }
        if (RCDATA.has(name) && !foreign) {
            const close = src.toLowerCase().indexOf(`</${name}`, i);
            if (close < 0) throw new Unsupported(`unclosed ${name}`);
            if (askNode && stack.includes(askNode)) addText(decode(src.slice(i, close)));
            i = src.indexOf('>', close) + 1;
            continue;
        }
        if (VOID.has(name) && !foreign) continue;
        if (selfClosing && foreign) continue;
        stack.push(node);
    }

    const words = (/** @type {string[]} */ parts) => parts.join('').replace(/\s+/g, ' ').trim();
    if ([...htmlAttrs.values()].some((v) => v.includes('\r'))) throw new Unsupported('carriage return in <html>');
    const rootValue = (/** @type {string} */ name) => (htmlAttrs.has(name) ? decode(/** @type {string} */ (htmlAttrs.get(name))) : null);
    return {
        facts: {
            id: rootValue('data-review'),
            themes: rootValue('data-review-themes'),
            ask: rootValue('data-review-ask'),
            askText: askNode ? words(askNode.text) : '',
            sections: sections.map(({ item, themes, topic, mode }) => ({ item, themes, topic, mode })),
            extra,
            round,
        },
        links,
    };
}
