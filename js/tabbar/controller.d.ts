import { Controller } from '../controller.js';
export declare class TabbarController extends Controller {
    doc: Document;
    /** @type {Window & typeof globalThis} */
    view: Window & typeof globalThis;
    /** @param {HTMLElement} bar */
    constructor(bar: HTMLElement);
    connect(): void;
    /** The height, published while the bar is on the screen. A static bar sits in the page's flow and gives nobody room to keep. */
    publishHeight(): void;
    /** A tab that opens a dialog: say so, and follow the dialog. */
    wireDialogs(): void;
}
