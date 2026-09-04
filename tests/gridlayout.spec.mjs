// Movable grid layout [TH56].
//
// Dragging is the easy half and the one everyone builds. This suite drives
// the keyboard, because a drag-only dashboard is a dashboard some people
// simply cannot arrange.

import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/components.html';

const CHANNELS = [
    { name: 'framework-free', tile: '[data-test="tile-cpu"]' },
    { name: 'React', tile: '[data-test="react-grid"] [data-kp-tile="cpu"]' },
];

for (const channel of CHANNELS) {
    test.describe(`grid — ${channel.name}`, () => {
        test('the arrow keys move a tile [TH56]', async ({ page }) => {
            await page.goto(URL);
            const tile = page.locator(channel.tile);
            await tile.focus();
            await tile.press('ArrowRight');
            await expect(tile).toHaveAttribute('data-x', '1');
            await tile.press('ArrowDown');
            await expect(tile).toHaveAttribute('data-y', '1');
        });

        test('Shift and the arrow keys resize it [TH56]', async ({ page }) => {
            await page.goto(URL);
            const tile = page.locator(channel.tile);
            await tile.focus();
            await tile.press('Shift+ArrowRight');
            await expect(tile).toHaveAttribute('data-w', '3');
            await tile.press('Shift+ArrowDown');
            await expect(tile).toHaveAttribute('data-h', '2');
        });

        test('a tile cannot be pushed off the grid [TH56]', async ({ page }) => {
            await page.goto(URL);
            const tile = page.locator(channel.tile);
            await tile.focus();
            for (let i = 0; i < 10; i += 1) await tile.press('ArrowRight');
            // Six columns, two wide: the furthest left edge is column index 4. A
            // tile in column nine is one nobody can see and nobody can get back.
            await expect(tile).toHaveAttribute('data-x', '4');
            for (let i = 0; i < 5; i += 1) await tile.press('ArrowLeft');
            await expect(tile).toHaveAttribute('data-x', '0');
        });

        test('a tile says where it is, in words [TH56]', async ({ page }) => {
            await page.goto(URL);
            const tile = page.locator(channel.tile);
            // A tile that only announces itself by moving is one nobody without
            // sight can arrange.
            await expect(tile).toHaveAttribute('aria-label', 'CPU, kolom 1, rij 1, 2 bij 1');
            await tile.focus();
            await tile.press('ArrowRight');
            await expect(tile).toHaveAttribute('aria-label', 'CPU, kolom 2, rij 1, 2 bij 1');
        });

        test('the whole layout is handed to the consumer [TH56]', async ({ page }) => {
            test.skip(channel.name === 'React', 'the React grid hands the layout to an onLayout prop, not to a DOM event');
            await page.goto(URL);
            await page.evaluate(() => {
                window.__layout = null;
                document.addEventListener('kp-grid-layout', (event) => {
                    window.__layout = event.detail.layout;
                });
            });
            const tile = page.locator(channel.tile);
            await tile.focus();
            await tile.press('ArrowRight');
            // The numbers, not a style string: reading a layout back out of inline
            // CSS is how a dashboard loses someone's arrangement.
            expect(await page.evaluate(() => window.__layout)).toEqual([
                { id: 'cpu', x: 1, y: 0, w: 2, h: 1 },
                { id: 'ram', x: 2, y: 0, w: 2, h: 1 },
            ]);
        });
    });
}
