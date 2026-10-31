import { Controller } from '../controller.js';
/** The wired tab lists, for selectTab(). @type {WeakMap<Element, { tabs: () => HTMLElement[], select: (index: number, options?: { focus?: boolean }) => void }>} */
export declare const handles: WeakMap<Element, {
    tabs: () => HTMLElement[];
    select: (index: number, options?: {
        focus?: boolean;
    }) => void;
}>;
/** One tab list. */
export declare class TabsControl extends Controller {
    manual: boolean;
    wraps: boolean;
    vertical: boolean;
    /** The panels on their way out, and the switch that sent them. @type {Map<HTMLElement, Promise<void>>} */
    leaving: Map<HTMLElement, Promise<void>>;
    /** Raised by every switch; a panel waits to show only for the latest. */
    turn: number;
    /** What attach changed, so detach can put it back. */
    before: {
        tab: HTMLElement;
        tabIndex: string | null;
        selected: string | null;
        panel: HTMLElement | null;
        hidden: "until-found" | boolean;
    }[];
    /** @param {HTMLElement} host @param {{ activation?: 'automatic' | 'manual', loop?: boolean }} [options] */
    constructor(host: HTMLElement, options?: {
        activation?: 'automatic' | 'manual';
        loop?: boolean;
    });
    /** The list's tabs, read again at every use. */
    tabs(): HTMLElement[];
    connect(): void;
    /** Take the list out of the registry and put back the tab stops, the selection and the panels attach found. */
    restore(): void;
    /** @param {number} index @param {{ focus?: boolean }} [options] */
    select(index: number, { focus }?: {
        focus?: boolean;
    }): void;
    /**
     * An outgoing panel leaves the theme's way, its space folding shut, and the new one arrives once it is gone (as a leave turned
     * around): so a switch is one panel's exit followed by the other's entrance, never a jump.
     * @param {HTMLElement} panel @param {Promise<void>[]} going collects the leaves the new panel waits for
     */
    send(panel: HTMLElement, going: Promise<void>[]): void;
    /**
     * Show the new panel: at once when nothing leaves; beside the old one in a theme that lets states leave first (leavesState()),
     * one picture in one time; else once the leaves are over, unless a later switch came.
     * @param {HTMLElement} show @param {Promise<void>[]} going @param {number} mine this switch's turn
     */
    arrive(show: HTMLElement, going: Promise<void>[], mine: number): void;
    /** Manual activation moves focus without selecting. @param {number} index */
    roam(index: number): void;
    /** @param {KeyboardEvent} e */
    onKey(e: KeyboardEvent): void;
}
