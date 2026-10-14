// Contrast is a guideline, not a gate (Kenny, form v44; fix-104).
//
// A reading below a contrast floor no longer fails a test: it is written to
// the test's annotations, which the reporter prints beside the result. A test
// keeps every other check as hard as it was.

/**
 * Report one low contrast reading as an annotation of the running test.
 *
 * @param {{ annotations: { type: string, description?: string }[] }} info `test.info()`
 * @param {string} line what was read and the ratio, e.g. `formal h1 on app: 3.80:1`
 */
export const reportContrast = (info, line) => {
    info.annotations.push({ type: 'contrast guideline', description: line });
};

/**
 * Report every line of a list of low readings.
 *
 * @param {{ annotations: { type: string, description?: string }[] }} info `test.info()`
 * @param {string[]} lines
 */
export const reportContrastAll = (info, lines) => {
    for (const line of lines) reportContrast(info, line);
};

/**
 * The ground a box actually paints: the colour most of its pixels have, the
 * glyphs being the few. Read from a screenshot, so a plate drawn by a layer the
 * element's own `background-color` does not show (a gradient, a pseudo-element)
 * still counts.
 *
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Locator} box
 * @returns {Promise<number[]>} rgb 0..255
 */
export const paintedGroundOf = async (page, box) => {
    const shot = await box.screenshot({ animations: 'disabled', caret: 'hide' });
    return page.evaluate(async (data) => {
        const img = new Image();
        img.src = `data:image/png;base64,${data}`;
        await img.decode();
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d', { willReadFrequently: true }));
        ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, img.width, img.height).data;
        /** @type {Map<string, { n: number, sum: number[] }>} */
        const buckets = new Map();
        for (let i = 0; i < d.length; i += 4) {
            const key = `${d[i] >> 4},${d[i + 1] >> 4},${d[i + 2] >> 4}`;
            const b = buckets.get(key) ?? { n: 0, sum: [0, 0, 0] };
            b.n += 1;
            for (let c = 0; c < 3; c++) b.sum[c] += d[i + c];
            buckets.set(key, b);
        }
        const [top] = [...buckets.values()].sort((a, b) => b.n - a.n);
        return top.sum.map((v) => Math.round(v / top.n));
    }, shot.toString('base64'));
};
