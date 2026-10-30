export type EffectsContext = import('../effects.js').EffectsContext;
export type EffectsOptions = import('../effects.js').EffectsOptions;
export type EffectsState = import('../effects.js').EffectsState;
export declare class EffectsBase {
    root: Document | Element;
    options: import("../effects.js").EffectsOptions;
    doc: Document;
    html: HTMLElement;
    manageRoot: boolean;
    view: (Window & typeof globalThis) | null;
    query: MediaQueryList | null;
    rootStyle: CSSStyleDeclaration | null;
    cfg: {
        threshold: number;
        cps: number;
        lead: number;
        swap: number;
        stagger: number;
        delay: number;
        wordStagger: number;
        cardHold: number;
    };
    /** @type {Set<ReturnType<typeof setTimeout>>} */
    timers: Set<ReturnType<typeof setTimeout>>;
    /** @type {Set<number>} */
    frames: Set<number>;
    /** @type {Array<() => void>} */
    cleanups: Array<() => void>;
    /** @type {Array<() => void>} */
    finishers: Array<() => void>;
    /**
     * The attach's four mutable variables as one object [scope-117]: the
     * hooks live in modules of their own, and every one of them must
     * write the same binding. `ioHeadline` is the headline's own on-view
     * watcher [S48], kept apart from `io` (the rule hook's) so a page whose
     * rule reveal is quiet still gets a working headline draw.
     * @type {EffectsState}
     */
    state: EffectsState;
    /** @type {Record<string, Promise<Record<string, any>>>} */
    installed: Record<string, Promise<Record<string, any>>>;
    /** @type {Promise<void>[]} */
    arriving: Promise<void>[];
    /**
     * The page as attach found it, for the hooks asked for during attach: a
     * hook that arrives after a React component has mounted must not wire it
     * [js/as-of.js]. Taken once scan has run; a hook asked for later, by
     * observe(), reads the page as it is then.
     * @type {WeakSet<Element> | null}
     */
    present: WeakSet<Element> | null;
    /** What a hook module receives; built by `setContext` once the attach has decided its arrival. @type {EffectsContext | null} */
    ctx: EffectsContext | null;
    /** @param {Document | Element} root @param {EffectsOptions} options */
    constructor(root: Document | Element, options: EffectsOptions);
    /** @param {WeakSet<Element> | null} present the page as attach found it, or null once attach is over */
    holdPresent(present: WeakSet<Element> | null): void;
    /** @param {EffectsContext} ctx */
    setContext(ctx: EffectsContext): void;
    reduced(): boolean;
    /** @param {string} name @param {number} fallback */
    knob(name: string, fallback: number): number;
    done(): void;
    /** @param {Element} el @param {string} reveal @param {string} routine @param {boolean} skipped */
    announce(el: Element, reveal: string, routine: string, skipped: boolean): void;
    /** @param {() => void} fn @param {number} ms */
    later(fn: () => void, ms: number): void;
    /** @param {Element} el @param {'headline' | 'emphasis' | 'rule' | 'arrival'} reveal */
    routineOf(el: Element, reveal: 'headline' | 'emphasis' | 'rule' | 'arrival'): string;
    /**
     * The memo key: the path, the hook, and the element's position among
     * its kind — so the hero's marks and the dossier's are two memos, and
     * a second headline on the page is its own [AR44].
     *
     * @param {Element} el @param {string} reveal
     */
    memoKey(el: Element, reveal: string): string;
    /** @param {Element} el @param {string} reveal @returns {boolean} true when this page already ran the reveal this session */
    seen(el: Element, reveal: string): boolean;
    /**
     * Report a routine name nothing answers to, once per name, and hand
     * back the empty string so the element rests [G6, 2026-09-08]. Same
     * event and same shape as an unknown surface or reveal: heard, never
     * thrown [AR44].
     *
     * @param {Element} el @param {string} knob @param {string} value @param {readonly string[]} accepted
     * @returns {string}
     */
    reportUnknownRoutine(el: Element, knob: string, value: string, accepted: readonly string[]): string;
    /** @param {Element} el */
    checkValues(el: Element): void;
    /** @param {string} name */
    use(name: string): Promise<Record<string, any>>;
    /** @param {string} name @param {(hook: Record<string, any>) => void} fn */
    run(name: string, fn: (hook: Record<string, any>) => void): void;
}
