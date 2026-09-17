// The device pixel ratio a verdict was read at (fix-34, scope-93), and what
// scope-114 did to it: the hash no longer follows the zoom at all — Kenny,
// 2026-09-16: "Als ik iets goedkeur op 125% dan is het voor alle zoom levels
// goedgekeurd." The ratio is still recorded, because it says where he stood,
// and the prompt's verdict line still carries it as a sixth field `@1.25`;
// what changed is that a reading at another zoom now gives the same hash.
//
// Red run first, on be9c034a in firefox, before the change: the stored
// verdict had no ratio (expected 1.25, received undefined).

import { expect, test } from '@playwright/test';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { waitForJudging } from './helpers/catalogue.mjs';
import { HASH_VERSION } from '../catalogue/block-hash.js';
import { hashAt, parseVerdictLines } from '../gates/verdicts.mjs';
import { fileURLToPath } from 'node:url';

test.describe.configure({ timeout: 240_000 });

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const JUDGEMENTS = 'kp-catalogue-judgements:v3';

test(
    'a verdict read at a ratio of 1.25 carries @1.25 in the prompt and reads equal at 1.25 [fix-34]',
    { tag: ['@component:catalogue'] },
    async ({ playwright, browserName, baseURL }) => {
        // The ratio is a Gecko preference given at launch; the deviceScaleFactor
        // makes devicePixelRatio agree, as it does in a real zoomed Firefox.
        test.skip(browserName !== 'firefox', 'layout.css.devPixelsPerPx is a Gecko preference');
        const browser = await playwright.firefox.launch({ firefoxUserPrefs: { 'layout.css.devPixelsPerPx': '1.25' } });
        let hash = '';
        try {
            const context = await browser.newContext({ baseURL, viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1.25 });
            await useEmptyRegister(context);
            await context.addInitScript(() => localStorage.setItem('theme', 'brutalism'));
            const page = await context.newPage();
            await page.goto('/catalogue/switch.html');
            await waitForJudging(page);
            expect(await page.evaluate(() => devicePixelRatio)).toBe(1.25);
            await page.locator('#states [data-cat-verdict="approved"]').click();
            await expect(page.locator('#states')).toHaveAttribute('data-cat-state', 'approved');
            const stored = await page.evaluate(
                (store) => JSON.parse(localStorage.getItem(store) ?? '{}')['switch--states']?.brutalism?.firefox,
                JUDGEMENTS,
            );
            expect(stored.ratio).toBe(1.25);
            hash = stored.hash;
            const prompt = page.locator('.cat-feedback [data-cat-prompt]');
            await expect(prompt).toContainText(
                `Verdict lines (hash version ${HASH_VERSION}):\nswitch--states · brutalism · firefox · approved · ${hash} · @1.25`,
            );
            const parsed = parseVerdictLines((await prompt.textContent()) ?? '');
            expect(parsed.faults).toEqual([]);
            expect(parsed.lines.find((line) => line.key === 'switch--states')?.ratio).toBe(1.25);
        } finally {
            await browser.close();
        }
        const requests = [{ key: 'switch--states', theme: 'brutalism' }];
        const at125 = await hashAt({ root: ROOT, engine: 'firefox', requests, ratio: 1.25 });
        expect(at125.get('switch--states|brutalism')?.hash, 'read at 1.25').toBe(hash);
        // Since scope-114 the reading is the block's inputs, so the zoom does
        // not enter it at all: what Kenny approves at 125% is approved at every
        // zoom. The ratio is still written down — it says where he stood.
        const at1 = await hashAt({ root: ROOT, engine: 'firefox', requests });
        expect(at1.get('switch--states|brutalism')?.hash, 'read at 1: the same block, the same hash').toBe(hash);
    },
);

test(
    'a verdict read at a ratio of 1 keeps the five-field line [fix-34]',
    { tag: ['@component:catalogue'] },
    async ({ page, context, browserName }) => {
        test.skip(browserName !== 'firefox', 'the ratio is read the Gecko way here');
        await useEmptyRegister(context);
        await page.setViewportSize({ width: 1400, height: 900 });
        await page.goto('/catalogue/switch.html');
        await waitForJudging(page);
        await page.locator('#states [data-cat-verdict="approved"]').click();
        const stored = await page.evaluate((store) => JSON.parse(localStorage.getItem(store) ?? '{}')['switch--states']?.formal?.firefox, JUDGEMENTS);
        expect(stored).not.toHaveProperty('ratio');
        await expect(page.locator('.cat-feedback [data-cat-prompt]')).toContainText(
            `switch--states · formal · firefox · approved · ${stored.hash}\n`,
        );
    },
);
