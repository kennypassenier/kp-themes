// Tests for the manifest, tarball and bundle gates [TH103, CF1, CF2, AR43, T19, TH130].

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { copyableExports } from './check-manifest.mjs';
import { FILES } from './checksums.mjs';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { nameRecords } from './woff2-names.mjs';
import { STYLESHEET_ROLES, stylesheets } from './stylesheets.mjs';

// TH103: the manifest holds what the package offers, and the gate that
// says so reads `exports` rather than the directory (AR26).
test('TH103: a copyable export that is missing from the manifest is a difference', () => {
    const pkg = {
        exports: {
            './css': './css/themes.css',
            './js/strings': { types: './js/strings.d.ts', default: './js/strings.js' },
        },
    };
    assert.deepEqual(copyableExports(pkg, { follow: false }), ['css/themes.css', 'js/strings.js']);
});

test('TH103: patterns, declarations and the React channel are not vendored files', () => {
    const pkg = {
        exports: {
            // A pattern names a directory, and reading a directory is the
            // globbing AR26 forbids for this number.
            './components/*': './components/*',
            './themes/*': './themes/*',
            // npm ships and verifies these; a person does not copy them.
            '.': { types: './index.d.ts', default: './index.js' },
            './hooks/theme': { types: './hooks/use-theme.d.ts', default: './hooks/use-theme.js' },
            './fx/boot-sequence': { types: './fx/boot-sequence.d.ts', default: './fx/boot-sequence.jsx' },
            './package.json': './package.json',
        },
    };
    assert.deepEqual(copyableExports(pkg), []);
});

test('TH103: the file 3.1.1 had missed that still ships is in the manifest', () => {
    // Named in S31 because a consumer overriding the dictionary copies
    // js/strings.js. The other, css/retro-register.css, left with the retro
    // theme on 2026-10-09.
    assert.ok(FILES.includes('js/strings.js'));
});

// ── The consumer tarball [CF1, 2026-09-09] ───────────────────────────────

test('CF1: the tarball is the manifest minus the fonts and the source maps', async () => {
    // The point of building it from SHA256SUMS is that its contents cannot
    // go stale. This holds the two exclusions and nothing else, so a file
    // can never fall out of the tarball by being forgotten — only by
    // leaving the manifest, which is a decision with its own gate.
    const { contents, EXCLUDED } = await import('./consumer-tar.mjs');
    // The manifest is GENERATED here rather than read from SHA256SUMS.
    // That file is a release artefact and is gitignored, so reading it
    // passes on a machine where a previous release left one lying about
    // and fails on every fresh checkout — which is exactly what the
    // v5.1.0 release job found, red, while `npm run gates` was green
    // here [fix-3].
    const { checksums } = await import('./checksums.mjs');
    const files = contents(checksums());
    // ha/, vscode/ and tui/ were excluded here until 8.0.0 moved them to
    // repositories of their own; only the two exclusions remain.
    assert.equal(EXCLUDED.length, 2, 'the exclusions are fonts/ and *.map, and adding a third is a decision');
    assert.ok(files.length >= 80, `expected the copyable set, found ${files.length}`);
    assert.ok(!files.some((f) => f.startsWith('fonts/')), 'the fonts ship as their own asset');
    // One map ships since 12.0.0: the JavaScript bundle's, because consumers serve that file and it names its map [release-1200].
    assert.deepEqual(
        files.filter((f) => f.endsWith('.map')),
        ['dist/kp-themes.min.js.map'],
        'source maps are debugging aid, except the one beside the bundle a consumer serves',
    );
    // The three groups chassis-rs had to pull off the tag one by one.
    for (const file of ['js/theme-core.js', 'js/components.js', 'css/cyberpunk-register.css', 'css/layout.css', 'css/utilities.css']) {
        assert.ok(files.includes(file), `${file} is what CF1 exists about and is not in the tarball`);
    }
    const shippedThemes = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));
    assert.equal(
        files.filter((f) => /^css\/[a-z-]+-register\.css$/.test(f)).length,
        shippedThemes.length,
        `all ${shippedThemes.length} registers travel in the tarball`,
    );
    // A malformed manifest line must not smuggle an empty path into tar.
    assert.deepEqual(contents('abc  a.css\n\n   \nxyz  b.css\n'), ['a.css', 'b.css']);
});

// ── The dist bundle's export surface [CF2, 2026-09-09] ────────────────────

test('CF2: the bundle exports every published module, and never a name two modules declare', async () => {
    // chassis-rs called five functions that all sat inside the bundle and
    // none of which came out of it, because the bundle was js/auto.js and
    // js/auto.js exports one name. This holds the repair the way KT7
    // holds the check lists: the two surfaces side by side, so the bundle
    // cannot quietly stop carrying a module.
    const { MODULES, namespaceFor, declarations, entrySource } = await import('./generate-bundle.mjs');
    const read = (/** @type {string} */ m) => readFileSync(new URL(`../${m.slice(2)}`, import.meta.url), 'utf8');
    assert.ok(MODULES.length >= 20, `expected the published js/ modules, found ${MODULES.length}`);

    const declared = declarations(read);
    const entry = entrySource(declared);
    for (const module of MODULES) {
        assert.ok(entry.includes(`export * as ${namespaceFor(module)} from '${module}';`), `${module} has no namespace in the bundle entry`);
    }

    // A name exactly one module declares is flat; a name several declare
    // is not, because a flat one would silently be one of them.
    const single = [...declared].filter(([, m]) => m.length === 1).map(([n]) => n);
    const many = [...declared].filter(([, m]) => m.length > 1).map(([n]) => n);
    assert.ok(single.length >= 100, `expected the singly-declared exports, found ${single.length}`);
    for (const name of single) assert.match(entry, new RegExp(`\\b${name}\\b`), `${name} is declared once and is not exported flat`);
    for (const name of many) {
        const flat = new RegExp(`export \\{[^}]*\\b${name}\\b[^}]*\\} from`);
        assert.ok(!flat.test(entry), `${name} is declared by ${declared.get(name)?.length} modules and must not be flat`);
    }

    // And the built artefact really carries them, not just the entry.
    const bundle = readFileSync(new URL('../dist/kp-themes.js', import.meta.url), 'utf8');
    for (const fn of ['enforceContracts', 'attachConfirmations', 'attachSkipLinks', 'attachThemePickers', 'applyStoredTheme']) {
        assert.match(bundle, new RegExp(`\\b${fn}\\b`), `the bundle does not carry ${fn} — the five chassis-rs calls`);
    }
});

// ── Round six, C2: the register's configuration surface [AR43] ─────────────

test('AR43: every knob the architecture names has its default in the cyberpunk register', () => {
    const register = readFileSync(new URL('../css/cyberpunk-register.css', import.meta.url), 'utf8');
    // The demo's values, as AR43 lists them. A knob missing here, or with
    // another default, is the register drifting from the decision.
    const KNOBS = {
        '--kp-button-notch': 'var(--fx-notch-sm, 8px)',
        '--kp-button-slit': '10px',
        '--kp-nav-notch': '13px',
        '--kp-nav-enter': '520ms',
        '--kp-nav-enter-delay': '80ms',
        '--kp-decipher-cps': '26',
        '--kp-decipher-lead': '260ms',
        '--kp-decipher-swap': '0.5',
        '--kp-reveal-threshold': '0.6',
        '--kp-reveal-stagger': '260ms',
        '--kp-redact-stagger': '160ms',
        '--kp-classified-delay': '1500ms',
        '--kp-wipe': '480ms',
        '--kp-rule-draw': '480ms',
        '--kp-rule-weight': '3px',
        '--kp-slice': '600ms',
        '--kp-slice-hover': '320ms',
        '--fx-notch-sm': '8px',
    };
    const block = register.match(/\[data-theme='cyberpunk'\]\s*\{([^}]*)\}/)?.[1] ?? '';
    for (const [knob, value] of Object.entries(KNOBS)) {
        const m = block.match(new RegExp(`${knob.replace(/[-]/g, '\\-')}:\\s*([^;]+);`));
        assert.ok(m, `${knob} is not declared in the register's theme block`);
        assert.equal(m[1].trim(), value, `${knob} defaults to ${m[1].trim()}, AR43 says ${value}`);
    }
});

// ── Round six, C4: the fonts travel in the tarball [T19, AR39, rule 7f] ──────

test('T19: the packed tarball carries css/fonts.css, fonts/families.json and a subset face with its licence', () => {
    const out = execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: new URL('../', import.meta.url), encoding: 'utf8' });
    // npm 11 keys the dry-run report by package name.
    const report = Object.values(JSON.parse(out))[0];
    const files = report.files.map((/** @type {{ path: string }} */ f) => f.path);
    for (const expected of ['css/fonts.css', 'fonts/families.json', 'fonts/rajdhani/rajdhani-regular.woff2', 'fonts/rajdhani/LICENSE']) {
        assert.ok(files.includes(expected), `${expected} is not in the tarball`);
    }
    // And nothing from a family with a Reserved Font Name.
    // A reserved-name family travels renamed (R6-Q1): the face is in the
    // tarball under its slug, and the file itself carries the new family
    // and none of the reserved word.
    assert.ok(files.includes('fonts/sharetechmono/sharetechmono-regular.woff2'), 'the renamed face did not travel');
    const names = nameRecords(readFileSync(new URL('../fonts/sharetechmono/sharetechmono-regular.woff2', import.meta.url)));
    assert.ok(
        names.some((r) => r.id === 1 && r.text === 'KP Tech Mono'),
        'the shipped face is not renamed',
    );
    assert.ok(!names.some((r) => ![0, 7, 8, 9, 11, 13, 14].includes(r.id) && r.text.includes('Share')), 'the reserved word travelled');
});

// ── TH130: one stylesheet list for every CSS gate ────────────────────────────

test('TH130: every stylesheet the manifest ships has an entry in the one list, and the bundle order is the list order', () => {
    const shipped = FILES.filter((f) => f.startsWith('css/'));
    assert.ok(shipped.length >= 9, `only ${shipped.length} stylesheets in the manifest`);
    for (const file of shipped)
        assert.ok(STYLESHEET_ROLES[file] !== undefined, `${file} is in the manifest and has no entry in gates/config.json stylesheets`);
    for (const file of Object.keys(STYLESHEET_ROLES)) {
        assert.ok(existsSync(new URL(`../${file}`, import.meta.url)), `${file} is listed and does not exist`);
    }
    assert.deepEqual(stylesheets('bundled')[0], 'css/themes.css', 'the tokens come first in the bundle');
    // Drill [TH130]: `css/layout.css` deleted from the list → "is in the
    // manifest and has no entry", red (2026-09-07).
});
