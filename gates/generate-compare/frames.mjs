// The shared page shell and the two comparison frames (old build, current build).

import { noFlashSnippet } from '../../js/no-flash.js';
import { EXAMPLES, renderHTML } from '../../showcase/examples.mjs';

/** The stylesheet links of the current build, relative to examples/. */
const CURRENT = [
    'fonts.css',
    'themes.css',
    'components.css',
    'layout.css',
    'utilities.css',
    'cyberpunk-register.css',
    'synthwave-register.css',
    'brutalism-register.css',
    'titanium-register.css',
    'pastel-register.css',
    'forest-register.css',
    'deco-register.css',
    'blueprint-register.css',
    'nostromo-register.css',
    'dark-register.css',
    'formal-register.css',
    'solstice-register.css',
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
export function page(title, body, { baseline = false, frame = false, script = '' } = {}) {
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
export function demoBody() {
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

export const FRAME_SCRIPT = `
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

export const PAGE_SCRIPT = `
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
