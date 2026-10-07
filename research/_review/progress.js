// How far a research demo's review has come, read from outside the demo: the
// hub (catalogue/changed.html) lists every demo waiting for Kenny's verdict
// with its state, without opening it (Kenny, 2026-10-05: "dingen bundelen
// zodat ik vanuit één centrale locatie/pagina verder kan").
//
// One store, one key: review.js keeps its verdicts under storeKey(), and this
// module reads the same entry. What counts as open mirrors review.js: a step
// is one theme (plus one step for the catalogue blocks a demo carries along),
// a pair is open while it has no verdict, and a round the demo announces
// (`data-review-round`) reopens its rejected and named pairs. Here that
// reopening is only read, never written: the demo writes it when it opens.
import { THEMES } from '../../js/theme-registry.js';

/** Where review.js keeps a demo's verdicts, notes and picks (localStorage). */
export const storeKey = (demo) => `kp-demo-review:${demo}`;

/**
 * @typedef {object} DemoShape
 * @property {string} id         the demo id (`data-review` on <html>)
 * @property {string} ask        what the demo asks, from its own header
 * @property {string[]} themes   the themes it walks, in order
 * @property {string[]} items    its judged sections (`data-review-item`)
 * @property {string[]} extras   the keys of the catalogue pairs it carries along
 * @property {{ round?: string, reopen?: string[] } | null} round
 */

const parseJson = (text, fallback) => {
    try {
        return JSON.parse(text || '') ?? fallback;
    } catch {
        return fallback;
    }
};

const words = (node) => (node?.textContent ?? '').replace(/\s+/g, ' ').trim();

/**
 * What a demo asks, in a line: the last two sentences of its header's first
 * paragraph, where every character-round demo states its question ("Here
 * every theme gets two … Pick one of the three per theme."). A demo can say
 * it itself with `data-review-ask` on <html>.
 * @param {Document} doc
 */
function askOf(doc) {
    const own = doc.documentElement.getAttribute('data-review-ask');
    if (own) return own;
    const text = words(doc.querySelector('main header p, header p, main p'));
    const sentences = text.match(/[^.!?]+[.!?]+(?=\s|$)/g) ?? [text];
    return sentences.slice(-2).join('').trim();
}

/**
 * Read a demo's shape from its markup, or null when it does not carry the
 * review kit (no `data-review`, or no judged section).
 * @param {Document} doc
 * @returns {DemoShape | null}
 */
export function shapeOf(doc) {
    const root = doc.documentElement;
    const id = root.getAttribute('data-review');
    const items = [...doc.querySelectorAll('[data-review-item]')].map((section) => section.getAttribute('data-review-item') ?? '');
    if (!id || !items.length) return null;
    const listed = (root.getAttribute('data-review-themes') ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    /** @type {{ page: string, block: string, theme: string, engine?: string }[]} */
    const extras = parseJson(doc.querySelector('script[data-review-extra]')?.textContent, []);
    return {
        id,
        ask: askOf(doc),
        themes: listed.length ? listed : THEMES.map((t) => t.name),
        items,
        extras: extras.map((extra) => {
            const slug = extra.page.replace(/^.*\//, '').replace(/\.html$/, '');
            return `catalogue|${slug}--${extra.block}|${extra.theme}|${extra.engine || 'firefox'}`;
        }),
        round: parseJson(doc.querySelector('script[data-review-round]')?.textContent, null),
    };
}

/** The stored verdicts of a demo, as review.js keeps them. */
export function storedFor(id) {
    try {
        return JSON.parse(localStorage.getItem(storeKey(id)) || '{}') || {};
    } catch {
        return {};
    }
}

/**
 * @typedef {object} DemoProgress
 * @property {'decided' | 'updated' | 'partly' | 'new'} state
 *   `new` only while the demo never had a verdict in this browser; `updated`
 *   while a later round (or redrawn sections) left pairs open that were judged
 *   before (Kenny, 2026-10-07: "dan weet ik in welke ronde ik zit")
 * @property {number} themes       themes the demo walks
 * @property {number} themesLeft   themes with a section still open
 * @property {boolean} extrasLeft  catalogue blocks the demo carries, still open
 * @property {string[]} updated    themes open again since an earlier verdict
 * @property {boolean} extrasUpdated  the catalogue blocks are open again too
 * @property {number} pairs
 * @property {number} pairsLeft
 */

/**
 * How far a demo's review has come, from its shape and its stored verdicts.
 * @param {DemoShape} shape
 * @param {Record<string, any>} [stored]
 * @returns {DemoProgress}
 */
export function progressOf(shape, stored = storedFor(shape.id)) {
    /** Pairs a round not yet opened in this browser will reopen on load (review.js): open, whatever their verdict. */
    const pending = new Set();
    if (shape.round?.round && stored.__round !== shape.round.round) {
        for (const [key, entry] of Object.entries(stored)) if (entry?.verdict === 'rejected') pending.add(key);
        for (const key of shape.round.reopen ?? []) pending.add(key);
    }
    // The pairs the round reopened, pending or already reopened (review.js
    // lists those under `__reopened`): they name the themes an update is in,
    // and a verdict given on one since closes it like any other pair.
    const reopened = new Set(pending.size ? pending : Array.isArray(stored.__reopened) ? stored.__reopened : []);
    const open = (key) => !stored[key]?.verdict || pending.has(key);
    const steps = shape.themes.map((theme) => shape.items.map((item) => `${theme}|${item}`));
    if (shape.extras.length) steps.push(shape.extras);
    const pairs = steps.flat();
    const pairsLeft = pairs.filter(open).length;
    const themeSteps = steps.slice(0, shape.themes.length);
    const themesLeft = themeSteps.filter((step) => step.some(open)).length;
    const extrasLeft = shape.extras.length > 0 && shape.extras.some(open);

    // Judged before: any verdict kept, or a round that reopened some.
    const judgedBefore = reopened.size > 0 || Object.values(stored).some((entry) => entry?.verdict);
    // Open again: reopened by a round, or, when the demo was redrawn under new
    // section names and nothing it shows has a verdict, every open pair.
    const redrawn = judgedBefore && pairsLeft === pairs.length;
    const again = (key) => open(key) && (redrawn || reopened.has(key));
    const updated = shape.themes.filter((_, i) => themeSteps[i].some(again));
    const extrasUpdated = shape.extras.some(again);
    let state = 'partly';
    if (pairsLeft === 0) state = 'decided';
    else if (updated.length || extrasUpdated) state = 'updated';
    else if (pairsLeft === pairs.length) state = 'new';
    return {
        state,
        themes: shape.themes.length,
        themesLeft,
        extrasLeft,
        updated,
        extrasUpdated,
        pairs: pairs.length,
        pairsLeft,
    };
}
