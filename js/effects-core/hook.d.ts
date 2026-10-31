export type EffectsContext = import('../effects.js').EffectsContext;
/** @typedef {import('../effects.js').EffectsContext} EffectsContext */
export declare class EffectHook {
    /** The attach's state and services, by name (js/effects-core/context.js). */
    ctx: import("../effects.js").EffectsContext;
    /** @param {EffectsContext} ctx what attachEffects shares with its hooks */
    constructor(ctx: EffectsContext);
    /** Ready the hook for the engine; the base has nothing to wire up front, so a hook is wired by the reveals it is asked for. */
    connect(): this;
    /**
     * Register an undo step: it runs when reduced motion switches on mid-session and at detach.
     * @template {() => void} F
     * @param {F} undo
     * @returns {F}
     */
    own<F extends () => void>(undo: F): F;
    /**
     * Add an event listener that the attach's cleanups remove.
     * @param {EventTarget} target
     * @param {string} type
     * @param {EventListener} handler
     * @param {AddEventListenerOptions | boolean} [options]
     */
    listen(target: EventTarget, type: string, handler: EventListener, options?: AddEventListenerOptions | boolean): void;
}
