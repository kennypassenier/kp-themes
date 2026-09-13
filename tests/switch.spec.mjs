// The switch [gap-11].
//
// A checkbox that says on and off instead of ticked: a native
// `<input type="checkbox" role="switch">` styled as a track and a thumb.
// The concept page Kenny approved on 2026-09-13 ("Switch: Akkoord") moved
// into the package, and this suite holds what it promised, in both
// channels [AR7]: Space flips it and the paint follows, a screen reader
// hears a switch with its state, a disabled one stays put, the invalid
// and focused states show in every theme, and the two words come from
// the dictionary where a consumer can replace them [KT5].
//
// Written before the component existed and watched failing on a stub
// (rule 8): no `.kp-switch` rules, no `switchOn`/`switchOff` strings, and
// a React `Switch` that rendered nothing.

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { DEFAULT_STRINGS as S } from '../js/strings.js';
import { indicatorFor, tabToSelector, wearTheme } from './ring.mjs';

const FIXTURE = '/tests/fixtures/switch.html';

/** @type {string[]} */
const THEMES = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));

const CHANNELS = [
    { name: 'framework-free', off: 'plain-off', disabled: 'plain-disabled', invalid: 'plain-invalid' },
    { name: 'React', off: 'react-off', disabled: 'react-disabled', invalid: 'react-invalid' },
];

/** @param {string} id */
const at = (id) => `[data-test="${id}"]`;

/**
 * What the track paints: its boundary, its ground, and the thumb's place.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} id
 */
const paint = (page, id) =>
    page.locator(at(id)).evaluate((el) => {
        const s = getComputedStyle(el);
        const thumb = getComputedStyle(el, '::before');
        return [
            s.backgroundColor,
            s.borderTopColor,
            s.boxShadow,
            `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`,
            thumb.insetInlineStart,
            thumb.backgroundColor,
        ].join(' | ');
    });

/** The word the reader sees beside the track. @param {import('@playwright/test').Page} page @param {string} id */
const word = (page, id) =>
    page
        .locator(at(id))
        .evaluate((el) => /** @type {HTMLElement} */ (el.closest('.kp-switch')?.querySelector('.kp-switch__state'))?.innerText.trim() ?? '');

for (const channel of CHANNELS) {
    test.describe(`switch — ${channel.name}`, () => {
        test.beforeEach(async ({ page }) => {
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.goto(FIXTURE);
            await page.waitForSelector(at('react-off'));
        });

        // Drill [KT3]: the `.kp-switch__input:checked` and `:checked::before` rules removed from css/components.css — the paint read the same on and off.
        test(`Space flips a switch and the paint follows, ${channel.name} [gap-11]`, async ({ page }) => {
            const control = page.locator(at(channel.off));
            // Read once focused, so the ring is in both readings and only the state differs.
            await tabToSelector(page, at(channel.off));
            const off = await paint(page, channel.off);
            await page.keyboard.press('Space');
            await expect(control).toBeChecked();
            await expect.poll(() => paint(page, channel.off)).not.toBe(off);
            // Enter does not flip it: that is a checkbox's behaviour, and the reason the switch is one.
            await page.keyboard.press('Enter');
            await expect(control).toBeChecked();
            await page.keyboard.press('Space');
            await expect(control).not.toBeChecked();
            await expect.poll(() => paint(page, channel.off)).toBe(off);
        });

        test(`a screen reader hears a switch and its state, ${channel.name} [gap-11]`, async ({ page }) => {
            // The name is the label alone: the word beside the track is aria-hidden, because the role already says on or off.
            const control = page.getByRole('switch', { name: 'Night alarms', exact: true });
            await expect(control).toHaveCount(2);
            const mine = page.locator(`#${channel.name === 'React' ? 'react' : 'plain'}`).getByRole('switch', { name: 'Night alarms', exact: true });
            await expect(mine).toHaveCount(1);
            await expect(mine).not.toBeChecked();
            await mine.focus();
            await page.keyboard.press('Space');
            await expect(mine).toBeChecked();
            await expect(page.locator(`#${channel.name === 'React' ? 'react' : 'plain'}`).getByRole('checkbox')).toHaveCount(0);
        });

        test(`a disabled switch does not flip, ${channel.name} [gap-11]`, async ({ page }) => {
            const control = page.locator(at(channel.disabled));
            await expect(control).toBeDisabled();
            const before = await paint(page, channel.disabled);
            await control.evaluate((el) => /** @type {HTMLElement} */ (el.closest('label')).click());
            await expect(control).not.toBeChecked();
            expect(await paint(page, channel.disabled)).toBe(before);
            // And it fades: the row reads as out of reach, not only refuses.
            const opacity = await control.evaluate((el) => Number(getComputedStyle(/** @type {Element} */ (el.closest('.kp-switch'))).opacity));
            expect(opacity).toBeLessThan(1);
        });

        // Drill [KT3]: the `.kp-switch__input[aria-invalid='true']` rule removed from css/components.css — every theme painted the invalid switch like the valid one.
        test(`an invalid switch paints differently from a valid one, in every theme, ${channel.name} [gap-11]`, async ({ page }) => {
            const alike = [];
            for (const theme of THEMES) {
                await wearTheme(page, theme);
                if ((await paint(page, channel.invalid)) === (await paint(page, channel.off))) alike.push(theme);
            }
            expect(alike, 'themes whose invalid switch paints like a valid one').toEqual([]);
        });

        // Found by looking (rule 8): brutalism's thumb rule painted the thumb in ink for both states, and the track is ink once on — the thumb vanished.
        // Drill [KT3]: the brutalism `.kp-switch__input:checked::before` rule removed — "brutalism: on" listed.
        test(`the thumb stands out from its track, on and off, in every theme, ${channel.name} [gap-11]`, async ({ page }) => {
            const control = page.locator(at(channel.off));
            const lost = [];
            for (const checked of [false, true]) {
                await control.evaluate((el, value) => {
                    /** @type {HTMLInputElement} */ (el).checked = value;
                }, checked);
                for (const theme of THEMES) {
                    await wearTheme(page, theme);
                    const [track, thumb] = await control.evaluate((el) => [
                        getComputedStyle(el).backgroundColor,
                        getComputedStyle(el, '::before').backgroundColor,
                    ]);
                    if (track === thumb) lost.push(`${theme}: ${checked ? 'on' : 'off'} (${thumb})`);
                }
            }
            expect(lost, 'themes whose thumb paints in its track colour').toEqual([]);
        });

        // Found by looking (rule 8): a register's ground rule on `.kp-switch__input` sits in a later layer than the package's `:checked` fill, so ten themes lost the fill once on.
        // Drill [KT3]: `:not(:checked)` removed from the light register's switch rule — "light" listed.
        test(`on fills the track differently from off, in every theme that fills it, ${channel.name} [gap-11]`, async ({ page }) => {
            /** Themes whose register keeps the track's ground when on and lights the thumb instead, as their checkbox does. */
            const LIT_THUMB = new Set(['cyberpunk', 'synthwave', 'terminal']);
            const control = page.locator(at(channel.off));
            const track = () => control.evaluate((el) => [getComputedStyle(el).backgroundColor, getComputedStyle(el, '::before').backgroundColor]);
            const unfilled = [];
            for (const theme of THEMES) {
                await wearTheme(page, theme);
                await control.evaluate((el) => {
                    /** @type {HTMLInputElement} */ (el).checked = false;
                });
                const [offGround, offThumb] = await track();
                await control.evaluate((el) => {
                    /** @type {HTMLInputElement} */ (el).checked = true;
                });
                const [onGround, onThumb] = await track();
                if (LIT_THUMB.has(theme) ? onThumb === offThumb : onGround === offGround) unfilled.push(theme);
            }
            expect(unfilled, 'themes whose switch paints the same on as off').toEqual([]);
        });

        test(`focus on a switch is visible, in every theme, ${channel.name} [gap-11]`, async ({ page }) => {
            await tabToSelector(page, at(channel.off));
            const unseen = [];
            for (const theme of THEMES) {
                await wearTheme(page, theme);
                const found = await indicatorFor(page, at(channel.off));
                expect(found.focused, `${theme}: the keyboard lost the switch`).toBe(true);
                const outline = found.outlineStyle !== 'none' && found.outlineWidth >= 1;
                const shadow = found.boxShadow !== 'none';
                const changed = found.unfocused.outlineStyle !== found.outlineStyle || found.unfocused.boxShadow !== found.boxShadow;
                if (!(outline || shadow) || !changed)
                    unseen.push(`${theme}: outline ${found.outlineStyle} ${found.outlineWidth}px, shadow ${found.boxShadow}`);
            }
            expect(unseen, `focus shows nothing in:\n${unseen.join('\n')}`).toEqual([]);
        });

        test(`the On and Off words come from the dictionary, ${channel.name} [gap-11, KT5]`, async ({ page }) => {
            await expect.poll(() => word(page, channel.off)).toBe(S.switchOff);
            await page.locator(at(channel.off)).focus();
            await page.keyboard.press('Space');
            await expect.poll(() => word(page, channel.off)).toBe(S.switchOn);
        });
    });
}

test('a consumer replaces the words, React through the strings prop [KT5]', async ({ page }) => {
    await page.goto(FIXTURE);
    await page.waitForSelector(at('react-strings'));
    await expect.poll(() => word(page, 'react-strings')).toBe('Uit');
    await page.locator(at('react-strings')).focus();
    await page.keyboard.press('Space');
    await expect.poll(() => word(page, 'react-strings')).toBe('Aan');
});

test('a consumer replaces the words, framework-free through setStrings [KT5]', async ({ page }) => {
    await page.goto(FIXTURE);
    await page.waitForSelector(at('react-off'));
    await page.evaluate(async () => {
        const { setStrings, DEFAULT_STRINGS } = await import('/js/strings.js');
        const { attachSwitches } = await import('/js/forms.js');
        setStrings({ switchOn: 'Aan', switchOff: 'Uit' });
        const label = document.createElement('label');
        label.className = 'kp-switch';
        label.innerHTML =
            '<input class="kp-switch__input" type="checkbox" role="switch" data-test="plain-late" /><span class="kp-switch__state" aria-hidden="true"></span><span>Late</span>';
        document.getElementById('plain')?.append(label);
        attachSwitches(document.getElementById('plain') ?? document);
        setStrings(DEFAULT_STRINGS);
    });
    await expect.poll(() => word(page, 'plain-late')).toBe('Uit');
    await page.locator(at('plain-late')).focus();
    await page.keyboard.press('Space');
    await expect.poll(() => word(page, 'plain-late')).toBe('Aan');
    // The switch attached at load kept the words it was given then.
    await expect.poll(() => word(page, 'plain-off')).toBe(S.switchOff);
});

test('the thumb travels without a transition under reduced motion, and with one otherwise [gap-11, DI5]', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(FIXTURE);
    const durations = () =>
        page
            .locator(at('plain-off'))
            .evaluate((el) => [getComputedStyle(el).transitionDuration, getComputedStyle(el, '::before').transitionDuration]);
    const still = await durations();
    expect(still.every((d) => d.split(',').every((part) => Number.parseFloat(part) === 0))).toBe(true);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect.poll(async () => (await durations()).every((d) => d.split(',').some((part) => Number.parseFloat(part) > 0))).toBe(true);
});
