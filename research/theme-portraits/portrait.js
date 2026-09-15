// The motion section of a theme portrait [scope-97]: the live copies, their
// replay buttons and the reduced-motion switch. Everything a replay shows is
// the stylesheets' own doing; this file only decides when.
//
//   hover, press   The register's `:hover` and `:active` rules, read from the
//                  loaded stylesheets and written once more with the state
//                  swapped for `[data-pt-hover]` / `[data-pt-press]`, in the
//                  same layer and under the same conditions. A replay puts the
//                  attribute on the copy's buttons for a moment. No value is
//                  typed here: a rule that changes in the register changes the
//                  replay with it.
//   reveal         The copy is stamped again and attached with js/effects.js,
//                  as catalogue/page-effects.html does; a dossier then has its
//                  trigger pressed, so the redactions leave.
//   menu           The navbar is stamped again (its load animation plays) and
//                  its dropdown is opened, then closed.
//   restamp        The copy is stamped again, so its CSS animations start over.
//
// Reduced motion: the page cannot change the reader's system setting, so the
// switch rewrites the stylesheets' own guards instead — every
// `@media (prefers-reduced-motion: no-preference)` block is turned off and
// every `(prefers-reduced-motion: reduce)` block on, and reveals are attached
// with `reduceMotion`. What remains is what a reader with the setting sees.
// When the system already asks for less motion, the switch starts on.
import { attachEffects, MEMO_PREFIX, REVEALS } from '../../js/effects.js';

const NO_PREFERENCE = /prefers-reduced-motion:\s*no-preference/;
const REDUCE = /prefers-reduced-motion:\s*reduce/;
const STATES = /** @type {const} */ ([
    [/:hover\b/g, '[data-pt-hover]'],
    [/:active\b/g, '[data-pt-press]'],
]);

const system = window.matchMedia('(prefers-reduced-motion: reduce)');
let reduced = system.matches;

/** @type {WeakMap<CSSMediaRule, string>} */
const originalMedia = new WeakMap();

/** Every stylesheet the page loaded, imports included, except this file's own states. */
function sheets() {
    /** @type {CSSStyleSheet[]} */
    const found = [];
    const visit = (/** @type {CSSStyleSheet} */ sheet) => {
        if (sheet.ownerNode instanceof Element && sheet.ownerNode.id === 'pt-states') return;
        found.push(sheet);
        let rules;
        try {
            rules = sheet.cssRules;
        } catch {
            return;
        }
        for (const rule of rules) if (rule instanceof CSSImportRule && rule.styleSheet) visit(rule.styleSheet);
    };
    for (const sheet of document.styleSheets) visit(sheet);
    return found;
}

/**
 * Walk every rule with the at-rules around it.
 * @param {(rule: CSSRule, wrappers: string[]) => void} visit
 */
function walk(visit) {
    const descend = (/** @type {CSSRuleList} */ rules, /** @type {string[]} */ wrappers) => {
        for (const rule of rules) {
            visit(rule, wrappers);
            if (rule instanceof CSSMediaRule) descend(rule.cssRules, [...wrappers, `@media ${rule.media.mediaText}`]);
            else if (typeof CSSLayerBlockRule !== 'undefined' && rule instanceof CSSLayerBlockRule)
                descend(rule.cssRules, [...wrappers, `@layer ${rule.name}`]);
            else if (rule instanceof CSSSupportsRule) descend(rule.cssRules, [...wrappers, `@supports ${rule.conditionText}`]);
            else if (typeof CSSContainerRule !== 'undefined' && rule instanceof CSSContainerRule)
                descend(rule.cssRules, [...wrappers, `@container ${rule.conditionText}`]);
        }
    };
    for (const sheet of sheets()) {
        try {
            descend(sheet.cssRules, []);
        } catch {
            /* a sheet from elsewhere keeps its rules to itself */
        }
    }
}

/** Turn the stylesheets' motion guards to match `reduced`. */
function applyGuards() {
    walk((rule) => {
        if (!(rule instanceof CSSMediaRule)) return;
        if (!originalMedia.has(rule)) originalMedia.set(rule, rule.media.mediaText);
        const original = /** @type {string} */ (originalMedia.get(rule));
        let next = original;
        if (reduced && NO_PREFERENCE.test(original)) next = 'not all';
        if (reduced && REDUCE.test(original)) next = 'all';
        if (rule.media.mediaText !== next) rule.media.mediaText = next;
    });
    document.documentElement.toggleAttribute('data-pt-reduced', reduced);
}

/** Write the `:hover` and `:active` rules once more, keyed on attributes. */
function buildStates() {
    /** @type {string[]} */
    const out = [];
    walk((rule, wrappers) => {
        if (!(rule instanceof CSSStyleRule)) return;
        const selector = rule.selectorText;
        if (!/:hover\b|:active\b/.test(selector) || !/\.kp-/.test(selector)) return;
        let swapped = selector;
        for (const [pattern, attribute] of STATES) swapped = swapped.replace(pattern, attribute);
        const body = `${swapped} { ${rule.style.cssText} }`;
        out.push(wrappers.reduceRight((inner, wrapper) => `${wrapper} { ${inner} }`, body));
    });
    let style = document.getElementById('pt-states');
    if (!style) {
        style = document.createElement('style');
        style.id = 'pt-states';
        document.head.append(style);
    }
    style.textContent = out.join('\n');
}

/* --------------------------------------------------------------- stamps */

/** @type {WeakMap<Element, { detach(): void }>} */
const handles = new WeakMap();
/** @type {WeakMap<Element, ReturnType<typeof setTimeout>[]>} */
const timers = new WeakMap();

/** A live copy plays every time it is stamped, not once per session (catalogue/demos.js). */
function forgetReveals() {
    try {
        const reveal = new RegExp(`^${MEMO_PREFIX}.*?:(${REVEALS.join('|')}):`);
        for (const key of Object.keys(sessionStorage)) if (reveal.test(key)) sessionStorage.removeItem(key);
    } catch {
        /* no storage: nothing is remembered, so everything plays */
    }
}

/** @param {Element} host @param {() => void} fn @param {number} ms */
function later(host, fn, ms) {
    const list = timers.get(host) ?? [];
    list.push(setTimeout(fn, ms));
    timers.set(host, list);
}

/** @param {Element} host */
function stamp(host) {
    for (const timer of timers.get(host) ?? []) clearTimeout(timer);
    timers.set(host, []);
    handles.get(host)?.detach();
    handles.delete(host);
    host.querySelector(':scope > [data-pt-copy]')?.remove();
    const template = host.querySelector(':scope > template');
    if (!(template instanceof HTMLTemplateElement)) return null;
    const copy = document.createElement('div');
    copy.setAttribute('data-pt-copy', '');
    copy.append(template.content.cloneNode(true));
    template.after(copy);
    return copy;
}

/** @param {Element} host @param {boolean} play */
function run(host, play) {
    const kind = host.getAttribute('data-pt-kind');
    const copy = stamp(host);
    if (!copy) return;
    const buttons = () => copy.querySelectorAll('.kp-button, .kp-icon-button');
    if (kind === 'reveal') {
        forgetReveals();
        handles.set(host, attachEffects(copy, { manageRoot: false, reduceMotion: reduced }));
        const triggers = copy.querySelectorAll('[data-kp-reveal-trigger]');
        if (play && triggers.length) later(host, () => triggers.forEach((t) => /** @type {HTMLElement} */ (t).click()), 600);
    }
    if (!play) return;
    if (kind === 'hover') {
        requestAnimationFrame(() => buttons().forEach((b) => b.setAttribute('data-pt-hover', '')));
        later(host, () => buttons().forEach((b) => b.removeAttribute('data-pt-hover')), 1600);
    }
    if (kind === 'press') {
        requestAnimationFrame(() => buttons().forEach((b) => b.setAttribute('data-pt-press', '')));
        later(host, () => buttons().forEach((b) => b.removeAttribute('data-pt-press')), 700);
    }
    if (kind === 'menu') {
        const item = copy.querySelector('[data-pt-menu]');
        later(host, () => item?.setAttribute('data-kp-nav-menu-open', ''), 700);
        later(host, () => item?.removeAttribute('data-kp-nav-menu-open'), 2600);
    }
}

function label() {
    for (const button of document.querySelectorAll('[data-pt-reduce]')) {
        button.setAttribute('aria-pressed', String(reduced));
        button.textContent = `Reduced motion: ${reduced ? 'on' : 'off'}`;
    }
}

function setReduced(/** @type {boolean} */ next) {
    reduced = next;
    applyGuards();
    buildStates();
    label();
    for (const host of document.querySelectorAll('[data-pt-live]')) run(host, false);
}

document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('[data-pt-reduce]')) {
        setReduced(!reduced);
        return;
    }
    const replay = target?.closest('[data-pt-replay]');
    const host = replay?.closest('.pt-live')?.querySelector('[data-pt-live]');
    if (host) run(host, true);
});

system.addEventListener('change', () => setReduced(system.matches));

applyGuards();
buildStates();
label();
for (const host of document.querySelectorAll('[data-pt-live]')) run(host, false);
document.documentElement.setAttribute('data-pt-ready', '');
