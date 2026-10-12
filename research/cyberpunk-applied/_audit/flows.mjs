// @ts-nocheck: scratch audit tooling for the cyberpunk review, not shipped
// Lesson 28: judge the way Kenny judges. The review dialog's stage (demo.html?review=open&next=...),
// the stage scrolled to the section, real mouse clicks at coordinates (page.mouse, no scroll), and for
// every animation frame the rectangle, opacity, translate, clip-path, shadows and getAnimations()
// (script animations included) of the parts that move.
//   node research/cyberpunk-applied/_audit/flows.mjs [--engine firefox|chromium|both] [--only dialog,tour]
// Writes out/flows-<engine>.json. Nothing in css/ or js/ is changed.
import { mkdirSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import { chromium, firefox } from '@playwright/test';
import { serve, ROOT } from './lib.mjs';

const args = process.argv.slice(2);
const flag = (n, d) => {
    const i = args.indexOf(`--${n}`);
    return i === -1 ? d : (args[i + 1] ?? true);
};
const engines = flag('engine', 'both') === 'both' ? ['firefox', 'chromium'] : [flag('engine')];
const only = String(flag('only', '')).split(',').filter(Boolean);
const STAGE_URL = '/research/cyberpunk-applied/demo.html?review=open&next=/catalogue/changed.html';

/** Installed in every page: the per-frame probe and the rAF recorder. */
function install() {
    window.__probe = (sels) =>
        sels.map((sel) => {
            const el = document.querySelector(sel);
            if (!el) return null;
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            const mine = document.getAnimations().filter((a) => a.effect && a.effect.target === el);
            const subs = document
                .getAnimations()
                .filter((a) => a.effect && a.effect.target && a.effect.target !== el && el.contains(a.effect.target));
            const label = (a) =>
                `${a.animationName ?? a.transitionProperty ?? 'script'}${a.effect.pseudoElement ?? ''}:${Math.round(Number(a.effect.getComputedTiming().duration))}:${a.effect.getTiming().easing.slice(0, 16)}`;
            let bd = null;
            if (el.matches('dialog, [popover]')) {
                try {
                    bd = parseFloat(getComputedStyle(el, '::backdrop').opacity);
                } catch {}
            }
            const hash = (s) => {
                let h = 0;
                for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
                return h;
            };
            return {
                r: [r.left, r.top, r.width, r.height].map((v) => Math.round(v * 2) / 2),
                op: +parseFloat(cs.opacity).toFixed(2),
                tr: `${cs.translate}|${cs.transform}`,
                clip: hash(cs.clipPath),
                sh: hash(cs.boxShadow + cs.textShadow + cs.filter),
                vis: cs.visibility === 'hidden' || cs.display === 'none' ? 0 : 1,
                bd,
                an: mine.map(label),
                sub: [...new Set(subs.map(label))],
            };
        });
    window.__rec = (sels, ms) =>
        new Promise((res) => {
            const out = [];
            const t0 = performance.now();
            (function tick() {
                const t = performance.now() - t0;
                out.push([Math.round(t), window.__probe(sels)]);
                if (t < ms) requestAnimationFrame(tick);
                else res(out);
            })();
        });
}

const key = (f) => (f ? JSON.stringify([f.r, f.op, f.tr, f.clip, f.sh, f.vis, f.bd]) : 'none');

/** Reduce a series to the facts Kenny sees: how long it moves, in how many poses, how big a jump, what animations ran. */
function analyze(series, sels) {
    const out = {};
    sels.forEach((sel, i) => {
        const fr = series.map(([t, a]) => [t, a[i]]);
        const keys = fr.map(([, f]) => key(f));
        let first = null,
            last = null;
        for (let k = 1; k < fr.length; k++)
            if (keys[k] !== keys[k - 1]) {
                if (first === null) first = fr[k][0];
                last = fr[k][0];
            }
        const poses = [];
        keys.forEach((k, idx) => {
            if (!poses.length || poses[poses.length - 1].k !== k) poses.push({ k, t: fr[idx][0], f: fr[idx][1] });
        });
        const rects = fr.map(([, f]) => f?.r).filter(Boolean);
        const dim = (n) => rects.map((r) => r[n]);
        let maxJump = 0;
        for (let k = 1; k < rects.length; k++)
            maxJump = Math.max(
                maxJump,
                Math.abs(rects[k][2] - rects[k - 1][2]),
                Math.abs(rects[k][3] - rects[k - 1][3]),
                Math.abs(rects[k][0] - rects[k - 1][0]),
                Math.abs(rects[k][1] - rects[k - 1][1]),
            );
        const names = new Set();
        let maxAn = 0;
        fr.forEach(([, f]) => {
            if (!f) return;
            f.an.forEach((n) => names.add(n));
            f.sub.forEach((n) => names.add('sub:' + n));
            maxAn = Math.max(maxAn, f.an.length + f.sub.length);
        });
        const ops = fr.map(([, f]) => f?.op).filter((v) => v !== undefined);
        const gaps = poses.slice(1).map((p, j) => p.t - poses[j].t);
        out[sel] = {
            present: fr.some(([, f]) => f),
            movesMs: first === null ? 0 : last - first,
            startMs: first,
            poses: poses.length,
            gapsMs: gaps.slice(0, 14),
            w: [Math.min(...dim(2)), Math.max(...dim(2))],
            h: [Math.min(...dim(3)), Math.max(...dim(3))],
            op: [Math.min(...ops), Math.max(...ops)],
            maxJump: +maxJump.toFixed(1),
            anims: [...names].slice(0, 12),
            maxAnims: maxAn,
            first: poses[0]?.f && { r: poses[0].f.r, op: poses[0].f.op },
            lastp: poses.at(-1)?.f && { r: poses.at(-1).f.r, op: poses.at(-1).f.op },
            trace: poses.slice(0, 18).map((p) => [p.t, p.f?.r[2], p.f?.r[3], p.f?.op]),
            _poseKeys: poses.map((p) => p.k),
        };
    });
    return out;
}

/** How much of the close is the open reversed, per selector (pose by pose, ends trimmed). */
function mirror(open, close) {
    const out = {};
    for (const sel of Object.keys(open)) {
        const a = open[sel]?._poseKeys ?? [],
            b = (close[sel]?._poseKeys ?? []).slice().reverse();
        if (!a.length || !b.length) continue;
        const n = Math.max(a.length, b.length);
        let same = 0;
        for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] === b[i]) same++;
        out[sel] = {
            openPoses: a.length,
            closePoses: b.length,
            samePoses: same,
            ofMax: +(same / n).toFixed(2),
            openMs: open[sel].movesMs,
            closeMs: close[sel].movesMs,
        };
    }
    return out;
}

async function openStage(browser, { width = 1280, height = 900, url = STAGE_URL, stage = true } = {}) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'no-preference' });
    await context.addInitScript(() => {
        try {
            localStorage.setItem('theme', 'cyberpunk');
        } catch {}
    });
    const page = await context.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto(`${base}${url}`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(stage ? 3500 : 1500);
    await page.evaluate(() => {
        for (const el of document.querySelectorAll('.cat-block[hidden], .cat-component[hidden], .cat-section[hidden], .cat-group[hidden]'))
            el.removeAttribute('hidden');
    });
    await page.addStyleTag({ content: '*{scroll-behavior:auto!important}' });
    await page.evaluate(install);
    page.__errs = errs;
    return { context, page };
}

/** Scroll the stage (or the window) so the element sits mid-view, then return its click point. No Playwright scroll. */
async function pointOf(page, sel, { dx = 0.5, dy = 0.5, pick = 0 } = {}) {
    return page.evaluate(
        ([s, dx, dy, pick]) => {
            const el = document.querySelectorAll(s)[pick];
            if (!el) return null;
            const box = el.closest('.rv-dialog__view');
            const hit = () => {
                const r = el.getBoundingClientRect();
                const x = r.left + r.width * dx,
                    y = r.top + r.height * dy;
                const t = document.elementFromPoint(x, y);
                return { x, y, ok: !!t && (t === el || el.contains(t) || t.contains(el)) };
            };
            // a part that is already under the pointer is not scrolled to (a fixed panel would move away from under it, lesson 28)
            {
                const h0 = hit();
                const r = el.getBoundingClientRect();
                if (h0.ok && r.top > 60 && r.bottom < innerHeight - 10) return { x: h0.x, y: h0.y };
            }
            // the review dialog has a pinned header: try the element at several heights of the window until it is the one hit
            for (const f of [0.62, 0.5, 0.75, 0.4, 0.85]) {
                const r0 = el.getBoundingClientRect();
                if (box) box.scrollTop += r0.top + r0.height / 2 - innerHeight * f;
                else if (r0.top < 30 || r0.bottom > innerHeight - 30) scrollBy(0, r0.top + r0.height / 2 - innerHeight * f);
                const h = hit();
                if (h.ok) return { x: h.x, y: h.y };
            }
            const h = hit();
            return { x: h.x, y: h.y, covered: true };
        },
        [sel, dx, dy, pick],
    );
}

const sectionTo = (page, id) =>
    page.evaluate((i) => {
        const el = document.getElementById(i);
        const view = el?.closest('.rv-dialog__view');
        if (!el) return false;
        if (view) view.scrollTop += el.getBoundingClientRect().top - view.getBoundingClientRect().top;
        else el.scrollIntoView({ block: 'start' });
        return true;
    }, id);

const click = async (page, sel, opts) => {
    const p = await pointOf(page, sel, opts);
    if (!p) throw new Error(`no element ${sel}`);
    await page.mouse.move(p.x, p.y);
    await page.mouse.down();
    await page.mouse.up();
};
const hover = async (page, sel, opts) => {
    const p = await pointOf(page, sel, opts);
    if (!p) throw new Error(`no element ${sel}`);
    await page.mouse.move(p.x, p.y);
};

/** Start the recorder, run the action, return the analysed series. */
async function step(page, sels, ms, action) {
    const rec = page.evaluate(([s, m]) => window.__rec(s, m), [sels, ms]);
    rec.catch(() => {});
    await page.waitForTimeout(60);
    try {
        await action();
    } catch (e) {
        await rec.catch(() => {});
        throw e;
    }
    const series = await rec;
    return analyze(series, sels);
}

const results = {};
const wanted = (id) => only.length === 0 || only.includes(id);
async function flow(browser, id, opts, fn) {
    if (!wanted(id)) return;
    const { context, page } = await openStage(browser, opts);
    const rec = (results[id] = {});
    try {
        await fn(page, rec);
    } catch (e) {
        rec.ERROR = String(e.message).split('\n')[0];
    }
    rec.pageErrors = page.__errs;
    await context.close();
    process.stdout.write(`${id} ${rec.ERROR ? 'ERR ' + rec.ERROR : 'ok'}\n`);
}

const gone = (page, sel) =>
    page.evaluate((s) => {
        const e = document.querySelector(s);
        return !e || getComputedStyle(e).display === 'none' || !e.getClientRects().length;
    }, sel);

/** An open/close pair on one trigger. */
async function pair(page, rec, { section, probes, closeProbes = probes, open, close, openMs = 1000, closeMs = 1300, after = 700 }) {
    await sectionTo(page, section);
    await page.waitForTimeout(500);
    rec.open = await step(page, probes, openMs, open);
    await page.waitForTimeout(after);
    rec.close = await step(page, closeProbes, closeMs, close);
    await page.waitForTimeout(after);
    // a popover hidden by the browser is gone at once; its close plays on a ghost copy (js/motion.js), so the close is read on that
    if (closeProbes !== probes) closeProbes.forEach((c, i) => (rec.close[probes[i]] = rec.close[c]));
    rec.mirror = mirror(rec.open, rec.close);
}

async function run(engine) {
    const browser = await (engine === 'chromium' ? chromium : firefox).launch();
    for (const k of Object.keys(results)) delete results[k];

    await flow(browser, 'dialog', {}, (p, r) =>
        pair(p, r, {
            section: 'dialogs',
            probes: ['#fa-dialog'],
            open: () => click(p, '[data-kp-dialog="fa-dialog"]'),
            close: () => click(p, '#fa-dialog [data-kp-dialog-close="keep"]'),
        }),
    );
    await flow(browser, 'drawer', {}, (p, r) =>
        pair(p, r, {
            section: 'dialogs',
            probes: ['#fa-drawer'],
            open: () => click(p, '[data-kp-dialog="fa-drawer"]'),
            close: () => click(p, '#fa-drawer [data-kp-dialog-close]', { pick: 0 }),
        }),
    );
    await flow(browser, 'palette', {}, (p, r) =>
        pair(p, r, {
            section: 'palette',
            probes: ['#fa-pal', '#fa-pal .kp-palette__list'],
            open: () => click(p, '[data-kp-palette-open="fa-pal"]'),
            close: () => p.keyboard.press('Escape'),
        }),
    );
    await flow(browser, 'alarm', {}, (p, r) =>
        pair(p, r, {
            section: 'alarm',
            probes: ['dialog.kp-alarm'],
            open: () => click(p, '[data-kp-alarm="Pressure lost"]'),
            close: () => click(p, 'dialog.kp-alarm .kp-alarm__ack'),
        }),
    );
    await flow(browser, 'sidenav-over', {}, (p, r) =>
        pair(p, r, {
            section: 'sidenav',
            probes: ['#fa-over', '#fa-over .kp-sidenav__list, #fa-over a', '.kp-sidenav__backdrop'],
            open: () => click(p, 'button.kp-sidenav__toggle[aria-controls="fa-over"]'),
            close: () => click(p, '#fa-over button[data-kp-sidenav-toggle]'),
        }),
    );
    await flow(browser, 'sidenav-push', {}, async (p, r) => {
        await p.evaluate(() => {
            const n = document.getElementById('fa-over');
            n.setAttribute('data-kp-sidenav-mode', 'push');
            n.removeAttribute('data-kp-sidenav-backdrop');
        });
        await p.waitForTimeout(400);
        await pair(p, r, {
            section: 'sidenav',
            probes: ['#fa-over', '#fa-side'],
            open: () => click(p, 'button.kp-sidenav__toggle[aria-controls="fa-over"]'),
            close: () => click(p, '#fa-over button[data-kp-sidenav-toggle]'),
        });
    });
    await flow(browser, 'sidenav-group', {}, async (p, r) => {
        await sectionTo(p, 'sidenav');
        const sel = '#fa-side .kp-sidenav__category:not([data-kp-sidenav-expanded]) .kp-sidenav__category-toggle';
        await p.evaluate((s) => document.querySelector(s)?.setAttribute('data-audit-t', ''), sel);
        const probes = ['[data-audit-t] + *, [data-audit-t] ~ ul', '#fa-side'];
        r.open = await step(p, probes, 1200, () => click(p, '[data-audit-t]'));
        await p.waitForTimeout(600);
        r.close = await step(p, probes, 1200, () => click(p, '[data-audit-t]'));
        r.mirror = mirror(r.open, r.close);
    });
    await flow(browser, 'theme-menu', {}, async (p, r) => {
        await pair(p, r, {
            section: 'theme-menu',
            probes: ['[data-fa-theme-menu] [popover]'],
            closeProbes: ['[data-kp-ghost]'],
            open: () => click(p, '[data-fa-theme-menu] button'),
            // not Escape: the review dialog's own capture handler closes the whole stage on Escape (research/_review/review.js)
            close: () => click(p, '[data-fa-theme-menu] button'),
        });
        r.react = {};
        await pair(p, r.react, {
            section: 'theme-menu',
            probes: ['[data-fa-react] .kp-theme-menu__list'],
            open: () => click(p, '[data-fa-react] button'),
            close: () => click(p, '[data-fa-react] button'),
        });
    });
    await flow(browser, 'row-actions', {}, (p, r) =>
        pair(p, r, {
            section: 'popover-menus',
            probes: ['#fa-menu'],
            closeProbes: ['[data-kp-ghost]'],
            open: () => click(p, '[popovertarget="fa-menu"]'),
            close: () => click(p, '[popovertarget="fa-menu"]'),
        }),
    );
    await flow(browser, 'combobox', {}, async (p, r) => {
        await sectionTo(p, 'combobox');
        await p.waitForTimeout(400);
        const probes = ['.kp-combobox__list'];
        r.open = await step(p, probes, 1000, () => click(p, '.kp-combobox__input'));
        await p.waitForTimeout(600);
        r.type = await step(p, probes, 800, () => p.keyboard.type('ba', { delay: 60 }));
        await p.waitForTimeout(400);
        r.close = await step(p, ['[data-kp-ghost]'], 1200, () => click(p, '#combobox h2, #h-combobox'));
        r.close['.kp-combobox__list'] = r.close['[data-kp-ghost]'];
        await p.waitForTimeout(600);
        r.reopen = await step(p, probes, 1000, () => p.keyboard.press('ArrowDown'));
        r.mirror = mirror(r.open, r.close);
        r.mirrorReopen = mirror(r.reopen, r.close);
    });
    await flow(browser, 'datepicker', {}, async (p, r) => {
        await sectionTo(p, 'datepicker');
        await p.waitForTimeout(400);
        const panel = '[data-kp-date-panel]';
        const probes = [panel, `${panel} .kp-datepicker__grid`, `${panel} .kp-datepicker__head`];
        r.open = await step(p, probes, 1000, () => click(p, '[data-kp-date-open]'));
        await p.waitForTimeout(600);
        const head = (i) => () => click(p, `${panel} .kp-datepicker__head button`, { pick: i });
        r.next = await step(p, probes, 900, head(2));
        await p.waitForTimeout(300);
        r.prev = await step(p, probes, 900, head(0));
        await p.waitForTimeout(300);
        r.title = await step(p, probes, 900, head(1));
        await p.waitForTimeout(300);
        r.year = await step(p, probes, 900, head(1));
        await p.waitForTimeout(300);
        r.pickYear = await step(p, probes, 900, () => click(p, `${panel} .kp-datepicker__grid button`, { pick: 4 }));
        await p.waitForTimeout(300);
        r.pickMonth = await step(p, probes, 900, () => click(p, `${panel} .kp-datepicker__grid button`, { pick: 2 }));
        await p.waitForTimeout(300);
        r.day = await step(p, probes, 1300, () => click(p, `${panel} .kp-datepicker__day:not([disabled])`, { pick: 9 }));
        r.mirror = mirror(r.open, r.day);
        await p.waitForTimeout(500);
        await click(p, '[data-kp-date-open]');
        await p.waitForTimeout(900);
        r.escape = await step(p, probes, 1300, () => p.keyboard.press('Escape'));
        r.mirrorEsc = mirror(r.open, r.escape);
    });
    await flow(browser, 'tour', {}, async (p, r) => {
        await sectionTo(p, 'tour');
        await p.waitForTimeout(400);
        const targets = ['[data-fa-tour="actions"]', '[data-fa-tour="search"]', '[data-fa-tour="note"]'];
        const probes = ['.kp-tour', ...targets];
        r.before = await p.evaluate(
            (t) =>
                t.map((s) => {
                    const e = document.querySelector(s);
                    const x = e.getBoundingClientRect();
                    return [x.left, x.top, x.width, x.height].map(Math.round);
                }),
            targets,
        );
        r.open = await step(p, probes, 1200, () => click(p, '[data-fa-tour-start]'));
        await p.waitForTimeout(700);
        r.during = await p.evaluate(
            (t) =>
                t.map((s) => {
                    const e = document.querySelector(s);
                    const x = e.getBoundingClientRect();
                    return [x.left, x.top, x.width, x.height].map(Math.round);
                }),
            targets,
        );
        r.shift = JSON.stringify(r.before) !== JSON.stringify(r.during);
        for (let i = 1; i <= 3; i++) {
            const label = await p.evaluate(() => [...document.querySelectorAll('.kp-tour__buttons button')].map((b) => b.textContent.trim()));
            r[`step${i}`] = {
                buttons: label,
                ...(await step(p, probes, 1100, async () => {
                    const idx = label.findIndex((t) => /next|done|finish|end/i.test(t));
                    await click(p, '.kp-tour__buttons button', { pick: idx < 0 ? 1 : idx });
                })),
            };
            await p.waitForTimeout(500);
            if (!(await p.evaluate(() => document.querySelector('.kp-tour')?.hasAttribute('open')))) break;
        }
        if (await p.evaluate(() => document.querySelector('.kp-tour')?.hasAttribute('open'))) {
            r.close = await step(p, probes, 1300, () => p.keyboard.press('Escape'));
        } else {
            await click(p, '[data-fa-tour-start]');
            await p.waitForTimeout(900);
            r.close = await step(p, probes, 1300, () => p.keyboard.press('Escape'));
        }
        r.mirror = mirror(r.open, r.close);
    });
    await flow(browser, 'tabs', {}, async (p, r) => {
        await sectionTo(p, 'links');
        await p.waitForTimeout(400);
        const probes = ['#fa-panel-1', '#fa-panel-2', '.kp-tabs'];
        r.switch = await step(p, probes, 1500, () => click(p, '.kp-tabs [role="tab"]', { pick: 1 }));
        await p.waitForTimeout(500);
        r.back = await step(p, probes, 1500, () => click(p, '.kp-tabs [role="tab"]', { pick: 0 }));
    });
    await flow(browser, 'accordion', {}, async (p, r) => {
        await sectionTo(p, 'tree');
        await p.waitForTimeout(400);
        const probes = [
            '.kp-accordion__item:nth-child(2)',
            '.kp-accordion__item:nth-child(2) .kp-accordion__content, .kp-accordion__item:nth-child(2) > :not(summary)',
        ];
        r.open = await step(p, probes, 1200, () => click(p, '.kp-accordion__item:nth-child(2) .kp-accordion__summary'));
        await p.waitForTimeout(500);
        r.close = await step(p, probes, 1200, () => click(p, '.kp-accordion__item:nth-child(2) .kp-accordion__summary'));
        r.mirror = mirror(r.open, r.close);
    });
    await flow(browser, 'tree', {}, async (p, r) => {
        await sectionTo(p, 'tree');
        await p.waitForTimeout(400);
        const probes = ['[data-kp-tree] > li:first-child > ul', '[data-kp-tree]', '[data-kp-tree] > li:nth-child(2)'];
        // scrolled into place first: a scroll inside the recorded click moved the box's top and read as a pose
        await pointOf(p, '[data-kp-tree] > li:first-child', { dx: 0.08, dy: 0.04 });
        await p.waitForTimeout(300);
        r.open = await step(p, probes, 1200, () => click(p, '[data-kp-tree] > li:first-child', { dx: 0.08, dy: 0.04 }));
        await p.waitForTimeout(500);
        r.close = await step(p, probes, 1200, () => click(p, '[data-kp-tree] > li:first-child', { dx: 0.08, dy: 0.04 }));
        r.mirror = mirror(r.open, r.close);
    });
    await flow(browser, 'table', {}, async (p, r) => {
        await sectionTo(p, 'table');
        await p.waitForTimeout(500);
        const probes = ['.kp-datatable__busy-overlay', '.kp-datatable__busy-panel', '.kp-datatable__status .kp-spinner', '.kp-datatable'];
        r.busyOn = await step(p, probes, 1500, () => click(p, '[data-fa-table="busy"]'));
        await p.waitForTimeout(600);
        r.busyOff = await step(p, probes, 1500, () => click(p, '[data-fa-table="ready"]'));
        r.busyMirror = mirror(r.busyOn, r.busyOff);
        await p.waitForTimeout(600);
        const empty = ['[data-kp-datatable-empty]', '.kp-datatable'];
        await click(p, '.kp-datatable__search, [data-fa-dt] input[type="search"], [data-fa-dt] input');
        r.emptyOn = await step(p, empty, 1500, () => p.keyboard.type('zzzzzz', { delay: 40 }));
        await p.waitForTimeout(400);
        r.emptyOff = await step(p, empty, 1500, async () => {
            await p.keyboard.press('Control+a');
            await p.keyboard.press('Backspace');
        });
        r.emptyMirror = mirror(r.emptyOn, r.emptyOff);
    });
    await flow(browser, 'upload', {}, async (p, r) => {
        await sectionTo(p, 'fields');
        await p.waitForTimeout(500);
        const probes = ['.kp-upload__file', '.kp-upload__list'];
        r.add = await step(p, probes, 1500, () =>
            p.setInputFiles('#fa-up', { name: 'pump-log.csv', mimeType: 'text/csv', buffer: Buffer.from('a,b\n1,2\n') }),
        );
        await p.waitForTimeout(600);
        r.remove = await step(p, probes, 1500, () => click(p, '.kp-upload__file button'));
        r.mirror = mirror(r.add, r.remove);
    });
    await flow(browser, 'phone-frame', {}, async (p, r) => {
        await sectionTo(p, 'bar');
        await p.waitForTimeout(400);
        const probes = ['.fa-phone .kp-nav__links', '.fa-phone .kp-nav', '.fa-phone__body', '.fa-phone [data-kp-nav-toggle]'];
        r.open = await step(p, probes, 1200, () => click(p, '.fa-phone [data-kp-nav-toggle]'));
        await p.waitForTimeout(600);
        r.close = await step(p, probes, 1200, () => click(p, '.fa-phone [data-kp-nav-toggle]'));
        r.mirror = mirror(r.open, r.close);
    });
    await flow(browser, 'bar-desktop', {}, async (p, r) => {
        await sectionTo(p, 'bar');
        await p.waitForTimeout(400);
        const probes = ['.kp-nav__disclosure + .kp-nav__menu', '.kp-nav__disclosure'];
        r.open = await step(p, probes, 1200, () => click(p, '.kp-nav__disclosure'));
        await p.waitForTimeout(600);
        r.close = await step(p, probes, 1200, () => click(p, '.kp-nav__disclosure'));
        r.mirror = mirror(r.open, r.close);
        // hover dropdown of the menu with a sub menu (Readings)
        const hov = ['.kp-nav__link[aria-haspopup] + .kp-nav__menu'];
        r.hoverOn = await step(p, hov, 1000, () => hover(p, '.kp-nav__link[aria-haspopup]'));
        r.hoverOff = await step(p, hov, 1000, () => p.mouse.move(2, 2));
    });
    await flow(browser, 'phone-frame-390', { width: 390, height: 844, url: '/research/cyberpunk-applied/demo.html', stage: false }, async (p, r) => {
        // the same frame in a 390 px window (the real bar of the demo has no toggle in its markup)
        await sectionTo(p, 'bar');
        await p.waitForTimeout(500);
        const probes = ['.fa-phone .kp-nav__links', '.fa-phone .kp-nav', '.fa-phone__body'];
        r.open = await step(p, probes, 1200, () => click(p, '.fa-phone [data-kp-nav-toggle]'));
        await p.waitForTimeout(600);
        r.close = await step(p, probes, 1200, () => click(p, '.fa-phone [data-kp-nav-toggle]'));
        r.mirror = mirror(r.open, r.close);
    });

    // the plain pages: alerts, toast, tooltip (no stage, real mouse)
    await flow(browser, 'alert', { url: '/catalogue/feedback.html', stage: false }, async (p, r) => {
        const alert = '.kp-alert--success';
        await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), alert);
        await p.waitForTimeout(500);
        r.dismiss = await step(p, [alert, `${alert}`], 1400, () => click(p, `${alert} .kp-alert__close`));
        await p.waitForTimeout(800);
        // an app shows it again (hidden = false): nothing else brings it back
        r.reshow = await step(p, [alert], 1400, () =>
            p.evaluate((s) => {
                document.querySelector(s).hidden = false;
            }, alert),
        );
        await p.waitForTimeout(600);
        r.dismiss2 = await step(p, [alert], 1400, () => click(p, `${alert} .kp-alert__close`));
        r.mirror = mirror(r.reshow, r.dismiss2);
    });
    await flow(browser, 'toast', { url: '/catalogue/feedback.html', stage: false }, async (p, r) => {
        await p.evaluate(() => {
            const rg = document.querySelector('.kp-toasts');
            rg.replaceChildren();
            rg.scrollIntoView({ block: 'center' });
        });
        await p.waitForTimeout(500);
        const probes = ['[data-audit-t2]', '.kp-toasts'];
        // shown, held 1200 ms, then it goes by itself: one series holds both halves
        const all = await step(p, probes, 3400, () =>
            p.evaluate(async () => {
                const m = await import('/js/overlays.js');
                m.toast('Audit toast', { ms: 1200, region: document.querySelector('.kp-toasts') });
                document.querySelector('.kp-toasts .kp-toast:last-child')?.setAttribute('data-audit-t2', '');
            }),
        );
        r.whole = all;
    });
    await flow(browser, 'tooltip', { url: '/catalogue/overlays.html', stage: false }, async (p, r) => {
        const anchor = '.kp-tooltip-anchor:not([data-kp-tooltip-owner]) .kp-button';
        await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), anchor);
        await p.waitForTimeout(500);
        const probes = ['.kp-tooltip'];
        r.show = await step(p, probes, 1200, async () => {
            await hover(p, anchor);
            await p.focus(anchor);
        });
        await p.waitForTimeout(500);
        r.hide = await step(p, probes, 1200, async () => {
            await p.keyboard.press('Escape');
            await p.mouse.move(2, 2);
            await p.evaluate(() => document.activeElement?.blur());
        });
        r.mirror = mirror(r.show, r.hide);
    });
    await browser.close();
}

const server = await serve();
globalThis.base = `http://127.0.0.1:${server.address().port}`;
mkdirSync(`${ROOT}/research/cyberpunk-applied/_audit/out`, { recursive: true });
console.log(`server pid ${process.pid}`);
for (const engine of engines) {
    console.log(`== ${engine}`);
    await run(engine);
    writeFileSync(
        `${ROOT}/research/cyberpunk-applied/_audit/out/flows-${engine}${only.length ? '-' + only.join('_') : ''}.json`,
        JSON.stringify(results, (k, v) => (k === '_poseKeys' && !process.env.KEEPKEYS ? undefined : v), 1),
    );
}
server.close();
console.log('done');
