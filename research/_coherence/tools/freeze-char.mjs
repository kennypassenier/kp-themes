// Paused frames of one scene of a character demo: copy to tests/tmp-freeze-char.mjs and run
//   node tests/tmp-freeze-char.mjs research/<theme>-character <px> <rowIndex> <optionIndex> <ms,ms,...> [phase]
// A pseudo-element animating a registered custom property cannot be paused this way; look at it live.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const [demo, px, rowI, optI, msList, phase = 'in'] = process.argv.slice(2);
const out = `research/_coherence/out/freeze/${demo.replace(/\W+/g, '-')}`;
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1280, height: 1400 } });
await p.goto(`http://127.0.0.1:8743/${demo}/demo.html`, { waitUntil: 'networkidle' });
await p.waitForTimeout(800);
const row = p.locator(`[data-${px}-aspect]`).nth(Number(rowI));
await row.scrollIntoViewIfNeeded();
const scene = row.locator(`.${px}-scene`).nth(Number(optI));
for (const t of msList.split(',').map(Number)) {
    await p.evaluate(
        async ({ px, rowI, optI, phase, t }) => {
            const sc = document.querySelectorAll(`[data-${px}-aspect]`)[rowI].querySelectorAll(`.${px}-scene`)[optI];
            for (const a of sc.getAnimations({ subtree: true })) a.cancel();
            sc.setAttribute(`data-${px}-phase`, 'gap');
            await new Promise((r) => setTimeout(r, 40));
            sc.setAttribute(`data-${px}-phase`, phase);
            await new Promise((r) => setTimeout(r, 40));
            for (const a of sc.getAnimations({ subtree: true })) {
                a.pause();
                a.currentTime = t;
            }
            await new Promise((r) => setTimeout(r, 40));
        },
        { px, rowI: Number(rowI), optI: Number(optI), phase, t },
    );
    await scene.screenshot({ path: `${out}/r${rowI}-o${optI}-${phase}-${t}.png`, animations: 'allow' });
}
await b.close();
console.log('ok');
