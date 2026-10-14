// Samples the panel's `margin on its edge, frame by frame while the refused cue plays,
// per theme: how far it is pulled, how long it takes, whether the return
// mirrors the pull.
//   node research/sidenav-minor/refuse-probe.mjs <theme>... [--port 8772]
import { firefox } from '@playwright/test';
const args = process.argv.slice(2);
const portAt = args.indexOf('--port');
const port = portAt === -1 ? 8772 : Number(args[portAt + 1]);
const themes = args.filter((a, i) => !a.startsWith('--') && (portAt === -1 || i !== portAt + 1));
const b = await firefox.launch();
for (const theme of themes) {
    const p = await (await b.newContext({ viewport: { width: 1100, height: 700 } })).newPage();
    await p.addInitScript(() => {
        window.__cue = null;
        const watch = () => {
            const el = document.querySelector('.kp-sidenav');
            if (!el) return requestAnimationFrame(watch);
            let on = false;
            const t0 = { v: 0 };
            const tick = () => {
                const now = el.hasAttribute('data-kp-sidenav-refused');
                if (now && !on) {
                    on = true;
                    t0.v = performance.now();
                    window.__cue = [];
                }
                if (on) {
                    window.__cue.push([Math.round(performance.now() - t0.v), parseFloat(getComputedStyle(el).marginInlineStart) || 0]);
                    if (!now) {
                        on = 'done';
                        window.__cueDone = true;
                    }
                }
                if (on !== 'done') requestAnimationFrame(tick);
            };
            tick();
        };
        watch();
    });
    await p.goto(`http://127.0.0.1:${port}/research/sidenav-minor/opt-static.html?theme=${theme}`);
    await p.waitForFunction(() => window.__cueDone === true, null, { timeout: 40000 });
    const cue = await p.evaluate(() => window.__cue);
    const xs = cue.map((s) => s[1]);
    const peak = Math.min(...xs);
    const at = xs.indexOf(peak);
    const total = cue.at(-1)[0];
    const style = await p.evaluate(() => {
        const s = getComputedStyle(document.querySelector('.kp-sidenav'));
        return `${s.getPropertyValue('--kp-sidenav-duration').trim() || '(fx)'} ${s.getPropertyValue('--kp-sidenav-ease').trim() || '(fx)'}`;
    });
    console.log(
        `${theme.padEnd(11)} ${String(cue.length).padStart(3)} frames  ${String(total).padStart(4)} ms  peak ${peak.toFixed(1)}px at ${cue[at][0]} ms   tokens: ${style}`,
    );
    await p.context().close();
}
await b.close();
