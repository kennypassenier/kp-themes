// Tests for the default-value extractor, against the real sources [AR21].

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { destructuredDefaults, literal, extractDefaults } from './extract-defaults.mjs';

test('AR21: the documented default and the destructured one are compared', () => {
    assert.deepEqual(
        [...destructuredDefaults("flavour, separator = ': ', as: As = 'div', wrap = true, ...rest").entries()],
        [
            ['flavour', null],
            ['separator', "': '"],
            ['as', "'div'"],
            ['wrap', 'true'],
        ],
    );
    assert.equal(literal("': '"), ': ');
    assert.equal(literal('() => {}'), null);

    const result = extractDefaults();
    assert.ok(result.expected >= 75, `only ${result.expected} documented defaults`);
    assert.equal(result.agreed + result.disagreed.length + result.missing.length, result.expected);
    // A disagreement is a finding about a component, not about this
    // check: today there are none, and a new one should be looked at
    // rather than absorbed.
    assert.deepEqual(
        result.disagreed.map((c) => `${c.module} ${c.component}.${c.prop}: documented ${c.documented}, code has ${c.actual}`),
        [],
    );

    // Phase 7: `missing` was an unasserted bucket. A documented default
    // whose code has none is not always wrong — two of them keep the
    // default somewhere the destructuring cannot show — but "not always
    // wrong" is not "never looked at", and a third arriving because
    // someone deleted a default would have landed here in silence. Named,
    // with the reason, the way themes/known-asymmetry.json names its four.
    assert.deepEqual(
        result.missing.map((c) => `${c.component}.${c.prop}`).sort(),
        ['Marquee.pause', 'SplitPane.defaultValue'],
        'a documented default is not comparable; either the code lost it, or this list owes it a reason',
    );
    // Marquee.pause     — the default is the CSS custom property's own
    //                     fallback, `--kp-marquee-pause: offscreen`, so
    //                     the component passes the prop through untouched.
    // SplitPane.defaultValue — `defaultValue ?? initial` keeps the 1.x
    //                     alias working, so the 50 lives in useControllable.

    // And the count that says the extractor is still finding things at
    // all: without this, a broken extractor makes everything "missing"
    // and the disagreement list stays honestly empty.
    assert.ok(result.agreed >= 80, `only ${result.agreed} defaults could be compared and agreed`);
});
