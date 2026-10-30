/** @typedef {import('./helpers.js').Sidenav} Sidenav */
export type Sidenav = import('./helpers.js').Sidenav;
export declare const SIDENAV_TOGGLE_EVENT = "kp-sidenav-toggle";
export declare const SIDENAV_SLIM_EVENT = "kp-sidenav-slim";
export declare const SIDENAV_MODE_EVENT = "kp-sidenav-mode";
/** A change that was asked for and refused: by a listener, or by a static backdrop [Bootstrap's hidePrevented]. */
export declare const SIDENAV_PREVENTED_EVENT = "kp-sidenav-prevented";
/** The mark a consumer puts on a toggler they wire themselves [AR29]. */
export declare const SIDENAV_OWNED = "[data-kp-sidenav-owner]";
/** The shortest leg of the refused cue, in milliseconds: it is pulled and let go, each over at least this long. */
export declare const REFUSE_MIN_MS = 120;
/** The class of the handle the module adds to a resizable panel. */
export declare const SIDENAV_RESIZER = ".kp-sidenav__resizer";
/**
 * The reasons a change carries in `detail.reason`. A reader or a caller can
 * refuse the first five; a layout's own adaptation cannot be refused.
 */
export declare const ASKABLE: Set<string>;
/** The fixed box at the panel's far edge that holds a small toggler: the edge tab. */
export declare const SIDENAV_TAB = ".kp-sidenav__tab";
/** The fixed box at the window's start corner that holds a panel's toggler. */
export declare const SIDENAV_LAUNCHER = ".kp-sidenav__launcher";
/**
 * The width at and below which a panel with `data-kp-sidenav-over-below`
 * and no length of its own becomes an `over` panel [scope-80]: the 40rem
 * the bar collapses at and the table falls into cards at, so the package
 * steps at one width rather than at two [TH104, TH26].
 */
export declare const NARROW_STEP = "40rem";
/** The inset card's knobs: set on the panel, they are carried to the content the card is made of. */
export declare const INSET_KNOBS: string[];
/** The panel knobs the peek strip (`.kp-sidenav__peek`, made for `--kp-sidenav-peek`) follows. */
export declare const PEEK_KNOBS: string[];
/** @type {WeakMap<Element, Sidenav>} */
export declare const handles: WeakMap<Element, Sidenav>;
/** The pointer's rest before a collapsed rail's group floats out, and its grace before it goes. */
export declare const FLYOUT_OPEN_MS = 150;
export declare const FLYOUT_CLOSE_MS = 250;
/** The pointer's rest before a rail item's label shows, as the package's tooltips wait [js/overlays.js]. */
export declare const TIP_OPEN_MS = 300;
/** The gap between the rail and what floats beside it, in pixels, and the margin kept from the window's edges. */
export declare const FLOAT_GAP = 6;
export declare const FLOAT_MARGIN = 8;
