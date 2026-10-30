import { ChipView } from './view.js';
export declare class VersionChip extends ChipView {
    connect(): void;
    /** Mark the chip, draw it, and keep it in step with its attributes and its clicks. */
    wire(): void;
    /** Draw the chip from its attributes. */
    draw(): void;
    /** Shift+click copies "10.11 → 12.1". @param {MouseEvent} event */
    copy(event: MouseEvent): Promise<void>;
}
