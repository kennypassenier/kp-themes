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
import { EXAMPLES, el, renderHTML } from '../showcase/examples.mjs';
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
 *   register: 'new' | 'rewritten' | 'changed' | 'unchanged' | 'none',
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
    const newRegisters = {
        cyberpunk: read('css/cyberpunk-register.css'),
        retro: read('css/retro-register.css'),
        synthwave: read('css/synthwave-register.css'),
    };
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
            const nowRules = scopedRules(
                newThemes + '\n' + newRegisters[/** @type {'cyberpunk' | 'retro' | 'synthwave'} */ (theme.name)],
                theme.name,
            );
            register = !oldBlocks.has(theme.name)
                ? 'new'
                : theme.name === 'cyberpunk'
                  ? 'rewritten'
                  : hash(oldRules) === hash(nowRules)
                    ? 'unchanged'
                    : 'changed';
        }
        const texture = {
            old: textureOf(oldCss, theme.name),
            now:
                textureOf(rules, theme.name) ??
                textureOf(newRegisters[/** @type {'cyberpunk' | 'retro' | 'synthwave'} */ (theme.name)] ?? '', theme.name),
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
            if (!oldBlocks.has(theme.name)) {
                lines.length = 0;
                lines.push(
                    `New in 5.0.0: this theme did not exist in 4.0.0 — every one of its ${after.size} tokens, its register and its fonts are new, so the left frame shows what a 4.0.0 page does with a theme it does not know (the loud fallback), and nothing is marked because everything differs.`,
                );
                show.clear();
            } else if (theme.name === 'cyberpunk') {
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
        if (register === 'new') {
            /* said above */
        } else if (register === 'rewritten') {
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
const CURRENT = [
    'fonts.css',
    'themes.css',
    'components.css',
    'layout.css',
    'utilities.css',
    'cyberpunk-register.css',
    'retro-register.css',
    'synthwave-register.css',
];

/**
 * The component layer, which both frames share. What a compare page shows
 * is the THEME — tokens, fonts, register, texture — so the left frame
 * loads the 4.0.0 bundle for those and the current component, layout and
 * utility sheets on top (same layer names, later rules win inside a
 * layer, the 4.0.0 register stays above them in `kp.register`). Without
 * this the left would show the 4.0.0 component layer missing the demo's
 * newer pieces, and a theme that did not change would look changed.
 */
const COMPONENT_LAYER = ['components.css', 'layout.css', 'utilities.css'];

/**
 * @param {string} title
 * @param {string} body
 * @param {{ baseline?: boolean, frame?: boolean, script?: string }} [options]
 */
function page(title, body, { baseline = false, frame = false, script = '' } = {}) {
    const sheets = baseline
        ? ['../showcase/baseline/4.0.0/kp-themes.css', ...COMPONENT_LAYER.map((sheet) => `../css/${sheet}`)]
        : CURRENT.map((sheet) => `../css/${sheet}`);
    // The marks live in scaffolding the frames alone load [TH109: no
    // page-local style block], guarded by gates/check-layers.mjs.
    if (frame) sheets.push('../showcase/compare.css');
    const links = sheets.map((href) => `        <link rel="stylesheet" href="${href}" />`).join('\n');
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

/**
 * The approved concept demo, whole, without the theme picker and its
 * status line: a frame wears the theme its query names, and a picker
 * inside a frame would change one side only.
 */
function demoBody() {
    const concept = EXAMPLES.find((example) => example.id === 'concept');
    if (!concept) throw new Error('the concept example is missing');
    const body = concept.body.filter(
        (node) => !(node && typeof node === 'object' && ('data-kp-theme-picker' in node.props || 'data-kp-theme-status' in node.props)),
    );
    return renderHTML(body, 8);
}

/**
 * Where each measured difference shows on the demo: a category from
 * diffs() → the elements to mark, with the label the mark carries. The
 * frame script reads `?mark=` and sets `data-compare-mark` on them; the
 * scaffolding paints the outline and the label.
 */
const MARKS = {
    type: [
        ['[data-kp-surface="hero"] h1', 'Typography'],
        ['[data-kp-surface="app"] h2', 'Typography'],
    ],
    palette: [['.kp-spec', 'Palette']],
    surfaces: [['[data-kp-surface="hero"]', 'Two surfaces']],
    nav: [['.kp-nav', 'Navigation']],
    buttons: [['[data-kp-surface="hero"] .kp-row', 'Buttons']],
    fields: [['.kp-form', 'Fields']],
    dossier: [['.kp-card[data-kp-reveal="emphasis"]', 'Dossier']],
    divider: [['[data-kp-divider]', 'Tear']],
    texture: [['[data-kp-surface="app"]', 'Texture']],
};

const FRAME_SCRIPT = `
        <script>
            // The theme, the marks and the texture factor of the R6-Q2
            // proposal — all from the query.
            (function () {
                var params = new URLSearchParams(location.search);
                var theme = params.get('theme');
                if (theme) {
                    document.documentElement.setAttribute('data-theme', theme);
                    // The 4.0.0 module knows no query opt-in: it applies the
                    // visitor's stored theme after this script and the frame
                    // wore that theme instead (Kenny saw dark's left frame as
                    // formal, 2026-09-08). Hold the query's theme against it.
                    new MutationObserver(function () {
                        if (document.documentElement.getAttribute('data-theme') !== theme) document.documentElement.setAttribute('data-theme', theme);
                    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
                }
                var factor = parseFloat(params.get('texture') || '');
                if (factor > 0) {
                    var current = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fx-texture-opacity')) || 0;
                    document.documentElement.style.setProperty('--fx-texture-opacity', String(current * factor));
                }
                var MARKS = ${JSON.stringify(MARKS)};
                (params.get('mark') || '').split(',').forEach(function (cat) {
                    (MARKS[cat] || []).forEach(function (pair) {
                        document.querySelectorAll(pair[0]).forEach(function (node) {
                            if (!node.hasAttribute('data-compare-mark')) node.setAttribute('data-compare-mark', pair[1]);
                        });
                    });
                });
            })();
        </script>`;

/** The row of theme links, the current one marked. */
function themeLinks(/** @type {string | null} */ current) {
    return el(
        'ul',
        { class: 'kp-row', id: 'compare-themes' },
        THEMES.map((theme) =>
            el(
                'li',
                {},
                el(
                    'a',
                    {
                        href: `compare-${theme.name}.html`,
                        'data-theme-link': theme.name,
                        ...(theme.name === current ? { 'aria-current': 'page' } : {}),
                    },
                    theme.label,
                ),
            ),
        ),
    );
}

/**
 * @param {string} kind
 * @param {{ src: string, title: string }} left
 * @param {{ src: string, title: string }} right
 */
function pair(kind, left, right) {
    const frame = (/** @type {{ src: string, title: string }} */ side, /** @type {string} */ role) =>
        el(
            'section',
            { class: 'kp-stack', 'aria-label': side.title },
            el('h3', {}, side.title),
            el('iframe', { src: side.src, title: side.title, width: '100%', height: '900', 'data-compare-side': role }),
        );
    return el('div', { class: 'kp-autogrid kp-autogrid--tight', 'data-compare-pair': kind }, frame(left, 'old'), frame(right, 'new'));
}

const PAGE_SCRIPT = `
        <script>
            // The page wears its theme, and the frames of a pair scroll
            // together (same origin, so each frame's window is reachable).
            (function () {
                var name = document.querySelector('[data-compare-theme]').getAttribute('data-compare-theme');
                document.documentElement.setAttribute('data-theme', name);
                // js/auto.js runs after this script, applies the visitor's
                // stored theme and then the query on a page that opts in;
                // give it the query, so the page wears its own theme.
                if (new URLSearchParams(location.search).get('theme') !== name) history.replaceState(null, '', location.pathname + '?theme=' + name + location.hash);
                document.querySelectorAll('[data-compare-pair]').forEach(function (pair) {
                    var frames = pair.querySelectorAll('iframe');
                    var lock = false;
                    frames.forEach(function (frame) {
                        function attach() {
                            var win = frame.contentWindow;
                            // One listener per document: a load event and the
                            // early attach below can both reach the same window.
                            if (!win || win.kpCompareSynced) return;
                            win.kpCompareSynced = true;
                            win.addEventListener('scroll', function () {
                                if (lock) return;
                                lock = true;
                                frames.forEach(function (other) {
                                    if (other !== frame && other.contentWindow) other.contentWindow.scrollTo(win.scrollX, win.scrollY);
                                });
                                lock = false;
                            });
                        }
                        frame.addEventListener('load', attach);
                        // The frame may have loaded before this script ran: the
                        // parser yields on a page with frames, and a cached
                        // page fires its load first (CI run 34163234434,
                        // chromium: the right frame never followed).
                        try {
                            var doc = frame.contentDocument;
                            if (doc && doc.readyState === 'complete' && doc.location.href !== 'about:blank') attach();
                        } catch (e) {
                            /* a frame that is not ours yet */
                        }
                    });
                });
            })();
        </script>`;

/**
 * A statement that lists every token (cyberpunk's palette line names 77)
 * folds behind its first clause, so the page stays readable and the
 * measurement stays on it.
 * @param {string} line
 */
function foldLong(line) {
    const at = line.indexOf(' — ');
    if (line.length < 240 || at === -1) return [line];
    return [el('details', {}, el('summary', {}, line.slice(0, at)), el('p', { class: 'kp-prose' }, line.slice(at + 3)))];
}

/** One theme's page: the statements, then the whole demo twice. @param {ThemeDiff} d */
function themePage(d) {
    const marks = d.show.filter((cat) => cat !== 'texture' || d.texture.old !== d.texture.now).join(',');
    const q = `?theme=${d.name}${marks ? `&mark=${marks}` : ''}`;
    const pairs = [
        pair(
            '',
            { src: `compare-frame-4.0.0.html${q}`, title: `${d.label} under 4.0.0` },
            { src: `compare-frame.html${q}`, title: `${d.label} under the current build` },
        ),
    ];
    if (d.texture.proposal !== null && d.texture.now !== null && d.texture.now > CEILING) {
        const factor = (d.texture.proposal / d.texture.now).toFixed(3);
        pairs.push(
            pair(
                'texture',
                { src: `compare-frame.html?theme=${d.name}&mark=texture`, title: `Texture today (${d.texture.now})` },
                { src: `compare-frame.html?theme=${d.name}&mark=texture&texture=${factor}`, title: `Proposal (${d.texture.proposal})` },
            ),
        );
    }
    const body = [
        el(
            'main',
            { id: 'main', class: 'kp-page kp-page--full', tabindex: '-1', 'data-compare-theme': d.name },
            el(
                'div',
                { class: 'kp-stack' },
                el('h1', {}, `${d.label} — old against new`),
                el(
                    'p',
                    { class: 'kp-prose kp-text-muted' },
                    'The whole concept demo twice: on the left under the 4.0.0 release, on the right under the current build, scrolling together. ',
                    'The differences are measured from the two stylesheets and the shipped fonts, said below, and marked on the demo where they show. ',
                    'Both sides share the current component layer, so what differs is the theme.',
                ),
                themeLinks(d.name),
                el('h2', {}, 'What is different'),
                el(
                    'ul',
                    { class: 'kp-stack', 'data-compare-lines': '' },
                    d.lines.map((line) => el('li', {}, ...foldLong(line))),
                ),
                ...pairs,
                el(
                    'p',
                    { class: 'kp-prose' },
                    el('a', { href: `concept.html?theme=${d.name}` }, 'The concept demo on its own'),
                    ' under this theme, with the picker.',
                ),
            ),
        ),
    ];
    return page(`${d.label}, old against new`, renderHTML(body, 8), { script: PAGE_SCRIPT });
}

/**
 * The generated files: the index, one page per theme, and the two frames.
 *
 * @returns {{ name: string, file: string, content: string }[]}
 */
export function comparePages() {
    const all = diffs();
    const index = [
        el(
            'main',
            { id: 'main', class: 'kp-page', tabindex: '-1' },
            el(
                'div',
                { class: 'kp-stack' },
                el('h1', {}, 'Old against new'),
                el(
                    'p',
                    { class: 'kp-prose kp-text-muted' },
                    'One page per theme: the whole concept demo under the 4.0.0 release on the left and under the current build on the right, the measured differences said above and marked on the demo.',
                ),
                themeLinks(null),
            ),
        ),
    ];
    return [
        { name: 'examples/compare.html', file: 'compare.html', content: page('old against new', renderHTML(index, 8)) },
        ...all.map((d) => ({ name: `examples/compare-${d.name}.html`, file: `compare-${d.name}.html`, content: themePage(d) })),
        {
            name: 'examples/compare-frame.html',
            file: 'compare-frame.html',
            content: page('compare frame, current build', demoBody(), { frame: true, script: FRAME_SCRIPT }),
        },
        {
            name: 'examples/compare-frame-4.0.0.html',
            file: 'compare-frame-4.0.0.html',
            content: page('compare frame, 4.0.0', demoBody(), { baseline: true, frame: true, script: FRAME_SCRIPT }),
        },
    ];
}
