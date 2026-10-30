import { EntityDrawing } from './drawing.js';
export declare class IdentityDrawing extends EntityDrawing {
    /** How many flags stand in the row; the rest go behind the "+N". */
    flagsMax: number;
    constructor(/** @type {HTMLElement} */ card: HTMLElement, /** @type {import('./types.js').EntityData} */ data: import('./types.js').EntityData);
    /** 1. identity: tick, mark, name, vmid, state and star. */
    identity(): void;
    /** 2. figures: exact numbers, tabular, in one row. */
    figures(): void;
    /** 3. flags: the first few, and an exact "+N" that opens the package's menu. */
    flags(): void;
    /** The "+N" button and its menu of the flags that did not fit. @param {HTMLElement} el @param {{ label: string }[]} rest */
    flagsMenu(el: HTMLElement, rest: {
        label: string;
    }[]): void;
}
