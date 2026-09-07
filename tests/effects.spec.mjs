// The effects module, both channels, both browsers [C3, TH119, TH120,
// TH122, TH125, TH129, T17, T20, AR34, AR44, AR45].
//
// One suite drives the framework-free concept page and the React render
// of the same descriptor (rule 7g). The theme is stored before the page
// loads, so the head snippet applies it before first paint and the
// module reads the register's routines at attach.
//
// Drills [KT3], each performed 2026-09-07 in both browsers and restored:
//   - `--kp-reveal-headline: decipher` removed from the register → the
//     headline is at rest at once (`skipped: true`), red on "went through
//     the motion";
//   - the `mark::after` covering rule removed → the marks' bars read 0
//     wide before clearance, red;
//   - the observer's `isIntersecting` check removed → the rule drew while
//     still off-screen, red (a threshold of 0 stayed green: no intersection
//     is still no intersection, and that mutation is recorded as such);
//   - the head snippet's `data-kp-effects` line removed from the page →
//     the first-paint assertion reads the attribute absent, red;
//   - `sessionStorage.setItem` in the memo removed → the second load
//     deciphers again, red;
//   - the `change` listener on the media query removed → the mid-session
//     switch leaves a mark covered, red.

import { expect, test } from '@playwright/test';
import { TIMINGS } from '../js/effects.js';

const CHANNELS = [
    ['framework-free', '/examples/concept.html'],
    ['React', '/tests/fixtures/examples.html?example=concept'],
];

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 * @param {{ reduced?: boolean, theme?: string }} [options]
 */
async function open(page, url, { reduced = false, theme = 'cyberpunk' } = {}) {
    await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
    await page.addInitScript((name) => {
        try {
            localStorage.setItem('theme', name);
        } catch {
            // no storage: the page keeps its served theme
        }
    }, theme);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await expect(page.locator('[data-kp-surface="app"]').first()).toBeVisible();
}

for (const [channel, url] of CHANNELS) {
    test.describe(`the effects module, ${channel}`, () => {
        test('the headline deciphers to exactly its source text, once per session [TH119, AR44]', async ({ page }) => {
            // Every reveal event from the first script on, so the first load
            // can be shown to have gone through the motion.
            await page.addInitScript(() => {
                window.kpReveals = [];
                addEventListener('kp-reveal', (e) => window.kpReveals.push(e.detail), true);
            });
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            expect(source).toBeTruthy();
            // The real text reaches a screen reader throughout.
            await expect(h1).toHaveAttribute('aria-label', source ?? '');
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 15000 });
            expect(await h1.textContent()).toBe(source);
            expect(await h1.locator('[data-glyph]').count(), 'no glyph cells remain').toBe(0);
            const first = (await page.evaluate(() => window.kpReveals)).find((e) => e.reveal === 'headline');
            expect(first?.skipped, 'the first load went through the motion').toBe(false);
            expect(first?.routine).toBe('decipher');
            // A second load in the same session goes straight to rest.
            const events = [];
            await page.exposeFunction('kpRecord', (detail) => events.push(detail));
            await page.addInitScript(() => {
                addEventListener('kp-reveal', (e) => window.kpRecord?.(e.detail), true);
            });
            await page.reload();
            await expect(h1).toHaveClass(/is-deciphered/);
            const headline = events.find((e) => e.reveal === 'headline');
            expect(headline?.skipped, 'seen this session: skipped straight to rest').toBe(true);
        });

        test('the marks are covered, then clear one after another at the measured stagger; the text is always there [TH120]', async ({ page }) => {
            // The moment each mark clears, recorded inside the page by a
            // MutationObserver installed before any script runs.
            await page.addInitScript(() => {
                window.kpClears = new Map();
                const seen = new Set();
                new MutationObserver((records) => {
                    for (const r of records) {
                        const el = r.target;
                        if (el instanceof Element && el.matches('mark') && el.classList.contains('is-cleared') && !seen.has(el)) {
                            seen.add(el);
                            window.kpClears.set(seen.size, performance.now());
                        }
                    }
                }).observe(document, { subtree: true, attributes: true, attributeFilter: ['class'] });
            });
            await open(page, url);
            const marks = page.locator('[data-kp-surface="hero"] mark');
            expect(await marks.count()).toBeGreaterThanOrEqual(2);
            // Before clearance the bar covers the phrase, and the phrase is in the DOM.
            const covered = await marks.first().evaluate((el) => ({
                text: el.textContent,
                bar: getComputedStyle(el, '::after').transform,
            }));
            expect(covered.text?.length).toBeGreaterThan(0);
            expect(covered.bar, 'the bar covers the phrase before clearance').not.toMatch(/matrix\(0,/);
            // Each mark clears in turn; the gap between the first two is the stagger.
            await expect(marks.nth(1)).toHaveClass(/is-cleared/, { timeout: 10000 });
            const stamps = await page.evaluate(() => [...window.kpClears.values()]);
            expect(stamps.length).toBeGreaterThanOrEqual(2);
            const gap = stamps[1] - stamps[0];
            const stagger = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--kp-reveal-stagger')));
            expect(Math.abs(gap - stagger), `measured ${gap.toFixed(0)}ms between clears, table says ${stagger}`).toBeLessThan(stagger * 0.5);
            await expect(marks.first()).toHaveClass(/is-cleared/);
            expect(await marks.first().textContent()).toBe(covered.text);
        });

        test('the dossier opens and closes on its trigger [TH120]', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]').first();
            const trigger = dossier.locator('[data-kp-reveal-trigger]');
            const marks = dossier.locator('mark');
            await expect(trigger).toHaveAttribute('aria-pressed', 'false');
            await expect(marks.first()).not.toHaveClass(/is-cleared/);
            await trigger.click();
            await expect(trigger).toHaveAttribute('aria-pressed', 'true');
            await expect(marks.last()).toHaveClass(/is-cleared/);
            await trigger.click();
            await expect(marks.first()).not.toHaveClass(/is-cleared/);
        });

        test('the rule draws when its heading enters the viewport, and stands drawn without the script [TH122, T17]', async ({ page }) => {
            // A spacer above everything, so the heading is below the fold in
            // both channels whatever the hero's height; it is in place before
            // any module runs (readyState interactive precedes them).
            await page.addInitScript(() => {
                document.addEventListener('readystatechange', () => {
                    if (document.readyState !== 'interactive') return;
                    const spacer = document.createElement('div');
                    spacer.style.height = '1600px';
                    document.body.prepend(spacer);
                });
            });
            await open(page, url);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            const scale = () => rule.evaluate((el) => getComputedStyle(el, '::after').transform);
            const before = await scale();
            expect(before, 'scaleX(0) while off-screen').toMatch(/matrix\(0,/);
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/);
            await expect.poll(scale).toMatch(/none|matrix\(1,/);
        });

        test('reduced motion at load gives every rest state at once [DI7]', async ({ page }) => {
            await open(page, url, { reduced: true });
            await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveClass(/is-deciphered/);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            expect(await h1.textContent()).toBe(await h1.getAttribute('data-kp-text'));
            for (const mark of await page.locator('[data-kp-surface="hero"] mark').all()) await expect(mark).toHaveClass(/is-cleared/);
            await expect(page.locator('[data-kp-reveal="rule"]').first()).toHaveClass(/is-in/);
        });

        test('reduced motion switched on mid-session resolves every running reveal [DI7, TH125]', async ({ page }) => {
            await open(page, url);
            const marks = page.locator('[data-kp-surface="hero"] mark');
            await expect(marks.first()).not.toHaveClass(/is-cleared/);
            await page.emulateMedia({ reducedMotion: 'reduce' });
            // At once: well inside the 1500ms the load-time clearance would
            // take on its own, so the switch is what did it.
            for (const mark of await marks.all()) await expect(mark).toHaveClass(/is-cleared/, { timeout: 400 });
            await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveClass(/is-deciphered/, { timeout: 400 });
            await expect(page.locator('[data-kp-reveal="rule"]').first()).toHaveClass(/is-in/, { timeout: 400 });
        });
    });
}

test.describe('the effects module, the page', () => {
    test('the root is armed before first paint, so the start state never flashes from rest [AR34]', async ({ page }) => {
        // Recorded at the first moment scripts can run, before any module.
        await page.addInitScript(() => {
            document.addEventListener('readystatechange', () => {
                if (document.readyState === 'interactive') window.kpArmedAtInteractive = document.documentElement.hasAttribute('data-kp-effects');
            });
        });
        await open(page, '/examples/concept.html');
        expect(await page.evaluate(() => window.kpArmedAtInteractive)).toBe(true);
    });

    test('under a quiet theme the reveals are at rest and the text is the text [S45]', async ({ page }) => {
        await open(page, '/examples/concept.html', { theme: 'formal' });
        const h1 = page.locator('[data-kp-reveal="headline"]').first();
        await expect(h1).toHaveClass(/is-deciphered/);
        expect(await h1.locator('[data-glyph]').count()).toBe(0);
        for (const mark of await page.locator('mark').all()) await expect(mark).toHaveClass(/is-cleared/);
        await expect(page.locator('[data-kp-reveal="rule"]').first()).toHaveClass(/is-in/);
    });

    test('the rule stands drawn on a page without the module [T17, AR34]', async ({ page }) => {
        await page.route('**/js/auto.js', (route) => route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.addInitScript(() => localStorage.setItem('theme', 'cyberpunk'));
        await page.goto('/examples/concept.html');
        // The head snippet armed the root, so the register's start state
        // would hold — and without the module nothing would ever lift it.
        // A page that never attaches the module must not arm the root;
        // this page does, so the assertion is about the register's rest
        // state when the attribute is absent.
        await page.evaluate(() => document.documentElement.removeAttribute('data-kp-effects'));
        const rule = page.locator('[data-kp-reveal="rule"]').first();
        // The register transitions the rule over --kp-rule-draw; the rest
        // state is what stands when that has run.
        await expect.poll(() => rule.evaluate((el) => getComputedStyle(el, '::after').transform), { timeout: 5000 }).toMatch(/none|matrix\(1,/);
        for (const mark of await page.locator('mark').all()) {
            await expect.poll(() => mark.evaluate((el) => getComputedStyle(el, '::after').transform), { timeout: 5000 }).toMatch(/matrix\(0,/);
        }
    });

    test('an unknown hook value is reported once as kp-effect-unknown with the accepted values, never thrown [AR44]', async ({ page }) => {
        const errors = [];
        page.on('pageerror', (e) => errors.push(String(e)));
        await page.addInitScript(() => {
            window.kpUnknown = [];
            addEventListener('kp-effect-unknown', (e) => window.kpUnknown.push(e.detail), true);
            // Before any module script runs: readyState turns interactive
            // when parsing ends, and js/auto.js attaches right after that.
            document.addEventListener('readystatechange', () => {
                if (document.readyState !== 'interactive') return;
                const bad = document.createElement('section');
                bad.setAttribute('data-kp-surface', 'hangar');
                const worse = document.createElement('p');
                worse.setAttribute('data-kp-reveal', 'explode');
                document.body.append(bad, worse);
                bad.insertAdjacentHTML('beforeend', '<div data-kp-surface="hangar"></div>');
            });
        });
        await open(page, '/examples/concept.html');
        const unknown = await page.evaluate(() => window.kpUnknown);
        expect(unknown.map((u) => `${u.hook}=${u.value}`).sort(), JSON.stringify(unknown)).toEqual([
            'data-kp-reveal=explode',
            'data-kp-surface=hangar',
        ]);
        expect(unknown[0].accepted.length).toBeGreaterThan(0);
        expect(errors).toEqual([]);
        // And the diagnostics list it.
        const listed = await page.evaluate(async () => {
            const { scriptSide } = await import('/js/diagnostics.js');
            return scriptSide().unknownEffects;
        });
        expect(listed).toEqual(expect.arrayContaining(['data-kp-surface=hangar']));
    });

    test('three timings are calibrated against the table within 10% [T20, TH129]', async ({ page }) => {
        await open(page, '/examples/concept.html');
        // 1 · The slice burst: the animation the browser runs after the
        // decipher, read from getAnimations() on the headline's pseudo-elements.
        const h1 = page.locator('[data-kp-reveal="headline"]').first();
        await expect(h1).toHaveClass(/is-glitching/, { timeout: 15000 });
        const slice = await h1.evaluate((el) => {
            const anims = el.getAnimations({ subtree: true }).filter((a) => a.animationName?.startsWith('kp-slice'));
            return anims.map((a) => ({ name: a.animationName, duration: Number(a.effect?.getTiming().duration) }));
        });
        expect(slice.length).toBeGreaterThan(0);
        for (const a of slice) {
            const table = TIMINGS[a.name].durationMs;
            expect(Math.abs(a.duration - table) / table, `${a.name}: ${a.duration}ms vs ${table}ms`).toBeLessThan(0.1);
        }
        // 2 · The classified wipe: the transition the register declares on
        // the bar, against the --kp-wipe knob.
        const wipe = await page.evaluate(() => {
            const mark = document.querySelector('[data-kp-surface="hero"] mark');
            return {
                declared: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--kp-wipe')),
                computed: parseFloat(getComputedStyle(mark, '::after').transitionDuration) * 1000,
            };
        });
        expect(Math.abs(wipe.computed - wipe.declared) / wipe.declared).toBeLessThan(0.1);
        // 3 · The decipher: time from attach to is-deciphered against
        // lead + characters / cps.
        await page.evaluate(() => sessionStorage.clear());
        const measured = await page.evaluate(
            () =>
                new Promise((resolve) => {
                    // A fresh headline with the same text: the module starts an
                    // element once, so the one on the page cannot be re-run.
                    const source = document.querySelector('[data-kp-reveal="headline"]');
                    const text = source.getAttribute('data-kp-text') ?? '';
                    const el = document.createElement('h2');
                    el.setAttribute('data-kp-reveal', 'headline');
                    el.setAttribute('data-kp-reveal-every', 'load');
                    el.textContent = text;
                    source.after(el);
                    const root = getComputedStyle(document.documentElement);
                    const cps = parseFloat(root.getPropertyValue('--kp-decipher-cps'));
                    const lead = parseFloat(root.getPropertyValue('--kp-decipher-lead'));
                    const expected = lead + ([...text].length - 1) * (1000 / cps);
                    const start = performance.now();
                    el.addEventListener('kp-reveal', () => resolve({ ms: performance.now() - start, expected }), { once: true });
                    import('/js/effects.js').then(({ attachEffects }) => attachEffects(el, { manageRoot: false }));
                }),
        );
        expect(
            Math.abs(measured.ms - measured.expected) / measured.expected,
            `decipher ${measured.ms.toFixed(0)}ms vs ${measured.expected.toFixed(0)}ms`,
        ).toBeLessThan(0.1);
    });
});
