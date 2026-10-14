// @ts-nocheck: audit tooling, not shipped
// The IDENTITY audit [Kenny, 2026-10-12: "geen glitch effect bij open/close? ... elk thema heeft zijn eigen
// effect dat overal moet worden doorgezet"]. The pair meter (gates/measure-pairs.mjs) only checks that a
// close is as long as its open and mirrors it; it does not check WHICH animation runs, so a part that
// merely fades for 480 ms passes. This audit lists, for every open/close pair of the demo, the animation
// names that run (and the filter) on the open and on the close, and FAILS a pair whose open runs no
// keyframes of the `kp-sig-cyberpunk-split*` family (the channel split), unless the part is listed in
// OTHER with the animation CHARACTER.md decided for it.
//
// Real mouse clicks at coordinates, as Kenny judges. Usage:
//   node research/pastel-applied/_audit/identity.mjs [--engine firefox|chromium] [--only id,id]
import process from 'node:process';
import { chromium, firefox } from '@playwright/test';
import { serve, THEME } from './lib.mjs';

const args = process.argv.slice(2);
const flag = (n, d) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : d);
const engine = flag('engine', 'firefox');
const only = String(flag('only', '')).split(',').filter(Boolean);

/**
 * Parts whose decided animation is not a keyframed split, with the animation that must run instead:
 *  - alarm: the failing-tube strike (scope-94, scope-100; themes/cyberpunk/CHARACTER.md, "Alarm, band: as
 *    approved"): the panel's flicker, its decoded letters and slices, not the split;
 *  - sidenav: the same four poses drawn by a clock the panel's transition counts down (`--kp-sn-t`,
 *    css/cyberpunk-register.css "The side navigation"), because its box moves while the copies play.
 */
const OTHER =
    THEME !== 'cyberpunk'
        ? {}
        : {
              alarm: /script\[opacity,translate\]@div\.kp-alarm__panel/,
              sidenav: /transition:--kp-sn-t@nav\.kp-sidenav/,
          };
const SPLIT = THEME === 'cyberpunk' ? /^kp-sig-cyberpunk-split/ : new RegExp(`^kp-sig-${THEME}`);

const clickAt = async (page, sel) => {
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const b = await el.boundingBox();
    await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
};
const hoverAt = async (page, sel) => {
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const b = await el.boundingBox();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
};
const click = (sel) => (page) => clickAt(page, sel);
const key = (k) => (page) => page.keyboard.press(k);

const PARTS = [
    { id: 'dialog', open: click('[data-kp-dialog="fa-dialog"]'), close: click('#fa-dialog [data-kp-dialog-close="keep"]') },
    { id: 'drawer', open: click('[data-kp-dialog="fa-drawer"]'), close: click('#fa-drawer [data-kp-dialog-close]:last-of-type') },
    { id: 'palette', open: click('[data-kp-palette-open="fa-pal"]'), close: key('Escape') },
    { id: 'alarm', open: click('[data-kp-alarm="Pressure lost"]'), close: click('dialog.kp-alarm .kp-alarm__ack') },
    { id: 'datepicker', open: click('[data-kp-date-open]'), close: key('Escape') },
    {
        id: 'combobox',
        setup: async (page) => {
            await page.focus('.kp-combobox__input');
            await page.keyboard.press('Escape');
            await page.waitForTimeout(1100);
        },
        open: key('ArrowDown'),
        close: key('Escape'),
    },
    { id: 'theme-menu', open: click('[data-fa-theme-menu] button'), close: key('Escape') },
    { id: 'row-actions', open: click('[popovertarget="fa-menu"]'), close: key('Escape') },
    { id: 'tour', open: click('[data-fa-tour-start]'), close: key('Escape') },
    { id: 'sidenav', open: click('button.kp-sidenav__toggle[aria-controls="fa-over"]'), close: click('#fa-over button[data-kp-sidenav-toggle]') },
    {
        id: 'desktop-dropdown',
        open: (page) => hoverAt(page, '#bar .kp-nav__links > li:has(> .kp-nav__menu:not(.kp-nav__menu--wide)) > .kp-nav__link'),
        close: (page) => page.mouse.move(5, 5),
    },
    { id: 'desktop-mega', open: click('#bar .kp-nav__disclosure'), close: click('#bar .kp-nav__disclosure') },
    { id: 'phone-frame', open: click('.fa-phone [data-kp-nav-toggle]'), close: click('.fa-phone [data-kp-nav-toggle]') },
    {
        id: 'phone-390',
        viewport: { width: 390, height: 800 },
        // the demo's phone bar (the only one with a toggle) in a real 390 px window
        open: click('.fa-phone .kp-nav > [data-kp-nav-toggle]'),
        close: click('.fa-phone .kp-nav > [data-kp-nav-toggle]'),
    },
];

/** what runs right now (not the ambient loops): name, target, direction, pseudo, filter */
const snapshot = (page) =>
    page.evaluate(() =>
        document
            .getAnimations()
            .filter((a) => !window.__ambient.has(a) && Number.isFinite(Number(a.effect?.getComputedTiming().endTime)))
            .map((a) => {
                const el = a.effect.target;
                const t = a.effect.getComputedTiming();
                // A dialog's entrance is a CSS animation that js/motion.js replays with element.animate()
                // (it has no name then): the keyframes tell which one it is. The split poses are a
                // clip-path + box-shadow + text-shadow set, the bar's a drop-shadow filter.
                let name = a.animationName ?? (a.transitionProperty ? `transition:${a.transitionProperty}` : 'script');
                if (name === 'script') {
                    const kf = a.effect.getKeyframes();
                    const has = (p) => kf.some((k) => k[p] && k[p] !== 'none' && k[p] !== 'normal');
                    if (has('textShadow') && has('boxShadow')) name = 'kp-sig-cyberpunk-split (script)';
                    else if (kf.some((k) => /drop-shadow/.test(k.filter ?? ''))) name = 'kp-sig-cyberpunk-split-bar (script)';
                    else
                        name = `script[${[...new Set(kf.flatMap((k) => Object.keys(k)).filter((x) => !['offset', 'computedOffset', 'easing', 'composite'].includes(x)))].join(',')}]`;
                }
                return {
                    name,
                    target: `${el.tagName.toLowerCase()}${typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : ''}${a.effect.pseudoElement ?? ''}`,
                    dir: a.effect.getTiming().direction,
                    ms: Math.round(Number(t.endTime)),
                    filter: getComputedStyle(el).filter,
                };
            }),
    );

const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await (engine === 'chromium' ? chromium : firefox).launch();
let failed = 0;
for (const part of PARTS.filter((p) => only.length === 0 || only.includes(p.id))) {
    const context = await browser.newContext({ viewport: part.viewport ?? { width: 1280, height: 900 }, reducedMotion: 'no-preference' });
    await context.addInitScript((t) => {
        try {
            localStorage.setItem('theme', t);
        } catch {}
    }, THEME);
    const page = await context.newPage();
    await page.goto(`${base}/research/pastel-applied/demo.html`);
    await page
        .waitForFunction(() => !document.querySelector('.kp-boot'), null, { timeout: 8000 })
        .catch(() => page.evaluate(() => document.querySelectorAll('.kp-boot').forEach((e) => e.remove())));
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    await page.waitForTimeout(800);
    await part.setup?.(page);
    await page.evaluate(() => {
        window.__ambient = new Set(document.getAnimations());
    });
    const row = { open: [], close: [] };
    for (const phase of ['open', 'close']) {
        await part[phase](page);
        await page.waitForTimeout(40);
        row[phase] = await snapshot(page);
        await page.waitForTimeout(1200);
    }
    const split = (list) => list.filter((a) => SPLIT.test(a.name));
    const decided = OTHER[part.id];
    const text = (l) => l.map((a) => `${a.name}@${a.target}`);
    const okOpen = decided ? text(row.open).some((t) => decided.test(t)) : split(row.open).length > 0;
    const okClose = decided ? text(row.close).some((t) => decided.test(t)) : split(row.close).length > 0;
    const ok = okOpen && okClose;
    if (!ok) failed++;
    const fmt = (l) =>
        l.length ? l.map((a) => `${a.name}@${a.target}${a.dir !== 'normal' ? ' ' + a.dir : ''} ${a.ms}ms`).join('; ') : 'NO ANIMATION';
    console.log(
        `${ok ? 'ok  ' : 'FAIL'} ${part.id.padEnd(17)} open: ${okOpen ? (decided ? 'decided own' : 'split') : 'NOT split'}  close: ${okClose ? (decided ? 'decided own' : 'split') : 'NOT split'}`,
    );
    console.log(`       open  -> ${fmt(row.open)}`);
    console.log(`       close -> ${fmt(row.close)}`);
    await context.close();
}
await browser.close();
server.close();
console.log(`\n${PARTS.length - failed} of ${PARTS.length} parts open and close by the theme's own family (${THEME}, ${engine})`);
process.exitCode = failed ? 1 : 0;
