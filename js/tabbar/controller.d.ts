import { Controller } from '../controller.js';
export declare class TabbarController extends Controller {
    doc: Document;
    /** @type {Window & typeof globalThis} */
    view: Window & typeof globalThis;
    /** @param {HTMLElement} bar */
    constructor(bar: HTMLElement);
    connect(): void;
    /** The labels tighten before any is cut (js/tabbar/fit.js): measured on a resize, a redraw of the tabs and the fonts' arrival. */
    fitLabels(): void;
    /** The height, published while the bar is on the screen. A static bar sits in the page's flow and gives nobody room to keep. */
    publishHeight(): void;
    /** A tab that opens a dialog: say so, and follow the dialog. */
    wireDialogs(): void;
}
