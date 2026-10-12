// @ts-nocheck: audit tooling, not shipped
// The alarm's close button in every state: computed colours and a screenshot per state.
//   node research/cyberpunk-applied/_audit/alarm-ack.mjs <outDir>
import process from 'node:process';
import { mkdirSync } from 'node:fs';
import { firefox } from '@playwright/test';
import { serve } from './lib.mjs';
const out = process.argv[2] ?? 'test-results/alarm-ack';
mkdirSync(out, { recursive: true });
const server = await serve();
const browser = await firefox.launch();
const page = await (
    await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 4, reducedMotion: 'no-preference' })
).newPage();
await page.goto(`http://127.0.0.1:${server.address().port}/research/cyberpunk-applied/demo.html`);
await page.waitForTimeout(800);
await page.locator('[data-kp-alarm="Pressure lost"]').scrollIntoViewIfNeeded();
await page.locator('[data-kp-alarm="Pressure lost"]').click();
await page.waitForTimeout(2500);
const ack = page.locator('dialog.kp-alarm .kp-alarm__ack');
const b = await ack.boundingBox();
const read = () =>
    ack.evaluate((e) => {
        const cs = getComputedStyle(e);
        const af = getComputedStyle(e, '::after'),
            bf = getComputedStyle(e, '::before');
        return {
            color: cs.color,
            bg: cs.backgroundColor,
            bgImage: cs.backgroundImage.slice(0, 60),
            shadow: cs.textShadow.slice(0, 60),
            before: [bf.content, bf.color, bf.backgroundColor],
            after: [af.content, af.color, af.backgroundColor],
        };
    });
const shot = (n) => page.screenshot({ path: `${out}/ack-${n}.png`, clip: { x: b.x - 10, y: b.y - 10, width: b.width + 20, height: b.height + 20 } });
console.log('rest', await read());
await page.mouse.move(5, 5);
await page.waitForTimeout(700);
await shot('rest');
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
await page.waitForTimeout(900);
console.log('hover', await read());
await shot('hover');
await page.mouse.down();
await page.waitForTimeout(400);
console.log('press', await read());
await shot('press');
await page.mouse.up();
await browser.close();
server.close();
