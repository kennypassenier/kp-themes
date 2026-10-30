/**
 * @param {HTMLElement} el the host
 * @param {string} id
 * @param {string} titleText the heading over the list
 */
export declare function buildRunsParts(el: HTMLElement, id: string, titleText: string): {
    title: HTMLParagraphElement;
    stage: HTMLDivElement;
    list: HTMLOListElement;
    note: HTMLDivElement;
    button: HTMLButtonElement;
    live: HTMLParagraphElement;
};
