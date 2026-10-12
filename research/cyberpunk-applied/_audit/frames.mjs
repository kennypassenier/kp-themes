// @ts-nocheck: audit tooling, not shipped
// Frames of one pair as Kenny sees them: a real mouse click, every animation paused and sought to
// the given milliseconds (element.animate() ones included), a screenshot of the part's region each.
//   node research/cyberpunk-applied/_audit/frames.mjs <palette|phone-frame|phone-390|alarm|drawer> <outDir> [ms,ms,...] [open|close]
import process from 'node:process';
import { mkdirSync } from 'node:fs';
import { firefox } from '@playwright/test';
import { serve } from './lib.mjs';

const [, , id, out, msArg = '0,60,180,300,480', phase = 'open'] = process.argv;
const times = msArg.split(',').map(Number);
const SPEC = {
    palette: { open: '[data-kp-palette-open="fa-pal"]', region: '#fa-pal', close: 'ESC', pad: 24 },
    alarm: { open: '[data-kp-alarm="Pressure lost"]', region: 'dialog.kp-alarm .kp-alarm__panel', close: 'dialog.kp-alarm .kp-alarm__ack', pad: 24 },
    drawer: { open: '[data-kp-dialog="fa-drawer"]', region: '#fa-drawer', close: '#fa-drawer [data-kp-dialog-close]:last-of-type', pad: 24 },
    'phone-frame': { open: '.fa-phone [data-kp-nav-toggle]', region: '.fa-phone', close: '.fa-phone [data-kp-nav-toggle]', pad: 16 },
    'phone-390': {
        open: '.fa-phone .kp-nav > [data-kp-nav-toggle]',
        region: '.fa-phone',
        close: '.fa-phone .kp-nav > [data-kp-nav-toggle]',
        pad: 16,
        viewport: { width: 390, height: 800 },
    },
};
const spec = SPEC[id];
mkdirSync(out, { recursive: true });
const server = await serve();
const browser = await firefox.launch();
const context = await browser.newContext({ viewport: spec.viewport ?? { width: 1280, height: 900 }, reducedMotion: 'no-preference' });
const page = await context.newPage();
await page.goto(`http://127.0.0.1:${server.address().port}/research/cyberpunk-applied/demo.html`);
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
await page.waitForTimeout(800);
// REVIEW=1: the way Kenny judges, the demo inside the review dialog's stage
if (process.env.REVIEW) {
    await page.getByRole('button', { name: /review in a dialog/i }).click();
    await page.waitForTimeout(1500);
}
const clickAt = async (sel) => {
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const b = await el.boundingBox();
    await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
};
await page.evaluate(() => (window.__ambient = new Set(document.getAnimations())));
const act = async (which) => (which === 'ESC' ? page.keyboard.press('Escape') : clickAt(which));
if (phase === 'close') {
    await act(spec.open);
    await page.waitForTimeout(1500);
    await page.evaluate(() => (window.__ambient = new Set(document.getAnimations())));
    await act(spec.close);
} else await act(spec.open);
const list = await page.evaluate(() => {
    const l = document.getAnimations().filter((a) => !window.__ambient.has(a) && Number.isFinite(Number(a.effect?.getComputedTiming().endTime)));
    l.forEach((a) => a.pause());
    window.__pair = l;
    return l.length;
});
console.log(id, phase, list, 'animations');
for (const ms of times) {
    await page.evaluate((t) => window.__pair.forEach((a) => (a.currentTime = Math.min(t, Number(a.effect.getComputedTiming().endTime) - 1))), ms);
    const region = page.locator(spec.region).first();
    const b = await region.boundingBox();
    const clip = { x: Math.max(0, b.x - spec.pad), y: Math.max(0, b.y - spec.pad), width: b.width + 2 * spec.pad, height: b.height + 2 * spec.pad };
    await page.screenshot({ path: `${out}/${id}-${phase}-${String(ms).padStart(3, '0')}.png`, clip });
}
await browser.close();
server.close();
