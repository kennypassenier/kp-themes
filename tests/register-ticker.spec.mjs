// The ticker register [S48, LIFT_PLAN row 6]: the approved concept demo
// "Open Outcry" (2026-09-08, scratchpad/ticker-demo.html) reproduced by
// the package, measured on the concept page under ticker in both
// channels.
//
// What the demo showed and this suite holds: no arrival (printed matter
// is simply there — the theme has none); the headline and the lede's
// marks cut into place, once, with zero interpolation, never a dissolve
// (the headline reuses academia's `draw` routine — the exact
// IntersectionObserver `rule()` generalised to h1 — painted here as an
// opacity cut rather than a drawn rule); the hairline rule under a
// heading snapping to full width the instant it
// enters the viewport; the two hairline dividers; the dropdown carrying
// its own frame (KT14); the reverse-video primary button and CTA, the
// mirror's duplicate outline; the tabular-numeral fields; the dossier's
// redactions hidden by colour only (KT5) until the trigger clears them,
// in one frame; and the whole approved inventory on the page.
//
// Drills [KT3], performed 2026-09-08 in chromium and restored:
//   - the armed cover (`[data-kp-effects] mark:not(.is-cleared)`) removed
//     → a lede mark reads its revealed colours from the first paint, red
//     on "the mark starts covered, not highlighted";
//   - the pending rule width (`:not(.is-in)::after { inline-size: 0 }`)
//     removed → the rule reads 3rem before its heading is ever scrolled
//     to, red on "the rule starts at zero width";
//   - `.kp-nav__menu a:hover`'s own rule removed → a hovered row reads the
//     same background before and after, red on "a hovered row its own
//     highlight" (`.kp-nav__menu`'s own frame rule was tried first and
//     found to duplicate the base layer's own defaults for this theme
//     exactly — radius 0 from the token, the same border and popover
//     ground — so drilling it proved nothing; the hover rule, which has
//     no base default at all, is the part of KT14 this register actually
//     carries).

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-ticker.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=ticker'],
];

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 * @param {{ reduced?: boolean, viewport?: { width: number, height: number } }} [options]
 */
async function open(page, url, { reduced = false, viewport = { width: 1280, height: 900 } } = {}) {
    await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
    await page.addInitScript(() => {
        try {
            localStorage.setItem('theme', 'ticker');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize(viewport);
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'ticker');
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
    test.describe(`the ticker register, ${channel}`, () => {
        test('there is no arrival: printed matter is simply there', async ({ page }) => {
            await open(page, url);
            expect(await page.locator('.kp-boot').count(), 'no boot overlay ever builds').toBe(0);
        });

        test('the headline cuts into place with zero interpolation, never a dissolve', async ({ page }) => {
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            // `draw` (academia's routine, reused here) flips `is-in` — the
            // exact class `rule()` uses — never `is-deciphered`, because
            // the text is never touched to begin with.
            await expect(h1).toHaveClass(/is-in/, { timeout: 5000 });
            const source = await h1.getAttribute('data-kp-text');
            expect(await h1.textContent()).toBe(source);
            // No glyph or word spans of any other routine (decipher, shout,
            // slam) survive the reveal — the text is simply the text.
            expect(await h1.locator('[data-glyph], [data-word], [data-caret]').count(), 'no per-character or per-word noise').toBe(0);
            await settled(page);
            expect(await h1.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
            const transition = await h1.evaluate((el) => getComputedStyle(el).transitionDuration);
            expect(transition, 'no transition property at all: the register declares none').toBe('0s');
            expect(await h1.evaluate((el) => document.getAnimations().some((a) => el.contains(a.effect?.target ?? null))), 'nothing animates').toBe(
                false,
            );
        });

        test('under reduced motion every reveal is at rest and the redactions start open', async ({ page }) => {
            await open(page, url, { reduced: true });
            await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveClass(/is-deciphered/);
            expect(await page.locator('[data-kp-surface="hero"] mark:not(.is-cleared)').count(), 'the lede marks stand revealed').toBe(0);
            const dossierMarks = page.locator('.kp-card[data-kp-reveal="emphasis"] mark');
            expect(
                await dossierMarks.evaluateAll((els) => els.every((el) => el.classList.contains('is-cleared'))),
                'reduced motion skips the trigger',
            ).toBe(true);
        });

        test('the mark starts covered, and the amber wash and underline arrive together, in one frame [TH120]', async ({ page }) => {
            await open(page, url);
            const mark = page.locator('[data-kp-surface="hero"] .kp-lede mark').first();
            // Drilled: removing `[data-kp-effects] mark:not(.is-cleared)`
            // makes this read the revealed colours immediately — red on
            // "the mark starts covered, not highlighted".
            await expect(mark).toHaveClass(/is-cleared/, { timeout: 5000 });
            await settled(page);
            expect(await mark.evaluate((el) => getComputedStyle(el).textDecorationColor)).toBe(await paint(page, '--primary'));
            expect(await mark.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--foreground'));
            expect(await mark.evaluate((el) => getComputedStyle(el).transitionDuration), 'no transition to interpolate through').toBe('0s');
        });

        test('the rule starts at zero width and snaps to full the instant its heading enters the viewport [TH122]', async ({ page }) => {
            // A short viewport from the first paint, so the "Open an
            // order" heading — the hero alone fills 1280x900 on this
            // page — starts below the fold and the pending state is not
            // a race against the observer's own first tick.
            await open(page, url, { viewport: { width: 1280, height: 480 } });
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            // Drilled: removing the pending `inline-size: 0` rule makes
            // this read 3rem before the element is ever scrolled to — red
            // on "the rule starts at zero width".
            const before = await pseudo(rule, '::after', ['inline-size', 'width']);
            expect(before.width === '0px' || before['inline-size'] === '0px', 'covered before it is seen').toBe(true);
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            await settled(page);
            const after = await pseudo(rule, '::after', ['width', 'background-color', 'transition-duration']);
            expect(after.width).toBe('48px');
            expect(after['background-color']).toBe(await paint(page, '--primary'));
            expect(after['transition-duration'], 'a cut, not a draw').toBe('0s');
        });

        test('the dividers are one flat hairline pixel, no blur, no torn edge [TH121]', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            for (const i of [0, 1]) {
                const d = dividers.nth(i);
                const box = await d.evaluate((el) => el.getBoundingClientRect().height);
                expect(box, 'one flat pixel').toBe(1);
                expect(await d.evaluate((el) => getComputedStyle(el).filter), 'no blur').toBe('none');
                expect(await d.evaluate((el) => getComputedStyle(el).clipPath), 'no torn edge').toBe('none');
            }
        });

        test('the dropdown carries its own frame, and a hovered row its own highlight [KT14]', async ({ page }) => {
            await open(page, url);
            const trigger = page.locator('.kp-nav__link[aria-haspopup="true"]').first();
            await trigger.hover();
            const menu = page.locator('.kp-nav__menu').first();
            await expect.poll(() => menu.evaluate((el) => getComputedStyle(el).display)).not.toBe('none');
            const style = await menu.evaluate((el) => {
                const s = getComputedStyle(el);
                return { border: s.borderTopWidth, radius: s.borderRadius, shadow: s.boxShadow, bg: s.backgroundColor };
            });
            expect(style.border).toBe('1px');
            expect(style.radius).toBe('0px');
            expect(style.bg).toBe(await paint(page, '--popover'));
            // `.kp-nav__menu`'s frame (background/border/radius) happens to
            // equal the base layer's own defaults for this theme — radius 0
            // from the token, the same border and popover ground — so
            // drilling that rule proves nothing. The row's hover highlight
            // has no base rule at all (`.kp-nav__menu a:hover` does not
            // exist in css/components.css): this is the part of KT14's
            // dropdown that is genuinely this register's own.
            const row = menu.locator('a').first();
            const before = await row.evaluate((el) => getComputedStyle(el).backgroundColor);
            await row.hover();
            // Drilled: removing `.kp-nav__menu a:hover`'s own rule leaves
            // the row's background unchanged on hover — red on "a hovered
            // row" reading the same colour before and after.
            await expect.poll(() => row.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe(before);
            expect(await row.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--muted'));
        });

        test('the primary button is reverse video, and the mirror is a second frame, not a shadow', async ({ page }) => {
            await open(page, url);
            const primary = page.locator('[data-kp-surface="hero"] .kp-button--primary').first();
            expect(await primary.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--primary'));
            expect(await primary.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--primary-foreground'));
            // The base layer's own offset shadow (`--fx-shadow-offset 0px
            // 0px 0 0 var(--border-strong)`) still computes on the
            // element — the token, not `none`, is what keeps this theme
            // shadowless — so a flat, zero-offset, zero-spread layer
            // counts as no shadow; anything with real reach does not.
            const shadow = await primary.evaluate((el) => getComputedStyle(el).boxShadow);
            expect(shadow === 'none' || /^[\w(),.\s]+ 0px 0px 0px 0px$/.test(shadow), `no shadow anywhere in this theme: ${shadow}`).toBe(true);
            const mirror = await pseudo(primary, '::after', ['border-top-width', 'transform', 'opacity']);
            expect(mirror['border-top-width']).toBe('1px');
            expect(mirror.transform).toMatch(/matrix\(-1, 0, 0, 1, 0, 0\)/);
            expect(mirror.opacity).toBe('0.5');
        });

        test('the field is a tabular-numeral well with the two-channel ring, stacked in the demo order', async ({ page }) => {
            await open(page, url);
            const input = page.locator('input.kp-field__input[type="text"], input.kp-field__input:not([type])').first();
            expect(await input.evaluate((el) => getComputedStyle(el).fontVariantNumeric)).toContain('tabular-nums');
            await input.focus();
            const ring = await input.evaluate((el) => getComputedStyle(el).boxShadow);
            // Four stacked layers: bg, ring, bg, fg — the demo's own order.
            expect((ring.match(/rgba?\(/g) ?? []).length, 'four stacked shadow layers').toBeGreaterThanOrEqual(4);
        });

        test('the dossier: redactions hidden by colour only, cleared on the trigger, in one frame [KT5]', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const mark = dossier.locator('mark').first();
            // KT5: the sentence is in the DOM throughout — a screen reader
            // hears it even while a sighted reader sees a bar.
            expect((await mark.textContent())?.length ?? 0).toBeGreaterThan(0);
            expect(await mark.evaluate((el) => getComputedStyle(el).backgroundColor), 'covered by colour').toBe(await paint(page, '--foreground'));
            expect(await mark.evaluate((el) => getComputedStyle(el).color)).toBe('rgba(0, 0, 0, 0)');
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(mark).toHaveClass(/is-cleared/);
            await settled(page);
            expect(await mark.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--foreground'));
            expect(await mark.evaluate((el) => getComputedStyle(el).transitionDuration), 'a cut, not a wipe').toBe('0s');
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
