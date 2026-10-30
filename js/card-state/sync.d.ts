export type CardState = import('../card-state.js').CardState;
export type CardStateOptions = import('../card-state.js').CardStateOptions;
/** What one card remembers between syncs: its last state, its busy card, whether it was drawn, the options of its note. */
export declare class CardSync {
    card: HTMLElement;
    /** The state the card was last synced to. @type {CardState | undefined} */
    state: CardState | undefined;
    /** The busy card of a loading card. @type {import('../busy-card.js').BusyCard | undefined} */
    busy: import('../busy-card.js').BusyCard | undefined;
    /** Whether the card was drawn once already: the first loading card does not arrive. */
    drawn: boolean;
    /** The options the card's note was last built from. @type {CardStateOptions | undefined} */
    given: CardStateOptions | undefined;
    /** @param {HTMLElement} card */
    constructor(card: HTMLElement);
    /**
     * Bring the card's parts, its loading card and its note in step with its
     * `data-kp-state`, and tell the page when it changed.
     * @param {{ announce?: boolean, options?: CardStateOptions }} [how]
     * @returns {CardState}
     */
    sync({ announce, options }?: {
        announce?: boolean;
        options?: CardStateOptions;
    }): CardState;
    /**
     * The focus leaves a part that is about to be hidden or made inert, for the stage.
     * @param {{ stage: HTMLElement, data: HTMLElement, note: HTMLElement }} parts
     * @param {CardState} state
     * @param {CardState | undefined} previous
     */
    leaveFocus({ stage, data, note }: {
        stage: HTMLElement;
        data: HTMLElement;
        note: HTMLElement;
    }, state: CardState, previous: CardState | undefined): void;
    /**
     * @param {HTMLElement} note
     * @param {CardState} state
     * @param {CardState | undefined} previous
     * @param {CardStateOptions | undefined} options the options this sync was given, if any
     * @param {CardStateOptions} opts the options the note is built from
     */
    showNote(note: HTMLElement, state: CardState, previous: CardState | undefined, options: CardStateOptions | undefined, opts: CardStateOptions): void;
    /** A loading card gets the busy card over its stage; leaving the state takes it out. @param {HTMLElement} stage @param {boolean} loading @param {CardStateOptions} opts */
    syncBusy(stage: HTMLElement, loading: boolean, opts: CardStateOptions): void;
    /** Take the busy card out at once (a detach), without its leaving motion. */
    dropBusy(): void;
}
/**
 * The sync of a card, made when it has none.
 * @param {HTMLElement} card
 * @returns {CardSync}
 */
export declare function syncOf(card: HTMLElement): CardSync;
/**
 * Put a card in a state. The options are kept for the card, so a later
 * `data-kp-state` change written by a framework builds the same note.
 * @param {HTMLElement} card a `.kp-card`
 * @param {CardState} state
 * @param {CardStateOptions} [options]
 * @returns {CardState}
 */
export declare function setCardState(card: HTMLElement, state: CardState, options?: CardStateOptions): CardState;
