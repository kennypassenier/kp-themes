// The side navigation [feat-nav-3].
//
// Kenny asked for a real one — "zoals mdbootstrap, met alle opties die die
// heeft" — after seeing that the package had none. The measurement behind
// that: `grep -l "kp-sidebar" css/*-register.css | wc -l` returned 0. The
// sidebar had never been a component, so no theme had ever been asked to
// style it, so there was nothing to look at.
//
// These tests hold the options that carry behaviour. What a theme does
// with it belongs to the register specs; what the component does belongs
// here.
//
// Every assertion reads what the browser painted rather than the attribute
// the module just wrote [KT13].
//
// Drill [KT3], six passes:
//   · the panel's own `inline-size` removed → `1266 passed, 2 failed`, the
//     side test and the slim test
//   · `offsetContent` made a no-op → the push test red
//   · the accordion branch made unreachable → the accordion test red
//   · the slim width rule removed → the slim test red
//   · `flex-shrink: 0` removed and the backdrop's position line removed,
//     together → `1268 passed, 2 failed`, the side test and the over test
//   · the push offset put back to the token's default → the push test red
//   · `box-sizing: border-box` removed from the rows → `1269 passed,
//     1 failed`, the sideways-scroll test
//
// Two of those passes are the reason the drill is not a formality. The
// side test's first version asked whether the panel was wider than 100px
// and stayed GREEN with the width rule gone, because the header text alone
// is wider than that. And the push test could not tell the panel's real
// width from the token's default until the fixture gave that panel a width
// of its own — the two happened to be equal, so the assertion was true for
// the wrong reason. Rule 7e, twice, caught by the drill it exists for.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { measured } from './paint.mjs';

const FIXTURE = '/tests/fixtures/sidenav.html';

/** @param {import('@playwright/test').Page} page @param {string} name */
const part = (page, name) => page.locator(`[data-test="${name}"]`);

/** @param {import('@playwright/test').Locator} locator @param {string} message */
const left = (locator, message) => measured(locator, (el) => el.getBoundingClientRect().left, undefined, message);

test.describe('the side navigation', { tag: ['@component:navigation'] }, () => {
    test('over: away until the toggler is pressed, and it brings a backdrop [feat-nav-3]', async ({ page }) => {
        await page.goto(FIXTURE);
        const box = await part(page, 'over-box').boundingBox();
        const panel = part(page, 'over');

        // Away means translated out, not hidden: the box is still there,
        // it is just not on the screen. Measured against the box it lives
        // in rather than against a number.
        await measured(panel, (el) => el.getBoundingClientRect().right, undefined, 'over: starts outside its own box').toBeLessThanOrEqual(
            (box?.x ?? 0) + 1,
        );
        await expect(page.locator('.kp-sidenav__backdrop'), 'over: and no backdrop while it is away').toHaveCount(0);

        await part(page, 'over-toggle').click();

        await left(panel, 'over: on the screen once asked').toBeCloseTo(box?.x ?? 0, 0);
        await expect(page.locator('.kp-sidenav__backdrop'), 'over: the backdrop came with it').toHaveCount(1);
        // And it belongs to the same box the panel does. A panel scoped to
        // a container had a backdrop over the whole window, dimming a page
        // nobody had asked about.
        await measured(
            page.locator('.kp-sidenav__backdrop'),
            (el) => getComputedStyle(el).position,
            undefined,
            'over: the backdrop stays in the box the panel was scoped to',
        ).toBe('absolute');
    });

    test('over: Escape, the backdrop and the toggler each close it [feat-nav-3, KT6]', async ({ page }) => {
        await page.goto(FIXTURE);
        const box = await part(page, 'over-box').boundingBox();
        const panel = part(page, 'over');
        const away = async (message) =>
            measured(panel, (el) => el.getBoundingClientRect().right, undefined, message).toBeLessThanOrEqual((box?.x ?? 0) + 1);

        await part(page, 'over-toggle').click();
        await left(panel, 'open before Escape').toBeCloseTo(box?.x ?? 0, 0);
        await page.keyboard.press('Escape');
        await away('closed by Escape');

        await part(page, 'over-toggle').click();
        await left(panel, 'open before the backdrop').toBeCloseTo(box?.x ?? 0, 0);
        await page.locator('.kp-sidenav__backdrop').click({ force: true });
        await away('closed by the backdrop');

        await part(page, 'over-toggle').click();
        await left(panel, 'open before the second press').toBeCloseTo(box?.x ?? 0, 0);
        await part(page, 'over-toggle').click();
        await away('closed by the toggler that opened it');
    });

    test('over: opening moves the focus in, closing gives it back [feat-nav-3]', async ({ page }) => {
        await page.goto(FIXTURE);
        const toggle = part(page, 'over-toggle');

        await toggle.click();
        await expect(part(page, 'over-first'), 'the first thing in the panel takes the focus').toBeFocused();

        await page.keyboard.press('Escape');
        await expect(toggle, 'and the button that opened it gets it back').toBeFocused();
    });

    test('push: the content makes room, and over does not [feat-nav-3]', async ({ page }) => {
        // The one thing CSS cannot do: the offset lands on an element the
        // component does not own. Drill: `offsetContent` made a no-op in
        // js/sidenav.js and this goes red while everything else stays green.
        await page.goto(FIXTURE);
        const content = part(page, 'push-content');

        const before = await content.evaluate((el) => el.getBoundingClientRect().left);
        const panelWidth = await part(page, 'push').evaluate((el) => el.getBoundingClientRect().width);
        await part(page, 'push-toggle').click();
        // By the panel's own width, not by the token's default. The knob is
        // set on the panel, where the content element cannot read it, so an
        // offset taken from the default left a gap whenever the two differed.
        await measured(content, (el) => el.getBoundingClientRect().left, undefined, 'push: the content moved over by exactly the panel').toBeCloseTo(
            before + panelWidth,
            0,
        );

        const overContent = part(page, 'over-box');
        const overBefore = await overContent.evaluate((el) => el.getBoundingClientRect().left);
        await part(page, 'over-toggle').click();
        expect(await overContent.evaluate((el) => el.getBoundingClientRect().left), 'over: nothing moves, because covering is the point').toBeCloseTo(
            overBefore,
            0,
        );
    });

    test('slim: a rail that hides its words still says them to a screen reader [feat-nav-3, scope-45]', async ({ page }) => {
        // Found by the navbar research of 2026-09-13: the slim rail hid every
        // label with display:none, which takes it out of the accessibility
        // tree too, so a rail entry whose only visible content is an icon had
        // no name at all and a screen reader said "button". The demo page had
        // to write an aria-label by hand on every link to be usable, which is
        // the proof: a page using the package correctly had to work around it.
        await page.goto(FIXTURE);
        const toggle = part(page, 'cat-one-toggle');
        await expect(toggle, 'slim: the category is named before the rail folds').toHaveAccessibleName('Reports');

        await page.evaluate(async () => {
            const { sidenavOf } = await import('/js/sidenav.js');
            sidenavOf(document.getElementById('nav-slim'))?.setSlim(true);
        });
        await page.mouse.move(0, 0);

        await expect(toggle, 'slim: and still named once the words are out of sight').toHaveAccessibleName('Reports');
    });

    test('accordion: opening one category closes the other [feat-nav-3]', async ({ page }) => {
        // Drill: the accordion branch removed from js/sidenav.js and this
        // goes red, because both submenus stay open at once.
        await page.goto(FIXTURE);
        // The submenu's own box, not the link inside it: a clipped list
        // still gives its children a height, and what a reader can see is
        // how tall the container grew.
        const one = page.locator('[data-test="cat-one"] .kp-sidenav__submenu');
        const two = page.locator('[data-test="cat-two"] .kp-sidenav__submenu');

        await measured(one, (el) => el.getBoundingClientRect().height, undefined, 'both categories start closed').toBe(0);

        await part(page, 'cat-one-toggle').click();
        await measured(one, (el) => el.getBoundingClientRect().height, undefined, 'the first opened').toBeGreaterThan(0);

        await part(page, 'cat-two-toggle').click();
        await measured(two, (el) => el.getBoundingClientRect().height, undefined, 'the second opened').toBeGreaterThan(0);
        await measured(one, (el) => el.getBoundingClientRect().height, undefined, 'and the first closed, which is what accordion means').toBe(0);
    });

    test('a side navigation never scrolls sideways [feat-nav-3]', async ({ page }) => {
        // Kenny's rule, 2026-09-11, after seeing the count after a long label
        // sit past the edge of a narrow panel: "in een sidenav mag er nooit
        // gescrolled worden". Measured before the fix: 140px of content in a
        // 127px box, with the number two pixels outside it.
        //
        // The cause was box-sizing. The package sets none globally, so a row
        // at `inline-size: 100%` with padding came out 19px wider than the
        // list holding it, and every row in every panel overflowed by
        // exactly its own padding.
        await page.goto(FIXTURE);

        const box = await part(page, 'tight-scroll').evaluate((el) => ({ scroll: el.scrollWidth, client: el.clientWidth }));
        expect(box.scroll, 'nothing to scroll to: the content is as wide as the box and no wider').toBeLessThanOrEqual(box.client);

        const edges = await page.evaluate(() => {
            const rect = (sel) => document.querySelector(sel).getBoundingClientRect();
            return { badge: rect('[data-test="tight-badge"]').right, panel: rect('[data-test="tight"]').right };
        });
        expect(edges.badge, 'and the count is inside the panel, not past it').toBeLessThanOrEqual(edges.panel);
    });

    // The far edge does not animate [gap-9]. Kenny saw the slide stay rough
    // through two attempts and asked for it out rather than fixed today, so
    // the panel arrives instead of travelling. The test reads where it ends
    // up, which is the part that has to keep working either way.
    test('end: the panel comes from the other edge [feat-nav-3]', async ({ page }) => {
        await page.goto(FIXTURE);
        const box = await part(page, 'end-box').boundingBox();
        const panel = part(page, 'end');

        await measured(panel, (el) => el.getBoundingClientRect().left, undefined, 'end: starts past the far edge').toBeGreaterThanOrEqual(
            (box?.x ?? 0) + (box?.width ?? 0) - 1,
        );

        await part(page, 'end-toggle').click();
        await measured(panel, (el) => el.getBoundingClientRect().right, undefined, 'end: and lands against that same edge').toBeCloseTo(
            (box?.x ?? 0) + (box?.width ?? 0),
            0,
        );

        // And it starts where the page told it to. This panel carries
        // `--kp-sidenav-inset-block: 2rem 0`, which is how a page that keeps
        // its own bar stops the panel sliding underneath it [Kenny, 2026-09-11].
        // Both boxes read in one go: opening moves the focus into the panel,
        // which can scroll the page, and a y captured beforehand is then a
        // number from a different moment.
        const tops = await page.evaluate(() => {
            const rect = (sel) => document.querySelector(sel).getBoundingClientRect();
            return { panel: rect('[data-test="end"]').top, box: rect('[data-test="end-box"]').top };
        });
        expect(tops.panel - tops.box, 'end: two rem below the top of its box').toBeCloseTo(32, 0);
    });

    test("end: it travels, on the register's own timing [gap-9]", async ({ page }) => {
        // It used to arrive instead: `transition: none` on that side alone,
        // because the slide read as rough through two attempts. Measured
        // 2026-09-20 with the transition restored — 10 to 15 frames at one
        // every 17-18 ms, nothing dropped, in six registers
        // [research/gap-9-far-edge/README.md] — so the exception went.
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.goto(FIXTURE);
        const moving = await part(page, 'end').evaluate((el) => {
            const cs = getComputedStyle(el);
            return { property: cs.transitionProperty, duration: cs.transitionDuration };
        });
        expect(moving.property, 'end: the panel transitions its own translate').toContain('translate');
        expect(moving.duration, 'end: over a duration the register gives it').not.toBe('0s');
    });
});

// A submenu item says so before its name, in every theme [Kenny,
// 2026-09-20]: "bij subitems op de sidenav zou ik graag nog, per thema, een
// specifiek symbool voor de subitemnaam willen zetten zodat het extra
// duidelijk is wat nu juist een hoofdmenuitem en een submenuitem is."
//
// Red first: with the register lines removed the mark is empty in all 22
// themes and this reads 22 themes without one.
test(
    'a submenu item carries a mark of its own, and no label moves for it [fix-64]',
    { tag: ['@component:navigation', '@sweep'] },
    async ({ page }) => {
        await page.goto('/catalogue/navigation.html');
        const names = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));
        const without = [];
        const ragged = [];
        for (const theme of names) {
            await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
            await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(theme);
            const read = await page
                .locator('#sidenav-side .kp-sidenav__submenu')
                .first()
                .evaluate((menu) => {
                    const links = [...menu.querySelectorAll('.kp-sidenav__link')];
                    const marks = links.map((link) => {
                        const before = globalThis.getComputedStyle(link.querySelector('.kp-sidenav__label'), '::before');
                        return { content: before.content, width: Number.parseFloat(before.inlineSize) || 0 };
                    });
                    const labels = links.map((link) => Math.round(link.querySelector('.kp-sidenav__label').getBoundingClientRect().left));
                    return { marks, labels };
                });
            const shows = read.marks.every((mark) => (mark.content && !['none', '""', "''"].includes(mark.content)) || mark.width > 0);
            if (!shows) without.push(`${theme}: ${JSON.stringify(read.marks[0])}`);
            if (new Set(read.labels).size !== 1) ragged.push(`${theme}: labels at ${[...new Set(read.labels)].join('/')}`);
        }
        expect(names.length, 'the themes were read').toBe(22);
        expect(without, 'a theme whose submenu items carry no mark').toEqual([]);
        expect(ragged, 'a theme where the mark moved a label').toEqual([]);
    },
);
