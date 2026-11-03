// Habits, 03/11/2026 [handle-1103]: a task row's reorder handle is a fingertip to press under a coarse pointer, in every theme: the
// check box's hit area beside it no longer reaches back over it (Habits measured 36 px of the handle's 44 that a press reached), a
// plain `.kp-reorder` handle takes 44 px as its invisible `::after` (touch-hit-small.css), and a mouse sees the same sizes as before.

import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/components.html';
const THEMES = ['formal', 'titanium', 'nostromo'];

async function handles(page, theme) {
    await page.goto(URL);
    return page.evaluate(async (name) => {
        document.documentElement.dataset.theme = name;
        const { buildTaskRow } = await import('/js/task-row.js');
        const list = document.createElement('ul');
        list.className = 'kp-reorder';
        list.setAttribute('data-kp-reorder', '');
        list.append(buildTaskRow(document, { key: 'a', title: 'Water the plants' }));
        const plain = document.createElement('ul');
        plain.className = 'kp-reorder';
        plain.setAttribute('data-kp-reorder', '');
        plain.innerHTML = '<li data-kp-item="x"><button type="button" data-kp-handle aria-label="Move">⠿</button> Plain item</li>';
        document.body.prepend(list, plain);
        const read = (el) => {
            const box = el.getBoundingClientRect();
            const after = getComputedStyle(el, '::after');
            return { w: box.width, h: box.height, afterW: after.content === 'none' ? 0 : parseFloat(after.width), afterH: after.content === 'none' ? 0 : parseFloat(after.height) };
        };
        const row = list.querySelector('.kp-task-row');
        const handle = list.querySelector('[data-kp-handle]');
        // The width a finger can press: the points along the handle's middle line that land on the handle, not the check's area.
        const box = handle.getBoundingClientRect();
        const y = box.y + box.height / 2;
        let tapW = 0;
        for (let x = Math.floor(box.left) - 12; x <= box.right + 12; x += 1) if (document.elementFromPoint(x, y)?.closest('[data-kp-handle]') === handle) tapW += 1;
        return { tapW, task: read(handle), plain: read(plain.querySelector('[data-kp-handle]')), rowH: row.getBoundingClientRect().height, titleX: row.querySelector('.kp-task-row__title').getBoundingClientRect().x };
    }, theme);
}

for (const theme of THEMES) {
    test(`under a coarse pointer a reorder handle is a 44 px target in ${theme} [handle-1103]`, { tag: ['@component:button'] }, async ({ browser }) => {
        const context = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
        const page = await context.newPage();
        const { task, plain, tapW } = await handles(page, theme);
        expect(tapW).toBeGreaterThanOrEqual(43);
        expect(task.w).toBeGreaterThanOrEqual(43.5);
        expect(task.h).toBeGreaterThanOrEqual(43.5);
        expect(plain.afterW).toBeGreaterThanOrEqual(43.5);
        expect(plain.afterH).toBeGreaterThanOrEqual(43.5);
        await context.close();
    });

    test(`under a mouse the reorder handles keep their size in ${theme} [handle-1103]`, { tag: ['@component:button'] }, async ({ browser }) => {
        const context = await browser.newContext({ viewport: { width: 390, height: 800 } });
        const page = await context.newPage();
        const { task, plain, rowH } = await handles(page, theme);
        expect([task.w, task.h]).toEqual([36, 36]);
        expect(rowH).toBe(46);
        expect(plain.afterW).toBe(0);
        expect(plain.w).toBeLessThan(30);
        await context.close();
    });
}
