import { EffectHook } from '../effects-core/hook.js';
/**
 * The arrival [SW2]: how the page comes on. A theme answers `--kp-arrival` on the root; `boot` is synthwave's (a diegetic line
 * counting up in the overlay the register paints, a Skip button, and the CRT switching the overlay off) and `card` is
 * phantom's [PH2] (the theme's own name as the line, a bar the register runs under it, and the overlay shoved off to the
 * left). Once per session, never under reduced motion, and every word from the dictionary [KT5].
 */
declare class ArrivalHook extends EffectHook {
    arrival(): void;
}
/** Make the arrival hook of one attach. @param {import('../effects.js').EffectsContext} ctx */
export declare function install(ctx: import('../effects.js').EffectsContext): ArrivalHook;
export {};
