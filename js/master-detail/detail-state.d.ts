/** The state of the detail pane of one layout. */
export declare class DetailState {
    root: HTMLElement;
    detail: HTMLElement;
    doc: Document;
    body: HTMLElement;
    stateBox: HTMLElement;
    /** @type {import('../busy-card.js').BusyCard | null} */
    busy: import('../busy-card.js').BusyCard | null;
    /** @type {import('./constants.js').PaneState} */
    state: import('./constants.js').PaneState;
    drawn: boolean;
    /** The element the busy card lies on: the detail pane, or, where the detail is a closed sheet on a phone, the layout itself. @type {HTMLElement | null} */
    busyAt: HTMLElement | null;
    busyWords: string;
    /** Stops the list's size being watched for the card laid on it. @type {() => void} */
    unwatchList: () => void;
    /** Stops the watch for a component's own failed plate. @type {() => void} */
    stopOwnWatch: () => void;
    /**
     * @param {HTMLElement} root
     * @param {HTMLElement} detail
     * @param {import('./parts.js').DetailParts} parts
     */
    constructor(root: HTMLElement, detail: HTMLElement, parts: import('./parts.js').DetailParts);
    /** Whether the detail is on screen (not a closed sheet on a phone). */
    detailShown(): boolean;
    /**
     * The loading look covers the data area that is on screen: the detail pane, and, where the detail is a closed sheet on a phone
     * (`display: none`, a card of 0 x 0 in it), the list, laid on the master-detail itself; the sheet opening moves it back
     * [kyugaps-1019, gap kyu 48].
     * @param {boolean} arrive
     */
    layBusy(arrive: boolean): import("../busy-card.js").BusyCard;
    /** The loading look follows the pane that is on screen when the layout folds or the sheet opens or closes [kyugaps-1019]. */
    reseatBusy(): void;
    /** Whether a component in the detail body shows its own failed plate on screen. */
    ownFailure(): boolean;
    /**
     * A failure asked for before the detail's own component drew its plate (js/code.js draws it after its busy card has closed) is
     * covered by the master-detail's plate at first. While the state reads `error` and no own plate stands, the body is watched:
     * when a component's own failed plate appears, the state is applied again and the master-detail's plate gives way [KYU 54].
     * @param {import('./constants.js').PaneStateOptions} options
     */
    watchOwn(options: import('./constants.js').PaneStateOptions): void;
    /** The plate that says what an empty or failed detail needs. @param {import('./constants.js').PaneState} next @param {import('./constants.js').PaneStateOptions} options */
    plateFor(next: import('./constants.js').PaneState, options: import('./constants.js').PaneStateOptions): HTMLElement;
    /** The marks the layout and its panes carry for a state. @param {import('./constants.js').PaneState} next @param {boolean} own */
    paintMarks(next: import('./constants.js').PaneState, own: boolean): void;
    /** The busy card: laid when loading starts, closed when it ends. @param {boolean} loading @param {import('./constants.js').PaneStateOptions} options */
    paintBusy(loading: boolean, options: import('./constants.js').PaneStateOptions): void;
    /**
     * Set the detail pane's state. The detail pane keeps its place and size in every state.
     * @param {import('./constants.js').PaneState} next
     * @param {import('./constants.js').PaneStateOptions} [options]
     */
    setState(next: import('./constants.js').PaneState, options?: import('./constants.js').PaneStateOptions): void;
    /** Let go of the busy card and the watchers. */
    release(): void;
}
