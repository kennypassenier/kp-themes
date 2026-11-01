// Three faults kyu reported [kyu-1101]: a menu button in a redrawn row, a form summary that kept its first words, and a Copy
// button whose own label was replaced after a copy. Each fills a page of its own markup and drives the module directly.

import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/components.html';

test('a menu button in a row drawn after attachMenuButtons still opens [kyu-1101]', { tag: ['@component:overlays'] }, async ({ page }) => {
    await page.goto(URL);
    await page.evaluate(async () => {
        const { attachMenuButtons } = await import('/js/menu-button.js');
        document.body.insertAdjacentHTML('beforeend', '<table><tbody id="kyu-rows"></tbody></table>');
        attachMenuButtons(document);
        // The table redraws its rows: new nodes, never seen by the first call.
        document.getElementById('kyu-rows').innerHTML =
            '<tr><td><div class="kp-menu-button" data-kp-menu-button><button type="button" class="kp-button">More</button>' +
            '<div class="kp-menu" role="menu"><button class="kp-menu__item" role="menuitem">One</button></div></div></td></tr>';
    });
    const button = page.locator('#kyu-rows [data-kp-menu-button] > button');
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#kyu-rows [role="menu"]')).toBeVisible();
});

test('the form summary follows the messages the fields show now [kyu-1101]', { tag: ['@component:field'] }, async ({ page }) => {
    await page.goto(URL);
    await page.evaluate(async () => {
        const { attachForms } = await import('/js/forms.js');
        document.body.insertAdjacentHTML(
            'beforeend',
            '<form id="kyu-form" data-kp-form novalidate><div class="kp-field"><label for="kyu-x">Payload</label>' +
                '<input id="kyu-x" name="x" required><span data-kp-field-error hidden></span></div>' +
                '<button type="submit">Go</button><div data-kp-form-summary tabindex="-1" hidden></div></form>',
        );
        attachForms(document);
    });
    const summary = page.locator('#kyu-form [data-kp-form-summary]');
    await page.locator('#kyu-form button').click();
    await expect(summary).toContainText('Payload');
    // A second, different error: the page's own validity, as a JSON check sets it.
    await page.locator('#kyu-x').fill('{');
    await page.evaluate(() => document.getElementById('kyu-x').setCustomValidity('Not valid JSON'));
    await page.locator('#kyu-form button').click();
    await expect(summary).toContainText('Not valid JSON');
    // Fixing the field without a submit takes it out of the summary.
    await page.evaluate(() => document.getElementById('kyu-x').setCustomValidity(''));
    await page.locator('#kyu-x').fill('{}');
    await expect(summary).toBeHidden();
});

test('Copy returns to a custom label after a copy [kyu-1101]', { tag: ['@component:data'] }, async ({ page }) => {
    await page.goto(URL);
    await page.evaluate(async () => {
        const { attachPatterns } = await import('/js/patterns.js');
        navigator.clipboard.writeText = async () => {};
        document.body.insertAdjacentHTML(
            'beforeend',
            '<div id="kyu-secret" class="kp-secret" data-kp-secret data-kp-secret-value="s3cret"><div class="kp-secret__actions">' +
                '<button type="button" data-kp-secret-copy class="kp-button">Copy with token</button></div></div>',
        );
        attachPatterns(document, { copiedMs: 200 });
    });
    const copy = page.locator('#kyu-secret [data-kp-secret-copy]');
    await copy.click();
    await expect(copy).toHaveAttribute('data-kp-copied', '');
    await expect(copy).not.toHaveAttribute('data-kp-copied', '');
    await expect(copy).toHaveText('Copy with token');
});
