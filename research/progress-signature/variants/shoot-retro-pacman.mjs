import { firefox } from 'playwright';
const url = 'http://127.0.0.1:8736/research/progress-signature/demo.html?theme=retro&variant=pacman&still';
const out = 'research/progress-signature/out/';
const b = await firefox.launch();
for (const [name, w, h] of [
    ['desktop', 1280, 900],
    ['phone', 390, 844],
]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(url);
    await p.waitForLoadState('networkidle');
    await p.waitForTimeout(400);
    await p.screenshot({ path: `${out}retro-pacman-${name}.png`, fullPage: true });
    if (name === 'desktop') {
        const bars = p.locator('.kp-progressbar');
        for (const [i, tag] of [
            [1, 'zoom'],
            [5, 'zoom-busy'],
        ]) {
            const bb = await bars.nth(i).boundingBox();
            const z = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 3 });
            await z.goto(url);
            await z.waitForLoadState('networkidle');
            await z.waitForTimeout(i === 5 ? 1200 : 400);
            await z.screenshot({
                path: `${out}retro-pacman-${tag}.png`,
                clip: { x: bb.x - 4, y: bb.y - 4, width: bb.width + 8, height: bb.height + 8 },
            });
        }
    }
}
await b.close();
