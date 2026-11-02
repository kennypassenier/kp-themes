import { Controller } from '../controller.js';
export type Swatch = import('./constants.js').Swatch;
/** @typedef {import('./constants.js').Swatch} Swatch */
/** The CSS colour of a swatch: a categorical one by number (its place by default), else the text as given. @param {Swatch} swatch @param {number} index */
export declare function colourOf(swatch: Swatch, index: number): string;
export declare class SwatchesControl extends Controller {
    grid: HTMLDivElement;
    name: HTMLParagraphElement;
    /** @type {Swatch[]} */
    swatches: Swatch[];
    /** @type {string | null} */
    current: string | null;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** @param {readonly Swatch[]} swatches @param {string | null} current */
    set(swatches: readonly Swatch[], current: string | null): void;
    /** Draw the swatches; the one that held the focus keeps it. */
    paint(): void;
    /** @param {Swatch} swatch @param {number} index @param {boolean} stop whether it is the tab stop */
    button(swatch: Swatch, index: number, stop: boolean): HTMLButtonElement;
    /** @param {string} value */
    buttonOf(value: string): HTMLButtonElement | undefined;
    /** @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** The swatches on the first row as drawn (the grid may wrap sooner than its columns on a narrow picker). @param {HTMLElement[]} buttons */
    columns(buttons: HTMLElement[]): number;
    /** A person picked a swatch. @param {string} value @param {'pointer' | 'keyboard'} source */
    pick(value: string, source: 'pointer' | 'keyboard'): void;
}
