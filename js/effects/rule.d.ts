import { EffectHook } from '../effects-core/hook.js';
/** The rule: drawn when its heading enters the viewport [TH122]. */
declare class RuleHook extends EffectHook {
    /** @param {Element} el */
    rule(el: Element): void;
    /** @param {Element} el @param {string} routine @param {boolean} skipped */
    draw(el: Element, routine: string, skipped: boolean): void;
    /** The rules that entered the viewport draw, once each. @param {IntersectionObserverEntry[]} entries @param {string} routine */
    onSeen(entries: IntersectionObserverEntry[], routine: string): void;
}
/** Make the rule hook of one attach. @param {import('../effects.js').EffectsContext} ctx */
export declare function install(ctx: import('../effects.js').EffectsContext): RuleHook;
export {};
