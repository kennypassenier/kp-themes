// The site's code inks, measured as TEXT [fix-58].
//
// Drilled red on 2026-09-17 before the tokens existed: with
// `.kp-code__string` on `--chart-2`, the gate named seven themes from
// 3.38:1 (lapis) to 4.14:1 (titanium) and exited 1. The chart tokens are
// chosen and measured as lines in a graph, where SC 1.4.11 asks 3:1; text
// asks 4.5:1, and nothing said so until this check.
//
// Run: node --test gates/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { codeInks, inkFaults } from './check-site.mjs';
import { contrast, hsl, paintedContrast } from './colour.mjs';

const THEMES = {
    // lapis, as it was and as it is: a dark card, so the string had to go
    // lighter rather than darker.
    lapis: { card: 'hsl(228, 57%, 31%)', 'chart-2': 'hsl(5, 80%, 62%)', 'code-string': 'hsl(5, 80%, 72%)' },
};

test('a code class reads its colour out of the stylesheet', () => {
    const css = '.kp-code__string {\n    color: var(--code-string);\n}\n.kp-prose {\n    color: var(--foreground);\n}\n';
    assert.deepEqual(codeInks(css), [{ cls: 'kp-code__string', token: 'code-string' }]);
});

test('an ink under 4.5:1 on its surface is refused, and the same hue above it is not [fix-58]', () => {
    const before = inkFaults([{ cls: 'kp-code__string', token: 'chart-2' }], THEMES);
    assert.equal(before.length, 1);
    assert.match(before[0], /lapis: \.kp-code__string reads 3\.\d\d:1 on --card/);
    assert.deepEqual(inkFaults([{ cls: 'kp-code__string', token: 'code-string' }], THEMES), []);
});

test('a code class whose surface is not named is itself a fault', () => {
    const faults = inkFaults([{ cls: 'kp-code__number', token: 'code-string' }], THEMES);
    assert.equal(faults.length, 1);
    assert.match(faults[0], /no surface is named for it/);
});

test('a token the theme does not declare is named, not skipped', () => {
    const faults = inkFaults([{ cls: 'kp-code__keyword', token: 'code-keyword' }], THEMES);
    assert.deepEqual(faults, ['lapis: site.css colours .kp-code__keyword with --code-keyword, which the theme does not declare']);
});

// fix-59: the ink rule measures the way the browser paints, not the way
// the picker computes. titanium's code string is the case that found it:
// 4.51:1 on unrounded channels, 4.47:1 once each channel is rounded to the
// 8 bits the screen gets. A gate that switches back to `contrast()` turns
// this red.
test('the ink rule uses the painted measure [fix-59]', () => {
    const ink = 'hsl(268, 76%, 68%)';
    const card = 'hsl(214, 13%, 15%)';
    assert.ok(contrast(hsl(ink), hsl(card)) >= 4.5, 'unrounded, this pair passes');
    assert.ok(paintedContrast(hsl(ink), hsl(card)) < 4.5, 'painted, it does not');
    const faults = inkFaults([{ cls: 'kp-code__string', token: 'code-string' }], {
        titanium: { card, 'code-string': ink },
    });
    assert.equal(faults.length, 1, 'so the gate refuses it');
    assert.match(faults[0], /4\.47:1/);
});
