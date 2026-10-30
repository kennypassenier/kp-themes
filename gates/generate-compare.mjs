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

import { el, renderHTML } from '../showcase/examples.mjs';
import { diffs } from './generate-compare/differences.mjs';
import { themeLinks, themePage } from './generate-compare/theme-page.mjs';
import { FRAME_SCRIPT, demoBody, page } from './generate-compare/frames.mjs';

export { CATEGORIES, themeBlocks, scopedRules, textureOf } from './generate-compare/css-reading.mjs';
export { diffs } from './generate-compare/differences.mjs';

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
