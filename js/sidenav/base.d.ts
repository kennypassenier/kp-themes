import { Controller } from '../controller.js';
export type Memory = import('../remember.js').Memory;
export type Strings = import('../strings/types.js').Strings;
export type SidenavSettings = {
    strings: Partial<Strings> | undefined;
    ownedBy: string;
    store: Storage | null | undefined;
};
/** @typedef {import('../remember.js').Memory} Memory */
/** @typedef {import('../strings/types.js').Strings} Strings */
/**
 * What `attachSidenavs` hands each panel.
 * @typedef {object} SidenavSettings
 * @property {Partial<Strings> | undefined} strings
 * @property {string} ownedBy
 * @property {Storage | null | undefined} store
 */
export declare class SidenavBase extends Controller {
    /** The panel this controller drives. */
    panel: HTMLElement;
    doc: Document;
    /** The page's own words for the togglers' names. */
    strings: Partial<import("../strings/types.js").Strings> | undefined;
    /** The mark of togglers a consumer wires themselves [AR29]. */
    ownedBy: string;
    /** Where the panel remembers its state; `undefined` is the page's storage. */
    store: Storage | null | undefined;
    /** What this panel remembers; painted in `setupBasics`. @type {Memory | null} */
    memory: Memory | null;
    /** Whether the markup marked the panel launched itself, so the detach leaves the mark. */
    launchedByMarkup: boolean;
    /** The strip a shut panel leaves in view, while there is one. @type {HTMLElement | null} */
    strip: HTMLElement | null;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /** Paint the remembered state, note the markup's launch mark and turn the ease around once. */
    setupBasics(): void;
    /** @param {string} attribute */
    read(attribute: string): string | null;
    /** A boolean option: absent is the fallback, anything but `false` is on. @param {string} attribute @param {boolean} fallback */
    on(attribute: string, fallback: boolean): boolean;
    /** The panel's mode: `side` unless the markup says otherwise. */
    mode(): string;
    isOpen(): boolean;
    /** Whether the panel lies over the content. */
    covering(): boolean;
    /**
     * A rail that collapses, a panel that slides away and a group that folds play their opening backwards: the theme's curve
     * turned around, which CSS cannot work out, so it is written here as `--kp-sidenav-ease-back` (css/components.css) before each
     * change and before a hover that may expand the rail. Without this module they run on the opening's own curve.
     */
    turnEase(): void;
    /** This panel's togglers: the ones pointed at it, and the ones pointed at no panel. @returns {Element[]} */
    togglers(): Element[];
    /** The element a push or side mode makes room in. */
    contentEl(): HTMLElement | null;
    /**
     * Whether the content keeps the panel's room open or shut: the gutter. Not while `data-kp-sidenav-over-below` has made the
     * panel an `over` panel on a narrow screen, where a gutter would take the page's room.
     */
    reserved(): boolean;
    /** The edge the panel comes out of: `start` (the default) or `end`. @returns {'end' | 'start'} */
    edge(): 'end' | 'start';
    /** The style property that moves something clear of the panel, on the panel's side. @returns {'marginInlineEnd' | 'marginInlineStart'} */
    marginAlong(): 'marginInlineEnd' | 'marginInlineStart';
    /** @returns {'paddingInlineEnd' | 'paddingInlineStart'} */
    paddingAlong(): 'paddingInlineEnd' | 'paddingInlineStart';
    /**
     * The panel's own painted size across its axis, not the token's default. The knob is usually set on the panel, where the
     * content element cannot see it: a panel asked for 11rem moved its content by 15rem, and the gap showed. Across the width it is
     * the size the panel is going to (`--kp-sidenav-w`, resolved), so a rail that collapses or a reserved gutter follows at once,
     * not the frame the width transition stands at.
     */
    panelSize(): string;
    /**
     * Where the panel's far edge stands: its width and what lies between the window's edge and the panel (`--kp-sidenav-lead`, the
     * floating gap). The edge tab rides there.
     */
    edgeSize(): string;
    /** The edge tabs that hold one of this panel's togglers. */
    tabs(): HTMLElement[];
    /** The strip a shut panel leaves in view (`--kp-sidenav-peek`, a length), or empty when the page sets none. */
    peekSize(): string;
    /**
     * Make, keep or drop the strip: it exists while the panel slides (not `side`) and the page sets `--kp-sidenav-peek`. It is the
     * panel's next sibling, under the panel, marked with the edge and the look so the stylesheet can place it; the panel's knobs it
     * follows are carried over. A floating panel hides it while open.
     *
     * @param {boolean} open
     */
    syncPeek(open: boolean): void;
    /** Take the peek strip away, if there is one. */
    dropStrip(): void;
}
