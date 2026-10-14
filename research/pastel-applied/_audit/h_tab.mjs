// @ts-nocheck: scratch: a real keyboard Tab through the demo, each stop's focus bracket measured and shot
import { firefox } from '@playwright/test';
import { serve, openTheme } from './lib.mjs';
const out = process.argv[2];
const max = +(process.argv[3] ?? 400);
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const b = await firefox.launch();
const { page } = await openTheme(b, `${base}/research/pastel-applied/demo.html`);
await page.mouse.move(1, 1);
const seen = new Map();
const rows = [];
for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(260);
    const d = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const r = el.getBoundingClientRect();
        const lab = el.closest('label');
        const g = (e, pe) => {
            const c = getComputedStyle(e, pe);
            return {
                fp: c.getPropertyValue('--kp-cp-fp').trim(),
                bg: c.backgroundImage,
                mask: c.maskImage,
                bw: c.borderTopWidth,
                ol: c.outlineStyle + ' ' + c.outlineWidth,
                shadow: c.boxShadow,
                content: c.content,
            };
        };
        const ring = getComputedStyle(document.documentElement).getPropertyValue('--focus-ring');
        const me = g(el),
            b = g(el, '::before'),
            a = g(el, '::after'),
            l = lab ? g(lab) : null;
        const hasRingGrad = (x) => x && x.fp === '1' && /gradient/.test(x.bg);
        const pseudoBr = (x) => x && x.content !== 'none' && x.content !== 'normal' && x.mask !== 'none' && parseFloat(x.bw) > 0 && x.fp === '1';
        const brackets = hasRingGrad(me) || pseudoBr(b) || pseudoBr(a) || hasRingGrad(l) || hasRingGrad(a) || hasRingGrad(b);
        const cls = [...el.classList].filter((c) => c.startsWith('kp-')).join('.') || el.tagName.toLowerCase();
        return {
            sig:
                el.tagName.toLowerCase() +
                '.' +
                cls +
                '|' +
                (el.getAttribute('role') ?? '') +
                '|' +
                (el.closest('nav,.kp-pagination,.kp-sidenav,.kp-footer')?.className.split(' ')[0] ?? ''),
            brackets,
            ol: me.ol,
            fp: me.fp,
            x: r.x,
            y: r.y,
            w: r.width,
            h: r.height,
            text: (el.textContent || '').trim().slice(0, 20),
            lab: lab ? lab.className + ' fp=' + l.fp : null,
            par: el.parentElement.className,
            type: el.type,
            checked: el.checked,
            afterfp: a.fp,
            afterbg: a.bg.slice(0, 60),
            shadow: me.shadow.slice(0, 80),
        };
    });
    if (!d) continue;
    rows.push(d);
    if (!d.brackets && /check|sr-only/.test(d.sig)) console.log(JSON.stringify(d));
    if (!seen.has(d.sig)) {
        seen.set(d.sig, i);
        const pad = 14;
        const vp = page.viewportSize();
        const y = Math.max(0, Math.min(d.y - pad, vp.height - 20));
        if (d.w > 0 && d.y > -pad && d.y < vp.height) {
            await page
                .screenshot({
                    path: `${out}/tab-${String(seen.size).padStart(2, '0')}.png`,
                    clip: {
                        x: Math.max(0, d.x - pad),
                        y: Math.max(0, d.y - pad),
                        width: Math.min(d.w + 2 * pad, vp.width),
                        height: Math.min(d.h + 2 * pad, vp.height - Math.max(0, d.y - pad)),
                    },
                })
                .catch(() => {});
        }
        console.log(String(seen.size).padStart(2, '0'), i, d.sig, d.brackets ? 'BRACKETS' : 'NO-BRACKETS', 'ol:', d.ol, 'fp:', d.fp, d.text);
    }
}
console.log('stops', rows.length, 'signatures', seen.size, 'withoutBrackets', rows.filter((r) => !r.brackets).length);
await b.close();
server.close();
