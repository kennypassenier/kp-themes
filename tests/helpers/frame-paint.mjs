// What a plate's frame reads as on screen, whatever it is drawn with
// [suite triage 10.0.0, row 25; fix-101].
//
// A theme's character decides HOW a plate is framed: a border (the base), a
// 1 px line in a background gradient (blueprint, terminal), a gradient rail and
// a glow (synthwave), a hairline in gold at 30 % (deco). A test that reads
// `border-top-color` knows only the first and reads "1.00:1" from a transparent
// border on the others. This reads the paint: it screenshots the plate with a
// band around it, takes the page ground from the band's outer ring and the
// plate from a ring a few pixels inside the edge, and reports how well the
// best pixel of each side's edge zone reads against both, as a median along
// the side (a stray pixel does not make a frame; a corner ornament does not
// count) and the best side overall.

/** The band outside the box, in CSS px. */
export const PAD = 6;

/**
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Locator} plate
 * @returns {Promise<{ ratio: number, ground: number[], face: number[], sides: Record<string, number> }>}
 */
export async function paintedFrame(page, plate) {
    await plate.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' }));
    await page.waitForTimeout(150);
    const box = await plate.boundingBox();
    if (!box) throw new Error('the plate has no box');
    const clip = { x: box.x - PAD, y: box.y - PAD, width: box.width + PAD * 2, height: box.height + PAD * 2 };
    const png = await page.screenshot({ clip, animations: 'disabled' });
    return page.evaluate(
        async ([data, g]) => {
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
            const px = ctx.getImageData(0, 0, img.width, img.height).data;
            const scale = img.width / g.clipWidth;
            /** A pixel at CSS offsets from the plate's top-left corner. @param {number} cx @param {number} cy */
            const at = (cx, cy) => {
                const x = Math.min(img.width - 1, Math.max(0, Math.floor((cx + g.pad) * scale)));
                const y = Math.min(img.height - 1, Math.max(0, Math.floor((cy + g.pad) * scale)));
                const i = (y * img.width + x) * 4;
                return [px[i], px[i + 1], px[i + 2]];
            };
            /** @param {number[][]} list */
            const median = (list) => [0, 1, 2].map((c) => [...list.map((p) => p[c])].sort((a, b) => a - b)[Math.floor(list.length / 2)]);
            /** @param {number[]} c */
            const lum = (c) => {
                const [r, gr, b] = c.map((v) => (v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4));
                return 0.2126 * r + 0.7152 * gr + 0.0722 * b;
            };
            /** @param {number[]} a @param {number[]} b */
            const ratio = (a, b) => {
                const [x, y] = [lum(a), lum(b)];
                return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
            };
            const { w, h } = g;
            const corner = 10;
            /** The ring `d` CSS px from the edge (negative: outside). @param {number} d */
            const ring = (d) => {
                const list = [];
                for (let t = corner; t < w - corner; t += 2) list.push(at(t, d), at(t, h - 1 - d));
                for (let t = corner; t < h - corner; t += 2) list.push(at(d, t), at(w - 1 - d, t));
                return median(list);
            };
            const ground = ring(-4);
            const face = ring(7);
            /** The edge zone, from 3 px outside to 4 px inside. */
            const depths = [-3, -2, -1, 0, 1, 2, 3, 4];
            /** @param {(depth: number, t: number) => number[]} read @param {number} length */
            const side = (read, length) => {
                /** @type {number[]} */
                const scores = [];
                for (let t = corner; t < length - corner; t += 1) {
                    scores.push(Math.max(...depths.map((d) => Math.min(ratio(read(d, t), ground), ratio(read(d, t), face)))));
                }
                return scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)];
            };
            const sides = {
                top: side((d, t) => at(t, d), w),
                bottom: side((d, t) => at(t, h - 1 - d), w),
                start: side((d, t) => at(d, t), h),
                end: side((d, t) => at(w - 1 - d, t), h),
            };
            return { ratio: Math.max(...Object.values(sides)), ground, face, sides };
        },
        [png.toString('base64'), { w: box.width, h: box.height, clipWidth: clip.width, pad: PAD }],
    );
}
