// The add row and the folding bar, Kitchen's trial of 03/11/2026 [kit1-1103].
//
// K1: the More words of a folding bar follow `setStrings()` and a language switch. K2: a date picker in an add row fits its
// column (Kitchen /log at 1280: a 159 px column, a 252 px picker, 103 px over the next select). K3: `data-kp-addrow-labels="show"`
// keeps the labels shown when the row is not stacked. K4: `data-kp-addrow-name` names the field the "Added x" status says.
// Every assertion reads the paint (boxes), never an attribute alone.

import { expect, test } from '@playwright/test';

const ROW_FIXTURE = '/tests/fixtures/add-row.html';
const BAR_FIXTURE = '/tests/fixtures/nav-fold-words.html';

/** @param {import('@playwright/test').Page} page */
async function openRow(page) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(ROW_FIXTURE);
    await expect(page.locator('#row[data-kp-addrow-stacked]')).toHaveCount(0);
    await expect(page.locator('[data-test="meal"][data-kp-select-attached]')).toHaveCount(1);
}

/** The More button's words and its menu's name. @param {import('@playwright/test').Page} page */
const moreWords = (page) =>
    page.evaluate(() => ({
        label: document.querySelector('.kp-nav__more > .kp-menu-button > button > span')?.textContent,
        menu: document.querySelector('.kp-nav__more [role="menu"]')?.getAttribute('aria-label'),
    }));

test.describe('the More words follow the strings [K1]', () => {
    test('setStrings and a language switch change the label and the menu name', { tag: ['@component:navigation'] }, async ({ page }) => {
        await page.goto(BAR_FIXTURE);
        await page.waitForSelector('[data-kp-nav-fold-ready]');
        expect(await moreWords(page)).toEqual({ label: 'Meer', menu: 'Meer pagina’s' });
        await page.evaluate(async () => (await import('/js/strings.js')).setStrings({ navMore: 'Plus', navMoreMenu: 'Nog meer' }));
        await expect.poll(() => moreWords(page)).toEqual({ label: 'Plus', menu: 'Nog meer' });
    });

    test('a switch of the page language rewrites the words in both directions', { tag: ['@component:navigation'] }, async ({ page }) => {
        await page.goto(BAR_FIXTURE);
        await page.waitForSelector('[data-kp-nav-fold-ready]');
        await page.evaluate(() => document.documentElement.setAttribute('lang', 'en'));
        await expect.poll(() => moreWords(page)).toEqual({ label: 'More', menu: 'More pages' });
        await page.evaluate(() => document.documentElement.setAttribute('lang', 'nl'));
        await expect.poll(() => moreWords(page)).toEqual({ label: 'Meer', menu: 'Meer pagina’s' });
    });
});

test.describe('the add row [K2, K3, K4]', () => {
    test('K2: the date picker stays inside its 159 px column and keeps its button beside the input', { tag: ['@component:field'] }, async ({ page }) => {
        await openRow(page);
        const m = await page.evaluate(() => {
            const box = (/** @type {Element} */ e) => e.getBoundingClientRect();
            const cell = box(document.querySelector('[data-kp-addrow-column="date"]'));
            const picker = box(document.querySelector('[data-test="picker"]'));
            const input = box(document.querySelector('#new-date'));
            const button = box(document.querySelector('[data-kp-date-open]'));
            const next = box(document.querySelector('[data-kp-addrow-column="meal"]'));
            return { cell: cell.width, pickerRight: picker.right, cellRight: cell.right, nextLeft: next.left, input: input.width, inputRight: input.right, buttonLeft: button.left, buttonRight: button.right, buttonTop: button.top, inputTop: input.top };
        });
        expect(m.cell).toBeCloseTo(159, 0);
        expect(m.pickerRight).toBeLessThanOrEqual(m.cellRight);
        expect(m.buttonRight).toBeLessThanOrEqual(m.nextLeft);
        expect(m.buttonLeft).toBeGreaterThanOrEqual(m.inputRight);
        expect(Math.abs(m.buttonTop - m.inputTop)).toBeLessThan(8);
        expect(m.input).toBeGreaterThan(70);
    });

    test('K3: labels are for screen readers by default, shown with data-kp-addrow-labels="show"', { tag: ['@component:field'] }, async ({ page }) => {
        await openRow(page);
        const label = page.locator('label[for="new-dish"]');
        expect((await label.boundingBox())?.width).toBeLessThanOrEqual(1);
        await page.evaluate(() => document.querySelector('#row').setAttribute('data-kp-addrow-labels', 'show'));
        const box = await label.boundingBox();
        expect(box?.width).toBeGreaterThan(20);
        const field = await page.locator('#new-dish').boundingBox();
        expect(box?.y + box?.height).toBeLessThanOrEqual(field?.y + 1);
        const add = await page.locator('[data-kp-submit]').boundingBox();
        expect(add?.y + add?.height).toBeCloseTo(field?.y + field?.height, 0);
    });

    test('K4: the status names the field data-kp-addrow-name names, else the first filled value', { tag: ['@component:field'] }, async ({ page }) => {
        await openRow(page);
        const live = page.locator('.kp-addrow__live');
        await page.locator('#new-dish').fill('Pasta pesto');
        await page.locator('[data-kp-submit]').click();
        await expect(live).toHaveText('Added 42');
        await page.evaluate(() => document.querySelector('#row').setAttribute('data-kp-addrow-name', 'dish'));
        await page.locator('#new-dish').fill('Pasta pesto');
        await page.locator('[data-kp-submit]').click();
        await expect(live).toHaveText('Added Pasta pesto');
        await page.evaluate(() => document.querySelector('#row').setAttribute('data-kp-addrow-name', 'dish'));
        await page.locator('#new-dish').fill('');
        await page.locator('[data-kp-submit]').click();
        await expect(live).toHaveText('Added 42');
    });
});
