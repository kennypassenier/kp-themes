// The guard on a test run's own arguments [fix-44].
//
// Playwright reads its positional arguments as filters, so a misspelt spec
// path is silently ignored and the run reports the other files as a pass.
// `tests/global-setup.mjs` refuses such a run; this pins what counts as
// missing, without starting a browser.
//
// Red first, 2026-09-16: before the guard, `npx playwright test
// tests/catalogue-review.spec.mjs tests/intros.spec.mjs` printed "19 passed"
// and ran nothing of the second name, which does not exist.
//
// Run: node --test gates/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { missingSpecs } from '../tests/global-setup.mjs';

test('a spec path that is not a file is named [fix-44]', () => {
    assert.deepEqual(missingSpecs(['tests/catalogue-intros.spec.mjs', 'tests/intros.spec.mjs']), ['tests/intros.spec.mjs']);
});

test('the flags and the filters of a normal run pass', () => {
    assert.deepEqual(missingSpecs(['tests/catalogue-intros.spec.mjs', '--project=firefox', '-g', 'review page too']), []);
    // A grep pattern that happens to name a spec is the option's value, not a path.
    assert.deepEqual(missingSpecs(['--grep', 'a name with dialog.spec.mjs in it']), []);
    assert.deepEqual(missingSpecs(['-g', 'tests/intros.spec.mjs']), []);
});
