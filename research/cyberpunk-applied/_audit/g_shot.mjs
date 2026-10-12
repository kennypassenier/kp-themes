// @ts-nocheck: scratch
import { firefox, chromium } from '@playwright/test';
import { serve, openTheme } from './lib.mjs';
const eng = process.argv[2] ?? 'firefox';
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const b = await (eng === 'chromium' ? chromium : firefox).launch();
const { page } = await openTheme(b, `${base}/research/cyberpunk-applied/demo.html`);
const out = process.argv[3];
await page.evaluate(() => document.getElementById('table')?.scrollIntoView());
await page.locator('[data-fa-table="busy"]').click();
await page.waitForTimeout(1200);
await page
    .locator('.kp-datatable')
    .first()
    .screenshot({ path: `${out}/g-table-${eng}.png` });
await page.locator('[data-fa-table="ready"]').click();
await page.evaluate(() => document.getElementById('loading')?.scrollIntoView());
await page.waitForTimeout(700);
await page.screenshot({ path: `${out}/g-loading-${eng}.png` });
await page.evaluate(() => document.getElementById('calendar')?.scrollIntoView());
await page.locator('[data-fa-calendar="loading"]').click();
await page.waitForTimeout(800);
await page.screenshot({ path: `${out}/g-cal-${eng}.png` });
await b.close();
server.close();
