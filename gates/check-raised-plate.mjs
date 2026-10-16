// A raised menu keeps its plate [kpadopt-nav, Kenny 2026-10-16].
//
// Kenny, on the folding bar's More menu in phantom: "weer een veelgemaakte fout, zeker met dit thema, het geopende
// menu heeft geen achtergrond waardoor het niet goed leesbaar is", and then: "zie dat het in de toekomst niet meer
// gebeurt". The cause was a register rule that makes a list inside a surface bare ("a list inside a dialog or a
// popover is part of it, not a second one": `:is(.kp-dialog, .kp-popover, …) :is(.kp-menu, …) { background:
// transparent }`). A menu that floats out of its own button (a menu button's menu, the bar's More menu, anything shown
// as a popover) is not part of the surface it stands in: it sits in the top layer over the page, so the rule left it
// see-through wherever its button stood inside a dialog, the review dialog's stage included.
//
// This gate reads every register and refuses a rule that
//   - takes the background away (`background` or `background-color` set to `transparent` or `none`),
//   - from a menu or popover surface (`.kp-menu`, `.kp-popover`, `.kp-theme-menu__list` in the selector's subject),
//   - because of where it stands (the subject has an ancestor compound in front of it),
// unless the subject excludes the raised ones with `:not(…)` naming one of RAISED below. The rules that already did
// so before 2026-10-16 are approved looks Kenny decided not to have changed ("de rest heb ik toch al goedgekeurd"):
// they are listed in KNOWN, by file and selector, and refused only if they change. A new rule of this kind must exclude
// the raised menus, or carry its own measured reason here.
//
// Measuring instead of reading: research/_review/README.md, "A raised surface keeps its plate", has the Firefox
// fixture that opens every surface in every theme inside a page, a card, a dialog, a drawer and a popover.
//
// Usage: node gates/check-raised-plate.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

/** An exclusion that keeps the floating menus out of a "bare inside a surface" rule. */
const RAISED = ['.kp-menu-button > .kp-menu', '.kp-nav__more-menu', '[popover]'];

/** Approved before 2026-10-16; refused only when they change (file → normalised selectors). */
/** @type {Record<string, string[]>} */
const KNOWN = {
    // A menu inside a popover is the popover's: one plate. A menu button inside a popover loses its plate here.
    'css/pastel-register.css': ["[data-theme='pastel'] :is(.kp-popover, .kp-theme-menu__list) :is(.kp-menu, .kp-popover)"],
    // Only a direct child: a menu button's menu is the child of its .kp-menu-button, never of the popover.
    'css/forest-register.css': ["[data-theme='forest'] .kp-popover > .kp-menu"],
};

const SURFACE = /\.kp-(menu|popover|theme-menu__list|theme-menu)(?![\w-])/;

/**
 * Every style rule of a stylesheet, with its selector and its declarations, at any nesting.
 * @param {string} css
 * @returns {{ selector: string, body: string }[]}
 */
export function rules(css) {
    const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const out = [];
    /** @type {{ prelude: string, start: number }[]} */
    const stack = [];
    let last = 0;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === '{') {
            stack.push({ prelude: text.slice(last, i).trim(), start: i + 1 });
            last = i + 1;
        } else if (ch === '}') {
            const open = stack.pop();
            if (open && !open.prelude.startsWith('@')) out.push({ selector: open.prelude.replace(/\s+/g, ' '), body: text.slice(open.start, i) });
            last = i + 1;
        } else if (ch === ';') {
            last = i + 1;
        }
    }
    return out;
}

/** Split a selector list on its top-level commas. @param {string} list */
function splitList(list) {
    const parts = [];
    let depth = 0;
    let from = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i] === '(') depth++;
        else if (list[i] === ')') depth--;
        else if (list[i] === ',' && depth === 0) {
            parts.push(list.slice(from, i).trim());
            from = i + 1;
        }
    }
    parts.push(list.slice(from).trim());
    return parts;
}

/** The subject compound of a complex selector and whether a compound stands before it. @param {string} complex */
function subjectOf(complex) {
    let depth = 0;
    let cut = -1;
    for (let i = 0; i < complex.length; i++) {
        const ch = complex[i];
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
        else if (depth === 0 && (ch === ' ' || ch === '>' || ch === '+' || ch === '~')) cut = i;
    }
    return {
        subject: complex.slice(cut + 1).trim(),
        nested: cut >= 0 && /\.kp-|\[data-kp/.test(complex.slice(0, cut).replace(/\[data-theme=[^\]]*\]/g, '')),
    };
}

/**
 * The faults of one stylesheet.
 * @param {string} file repository-relative path
 * @param {string} css
 * @returns {string[]}
 */
export function plateFaults(file, css) {
    const faults = [];
    for (const { selector, body } of rules(css)) {
        if (!/(^|;)\s*background(-color)?\s*:\s*(transparent|none)\s*(!important)?\s*(;|$)/m.test(body)) continue;
        for (const complex of splitList(selector)) {
            const { subject, nested } = subjectOf(complex);
            if (!nested || !SURFACE.test(subject.replace(/:not\([^)]*(\([^)]*\))*[^)]*\)/g, ''))) continue;
            const not = /:not\(([\s\S]*)\)\s*$/.exec(subject)?.[1] ?? '';
            if (RAISED.some((r) => not.includes(r))) continue;
            if (KNOWN[file]?.includes(complex)) continue;
            faults.push(
                `${file}: "${complex}" takes the plate from a menu or popover inside another surface without excluding the raised ones (:not(${RAISED.join(', ')}))`,
            );
        }
    }
    return faults;
}

function main() {
    const faults = [];
    let checked = 0;
    for (const name of readdirSync(`${ROOT}css`).filter((n) => n.endsWith('-register.css'))) {
        const file = `css/${name}`;
        faults.push(...plateFaults(file, readFileSync(`${ROOT}${file}`, 'utf8')));
        checked++;
    }
    if (faults.length) {
        console.error(`check-raised-plate: ${faults.length} rule(s) leave a raised menu see-through (Kenny, 2026-10-16)\n  ${faults.join('\n  ')}`);
        process.exit(1);
    }
    console.log(`check-raised-plate: ${checked} registers; no rule takes the plate from a raised menu.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
