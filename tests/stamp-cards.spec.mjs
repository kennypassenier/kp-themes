// The stamp lands on every labelled card and keeps off its title [scope-98].
//
// Kenny, 2026-09-15, stamp-cards "Op elke kaart met een label". Formal and
// pastel print a card's `data-kp-label` as a stamp on `::before`, absolutely
// positioned — and only the dossier (`data-kp-reveal="emphasis"`) was
// `position: relative`, so on any other labelled card the stamp was placed
// against whatever ancestor happened to be positioned, and in pastel's narrow
// dossier on its portrait the plate lay over the title.
//
// What this reads is the paint [KT13]: the card and its surroundings are
// screenshotted as they are and again with only the stamp made transparent
// (layout untouched); the pixels that differ are the stamp. That box must lie
// inside the card's box and must not intersect the title's box — on every
// labelled card the catalogue's dossier and the two portraits show, and on a
// plain labelled card of the package's own markup at three widths, a long
// word and a long title, the narrowest below the portraits' narrowest card.
//
// Made to fail first [KT3], 2026-09-15, firefox, on db797b69's registers:
// the fixture's stamp painted outside the card in both themes at every width
// (formal and pastel alike, the plate against the stage, not the card), and
// pastel's portrait dossiers at 1280px had the plate over the title.

import { expect, test } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

const THEMES = ['formal', 'pastel'];
const WIDTHS = [220, 360, 640];
/** How far around the card the screenshot reaches, so a stamp placed off the card is still seen. */
const MARGIN = 160;

const PROBE_CSS = `
    *, *::before, *::after { transition: none !important; animation: none !important; }
    .kp-card[data-probe-stamp]::before { opacity: 0 !important; }
`;

/**
 * The stamp's painted box and the title's box of one card, in page pixels.
 * @param {import('@playwright/test').Locator} card
 */
async function measure(card) {
    const page = card.page();
    await card.scrollIntoViewIfNeeded();
    const boxes = await card.evaluate((el) => {
        const r = el.getBoundingClientRect();
        const t = el.querySelector('.kp-card__title')?.getBoundingClientRect();
        const box = (/** @type {DOMRect} */ b) => ({
            left: b.left + scrollX,
            top: b.top + scrollY,
            right: b.right + scrollX,
            bottom: b.bottom + scrollY,
        });
        return { card: box(r), title: t ? box(t) : null, label: el.getAttribute('data-kp-label') };
    });
    const clip = {
        x: Math.max(0, Math.floor(boxes.card.left - MARGIN)),
        y: Math.max(0, Math.floor(boxes.card.top - MARGIN)),
        width: 0,
        height: 0,
    };
    const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    clip.width = Math.min(docWidth, Math.ceil(boxes.card.right + MARGIN)) - clip.x;
    clip.height = Math.ceil(boxes.card.bottom + MARGIN) - clip.y;
    const shot = async () => (await page.screenshot({ clip, fullPage: true, animations: 'disabled', caret: 'hide' })).toString('base64');
    const withStamp = await shot();
    await card.evaluate((el) => el.setAttribute('data-probe-stamp', ''));
    const without = await shot();
    await card.evaluate((el) => el.removeAttribute('data-probe-stamp'));
    const diff = await page.evaluate(
        async ([a, b]) => {
            /** @param {string} b64 */
            const load = async (b64) => {
                const bitmap = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
                const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
                const ctx = /** @type {OffscreenCanvasRenderingContext2D} */ (canvas.getContext('2d'));
                ctx.drawImage(bitmap, 0, 0);
                return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
            };
            const [one, two] = await Promise.all([load(a), load(b)]);
            let box = null;
            for (let y = 0; y < Math.min(one.height, two.height); y++) {
                for (let x = 0; x < Math.min(one.width, two.width); x++) {
                    const i = (y * one.width + x) * 4;
                    const j = (y * two.width + x) * 4;
                    const d =
                        Math.abs(one.data[i] - two.data[j]) +
                        Math.abs(one.data[i + 1] - two.data[j + 1]) +
                        Math.abs(one.data[i + 2] - two.data[j + 2]);
                    if (d <= 24) continue;
                    if (!box) box = { left: x, top: y, right: x + 1, bottom: y + 1 };
                    box.left = Math.min(box.left, x);
                    box.top = Math.min(box.top, y);
                    box.right = Math.max(box.right, x + 1);
                    box.bottom = Math.max(box.bottom, y + 1);
                }
            }
            return box;
        },
        [withStamp, without],
    );
    const stamp = diff && { left: diff.left + clip.x, top: diff.top + clip.y, right: diff.right + clip.x, bottom: diff.bottom + clip.y };
    return { ...boxes, stamp };
}

/**
 * What is wrong with one card's stamp, as sentences; none when it lands.
 * @param {string} where
 * @param {Awaited<ReturnType<typeof measure>>} m
 */
function faultsOf(where, m) {
    const px = (/** @type {{left:number,top:number,right:number,bottom:number}} */ b) =>
        `${Math.round(b.left)},${Math.round(b.top)} → ${Math.round(b.right)},${Math.round(b.bottom)}`;
    if (!m.stamp) return [`${where}: no stamp painted within ${MARGIN}px of the card ${px(m.card)}`];
    const faults = [];
    const slack = 0.5;
    const inside =
        m.stamp.left >= m.card.left - slack &&
        m.stamp.top >= m.card.top - slack &&
        m.stamp.right <= m.card.right + slack &&
        m.stamp.bottom <= m.card.bottom + slack;
    if (!inside) faults.push(`${where}: the stamp ${px(m.stamp)} is not inside the card ${px(m.card)}`);
    if (m.title) {
        const meets = m.stamp.left < m.title.right && m.stamp.right > m.title.left && m.stamp.top < m.title.bottom && m.stamp.bottom > m.title.top;
        if (meets) faults.push(`${where}: the stamp ${px(m.stamp)} lies over the title ${px(m.title)}`);
    }
    return faults;
}

/** @param {import('@playwright/test').Page} page */
const quiet = async (page) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 900 });
};

for (const theme of THEMES) {
    test.describe(
        `${theme}: the stamp lands on every labelled card, off its title [scope-98]`,
        { tag: [`@theme:${theme}`, '@component:page-effects', '@component:catalogue'] },
        () => {
            test.beforeEach(async ({ context }) => {
                await useEmptyRegister(context);
            });

            test('every labelled card on the dossier block and on the portrait', async ({ page }) => {
                await quiet(page);
                const faults = [];
                let seen = 0;
                for (const url of ['/catalogue/page-effects.html', `/research/theme-portraits/${theme}.html`]) {
                    await page.goto(url);
                    await waitForJudging(page);
                    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
                    await page.addStyleTag({ content: PROBE_CSS });
                    const cards = page.locator('.kp-card[data-kp-label]');
                    const count = await cards.count();
                    for (let i = 0; i < count; i++) {
                        const card = cards.nth(i);
                        if (!(await card.isVisible())) continue;
                        seen++;
                        faults.push(...faultsOf(`${url} card ${i}`, await measure(card)));
                    }
                }
                // Three dossiers on the catalogue page, at least three on the portrait.
                expect(seen, 'labelled cards measured').toBeGreaterThanOrEqual(6);
                expect(faults).toEqual([]);
            });

            test('a plain labelled card of the package’s markup, at three widths', async ({ page }) => {
                await quiet(page);
                await page.goto('/catalogue/page-effects.html');
                await waitForJudging(page);
                await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
                await page.addStyleTag({ content: PROBE_CSS });
                const faults = [];
                for (const width of WIDTHS) {
                    await page.evaluate((w) => {
                        document.querySelector('[data-probe-fixture]')?.remove();
                        const holder = document.createElement('div');
                        holder.setAttribute('data-probe-fixture', '');
                        holder.style.cssText = `inline-size: ${w}px; margin: 200px auto;`;
                        holder.innerHTML =
                            '<div class="kp-card" data-slot="card" data-kp-label="Proof approved"><div class="kp-card__header"><h3 class="kp-card__title">Handover for pump house four</h3></div><div class="kp-card__body"><p>Two readings are still open.</p></div></div>';
                        document.querySelector('main')?.prepend(holder);
                    }, width);
                    faults.push(...faultsOf(`fixture at ${width}px`, await measure(page.locator('[data-probe-fixture] .kp-card'))));
                }
                expect(faults).toEqual([]);
            });
        },
    );
}
