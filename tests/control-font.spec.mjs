// A control the package styles takes the theme's font, not the desktop's
// [fix-28, scope-83].
//
// Kenny's FireDragon gave every button, checkbox and switch the package left
// without a font his desktop's font (Fira Sans, from GTK): a browser's own
// stylesheet gives form controls the system font, not the page's. Playwright's
// Firefox reads the generic `sans-serif` there, so 39 of his 158 verdict
// hashes of 2026-09-14 differed from the ones the tools read.
//
// The browser's default is forced here as the lowest author layer: declared
// before the package's `@layer kp.base, …` statement, it loses to every
// package rule and wins over nothing but the browser's own stylesheet — the
// place a desktop font lives. A control the package gives a font ignores it;
// one it leaves unset shows it.
//
// Red run first, on 15f391e6 in firefox: button--icons moved in formal and
// nostromo (the icon button read "DejaVu Serif"), and the sweep named
// .kp-icon-button, .kp-nav__toggle, .kp-sidenav__toggle, .kp-field__check,
// .kp-switch__input, the colour picker's ranges and the upload's file input.

import { test, expect } from '@playwright/test';
import { IN_PAGE, blockPages } from '../gates/verdict-hashes.mjs';

test.describe.configure({ timeout: 180_000 });

const FORCED = 'DejaVu Serif';

/** Declare the forced default as the first layer of the page. @param {import('@playwright/test').Page} page */
const forceDesktopFont = (page) =>
    page.evaluate((family) => {
        const style = document.createElement('style');
        style.id = 'kp-desktop-default';
        style.textContent = `@layer kp-desktop-default { button, input, select, textarea { font-family: "${family}"; } }`;
        document.head.prepend(style);
    }, FORCED);

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} base
 * @param {string[]} themes
 * @param {string[]} only
 */
const hashes = async (page, base, themes, only) => {
    const reading = await page.evaluate(IN_PAGE, { base, themes, only });
    return Object.fromEntries(themes.map((theme) => [theme, reading.results[theme].map((row) => `${row.key} ${row.hash}`)]));
};

test(
    'a forced desktop font does not move button--icons in formal and nostromo [fix-28]',
    { tag: ['@component:button', '@component:catalogue'] },
    async ({ page, baseURL }) => {
        const base = `${baseURL}/`;
        const themes = ['formal', 'nostromo'];
        await page.setViewportSize({ width: 1920, height: 1000 });
        await page.goto('/catalogue/button.html');
        const plain = await hashes(page, base, themes, ['button--icons']);
        await forceDesktopFont(page);
        const families = await page.evaluate(() =>
            [...document.querySelectorAll('#icons .cat-stage :is(button, input, select, textarea)')].map(
                (el) => `${el.className}: ${getComputedStyle(el).fontFamily}`,
            ),
        );
        expect(await hashes(page, base, themes, ['button--icons'])).toEqual(plain);
        expect(families.filter((line) => line.includes(FORCED))).toEqual([]);
    },
);

test(
    'no control on a review page takes the browser default font [fix-28]',
    { tag: ['@sweep', '@component:catalogue'] },
    async ({ page, baseURL }) => {
        const root = new URL('../', import.meta.url).pathname;
        await page.setViewportSize({ width: 1400, height: 1000 });
        const unset = new Set();
        for (const { href } of await blockPages(root)) {
            await page.goto(new URL(href, `${baseURL}/`).href, { waitUntil: 'load' });
            await forceDesktopFont(page);
            for (const theme of ['formal', 'nostromo']) {
                const found = await page.evaluate(
                    async ([name, family]) => {
                        document.documentElement.setAttribute('data-theme', name);
                        await new Promise((resolve) => setTimeout(resolve, 100));
                        return (
                            [
                                ...document.querySelectorAll(
                                    '.cat-stage :is(button, input, select, textarea), main section[id] :is(button, input, select, textarea)',
                                ),
                            ]
                                .filter((el) => !el.closest('.cat-judge, .cat-approval, .cat-feedback-field, .cat-look'))
                                // A research demo's own mock controls are the demo's, not the package's.
                                .filter((el) => !/(^|\s)demo-/.test(el.closest('[class]')?.className ?? ''))
                                .filter((el) => getComputedStyle(el).fontFamily.includes(family))
                                .map(
                                    (el) =>
                                        `${el.localName}${el instanceof HTMLInputElement ? `[type=${el.type}]` : ''}.${[...el.classList].join('.')}`,
                                )
                        );
                    },
                    [theme, FORCED],
                );
                for (const control of found) unset.add(`${href} · ${theme} · ${control}`);
            }
        }
        expect([...unset]).toEqual([]);
    },
);
