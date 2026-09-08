// What the effects module does when things go wrong [Fase 7, 2026-09-08].
//
// The audit found six paths through js/effects.js that nothing had ever
// exercised: a routine name no routine answers to, the module being taken
// off a page mid-reveal, the preference switched on while a page is
// running, a browser without sessionStorage or IntersectionObserver, and
// a second attach on a page that already has one. Each is a real
// consumer's Tuesday — a typo in a register, a route change in a SPA, a
// private window, a framework remount — and each is closed here.
//
// The rule this file keeps: every assertion reads what the browser paints
// or what a consumer can observe (an event, a text node), never a flag
// the module wrote for itself [KT13].
//
// Drills [KT3], performed 2026-09-08 in chromium and firefox, restored:
//   - the routine-name check removed from `headline` → an unknown name
//     falls through to decipher and the headline fills with glyphs, red
//     on "a routine name nothing answers to is reported, and the headline
//     rests";
//   - `finishers.splice(0)` removed from `detach()` → the headline stays
//     scrambled after the module is taken off, red on "detaching mid-
//     reveal leaves the words whole" — and the first version of that test
//     could not fail at all, because it interrupted a headline the page's
//     own module had already finished;
//   - the observer cleanup removed from `onPreference` → the `draw`
//     routine's own observer survives the flip and reveals a headline
//     after the reader asked for the motion to stop, red on "stops the
//     observers the routines made";
//   - the `carets` guard removed → a second attach doubles the caret
//     listeners, red on "a second attach adds no second caret".

import { expect, test } from '@playwright/test';

/** A page with the module NOT auto-attached, so each test attaches it itself. */
const PAGE = '/examples/concept.html?theme=formal';

/** @param {import('@playwright/test').Page} page */
async function open(page) {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(PAGE);
    await expect(page.locator('[data-kp-surface="app"]').first()).toBeVisible();
}

test.describe('a routine name nothing answers to [G6]', () => {
    test('is reported, and the headline rests as its own text', async ({ page }) => {
        await open(page);
        const result = await page.evaluate(async () => {
            // A headline the page's own module has not already run: the
            // module remembers the ones it started, so a second attach
            // would skip them and this test would prove nothing.
            const h1 = document.createElement('h2');
            h1.setAttribute('data-kp-reveal', 'headline');
            h1.textContent = 'A headline with a typo in its register';
            document.body.prepend(h1);
            const text = h1.textContent ?? '';
            // A register with one letter wrong. The knob is read from the
            // computed style, so setting it on the root is exactly what a
            // theme does.
            document.documentElement.style.setProperty('--kp-reveal-headline', 'dechipher');
            /** @type {{value: string, accepted: string[]}[]} */
            const heard = [];
            document.addEventListener('kp-effect-unknown', (e) => heard.push({ value: e.detail.value, accepted: e.detail.accepted }));
            const { attachEffects } = await import('/js/effects.js');
            const handle = attachEffects(document);
            await new Promise((r) => setTimeout(r, 400));
            const painted = h1.textContent ?? '';
            handle.detach();
            return { heard, painted, text, glyphs: h1.querySelectorAll('[data-glyph]').length };
        });
        expect(result.heard?.length, 'the unknown name is heard once').toBe(1);
        expect(result.heard?.[0].value).toBe('dechipher');
        expect(result.heard?.[0].accepted, 'the event says what would have been accepted').toContain('decipher');
        expect(result.painted, 'the headline is its own words, not glyph noise').toBe(result.text);
        expect(result.glyphs, 'no glyph spans').toBe(0);
    });
});

test.describe('taking the module off a page [G7]', () => {
    test('detaching mid-reveal leaves the words whole', async ({ page }) => {
        await open(page);
        const result = await page.evaluate(async () => {
            // Its own headline: the module remembers the ones it has
            // already started, so reusing the page's own would mean
            // nothing was running when detach came — a test that cannot
            // fail, which is the very thing this file exists to close.
            const h1 = document.createElement('h2');
            h1.setAttribute('data-kp-reveal', 'headline');
            h1.textContent = 'Words that must survive a route change';
            document.body.prepend(h1);
            const text = h1.textContent ?? '';
            // decipher, the noisiest routine, so a half-finished reveal is
            // unmistakable in the text itself.
            document.documentElement.style.setProperty('--kp-reveal-headline', 'decipher');
            const { attachEffects } = await import('/js/effects.js');
            const handle = attachEffects(document, { every: 'load' });
            // Mid-flight: long enough for the routine to have scrambled
            // the words, far short of its own duration.
            await new Promise((r) => setTimeout(r, 120));
            const midway = h1.textContent ?? '';
            handle.detach();
            await new Promise((r) => setTimeout(r, 80));
            return { text, midway, after: h1.textContent ?? '', glyphs: h1.querySelectorAll('[data-glyph]').length };
        });
        expect(result.midway, 'the routine really was mid-flight when the module was taken off').not.toBe(result.text);
        expect(result.after, 'the headline reads its own words again').toBe(result.text);
        expect(result.glyphs, 'nothing of the routine is left behind').toBe(0);
    });

    test('the reveal runs again after a re-attach on the same page', async ({ page }) => {
        await open(page);
        const ran = await page.evaluate(async () => {
            const h1 = document.createElement('h2');
            h1.setAttribute('data-kp-reveal', 'headline');
            h1.textContent = 'A headline the second attach still reaches';
            document.body.prepend(h1);
            document.documentElement.style.setProperty('--kp-reveal-headline', 'decipher');
            const { attachEffects } = await import('/js/effects.js');
            const first = attachEffects(document, { every: 'load' });
            await new Promise((r) => setTimeout(r, 60));
            first.detach();
            let announced = 0;
            document.addEventListener('kp-reveal', () => announced++);
            const second = attachEffects(document, { every: 'load' });
            await new Promise((r) => setTimeout(r, 1200));
            second.detach();
            return announced;
        });
        expect(ran, 'a re-attached page still announces its reveals').toBeGreaterThan(0);
    });
});

test.describe('the preference switched on mid-session [G8]', () => {
    test('stops the observers the routines made, so nothing reveals afterwards', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.goto(PAGE);
        await expect(page.locator('[data-kp-surface="app"]').first()).toBeVisible();

        // A headline that waits for the reader to scroll to it: the `draw`
        // routine keeps an observer of its own, which the cleanup used to
        // leave running. The CSS guard cannot cover this — the animation
        // is not what fires, the observer is.
        await page.evaluate(async () => {
            const spacer = document.createElement('div');
            spacer.style.height = '250vh';
            const h1 = document.createElement('h2');
            h1.id = 'late-headline';
            h1.setAttribute('data-kp-reveal', 'headline');
            h1.setAttribute('data-kp-reveal-every', 'load');
            h1.textContent = 'A headline the reader has not reached yet';
            document.body.append(spacer, h1);
            document.documentElement.style.setProperty('--kp-reveal-headline', 'draw');
            window.__revealed = [];
            document.addEventListener('kp-reveal', (e) => {
                if (e.target instanceof Element && e.target.id === 'late-headline') window.__revealed.push(e.detail?.skipped);
            });
            const { attachEffects } = await import('/js/effects.js');
            window.__handle = attachEffects(document);
        });
        expect(await page.evaluate(() => window.__revealed.length), 'nothing has revealed while it is out of view').toBe(0);

        // The reader asks for the motion to stop, and only then scrolls.
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.waitForTimeout(150);
        const afterFlip = await page.evaluate(() => window.__revealed.length);

        await page.evaluate(() => document.getElementById('late-headline')?.scrollIntoView());
        await page.waitForTimeout(600);
        const afterScroll = await page.evaluate(() => window.__revealed.length);
        await page.evaluate(() => window.__handle?.detach());

        expect(afterScroll, 'the observer the routine made is gone, so scrolling reveals nothing more').toBe(afterFlip);
    });
});

test.describe('a browser missing what the module likes to have [G9]', () => {
    test('without sessionStorage the reveals still run and rest', async ({ page }) => {
        await page.addInitScript(() => {
            // A private window, or a browser told to block site data: the
            // property throws on access rather than returning null.
            Object.defineProperty(window, 'sessionStorage', {
                get() {
                    throw new DOMException('denied', 'SecurityError');
                },
            });
        });
        await open(page);
        const result = await page.evaluate(async () => {
            const h1 = document.querySelector('[data-kp-reveal="headline"]');
            const text = h1?.textContent ?? '';
            document.documentElement.style.setProperty('--kp-reveal-headline', 'decipher');
            const { attachEffects } = await import('/js/effects.js');
            const handle = attachEffects(document);
            await new Promise((r) => setTimeout(r, 1500));
            const after = h1?.textContent ?? '';
            handle.detach();
            return { text, after, deciphered: h1?.classList.contains('is-deciphered') ?? false };
        });
        expect(result.after, 'the headline ends as its own words').toBe(result.text);
        expect(result.deciphered, 'and the module reached its rest state').toBe(true);
    });

    test('without IntersectionObserver the rule is drawn rather than never', async ({ page }) => {
        await page.addInitScript(() => {
            // @ts-expect-error deleting a global on purpose
            delete window.IntersectionObserver;
        });
        await open(page);
        await page.evaluate(async () => {
            const { attachEffects } = await import('/js/effects.js');
            attachEffects(document);
        });
        // The paint, not the class: a rule that is never drawn is the
        // failure this covers, and it shows as a collapsed pseudo-element.
        const drawn = await page
            .locator('[data-kp-reveal="rule"]')
            .first()
            .evaluate((el) => getComputedStyle(el, '::after').transform);
        expect(drawn, 'the rule stands drawn when nothing can watch for it').not.toMatch(/matrix\(0,/);
    });
});

test.describe('a second attach on a page that already has one [G16]', () => {
    test('adds no second caret', async ({ page }) => {
        await open(page);
        const bound = await page.evaluate(async () => {
            document.documentElement.style.setProperty('--kp-caret', 'block');
            const input = document.querySelector('input.kp-field__input');
            if (!(input instanceof HTMLInputElement)) return { error: 'no field' };
            let listeners = 0;
            const original = input.addEventListener.bind(input);
            input.addEventListener = (...args) => {
                listeners++;
                return original(...args);
            };
            const { attachEffects } = await import('/js/effects.js');
            const first = attachEffects(document);
            const afterFirst = listeners;
            const second = attachEffects(document);
            const afterSecond = listeners;
            first.detach();
            second.detach();
            return { afterFirst, afterSecond };
        });
        expect(bound.afterFirst, 'the first attach binds the caret').toBeGreaterThan(0);
        expect(bound.afterSecond, 'the second binds nothing more').toBe(bound.afterFirst);
    });
});
