// The meter with a mark [scope-143]: spec C7 items 1 to 4 and C5
// (research/dashboard-ports-2/README.md, section 2), on the catalogue's block
// catalogue/data.html#meter. The words and the arithmetic are
// gates/meter.test.mjs; this is what the browser draws.
//
// Kenny's picks (2026-10-05): the mark is a tick across the bar, and past
// the end a small ▸ sits at the end; the notch and the hatch are gone.
import { expect, test } from '@playwright/test';

const PAGE = '/catalogue/data.html#meter';

/** @param {import('@playwright/test').Page} page */
const ready = async (page) => {
    await page.goto(PAGE);
    await page.waitForSelector('html[data-kp-auto-ready]', { state: 'attached' });
    // demos.js copies the tiles into the phone pane once js/kpi.js is in.
    await page.waitForSelector('[data-cat-meter-phone] .kp-kpis');
};

test('the fill, the tick, past the end and the tone, through setMeter() (C7.1–C7.3) [scope-143]', { tag: ['@component:data'] }, async ({ page }) => {
    await ready(page);
    // C7.1: a 200 px meter fills 124 px for 0.62; its mark at 0.8 is centred at 160 px, 3 px above and below.
    const m = await page.evaluate(async () => {
        const { setMeter } = await import('/js/kpi.js');
        const el = document.createElement('span');
        el.className = 'kp-meter';
        el.style.inlineSize = '200px';
        document.querySelector('#meter .cat-stage')?.prepend(el);
        setMeter(el, { value: 0.62, mark: 0.8, label: 'full', markLabel: 'the target level' });
        const box = el.getBoundingClientRect();
        const mark = /** @type {HTMLElement} */ (el.querySelector('.kp-meter__mark')).getBoundingClientRect();
        const out = {
            fill: parseFloat(getComputedStyle(el, '::before').width),
            centre: mark.left + mark.width / 2 - box.left,
            above: box.top - mark.top,
            below: mark.bottom - box.bottom,
            text: el.getAttribute('aria-valuetext'),
        };
        el.remove();
        return out;
    });
    expect(m.fill).toBeCloseTo(124, 1);
    expect(m.centre).toBeCloseTo(160, 1);
    expect([m.above, m.below]).toEqual([3, 3]);
    expect(m.text).toBe('62% full; 80% the target level');

    // C7.2: Book more puts the mark at 1.3, past the end: data-kp-over, a ▸ inside the bar, 130 % in the words.
    const booked = page.locator('[data-cat-meter-tiles] [data-cat-meter-of="booked"]');
    await page.locator('#meter').getByRole('button', { name: 'Book more' }).click();
    await expect(booked.locator('.kp-meter__mark')).toHaveAttribute('data-kp-over', '');
    await expect(booked).toHaveAttribute('aria-valuetext', '93% running; 130% booked for tonight');
    const past = await booked.evaluate((el) => {
        const mark = /** @type {HTMLElement} */ (el.querySelector('.kp-meter__mark'));
        const box = el.getBoundingClientRect();
        const m = mark.getBoundingClientRect();
        return { arrow: getComputedStyle(mark, '::after').content, inside: m.left >= box.left && m.right <= box.right };
    });
    expect(past).toEqual({ arrow: '"▸"', inside: true });

    // C7.3: red inside a destructive tile, amber for a warning meter on its own.
    const fills = await page.evaluate(() => {
        const colour = (/** @type {string} */ value) => {
            const probe = document.createElement('span');
            probe.style.color = value;
            document.body.append(probe);
            const out = getComputedStyle(probe).color;
            probe.remove();
            return out;
        };
        const fill = (/** @type {string} */ sel) =>
            getComputedStyle(/** @type {Element} */ (document.querySelector(sel)), '::before').backgroundColor;
        return [
            [fill('[data-cat-meter-tiles] [data-cat-meter-of="booked"]'), colour('var(--destructive)')],
            [fill('[data-cat-meter-rows] .kp-meter[data-kp-tone="warning"]'), colour('var(--warning-foreground)')],
        ];
    });
    for (const [got, want] of fills) expect(got).toBe(want);
});

test('every state keeps the height; the inline meter sits on its line (C5, C7.4) [scope-143]', { tag: ['@component:data'] }, async ({ page }) => {
    await ready(page);
    /** Every meter's height in the block, the table's and the tiles'. */
    const heights = () =>
        page.evaluate(() =>
            [...document.querySelectorAll('#meter .kp-meter:not(.kp-meter--inline), #meter .kp-kpi__meter')].map(
                (m) => m.getBoundingClientRect().height,
            ),
        );
    const filled = await heights();
    expect(new Set(filled).size, `with a mark, without, past the end, empty: ${filled.join(', ')}`).toBe(1);

    // C7.4: the inline meter's middle on the line's middle, as vertical-align: middle puts it.
    const off = await page.evaluate(() => {
        const meter = /** @type {HTMLElement} */ (document.querySelector('[data-cat-meter-tiles] .kp-meter--inline'));
        const probe = document.createElement('span');
        probe.style.cssText = 'display: inline-block; inline-size: 0; block-size: 0; vertical-align: middle';
        meter.after(probe);
        const m = meter.getBoundingClientRect();
        const p = probe.getBoundingClientRect();
        probe.remove();
        return m.top + m.height / 2 - p.top;
    });
    expect(Math.abs(off)).toBeLessThanOrEqual(0.5);

    // Loading: the same height, no fill and no mark, busy.
    const button = page.locator('#meter').getByRole('button', { name: 'Loading', exact: true });
    await button.click();
    expect(await heights()).toEqual(filled);
    const loading = await page.locator('[data-cat-meter-tiles] [data-cat-meter-of="reservoir"]').evaluate((m) => ({
        busy: m.getAttribute('aria-busy'),
        fill: getComputedStyle(m, '::before').display,
        mark: getComputedStyle(/** @type {Element} */ (m.querySelector('.kp-meter__mark'))).display,
    }));
    expect(loading).toEqual({ busy: 'true', fill: 'none', mark: 'none' });

    // Pressed again, every row reads what its markup said before the script.
    await button.click();
    const rows = await page.evaluate(() =>
        [...document.querySelectorAll('[data-cat-meter-rows] tr')].map((row) => [
            row.querySelector('.kp-meter')?.getAttribute('aria-valuetext'),
            row.lastElementChild?.textContent,
        ]),
    );
    for (const [text, words] of rows) expect(text).toBe(words);
    expect(rows.map(([text]) => text)).toContain('112% of the plan used');
});
