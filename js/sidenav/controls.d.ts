import { parseChord } from './helpers.js';
import { SidenavFlyout } from './flyout.js';
export type Chord = ReturnType<typeof parseChord>;
/** @typedef {ReturnType<typeof parseChord>} Chord */
export declare class SidenavControls extends SidenavFlyout {
    /** The key chord that opens and closes the panel, read in `setupControls`. @type {Chord | null} */
    chord: Chord | null;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /** Read the shortcut the panel names. */
    setupControls(): void;
    /** @param {KeyboardEvent} event */
    onShortcut(event: KeyboardEvent): void;
    /** Remember which groups stand open. */
    saveGroups(): void;
    /**
     * A press on a group's heading. The accordion option is the reference's: with it on, opening one closes the others.
     * @param {Event} event
     */
    onCategory(event: Event): void;
    /**
     * The toggler a click landed on, when it is this panel's and not one a consumer wires.
     * @param {Event} event
     * @param {string} selector
     */
    ownToggler(event: Event, selector: string): Element | null;
    /** @param {Event} event */
    onToggleClick(event: Event): void;
    /** @param {Event} event */
    onSlimClick(event: Event): void;
    /** @param {KeyboardEvent} event */
    onEsc(event: KeyboardEvent): void;
}
