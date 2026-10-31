/** One palette's plate: the element, the list's height while it had commands, and the list's own height cap while we cap it. */
export declare class ListPlate {
    dialog: HTMLDialogElement;
    list: HTMLElement;
    /** @type {HTMLElement | null} */
    plate: HTMLElement | null;
    /** The list's own height while it had commands, the footprint a plate keeps. */
    footprint: number;
    /** What the list's own height cap was before a failed plate capped it; null while it is not capped by us. @type {string | null} */
    ownListCap: string | null;
    /** @param {HTMLDialogElement} dialog @param {HTMLElement} list */
    constructor(dialog: HTMLDialogElement, list: HTMLElement);
    /** The footprint is read from a list that shows commands, never from the few that stay under a failed plate. */
    measure(): void;
    ensure(): HTMLElement;
    /** `max-height` counts the padding and the border unless the list is border-box. @param {number} px */
    capList(px: number): void;
    releaseListCap(): void;
    hide(): void;
    /**
     * Stand the plate in the list's footprint. A plate that replaces the list is as high as the list was. A plate above the commands
     * that stay (the failed one) is as high as the list was minus those commands, so the palette keeps its loaded footprint in a
     * failed state too [t56-shared3-1018].
     * @param {'empty' | 'error'} kind @param {string} title @param {string} text @param {boolean} replacesList
     */
    show(kind: 'empty' | 'error', title: string, text: string, replacesList: boolean): void;
    remove(): void;
}
