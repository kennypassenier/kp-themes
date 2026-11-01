// Kenny's answers of 2026-11-01 to the UX review [uxtouch1101]: a board on a phone shows one lane under a switcher and moves cards
// with "Move to"; a revealed secret field keeps its height; small parts take a 44 px hit area under `data-kp-touch` (the same rules
// as a coarse pointer); the documentation folds its navigation at 390 px. Each fills a page of its own markup and drives the module.

import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/components.html';

test('a narrow board shows one lane under a switcher and moves a card from its menu [uxtouch1101]', { tag: ['@component:data'] }, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto(URL);
    await page.evaluate(async () => {
        const { attachBoards } = await import('/js/board.js');
        const { buildTaskRow } = await import('/js/task-row.js');
        const lane = (key, label, limit, titles) => {
            const el = document.createElement('div');
            el.dataset.kpBoardLane = key;
            el.dataset.kpBoardLabel = label;
            if (limit) el.dataset.kpBoardLimit = String(limit);
            const list = document.createElement('ul');
            list.setAttribute('data-kp-reorder', '');
            list.append(...titles.map((title, i) => buildTaskRow(document, { key: `${key}${i}`, title, menu: [{ group: '', items: [{ label: 'Delete', value: 'delete' }] }] })));
            el.append(list);
            return el;
        };
        const board = document.createElement('div');
        board.id = 'ux-board';
        board.setAttribute('data-kp-board', '');
        board.append(lane('inbox', 'Inbox', 0, ['A', 'B']), lane('doing', 'Doing', 1, ['C']));
        document.body.append(board);
        attachBoards(document);
    });
    const board = page.locator('#ux-board');
    // One row of buttons with exact counts, the limit included; only the chosen lane shows; nothing scrolls sideways.
    await expect(board.locator('.kp-board__tab .kp-tab__count')).toHaveText(['2', '1 / 1']);
    await expect(board.locator('[data-kp-board-lane]:not([hidden])')).toHaveCount(1);
    expect(await board.evaluate((el) => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
    // Move to, in front of the page's own entries; the pick moves the card and the shown lane stays.
    await board.locator('[data-kp-item="inbox0"] [data-kp-menu-button] > button').click();
    const move = board.locator('[data-kp-item="inbox0"] [role="menuitem"]', { hasText: 'Doing' });
    await expect(move).toBeVisible();
    await move.click();
    await expect(board.locator('.kp-board__tab .kp-tab__count')).toHaveText(['1', '2 / 1']);
    await expect(board.locator('.kp-board__tab .kp-badge--destructive')).toHaveCount(1);
    await expect(board.locator('[data-kp-board-lane="inbox"]')).toBeVisible();
    await expect(board.locator('.kp-board__live')).toContainText('moved to Doing');
});

test('a revealed secret field moves nothing under it [uxtouch1101]', { tag: ['@component:data'] }, async ({ page }) => {
    for (const width of [1280, 390]) {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(URL);
        await page.evaluate(async () => {
            const { attachPatterns } = await import('/js/patterns.js');
            document.body.insertAdjacentHTML(
                'beforeend',
                '<div id="ux-secrets"><div class="kp-secret" data-kp-secret data-kp-secret-value="kyu_live_4Fq9Zr7Lm2Xc8Vb1Nw6Tp3Hs"></div>' +
                    '<div class="kp-secret" data-kp-secret data-kp-secret-wrap="wrap" data-kp-secret-value="' + 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSj'.repeat(4) + '"></div><p id="ux-under">Next row</p></div>',
            );
            attachPatterns(document);
        });
        const under = page.locator('#ux-under');
        const before = (await under.boundingBox())?.y ?? 0;
        for (const reveal of await page.locator('#ux-secrets [data-kp-secret-reveal]').all()) await reveal.click();
        await expect(page.locator('#ux-secrets .kp-secret__clock').first()).toContainText('Hides in');
        expect(Math.abs(((await under.boundingBox())?.y ?? 0) - before)).toBeLessThan(0.5);
    }
});

test('under data-kp-touch a small part takes a 44 px hit area and keeps its look [uxtouch1101]', { tag: ['@component:button'] }, async ({ page }) => {
    await page.goto(URL);
    await page.evaluate(() => {
        document.body.insertAdjacentHTML(
            'beforeend',
            '<div id="ux-touch"><div class="kp-segmented" role="radiogroup" aria-label="Show"><button type="button" class="kp-segmented__item" role="radio" aria-checked="true">All</button></div>' +
                '<label class="kp-switch"><input class="kp-switch__input" type="checkbox" role="switch"><span>Night alarms</span></label></div>',
        );
    });
    const area = (selector) =>
        page.locator(selector).evaluate((el) => {
            const after = getComputedStyle(el, '::after');
            const box = el.getBoundingClientRect();
            if (after.position !== 'absolute') return { w: box.width, h: box.height, box: box.height };
            const [t, r, b, l] = [after.top, after.right, after.bottom, after.left].map((v) => parseFloat(v) || 0);
            return { w: box.width - l - r, h: box.height - t - b, box: box.height };
        });
    const plain = await area('#ux-touch .kp-segmented__item');
    await page.locator('#ux-touch').evaluate((el) => el.setAttribute('data-kp-touch', ''));
    for (const selector of ['#ux-touch .kp-segmented__item', '#ux-touch .kp-switch__input']) {
        const touched = await area(selector);
        expect(touched.h).toBeGreaterThanOrEqual(43.5);
        expect(touched.w).toBeGreaterThanOrEqual(43.5);
    }
    // The look stays: the item's own box is the height it was.
    expect((await area('#ux-touch .kp-segmented__item')).box).toBeCloseTo(plain.box, 1);
});

test('the documentation folds its navigation on a phone and keeps the column wider [uxtouch1101]', { tag: ['@component:site'] }, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/site/components/badge.html');
    const button = page.locator('.sc-nav__launcher button');
    await expect(button).toBeVisible();
    // The page's title under the first row, not under the whole navigation.
    expect((await page.locator('main h1').boundingBox())?.y ?? 9999).toBeLessThan(200);
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.sc-nav .sc-nav__link').first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toBeFocused();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(button).toBeHidden();
    await expect(page.locator('.sc-nav .sc-nav__link').first()).toBeVisible();
});
