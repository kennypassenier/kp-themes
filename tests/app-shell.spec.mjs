// The application shell [scope-48, scope-79].
//
// research/navbar/README.md, recommendation 1: the bar, the side
// navigation as a rail and the breadcrumb composed into one page, with a
// declared toggle that collapses the rail. The package had every part and
// no page that put them together; `examples/app-shell.html` faked its side
// column with a card.
//
// Behaviour only [scope-32, scope-73]: what the toggle does to the rail,
// what a screen reader is told, where the focus is, and whether the two
// channels agree. How the shell looks is Kenny's to judge on
// catalogue/navigation.html#app-shell.

import { expect, test } from '@playwright/test';
import { getStrings } from '../js/strings.js';
import { THEMES } from '../js/theme-registry.js';
import { measured } from './paint.mjs';

const s = getStrings();

const CHANNELS = [
    { name: 'framework-free', url: '/examples/app-shell.html', root: 'body' },
    { name: 'React', url: '/tests/fixtures/examples.html?example=app-shell', root: '#react-mount' },
];

/**
 * Collapse and expand the rail from the keyboard, and write down what a
 * reader of each step would be told.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} root
 */
async function drive(page, root) {
    const rail = page.locator(`${root} nav.kp-sidenav[data-kp-sidenav-slim]`);
    const toggle = page.locator(`${root} [data-kp-sidenav-slim-toggle]`);
    await expect(rail, 'the shell has a real rail, not a card').toHaveCount(1);
    await expect(toggle, 'and one declared toggle for it').toHaveCount(1);
    // Attached: the module has written the state the toggle reports.
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    const full = await rail.evaluate((el) => el.getBoundingClientRect().width);
    /** @type {Record<string, unknown>[]} */
    const steps = [];
    const read = async () => ({
        collapsed: await rail.evaluate((el) => el.hasAttribute('data-kp-sidenav-slim-collapsed')),
        expanded: await toggle.getAttribute('aria-expanded'),
        controls: (await toggle.getAttribute('aria-controls')) === (await rail.getAttribute('id')),
        focused: await toggle.evaluate((el) => el === document.activeElement),
    });

    await toggle.focus();
    await page.keyboard.press('Enter');
    await measured(rail, (el) => el.getBoundingClientRect().width, undefined, 'collapsed: the rail narrows').toBeLessThan(full - 40);
    await expect(toggle, 'collapsed: the toggle is named for what it will do').toHaveAccessibleName(s.expandRail);
    steps.push(await read());

    await page.keyboard.press('Enter');
    await measured(rail, (el) => el.getBoundingClientRect().width, undefined, 'expanded again: the full width').toBeGreaterThan(full - 1);
    await expect(toggle, 'expanded: the toggle is named for what it will do').toHaveAccessibleName(s.collapseRail);
    steps.push(await read());
    return steps;
}

test.describe('the application shell', { tag: ['@component:navigation', '@component:examples'] }, () => {
    for (const channel of CHANNELS) {
        test(`${channel.name}: the slim toggle collapses and restores the rail, says which, and keeps the focus`, async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            await page.goto(channel.url);
            const steps = await drive(page, channel.root);
            expect(steps).toEqual([
                { collapsed: true, expanded: 'false', controls: true, focused: true },
                { collapsed: false, expanded: 'true', controls: true, focused: true },
            ]);
        });

        test(`${channel.name}: a collapsed rail keeps every destination's name in the accessibility tree`, async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            await page.goto(channel.url);
            const rail = page.locator(`${channel.root} nav.kp-sidenav[data-kp-sidenav-slim]`);
            const toggle = page.locator(`${channel.root} [data-kp-sidenav-slim-toggle]`);
            await expect(toggle).toHaveAttribute('aria-expanded', 'true');
            const names = await rail.locator('a.kp-sidenav__link .kp-sidenav__label').allTextContents();
            expect(names.length, 'the rail carries destinations').toBeGreaterThan(2);
            await toggle.click();
            await expect(rail).toHaveAttribute('data-kp-sidenav-slim-collapsed', '');
            for (const name of names) {
                await expect(rail.getByRole('link', { name: name.trim(), exact: true }), `"${name}" is still a named link in the rail`).toHaveCount(
                    1,
                );
            }
        });

        test(`${channel.name}: the breadcrumb sits before main, so the skip link passes it, and marks where the reader is`, async ({ page }) => {
            await page.goto(channel.url);
            const crumbs = page.locator(`${channel.root} nav.kp-breadcrumb`);
            await expect(crumbs).toHaveAccessibleName(s.breadcrumb);
            await expect(crumbs.locator('[aria-current="page"]')).toHaveCount(1);
            const before = await crumbs.evaluate((el) => {
                const main = document.querySelector('main#main');
                return main !== null && (el.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0 && !main.contains(el);
            });
            expect(before).toBe(true);
        });
    }

    test('a slim toggle whose only content is a hidden glyph is named from the strings, and the name follows the state', async ({ page }) => {
        // Before: the module named a toggle only when it was empty or already
        // carried aria-label, so a button holding an aria-hidden arrow had no
        // name at all — it read as "button".
        await page.goto('/catalogue/navigation.html');
        await page.evaluate(() => {
            const button = document.createElement('button');
            button.type = 'button';
            button.id = 'glyph-toggle';
            button.setAttribute('data-kp-sidenav-slim-toggle', '');
            button.setAttribute('aria-controls', 'nv-slim-c');
            button.innerHTML = '<span aria-hidden="true">«</span>';
            document.querySelector('#sidenav-slim')?.append(button);
        });
        // A toggle added after attachment is named on the first change of state.
        const toggle = page.locator('#glyph-toggle');
        await toggle.click();
        await expect(toggle).toHaveAccessibleName(s.expandRail);
        await toggle.click();
        await expect(toggle).toHaveAccessibleName(s.collapseRail);
    });

    test('both channels tell a reader the same thing at every step of the toggle', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(CHANNELS[0].url);
        const free = await drive(page, CHANNELS[0].root);
        await page.goto(CHANNELS[1].url);
        const react = await drive(page, CHANNELS[1].root);
        expect(react).toEqual(free);
    });

    test(
        'an open dropdown in the bar stays above a popover-layer element that follows the bar, in every theme [finding 3]',
        { tag: ['@sweep'] },
        async ({ page }) => {
            // Before: two registers lifted the bar's wrapper (dark, titanium) and
            // nine the nav inside it; nothing in the base did. Measured on the old
            // code in firefox, the next element on the popover layer painted over
            // the open dropdown in six themes: light, forest, high-contrast,
            // solstice, shade-light and shade-dark.
            await page.setViewportSize({ width: 1280, height: 900 });
            await page.goto('/examples/app-shell.html');
            await page.evaluate(() => {
                const links = document.querySelector('.kp-nav__links');
                const item = document.createElement('li');
                item.setAttribute('data-kp-nav-menu-open', '');
                item.innerHTML =
                    '<a class="kp-nav__link" href="#x" aria-haspopup="true">More</a><ul class="kp-nav__menu"><li><a id="probe-link" href="#y">Exports</a></li><li><a href="#z">Audit log</a></li></ul>';
                links?.append(item);
                const layer = document.createElement('div');
                layer.id = 'probe-layer';
                layer.textContent = 'A layer of its own';
                layer.style.cssText = 'position: relative; z-index: var(--kp-z-popover, 20); block-size: 30rem; background: var(--background)';
                document.querySelector('.kp-nav-wrap')?.after(layer);
            });
            /** @type {string[]} */
            const covered = [];
            for (const theme of THEMES) {
                await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme.name);
                const miss = await page.locator('#probe-link').evaluate((el) => {
                    const box = el.getBoundingClientRect();
                    // A point just inside the link's start: a menu that opens under the last
                    // item may run past the window's edge, and that is not what this reads.
                    const hit = document.elementFromPoint(box.left + 4, box.top + box.height / 2);
                    if (hit !== null && el.closest('.kp-nav__menu')?.contains(hit) === true) return '';
                    return `${hit === null ? 'nothing' : `${hit.tagName.toLowerCase()}#${hit.id}.${hit.className}`} at ${Math.round(box.left)},${Math.round(box.top)}`;
                });
                if (miss !== '') covered.push(`${theme.name}: ${miss}`);
            }
            expect(covered, 'themes whose open dropdown is painted over').toEqual([]);
        },
    );
});
