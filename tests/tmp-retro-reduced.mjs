import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1280, height: 4200 }, reducedMotion: 'reduce' });
await page.goto('http://127.0.0.1:8776/research/retro-character/demo.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.addStyleTag({ content: '.rt-scene { content-visibility: visible !important; } .cat-bar, .cat-review-bar { position: static !important; }' });
console.log(await page.evaluate(() => [document.querySelector('[data-rt-motion]').hidden, document.getAnimations().length, [...new Set([...document.querySelectorAll('.rt-scene[data-rt-kind=cycle]')].map((s) => s.dataset.rtPhase))]]));
for (const id of ['direction', 'live', 'loading', 'leave']) {
    const row = page.locator(`[data-rt-aspect="${id}"] .rt-trio`);
    await row.evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await row.screenshot({ path: `/tmp/claude-0/-home-user-kp-themes/81c04b80-98ff-5f67-b577-d05d79aaa1ec/scratchpad/shots/reduced-${id}.png` });
}
await browser.close();
