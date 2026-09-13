// Kenny's second nostromo pass through the review page, 2026-09-13.
//
// Four notes, each measured in Firefox before it was fixed and each held
// here by a test that went red on the code as it stood: the data table's
// date filter was a bare date input (scope-58), the tag input walked hidden
// options, removed tags on a stray Backspace and ignored a click on an
// option, the live upload zone did not take a drag at its first event, and
// a toast's buttons neither sat at its end nor hovered in its colour.
//
// Drilled per KT3 on 2026-09-13: every test below ran against the code
// before the fixes and went red; the line under each name records what it
// measured there.

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { contrast } from '../gates/colour.mjs';
import { DEFAULT_STRINGS as S } from '../js/strings.js';

const THEME_NAMES = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));

/** @param {import('@playwright/test').Page} page @param {string} theme */
const wear = async (page, theme) => {
    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(theme);
};

/** @param {import('@playwright/test').Page} page @param {string} url */
const open = async (page, url) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(url);
};

// ── Note 1: the data table's date filter is the package's date picker ─────

const DATATABLE = '/tests/fixtures/datatable.html';
const TABLE_CHANNELS = [
    { name: 'framework-free', table: '[data-test="plain-datatable"]' },
    { name: 'React', table: '[data-test="react-datatable"] .kp-datatable' },
];

for (const channel of TABLE_CHANNELS) {
    test(`the data table's date filter is a .kp-datepicker whose calendar narrows the rows — ${channel.name} [scope-58]`, async ({ page }) => {
        // Before: two bare <input type="date"> in both channels, no .kp-datepicker, no calendar button.
        const table = page.locator(channel.table);
        await open(page, DATATABLE);
        await expect(table.locator('tbody tr:visible').first()).toBeVisible();
        await table.locator('[data-kp-datatable-filter-toggle]').click();
        const opened = table.getByRole('group', { name: 'Opened' });
        await expect(opened.locator('input[type="date"]')).toHaveCount(0);
        await expect(opened.locator('.kp-datepicker[data-kp-datepicker]')).toHaveCount(2);
        const from = table.getByLabel(S.tableFilterFrom('Opened'), { exact: true });
        const to = table.getByLabel(S.tableFilterTo('Opened'), { exact: true });
        await expect(from).toHaveAttribute('data-kp-date-input');
        await expect(to).toHaveAttribute('data-kp-date-input');

        // Typed ISO still works: typing is the date picker's primary path.
        await from.fill('2026-08-10');
        // The upper bound through the calendar: typed to August first, then day 12 chosen.
        await to.fill('2026-08-01');
        const toPicker = opened.locator('.kp-datepicker').nth(1);
        await toPicker.locator('[data-kp-date-open]').click();
        await expect(toPicker.locator('.kp-datepicker__panel')).toBeVisible();
        await toPicker.locator('[data-kp-day="2026-08-12"]').click();
        await expect(toPicker.locator('.kp-datepicker__panel')).toBeHidden();
        await expect(table.locator('tbody tr:visible')).toHaveCount(3);

        // A pill clears the bound, and the picker's field follows.
        await table.locator('[data-kp-datatable-pills]').getByRole('button', { name: S.tableClearFilters }).click();
        await expect(table.locator('tbody tr:visible')).toHaveCount(25);
        await expect(from).toHaveValue('');
        await expect(to).toHaveValue('');
    });
}

test('the catalogue data table’s date filter wears each theme’s date picker, in every theme [scope-58]', async ({ page }) => {
    // Before: no .kp-datepicker in the filter panel, so nothing to read in any of the 22 themes.
    await open(page, '/catalogue/table.html');
    const block = page.locator('#datatable');
    await block.locator('[data-kp-datatable-filter-toggle]').click();
    const picker = block.locator('[data-kp-datatable-filters] .kp-datepicker').first();
    await expect(picker).toBeVisible();
    await picker.locator('[data-kp-date-open]').click();
    const panel = picker.locator('.kp-datepicker__panel');
    await expect(panel).toBeVisible();
    const differ = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        // A reference picker of the package, outside the table, drawn in the same theme.
        const read = await panel.evaluate((el) => {
            const ref = document.createElement('div');
            ref.className = 'kp-datepicker';
            const refPanel = document.createElement('div');
            refPanel.className = 'kp-datepicker__panel';
            ref.append(refPanel);
            document.querySelector('main, body')?.append(ref);
            const pick = (/** @type {Element} */ e) => {
                const s = getComputedStyle(e);
                return [s.backgroundColor, s.borderTopColor, s.borderTopWidth, s.borderTopLeftRadius].join(' ');
            };
            const out = { filter: pick(el), reference: pick(refPanel) };
            ref.remove();
            return out;
        });
        if (read.filter !== read.reference) differ.push(`${theme}: ${read.filter} vs ${read.reference}`);
    }
    expect(differ).toEqual([]);
});

// ── Note 2: the tag input ─────────────────────────────────────────────────

const COMPONENTS = '/tests/fixtures/components.html';
const TAG_CHANNELS = [
    { name: 'framework-free', tags: '[data-test="plain-tags"]' },
    { name: 'React', tags: '[data-test="react-tags"] .kp-combobox' },
];

/** @param {import('@playwright/test').Page} page @param {string} inputSelector */
const activeOption = (page, inputSelector) =>
    page.evaluate((sel) => {
        const input = /** @type {HTMLElement} */ (document.querySelector(sel));
        const id = input.getAttribute('aria-activedescendant');
        const option = id ? document.getElementById(id) : null;
        return option === null ? null : { text: (option.textContent ?? '').trim(), hidden: option.hidden };
    }, inputSelector);

for (const channel of TAG_CHANNELS) {
    const input = `${channel.tags} .kp-combobox__input`;

    test(`after typing, the first ArrowDown highlights the first matching option — ${channel.name} [note 2]`, async ({ page }) => {
        // Before (framework-free): typing "i" left only Idee, and ArrowDown highlighted the hidden Urgent.
        await open(page, COMPONENTS);
        await page.locator(input).click();
        await page.locator(input).pressSequentially('i');
        await page.locator(input).press('ArrowDown');
        await expect.poll(() => activeOption(page, input)).toEqual({ text: 'Idee', hidden: false });
        await page.locator(input).press('Enter');
        await expect(page.locator(`${channel.tags} .kp-tag`)).toHaveCount(1);
    });

    test(`a click on an option adds that tag — ${channel.name} [note 2]`, async ({ page }) => {
        // Before (framework-free): the list closed on the press and the click landed on nothing; 0 tags.
        await open(page, COMPONENTS);
        await page.locator(input).click();
        await expect(page.locator(`${channel.tags} .kp-combobox__list`)).toBeVisible();
        await page.locator(`${channel.tags} [data-kp-option][data-value="bug"]`).click();
        await expect(page.locator(`${channel.tags} .kp-tag`)).toHaveCount(1);
        await expect(page.locator(`${channel.tags} .kp-tag`)).toContainText('Bug');
        await expect(page.locator(input)).toBeFocused();
    });

    test(`Backspace in an empty field leaves the tags alone; the remove button is reached by keyboard — ${channel.name} [note 2, KT6]`, async ({
        page,
    }) => {
        // Before: typing one letter and pressing Backspace twice removed a tag (React: 1 → 0).
        await open(page, COMPONENTS);
        const tags = page.locator(`${channel.tags} .kp-tag`);
        await page.locator(input).click();
        await page.locator(input).press('ArrowDown');
        await page.locator(input).press('Enter');
        await expect(tags).toHaveCount(1);
        await page.locator(input).pressSequentially('x');
        await page.locator(input).press('Backspace');
        await page.locator(input).press('Backspace');
        await page.locator(input).press('Backspace');
        await expect(tags).toHaveCount(1);
        // The way out is the tag's own button, one Shift+Tab from the field.
        await page.locator(input).press('Shift+Tab');
        const remove = tags.first().locator('.kp-tag__remove');
        await expect(remove).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(tags).toHaveCount(0);
    });
}

test('Backspace removes the last tag only where the box opts in — framework-free [note 2, KT6]', async ({ page }) => {
    // Before: the opt-in was the default, so this passed; the default above is what changed.
    await open(page, COMPONENTS);
    const count = await page.evaluate(async () => {
        const { attachComboboxes } = await import('/js/combobox.js');
        const host = document.createElement('div');
        host.innerHTML = `
            <div class="kp-combobox" data-kp-combobox data-kp-tags data-kp-backspace-removes id="opt-in">
                <ul class="kp-tag-list" data-kp-tag-list><li class="kp-tag" data-value="a"><span>A</span><button type="button" class="kp-tag__remove">×</button></li></ul>
                <input class="kp-combobox__input" type="text" role="combobox" aria-expanded="false" aria-controls="opt-in-list" aria-label="Opt in" />
                <ul class="kp-combobox__list" id="opt-in-list" role="listbox" hidden><li class="kp-combobox__option" role="option" data-kp-option data-value="b">B</li></ul>
            </div>`;
        document.body.append(host);
        attachComboboxes(host);
        return host.querySelectorAll('.kp-tag').length;
    });
    expect(count).toBe(1);
    await page.locator('#opt-in .kp-combobox__input').press('Backspace');
    await expect(page.locator('#opt-in .kp-tag')).toHaveCount(0);
});

test('Backspace removes the last tag only where the box opts in — React [note 2, KT6]', async ({ page }) => {
    await open(page, COMPONENTS);
    const box = page.locator('[data-test="react-tags-backspace"] .kp-combobox');
    await expect(box.locator('.kp-tag')).toHaveCount(1);
    await box.locator('.kp-combobox__input').click();
    await box.locator('.kp-combobox__input').press('Backspace');
    await expect(box.locator('.kp-tag')).toHaveCount(0);
});

test('the catalogue tag input: typing then one ArrowDown, a click on an option, and a stray Backspace [note 2]', async ({ page }) => {
    // Before: "s" then ArrowDown highlighted the hidden Pressure; a click on Needs the vendor added nothing; x + two Backspaces removed Night shift.
    await open(page, '/catalogue/combobox.html');
    const input = page.locator('#cb-tags');
    const tags = page.locator('#tags .kp-tag');
    await expect(tags).toHaveCount(2);
    await input.click();
    await input.pressSequentially('s');
    await input.press('ArrowDown');
    await expect.poll(() => activeOption(page, '#cb-tags')).toEqual({ text: 'Needs the vendor', hidden: false });
    await input.fill('');
    await page.locator('#cb-tags-list [data-kp-option][data-value="safety"]').click();
    await expect(tags).toHaveCount(3);
    await input.pressSequentially('x');
    await input.press('Backspace');
    await input.press('Backspace');
    await expect(tags).toHaveCount(3);
});

// ── Note 3: the live upload zone takes a drag ───────────────────────────────

test('a file dragged onto the live upload zone is accepted at dragenter and paints like the frozen copy, in every theme [note 3]', async ({
    page,
}) => {
    // Before: dragenter was not cancelled and set nothing — data-kp-dragging absent, the zone at rest, in all 22 themes.
    await open(page, '/catalogue/upload.html');
    const zone = page.locator('#dragging [data-kp-upload] [data-kp-upload-zone]');
    const frozen = page.locator('#dragging label[data-kp-dragging]:not([data-kp-upload-zone])');
    const faults = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        const result = await zone.evaluate((el) => {
            const paint = (/** @type {Element} */ e) => {
                const s = getComputedStyle(e);
                return `${s.borderTopColor} ${s.color} ${s.backgroundColor}`;
            };
            const rest = paint(el);
            const data = new DataTransfer();
            data.items.add(new File(['t,v'], 'telemetry.csv', { type: 'text/csv' }));
            const enter = new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: data });
            el.dispatchEvent(enter);
            return { rest, cancelled: enter.defaultPrevented, dragging: el.hasAttribute('data-kp-dragging'), paint: paint(el) };
        });
        const want = await frozen.evaluate((el) => {
            const s = getComputedStyle(el);
            return `${s.borderTopColor} ${s.color} ${s.backgroundColor}`;
        });
        if (!result.cancelled || !result.dragging || result.paint !== want || result.paint === result.rest)
            faults.push(
                `${theme}: cancelled ${result.cancelled}, dragging ${result.dragging}, paint ${result.paint}, frozen ${want}, rest ${result.rest}`,
            );
        // Leaving the zone for the page takes the state away again.
        const after = await zone.evaluate((el) => {
            el.dispatchEvent(new DragEvent('dragleave', { bubbles: true, relatedTarget: document.body }));
            return el.hasAttribute('data-kp-dragging');
        });
        if (after) faults.push(`${theme}: still dragging after leaving`);
    }
    expect(faults).toEqual([]);
});

test('moving over a child of the zone keeps the dragging state — framework-free [note 3]', async ({ page }) => {
    // Before: any dragleave took the state away, so an icon inside a consumer's zone made it flicker off.
    await open(page, '/catalogue/upload.html');
    const zone = page.locator('#dragging [data-kp-upload] [data-kp-upload-zone]');
    const state = await zone.evaluate((el) => {
        const child = document.createElement('span');
        child.textContent = '⇪';
        el.prepend(child);
        const data = new DataTransfer();
        el.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: data }));
        el.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: data }));
        child.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: data }));
        el.dispatchEvent(new DragEvent('dragleave', { bubbles: true, relatedTarget: child }));
        const kept = el.hasAttribute('data-kp-dragging');
        el.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: new DataTransfer() }));
        child.remove();
        return { kept, afterDrop: el.hasAttribute('data-kp-dragging') };
    });
    expect(state).toEqual({ kept: true, afterDrop: false });
});

// ── Note 4: toasts ───────────────────────────────────────────────────────────

/** Raise one toast of each kind through the package, a long one and a short one, with an action. @param {import('@playwright/test').Page} page */
const raiseToasts = (page) =>
    page.evaluate(async () => {
        const { toast } = await import('/js/overlays.js');
        const region = /** @type {HTMLElement} */ (document.querySelector('#toasts .kp-toasts'));
        for (const variant of ['', 'success', 'info', 'warning', 'destructive']) {
            for (const text of ['Short.', 'A much longer message that has to wrap onto a second line inside the toast before it ends.']) {
                const el = toast(text, {
                    region,
                    ms: 0,
                    className: variant ? `kp-toast kp-toast--${variant}` : 'kp-toast',
                    action: { label: 'Undo', onClick: () => {} },
                });
                el.dataset.testRaised = '';
            }
        }
    });

test('every toast’s buttons sit at its end, whatever the text length, in every theme [note 4]', async ({ page }) => {
    // Before: the toast was a block, so a button followed its text — 163px short of the end on the success toast in nostromo, 0 only by luck on info.
    await open(page, '/catalogue/feedback.html');
    await raiseToasts(page);
    const off = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        const reads = await page.locator('#toasts .kp-toast').evaluateAll((toasts) =>
            toasts.flatMap((t) => {
                const buttons = [...t.querySelectorAll(':scope > button, :scope > .kp-button, :scope > .kp-icon-button')];
                if (buttons.length === 0) return [];
                const s = getComputedStyle(t);
                const end = t.getBoundingClientRect().right - Number.parseFloat(s.paddingRight) - Number.parseFloat(s.borderRightWidth);
                // The layout box, not the painted one: a theme that skews its buttons (phantom) paints past the box it laid out.
                const lastEl = /** @type {HTMLElement} */ (buttons.at(-1));
                const painted = lastEl.getBoundingClientRect();
                const last = { right: (painted.left + painted.right) / 2 + lastEl.offsetWidth / 2 };
                const text = t.querySelector('.kp-toast__body')?.getBoundingClientRect();
                return [
                    {
                        what: `${t.className} "${(t.textContent ?? '').trim().slice(0, 20)}"`,
                        gap: Math.round(end - last.right),
                        // Beside the text, not dropped below it.
                        beside: text === undefined ? false : buttons.every((b) => b.getBoundingClientRect().left >= text.right - 1),
                    },
                ];
            }),
        );
        for (const r of reads) if (Math.abs(r.gap) > 1 || !r.beside) off.push(`${theme} ${r.what}: ${r.gap}px from the end, beside ${r.beside}`);
    }
    expect(off).toEqual([]);
});

test('a button hovered in a toast takes a shade of that toast’s own colour and reads at 4.5:1, in every theme [note 4]', async ({ page }) => {
    // Before: the theme's standard ghost hover — nostromo painted rgb(225, 215, 199) on the info, destructive and success plates alike.
    await open(page, '/catalogue/feedback.html');
    await raiseToasts(page);
    const faults = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        for (const variant of ['plain', 'success', 'info', 'warning', 'destructive']) {
            const selector =
                variant === 'plain'
                    ? '#toasts .kp-toast[data-test-raised]:not([class*="kp-toast--"]) button'
                    : `#toasts .kp-toast--${variant}[data-test-raised] button`;
            const button = page.locator(selector).first();
            await button.hover();
            const read = await button.evaluate(async (el) => {
                // The hover's paint once any transition has run.
                const until = performance.now() + 1500;
                const ctx = /** @type {CanvasRenderingContext2D} */ (document.createElement('canvas').getContext('2d', { willReadFrequently: true }));
                const rgba = (/** @type {string} */ css) => {
                    ctx.clearRect(0, 0, 1, 1);
                    ctx.fillStyle = '#000';
                    ctx.fillStyle = css;
                    ctx.fillRect(0, 0, 1, 1);
                    const d = ctx.getImageData(0, 0, 1, 1).data;
                    return [d[0], d[1], d[2], d[3] / 255];
                };
                const toastEl = /** @type {HTMLElement} */ (el.closest('.kp-toast'));
                let last = '';
                for (;;) {
                    const now = getComputedStyle(el).backgroundColor;
                    if (now === last || performance.now() > until) break;
                    last = now;
                    await new Promise((r) => setTimeout(r, 120));
                }
                const plate = rgba(getComputedStyle(toastEl).backgroundColor);
                const ink = rgba(getComputedStyle(el).color);
                const hover = rgba(getComputedStyle(el).backgroundColor);
                const ground = plate.slice(0, 3).map((v, i) => Math.round((hover[i] ?? 0) * (hover[3] ?? 0) + v * (1 - (hover[3] ?? 0))));
                const text = ink.slice(0, 3).map((v, i) => Math.round(v * (ink[3] ?? 1) + (ground[i] ?? 0) * (1 - (ink[3] ?? 1))));
                return { plate: plate.slice(0, 3), ground, text, hovered: el.matches(':hover') };
            });
            // A shade of the toast's own colour: the hovered ground is the plate moved part of the way towards black, white or its
            // own ink — on one of those three lines — and visibly not the plate. The theme's page hover is on none of them.
            const [p, g, t] = [read.plate, read.ground, read.text];
            const onLine = (/** @type {number[]} */ to) => {
                const dir = to.map((v, i) => v - p[i]);
                const len2 = dir.reduce((a, v) => a + v * v, 0) || 1;
                const along = g.reduce((a, v, i) => a + (v - p[i]) * dir[i], 0) / len2;
                const closest = p.map((v, i) => v + along * dir[i]);
                return { along, off: Math.hypot(...g.map((v, i) => v - closest[i])) };
            };
            // A grey lies on all three lines at once, so the nearest line is taken among those the ground moved along.
            const lines = [onLine([0, 0, 0]), onLine([255, 255, 255]), onLine(t)].filter((l) => l.along > 0 && l.along <= 0.5);
            const { along, off: away } = lines.sort((a, b) => a.off - b.off)[0] ?? { along: -1, off: Infinity };
            const moved = Math.hypot(...g.map((v, i) => v - p[i]));
            const ratio = contrast(
                /** @type {[number, number, number]} */ (t.map((v) => v / 255)),
                /** @type {[number, number, number]} */ (g.map((v) => v / 255)),
            );
            if (!read.hovered || moved < 8 || away > 6 || along < 0 || along > 0.5 || ratio < 4.5)
                faults.push(
                    `${theme} ${variant}: plate ${p} hover ground ${g} ink ${t} (moved ${moved.toFixed(1)}, off-line ${away.toFixed(1)}, ${ratio.toFixed(2)}:1)`,
                );
            await page.mouse.move(0, 0);
        }
    }
    expect(faults).toEqual([]);
});
