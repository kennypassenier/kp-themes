import { EffectHook } from '../effects-core/hook.js';
/**
 * The measurement frame [scope-18]: blueprint's own. A theme answers `--kp-measure: live` on the root. It replaced two
 * dimension lines on 2026-09-11: Kenny saw the command-table demo's brackets and found them better ("dan is de demo hier
 * niet voor niks geweest", scope-18). The brackets report the box they hold rather than one edge of it, which is why one
 * readout replaces two labels. Runs once, after scan() has already put the headline at its rest text, so nothing here fights
 * the decipher, type or word routines for the same child nodes.
 */
declare class MeasureHook extends EffectHook {
    measure(): void;
}
/** Make the measure hook of one attach. @param {import('../effects.js').EffectsContext} ctx */
export declare function install(ctx: import('../effects.js').EffectsContext): MeasureHook;
export {};
