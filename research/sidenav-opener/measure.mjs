// research/sidenav-opener: what the opener choice really does, measured in Firefox.
// Not a test; no gate runs it.
//
//   python3 -m http.server 8761 --bind 127.0.0.1   # from the repository root
//   node research/sidenav-opener/measure.mjs [widths=1600,390] [themes] [scenes=over,push,reserve,phone]
//
// Per theme, width, scene and opener it reports: the box the choice turns off is
// `display: none` with a zero rectangle and was never drawn in any frame from
// the start of the load (a rAF poller); the box it keeps is drawn inside the
// window; the panel's header and the page title keep the launcher's room only
// with a launcher; the panel opens and closes from the kept opener
// (data-kp-sidenav-open, aria-expanded on the kept toggler, inert once shut).
import process from 'node:process';
import { firefox } from 'playwright';

const [widthList = '1600,390', themeList, sceneList = 'over,push,reserve,phone'] = process.argv.slice(2);
const widths = widthList.split(',').map(Number);
const themes = (
    themeList ?? 'formal,light,dark,cyberpunk,synthwave,pastel,terminal,forest,blueprint,solstice,brutalism,deco,phantom,grotesk,nostromo,titanium'
).split(',');
const scenes = sceneList.split(',');
const base = process.env.BASE ?? 'http://127.0.0.1:8761';
const browser = await firefox.launch();
let rows = 0;
const faults = [];

for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 800 }, reducedMotion: 'no-preference' });
    for (const theme of themes) {
        for (const scene of scenes) {
            // The phone scene holds the panel over the page by width (over-below): at 1600 px its tab toggle is hidden by that option, by design.
            if (scene === 'phone' && width > 600) continue;
            // The phone scene is a 390 px page by design; the desktop scenes at 390 px are the window being narrow.
            for (const opener of ['launcher', 'tab']) {
                const page = await context.newPage();
                await page.addInitScript(() => {
                    /** @type {Record<string, number>} */
                    const drawn = { launcher: 0, tab: 0 };
                    Object.defineProperty(window, '__drawn', { value: drawn });
                    const tick = () => {
                        for (const key of ['launcher', 'tab']) {
                            const box = document.querySelector(`.kp-sidenav__${key}`);
                            if (box && getComputedStyle(box).display !== 'none') drawn[key] += 1;
                        }
                        if (performance.now() < 1500) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                });
                await page.goto(`${base}/research/sidenav-opener/${scene}-${opener}.html?still&theme=${theme}`, { waitUntil: 'load' });
                await page.waitForFunction((t) => document.documentElement.getAttribute('data-theme') === t, theme, { timeout: 8000 });
                await page.waitForTimeout(1600);
                const state = await page.evaluate(() => {
                    const rect = (/** @type {Element | null} */ el) => {
                        if (!el) return null;
                        const r = el.getBoundingClientRect();
                        return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left), y: Math.round(r.top) };
                    };
                    const nav = document.querySelector('.kp-sidenav');
                    const launcher = document.querySelector('.kp-sidenav__launcher');
                    const tab = document.querySelector('.kp-sidenav__tab');
                    const header = document.querySelector('.kp-sidenav__header');
                    const pageHeader = document.querySelector('.kp-page-header');
                    return {
                        drawn: /** @type {any} */ (window).__drawn,
                        launcher: { display: launcher && getComputedStyle(launcher).display, rect: rect(launcher) },
                        tab: { display: tab && getComputedStyle(tab).display, rect: rect(tab) },
                        launched: nav?.hasAttribute('data-kp-sidenav-launched'),
                        headerPad: header ? parseFloat(getComputedStyle(header).paddingInlineStart) : null,
                        pagePad: pageHeader ? parseFloat(getComputedStyle(pageHeader).paddingInlineStart) : null,
                        rem: parseFloat(getComputedStyle(document.documentElement).fontSize),
                        vw: innerWidth,
                    };
                });
                const kept = opener;
                const off = opener === 'launcher' ? 'tab' : 'launcher';
                const row = `${width} ${theme} ${scene} ${opener}`;
                /** @param {string} what */
                const fault = (what) => faults.push(`${row}: ${what}`);
                if (state.drawn[off] !== 0) fault(`${off} was drawn in ${state.drawn[off]} frame(s) during load`);
                if (state[off].display !== 'none' || state[off].rect?.w !== 0)
                    fault(`${off} not hidden (${state[off].display}, ${JSON.stringify(state[off].rect)})`);
                const keptRect = state[kept].rect;
                if (state[kept].display === 'none' || !keptRect || keptRect.w === 0 || keptRect.x + keptRect.w <= 0 || keptRect.x >= state.vw)
                    fault(`${kept} not drawn in the window (${JSON.stringify(keptRect)})`);
                const room = 2 * 8 + 36; // inset + size + inset at the default 16 px root, 0.5rem and 2.25rem
                if (opener === 'launcher' && (!state.launched || state.headerPad < room - 1))
                    fault(`launcher: panel header lost its room (launched ${state.launched}, ${state.headerPad}px)`);
                if (opener === 'tab' && (state.launched || state.headerPad >= room - 1))
                    fault(`tab: panel header keeps the launcher's room (launched ${state.launched}, ${state.headerPad}px)`);
                if (scene !== 'reserve' && opener === 'launcher' && state.pagePad < room - 1)
                    fault(`launcher: page header lost its room (${state.pagePad}px)`);
                if (scene !== 'reserve' && opener === 'tab' && state.pagePad >= room - 1)
                    fault(`tab: page header keeps the launcher's room (${state.pagePad}px)`);

                // Open and close from the kept opener.
                const toggle = page.locator(`.kp-sidenav__${kept} [data-kp-sidenav-toggle]`);
                await toggle.click();
                await page.waitForTimeout(1800);
                const open = await page.evaluate((k) => {
                    const nav = document.querySelector('.kp-sidenav');
                    const r = nav?.getBoundingClientRect();
                    const btn = document.querySelector(`.kp-sidenav__${k} [data-kp-sidenav-toggle]`);
                    return {
                        open: nav?.getAttribute('data-kp-sidenav-open'),
                        inert: nav instanceof HTMLElement ? nav.inert : null,
                        expanded: btn?.getAttribute('aria-expanded'),
                        controls: btn?.getAttribute('aria-controls'),
                        inView: !!r && r.width > 0 && r.left >= -1 && r.left < innerWidth,
                        focusIn: !!nav?.contains(document.activeElement),
                    };
                }, kept);
                if (open.open !== 'true' || open.inert || open.expanded !== 'true' || !open.inView || open.controls !== 'so-nav')
                    fault(`did not open from the ${kept}: ${JSON.stringify(open)}`);
                // The toggle stays reachable above the panel only when it is not covered; close with Escape (the way out every opener shares).
                await page.keyboard.press('Escape');
                await page.waitForTimeout(1800);
                const shut = await page.evaluate((k) => {
                    const nav = document.querySelector('.kp-sidenav');
                    const btn = document.querySelector(`.kp-sidenav__${k} [data-kp-sidenav-toggle]`);
                    return {
                        open: nav?.getAttribute('data-kp-sidenav-open'),
                        inert: nav instanceof HTMLElement ? nav.inert : null,
                        expanded: btn?.getAttribute('aria-expanded'),
                    };
                }, kept);
                if (shut.open !== 'false' || !shut.inert || shut.expanded !== 'false') fault(`did not close: ${JSON.stringify(shut)}`);
                rows += 1;
                await page.close();
            }
        }
    }
    await context.close();
}

// The default: a panel with no data-kp-sidenav-opener and a tab on the page behaves as "tab"
// (research/sidenav-edge/over.html holds both elements and no attribute); a panel with no tab keeps its launcher.
for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 800 }, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    await page.addInitScript(() => {
        const drawn = { launcher: 0, tab: 0 };
        Object.defineProperty(window, '__drawn', { value: drawn });
        const tick = () => {
            for (const key of ['launcher', 'tab']) {
                const box = document.querySelector(`.kp-sidenav__${key}`);
                if (box && getComputedStyle(box).display !== 'none') drawn[key] += 1;
            }
            if (performance.now() < 1500) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    });
    await page.goto(`${base}/research/sidenav-edge/over.html?still`, { waitUntil: 'load' });
    await page.waitForTimeout(1800);
    const state = await page.evaluate(() => {
        const nav = document.querySelector('.kp-sidenav');
        const launcher = document.querySelector('.kp-sidenav__launcher');
        const tab = document.querySelector('.kp-sidenav__tab');
        const w = (/** @type {Element | null} */ el) => (el ? Math.round(el.getBoundingClientRect().width) : null);
        const header = document.querySelector('.kp-sidenav__header');
        const asked = nav?.getAttribute('data-kp-sidenav-opener') ?? null;
        return {
            asked,
            drawn: /** @type {any} */ (window).__drawn,
            launcher: { display: launcher && getComputedStyle(launcher).display, w: w(launcher) },
            tab: { display: tab && getComputedStyle(tab).display, w: w(tab) },
            launched: nav?.hasAttribute('data-kp-sidenav-launched'),
            headerPad: header ? parseFloat(getComputedStyle(header).paddingInlineStart) : null,
        };
    });
    const row = `${width} default over.html`;
    if (state.asked !== null) faults.push(`${row}: the page was expected to carry no data-kp-sidenav-opener (${state.asked})`);
    if (state.drawn.launcher !== 0 || state.launcher.display !== 'none' || state.launcher.w !== 0)
        faults.push(`${row}: launcher drawn by default (${JSON.stringify(state)})`);
    if (state.tab.display === 'none' || !state.tab.w) faults.push(`${row}: tab not drawn by default (${JSON.stringify(state.tab)})`);
    if (state.launched || state.headerPad >= 2 * 8 + 36 - 1) faults.push(`${row}: panel header keeps the launcher's room (${state.headerPad}px)`);
    // No tab on the page: the launcher stays (the guard). The same page is served without its tab.
    const bare = await context.newPage();
    await bare.route('**/research/sidenav-edge/over.html*', async (route) => {
        const response = await route.fetch();
        const html = (await response.text()).replace(/<div class="kp-sidenav__tab">[\s\S]*?<\/div>/, '');
        await route.fulfill({ response, body: html });
    });
    await bare.goto(`${base}/research/sidenav-edge/over.html?still`, { waitUntil: 'load' });
    await bare.waitForTimeout(1800);
    const guard = await bare.evaluate(() => {
        const launcher = document.querySelector('.kp-sidenav__launcher');
        return {
            tabs: document.querySelectorAll('.kp-sidenav__tab').length,
            launcher: launcher && getComputedStyle(launcher).display,
            w: launcher ? Math.round(launcher.getBoundingClientRect().width) : null,
            launched: document.querySelector('.kp-sidenav')?.hasAttribute('data-kp-sidenav-launched'),
        };
    });
    if (guard.tabs !== 0 || guard.launcher === 'none' || !guard.w || !guard.launched)
        faults.push(`${row}: guard failed, a panel without a tab lost its launcher (${JSON.stringify(guard)})`);
    console.log(`guard ${width}: ${JSON.stringify(guard)}`);
    rows += 1;
    await context.close();
    console.log(`default ${width}: ${JSON.stringify(state)}`);
}
await browser.close();
console.log(`${rows} cases measured, ${faults.length} fault(s)`);
for (const line of faults) console.log(line);
process.exitCode = faults.length === 0 ? 0 : 1;
