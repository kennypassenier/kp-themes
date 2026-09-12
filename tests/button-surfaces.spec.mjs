// The two surfaces a theme may paint on [scope-16, scope-17, Kenny
// 2026-09-12]. Both approved concept demos of round seven put an oxide
// film along the control's edge and a small reading above it — one
// surface more than a button's two pseudo-elements can carry, since the
// spectral instrument already spends both on its brackets.
//
// What this holds is the part a register cannot: that adding them costs
// the other twenty-four themes nothing. Out of flow, invisible, and the
// control the same size it was.
//
// Drilled 2026-09-12 in firefox: `position: absolute` removed from the
// two-selector rule in css/components.css and the bundle regenerated ->
// red on the control keeping its size.
//
// The second half of this record was false until Phase 7. It claimed a
// red run on "`opacity: 0` removed from the readout", and no assertion on
// the readout existed in this file or in any other — the record described
// a drill of a test that was not there, which is the one thing KT3 exists
// to prevent. The assertions are below now, on a fixture of their own,
// with their own drills. The reason they could not live here: no page in
// the package renders a readout at all.
import { expect, test } from '@playwright/test';
import { measured } from './paint.mjs';

const CHANNELS = [
    ['framework-free', '/examples/concept-light.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=light'],
];

for (const [channel, url] of CHANNELS) {
    test(`the two surfaces cost the control nothing, ${channel} [scope-16]`, async ({ page }) => {
        await page.goto(url);
        const button = page.locator('.kp-button').first();
        await button.scrollIntoViewIfNeeded();

        const edge = button.locator('.kp-button__edge');
        expect(await edge.count(), 'this button carries the edge').toBe(1);

        // Out of flow: the label is the only thing setting the box.
        const box = await button.evaluate((el) => {
            const r = el.getBoundingClientRect();
            const label = /** @type {HTMLElement} */ (el.querySelector('.kp-button__label'));
            const l = label.getBoundingClientRect();
            // The PADDING box, which is what `inset: 0` resolves against.
            // Measured against the border box on the first run and it was
            // 2px out — the button's own 1px boundary on each side, which
            // the edge correctly does not cover.
            return {
                w: Number(r.width.toFixed(2)),
                h: Number(r.height.toFixed(2)),
                pw: el.clientWidth,
                ph: el.clientHeight,
                lw: Number(l.width.toFixed(2)),
            };
        });
        const painted = await edge.evaluate((el) => {
            const s = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return { position: s.position, events: s.pointerEvents, w: Number(r.width.toFixed(2)), h: Number(r.height.toFixed(2)) };
        });
        expect(painted.position, 'out of flow, so it cannot move the control').toBe('absolute');
        expect(painted.events, 'and it never takes a click').toBe('none');
        expect(painted.w, 'the edge covers the control it belongs to, inside its boundary').toBeCloseTo(box.pw, 0);
        expect(painted.h).toBeCloseTo(box.ph, 0);
        expect(box.pw, 'and that is inside the border box, not over it').toBeLessThan(box.w);
        expect(box.lw, 'the label still has the width it always had').toBeGreaterThan(0);
        expect(box.w, 'and the control is wider than its label, not the other way round').toBeGreaterThan(box.lw);
    });

    test(`a theme that paints neither sees nothing, ${channel} [scope-16]`, async ({ page }) => {
        await page.goto(url);
        const button = page.locator('.kp-button').first();
        await button.scrollIntoViewIfNeeded();
        // Light styles neither surface. The edge must therefore paint
        // nothing at all — no ground, no border, no shadow.
        await measured(
            button.locator('.kp-button__edge'),
            (el) => {
                const s = getComputedStyle(el);
                return [s.backgroundImage, s.backgroundColor, s.borderTopWidth, s.boxShadow].join(' | ');
            },
            undefined,
            'the edge is inert in a theme that does not style it',
        ).toBe('none | rgba(0, 0, 0, 0) | 0px | none');
    });
}

// ── the readout, on a fixture of its own ───────────────────────────────
//
// Phase 7 found the drill record at the top of this file claiming a red
// run on an assertion that was never written — and then found the reason
// it could not be written: `.kp-button__readout` is rendered by no page
// in the package. Both channels build it (components/button.jsx:208,
// showcase/examples.mjs:158) and two registers style it in full
// (css/dark-register.css:180, css/titanium-register.css), but nothing
// passes the text, so the element never exists and the CSS is inert.
//
// What words belong there is the consumer's business by design [KT5] and
// the approved demo's business for these two themes [S49], so this file
// does not invent them for the package. It renders the markup both
// channels produce and holds the contract the registers depend on.
//
// Drilled 2026-09-12 in firefox: `opacity: 0` removed from the readout in
// css/components.css and the bundle regenerated -> red on it being
// invisible until a theme asks; the hover rule removed from
// css/dark-register.css -> red on the reveal.
test('the readout is invisible until a theme asks, and never announced [scope-16, KT5]', async ({ page }) => {
    await page.goto('/tests/fixtures/readout.html');
    const readout = page.locator('.kp-button__readout');

    // It is decoration over a control that already has a name; announced
    // beside the label it would read the button twice, differently.
    expect(await readout.getAttribute('aria-hidden'), 'the readout is decoration, and says so').toBe('true');

    // Out of flow and unseen at rest — opacity rather than display,
    // because a theme reveals it by raising the opacity.
    await measured(
        readout,
        (el) => {
            const s = getComputedStyle(el);
            return `${s.opacity} | ${s.position}`;
        },
        undefined,
        'the readout is invisible and out of flow until a theme asks',
    ).toBe('0 | absolute');

    // And it costs the control nothing: the button without one is the
    // same height as the button with one.
    const heights = await page.evaluate(() => [...document.querySelectorAll('.kp-button')].map((b) => Math.round(b.getBoundingClientRect().height)));
    expect(heights[0], 'a readout does not make its button taller').toBe(heights[1]);
});

test('a theme that styles the readout reveals it on hover [scope-16]', async ({ page }) => {
    await page.goto('/tests/fixtures/readout.html');
    const readout = page.locator('.kp-button__readout');
    await page.locator('.kp-button--primary').hover();

    // dark raises the opacity and paints the text with its oxide gradient.
    await measured(readout, (el) => getComputedStyle(el).opacity, undefined, 'dark reveals the readout on hover').toBe('1');
});

// Drilled 2026-09-12 in firefox: `readout: c.readout || undefined`
// in showcase/examples.mjs changed back to no readout at all -> red on
// the element being on the page. Restored: green.
test('the two themes that style the readout show it on their own page [readout-words]', async ({ page }) => {
    // The fixture above proves the CSS contract; this proves the words
    // actually reach the page the theme is judged on. Until Phase 7 the
    // surface was styled in full by two registers and rendered nowhere,
    // so both halves existed and never met.
    for (const [theme, word] of [
        ['dark', 'READY'],
        ['titanium', 'PART 26'],
    ]) {
        await page.goto(`/examples/concept-${theme}.html`);
        const readout = page.locator('.kp-button__readout').first();
        expect(await readout.count(), `${theme}'s page carries the readout`).toBe(1);
        expect((await readout.textContent())?.trim(), `${theme} shows its own word`).toBe(word);

        // Still decoration, still invisible until the theme asks.
        expect(await readout.getAttribute('aria-hidden')).toBe('true');
        await measured(readout, (el) => getComputedStyle(el).opacity, undefined, `${theme} hides the readout at rest`).toBe('0');
    }

    // And a theme that does not style it renders nothing at all, rather
    // than an empty element nobody can see.
    await page.goto('/examples/concept-light.html');
    expect(await page.locator('.kp-button__readout').count(), 'light styles no readout and renders none').toBe(0);
});
