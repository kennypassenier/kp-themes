// @ts-nocheck: scratch: lays out/<theme>/shot-<block>.png side by side as out/sheet-<block>-<n>.png
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { firefox } from '@playwright/test';
const block = process.argv[2], per = +(process.argv[3] ?? 4), cols = +(process.argv[4] ?? 2);
const dir = new URL('./out/', import.meta.url).pathname;
const themes = JSON.parse(readFileSync(new URL('../../../themes/order.json', import.meta.url))).filter((t) => existsSync(`${dir}${t}/shot-${block}.png`));
const b = await firefox.launch(); const p = await b.newPage({ viewport: { width: 1800, height: 1000 } });
for (let i = 0; i < themes.length; i += per) {
  const html = `<body style="margin:0;background:#888;font:20px sans-serif;display:grid;grid-template-columns:repeat(${cols},1fr);gap:6px">` +
    themes.slice(i, i + per).map((t) => `<figure style="margin:0;background:#fff"><figcaption>${t}</figcaption><img style="width:100%" src="data:image/png;base64,${readFileSync(`${dir}${t}/shot-${block}.png`).toString('base64')}"></figure>`).join('') + '</body>';
  await p.setContent(html); await p.waitForTimeout(300);
  await p.screenshot({ path: `${dir}sheet-${block}-${i / per}.png`, fullPage: true });
}
await b.close();
