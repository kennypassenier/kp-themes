/** The marks of a busy layer: the whole grid's card and a day's spinner. */
export declare const BUSY_LAYERS = ".kp-calendar__busy, .kp-calendar__day-busy";
/**
 * The busy layers a theme holds on screen while their state goes (`--kp-calendar-busy-leave:
 * hold`, set on the layers by cyberpunk): each is marked `[data-kp-leaving]`, which the
 * register draws as the leave of its arrival played backwards and keeps displayed until it is
 * over. Then the mark goes and the layer is hidden by the calendar's own rules.
 * @param {Element[]} layers
 */
export declare function leaveBusyLayers(layers: Element[]): void;
/**
 * Write the words on the whole grid's busy card. A theme that takes the card off as its arrival backwards keeps its words on it
 * until it is gone (`--kp-calendar-busy-words: hold`, pastel), so the card that leaves is the one that came.
 * @param {import('./controller.js').CalendarController} c @param {string} words the words the page gave
 */
export declare function writeBusyWords(c: import('./controller.js').CalendarController, words: string): void;
