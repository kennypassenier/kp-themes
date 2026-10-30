import { StackbarParts } from './parts.js';
export type StackbarSpec = import('../stackbar.js').StackbarSpec;
/** @typedef {import('../stackbar.js').StackbarSpec} StackbarSpec */
export declare class Stackbar extends StackbarParts {
    connect(): void;
    /** A bar that carries its spec as JSON in `data-kp-stackbar` draws it; a page that draws with setStackbar() has none. */
    drawJson(): void;
    /**
     * Draw (or redraw) the bar. Calling it again with new numbers keeps the focus on the part it was on, by key.
     * @param {StackbarSpec} spec
     */
    set(spec: StackbarSpec): void;
    /** The key of the part or legend row a target is in. @param {EventTarget | null} target */
    keyOf(target: EventTarget | null): string | undefined;
    /** Light the part and its legend row of a key, and nothing else. @param {string | undefined} key */
    light(key: string | undefined): void;
    /** A press on Retry, or on a part or its legend row. @param {Event} event */
    onClick(event: Event): void;
    /** The arrow keys, Home and End move between the parts; Enter and Space press one. @param {KeyboardEvent} event */
    onKeydown(event: KeyboardEvent): void;
}
