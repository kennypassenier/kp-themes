// Which block-and-theme pairs are still open, for every theme at once,
// without laying a block out or switching the page's theme.
//
// Since hash version 10 a block's hash is its markup as written
// (block-hash.js readBlocks), so the component pages read once answer for
// every theme: a pair is open exactly when judging.js would leave the block
// on the page in that theme — no verdict, a verdict on other markup, an
// approval whose pixels moved (catalogue/pixel-checks.json, read by
// judgements.js), or a review note that still asks for a look. The theme
// menu's counts, the "next theme" key (shortcuts.js) and the page of what
// changed (changed.js) all read this one answer.
import { THEMES } from '../js/theme-registry.js';
import { COMPONENT_PAGES } from './pages.js';
import { readPage } from './review.js';
import { readBlocks } from './block-hash.js';
import { ENGINE } from './engine.js';
import { loadJudgements, registerReady, stateOf, verdictOf } from './judgements.js';

/** @type {Record<string, Record<string, unknown>>} */
let reviewNotes = {};
const notesReady = (async () => {
    try {
        const response = await fetch(new URL('./review-notes.json', import.meta.url), { cache: 'no-cache' });
        if (!response.ok) return;
        const data = await response.json();
        if (data && typeof data === 'object' && !Array.isArray(data)) reviewNotes = data;
    } catch {
        /* no notes */
    }
})();

/**
 * @typedef {object} GatheredBlock
 * @property {string} id      the verdict key, `slug--block`
 * @property {string} title
 * @property {string} source  the markup as written
 * @property {Element} node   the parsed block
 * @property {string} hash
 * @property {string | null} fixed  the theme the block declares for itself
 */

/** @type {Promise<{ pages: Awaited<ReturnType<typeof readPage>>[], blocks: GatheredBlock[] }> | null} */
let gathered = null;

/** Every component page read once, each block with its hash. */
export function gatherBlocks() {
    gathered ??= (async () => {
        const pages = await Promise.all(COMPONENT_PAGES.map(readPage));
        const flat = pages.flatMap((page) => page.blocks);
        const hashes = await readBlocks(flat.map((block) => ({ root: /** @type {HTMLElement} */ (block.node), source: block.source })));
        await registerReady;
        await notesReady;
        const blocks = flat.map((block, i) => ({ ...block, hash: hashes[i].hash, fixed: block.node.getAttribute('data-cat-theme') }));
        return { pages, blocks };
    })();
    return gathered;
}

/**
 * Whether a block is open in a theme, as judging.js decides it.
 * @param {GatheredBlock} block
 * @param {string} theme
 */
export function isOpen(block, theme, stored = loadJudgements()) {
    if (block.fixed && block.fixed !== theme) return false;
    const state = stateOf(block.id, theme, block.hash, ENGINE, stored);
    const asking = Boolean(reviewNotes[block.id]?.[theme]) && verdictOf(block.id, theme, ENGINE, stored)?.source !== 'browser';
    return !((state === 'approved' || state === 'rejected') && !asking);
}

/** How many blocks are open in each theme. @returns {Promise<Record<string, number>>} */
export async function openCounts() {
    const { blocks } = await gatherBlocks();
    const stored = loadJudgements();
    /** @type {Record<string, number>} */
    const counts = {};
    for (const { name } of THEMES) counts[name] = blocks.filter((block) => isOpen(block, name, stored)).length;
    return counts;
}
