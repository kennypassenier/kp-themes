// Tree, reorder and split pane [TH45, TH46, TH55].
//
// Each of these is trivial with a mouse, so the mouse is not what this
// suite drives. Every assertion below is a keyboard one, because that is
// the half that is usually missing and the half a test can prove.

import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/components.html';

// Both channels [AR7]. The React tree renders a flat list of treeitems
// from a nested source, the framework-free one attaches to nested markup;
// the keyboard contract has to be identical either way.
const CHANNELS = [
    {
        name: 'framework-free',
        tree: '[data-test="plain-tree"]',
        folder: '[data-test="tree-map"]',
        child: '[data-test="tree-kind"]',
        other: '[data-test="tree-zaak"]',
        reorder: '[data-test="plain-reorder"]',
        handle: '[data-test="handle-a"]',
        separator: '[data-test="plain-separator"]',
    },
    {
        name: 'React',
        tree: '[data-test="react-structure"] .kp-tree',
        folder: '#tree-map',
        child: '#tree-kind',
        other: '#tree-zaak',
        reorder: '[data-test="react-structure"] .kp-reorder',
        handle: '[data-test="react-structure"] [data-kp-item="a"] [data-kp-handle]',
        separator: '[data-test="react-structure"] .kp-split__separator',
    },
];

for (const channel of CHANNELS) {
    test.describe(`tree — ${channel.name} [TH45]`, () => {
        test('the whole tree is one tab stop', async ({ page }) => {
            await page.goto(URL);
            const tree = page.locator(channel.tree);
            // A tree where every node is a tab stop makes a keyboard user
            // press Tab forty times to get past a folder list.
            await expect(tree.locator('[role="treeitem"][tabindex="0"]')).toHaveCount(1);
        });

        test('Right opens a closed branch, then steps into it', async ({ page }) => {
            await page.goto(URL);
            const folder = page.locator(channel.folder);
            await folder.focus();
            await expect(folder).toHaveAttribute('aria-expanded', 'false');
            await folder.press('ArrowRight');
            await expect(folder).toHaveAttribute('aria-expanded', 'true');
            await folder.press('ArrowRight');
            await expect(page.locator(channel.child)).toBeFocused();
        });

        test('Down skips what a closed branch hides', async ({ page }) => {
            await page.goto(URL);
            const folder = page.locator(channel.folder);
            await folder.focus();
            await folder.press('ArrowDown');
            // Walking into a closed folder is the bug that makes a tree feel
            // broken rather than merely awkward.
            await expect(page.locator(channel.other)).toBeFocused();
        });

        test('Left closes an open branch, then goes to the parent', async ({ page }) => {
            await page.goto(URL);
            const folder = page.locator(channel.folder);
            await folder.focus();
            await folder.press('ArrowRight');
            await folder.press('ArrowRight');
            const child = page.locator(channel.child);
            await expect(child).toBeFocused();
            await child.press('ArrowLeft');
            await expect(folder).toBeFocused();
        });

        test('a letter jumps to the next item starting with it', async ({ page }) => {
            await page.goto(URL);
            const folder = page.locator(channel.folder);
            await folder.focus();
            await folder.press('z');
            // In a tree of forty folders this is the difference between usable
            // and theoretical.
            await expect(page.locator(channel.other)).toBeFocused();
        });
    });

    test.describe(`reorder — ${channel.name} [TH46]`, () => {
        test('the arrow keys move an item and focus follows it', async ({ page }) => {
            await page.goto(URL);
            const handle = page.locator(channel.handle);
            await handle.focus();
            await handle.press('ArrowDown');
            const order = await page.locator(`${channel.reorder} [data-kp-item]`).evaluateAll((items) => items.map((i) => i.dataset.kpItem));
            expect(order).toEqual(['b', 'a']);
            // Losing focus after every move is what makes keyboard reordering
            // unusable in practice.
            await expect(handle).toBeFocused();
        });

        test('the new order is announced to the consumer', async ({ page }) => {
            await page.goto(URL);
            await page.evaluate(() => {
                window.__order = null;
                document.addEventListener('kp-reorder', (event) => {
                    window.__order = event.detail.order;
                });
            });
            const handle = page.locator(channel.handle);
            await handle.focus();
            await handle.press('ArrowDown');
            expect(await page.evaluate(() => window.__order)).toEqual(['b', 'a']);
        });
    });

    test.describe(`split pane — ${channel.name} [TH55]`, () => {
        test('the arrow keys move the separator and say where it is', async ({ page }) => {
            await page.goto(URL);
            const separator = page.locator(channel.separator);
            await separator.focus();
            await expect(separator).toHaveAttribute('aria-valuenow', '50');
            await separator.press('ArrowRight');
            // The value lives in aria-valuenow, not only in the style: a
            // separator that moves silently is one only a mouse can use.
            await expect(separator).toHaveAttribute('aria-valuenow', '52');
            await separator.press('Shift+ArrowLeft');
            await expect(separator).toHaveAttribute('aria-valuenow', '42');
        });

        test('it stops at its own bounds', async ({ page }) => {
            await page.goto(URL);
            const separator = page.locator(channel.separator);
            await separator.focus();
            await separator.press('Home');
            await expect(separator).toHaveAttribute('aria-valuenow', '10');
            await separator.press('ArrowLeft');
            await expect(separator).toHaveAttribute('aria-valuenow', '10');
            await separator.press('End');
            await expect(separator).toHaveAttribute('aria-valuenow', '90');
        });
    });
}
