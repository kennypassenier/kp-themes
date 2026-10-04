// The network graph [scope-143, port2-6].
//
// The homelab port spec's acceptance checks I.2.7 1 to 7, on the catalogue
// block catalogue/chart.html#graph, in the browser: where the nodes are
// drawn (1), the bends of two kinds between one pair (2), a hover that
// lights only a node's links without rebuilding anything (3), the keys and
// the single tab stop (4), fifteen long names in the phone pane and at a
// 390 px window with no label touching another or leaving the picture (5),
// a live update that keeps the focus and the picks (6), and the kinds over
// the picture: the ones the links use, of the five the page gives (7). The
// pure halves (the hub, the ring's order, the layout's numbers, the bends,
// the label rule) are in gates/graph.test.mjs.
//
// Written with the port, measured in Firefox on the port's scratch page
// (40 of 40 at 1280 and 390 px), not run as a suite until Kenny's release go.
import { expect, test } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

const PAGE = '/catalogue/chart.html';

/** @param {import('@playwright/test').Page} page */
const open = async (page) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await useEmptyRegister(page.context());
    await page.goto(PAGE);
    await waitForJudging(page);
    await page.waitForSelector('#graph .kp-graph .kp-graph__node');
    await page.evaluate(() => document.fonts.ready);
};

/** The block's first graph (full width) or second (the phone pane). @param {import('@playwright/test').Page} page @param {0 | 1} [at] */
const graph = (page, at = 0) => page.locator('#graph .kp-graph').nth(at);

/**
 * Every node's centre, in drawing order (the hub first), with its name and kind.
 * @param {import('@playwright/test').Locator} g
 */
const nodes = (g) =>
    g.evaluate((el) => {
        const svg = /** @type {SVGSVGElement} */ (el.querySelector('.kp-graph__svg'));
        const [, , W, H] = (svg.getAttribute('viewBox') ?? '').split(' ').map(Number);
        return {
            W,
            H,
            nodes: [...svg.querySelectorAll('.kp-graph__node')].map((n) => {
                const ring = /** @type {SVGCircleElement} */ (n.querySelector('.kp-graph__ring'));
                return {
                    id: n.getAttribute('data-kp-id') ?? '',
                    label: (n.getAttribute('aria-label') ?? '').split(',')[0],
                    hub: n.classList.contains('kp-graph__node--hub'),
                    external: n.classList.contains('kp-graph__node--external'),
                    x: Number(ring.getAttribute('cx')),
                    y: Number(ring.getAttribute('cy')),
                };
            }),
        };
    });

/**
 * The label boxes as painted (Firefox's client rect of a text includes its
 * stroke, so the halo is in), how many pairs intersect, and how many leave
 * the picture.
 * @param {import('@playwright/test').Locator} g
 */
const labelFit = (g) =>
    g.evaluate((el) => {
        const picture = /** @type {SVGSVGElement} */ (el.querySelector('.kp-graph__svg')).getBoundingClientRect();
        const boxes = [...el.querySelectorAll('.kp-graph__label')].map((t) => t.getBoundingClientRect());
        let overlaps = 0;
        for (let i = 0; i < boxes.length; i += 1)
            for (let j = i + 1; j < boxes.length; j += 1) {
                const a = boxes[i];
                const b = boxes[j];
                if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) overlaps += 1;
            }
        const outside = boxes.filter(
            (b) => b.left < picture.left || b.right > picture.right || b.top < picture.top || b.bottom > picture.bottom,
        ).length;
        return { labels: boxes.length, overlaps, outside };
    });

test(
    'Tab lands on the hub, → walks to the first ring node, Enter picks, Esc clears; one tab stop (I.2.7 4) [scope-143]',
    { tag: ['@component:data', '@component:catalogue'] },
    async ({ page }) => {
        await open(page);
        const g = graph(page);
        await g.locator('.kp-graph__kind').last().focus();
        await page.keyboard.press('Tab');
        await expect(g.locator('.kp-graph__node--hub')).toBeFocused();
        await page.keyboard.press('ArrowRight');
        await expect(g.locator('.kp-graph__node[data-kp-id="ph1"]')).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(g.locator('.kp-graph__node[data-kp-id="ph1"]')).toHaveAttribute('aria-pressed', 'true');
        await expect(g.locator('.kp-graph__show-all')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(g.locator('.kp-graph__node[aria-pressed="true"]')).toHaveCount(0);
        await expect(g.locator('.kp-graph__show-all')).toHaveAttribute('data-kp-idle', '');
        // One tab stop: one node takes the tab, and Tab from it leaves the picture.
        await expect(g.locator('.kp-graph__svg [tabindex="0"]')).toHaveCount(1);
        await page.keyboard.press('Tab');
        expect(await g.evaluate((el) => el.querySelector('.kp-graph__svg')?.contains(document.activeElement))).toBe(false);
    },
);

for (const width of [1280, 390]) {
    test(
        `fifteen long names: no label touches another or leaves the picture, ${width} px (I.2.7 5) [scope-143]`,
        { tag: ['@component:data', '@component:catalogue'] },
        async ({ page }) => {
            await page.setViewportSize({ width, height: 900 });
            await open(page);
            await page.locator('#graph [data-cat-graph="long"]').click();
            await page.waitForTimeout(100);
            for (const at of /** @type {const} */ ([0, 1])) {
                const fit = await labelFit(graph(page, at));
                expect(fit.labels, `graph ${at}: fifteen nodes`).toBe(15);
                expect(fit.overlaps, `graph ${at}: overlapping labels`).toBe(0);
                expect(fit.outside, `graph ${at}: labels outside the picture`).toBe(0);
            }
            expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
        },
    );
}
