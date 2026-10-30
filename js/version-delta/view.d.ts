import { ChipCore } from './core.js';
export type ChipSettings = import('./core.js').ChipSettings;
/** @typedef {import('./core.js').ChipSettings} ChipSettings */
export declare class ChipView extends ChipCore {
    /** The tone class, the level and the sort value; the busy mark and the title are cleared. @param {ChipSettings} v */
    markChip(v: ChipSettings): void;
    /**
     * Loading, failed and empty replace the versions.
     * @param {ChipSettings} v
     * @returns {boolean} whether one was drawn
     */
    drawState(v: ChipSettings): boolean;
    /** The new version, a link when it has notes. @param {ChipSettings} v */
    toNode(v: ChipSettings): HTMLElement;
    /** The level word, with a bang for a major jump. @param {ChipSettings} v */
    levelNode(v: ChipSettings): HTMLElement;
    /** What stands in the chip: the versions, the arrow, the level. @param {ChipSettings} v @param {HTMLElement} toNode @returns {Node[]} */
    children(v: ChipSettings, toNode: HTMLElement): Node[];
    /** What a screen reader hears, in words and not in glyphs. @param {ChipSettings} v */
    spoken(v: ChipSettings): HTMLElement;
}
