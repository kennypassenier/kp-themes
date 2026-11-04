// `setSequencerItems` is incremental [kit2-1103, Kitchen K5]: a refresh writes only what changed.
//
// Kitchen's recipe editor sets its 40 steps on every edit; the set used to rewrite every bar, label and probe (258 mutations
// for an unchanged set, 302 ms per key). The bounds below are generous multiples of what the code does today (0 and 6), far
// under the old 250: a regression to "rewrite everything" fails every one of them.
import { expect, test } from '@playwright/test';

const PAGE = '/tests/fixtures/sequencer-incremental.html';

/**
 * Run `make(i)` -> items through setSequencerItems and count the mutations under the sequencer.
 * @param {import('@playwright/test').Page} page @param {string} makeSource a function body taking (items, i)
 */
const mutationsOf = (page, makeSource) =>
    page.evaluate(async (source) => {
        const el = /** @type {HTMLElement} */ (document.getElementById('seq'));
        const k = /** @type {any} */ (window).kit;
        const make = new Function('items', 'i', source);
        let count = 0;
        const mo = new MutationObserver((list) => (count += list.length));
        mo.observe(el, { subtree: true, attributes: true, childList: true, characterData: true });
        k.setSequencerItems(el, make(k.items, 1), k.lanes);
        await new Promise((r) => setTimeout(r, 50));
        mo.disconnect();
        return count;
    }, makeSource);

test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForFunction(() => /** @type {any} */ (window).kitReady === true);
});

test('an unchanged set writes nothing', { tag: ['@component:data'] }, async ({ page }) => {
    expect(await page.locator('.kp-sequencer__item').count()).toBe(40);
    expect(await mutationsOf(page, 'return items.map((x) => ({ ...x }));')).toBeLessThanOrEqual(5);
});

test('a one-item edit writes a handful of nodes and keeps every bar element', { tag: ['@component:data'] }, async ({ page }) => {
    const before = await page.evaluate(() => [...document.querySelectorAll('.kp-sequencer__item')].map((b, i) => ((b['__tag'] = i), i)));
    const count = await mutationsOf(page, "return items.map((x, j) => (j === 5 ? { ...x, label: x.label + ' (longer)' } : x));");
    expect(count).toBeLessThanOrEqual(25);
    const same = await page.evaluate(() => [...document.querySelectorAll('.kp-sequencer__item')].every((b, i) => b['__tag'] === i));
    expect(same && before.length === 40).toBe(true);
});

test('focus and selection survive a refresh', { tag: ['@component:data'] }, async ({ page }) => {
    await page.locator('[data-kp-id="s7"]').focus();
    await page.evaluate(() => /** @type {any} */ (window).kit.setSequencerSelection(document.getElementById('seq'), 's7'));
    await mutationsOf(page, "return items.map((x, j) => (j === 3 ? { ...x, label: 'edited' } : x));");
    await expect(page.locator('[data-kp-id="s7"]')).toBeFocused();
    await expect(page.locator('[data-kp-id="s7"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-kp-id="s3"] .kp-gantt__label')).toHaveText('edited');
});

test('a removed and an added item change only their own bars', { tag: ['@component:data'] }, async ({ page }) => {
    const count = await mutationsOf(page, "return items.slice(0, 39).concat([{ ...items[39], id: 'new', label: 'New step' }]);");
    expect(count).toBeLessThanOrEqual(60);
    await expect(page.locator('.kp-sequencer__item')).toHaveCount(40);
    await expect(page.locator('[data-kp-id="new"]')).toHaveCount(1);
    await expect(page.locator('[data-kp-id="s39"]')).toHaveCount(0);
});

// A paint lays the page out once [perf-1104, Kitchen K5/K6]: every layout read (lane tops, plot width, name sizes) comes before
// the first write of a bar, and the name probes live in a layout-contained box, so measuring a changed name does not relayout
// the page around the timeline (30-55 ms a key in Kitchen's editor; the page there has 16 000 elements).
test('a refresh reads the layout first and writes after, and probes stay in the contained box', { tag: ['@component:data'] }, async ({ page }) => {
    const log = await page.evaluate(async () => {
        const el = /** @type {HTMLElement} */ (document.getElementById('seq'));
        const k = /** @type {any} */ (window).kit;
        const box = /** @type {HTMLElement} */ (el.querySelector('.kp-sequencer__probes'));
        /** @type {string[]} */
        const events = [];
        const read = (/** @type {object} */ proto, /** @type {string} */ name) => {
            const d = /** @type {PropertyDescriptor} */ (Object.getOwnPropertyDescriptor(proto, name));
            const get = /** @type {() => any} */ (d.get ?? (() => undefined));
            Object.defineProperty(proto, name, { ...d, get() { if (el.contains(this)) events.push('R'); return get.call(this); } });
        };
        for (const name of ['clientWidth', 'clientHeight', 'scrollHeight', 'scrollWidth']) read(Element.prototype, name);
        for (const name of ['offsetHeight', 'offsetWidth']) read(HTMLElement.prototype, name);
        const rect = Element.prototype.getBoundingClientRect;
        Element.prototype.getBoundingClientRect = function () { if (el.contains(this)) events.push('R'); return rect.call(this); };
        const setProperty = CSSStyleDeclaration.prototype.setProperty;
        CSSStyleDeclaration.prototype.setProperty = function (...a) { events.push('W'); return setProperty.apply(this, a); };
        const text = /** @type {PropertyDescriptor} */ (Object.getOwnPropertyDescriptor(Node.prototype, 'textContent'));
        Object.defineProperty(Node.prototype, 'textContent', { ...text, set(v) { if (this !== box && !box.contains(this) && el.contains(this)) events.push('W'); text.set.call(this, v); } });
        k.setSequencerItems(el, k.items.map((/** @type {any} */ x, /** @type {number} */ j) => (j === 5 ? { ...x, label: 'A quite different and much longer name' } : x)), k.lanes);
        return { events: events.join(''), left: box.childElementCount };
    });
    expect(log.left).toBe(0);
    expect(log.events).toMatch(/R/);
    expect(log.events).toMatch(/^W*R+W*$/);
});

test('the name probes are in a layout-contained box', { tag: ['@component:data'] }, async ({ page }) => {
    const style = await page.evaluate(() => {
        const box = /** @type {HTMLElement} */ (document.querySelector('#seq .kp-sequencer__probes'));
        const cs = getComputedStyle(box);
        return { contain: cs.contain, parent: box.parentElement?.className };
    });
    expect(style.contain).toMatch(/strict|layout/);
    expect(style.parent).toBe('kp-sequencer__items');
});
