import { Controller } from '../controller.js';
import { TabbarDialog } from './dialog.js';
export declare class TabbarController extends Controller {
    doc: Document;
    /** @type {Window & typeof globalThis} */
    view: Window & typeof globalThis;
    /** The dialogs wired so far, so a redraw wires a dialog once: a tab drawn anew takes over the dialog's wiring. @type {WeakMap<HTMLDialogElement, TabbarDialog>} */
    wired: WeakMap<HTMLDialogElement, TabbarDialog>;
    /** @param {HTMLElement} bar */
    constructor(bar: HTMLElement);
    connect(): void;
    /** The labels tighten before any is cut (js/tabbar/fit.js): measured on a resize, a redraw of the tabs and the fonts' arrival. */
    fitLabels(): void;
    /** The height, published while the bar is on the screen. A static bar sits in the page's flow and gives nobody room to keep. */
    publishHeight(): void;
    /**
     * A tab that opens a dialog: say so, and follow the dialog. The wiring is keyed on the dialog: a redraw that replaces the
     * tab but keeps the dialog hands the one wiring to the new tab (no second click handler, observer or close timer), and a
     * tab already wired is left as it is.
     */
    wireDialogs(): void;
    /**
     * A More tab drawn after the bar was wired is wired too [medicine-1102, Medicine Cabinet gap 29]. The bundle wires every bar
     * on the page when it loads, so an app that draws its tabs afterwards found its later attachTabbars() call a no-op: the
     * drawer was the whole window on a phone and did not close on a link the app routes in place. A redraw of the bar wires the
     * new tab; a press on a tab whose drawer arrived after the tab wires it before the drawer opens (capture, ahead of the
     * page's own data-kp-dialog wiring).
     */
    watchDialogs(): void;
}
