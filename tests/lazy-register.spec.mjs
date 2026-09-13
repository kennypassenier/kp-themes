// The lazily fetched register [scope-50], driven in a real browser.
//
// tests/fixtures/lazy-register.html links the shared stylesheets and no
// register: the no-flash snippet writes the first one below themes.css,
// and js/lazy-register.js fetches every one after it. What is asserted is
// what a visitor gets — how many register files crossed the network, what
// the page paints while one is on its way, which cascade layer it lands
// in, and whether a stored theme is there at the first paint.
//
// Registers are counted twice, and neither count is a route: measured
// while drilling the first test red, Firefox answers a second <link> to a
// URL the document already loaded from its own stylesheet cache — no
// request reaches a route, and the resource log records it only sometimes.
// So a load is counted in the resource log (what crossed the network) AND
// as a register stylesheet in the document (what a duplicate insert adds
// even when the cache answers it). The route is there only to hold one
// register back while the page is read.
//
// Firefox only, per the brief of scope-50. Every assertion was driven red
// first; the comment line above each test says what was removed to do it.

import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { noFlashSnippet } from '../js/no-flash.js';

const PAGE = '/tests/fixtures/lazy-register.html';
const REGISTER = /\/css\/([a-z-]+)-register\.css$/;

/**
 * Hold one register's request back until the test lets it through.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{ hold: string }} options
 */
async function holdRegister(page, { hold }) {
    /** @type {() => void} */
    let release = () => {};
    const released = new Promise((resolve) => (release = () => resolve(undefined)));
    /** @type {() => void} */
    let arrived = () => {};
    const requested = new Promise((resolve) => (arrived = () => resolve(undefined)));
    await page.route(REGISTER, async (route) => {
        const theme = new URL(route.request().url()).pathname.match(REGISTER)?.[1] ?? '';
        if (theme === hold) {
            arrived();
            await released;
        }
        await route.continue();
    });
    return { release, requested };
}

/**
 * The registers the page loaded: the resource log's entries, and the
 * register stylesheets in the document, each in order. A load answered
 * from the document's cache can be logged after `networkidle` resolved, so
 * the log is given a moment to catch up with the links before it is read;
 * either list with a register too many is the regression.
 *
 * @param {import('@playwright/test').Page} page
 */
const registersLoaded = async (page) => {
    /** @param {string} source */
    const read = (source) => {
        const register = new RegExp(source);
        const theme = (/** @type {string} */ url) => new URL(url).pathname.match(register)?.[1];
        return {
            logged: performance
                .getEntriesByType('resource')
                .map((e) => theme(e.name))
                .filter(Boolean),
            linked: [...document.querySelectorAll('link[rel~="stylesheet"]')]
                .map((l) => theme(/** @type {HTMLLinkElement} */ (l).href))
                .filter(Boolean),
        };
    };
    for (let tries = 0; tries < 30; tries++) {
        const { logged, linked } = await page.evaluate(read, REGISTER.source);
        if (logged.length >= linked.length) break;
        await page.waitForTimeout(100);
    }
    return page.evaluate(read, REGISTER.source);
};

/** @param {string[]} themes */
const both = (themes) => ({ logged: themes, linked: themes });

/** The page has attached its modules and the picker exists. @param {import('@playwright/test').Page} page */
const ready = (page) => page.waitForSelector('html[data-fixture-ready] #picker [data-kp-theme="cyberpunk"]', { state: 'attached' });

/** What `--background` paints under `theme`, measured on an element wearing that theme's token block. @param {import('@playwright/test').Page} page @param {string} theme */
const backgroundOf = (page, theme) =>
    page.evaluate((name) => {
        const probe = document.createElement('div');
        probe.setAttribute('data-theme', name);
        probe.style.setProperty('background-color', 'var(--background)');
        document.body.append(probe);
        const value = getComputedStyle(probe).backgroundColor;
        probe.remove();
        return value;
    }, theme);

/** The body's painted background, read until it is the value [KT16]. @param {import('@playwright/test').Page} page */
const bodyBackground = (page) => expect.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor));

/** Raw and gzip bytes of the stylesheets a page fetched, from the files the server sent. @param {string[]} paths */
function bytes(paths) {
    let raw = 0;
    let gz = 0;
    for (const path of paths) {
        const source = readFileSync(new URL(`..${path}`, import.meta.url));
        raw += source.length;
        gz += gzipSync(source).length;
    }
    return { files: paths.length, raw, gz };
}

/** The same-origin stylesheets in the page's resource log, as paths. @param {import('@playwright/test').Page} page */
const stylesheetsFetched = (page) =>
    page.evaluate(() =>
        performance
            .getEntriesByType('resource')
            .map((e) => new URL(e.name).pathname)
            .filter((p) => p.endsWith('.css')),
    );

test.describe('lazy register', () => {
    test.skip(({ browserName }) => browserName !== 'firefox', 'firefox only [scope-50]');

    // Red first: registerLink() made to return null, so the module did not adopt the snippet's link — a second formal register in the document.
    test('a first load fetches exactly one register, the snippet’s', async ({ page }) => {
        await page.goto(PAGE);
        await ready(page);
        await page.waitForLoadState('networkidle');
        expect(await registersLoaded(page)).toEqual(both(['formal']));

        // The measurement the report quotes: what this page's first load and one switch cost in CSS.
        const first = bytes(await stylesheetsFetched(page));
        await page.click('#picker [data-kp-theme="cyberpunk"]');
        await bodyBackground(page).toBe(await backgroundOf(page, 'cyberpunk'));
        const after = bytes(await stylesheetsFetched(page));
        console.log(`MEASURE lazy-register.html first load ${JSON.stringify(first)}; after one switch ${JSON.stringify(after)}`);
    });

    // Red first: `e.preventDefault()` removed from the hold in attachLazyRegisters — the root flipped while the file was held back.
    test('a switch fetches exactly one more register, and the root keeps the old theme until it has arrived', async ({ page }) => {
        const net = await holdRegister(page, { hold: 'cyberpunk' });
        await page.goto(PAGE);
        await ready(page);
        const formal = await backgroundOf(page, 'formal');
        const cyberpunk = await backgroundOf(page, 'cyberpunk');
        expect(formal).not.toBe(cyberpunk);
        await bodyBackground(page).toBe(formal);

        await page.click('#picker [data-kp-theme="cyberpunk"]');
        await net.requested;
        // The file is on its way and held there: two frames later the page must still paint formal.
        await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(formal);

        net.release();
        await bodyBackground(page).toBe(cyberpunk);
        expect(await registersLoaded(page)).toEqual(both(['formal', 'cyberpunk']));
    });

    // Red first: `if (known) return known;` and the adoption of an existing link removed from ensureRegister — formal and cyberpunk inserted again on every switch.
    test('switching back fetches nothing', async ({ page }) => {
        await page.goto(PAGE);
        await ready(page);
        const formal = await backgroundOf(page, 'formal');
        const cyberpunk = await backgroundOf(page, 'cyberpunk');

        await page.click('#picker [data-kp-theme="cyberpunk"]');
        await bodyBackground(page).toBe(cyberpunk);
        await page.click('#picker [data-kp-theme="formal"]');
        await bodyBackground(page).toBe(formal);
        await page.click('#picker [data-kp-theme="cyberpunk"]');
        await bodyBackground(page).toBe(cyberpunk);
        await page.waitForLoadState('networkidle');
        expect(await registersLoaded(page)).toEqual(both(['formal', 'cyberpunk']));
    });

    // Red first: ensureRegister inserted its link with `doc.head.prepend(link)`, above css/themes.css — the components probe then beat the register.
    test('a lazily inserted register lands in kp.register: it beats kp.components and loses to kp.layout', async ({ page }) => {
        await page.goto(PAGE);
        await ready(page);
        await page.click('#picker [data-kp-theme="cyberpunk"]');
        await bodyBackground(page).toBe(await backgroundOf(page, 'cyberpunk'));

        const spacing = (/** @type {string} */ id) =>
            page.evaluate((el) => getComputedStyle(/** @type {Element} */ (document.getElementById(el))).letterSpacing, id);
        // The register's own value, on a button no probe rule touches.
        await expect.poll(() => spacing('probe-plain')).not.toBe('normal');
        const registerValue = await spacing('probe-plain');
        expect(registerValue).not.toBe('3px');
        await expect.poll(() => spacing('probe-layout'), 'a kp.layout rule must beat the register').toBe('3px');
        await expect.poll(() => spacing('probe-components'), 'a kp.components rule must lose to the register').toBe(registerValue);

        // And the layer by name, read from the sheet the module inserted.
        const layer = await page.evaluate(() => {
            const link = /** @type {HTMLLinkElement | null} */ (document.querySelector('link[data-kp-register="cyberpunk"]'));
            const rule = link?.sheet?.cssRules[0];
            return rule instanceof CSSLayerBlockRule ? rule.name : null;
        });
        expect(layer).toBe('kp.register');
    });

    // Red first, twice, each in js/no-flash.js and the fixture's copy alike: the stored theme's `setAttribute` removed (the first paint was formal's
    // background), then the `document.write` removed (the first paint had cyberpunk's tokens and no register).
    test('a stored theme is honoured by the no-flash snippet without a flash', async ({ page }) => {
        // The fixture carries the generator's output, not a hand-kept copy of it.
        expect(readFileSync(new URL(`..${PAGE}`, import.meta.url), 'utf8')).toContain(noFlashSnippet({ register: true }));

        await page.goto(PAGE);
        await ready(page);
        const cyberpunk = await backgroundOf(page, 'cyberpunk');
        await page.evaluate(() => localStorage.setItem('theme', 'cyberpunk'));

        await page.goto(PAGE);
        const first = await page.evaluate(() => /** @type {any} */ (window).__firstPaint);
        // Before any module ran: the stored theme's tokens AND its register.
        expect(first).toEqual({ background: cyberpunk, register: 'uppercase' });
        await ready(page);
        await page.waitForLoadState('networkidle');
        // After load: the same paint, and still exactly one register.
        await bodyBackground(page).toBe(first.background);
        await expect
            .poll(() => page.evaluate(() => getComputedStyle(/** @type {Element} */ (document.getElementById('probe-plain'))).textTransform))
            .toBe('uppercase');
        expect(await registersLoaded(page)).toEqual(both(['cyberpunk']));
    });

    // Red first: the picker's `pendingTheme() ?? applied` put back to `applied` — the held choice stored formal, and the reload painted formal.
    test('a choice held for its register is the one remembered', async ({ page }) => {
        const net = await holdRegister(page, { hold: 'cyberpunk' });
        await page.goto(PAGE);
        await ready(page);
        const cyberpunk = await backgroundOf(page, 'cyberpunk');
        await page.click('#picker [data-kp-theme="cyberpunk"]');
        await net.requested;
        net.release();
        await bodyBackground(page).toBe(cyberpunk);

        await page.reload();
        expect(await page.evaluate(() => /** @type {any} */ (window).__firstPaint.background)).toBe(cyberpunk);
    });
});
