import { SidenavControls } from './controls.js';
export type Declared = {
    mode: string | null;
    slim: boolean;
};
/** @typedef {{ mode: string | null, slim: boolean }} Declared */
export declare class SidenavNarrow extends SidenavControls {
    /** The width the panel becomes an `over` panel at, as written; read in `setupNarrow`. @type {string | null} */
    overBelow: string | null;
    /** The width the rail collapses at, as written; read in `setupNarrow`. @type {string | null} */
    slimBelow: string | null;
    /** What the markup declared, kept while the panel is narrow. @type {Declared | null} */
    declared: Declared | null;
    /** The controls hidden or shown here, and whether each was hidden before. @type {Map<HTMLElement, boolean>} */
    hiddenAtAttach: Map<HTMLElement, boolean>;
    /** The reader's own rail state while the step holds it collapsed. @type {boolean | null} */
    slimHeld: boolean | null;
    /** The watch on the panel's box, when a step is asked for. @type {ResizeObserver | null} */
    narrowWatch: ResizeObserver | null;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /** Read the two steps and make the watch; it starts observing with the starting state (`SidenavControl.setupStart`). */
    setupNarrow(): void;
    /** @param {Element} control @param {boolean} hide */
    hideControl(control: Element, hide: boolean): void;
    /** A length the page wrote, in pixels; empty is the package's 40rem step. @param {string | null} [written] */
    threshold(written?: string | null): number;
    /** Change the mode without the slide: a resize is not an opening. @param {() => void} change */
    still(change: () => void): void;
    applyNarrow(): void;
    /** Keep what the markup declared and become a shut `over` panel. */
    becomeNarrow(): void;
    /** Become what the markup declared again. */
    becomeWide(): void;
    /** Write the declared mode and rail state back and drop the narrow mark. @param {Declared} was */
    putDeclared(was: Declared): void;
    applySlimBelow(): void;
    /** The reader's own rail state the step held, if it held one; the step lets go of it. */
    releaseSlimHeld(): boolean | null;
    /** Stop watching, give back the declared state and the controls' own `hidden`. */
    undoNarrow(): void;
}
