import { EffectHook } from '../effects-core/hook.js';
/** Counting numbers [feat-count-1]. */
declare class CountHook extends EffectHook {
    /** @param {Element} el */
    countUp(el: Element): void;
}
/** Make the count hook of one attach. @param {import('../effects.js').EffectsContext} ctx */
export declare function install(ctx: import('../effects.js').EffectsContext): CountHook;
export {};
