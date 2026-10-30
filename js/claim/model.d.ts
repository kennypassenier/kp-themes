export type ClaimInfo = import('./types.js').ClaimInfo;
export type ClaimPerson = import('./types.js').ClaimPerson;
export type ClaimState = import('./types.js').ClaimState;
/** @param {string} className @param {string} [tag] */
export declare const el: (className: string, tag?: string) => HTMLElement;
/** @param {ClaimPerson | ClaimPerson[] | null | undefined} by @returns {ClaimPerson[]} */
export declare function claimPeople(by: ClaimPerson | ClaimPerson[] | null | undefined): ClaimPerson[];
/** @param {Element} list @param {string} name @param {string} fallback */
export declare const attr: (list: Element, name: string, fallback: string) => string;
/** @param {Element} list */
export declare const stateOf: (list: Element) => import("./types.js").ClaimState;
/** @param {HTMLElement} list @param {string} message */
export declare function say(list: HTMLElement, message: string): void;
/** The claim of an item as a normalised list. @param {{ claim?: ClaimInfo }} item */
export declare const byOf: (item: {
    claim?: ClaimInfo;
}) => import("./types.js").ClaimPerson[];
/** @param {HTMLElement} list @param {string} id */
export declare const itemOf: (list: HTMLElement, id: string) => import("../checklist.js").ChecklistItem | undefined;
/**
 * Write a new claim onto one item, through the checklist so the rows are changed in place.
 * @param {HTMLElement} list @param {string} id @param {ClaimPerson[]} by
 */
export declare function write(list: HTMLElement, id: string, by: ClaimPerson[]): void;
