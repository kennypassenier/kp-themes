// Measuring the two-part focus ring, once [AR30, DI2].
//
// Extracted at W4 from tests/button.spec.mjs, which is where every line
// of it was won: the tolerance of 12 because the ring is antialiased at
// both edges, the device-pixel scale, the probe that resolves
// --focus-ring from hsl() to rgb(), and --focus-ring only rather than
// both halves, because the outer half is the theme's BACKGROUND colour
// and counting it counts the page.
//
// It lives in its own file because W4 measures the same ring on a
// different control — the destructive item inside a row menu — and two
// copies of a measurement this fiddly drift apart, which is the fault
// AR30 is about one layer down.

/**
 * Reach an element with the keyboard.
 *
 * `element.focus()` does not make `:focus-visible` match in either
 * browser, and `:focus-visible` is the selector under test, so the ring
 * has to be reached the way a keyboard user reaches it.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} testId
 * @param {number} [limit]
 */
export async function tabTo(page, testId, limit = 40) {
    const selector = `[data-test="${testId}"]`;
    for (let i = 0; i < limit; i++) {
        await page.keyboard.press('Tab');
        if (await page.evaluate((s) => document.activeElement?.matches(s) ?? false, selector)) return;
    }
    throw new Error(`could not reach ${selector} with Tab`);
}

/** Wear a theme. @param {import('@playwright/test').Page} page @param {string} theme */
export const wearTheme = (page, theme) => page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);

/**
 * Split a computed `box-shadow` into its layers. Commas inside `rgb(…)`
 * are not layer separators, which is why this is not `split(',')`.
 *
 * @param {string} value
 * @returns {string[]}
 */
export function shadowLayers(value) {
    if (!value || value === 'none') return [];
    /** @type {string[]} */
    const out = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < value.length; i++) {
        if (value[i] === '(') depth++;
        else if (value[i] === ')') depth--;
        else if (value[i] === ',' && depth === 0) {
            out.push(value.slice(start, i).trim());
            start = i + 1;
        }
    }
    out.push(value.slice(start).trim());
    return out.filter(Boolean);
}

/** Every length in one shadow layer, in px. @param {string} layer */
export const lengths = (layer) => [...layer.matchAll(/(-?[\d.]+)px/g)].map((m) => Number(m[1]));

/**
 * What a focused element paints as its focus indicator, and the colour
 * the theme declares for the inner half.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} testId
 */
export const indicator = (page, testId) =>
    page.evaluate((id) => {
        const el = /** @type {HTMLElement} */ (document.querySelector(`[data-test="${id}"]`));
        const s = getComputedStyle(el);
        // --focus-ring is authored as hsl() and a computed box-shadow is
        // rgb(): comparing the two as strings never matches, so the token
        // is resolved through a probe before it is compared.
        const probe = document.createElement('span');
        probe.style.color = 'var(--focus-ring)';
        document.body.append(probe);
        const ring = getComputedStyle(probe).color;
        probe.remove();
        return {
            focused: el === document.activeElement,
            outlineStyle: s.outlineStyle,
            outlineWidth: Number.parseFloat(s.outlineWidth),
            boxShadow: s.boxShadow,
            ring,
        };
    }, testId);

/**
 * True when both halves of the ring are declared on what `indicator()`
 * read: an outline of at least 2px, and a box-shadow layer in
 * --focus-ring with a real SPREAD.
 *
 * The spread rather than any length, because brutalism's offset shadow
 * is 4px 4px in a colour that happens to equal its --focus-ring: an
 * offset is not a ring.
 *
 * @param {{ outlineStyle: string, outlineWidth: number, boxShadow: string, ring: string }} found
 */
export function bothHalves(found) {
    const outer = found.outlineStyle !== 'none' && found.outlineWidth >= 2;
    const inner = shadowLayers(found.boxShadow).some((layer) => {
        const px = lengths(layer);
        return layer.includes(found.ring) && px.length >= 4 && px[3] >= 2;
    });
    return { outer, inner };
}

/**
 * The pixels the focus indicator actually paints AROUND an element,
 * which is a different question from what its computed style declares.
 *
 * Computed style still reports an outline a `clip-path` has clipped
 * away, which is how AR30's `green 784 -> 0` was found — and it still
 * reports one an ancestor's `overflow` has cut off, which is what W4
 * asks about a menu item inside a scrolling popover. So this counts
 * paint: it screenshots the element with a band around it, throws away
 * everything inside the element's own box, and counts what is left in
 * --focus-ring. The PNG is decoded in the page, because a canvas is a
 * decoder that is already there and T16 forbids a new dev dependency.
 *
 * The element must already be focused, by the keyboard.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} testId
 * @param {{ pad?: number, settleMs?: number }} [options]
 * @returns {Promise<number>}
 */
export async function paintedFocusPixels(page, testId, { pad = 12, settleMs = 400 } = {}) {
    // A theme switch transitions background-color for --fx-duration; a
    // screenshot taken mid-transition measures the transition.
    await page.waitForTimeout(settleMs);
    const box = await page.locator(`[data-test="${testId}"]`).boundingBox();
    if (!box) throw new Error(`${testId} has no box`);
    const clip = {
        x: Math.round(box.x - pad),
        y: Math.round(box.y - pad),
        width: Math.round(box.width + pad * 2),
        height: Math.round(box.height + pad * 2),
    };
    const ring = await page.evaluate(() => {
        const probe = document.createElement('span');
        probe.style.color = 'var(--focus-ring)';
        document.body.append(probe);
        const value = getComputedStyle(probe).color;
        probe.remove();
        return value;
    });
    const shot = await page.screenshot({ clip });
    return page.evaluate(
        async ([data, colour, geometry]) => {
            /** @type {HTMLImageElement} */
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
            const px = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            const want = (colour.match(/\d+/g) ?? []).slice(0, 3).map(Number);
            // The screenshot is in device pixels; the box is in CSS pixels.
            const scale = canvas.width / geometry.clipWidth;
            let painted = 0;
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const cx = x / scale;
                    const cy = y / scale;
                    const inside =
                        cx >= geometry.pad && cx < geometry.pad + geometry.width && cy >= geometry.pad && cy < geometry.pad + geometry.height;
                    if (inside) continue;
                    const i = (y * canvas.width + x) * 4;
                    // A tolerance of 12, because the ring is antialiased
                    // against the ground at both of its edges.
                    if (Math.abs(px[i] - want[0]) < 12 && Math.abs(px[i + 1] - want[1]) < 12 && Math.abs(px[i + 2] - want[2]) < 12) {
                        painted++;
                    }
                }
            }
            return painted;
        },
        [shot.toString('base64'), ring, { pad, width: box.width, height: box.height, clipWidth: clip.width }],
    );
}
