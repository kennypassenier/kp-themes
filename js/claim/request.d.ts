export type ClaimDetail = import('./types.js').ClaimDetail;
export type ClaimPerson = import('./types.js').ClaimPerson;
/**
 * Ask for a change: the page hears it, may settle it with a promise, and the row ends up as the answer says.
 * @param {HTMLElement} list @param {string} id @param {ClaimDetail['action']} action @param {ClaimPerson | null} person
 * @param {{ undo?: boolean }} [options]
 */
export declare function request(list: HTMLElement, id: string, action: ClaimDetail['action'], person: ClaimPerson | null, { undo }?: {
    undo?: boolean;
}): Promise<void>;
/** @param {HTMLElement} list @param {HTMLElement} row */
export declare function press(list: HTMLElement, row: HTMLElement): void;
