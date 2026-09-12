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

if (import.meta.url === `file://${process.argv[1]}`) {
    const base = pressedInBase(readFileSync(new URL('components.css', CSS), 'utf8'));
    let failed = 0;
    let checked = 0;
    for (const name of readdirSync(CSS).filter((n) => n.endsWith('-register.css'))) {
        checked++;
        for (const selector of cancelledPressedStates(readFileSync(new URL(name, CSS), 'utf8'), base)) {
            failed++;
            console.error(
                `css/${name}: a hover background on \`${selector}\` outranks the components layer's ` +
                    `pressed state and nothing replaces it — the button stops reacting to being pressed [fix-12]. ` +
                    `Add \`[data-theme='…'] ${selector}:active:not(:disabled)\` to this register.`,
            );
        }
    }
    if (failed) process.exit(1);
    console.log(`Pressed states: ${checked} registers cancel none of the ${base.size} the components layer defines [fix-12].`);
}
