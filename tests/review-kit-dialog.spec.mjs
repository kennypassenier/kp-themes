// The research demos' review dialog (research/_review/review.js): it stays
// where it opened over a run of approvals (Kenny, 2026-10-05, fix-102: "elke
// keer ik iets approve en de dialog opende in het volgende thema, zakte de
// dialog iets").
//
// Red run first, in firefox, with `await booted;` taken out of show() in
// review.js: the dialog opened non-modal (the catalogue shell had moved it
// into its column), focus fell to the body and the first Up approved nothing.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

test.describe.configure({ timeout: 120_000 });

/** Every theme there is, from the order file, so the walks below follow the registry [fix-102]. */
const THEME_NAMES = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));

const DIALOG = '.rv-dialog';

/** Ticks the first option of every choice still unanswered, so Up can approve. */
const answerChoices = (page) =>
    page.evaluate(() => {
        for (const set of document.querySelectorAll('.rv-dialog .rv-choice'))
            if (!set.querySelector('input:checked')) set.querySelector('input').click();
    });

const readDialog = (page) =>
    page.evaluate(async (selector) => {
        const dialog = document.querySelector(selector);
        // At rest: a register's own entrance (formal's sheet, synthwave's
        // rise) replays on a theme switch and moves the box while it plays.
        const finite = dialog.getAnimations({ subtree: true }).filter((a) => a.effect?.getComputedTiming().endTime !== Infinity);
        await Promise.all(finite.map((a) => a.finished.catch(() => {})));
        return {
            modal: dialog.matches(':modal'),
            top: dialog.getBoundingClientRect().top,
            position: dialog.querySelector('[data-rv-position]').textContent,
            theme: document.documentElement.dataset.theme,
            lane: dialog.querySelector('[data-rv-theme]').textContent.trim(),
        };
    }, DIALOG);

for (const demo of ['character-meter', 'character-graph']) {
    test(
        `the review dialog opened from the hub stays modal and in place over ten approvals in ${demo} [fix-102]`,
        { tag: ['@component:catalogue'] },
        async ({ page }) => {
            const errors = [];
            page.on('pageerror', (error) => errors.push(String(error)));
            page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(`/research/${demo}/demo.html?next=/catalogue/changed.html&review=open`);
            await expect(page.locator(`${DIALOG}[open]`)).toBeVisible();
            await expect(page.locator(`${DIALOG} [data-rv-approve]`)).toBeFocused();
            const first = await readDialog(page);
            expect(first.modal, 'the dialog opened from the hub is modal').toBe(true);
            const seen = [first];
            for (let step = 2; step <= 11; step += 1) {
                await answerChoices(page);
                await page.keyboard.press('ArrowUp');
                await expect(page.locator(`${DIALOG} [data-rv-position]`)).toHaveText(new RegExp(`^Step ${step}/`));
                seen.push(await readDialog(page));
            }
            // A round asked in several themes walks topic by topic, every theme in its own lane (Kenny, 2026-10-16:
            // "per group, maar dan 1 item per thema per approval"): a topic step carries no theme of its own, so the
            // document stays in formal and the lane's theme is read from the dialog's theme line.
            expect(new Set(seen.map((s) => s.lane)).size, 'ten approvals walked eleven themes').toBe(11);
            for (const shot of seen) {
                expect(shot.modal, `modal in ${shot.lane}`).toBe(true);
                expect(Math.abs(shot.top - first.top), `top in ${shot.lane} (${shot.top} vs ${first.top})`).toBeLessThanOrEqual(1);
            }
            expect(errors).toEqual([]);
        },
    );
}

// The review dialog's aspect pages, the keys on them and the header demo's
// menu, measured the way Kenny judges: one dialog, the keyboard, the demo's
// own controls at the component (fix-106 to fix-114, queued as fix-106-M1 to
// fix-114-M1, written for the 10.1.0 release suite). Every behaviour below was
// fixed on 2026-10-06; each test was proven to bite by undoing the fix's lines
// in research/_review/review.js, research/_review/review.css or the demo and
// running it in firefox before it was kept.
//
// Aspect pages exist only where a choice is still asked: since the decided
// rounds every character demo but the page header's has all its picks fixed,
// so the header is the demo these tests walk. fix-115-M1 and fix-116-M1 (busy)
// have no page left to walk and are closed in docs/MINI_ROUNDS.md.

const HEADER = '/research/character-header/demo.html?next=/catalogue/changed.html&review=open';
const STAGE = `${DIALOG} [data-rv-stage]`;
// The demo's own controls stand directly above their component, inside the stage (Kenny, 2026-10-18 07:09:
// "Die controls moeten niet gewoon meer boven staan, maar enkel de geschikte control per component zoals die
// tevoorschijn komt"); the dialog no longer copies them into a bar of its own.
const CONTROLS = `${STAGE} [data-review-controls]`;

/** Opens the page header demo's review dialog at its first aspect page (formal, Shape). */
const openHeader = async (page) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(HEADER);
    await expect(page.locator(`${DIALOG}[open]`)).toBeVisible();
    await expect(page.locator(`${DIALOG} [data-rv-approve]`)).toBeFocused();
    // Three aspect pages (Shape, the overflow menu, Hover/focus/press) per theme, so the total follows the registry.
    await expect(page.locator(`${DIALOG} [data-rv-position]`)).toHaveText(new RegExp(`^Step 1/${3 * THEME_NAMES.length} .*option 1/3$`));
};

/** "Step n/total … option k/m" as numbers. */
const where = async (page) => {
    const text = await page.locator(`${DIALOG} [data-rv-position]`).textContent();
    const [, step, steps, option, options] = text.match(/^Step (\d+)\/(\d+).*option (\d+)\/(\d+)/) ?? [];
    return { step: Number(step), steps: Number(steps), option: Number(option), options: Number(options), text };
};

/** Waits until the dialog has moved on from a page and drawn the next one. */
const settle = async (page, from) => {
    await expect.poll(async () => (await where(page)).text).not.toBe(from);
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
};

/** One of the demo's own buttons, at the component. */
const control = (page, name) => page.locator(`${CONTROLS} button`, { hasText: name });

// fix-106-M1: the controls that help judge are in the dialog on every page. Since 2026-10-18 they are the
// demo's own, at the component, and there is no mirror bar on top.
test(
    "the demo's own controls stand at the component on every aspect page, with no mirror bar [fix-106]",
    { tag: ['@component:catalogue'] },
    async ({ page }) => {
        await openHeader(page);
        const seen = [];
        for (let at = 0; at < 6; at += 1) {
            const read = await page.evaluate(
                ({ controls, dialog }) => {
                    const box = document.querySelector(dialog).getBoundingClientRect();
                    const own = [...document.querySelectorAll(`${controls} button`)];
                    const showing = (b) => {
                        const r = b.getBoundingClientRect();
                        return b.checkVisibility() && r.width > 0 && r.height > 0 && r.top >= box.top && r.bottom <= box.bottom;
                    };
                    return {
                        position: document.querySelector('[data-rv-position]').textContent,
                        title: document.querySelector('[data-rv-title]').textContent,
                        own: own.map((b) => b.textContent.trim()),
                        hidden: own.filter((b) => !showing(b)).map((b) => b.textContent.trim()),
                        bars: document.querySelectorAll(`${dialog} .rv-controls`).length,
                    };
                },
                { controls: CONTROLS, dialog: DIALOG },
            );
            expect(read.own.length, `the demo has controls on ${read.title}`).toBeGreaterThan(5);
            expect(read.hidden, `controls not visible inside the dialog on ${read.title}`).toEqual([]);
            expect(read.bars, `no copied controls bar on ${read.title}`).toBe(0);
            seen.push(read.position.split(' · ')[0]);
            const before = (await where(page)).text;
            await page.keyboard.press('PageDown');
            await settle(page, before);
        }
        expect(new Set(seen).size, 'six different aspect pages (formal and the next theme, three each)').toBe(6);
    },
);

// fix-107-M1: Space pauses on an aspect page and never picks.
test(
    'Space pauses on an aspect page and never picks or moves on, with the approve button focused [fix-107]',
    { tag: ['@component:catalogue'] },
    async ({ page }) => {
        await openHeader(page);
        const pause = page.locator(`${DIALOG} [data-rv-flip-pause]`);
        const approve = page.locator(`${DIALOG} [data-rv-approve]`);
        const start = (await where(page)).text;
        let paused = false;
        const spaceHere = async (label) => {
            await page.keyboard.press('Space');
            paused = !paused;
            await expect(pause, `${label}: Space toggled the pause`).toHaveAttribute('aria-pressed', String(paused));
            expect((await where(page)).text, `${label}: the page stayed`).toBe(start);
        };
        // The approve button holds the focus after every page change.
        await spaceHere('approve focused on arrival');
        // After a click on the demo's own control the focus sits on that button, and also back on approve.
        await control(page, 'Open').click();
        await spaceHere('after a click on the control, focus on it');
        await approve.focus();
        await spaceHere('after a click on the control, approve focused');
        // After Replay.
        await page.locator(`${DIALOG} [data-rv-flip-replay]`).click();
        await spaceHere('after Replay, focus on Replay');
        await approve.focus();
        await spaceHere('after Replay, approve focused');
    },
);

// fix-108-M1: a pick carries into the next rows, and the arrows work under any focus.
test(
    'a picked shape is drawn in the next rows, and the arrows flip under any focus [fix-108]',
    { tag: ['@component:catalogue'] },
    async ({ page }) => {
        await openHeader(page);
        // Shape 3: two flips, then Up picks and moves on to the next aspect.
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');
        expect((await where(page)).option).toBe(3);
        const before = (await where(page)).text;
        await page.keyboard.press('ArrowUp');
        await settle(page, before);
        expect((await where(page)).step, 'Up moved on to the next page').toBe(2);
        const shapes = await page.evaluate(() =>
            [...document.querySelectorAll('.rv-dialog [data-ph-vary="menu"] [data-ph-shape]')].map((el) => el.getAttribute('data-ph-shape')),
        );
        expect(shapes.length, 'the next row has its three cells').toBeGreaterThanOrEqual(3);
        expect(new Set(shapes), 'every cell of the next row draws shape 3').toEqual(new Set(['3']));

        // The arrows with a button inside the shown option focused, after a click in the demo, with a control focused, and with the focus on <body>.
        const card = page.locator(`${STAGE} .kp-page-header__actions button:visible`).first();
        for (const [label, focus] of [
            ['a button inside the shown option focused', () => card.focus()],
            ['the shown option clicked', () => card.click()],
            ['a control of the demo focused', () => control(page, 'Narrow').focus()],
            ['the focus on the page body', () => page.evaluate(() => document.activeElement?.blur())],
        ]) {
            for (const key of ['ArrowRight', 'ArrowLeft']) {
                await focus();
                const was = (await where(page)).option;
                await page.keyboard.press(key);
                const want = key === 'ArrowRight' ? (was % 3) + 1 : ((was + 1) % 3) + 1;
                expect((await where(page)).option, `${key} flips with ${label}`).toBe(want);
            }
        }
    },
);

/** The option card the flip shows, measured inside the page: [top, bottom, left, right] and what is clipped in it. */
const readShown = (page) =>
    page.evaluate(() => {
        const card = [...document.querySelectorAll('.rv-dialog__stage .ph-col')].find((c) => !c.hidden && c.getBoundingClientRect().width > 0);
        if (!card) return null;
        const box = card.getBoundingClientRect();
        const clipped = [card, ...card.querySelectorAll('*')]
            .filter((el) => {
                const style = getComputedStyle(el);
                return ['hidden', 'clip'].includes(style.overflowY) && el.scrollHeight > el.clientHeight + 1;
            })
            .map((el) => `${el.tagName.toLowerCase()}.${el.className} ${el.scrollHeight}>${el.clientHeight}`);
        return { top: box.top, bottom: box.bottom, left: box.left, right: box.right, clipped };
    });

// fix-109-M1: nothing inside the shown card is cut off.
test('the flip draws the whole shown card, with nothing clipped inside it [fix-109]', { tag: ['@component:catalogue'] }, async ({ page }) => {
    await openHeader(page);
    for (let at = 0; at < 6; at += 1) {
        const title = await page.locator(`${DIALOG} [data-rv-title]`).textContent();
        for (let option = 1; option <= 3; option += 1) {
            const shown = await readShown(page);
            expect(shown, `a card is shown on ${title}`).not.toBeNull();
            expect(shown.clipped, `clipped content in option ${option} of ${title}`).toEqual([]);
            await page.keyboard.press('ArrowRight');
        }
        const before = (await where(page)).text;
        await page.keyboard.press('PageDown');
        await settle(page, before);
    }
});

// fix-110-M1: a popup of the demo has room inside the shown card.
test('the header More menu hangs inside the shown card, in every option [fix-110]', { tag: ['@component:catalogue'] }, async ({ page }) => {
    await openHeader(page);
    await control(page, 'Open').click();
    for (let option = 1; option <= 3; option += 1) {
        await expect
            .poll(() =>
                page.evaluate(() =>
                    [...document.querySelectorAll('.rv-dialog__stage [data-ph-panel]')].some(
                        (p) => !p.hidden && p.getBoundingClientRect().height > 0,
                    ),
                ),
            )
            .toBe(true);
        const measured = await page.evaluate(() => {
            const card = [...document.querySelectorAll('.rv-dialog__stage .ph-col')].find((c) => !c.hidden && c.getBoundingClientRect().width > 0);
            const panel = [...card.querySelectorAll('[data-ph-panel]')].find((p) => !p.hidden);
            const menu = panel.getBoundingClientRect();
            const room = card.getBoundingClientRect();
            return { menuBottom: menu.bottom, menuTop: menu.top, cardBottom: room.bottom, cardTop: room.top };
        });
        expect(measured.menuBottom, `the menu's foot inside the card in option ${option}`).toBeLessThanOrEqual(measured.cardBottom);
        expect(measured.menuTop, `the menu starts inside the card in option ${option}`).toBeGreaterThanOrEqual(measured.cardTop);
        await page.keyboard.press('ArrowRight');
    }
});

// fix-111-M1: the menu is placed under its own More button.
test(
    'the header menu hangs 8px under More and shares an edge with it, in both widths and every option [fix-111]',
    { tag: ['@component:catalogue'] },
    async ({ page }) => {
        await openHeader(page);
        await control(page, 'Open').click();
        for (const width of ['Desktop', 'Narrow']) {
            await control(page, width).click();
            for (let option = 1; option <= 3; option += 1) {
                // The panel follows a reflow of the actions row, so wait for it to settle.
                await expect
                    .poll(
                        async () => {
                            const read = await page.evaluate(() => {
                                const card = [...document.querySelectorAll('.rv-dialog__stage .ph-col')].find(
                                    (c) => !c.hidden && c.getBoundingClientRect().width > 0,
                                );
                                const more = card?.querySelector('[data-ph-more]')?.getBoundingClientRect();
                                const panel = [...(card?.querySelectorAll('[data-ph-panel]') ?? [])].find((p) => !p.hidden)?.getBoundingClientRect();
                                if (!more || !panel || !panel.height) return null;
                                return {
                                    gap: Math.round(panel.top - more.bottom),
                                    edge: Math.min(Math.abs(panel.left - more.left), Math.abs(panel.right - more.right)),
                                };
                            });
                            return read && read.gap === 8 && read.edge <= 1;
                        },
                        { message: `the menu 8px under More with one edge aligned: ${width}, option ${option}` },
                    )
                    .toBe(true);
                await page.keyboard.press('ArrowRight');
            }
        }
    },
);

// fix-112-M1: a state the reviewer set stays on every page. Motion is on: the
// kit plays an aspect's own autoplay (Closed on Shape and on Hover, focus,
// press) only then, and that autoplay is what used to close the menu.
test.describe('a state the reviewer set', () => {
    test.use({ reducedMotion: 'no-preference' });

    test(
        'a menu opened on the first page is still open on eight pages, each flipped [fix-112]',
        { tag: ['@component:catalogue'] },
        async ({ page }) => {
            await openHeader(page);
            await control(page, 'Open').click();
            const menuIsOpen = () =>
                page.evaluate(() => {
                    const card = [...document.querySelectorAll('.rv-dialog__stage .ph-col')].find(
                        (c) => !c.hidden && c.getBoundingClientRect().width > 0,
                    );
                    const panel = [...(card?.querySelectorAll('[data-ph-panel]') ?? [])].find((p) => !p.hidden);
                    const open = [...document.querySelectorAll('.rv-dialog__stage [data-review-controls] button')].find((b) => b.textContent.trim() === 'Open');
                    return Boolean(panel && panel.getBoundingClientRect().height > 0) && open?.getAttribute('aria-pressed') === 'true';
                });
            const titles = [];
            for (let at = 0; at < 8; at += 1) {
                // Aspect titles repeat from theme to theme, so a page is told apart by its step number.
                titles.push(`${(await where(page)).step} ${await page.locator(`${DIALOG} [data-rv-title]`).textContent()}`);
                await page.keyboard.press('ArrowRight');
                // Long enough for an autoplay or a redraw after the theme change to have closed it.
                await page.waitForTimeout(400);
                expect(await menuIsOpen(), `the menu is open on page ${at + 1}, ${titles.at(-1)}, after a flip`).toBe(true);
                const before = (await where(page)).text;
                await page.keyboard.press('PageDown');
                await settle(page, before);
            }
            expect(new Set(titles).size, 'eight different pages').toBe(8);
        },
    );
});

// fix-114-M1: the menu demo's Close plays its Open backwards, in every theme.
// Motion is on: the menus' arrivals and leaves sit in a no-preference block.
// Measured on main on 2026-10-14: 15 themes close as their open backwards;
// blueprint hides the menu after two frames with no animation running (its
// leave is set, the menu's inset and width are reset, nothing plays). That is
// a finding for Kenny, not a loosened test: this test fails on blueprint until
// it is fixed or decided.
test.describe('the menu demo close', () => {
    test.use({ reducedMotion: 'no-preference' });

    test(
        'Close plays the open backwards before the menu hides, in every theme of the menu demo [fix-114]',
        { tag: ['@component:catalogue'] },
        async ({ page }) => {
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto('/research/character-menu/demo.html?next=/catalogue/changed.html&review=open');
            await expect(page.locator(`${DIALOG}[open]`)).toBeVisible();
            const themes = [];
            /** Themes whose Close hid the menu without an animation of it running in reverse. */
            const silent = [];
            const stepsTotal = Number((await page.locator(`${DIALOG} [data-rv-position]`).textContent()).match(/\/(\d+)/)[1]);
            for (let at = 0; at < stepsTotal; at += 1) {
                const theme = await page.evaluate(() => document.documentElement.dataset.theme);
                themes.push(theme);
                await control(page, 'Open').first().click();
                await expect
                    .poll(() => page.locator(`${STAGE} .kp-menu:not([hidden])`).count(), { message: `${theme}: Open shows the menus` })
                    .toBeGreaterThan(0);
                // Let the arrival play out, so only the leave is being measured.
                await page.evaluate(async () => {
                    const menus = [...document.querySelectorAll('.rv-dialog__stage .kp-menu:not([hidden])')];
                    const finite = menus
                        .flatMap((menu) => menu.getAnimations({ subtree: true }))
                        .filter((a) => a.effect?.getComputedTiming().endTime !== Infinity);
                    await Promise.all(finite.map((a) => a.finished.catch(() => {})));
                    // One frame per paint from here: a menu still showing, whether it is in its leave, and whether an animation of it runs in reverse.
                    window.__leave = { frames: [], watching: true };
                    const tick = () => {
                        const shown = [...document.querySelectorAll('.rv-dialog__stage .kp-menu:not([hidden])')];
                        window.__leave.frames.push(
                            shown.map((menu) => ({
                                leaving: menu.hasAttribute('data-mb-leaving'),
                                reverse: getComputedStyle(menu).animationDirection.includes('reverse'),
                                running: menu.getAnimations().some((a) => a.playState === 'running'),
                            })),
                        );
                        if (window.__leave.watching) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                });
                // The open menus can lie over the control, so the click is dispatched on it.
                await control(page, 'Close').first().dispatchEvent('click');
                await expect
                    .poll(() => page.locator(`${STAGE} .kp-menu:not([hidden])`).count(), {
                        message: `${theme}: the menus hide after Close`,
                        timeout: 8000,
                    })
                    .toBe(0);
                const frames = await page.evaluate(() => {
                    window.__leave.watching = false;
                    return window.__leave.frames;
                });
                const reversed = frames.some((shown) => shown.some((menu) => menu.leaving && menu.reverse && menu.running));
                if (!reversed) silent.push(theme);
                if (at < stepsTotal - 1) {
                    const before = await page.locator(`${DIALOG} [data-rv-position]`).textContent();
                    await page.locator(`${DIALOG} [data-rv-go="1"]`).click();
                    await expect.poll(() => page.locator(`${DIALOG} [data-rv-position]`).textContent()).not.toBe(before);
                }
            }
            expect(new Set(themes).size, 'every theme of the demo was walked').toBe(stepsTotal);
            expect(silent, 'themes whose Close shows no running reverse animation before the menu hides').toEqual([]);
        },
    );
});

// fix-113-M1: the flip counts only the options the theme has. A round asked in several themes walks topic by
// topic (Kenny, 2026-10-16), so a step's theme is the document's theme while an aspect page of it shows.
test('the flip reads n/7 in a theme with seven options and n/8 in one with eight [fix-113]', { tag: ['@component:catalogue', '@sweep'] }, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/research/families/demo.html?next=/catalogue/changed.html&review=open');
    await expect(page.locator(`${DIALOG}[open]`)).toBeVisible();
    // "A live update" has more components in some themes than in others; read which from the demo's own hints.
    const counts = {};
    for (let guard = 0; guard < 3 * THEME_NAMES.length && new Set(Object.values(counts)).size < 2; guard += 1) {
        const title = await page.locator(`${DIALOG} [data-rv-title]`).textContent();
        if (title === 'A live update') {
            const read = await page.evaluate(() => {
                const theme = document.documentElement.dataset.theme;
                const choices = JSON.parse(document.querySelector('[data-review-item]').dataset.reviewChoices);
                const live = choices.find((c) => c.id === 'live' || /live update/i.test(c.label));
                return { theme, expected: live.options.filter((o) => o.hints?.[theme]).length };
            });
            const label = await page.locator(`${DIALOG} .rv-flip__label b`).textContent();
            const dots = await page.locator(`${DIALOG} .rv-flip__dots span`).count();
            expect(label, `${read.theme}: the label counts the options the theme has`).toMatch(new RegExp(`^1/${read.expected} `));
            expect(dots, `${read.theme}: one dot per option the theme has`).toBe(read.expected);
            counts[read.theme] = read.expected;
        }
        const before = (await where(page)).text;
        await page.keyboard.press('PageDown');
        await settle(page, before);
    }
    expect(new Set(Object.values(counts)).size, `two themes with different live-update counts were read (${JSON.stringify(counts)})`).toBe(2);
});
