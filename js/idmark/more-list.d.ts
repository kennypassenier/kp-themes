export declare class IdmarkMoreList {
    doc: Document;
    rest: readonly import("../idmark.js").IdmarkPerson[];
    look: {
        round: boolean;
        colours: Map<string, number>;
    };
    strings: import("../strings/types.js").Strings;
    id: string;
    more: HTMLButtonElement;
    panel: HTMLDivElement;
    /** A press outside the button and the list closes the list. @param {Event} event */
    away: (event: Event) => void;
    /**
     * @param {Document} doc
     * @param {readonly import('../idmark.js').IdmarkPerson[]} rest the people left out of the group
     * @param {{ round: boolean, colours: Map<string, number> }} look
     */
    constructor(doc: Document, rest: readonly import('../idmark.js').IdmarkPerson[], look: {
        round: boolean;
        colours: Map<string, number>;
    });
    /** The button and the hidden list, wired. @returns {HTMLElement[]} */
    build(): HTMLElement[];
    /** The names left out, each with its small mark. */
    names(): HTMLUListElement;
    toggle(): void;
    close(): void;
}
