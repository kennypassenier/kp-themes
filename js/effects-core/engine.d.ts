import { EffectsBase } from './base.js';
export type EffectsHandle = import('../effects.js').EffectsHandle;
export type EffectsOptions = import('../effects.js').EffectsOptions;
export declare class EffectsEngine extends EffectsBase {
    /** What the page's arrival will do, decided before the scan [scope-86]. */
    arrival: {
        routine: string;
        performed: boolean;
        plays: boolean;
    };
    pointerArmed: boolean;
    pressArmed: boolean;
    /** The one `change` handler of the motion preference; same identity for add and remove. */
    preferenceHandler: () => void;
    /** @param {Document | Element} root @param {EffectsOptions} options */
    constructor(root: Document | Element, options: EffectsOptions);
    /** Attach the reveals under the root and return the handle. @returns {EffectsHandle} */
    start(): EffectsHandle;
    /** @param {string} name */
    asked(name: string): string;
    /**
     * Whether this attach puts up the arrival, decided before the scan so
     * the headline the scan finds already knows to wait for it [scope-86].
     * The arrival itself is built at the end of attach, as before.
     */
    decideArrival(): void;
    /** @param {Element} el */
    startOne(el: Element): void;
    /**
     * The headline waits for the arrival [scope-86]: started under
     * the overlay it was over before the overlay went, so a first
     * visit never saw it. It starts when the overlay is removed,
     * whether the arrival ran its course, was skipped or clicked
     * away; with no arrival on screen it starts now, as before.
     * @param {Element} el
     */
    startHeadline(el: Element): void;
    /** @param {ParentNode | Element} scope */
    scan(scope: ParentNode | Element): void;
    /**
     * Counting numbers [feat-count-1]. Armed once each: an element
     * already counted keeps its number when the module is attached a
     * second time, which js/auto.js does over React.
     * @param {ParentNode | Element} scope
     */
    scanCounts(scope: ParentNode | Element): void;
    /** Stop the timers, frames and observers the reveals started. */
    stopRunning(): void;
    /** Reduced motion switched on mid-session: every running reveal resolves to its rest state at once [DI7]. */
    onPreference(): void;
    /**
     * The pointer and press buses depend on the theme, and a theme can
     * arrive after attach: the reader switches, a lazily loaded register
     * lands, a framework renders its own switcher. They used to be armed
     * only if the theme active at attach asked, so dark's oxide film stood
     * still in every app that attached before dark was on [fix-81]. Each is
     * armed once, the first time a theme asks for it.
     */
    armThemeBuses(): void;
    /** Watch for a theme that arrives after attach. */
    watchThemes(): void;
    /**
     * The hooks a theme or the page asks for once, in the order the closure
     * always ran them. Each module still decides for itself; the checks here
     * only save the download when the answer is certainly no.
     */
    askForHooks(): void;
    /** Stop everything the module started and remove the root attribute; safe to call twice. */
    detach(): void;
    /** @returns {EffectsHandle} */
    handle(): EffectsHandle;
}
