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
 * Reach an element with the keyboard, by CSS selector.
 *
 * Measured in both browsers on 2026-09-08 (G15): a bare
 * `element.focus()` DOES make `:focus-visible` match — chromium and
 * firefox both treat a script focus of a page that has seen no pointer
 * input as keyboard-like. What suppresses the ring is a pointer
 * interaction BEFORE the focus: click anywhere first and the same
 * `focus()` leaves `:focus-visible` unmatched. An earlier comment here
 * claimed the opposite and is refuted.
 *
 * The keyboard path is still the one to use, for a different reason: a
 * `locator.focus()` on something that cannot take focus resolves
 * happily and leaves focus where it was, so the test then reads the
 * RESTING state of an element it believes it focused and passes. Tabbing
 * cannot do that quietly — this throws when it never arrives.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 * @param {number} [limit]
 */
export async function tabToSelector(page, selector, limit = 60) {
    for (let i = 0; i < limit; i++) {
        await page.keyboard.press('Tab');
        if (await page.evaluate((s) => document.activeElement?.matches(s) ?? false, selector)) return;
    }
    throw new Error(`could not reach ${selector} with Tab`);
}

/**
 * Reach an element with the keyboard, by its `data-test` id.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} testId
 * @param {number} [limit]
 */
export const tabTo = (page, testId, limit = 40) => tabToSelector(page, `[data-test="${testId}"]`, limit);

/** Wear a theme. @param {import('@playwright/test').Page} page @param {string} theme */
export const wearTheme = async (page, theme) => {
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    // A theme that transitions its shadow or its plate (brutalism, whose
    // approved demo does — S49, A6) is still mid-flight for --fx-duration
    // after the switch, and a ring read now is a ring half-painted.
    await page.evaluate(
        () =>
            new Promise((resolve) => {
                const declared = getComputedStyle(document.documentElement).getPropertyValue('--fx-duration').trim();
                const value = Number.parseFloat(declared) || 0;
                const ms = declared.endsWith('ms') || value === 0 ? value : value * 1000;
                setTimeout(resolve, ms + 40);
            }),
    );
};

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
export const indicator = (page, testId) => indicatorFor(page, `[data-test="${testId}"]`);

/**
 * The same measurement as `indicator()`, on any CSS selector — the
 * register suites measure controls the concept page never gave a
 * `data-test` id.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 */
export const indicatorFor = (page, selector) =>
    page.evaluate((sel) => {
        const el = /** @type {HTMLElement} */ (document.querySelector(sel));
        if (!el) throw new Error(`no element matches ${sel}`);
        const s = getComputedStyle(el);
        // --focus-ring is authored as hsl() and a computed box-shadow is
        // rgb(): comparing the two as strings never matches, so the token
        // is resolved through a probe before it is compared.
        const probe = document.createElement('span');
        probe.style.color = 'var(--focus-ring)';
        document.body.append(probe);
        const ring = getComputedStyle(probe).color;
        probe.remove();
        probe.style.color = 'var(--focus-ring-contrast)';
        document.body.append(probe);
        const ringContrast = getComputedStyle(probe).color;
        probe.remove();
        // The same element, unfocused, read WITHOUT moving focus: a clone
        // carries the classes and sits under the same theme, and it can
        // never be the active element. Without this baseline a theme whose
        // own decoration happens to be --focus-ring-coloured scores a ring
        // it does not have -- which is exactly how retro passed for two
        // rounds [AR30 as amended 2026-09-07].
        const clone = /** @type {HTMLElement} */ (el.cloneNode(true));
        clone.removeAttribute('data-test');
        clone.setAttribute('aria-hidden', 'true');
        clone.tabIndex = -1;
        el.parentElement?.append(clone);
        const idle = getComputedStyle(clone);
        const unfocused = { outlineStyle: idle.outlineStyle, boxShadow: idle.boxShadow };
        clone.remove();
        return {
            focused: el === document.activeElement,
            outlineStyle: s.outlineStyle,
            outlineWidth: Number.parseFloat(s.outlineWidth),
            outlineColor: s.outlineColor,
            boxShadow: s.boxShadow,
            ring,
            ringContrast,
            unfocused,
        };
    }, selector);

/**
 * True when both halves of the ring are declared on what `indicator()`
 * read: an outline of at least 2px, and a box-shadow layer with a real
 * SPREAD, one in --focus-ring and the other in --focus-ring-contrast.
 *
 * The spread rather than any length, because brutalism's offset shadow
 * is 4px 4px in a colour that happens to equal its --focus-ring: an
 * offset is not a ring.
 *
 * EITHER ORDER passes [S49, A5 of 2026-09-08]. The base layer puts the
 * contrast colour outside and the ring colour inside; brutalism's,
 * retro's and phantom's approved demos put them the other way round, and
 * DI2's promise — two channels, one of which always clears 3:1 on the
 * surface behind it — holds whichever way they are stacked. What this
 * refuses is the same colour twice, or one channel alone.
 *
 * @param {{ outlineStyle: string, outlineWidth: number, outlineColor?: string, boxShadow: string, ring: string, ringContrast?: string }} found
 */
export function bothHalves(found) {
    /** A ring layer is one in `colour` with a real SPREAD, inset or not. */
    const ringLayer = (/** @type {string} */ colour) =>
        shadowLayers(found.boxShadow).some((layer) => {
            const px = lengths(layer);
            return layer.includes(colour) && px.length >= 4 && px[3] >= 2;
        });

    // An element the register clips cannot show an outline -- clip-path
    // takes it with the corner. Under the bevel the outer half is an
    // inset ring in --focus-ring-contrast instead, which is what the
    // 96-pair contrast measurement of MR-NOTCH was taken for.
    const outline = found.outlineStyle !== 'none' && found.outlineWidth >= 2;
    const outlineIs = (/** @type {string} */ colour) => outline && (found.outlineColor === undefined || found.outlineColor === colour);
    // One channel in each colour, in either order: the outline outside
    // with the shadow inside, or the shadow outside with the outline in.
    const outer =
        (outlineIs(found.ringContrast ?? '\u0000') || ringLayer(found.ringContrast ?? '\u0000')) &&
        (outline || ringLayer(found.ringContrast ?? '\u0000'));
    const inner = outlineIs(found.ring) ? ringLayer(found.ringContrast ?? '\u0000') || outline : ringLayer(found.ring);

    // And whatever is found must actually be the FOCUS doing it. A theme
    // whose decoration is already ring-coloured scores both halves while
    // focusing changes nothing at all: retro's four-layer bevel read
    // identically focused and unfocused, and only this comparison sees it.
    const idle = found.unfocused;
    const changed = !idle || idle.boxShadow !== found.boxShadow || idle.outlineStyle !== found.outlineStyle;

    return { outer, inner, changed };
}

/**
 * The pixels the focus indicator actually paints around an element —
 * or, with `where: 'inside'`, within it. Either is a different question
 * from what its computed style declares.
 *
 * `where` exists because MR-NOTCH put the bevel back on the cyberpunk
 * button and moved its ring inside: a `clip-path` cannot clip what is
 * drawn within the box, and counting outside it would now score zero on
 * a ring that is plainly there.
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
/**
 * What FOCUS adds in painted ring pixels: the count while focused minus
 * the count at rest.
 *
 * A bare count answers the wrong question. Measured on the cyberpunk
 * button at MR-NOTCH: 1591 ring-coloured pixels inside the box while
 * focused, and 171 with nothing focused at all — the gradient's own light
 * band. A `> 0` assertion passes on those 171 whether the ring exists or
 * not, which is exactly what the drill found: removing the rule the test
 * was written for left it green. The difference does not have that
 * problem, because the background is in both terms and cancels.
 *
 * The element must be reachable by `focus()`; this leaves it focused.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} testId
 * @param {{ pad?: number, settleMs?: number, where?: 'outside' | 'inside' }} [options]
 * @returns {Promise<{ focused: number, idle: number, delta: number }>}
 */
export async function paintedFocusDelta(page, testId, options = {}) {
    // `either` is the default because a theme decides which side of the
    // box its ring lives on: under a register that clips the corner it is
    // drawn inside, everywhere else around. A caller that asks "does
    // focus paint a ring on this control" should not have to know which
    // theme it is looking at [MR-NOTCH].
    const sides = options.where ? [options.where] : ['outside', 'inside'];
    const target = page.locator(`[data-test="${testId}"]`);
    /** @type {{ side: string, focused: number, idle: number, delta: number }[]} */
    const runs = [];
    for (const side of sides) {
        await target.focus();
        const focused = await paintedFocusPixels(page, testId, { ...options, where: side });
        await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
        const idle = await paintedFocusPixels(page, testId, { ...options, where: side });
        runs.push({ side, focused, idle, delta: focused - idle });
    }
    await target.focus();
    const best = runs.reduce((a, b) => (b.delta > a.delta ? b : a));
    return { ...best, runs };
}

export async function paintedFocusPixels(page, testId, { pad = 12, settleMs = 400, where = 'outside', colour = 'focus-ring' } = {}) {
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
    const ring = await page.evaluate((token) => {
        const probe = document.createElement('span');
        probe.style.color = `var(--${token})`;
        document.body.append(probe);
        const value = getComputedStyle(probe).color;
        probe.remove();
        return value;
    }, colour);
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
                    if (geometry.where === 'outside' ? inside : !inside) continue;
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
        [shot.toString('base64'), ring, { pad, width: box.width, height: box.height, clipWidth: clip.width, where }],
    );
}
