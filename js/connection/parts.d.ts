/** @param {Document} doc @param {string} tag @param {string} className */
export declare function make(doc: Document, tag: string, className: string): HTMLElement;
/** @param {Document} doc */
export declare function buildBanner(doc: Document): {
    band: HTMLElement;
    mark: HTMLElement;
    title: HTMLElement;
    why: HTMLElement;
    meta: HTMLElement;
    retry: HTMLButtonElement;
    voice: HTMLElement;
};
