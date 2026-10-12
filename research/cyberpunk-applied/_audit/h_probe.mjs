// @ts-nocheck: scratch
import { firefox } from '@playwright/test';
import { serve, openTheme } from './lib.mjs';
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const b = await firefox.launch();
const { page } = await openTheme(b, `${base}/catalogue/${process.argv[2]}.html`);
const sel = process.argv[3];
const info = await page.evaluate(async (sel) => {
    const el = document.querySelector(sel);
    if (!el) return 'none';
    const rs = [];
    for (let i = 0; i < 6; i++) {
        const r = el.getBoundingClientRect();
        rs.push([r.x, r.y, r.width, r.height].map((n) => +n.toFixed(2)).join(','));
        await new Promise((r) => setTimeout(r, 100));
    }
    return {
        rs,
        anims: el.getAnimations().map((a) => a.animationName ?? a.transitionProperty),
        vis: getComputedStyle(el).visibility,
        tag: el.tagName,
        parentAnims: el.parentElement.getAnimations({ subtree: false }).length,
        cls: el.className,
    };
}, sel);
console.log(JSON.stringify(info, null, 1));
await b.close();
server.close();
