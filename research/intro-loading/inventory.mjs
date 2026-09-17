// The on-load motion of every theme, measured [scope-85]. Research only.
//
//   KP_TEST_PORT=4511 node research/intro-loading/inventory.mjs </dev/null
//
// Loads examples/concept.html once per theme in chromium (unthrottled, the
// theme stored in localStorage), and reads: the knobs the theme declares
// (--kp-arrival, --kp-reveal-headline), when the arrival overlay came and
// went, when the headline reached its rest state, and every CSS animation
// running on the headline in its first 2.5 s (the CSS-only reveals have no
// state attribute). Writes out/inventory.json.
import { chromium } from 'playwright';
import { writeFile, readFile } from 'node:fs/promises';
import process from 'node:process';
import { startServer } from './serve.mjs';

const PORT = Number(process.env.KP_TEST_PORT ?? 4511);
const themes = JSON.parse(await readFile(new URL('../../themes/order.json', import.meta.url), 'utf8'));
const server = await startServer(PORT);
const browser = await chromium.launch();
const rows = [];
try {
    for (const theme of themes) {
        const context = await browser.newContext({ reducedMotion: 'no-preference' });
        const page = await context.newPage();
        await page.addInitScript((t) => {
            localStorage.setItem('theme', t);
            // @ts-ignore
            const m = (window.__inv = { marks: {}, anims: [] });
            const now = () => Math.round(performance.now());
            new MutationObserver((records) => {
                for (const r of records) {
                    if (r.type === 'childList') {
                        for (const n of r.addedNodes) if (n.nodeType === 1 && n.classList.contains('kp-boot')) m.marks.arrivalStart ??= now();
                        for (const n of r.removedNodes) if (n.nodeType === 1 && n.classList.contains('kp-boot')) m.marks.arrivalEnd ??= now();
                    } else if (r.target.matches?.('[data-kp-reveal="headline"]')) {
                        if (r.attributeName === 'data-kp-text') m.marks.attach ??= now();
                        if (r.attributeName === 'data-kp-reveal-state') {
                            m.marks.headlineEnd ??= now();
                            m.marks.headlineState = r.target.getAttribute('data-kp-reveal-state');
                        }
                    }
                }
            }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-kp-text', 'data-kp-reveal-state'] });
            const sample = () => {
                const h1 = document.querySelector('[data-kp-reveal="headline"]');
                if (h1)
                    for (const a of document.getAnimations()) {
                        const target = a.effect?.target;
                        if (target && (target === h1 || h1.contains(target))) {
                            const name = a.animationName ?? a.transitionProperty ?? 'animation';
                            const timing = a.effect.getComputedTiming();
                            if (!m.anims.some((x) => x.name === name)) m.anims.push({ name, endTime: Math.round(timing.endTime) });
                        }
                    }
                if (performance.now() < 2500) requestAnimationFrame(sample);
            };
            requestAnimationFrame(sample);
        }, theme);
        await page.goto(`http://127.0.0.1:${PORT}/net/none/examples/concept.html`, { waitUntil: 'load' });
        await page.waitForTimeout(4500);
        const r = await page.evaluate(() => {
            const cs = getComputedStyle(document.documentElement);
            const h1 = document.querySelector('[data-kp-reveal="headline"]');
            return {
                arrival: cs.getPropertyValue('--kp-arrival').trim(),
                headline: cs.getPropertyValue('--kp-reveal-headline').trim(),
                text: h1?.textContent ?? '',
                // @ts-ignore
                ...window.__inv,
            };
        });
        rows.push({ theme, ...r });
        const k = r.marks;
        console.log(
            theme.padEnd(14),
            `arrival=${r.arrival || '-'}`.padEnd(16),
            `headline=${r.headline || '-'}`.padEnd(22),
            `intro=${k.arrivalStart !== undefined ? k.arrivalEnd - k.arrivalStart : '-'}`.padEnd(12),
            `reveal=${k.headlineEnd !== undefined ? k.headlineEnd - k.attach : '-'}(${k.headlineState ?? '-'})`.padEnd(18),
            JSON.stringify(r.anims),
        );
        await context.close();
    }
} finally {
    await browser.close();
    server.close();
    server.closeAllConnections?.();
}
await writeFile(new URL('./out/inventory.json', import.meta.url), JSON.stringify(rows, null, 1) + '\n');
