// The bare chassis-rs case [T9, E1, C5]: no register, no effects module,
// no webfonts — the concept page as a chassis-rs dashboard serves it
// until it vendors those files. The page must stay functional and
// readable: the hooks answered quietly (S45), the marks legible, the
// form working, nothing overflowing, every text on both surfaces above
// its contrast floor.
//
// Drill [KT3], 2026-09-07, both browsers, restored: the `mark` rule in
// css/_rules.css given `color: var(--warning)` (ink the colour of its
// own plate) and themes.css regenerated → the contrast walk names every
// mark on both surfaces at 1.00, red. The first attempt edited the
// partial and stayed green: the page loads the generated themes.css, not
// css/_rules.css, so a drill on a partial is a drill on nothing until
// `npm run generate` has run.

import { expect, test } from '@playwright/test';

/** @param {string} rgb */
function luminance(rgb) {
    // A relative colour (`hsl(from …)`, the synthwave register) computes
    // to `color(srgb r g b)`; a plain one to `rgb(r, g, b)`.
    const srgb = rgb.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)/);
    const m = srgb ? [srgb[0], ...srgb.slice(1).map((v) => String(Math.round(Number(v) * 255)))] : rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) throw new Error(`not a colour: ${rgb}`);
    const [r, g, b] = [m[1], m[2], m[3]].map((v) => {
        const c = Number(v) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** @param {string} a @param {string} b */
const ratio = (a, b) => {
    const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
};

for (const theme of ['cyberpunk', 'formal']) {
    test(`bare chassis-rs under ${theme}: no register, no effects, no webfonts — the page reads and works [T9, S45]`, async ({ page }) => {
        const blocked = [];
        await page.route(
            /(cyberpunk-register|retro-register|synthwave-register|phantom-register|terminal-register|brutalism-register|formal-register|sepia-register|solstice-register|mono-register|high-contrast-register|tazhib-register|shade-dark-register|fonts)\.css$|\.woff2$|\/js\/auto\.js$/,
            (route) => {
                blocked.push(route.request().url());
                route.abort();
            },
        );
        await page.addInitScript((name) => localStorage.setItem('theme', name), theme);
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto('/examples/concept.html');
        await page.waitForFunction((name) => document.documentElement.getAttribute('data-theme') === name, theme);
        expect(blocked.length, 'the blocks took: registers, fonts and the module were requested and refused').toBeGreaterThanOrEqual(3);
        // Readable: the headline is its text, the marks show their words.
        const h1 = page.locator('[data-kp-reveal="headline"]').first();
        await expect(h1).toBeVisible();
        expect(await h1.locator('[data-glyph]').count()).toBe(0);
        for (const mark of await page.locator('mark').all()) {
            await expect(mark).toBeVisible();
            expect((await mark.textContent())?.trim().length).toBeGreaterThan(0);
        }
        // Functional: the form's reset works without the module, the
        // dropdown opens on focus, the buttons are enabled.
        const handle = page.locator('#concept-handle');
        await handle.fill('v.night');
        await page.locator('button[type="reset"]').click();
        await expect(handle).toHaveValue('');
        await page.locator('.kp-nav__link[aria-haspopup]').first().focus();
        await expect(page.locator('.kp-nav__menu a').first()).toBeVisible();
        expect(await page.locator('button:disabled').count()).toBe(0);
        // Holding: nothing scrolls sideways.
        expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
        // Contrast on both surfaces, measured on the rendered page.
        const bad = await page.evaluate(() => {
            // The nearest OPAQUE background: a translucent highlight (a ghost
            // button under the pointer paints its ink at 7%, which chromium
            // reports as oklab(… / 0.078)) is a veil over the real ground,
            // not the ground.
            const alphaOf = (bg) => {
                const m = bg.match(/\/\s*([\d.]+)\s*\)$/) ?? bg.match(/^rgba\([^)]*,\s*([\d.]+)\)$/);
                return m ? Number(m[1]) : bg === 'transparent' ? 0 : 1;
            };
            const ground = (el) => {
                let node = el;
                while (node) {
                    const bg = getComputedStyle(node).backgroundColor;
                    if (bg && alphaOf(bg) >= 0.9) return bg;
                    node = node.parentElement;
                }
                return getComputedStyle(document.documentElement).backgroundColor;
            };
            const out = [];
            for (const el of document.querySelectorAll(
                '[data-kp-surface] h1, [data-kp-surface] h2, [data-kp-surface] p, [data-kp-surface] label, [data-kp-surface] mark, [data-kp-surface] button',
            )) {
                if (!el.textContent?.trim()) continue;
                const s = getComputedStyle(el);
                const size = parseFloat(s.fontSize);
                const large = size >= 24 || (size >= 18.66 && Number(s.fontWeight) >= 700);
                out.push({
                    tag: el.tagName.toLowerCase(),
                    text: el.textContent.trim().slice(0, 24),
                    fg: s.color,
                    bg: ground(el),
                    floor: large ? 3 : 4.5,
                });
            }
            return out;
        });
        const failures = bad
            .filter((f) => ratio(f.fg, f.bg) < f.floor)
            .map((f) => `${f.tag} "${f.text}": ${f.fg} on ${f.bg} = ${ratio(f.fg, f.bg).toFixed(2)}`);
        expect(bad.length).toBeGreaterThan(8);
        expect(failures).toEqual([]);
    });
}
