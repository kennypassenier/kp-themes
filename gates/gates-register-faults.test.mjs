// Tests for the live-found register faults and the gate module import rule [fix-12, fix-13, gap-1].

import { test } from 'node:test';
import { pressedInBase, cancelledPressedStates } from './check-pressed-state.mjs';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { variantGrounds, swallowedVariants } from './check-variant-ground.mjs';

test('fix-12: a register that cancels a pressed state without replacing it fails', () => {
    const base = pressedInBase(`
        .kp-button:active:not(:disabled) { background: var(--secondary-active); }
        .kp-button--primary:active:not(:disabled) { background: var(--primary-active); }
        .kp-button--ghost:hover:not(:disabled) { background: var(--kp-highlight); }
    `);
    assert.deepEqual([...base].sort(), ['.kp-button', '.kp-button--primary']);

    // The fault: a hover ground in kp.register, no pressed rule of its own.
    // kp.register is a later layer, and a layer beats a state.
    const cancels = `[data-theme='x'] .kp-button--primary:hover { background: var(--kp-neon); }`;
    assert.deepEqual(cancelledPressedStates(cancels, base), ['.kp-button--primary']);

    // Replaced: whatever the register presses WITH, it presses.
    const replaces = cancels + `\n[data-theme='x'] .kp-button--primary:active:not(:disabled) { box-shadow: var(--kp-pressed); }`;
    assert.deepEqual(cancelledPressedStates(replaces, base), []);

    // Not the gate's business: the base gives ghost no pressed state, so a
    // hover on it cancels nothing. Kept narrow on purpose — a wider rule
    // would demand a pressed state the package never promised.
    const ghost = `[data-theme='x'] .kp-button--ghost:hover { background: var(--card); }`;
    assert.deepEqual(cancelledPressedStates(ghost, base), []);

    // And a hover that paints no ground outranks nothing.
    const outline = `[data-theme='x'] .kp-button--primary:hover { border-color: var(--kp-neon); }`;
    assert.deepEqual(cancelledPressedStates(outline, base), []);
});

test('fix-13: a gate module that another module imports does not run on import', () => {
    // The fault: `check-contrast.mjs` measured every theme at module top
    // level and ended in `process.exit(1)`. `gates.test.mjs` imports
    // `discoverThemesFromCss` from it, so a single failing contrast pair
    // killed this whole file — with a message about a theme none of these
    // tests touch, and no test name attached to it. It also made the
    // accessibility floor a hard gate by accident, which is the opposite of
    // Kenny's decision of 2026-09-09 that contrast is advice.
    //
    // The property, not the file: a gate that ANOTHER module imports must
    // put its run behind an entry-point check. Searched across gates/ on
    // 2026-09-12; check-contrast.mjs was the only instance.
    const dir = new URL('./', import.meta.url);
    const offenders = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.endsWith('.mjs')) continue;
        const source = readFileSync(new URL(entry.name, dir), 'utf8');
        // Phase 7 widened this. The property fix-13 named is "runs on
        // import"; the implementation asked only about `process.exit`, so
        // a generator that writes files on import was invisible to it —
        // and gates/generate-examples.mjs is exactly that, as the Phase 7
        // audit found by importing it and watching eleven example pages
        // get rewritten under the suite that was measuring them. Ending
        // the process and rewriting tracked artefacts are the same fault
        // wearing different clothes.
        const sideEffects = ['process.exit', 'writeFileSync', 'mkdirSync', 'rmSync', 'execFileSync', 'spawnSync'];
        if (!sideEffects.some((marker) => source.includes(marker))) continue;
        // Is it imported by anything else in the repository?
        let imported = false;
        for (const other of readdirSync(dir)) {
            if (other === entry.name || !other.endsWith('.mjs')) continue;
            // Both spellings: `from './x.mjs'` and the bare `import
            // './x.mjs'` that exists precisely to run a module for its
            // side effects — which is the shape this test is about.
            const text = readFileSync(new URL(other, dir), 'utf8');
            if (text.includes(`from './${entry.name}'`) || text.includes(`import './${entry.name}'`)) imported = true;
        }
        // Two spellings of the entry-point check are accepted: the template-string
        // comparison against `file://${process.argv[1]}` and the
        // `process.argv[1] === fileURLToPath(import.meta.url)` form that
        // check-rereview.mjs uses. Both keep the run off the import path.
        const guarded = source.includes('import.meta.url ===') || /process\.argv\[1\]\s*===\s*fileURLToPath\(import\.meta\.url\)/.test(source);
        if (imported && !guarded) offenders.push(entry.name);
    }
    assert.deepEqual(offenders, [], 'these gates run their check on import, so importing one ends the importing process');
});

test("gap-1: a register that repaints a variant's ground without replacing it fails", () => {
    const grounds = variantGrounds(`
        .kp-alert--destructive { background: var(--destructive); color: var(--destructive-foreground); }
        .kp-alert--success { background: var(--success); color: var(--success-foreground); }
        .kp-badge--plain { background: var(--muted); }
    `);
    // Only the pairs: a ground with no ink of its own cannot orphan anything.
    assert.deepEqual([...grounds.keys()], ['.kp-alert']);
    assert.deepEqual(grounds.get('.kp-alert'), ['--destructive', '--success']);

    // The fault Kenny saw: the base repainted for every flavour.
    const swallows = `[data-theme='x'] .kp-alert { background: var(--background); }`;
    assert.deepEqual(swallowedVariants(swallows, grounds), ['.kp-alert']);

    // Scoped off the flavours, which is the repair.
    const scoped = `[data-theme='x'] .kp-alert:not([class*='kp-alert--']) { background: var(--background); }`;
    assert.deepEqual(swallowedVariants(scoped, grounds), []);

    // The house indirection: the base reads a knob each flavour sets.
    const knob = `[data-theme='x'] .kp-alert { background: var(--kp-plate); }
        [data-theme='x'] .kp-alert--destructive { --kp-plate: var(--destructive); }
        [data-theme='x'] .kp-alert--success { --kp-plate: var(--success); }`;
    assert.deepEqual(swallowedVariants(knob, grounds), []);

    // And the absence of a ground is not a ground — four registers say
    // "I paint my plate on a pseudo-element" exactly this way.
    const elsewhere = `[data-theme='x'] .kp-alert { background: transparent; }`;
    assert.deepEqual(swallowedVariants(elsewhere, grounds), []);
});
