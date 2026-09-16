// The review dialog: one block at a time, by keyboard (Kenny, 2026-09-15,
// scope-89 and scope-90), built from research/review-dialog/demo.html into
// catalogue/review-dialog.js over the verdicts of catalogue/judging.js.
//
// Red run first, on 6fd84fe0 in firefox, before the change: every test failed
// at its first step, because no page had a "Review in a dialog" button.

import { expect, test } from '@playwright/test';
import { useEmptyRegister, useRegister } from './helpers/empty-register.mjs';
import { waitForJudging } from './helpers/catalogue.mjs';

test.describe.configure({ timeout: 120_000 });

const JUDGEMENTS = 'kp-catalogue-judgements:v3';
const FEEDBACK = 'kp-catalogue-feedback:v1';

test.beforeEach(async ({ context }) => {
    await useEmptyRegister(context);
});

/** The hash this browser stored for a block in formal. */
const storedHash = (page, key, engine) =>
    page.evaluate(([store, block, eng]) => JSON.parse(localStorage.getItem(store) ?? '{}')[block]?.formal?.[eng]?.hash, [JUDGEMENTS, key, engine]);

/** The note stored for a block in formal, under the review page's keys. */
const storedNote = (page, key) =>
    page.evaluate(([store, block]) => JSON.parse(localStorage.getItem(store) ?? '{}')['catalogue/index.html']?.[block]?.formal, [FEEDBACK, key]);

/** A component page, read, in formal. */
async function openPage(page, href, { width = 1440, height = 900 } = {}) {
    await page.setViewportSize({ width, height });
    await page.goto(href);
    await waitForJudging(page);
}

const dialogOf = (page) => page.locator('#cat-review-dialog');
const titleOf = (page) => dialogOf(page).locator('[data-cat-dialog-title]');
const noteOf = (page) => dialogOf(page).locator('[data-cat-dialog-note]');

test(
    'the review dialog keeps one size over every block, with the cursor in the note on each [scope-90]',
    { tag: ['@component:catalogue'] },
    async ({ page }) => {
        for (const [width, height] of [
            [1440, 900],
            [1280, 720],
        ]) {
            await openPage(page, '/catalogue/table.html', { width, height });
            await page.locator('.cat-bar [data-cat-dialog-open]').click();
            const dialog = dialogOf(page);
            await expect(dialog).toBeVisible();
            const seen = [];
            // Seventeen blocks of the tables page, the data table among them (the tall one).
            for (let i = 0; i < 17; i += 1) {
                if (i) await page.keyboard.press('ArrowRight');
                await expect(noteOf(page)).toBeFocused();
                const reading = await dialog.evaluate((el) => {
                    const box = el.getBoundingClientRect();
                    const stage = /** @type {HTMLElement} */ (el.querySelector('[data-cat-dialog-stage]'));
                    return {
                        title: el.querySelector('[data-cat-dialog-title]')?.textContent,
                        width: box.width,
                        height: box.height,
                        stage: `${stage.clientWidth}x${stage.clientHeight}`,
                        scroll: `${stage.scrollWidth}x${stage.scrollHeight}`,
                    };
                });
                seen.push(reading);
            }
            expect(new Set(seen.map((s) => s.title)).size, 'different blocks').toBeGreaterThanOrEqual(5);
            for (const s of seen) {
                expect(s.width, s.title).toBeCloseTo(width * 0.92, 0);
                expect(s.height, s.title).toBeCloseTo(height * 0.9, 0);
                expect(s.stage, s.title).toBe(seen[0].stage);
            }
            expect(
                seen.some((s) => Number(s.scroll.split('x')[1]) > Number(s.stage.split('x')[1])),
                'a block taller than the stage scrolls inside it',
            ).toBe(true);
            await page.keyboard.press('Escape');
        }
    },
);

test(
    'Down is refused with an empty note, records with text and brings the next block [scope-90]',
    { tag: ['@component:catalogue'] },
    async ({ page, browserName }) => {
        await openPage(page, '/catalogue/switch.html');
        await page.locator('#states [data-cat-dialog-block]').click();
        const dialog = dialogOf(page);
        await expect(titleOf(page)).toHaveText('Switch › States');
        await expect(noteOf(page)).toBeFocused();
        const refused = dialog.locator('[data-cat-dialog-refused]');
        for (const text of ['', '   ']) {
            await noteOf(page).fill(text);
            await page.keyboard.press('ArrowDown');
            await expect(refused).toBeVisible();
            await expect(refused).toHaveText(/only not approved with a note/);
            await expect(noteOf(page)).toHaveAttribute('aria-invalid', 'true');
            await expect(titleOf(page)).toHaveText('Switch › States');
            expect(await storedHash(page, 'switch--states', browserName)).toBeUndefined();
        }
        await noteOf(page).fill('The knob is off centre');
        await expect(refused).toBeHidden();
        await page.keyboard.press('ArrowDown');
        await expect(titleOf(page)).not.toHaveText('Switch › States');
        await expect(noteOf(page)).toBeFocused();
        await expect(noteOf(page)).toHaveValue('');
        expect(await storedHash(page, 'switch--states', browserName)).toMatch(/^[0-9a-f]{64}$/);
        expect(await storedNote(page, 'switch--states')).toBe('The knob is off centre');
        await expect(page.locator('#states')).toHaveAttribute('data-cat-state', 'rejected');
    },
);

test(
    'Left and Right move between blocks while the note is empty and move the caret once it has text [scope-90]',
    { tag: ['@component:catalogue'] },
    async ({ page }) => {
        await openPage(page, '/catalogue/switch.html');
        await page.locator('#invalid [data-cat-dialog-block]').click();
        await expect(titleOf(page)).toHaveText('Switch › Invalid');
        await page.keyboard.press('ArrowRight');
        const next = await titleOf(page).textContent();
        expect(next).not.toBe('Switch › Invalid');
        await page.keyboard.press('ArrowLeft');
        await expect(titleOf(page)).toHaveText('Switch › Invalid');
        await expect(noteOf(page)).toBeFocused();

        await page.keyboard.type('abcd');
        const caret = () => noteOf(page).evaluate((el) => /** @type {HTMLTextAreaElement} */ (el).selectionStart);
        expect(await caret()).toBe(4);
        await page.keyboard.press('ArrowLeft');
        await page.keyboard.press('ArrowLeft');
        expect(await caret()).toBe(2);
        await expect(titleOf(page)).toHaveText('Switch › Invalid');
        await page.keyboard.press('ArrowRight');
        expect(await caret()).toBe(3);
        await expect(titleOf(page)).toHaveText('Switch › Invalid');
        // Backspace edits the text.
        await page.keyboard.press('Backspace');
        await expect(noteOf(page)).toHaveValue('abd');
        // The draft stays with its block: Next → leaves it, and back on the
        // block the cursor lands at the end of the draft.
        await dialogOf(page).locator('[data-cat-dialog-go="1"]').click();
        await expect(titleOf(page)).toHaveText(next ?? '');
        await expect(noteOf(page)).toBeFocused();
        await expect(noteOf(page)).toHaveValue('');
        await page.keyboard.press('ArrowLeft');
        await expect(titleOf(page)).toHaveText('Switch › Invalid');
        await expect(noteOf(page)).toHaveValue('abd');
        expect(await caret()).toBe(3);
    },
);

test(
    'after the last block without a verdict the dialog stays open and says so; approving clears the note [scope-90]',
    { tag: ['@component:catalogue'] },
    async ({ page, browserName }) => {
        await openPage(page, '/catalogue/switch.html');
        await page.locator('.cat-bar [data-cat-dialog-open]').click();
        await expect(titleOf(page)).toHaveText('Switch › States');
        // A note, then approval: the note goes, in storage and in the panel (fix-29).
        await page.keyboard.type('Looks fine now');
        expect(await storedNote(page, 'switch--states')).toBe('Looks fine now');
        await page.keyboard.press('ArrowUp');
        await expect(titleOf(page)).toHaveText('Switch › Invalid');
        expect(await storedNote(page, 'switch--states')).toBeUndefined();
        await expect(page.locator('#states .cat-judge textarea')).toHaveValue('');
        expect(await storedHash(page, 'switch--states', browserName)).toMatch(/^[0-9a-f]{64}$/);

        await page.keyboard.press('ArrowUp');
        await expect(titleOf(page)).toHaveText('Switch › A long label');
        await page.keyboard.press('ArrowUp');
        await expect(titleOf(page)).not.toHaveText('Switch › A long label');
        await page.keyboard.type('Focus ring too thin');
        await page.keyboard.press('ArrowUp');
        // Every block has its verdict in formal, so the dialog walks on to the
        // next theme by itself [scope-113]; it no longer stops here.
        const dialog = dialogOf(page);
        await expect(dialog).toBeVisible();
        await expect(dialog.locator('[data-cat-dialog-theme]')).not.toContainText('Formal', { timeout: 30_000 });
        await expect(noteOf(page)).toHaveValue('');
        for (const id of ['states', 'invalid', 'extremes', 'keyboard']) {
            expect(await storedHash(page, `switch--${id}`, browserName), id).toMatch(/^[0-9a-f]{64}$/);
        }
        await page.keyboard.press('Escape');
        await expect(dialog).toBeHidden();
        // The dialog left on a block of the next theme, which is still on the
        // page, so the way back is that block's own button [scope-113].
        await expect(page.locator('.cat-block:not([hidden]) [data-cat-dialog-block]:focus')).toHaveCount(1);
    },
);

// One dialog for the whole round [scope-113]. Kenny, 2026-09-16: "als ik op
// every component, one page helemaal rond ben voor een thema, dan moet het
// gaan naar een nieuw thema en daarvan alle componenten geven in die dialoog
// zodat ik vanuit 1 dialoog kan vertrekken … Op het einde mag er dan een
// boodschap komen dat zegt dat ik rond ben."
test(
    'a theme finished in the dialog walks on to the next theme, and the last one says the round is over [scope-113]',
    { tag: ['@component:catalogue'] },
    async ({ page }) => {
        await openPage(page, '/catalogue/switch.html');
        const dialog = dialogOf(page);
        const themeBadge = dialog.locator('[data-cat-dialog-theme]');
        const live = dialog.locator('[data-cat-dialog-live]');
        await page.locator('.cat-bar [data-cat-dialog-open]').click();
        await expect(themeBadge).toContainText('Formal');

        // Four blocks on the switch page: the fourth approval empties formal.
        for (let i = 0; i < 4; i += 1) await page.keyboard.press('ArrowUp');
        await expect(live).toContainText('Every block is judged in Formal', { timeout: 30_000 });
        await expect(themeBadge).not.toContainText('Formal', { timeout: 30_000 });
        // The page itself is in the new theme, and the dialog is on one of its blocks.
        const moved = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
        expect(moved).not.toBe('formal');
        await expect(dialog.locator('[data-cat-dialog-state]')).toContainText('Not yet judged');
        await expect(noteOf(page)).toBeFocused();

        // Judging every block of every theme ends the round, in the same dialog.
        for (let press = 0; press < 260; press += 1) {
            if ((await live.textContent())?.includes('the round is over')) break;
            await page.keyboard.press('ArrowUp');
            await expect(noteOf(page)).toBeFocused({ timeout: 30_000 });
        }
        await expect(live).toContainText('Every block is judged in every theme: the round is over.', { timeout: 30_000 });
        await expect(dialog).toBeVisible();
    },
);

test(
    "Escape closes the review dialog and returns to the block; Tab stays inside; the block's own modal takes the first Escape [scope-90]",
    { tag: ['@component:catalogue'] },
    async ({ page }) => {
        await openPage(page, '/catalogue/overlays.html');
        const block = page.locator('#dialog');
        await block.locator('[data-cat-dialog-block]').click();
        const dialog = dialogOf(page);
        await expect(noteOf(page)).toBeFocused();
        await expect(page.locator('#dialog > .cat-review-dialog__away, .cat-review-dialog__away')).toHaveCount(1);
        for (let i = 0; i < 40; i += 1) {
            await page.keyboard.press('Tab');
            expect(await page.evaluate(() => Boolean(document.activeElement?.closest('#cat-review-dialog'))), `Tab ${i + 1}`).toBe(true);
        }
        // The block's live modal dialog takes the first Escape, the review dialog the second.
        await block.locator('[data-kp-dialog="ov-d1-live"]').click();
        const inner = page.locator('#ov-d1-live');
        await expect(inner).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(inner).toBeHidden();
        await expect(dialog).toBeVisible();
        await noteOf(page).focus();
        await page.keyboard.press('Escape');
        await expect(dialog).toBeHidden();
        await expect(page.locator('.cat-review-dialog__away')).toHaveCount(0);
        await expect(block.locator('[data-cat-dialog-block]')).toBeFocused();
        await expect(block).toBeInViewport();
        // The block is back in its place on the page.
        expect(await block.evaluate((el) => el.parentElement?.closest('dialog') === null && el.closest('main') !== null)).toBe(true);
    },
);

test(
    'a verdict given in the review dialog stores the same hash as the panel under the block [scope-90]',
    { tag: ['@component:catalogue'] },
    async ({ page, browserName }) => {
        await openPage(page, '/catalogue/navigation.html');
        const ids = ['bar', 'tabs', 'app-shell'];
        const fromDialog = {};
        for (const id of ids) {
            await page.locator(`#${id} [data-cat-dialog-block]`).click();
            await page.keyboard.press('ArrowUp');
            fromDialog[id] = await storedHash(page, `navigation--${id}`, browserName);
            await page.keyboard.press('Escape');
            await expect(dialogOf(page)).toBeHidden();
        }
        await page.evaluate((key) => localStorage.removeItem(key), JUDGEMENTS);
        await openPage(page, '/catalogue/navigation.html');
        for (const id of ids) {
            await page.locator(`#${id} [data-cat-verdict="approved"]`).click();
            await expect(page.locator(`#${id}`)).toHaveAttribute('data-cat-state', 'approved');
            const fromPanel = await storedHash(page, `navigation--${id}`, browserName);
            expect(fromPanel, id).toMatch(/^[0-9a-f]{64}$/);
            expect(fromDialog[id], id).toBe(fromPanel);
        }
    },
);

test(
    'the review dialog keeps its size in other themes, and works on the review page [scope-90]',
    { tag: ['@component:catalogue'] },
    async ({ page, browserName }) => {
        test.setTimeout(240_000);
        await openPage(page, '/catalogue/navigation.html');
        for (const [theme, label] of [
            ['nostromo', 'Nostromo'],
            ['cyberpunk', 'Cyberpunk'],
            ['sepia', 'Sepia'],
        ]) {
            await page.evaluate((name) => import('/js/theme-core.js').then((m) => m.applyTheme(name)), theme);
            await waitForJudging(page);
            await page.locator('.cat-bar [data-cat-dialog-open]').click();
            for (let i = 0; i < 5; i += 1) {
                if (i) await page.keyboard.press('ArrowRight');
                await expect(noteOf(page)).toBeFocused();
                // The laid-out size, not the painted box: a theme's opening
                // animation scales the dialog for its first frames (nostromo
                // measured 1319.9 px wide mid-animation, 1324.8 after).
                const box = await dialogOf(page).evaluate((el) => ({
                    width: parseFloat(getComputedStyle(el).width),
                    height: parseFloat(getComputedStyle(el).height),
                }));
                expect(box.width, `${theme} item ${i + 1}`).toBeCloseTo(1440 * 0.92, 0);
                expect(box.height, `${theme} item ${i + 1}`).toBeCloseTo(900 * 0.9, 0);
            }
            await expect(dialogOf(page).locator('[data-cat-dialog-theme]')).toContainText(label);
            await page.keyboard.press('Escape');
            await expect(dialogOf(page)).toBeHidden();
        }

        // The review page: the bar's button opens the first block, a verdict brings
        // the next, and Escape lands on a block still on the page.
        await page.evaluate((name) => import('/js/theme-core.js').then((m) => m.applyTheme(name)), 'formal');
        await page.goto('/catalogue/index.html');
        await waitForJudging(page, { timeout: 180_000 });
        await page.locator('.cat-bar [data-cat-dialog-open]').click();
        const first = await titleOf(page).textContent();
        const key = await page.evaluate(() => document.querySelector('[data-cat-dialog-stage] > .cat-block')?.id);
        expect(key).toBeTruthy();
        await page.keyboard.press('ArrowUp');
        await expect(titleOf(page)).not.toHaveText(first ?? '');
        expect(await storedHash(page, key, browserName)).toMatch(/^[0-9a-f]{64}$/);
        await page.keyboard.press('Escape');
        await expect(dialogOf(page)).toBeHidden();
        await expect(page.locator(`[id="${key}"]`)).toBeHidden();
        const focused = page.locator(':focus');
        await expect(focused).toHaveAttribute('data-cat-dialog-block', '');
        await expect(focused).toBeInViewport();
    },
);

/* ------------------------------------------------------------ fixed actions, note in the look frame */

// Kenny, 2026-09-15, reviewing in FireDragon [scope-92]: the verdict buttons
// moved from block to block, so a second click landed elsewhere; and a long
// review note took the room of the "Look at" text. The buttons now keep one
// place in the dialog whatever the side holds, and the note sits at the top
// of the look's own scrolling frame.
//
// Red run first, on 9a833da0 in firefox, before the change: every test failed.
// The buttons sat at y 676.4 (1440x900) and 505.4 (1280x720) on most blocks;
// the long review note pushed them to 1579.6 and 1570.6, below the dialog, a
// refusal on that block to 1648.6 and 1639.6, and a verdict's message lifted
// them by 19.2 px. The note sat outside the look's frame.

const SHORT_NOTE = { rejected: 'The last row is cut off.', change: 'The scroll region now reaches the last row.', given: '2026-09-15' };

/** Review notes for two blocks of the tables page: a short one (in four themes) and one long enough to fill the side. */
const NOTES = {
    'table--long': { formal: SHORT_NOTE, dark: SHORT_NOTE, nostromo: SHORT_NOTE, 'shade-light': SHORT_NOTE },
    'table--datatable-sticky': {
        formal: {
            rejected: 'Slivers of row text show above the header row while scrolling. '.repeat(12),
            change: 'The header ground reaches two pixels higher, so no row shows through. '.repeat(14),
            commit: '1b9c72bd',
            given: '2026-09-15',
        },
    },
};

const BUTTONS = [
    '[data-cat-dialog-go="-1"]',
    '[data-cat-dialog-go="1"]',
    '[data-cat-dialog-verdict="approved"]',
    '[data-cat-dialog-verdict="rejected"]',
];

/** The four action buttons' rects, the block's title, and what the side holds. */
const readActions = (page) =>
    dialogOf(page).evaluate((el, selectors) => {
        const rect = (s) => {
            const r = /** @type {HTMLElement} */ (el.querySelector(s)).getBoundingClientRect();
            return [r.x, r.y, r.width, r.height].map((n) => Math.round(n * 10) / 10).join(',');
        };
        const refused = /** @type {HTMLElement} */ (el.querySelector('[data-cat-dialog-refused]'));
        return {
            title: el.querySelector('[data-cat-dialog-title]')?.textContent ?? '',
            rects: selectors.map(rect).join(' | '),
            note: Boolean(el.querySelector('[data-cat-dialog-review-note]:not([hidden])')),
            refused: !refused.hidden,
        };
    }, BUTTONS);

test(
    'the verdict and move buttons keep the same rects over every block, with a review note, a refusal and a verdict message [scope-92]',
    { tag: ['@component:catalogue'] },
    async ({ page, context }) => {
        await useRegister(context, {}, NOTES);
        for (const [width, height] of [
            [1440, 900],
            [1280, 720],
        ]) {
            await openPage(page, '/catalogue/table.html', { width, height });
            await page.locator('.cat-bar [data-cat-dialog-open]').click();
            await expect(dialogOf(page)).toBeVisible();
            // The opening animation of a theme scales the dialog for its first frames.
            await page.waitForTimeout(400);
            const seen = [];
            for (let i = 0; i < 17; i += 1) {
                if (i) await page.keyboard.press('ArrowRight');
                await expect(noteOf(page)).toBeFocused();
                seen.push(await readActions(page));
                if (i === 2 || i === 6) {
                    // The refusal of an empty rejection, shown under the note.
                    await page.keyboard.press('ArrowDown');
                    await expect(dialogOf(page).locator('[data-cat-dialog-refused]')).toBeVisible();
                    seen.push(await readActions(page));
                }
            }
            // A verdict by mouse: the message it leaves, and the next block.
            await dialogOf(page).locator('[data-cat-dialog-verdict="approved"]').click();
            await expect(dialogOf(page).locator('[data-cat-dialog-live]')).toHaveText(/^Approved: /);
            seen.push(await readActions(page));
            expect(new Set(seen.map((s) => s.title)).size, 'different blocks').toBeGreaterThanOrEqual(10);
            expect(
                seen.some((s) => s.note),
                'a block with a review note',
            ).toBe(true);
            expect(
                seen.some((s) => s.refused),
                'a refusal shown',
            ).toBe(true);
            for (const s of seen) expect(s.rects, `${s.title} (note ${s.note}, refused ${s.refused})`).toBe(seen[0].rects);
            await page.keyboard.press('Escape');
        }
    },
);

/** The review note and the look text in the dialog, and the frame that scrolls them. */
const readFrame = (page) =>
    dialogOf(page).evaluate((el) => {
        const note = /** @type {HTMLElement} */ (el.querySelector('[data-cat-dialog-review-note]'));
        const look = /** @type {HTMLElement} */ (el.querySelector('[data-cat-dialog-look]'));
        /** @param {Element | null} node */
        const scroller = (node) => {
            for (let at = node?.parentElement; at && at !== el; at = at.parentElement) {
                if (/(auto|scroll)/.test(getComputedStyle(at).overflowY)) return at;
            }
            return null;
        };
        const frame = scroller(note);
        const frameBox = frame?.getBoundingClientRect();
        const noteBox = note.getBoundingClientRect();
        const noteText = /** @type {HTMLElement} */ (note.querySelector('[data-cat-dialog-review-rejected]'));
        /** @param {string} value an rgb() or rgba() colour */
        const luminance = (value) => {
            const [r, g, b] = (value.match(/[\d.]+/g) ?? []).slice(0, 3).map((n) => {
                const c = Number(n) / 255;
                return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        const [light, dark] = [luminance(getComputedStyle(noteText).color), luminance(getComputedStyle(note).backgroundColor)].sort((a, b) => b - a);
        return {
            ground: getComputedStyle(note).backgroundColor,
            contrast: Math.round(((light + 0.05) / (dark + 0.05)) * 100) / 100,
            visible: !note.hidden && noteBox.height > 0,
            sameFrame: Boolean(frame) && frame === scroller(look),
            noteFirst: Boolean(note.compareDocumentPosition(look) & Node.DOCUMENT_POSITION_FOLLOWING),
            lookHead: look.textContent?.trim().slice(0, 8),
            scrollTop: frame?.scrollTop ?? -1,
            noteTopInFrame: Boolean(frameBox) && noteBox.top >= (frameBox?.top ?? 0) - 0.5 && noteBox.top < (frameBox?.bottom ?? 0),
            scrolls: frame ? frame.scrollHeight > frame.clientHeight : false,
            font: [getComputedStyle(noteText).fontFamily, getComputedStyle(noteText).fontSize],
            lookFont: [getComputedStyle(look).fontFamily, getComputedStyle(look).fontSize],
            color: getComputedStyle(noteText).color,
            lookColor: getComputedStyle(look).color,
        };
    });

test(
    'the review note stands before "Look at:" in the same scrolling frame, at its top when a block opens, in the look\'s font in another colour [scope-92]',
    { tag: ['@component:catalogue'] },
    async ({ page, context }) => {
        await useRegister(context, {}, NOTES);
        await openPage(page, '/catalogue/table.html');
        await page.locator('#long [data-cat-dialog-block]').click();
        await expect(titleOf(page)).toHaveText(/Long text in a cell/);
        const short = await readFrame(page);
        expect(short.visible, 'the note shows').toBe(true);
        expect(short.sameFrame, 'note and look scroll in one frame').toBe(true);
        expect(short.noteFirst, 'the note comes first').toBe(true);
        expect(short.lookHead).toBe('Look at:');
        expect(short.scrollTop).toBe(0);
        expect(short.noteTopInFrame, 'the note is in view at open').toBe(true);
        expect(short.font, 'same family and size as the look').toEqual(short.lookFont);
        expect(short.color, 'a colour of its own').not.toBe(short.lookColor);

        // The ink on its ground reads in light and dark themes alike.
        for (const theme of ['formal', 'dark', 'nostromo', 'shade-light']) {
            await page.keyboard.press('Escape');
            await page.evaluate((name) => import('/js/theme-core.js').then((m) => m.applyTheme(name)), theme);
            await waitForJudging(page);
            await page.locator('#long [data-cat-dialog-block]').click();
            const reading = await readFrame(page);
            expect(reading.visible, theme).toBe(true);
            expect(reading.ground, `${theme}: the note has a ground`).toMatch(/^rgb/);
            expect(reading.contrast, `${theme}: ${reading.color} on ${reading.ground}`).toBeGreaterThanOrEqual(4.5);
            expect(reading.color, theme).not.toBe(reading.lookColor);
        }
    },
);

test(
    'a long review note scrolls in the frame with the look, opens at the top on every block and moves no button [scope-92]',
    { tag: ['@component:catalogue'] },
    async ({ page, context }) => {
        await useRegister(context, {}, NOTES);
        for (const [width, height] of [
            [1440, 900],
            [1280, 720],
        ]) {
            await openPage(page, '/catalogue/table.html', { width, height });
            await page.locator('#datatable-sticky [data-cat-dialog-block]').click();
            await expect(titleOf(page)).toHaveText(/a header that stays/);
            const long = await readFrame(page);
            expect(long.scrolls, 'a long note makes the frame scroll').toBe(true);
            expect(long.scrollTop).toBe(0);
            expect(long.noteTopInFrame).toBe(true);
            const before = await readActions(page);
            await dialogOf(page).evaluate((el) => {
                const look = /** @type {HTMLElement} */ (el.querySelector('[data-cat-dialog-look]'));
                let at = look.parentElement;
                while (at && !/(auto|scroll)/.test(getComputedStyle(at).overflowY)) at = at.parentElement;
                at?.scrollBy(0, 200);
            });
            expect((await readFrame(page)).scrollTop, 'the frame scrolls').toBeGreaterThan(0);
            expect((await readActions(page)).rects, 'scrolling the frame moves no button').toBe(before.rects);
            await page.keyboard.press('ArrowLeft');
            await page.keyboard.press('ArrowRight');
            await expect(titleOf(page)).toHaveText(/a header that stays/);
            const again = await readFrame(page);
            expect(again.scrollTop, 'back at the top when the block opens again').toBe(0);
            expect(again.noteTopInFrame).toBe(true);
            await page.keyboard.press('Escape');
        }
    },
);
