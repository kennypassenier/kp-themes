// Tests for the tag selection and the no-flash snippet [Phase 7, scope-33, fix-51].

import { test } from 'node:test';
import assert from 'node:assert/strict';

// ── the no-flash snippet, which is text that becomes a <script> ─────────
//
// Phase 7 found this with no test of any kind. The snippet is built as a
// string and inlined by the consumer inside <script>…</script>, so the
// escaping it needs is not `JSON.stringify`'s: that escapes for a JS
// string literal, and `</script>` is legal inside one while still ending
// the element it sits in. Both values interpolated into the snippet are
// the consumer's own, so this is a foot-gun rather than an injection —
// which is why it is a test and not a correction.
test('the no-flash snippet cannot break out of the script element it lives in', async () => {
    const { noFlashSnippet } = await import('../js/no-flash.js');
    const hostile = 'a</script><img src=x onerror=alert(1)>';

    for (const snippet of [
        noFlashSnippet({ key: hostile }),
        noFlashSnippet({ attribute: hostile }),
        noFlashSnippet({ key: hostile, effects: true }),
        // The register variant interpolates a pattern as well [scope-50].
        noFlashSnippet({ key: hostile, register: { pattern: `${hostile}{theme}${hostile}` } }),
    ]) {
        assert.ok(!snippet.includes('</script'), 'the snippet closes the script element it is inlined in');
    }

    // The escape has to be inert, not merely absent: the engine must still
    // read the very key the consumer asked for. Running the snippet is the
    // only way to know — reading the text back would re-implement it.
    let seen = null;
    const storage = { getItem: (/** @type {string} */ k) => ((seen = k), null), setItem: () => {} };
    const root = { setAttribute: () => {} };
    new Function('localStorage', 'document', noFlashSnippet({ key: hostile }))(storage, { documentElement: root });
    assert.equal(seen, hostile, 'escaping changed the key the snippet reads');

    // And the attribute it writes survives the same trip.
    let wrote = null;
    new Function('localStorage', 'document', noFlashSnippet({ attribute: hostile }))(
        { getItem: () => 'dark', setItem: () => {} },
        { documentElement: { setAttribute: (/** @type {string} */ a) => (wrote = a) } },
    );
    assert.equal(wrote, hostile, 'escaping changed the attribute the snippet writes');
});

test('a register edit selects its theme, and the commit level adds every sweep [Phase 7, scope-33]', async () => {
    const { grepFor, select } = await import('./tags.mjs');
    // Phase 7 found a register edit running twenty tests while the every-theme
    // press, alert, focus-ring and reflow sweeps never ran. Under tags the
    // register selects its theme — its own spec and its slice of every sweep —
    // plus the sweeps of the components its changed rules name; the commit
    // level adds every @sweep test. Both halves are asserted here.
    const before = "[data-theme='dark'] .kp-button {\n    color: red;\n}\n";
    const after = "[data-theme='dark'] .kp-button {\n    color: blue;\n}\n";
    const sel = select([{ file: 'css/dark-register.css', before, after, diff: '@@ -2 +2 @@' }]);
    assert.equal(sel.all, false, 'a register edit should not fall back to everything');
    const building = grepFor(sel, 'building');
    assert.ok(typeof building === 'string' && building.length > 0);
    const matches = (/** @type {string} */ title) => new RegExp(/** @type {string} */ (building)).test(title);
    assert.ok(
        matches('firefox register-dark.spec.mjs the dark register › x @theme:dark @component:page-effects'),
        "the register's own spec is not selected",
    );
    assert.ok(
        matches('firefox registers.spec.mjs .kp-button reacts to being pressed under dark @sweep @theme:dark @component:button'),
        "dark's slice of the press sweep is not selected",
    );
    assert.ok(
        matches('firefox button.spec.mjs the button › ring in every theme @component:button @sweep'),
        'the button sweep the changed rule names is not selected',
    );
    assert.ok(
        !matches('firefox button.spec.mjs the button › the size scale is configurable @component:button'),
        'a non-sweep button test in the default theme was selected for a dark rule',
    );
    assert.ok(
        !matches('firefox registers.spec.mjs the destructive alert can be read under light @sweep @theme:light @component:feedback'),
        "another theme's sweep slice was selected at building level",
    );
    // …and the commit level runs that slice after all.
    const commit = new RegExp(/** @type {string} */ (grepFor(sel, 'commit')));
    assert.ok(
        commit.test('firefox registers.spec.mjs the destructive alert can be read under light @sweep @theme:light @component:feedback'),
        'the commit level skips a sweep',
    );
    // A tag is matched whole: @theme:deep-dark (a made-up name) is not @theme:dark.
    assert.ok(!matches('firefox register-deep-dark.spec.mjs x @theme:deep-dark'), 'a theme tag matched as a prefix');

    // An anatomy edit is the same coupling by another route; a comment is none.
    assert.equal(
        grepFor(select([{ file: 'themes/dark/anatomy.md', before: 'a', after: 'b', diff: '@@ -1 +1 @@' }]), 'building'),
        '(?:^|\\s)@theme:dark(?=\\s|$)',
    );
    const comment = select([{ file: 'css/dark-register.css', before, after: `/* note */\n${before}`, diff: '@@ -0,0 +1 @@' }]);
    assert.equal(grepFor(comment, 'building'), '', 'a comment-only register edit selected tests');
    assert.equal(grepFor(comment, 'release'), null, 'the release level is not every test');
});

test('the engines level is the commit selection in both engines, on the narrow themes [fix-51]', async () => {
    const { grepFor, select } = await import('./tags.mjs');
    const { parse, playwrightArgs, envFor } = await import('./run-tags.mjs');
    // The release run of 6.1.0 found eighteen tests red that only Chromium
    // saw: building and commit pass --project=firefox, and nothing between
    // them and the release asked the other engine.
    const before = "[data-theme='dark'] .kp-button {\n    color: red;\n}\n";
    const sel = select([{ file: 'css/dark-register.css', before, after: before.replace('red', 'blue'), diff: '@@ -2 +2 @@' }]);
    assert.equal(parse(['--level', 'engines']).level, 'engines');
    assert.equal(grepFor(sel, 'engines'), grepFor(sel, 'commit'), 'the engines level selects what the commit level selects');
    const args = playwrightArgs('engines', grepFor(sel, 'engines'));
    assert.ok(args && !args.some((a) => a.startsWith('--project')), 'the engines level is held to one engine');
    assert.deepEqual(
        playwrightArgs('commit', null)?.filter((a) => a.startsWith('--project')),
        ['--project=firefox'],
    );
    assert.equal(envFor('engines').KP_SWEEP_THEMES, 'formal,dark,cyberpunk', 'the engines level widens the theme sweeps');
});

test('the tag gate refuses an untagged test, an unknown tag, a theme walk without @sweep and an unmapped file [scope-33]', async () => {
    const { audit } = await import('./check-tags.mjs');
    const { loadMap } = await import('./tags.mjs');
    const map = loadMap();
    const clean =
        "import { test } from '@playwright/test';\ntest.describe('d', { tag: ['@component:button'] }, () => {\n    test('t', async () => {});\n});\n";
    assert.deepEqual(
        (await audit([{ file: 'tests/x.spec.mjs', source: clean }], ['css/components.css'], { ...map, components: { button: '' } })).problems,
        [],
    );
    /** @type {[string, RegExp][]} */
    const cases = [
        ["test('t', async () => {});", /carries no tag/],
        ["test('t', { tag: ['@component:nope'] }, async () => {});", /names no component/],
        ["test('t', { tag: ['@theme:nope'] }, async () => {});", /names no theme/],
        ["test('t', { tag: ['@button'] }, async () => {});", /is not @sweep/],
        ["test('t', { tag: ['@component:button'] }, async () => { for (const t of THEMES) {} });", /walks every theme/],
    ];
    for (const [source, expected] of cases) {
        const { problems } = await audit([{ file: 'tests/x.spec.mjs', source }], [], { ...map, components: { button: '' } });
        assert.ok(
            problems.some((p) => expected.test(p)),
            `${source} passed: ${problems.join('; ')}`,
        );
    }
    // test.skip(condition, reason) is not a declaration and needs no tag.
    const skip = "test.describe('d', { tag: ['@sweep'] }, () => { test('t', async () => { test.skip(true, 'why'); }); });";
    assert.deepEqual((await audit([{ file: 'tests/x.spec.mjs', source: skip }], [], { ...map, components: {} })).problems, []);
    const { problems } = await audit([{ file: 'tests/x.spec.mjs', source: clean }], ['nowhere/unmapped.bin'], { ...map, components: { button: '' } });
    assert.ok(
        problems.some((p) => /matches no rule/.test(p)),
        'an unmapped file passed',
    );
});
