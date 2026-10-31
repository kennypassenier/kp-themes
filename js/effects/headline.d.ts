import { EffectHook } from '../effects-core/hook.js';
/** The headline: decipher, then one slice burst [TH119]. */
declare class HeadlineHook extends EffectHook {
    /** @param {Element} el @param {boolean} [atRest] straight to rest, as a detach does for a reveal it never started */
    headline(el: Element, atRest?: boolean): void;
}
/** Make the headline hook of one attach. @param {import('../effects.js').EffectsContext} ctx */
export declare function install(ctx: import('../effects.js').EffectsContext): HeadlineHook;
export {};
