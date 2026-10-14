// What a focus ring paints on screen, read the same way in every theme
// [fix-38, DI2; suite triage 10.0.0, focus rows].
//
// A theme's character decides HOW focus is drawn: an outline plus two shadow
// layers (the base), an edge bar (formal), corner brackets (cyberpunk), a
// cursor ring on a pseudo-element (terminal, solstice, phantom, deco). A test
// that reads the declared outline and box-shadow only knows the first, so
// this reads the paint: it screenshots the control with a band around it
// focused and again at rest, and reports, per side, the share of positions
// along it where a pixel moved. Moved at both ends of a side counts too (a
// bracket at each corner), so a ring made of corner marks passes while an
// underline or a readout, which changes one side only, does not.

/** The band outside the box, in CSS px. */
export const PAD = 6;
/** How far inside the box's edge the band reaches, in CSS px: a ring drawn inside (grotesk's primary: 2px outline, 2px inner ring) sits 1-4px in, plus a sub-pixel box. */
export const EDGE = 5;
/** A pixel has changed when one channel moved at least this far (0..255). */
export const CHANNEL = 32;
/** The share of each side that must change. */
export const COVERAGE = 0.5;


/**
 * Compare two PNG screenshots of the same clip in the page and read the
 * band around the box.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Buffer} a
 * @param {Buffer} b
 * @param {{ width: number, height: number, clipWidth: number }} geometry box size and clip width in CSS px
 */
export const band = (page, a, b, geometry) =>
    page.evaluate(
        async ([one, two, g]) => {
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
                const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d', { willReadFrequently: true }));
                ctx.drawImage(img, 0, 0);
                return { w: img.width, h: img.height, data: ctx.getImageData(0, 0, img.width, img.height).data };
            };
            const [p, q] = await Promise.all([pixels(one), pixels(two)]);
            const scale = p.w / g.clipWidth;
            const sides = { top: new Set(), bottom: new Set(), start: new Set(), end: new Set() };
            let outside = 0;
            let edge = 0;
            let inner = 0;
            for (let y = 0; y < p.h; y++) {
                for (let x = 0; x < p.w; x++) {
                    const i = (y * p.w + x) * 4;
                    const moved = Math.max(
                        Math.abs(p.data[i] - q.data[i]),
                        Math.abs(p.data[i + 1] - q.data[i + 1]),
                        Math.abs(p.data[i + 2] - q.data[i + 2]),
                    );
                    if (moved < g.channel) continue;
                    // Position relative to the box, in CSS px.
                    const cx = x / scale - g.pad;
                    const cy = y / scale - g.pad;
                    const inX = cx >= 0 && cx < g.width;
                    const inY = cy >= 0 && cy < g.height;
                    const inside = inX && inY;
                    const nearTop = cy < g.edge;
                    const nearBottom = cy >= g.height - g.edge;
                    const nearStart = cx < g.edge;
                    const nearEnd = cx >= g.width - g.edge;
                    if (inside && !(nearTop || nearBottom || nearStart || nearEnd)) {
                        inner++;
                        continue;
                    }
                    if (inside) edge++;
                    else outside++;
                    const col = Math.floor(Math.min(Math.max(cx, 0), g.width - 1));
                    const row = Math.floor(Math.min(Math.max(cy, 0), g.height - 1));
                    if (nearTop) sides.top.add(col);
                    if (nearBottom) sides.bottom.add(col);
                    if (nearStart) sides.start.add(row);
                    if (nearEnd) sides.end.add(row);
                }
            }
            const share = (/** @type {Set<number>} */ s, /** @type {number} */ n) => Math.round((s.size / Math.max(1, Math.floor(n))) * 100) / 100;
            // A theme may draw its ring as marks at the corners (cyberpunk's
            // brackets) rather than along the whole side: such a side changed at
            // BOTH of its ends. An underline or a readout changes one side only,
            // so it still has no ring on the other three.
            const ends = (/** @type {Set<number>} */ s, /** @type {number} */ n) => {
                const quarter = Math.max(1, Math.floor(n / 4));
                const list = [...s];
                return list.some((v) => v < quarter) && list.some((v) => v >= Math.floor(n) - quarter);
            };
            return {
                corners: {
                    top: ends(sides.top, g.width),
                    bottom: ends(sides.bottom, g.width),
                    start: ends(sides.start, g.height),
                    end: ends(sides.end, g.height),
                },
                outside,
                inner,
                edge,
                top: share(sides.top, g.width),
                bottom: share(sides.bottom, g.width),
                start: share(sides.start, g.height),
                end: share(sides.end, g.height),
            };
        },
        [a.toString('base64'), b.toString('base64'), { ...geometry, pad: PAD, edge: EDGE, channel: CHANNEL }],
    );


/**
 * The sides of a band read that show no ring: fewer than COVERAGE of the
 * positions moved and no mark at both ends.
 * @param {{ top: number, bottom: number, start: number, end: number, corners: Record<string, boolean> }} read
 * @returns {string[]}
 */
export const thinSides = (read) =>
    /** @type {const} */ (['top', 'bottom', 'start', 'end']).filter((side) => read[side] < COVERAGE && !read.corners[side]);

/** Moved pixels, outside the box and in its edge band, that count as "focus painted something". */
export const MIN_MOVED = 8;

/**
 * Whether focus painted anything at all around the control, whatever shape:
 * a ring, an edge bar, brackets, a fill at the edge. For a control inside a
 * popover, where the question is "does the focus mark survive the box it sits
 * in" rather than "is it a ring on four sides".
 * @param {{ outside: number, edge: number, inner: number }} read
 */
export const paints = (read) => read.outside + read.edge + read.inner >= MIN_MOVED;

/**
 * Whether the focused control shows a ring on all four sides, read from paint.
 * The control must hold focus now; it holds focus again when this returns.
 *
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Locator} control
 * @param {{ settleMs?: number }} [options] settleMs: let a theme switch's transitions finish first
 */
export async function paintedRing(page, control, { settleMs = 200 } = {}) {
    // In the middle of the window: at its edge the band is cut off (the clip must lie inside the viewport).
    await control.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' }));
    await page.waitForTimeout(settleMs);
    const box = await control.boundingBox();
    if (!box) throw new Error('the control has no box');
    const clip = { x: box.x - PAD, y: box.y - PAD, width: box.width + PAD * 2, height: box.height + PAD * 2 };
    const focused = await page.screenshot({ clip, animations: 'disabled' });
    await control.evaluate((el) => /** @type {HTMLElement} */ (el).blur());
    await page.waitForTimeout(100);
    const rest = await page.screenshot({ clip, animations: 'disabled' });
    // Back onto the control, by script: the page has seen no pointer, so it is a
    // keyboard-like focus and :focus-visible matches again.
    await control.focus();
    const read = await band(page, focused, rest, { width: box.width, height: box.height, clipWidth: clip.width });
    return { read, thin: thinSides(read) };
}
