/** The chooser of one control. */
export declare class Chooser {
    el: HTMLElement;
    holder: HTMLElement;
    /** @type {HTMLElement | null} */
    menuHost: HTMLElement | null;
    /** @type {HTMLElement | null} */
    segHost: HTMLElement | null;
    /** @type {HTMLButtonElement | null} */
    menuButton: HTMLButtonElement | null;
    /** The look the chooser is drawn in now; `data-kp-look` changes it at runtime [live-options-1019]. @type {'menu' | 'segmented' | null} */
    drawnLook: 'menu' | 'segmented' | null;
    /** The detach of the menu or segmented wiring of the look drawn now. @type {(() => void) | null} */
    unwire: (() => void) | null;
    /**
     * @param {HTMLElement} el the control
     * @param {HTMLElement} holder the element the chooser parts go in
     */
    constructor(el: HTMLElement, holder: HTMLElement);
    /** The look the attribute names. @returns {'menu' | 'segmented'} */
    look(): 'menu' | 'segmented';
    /** Build the chooser parts of the look the attribute names (segments or a menu) and put them in the bar. */
    build(): void;
    /** Wire the menu or the segments of the look drawn now. */
    wire(): void;
    /** Fill the chooser with the choices, the current interval marked. @param {number[]} choices @param {number} interval */
    paint(choices: number[], interval: number): void;
    /** Draw the chooser again in a new look, keeping the focus inside it. @param {number[]} choices @param {number} interval */
    redraw(choices: number[], interval: number): void;
    /** The element Escape in the custom form gives the focus back to. */
    focusTarget(): HTMLElement | null;
}
