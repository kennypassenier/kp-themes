import { chromium, firefox } from '@playwright/test';
import { serve, openTheme } from './lib.mjs';
const server = await serve();
for (const eng of [firefox, chromium]) {
    const browser = await eng.launch();
    const { page } = await openTheme(browser, `http://127.0.0.1:${server.address().port}/research/cyberpunk-applied/demo.html`);
    const r = await page.evaluate(async () => {
        const nav = document.querySelector('.fa-stage--menus .kp-nav');
        nav.scrollIntoView();
        const sample = async (start) => {
            const out = [];
            const t0 = performance.now();
            start();
            await new Promise((res) => {
                const f = () => {
                    const t = performance.now() - t0;
                    out.push([
                        Math.round(t),
                        getComputedStyle(nav)
                            .filter.replace(/rgb[a]?\([^)]*\)/g, 'c')
                            .replace(/drop-shadow\(/g, 'ds('),
                    ]);
                    if (t < 700) requestAnimationFrame(f);
                    else res();
                };
                requestAnimationFrame(f);
            });
            return out;
        };
        const arrive = await sample(() => {
            nav.style.animation = 'none';
            void nav.offsetWidth;
            nav.style.animation = '';
        });
        await new Promise((r) => setTimeout(r, 300));
        const leave = await sample(() => nav.setAttribute('data-kp-leaving', ''));
        nav.removeAttribute('data-kp-leaving');
        return { arrive, leave };
    });
    const poses = (a) => {
        const seq = [];
        for (const [t, f] of a) {
            const m = /(\d+)px/.exec(f);
            const v = f === 'none' ? 0 : m ? +m[1] : '?';
            if (!seq.length || seq.at(-1)[1] !== v) seq.push([t, v]);
        }
        return seq;
    };
    console.log(eng.name(), 'arrive', JSON.stringify(poses(r.arrive)), '\n   leave', JSON.stringify(poses(r.leave)));
    await browser.close();
}
server.close();
