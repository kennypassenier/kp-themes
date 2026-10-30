// Tests for the motion gates [DI5, DI7, TH131]: flash rates, reduced-motion guards, durations.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flashesPerSecond, reachableKeyframes, parseOpacityKeyframes, animations, unguardedMotion, flashVerdict } from './check-motion.mjs';
import { readFileSync } from 'node:fs';
import { themes } from './check-invariants.mjs';

// DI5 is the one invariant here whose violation harms a person, so its
// arithmetic is pinned rather than trusted. The numbers below are the
// shipped fx-flicker before and after L3 retimed it.

test('DI5: a run that opposes direction faster than three times a second fails', () => {
    // The old fx-flicker: six opposing swings over 1100ms = 5.5/s.
    const stops = [
        { stop: 0, opacity: 1 },
        { stop: 3, opacity: 0.4 },
        { stop: 6, opacity: 1 },
        { stop: 20, opacity: 0.3 },
        { stop: 24, opacity: 1 },
        { stop: 70, opacity: 0.5 },
        { stop: 74, opacity: 1 },
    ];
    assert.ok(flashesPerSecond(stops, 1100) > 3, 'the pre-L3 flicker must not pass');
});

test('DI5: a swing under ten percent is not a flash', () => {
    const stops = [
        { stop: 0, opacity: 1 },
        { stop: 50, opacity: 0.94 },
        { stop: 100, opacity: 1 },
    ];
    assert.equal(flashesPerSecond(stops, 100), 0);
});

// TH131: the test reads the register's real keyframes rather than pinning
// one by name — `fx-flicker` left with the 4.x register at C2, and a test
// that named it would have gone red on the absence rather than on a flash.
// Every opacity keyframe the register animates is rated with its own
// duration and iteration count.
test('DI5: every opacity keyframe the cyberpunk register animates stays under the threshold [TH131]', () => {
    const css = readFileSync(new URL('../css/cyberpunk-register.css', import.meta.url), 'utf8');
    // Since scope-98 the register names the package's alarm keyframes, so
    // the keyframes it can reach include css/components.css's.
    const keyframes = reachableKeyframes(css, parseOpacityKeyframes(readFileSync(new URL('../css/components.css', import.meta.url), 'utf8')));
    const rated = [];
    for (const anim of animations(css)) {
        const stops = keyframes.get(anim.name);
        if (!stops) continue;
        assert.ok(anim.durationMs !== null, `${anim.name}: a literal duration, so the rate can be computed`);
        rated.push(`${anim.name}: ${flashesPerSecond(stops, anim.durationMs, anim.cycles).toFixed(2)}/s`);
        assert.ok(flashesPerSecond(stops, anim.durationMs, anim.cycles) <= 3, `${anim.name} exceeds three opposing changes per second`);
    }
    assert.ok(rated.length >= 3, `only ${rated.length} opacity animations rated — the register ships more than that`);
});

// scope-98: a register that names a keyframe another stylesheet declares is
// measured with that keyframe's stops, not reported as unmeasurable. Before
// the fix the gate read the using file alone and this name had no stops.
test('DI5: a register naming a package keyframe is rated with the package stops [scope-98]', () => {
    const pkg =
        '@layer kp.components { @keyframes kp-alarm-flicker-in { 0% { opacity: 0; } 18% { opacity: 1; } 30% { opacity: 0.3; } 42% { opacity: 1; } 100% { opacity: 1; } } }';
    const register =
        "@layer kp.register { @media (prefers-reduced-motion: no-preference) { [data-theme='x'] .kp-alarm__panel { animation: kp-alarm-flicker-in 600ms steps(1, end) both; } } }";
    assert.equal(parseOpacityKeyframes(register).get('kp-alarm-flicker-in'), undefined);
    const [anim] = animations(register);
    const stops = reachableKeyframes(register, parseOpacityKeyframes(pkg)).get(anim.name);
    assert.ok(stops, 'the package keyframe is reachable from the register');
    assert.equal(flashesPerSecond(stops, anim.durationMs ?? 0, anim.cycles), 3);
    // The register's own keyframe of the same name wins, as the later layer's would.
    const own = `${register} @keyframes kp-alarm-flicker-in { 0% { opacity: 0; } 100% { opacity: 1; } }`;
    assert.equal(reachableKeyframes(own, parseOpacityKeyframes(pkg)).get('kp-alarm-flicker-in')?.length, 2);
});

// Drill [TH131]: a 5/s loop turns the same reading red.
test('DI5: an injected five-per-second loop is refused by the same reading [TH131]', () => {
    const css =
        '@keyframes bad { 0% { opacity: 1; } 10% { opacity: 0; } 20% { opacity: 1; } 30% { opacity: 0; } 40% { opacity: 1; } 50% { opacity: 0; } 60% { opacity: 1; } 70% { opacity: 0; } 80% { opacity: 1; } 90% { opacity: 0; } 100% { opacity: 1; } }\n' +
        '.x { animation: bad 2s linear infinite; }\n';
    const stops = parseOpacityKeyframes(css).get('bad');
    const [anim] = animations(css);
    assert.ok(stops && anim);
    assert.ok(flashesPerSecond(stops, anim.durationMs ?? 0, anim.cycles) > 3, 'five opposing changes per second must read over the threshold');
    // And the same burst once, over two seconds, is rated over the two
    // seconds it occupies — still over three, because it really is.
    assert.ok(flashesPerSecond(stops, 2000, 1) > 3);
    // A single fade once in 320ms is one change in the second it occupies.
    assert.equal(
        flashesPerSecond(
            [
                { stop: 0, opacity: 1 },
                { stop: 100, opacity: 0 },
            ],
            320,
            1,
        ),
        1,
    );
});

test('DI7: a transition inside a no-preference guard is not reported', () => {
    const css = '@media (prefers-reduced-motion: no-preference) {\n  .a { transition: opacity 1s; }\n}\n';
    assert.deepEqual(unguardedMotion(css), []);
});

test('DI7: a transition after a guard block has closed is reported', () => {
    const css = '@media (prefers-reduced-motion: no-preference) {\n  .a { transition: opacity 1s; }\n}\n.b {\n  transition: color 1s;\n}\n';
    assert.equal(unguardedMotion(css).length, 1);
});

test('a computed animation duration is read, not skipped', () => {
    // Three animations with calc() durations shipped invisible to this
    // gate for the length of one commit, because the parser matched a
    // literal number only. The gate now reports a duration it cannot
    // read, and the runner measures the worst case.
    const [anim] = animations('.x { animation: kp-drill calc(var(--fx-duration) * 3) linear infinite; }');
    assert.equal(anim.name, 'kp-drill');
    assert.equal(anim.durationMs, null);
    assert.match(anim.duration, /calc/);

    const literal = animations('.x { animation: fx-flicker 2.2s steps(3) infinite; }');
    assert.equal(literal[0].durationMs, 2200);
});

test('step-6: the compliance table and the motion gate rate the same animation the same way', () => {
    // The fault this closes: `gates/compliance.mjs` called
    // `flashesPerSecond(stops, duration)` where `gates/check-motion.mjs`
    // calls it `(stops, duration, cycles)`. With `cycles` left at its
    // default of Infinity, an animation that runs once was rated as though
    // it looped forever — so the table published FAIL on DI5 for every
    // theme while the gate it quotes published pass. Measured 2026-09-11:
    // fourteen of thirty-six animations over the threshold on the
    // two-argument call, none on the three-argument one.
    //
    // The measure is not "call it with three arguments" — that is the fix.
    // The measure is that the same sum computed in two places cannot drift
    // again, which is what this asserts.
    const stops = [
        { stop: 0, opacity: 0 },
        { stop: 0.5, opacity: 1 },
        { stop: 1, opacity: 0 },
    ];
    // A one-shot: two opposing changes over 300ms, which is a rate only if
    // you assume it repeats.
    assert.ok(flashesPerSecond(stops, 300, 1) <= 3, 'once is not a rate');
    assert.ok(flashesPerSecond(stops, 300) > 3, 'and forever is — the default the table was silently taking');
    assert.notEqual(flashesPerSecond(stops, 300, 1), flashesPerSecond(stops, 300), 'the two answers really are different');

    // And the shipped table says what the gate says.
    const table = readFileSync(new URL('../docs/DESIGN_INVARIANTS.md', import.meta.url), 'utf8');
    const lines = table.split('\n');
    const row = lines.find((line) => line.includes('DI5 flash threshold'));
    assert.ok(row, 'the compliance table carries a DI5 row');
    // Per theme, the cell says what flashVerdict() says of that theme's
    // register (the sum lives in gates/check-motion.mjs, read by the table
    // and here alike).
    const header = lines.find((line) => /^\| Invariant/.test(line)) ?? lines[lines.indexOf(row) - 2];
    const themes = header
        .split('|')
        .map((c) => c.trim())
        .slice(2, -1);
    const cells = row
        .split('|')
        .map((c) => c.trim())
        .slice(2, -1);
    for (const [i, theme] of themes.entries()) {
        if (cells[i] === 'n/a') continue;
        const source = readFileSync(new URL(`../css/${theme}-register.css`, import.meta.url), 'utf8');
        assert.equal(
            cells[i] === 'FAIL',
            !flashVerdict(source),
            `${theme}: the table says ${cells[i]} where the motion gate says ${flashVerdict(source) ? 'pass' : 'FAIL'}`,
        );
    }
});
