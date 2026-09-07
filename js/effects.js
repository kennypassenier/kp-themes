// The effects module [TH125, AR34, AR35, AR43, AR44].
//
// One module for every effect a theme answers a hook with: the reveal of
// a headline, an emphasis that clears itself, a rule that draws in. The
// consumer writes MEANING into the HTML — `data-kp-reveal="headline"`,
// `<mark>`, `data-kp-divider` — and the active theme decides what that
// looks like [S45]. This module only ever toggles the state classes below;
// the register decides what a state class looks like, and a theme with no
// rule for it has answered quietly.
//
// Pure [KT6]: importing this file does nothing. `js/auto.js` calls
// attachEffects() like the other eighteen attach functions, and a React
// island wraps the same function. Everything the module starts, `detach`
// stops; nothing survives it.
//
// C0 (2026-09-07): the walking skeleton. attachEffects() attaches nothing
// yet — the observers arrive at C3 — but the contract values, the timing
// table and the shape of the handle are the ones the gates already read,
// so a gate that fires red today fires red on the real thing later.

/**
 * The hook vocabulary [AR35]. Contract values: a consumer writes these
 * into markup, and a theme answers them in `themes/hooks.json`. Every
 * value names what an element IS, never what one theme does with it — a
 * "tear" is a horizon under synthwave, so the attribute stays bare.
 */
export const HOOKS = Object.freeze({
    /** `hero` or `app`: which ground a section stands on [TH116]. */
    surface: 'data-kp-surface',
    /** `headline`, `emphasis` or `rule`: what a revealed element is. */
    reveal: 'data-kp-reveal',
    /** The element a container's reveal listens to instead of the load. */
    revealTrigger: 'data-kp-reveal-trigger',
    /** `load`: run this reveal on every load, not once per session [AR44]. */
    revealEvery: 'data-kp-reveal-every',
    /** A section transition. Bare, or `section`. */
    divider: 'data-kp-divider',
    /** The label a register may draw with `content: attr()` [KT5]. */
    label: 'data-kp-label',
    /** `start` or `end`: which side of the screen the navbar sits on [TH117]. */
    navSide: 'data-kp-nav-side',
});

/** The values `data-kp-surface` accepts. */
export const SURFACES = Object.freeze(['hero', 'app']);

/** The values `data-kp-reveal` accepts. */
export const REVEALS = Object.freeze(['headline', 'emphasis', 'rule']);

/**
 * The state classes the module toggles [AR35]. Contract values: a
 * consumer will select on them the day they exist, so they never change
 * inside a major.
 */
export const STATE = Object.freeze({
    /** The element has entered the viewport (or the page has loaded). */
    in: 'is-in',
    /** An emphasis has cleared its redaction. */
    cleared: 'is-cleared',
    /** A headline has finished deciphering. */
    deciphered: 'is-deciphered',
    /** A one-shot glitch is running. */
    glitching: 'is-glitching',
});

/**
 * The root attribute that arms the start states [AR34]. Set before first
 * paint by the head-script slot, so the register can key a start state
 * on `[data-kp-effects] [data-kp-reveal]:not(.is-in)` and a page without
 * the script keeps the rest state (drawn, cleared, legible).
 */
export const ROOT_ATTRIBUTE = 'data-kp-effects';

/** Set on an element the module has started, so a second attach skips it. */
export const DONE_ATTRIBUTE = 'data-kp-effects-done';

/**
 * Fired once per page, on `document`, the first time a hook carries a
 * value the module does not know [AR44]. `detail.attribute`,
 * `detail.value` and `detail.accepted` say which and what would work.
 * The module never throws into a page.
 */
export const UNKNOWN_EVENT = 'kp-effect-unknown';

/**
 * The DI5 timing table [TH129, AR40]. One row per effect and per register
 * keyframe: how long it runs, how often, which property moves, and the
 * luminance steps it makes where the property is opacity. The gate reads
 * this table beside the register's keyframes and fails when a keyframe
 * has no row; it computes the flash rate and reports it, and per S42 it
 * corrects nothing.
 *
 * `cycles` is `Infinity` for a loop, which is what the report is for.
 *
 * @type {Readonly<Record<string, Readonly<{ durationMs: number, cycles: number, property: string, luminanceSteps: readonly number[] }>>>}
 */
export const TIMINGS = Object.freeze({
    // The register's own keyframes, as shipped in 4.0.0. Their opacity
    // stops are the ones gates/check-motion.mjs already parses; listing
    // them here is what lets the table pass and the keyframe parse agree.
    'fx-flicker': { durationMs: 2200, cycles: 1, property: 'opacity', luminanceSteps: [1, 0.35, 1, 0.6, 1, 0.93, 1, 1] },
    'fx-pulse': { durationMs: 2600, cycles: Infinity, property: 'opacity', luminanceSteps: [0.65] },
    'fx-glitch-a': { durationMs: 340, cycles: 1, property: 'transform', luminanceSteps: [] },
    'fx-glitch-b': { durationMs: 340, cycles: 1, property: 'transform', luminanceSteps: [] },
    'fx-rgb-split': { durationMs: 170, cycles: 1, property: 'filter', luminanceSteps: [] },
    'fx-cellflash': { durationMs: 200, cycles: 1, property: 'color', luminanceSteps: [] },
    // The base layer's and the components' keyframes. Where a duration is
    // a token (`var(--fx-duration)`), the row carries cyberpunk's 140ms,
    // the shortest any theme declares, so the rate is the worst case.
    'kp-slide-in': { durationMs: 140, cycles: 1, property: 'transform', luminanceSteps: [] },
    'kp-rule-in': { durationMs: 420, cycles: 1, property: 'transform', luminanceSteps: [] },
    'kp-settle': { durationMs: 140, cycles: 1, property: 'transform', luminanceSteps: [] },
    'kp-blink': { durationMs: 1000, cycles: Infinity, property: 'opacity', luminanceSteps: [1, 1, 0, 0] },
    'kp-drift': { durationMs: 40000, cycles: Infinity, property: 'background-position', luminanceSteps: [] },
    'kp-ember': { durationMs: 840, cycles: 1, property: 'box-shadow', luminanceSteps: [] },
    'kp-spin': { durationMs: 900, cycles: Infinity, property: 'transform', luminanceSteps: [] },
    'kp-pulse': { durationMs: 1600, cycles: Infinity, property: 'opacity', luminanceSteps: [1, 0.6, 1] },
});

/**
 * @typedef {object} EffectsOptions
 * @property {boolean} [reduceMotion] override the media query, for tests
 * @property {string} [theme] override the active theme, for tests
 * @property {number} [threshold] IntersectionObserver ratio (default 0.6)
 * @property {number} [cps] decipher characters per second (default 26)
 * @property {number} [stagger] emphasis stagger in ms (default 260)
 * @property {number} [delay] classified delay in ms (default 1500)
 */

/**
 * @typedef {object} EffectsHandle
 * @property {() => void} detach stop everything the module started; safe to call twice
 * @property {(element: Element) => void} observe start an element rendered after attach [AR34]
 */

/**
 * Attach the effects under `root` and return a handle.
 *
 * C0: attaches nothing. The handle is the real shape so a caller written
 * today keeps working when C3 fills it in.
 *
 * @param {ParentNode} [root]
 * @param {EffectsOptions} [options]
 * @returns {EffectsHandle}
 */
export function attachEffects(root = document, options = {}) {
    void options;
    let detached = false;
    // C0 ships the contract and one behaviour: an element that names a
    // surface or a reveal the vocabulary does not know is reported [AR44],
    // so a typo in a consumer's markup is heard rather than quietly
    // unstyled. The reveals themselves arrive at C3.
    /** @param {Element} element */
    const check = (element) => {
        if (detached) return;
        /** @type {[string, readonly string[]][]} */
        const pairs = [
            [HOOKS.surface, SURFACES],
            [HOOKS.reveal, REVEALS],
        ];
        for (const [hook, known] of pairs) {
            const value = element.getAttribute(hook);
            if (value === null || known.includes(value)) continue;
            element.dispatchEvent(new CustomEvent(UNKNOWN_EVENT, { bubbles: true, detail: { hook, value } }));
        }
    };
    for (const element of root.querySelectorAll(`[${HOOKS.surface}], [${HOOKS.reveal}]`)) check(element);
    return {
        detach() {
            if (detached) return;
            detached = true;
        },
        observe(element) {
            check(element);
        },
    };
}
