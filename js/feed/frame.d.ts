/**
 * The parts of a feed that stay for its whole life; the rows and plates are poured into them.
 * @param {Document} doc
 */
export declare function buildFrame(doc: Document): {
    head: HTMLElement;
    count: HTMLElement;
    fresh: HTMLElement;
    stale: HTMLElement;
    staleText: HTMLElement;
    staleAction: HTMLButtonElement;
    body: HTMLElement;
    skeleton: HTMLElement;
    list: HTMLElement;
    state: HTMLElement;
    foot: HTMLElement;
    voice: HTMLElement;
};
/** Skeleton rows with the final geometry: two days, the marks, two lines, a chip and a time each. @param {Document} doc */
export declare function skeletonRows(doc: Document): HTMLElement[];
