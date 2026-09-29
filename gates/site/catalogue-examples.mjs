// The catalogue's blocks, as more examples on the site's component pages.
//
// Kenny, 2026-09-29, on site/components/table.html: "er staan 3 voorbeeld
// tables, maar er zijn veel meer opties dan dat. Ik wil veel meer
// voorbeelden zien zodat het visueel altijd duidelijk is wat de opties voor
// onze componenten doen." The review catalogue (catalogue/*.html) already
// holds a worked block for nearly every option and state — seventeen for the
// tables alone, loading and failed among them — and the site showed four.
// Rather than write the same demos twice and let them drift, the site reads
// the catalogue's blocks and shows each on the page of the component it is
// about. One source: a block changed in the catalogue changes here on the
// next `npm run generate:site`, and `--check` notices when it has not.
//
// Which component a block belongs to is read, not declared: the component
// whose class the block's stage uses first, in document order. A data table
// block opens with `.kp-datatable` and lands on the data table's page even
// though a `.kp-table` sits inside it; a plain table opens with
// `.kp-table-wrap` and lands on the table's page.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** @typedef {{ page: string, id: string, title: string, look: string, stages: string[] }} Block */

/**
 * The catalogue pages that hold component blocks, in the catalogue's own order.
 * @param {string} root
 * @returns {string[]}
 */
export function cataloguePages(root) {
    const source = readFileSync(join(root, 'catalogue/pages.js'), 'utf8');
    return [...source.matchAll(/href: 'catalogue\/([a-z-]+\.html)', label: '[^']*', component: true/g)].map((m) => m[1]);
}

/**
 * Every block of one catalogue page.
 * @param {string} html
 * @param {string} page
 * @returns {Block[]}
 */
export function blocksOf(html, page) {
    /** @type {Block[]} */
    const blocks = [];
    for (const m of html.matchAll(/^( *)<section class="cat-block" id="([^"]+)">\n([\s\S]*?)^\1<\/section>/gm)) {
        const [, , id, inner] = m;
        const title = (inner.match(/<h2>([\s\S]*?)<\/h2>/)?.[1] ?? id)
            .replace(/<[^>]+>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        const look = (inner.match(/<div class="cat-look">([\s\S]*?)<\/div>/)?.[1] ?? '')
            .replace(/<b>Look at:<\/b>\s*/, '')
            .replace(/\s+/g, ' ')
            .trim();
        /** @type {string[]} */
        const stages = [];
        for (const s of inner.matchAll(/^( *)<div class="cat-stage[^"]*"[^>]*>\n([\s\S]*?)^\1<\/div>/gm)) stages.push(s[2]);
        if (stages.length > 0) blocks.push({ page, id, title, look, stages });
    }
    return blocks;
}

/**
 * The component a block is about: the one whose class its stages use first.
 * @param {Block} block
 * @param {{ id: string, classes: string[] }[]} descriptors
 * @returns {string | null}
 */
export function ownerOf(block, descriptors) {
    const html = block.stages.join('\n');
    // A button is how most demos open something — a menu, a dialog, a
    // tooltip — so it is the owner only when nothing else is on the stage.
    const firstOf = (/** @type {{ id: string, classes: string[] }[]} */ list) => {
        let best = { at: Infinity, id: /** @type {string | null} */ (null), length: 0 };
        for (const d of list) {
            for (const name of d.classes) {
                if (!name.startsWith('kp-')) continue;
                const hit = new RegExp(`class="(?:[^"]*\\s)?${name.replace(/[-]/g, '\\-')}(?:\\s[^"]*)?"`).exec(html);
                if (hit === null) continue;
                // The earliest element wins; on the same element the longer, more
                // particular class name does (`kp-datatable` over `kp-table`).
            if (hit.index < best.at || (hit.index === best.at && name.length > best.length)) best = { at: hit.index, id: d.id, length: name.length };
            }
        }
        return best.id;
    };
    return firstOf(descriptors.filter((d) => !TRIGGERS.has(d.id))) ?? firstOf(descriptors);
}

/** The components a demo uses to open another one. */
const TRIGGERS = new Set(['button', 'icon-button']);

/**
 * Every catalogue block, grouped by the component it is about.
 * @param {string} root
 * @param {{ id: string, classes: string[] }[]} descriptors
 * @returns {Map<string, Block[]>}
 */
export function catalogueExamples(root, descriptors) {
    /** @type {Map<string, Block[]>} */
    const byComponent = new Map();
    for (const page of cataloguePages(root)) {
        const html = readFileSync(join(root, 'catalogue', page), 'utf8');
        for (const block of blocksOf(html, page)) {
            const owner = ownerOf(block, descriptors);
            if (owner === null) continue;
            if (!byComponent.has(owner)) byComponent.set(owner, []);
            /** @type {Block[]} */ (byComponent.get(owner)).push(block);
        }
    }
    return byComponent;
}
