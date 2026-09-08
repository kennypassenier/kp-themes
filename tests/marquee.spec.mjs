// The shared marquee and the menu's caption [M1, M2, M3 of 2026-09-08].
//
// Kenny asked for two things after seeing what the nineteen lifts left
// out: the running band ticker's demo had, available to every theme, and
// the caption blueprint's dropdown had, as an option in every theme.
// Both are content the consumer supplies and expression the theme owns
// [S45], so this suite measures the mechanism, not one theme's taste.
//
// What it holds: the module doubles the row and hides the copy, the band
// runs and rests while it is off screen, both knobs answer, the whole
// thing stands still under reduced motion, a page without the module
// shows the items rather than a half-built band [T17, AR34], and a menu
// draws a caption only where one was supplied.
//
// Drills [KT3], performed 2026-09-08 in chromium and restored:
//   - `animation: kp-marquee-pass …` removed from css/components.css →
//     the track never moves, red on "the band runs";
//   - the `[data-kp-paused]` rule removed → the band keeps running with
//     the attribute set, red on "it rests while it is off screen";
//   - `content: attr(data-kp-menu-label)` removed → the caption is not
//     painted, red on "a menu with a caption draws it".

import { expect, test } from '@playwright/test';

/** @param {import('@playwright/test').Page} page @param {string} body */
async function open(page, body) {
    await page.goto('/examples/concept.html?theme=formal');
    await expect(page.locator('[data-kp-surface="app"]').first()).toBeVisible();
    await page.evaluate((html) => {
        const host = document.createElement('div');
        host.id = 'probe';
        host.innerHTML = html;
        document.body.prepend(host);
    }, body);
}

const BAND = `
    <div class="kp-marquee" data-kp-marquee>
        <span>KP 412.75 +1.9%</span>
        <span>THEME 98.20 -0.4%</span>
    </div>
`;

test.describe('the marquee [M1]', () => {
    test('the module builds the track, doubles the row and hides the copy', async ({ page }) => {
        await open(page, BAND);
        await page.evaluate(async () => {
            const { attachEffects } = await import('/js/effects.js');
            attachEffects(document);
        });
        const band = page.locator('#probe [data-kp-marquee]');
        await expect(band).toHaveAttribute('data-kp-marquee-ready', '');
        const runs = band.locator('[data-kp-marquee-run]');
        expect(await runs.count(), 'two runs, so the pass lands where it started').toBe(2);
        expect(await runs.nth(0).getAttribute('aria-hidden')).toBe(null);
        expect(await runs.nth(1).getAttribute('aria-hidden'), 'the copy is announced to nobody').toBe('true');
        expect(await runs.nth(0).textContent()).toBe(await runs.nth(1).textContent());
    });

    test('the band runs, and it rests while it is off screen [M2]', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await open(page, BAND);
        await page.evaluate(async () => {
            const { attachEffects } = await import('/js/effects.js');
            attachEffects(document);
        });
        const track = page.locator('#probe [data-kp-marquee-track]');
        // The paint, not the attribute [KT13]: two reads of the computed
        // transform, far enough apart to differ at 42 seconds a pass.
        const first = await track.evaluate((el) => getComputedStyle(el).transform);
        await page.waitForTimeout(700);
        const second = await track.evaluate((el) => getComputedStyle(el).transform);
        expect(second, 'the band runs').not.toBe(first);

        // Off screen: the module writes the attribute, the rule pauses the
        // animation, and the transform stops changing where it stood.
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await expect(page.locator('#probe [data-kp-marquee]')).toHaveAttribute('data-kp-paused', '');
        // One frame after the attribute lands, so the read is the resting
        // value and not the last frame the compositor was mid-way through.
        await page.waitForTimeout(120);
        const resting = await track.evaluate((el) => getComputedStyle(el).transform);
        await page.waitForTimeout(700);
        expect(await track.evaluate((el) => getComputedStyle(el).transform), 'it rests while it is off screen').toBe(resting);

        // And back: the pass carries on from where it stopped.
        await page.evaluate(() => window.scrollTo(0, 0));
        await expect(page.locator('#probe [data-kp-marquee]')).not.toHaveAttribute('data-kp-paused', '');
        await page.waitForTimeout(700);
        expect(await track.evaluate((el) => getComputedStyle(el).transform), 'it carries on').not.toBe(resting);
    });

    test('a theme or a consumer that says never keeps it running off screen [M2]', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await open(page, BAND);
        await page.evaluate(async () => {
            document.documentElement.style.setProperty('--kp-marquee-pause', 'never');
            const { attachEffects } = await import('/js/effects.js');
            attachEffects(document);
        });
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(300);
        await expect(page.locator('#probe [data-kp-marquee]')).not.toHaveAttribute('data-kp-paused', '');
        const track = page.locator('#probe [data-kp-marquee-track]');
        const first = await track.evaluate((el) => getComputedStyle(el).transform);
        await page.waitForTimeout(700);
        expect(await track.evaluate((el) => getComputedStyle(el).transform), 'it keeps running').not.toBe(first);
    });

    test('the duration is a knob a consumer may answer without leaving the theme', async ({ page }) => {
        await open(page, BAND);
        await page.evaluate(async () => {
            const band = document.querySelector('#probe [data-kp-marquee]');
            if (band instanceof HTMLElement) band.style.setProperty('--kp-marquee', '9000ms');
            const { attachEffects } = await import('/js/effects.js');
            attachEffects(document);
        });
        const duration = await page.locator('#probe [data-kp-marquee-track]').evaluate((el) => getComputedStyle(el).animationDuration);
        expect(duration).toBe('9s');
    });

    test('under reduced motion the band stands still', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await open(page, BAND);
        await page.evaluate(async () => {
            const { attachEffects } = await import('/js/effects.js');
            attachEffects(document);
        });
        const track = page.locator('#probe [data-kp-marquee-track]');
        expect(await track.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
        const first = await track.evaluate((el) => getComputedStyle(el).transform);
        await page.waitForTimeout(500);
        expect(await track.evaluate((el) => getComputedStyle(el).transform)).toBe(first);
    });

    test('without the module the items are a row, not a half-built band [T17, AR34]', async ({ page }) => {
        await open(page, BAND);
        const band = page.locator('#probe [data-kp-marquee]');
        await expect(band).not.toHaveAttribute('data-kp-marquee-ready', '');
        const items = band.locator('span');
        expect(await items.count()).toBe(2);
        for (const i of [0, 1]) await expect(items.nth(i)).toBeVisible();
    });
});

test.describe("the menu's caption [M3]", () => {
    test('a menu with a caption draws it, a menu without one draws nothing', async ({ page }) => {
        await open(
            page,
            `
    <nav class="kp-nav">
        <ul class="kp-nav__links">
            <li>
                <a class="kp-nav__link" href="#a" aria-haspopup="true">Sheets</a>
                <ul class="kp-nav__menu" id="with" data-kp-menu-label="Detail · scale 4:1">
                    <li><a href="#a1">Elevations</a></li>
                </ul>
            </li>
            <li>
                <a class="kp-nav__link" href="#b" aria-haspopup="true">Legend</a>
                <ul class="kp-nav__menu" id="without">
                    <li><a href="#b1">Symbols</a></li>
                </ul>
            </li>
        </ul>
    </nav>
`,
        );
        const read = (id) =>
            page.locator(`#${id}`).evaluate((el) => {
                const style = getComputedStyle(el, '::before');
                return { content: style.content, height: style.height };
            });
        const withLabel = await read('with');
        // Firefox reports an attr() content unresolved; chromium resolves
        // it. Both say the caption reads the menu's own value.
        expect(['"Detail · scale 4:1"', 'attr(data-kp-menu-label)']).toContain(withLabel.content);
        const without = await read('without');
        expect(without.content === 'none' || without.content === '', 'a menu that was given no caption draws none').toBe(true);
    });
});
