// The log line, and the colour a name carries [gap-14, gap-15].
//
// Three promises, one test each: the columns do not move, the level is a
// word before it is a colour, and a name takes the same chart colour here
// as it does in a terminal.

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { sourceIndex } from '../js/log.js';

const THEME_NAMES = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));

/** @param {import('@playwright/test').Page} page @param {string} theme */
const wear = async (page, theme) => {
    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(theme);
};

/** @param {import('@playwright/test').Page} page @param {string} url */
const open = async (page, url) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await useEmptyRegister(page.context());
    await page.goto(url);
    await waitForJudging(page);
};

test(
    'the four columns of a log do not move, in every theme [gap-14, fix-64]',
    { tag: ['@component:data', '@sweep', '@component:catalogue'] },
    async ({ page }) => {
        await open(page, '/catalogue/data.html');
        const ragged = [];
        for (const theme of THEME_NAMES) {
            await wear(page, theme);
            const lefts = await page
                .locator('#log .kp-log')
                .first()
                .evaluate((list) => {
                    const read = (selector) => [...list.querySelectorAll(selector)].map((el) => Math.round(el.getBoundingClientRect().left));
                    return {
                        time: read('.kp-log__time'),
                        source: read('.kp-log__source'),
                        level: read('.kp-log__level'),
                        message: read('.kp-log__message'),
                    };
                });
            for (const [part, xs] of Object.entries(lefts)) {
                if (new Set(xs).size !== 1) ragged.push(`${theme}: ${part} at ${[...new Set(xs)].join('/')}`);
            }
        }
        expect(ragged).toEqual([]);
    },
);

test(
    'a log read without colour still says which line failed [gap-14, fix-1]',
    { tag: ['@component:data', '@component:catalogue'] },
    async ({ page }) => {
        await open(page, '/catalogue/data.html');
        // The level of every line, as text: the second carrier, in its own
        // column, before any ink is asked to do the work.
        const levels = await page
            .locator('#log .kp-log')
            .first()
            .evaluate((list) =>
                [...list.querySelectorAll('.kp-log__line')].map((line) => ({
                    severity: line.getAttribute('data-kp-severity'),
                    word: line.querySelector('.kp-log__level')?.textContent?.trim().toLowerCase() ?? '',
                })),
            );
        expect(levels.length).toBeGreaterThan(3);
        for (const { severity, word } of levels) expect(word).toBe(severity);
    },
);

test(
    'a source name takes the same chart colour as it does in a terminal [gap-15]',
    { tag: ['@component:data', '@component:catalogue'] },
    async ({ page }) => {
        // Measured from kp-tui itself on 2026-09-20 (`source_colour` against
        // formal's palette, one line per name). The two implementations hash
        // the same way or this table is wrong in one of them.
        const FROM_KP_TUI = { media: 3, web: 1, backup: 5, monitoring: 4, dns: 5, host: 1, caddy: 2, restic: 5 };
        for (const [name, index] of Object.entries(FROM_KP_TUI)) expect(sourceIndex(name), name).toBe(index);

        await open(page, '/catalogue/data.html');
        // And on the page: the script writes the property, and the property
        // names the register's own colour rather than a colour of its own.
        const written = await page
            .locator('#log .kp-log__source')
            .first()
            .evaluate((el) => ({
                name: el.getAttribute('data-kp-source'),
                property: el.style.getPropertyValue('--kp-source-colour'),
                painted: getComputedStyle(el).color,
            }));
        expect(written.property).toBe(`var(--chart-${FROM_KP_TUI[written.name]})`);
        const chart = await page.evaluate(
            (n) => getComputedStyle(document.documentElement).getPropertyValue(`--chart-${n}`).trim(),
            FROM_KP_TUI[written.name],
        );
        const asColour = await page.evaluate((value) => {
            const probe = document.createElement('span');
            probe.style.color = value;
            document.body.append(probe);
            const read = getComputedStyle(probe).color;
            probe.remove();
            return read;
        }, chart);
        expect(written.painted).toBe(asColour);
    },
);
