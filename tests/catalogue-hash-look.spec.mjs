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
        // Version 2, still returned in `earlier`, read the Look-at text.
        expect(read.look.earlier[2]).not.toBe(read.written.earlier[2]);
        // The page itself stores what readBlocks reads.
        await page.locator('#states [data-cat-verdict="approved"]').click();
        const stored = await page.evaluate(
            ([key, engine]) => JSON.parse(localStorage.getItem(key) ?? '{}')['switch--states']?.formal?.[engine],
            [JUDGEMENTS, browserName],
        );
        expect(stored).toMatchObject({ hash: read.written.hash, v: 4 });
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
        // Version 3, still returned in `earlier`, read the label.
        expect(outside.rest.earlier[3]).not.toBe(outside.written.earlier[3]);

        await page.goto('/catalogue/combobox.html');
        await waitForJudging(page);
        const inside = await readVariants(page, 'open', {
            note: { selector: '.cat-stage .cat-note', html: 'A note of another length, which the open list must still cover.' },
        });
        expect(inside.note.hash).not.toBe(inside.written.hash);
    },
);

test(
    'a verdict stored under hash version 2 or 3 carries over to version 4 where the block did not change, and not where it did [scope-95, scope-96]',
    { tag: ['@component:catalogue'] },
    async ({ page, browserName }) => {
        await page.goto('/catalogue/switch.html');
        await waitForJudging(page);
        const read = await readVariants(page, 'states', SWITCH_EDITS);
        const invalid = await readVariants(page, 'invalid', {});
        const at = Date.parse('2026-09-15T12:00:00Z');
        await page.evaluate(
            ([key, engine, v2, v3, other, time]) => {
                localStorage.setItem(
                    key,
                    JSON.stringify({
                        // Judged as it stands under version 2: carried over.
                        'switch--states': { formal: { [engine]: { verdict: 'rejected', hash: v2, v: 2, at: time } } },
                        // Judged as it stands under version 3: carried over.
                        'switch--invalid': { formal: { [engine]: { verdict: 'approved', hash: v3, v: 3, at: time } } },
                        // Judged on another look under version 3: left at version 3.
                        'switch--extremes': { formal: { [engine]: { verdict: 'approved', hash: other, v: 3, at: time } } },
                    }),
                );
            },
            [JUDGEMENTS, browserName, read.written.earlier[2], invalid.written.earlier[3], read.stage.earlier[3], at],
        );
        await page.reload();
        await waitForJudging(page);
        const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), JUDGEMENTS);
        expect(stored['switch--states'].formal[browserName]).toEqual({ verdict: 'rejected', hash: read.written.hash, v: 4, at });
        expect(stored['switch--invalid'].formal[browserName]).toEqual({ verdict: 'approved', hash: invalid.written.hash, v: 4, at });
        expect(stored['switch--extremes'].formal[browserName]).toEqual({ verdict: 'approved', hash: read.stage.earlier[3], v: 3, at });
        await expect(page.locator('#states')).toHaveAttribute('data-cat-state', 'rejected');
    },
);
