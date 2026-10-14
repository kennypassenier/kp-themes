// research/sidenav-minor: how every theme keeps a shut side navigation panel: its
// rectangle, visibility, opacity and clip-path once the closing has played out.
// An option that depends on "the shut panel is off the screen" (a peek strip made
// of the panel's own slide, a shadow) is only as good as this table: most themes
// leave the panel where it stands and hide it, none of them slides it away alike.
//
//   node research/sidenav-minor/shut-state.mjs [page=floating] [themes]
import process from 'node:process';
import { firefox } from 'playwright';

const [page = 'floating', themeList] = process.argv.slice(2);
const themes = (
    themeList ?? 'formal,light,dark,cyberpunk,synthwave,pastel,terminal,forest,blueprint,solstice,brutalism,deco,phantom,grotesk,nostromo,titanium'
).split(',');
const base = process.env.BASE ?? 'http://127.0.0.1:8761';
const browser = await firefox.launch();
const context = await browser.newContext({ viewport: { width: 1000, height: 700 }, reducedMotion: 'no-preference' });
for (const theme of themes) {
    const tab = await context.newPage();
    await tab.goto(`${base}/research/sidenav-minor/${page}.html?still&theme=${theme}`, { waitUntil: 'load' });
    await tab.waitForFunction((t) => document.documentElement.getAttribute('data-theme') === t, theme, { timeout: 8000 });
    await tab.waitForTimeout(800);
    const toggle = tab.locator('.kp-sidenav__launcher [data-kp-sidenav-toggle]');
    await toggle.click();
    await tab.waitForTimeout(2200);
    await toggle.click();
    await tab.waitForTimeout(2400);
    const state = await tab.evaluate(() => {
        const nav = document.querySelector('.kp-sidenav');
        const style = getComputedStyle(nav);
        const box = nav.getBoundingClientRect();
        return {
            left: Math.round(box.left),
            right: Math.round(box.right),
            visibility: style.visibility,
            opacity: style.opacity,
            clip: style.clipPath.slice(0, 44),
        };
    });
    console.log(
        `${theme.padEnd(10)} left ${String(state.left).padStart(5)} right ${String(state.right).padStart(5)}  ${state.visibility.padEnd(8)} opacity ${state.opacity}  clip ${state.clip}`,
    );
    await tab.close();
}
await browser.close();
