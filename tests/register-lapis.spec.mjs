// The lapis register [S48, LIFT_PLAN row 6]: the approved concept demo
// "Lapis and Leaf" (2026-09-08) reproduced by the package, measured on the
// concept page under lapis in both channels.
//
// What the demo showed and this suite holds: the headline burnishing in
// with one gold clip-path wipe and landing flat gold, the lede's marks
// standing in ivory and then inscribed — ink to gold, an underline drawn
// in — once and staggered, the rule drawing in under a heading, the
// navbar's double-stroke ruling and its dropdown, the buttons (the plain
// ring, the filled gold plate, the mirror gloss), the dossier's seal
// covering its redactions until the trigger clears them on a stagger, and
// the whole approved inventory on the page. The two ruled dividers and the
// girih tile on the hero and app surfaces are judged by eye on the
// catalogue since scope-73 (page-effects#dividers, page-effects#surfaces).
//
// Drills [KT3], performed 2026-09-08 in chromium, repeated the same
// day in firefox (each one red on the test it names, then restored green
// in both browsers) [G13]:
//   - `color: var(--primary)` removed from `[data-kp-reveal='headline']`'s
//     rest rule → the landed headline paints in the inherited h1 colour
//     (ivory), not gold, red on "the headline stands covered before the
//     burnish runs, and lands flat gold";
//   - `--fx-texture-opacity: 0` removed from the root block → the old
//     page-wide girih texture from css/_rules.css shows through again
//     (0.05, not 0), red on "the old page-wide texture stays off";
//   - `background: var(--sidebar-background); color: transparent;`
//     removed from `.kp-card[data-kp-reveal='emphasis'] mark` → the
//     dossier's redacted phrases read transparent-background (the base
//     layer's plain `mark` rule shows through) before the trigger is
//     pressed, red on "the seal covers the redactions before the
//     trigger".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { style } from './paint.mjs';
import { tabToSelector } from './ring.mjs';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-lapis.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=lapis'],
];

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 * @param {{ reduced?: boolean }} [options]
 */
async function open(page, url, { reduced = false } = {}) {
    await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
    await page.addInitScript(() => {
        try {
            localStorage.setItem('theme', 'lapis');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'lapis');
    await expect(page.locator('[data-kp-surface="app"]').first()).toBeVisible();
}

/** @param {import('@playwright/test').Locator} locator @param {string} pseudo @param {string[]} props */
const pseudo = (locator, pseudo, props) =>
    locator.evaluate(
        (el, [p, names]) => {
            const style = getComputedStyle(el, p);
            return Object.fromEntries(names.map((n) => [n, style.getPropertyValue(n)]));
        },
        [pseudo, props],
    );

/** @param {import('@playwright/test').Page} page */
const settled = (page) =>
    page.evaluate(() =>
        Promise.all(
            document
                .getAnimations()
                .filter((a) => a.effect?.getTiming().iterations !== Infinity)
                .map((a) => a.finished.catch(() => {})),
        ),
    );

/** The computed value of a token, as the browser would paint it. */
const paint = (/** @type {import('@playwright/test').Page} */ page, /** @type {string} */ token) =>
    page.evaluate((t) => {
        const s = document.createElement('span');
        s.style.color = getComputedStyle(document.documentElement).getPropertyValue(t).trim();
        document.body.append(s);
        const v = getComputedStyle(s).color;
        s.remove();
        return v;
    }, token);

for (const [channel, url] of CHANNELS) {
    test.describe(`the lapis register, ${channel}`, { tag: ['@theme:lapis', '@component:page-effects', '@component:examples'] }, () => {
        test('under reduced motion there is no wipe, no page-wide texture, and every reveal is at rest', async ({ page }) => {
            await open(page, url, { reduced: true });
            await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveClass(/is-deciphered/);
            expect(await page.locator('[data-kp-surface="hero"] mark:not(.is-cleared)').count()).toBe(0);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await expect(rule).toHaveClass(/is-in/);
            const texture = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--fx-texture-opacity').trim());
            expect(texture, 'the old page-wide texture stays off').toBe('0');
        });

        test('the headline stands covered before the burnish runs, and lands flat gold as its own text [S49]', async ({ page }) => {
            await page.addInitScript(() => {
                window.kpClip = [];
                new MutationObserver(() => {
                    const h = document.querySelector('[data-kp-reveal="headline"]');
                    if (h && document.documentElement.hasAttribute('data-kp-effects') && !h.classList.contains('is-deciphered')) {
                        window.kpClip.push(getComputedStyle(h).clipPath);
                    }
                }).observe(document, { subtree: true, childList: true, attributes: true });
            });
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 15000 });
            await settled(page);
            expect(await h1.textContent()).toBe(source);
            expect(await h1.evaluate((el) => getComputedStyle(el).clipPath), 'uncut at rest').toBe('none');
            expect(await h1.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--primary'));
            const clipped = await page.evaluate(() => window.kpClip);
            expect(
                clipped.some((c) => /inset\(0px 100%/.test(c)),
                'the headline stood fully covered before the wipe opened it',
            ).toBe(true);
        });

        test('the lede marks are the inscription: ivory with no rule, then gold ink and a gold underline, once [TH120]', async ({ page }) => {
            await open(page, url);
            const mark = page.locator('[data-kp-surface="hero"] mark').first();
            await expect(mark).toHaveClass(/is-cleared/, { timeout: 15000 });
            await settled(page);
            expect(await mark.evaluate((el) => getComputedStyle(el).color), 'ink shifts to gold').toBe(await paint(page, '--primary'));
            const border = await mark.evaluate((el) => getComputedStyle(el).borderBottomColor);
            expect(border, 'the underline draws in gold').toBe(await paint(page, '--primary'));
        });

        test('the rule draws in under a heading when it enters the viewport [TH122]', async ({ page }) => {
            await open(page, url);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            const ruling = await pseudo(rule, '::after', ['background-color', 'animation-name']);
            expect(ruling['animation-name']).toBe('kp-rule-in');
            expect(ruling['background-color']).toBe(await paint(page, '--border-strong'));
            await settled(page);
            await expect.poll(async () => (await pseudo(rule, '::after', ['transform'])).transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the navbar: the double-stroke ruling, the dropdown, and the call to action is a filled gold plate', async ({ page }) => {
            await open(page, url);
            const wrap = page.locator('.kp-nav-wrap');
            expect(await wrap.evaluate((el) => getComputedStyle(el).borderBottomColor)).toBe(await paint(page, '--border-strong'));
            expect(await wrap.evaluate((el) => getComputedStyle(el).boxShadow), 'a second, offset hairline').toBe(
                `${await paint(page, '--border')} 0px 3px 0px -2px`,
            );
            const link = page.locator('.kp-nav__link').nth(1);
            await link.hover();
            await expect.poll(() => link.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--primary'));
            const cta = page.locator('.kp-nav__link--cta').first();
            expect(await cta.evaluate((el) => getComputedStyle(el).backgroundColor), 'the filled gold plate').toBe(await paint(page, '--primary'));
            // Reached with the keyboard, not focus() [G15].
            await tabToSelector(page, '.kp-nav__link[aria-haspopup]');
            const menu = page.locator('.kp-nav__menu').first();
            await expect(menu).toBeVisible();
            await style(menu, 'background-color').toBe(await paint(page, '--popover'));
        });

        test('the dossier: the seal covers the redactions before the trigger, and clears on a stagger', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const mark = dossier.locator('mark').first();
            const covered = await mark.evaluate((el) => ({ bg: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color }));
            expect(covered.bg, 'the seal, a solid void plate').toBe(await paint(page, '--sidebar-background'));
            expect(covered.color, 'the redacted phrase reads no ink').toBe('rgba(0, 0, 0, 0)');
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(mark).toHaveClass(/is-cleared/);
            await settled(page);
            await style(mark, 'background-color', 'the seal lifted').toBe('rgba(0, 0, 0, 0)');
        });

        test('the approved inventory is whole on the page [S46]', async ({ page }) => {
            await open(page, url);
            const html = (await page.content()).replace(/=""/g, '');
            for (const { what, marker } of INVENTORY) {
                if (channel === 'React' && /theme-picker|theme-status/.test(marker)) continue;
                expect(html, `the page lacks ${what}`).toContain(marker);
            }
        });
    });
}

// The measured faults of scope-100 (Kenny, 2026-09-16, register-faults): the
// dossier's seal without JavaScript, the buttons' transitions, the disabled
// button answering the pointer. The stamp is held in
// tests/stamp-cards.spec.mjs. Each was made to fail first [KT3], 2026-09-16,
// firefox, on c9f58c08's register; the reading before sits above each test.

/** The WCAG contrast of an element's text against the ground painted under it. */
const textContrast = (/** @type {import('@playwright/test').Locator} */ locator) =>
    locator.evaluate((el) => {
        /** @param {string} c */
        const rgba = (c) => {
            const m = c.match(/[\d.]+/g) ?? ['0', '0', '0', '0'];
            return { r: +m[0], g: +m[1], b: +m[2], a: m[3] === undefined ? 1 : +m[3] };
        };
        /** @param {{r:number,g:number,b:number,a:number}} top @param {{r:number,g:number,b:number,a:number}} under */
        const over = (top, under) => ({
            r: top.r * top.a + under.r * (1 - top.a),
            g: top.g * top.a + under.g * (1 - top.a),
            b: top.b * top.a + under.b * (1 - top.a),
            a: 1,
        });
        // The ground: every background colour from the root down to the element, composited.
        const chain = [];
        for (let n = /** @type {Element | null} */ (el); n; n = n.parentElement) chain.unshift(rgba(getComputedStyle(n).backgroundColor));
        let ground = { r: 255, g: 255, b: 255, a: 1 };
        for (const layer of chain) ground = over(layer, ground);
        const ink = over(rgba(getComputedStyle(el).color), ground);
        /** @param {{r:number,g:number,b:number}} c */
        const lum = (c) =>
            [c.r, c.g, c.b]
                .map((v) => v / 255)
                .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
                .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
        const [hi, lo] = [lum(ink), lum(ground)].sort((a, b) => b - a);
        return (hi + 0.05) / (lo + 0.05);
    });

test.describe('the lapis register, measured faults [scope-100]', { tag: ['@theme:lapis', '@component:page-effects', '@component:button'] }, () => {
    test.describe('without JavaScript', () => {
        test.use({ javaScriptEnabled: false });

        // Before: every dossier mark 1.00:1, its ink transparent on the void plate.
        test('the dossier’s sealed phrases read at rest [scope-100]', async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            await page.goto('/examples/concept-lapis.html');
            expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('lapis');
            expect(await page.evaluate(() => document.documentElement.hasAttribute('data-kp-effects')), 'no script ran').toBe(false);
            const marks = page.locator('.kp-card[data-kp-reveal="emphasis"] mark');
            const count = await marks.count();
            expect(count).toBeGreaterThan(0);
            for (let i = 0; i < count; i++) {
                expect(await textContrast(marks.nth(i)), `dossier mark ${i}`).toBeGreaterThanOrEqual(4.5);
            }
        });
    });

    // Before: no value between rest and hover — the plate changed in one frame.
    test('a button’s plate eases into its hover, as the package’s transition does [scope-100]', async ({ page }) => {
        await open(page, '/examples/concept-lapis.html');
        const button = page.locator('button.kp-button--primary[type="submit"]').first();
        await button.scrollIntoViewIfNeeded();
        await page.mouse.move(2, 2);
        await settled(page);
        await page.waitForTimeout(500);
        const box = /** @type {{x:number,y:number,width:number,height:number}} */ (await button.boundingBox());
        await button.evaluate((el) => {
            const w = /** @type {any} */ (window);
            w.kpSamples = [];
            const rest = getComputedStyle(el).backgroundColor;
            const start = performance.now();
            const tick = () => {
                const t = performance.now() - start;
                w.kpSamples.push({ t, bg: getComputedStyle(el).backgroundColor, rest });
                if (t < 1200) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await expect.poll(() => page.evaluate(() => /** @type {any} */ (window).kpSamples.at(-1).t)).toBeGreaterThanOrEqual(1200);
        const samples = /** @type {{t:number,bg:string,rest:string}[]} */ (await page.evaluate(() => /** @type {any} */ (window).kpSamples));
        const rest = samples[0].rest;
        const end = samples.at(-1)?.bg;
        expect(end, 'the hover changes the plate').not.toBe(rest);
        const first = samples.find((s) => s.bg !== rest);
        const between = new Set(samples.filter((s) => first && s.t <= first.t + 200 && s.bg !== rest && s.bg !== end).map((s) => s.bg));
        expect(between.size, `values between ${rest} and ${end} within 200ms`).toBeGreaterThanOrEqual(3);
    });

    // Before: the plain disabled button's ink 242,233,212 → 213,165,42 on hover.
    test('a disabled button does not answer the pointer [scope-100]', async ({ page }) => {
        await open(page, '/examples/concept-lapis.html');
        await page.evaluate(() => {
            const holder = document.createElement('div');
            holder.setAttribute('data-probe-disabled', '');
            holder.style.cssText = 'display:flex;gap:2rem;padding:3rem;';
            holder.innerHTML = ['', ' kp-button--primary', ' kp-button--ghost', ' kp-button--destructive', ' kp-button--mirror']
                .map(
                    (m) =>
                        `<button type="button" class="kp-button${m}" disabled><span class="kp-button__edge" aria-hidden="true"></span><span class="kp-button__label">Filed</span></button>`,
                )
                .join('');
            document.querySelector('[data-kp-surface="app"]')?.prepend(holder);
        });
        const buttons = page.locator('[data-probe-disabled] .kp-button');
        const read = (/** @type {import('@playwright/test').Locator} */ b) =>
            b.evaluate((el) => {
                const props = ['color', 'background-color', 'border-top-color', 'box-shadow', 'translate'];
                /** @param {Element} e @param {string} [p] */
                const of = (e, p) => props.map((n) => getComputedStyle(e, p).getPropertyValue(n)).join('|');
                return [of(el), of(el, '::before'), of(el, '::after'), ...[...el.children].map((k) => of(k))].join(' / ');
            });
        const count = await buttons.count();
        for (let i = 0; i < count; i++) {
            const b = buttons.nth(i);
            await b.scrollIntoViewIfNeeded();
            await page.mouse.move(2, 2);
            await page.waitForTimeout(600);
            const rest = await read(b);
            const box = /** @type {{x:number,y:number,width:number,height:number}} */ (await b.boundingBox());
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            expect(await b.evaluate((el) => el.matches(':hover')), 'the pointer is on it').toBe(true);
            await page.waitForTimeout(600);
            expect(await read(b), `disabled button ${i} on hover`).toBe(rest);
        }
    });
});
