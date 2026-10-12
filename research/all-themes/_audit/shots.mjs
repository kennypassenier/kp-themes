// @ts-nocheck: scratch audit tooling, not shipped
// Shots of the blocks whose colours Kenny judged in cyberpunk (buttons, alerts and prose, the month calendar),
// in $KP_THEME, Firefox, at rest: out/<theme>/shot-<block>.png, to lay side by side.
//   KP_THEME=formal node research/all-themes/_audit/shots.mjs
import { mkdirSync } from 'node:fs';
import { firefox } from '@playwright/test';
import { serve, openTheme, ROOT, THEME } from './lib.mjs';

const BLOCKS = {
    buttons: '#buttons',
    prose: 'section:has(#h-prose)',
    calendar: '[data-fa-calendar-stage]',
};
const server = await serve();
const browser = await firefox.launch();
const { page } = await openTheme(browser, `http://127.0.0.1:${server.address().port}/research/cyberpunk-applied/demo.html`);
await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
mkdirSync(`${ROOT}/research/all-themes/_audit/out/${THEME}`, { recursive: true });
for (const [name, sel] of Object.entries(BLOCKS)) {
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    await page.mouse.move(1, 1);
    await page.waitForTimeout(1500);
    await el.screenshot({ path: `${ROOT}/research/all-themes/_audit/out/${THEME}/shot-${name}.png` });
}
await browser.close();
server.close();
