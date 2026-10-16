// Measure whether every raised surface keeps an opaque plate, in every theme, wherever it stands (Kenny, 2026-10-16,
// on phantom's More menu inside the review dialog: "het geopende menu heeft geen achtergrond ... zie dat het in de
// toekomst niet meer gebeurt").
//
// plate-fixture.html puts the same set of surfaces (a menu button's menu, a plain menu, a popover, a hover card, a
// toast, a combobox list, a date picker panel, the bar's dropdown, the palette, the theme menu, the table's add menu,
// a tour card) on the page, in a card, in a dialog, in a drawer and in a popover, opens them all, and this script
// reads, per theme, the plate each one paints: its own background colour, a background image, or a pseudo-element
// covering at least 80 % of it. A plate under 0.85 opacity is reported. Under reduced motion it also reports every
// surface whose ground, border, clip, shadow or pseudo-elements differ from the same surface on the page.
//
// Known and approved as they stand (Kenny, 2026-10-16: "de rest heb ik toch al goedgekeurd"): in phantom a menu button's
// menu and the theme menu inside a dialog or a popover, and in pastel any menu inside a popover, are bare, and in synthwave a
// menu inside a popover loses its own stripe for the popover's; the folding bar's More menu (`nav-more`) keeps phantom's plate. gates/check-raised-plate.mjs lists those rules and refuses a new one.
//
// The static half of this, a rule that takes the plate away from a raised menu, is refused by
// gates/check-raised-plate.mjs in `npm run gates`. A bare `.kp-tooltip` reads as unplated in cyberpunk: the package
// only ever writes `.kp-popover.kp-tooltip`, which is plated.
//
//   python3 -m http.server 8743 --bind 127.0.0.1   # from the repository root
//   node research/_review/measure-plate.mjs [theme …] [--port 8743]
import process from 'node:process';
import { firefox } from 'playwright';
import { THEMES } from '../../js/theme-registry.js';

const args = process.argv.slice(2);
const portAt = args.indexOf('--port');
const port = portAt >= 0 ? args.splice(portAt, 2)[1] : '8743';
const themes = args.length ? args : THEMES.map((t) => t.name);

const browser = await firefox.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
await page.goto(`http://127.0.0.1:${port}/research/_review/plate-fixture.html`);
await page.evaluate(() => {
    /** @type {HTMLDialogElement} */ (document.querySelector('dialog[data-ctx=dialog]')).show();
    /** @type {HTMLDialogElement} */ (document.querySelector('dialog[data-ctx=drawer]')).show();
    /** @type {HTMLElement} */ (document.querySelector('[data-ctx=popover]')).showPopover();
    for (const p of document.querySelectorAll('[data-s][popover]')) /** @type {HTMLElement} */ (p).showPopover();
});
let faults = 0;
for (const theme of themes) {
    await page.evaluate(async (name) => {
        document.documentElement.dataset.theme = name;
        const link = /** @type {HTMLLinkElement} */ (document.querySelector('link[data-kp-register]'));
        // The same sheet again fires no load event.
        if (link.href.endsWith(`/${name}-register.css`)) return;
        await new Promise((done) => {
            link.onload = done;
            link.onerror = done;
            link.href = link.href.replace(/[a-z]+-register\.css/, `${name}-register.css`);
        });
    }, theme);
    await page.waitForTimeout(300);
    const found = await page.evaluate(() => {
        /** @param {string} c */
        const alpha = (c) => {
            const m = /rgba?\(([^)]+)\)|color\(([^)]+)\)/.exec(c);
            if (!m) return c === 'transparent' ? 0 : 1;
            const slash = /\/\s*([\d.]+)/.exec(m[0]);
            if (slash) return parseFloat(slash[1]);
            const parts = (m[1] ?? '').split(/[ ,]+/).filter(Boolean);
            return parts.length > 3 ? parseFloat(parts[3]) : 1;
        };
        /** @param {Element} el */
        const look = (el) => {
            const c = getComputedStyle(el);
            const a = getComputedStyle(el, '::after');
            const b = getComputedStyle(el, '::before');
            return [
                c.backgroundColor,
                c.backgroundImage.slice(0, 60),
                c.borderLeftWidth,
                c.borderTopWidth,
                c.clipPath === 'none',
                c.boxShadow === 'none',
                a.content,
                b.content,
            ].join('|');
        };
        /** @type {Record<string, string>} */
        const onPage = {};
        for (const el of document.querySelectorAll('[data-ctx=page] [data-s]')) onPage[/** @type {HTMLElement} */ (el).dataset.s ?? ''] = look(el);
        const out = [];
        for (const el of document.querySelectorAll('[data-s]')) {
            const s = /** @type {HTMLElement} */ (el).dataset.s ?? '';
            const ctx = /** @type {HTMLElement} */ (el.closest('[data-ctx]')).dataset.ctx;
            const c = getComputedStyle(el);
            let plate = Math.max(alpha(c.backgroundColor), c.backgroundImage === 'none' ? 0 : 1);
            for (const p of ['::before', '::after']) {
                const ps = getComputedStyle(el, p);
                const covers =
                    ps.content !== 'none' &&
                    ps.position === 'absolute' &&
                    parseFloat(ps.width) >= el.clientWidth * 0.8 &&
                    parseFloat(ps.height) >= el.clientHeight * 0.8;
                if (covers) plate = Math.max(plate, alpha(ps.backgroundColor), ps.backgroundImage === 'none' ? 0 : 0.9);
            }
            if (plate < 0.85) out.push(`${s} in a ${ctx}: plate ${plate.toFixed(2)}`);
            else if (ctx !== 'page' && look(el) !== onPage[s]) out.push(`${s} in a ${ctx}: dressed differently than on the page`);
        }
        return out;
    });
    faults += found.length;
    console.log(`${theme.padEnd(10)} ${found.length ? found.join('; ') : 'every surface plated, the same everywhere'}`);
}
await browser.close();
console.log(`${faults} finding(s) in ${themes.length} theme(s).`);
