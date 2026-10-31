import { getStrings } from '../../strings.js';
export type Strings = import('../../strings/types.js').Strings;
export type DataTableControl = import('./controller.js').DataTableControl;
export declare class TableBusy {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** Stops the layer following the table's size, while one shows. @type {(() => void) | null} */
    overlayUnwatch: (() => void) | null;
    /** The server's count, in a server-backed table. */
    total: number;
    emptyWasHidden: "until-found" | boolean;
    /** The empty state is leaving now, before it is hidden (leavesState()). */
    emptyLeaving: boolean;
    emptyHidden: "until-found" | boolean;
    densityWas: string | null;
    busyWas: string | null;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    busySeconds(): number;
    stopBusyClock(): void;
    /**
     * The layer over the rows while the table loads [busy overlay]: a large spinner, the status words and the count, centred on the
     * body and hidden from assistive technology, which hears the status line. Absolutely placed in the wrapper, so nothing moves when
     * it comes or goes; the header stays readable above it.
     * @param {ReturnType<typeof getStrings>} s
     */
    drawOverlay(s: ReturnType<typeof getStrings>): void;
    /**
     * Take the layer away. A theme that leaves its states whole (forest: the layer arrived as its leave played backwards) lets the
     * layer leave the way it came (leavesState()); the others close the panel on its own.
     * @param {HTMLElement} toClose
     */
    closeOverlay(toClose: HTMLElement): void;
    /**
     * Measured, and measured again whenever the table or its header changes size: a theme switched after it was drawn, or a font
     * arriving late, moves the header, and the layer must stay under it rather than where the header first was.
     * @param {HTMLElement} layer @param {HTMLElement} panel
     */
    watchOverlay(layer: HTMLElement, panel: HTMLElement): void;
    /** Put the layer over the rows: under the header, above the foot, across what is seen. @param {HTMLElement} layer @param {HTMLElement} panel */
    placeOverlay(layer: HTMLElement, panel: HTMLElement): void;
    /**
     * How far the layer stands from the host's top and bottom.
     * @param {DOMRect} hostBox @param {DOMRect} tableBox @param {number} top where the rows start @param {HTMLElement} panel
     */
    overlayEnds(hostBox: DOMRect, tableBox: DOMRect, top: number, panel: HTMLElement): {
        from: number;
        to: number;
    };
    /**
     * Show or hide the empty state. In a theme that lets a hidden part
     * leave first it withers before it goes, and what the table wants
     * when that is over (typing went on) is applied then.
     * @param {boolean} hide
     */
    showEmpty(hide: boolean): void;
}
