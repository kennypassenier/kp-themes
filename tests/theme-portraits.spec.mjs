// The theme portraits [scope-97]: a page per theme that shows what makes the
// theme itself, generated from themes/<theme>/signature.json.
//
// Kenny, 2026-09-15: "Is het mogelijk om de essentie van een thema … duidelijk
// te showcasen, met een pagina voor elk thema?" The pilot is cyberpunk, formal
// and pastel. What a reviewer cannot see by looking is held here: the page
// loads clean and carries the nine sections as judged blocks in order, a
// colour swatch is the token it names and not a colour typed near it, every
// replay really starts an animation of the stylesheets' own and nothing starts
// once reduced motion is on, and the signature cannot cite a selector, a
// keyframe or a token its files do not have.
//
// Made to fail first [KT3], 2026-09-15, firefox: with the reduced-motion
// switch's guard rewrite removed from research/theme-portraits/portrait.js
// (applyGuards made a no-op), "nothing starts under reduced motion" went red
// in all three themes on hover, press and attention; with a swatch rule
// pointed at `--card` instead of its token, the swatch test went red naming
// the role; with a selector in cyberpunk's signature misspelt, the proof test
// named it.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { proofProblems, readSchema, readSignature, validate } from '../gates/signature.mjs';

const SECTIONS = ['idea', 'colour', 'type', 'shape', 'surfaces', 'motion', 'ornaments', 'voice', 'recipe'];
const VERBS = ['enter', 'leave', 'press', 'hover', 'load', 'attention'];
const PILOT = ['cyberpunk', 'formal', 'pastel'];

/**
 * Press a verb's replay and count what starts under its live copy: CSS
 * transitions and animations by their events, armed before the press
 * [fix-1], and anything still running by getAnimations.
 * @param {import('@playwright/test').Page} page
 * @param {string} verb
 */
async function replay(page, verb) {
    await page.evaluate((name) => {
        const box = document.querySelector(`.pt-live[data-pt-verb='${name}']`);
        const seen = { events: 0, running: 0 };
        Object.assign(window, { ptSeen: seen });
        for (const type of ['transitionrun', 'animationstart']) box?.addEventListener(type, () => seen.events++);
        const poll = setInterval(() => {
            seen.running = Math.max(seen.running, box?.getAnimations({ subtree: true }).length ?? 0);
        }, 50);
        setTimeout(() => clearInterval(poll), 3200);
    }, verb);
    await page.locator(`.pt-live[data-pt-verb='${verb}'] [data-pt-replay]`).click();
    await page.waitForTimeout(3300);
    return page.evaluate(() => /** @type {any} */ (window).ptSeen);
}

for (const theme of PILOT) {
    test.describe(`the ${theme} portrait [scope-97]`, { tag: ['@component:catalogue', `@theme:${theme}`] }, () => {
        const signature = readSignature(theme);

        test.beforeEach(async ({ context }) => {
            await useEmptyRegister(context);
        });

        test('loads without a console error, fixed to its theme, with the nine sections in order, each judged', async ({ page }) => {
            /** @type {string[]} */
            const errors = [];
            page.on('console', (message) => {
                if (message.type() === 'error') errors.push(message.text());
            });
            page.on('pageerror', (error) => errors.push(error.message));
            await page.goto(`/research/theme-portraits/${theme}.html`);
            await waitForJudging(page);
            await page.waitForFunction(() => document.documentElement.hasAttribute('data-pt-ready'));
            expect(errors).toEqual([]);
            expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(theme);
            await expect(page.locator('#cat-theme-menu')).toHaveCount(0);
            const ids = await page.locator('main > .cat-block').evaluateAll((blocks) => blocks.map((b) => b.id));
            expect(ids).toEqual(SECTIONS);
            for (const id of SECTIONS) {
                await expect(page.locator(`#${id} > .cat-look`)).toHaveCount(1);
                await expect(page.locator(`#${id} > .cat-stage`)).toHaveCount(1);
                await expect(page.locator(`#${id} .cat-judge [data-cat-approval-state]`)).toHaveCount(1);
            }
        });

        test('a theme stored from another page does not move it', async ({ page }) => {
            await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
            await page.goto(`/research/theme-portraits/${theme}.html`);
            await waitForJudging(page);
            expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(theme);
        });

        test('every colour role swatch is the computed value of its token', async ({ page }) => {
            await page.goto(`/research/theme-portraits/${theme}.html`);
            await waitForJudging(page);
            const readings = await page.evaluate(
                (tokens) => {
                    return tokens.map((token) => {
                        const swatch = document.querySelector(`#colour .pt-swatch[data-pt-token='${token}']`);
                        const probe = document.createElement('div');
                        probe.style.backgroundColor = `var(--${token})`;
                        document.querySelector('#colour .cat-stage')?.append(probe);
                        const wanted = getComputedStyle(probe).backgroundColor;
                        probe.remove();
                        return { token, swatch: swatch ? getComputedStyle(swatch).backgroundColor : null, wanted };
                    });
                },
                signature.colourRoles.map((/** @type {any} */ r) => r.token),
            );
            expect(readings.length).toBe(signature.colourRoles.length);
            for (const { token, swatch, wanted } of readings) {
                expect(swatch, `--${token}`).toBe(wanted);
                expect(wanted, `--${token} resolves to a colour`).not.toBe('rgba(0, 0, 0, 0)');
            }
        });

        test('every replay starts an animation of the stylesheets, and none once reduced motion is on', async ({ page }) => {
            test.slow();
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            await page.goto(`/research/theme-portraits/${theme}.html`);
            await waitForJudging(page);
            await page.waitForFunction(() => document.documentElement.hasAttribute('data-pt-ready'));
            const replayable = VERBS.filter((verb) => signature.motion.verbs[verb].demo);
            expect(replayable.length).toBeGreaterThanOrEqual(5);
            for (const verb of replayable) {
                const seen = await replay(page, verb);
                expect(seen.events + seen.running, `${verb} starts something`).toBeGreaterThan(0);
            }
            await page.locator('[data-pt-reduce]').click();
            await expect(page.locator('[data-pt-reduce]')).toHaveAttribute('aria-pressed', 'true');
            for (const verb of replayable) {
                const seen = await replay(page, verb);
                expect(seen, `${verb} under reduced motion`).toEqual({ events: 0, running: 0 });
            }
        });

        test('with the system asking for less motion the switch starts on and nothing replays', async ({ page }) => {
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.goto(`/research/theme-portraits/${theme}.html`);
            await waitForJudging(page);
            await page.waitForFunction(() => document.documentElement.hasAttribute('data-pt-ready'));
            await expect(page.locator('[data-pt-reduce]')).toHaveAttribute('aria-pressed', 'true');
            const seen = await replay(page, 'hover');
            expect(seen).toEqual({ events: 0, running: 0 });
        });

        test('the signature validates, and everything it cites exists in its stylesheet or tokens', () => {
            expect(validate(signature, readSchema())).toEqual([]);
            expect(proofProblems(signature)).toEqual([]);
            // The register named for each verb that is answered is this theme's own or the package's.
            const cited = JSON.stringify(signature);
            expect(cited).toContain(`css/${theme}-register.css`);
            expect(readFileSync(new URL(`../research/theme-portraits/${theme}.html`, import.meta.url), 'utf8')).toContain(
                `themes/${theme}/signature.json`,
            );
        });
    });
}
