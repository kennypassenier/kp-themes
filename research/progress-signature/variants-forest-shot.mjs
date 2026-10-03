import { firefox } from 'playwright';
const url = 'http://127.0.0.1:8735/research/progress-signature/demo.html?theme=forest&still';
const out = 'research/progress-signature/out/';
const b = await firefox.launch();
for (const [name, w, h] of [
    ['desktop', 1280, 900],
    ['phone', 390, 844],
]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(url);
    await p.waitForLoadState('networkidle');
    await p.waitForTimeout(600);
    await p.screenshot({ path: `${out}forest-${name}.png`, fullPage: true });
    await p.close();
}
// 3x crops: every bar, in motion and with reduced motion.
for (const motion of ['no-preference', 'reduce']) {
    const z = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 3, reducedMotion: motion });
    await z.goto(url);
    await z.waitForLoadState('networkidle');
    await z.waitForTimeout(1300);
    const bars = z.locator('.kp-progressbar');
    const first = await bars.nth(0).boundingBox();
    const last = await bars.nth(5).boundingBox();
    await z.screenshot({
        path: `${out}forest-zoom${motion === 'reduce' ? '-still' : ''}.png`,
        clip: { x: first.x - 6, y: first.y - 6, width: first.width + 12, height: last.y + last.height - first.y + 12 },
    });
    await z.close();
}
await b.close();
