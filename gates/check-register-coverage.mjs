// The register answers every component root [TH124, AR37].
//
// "The full works" on a dashboard means the table, the dialog, the toast
// and the tabs are cyberpunk too, not only the hero. The inventory
// measured where the register stood before this round: it reached two of
// the sixty-four component roots (INV-R29). This gate lays the roots
// css/components.css declares beside the roots the register names as a
// subject, and fails on any root that has neither a rule with a
// non-empty body nor an entry in the exception list with its reason —
// KT10's CROSS_REFERENCES shape, because a silent gap is how a gap stays.
//
// The roots are read from css/components.css AT RUN TIME (AR26): a
// hand-kept list of sixty-four names would be the sixty-fifth thing to
// keep honest. "Names as a subject" is the one parser both this gate and
// check-hooks.mjs read (gates/selectors.mjs): `[data-theme='cyberpunk']
// .kp-card` covers `card`; `.kp-card__title` and `.kp-card:hover::after`
// on their own do not — an element or a pseudo-element of a root is not
// the root, and a rule with an empty body covers nothing.
//
// Two kinds of exception, both with a reason and both read by the gate:
//
//   HELPERS   roots with no visual identity of their own — layout and
//             accessibility helpers. Permanent, eight of them.
//   PENDING   roots the register does not reach YET. This list is C2's
//             work order: C2's exit criterion is that it is empty, and
//             the gate refuses an entry that the register in fact covers,
//             so the list cannot outlive the work.
//
// Usage: node gates/check-register-coverage.mjs

import { readFileSync } from 'node:fs';
import process from 'node:process';
import { declaredRoots, rulesOf, subjectRoots } from './selectors.mjs';

const root = new URL('../', import.meta.url);

/** The registers this gate measures, one theme each [TH124]. */
export const REGISTERS = [
    'css/cyberpunk-register.css',
    'css/synthwave-register.css',
    'css/phantom-register.css',
    'css/retro-register.css',
    'css/terminal-register.css',
    'css/brutalism-register.css',
    'css/sepia-register.css',
    'css/solstice-register.css',
    'css/mono-register.css',
    'css/high-contrast-register.css',
    'css/tazhib-register.css',
    'css/shade-dark-register.css',
];
/** The first register, kept for the callers that measure one. */
export const REGISTER = REGISTERS[0];

/** Roots with no visual identity of their own, each with the reason. */
export const HELPERS = {
    'sr-only': 'screen-reader-only text; invisible by definition',
    'skip-link': 'the skip link; a focus target, styled by the base layer alone so every theme agrees where it lands',
    swatch: 'a colour sample; its whole point is to show a token unadorned',
    'grid-wrap': 'a layout wrapper that establishes a container; no surface of its own',
    'table-wrap': 'the scrolling wrapper around a table; the boundary, not the table',
    'tag-list': 'a flex row of tags; the tags carry the identity',
    'theme-group': 'a group in the theme menu; the options carry the identity',
    'col-low': 'a layout modifier for a low column; no surface of its own',
};

/**
 * Parts a register must answer besides the roots, each with the reason
 * [KT14]. The dropdown is a part of the nav root, so a register that
 * styled the bar and left the menu alone passed the root audit — and
 * every one of the nineteen concept demos of 2026-09-08 did exactly
 * that; opening the menu pulled Kenny out of the theme.
 *
 * @type {Record<string, string>}
 */
export const REQUIRED_PARTS = {
    nav__menu: 'the dropdown: a theme that styles the bar and not the menu loses the reader the moment it opens (Kenny, 2026-09-08)',
};

/**
 * The required parts a register leaves unanswered.
 *
 * @param {string} registerCss
 * @param {Record<string, string>} parts
 * @returns {string[]}
 */
export function missingParts(registerCss, parts) {
    /** @type {Set<string>} */
    const answered = new Set();
    for (const [selector, rules] of rulesOf(registerCss)) {
        if (!rules.some((rule) => rule.body.trim() !== '')) continue;
        for (const name of Object.keys(parts)) if (new RegExp(`\\.kp-${name}(?![\\w-])`).test(selector)) answered.add(name);
    }
    return Object.keys(parts).filter((name) => !answered.has(name));
}

/**
 * Roots the register does not reach yet, each naming the milestone that
 * empties the entry. C0 measured them on the 4.0.0 register.
 *
 * @type {Record<string, string>}
 */
export const PENDING = /** @type {Record<string, string>} */ (JSON.parse(readFileSync(new URL('register-pending.json', import.meta.url), 'utf8')));
// The file's own comment key is not a root.
delete PENDING['//'];

/**
 * @param {string} componentsCss
 * @param {string} registerCss
 * @param {Record<string, string>} helpers
 * @param {Record<string, string>} pending
 * @returns {{ declared: string[], covered: string[], uncovered: string[], stale: string[] }}
 */
export function audit(componentsCss, registerCss, helpers, pending) {
    const declared = [...declaredRoots(componentsCss)].sort();
    /** @type {Set<string>} */
    const covered = new Set();
    for (const [selector, rules] of rulesOf(registerCss)) {
        if (!rules.some((rule) => rule.body.trim() !== '')) continue;
        for (const name of subjectRoots(selector)) covered.add(name);
    }
    const uncovered = declared.filter((name) => !covered.has(name) && helpers[name] === undefined && pending[name] === undefined);
    // An exception the register already covers is a list outliving its
    // problem; an exception for a root that does not exist is a typo.
    const stale = [
        ...Object.keys(pending).filter((name) => covered.has(name) || !declared.includes(name)),
        ...Object.keys(helpers).filter((name) => !declared.includes(name)),
    ];
    return { declared, covered: declared.filter((name) => covered.has(name)), uncovered, stale };
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const components = readFileSync(new URL('css/components.css', root), 'utf8');
    let failed = 0;
    for (const REGISTER of REGISTERS) {
        const register = readFileSync(new URL(REGISTER, root), 'utf8');
        const { declared, covered, uncovered, stale } = audit(components, register, HELPERS, PENDING);
        for (const name of uncovered) {
            failed++;
            console.error(`.kp-${name} has no rule in ${REGISTER} and no exception with a reason (HELPERS or gates/register-pending.json).`);
        }
        for (const name of stale) {
            failed++;
            console.error(
                `.kp-${name} is listed as an exception but ${REGISTER} covers it or css/components.css does not declare it — remove the entry.`,
            );
        }
        const missing = missingParts(register, REQUIRED_PARTS);
        for (const name of missing) {
            failed++;
            console.error(`.kp-${name} has no rule in ${REGISTER} — ${REQUIRED_PARTS[name]} [KT14].`);
        }
        if (declared.length === 0) {
            console.error('gate broke: css/components.css declares no roots, which cannot be right.');
            process.exit(1);
        }
        if (uncovered.length === 0 && stale.length === 0 && missing.length === 0) {
            const pendingCount = Object.keys(PENDING).length;
            console.log(
                `Register coverage: ${covered.length} of ${declared.length} roots answered by ${REGISTER}, ${Object.keys(HELPERS).length} helpers excused, ${pendingCount} pending; ${Object.keys(REQUIRED_PARTS).length} required part(s) answered.`,
            );
        }
    }
    if (failed > 0) {
        console.error(`\n${failed} coverage fault(s).`);
        process.exit(1);
    }
}
