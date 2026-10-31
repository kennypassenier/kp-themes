import { EffectHook } from '../effects-core/hook.js';
/**
 * The caret [TM2, R6-Q7]: a block cursor inside the focused field. A theme answers `--kp-caret: block` on the root; the
 * module only writes the column (`--kp-col`, in the field's own ch, clamped to the field's width) that the register paints
 * the block at, so the cursor lives in the box at the caret and never after the label (Kenny's reading of 2026-09-08).
 */
declare class CaretHook extends EffectHook {
    caret(): void;
    /** @param {HTMLInputElement} input */
    wire(input: HTMLInputElement): void;
    /** Write the caret's column, measured in the field's own font. @param {HTMLInputElement} input */
    put(input: HTMLInputElement): void;
}
/** Make the caret hook of one attach. @param {import('../effects.js').EffectsContext} ctx */
export declare function install(ctx: import('../effects.js').EffectsContext): CaretHook;
export {};
