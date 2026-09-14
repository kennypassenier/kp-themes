// The review tooling: one prompt across every page, verdicts and notes in
// the compare columns under the review page's keys, the same block hash in
// both places, and compare columns that keep their own themes (Kenny,
// 2026-09-13).
//
// Red run first, on c3d1cd4 in firefox, before the change:
//   - "same hash": the compare column had no Approve button to press;
//     by construction the old hash (every element of the block, headings
//     and stage container included) could not match a column that lays a
//     block out as separate rows;
//   - "top theme": both columns followed the top picker to nostromo;
//   - "one prompt": the third page's prompt held only its own page;
//   - "compare verdict": no verdict could be made in a column.
//   - the component page half of "same hash" was added with Kenny's second
//     request of the day; the old component pages had no verdicts at all.
//
// Firefox only while building; the review page gathers every component page
// and measures every block, so these tests carry a long timeout.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { HASH_VERSION } from '../catalogue/block-hash.js';
// A register of the test's own in place of catalogue/verdicts.json, so the
// verdicts recorded in the repository do not decide what these tests can press.
import { useEmptyRegister, useRegister } from './helpers/empty-register.mjs';
import { waitForJudging } from './helpers/catalogue.mjs';

test.describe.configure({ timeout: 180_000 });

const JUDGEMENTS = 'kp-catalogue-judgements:v3';
const FEEDBACK = 'kp-catalogue-feedback:v1';

/** The engine a Playwright project runs, as catalogue/engine.js names it. */
const engineOf = (browserName) => browserName;
const ENGINE_LABEL = { firefox: 'Firefox', chromium: 'Chromium', webkit: 'WebKit' };

test.beforeEach(async ({ context }) => {
    await useEmptyRegister(context);
});

/** The hash this browser stored for a block in a theme. */
function storedHash(page, id, theme, engine) {
    return page.evaluate(
        ([key, block, name, eng]) => JSON.parse(localStorage.getItem(key) ?? '{}')[block]?.[name]?.[eng]?.hash,
        [JUDGEMENTS, id, theme, engine],
    );
}

/** @param {import('@playwright/test').Page} page */
async function setTheme(page, theme) {
    await page.evaluate((name) => import('/js/theme-core.js').then((m) => m.applyTheme(name)), theme);
}

/** The review page, composed and measured in the theme on screen. */
async function openReview(page) {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto('/catalogue/index.html');
    await waitForJudging(page, { timeout: 120_000 });
}

/** Approve a block on the review page in the theme on screen; returns the stored hash. */
async function approveOnReview(page, id, theme) {
    const engine = engineOf(page.context().browser()?.browserType().name() ?? 'firefox');
    await setTheme(page, theme);
    const section = page.locator(`[id="${id}"]`);
    // Unhide everything, so an already judged block is still pressable.
    await page.locator('[data-cat-show-judged]').check();
    await expect(section.locator('[data-cat-approval-state]')).toContainText(` · ${theme === 'formal' ? 'Formal' : 'Cyberpunk'}`);
    await waitForJudging(page, { timeout: 120_000 });
    const approve = section.locator('[data-cat-verdict="approved"]');
    await expect(approve).toBeEnabled();
    await approve.click();
    return storedHash(page, id, theme, engine);
}

/** @param {import('@playwright/test').Page} page */
async function openCompare(page, component, a = 'formal', b = 'cyberpunk') {
    // Wide enough that a column's data table stays a table: below a 40rem
    // container it becomes cards (`@container kp-table`), which is a different
    // look and rightly a different hash — measured 2026-09-13 at 1600 px, where
    // each column's stage was about 580 px wide.
    await page.setViewportSize({ width: 1920, height: 1000 });
    await page.goto(`/catalogue/compare.html?a=${a}&b=${b}&component=${component}`);
    const frames = page.locator('iframe.cat-compare__frame');
    await expect(frames).toHaveCount(2);
    return { a: page.frameLocator('iframe.cat-compare__frame >> nth=0'), b: page.frameLocator('iframe.cat-compare__frame >> nth=1') };
}

test(
    'the same block in the same theme hashes the same on the review page, its component page and in a compare column',
    { tag: ['@component:catalogue'] },
    async ({ browser, browserName }) => {
        const engine = engineOf(browserName);
        const blocks = [
            ['button', 'button--variants'],
            ['table', 'table--datatable'],
        ];
        const review = await browser.newContext();
        await useEmptyRegister(review);
        const reviewPage = await review.newPage();
        await openReview(reviewPage);
        const expected = {};
        for (const [, id] of blocks) {
            for (const theme of ['formal', 'cyberpunk']) expected[`${id}|${theme}`] = await approveOnReview(reviewPage, id, theme);
        }
        await review.close();
        for (const value of Object.values(expected)) expect(value).toMatch(/^[0-9a-f]{64}$/);

        // A fresh browser: nothing judged, so the column measures on its own.
        const compare = await browser.newContext();
        await useEmptyRegister(compare);
        const page = await compare.newPage();
        for (const [component, id] of blocks) {
            const columns = await openCompare(page, component);
            for (const [side, theme] of [
                ['a', 'formal'],
                ['b', 'cyberpunk'],
            ]) {
                const approve = columns[side].locator(`[data-cat-block="${id}"] [data-cat-verdict="approved"]`);
                await expect(approve).toBeEnabled({ timeout: 60_000 });
                await approve.click();
            }
            const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), JUDGEMENTS);
            expect.soft(stored[id]?.formal?.[engine]?.hash, `${id} in formal`).toBe(expected[`${id}|formal`]);
            expect.soft(stored[id]?.cyberpunk?.[engine]?.hash, `${id} in cyberpunk`).toBe(expected[`${id}|cyberpunk`]);
        }
        await compare.close();

        // And on the component page itself, a third fresh browser.
        const own = await browser.newContext();
        await useEmptyRegister(own);
        const ownPage = await own.newPage();
        await ownPage.setViewportSize({ width: 1400, height: 900 });
        for (const [component, id] of blocks) {
            await ownPage.goto(`/catalogue/${component}.html`);
            const block = id.slice(component.length + 2);
            for (const theme of ['formal', 'cyberpunk']) {
                await setTheme(ownPage, theme);
                await waitForJudging(ownPage);
                const panel = ownPage.locator(`#${block} .cat-judge`);
                await expect(panel.locator('[data-cat-approval-state]')).toContainText(
                    `Not yet judged · ${theme === 'formal' ? 'Formal' : 'Cyberpunk'} · ${ENGINE_LABEL[engine]}`,
                );
                await panel.locator('[data-cat-verdict="approved"]').click();
                await ownPage.locator('[data-cat-show-judged]').check();
            }
            const stored = await ownPage.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), JUDGEMENTS);
            expect.soft(stored[id]?.formal?.[engine]?.hash, `${id} in formal on its own page`).toBe(expected[`${id}|formal`]);
            expect.soft(stored[id]?.cyberpunk?.[engine]?.hash, `${id} in cyberpunk on its own page`).toBe(expected[`${id}|cyberpunk`]);
        }
        await own.close();
    },
);

test('changing the top theme on the compare page leaves both columns in their own themes', { tag: ['@component:catalogue'] }, async ({ page }) => {
    await openCompare(page, 'button');
    const frames = page.locator('iframe.cat-compare__frame');
    const themeOf = (i) => frames.nth(i).evaluate((f) => f.contentDocument?.documentElement.dataset.theme);
    await expect.poll(() => themeOf(0)).toBe('formal');
    await expect.poll(() => themeOf(1)).toBe('cyberpunk');
    await page.locator('.cat-bar__theme button[popovertarget]').click();
    await page.locator('.cat-bar__theme [data-kp-theme="nostromo"]').click();
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('nostromo');
    await page.waitForTimeout(500);
    expect(await themeOf(0)).toBe('formal');
    expect(await themeOf(1)).toBe('cyberpunk');
});

test(
    'a note on one page and a verdict on the review page share one prompt on a third page, and Clear prompt empties it',
    { tag: ['@component:catalogue'] },
    async ({ page }) => {
        page.on('dialog', (dialog) => dialog.accept());
        await page.setViewportSize({ width: 1400, height: 900 });
        await page.goto('/catalogue/button.html');
        const note = 'the ghost button needs a visible edge';
        await page.locator('#cat-feedback-variants').fill(note);

        await openReview(page);
        await approveOnReview(page, 'switch--states', 'formal');

        await page.goto('/research/grotesk-hover/demo.html');
        const top = page.locator('[data-cat-prompt-bar]');
        await expect(top).toBeVisible();
        // A component page's note lives under the review page's key, so both are one page.
        await expect(top.locator('[data-cat-prompt-count]')).toContainText('2 new item(s) for the prompt, from 1 page(s)');
        await top.locator('[data-cat-prompt-show]').click();
        const text = top.locator('[data-cat-prompt]');
        await expect(text).toContainText(note);
        await expect(text).toContainText('Buttons › Variants (#button--variants)');
        await expect(text).toContainText('(catalogue/index.html)');
        await expect(text).toContainText('Approved (1): Switch › States');
        // The same prompt at the foot of the page.
        await expect(page.locator('.cat-feedback [data-cat-prompt]')).toHaveText((await text.textContent()) ?? '');

        await top.locator('[data-cat-prompt-clear]').click();
        await expect(top.locator('[data-cat-prompt-count]')).toContainText('Nothing new');
        await expect(text).not.toContainText(note);
        expect(await page.evaluate((key) => localStorage.getItem(key), FEEDBACK)).toBe('{}');
        // The verdict stays; only its place in a prompt is used up.
        const judgements = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), JUDGEMENTS);
        expect(Object.keys(judgements).length).toBe(1);
        await page.locator('.cat-feedback [data-cat-include-copied]').check();
        await expect(page.locator('.cat-feedback [data-cat-prompt]')).toContainText('Approved (1)');
    },
);

test(
    'a verdict made in a compare column shows as that verdict on the review page',
    { tag: ['@component:catalogue'] },
    async ({ page, browserName }) => {
        const label = ENGINE_LABEL[engineOf(browserName)];
        const columns = await openCompare(page, 'button', 'formal', 'cyberpunk');
        const reject = columns.b.locator('[data-cat-block="button--variants"] [data-cat-verdict="rejected"]');
        await expect(reject).toBeEnabled({ timeout: 60_000 });
        await reject.click();
        await expect(columns.b.locator('[data-cat-block="button--variants"] [data-cat-approval-state]')).toHaveText(
            `Not approved · Cyberpunk · ${label}`,
        );
        const note = columns.a.locator('[data-cat-block="button--variants"] textarea');
        await note.fill('formal variants: fine');

        await page.evaluate(() => localStorage.setItem('theme', 'cyberpunk'));
        await openReview(page);
        await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('cyberpunk');
        await expect(page.locator('#button--variants')).toHaveAttribute('data-cat-state', 'rejected');
        await page.locator('[data-cat-show-judged]').check();
        await expect(page.locator('#button--variants [data-cat-approval-state]')).toHaveText(`Not approved · Cyberpunk · ${label}`);
        // The note from the formal column is the review page's note for that block in formal.
        await setTheme(page, 'formal');
        await expect(page.locator('[id="cat-feedback-button--variants"]')).toHaveValue('formal variants: fine');
    },
);

test(
    'a note stored under a component page moves to the review page key, and a note already there is kept',
    { tag: ['@component:catalogue'] },
    async ({ page }) => {
        await page.goto('/catalogue/switch.html');
        await page.evaluate((key) => {
            localStorage.setItem(
                key,
                JSON.stringify({
                    'catalogue/button.html': { variants: { formal: 'old page note' }, sizes: { formal: 'second' } },
                    'catalogue/index.html': { 'button--variants': { formal: 'review page note' } },
                }),
            );
        }, FEEDBACK);
        await page.goto('/catalogue/button.html');
        await expect(page.locator('#cat-feedback-sizes')).toHaveValue('second');
        // Neither note carries a time, so neither is thrown away.
        await expect(page.locator('#cat-feedback-variants')).toHaveValue('review page note\nold page note');
        const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), FEEDBACK);
        expect(Object.keys(stored)).toEqual(['catalogue/index.html']);
        expect(stored['catalogue/index.html']['button--sizes'].formal).toBe('second');
    },
);

/* ------------------------------------------------------ the verdict register */

test('the page detects its own browser engine, without being told', { tag: ['@component:catalogue'] }, async ({ page, browserName }) => {
    await page.goto('/catalogue/switch.html');
    expect(await page.evaluate(() => import('/catalogue/engine.js').then((m) => m.ENGINE))).toBe(engineOf(browserName));
    await expect(page.locator('#states [data-cat-approval-state]')).toContainText(`· ${ENGINE_LABEL[engineOf(browserName)]}`, { timeout: 60_000 });
});

test(
    'a verdict in the register shows as judged in a fresh browser, only in its own engine',
    { tag: ['@component:catalogue'] },
    async ({ browser, browserName }) => {
        const engine = engineOf(browserName);
        const other = engine === 'firefox' ? 'chromium' : 'firefox';
        // The hashes this engine reads for two blocks, taken in a browser of its own.
        const first = await browser.newContext();
        await useEmptyRegister(first);
        const measuring = await first.newPage();
        await measuring.setViewportSize({ width: 1400, height: 900 });
        await measuring.goto('/catalogue/switch.html');
        await waitForJudging(measuring);
        const hashes = {};
        for (const block of ['states', 'invalid']) {
            const approve = measuring.locator(`#${block} [data-cat-verdict="approved"]`);
            await expect(approve).toBeEnabled();
            await approve.click();
            hashes[block] = await storedHash(measuring, `switch--${block}`, 'formal', engine);
            expect(hashes[block]).toMatch(/^[0-9a-f]{64}$/);
        }
        await first.close();

        // A fresh browser, nothing in storage; the register holds one verdict in
        // this engine and one given in the other engine.
        const entry = (hash, verdict) => ({ verdict, hash, commit: '2a32791', given: '2026-09-13' });
        const fresh = await browser.newContext();
        await useRegister(fresh, {
            'switch--states': { formal: { [engine]: entry(hashes.states, 'approved') } },
            'switch--invalid': { formal: { [other]: entry(hashes.invalid, 'approved') } },
        });
        const page = await fresh.newPage();
        await page.setViewportSize({ width: 1400, height: 900 });
        await page.goto('/catalogue/switch.html');
        expect(await page.evaluate((key) => localStorage.getItem(key), JUDGEMENTS)).toBeNull();
        await waitForJudging(page);
        await expect(page.locator('#states')).toHaveAttribute('data-cat-state', 'approved');
        // Judged, so it leaves the page like a block judged in this browser.
        await expect(page.locator('#states')).toBeHidden();
        await page.locator('[data-cat-show-judged]').check();
        await expect(page.locator('#states [data-cat-approval-state]')).toHaveText(`Approved · Formal · ${ENGINE_LABEL[engine]}`);
        await expect(page.locator('#states [data-cat-verdict-source]')).toHaveText('In the register');
        // The other engine's verdict is a separate test: here the block is not judged.
        await expect(page.locator('#invalid')).toHaveAttribute('data-cat-state', 'new');
        await expect(page.locator('#invalid [data-cat-approval-state]')).toHaveText(`Not yet judged · Formal · ${ENGINE_LABEL[engine]}`);
        // A recorded verdict is not passed on again.
        await expect(page.locator('[data-cat-prompt-count]')).toContainText('Nothing');
        await fresh.close();
    },
);

test(
    'a new verdict in this browser carries a verdict line in the prompt that record can read',
    { tag: ['@component:catalogue'] },
    async ({ page, browserName }) => {
        const engine = engineOf(browserName);
        await page.setViewportSize({ width: 1400, height: 900 });
        await page.goto('/catalogue/button.html');
        await waitForJudging(page);
        const reject = page.locator('#sizes [data-cat-verdict="rejected"]');
        await expect(reject).toBeEnabled();
        await reject.click();
        const hash = await storedHash(page, 'button--sizes', 'formal', engine);
        await expect(page.locator('#sizes [data-cat-verdict-source]')).toHaveText('In this browser, not yet recorded');
        const prompt = page.locator('.cat-feedback [data-cat-prompt]');
        await expect(prompt).toContainText(`In ${ENGINE_LABEL[engine]}:`);
        await expect(prompt).toContainText('Not approved (1): Buttons › Sizes');
        await expect(prompt).toContainText(`Verdict lines (hash version ${HASH_VERSION}):\nbutton--sizes · formal · ${engine} · rejected · ${hash}`);

        // The record tool reads exactly that text.
        const { parseVerdictLines } = await import('../gates/verdicts.mjs');
        const parsed = parseVerdictLines((await prompt.textContent()) ?? '');
        expect(parsed.faults).toEqual([]);
        expect(parsed.version).toBe(HASH_VERSION);
        expect(parsed.lines).toEqual([expect.objectContaining({ key: 'button--sizes', theme: 'formal', engine, verdict: 'rejected', hash })]);
    },
);

test(
    'a verdict stored before engines counts for this browser’s engine, and is not passed on twice',
    { tag: ['@component:catalogue'] },
    async ({ page, browserName }) => {
        const engine = engineOf(browserName);
        const old = 'f'.repeat(64);
        await page.goto('/catalogue/switch.html');
        await page.evaluate((hash) => {
            localStorage.clear();
            localStorage.setItem('kp-catalogue-judgements:v2', JSON.stringify({ 'switch--states': { cyberpunk: { verdict: 'approved', hash } } }));
            localStorage.setItem('kp-catalogue-copied:v2', JSON.stringify([`verdict|switch--states|cyberpunk|approved|${hash}`]));
        }, old);
        await page.goto('/catalogue/switch.html');
        await waitForJudging(page);
        const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), JUDGEMENTS);
        expect(stored['switch--states'].cyberpunk[engine]).toEqual({ verdict: 'approved', hash: old });
        await expect(page.locator('[data-cat-prompt-count]')).toContainText('Nothing new');
    },
);

/* ------------------------------------------------------------ review notes */

// Kenny, 2026-09-14: a rejected block carries a temporary text — his note and
// what changed to answer it — until he approves it, instead of an addendum to
// the block's own "Look at:" text, which would send all 22 themes back.
//
// Red run first, on 2738d1c in firefox: no `[data-cat-review-note]` callout
// existed, and the rejected block with a note stayed hidden behind "Show
// blocks already judged".
test(
    'a review note shows in its own theme only, leaves the block hash alone, and brings a judged block back',
    { tag: ['@component:catalogue'] },
    async ({ browser, browserName }) => {
        const engine = engineOf(browserName);
        const note = {
            rejected: 'the checked state is too faint',
            change: 'The checked track now fills with the primary colour, so on and off differ by more than the knob position.',
            commit: 'abc1234',
            given: '2026-09-14',
        };
        // The hashes without any note file.
        const first = await browser.newContext({ viewport: { width: 1400, height: 900 } });
        await useEmptyRegister(first);
        const measuring = await first.newPage();
        await measuring.goto('/catalogue/switch.html');
        await waitForJudging(measuring);
        const hashes = {};
        for (const block of ['states', 'invalid']) {
            const reject = measuring.locator(`#${block} [data-cat-verdict="rejected"]`);
            await expect(reject).toBeEnabled();
            await reject.click();
            hashes[block] = await storedHash(measuring, `switch--${block}`, 'formal', engine);
            expect(hashes[block]).toMatch(/^[0-9a-f]{64}$/);
        }
        await first.close();

        // Both blocks rejected in the register with those hashes; only one carries a note.
        const entry = (hash) => ({ verdict: 'rejected', hash, commit: '2a32791', given: '2026-09-13' });
        const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
        await useRegister(
            context,
            { 'switch--states': { formal: { [engine]: entry(hashes.states) } }, 'switch--invalid': { formal: { [engine]: entry(hashes.invalid) } } },
            { 'switch--states': { formal: note } },
        );
        const page = await context.newPage();
        await page.goto('/catalogue/switch.html');
        await waitForJudging(page);

        // The same look, so the same verdict — and still on the page, because of the note.
        await expect(page.locator('#states')).toHaveAttribute('data-cat-state', 'rejected');
        await expect(page.locator('#states')).toBeVisible();
        await expect(page.locator('#invalid')).toHaveAttribute('data-cat-state', 'rejected');
        await expect(page.locator('#invalid')).toBeHidden();
        await expect(page.locator('[data-cat-review-count]')).toContainText(/^\d+ of \d+ block\(s\) left to judge/);

        const callout = page.locator('#states [data-cat-review-note]');
        await expect(callout).toBeVisible();
        await expect(callout).toContainText('Rejected — what changed');
        await expect(callout).toContainText(note.rejected);
        await expect(callout).toContainText(note.change);
        // Outside the component under review, inside the judging panel.
        expect(await callout.evaluate((el) => Boolean(el.closest('.cat-judge')) && !el.closest('.cat-stage'))).toBe(true);

        // The note does not change the hash: the page reads what the first browser read.
        const read = await page.evaluate(async () => {
            const { readBlocks } = await import('/catalogue/block-hash.js');
            const raw = new DOMParser().parseFromString(await (await fetch(location.href)).text(), 'text/html');
            const [r] = await readBlocks([{ root: document.getElementById('states'), source: raw.getElementById('states').outerHTML }]);
            return r.hash;
        });
        expect(read).toBe(hashes.states);

        // Another theme has no note: no callout, and the block follows its own verdict there.
        await setTheme(page, 'nostromo');
        await waitForJudging(page);
        await expect(page.locator('#states [data-cat-review-note]')).toBeHidden();

        // Back in formal, approving it in this browser answers the note: the block leaves the page.
        await setTheme(page, 'formal');
        await waitForJudging(page);
        await expect(callout).toBeVisible();
        await page.locator('#states [data-cat-verdict="approved"]').click();
        expect(await storedHash(page, 'switch--states', 'formal', engine)).toBe(hashes.states);
        await expect(page.locator('#states')).toBeHidden();
        await context.close();
    },
);

/* ------------------------------------- the register as the review page reads it */

// The register's hashes are taken on the component pages; Kenny judges mostly
// on the review page. A block reads the same state there in a fresh
// load and after a theme switch, at both of the widths he reviews at.
//
// Red run first, on 193974d in firefox: in nostromo ten register blocks read
// "Changed since judged" on a fresh load (feedback--spinner, overlays--dialog,
// overlays--dialog-parts, overlays--confirm, overlays--dialog-long,
// navigation--bar-collapsed, navigation--bar-long, navigation--tabs-many,
// data--shortcuts, data--col-low) and media--marquee an eleventh after a
// switch. The review page hid every component whose blocks were all judged in
// the register before the first reading, and read those blocks inside a
// display:none component.
const REGISTER = JSON.parse(readFileSync(new URL('../catalogue/verdicts.json', import.meta.url), 'utf8'));

/** The register's verdicts for one theme and engine: block key -> verdict. */
const registerVerdicts = (theme, engine) =>
    Object.fromEntries(
        Object.entries(REGISTER.verdicts)
            .filter(([, themes]) => themes[theme]?.[engine])
            .map(([key, themes]) => [key, themes[theme][engine].verdict]),
    );

/** Every register block on the review page whose state is not its verdict, once measuring is done. */
async function reviewMismatches(page, theme, verdicts) {
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme), { timeout: 30_000 }).toBe(theme);
    await waitForJudging(page, { timeout: 150_000 });
    const states = await page.evaluate(
        (keys) => Object.fromEntries(keys.map((key) => [key, document.getElementById(key)?.dataset.catState])),
        Object.keys(verdicts),
    );
    return Object.entries(verdicts)
        .filter(([key, verdict]) => states[key] !== verdict)
        .map(([key, verdict]) => `${key}: ${states[key]} (register: ${verdict})`);
}

for (const theme of ['nostromo', 'formal']) {
    for (const [width, height] of [
        [1400, 900],
        [1920, 1000],
    ]) {
        test(
            `every register block in ${theme} reads the same state on the review page at ${width}, after a fresh load and after a theme switch`,
            { tag: ['@component:catalogue', `@theme:${theme}`] },
            async ({ browser, browserName }) => {
                const verdicts = registerVerdicts(theme, engineOf(browserName));
                test.skip(Object.keys(verdicts).length === 0, `the register holds no ${theme} verdicts in ${browserName}`);
                // The register as committed: a context of its own, without the empty one beforeEach serves.
                const context = await browser.newContext({ viewport: { width, height } });
                const page = await context.newPage();

                await page.goto('/catalogue/switch.html');
                await page.evaluate((name) => localStorage.setItem('theme', name), theme);
                await page.goto('/catalogue/index.html');
                // A block changed on purpose since it was judged reads "changed" in every
                // reading alike, and waits for Kenny; what this guards is that the reading
                // does not depend on how the page was reached [scope-80]. The red run above
                // failed this too: ten blocks changed on a fresh load, none after a switch.
                const fresh = await reviewMismatches(page, theme, verdicts);

                const other = theme === 'formal' ? 'nostromo' : 'formal';
                await page.evaluate((name) => localStorage.setItem('theme', name), other);
                await page.goto('/catalogue/index.html');
                await reviewMismatches(page, other, {});
                await setTheme(page, theme);
                expect.soft(await reviewMismatches(page, theme, verdicts), `after switching from ${other}`).toEqual(fresh);

                // And back again, with the blocks hidden in the meantime: a component
                // that measures itself (a tab row's overflow) must not be read with
                // what it measured while hidden.
                await setTheme(page, other);
                await reviewMismatches(page, other, {});
                await setTheme(page, theme);
                expect.soft(await reviewMismatches(page, theme, verdicts), `after switching to ${other} and back`).toEqual(fresh);
                await context.close();
            },
        );
    }
}

test(
    'a block hashes the same in a short window and a tall one, a narrow one and a wide one',
    { tag: ['@component:catalogue'] },
    async ({ browser }) => {
        // The palette's `margin: 10vh` and the footer's `clamp(…4vw…)` padding
        // moved these hashes with the window before version 2 (measured 2026-09-13).
        const read = async (width, height) => {
            const context = await browser.newContext({ viewport: { width, height } });
            await useEmptyRegister(context);
            const page = await context.newPage();
            await page.goto('/catalogue/page.html');
            await waitForJudging(page);
            const hashes = await page.evaluate(async () => {
                const { readBlocks } = await import('/catalogue/block-hash.js');
                const raw = new DOMParser().parseFromString(await (await fetch(location.href)).text(), 'text/html');
                const ids = ['palette', 'palette-empty', 'footer'];
                const read = await readBlocks(ids.map((id) => ({ root: document.getElementById(id), source: raw.getElementById(id).outerHTML })));
                return Object.fromEntries(ids.map((id, i) => [id, read[i].hash]));
            });
            await context.close();
            return hashes;
        };
        const tall = await read(1920, 1000);
        expect(await read(1920, 700)).toEqual(tall);
        expect(await read(1100, 900)).toEqual(tall);
    },
);
