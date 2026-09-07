/**
 * The hook vocabulary [AR35]. Contract values: a consumer writes these
 * into markup, and a theme answers them in `themes/hooks.json`. Every
 * value names what an element IS, never what one theme does with it — a
 * "tear" is a horizon under synthwave, so the attribute stays bare.
 */
export declare const HOOKS: Readonly<{
    /** `hero` or `app`: which ground a section stands on [TH116]. */
    surface: "data-kp-surface";
    /** `headline`, `emphasis` or `rule`: what a revealed element is. */
    reveal: "data-kp-reveal";
    /** The element a container's reveal listens to instead of the load. */
    revealTrigger: "data-kp-reveal-trigger";
    /** `load`: run this reveal on every load, not once per session [AR44]. */
    revealEvery: "data-kp-reveal-every";
    /** A section transition. Bare, or `section`. */
    divider: "data-kp-divider";
    /** The label a register may draw with `content: attr()` [KT5]. */
    label: "data-kp-label";
    /** `start` or `end`: which side of the screen the navbar sits on [TH117]. */
    navSide: "data-kp-nav-side";
}>;
/** The values `data-kp-surface` accepts. */
export declare const SURFACES: readonly string[];
/** The values `data-kp-reveal` accepts. */
export declare const REVEALS: readonly string[];
/**
 * The state classes the module toggles [AR35]. Contract values: a
 * consumer will select on them the day they exist, so they never change
 * inside a major.
 */
export declare const STATE: Readonly<{
    /** The element has entered the viewport (or the page has loaded). */
    in: "is-in";
    /** An emphasis has cleared its redaction. */
    cleared: "is-cleared";
    /** A headline has finished deciphering. */
    deciphered: "is-deciphered";
    /** A one-shot glitch is running. */
    glitching: "is-glitching";
}>;
/**
 * The root attribute that arms the start states [AR34]. Set before first
 * paint by the head-script slot, so the register can key a start state
 * on `[data-kp-effects] [data-kp-reveal]:not(.is-in)` and a page without
 * the script keeps the rest state (drawn, cleared, legible).
 */
export declare const ROOT_ATTRIBUTE = "data-kp-effects";
/** Set on an element the module has started, so a second attach skips it. */
export declare const DONE_ATTRIBUTE = "data-kp-effects-done";
/**
 * Fired once per page, on `document`, the first time a hook carries a
 * value the module does not know [AR44]. `detail.attribute`,
 * `detail.value` and `detail.accepted` say which and what would work.
 * The module never throws into a page.
 */
export declare const UNKNOWN_EVENT = "kp-effect-unknown";
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
export declare const TIMINGS: Readonly<Record<string, Readonly<{
    durationMs: number;
    cycles: number;
    property: string;
    luminanceSteps: readonly number[];
}>>>;
export type EffectsOptions = {
    /**
     * override the media query, for tests
     */
    reduceMotion?: boolean;
    /**
     * override the active theme, for tests
     */
    theme?: string;
    /**
     * IntersectionObserver ratio (default 0.6)
     */
    threshold?: number;
    /**
     * decipher characters per second (default 26)
     */
    cps?: number;
    /**
     * emphasis stagger in ms (default 260)
     */
    stagger?: number;
    /**
     * classified delay in ms (default 1500)
     */
    delay?: number;
};
export type EffectsHandle = {
    /**
     * stop everything the module started; safe to call twice
     */
    detach: () => void;
    /**
     * start an element rendered after attach [AR34]
     */
    observe: (element: Element) => void;
};
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
export declare function attachEffects(root?: ParentNode, options?: EffectsOptions): EffectsHandle;
