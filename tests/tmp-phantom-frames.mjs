import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const out = '/tmp/claude-0/-home-user-kp-themes/81c04b80-98ff-5f67-b577-d05d79aaa1ec/scratchpad/phupd/frames';
mkdirSync(out, { recursive: true });
const width = Number(process.argv[2] || 1280);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('http://127.0.0.1:8757/research/phantom-anchor/demo.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.evaluate(() => { const p = document.createElement('span'); p.id = 'rv-flip-pause'; p.hidden = true; document.body.append(p); });
const frames = JSON.parse(process.argv[3] || '[["gap",0],["in",2],["in",3.5],["in",4.2],["in",4.8],["in",5.3],["in",6],["in",7.5],["out",1],["out",3],["out",4.5]]');
const unit = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--an-unit')) || 100);
const n = await page.locator('.an-scene[data-an-kind="cycle"]').count();
for (let i = 0; i < n; i++) {
    const scene = page.locator('.an-scene[data-an-kind="cycle"]').nth(i);
    await scene.scrollIntoViewIfNeeded();
    let k = 0;
    for (const [phase, t] of frames) {
        await scene.evaluate((el, [phase, t, unit]) => {
            return new Promise((res) => {
                for (const a of el.getAnimations({ subtree: true })) a.cancel();
                el.setAttribute('data-an-phase', 'gap');
                setTimeout(() => {
                    el.setAttribute('data-an-phase', phase);
                    setTimeout(() => {
                        for (const a of el.getAnimations({ subtree: true })) { a.pause(); a.currentTime = t * unit; }
                        setTimeout(res, 30);
                    }, 0);
                }, 0);
            });
        }, [phase, t, unit]);
        await scene.screenshot({ path: `${out}/${width}-o${i + 1}-${String(k++).padStart(2, '0')}.png`, animations: 'allow' });
    }
}
await browser.close();
