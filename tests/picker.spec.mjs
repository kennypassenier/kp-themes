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
import { THEMES as REGISTRY } from '../js/theme-registry.js';

const PAGE = '/tests/fixtures/picker.html';

// The same generated record the browser loads. An earlier version of this
// file parsed it out of the source text and quietly produced an empty
// array — which made the loop below iterate over nothing and pass. A test
// that cannot fail is worse than no test, so it is imported.
const DARK = REGISTRY.filter((t) => t.dark).map((t) => t.name);

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
            expect(DARK).toHaveLength(3);
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
