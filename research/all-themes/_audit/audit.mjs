// @ts-nocheck: scratch audit tooling for the cyberpunk review, not shipped
// Static audit of every catalogue page in theme cyberpunk, Firefox and Chromium.
//   node research/cyberpunk-applied/_audit/audit.mjs [--engine firefox|chromium|both] [--pages a,b] [--skip-pointing]
// Writes research/cyberpunk-applied/_audit/out/<engine>.json (raw measurements); MISSING.md is written from them.
// (a) durations and curves, (b) corner radii, (c) hover / focus / press per pointable part, (d) font families.
// Pairs (e) are measured by pairs-meter.mjs.
import { mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import process from 'node:process';
import { chromium, firefox } from '@playwright/test';
import { serve, openTheme, ROOT, THEME } from './lib.mjs';

const args = process.argv.slice(2);
const flag = (n, d) => {
    const i = args.indexOf(`--${n}`);
    return i === -1 ? d : (args[i + 1] ?? true);
};
const engines = flag('engine', 'both') === 'both' ? ['firefox', 'chromium'] : [flag('engine')];
const only = String(flag('pages', '')).split(',').filter(Boolean);
const skipPointing = args.includes('--skip-pointing');
const pointingOnly = args.includes('--pointing-only') || args.includes('--focus-only');
const focusOnly = args.includes('--focus-only');
const pagesAll = readdirSync(`${ROOT}/catalogue`)
    .filter((f) => f.endsWith('.html'))
    .map((f) => f.replace('.html', ''));
// compare/index/round/changed/intros carry no component of their own
const SKIP = new Set(['compare', 'index', 'round', 'changed', 'intros']);
const pages = pagesAll.filter((p) => !SKIP.has(p) && (only.length === 0 || only.includes(p)));

/** Everything measured in the page itself; returns plain JSON. */
function inPage() {
    const rootEl = document.documentElement;
    const rs = getComputedStyle(rootEl);
    const px = (v) => parseFloat(v) || 0;
    const probe = (prop, value) => {
        const p = document.createElement('i');
        p.style[prop] = value;
        document.body.append(p);
        const out = getComputedStyle(p)[prop === 'transitionTimingFunction' ? 'transitionTimingFunction' : prop];
        p.remove();
        return out;
    };
    const fxEase = probe('transitionTimingFunction', 'var(--fx-ease)');
    const colour = (v) => {
        const p = document.createElement('i');
        p.style.color = v;
        document.body.append(p);
        const c = getComputedStyle(p).color;
        p.remove();
        return c;
    };
    const notch = (() => {
        const p = document.createElement('i');
        p.style.cssText = 'position:absolute;width:10px;height:10px';
        p.style.setProperty('--x', 'var(--fx-notch)');
        document.body.append(p);
        const v = getComputedStyle(rootEl).getPropertyValue('--fx-notch').trim();
        p.remove();
        return v;
    })();
    const notchSm = getComputedStyle(rootEl).getPropertyValue('--fx-notch-sm').trim();
    const duration = getComputedStyle(rootEl).getPropertyValue('--fx-duration').trim();
    const GRAMMAR_MS = new Set([0, 120, 180, 360, 480, 1800, 3000]); // ticks: contact 180, glitch 360, split 480 (4 x 120), live 480, loop 1800, spinner 3000
    const toMs = (s) => (s.endsWith('ms') ? parseFloat(s) : parseFloat(s) * 1000);
    const list = (s) => s.split(/,(?![^(]*\))/).map((x) => x.trim());
    const rootOf = (el) => {
        for (const c of el.classList) if (c.startsWith('kp-')) return c.replace(/(__|--).*$/, '');
        return null;
    };
    const partOf = (el) => {
        const c = [...el.classList].find((x) => x.startsWith('kp-'));
        return c ?? null;
    };
    const visible = (el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('[hidden]');
    };
    const nameOf = (el) =>
        `${el.tagName.toLowerCase()}${[...el.classList]
            .filter((c) => c.startsWith('kp-'))
            .slice(0, 2)
            .map((c) => '.' + c)
            .join('')}`;

    const timing = {}; // key -> record
    const corners = {};
    const fonts = {};
    const mono = (f) => /mono|courier|consolas|menlo|monaco|ui-monospace/i.test(f.split(',')[0]);
    const fams = new Set();

    const all = [...document.querySelectorAll('body *')].filter((e) => !e.closest('.cat-bar, .cat-judge, [data-cat-judge], [data-cat-chrome]'));
    for (const el of all) {
        const part = partOf(el);
        const root = rootOf(el);
        for (const pe of [null, '::before', '::after']) {
            const cs = getComputedStyle(el, pe);
            if (pe && (cs.content === 'none' || cs.content === 'normal')) continue;
            const td = list(cs.transitionDuration).map(toMs);
            const tp = list(cs.transitionProperty);
            const tf = list(cs.transitionTimingFunction);
            const ad = list(cs.animationDuration).map(toMs);
            const an = list(cs.animationName);
            const af = list(cs.animationTimingFunction);
            const ai = list(cs.animationIterationCount);
            const rows = [];
            td.forEach((d, i) => {
                if (d > 0) rows.push({ kind: 'transition', prop: tp[i % tp.length], ms: d, curve: tf[i % tf.length] });
            });
            an.forEach((n, i) => {
                if (n !== 'none' && ad[i % ad.length] > 0)
                    rows.push({ kind: 'animation', prop: n, ms: ad[i % ad.length], curve: af[i % af.length], iter: ai[i % ai.length] });
            });
            for (const r of rows) {
                const known = r.kind === 'transition' || true;
                const curveName =
                    r.curve === fxEase ? 'fx-ease(smooth)' : r.curve === 'linear' ? 'linear' : r.curve.startsWith('steps') ? 'steps' : r.curve;
                const key = `${root ?? nameOf(el)}|${part ?? nameOf(el)}${pe ?? ''}|${r.kind}|${r.prop}|${r.ms}|${curveName}`;
                const t = (timing[key] ??= {
                    root,
                    part: (part ?? nameOf(el)) + (pe ?? ''),
                    kind: r.kind,
                    prop: r.prop,
                    ms: r.ms,
                    curve: curveName,
                    n: 0,
                    onGrid: GRAMMAR_MS.has(r.ms),
                    iter: r.iter ?? null,
                });
                t.n++;
            }
        }
        if (!visible(el)) continue;
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        // (b) corners: a radius, a notch (clip-path polygon) or a rectangle
        if (part || root) {
            const hasBox =
                (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') ||
                cs.backgroundImage !== 'none' ||
                ['Top', 'Right', 'Bottom', 'Left'].some((s) => px(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none') ||
                cs.boxShadow !== 'none' ||
                (px(cs.outlineWidth) > 0 && cs.outlineStyle !== 'none');
            if (hasBox && rect.width >= 6 && rect.height >= 6) {
                const c = ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].map((k) => px(cs[`border${k}Radius`]));
                const kind = Math.min(rect.width, rect.height) >= 56 && rect.width >= 140 ? 'plate' : 'small';
                const round = c.every((v) => v >= Math.min(rect.width, rect.height) / 2 - 0.5);
                const clip = cs.clipPath;
                const clipKind = clip === 'none' ? 'none' : clip.startsWith('polygon') ? 'polygon' : clip.slice(0, 12);
                // diagonal edges of a polygon = the notch sizes
                const notches = [];
                if (clipKind === 'polygon') {
                    const pts = [...clip.matchAll(/(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?/g)].map((m) => [parseFloat(m[1]), parseFloat(m[2])]);
                    for (let i = 0; i < pts.length; i++) {
                        const [x1, y1] = pts[i],
                            [x2, y2] = pts[(i + 1) % pts.length];
                        const dx = Math.abs(x2 - x1),
                            dy = Math.abs(y2 - y1);
                        if (dx > 0.5 && dy > 0.5 && Math.abs(dx - dy) < 1.5 && dx < 40) notches.push(Math.round(dx * 10) / 10);
                    }
                }
                const clipped = (() => {
                    for (let a = el.parentElement, i = 0; a && i < 3; a = a.parentElement, i++) {
                        const acs = getComputedStyle(a);
                        if (acs.clipPath !== 'none' || px(acs.borderTopLeftRadius) > 0) {
                            const ar = a.getBoundingClientRect();
                            if (Math.abs(ar.width - rect.width) < 3 && Math.abs(ar.height - rect.height) < 3) return true;
                        }
                    }
                    return false;
                })();
                const key = `${part ?? nameOf(el)}|${kind}|${c.map((v) => Math.round(v * 10) / 10).join('/')}|${clipKind}|${notches.join('/')}`;
                const g = (corners[key] ??= {
                    part: part ?? nameOf(el),
                    tag: el.tagName.toLowerCase(),
                    kind: round ? 'round' : kind,
                    radii: c.map((v) => Math.round(v * 10) / 10),
                    clip: clipKind,
                    notches,
                    ancestorCut: clipped,
                    size: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
                    n: 0,
                });
                g.n++;
            }
        }
        // (d) fonts: elements that own text
        const own = [...el.childNodes]
            .filter((n) => n.nodeType === 3 && n.textContent.trim())
            .map((n) => n.textContent.trim())
            .join(' ');
        if (own) {
            const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
            fams.add(fam);
            const key = `${fam}|${part ?? nameOf(el)}|${el.tagName.toLowerCase()}`;
            const words = own.split(/\s+/).filter(Boolean).length;
            const prose = words >= 3 && own.length >= 18 && /[a-z]{3}/.test(own);
            const f = (fonts[key] ??= {
                family: fam,
                mono: mono(cs.fontFamily),
                prose,
                part: part ?? nameOf(el),
                tag: el.tagName.toLowerCase(),
                ancestors: root,
                sample: own.slice(0, 40),
                caps: cs.textTransform,
                n: 0,
            });
            f.n++;
        }
    }
    // G15 prefixed labels: does the label carry its diegetic prefix?
    const prefix = {};
    for (const sel of [
        '.kp-field__label',
        'th',
        '.kp-badge',
        '.kp-tag',
        '.kp-tooltip',
        '.kp-kpi__label',
        '.kp-timestamp',
        '.kp-datatable__sort',
        '.kp-menu__group, .kp-menu__label',
        '.kp-calendar__weekday',
    ]) {
        const el = [...document.querySelectorAll(sel)].find(visible);
        if (!el) continue;
        const cs = getComputedStyle(el),
            b = getComputedStyle(el, '::before');
        prefix[sel] = {
            family: cs.fontFamily.split(',')[0].replace(/["']/g, ''),
            transform: cs.textTransform,
            spacing: cs.letterSpacing,
            before: b.content,
            sample: el.textContent.trim().slice(0, 24),
        };
    }
    return {
        prefix,
        notch,
        notchSm,
        duration,
        fxEase: fxEase.slice(0, 40),
        fams: [...fams],
        tokens: {
            body: rs.getPropertyValue('--theme-font-body').trim(),
            display: rs.getPropertyValue('--theme-font-display').trim(),
            mono: rs.getPropertyValue('--theme-font-mono').trim(),
        },
        timing: Object.values(timing),
        corners: Object.values(corners),
        fonts: Object.values(fonts),
    };
}

/** Animations that run at rest (loops, entrances still running), by target. */
function runningAtRest() {
    const out = {};
    for (const a of document.getAnimations()) {
        const t = a.effect?.getComputedTiming?.();
        if (!t) continue;
        const el = a.effect.target;
        const cls = el && el.classList ? ([...el.classList].find((c) => c.startsWith('kp-')) ?? el.tagName.toLowerCase()) : '?';
        const key = `${cls}${a.effect.pseudoElement ?? ''}|${a.animationName ?? a.transitionProperty ?? 'script'}|${Math.round(Number(t.duration))}|${t.iterations}|${a.effect.getTiming().easing.slice(0, 24)}`;
        out[key] = (out[key] ?? 0) + 1;
    }
    return Object.entries(out).map(([k, n]) => ({ k, n }));
}

/** Pointable parts, one per signature. */
function pointables() {
    const sel =
        'a[href], button, summary, input:not([type=hidden]), select, textarea, [role=button], [role=tab], [role=option], [role=menuitem], [role=treeitem], [role=link], [tabindex]:not([tabindex="-1"]), label';
    const seen = new Map();
    let idx = 0;
    for (const el of document.querySelectorAll(sel)) {
        if (el.closest('.cat-bar, .cat-judge, [data-cat-judge], [data-cat-chrome], .kp-sr-only, dialog:not([open]), [popover]:not(:popover-open)'))
            continue;
        if (el.disabled || el.getAttribute('aria-disabled') === 'true') continue;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (r.width < 8 || r.height < 8 || cs.visibility === 'hidden' || cs.display === 'none' || el.closest('[hidden]')) continue;
        if (el.tagName === 'LABEL' && !el.closest('[class*="kp-"]')) continue;
        const kp = [...el.classList]
            .filter((c) => c.startsWith('kp-'))
            .sort()
            .join('.');
        const owner = (() => {
            let p = el.parentElement;
            while (p) {
                const c = [...p.classList].find((x) => x.startsWith('kp-'));
                if (c && !kp.includes(c)) return c.replace(/(__|--).*$/, '');
                p = p.parentElement;
            }
            return '';
        })();
        const sig = `${el.tagName.toLowerCase()}|${kp}|${el.getAttribute('role') ?? ''}|${el.getAttribute('type') ?? ''}|${owner}`;
        if (seen.has(sig)) continue;
        el.setAttribute('data-audit-id', String(idx));
        seen.set(sig, idx++);
    }
    return [...seen.entries()].map(([sig, id]) => ({ sig, id }));
}

const PROPS = [
    'maskImage',
    'textShadow',
    'filter',
    'borderTopWidth',
    'backgroundSize',
    'backgroundPosition',
    'borderBottomWidth',
    'textDecorationThickness',
    'clipPath',
    'scale',
    'outlineStyle',
    'outlineWidth',
    'outlineColor',
    'outlineOffset',
    'boxShadow',
    'backgroundColor',
    'backgroundImage',
    'color',
    'borderTopColor',
    'borderTopStyle',
    'borderBottomColor',
    'textDecorationLine',
    'textDecorationColor',
    'transform',
    'translate',
    'opacity',
    'borderTopRightRadius',
    'cursor',
];
function snapshot([id, PROPS]) {
    const el = document.querySelector(`[data-audit-id="${id}"]`);
    if (!el) return null;
    const grab = (cs) => ({
        ...Object.fromEntries(PROPS.map((p) => [p, cs[p]])),
        cpP: cs.getPropertyValue('--kp-cp-p').trim(),
        cpFp: cs.getPropertyValue('--kp-cp-fp').trim(),
        cpGrid: cs.getPropertyValue('--kp-cp-grid-a').trim(),
    });
    const out = {
        self: grab(getComputedStyle(el)),
        focusVisible: el.matches(':focus-visible'),
        hover: el.matches(':hover'),
        active: el.matches(':active'),
    };
    for (const pe of ['::before', '::after']) {
        const cs = getComputedStyle(el, pe);
        if (cs.content !== 'none' && cs.content !== 'normal') out[pe] = grab(cs);
    }
    // a composite's wrapper may hold the plate (upload zone, switch track, check box): the sibling/next element
    const next = el.nextElementSibling;
    if (next && /^(INPUT)$/.test(el.tagName)) out.next = grab(getComputedStyle(next));
    const col = (v) => {
        const p = document.createElement('i');
        p.style.color = v;
        document.body.append(p);
        const c = getComputedStyle(p).color;
        p.remove();
        return (c.match(/[\d.]+/g) || []).slice(0, 3).join(', ');
    };
    const cy = col('var(--accent)'),
        rd = col('var(--destructive)'),
        yl = col('var(--primary)');
    const blob = (x) => (x ? [x.boxShadow, x.backgroundImage, x.textShadow, x.borderTopColor, x.filter, x.outlineColor].join('|') : '');
    const has = (b, c) => b.includes(`rgb(${c})`) || b.includes(`rgba(${c},`);
    out.split = ['self', '::before', '::after', 'next'].some((k) => {
        const b = blob(out[k]);
        return b && has(b, cy) && has(b, rd);
    });
    // focus brackets: the old border + mask pseudo-elements, or the layered gradients in the focus ring pair
    // (a square part draws them on itself, a button on its ::before, a check or a switch on its label)
    const ringRgb = col('var(--focus-ring)');
    const host = el.parentElement ? grab(getComputedStyle(el.parentElement)) : null;
    const lab = el.closest('label') ? grab(getComputedStyle(el.closest('label'))) : null;
    // a check or a switch inside its label: the label draws the split edge
    if (!out.split && lab)
        out.split = !!lab.cpP && lab.cpP !== '0' && lab.backgroundImage.includes(`rgb(${cy})`) && lab.backgroundImage.includes(`rgb(${rd})`);
    const zone = el.nextElementSibling ? grab(getComputedStyle(el.nextElementSibling)) : null;
    const gradBrackets = (x) => !!x && x.cpFp === '1' && x.backgroundImage.includes(`rgb(${ringRgb})`);
    out.brackets =
        ['::before', '::after', 'self'].some(
            (k) => out[k] && out[k].maskImage && out[k].maskImage !== 'none' && parseFloat(out[k].borderTopWidth) > 0,
        ) ||
        ['::before', '::after', 'self'].some((k) => gradBrackets(out[k])) ||
        gradBrackets(host) ||
        gradBrackets(lab) ||
        gradBrackets(zone);
    out.cp = { p: out.self.cpP, fp: out.self.cpFp, before: out['::before']?.cpP ?? null };
    out.cp.host = host?.cpP ?? null;
    out.cp.lab = lab?.cpP ?? null;
    out.cp.hostFp = host?.cpFp ?? null;
    out.yellowRing = ['self', '::before', '::after'].some((k) => {
        const b = blob(out[k]);
        return b && has(b, yl) && out[k].outlineStyle !== 'none';
    });
    const rgb = (v) => {
        const c = document.createElement('canvas');
        c.width = c.height = 1;
        const x = c.getContext('2d', { willReadFrequently: true });
        x.clearRect(0, 0, 1, 1);
        x.fillStyle = '#fff';
        x.fillStyle = v;
        x.fillRect(0, 0, 1, 1);
        const d = x.getImageData(0, 0, 1, 1).data;
        return [...d];
    };
    const lum = ([r, g, b]) => {
        const f = (v) => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    try {
        const cs = getComputedStyle(el);
        const bg = rgb(cs.backgroundColor);
        const fg = rgb(cs.color);
        if (bg[3] === 255) {
            const a = lum(bg),
                b = lum(fg);
            out.contrast = +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2);
        }
    } catch {}
    return out;
}

const diff = (a, b) => {
    const out = [];
    for (const scope of new Set([...Object.keys(a ?? {}), ...Object.keys(b ?? {})])) {
        if (!['self', '::before', '::after', 'next'].includes(scope)) continue;
        for (const p of PROPS) if (a?.[scope]?.[p] !== b?.[scope]?.[p]) out.push(`${scope === 'self' ? '' : scope + '.'}${p}`);
    }
    return out;
};
const dashed = (s) =>
    ['self', '::before', '::after', 'next'].some(
        (k) => s?.[k] && ((s[k].outlineStyle === 'dashed' && parseFloat(s[k].outlineWidth) > 0) || /dashed/.test(s[k].borderTopStyle)),
    );
const ringChannels = (s) => {
    let n = 0;
    for (const k of ['self', 'next']) {
        const x = s?.[k];
        if (!x) continue;
        const o = x.outlineStyle !== 'none' && parseFloat(x.outlineWidth) > 0 && !/rgba\(0, 0, 0, 0\)|transparent/.test(x.outlineColor) ? 1 : 0;
        const sh = x.boxShadow !== 'none' ? x.boxShadow.split(/,(?![^(]*\))/).length : 0;
        n = Math.max(n, o + Math.min(sh, 2));
    }
    return n;
};

const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
mkdirSync(`${ROOT}/research/all-themes/_audit/out/${THEME}`, { recursive: true });
console.log(`server pid ${process.pid} port ${server.address().port}`);

for (const engine of engines) {
    const browser = await (engine === 'chromium' ? chromium : firefox).launch();
    const result = { engine, pages: {}, pointing: {}, running: {} };
    const pointedSeen = new Set();
    for (const pg of pages) {
        process.stdout.write(`${engine} ${pg} `);
        const { context, page } = await openTheme(browser, `${base}/catalogue/${pg}.html`);
        try {
            if (!pointingOnly) {
                result.pages[pg] = await page.evaluate(inPage);
                result.running[pg] = await page.evaluate(runningAtRest);
            }
            if (!skipPointing) {
                const parts = (await page.evaluate(pointables)).filter((p) => !pointedSeen.has(p.sig));
                for (const { sig, id } of parts) {
                    pointedSeen.add(sig);
                    const loc = page.locator(`[data-audit-id="${id}"]`);
                    try {
                        await loc.scrollIntoViewIfNeeded({ timeout: 8000 });
                        await page.mouse.move(2, 2);
                        await page.evaluate(() => document.activeElement?.blur?.());
                        await page.waitForTimeout(260);
                        const rest = await page.evaluate(snapshot, [id, PROPS]);
                        if (!rest) continue;
                        const box = await loc.boundingBox();
                        if (!box) continue;
                        const cx = box.x + Math.min(box.width / 2, 40),
                            cy = box.y + box.height / 2;
                        const covered = await page.evaluate(
                            ([x, y, i]) => {
                                const e = document.elementFromPoint(x, y);
                                const t = document.querySelector(`[data-audit-id="${i}"]`);
                                return !(e && (e === t || t.contains(e) || e.contains(t)));
                            },
                            [cx, cy, id],
                        );
                        const rec = { sig, page: pg, rest: rest.self.backgroundColor, covered };
                        if (!covered && !focusOnly) {
                            await page.mouse.move(cx, cy);
                            await page.waitForTimeout(360);
                            const hover = await page.evaluate(snapshot, [id, PROPS]);
                            await page.mouse.down();
                            await page.waitForTimeout(360);
                            const active = await page.evaluate(snapshot, [id, PROPS]);
                            await page.mouse.move(2, 2);
                            await page.mouse.up();
                            await page.waitForTimeout(100);
                            rec.hoverDiff = diff(rest, hover);
                            rec.hoverSplit = hover.split;
                            rec.hoverCp = hover.cp;
                            rec.hoverMove = diff(rest, hover).filter((d) => /transform|translate|scale/.test(d));
                            rec.activeDiff = diff(hover, active);
                            rec.activeVsRest = diff(rest, active);
                            rec.activeLift = diff(rest, active).filter((d) => /transform|translate|scale/.test(d));
                            rec.activeGrid = diff(hover, active).filter((d) => /backgroundImage|backgroundColor|boxShadow|maskImage/.test(d));
                            rec.activeSolid = ['self', '::before', '::after', 'next'].some(
                                (k) => active?.[k] && active[k].outlineStyle === 'solid' && parseFloat(active[k].outlineWidth) > 0,
                            );
                            rec.activeBgChanged = rest.self.backgroundColor !== active.self.backgroundColor;
                            rec.activeContrast = active.contrast ?? null;
                            rec.restContrast = rest.contrast ?? null;
                            rec.activeBg = active.self.backgroundColor;
                        }
                        await page.mouse.move(2, 2);
                        // real keyboard modality: focus the previous tabbable, press Tab
                        const landed = await page.evaluate((i) => {
                            const t = document.querySelector(`[data-audit-id="${i}"]`);
                            const all = [
                                ...document.querySelectorAll(
                                    'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select,textarea,summary,[tabindex]',
                                ),
                            ].filter((e) => e.tabIndex >= 0 && e.getClientRects().length && !e.closest('.kp-sr-only'));
                            const k = all.indexOf(t);
                            if (k > 0) all[k - 1].focus();
                            return k;
                        }, id);
                        await page.keyboard.press('Tab');
                        let viaTab = await page.evaluate((i) => document.activeElement === document.querySelector(`[data-audit-id="${i}"]`), id);
                        if (!viaTab) {
                            await page.evaluate((i) => document.querySelector(`[data-audit-id="${i}"]`)?.focus(), id);
                        }
                        rec.viaTab = viaTab;
                        await page.waitForTimeout(360);
                        const focus = await page.evaluate(snapshot, [id, PROPS]);
                        rec.focusVisible = focus?.focusVisible ?? false;
                        rec.focusChannels = ringChannels(focus);
                        rec.focusBrackets = focus.brackets;
                        rec.focusSplit = focus.split;
                        rec.focusCp = focus.cp;
                        rec.focusOutline = focus.self.outlineStyle + ' ' + focus.self.outlineWidth;
                        rec.focusDiff = diff(rest, focus);
                        await page.evaluate(() => document.activeElement?.blur?.());
                        result.pointing[sig] = rec;
                    } catch (e) {
                        result.pointing[sig] = { sig, page: pg, error: String(e.message).split('\n')[0] };
                    }
                }
            }
            process.stdout.write('ok\n');
        } catch (e) {
            process.stdout.write(`ERR ${String(e.message).split('\n')[0]}\n`);
        }
        await context.close();
    }
    writeFileSync(
        `${ROOT}/research/all-themes/_audit/out/${THEME}/${focusOnly ? 'focus-' : pointingOnly ? 'pointing-' : ''}${engine}.json`,
        JSON.stringify(result, null, 1),
    );
    await browser.close();
}
server.close();
console.log('done');
