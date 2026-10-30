// Tests for the closure and wrapper gates, and the gate chain itself [D3, D4, AR28, TH104, KT7, scope-76].

import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { closure, VENDORED, specifiers } from './check-closure.mjs';
import { drawn, REQUIRED, queried, establishers } from './check-wrappers.mjs';

// TH86 left with mono, 2026-09-12 [stage 3]. It measured that theme's seven
// status plates stayed a lightness ladder — at least 1.25:1 between every
// pair — because mono carried meaning by lightness alone and had no hue to
// fall back on. No theme in the set does that any more, so there is nothing
// left for the bar to hold. The reasoning is kept here rather than only in
// the history, because "a theme that carries meaning by lightness needs its
// plates measurably apart" is the sort of thing a future theme will want
// back, and it is cheaper to find as a comment than as a deleted test.

test('D3 and D4: two removals stay removed', () => {
    // The registry-coverage item of round five's AFK report, answered
    // "Dichten" by Kenny on 2026-09-07. Both removals were shipped and
    // neither was pinned: re-adding either export would have broken no
    // gate at all. Finding that also found the worse half -- D3 and D4
    // had shared one number, W1 was briefed with the wrong meaning, and
    // the frozen D3 went unbuilt until this same turn.
    const read = (/** @type {string} */ file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    for (const file of ['index.js', 'index.d.ts', 'js/strings.js', 'js/strings.d.ts']) {
        assert.ok(!/\bexport\b[^\n]*\bSTRINGS_NL\b/.test(read(file)), `${file} still exports STRINGS_NL [D3]`);
    }
    for (const file of ['index.js', 'index.d.ts', 'js/components.js', 'js/components.d.ts']) {
        const source = read(file);
        assert.ok(!/\bexport\b[^\n]*\bARM_EVENT\b/.test(source), `${file} still exports ARM_EVENT [D4]`);
        assert.ok(!/\bexport\b[^\n]*\bDISARM_EVENT\b/.test(source), `${file} still exports DISARM_EVENT [D4]`);
    }
});

test('AR28: the vendored modules import nothing outside themselves', () => {
    // The gate's own subject, as a unit: the six files chassis-rs bakes
    // in are closed under import. Drilled red twice against the real
    // source before it was trusted — the comments in check-closure.mjs
    // name both injected edges.
    const read = (/** @type {string} */ file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    const { reached, missing } = closure(VENDORED, read);
    assert.deepEqual(missing, []);
    assert.deepEqual(
        [...reached.keys()].filter((file) => !VENDORED.includes(file)),
        [],
    );
    // Six until fix-56: chassis-rs bakes js/effects.js too, and since
    // scope-117 the eleven files it takes to run (17), plus, since the 2026-10-30 split, the 39 parts of strings and components, the 10 parts of effects.js and the 3 helpers of its headline hook, and the 7 parts of theme-core, and the controller base with the 6 parts of theme-picker.
    assert.equal(VENDORED.length, 83);
});

test('AR28: the closure walk reads an import it must not miss', () => {
    // A gate that finds nothing passes everything. These are the shapes
    // the six actually use, plus the two that would slip past a naive
    // scan: a multi-line import and a dynamic one.
    assert.deepEqual(specifiers("import { a } from './b.js';"), ['./b.js']);
    assert.deepEqual(specifiers("import {\n    a,\n    b,\n} from './c.js';"), ['./c.js']);
    assert.deepEqual(specifiers("export { a } from './d.js';"), ['./d.js']);
    assert.deepEqual(specifiers("const m = await import('./e.js');"), ['./e.js']);
    // A comment is not an import, and neither is a string that looks like one.
    assert.deepEqual(specifiers("// import { a } from './f.js';"), []);
});

test('AR28: the closure walk reads code, not the words inside a string or a template', () => {
    // Before: the scan ran from `export` to the first `from` followed by a
    // quote anywhere after it, so `bound === 'from' ? `…` : …` in js/strings.js
    // read as an import of " ? `${column} on or after` : …" (2026-09-14).
    const strings = [
        'export const S = Object.freeze({',
        '    bound: (kind, bound, column) => {',
        "        if (kind === 'date') return bound === 'from' ? `${column} on or after` : `${column} on or before`;",
        "        return bound === 'from' ? 'From' : 'To';",
        '    },',
        '    span: (from, to) => `from ${from} to ${to}`,',
        '    quoted: "import { a } from \'./g.js\'",',
        "    nested: (a) => `${a ? `from '${a}'` : 'none'} // import('./h.js')`,",
        '});',
    ].join('\n');
    assert.deepEqual(specifiers(strings), []);
    // A regular expression with a quote in it does not open a string that swallows the import after it.
    assert.deepEqual(specifiers("const q = /['\"]/g;\nimport { a } from './i.js';"), ['./i.js']);
    // The shapes the six use still read, next to such code, and a bare side-effect import too.
    assert.deepEqual(specifiers(`${strings}\nimport { a } from './b.js';\nexport * from './c.js';\nimport './d.js';`), [
        './b.js',
        './c.js',
        './d.js',
    ]);
    assert.deepEqual(specifiers('const x = y / 2; const m = import(\'./e.js\'); export { z } from "./f.js";'), ['./e.js', './f.js']);
    assert.deepEqual(specifiers('const url = import.meta.url;'), []);
});

test('TH104: the wrapper check answers by ancestry, not by proximity', () => {
    // The whole point of the gate is depth: a container query binds to the
    // NEAREST container at ANY depth, so a wrapper three elements up is a
    // correct wrapper and a sibling one is not.
    const wrappers = new Map([['kp-grid', ['kp-grid-wrap']]]);
    const deep = '<div class="kp-grid-wrap"><main><section><div class="kp-grid"></div></section></main></div>';
    assert.deepEqual(
        drawn(deep, REQUIRED, wrappers).map((f) => f.wrapped),
        [true],
    );
    const sibling = '<div class="kp-grid-wrap"></div><div class="kp-grid"></div>';
    assert.deepEqual(
        drawn(sibling, REQUIRED, wrappers).map((f) => f.wrapped),
        [false],
    );
    // The element itself is not its own container: that is AR24 in one line.
    assert.deepEqual(
        drawn('<div class="kp-grid kp-grid-wrap"></div>', REQUIRED, wrappers).map((f) => f.wrapped),
        [false],
    );
    // A void element in between must not unbalance the stack, or every
    // later element would look wrapped when it is not.
    const afterVoid = '<div class="kp-grid-wrap"><img src="a.png" /></div><div class="kp-grid"></div>';
    assert.deepEqual(
        drawn(afterVoid, REQUIRED, wrappers).map((f) => f.wrapped),
        [false],
    );
    // An opt-in table needs the attribute; a plain one asks for nothing.
    const tables = new Map([['kp-table', ['kp-table-wrap', 'kp-datatable']]]);
    assert.equal(drawn('<table class="kp-table"></table>', REQUIRED, tables).length, 0);
    assert.deepEqual(
        drawn('<table class="kp-table" data-kp-cards></table>', REQUIRED, tables).map((f) => f.wrapped),
        [false],
    );
});

test('TH104: the container names and their wrappers are read from the stylesheet', () => {
    // AR26: the gate's expectation comes from the source. A conversion
    // that arrives without an entry in REQUIRED is caught by this pair
    // disagreeing, so the list cannot silently fall behind.
    const css = readFileSync(new URL('../css/components.css', import.meta.url), 'utf8');
    const names = queried(css);
    const wrappers = establishers(css);
    for (const entry of REQUIRED) {
        assert.ok(names.has(entry.container), `nothing queries @container ${entry.container}`);
        assert.ok((wrappers.get(entry.container) ?? []).length > 0, `nothing establishes a container named ${entry.container}`);
    }
    assert.deepEqual([...names].sort(), REQUIRED.map((e) => e.container).sort());
    // Both classes that can carry the table's container are found, which
    // is what lets a DataTable without a .kp-table-wrap still pass.
    assert.deepEqual(wrappers.get('kp-table'), ['kp-table-wrap', 'kp-datatable']);
});

test('KT7: every check script runs in the gates chain, in the hook, and the release runs the chain', () => {
    // Two lists that promise the same thing and nothing that lays them
    // side by side: the hook script omitted check:strings and CI ran the
    // hook script, so a red gate shipped inside a green build. This test
    // is the side-by-side, over all three lists. Drill: remove one `node gates/check-…` line
    // from .claude/hooks/gates.sh and the hook assertion names it.
    /** @type {{scripts: Record<string, string>}} */
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    // Kenny, 2026-09-09: the checks that exist for people with
    // disabilities — the contrast floors, the flash threshold, the
    // reduced-motion guards, the texture ceiling and the invariant sweep
    // — are advice rather than a gate. They still have to run somewhere,
    // and `npm run advice` is where; this test holds that list the same
    // way it holds the blocking one, so an advisory check cannot quietly
    // stop being run at all.
    const advice = pkg.scripts.advice ?? '';
    const advisory = Object.keys(pkg.scripts).filter((name) => name.startsWith('check:') && advice.includes(`npm run ${name}`));
    assert.ok(advisory.length >= 4, `expected the advisory checks in \`npm run advice\`, found ${advisory.length}`);
    const checks = Object.keys(pkg.scripts).filter((name) => name.startsWith('check:') && !advisory.includes(name));
    assert.ok(checks.length >= 10, `expected the check scripts, found ${checks.length}`);
    const chain = pkg.scripts.gates;
    const hook = readFileSync(new URL('../.claude/hooks/gates.sh', import.meta.url), 'utf8');
    const release = readFileSync(new URL('../scripts/release.sh', import.meta.url), 'utf8');
    for (const name of checks) {
        assert.ok(chain.includes(`npm run ${name}`), `\`${name}\` is not in \`npm run gates\``);
        // The hook runs the same file the script does; match on the
        // command the script names, which is what the hook copies. A
        // script that chains two commands with `&&` is checked half by
        // half: since gate-cache (2026-09-16) the hook gives each half
        // its own `gate` line, so each gets its own input set and its own
        // skip decision, and the joined string no longer appears.
        for (const part of pkg.scripts[name].split('&&')) {
            const command = part.trim().replace(/^node /, '');
            assert.ok(hook.includes(command), `\`${name}\` (${command}) is not in .claude/hooks/gates.sh`);
        }
    }
    // scope-76 moved variant-ground, compliance, baseline and prettier to
    // advice. The other direction holds that: a check listed in `advice`
    // that also sits in the chain or the hook refuses a commit, which is
    // exactly what advice promises not to do.
    for (const name of advisory) {
        assert.ok(!chain.includes(`npm run ${name}`), `\`${name}\` is advice and still in \`npm run gates\``);
        const command = pkg.scripts[name].replace(/^node /, '');
        assert.ok(
            !hook.split('\n').some((line) => line.trim() === command || line.trim() === `npx ${command}` || line.trim() === `node ${command}`),
            `\`${name}\` is advice and still in .claude/hooks/gates.sh`,
        );
    }
    // The CI list is gone [Kenny, 2026-09-09]: there is no CI. He runs the
    // suite himself with `npm run verify`, which is the fourth list this
    // test now holds — gates, the whole browser suite, then the advisory
    // reading. A check that is in neither `gates` nor `advice` runs
    // nowhere, and that is what the two assertions above and this one
    // together refuse.
    const verify = readFileSync(new URL('verify.mjs', import.meta.url), 'utf8');
    assert.ok(/node gates\/verify\.mjs/.test(pkg.scripts.verify ?? ''), '`npm run verify` does not run gates/verify.mjs');
    assert.ok(/'run', 'gates'/.test(verify), 'gates/verify.mjs does not run the gates');
    assert.ok(/'playwright', 'test'/.test(verify), 'gates/verify.mjs does not run the browser suite');
    assert.ok(/'run', 'advice'/.test(verify), 'gates/verify.mjs does not run the advisory checks');
    // The third list, added at round five's Phase 5 gate (H2). It builds
    // the tag, and until then nothing held it: it ran the hook script,
    // which is equivalent only for as long as nobody changes either. Since
    // 2026-09-29 the tag is built on Kenny's machine by scripts/release.sh
    // instead of .github/workflows/release.yml; the promise is the same.
    assert.ok(/^\s*npm run gates$/m.test(release), 'scripts/release.sh does not run `npm run gates`');
});

test('scope-76: every merged check still runs, inside the target that took it', () => {
    // Six checks lost their own `check:` script and hook line. KT7 cannot
    // see them any more — there is no script to hold — so this does: each
    // target must still spawn the old script, and the old script must still
    // be there to spawn. Token parity is the seventh name on the list and
    // needs no spawn: the TH22 tests above run it over the real themes.
    const merged = [
        ['generate-min.mjs', 'generate-bundle.mjs'],
        ['check-docs-runnable.mjs', 'check-migration.mjs'],
        ['check-fonts.mjs', 'generate-fonts-css.mjs'],
        ['check-manifest.mjs', 'check-package.mjs'],
    ];
    for (const [target, old] of merged) {
        const source = readFileSync(new URL(target, import.meta.url), 'utf8');
        assert.ok(source.includes(`spawnSync(`) && source.includes(`'${old}'`), `gates/${target} no longer runs gates/${old}`);
        assert.ok(existsSync(new URL(old, import.meta.url)), `gates/${old} is gone, and gates/${target} spawns it`);
    }
});
