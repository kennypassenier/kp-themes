// A growing box in a closed `<details>` can wait until it shows [kit2-1103, Kitchen K6].
//
// Kitchen's recipe editor keeps each step's notes in a closed `<details>`: reading the computed style of such a box makes the
// browser lay the hidden content out, 60 ms a box, 2.9 s of the editor's 2.8 s-to-7 s opening for 41 steps. With
// `data-kp-autosize-hidden="skip"` the box is left alone while its content is not rendered and measured the moment it shows;
// the default (`measure`) is what it always was.
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/tests/fixtures/autosize-hidden.html');
    await page.waitForFunction(() => /** @type {any} */ (window).ready === true);
});

test('a skipping box in a closed details is not measured, a default one is', { tag: ['@component:field'] }, async ({ page }) => {
    await expect(page.locator('#skip-box')).not.toHaveAttribute('data-kp-autosize-engine-used', /.*/);
    await expect(page.locator('#measure-box')).toHaveAttribute('data-kp-autosize-engine-used', /css|js/);
});

test('a skipping box that is shown is measured at attach', { tag: ['@component:field'] }, async ({ page }) => {
    await expect(page.locator('#shown-box')).toHaveAttribute('data-kp-autosize-engine-used', /css|js/);
});

test('a skipping box is measured when its details opens, to the height of its text', { tag: ['@component:field'] }, async ({ page }) => {
    await page.locator('#skipping > summary').click();
    await expect(page.locator('#skip-box')).toHaveAttribute('data-kp-autosize-engine-used', /css|js/);
    const [skipped, reference] = await page.evaluate(async () => {
        const open = document.querySelector('#measuring');
        open.open = true;
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        return [document.getElementById('skip-box').getBoundingClientRect().height, document.getElementById('measure-box').getBoundingClientRect().height];
    });
    expect(skipped).toBeGreaterThan(60);
    expect(Math.abs(skipped - reference)).toBeLessThan(1);
});

// A closed details is known from the DOM, and `first="frame"` sizes a box after the page's first layout [flush-1104, Kitchen K6]:
// attaching reads no layout of a box that is in a closed details or waits for the frame.
test('attaching reads no layout of a closed-details box or a first="frame" box, and the frame box is sized one frame later', { tag: ['@component:field'] }, async ({ page }) => {
    const log = await page.evaluate(async () => {
        const { attachAutosize } = await import('/js/autosize.js');
        const root = document.createElement('div');
        const text = 'one\ntwo\nthree\nfour\nfive';
        root.innerHTML = `<details id="d"><summary>More <span id="s"></span></summary><div><textarea id="in-details" rows="1" data-kp-autosize data-kp-autosize-hidden="skip">${text}</textarea></div></details>
            <textarea id="framed" rows="1" data-kp-autosize data-kp-autosize-first="frame">${text}</textarea>`;
        document.body.append(root);
        const reads = /** @type {Element[]} */ ([]);
        const visibility = Element.prototype.checkVisibility;
        Element.prototype.checkVisibility = function (...a) { reads.push(this); return visibility.apply(this, a); };
        const style = window.getComputedStyle;
        window.getComputedStyle = (el, ...a) => (reads.push(el), style.call(window, el, ...a));
        attachAutosize(root);
        const framed = /** @type {HTMLElement} */ (document.getElementById('framed'));
        const atAttach = { reads: reads.filter((e) => e.id === 'in-details' || e.id === 'framed').length, engine: framed.getAttribute('data-kp-autosize-engine-used') };
        for (let i = 0; i < 3; i += 1) await new Promise((r) => requestAnimationFrame(r));
        Element.prototype.checkVisibility = visibility;
        window.getComputedStyle = style;
        const grown = framed.getBoundingClientRect().height;
        framed.rows = 1;
        return { atAttach, engine: framed.getAttribute('data-kp-autosize-engine-used'), grown, inDetails: document.getElementById('in-details')?.getAttribute('data-kp-autosize-engine-used') };
    });
    expect(log.atAttach.reads).toBe(0);
    expect(log.atAttach.engine).toBeNull();
    expect(log.engine).toMatch(/css|js/);
    expect(log.grown).toBeGreaterThan(60);
    expect(log.inDetails).toBeNull();
});

test('a box inside the summary of a closed details is not hidden', { tag: ['@component:field'] }, async ({ page }) => {
    const hidden = await page.evaluate(async () => {
        const { inClosedDetails } = await import('/js/autosize/measure.js');
        const root = document.createElement('div');
        root.innerHTML =
            '<details id="a"><summary><textarea id="t1"></textarea></summary><textarea id="t2"></textarea></details>' +
            '<details open><summary>x</summary><details id="b"><summary>y</summary><textarea id="t3"></textarea></details></details>' +
            '<details open><summary>x</summary><textarea id="t4"></textarea></details>';
        document.body.append(root);
        return ['t1', 't2', 't3', 't4'].map((id) => inClosedDetails(/** @type {Element} */ (document.getElementById(id))));
    });
    expect(hidden).toEqual([false, true, true, false]);
});
