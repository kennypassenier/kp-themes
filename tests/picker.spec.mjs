// The picker's five behaviours, driven in a real browser against both
// channels [TH8, TH27, AR7, L4].
//
// One suite, run twice: once against the React mount, once against the
// script-attached mount. AR7's reason for that shape is a defect it
// already caught elsewhere — two channels can be structurally identical
// and behave differently, and only driving them tells you which.
//
// The five, from FEATURES.md's test bar: it stores the choice and reads it
// back · it sets the theme attribute on the root element · it derives
// which themes are dark from the data rather than from a list · it falls
// back to formal on an unknown value · and two pickers on one page stay in
// step. The third is the one with a name attached: kyu assumed four dark
// themes where there are three.

import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { THEMES as REGISTRY } from '../js/theme-registry.js';

const PAGE = '/tests/fixtures/picker.html';

// The same generated record the browser loads. An earlier version of this
// file parsed it out of the source text and quietly produced an empty
// array — which made the loop below iterate over nothing and pass. A test
// that cannot fail is worse than no test, so it is imported.
const DARK = REGISTRY.filter((t) => t.dark).map((t) => t.name);

/** Which themes the stylesheet itself calls dark. The registry must agree. */
const DARK_IN_CSS = [
    ...readFileSync(new URL('../css/themes.css', import.meta.url), 'utf8').matchAll(/\[data-theme='([a-z0-9-]+)'\]\s*\{[^}]*--color-scheme:\s*dark/g),
].map((m) => m[1]);

/**
 * The two mounts, reduced to what a behaviour test needs: pick a theme,
 * and read back which option each picker shows as chosen. Everything
 * else about them differs — a listbox behind a trigger on one side, a row
 * of toggle buttons on the other — and that is the point.
 */
const CHANNELS = {
    'framework-free': {
        root: '#plain',
        async open() {},
        async choose(page, theme) {
            await page.click(`#plain [data-kp-theme="${theme}"]`);
        },
        async selection(page) {
            await page.waitForSelector('#plain [data-selected="true"]');
            return page.getAttribute('#plain [data-selected="true"]', 'data-kp-theme');
        },
    },
    react: {
        root: '#react-mount',
        async open(page) {
            const trigger = page.locator('#react-mount button[aria-haspopup="listbox"]');
            if ((await page.locator('#react-mount [role="listbox"]').count()) === 0) await trigger.click();
        },
        async choose(page, theme) {
            await this.open(page);
            await page.click(`#react-mount [data-kp-theme="${theme}"]`);
        },
        async selection(page) {
            await this.open(page);
            await page.waitForSelector('#react-mount [data-selected="true"]');
            return page.getAttribute('#react-mount [data-selected="true"]', 'data-kp-theme');
        },
    },
};

/** Both mounts must exist before anything is asserted about either. */
async function ready(page) {
    await page.waitForSelector('#plain [data-kp-theme="dark"]');
    await page.waitForSelector('#react-mount button[aria-haspopup="listbox"]');
}

for (const [name, channel] of Object.entries(CHANNELS)) {
    test.describe(`picker · ${name}`, () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(PAGE);
            await page.evaluate(() => localStorage.clear());
            await page.reload();
            await ready(page);
        });

        test('stores the choice and reads it back', async ({ page }) => {
            await channel.choose(page, 'terminal');
            expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('terminal');

            await page.reload();
            await ready(page);
            await expect(page.locator('html')).toHaveAttribute('data-theme', 'terminal');
            expect(await channel.selection(page)).toBe('terminal');
        });

        test('sets the theme attribute on the root element', async ({ page }) => {
            await channel.choose(page, 'pastel');
            await expect(page.locator('html')).toHaveAttribute('data-theme', 'pastel');
        });

        test('derives which themes are dark from the data, not from a list', async ({ page }) => {
            // The named failure: kyu's picker carried a hand-written list
            // of four dark themes where the stylesheet declares three.
            for (const theme of REGISTRY) {
                await channel.choose(page, theme.name);
                const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
                expect(isDark, `${theme.name} should${theme.dark ? '' : ' not'} carry the dark class`).toBe(theme.dark);
            }
            // Not a count. Counting was how this test broke when an
            // eighth theme arrived, and a number in a test is the same
            // hand-written list the test exists to forbid. The property
            // is that the registry and the stylesheet agree about which
            // themes are dark — kyu's error was believing in one the
            // stylesheet did not have.
            expect([...DARK].sort()).toEqual([...DARK_IN_CSS].sort());
        });

        test('falls back to formal on an unknown stored value', async ({ page }) => {
            await page.evaluate(() => localStorage.setItem('theme', 'chartreuse-deluxe'));
            await page.reload();
            await ready(page);
            await expect(page.locator('html')).toHaveAttribute('data-theme', 'formal');
            expect(await channel.selection(page)).toBe('formal');
        });
    });
}

test('the picker is operable by keyboard end to end with every theme in it [R5]', async ({ page }) => {
    // Twenty-four options in a menu: the last one must be reachable and
    // visible — scrolled into view inside the popover, not clipped under
    // its edge. The React menu is a roving tabindex: Tab enters the list
    // once, the arrows move between options, Enter chooses.
    // Drill [KT3]: with `overflow: clip` on .kp-popover the container
    // cannot scroll, focus lands on an option outside the popover's box,
    // and the box assertion fails.
    await page.goto('/tests/fixtures/picker.html');
    // Shorter than the list: at 420px the popover's 80vh is 336px and the
    // twenty-four options need 465px, so the menu has to scroll.
    await page.setViewportSize({ width: 1024, height: 420 });
    const trigger = page.locator('#react-mount .kp-icon-button');
    await trigger.focus();
    await page.keyboard.press('Enter');
    const menu = page.locator('#react-mount [data-kp-theme-picker]');
    await expect(menu).toBeVisible();
    const last = await menu.locator('[data-kp-theme]').last().getAttribute('data-kp-theme');
    // Firefox puts a scrollable container in the tab order before its
    // contents; one Tab reaches the list there and the option here.
    let focused = null;
    for (let i = 0; i < 3 && focused === null; i++) {
        await page.keyboard.press('Tab');
        focused = await page.evaluate(() => document.activeElement?.getAttribute('data-kp-theme') ?? null);
    }
    for (let i = 0; i < REGISTRY.length + 2 && focused !== last; i++) {
        await page.keyboard.press('ArrowDown');
        focused = await page.evaluate(() => document.activeElement?.getAttribute('data-kp-theme') ?? null);
    }
    expect(focused).toBe(last);
    const boxes = await page.evaluate((name) => {
        const option = document.querySelector(`#react-mount [data-kp-theme="${name}"]`);
        const popover = option.closest('.kp-popover');
        const o = option.getBoundingClientRect();
        const p = popover.getBoundingClientRect();
        return { option: [o.top, o.bottom], popover: [p.top, p.bottom], viewport: window.innerHeight };
    }, last);
    expect(boxes.option[0]).toBeGreaterThanOrEqual(boxes.popover[0] - 1);
    expect(boxes.option[1]).toBeLessThanOrEqual(boxes.popover[1] + 1);
    expect(boxes.popover[1]).toBeLessThanOrEqual(boxes.viewport + 1);
    // And every option lies inside the popover's width, with nothing on
    // top of it. The first CI run of 3.1.0 clicked "pastel" and hit
    // "terminal": a wrapping flex column in a height-limited popover had
    // started a second column, and the light group hung outside the box.
    // Drill [KT3]: remove `flex-wrap: nowrap` from .kp-menu and this
    // names every light option as outside the popover.
    const misplaced = await page.evaluate(() => {
        const out = [];
        const popover = document.querySelector('#react-mount .kp-popover');
        const p = popover.getBoundingClientRect();
        for (const option of document.querySelectorAll('#react-mount [data-kp-theme]')) {
            const r = option.getBoundingClientRect();
            if (r.left < p.left - 1 || r.right > p.right + 1)
                out.push(
                    `${option.dataset.kpTheme} is outside the popover (${Math.round(r.left)}–${Math.round(r.right)} vs ${Math.round(p.left)}–${Math.round(p.right)}, client ${popover.clientWidth})`,
                );
            if (r.bottom < 0 || r.top > window.innerHeight) continue;
            const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)?.closest('[data-kp-theme]');
            if (hit && hit !== option) out.push(`${option.dataset.kpTheme} is covered by ${hit.dataset.kpTheme}`);
        }
        return out;
    });
    expect(misplaced).toEqual([]);
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('data-theme', last);
});

test('two pickers on one page stay in step', async ({ page }) => {
    await page.goto(PAGE);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await ready(page);

    // Each channel's own state lives in a place the other cannot reach —
    // React module state on one side, DOM attributes on the other — so
    // this passes only because both read the document and one shared
    // event [AR5]. It is the assertion the comparison page exists for.
    await CHANNELS['framework-free'].choose(page, 'cyberpunk');
    expect(await CHANNELS.react.selection(page)).toBe('cyberpunk');

    await CHANNELS.react.choose(page, 'topo');
    expect(await CHANNELS['framework-free'].selection(page)).toBe('topo');
});

test('the focus ring is two visible channels [DI2]', async ({ page }) => {
    await page.goto(PAGE);
    await ready(page);

    // The token gate proves the two colours contrast on every surface it
    // can land on. This proves the rule reaches the element at all: before
    // it existed, focus was whatever the browser drew.
    const option = page.locator('#plain [data-kp-theme="cyberpunk"]');
    await option.focus();
    const ring = await option.evaluate((el) => {
        const s = getComputedStyle(el);
        return { width: s.outlineWidth, style: s.outlineStyle, offset: s.outlineOffset, shadow: s.boxShadow };
    });
    expect(ring.style).toBe('solid');
    expect(parseFloat(ring.width)).toBeGreaterThanOrEqual(2);
    expect(parseFloat(ring.offset)).toBeGreaterThanOrEqual(2);
    expect(ring.shadow).not.toBe('none');
});
