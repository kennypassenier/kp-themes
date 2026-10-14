import { firefox } from '@playwright/test';
const [page, theme = 'formal', secs = '14', w = '1100', h = '700', out = ''] = process.argv.slice(2);
const b = await firefox.launch();
const c = await b.newContext({ viewport: { width: Number(w), height: Number(h) } });
const p = await c.newPage();
p.on('console', (m) => console.log('console:', m.type(), m.text()));
p.on('pageerror', (e) => console.log('pageerror:', e.message));
await p.goto(`http://127.0.0.1:8772/research/sidenav-minor/${page}.html?theme=${theme}`);
const n = Number(secs);
for (let i = 1; i <= n; i += 1) {
    await p.waitForTimeout(1000);
    if (out) await p.screenshot({ path: `${out}-${String(i).padStart(2, '0')}.png` });
}
await b.close();
