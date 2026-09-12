/**
 * gap-1 — a register may not repaint a ground a variant's ink depends on.
 *
 * The components layer defines a coloured variant as a PAIR: the plate and
 * the ink drawn to sit on it.
 *
 *     .kp-alert--destructive { background: var(--destructive); color: var(--destructive-foreground); }
 *
 * A register that paints `.kp-alert` — the base class, every variant
 * included — replaces the plate, because `kp.register` is a later layer
 * than `kp.components` and a layer beats specificity. The ink stays,
 * pointing at a plate that is no longer under it.
 *
 * Kenny saw it in chassis-rs on 2026-09-10 and said to write it down and
 * touch nothing. Measured in firefox on 2026-09-12, before the repair:
 * seventeen of the twenty-two themes carried a destructive alert whose text
 * could not be read, grotesk at 1.00 exactly — white on white.
 *
 * This is fix-12 one property over. That one is about a STATE a register
 * cancels; this is about a VARIANT. The fault underneath both is the same:
 * overriding half of a pair the base layer defines together.
 */
import { readFileSync, readdirSync } from 'node:fs';

const CSS = new URL('../css/', import.meta.url);

/**
 * The base classes whose variants the components layer gives a ground.
 *
 * @param {string} componentsSource
 * @returns {Map<string, string[]>} base class → the variants that have one
 */
export function variantGrounds(componentsSource) {
    /** @type {Map<string, string[]>} */
    const found = new Map();
    for (const m of componentsSource.matchAll(/^\s*(\.kp-[a-z]+)(--[a-z]+)[^{,]*\{([^}]*)\}/gm)) {
        if (!/background\s*:/.test(m[3]) || !/\bcolor\s*:/.test(m[3])) continue;
        const list = found.get(m[1]) ?? [];
        if (!list.includes(m[2])) list.push(m[2]);
        found.set(m[1], list);
    }
    return found;
}

/**
 * @param {string} source one register
 * @param {Map<string, string[]>} grounds from variantGrounds
 * @returns {string[]} the base classes it repaints for every variant
 */
export function swallowedVariants(source, grounds) {
    const problems = [];
    for (const [base, variants] of grounds) {
        // A rule on the bare base class, with nothing excluding the variants.
        const rule = new RegExp(`\\[data-theme='[^']+'\\]\\s*\\${base}(\\s*)\\{([^}]*)\\}`, 'g');
        for (const m of source.matchAll(rule)) {
            const ground = /background\s*:([^;]*)/.exec(m[2]);
            if (ground === null) continue;

            // `transparent` and `none` are the ABSENCE of a ground, which is
            // how four registers say "I paint my plate somewhere else" —
            // deco, phantom, synthwave and terminal all draw theirs on a
            // pseudo-element. Measured 2026-09-12 in firefox: their coloured
            // buttons read 5.29 to 19.98, so the pair is intact and it is the
            // gate that would be wrong. The same trap as `transition: none`
            // in the motion gate, which is the second time the absence of a
            // value has been read as the value.
            if (/^\s*(transparent|none)\s*$/.test(ground[1])) continue;

            // The house indirection, and not a fault: several registers paint
            // the base with `background: var(--kp-plate…)` and let each
            // variant set that property instead. The pair is intact — it just
            // runs through a custom property. Measured 2026-09-12 in firefox:
            // this shape covers brutalism, deco, phantom, synthwave and
            // terminal, whose coloured buttons read between 5.29 and 19.98,
            // so reporting them would be reporting nothing.
            const knob = /var\(\s*(--kp-[a-z-]+)/.exec(ground[1]);
            if (knob !== null && new RegExp(`\\${base}--[a-z]+[^{]*\\{[^}]*${knob[1]}\\s*:`).test(source)) continue;

            // …or the register restates every variant's own ground outright.
            const restates = variants.every((v) =>
                new RegExp(`\\[data-theme='[^']+'\\]\\s*\\${base}\\${v}[^{]*\\{[^}]*background\\s*:`).test(source),
            );
            if (!restates) problems.push(base);
        }
    }
    return [...new Set(problems)];
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const grounds = variantGrounds(readFileSync(new URL('components.css', CSS), 'utf8'));
    let failed = 0;
    let checked = 0;
    for (const name of readdirSync(CSS).filter((n) => n.endsWith('-register.css'))) {
        checked++;
        for (const base of swallowedVariants(readFileSync(new URL(name, CSS), 'utf8'), grounds)) {
            failed++;
            console.error(
                `css/${name}: a ground on \`${base}\` repaints every variant of it, and the components layer ` +
                    `pairs each variant's plate with its own ink — so that ink is left on a plate that is not there [gap-1]. ` +
                    `Scope the rule (\`${base}:not([class*='${base.slice(1)}--'])\`) or restate every variant's ground.`,
            );
        }
    }
    // The check has to have something to check. Both of these parse
    // css/components.css with line-anchored patterns, and a prettier
    // reformat, a comma-grouped selector or a nested @media would defeat
    // them — leaving the loop body unentered and this line printing a
    // green nothing. gates/check-register-coverage.mjs guards the same
    // way for the same reason (Phase 7).
    if (grounds.size === 0) {
        console.error('gate broke: css/components.css defines no variant grounds, which cannot be right.');
        process.exit(1);
    }
    if (failed) process.exit(1);
    const pairs = [...grounds].map(([b, v]) => `${b} (${v.length})`).join(', ');
    console.log(`Variant grounds: ${checked} registers swallow none of the pairs the components layer defines — ${pairs} [gap-1].`);
}
