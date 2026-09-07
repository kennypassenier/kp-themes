// The compare page: what changed between 4.0.0 and the current build,
// per theme, side by side, and nothing else [MR-R6-COMPARE].
//
// Kenny, 2026-09-07, on the first version (two whole pages in two narrow
// frames): "de compare.html pagina gaat nu enkel de verschillen tussen de
// oude en de nieuwe versie highlighten … toon enkel de verschillen waar
// toepasbaar. En zeg het er duidelijk bij wat er anders is. Nog altijd
// side by side." And: full width, scrolling together like the showcase.
//
// So the differences are MEASURED here, at build time, from the 4.0.0
// bundle vendored under showcase/baseline/4.0.0/ against the current
// stylesheets and the shipped fonts:
//
//   tokens    every --token whose value changed, was added or removed,
//             per theme block (the hero blocks of 5.0.0 are separate);
//   fonts     the families a theme names first that now ship as files
//             (4.0.0 shipped none: the browser fell back to the system);
//   register  whether the theme's register rules changed (cyberpunk was
//             rewritten; retro compared rule for rule);
//   texture   the effective texture opacity, old against new, and for
//             dark the proposal of R6-Q2 beside the current value.
//
// From that, each theme gets a list of what is different in plain
// words, and a pair of frames that render ONLY the specimen sections
// those differences touch — the left frame under the 4.0.0 bundle, the
// right under the current build — full width, scrolled together.
//
// The specimen pages carry every section; `?show=` picks the ones a
// theme needs, `?theme=` the theme, and `?texture=<factor>` scales the
// texture layer's opacity for the R6-Q2 proposal. TH109 holds: no
// inline style anywhere, the frames are sized by attribute and class.

import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { el, renderHTML } from '../showcase/examples.mjs';
import { THEMES } from '../js/theme-registry.js';
import { noFlashSnippet } from '../js/no-flash.js';
import { CEILING, strongestAlpha } from './check-texture.mjs';

const root = new URL('../', import.meta.url);
const read = (/** @type {string} */ path) => readFileSync(new URL(path, root), 'utf8');

/** The categories a difference can touch, in the order the specimen shows them. */
export const CATEGORIES = /** @type {const} */ ([
    ['type', 'Typography'],
    ['palette', 'Palette'],
    ['surfaces', 'The two surfaces'],
    ['nav', 'The navigation bar'],
    ['buttons', 'Buttons'],
    ['fields', 'Fields'],
    ['dossier', 'The dossier card'],
    ['divider', 'The divider'],
    ['texture', 'The texture layer'],
]);

/**
 * Every theme block of a themes stylesheet: name → token → value. Only
 * the block whose selector is exactly the theme (the 5.0.0 hero blocks
 * are `[data-theme='x'] [data-kp-surface='hero']` and are skipped).
 *
 * @param {string} css
 * @returns {Map<string, Map<string, string>>}
 */
export function themeBlocks(css) {
    /** @type {Map<string, Map<string, string>>} */
    const out = new Map();
    const re = /(?:^|\n)(?::root,\n)?\[data-theme='([a-z-]+)'\]\s*\{([^}]*)\}/g;
    for (const m of css.matchAll(re)) {
        /** @type {Map<string, string>} */
        const tokens = new Map();
        for (const d of m[2].matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) tokens.set(d[1], d[2].trim());
        out.set(m[1], tokens);
    }
    return out;
}

/**
 * The rules scoped to a theme in a stylesheet, as one normalised string —
 * enough to say "changed" or "unchanged" between two versions.
 *
 * @param {string} css @param {string} theme
 */
export function scopedRules(css, theme) {
    const lines = [];
    const re = new RegExp(`\\[data-theme='${theme}'\\][^{]*\\{[^}]*\\}`, 'g');
    for (const m of css.matchAll(re)) lines.push(m[0].replace(/\s+/g, ' ').trim());
    return lines.sort().join('\n');
}

/** @param {string} text */
const hash = (text) => createHash('sha256').update(text).digest('hex').slice(0, 12);

/**
 * The effective texture opacity a stylesheet gives a theme (layer opacity
 * × strongest alpha), or null when it declares none.
 *
 * @param {string} css @param {string} theme
 */
export function textureOf(css, theme) {
    const re = new RegExp(`\\[data-theme='${theme}'\\]\\s*\\{([^}]*)\\}`, 'g');
    for (const m of css.matchAll(re)) {
        const texture = m[1].match(/--fx-texture:\s*([^;]+);/);
        if (!texture) continue;
        const opacity = m[1].match(/--fx-texture-opacity:\s*([\d.]+)/);
        return Number(((opacity ? Number(opacity[1]) : 0) * strongestAlpha(texture[1])).toFixed(3));
    }
    return null;
}

/**
 * @typedef {{ token: string, old: string | null, now: string | null }} TokenChange
 * @typedef {{
 *   name: string, label: string,
 *   changed: TokenChange[], added: TokenChange[], removed: TokenChange[],
 *   fonts: { family: string, shipped: boolean }[],
 *   register: 'rewritten' | 'changed' | 'unchanged' | 'none',
 *   texture: { old: number | null, now: number | null, proposal: number | null },
 *   lines: string[], show: string[],
 * }} ThemeDiff
 */

/**
 * The measured difference for one theme.
 *
 * @returns {ThemeDiff[]}
 */
export function diffs() {
    const oldCss = read('showcase/baseline/4.0.0/kp-themes.css');
    const newThemes = read('css/themes.css');
    const newRegisters = { cyberpunk: read('css/cyberpunk-register.css'), retro: read('css/retro-register.css') };
    const rules = read('css/_rules.css');
    const oldBlocks = themeBlocks(oldCss);
    const newBlocks = themeBlocks(newThemes);
    /** @type {Record<string, any>} */
    const families = JSON.parse(read('fonts/families.json'));
    delete families['//'];
    const shipped = new Set(
        Object.values(families)
            .filter((f) => !(f.reservedFontName && !f.subset))
            .map((f) => f.family),
    );
    return THEMES.map((theme) => {
        const before = oldBlocks.get(theme.name) ?? new Map();
        const after = newBlocks.get(theme.name) ?? new Map();
        /** @type {TokenChange[]} */
        const changed = [];
        /** @type {TokenChange[]} */
        const added = [];
        /** @type {TokenChange[]} */
        const removed = [];
        for (const [token, value] of after) {
            if (!before.has(token)) added.push({ token, old: null, now: value });
            else if (before.get(token) !== value) changed.push({ token, old: before.get(token) ?? null, now: value });
        }
        for (const [token, value] of before) if (!after.has(token)) removed.push({ token, old: value, now: null });
        // The families the theme names first, and whether a file ships.
        /** @type {{ family: string, shipped: boolean }[]} */
        const fonts = [];
        for (const [token, value] of after) {
            if (!token.startsWith('theme-font-')) continue;
            const family = value
                .split(',')[0]
                .trim()
                .replace(/^['"]|['"]$/g, '');
            if (family && !fonts.some((f) => f.family === family)) fonts.push({ family, shipped: shipped.has(family) });
        }
        // The register: compared rule for rule where the theme has one.
        /** @type {ThemeDiff['register']} */
        let register = 'none';
        if (theme.name in newRegisters) {
            // The old bundle holds the base rules and the register in one file;
            // the new side is compared as the same union.
            const oldRules = scopedRules(oldCss, theme.name);
            const nowRules = scopedRules(newThemes + '\n' + newRegisters[/** @type {'cyberpunk' | 'retro'} */ (theme.name)], theme.name);
            register = theme.name === 'cyberpunk' ? 'rewritten' : hash(oldRules) === hash(nowRules) ? 'unchanged' : 'changed';
        }
        const texture = {
            old: textureOf(oldCss, theme.name),
            now: textureOf(rules, theme.name) ?? textureOf(newRegisters[/** @type {'cyberpunk' | 'retro'} */ (theme.name)] ?? '', theme.name),
            proposal: theme.name === 'dark' ? CEILING : null,
        };
        // The story, and the sections the pair must show.
        /** @type {string[]} */
        const lines = [];
        /** @type {Set<string>} */
        const show = new Set();
        const shippedFonts = fonts.filter((f) => f.shipped).map((f) => f.family);
        const waiting = fonts.filter((f) => !f.shipped).map((f) => f.family);
        if (shippedFonts.length > 0) {
            lines.push(
                `Typography: ${shippedFonts.join(' and ')} now ship${shippedFonts.length === 1 ? 's' : ''} with the package and load${shippedFonts.length === 1 ? 's' : ''} here; 4.0.0 shipped no font file, so the browser drew the system fallback.`,
            );
            show.add('type');
        }
        if (waiting.length > 0)
            lines.push(
                `Typography, still the fallback: ${waiting.join(' and ')} carr${waiting.length === 1 ? 'ies' : 'y'} a Reserved Font Name and wait${waiting.length === 1 ? 's' : ''} on R6-Q1 — no visible change yet.`,
            );
        const visibleChanges = changed.filter((c) => !c.token.startsWith('surface-hero-') && c.token !== 'kp-text-display');
        if (visibleChanges.length > 0) {
            lines.push(
                `Palette: ${visibleChanges.length} token${visibleChanges.length === 1 ? '' : 's'} changed value — ${visibleChanges.map((c) => `--${c.token} ${c.old} → ${c.now}`).join('; ')}.`,
            );
            show.add('palette');
        }
        const heroAdded = added.filter((a) => a.token.startsWith('surface-hero-'));
        if (heroAdded.length > 0) {
            const distinct = heroAdded.filter(
                (a) => a.now !== after.get(a.token.replace('surface-hero-bg', 'background').replace('surface-hero-fg', 'foreground')),
            );
            if (theme.name === 'cyberpunk') {
                lines.push(
                    'Two surfaces: the hero is signal yellow with ink on it and the app surface stays the void — eleven hero tokens are new, and every component reads them inside the hero.',
                );
                show.add('surfaces');
            } else
                lines.push(
                    `New in 5.0.0: ${heroAdded.length} hero tokens and the display text step, all pointing at values this theme already had — the hero paints the same ground as the app, so nothing visible changed.`,
                );
            void distinct;
        }
        if (removed.length > 0) lines.push(`Removed: ${removed.map((r) => `--${r.token}`).join(', ')}.`);
        if (register === 'rewritten') {
            lines.push(
                'The register is rewritten from the approved demo: the navigation strip with its cut corner and stepped notch and the dash-prefixed dropdown; the notched buttons with the slit and the charge sweep; the fields with the clipped corner and the accent caret; the dossier card with the file stamp and the redactions that lift; the razor tear between surfaces; and the scanlines at exactly the DI9 ceiling. The old .fx-flicker, .fx-pulse, .fx-cellpop and .fx-media classes are gone with the 4.x theme.',
            );
            for (const cat of ['nav', 'buttons', 'fields', 'dossier', 'divider']) show.add(cat);
        } else if (register === 'changed') lines.push('The register changed (rule for rule, the retro rules differ from 4.0.0).');
        else if (register === 'unchanged') lines.push('The register is unchanged, rule for rule.');
        if (texture.old !== null && texture.now !== null && texture.old !== texture.now) {
            lines.push(`Texture: the layer painted at ${texture.old} in 4.0.0 and paints at ${texture.now} now (DI9 ceiling ${CEILING}).`);
            show.add('texture');
        }
        if (texture.proposal !== null && texture.now !== null && texture.now > CEILING) {
            lines.push(
                `Texture, a proposal for R6-Q2: this theme paints its texture at ${texture.now}, over the DI9 ceiling of ${CEILING}; the right frame below shows it at ${texture.proposal}, the left as it is today.`,
            );
            show.add('texture');
        }
        if (lines.length === 0) lines.push('Nothing changed for this theme between 4.0.0 and the current build.');
        return { name: theme.name, label: theme.label, changed, added, removed, fonts, register, texture, lines, show: [...show] };
    });
}

/** The stylesheet links of the current build, relative to examples/. */
const CURRENT = ['fonts.css', 'themes.css', 'components.css', 'layout.css', 'utilities.css', 'cyberpunk-register.css', 'retro-register.css'];

/**
 * @param {string} title
 * @param {string} body
 * @param {{ baseline?: boolean, script?: string }} [options]
 */
function page(title, body, { baseline = false, script = '' } = {}) {
    const links = baseline
        ? '        <link rel="stylesheet" href="../showcase/baseline/4.0.0/kp-themes.css" />'
        : CURRENT.map((sheet) => `        <link rel="stylesheet" href="../css/${sheet}" />`).join('\n');
    const module = baseline ? '../showcase/baseline/4.0.0/kp-themes.js' : '../js/auto.js';
    return `<!doctype html>
<html lang="en" data-kp-theme-from-query>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>kp-themes — ${title}</title>
        <script>
            ${noFlashSnippet({ effects: !baseline }).replace(/\n/g, '\n            ')}
        </script>
${links}
    </head>
    <body>
${body}
        <script type="module" src="${module}"></script>${script}
    </body>
</html>
`;
}

/** The specimen sections, one per category, in the package's vocabulary. */
function specimenBody() {
    const section = (/** @type {string} */ cat, /** @type {string} */ title, /** @type {any[]} */ ...children) =>
        el('section', { class: 'kp-section kp-stack', 'data-compare-cat': cat, hidden: '' }, el('p', { class: 'kp-text-muted' }, title), ...children);
    return renderHTML(
        [
            el(
                'main',
                { id: 'main', class: 'kp-page', tabindex: '-1' },
                section(
                    'type',
                    'Typography',
                    el('h1', {}, 'Stop looking like a theme.'),
                    el('h2', {}, 'Request a handle'),
                    el(
                        'p',
                        { class: 'kp-prose' },
                        'Signal yellow on void. Blood red ',
                        el('mark', {}, 'where it counts'),
                        '. A register that behaves like a place, not a palette.',
                    ),
                    el('p', { class: 'kp-mono' }, '/// FILE 06 · STATUS: PREVIEW · 0x1F'),
                ),
                section(
                    'palette',
                    'Palette',
                    el(
                        'dl',
                        { class: 'kp-spec' },
                        ...[
                            'background',
                            'foreground',
                            'card',
                            'primary',
                            'primary-foreground',
                            'secondary',
                            'accent',
                            'destructive',
                            'border',
                            'border-strong',
                            'success',
                            'warning',
                            'info',
                            'link',
                        ].flatMap((token) => [el('dt', {}, `--${token}`), el('dd', {}, el('i', { class: 'kp-spec__swatch', 'data-token': token }))]),
                    ),
                ),
                section(
                    'surfaces',
                    'The two surfaces',
                    el(
                        'div',
                        { class: 'kp-section kp-stack', 'data-kp-surface': 'hero' },
                        el('h1', {}, 'A hero surface'),
                        el(
                            'p',
                            { class: 'kp-prose' },
                            'Every component inside reads the hero tokens: a ',
                            el('mark', {}, 'marked phrase'),
                            ', a button, a card.',
                        ),
                        el(
                            'div',
                            { class: 'kp-row' },
                            el('Button', { variant: 'primary' }, 'Primary'),
                            el('Button', {}, 'Default'),
                            el('Button', { variant: 'ghost' }, 'Ghost'),
                        ),
                        el('Card', { title: 'A card on the hero' }, el('p', {}, 'Its ground is the hero card source.')),
                    ),
                    el(
                        'div',
                        { class: 'kp-section kp-stack', 'data-kp-surface': 'app' },
                        el('h2', {}, 'The app surface'),
                        el(
                            'p',
                            { class: 'kp-prose' },
                            'Forms and tables live here; the theme keeps it readable before anything else: ',
                            el('mark', {}, 'a marked phrase'),
                            '.',
                        ),
                        el(
                            'div',
                            { class: 'kp-row' },
                            el('Button', { variant: 'primary' }, 'Primary'),
                            el('Button', {}, 'Default'),
                            el('Button', { variant: 'ghost' }, 'Ghost'),
                        ),
                    ),
                ),
                section(
                    'nav',
                    'The navigation bar',
                    el('NavBar', {
                        brand: 'kp-themes',
                        skipLink: false,
                        links: [
                            {
                                href: '#a',
                                label: 'Themes',
                                links: [
                                    { href: '#a1', label: 'Signal' },
                                    { href: '#a2', label: 'Synthwave' },
                                ],
                            },
                            { href: '#b', label: 'Components' },
                            { href: '#c', label: 'Docs' },
                            { href: '#d', label: 'Try it', className: 'kp-nav__link--cta' },
                        ],
                    }),
                ),
                section(
                    'buttons',
                    'Buttons',
                    el(
                        'div',
                        { class: 'kp-row' },
                        el('Button', { variant: 'primary' }, 'Primary'),
                        el('Button', { variant: 'primary', class: 'kp-button--mirror' }, 'Mirrored'),
                        el('Button', {}, 'Default'),
                        el('Button', { variant: 'destructive', confirm: 'Delete it' }, 'Destructive'),
                        el('Button', { variant: 'ghost' }, 'Ghost'),
                        el('Button', { disabled: true }, 'Disabled'),
                    ),
                ),
                section(
                    'fields',
                    'Fields',
                    el(
                        'form',
                        { class: 'kp-form kp-stack', 'data-kp-form': '', novalidate: '' },
                        el('Field', {
                            id: 'cmp-handle',
                            label: 'Handle',
                            name: 'handle',
                            placeholder: 'v.night',
                            help: 'Lowercase, dots allowed, no spaces.',
                        }),
                        el('Field', {
                            id: 'cmp-mail',
                            label: 'Contact',
                            name: 'mail',
                            type: 'email',
                            error: 'Enter a valid address.',
                            value: 'nope',
                        }),
                        el(
                            'div',
                            { class: 'kp-field' },
                            el('label', { class: 'kp-field__label', for: 'cmp-district' }, 'District'),
                            el(
                                'select',
                                { class: 'kp-field__input', id: 'cmp-district', name: 'district' },
                                el('option', {}, 'Watson'),
                                el('option', {}, 'Dogtown'),
                            ),
                        ),
                        el(
                            'div',
                            { class: 'kp-field kp-field--check' },
                            el('input', { class: 'kp-field__check', id: 'cmp-terms', name: 'terms', type: 'checkbox', checked: '' }),
                            el('label', { class: 'kp-field__label', for: 'cmp-terms' }, 'I understand.'),
                        ),
                    ),
                ),
                section(
                    'dossier',
                    'The dossier card',
                    el(
                        'Card',
                        { title: 'Signal', 'data-kp-reveal': 'emphasis', 'data-kp-label': 'Classified' },
                        el('p', { class: 'microlabel' }, 'FILE 06 · STATUS: PREVIEW'),
                        el(
                            'p',
                            {},
                            'The first one was ',
                            el('mark', {}, 'violet night and magenta'),
                            '; this one is built on ',
                            el('mark', {}, 'signal yellow and blood red'),
                            '.',
                        ),
                        el('div', { class: 'kp-row' }, el('Button', { variant: 'primary', 'data-kp-reveal-trigger': '' }, 'Open the file')),
                    ),
                ),
                section(
                    'divider',
                    'The divider',
                    el('div', { class: 'kp-section', 'data-kp-surface': 'hero' }, el('p', { class: 'kp-prose' }, 'The hero surface ends here.')),
                    el('div', { 'data-kp-divider': '' }),
                    el('div', { class: 'kp-section', 'data-kp-surface': 'app' }, el('p', { class: 'kp-prose' }, 'The app surface begins here.')),
                ),
                section(
                    'texture',
                    'The texture layer',
                    el(
                        'div',
                        { class: 'kp-section kp-stack', 'data-kp-surface': 'app', 'data-compare-texture': '' },
                        el('h2', {}, 'A panel under the texture'),
                        el(
                            'p',
                            { class: 'kp-prose' },
                            'The layer over the whole viewport: scanlines, grain or stars. DI9 says it is felt, not seen.',
                        ),
                        el('p', { class: 'kp-prose' }, 'Look at the empty ground below, where nothing else paints.'),
                    ),
                ),
            ),
        ],
        8,
    );
}

const SPECIMEN_SCRIPT = `
        <script>
            // Which sections this frame shows, the theme, and the texture
            // factor of the R6-Q2 proposal — all from the query.
            (function () {
                var params = new URLSearchParams(location.search);
                var show = (params.get('show') || '').split(',').filter(Boolean);
                document.querySelectorAll('[data-compare-cat]').forEach(function (section) {
                    section.hidden = show.length > 0 && show.indexOf(section.getAttribute('data-compare-cat')) === -1;
                });
                var theme = params.get('theme');
                if (theme) document.documentElement.setAttribute('data-theme', theme);
                var factor = parseFloat(params.get('texture') || '');
                if (factor > 0) {
                    var current = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fx-texture-opacity')) || 0;
                    document.documentElement.style.setProperty('--fx-texture-opacity', String(current * factor));
                }
            })();
        </script>`;

/** @param {ThemeDiff} d */
function themeSection(d) {
    const list = el(
        'ul',
        { class: 'kp-stack', 'data-compare-lines': '' },
        d.lines.map((line) => el('li', {}, line)),
    );
    const pairs = [];
    const specimenShow = d.show.filter((cat) => cat !== 'texture' || d.texture.old !== d.texture.now);
    if (specimenShow.length > 0) {
        const q = `?theme=${d.name}&show=${specimenShow.join(',')}`;
        pairs.push(
            el(
                'div',
                { class: 'kp-autogrid kp-autogrid--tight', 'data-compare-pair': '' },
                el(
                    'section',
                    { class: 'kp-stack', 'aria-label': '4.0.0' },
                    el('h3', {}, '4.0.0'),
                    el('iframe', {
                        src: `compare-specimen-4.0.0.html${q}`,
                        title: `${d.label} under 4.0.0`,
                        width: '100%',
                        height: '720',
                        'data-compare-side': 'old',
                    }),
                ),
                el(
                    'section',
                    { class: 'kp-stack', 'aria-label': 'Current build' },
                    el('h3', {}, 'Current build'),
                    el('iframe', {
                        src: `compare-specimen.html${q}`,
                        title: `${d.label} under the current build`,
                        width: '100%',
                        height: '720',
                        'data-compare-side': 'new',
                    }),
                ),
            ),
        );
    }
    if (d.texture.proposal !== null && d.texture.now !== null && d.texture.now > CEILING) {
        const factor = (d.texture.proposal / d.texture.now).toFixed(3);
        pairs.push(
            el(
                'div',
                { class: 'kp-autogrid kp-autogrid--tight', 'data-compare-pair': 'texture' },
                el(
                    'section',
                    { class: 'kp-stack', 'aria-label': 'Texture today' },
                    el('h3', {}, `Texture today (${d.texture.now})`),
                    el('iframe', {
                        src: `compare-specimen.html?theme=${d.name}&show=texture`,
                        title: `${d.label} texture today`,
                        width: '100%',
                        height: '520',
                        'data-compare-side': 'old',
                    }),
                ),
                el(
                    'section',
                    { class: 'kp-stack', 'aria-label': 'Texture proposal' },
                    el('h3', {}, `Proposal (${d.texture.proposal})`),
                    el('iframe', {
                        src: `compare-specimen.html?theme=${d.name}&show=texture&texture=${factor}`,
                        title: `${d.label} texture at the ceiling`,
                        width: '100%',
                        height: '520',
                        'data-compare-side': 'new',
                    }),
                ),
            ),
        );
    }
    return el(
        'section',
        { class: 'kp-stack', 'data-compare-theme': d.name, hidden: '' },
        el('h2', {}, `${d.label} — old against new`),
        el('p', { class: 'kp-text-muted' }, 'What is different'),
        list,
        ...pairs,
    );
}

const COMPARE_SCRIPT = `
        <script>
            // One theme at a time, from the query; the frames of a pair scroll
            // together (same origin, so each frame's window is reachable).
            (function () {
                var theme = new URLSearchParams(location.search).get('theme') || 'cyberpunk';
                document.querySelectorAll('[data-compare-theme]').forEach(function (section) {
                    section.hidden = section.getAttribute('data-compare-theme') !== theme;
                });
                document.querySelectorAll('[data-theme-link]').forEach(function (link) {
                    if (link.getAttribute('data-theme-link') === theme) link.setAttribute('aria-current', 'page');
                });
                document.documentElement.setAttribute('data-theme', theme);
                document.querySelectorAll('[data-compare-pair]').forEach(function (pair) {
                    var frames = pair.querySelectorAll('iframe');
                    var lock = false;
                    frames.forEach(function (frame) {
                        frame.addEventListener('load', function () {
                            var win = frame.contentWindow;
                            if (!win) return;
                            win.addEventListener('scroll', function () {
                                if (lock) return;
                                lock = true;
                                frames.forEach(function (other) {
                                    if (other !== frame && other.contentWindow) other.contentWindow.scrollTo(win.scrollX, win.scrollY);
                                });
                                lock = false;
                            });
                        });
                    });
                });
            })();
        </script>`;

/**
 * The three generated files: the compare page and the two specimen pages.
 *
 * @returns {{ name: string, file: string, content: string }[]}
 */
export function comparePages() {
    const all = diffs();
    const body = [
        el(
            'main',
            { id: 'main', class: 'kp-page kp-page--full', tabindex: '-1' },
            el(
                'div',
                { class: 'kp-stack' },
                el('h1', {}, 'Old against new'),
                el(
                    'p',
                    { class: 'kp-prose kp-text-muted' },
                    'What changed for a theme between the 4.0.0 release and the current build, measured from the two stylesheets and the shipped fonts, and shown side by side — only the pieces the change touches, the left frame under 4.0.0, the right under the current build, scrolling together. ',
                    el('a', { href: 'concept.html' }, 'The whole concept demo'),
                    ' shows everything.',
                ),
                el(
                    'ul',
                    { class: 'kp-row', id: 'compare-themes' },
                    THEMES.map((theme) =>
                        el('li', {}, el('a', { href: `compare.html?theme=${theme.name}`, 'data-theme-link': theme.name }, theme.label)),
                    ),
                ),
                ...all.map(themeSection),
            ),
        ),
    ];
    return [
        { name: 'examples/compare.html', file: 'compare.html', content: page('old against new', renderHTML(body, 8), { script: COMPARE_SCRIPT }) },
        {
            name: 'examples/compare-specimen.html',
            file: 'compare-specimen.html',
            content: page('compare specimen, current build', specimenBody(), { script: SPECIMEN_SCRIPT }),
        },
        {
            name: 'examples/compare-specimen-4.0.0.html',
            file: 'compare-specimen-4.0.0.html',
            content: page('compare specimen, 4.0.0', specimenBody(), { baseline: true, script: SPECIMEN_SCRIPT }),
        },
    ];
}
