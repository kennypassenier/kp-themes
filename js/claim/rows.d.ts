import { getChecklistItems } from '../checklist.js';
export type ClaimInfo = import('./types.js').ClaimInfo;
export type ClaimPerson = import('./types.js').ClaimPerson;
/** @typedef {import('./types.js').ClaimInfo} ClaimInfo */
/** @typedef {import('./types.js').ClaimPerson} ClaimPerson */
/** @param {HTMLElement} list */
export declare const mode: (list: HTMLElement) => "assign" | "claim";
/** Whether this person is one of those who bring the item. @param {ClaimPerson | null} person @param {ClaimPerson[]} by */
export declare const among: (person: ClaimPerson | null, by: ClaimPerson[]) => boolean;
/** Words for a list of names: "Tom", "Tom and Anna", "Tom, Anna and Bo". @param {string[]} names */
export declare function joinNames(names: string[]): string;
/** Why a row cannot be pressed now, or null. @param {HTMLElement} list @param {{ claim?: ClaimInfo }} item @param {ClaimPerson[]} by */
export declare function whyOff(list: HTMLElement, item: {
    claim?: ClaimInfo;
}, by: ClaimPerson[]): string | null;
/** Fill one row's cell from its item. @param {HTMLElement} list @param {HTMLElement} row @param {ReturnType<typeof getChecklistItems>[number]} item */
export declare function fillRow(list: HTMLElement, row: HTMLElement, item: ReturnType<typeof getChecklistItems>[number]): void;
