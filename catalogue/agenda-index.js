// catalogue/agenda-index.json, read once: what the Agenda needs on its first view without reading every demo page,
// component page and theme register (gates/generate-agenda-index.mjs writes it; its head says what each part is).
//
// Every reader falls back to the live read for what the index does not hold: a demo pushed without regenerating it,
// an index that is missing or cannot be read. The demo parts are used wherever a demo is read from outside it
// (waiting.js readDemo, rv-progress.js loadPart); the pixel checks and the blocks only on a page that asks for them
// with <meta name="kp-agenda-index" content="on"> (the Agenda), because the blocks are hashed in Firefox.

const ROOT = new URL('../', import.meta.url);
const INDEX = new URL('./agenda-index.json', import.meta.url);

/** @type {Promise<any> | null} */
let reading = null;

/** The index, or null when it cannot be read. */
export function readIndex() {
    reading ??= (async () => {
        try {
            const response = await fetch(INDEX, { cache: 'no-cache' });
            if (!response.ok) return null;
            const data = await response.json();
            return data && typeof data === 'object' ? data : null;
        } catch {
            return null;
        }
    })();
    return reading;
}

/** Whether this page asks for the index's pixel checks and blocks. */
export const pageUsesIndex = () => typeof document !== 'undefined' && document.querySelector('meta[name="kp-agenda-index"][content="on"]') !== null;

/** A page's key in the index: its path from the repository root, as pages.js writes it. @param {string | URL} href */
const keyOf = (href) => {
    const url = new URL(href, ROOT);
    return url.origin === ROOT.origin && url.pathname.startsWith(ROOT.pathname) ? decodeURIComponent(url.pathname.slice(ROOT.pathname.length)) : '';
};

/**
 * One demo's facts, fingerprint and update, or null when the index does not hold it.
 * @param {string | URL} href
 * @returns {Promise<{ facts: import('../research/_review/progress.js').DemoFacts, fingerprint: string | null, update: import('../research/_review/progress.js').DemoUpdate | null } | null>}
 */
export async function indexedDemo(href) {
    const entry = (await readIndex())?.demos?.[keyOf(href)];
    return entry && typeof entry === 'object' && entry.facts ? structuredClone(entry) : null;
}

/** An archived demo's decision as readDecided reads it, or undefined when the index does not hold it. @param {string | URL} href */
export async function indexedDecided(href) {
    const decided = (await readIndex())?.decided?.[keyOf(href)];
    return typeof decided === 'string' ? decided : undefined;
}

/** The pixel checks that can reopen a pair, or null. */
export async function indexedPixels() {
    const pixels = (await readIndex())?.pixels;
    return pixels && typeof pixels.checks === 'object' ? structuredClone(pixels) : null;
}

/**
 * Every catalogue block's key, hash, own theme and title, read in `engine`, or null.
 * @returns {Promise<{ engine: string, list: [string, string, string | null, string][] } | null>}
 */
export async function indexedBlocks() {
    const blocks = (await readIndex())?.blocks;
    return blocks && Array.isArray(blocks.list) && typeof blocks.engine === 'string' ? blocks : null;
}
