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
 * @property {string | null} [fingerprint]  see fingerprintOf, once read
 * @property {DemoUpdate | null} [update]   see loadUpdate, once read
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
        // A theme dropped since the demo was made is never asked for.
        .filter((name) => THEMES.some((t) => t.name === name));
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
 * @typedef {object} DemoUpdate
 * @property {number} update  the update's number: 1 for the first redo after a verdict, then 2, …
 * @property {Record<string, Record<string, string>>} picks  per theme, per question: the option Kenny approved
 * @property {Record<string, Record<string, { comment?: string, reply?: string }>>} questions
 *   per theme, per question the update opens again: Kenny's comment and the session's reply
 */

/**
 * A demo's update, the one convention a theme session fills in when it
 * republishes a demo after Kenny's verdict: `update.json` beside demo.html,
 *
 *     { "update": 1,
 *       "picks": { "<theme>": { "<question>": "<option key>" } },
 *       "questions": { "<theme>": { "<question>": { "comment": "<his words>", "reply": "<what changed, or the proposal>" } } } }
 *
 * The next update raises the number and lists only what it opens again.
 * Null when the demo has none.
 * @param {string | URL} url
 * @returns {Promise<DemoUpdate | null>}
 */
export async function loadUpdate(url) {
    try {
        const response = await fetch(url, { cache: 'no-cache' });
        if (!response.ok) return null;
        const data = await response.json();
        const update = Number(data?.update);
        if (!update) return null;
        return { update, picks: data.picks || {}, questions: data.questions || {} };
    } catch {
        return null;
    }
}

/*
 * A demo republished under the same round: a theme session redid options,
 * scenes or styles and kept `data-review-round` (Kenny, 2026-10-07: the new
 * cyberpunk and terminal rounds were "judged in every theme" on his page).
 * Every verdict is stamped with the demo's fingerprint, a hash of its page
 * and of the scripts and sheets in its own folder, and with the round it was
 * given in; a "not approved" of this round on other files is open again
 * (an approval stands, as it does across rounds).
 */

/**
 * The fingerprint of the demo at `url`: its page and the scripts and sheets
 * in its own folder, hashed. Null when it cannot be read or hashed.
 * @param {string | URL} url
 * @param {string} [html] the page's text, when it is already fetched
 * @returns {Promise<string | null>}
 */
export async function fingerprintOf(url, html) {
    try {
        const page = new URL(url);
        page.search = page.hash = '';
        const folder = new URL('.', page).href;
        const text = html ?? (await (await fetch(page, { cache: 'no-cache' })).text());
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const own = [...doc.querySelectorAll('script[src], link[rel="stylesheet"][href]')]
            .map((el) => new URL(el.getAttribute('src') || el.getAttribute('href') || '', page))
            .filter((file) => file.href.startsWith(folder))
            .map((file) => file.href)
            .sort();
        const parts = [text, ...(await Promise.all(own.map(async (file) => (await fetch(file, { cache: 'no-cache' })).text())))];
        const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(parts.join('\u0000')));
        return [...new Uint8Array(digest).slice(0, 8)].map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
        return null;
    }
}

/**
 * Verdicts given before fingerprints were stamped (2026-10-07) carry none:
 * for the demos still waiting then, a verdict older than the last commit
 * that changed the demo's own files is open again. Read once, never added
 * to: every later verdict carries its fingerprint.
 */
const UNSTAMPED_BEFORE = {
    'cyberpunk-character': '2026-10-07T19:24:52Z',
    'solstice-character': '2026-10-07T15:17:44Z',
    'brutalism-character': '2026-10-07T14:24:39Z',
    'terminal-character': '2026-10-07T19:08:45Z',
    'synthwave-character': '2026-10-07T19:22:41Z',
    'grotesk-character': '2026-10-07T14:24:39Z',
    'nostromo-character': '2026-10-07T15:17:26Z',
    'blueprint-character': '2026-10-07T14:24:39Z',
};

/**
 * The verdicts given on another version of this round of the demo.
 * @param {{ id: string, round: DemoShape['round'], fingerprint?: string | null }} shape
 * @param {Record<string, any>} stored
 * @returns {string[]}
 */
export function staleKeys(shape, stored) {
    const round = shape.round?.round || '';
    // A round not yet opened in this browser is read by the round's own rules.
    if (round && (stored.__round || '') !== round) return [];
    const before = UNSTAMPED_BEFORE[/** @type {keyof typeof UNSTAMPED_BEFORE} */ (shape.id)];
    return Object.entries(stored)
        .filter(([key, entry]) => {
            if (key.startsWith('__') || entry?.verdict !== 'rejected') return false;
            if (entry.fingerprint) return (entry.round || '') === round && Boolean(shape.fingerprint) && entry.fingerprint !== shape.fingerprint;
            return Boolean(before) && (entry.at || '') < before;
        })
        .map(([key]) => key);
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
 * @property {number} update       the update's number (update.json), 0 without one
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
    // A verdict on another version of this round: open, as review.js reopens it on load.
    for (const key of staleKeys(shape, stored)) pending.add(key);
    // An update not yet opened in this browser: the themes it asks again.
    if (shape.update && (Number(stored.__update) || 0) < shape.update.update)
        for (const theme of shape.themes)
            if (Object.keys(shape.update.questions[theme] || {}).length) for (const item of shape.items) pending.add(`${theme}|${item}`);
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
        update: shape.update?.update || 0,
        pairs: pairs.length,
        pairsLeft,
    };
}
