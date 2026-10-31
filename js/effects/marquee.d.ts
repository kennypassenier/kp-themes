import { EffectHook } from '../effects-core/hook.js';
/**
 * The marquee [M1, M2]: a row that runs. The consumer writes the items once; a seamless loop needs the row twice, so the
 * module builds the track, moves the items into the first run and clones it into a second the screen reader skips. The
 * attributes it writes are what the base layer keys on, so a page without this module shows the items standing still rather
 * than a half-built band [T17, AR34].
 */
declare class MarqueeHook extends EffectHook {
    marquee(): void;
    /** Move the band's items into a run, clone it, and mark the band ready. @param {Element} band */
    build(band: Element): void;
    /** Paused, not stopped, while off screen: the animation keeps its position and carries on from it. @param {Element} band */
    pauseOffscreen(band: Element): void;
}
/** Make the marquee hook of one attach. @param {import('../effects.js').EffectsContext} ctx */
export declare function install(ctx: import('../effects.js').EffectsContext): MarqueeHook;
export {};
