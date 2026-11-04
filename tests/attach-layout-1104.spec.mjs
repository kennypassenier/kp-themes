// Attach passes read before they write [attach-1104, Kitchen K6].
//
// Kitchen's recipe editor (16 800 elements) attached its segmented groups, selects and contents list one after the other, and each
// one read a size right after the last one wrote: the browser laid the whole page out again every time (~200 ms in all). The
// guard counts the reads that follow a write (each one is a forced layout) while a pass attaches 30 groups: one read phase and one
// write phase make it a handful, a group-by-group pass makes it 30 or more. The contents spy reads once the frame is laid out,
// never inside a requestAnimationFrame callback, which runs before layout.
import { expect, test } from '@playwright/test';

const PAGE = '/tests/fixtures/attach-layout-1104.html';
const GROUPS = 30;

/** Instrument reads and writes: `window.probe` counts a read that follows a write, and the box reads made inside animation frames. @param {import('@playwright/test').Page} page */
const instrument = (page) =>
    page.addInitScript(() => {
        const probe = (window.probe = { afterWrite: 0, reads: 0, rafReads: 0, dirty: false, inRaf: false });
        const write = () => (probe.dirty = true);
        const read = () => {
            probe.reads += 1;
            if (probe.dirty) probe.afterWrite += 1;
            probe.dirty = false;
            if (probe.inRaf) probe.rafReads += 1;
        };
        for (const name of ['setAttribute', 'removeAttribute', 'toggleAttribute']) {
            const original = Element.prototype[name];
            Element.prototype[name] = function (...args) {
                write();
                return original.apply(this, args);
            };
        }
        const setProperty = CSSStyleDeclaration.prototype.setProperty;
        CSSStyleDeclaration.prototype.setProperty = function (...args) {
            write();
            return setProperty.apply(this, args);
        };
        const rect = Element.prototype.getBoundingClientRect;
        Element.prototype.getBoundingClientRect = function () {
            read();
            return rect.call(this);
        };
        for (const [proto, names] of /** @type {[object, string[]][]} */ ([
            [HTMLElement.prototype, ['offsetWidth', 'offsetLeft']],
            [Element.prototype, ['scrollWidth', 'clientWidth', 'scrollLeft']],
        ])) {
            for (const name of names) {
                const descriptor = Object.getOwnPropertyDescriptor(proto, name);
                const get = descriptor?.get;
                if (get) Object.defineProperty(proto, name, { ...descriptor, get() { read(); return get.call(this); } });
            }
        }
        const raf = window.requestAnimationFrame.bind(window);
        window.requestAnimationFrame = (callback) =>
            raf((time) => {
                probe.inRaf = true;
                try {
                    callback(time);
                } finally {
                    probe.inRaf = false;
                }
            });
    });

test.beforeEach(async ({ page }) => {
    await instrument(page);
    await page.goto(PAGE);
});

test(`attaching ${GROUPS} segmented groups reads once, then writes: a handful of forced layouts, not one a group [attach-1104]`, { tag: ['@component:data'] }, async ({ page }) => {
    const result = await page.evaluate(async (count) => {
        const { attachSegmented } = await import('/js/segmented.js');
        const host = /** @type {HTMLElement} */ (document.getElementById('host'));
        const one = (i) =>
            `<div class="kp-segmented" data-kp-segmented role="radiogroup" aria-label="G${i}"><button type="button" class="kp-segmented__item" data-value="a" aria-checked="true"><span class="kp-segmented__label">Alpha</span></button><button type="button" class="kp-segmented__item" data-value="b"><span class="kp-segmented__label">Beta</span></button></div>`;
        host.innerHTML = Array.from({ length: count }, (_, i) => one(i)).join('');
        const probe = /** @type {any} */ (window).probe;
        Object.assign(probe, { afterWrite: 0, reads: 0, dirty: true });
        attachSegmented(host);
        await new Promise((resolve) => setTimeout(resolve, 400));
        const placed = [...host.querySelectorAll('.kp-segmented')].filter((g) => /** @type {HTMLElement} */ (g).style.getPropertyValue('--kp-seg-w') !== '').length;
        return { afterWrite: probe.afterWrite, reads: probe.reads, placed };
    }, GROUPS);
    // Every group still has its plate placed; the reads happen, but they are grouped.
    expect(result.placed).toBe(GROUPS);
    expect(result.reads).toBeGreaterThanOrEqual(GROUPS);
    expect(result.afterWrite).toBeLessThanOrEqual(6);
});

test('the contents spy reads the sections after layout, never inside an animation frame [attach-1104]', { tag: ['@component:navigation'] }, async ({ page }) => {
    const result = await page.evaluate(async (count) => {
        const { attachContents } = await import('/js/page-contents.js');
        const host = /** @type {HTMLElement} */ (document.getElementById('host'));
        host.innerHTML =
            '<nav data-kp-contents data-kp-contents-for="#sections"></nav><div id="sections">' +
            Array.from({ length: count }, (_, i) => `<section id="s${i}"><h2>Section ${i}</h2><p>Words.</p></section>`).join('') +
            '</div>';
        const probe = /** @type {any} */ (window).probe;
        Object.assign(probe, { reads: 0, rafReads: 0 });
        attachContents(host);
        await new Promise((resolve) => setTimeout(resolve, 400));
        const nav = host.querySelector('nav');
        return { reads: probe.reads, rafReads: probe.rafReads, current: nav?.querySelector('[data-kp-current]')?.textContent ?? null };
    }, GROUPS);
    expect(result.reads).toBeGreaterThanOrEqual(GROUPS);
    expect(result.rafReads).toBe(0);
    expect(result.current).toBe('Section 0');
});
