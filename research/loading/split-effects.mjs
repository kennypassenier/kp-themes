// Strategy (c), the effects half: js/effects.js cut into a core and one module per hook.
//
// attachEffects() is one 1300-line closure. Its hooks — the headline
// (decipher and the glitch burst), the emphasis marks, the rule, the
// count, the caret, the pointer bus, the measurement frame, the marquee
// and the arrival — are each one `const x = () => { ... }` inside it,
// sharing the closure's helpers (later, announce, seen, ...) and four
// mutable variables (detached, io, ioHeadline, pending).
//
// This script moves each hook's text into research/loading/out/c/js/
// effects-hooks/<hook>.js as `install(ctx)`, and leaves a core that
// builds `ctx` from the closure's own helpers and `import()`s a hook the
// first time an element or a theme knob asks for it. The four mutable
// variables become one `state` object, so every module writes the same
// binding. The text of each hook is js/effects.js's own, line for line —
// which is the point: the sizes measured are the sizes of the code as it
// is, not of a rewrite.
//
// It is a prototype cut by markers in the source; the real thing would be
// a refactor, and the README says what that costs.
//
// Usage: node research/loading/split-effects.mjs

import { relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OUT, read, ROOT, write } from './measure.mjs';

const SOURCE = 'js/effects.js';
/** The closure's mutable variables, made one object so every module shares them. */
const STATE_VARS = ['detached', 'io', 'ioHeadline', 'pending'];
/** Each hook's module, keyed by name. */
export const HOOK_NAMES = ['headline', 'emphasis', 'rule', 'count', 'caret', 'pointer', 'measure', 'marquee', 'arrival'];

const CORE_DIR = new URL('c/js/', OUT);
const HOOKS_DIR = new URL('c/js/effects-hooks/', OUT);

/** @param {string} s */
const escapeRe = (s) => s.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&');

/**
 * The text with its comments and quoted strings blanked, so a word in
 * prose is not read as a reference. Template literals stay: a
 * `[${HOOKS.marquee}]` inside one is a reference.
 *
 * @param {string} text
 */
const code = (text) =>
    text
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '')
        .replace(/'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"/g, '""');

/** @param {string} text */
const stateful = (text) =>
    text
        .replace(new RegExp(`^    let (?:${STATE_VARS.join('|')}) = .*\\n`, 'gm'), '')
        .replace(new RegExp(`\\b(${STATE_VARS.join('|')})\\b`, 'g'), 'state.$1');

/** The standalone calls at the end of a section: the core makes them, lazily. @param {string} text */
const stripCalls = (text) => text.replace(/^    (caret|pointerBus|measure|marquee|arrival)\(\);\n?/gm, '');

/** @param {string} text @param {string} from @param {string} to */
function replaceOnce(text, from, to) {
    const count = text.split(from).length - 1;
    if (count !== 1) throw new Error(`expected exactly one "${from}", found ${count}`);
    return text.replace(from, to);
}

export function splitEffects() {
    const src = read(SOURCE);
    const lines = src.split('\n');
    /** @param {RegExp} re @param {number} [from] */
    const find = (re, from = 0) => {
        const i = lines.findIndex((l, k) => k >= from && re.test(l));
        if (i < 0) throw new Error(`marker not found in ${SOURCE}: ${re}`);
        return i;
    };
    const iAttach = find(/^export function attachEffects\(/);
    const iHeadline = find(/^    \/\/ ── The headline/);
    const iEmphasis = find(/^    \/\/ ── Emphasis/);
    const iRule = find(/^    \/\/ ── The rule/);
    const iDispatch = find(/^    \/\/ ── Dispatch/);
    const iCountDoc = find(/^    \/\*\*$/, iDispatch);
    const iScanDoc = find(/^    \/\*\* @param \{ParentNode \| Element\} scope \*\//, iCountDoc);
    const iCaret = find(/^    \/\/ ── The caret/);
    const iMeasure = find(/^    \/\/ ── The measurement/);
    const iMeasureFn = find(/^    const measure = /, iMeasure);
    const iMarquee = find(/^    \/\/ ── The marquee/);
    const iArrival = find(/^    \/\/ ── The arrival/);
    const iReturn = find(/^    return \{$/, iArrival);
    /** @param {number} a @param {number} b */
    const slice = (a, b) => lines.slice(a, b).join('\n');

    const moduleTop = slice(0, iAttach);
    const prologue = slice(iAttach, iHeadline);
    /** @type {Record<string, { text: string, from: number, to: number }>} */
    const sections = {
        headline: { text: slice(iHeadline, iEmphasis), from: iHeadline, to: iEmphasis },
        emphasis: { text: slice(iEmphasis, iRule), from: iEmphasis, to: iRule },
        rule: { text: slice(iRule, iDispatch), from: iRule, to: iDispatch },
        count: { text: slice(iCountDoc, iScanDoc), from: iCountDoc, to: iScanDoc },
        caret: { text: slice(iCaret, iMeasure), from: iCaret, to: iMeasure },
        pointer: { text: slice(iMeasure, iMeasureFn), from: iMeasure, to: iMeasureFn },
        measure: { text: slice(iMeasureFn, iMarquee), from: iMeasureFn, to: iMarquee },
        marquee: { text: slice(iMarquee, iArrival), from: iMarquee, to: iArrival },
        arrival: { text: slice(iArrival, iReturn), from: iArrival, to: iReturn },
    };
    const dispatchA = slice(iDispatch, iCountDoc);
    const dispatchB = slice(iScanDoc, iCaret);
    const epilogue = slice(iReturn, lines.length);

    // A hook that declared one of the four shared variables locally would
    // be rewritten into nonsense; none does today, and this says so.
    for (const [name, s] of Object.entries(sections)) {
        const local = new RegExp(`^\\s+(?:let|const) (?:${STATE_VARS.join('|')})\\b`, 'm').exec(s.text);
        if (local) throw new Error(`${name} declares a state variable locally: ${local[0].trim()}`);
    }

    // The names a hook may reach through ctx: everything the module and
    // the closure's prologue declare, plus the two parameters.
    const moduleNames = [...moduleTop.matchAll(/^(?:export )?(?:const|let|function) ([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]);
    const importNames = [...moduleTop.matchAll(/^import \{([^}]+)\} from/gm)].flatMap((m) =>
        m[1]
            .split(',')
            .map(
                (s) =>
                    s
                        .trim()
                        .split(/\s+as\s+/)
                        .pop() ?? '',
            )
            .filter(Boolean),
    );
    const prologueNames = [...prologue.matchAll(/^    (?:const|let) ([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]).filter((n) => !STATE_VARS.includes(n));
    const coreNames = ['startOne', 'scan', 'onPreference', 'run', 'use'];
    const shared = [...new Set(['state', 'root', 'options', ...prologueNames, ...moduleNames, ...importNames, ...coreNames])];

    // Every `const x = ` a section declares is what its module returns;
    // a section that reaches for another section's declaration would
    // break the split, so that is checked and refused.
    /** @type {Record<string, string[]>} */
    const declared = {};
    for (const [name, s] of Object.entries(sections)) declared[name] = [...s.text.matchAll(/^    const ([A-Za-z_$][\w$]*) = /gm)].map((m) => m[1]);
    for (const [name, s] of Object.entries(sections)) {
        for (const [other, names] of Object.entries(declared)) {
            if (other === name) continue;
            for (const n of names) {
                // A nested declaration of the same name (headline's own
                // `const caret` span, deeper in) shadows, and is not a reference.
                const own = code(stripCalls(s.text));
                if (new RegExp(`^\\s+(?:const|let) ${escapeRe(n)}\\b`, 'm').test(own)) continue;
                if (new RegExp(`\\b${escapeRe(n)}\\b`).test(own)) throw new Error(`${name} refers to ${other}'s ${n}; the split needs a seam there`);
            }
        }
    }

    const written = [];
    for (const [name, s] of Object.entries(sections)) {
        const body = stateful(stripCalls(s.text)).trimEnd();
        const used = shared.filter((n) => new RegExp(`\\b${escapeRe(n)}\\b`).test(code(body)));
        const text = `// GENERATED by research/loading/split-effects.mjs from js/effects.js lines ${s.from + 1}–${s.to} — do not edit.
// The ${name} hook of attachEffects in its own module, so a page that never
// asks for it never downloads it. What it shared with the rest of the
// closure arrives through \`ctx\`, built by effects-core.js.

/** @param {Record<string, any>} ctx */
export function install(ctx) {
    const { ${used.join(', ')} } = ctx;
${body}
    return { ${declared[name].join(', ')} };
}
`;
        written.push(write(new URL(`${name}.js`, HOOKS_DIR), text));
    }

    // The core: the module's constants and exports as they are, with the
    // import paths pointed back at js/, then attachEffects with the hooks
    // replaced by lazy loads.
    const jsDir = relative(fileURLToPath(CORE_DIR), fileURLToPath(new URL('js/', ROOT))).replaceAll('\\', '/');
    const top = moduleTop.replace(/from '\.\/([^']+)'/g, (_, f) => `from '${jsDir}/${f}'`);

    let head = stateful(prologue);
    head = replaceOnce(
        head,
        "    if (manageRoot) html.setAttribute(ROOT_ATTRIBUTE, '');",
        "    if (manageRoot) html.setAttribute(ROOT_ATTRIBUTE, '');\n    /** The closure's four mutable variables as one object, so a hook module and the core write the same binding. */\n    const state = { detached: false, io: null, ioHeadline: null, pending: 0 };",
    );

    const loaders = HOOK_NAMES.map((n) => `        ${n}: () => import('./effects-hooks/${n}.js'),`).join('\n');
    const lazy = `
    // ── Lazy hooks [research/loading] ──────────────────────────────────
    // A hook's module is fetched the first time something asks for it,
    // installed once, and every call after that reuses the promise.
    /** @type {Record<string, () => Promise<{ install: (ctx: Record<string, any>) => Record<string, any> }>>} */
    const loaders = {
${loaders}
    };
    /** @type {Record<string, Promise<Record<string, any>>>} */
    const installed = {};
    /** @param {string} name */
    const use = (name) => (installed[name] ??= loaders[name]().then((m) => m.install(ctx)));
    // \`pending\` is held up while the module is on its way, so the done
    // attribute waits for reveals that have not started yet.
    /** @param {string} name @param {(hook: Record<string, any>) => void} fn */
    const run = (name, fn) => {
        state.pending++;
        use(name)
            .then((hook) => {
                if (!state.detached) fn(hook);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                state.pending--;
                done();
            });
    };
`;

    let a = stateful(dispatchA);
    a = replaceOnce(a, "if (reveal === 'headline') headline(el);", "if (reveal === 'headline') run('headline', (hook) => hook.headline(el));");
    a = replaceOnce(
        a,
        "else if (reveal === 'emphasis') emphasis(el);",
        "else if (reveal === 'emphasis') run('emphasis', (hook) => hook.emphasis(el));",
    );
    a = replaceOnce(a, 'else rule(el);', "else run('rule', (hook) => hook.rule(el));");

    let b = stateful(dispatchB);
    b = replaceOnce(b, 'countUp(scope);', "run('count', (hook) => hook.countUp(scope));");
    b = replaceOnce(b, 'countUp(el);', "run('count', (hook) => hook.countUp(el));");
    b = replaceOnce(
        b,
        'looseMarks(scope);',
        "if ((scope instanceof Element && scope.matches('mark')) || scope.querySelector('mark')) run('emphasis', (hook) => hook.looseMarks(scope));",
    );
    b = replaceOnce(b, '    scan(root);\n', '');

    const ctx = `
    const ctx = { ${shared.join(', ')} };
    scan(root);

    // The theme-driven hooks: fetched only when the active theme's root
    // knob asks, or the page carries the element. js/effects.js calls all
    // five and lets each decide; here the deciding happens first.
    /** @param {string} name */
    const knobText = (name) => (rootStyle ? rootStyle.getPropertyValue(name).trim() : '');
    if (knobText(CARET_KNOB) === 'block' && root.querySelector('input.kp-field__input')) run('caret', (hook) => hook.caret());
    if (knobText(POINTER_KNOB) === 'track') run('pointer', (hook) => hook.pointerBus());
    if (knobText(MEASURE_KNOB) === 'live') run('measure', (hook) => hook.measure());
    if (root.querySelector(\`[\${HOOKS.marquee}]\`)) run('marquee', (hook) => hook.marquee());
    if (knobText(ROUTINES.arrival) !== '') run('arrival', (hook) => hook.arrival());
`;

    const core = `// GENERATED by research/loading/split-effects.mjs from js/effects.js — do not edit.
// The core of js/effects.js: every constant and export as it is, and an
// attachEffects that fetches a hook's module the first time it is needed
// (see research/loading/README.md, strategy c).

${top.trimEnd()}
${head.trimEnd()}
${lazy.trimEnd()}
${a.trimEnd()}
${b.trimEnd()}
${ctx.trimEnd()}
${stateful(epilogue).trimEnd()}
`;
    written.push(write(new URL('effects-core.js', CORE_DIR), core));
    return { written, sections: Object.fromEntries(Object.entries(sections).map(([n, s]) => [n, { from: s.from + 1, to: s.to }])), shared };
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const r = splitEffects();
    for (const f of r.written) console.log(f);
    console.log(JSON.stringify(r.sections));
}
