import { RangeCore } from './core.js';
export declare class RangeController extends RangeCore {
    connect(): void;
    /** The first window, as the markup asks; a custom start in the markup (`data-kp-range-start`, `-end`) wins. */
    firstWindow(): void;
    /** Takes the markup and the marks the picker added off the host again. */
    unbuild(): void;
    /** @param {Event} event */
    onPreset(event: Event): void;
}
