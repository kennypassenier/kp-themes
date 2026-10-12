// node freeze.mjs width  -> hcs/<width>-<opt>-<label>.png at frozen times (units into in / hold / out)
import { chromium } from 'playwright';
const S = 'research/_coherence/out';
const width = +process.argv[2] || 390;
const opts = (process.argv[3] || '1,2,3,4,5,6,7').split(',').map(Number);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
await p.goto('http://127.0.0.1:8753/research/high-contrast-anchor/demo.html', { waitUntil: 'networkidle' });
await p.evaluate(() => {
    const s = document.createElement('span');
    s.id = 'rv-flip-pause';
    s.textContent = 'x';
    s.hidden = true;
    document.body.append(s);
});
const u = 120;
const frames = [
    ['in', 2.5],
    ['in', 5],
    ['hold', 8],
    ['out', 2.5],
    ['out', 5.5],
];
for (const o of opts) {
    const scene = p.locator(`.an-col[data-an-option="${o}"] .an-scene`);
    let i = 0;
    for (const [phase, t] of frames) {
        await p.evaluate(
            async ({ o, phase, t, u }) => {
                const sc = document.querySelector(`.an-col[data-an-option="${o}"] .an-scene`);
                sc.setAttribute('data-an-phase', 'gap');
                await new Promise((r) => setTimeout(r, 30));
                for (const a of sc.getAnimations({ subtree: true })) a.cancel();
                sc.setAttribute('data-an-phase', phase === 'hold' ? 'hold' : phase);
                await new Promise((r) => setTimeout(r, 30));
                for (const a of sc.getAnimations({ subtree: true })) {
                    a.pause();
                    a.currentTime = phase === 'hold' ? 8 * u : t * u;
                }
                await new Promise((r) => setTimeout(r, 30));
            },
            { o, phase, t, u },
        );
        await scene.screenshot({ path: `${S}/${width}-${o}-${i++}.png`, animations: 'allow' });
    }
}
await b.close();
