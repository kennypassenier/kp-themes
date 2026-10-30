export { HOOKS, SURFACES, REVEALS, HEADLINE_ROUTINES, ARRIVALS, STATE, ROUTINES, ARRIVAL, } from './effects-core/vocabulary.js';
export { CARET_KNOB, KNOBS, COUNT_KNOB, COUNT_FROM_KNOB, BOOT_PROGRESS, MARQUEE_KNOB, MARQUEE_PAUSE_KNOB, MEASURE_KNOB, POINTER_KNOB, POINTER, LIGHT_KNOB, LIGHT, LIGHT_SELECTOR, LIGHT_REACH, LIGHT_FAR, PRESS_KNOB, PRESS, PRESS_SIZE, PRESS_HOLD, PRESS_HELD, PRESS_HOLD_MS, ROOT_ATTRIBUTE, DONE_ATTRIBUTE, REVEAL_STATE, TEXT_ATTRIBUTE, UNKNOWN_EVENT, REVEAL_EVENT, MEMO_PREFIX, GLYPHS, } from './effects-core/knobs.js';
export { TIMINGS } from './effects-core/timings.js';
export { unknownEffects } from './effects-core/registry.js';
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
    /**
     * resolves once every hook this attach asked for has been fetched and run [scope-117]
     */
    ready: Promise<void>;
};
export type EffectsState = {
    detached: boolean;
    io: IntersectionObserver | null;
    ioHeadline: IntersectionObserver | null;
    pending: number;
};
export type EffectsContext = Record<string, any> & {
    state: EffectsState;
};
/**
 * @typedef {object} EffectsOptions
 * @property {boolean} [reduceMotion] override the media query (a test, or a consumer's own switch)
 * @property {number} [threshold] IntersectionObserver ratio for the rule (default: `--kp-reveal-threshold`, 0.6)
 * @property {number} [cps] decipher characters per second (default: `--kp-decipher-cps`, 26)
 * @property {number} [stagger] ms between one mark clearing and the next (default: `--kp-reveal-stagger`, 260)
 * @property {number} [delay] ms before the first mark clears on load (default: `--kp-classified-delay`, 1500)
 * @property {boolean} [manageRoot] set and, on detach, remove the root attribute (default true; a wrapper around one element passes false)
 */
/**
 * @typedef {object} EffectsHandle
 * @property {() => void} detach stop everything the module started and remove the root attribute; safe to call twice
 * @property {(element: Element) => void} observe start an element rendered after attach, and its subtree [AR34]
 * @property {Promise<void>} ready resolves once every hook this attach asked for has been fetched and run [scope-117]
 */
/**
 * The four variables every part of attachEffects writes [scope-117].
 * @typedef {object} EffectsState
 * @property {boolean} detached
 * @property {IntersectionObserver | null} io
 * @property {IntersectionObserver | null} ioHeadline
 * @property {number} pending
 */
/**
 * What a hook module receives from attachEffects [scope-117]: the closure it
 * was cut out of, by name.
 * @typedef {Record<string, any> & { state: EffectsState }} EffectsContext
 */
/**
 * Attach the reveals under `root` and return a handle.
 *
 * @param {Document | Element} [root]
 * @param {EffectsOptions} [options]
 * @returns {EffectsHandle}
 */
export declare function attachEffects(root?: Document | Element, options?: EffectsOptions): EffectsHandle;
