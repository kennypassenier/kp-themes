// The generic sweep [KT6]: what 3.0.0 promises that no earlier test pinned.
//
// Each of these was drilled red first, per the KT3 rule, by removing the
// line in the package that carries it; the comment on each says which.

import { test, expect } from '@playwright/test';
import { DEFAULT_STRINGS as S } from '../js/strings.js';

const URL = '/tests/fixtures/components.html';

test('detaching a data table puts the rows back in the order the server rendered [KT6]', async ({ page }) => {
    await page.goto(URL);
    const order = await page.evaluate(async () => {
        const { attachDataTables } = await import('/js/datatable.js');
        const host = document.createElement('div');
        host.innerHTML =
            '<div data-kp-datatable><table><thead><tr><th data-kp-sort="number">n</th></tr></thead>' +
            '<tbody><tr><td>3</td></tr><tr><td>1</td></tr><tr><td>2</td></tr></tbody></table></div>';
        document.body.append(host);
        const detach = attachDataTables(host);
        detach.handles[0].sort({ column: 0, direction: 'ascending' });
        const sorted = [...host.querySelectorAll('td')].map((td) => td.textContent);
        // Drill: with the "for (const row of rendered) body.append(row)"
        // loop removed from the cleanup, this stays sorted after detach.
        detach();
        const restored = [...host.querySelectorAll('td')].map((td) => td.textContent);
        host.remove();
        return { sorted, restored };
    });
    expect(order.sorted).toEqual(['1', '2', '3']);
    expect(order.restored).toEqual(['3', '1', '2']);
});

test('enforcement can be taken back: a contract-broken button comes back enabled [KT6, D7]', async ({ page }) => {
    await page.goto(URL);
    const states = await page.evaluate(async () => {
        const { enforceContracts } = await import('/js/components.js');
        const host = document.createElement('div');
        host.innerHTML = '<button type="button" data-kp-destructive>Delete</button>';
        document.body.append(host);
        const button = host.querySelector('button');
        const detach = enforceContracts(host, { log: null });
        const disabled = button.disabled;
        // Drill: with restore() emptied, the button stays disabled here.
        detach();
        const after = button.disabled;
        // And a second pass over repaired markup heals it.
        button.setAttribute('data-kp-confirm', 'Really?');
        const again = enforceContracts(host, { log: null });
        const healed = button.disabled;
        again();
        host.remove();
        return { disabled, after, healed, count: detach.violations.length };
    });
    expect(states).toEqual({ disabled: true, after: false, healed: false, count: 1 });
});

test('a nested StringsProvider layers over the outer one [KT6]', async ({ page }) => {
    await page.goto(URL);
    const button = page.locator('[data-test="react-nested-strings"] button');
    // The inner provider set only `copy`; `copied` must still be the
    // outer one's. Drill: with `...outer` removed from the merge in
    // StringsProvider, the button reads "Inner copy" but the copied text
    // falls back to the package default rather than "Outer copied".
    await expect(button).toHaveText('Inner copy');
    await page.context().grantPermissions(['clipboard-write']);
    await button.click();
    await expect(button).toHaveText('Outer copied');
});

const PICKERS = [
    { name: 'framework-free', url: '/tests/fixtures/picker.html', open: null, picker: '#plain' },
    { name: 'React', url: '/tests/fixtures/picker.html', open: '#react-mount .kp-icon-button', picker: '#react-mount [data-kp-theme-picker]' },
];
for (const channel of PICKERS) {
    test(`the theme picker groups light and dark, with a label each — ${channel.name} [TH63]`, async ({ page }) => {
        await page.goto(channel.url);
        if (channel.open) await page.locator(channel.open).click();
        const picker = page.locator(channel.picker);
        // Drill: with `grouped` defaulting to false (or the group markup
        // removed), there are no group elements and this reads 0.
        await expect(picker.locator('[data-kp-theme-group="light"]')).toHaveCount(1);
        await expect(picker.locator('[data-kp-theme-group="dark"]')).toHaveCount(1);
        await expect(picker.locator('[data-kp-theme-group="light"] .kp-theme-group__label')).toHaveText(S.themeGroupLight);
        await expect(picker.locator('[data-kp-theme-group="dark"] .kp-theme-group__label')).toHaveText(S.themeGroupDark);
        // Every theme is in exactly one group.
        await expect(picker.locator('[data-kp-theme-group] [data-kp-theme]')).toHaveCount(11);
    });
}
