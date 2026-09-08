export declare const HOOKS: Readonly<{
    surface: "data-kp-surface";
    reveal: "data-kp-reveal";
    revealTrigger: "data-kp-reveal-trigger";
    revealEvery: "data-kp-reveal-every";
    divider: "data-kp-divider";
    label: "data-kp-label";
    navSide: "data-kp-nav-side";
}>;
/** The surfaces a section can stand on [TH116]. */
export declare const SURFACES: readonly string[];
/** What an element can be revealed as [TH119, TH120, TH122]. */
export declare const REVEALS: readonly string[];
/**
 * The state classes this module toggles, and nothing else. Contract
 * values: a consumer may select on them, a register does.
 */
export declare const STATE: Readonly<{
    in: "is-in";
    cleared: "is-cleared";
    deciphered: "is-deciphered";
    glitching: "is-glitching";
    noise: "is-noise";
    tracking: "is-tracking";
    shine: "is-shine";
    off: "is-off";
    words: "is-words";
    dissolving: "is-dissolving";
    typing: "is-typing";
}>;
/**
 * The custom properties a theme declares to say which reveals it performs
 * [S45]: `--kp-reveal-headline: decipher`, `--kp-reveal-emphasis:
 * classified`, `--kp-reveal-rule: draw`. Absent or empty means quiet.
 */
export declare const ROUTINES: Readonly<{
    headline: "--kp-reveal-headline";
    emphasis: "--kp-reveal-emphasis";
    rule: "--kp-reveal-rule";
    arrival: "--kp-arrival";
}>;
/** The class names of the arrival overlay the module builds. */
export declare const ARRIVAL: Readonly<{
    root: "kp-boot";
    line: "kp-boot__line";
    skip: "kp-boot__skip";
}>;
/** The knob a theme sets to put a block cursor inside its fields [TM2, R6-Q7]: `--kp-caret: block`. */
export declare const CARET_KNOB = "--kp-caret";
/** Set on the root before first paint; the register keys its start states on it [AR34]. */
export declare const ROOT_ATTRIBUTE = "data-kp-effects";
/** Set on the root once the reveals of a load have run. */
export declare const DONE_ATTRIBUTE = "data-kp-effects-done";
/** The copy of a headline the register's slice pseudo-elements read. */
export declare const TEXT_ATTRIBUTE = "data-kp-text";
/**
 * Dispatched once per page on an element that names a surface or a
 * reveal the vocabulary does not know, bubbling. detail:
 * `{ hook, value, accepted }`. Never thrown [AR44].
 */
export declare const UNKNOWN_EVENT = "kp-effect-unknown";
/**
 * Dispatched on an element when its reveal has reached its rest state,
 * bubbling. detail: `{ reveal, routine, skipped }` — `skipped` says the
 * element went straight to rest (reduced motion, a quiet theme, or seen
 * this session) rather than through the motion.
 */
export declare const REVEAL_EVENT = "kp-reveal";
/** The sessionStorage key prefix of the once-per-session memo [AR44, M4]. */
export declare const MEMO_PREFIX = "kp-effects:";
/** The glyphs a headline deciphers through [AR40]: no block glyphs. */
export declare const GLYPHS = "01<>/\\|=+*#%@&$?!ZXKQ";
/**
 * DI5 for every animation the package runs [TH129, T20, AR40].
 *
 * One row per keyframe name: how long, how often, what moves, and the
 * opacity at each keyframe step (the luminance the gate rates). The
 * register's keyframes carry no comment of their own; this is the table
 * and gates/check-motion.mjs refuses a keyframe without a row or a row
 * whose steps drift from its keyframe. Rates are reported, never
 * corrected (S42).
 *
 * @type {Readonly<Record<string, { durationMs: number, cycles: number, property: string, luminanceSteps: number[] }>>}
 */
export declare const TIMINGS: Readonly<Record<string, {
    durationMs: number;
    cycles: number;
    property: string;
    luminanceSteps: number[];
}>>;
export type EffectsOptions = {
    /**
     * override the media query (a test, or a consumer's own switch)
     */
    reduceMotion?: boolean;
    /**
     * IntersectionObserver ratio for the rule (default: `--kp-reveal-threshold`, 0.6)
     */
    threshold?: number;
    /**
     * decipher characters per second (default: `--kp-decipher-cps`, 26)
     */
    cps?: number;
    /**
     * ms between one mark clearing and the next (default: `--kp-reveal-stagger`, 260)
     */
    stagger?: number;
    /**
     * ms before the first mark clears on load (default: `--kp-classified-delay`, 1500)
     */
    delay?: number;
    /**
     * set and, on detach, remove the root attribute (default true; a wrapper around one element passes false)
     */
    manageRoot?: boolean;
};
export type EffectsHandle = {
    /**
     * stop everything the module started and remove the root attribute; safe to call twice
     */
    detach: () => void;
    /**
     * start an element rendered after attach, and its subtree [AR34]
     */
    observe: (element: Element) => void;
};
/** What has been reported as unknown on this page, for js/diagnostics.js. */
export declare function unknownEffects(): any[];
/**
 * Attach the reveals under `root` and return a handle.
 *
 * @param {Document | Element} [root]
 * @param {EffectsOptions} [options]
 * @returns {EffectsHandle}
 */
export declare function attachEffects(root?: Document | Element, options?: EffectsOptions): EffectsHandle;
