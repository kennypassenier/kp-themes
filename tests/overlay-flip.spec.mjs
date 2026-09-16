// A raised overlay opens upward when the window has no room below [fix-30].
//
// js/top-layer.js lifts an open combobox list, a drawn select's list and a
// date picker's calendar into the top layer, fixed to the window. Placed
// under its field without reading the window's height, an overlay opened
// from a field at the bottom of the window hung below the window's edge,
// where neither a person nor a click could reach it
// (tests/nostromo-second-pass.spec.mjs, "a click on an option adds that
// tag — framework-free", timed out on "element is outside of the
// viewport").
//
// Each test here puts its field at the bottom of a short window, opens the
// overlay, and asserts that the overlay lies wholly inside the window and
// above the field, and that one of its choices can be clicked. Three
// overlays, both channels [AR7].
//
// Drilled per KT3 on 2026-09-15: all six ran against 6dd76c6c, before the
// placement existed, and went red; the line under each name records what
// it measured there.

import { test, expect } from '@playwright/test';

const WINDOW = { width: 1280, height: 520 };
/** How far above the window's bottom edge the field's bottom is put. */
const FROM_BOTTOM = 12;

/**
 * Put the field's bottom FROM_BOTTOM px above the window's bottom edge: by
 * scrolling when there is page enough above it, by padding the top of the
 * body when there is not.
 *
 * @param {import('@playwright/test').Page} page @param {string} field
 */
const toBottom = async (page, field) => {
    await page.setViewportSize(WINDOW);
    await expect(page.locator(field)).toBeVisible();
    await page.evaluate(
        ({ selector, gap }) => {
            const element = /** @type {HTMLElement} */ (document.querySelector(selector));
            const bottom = element.getBoundingClientRect().bottom + window.scrollY;
            const scroll = bottom - (window.innerHeight - gap);
            if (scroll < 0) {
                document.body.style.paddingTop = `${-scroll}px`;
                window.scrollTo({ top: 0, behavior: 'instant' });
            } else {
                window.scrollTo({ top: scroll, behavior: 'instant' });
            }
        },
        { selector: field, gap: FROM_BOTTOM },
    );
    const at = await page.evaluate((selector) => {
        const r = /** @type {HTMLElement} */ (document.querySelector(selector)).getBoundingClientRect();
        return window.innerHeight - r.bottom;
    }, field);
    expect(Math.abs(at - FROM_BOTTOM), `the field's bottom sits ${at}px above the window's bottom`).toBeLessThanOrEqual(2);
};

/**
 * Where the overlay and its field are, in window coordinates.
 *
 * @param {import('@playwright/test').Page} page @param {string} overlay @param {string} field
 */
const measure = (page, overlay, field) =>
    page.evaluate(
        ({ overlay: o, field: f }) => {
            const list = /** @type {HTMLElement} */ (document.querySelector(o)).getBoundingClientRect();
            const box = /** @type {HTMLElement} */ (document.querySelector(f)).getBoundingClientRect();
            return {
                overlayTop: Math.round(list.top),
                overlayBottom: Math.round(list.bottom),
                fieldTop: Math.round(box.top),
                window: window.innerHeight,
            };
        },
        { overlay, field },
    );

/**
 * The overlay lies wholly inside the window, above its field.
 *
 * @param {import('@playwright/test').Page} page @param {string} overlay @param {string} field
 */
const expectAbove = async (page, overlay, field) => {
    await expect(page.locator(overlay)).toBeVisible();
    await expect
        .poll(async () => {
            const m = await measure(page, overlay, field);
            return m.overlayTop >= 0 && m.overlayBottom <= m.window && m.overlayBottom <= m.fieldTop + 1 ? 'above, inside' : JSON.stringify(m);
        })
        .toBe('above, inside');
};

const COMPONENTS = '/tests/fixtures/components.html';
const SELECT = '/tests/fixtures/select.html';

const CHANNELS = [
    {
        name: 'framework-free',
        combobox: '[data-test="plain-combobox"]',
        comboboxInput: '[data-test="plain-combobox-input"]',
        select: '[data-test="plain-select"]',
        date: '[data-test="plain-date"]',
        dateOpen: '[data-test="plain-date-open"]',
        datePanel: '[data-test="plain-date-panel"]',
    },
    {
        name: 'React',
        combobox: '[data-test="react-combobox"] .kp-combobox',
        comboboxInput: '[data-test="react-combobox"] .kp-combobox__input',
        select: '[data-test="react-select"]',
        date: '[data-test="react-date"] .kp-datepicker',
        dateOpen: '[data-test="react-date"] [data-kp-date-open]',
        datePanel: '[data-test="react-date"] .kp-datepicker__panel',
    },
];

for (const channel of CHANNELS) {
    test(
        `a combobox at the bottom of the window opens its list above the field — ${channel.name} [fix-30]`,
        { tag: ['@component:combobox'] },
        async ({ page }) => {
            // Before, in a 520px window: the list hung from y=486 to 604 under an input at 446 (framework-free), from 506 to 624 under one at 466 (React).
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.goto(COMPONENTS);
            await toBottom(page, channel.combobox);
            const input = page.locator(channel.comboboxInput);
            await input.click();
            const list = `${channel.combobox} .kp-combobox__list`;
            await expectAbove(page, list, channel.comboboxInput);
            const option = page.locator(`${list} [role="option"]:visible`).first();
            const text = ((await option.textContent()) ?? '').trim();
            await option.click();
            await expect(input).toHaveValue(text);
        },
    );

    test(
        `a drawn select at the bottom of the window opens its list above the field — ${channel.name} [fix-30]`,
        { tag: ['@component:field'] },
        async ({ page }) => {
            // Before, in a 520px window: the list hung from y=512 to 666 under a select at 472, in both channels.
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.goto(SELECT);
            const select = page.locator(channel.select);
            const list = `${channel.select} + [data-kp-select-list]`;
            await expect(page.locator(list)).toHaveCount(1);
            await toBottom(page, channel.select);
            await select.click();
            await expectAbove(page, list, channel.select);
            await page.locator(list).locator('[role="option"]', { hasText: 'Critical' }).click();
            await expect(select).toHaveValue('critical');
        },
    );

    test(
        `a date picker at the bottom of the window opens its calendar above the field — ${channel.name} [fix-30]`,
        { tag: ['@component:datepicker'] },
        async ({ page }) => {
            // Before, in a 520px window: the calendar hung from y=512 to 788 under a picker at 447, in both channels.
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.goto(COMPONENTS);
            await toBottom(page, channel.date);
            const input = page.locator(`${channel.date} [data-kp-date-input]`);
            await input.fill('04-09-2026');
            await page.locator(channel.dateOpen).click();
            await expectAbove(page, channel.datePanel, channel.date);
            await page.locator(`${channel.datePanel} [data-kp-day]`, { hasText: /^17$/ }).first().click();
            await expect(input).toHaveValue(/17/);
        },
    );

    test(
        `a combobox that opened upward opens downward again at the top of the window — ${channel.name} [fix-30]`,
        { tag: ['@component:combobox'] },
        async ({ page }) => {
            // The six tests above prove the flip. None of them proves the
            // flip is not permanent: an overlay that remembers where it
            // went, or a class left on it at close, hangs off the TOP of
            // the window the next time the field has room below it — the
            // same fault the other way up. The audit named the reopen
            // position as the third thin spot in this area [scope-103].
            //
            // Drilled 2026-09-16 in firefox: the `below` branch of
            // placeBlockSide in js/top-layer.js made unreachable, so every
            // open flips → red in both channels, the list at
            // overlayTop 0 / overlayBottom 31 above a field at 35.
            // The six tests above stayed green. Restored green.
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.goto(COMPONENTS);
            const input = page.locator(channel.comboboxInput);
            const list = `${channel.combobox} .kp-combobox__list`;

            await toBottom(page, channel.combobox);
            await input.click();
            await expectAbove(page, list, channel.comboboxInput);
            // Focus away rather than Escape: the framework-free combobox
            // opens on focus and has no key that reopens it from closed, so
            // an Escape would leave the input focused and shut for good.
            await page.locator('h1').click();
            await expect(page.locator(list)).toBeHidden();

            // Now the other end: the field at the top, with the whole window
            // below it.
            await page.evaluate((selector) => {
                const element = /** @type {HTMLElement} */ (document.querySelector(selector));
                window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 8, behavior: 'instant' });
            }, channel.combobox);
            await input.click();
            await expect(page.locator(list)).toBeVisible();
            await expect
                .poll(async () => {
                    const m = await measure(page, list, channel.comboboxInput);
                    const fieldBottom = await page.evaluate(
                        (f) => Math.round(/** @type {HTMLElement} */ (document.querySelector(f)).getBoundingClientRect().bottom),
                        channel.comboboxInput,
                    );
                    return m.overlayTop >= 0 && m.overlayBottom <= m.window && m.overlayTop >= fieldBottom - 1 ? 'below, inside' : JSON.stringify(m);
                })
                .toBe('below, inside');

            // And it is still a working list, not just a well-placed box.
            const option = page.locator(`${list} [role="option"]:visible`).first();
            const text = ((await option.textContent()) ?? '').trim();
            await option.click();
            await expect(input).toHaveValue(text);
        },
    );
}

// A dialog opened from inside a dialog keeps its cap [fix-36, gap-11].
//
// fix-36's own note says what was missing: "no test opened a block's modal
// inside it, and the overlays tests open the long dialog on the plain page,
// where it is capped". tests/retro-dialog-notes.spec.mjs covers the
// catalogue's review dialog, which is where Kenny met the fault; this
// covers the position itself, in the package's own markup, so the package
// keeps the property with no catalogue in the picture.
//
// Both window sizes fix-36 was measured at. Under the fault the sixty-row
// dialog opened 2574px tall with its top at -837px on 1400×900 and -1062px
// at 864×450, and never scrolled.
//
// Two drills, 2026-09-16 in firefox. Setting `--kp-dialog-max-height: none`
// on the host — fix-36's own mechanism — left both green: a modal dialog's
// UA `max-height` still holds the box inside the window, so the knob alone
// is not what saves the nested position, and neither is the package's
// `max-block-size`, removed with the same result. What DOES save it is the
// column: the `display: flex; flex-direction: column` on
// `.kp-dialog[open]:has(> .kp-dialog__body)` removed from
// css/components.css → red at both sizes, `bodyScrolls` false and
// `dialogScrolls` true, the dialog 868px tall at 1400×900 and 418px at
// 864×450, so the rows take the title and the actions with them — gap-11's
// fault, in the nested position no test had opened. Restored green.
const ROOMS = [
    { width: 1400, height: 900 },
    { width: 864, height: 450 },
];

for (const room of ROOMS) {
    test(
        `a long dialog opened from inside another dialog stops at the window at ${room.width}×${room.height} [fix-36]`,
        { tag: ['@component:overlays'] },
        async ({ page }) => {
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.setViewportSize(room);
            await page.goto('/tests/fixtures/dialog-in-dialog.html');
            await page.locator('[data-test="host-open"]').click();
            await expect(page.locator('[data-test="host"]')).toBeVisible();
            await page.locator('[data-test="inner-open"]').click();
            const inner = page.locator('[data-test="inner"]');
            await expect(inner).toBeVisible();

            const measured = await inner.evaluate((el) => {
                const body = /** @type {HTMLElement} */ (el.querySelector('.kp-dialog__body'));
                const actions = /** @type {HTMLElement} */ (el.querySelector('.kp-dialog__actions'));
                const box = el.getBoundingClientRect();
                return {
                    fits: box.top >= 0 && box.bottom <= window.innerHeight,
                    // The rows scroll, the title and the actions do not go
                    // with them: that is the whole of gap-11's claim.
                    bodyScrolls: body.scrollHeight > body.clientHeight + 1,
                    actionsShown: actions.getBoundingClientRect().bottom <= box.bottom + 1,
                    dialogScrolls: el.scrollHeight > el.clientHeight + 1,
                    top: Math.round(box.top),
                    height: Math.round(box.height),
                };
            });
            expect(
                {
                    fits: measured.fits,
                    bodyScrolls: measured.bodyScrolls,
                    actionsShown: measured.actionsShown,
                    dialogScrolls: measured.dialogScrolls,
                },
                `the inner dialog is ${measured.height}px tall with its top at ${measured.top}`,
            ).toEqual({ fits: true, bodyScrolls: true, actionsShown: true, dialogScrolls: false });

            // The first row is reachable, which is what Kenny could not do.
            await expect(page.locator('[data-test="inner-rows"] tr').first()).toBeInViewport();
        },
    );
}
