// research/sidenav-minor: the "nothing changed" proof. Captures the computed
// styles (every property) and a screenshot hash of the existing
// research/sidenav-edge pages in every theme, shut and open, at desktop and
// phone width, in Firefox, and diffs two captures.
//
//   python3 -m http.server 8761 --bind 127.0.0.1        # from the repository root
//   node research/sidenav-minor/capture.mjs capture <out.json> [--port 8761]
//   node research/sidenav-minor/capture.mjs diff <before.json> <after.json>
import { firefox } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const [mode, a, b] = process.argv.slice(2);
const portAt = process.argv.indexOf('--port');
const port = portAt === -1 ? 8761 : Number(process.argv[portAt + 1]);

const PAGES = ['push', 'gutter', 'over', 'peek', 'rail'];
const SIZES = { desktop: { width: 1280, height: 800 }, phone: { width: 390, height: 780 } };
const THEMES = readdirSync(new URL('../../themes', import.meta.url), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
const PARTS = {
    panel: '.kp-sidenav',
    launcher: '.kp-sidenav__launcher',
    launcherButton: '.kp-sidenav__launcher button',
    tab: '.kp-sidenav__tab',
    main: '.se-main',
    header: '.kp-sidenav__header',
    title: '.kp-sidenav__title',
    link: '.kp-sidenav__link',
    current: '.kp-sidenav__link[aria-current]',
    category: '.kp-sidenav__category-toggle',
    footer: '.kp-sidenav__footer',
    pageHeader: '.kp-page-header',
};

/** Every computed property and the box of each part, in the page. */
function snapshot(PARTS) {
    const out = {};
    for (const [name, selector] of Object.entries(PARTS)) {
        const el = document.querySelector(selector);
        if (!el) {
            out[name] = null;
            continue;
        }
        const style = getComputedStyle(el);
        const props = {};
        for (const prop of style) props[prop] = style.getPropertyValue(prop);
        const r = el.getBoundingClientRect();
        props['@rect'] = [r.x, r.y, r.width, r.height].map((n) => Math.round(n * 100) / 100).join(',');
        props['@attrs'] = el.getAttributeNames().sort().map((n) => `${n}=${el.getAttribute(n)}`).join(' ');
        out[name] = props;
    }
    out.root = { '@attrs': document.documentElement.getAttributeNames().sort().map((n) => `${n}=${document.documentElement.getAttribute(n)}`).join(' ') };
    return out;
}

async function capture(file) {
    const browser = await firefox.launch();
    const result = {};
    for (const [sizeName, viewport] of Object.entries(SIZES)) {
        const context = await browser.newContext({ viewport, reducedMotion: 'no-preference' });
        for (const page of PAGES) {
            for (const theme of THEMES) {
                const tab = await context.newPage();
                await tab.goto(`http://127.0.0.1:${port}/research/sidenav-edge/${page}.html?theme=${theme}`);
                await tab.waitForFunction((t) => document.documentElement.getAttribute('data-theme') === t, theme);
                await tab.waitForTimeout(600);
                const key = `${sizeName}|${page}|${theme}`;
                for (const state of ['first', 'toggled']) {
                    if (state === 'toggled') {
                        const launcher = tab.locator('.kp-sidenav__launcher button');
                        const rail = tab.locator('[data-kp-sidenav-slim-toggle]');
                        if ((await launcher.count()) > 0) await launcher.click();
                        else if ((await rail.count()) > 0) await rail.first().click();
                        else await tab.locator('.kp-sidenav').hover();
                        if (page !== 'peek') await tab.mouse.move(viewport.width - 2, viewport.height - 2);
                        else await tab.waitForTimeout(400);
                        await tab.waitForTimeout(1200);
                    }
                    const styles = await tab.evaluate(snapshot, PARTS);
                    const shot = await tab.screenshot({ animations: 'disabled' });
                    result[`${key}|${state}`] = { styles, shot: createHash('sha256').update(shot).digest('hex').slice(0, 16) };
                }
                await tab.close();
            }
        }
        await context.close();
    }
    await browser.close();
    writeFileSync(file, JSON.stringify(result));
    console.log(`captured ${Object.keys(result).length} states in ${THEMES.length} themes -> ${file}`);
}

function diff(fileA, fileB) {
    const x = JSON.parse(readFileSync(fileA, 'utf8'));
    const y = JSON.parse(readFileSync(fileB, 'utf8'));
    let states = 0;
    let props = 0;
    let shots = 0;
    const lines = [];
    for (const key of new Set([...Object.keys(x), ...Object.keys(y)])) {
        states += 1;
        if (!x[key] || !y[key]) {
            lines.push(`${key}: missing on one side`);
            continue;
        }
        if (x[key].shot !== y[key].shot) {
            shots += 1;
            lines.push(`${key}: screenshot ${x[key].shot} -> ${y[key].shot}`);
        }
        for (const part of new Set([...Object.keys(x[key].styles), ...Object.keys(y[key].styles)])) {
            const p = x[key].styles[part] ?? {};
            const q = y[key].styles[part] ?? {};
            for (const prop of new Set([...Object.keys(p), ...Object.keys(q)])) {
                if (p[prop] !== q[prop]) {
                    props += 1;
                    lines.push(`${key} ${part} ${prop}: ${p[prop]} -> ${q[prop]}`);
                }
            }
        }
    }
    console.log(lines.slice(0, 60).join('\n'));
    console.log(`states compared: ${states}; computed-property differences: ${props}; screenshot differences: ${shots}`);
    process.exitCode = props + shots === 0 ? 0 : 1;
}

if (mode === 'capture') await capture(a);
else if (mode === 'diff') diff(a, b);
else console.log('usage: capture <out.json> | diff <before.json> <after.json>');
