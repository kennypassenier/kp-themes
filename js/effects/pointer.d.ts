import { EffectHook } from '../effects-core/hook.js';
import { PointerLight } from './pointer-light.js';
declare class PointerHook extends EffectHook {
    /** The pointer light of this attach, or null when there is no window to light. */
    pointerLight(): PointerLight | null;
    pointerBus(): void;
    pressBus(): void;
}
/** Make the pointer hook of one attach. @param {import('../effects.js').EffectsContext} ctx */
export declare function install(ctx: import('../effects.js').EffectsContext): PointerHook;
export {};
