// Advice, never a gate: does each theme answer the verbs its components
// perform [scope-97]?
//
// For every theme with a `themes/<theme>/signature.json`, and every component
// root `themes/verbs.json` lists (and `css/components.css` still defines),
// this prints whether the theme answers each verb that component performs.
// It runs in `npm run advice` and exits 0 whatever it finds.
//
// What counts as an answer, and it is no cleverer than this:
//
//   hover   a rule whose selector names the root (`.kp-x`, `.kp-x__part`,
//           `.kp-x--variant`) and `:hover`
//   press   the same, with `:active`
//   enter, leave, load, attention
//           a rule whose selector names the root and that sets animation,
//           transition, transform, translate, scale or rotate to something
//           other than `none`, or any rule for it inside @starting-style.
//           CSS cannot say which of the four a motion is for, so one such
//           rule counts for all four of that root.
//
// Looked for, in order: the theme's register (`register`); a recipe row in the
// signature that names the verb and the root and is not open (`signature`,
// the explicit answer for what CSS cannot show, such as an alert asking for
// attention by its plate alone); the package's own components.css, which
// answers the same in every theme (`package`). A recipe row that names the
// root and verb but is open is reported with its proposal. Anything else is a
// line of advice.
//
// What it cannot see: a selector that names two roots counts for both
// (`.kp-toast .kp-button:hover` is a hover for the toast too); a rule that
// exists but is never reached; whether the answer is any good. It reads
// selectors, not meaning.
//
// Usage: node gates/advice-signature.mjs

import { readFileSync } from 'node:fs';
import { readSignature, signedThemes, splitSelectors, styleRules } from './signature.mjs';

const root = new URL('../', import.meta.url);
/** @param {string} path */
const read = (path) => readFileSync(new URL(path, root), 'utf8');

const MOTION = /(?:^|[;{\s])(animation(?:-name)?|transition(?:-property)?|transform|translate|scale|rotate)\s*:\s*([^;]*)/g;

/** @param {string} className */
export const rootOf = (className) => className.split('__')[0].replace(/--.*$/, '');

/** @param {string} selector */
export function rootsInSelector(selector) {
    return new Set([...selector.matchAll(/\.(kp-[a-z0-9_-]+)/g)].map((m) => rootOf(m[1])));
}

/** @param {string} body */
export function setsMotion(body) {
    for (const match of body.matchAll(MOTION)) if (match[2].trim() !== 'none' && match[2].trim() !== '') return true;
    return false;
}

/**
 * The verbs each root answers in one stylesheet.
 * @param {string} css
 * @returns {Map<string, Set<string>>}
 */
export function answersIn(css) {
    /** @type {Map<string, Set<string>>} */
    const found = new Map();
    const add = (/** @type {string} */ name, /** @type {string[]} */ verbs) => {
        if (!found.has(name)) found.set(name, new Set());
        for (const verb of verbs) found.get(name)?.add(verb);
    };
    for (const rule of styleRules(css)) {
        const starting = rule.context.some((c) => c.startsWith('@starting-style'));
        const motion = starting || setsMotion(rule.body);
        for (const selector of rule.selectors) {
            const roots = rootsInSelector(selector);
            for (const name of roots) {
                if (/:hover\b/.test(selector)) add(name, ['hover']);
                if (/:active\b/.test(selector)) add(name, ['press']);
                if (motion) add(name, ['enter', 'leave', 'load', 'attention']);
            }
        }
    }
    return found;
}

/**
 * @typedef {{ component: string, verb: string, source: 'register' | 'signature' | 'package' | 'open' | 'missing', proposal?: string }} Finding
 */

/**
 * Every component verb of one theme, with where its answer comes from.
 * @param {{ registerCss: string, packageCss: string, signature: any, verbs: { components: Record<string, string[]> } }} input
 * @returns {Finding[]}
 */
export function assess({ registerCss, packageCss, signature, verbs }) {
    const register = answersIn(registerCss);
    const pkg = answersIn(packageCss);
    const defined = new Set([...packageCss.matchAll(/\.(kp-[a-z0-9_-]+)/g)].map((m) => rootOf(m[1])));
    /** @type {Finding[]} */
    const findings = [];
    for (const [component, performed] of Object.entries(verbs.components)) {
        if (!defined.has(component)) continue;
        for (const verb of performed) {
            const rows = (signature.recipe ?? []).filter((/** @type {any} */ r) => r.verb === verb && (r.components ?? []).includes(component));
            if (register.get(component)?.has(verb)) findings.push({ component, verb, source: 'register' });
            else if (rows.some((/** @type {any} */ r) => !r.open)) findings.push({ component, verb, source: 'signature' });
            else if (pkg.get(component)?.has(verb)) findings.push({ component, verb, source: 'package' });
            else if (rows.some((/** @type {any} */ r) => r.open))
                findings.push({ component, verb, source: 'open', proposal: rows.find((/** @type {any} */ r) => r.open).proposal });
            else findings.push({ component, verb, source: 'missing' });
        }
    }
    return findings;
}

/**
 * The advice lines for one theme.
 * @param {string} theme
 * @param {Finding[]} findings
 */
export function report(theme, findings) {
    const count = (/** @type {string} */ source) => findings.filter((f) => f.source === source).length;
    const answered = count('register') + count('signature') + count('package');
    const lines = [
        `  ${theme}: ${answered} of ${findings.length} component verbs answered (register ${count('register')}, signature ${count('signature')}, package ${count('package')}); ${findings.length - answered} without an answer of this theme's own`,
    ];
    for (const f of findings) {
        if (f.source === 'open') lines.push(`    - ${f.component} · ${f.verb}: open in signature.json — proposal: ${f.proposal}`);
        if (f.source === 'missing')
            lines.push(
                `    - ${f.component} · ${f.verb}: no rule for .${f.component} answers it in the register or the package, and no recipe row names it`,
            );
    }
    return lines;
}

function main() {
    try {
        const verbs = JSON.parse(read('themes/verbs.json'));
        const packageCss = read('css/components.css');
        const themes = signedThemes();
        console.log(
            `advice · signature [scope-97]: the verbs each component performs (themes/verbs.json), answered per theme with a signature (${themes.length})`,
        );
        for (const theme of themes) {
            const findings = assess({ registerCss: read(`css/${theme}-register.css`), packageCss, signature: readSignature(theme), verbs });
            for (const line of report(theme, findings)) console.log(line);
        }
    } catch (error) {
        console.log(`advice · signature: could not read the signatures (${error instanceof Error ? error.message : String(error)})`);
    }
    process.exit(0);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
