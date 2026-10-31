import { SidenavResizer } from './resizer.js';
export type Sidenav = import('./helpers.js').Sidenav;
export declare class SidenavControl extends SidenavResizer {
    /** The glyphs drawn into empty togglers, taken away on detach. @type {HTMLElement[]} */
    glyphs: HTMLElement[];
    /** What a page gets back for this panel (`sidenavOf`). @type {Sidenav} */
    handle: Sidenav;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /**
     * A launcher: the panel makes room for it, and an empty toggler in it gets the package's three bars, the glyph the bar's own
     * toggle draws. A page that wrote the mark itself keeps it; otherwise applyOpener() writes it while a launcher is shown.
     */
    addGlyphs(): void;
    /**
     * The starting state. A side panel is there unless told otherwise; the two that cover are away until asked, which is the
     * reference's `hidden` default written as a mode rather than as a flag.
     */
    setupStart(): void;
    /** The panel's and the page's listeners; `destroy()` removes them before anything else. */
    wire(): void;
    /**
     * The rail's keys: Right (or Left on the end edge) floats a group out and goes into it, Escape or the way back folds it and
     * returns to its heading, and Escape takes a label tip away.
     * @param {KeyboardEvent} event
     */
    onRailKey(event: KeyboardEvent): void;
    /** Undo what `connect()` did, beyond the listeners, in the order the old detach did it. */
    unwire(): void;
    /** Stop the timers and the peek, and fold the floating groups back into the panel as they were. */
    undoMotion(): void;
    /** Give the edge tabs, the backdrop, the strip and the content their own place back. */
    undoPlacement(): void;
    /** Put the launchers out and take the glyphs, the launch mark and the opener marks away. */
    undoMarks(): void;
    /** Free the page's scroll, drop the open state and the togglers' names, and forget the panel. */
    undoNames(): void;
}
