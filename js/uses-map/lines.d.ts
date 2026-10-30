export type UsesModel = import('./model.js').UsesModel;
export type Held = {
    l: number;
    r: number;
    t: number;
    b: number;
};
/** @typedef {{ l: number, r: number, t: number, b: number }} Held */
export declare class UsesLines {
    m: import("./model.js").UsesModel;
    root: HTMLElement;
    svg: Element;
    /** @type {Map<string, SVGPathElement[]>} */
    lines: Map<string, SVGPathElement[]>;
    /** The words on the lines that have some, by `"<source>><user>"` [r3r5-1019 line-tone]. @type {Map<string, HTMLElement>} */
    tags: Map<string, HTMLElement>;
    /** @param {UsesModel} m @param {HTMLElement} root @param {Element} svg */
    constructor(m: UsesModel, root: HTMLElement, svg: Element);
    /** One path per line, made once, and the plate of each line that has words. */
    build(): void;
    /** @param {string} pair @param {string} source @param {string} key @param {import('../uses-map.js').UsesLine} info */
    addTag(pair: string, source: string, key: string, info: import('../uses-map.js').UsesLine): void;
    /** @param {string} key @returns {Element | null | undefined} the card of a node */
    cardOfKey(key: string): Element | null | undefined;
    /** Draw every path between its two cards, then the plates. */
    place(): void;
    /** @param {DOMRect} box @param {DOMRect} a the source's card @param {string} source @param {string} key */
    placePath(box: DOMRect, a: DOMRect, source: string, key: string): void;
    /**
     * The words of each line stand on the line, inside the gap between the columns (never over a card): the plate is as wide as the
     * gap allows and its words wrap, and it moves along its line to a place that no other plate holds. One that finds no place is
     * shown only while its line is lit [r3r5-1019 line-tone].
     * @param {DOMRect} box
     */
    placeTags(box: DOMRect): void;
    /** @param {HTMLElement} tag @param {SVGPathElement} path @param {number} length @param {Held[]} held */
    placeTag(tag: HTMLElement, path: SVGPathElement, length: number, held: Held[]): void;
    /** What is lit: a key and everything it touches, or nothing. @param {string | null} key */
    light(key: string | null): void;
    /** Take the plates off the map. */
    dispose(): void;
}
