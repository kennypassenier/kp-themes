// Round six, C0: the six new gates, each proven on in-memory input
// before its on-disk drill [rule 7d, AR36, AR37, AR39, AR40, AR41, AR46].

import { test } from 'node:test';
import { rulesOf, subjectRoots, declaredRoots } from './selectors.mjs';
import assert from 'node:assert/strict';
import { missingParts, audit as auditCoverage } from './check-register-coverage.mjs';
import { audit as auditHooks } from './check-hooks.mjs';
import { audit as auditFonts, declaredFamilies } from './check-fonts.mjs';
import { references } from './check-manifest.mjs';
import { tableProblems } from './check-motion.mjs';
import { strongestAlpha, textures, audit as auditTexture } from './check-texture.mjs';

const REGISTER_LIKE = `@layer kp.register {\n  [data-theme='x'] .kp-card { border: 0; }\n  [data-theme='x'] .kp-card__title { }\n  .kp-empty { }\n  @keyframes fx-a { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }\n}`;

test('selectors: a rule inside @layer is found as written, keyframes are not rules', () => {
    const rules = rulesOf(REGISTER_LIKE);
    assert.ok(rules.has("[data-theme='x'] .kp-card"));
    assert.ok(!rules.has('0%'));
    assert.deepEqual(subjectRoots("[data-theme='x'] .kp-card:hover::after"), ['card']);
    assert.deepEqual(subjectRoots("[data-theme='x'] .kp-card__title"), []);
    // `c` only ever appears as an ancestor; it is still a root the register must answer.
    assert.deepEqual([...declaredRoots('.kp-a {} .kp-a__b {} .kp-b--x {} .kp-c .kp-d {}')].sort(), ['a', 'c', 'd']);
});

test('KT14: a register that styles the bar and not the dropdown is refused; one that styles the menu passes', () => {
    const parts = { nav__menu: 'the dropdown' };
    const bar =
        "@layer kp.register {\n  [data-theme='x'] .kp-nav { background: red; }\n  [data-theme='x'] .kp-nav__link { color: red; }\n  [data-theme='x'] .kp-nav__menu { }\n}";
    assert.deepEqual(missingParts(bar, parts), ['nav__menu'], 'an empty rule is no answer');
    const menu = bar + "\n@layer kp.register { [data-theme='x'] .kp-nav__menu a:hover { background: red; } }";
    assert.deepEqual(missingParts(menu, parts), []);
    // A different part with the same prefix does not count for the menu.
    const other = "@layer kp.register { [data-theme='x'] .kp-nav__menu-status { color: red; } }";
    assert.deepEqual(missingParts(other, parts), ['nav__menu']);
});

test('AR36: a hook nobody answers, a quiet answer without a reason, and an unscoped theme answer all fail', () => {
    const matrix = {
        hooks: { emphasis: 'mark', reveal: 'reveal' },
        default: { emphasis: { css: 'base.css', selector: 'mark' } },
        themes: { x: { reveal: { quiet: '' } }, y: { emphasis: { css: 'base.css', selector: 'mark' } } },
    };
    const read = (/** @type {string} */ css) => (css === 'base.css' ? 'mark { background: none; }' : null);
    const { problems } = auditHooks(matrix, ['x', 'y'], read);
    assert.ok(
        problems.some((p) => p.includes('reveal is answered neither')),
        problems.join('\n'),
    );
    assert.ok(
        problems.some((p) => p.includes('quiet without a reason')),
        problems.join('\n'),
    );
    assert.ok(
        problems.some((p) => p.includes("not scoped to [data-theme='y']")),
        problems.join('\n'),
    );
});

test('AR36: a complete matrix with a scoped theme answer passes', () => {
    const matrix = {
        hooks: { emphasis: 'mark' },
        default: { emphasis: { css: 'base.css', selector: 'mark' } },
        themes: { x: { emphasis: { css: 'reg.css', selector: "[data-theme='x'] mark" } } },
    };
    const read = (/** @type {string} */ css) => (css === 'base.css' ? 'mark { color: red; }' : "[data-theme='x'] mark { color: blue; }");
    assert.deepEqual(auditHooks(matrix, ['x'], read).problems, []);
});

test('AR37: an uncovered root fails, an empty-body rule covers nothing, and a stale exception fails', () => {
    const components = '.kp-card {} .kp-nav {} .kp-empty {} .kp-sr-only {}';
    const { uncovered, stale, covered } = auditCoverage(components, REGISTER_LIKE, { 'sr-only': 'helper' }, { nav: 'C2' });
    assert.deepEqual(covered, ['card']);
    assert.deepEqual(uncovered, ['empty']);
    assert.deepEqual(stale, []);
    const again = auditCoverage(components, REGISTER_LIKE, { 'sr-only': 'helper' }, { nav: 'C2', card: 'C2' });
    assert.deepEqual(again.stale, ['card']);
});

test('AR39: a reserved-name subset, a missing licence and an unlisted directory fail; a clean family passes', () => {
    const families = {
        sharetech: { family: 'Share Tech Mono', licence: 'OFL-1.1', reservedFontName: true, subset: true, themes: ['terminal'], scripts: ['latin'] },
        rajdhani: { family: 'Rajdhani', licence: 'OFL-1.1', reservedFontName: false, subset: true, themes: ['cyberpunk'], scripts: ['latin'] },
    };
    const readDir = (/** @type {string} */ slug) => ({ files: ['400.woff2'], licence: slug === 'rajdhani', bytes: 12000 });
    const byTheme = new Map([
        ['terminal', ['Share Tech Mono']],
        ['cyberpunk', ['Rajdhani']],
    ]);
    const problems = auditFonts(families, readDir, byTheme, 1_500_000, ['sharetech', 'rajdhani', 'stray']);
    assert.ok(
        problems.some((p) => p.includes('(reserved)')),
        problems.join('\n'),
    );
    assert.ok(
        problems.some((p) => p.includes('(licence)') && p.includes('Share Tech Mono')),
        problems.join('\n'),
    );
    assert.ok(
        problems.some((p) => p.includes('(unlisted)')),
        problems.join('\n'),
    );
    assert.ok(!problems.some((p) => p.includes('Rajdhani')), problems.join('\n'));
    assert.deepEqual(declaredFamilies("@font-face { font-family: 'Rajdhani'; src: url(x.woff2); }\n@font-face { font-family: 'Rajdhani'; }"), [
        'Rajdhani',
    ]);
    assert.deepEqual(declaredFamilies('/* nothing */'), []);
});

test('AR39: a theme over the font budget fails', () => {
    const families = { big: { family: 'Big', licence: 'OFL-1.1', reservedFontName: false, subset: true, themes: ['x'], scripts: ['latin'] } };
    const problems = auditFonts(families, () => ({ files: ['a.woff2'], licence: true, bytes: 2_000_000 }), new Map([['x', ['Big']]]), 1_500_000, [
        'big',
    ]);
    assert.ok(
        problems.some((p) => p.includes('(budget)')),
        problems.join('\n'),
    );
});

test('AR39: a stylesheet url() is a reference the manifest walk follows; a data: URI is not', () => {
    assert.deepEqual(references('@font-face { src: url(\'../fonts/x/400.woff2\'); }\n.a { background: url("data:image/svg+xml,%3Csvg/%3E"); }'), [
        '../fonts/x/400.woff2',
    ]);
    assert.deepEqual(references("import { a } from './b.js';"), ['./b.js']);
    // A module fetched when asked for is a file the consumer copies too
    // [scope-117]: js/effects.js's hooks were invisible to this walk.
    assert.deepEqual(references("const load = () => import('./effects/headline.js');"), ['./effects/headline.js']);
});

test('AR40: a keyframe without a TIMINGS row fails; a row whose opacity steps drift fails; a matching row passes', () => {
    const css = '@keyframes fx-a { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }';
    assert.equal(tableProblems(css, {}).length, 1);
    assert.equal(tableProblems(css, { 'fx-a': { property: 'opacity', luminanceSteps: [1, 1] } }).length, 1);
    assert.deepEqual(tableProblems(css, { 'fx-a': { property: 'opacity', luminanceSteps: [1, 0, 1] } }), []);
    assert.deepEqual(tableProblems(css, { 'fx-a': { property: 'transform', luminanceSteps: [] } }), []);
});

test('AR46: the effective texture opacity is the layer opacity times the strongest alpha, nested var() included', () => {
    assert.equal(strongestAlpha('repeating-linear-gradient(to bottom, hsl(from var(--primary) h s l / 0.06) 0 1px, transparent 1px 3px)'), 0.06);
    assert.equal(strongestAlpha('radial-gradient(hsl(from var(--foreground) h s l / 1) 1px, transparent 1px)'), 1);
    assert.equal(strongestAlpha("url(\"data:image/svg+xml,%3Csvg%3E%3Ccircle fill='white' r='1'/%3E%3C/svg%3E\")"), 1);
    assert.equal(strongestAlpha('rgba(0, 0, 0, 0.13)'), 0.13);
    const css =
        "[data-theme='a'] { --fx-texture: rgba(0,0,0,0.13); --fx-texture-opacity: 0.55; }\n[data-theme='b'] { --fx-texture: rgba(0,0,0,0.5); --fx-texture-opacity: 0.1; }";
    const found = textures(css);
    assert.equal(found[0].effective, 0.0715);
    assert.equal(found[1].effective, 0.05);
    // Kenny, 2026-09-09: no excuse list any more. Everything over the
    // ceiling is named, and nothing can be written down to make it stop
    // being named — `a` paints at 0.0715 and is reported, `b` at 0.05
    // and is not.
    const { over, checked } = auditTexture(new Map([['x.css', css]]), 0.06);
    assert.equal(checked, 2);
    assert.equal(over.length, 1);
    assert.match(over[0], /\[data-theme='a'\].*0\.0715/);
});
