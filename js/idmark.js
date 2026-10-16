// The identity mark: a small chip made from a name [kpadopt4-data; JobTracker's
// `Mark` (ui/kit.jsx) and the admin dashboard's `stackMark` (ui.js)].
//
// Two apps drew the same idea twice: a company or a stack gets a little
// plate of its own, the same on every page, so the eye finds it in a list
// before it reads the name. This is that plate, made from the name alone:
//
//   <span class="kp-idmark" data-kp-idmark="Acme Logistics" aria-hidden="true"></span>
//   <span class="kp-idmark kp-idmark--pattern kp-idmark--sm" data-kp-idmark="media" aria-hidden="true"></span>
//
// From the name (FNV-1a, the same hash as the facet swatch's pattern, so a
// name has one look in both places) come:
//   - the colour: one of the theme's five chart colours (`--chart-1..5`), so
//     the mark lives in the theme's own palette; or, with
//     `data-kp-idmark-hue="free"`, the hue of the hash on the lightness and
//     chroma of `--chart-1` (the admin dashboard's one colour per stack);
//   - the letters: the initials of the first two words, else the first two
//     letters (one on the extra-small mark), upper case;
//   - the pattern (`--pattern`): a 5 by 5 grid mirrored about its middle;
//   - the corner glyph (`--glyph`): circle, square, triangle or diamond.
//
// `idmarkColours(names)` gives a list of names palette slots that do not
// collide while free slots remain, for a list read together (a legend, a
// board); `setIdmark(el, name, { slot })` takes one. The mark is decorative:
// it is hidden from a screen reader and the name always stands beside it
// (`.kp-idmark-name`). An empty name is a quiet dashed plate with a "?".
//
// Sizes `--xs` `--sm` (md is the default) `--lg` `--xl`, `--round`; a list
// marks its current one with `aria-current` or `data-kp-idmark-selected`, and a
// loading mark is `.kp-idmark.kp-skeleton`. `.kp-idmark-group` overlaps marks with
// an exact `.kp-idmark-group__more` ("+3", never "9+").

import { getStrings } from './strings.js';
import { identityCells } from './facets.js';

/** A mark the module fills from its name. */
export const IDMARK = '[data-kp-idmark]';
/** How many colours the theme's chart palette has. */
export const IDMARK_SLOTS = 5;
/** The corner glyphs, in the order the hash picks them. */
export const IDMARK_GLYPHS = Object.freeze(['circle', 'square', 'triangle', 'diamond']);

const SVG_NS = 'http://www.w3.org/2000/svg';

/** FNV-1a over a name, as js/facets.js hashes a pattern's seed. @param {string} name */
function hashOf(name) {
    let hash = 2166136261;
    for (const ch of name) hash = Math.imul(hash ^ (ch.codePointAt(0) ?? 0), 16777619);
    return hash >>> 0;
}

/**
 * The letters of a name: the initials of its first two words, or its first
 * two letters when it is one word. Letters and digits only.
 * @param {string} name @param {number} [count]
 */
export function idmarkLetters(name, count = 2) {
    const words = name
        .normalize('NFKC')
        .split(/[^\p{L}\p{N}]+/u)
        .filter(Boolean);
    if (words.length === 0) return '';
    const letters = words.length > 1 ? words.slice(0, count).map((word) => [...word][0]) : [...words[0]].slice(0, count);
    return letters.join('').toLocaleUpperCase();
}

/**
 * Everything a mark is, from its name. Pure: the same name gives the same
 * mark in node and in every browser.
 * @param {string} name
 * @returns {{ name: string, empty: boolean, slot: number, hue: number, letters: string, glyph: string, cells: [number, number][] }}
 *   `slot` 1 to 5 (the chart colour), `hue` 0 to 359 (the free hue)
 */
export function idmarkFor(name) {
    const clean = (name ?? '').trim();
    if (clean === '') return { name: '', empty: true, slot: 0, hue: 0, letters: '', glyph: IDMARK_GLYPHS[0], cells: [] };
    const hash = hashOf(clean.toLocaleLowerCase());
    return {
        name: clean,
        empty: false,
        slot: (hash % IDMARK_SLOTS) + 1,
        hue: hash % 360,
        letters: idmarkLetters(clean),
        glyph: IDMARK_GLYPHS[(hash >>> 3) % IDMARK_GLYPHS.length],
        cells: identityCells(clean),
    };
}

/**
 * Palette slots for names read together: each name keeps its own slot where
 * no other name took it; a collision moves the later name to the nearest
 * slot still free, and only when all five are taken do names share.
 * The order of `names` decides who keeps a contested slot.
 * @param {readonly string[]} names
 * @returns {Map<string, number>} name to slot, 1 to 5
 */
export function idmarkColours(names) {
    /** @type {Map<string, number>} */
    const out = new Map();
    /** @type {Map<number, number>} */
    const used = new Map();
    for (const raw of names) {
        const name = (raw ?? '').trim();
        if (name === '' || out.has(name)) continue;
        const own = idmarkFor(name).slot;
        let slot = own;
        const least = Math.min(...Array.from({ length: IDMARK_SLOTS }, (_, i) => used.get(i + 1) ?? 0));
        if ((used.get(own) ?? 0) > least)
            for (let step = 1; step < IDMARK_SLOTS; step += 1) {
                const next = ((own - 1 + step) % IDMARK_SLOTS) + 1;
                if ((used.get(next) ?? 0) === least) {
                    slot = next;
                    break;
                }
            }
        used.set(slot, (used.get(slot) ?? 0) + 1);
        out.set(name, slot);
    }
    return out;
}

/** @param {Document} doc @param {[number, number][]} cells */
function patternSvg(doc, cells) {
    const svg = doc.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'kp-idmark__pattern');
    svg.setAttribute('viewBox', '0 0 7 7');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('shape-rendering', 'crispEdges');
    const path = doc.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', cells.map(([x, y]) => `M${x + 1} ${y + 1}h1v1h-1z`).join(''));
    svg.append(path);
    return svg;
}

/**
 * Fill a mark from a name: its colour, letters, pattern and glyph. Call it
 * again with a new name; an empty name gives the quiet plate.
 * @param {HTMLElement} el a `.kp-idmark`
 * @param {string} name
 * @param {{ slot?: number, hue?: 'palette' | 'free', title?: boolean }} [options]
 *   `slot` a palette slot from idmarkColours(); `hue` defaults to the element's
 *   `data-kp-idmark-hue` ('free') else 'palette'; `title` (default true) puts
 *   the name in the element's title for a pointer
 */
export function setIdmark(el, name, { slot, hue, title = true } = {}) {
    const mark = idmarkFor(name);
    const doc = el.ownerDocument;
    el.classList.add('kp-idmark');
    if (!el.hasAttribute('aria-hidden')) el.setAttribute('aria-hidden', 'true');
    el.setAttribute('data-kp-idmark', mark.name);
    el.toggleAttribute('data-kp-idmark-empty', mark.empty);
    el.setAttribute('data-kp-idmark-glyph', mark.glyph);
    const free = (hue ?? el.getAttribute('data-kp-idmark-hue')) === 'free';
    if (mark.empty) el.style.removeProperty('--kp-idmark-colour');
    else if (free) el.style.setProperty('--kp-idmark-colour', `oklch(from var(--chart-1) l c ${mark.hue})`);
    else el.style.setProperty('--kp-idmark-colour', `var(--chart-${slot ?? mark.slot})`);
    if (title && mark.name) el.title = mark.name;
    else el.removeAttribute('title');
    const xs = el.classList.contains('kp-idmark--xs');
    const letters = doc.createElement('span');
    letters.className = 'kp-idmark__letters';
    letters.textContent = mark.empty ? getStrings().idmarkUnknown : idmarkLetters(mark.name, xs ? 1 : 2);
    el.replaceChildren(letters, ...(mark.empty ? [] : [patternSvg(doc, mark.cells)]));
}

/**
 * Fill every `[data-kp-idmark]` under `root`, and each one added or renamed
 * later. Marks inside one `[data-kp-idmark-set]` share out the palette with
 * idmarkColours(), in document order.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachIdmarks(root = document) {
    /** @type {WeakMap<Element, string>} */
    const drawn = new WeakMap();
    const paint = () => {
        /** @type {Map<Element, Element[]>} */
        const sets = new Map();
        const all = /** @type {HTMLElement[]} */ ([
            ...(root instanceof Element && root.matches(IDMARK) ? [root] : []),
            ...root.querySelectorAll(IDMARK),
        ]);
        for (const el of all) {
            const set = el.closest('[data-kp-idmark-set]');
            if (set) (sets.get(set) ?? sets.set(set, []).get(set))?.push(el);
        }
        /** @type {Map<Element, number>} */
        const slots = new Map();
        for (const members of sets.values()) {
            const colours = idmarkColours(members.map((el) => el.getAttribute('data-kp-idmark') ?? ''));
            for (const el of members) {
                const slot = colours.get((el.getAttribute('data-kp-idmark') ?? '').trim());
                if (slot) slots.set(el, slot);
            }
        }
        for (const el of all) {
            const name = el.getAttribute('data-kp-idmark') ?? '';
            const key = `${name}|${slots.get(el) ?? ''}|${el.getAttribute('data-kp-idmark-hue') ?? ''}|${el.className}`;
            if (drawn.get(el) === key && el.querySelector(':scope > .kp-idmark__letters')) continue;
            setIdmark(el, name, { slot: slots.get(el) });
            drawn.set(el, `${el.getAttribute('data-kp-idmark') ?? ''}|${slots.get(el) ?? ''}|${el.getAttribute('data-kp-idmark-hue') ?? ''}|${el.className}`);
        }
    };
    paint();
    const View = (root instanceof Document ? root : root.ownerDocument)?.defaultView;
    if (!View?.MutationObserver) return () => {};
    let queued = false;
    const observer = new View.MutationObserver((records) => {
        const relevant = records.some(
            (record) =>
                record.type === 'attributes' ||
                [...record.addedNodes].some((node) => node instanceof View.Element && (node.matches(IDMARK) || node.querySelector(IDMARK) !== null)),
        );
        if (!relevant || queued) return;
        queued = true;
        View.queueMicrotask(() => {
            queued = false;
            paint();
        });
    });
    observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-kp-idmark', 'data-kp-idmark-hue'] });
    return () => observer.disconnect();
}
