export type AvState = import('./types.js').AvState;
export type AvailabilityAnswer = import('./types.js').AvailabilityAnswer;
export type AvailabilityPerson = import('./types.js').AvailabilityPerson;
/** @typedef {import('./types.js').AvState} AvState */
/** @typedef {import('./types.js').AvailabilityAnswer} AvailabilityAnswer */
/** @typedef {import('./types.js').AvailabilityPerson} AvailabilityPerson */
/** @type {WeakMap<Element, AvState>} */
export declare const STATE: WeakMap<Element, AvState>;
/** @param {string} className @param {string} [tag] */
export declare const el: (className: string, tag?: string) => HTMLElement;
/** @param {Element} root @param {string} name @param {string} fallback */
export declare const attr: (root: Element, name: string, fallback: string) => string;
export declare const cellKey: (/** @type {string} */ person: string, /** @type {string} */ column: string) => string;
/** @param {AvailabilityAnswer | undefined} a */
export declare const toneOf: (a: AvailabilityAnswer | undefined) => "bad" | "muted" | "ok" | "warn";
/** @param {AvailabilityAnswer | undefined} a */
export declare const glyphOf: (a: AvailabilityAnswer | undefined) => "" | "~" | "×" | "✓";
/** @param {AvailabilityAnswer | undefined} a */
export declare const wordOf: (a: AvailabilityAnswer | undefined) => string;
/** @param {HTMLElement} root */
export declare const stateOf: (root: HTMLElement) => AvState;
/** The answers allowed by the root. @param {HTMLElement} root @returns {AvailabilityAnswer[]} */
export declare const allowed: (root: HTMLElement) => AvailabilityAnswer[];
/** Whether this person's cell in this column can be changed now. @param {HTMLElement} root @param {string} person @param {string} column */
export declare function editable(root: HTMLElement, person: string, column: string): boolean;
/** The best column or columns, as keys. @param {HTMLElement} root @returns {string[]} */
export declare function availabilityBest(root: HTMLElement): string[];
/** The people in the order the grid shows them. @param {HTMLElement} root */
export declare function ordered(root: HTMLElement): import("./types.js").AvailabilityPerson[];
/** Everything one column says about itself. @param {HTMLElement} root @param {string} key */
export declare function columnFacts(root: HTMLElement, key: string): {
    names: Record<import("./types.js").AvailabilityAnswer, string[]>;
    yes: number;
    maybe: number;
    no: number;
    answered: number;
    total: number;
};
/** The hover card's words for a column. @param {ReturnType<typeof columnFacts>} f */
export declare function tipOf(f: ReturnType<typeof columnFacts>): string;
