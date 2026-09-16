// Dark's measured register faults [scope-100], read on the catalogue.
//
// Three faults an agent measured in firefox at ee05b46e and Kenny selected
// in the register-faults form: a disabled button answered the pointer as a
// live one did (the ground 17 → 28, the brackets closing in, the label
// drawing in); the primary button lightened on hover to about 99% where
// its --primary-hover says 86%; and the chamfer's clip-path cut the
// dialog's shadow away, so a dialog lay flat on its backdrop.
//
// Drilled per KT3 on 2026-09-16, firefox, against c9f58c08 before the
// fixes: every test below went red, with the measured value in its
// "Before" line.

import { expect, test } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

/** @param {import('@playwright/test').Page} page @param {string} url */
const openDark = async (page, url) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await useEmptyRegister(page.context());
    await page.goto(url);
    await waitForJudging(page);
    // catalogue/deps.css imports every register, so dark's rules are on the
    // page the moment the attribute is.
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.mouse.move(0, 0);
};

/** Everything hover may change on a button, in one reading. @param {import('@playwright/test').Locator} button */
const hoverPaint = (button) =>
    button.evaluate((el) => {
        const s = getComputedStyle(el);
        const before = getComputedStyle(el, '::before');
        const after = getComputedStyle(el, '::after');
        const label = el.querySelector('.kp-button__label');
        const edge = el.querySelector('.kp-button__edge');
        return {
            background: s.backgroundColor,
            border: s.borderColor,
            color: s.color,
            translate: s.translate,
            transform: s.transform,
            before: `${before.opacity} ${before.translate}`,
            after: `${after.opacity} ${after.translate}`,
            label: label ? getComputedStyle(label).scale : '',
            edge: edge ? getComputedStyle(edge).scale : '',
        };
    });

/** @param {import('@playwright/test').Locator} button */
const running = (button) => button.evaluate((el) => el.getAnimations({ subtree: true }).length);

test.describe('dark: the buttons under the pointer [scope-100]', { tag: ['@theme:dark', '@component:button'] }, () => {
    test('a disabled button paints at hover exactly what it paints at rest', async ({ page }) => {
        // Before: the plain and secondary disabled buttons' ground went
        // rgb(17, 19, 23) → rgb(28, 31, 38); the primary's rgb(233, 238, 241) →
        // about rgb(252, 253, 253), border too; on all three both brackets went
        // opacity 0 → 1 and translate ∓8px → 0.
        await openDark(page, '/catalogue/button.html');
        const buttons = page.locator('#states .cat-stage .kp-button:disabled');
        const count = await buttons.count();
        expect(count).toBeGreaterThanOrEqual(3);
        const faults = [];
        for (let i = 0; i < count; i++) {
            const button = buttons.nth(i);
            await button.scrollIntoViewIfNeeded();
            await page.mouse.move(0, 0);
            await expect.poll(() => running(button)).toBe(0);
            const rest = await hoverPaint(button);
            const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await button.boundingBox());
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await expect.poll(() => button.evaluate((el) => el.matches(':hover'))).toBe(true);
            await expect.poll(() => running(button)).toBe(0);
            const hovered = await hoverPaint(button);
            for (const key of /** @type {(keyof typeof rest)[]} */ (Object.keys(rest)))
                if (rest[key] !== hovered[key]) faults.push(`${await button.textContent()}: ${key} ${rest[key]} → ${hovered[key]}`);
            await page.mouse.move(0, 0);
        }
        expect(faults).toEqual([]);
    });

    test("the primary button's hover ground is its --primary-hover", async ({ page }) => {
        // Before: rest rgb(233, 238, 241) (93%), hover color(srgb 0.9878 0.9907
        // 0.9922), about 99% (`l + 6`), where --primary-hover is rgb(211, 222, 227).
        await openDark(page, '/catalogue/button.html');
        const button = page.locator('#variants .cat-stage .kp-button--primary:not(:disabled)').first();
        await button.scrollIntoViewIfNeeded();
        const token = await button.evaluate((el) => {
            const probe = document.createElement('span');
            probe.style.backgroundColor = 'var(--primary-hover)';
            el.parentElement?.append(probe);
            const value = getComputedStyle(probe).backgroundColor;
            probe.remove();
            return value;
        });
        expect(token).not.toBe('rgba(0, 0, 0, 0)');
        await button.hover();
        await expect.poll(() => button.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(token);
        await expect.poll(() => button.evaluate((el) => getComputedStyle(el).borderColor)).toBe(token);
        await page.mouse.move(0, 0);
    });
});

test.describe('dark: the dialog casts its shadow [scope-100]', { tag: ['@theme:dark', '@component:overlays'] }, () => {
    test('opened, the strip under the dialog paints differently with the dialog there than without it', async ({ page }) => {
        // Before: 0 of the strip's 9280 pixels changed when the dialog went
        // transparent — the chamfer's clip-path cut the 0 12px 28px shadow
        // away (1406px of it came back with the clip removed).
        await openDark(page, '/catalogue/overlays.html');
        await page.locator('[data-kp-dialog="ov-d1-live"]').click();
        const dialog = page.locator('#ov-d1-live');
        await expect.poll(() => dialog.evaluate((el) => /** @type {HTMLDialogElement} */ (el).matches(':modal'))).toBe(true);
        await expect.poll(() => dialog.evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0);
        await page.mouse.move(0, 0);
        const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await dialog.boundingBox());
        // Under the dialog, clear of the chamfered corner, where a 12px drop
        // and a 28px blur land.
        const strip = { x: box.x + 24, y: box.y + box.height + 2, width: box.width - 48, height: 20 };
        // Until scope-102 the shadow was declared in the theme's own ground,
        // hsl(from var(--background) … / 0.45), and on dark's backdrop that
        // colour is within 2 levels of what is already there: whether it
        // painted at all could only be read with the dialog's --background set
        // to a probe colour, which reached the shadow and nothing under the
        // dialog. The oxide halo needs no probe — it is four of the theme's
        // own chart colours and is read straight off the backdrop — so the
        // probe is gone and this test now measures the paint a reader sees.
        const withDialog = await page.screenshot({ clip: strip, animations: 'disabled' });
        // Opacity is not inherited by ::backdrop, so the backdrop stays.
        await dialog.evaluate((el) => {
            /** @type {HTMLElement} */ (el).style.setProperty('transition', 'none');
            /** @type {HTMLElement} */ (el).style.setProperty('opacity', '0');
        });
        const without = await page.screenshot({ clip: strip, animations: 'disabled' });
        const changed = await page.evaluate(
            async ([one, two]) => {
                /** @param {string} data */
                const pixels = async (data) => {
                    const img = await new Promise((resolve, reject) => {
                        const image = new Image();
                        image.onload = () => resolve(image);
                        image.onerror = reject;
                        image.src = `data:image/png;base64,${data}`;
                    });
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
                    ctx.drawImage(img, 0, 0);
                    return ctx.getImageData(0, 0, img.width, img.height).data;
                };
                const [p, q] = await Promise.all([pixels(one), pixels(two)]);
                let n = 0;
                for (let i = 0; i < p.length; i += 4)
                    if (Math.max(Math.abs(p[i] - q[i]), Math.abs(p[i + 1] - q[i + 1]), Math.abs(p[i + 2] - q[i + 2])) >= 16) n++;
                return { changed: n, of: p.length / 4 };
            },
            [withDialog.toString('base64'), without.toString('base64')],
        );
        // At least a quarter of the strip: a shadow, not an antialiased edge.
        expect(changed.changed, JSON.stringify(changed)).toBeGreaterThanOrEqual(changed.of / 4);
    });
});

// ── The oxide halo [scope-102] ───────────────────────────────────────────
//
// Kenny, 2026-09-16, the shadow-and-ink form, dark-shadow "Gloed van de
// oxidefilm": the dialog, the card and the popover are separated from the
// ground by the film's own colours instead of by a shadow in the ground's
// own colour. research/dark-dialog-shadow measured what ships at 0.4% of
// the band past ΔL* 3 and a largest difference of 4.34 of 100; the halo it
// measured at 88.3% (dPR 1) and 86.9% (dPR 2.222) on the dialog.
//
// What is measured here, in one sentence: the three surfaces are put on the
// page ground with clear space round each, photographed twice at the same
// scroll position — once as they stand, once with the halo taken away and
// nothing else changed — and the two photographs are subtracted in CIE L*
// inside a 24px band round each panel. The same measurement the research
// page makes, at the same two device pixel ratios, on the package's own
// stylesheet rather than on a demo's copy of it.
//
// Made to fail first [KT3], 2026-09-16, firefox, on 223e1597's register, at
// both ratios: dialog 0 of 23328 band pixels and a largest difference of 0,
// card 0 of 19584 and 0, popover 2 of 15456 and 3.46 (at dPR 2.222: 0 of
// 115085, 0 of 96142, 5 of 75870, the same 3.46). Zero on the dialog and the
// card is the fault itself, read through this test's switch: the dialog's
// elevation was a `filter: drop-shadow`, which the switch does not touch
// because taking the filter away would drop the fixed plate's containing
// block and move the panel; and the card's box-shadow was cut away by its
// own chamfer, so there was nothing there to switch off. The popover, the
// one of the three that did cast, moved two pixels past ΔL* 3 of fifteen
// thousand. The modal test was red on its own line: a shadow of one colour,
// not four.
const HALO_BAND = 24;
/** The surfaces the decision names — the navbar's dropdown joined them at scope-106. */
const HALO_PROBE = `
    <div data-halo-probe style="display:grid;grid-template-columns:repeat(2,minmax(17rem,1fr));gap:4rem;padding:4rem 2rem;">
        <div data-halo-surface="dialog" style="contain:layout;min-block-size:16rem;padding:2rem 1.5rem;">
            <dialog class="kp-dialog" open aria-labelledby="halo-dialog-title">
                <h2 class="kp-dialog__title" id="halo-dialog-title">Discard calibration run 41?</h2>
                <p>The sodium line drifted 0.4 nm during the run.</p>
            </dialog>
        </div>
        <div data-halo-surface="card" style="contain:layout;min-block-size:16rem;padding:2rem 1.5rem;">
            <article class="kp-card">
                <h3 class="kp-card__title">Run 41</h3>
                <p class="kp-card__body">Sodium D, 589.0 nm. Grating 1200 l/mm, slit 25 µm.</p>
            </article>
        </div>
        <div data-halo-surface="menu" style="contain:layout;min-block-size:16rem;padding:2rem 1.5rem;">
            <ul class="kp-nav__menu" style="position:static;display:block;opacity:1;">
                <li><a href="#a">Readings</a></li>
                <li><a href="#b">Incidents</a></li>
            </ul>
        </div>
        <div data-halo-surface="popover" style="contain:layout;min-block-size:16rem;padding:2rem 1.5rem;">
            <div class="kp-popover">
                <ul class="kp-menu" role="menu">
                    <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open the trace</button></li>
                    <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Re-reference to run 40</button></li>
                </ul>
            </div>
        </div>
    </div>`;

/**
 * CIE L* of an sRGB triple — a scale on which one step is roughly what an
 * eye can just tell apart on a hard edge — and the band difference between
 * two photographs of the same scroll position. Written as a string because
 * it is evaluated inside the page, where the screenshots are decoded.
 */
const HALO_DIFF = `async ({ on, off, rects, ratio, band }) => {
    const toPixels = async (src) => {
        const image = await new Promise((resolve) => {
            const im = new Image();
            im.onload = () => resolve(im);
            im.src = \`data:image/png;base64,\${src}\`;
        });
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(image, 0, 0);
        return ctx.getImageData(0, 0, image.width, image.height);
    };
    const lstar = (r, g, b) => {
        const lin = (c) => {
            const v = c / 255;
            return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        };
        const y = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
        return y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y;
    };
    const [a, b] = await Promise.all([toPixels(on), toPixels(off)]);
    const out = {};
    for (const [key, rect] of Object.entries(rects)) {
        const x0 = Math.round((rect.x - band) * ratio);
        const y0 = Math.round((rect.y - band) * ratio);
        const x1 = Math.round((rect.x + rect.width + band) * ratio);
        const y1 = Math.round((rect.y + rect.height + band) * ratio);
        const ix0 = Math.round(rect.x * ratio);
        const iy0 = Math.round(rect.y * ratio);
        const ix1 = Math.round((rect.x + rect.width) * ratio);
        const iy1 = Math.round((rect.y + rect.height) * ratio);
        let vis = 0;
        let total = 0;
        let peak = 0;
        for (let y = Math.max(0, y0); y < Math.min(a.height, y1); y++) {
            for (let x = Math.max(0, x0); x < Math.min(a.width, x1); x++) {
                if (x >= ix0 && x < ix1 && y >= iy0 && y < iy1) continue;
                total++;
                const i = (y * a.width + x) * 4;
                const d = Math.abs(lstar(a.data[i], a.data[i + 1], a.data[i + 2]) - lstar(b.data[i], b.data[i + 1], b.data[i + 2]));
                if (d > peak) peak = d;
                if (d >= 3) vis++;
            }
        }
        out[key] = { vis, band: total, share: total ? Math.round((vis / total) * 1000) / 10 : 0, peak: Math.round(peak * 100) / 100 };
    }
    return out;
}`;

/** Take the halo away and nothing else: one declaration, on the surfaces only. */
const HALO_OFF = `
    [data-halo-probe] .kp-dialog,
    [data-halo-probe] .kp-card,
    [data-halo-probe] .kp-popover,
    [data-halo-probe] .kp-nav__menu,
    dialog.kp-dialog:modal { box-shadow: none !important; }`;

for (const ratio of [1, 2.222]) {
    test.describe(`dark: the oxide halo at devicePixelRatio ${ratio} [scope-102]`, { tag: ['@theme:dark', '@component:overlays'] }, () => {
        test(`the dialog, the card, the popover and the navbar's dropdown each stand off the ground`, async ({ playwright }) => {
            test.setTimeout(180_000);
            const browser = await playwright.firefox.launch({ firefoxUserPrefs: { 'layout.css.devPixelsPerPx': String(ratio) } });
            try {
                const context = await browser.newContext({
                    baseURL: test.info().project.use.baseURL,
                    deviceScaleFactor: ratio,
                    viewport: { width: 1280, height: 900 },
                });
                const page = await context.newPage();
                await openDark(page, '/catalogue/overlays.html');
                expect(await page.evaluate(() => devicePixelRatio)).toBeCloseTo(ratio, 2);
                await page.evaluate((markup) => document.body.insertAdjacentHTML('beforeend', markup), HALO_PROBE);
                await page.evaluate(() => document.querySelector('[data-halo-probe]')?.scrollIntoView({ block: 'center' }));
                await page.evaluate(() => document.fonts.ready);
                await page.waitForTimeout(400);

                /** Every panel's border box, viewport-relative. */
                const boxes = () =>
                    page.evaluate(() => {
                        const out = {};
                        for (const cell of document.querySelectorAll('[data-halo-surface]')) {
                            const el = cell.querySelector('.kp-dialog, .kp-card, .kp-popover, .kp-nav__menu');
                            const r = el.getBoundingClientRect();
                            out[cell.getAttribute('data-halo-surface')] = { x: r.x, y: r.y, width: r.width, height: r.height };
                        }
                        return out;
                    });

                const rects = await boxes();
                const on = (await page.screenshot({ scale: 'device', animations: 'disabled' })).toString('base64');
                await page.evaluate((css) => {
                    const style = document.createElement('style');
                    style.id = 'halo-off';
                    style.textContent = css;
                    document.head.append(style);
                }, HALO_OFF);
                await page.waitForTimeout(200);
                const after = await boxes();
                const off = (await page.screenshot({ scale: 'device', animations: 'disabled' })).toString('base64');

                // Nothing may move when the halo comes off: a shadow that
                // shifts a box is a layout change wearing a shadow's clothes.
                /** @type {string[]} */
                const moved = [];
                for (const [name, rect] of Object.entries(rects))
                    for (const field of ['x', 'y', 'width', 'height'])
                        if (Math.abs(rect[field] - after[name][field]) > 0.05)
                            moved.push(`${name}: ${field} moved ${Math.abs(rect[field] - after[name][field]).toFixed(2)}px`);
                expect(moved, moved.join('\n')).toEqual([]);

                const bands = await page.evaluate(
                    async ([source, args]) => new Function(`return ${source}`)()(args),
                    [HALO_DIFF, { on, off, rects, ratio, band: HALO_BAND }],
                );

                // The bars: a quarter of the band past ΔL* 3, and a largest
                // difference of 10 of 100. Measured on the day, at dPR 1 →
                // 2.222: dialog 47.6% → 46.7% and a peak of 31.79 → 31.94,
                // card 60.6% → 60.3% and 31.45 → 31.87, popover 56.4% →
                // 55.6% and 32.32 → 32.69. The bars sit at about half the
                // measured share and a third of the measured peak, so a
                // different font, a different antialiasing or a slightly
                // different ground cannot fail them, and an option quietly
                // reverting to the old shadow (0 and 3.46 above) cannot pass.
                /** @type {string[]} */
                const weak = [];
                for (const name of ['dialog', 'card', 'popover', 'menu']) {
                    const band = bands[name];
                    if (!(band.vis / band.band >= 0.25)) weak.push(`${name}: ${band.share}% of the band past ΔL* 3, under 25%`);
                    if (!(band.peak >= 10)) weak.push(`${name}: largest difference ${band.peak}, under 10`);
                }
                expect(weak, JSON.stringify(bands, null, 2)).toEqual([]);
            } finally {
                await browser.close();
            }
        });

        // The finding that decided the shape of this halo: a dialog in the top
        // layer is a scroll container by the UA stylesheet (`dialog:modal {
        // overflow: auto }`, HTML Standard §15.3.3), so it clips its own
        // pseudo-elements and a blurred film could not reach outside it. A
        // box-shadow is not a descendant and is not clipped — this test is
        // what proves the clipping does not eat the halo.
        test('a modal dialog wears the halo too, the clipping notwithstanding', async ({ playwright }) => {
            test.setTimeout(180_000);
            const browser = await playwright.firefox.launch({ firefoxUserPrefs: { 'layout.css.devPixelsPerPx': String(ratio) } });
            try {
                const context = await browser.newContext({
                    baseURL: test.info().project.use.baseURL,
                    deviceScaleFactor: ratio,
                    viewport: { width: 1280, height: 900 },
                });
                const page = await context.newPage();
                await openDark(page, '/catalogue/overlays.html');
                await page.locator('[data-kp-dialog="ov-d1-live"]').click();
                const dialog = page.locator('#ov-d1-live');
                await expect.poll(() => dialog.evaluate((el) => el.matches(':modal'))).toBe(true);
                await expect.poll(() => dialog.evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0);
                await page.mouse.move(0, 0);
                await page.waitForTimeout(300);

                // The clipping itself, named rather than assumed.
                expect(await dialog.evaluate((el) => getComputedStyle(el).overflow), 'a modal dialog is a scroll container').toBe('auto');
                // A relative colour computes to `color(srgb …)`, a plain one
                // to `rgb(…)`; count either, and `color(srgb` must not also
                // count as an `rgb`.
                expect(
                    (await dialog.evaluate((el) => getComputedStyle(el).boxShadow)).match(/color\(srgb|rgba?\(/g)?.length,
                    'the modal wears all four wavelengths',
                ).toBe(4);

                const rect = await dialog.evaluate((el) => {
                    const r = el.getBoundingClientRect();
                    return { x: r.x, y: r.y, width: r.width, height: r.height };
                });
                const on = (await page.screenshot({ scale: 'device', animations: 'disabled' })).toString('base64');
                await page.evaluate((css) => {
                    const style = document.createElement('style');
                    style.textContent = css;
                    document.head.append(style);
                }, HALO_OFF);
                await page.waitForTimeout(200);
                const off = (await page.screenshot({ scale: 'device', animations: 'disabled' })).toString('base64');
                const bands = await page.evaluate(
                    async ([source, args]) => new Function(`return ${source}`)()(args),
                    [HALO_DIFF, { on, off, rects: { modal: rect }, ratio, band: HALO_BAND }],
                );
                const band = bands.modal;
                // The same bars as the frozen surfaces, on the dimmed backdrop.
                expect(band.vis / band.band, JSON.stringify(band)).toBeGreaterThanOrEqual(0.25);
                expect(band.peak, JSON.stringify(band)).toBeGreaterThanOrEqual(10);
            } finally {
                await browser.close();
            }
        });
    });
}
