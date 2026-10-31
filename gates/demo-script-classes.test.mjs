// What check-demo-variants sees in a demo's own scripts (chassis-rs gap 19).
//
// Red first, 2026-10-31: a section whose badge a script drew into an empty
// stage showed the gate no badge, so its missing tones went unreported, and a
// listed alert whose four tones the script drew was reported missing.
//
// Run: node --test gates/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scriptClasses, demoScripts, renderedClasses } from './demo-script-classes.mjs';

const files = {
    'research/t/demo.html': [
        '<section data-review-item="badge"><div id="s"></div></section>',
        '<script>const inline = "kp-chip kp-chip--soft";</script>',
        '<script type="application/json">{"x":"kp-ghost--json"}</script>',
        '<script type="module" src="demo.js"></script>',
        '<script type="module" src="../_review/review.js"></script>',
        '<script type="module" src="../../js/auto.js"></script>',
    ].join('\n'),
    'research/t/demo.js': "import { t } from './parts.js';\nimport '../shared/kit.js';\ns.innerHTML = `<b class=\"kp-badge kp-badge--${t ? 'success' : \"warning\"}\">`;",
    'research/t/parts.js': "export const t = 1; const a = 'kp-alert kp-alert--info'; const d = 'data-kp-state';",
    'research/shared/kit.js': "const k = 'kp-tile--wide';",
    'research/_review/review.js': "const r = 'kp-review--kit';",
    'js/auto.js': "const p = 'kp-package--js';",
};
const read = (/** @type {string} */ p) => /** @type {Record<string, string>} */ (files)[p];
const exists = (/** @type {string} */ p) => p in files;

test('written-out classes and modifiers picked in a template are seen', () => {
    const { components, modifiers } = scriptClasses("`kp-alert--${over ? 'destructive' : 'warning'}` 'kp-badge kp-badge--info' data-kp-state kp-row__cell");
    assert.deepEqual([...components].sort(), ['alert', 'badge']);
    assert.deepEqual([...modifiers].sort(), ['alert--destructive', 'alert--warning', 'badge--info']);
});

test("a demo's own scripts are read, imports followed; the review kit, the package and data blocks are not", () => {
    assert.equal(demoScripts('research/t/demo.html', read, exists).length, 4);
    const { components, modifiers } = renderedClasses('research/t/demo.html', read, exists);
    assert.deepEqual([...modifiers].sort(), ['alert--info', 'badge--success', 'badge--warning', 'chip--soft', 'tile--wide']);
    assert.ok(!components.has('review') && !components.has('package') && !components.has('ghost') && !components.has('state'));
});

test('a demo script that is named but missing is an error, not a silent pass', () => {
    const page = 'research/t/demo.html';
    const broken = (/** @type {string} */ p) => (p === page ? '<script src="gone.js"></script>' : read(p));
    assert.throws(() => demoScripts(page, broken, exists), /research\/t\/gone\.js is missing/);
});
