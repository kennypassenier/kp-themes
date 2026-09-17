// The block hash does not read a block's Look-at text (scope-95, hash
// version 3). A corrected sentence about pastel in `page-effects#dividers`
// brought the block back in all 22 themes, because version 2 took the markup
// line over the whole section as written. Version 3 reads the markup without
// the reading aids and headings; the stage and everything in it still count.
// Version 4 (scope-96) also leaves out a `.cat-note` label outside every stage
// ("At rest" in `page-effects#headline`); a `.cat-note` inside a stage
// (combobox `#open`) is part of what is judged and still counts. A verdict
// this browser stored under version 2 or 3 carries over where the block did
// not change.
//
// Red run first, on e6e1237a in firefox, before version 3: the hash with a
// changed Look-at text differed from the hash as written, and the stored
// version-2 verdict stayed at `v: 2`. Red run on b9dc0afb in firefox, before
// version 4: the hash with a changed "At rest" label differed from the hash as
// written, and no version-3 reading (`earlier[3]`) was returned to carry over.

import { expect, test } from '@playwright/test';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { waitForJudging } from './helpers/catalogue.mjs';
import { HASH_VERSION } from '../catalogue/block-hash.js';

test.describe.configure({ timeout: 120_000 });

const JUDGEMENTS = 'kp-catalogue-judgements:v3';

test.beforeEach(async ({ context }) => {
    await useEmptyRegister(context);
    await context.addInitScript(() => localStorage.setItem('theme', 'formal'));
});

/**
 * Read one block of the page with its source as written and with variants of
 * it: each variant sets an attribute or the inner HTML of the first element a
 * selector finds in a copy of the source.
 * @param {import('@playwright/test').Page} page
 * @param {string} id
 * @param {Record<string, { selector: string, html?: string, attribute?: [string, string] }>} edits
 */
async function readVariants(page, id, edits) {
    return page.evaluate(async ([blockId, changes]) => {
        const { readBlocks } = await import('/catalogue/block-hash.js');
        const raw = new DOMParser().parseFromString(await (await fetch(location.href)).text(), 'text/html');
        const written = /** @type {Element} */ (raw.getElementById(blockId));
        /** @type {Record<string, string>} */
        const sources = { written: written.outerHTML };
        for (const [name, { selector, html, attribute }] of Object.entries(changes)) {
            const copy = /** @type {Element} */ (written.cloneNode(true));
            const target = copy.querySelector(selector);
            if (!target) throw new Error(`${blockId}: nothing matches ${selector}`);
            if (html !== undefined) target.innerHTML = html;
            if (attribute) target.setAttribute(attribute[0], attribute[1]);
            sources[name] = copy.outerHTML;
        }
        const root = /** @type {Element} */ (document.getElementById(blockId));
        const names = Object.keys(sources);
        const read = await readBlocks(names.map((name) => ({ root, source: sources[name] })));
        return Object.fromEntries(names.map((name, i) => [name, read[i]]));
    }, /** @type {const} */ ([id, edits]));
}

const SWITCH_EDITS = {
    look: { selector: '.cat-look', html: '<b>Look at:</b> a sentence corrected for one theme only.' },
    heading: { selector: ':scope > h2', html: 'States, renamed' },
    stage: { selector: '.cat-stage .kp-switch__input', attribute: /** @type {[string, string]} */ (['disabled', '']) },
    stageStyle: { selector: '.cat-stage', attribute: /** @type {[string, string]} */ (['style', 'flex-direction: row']) },
};

test(
    "changing only a block's Look-at text or heading keeps its hash; changing its stage markup changes it [scope-95]",
    { tag: ['@component:catalogue'] },
    async ({ page, browserName }) => {
        await page.goto('/catalogue/switch.html');
        await waitForJudging(page);
        const read = await readVariants(page, 'states', SWITCH_EDITS);
        expect(read.look.hash).toBe(read.written.hash);
        expect(read.heading.hash).toBe(read.written.hash);
        expect(read.stage.hash).not.toBe(read.written.hash);
        expect(read.stageStyle.hash).not.toBe(read.written.hash);
        // Since scope-114 nothing is carried over: a reading is the markup,
        // the theme and the code, so `earlier` is empty.
        expect(read.written.earlier).toEqual({});
        // The page itself stores what readBlocks reads.
        await page.locator('#states [data-cat-verdict="approved"]').click();
        const stored = await page.evaluate(
            ([key, engine]) => JSON.parse(localStorage.getItem(key) ?? '{}')['switch--states']?.formal?.[engine],
            [JUDGEMENTS, browserName],
        );
        expect(stored).toMatchObject({ hash: read.written.hash, v: HASH_VERSION });
    },
);

test(
    'changing a label outside every stage keeps the hash; changing a label inside a stage changes it [scope-96]',
    { tag: ['@component:catalogue'] },
    async ({ page }) => {
        await page.goto('/catalogue/page-effects.html');
        await waitForJudging(page);
        const outside = await readVariants(page, 'headline', {
            rest: { selector: ':scope > p.cat-note', html: 'At rest, renamed' },
            live: { selector: '.cat-live__bar .cat-note', html: 'Live, renamed' },
            stage: { selector: '.cat-stage', attribute: ['style', 'padding: 3rem'] },
        });
        expect(outside.rest.hash).toBe(outside.written.hash);
        expect(outside.live.hash).toBe(outside.written.hash);
        expect(outside.stage.hash).not.toBe(outside.written.hash);
        expect(outside.written.earlier).toEqual({});

        await page.goto('/catalogue/combobox.html');
        await waitForJudging(page);
        const inside = await readVariants(page, 'open', {
            note: { selector: '.cat-stage .cat-note', html: 'A note of another length, which the open list must still cover.' },
        });
        expect(inside.note.hash).not.toBe(inside.written.hash);
    },
);

// The carry-over test of scope-95 and scope-96 went with scope-114: a reading
// no longer has earlier versions to carry a verdict over from, because it no
// longer reads the paint. What replaces it is tests/catalogue-hash-inputs.spec.mjs.
