// The 5.0.0 cyberpunk register, measured on the concept page [C2].
//
// TH117 the navbar: the strip's clip-path is computed, mirrors under
//       data-kp-nav-side="end", and a hit test on the dropdown hits the
//       link — the first build clipped the list itself, so every dropdown
//       opened invisible (the demo's own history).
// TH118 the buttons: notch, mirror and slit computed per variant, and the
//       focus ring is measured as the difference it makes, inside the box.
// TH121 the tear: pixels above and below the ridge match the two surfaces
//       at five x positions, after a hero and after an app surface, for
//       both seeds.
// TH133 a bare .kp-card gets the register rule.
//
// Drills [KT3], each performed 2026-09-07 in both browsers and restored:
//   - the `.kp-nav__links::before` clip-path removed → "the strip has no
//     clip-path", red;
//   - `clip-path: inset(0)` added to `.kp-nav__links` itself, the demo's
//     own first bug → the hit test at the menu link's centre misses, red.
//     Two other mutations stayed GREEN on this page and are recorded as
//     such: removing `position: relative` from the item (the panel then
//     positions against the nav, still under the pointer) and removing
//     the nav's z-index (the concept page's hero is not positioned, so it
//     covers nothing) — the demo's second cause has no twin here;
//   - the notch removed from `.kp-button` → clip-path none, red;
//   - the `:focus-visible` ring removed → delta 0 inside the box, red;
//   - the divider's `::before` mask removed → the row below the ridge read
//     the hero colour at all five x positions, red;
//   - the `.kp-card` clip removed → no polygon, red.

import { expect, test } from '@playwright/test';
import { paintedFocusDelta, tabTo } from './ring.mjs';

const URL = '/examples/concept.html?theme=cyberpunk';

/** @param {import('@playwright/test').Page} page */
async function open(page) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(URL);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'cyberpunk');
    await page.evaluate(() => {
        for (const animation of document.getAnimations()) animation.finish();
    });
}

/** @param {string} rgb */
function channels(rgb) {
    const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) throw new Error(`not a colour: ${rgb}`);
    return [Number(m[1]), Number(m[2]), Number(m[3])];
}

/** @param {number[]} a @param {number[]} b */
const close = (a, b, tolerance = 6) => a.every((v, i) => Math.abs(v - b[i]) <= tolerance);

test.describe('the cyberpunk register on the concept page [C2]', () => {
    test('the navbar strip is clipped, and the clip mirrors under data-kp-nav-side="end" [TH117]', async ({ page }) => {
        await open(page);
        const read = () =>
            page.evaluate(() => {
                const links = document.querySelector('.kp-nav__links');
                return getComputedStyle(links, '::before').clipPath;
            });
        const start = await read();
        expect(start, 'the strip has no clip-path').toContain('polygon');
        await page.evaluate(() => document.querySelector('.kp-nav')?.setAttribute('data-kp-nav-side', 'end'));
        const end = await read();
        expect(end).toContain('polygon');
        expect(end, 'the notch did not move to the other side').not.toBe(start);
        // The start shape cuts its first corner (x = notch at y = 0); the end
        // shape starts at the origin and cuts its last corner instead.
        expect(start.replace(/\s+/g, ' ')).toMatch(/^polygon\(1[0-9]px 0(px)?,/);
        expect(end.replace(/\s+/g, ' ')).toMatch(/^polygon\(0(px)? 0(px)?,/);
    });

    test('the dropdown opens on hover and a hit test at its link lands on the link [TH117]', async ({ page }) => {
        await open(page);
        const trigger = page.locator('.kp-nav__link[aria-haspopup]').first();
        await trigger.hover();
        const menuLink = page.locator('.kp-nav__menu a').first();
        await expect(menuLink).toBeVisible();
        const hit = await menuLink.evaluate((el) => {
            const r = el.getBoundingClientRect();
            const at = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
            return at === el || el.contains(at) ? 'link' : `${at?.tagName.toLowerCase()}.${at?.className}`;
        });
        expect(hit, "the hit test at the menu link's centre").toBe('link');
        // Keyboard: Tab from the trigger reaches the first item.
        await trigger.focus();
        await page.keyboard.press('Tab');
        expect(await page.evaluate(() => document.activeElement?.closest('.kp-nav__menu') !== null)).toBe(true);
    });

    test('the button notch is computed per variant and the mirror flips it [TH118]', async ({ page }) => {
        await open(page);
        const shapes = await page.evaluate(() => {
            const row = document.querySelector('[data-kp-surface="app"] .kp-row');
            const make = (cls) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = `kp-button ${cls}`.trim();
                b.textContent = 'Probe';
                row?.append(b);
                const s = getComputedStyle(b);
                const face = getComputedStyle(b, '::before');
                return { clip: s.clipPath, face: s.backgroundSize, slit: s.backgroundImage, radius: s.borderRadius };
            };
            return {
                plain: make(''),
                primary: make('kp-button--primary'),
                mirror: make('kp-button--mirror'),
                ghost: make('kp-button--ghost'),
                destructive: make('kp-button--destructive'),
            };
        });
        for (const [name, shape] of Object.entries(shapes)) {
            expect(shape.clip, `${name}: clip-path`).toContain('polygon');
            expect(shape.face, `${name}: the face is a layer two pixels inside the frame`).toContain('calc(100% - 4px)');
            expect(shape.radius, `${name}: square`).toBe('0px');
        }
        expect(shapes.mirror.clip, 'the mirror did not flip the notch').not.toBe(shapes.plain.clip);
        expect(shapes.primary.clip).toBe(shapes.plain.clip);
        expect(shapes.plain.slit, 'the slit is a gradient on the frame').toContain('linear-gradient');
        expect(shapes.ghost.slit, 'a ghost keeps the layers; its frame is transparent').toContain('linear-gradient');
    });

    for (const variant of ['', 'kp-button--primary', 'kp-button--mirror', 'kp-button--destructive']) {
        test(`focus paints a ring inside the ${variant || 'plain'} button, measured as a difference [TH118, DI2]`, async ({ page }) => {
            await open(page);
            await page.evaluate((cls) => {
                const row = document.querySelector('[data-kp-surface="app"] .kp-row');
                const b = document.createElement('button');
                b.type = 'button';
                b.className = `kp-button ${cls}`.trim();
                b.textContent = 'Probe';
                b.setAttribute('data-test', 'probe');
                row?.prepend(b);
            }, variant);
            // The theme picker above the page adds 24 tabbable buttons.
            await tabTo(page, 'probe', 200);
            const { delta, focused, idle } = await paintedFocusDelta(page, 'probe', { where: 'inside' });
            expect(delta, `focus added ${delta} ring pixels (focused ${focused}, at rest ${idle})`).toBeGreaterThan(100);
        });
    }

    for (const [order, seed] of [
        ['after the hero', ''],
        ['after the hero, alt seed', 'alt'],
        ['after the app surface', ''],
        ['after the app surface, alt seed', 'alt'],
    ]) {
        test(`the tear ${order}: pixels above and below the ridge match the two surfaces at five x positions [TH121]`, async ({ page }) => {
            await open(page);
            const afterApp = order.includes('app');
            // The scanlines (6% yellow, every third row) are the texture, not
            // the tear: they are turned off so a sample reads the surface.
            await page.evaluate(() => document.documentElement.style.setProperty('--fx-texture-opacity', '0'));
            const box = await page.evaluate(
                ([afterApp, seed]) => {
                    let divider = document.querySelector('[data-kp-divider]');
                    if (afterApp) {
                        const app = document.querySelector('[data-kp-surface="app"]');
                        const extra = document.createElement('div');
                        extra.setAttribute('data-kp-divider', seed);
                        app?.after(extra);
                        divider = extra;
                    } else if (seed) divider?.setAttribute('data-kp-divider', seed);
                    divider?.scrollIntoView({ block: 'center' });
                    const r = divider.getBoundingClientRect();
                    const root = getComputedStyle(document.documentElement);
                    const probe = document.createElement('div');
                    document.body.append(probe);
                    const paint = (v) => {
                        probe.style.backgroundColor = v;
                        return getComputedStyle(probe).backgroundColor;
                    };
                    const hero = paint(root.getPropertyValue('--surface-hero-bg').trim());
                    const app = paint(root.getPropertyValue('--background').trim());
                    const footer = paint(root.getPropertyValue('--sidebar-background').trim());
                    probe.remove();
                    return { x: r.left, y: r.top, w: r.width, h: r.height, hero, app, footer, dpr: devicePixelRatio };
                },
                [afterApp, seed],
            );
            expect(box.h).toBeGreaterThan(30);
            const png = await page.screenshot({ clip: { x: box.x, y: box.y, width: box.w, height: box.h } });
            const pixels = await page.evaluate(
                async ([bytes, w, h]) => {
                    const blob = new Blob([new Uint8Array(bytes)], { type: 'image/png' });
                    const bitmap = await createImageBitmap(blob);
                    const canvas = document.createElement('canvas');
                    canvas.width = bitmap.width;
                    canvas.height = bitmap.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(bitmap, 0, 0);
                    const sx = bitmap.width / w;
                    const sy = bitmap.height / h;
                    const out = [];
                    for (const fx of [0.1, 0.3, 0.5, 0.7, 0.9]) {
                        const x = Math.floor(fx * w * sx);
                        const top = ctx.getImageData(x, Math.floor(2 * sy), 1, 1).data;
                        const bottom = ctx.getImageData(x, Math.floor((h - 3) * sy), 1, 1).data;
                        out.push({ fx, top: [top[0], top[1], top[2]], bottom: [bottom[0], bottom[1], bottom[2]] });
                    }
                    return out;
                },
                [Array.from(png), box.w, box.h],
            );
            // After the hero the tear falls from the hero ground into the app
            // ground; after the app surface it falls into the footer's ground.
            const above = channels(afterApp ? box.app : box.hero);
            const below = channels(afterApp ? box.footer : box.app);
            for (const sample of pixels) {
                expect(close(sample.top, above), `x=${sample.fx}: above the ridge ${sample.top} should be ${above}`).toBe(true);
                expect(close(sample.bottom, below), `x=${sample.fx}: below the ridge ${sample.bottom} should be ${below}`).toBe(true);
            }
        });
    }

    test('a bare .kp-card gets the register rule [TH133]', async ({ page }) => {
        await open(page);
        const shape = await page.evaluate(() => {
            const card = document.createElement('div');
            card.className = 'kp-card';
            card.textContent = 'bare';
            document.querySelector('[data-kp-surface="app"]')?.append(card);
            const s = getComputedStyle(card);
            return { clip: s.clipPath, radius: s.borderRadius, slot: card.hasAttribute('data-slot') };
        });
        expect(shape.slot).toBe(false);
        expect(shape.clip, 'the dossier corner').toContain('polygon');
        expect(shape.radius).toBe('0px');
    });
});
