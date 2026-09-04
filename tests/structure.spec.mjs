// Tree, reorder and split pane [TH45, TH46, TH55].
//
// Each of these is trivial with a mouse, so the mouse is not what this
// suite drives. Every assertion below is a keyboard one, because that is
// the half that is usually missing and the half a test can prove.

import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/components.html';

test.describe('tree [TH45]', () => {
    test('the whole tree is one tab stop', async ({ page }) => {
        await page.goto(URL);
        const tree = page.locator('[data-test="plain-tree"]');
        // A tree where every node is a tab stop makes a keyboard user
        // press Tab forty times to get past a folder list.
        await expect(tree.locator('[role="treeitem"][tabindex="0"]')).toHaveCount(1);
    });

    test('Right opens a closed branch, then steps into it', async ({ page }) => {
        await page.goto(URL);
        const folder = page.locator('[data-test="tree-map"]');
        await folder.focus();
        await expect(folder).toHaveAttribute('aria-expanded', 'false');
        await folder.press('ArrowRight');
        await expect(folder).toHaveAttribute('aria-expanded', 'true');
        await folder.press('ArrowRight');
        await expect(page.locator('[data-test="tree-kind"]')).toBeFocused();
    });

    test('Down skips what a closed branch hides', async ({ page }) => {
        await page.goto(URL);
        const folder = page.locator('[data-test="tree-map"]');
        await folder.focus();
        await folder.press('ArrowDown');
        // Walking into a closed folder is the bug that makes a tree feel
        // broken rather than merely awkward.
        await expect(page.locator('[data-test="tree-zaak"]')).toBeFocused();
    });

    test('Left closes an open branch, then goes to the parent', async ({ page }) => {
        await page.goto(URL);
        const folder = page.locator('[data-test="tree-map"]');
        await folder.focus();
        await folder.press('ArrowRight');
        await folder.press('ArrowRight');
        const child = page.locator('[data-test="tree-kind"]');
        await expect(child).toBeFocused();
        await child.press('ArrowLeft');
        await expect(folder).toBeFocused();
    });

    test('a letter jumps to the next item starting with it', async ({ page }) => {
        await page.goto(URL);
        const folder = page.locator('[data-test="tree-map"]');
        await folder.focus();
        await folder.press('z');
        // In a tree of forty folders this is the difference between usable
        // and theoretical.
        await expect(page.locator('[data-test="tree-zaak"]')).toBeFocused();
    });
});

test.describe('reorder [TH46]', () => {
    test('the arrow keys move an item and focus follows it', async ({ page }) => {
        await page.goto(URL);
        const handle = page.locator('[data-test="handle-a"]');
        await handle.focus();
        await handle.press('ArrowDown');
        const order = await page.locator('[data-test="plain-reorder"] [data-kp-item]').evaluateAll((items) => items.map((i) => i.dataset.kpItem));
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
        const handle = page.locator('[data-test="handle-a"]');
        await handle.focus();
        await handle.press('ArrowDown');
        expect(await page.evaluate(() => window.__order)).toEqual(['b', 'a']);
    });
});

test.describe('split pane [TH55]', () => {
    test('the arrow keys move the separator and say where it is', async ({ page }) => {
        await page.goto(URL);
        const separator = page.locator('[data-test="plain-separator"]');
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
        const separator = page.locator('[data-test="plain-separator"]');
        await separator.focus();
        await separator.press('Home');
        await expect(separator).toHaveAttribute('aria-valuenow', '10');
        await separator.press('ArrowLeft');
        await expect(separator).toHaveAttribute('aria-valuenow', '10');
        await separator.press('End');
        await expect(separator).toHaveAttribute('aria-valuenow', '90');
    });
});
