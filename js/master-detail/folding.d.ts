/** The fold state of one layout. */
export declare class Folding {
    root: HTMLElement;
    foldAt: string;
    asideFoldAt: string;
    probe: HTMLDivElement;
    narrow: boolean;
    asideNarrow: boolean;
    /** The pane a phone shows: `list` or `detail`. */
    shown: string;
    /** @param {HTMLElement} root */
    constructor(root: HTMLElement);
    /** What `data-kp-narrow` says a phone shows: `one-pane` (default), `stack` or `sheet`. */
    mode(): string;
    /** A length as pixels, read as the page's rem. @param {string} length */
    px(length: string): number;
    widthNow(): number;
    /** Read the layout's width and decide whether the panes and the aside are folded. */
    measure(): void;
    /** The layout changed size: decide again; a layout that stopped folding shows the list. */
    resize(): void;
    /** Whether the detail replaces the list now (folded, and not stacked). */
    oneAtATime(): boolean;
}
