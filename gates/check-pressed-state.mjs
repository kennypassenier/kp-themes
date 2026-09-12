/**
 * fix-12 — a register may not cancel the pressed state it does not replace.
 *
 * `@layer kp.base, kp.components, kp.register, ...`: a layer beats a state.
 * So `[data-theme='x'] .kp-button:hover { background: ... }` in kp.register
 * outranks `.kp-button:active { background: var(--secondary-active) }` in
 * kp.components, and the button stops reacting to being pressed — while the
 * pointer is on it, which is the only time anyone presses it.
 *
 * Kenny found it on shade-dark, 2026-09-11: "als ik gewoon blijf klikken op
 * de knop zelf, dan gebeurt er precies niks... bij shade light werkt het wel
 * precies". Measured the next day: fifteen of the twenty-five registers wrote
 * a hover background for a button the base layer gives a pressed state, and
 * thirteen of them cancelled one.
 *
 * The rule is narrow on purpose. It fires only where the components layer
 * actually defines a pressed background for that exact selector — a hover on
 * `--ghost` cancels nothing, because the base has no pressed state there.
 */
import { readFileSync, readdirSync } from 'node:fs';

const CSS = new URL('../css/', import.meta.url);

/**
 * The button selectors the components layer gives a pressed background.
 *
 * @param {string} componentsSource
 * @returns {Set<string>}
 */
export function pressedInBase(componentsSource) {
    const found = new Set();
    for (const m of componentsSource.matchAll(/^\s*(\.kp-button(?:--[a-z]+)?):active[^{]*\{([^}]*)\}/gm)) {
        if (/background\s*:/.test(m[2])) found.add(m[1]);
    }
    return found;
}

/**
 * @param {string} source one register
 * @param {Set<string>} base the selectors from pressedInBase
 * @returns {string[]} the selectors this register cancels without replacing
 */
export function cancelledPressedStates(source, base) {
    const problems = [];
    for (const selector of base) {
        // A hover rule in this register that paints the same button's ground.
        const hover = new RegExp(`\\[data-theme='[^']+'\\]\\s*${selector.replace('--', '--')}:hover[^{]*\\{([^}]*)\\}`, 'g');
        let paints = false;
        for (const m of source.matchAll(hover)) if (/background\s*:/.test(m[1])) paints = true;
        if (!paints) continue;
        // …and no pressed rule of its own for that button.
        const active = new RegExp(`\\[data-theme='[^']+'\\]\\s*${selector}:active`);
        if (!active.test(source)) problems.push(selector);
    }
    return problems;
}

/**
 * A selector's specificity as one comparable number, counting only what
 * separates two rules for the same control: classes, attributes and
 * pseudo-classes. Ids and elements never appear in this package's
 * registers, so a single count is enough and a full parser is not.
 *
 * `:not(…)` counts its own contents, the way the cascade does: that is
 * the whole reason this exists, since a register's hover rule reaches for
 * `:not(.kp-button--primary)` and friends to exclude the variants.
 *
 * @param {string} selector
 * @returns {number}
 */
export function weight(selector) {
    // Strip :not( and ) so the contents are counted in place, then count
    // every class, attribute and remaining pseudo-class.
    const flat = selector.replace(/:not\(/g, '').replace(/\)/g, '');
    return (flat.match(/\.[a-zA-Z_-]|\[[^\]]+\]|:[a-zA-Z-]+/g) ?? []).length;
}

/**
 * Registers whose hover rule for a control outranks their own pressed
 * rule for it. The press then never paints, because a pointer is always
 * hovering while it presses.
 *
 * This is `fix-12` a third time. The first was a later layer beating a
 * state; the second a variant's ground swallowing its flavours; this one
 * is a longer selector in the SAME layer. grotesk carried a correct
 * `:active` rule with a correct token for a full round and it did
 * nothing: the hover above it had three `:not(.class)` clauses and so
 * five steps of weight against the press's four. Measured before the
 * repair: hovered `rgb(245, 245, 245)`, held down the same.
 *
 * @param {string} source one register
 * @param {Set<string>} base the selectors from pressedInBase
 * @returns {string[]}
 */
export function outrankedPressedStates(source, base) {
    const problems = [];
    for (const selector of base) {
        const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        /** The heaviest hover rule that paints this control's ground. */
        let heaviestHover = -1;
        for (const m of source.matchAll(new RegExp(`(\\[data-theme='[^']+'\\][^{,]*${escaped}:hover[^{,]*)\\s*(?:,[^{]*)?\\{([^}]*)\\}`, 'g'))) {
            // A hover rule that excludes `:active` steps aside by design and
            // never competes — high-contrast writes it that way, and it is
            // the idiom this gate recommends.
            if (m[1].includes(':not(:active)')) continue;
            if (/background\s*:/.test(m[2])) heaviestHover = Math.max(heaviestHover, weight(m[1]));
        }
        if (heaviestHover < 0) continue;

        /** The heaviest pressed rule that paints it back. */
        let heaviestPress = -1;
        for (const m of source.matchAll(new RegExp(`(\\[data-theme='[^']+'\\][^{,]*${escaped}:active[^{,]*)\\s*(?:,[^{]*)?\\{([^}]*)\\}`, 'g'))) {
            if (/background\s*:/.test(m[2])) heaviestPress = Math.max(heaviestPress, weight(m[1]));
        }
        if (heaviestPress < 0) continue; // cancelledPressedStates already owns that case

        if (heaviestPress < heaviestHover) problems.push(`${selector} (hover ${heaviestHover}, press ${heaviestPress})`);
    }
    return problems;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const base = pressedInBase(readFileSync(new URL('components.css', CSS), 'utf8'));
    let failed = 0;
    let checked = 0;
    for (const name of readdirSync(CSS).filter((n) => n.endsWith('-register.css'))) {
        checked++;
        const source = readFileSync(new URL(name, CSS), 'utf8');
        // Phase 7: the third face of fix-12 — a hover that outranks the
        // press in the SAME layer. grotesk carried a correct rule with a
        // correct token that never painted, for a whole round.
        for (const problem of outrankedPressedStates(source, base)) {
            failed++;
            console.error(
                `css/${name}: the hover rule for ${problem} outranks this register's own pressed rule, so the press never paints. ` +
                    `Add \`:not(:active)\` to the hover selector, the way css/high-contrast-register.css does [fix-12].`,
            );
        }
        for (const selector of cancelledPressedStates(source, base)) {
            failed++;
            console.error(
                `css/${name}: a hover background on \`${selector}\` outranks the components layer's ` +
                    `pressed state and nothing replaces it — the button stops reacting to being pressed [fix-12]. ` +
                    `Add \`[data-theme='…'] ${selector}:active:not(:disabled)\` to this register.`,
            );
        }
    }
    // The check has to have something to check. Both of these parse
    // css/components.css with line-anchored patterns, and a prettier
    // reformat, a comma-grouped selector or a nested @media would defeat
    // them — leaving the loop body unentered and this line printing a
    // green nothing. gates/check-register-coverage.mjs guards the same
    // way for the same reason (Phase 7).
    if (base.size === 0) {
        console.error('gate broke: css/components.css defines no pressed states, which cannot be right.');
        process.exit(1);
    }

    if (failed) process.exit(1);
    console.log(`Pressed states: ${checked} registers cancel none of the ${base.size} the components layer defines [fix-12].`);
}
