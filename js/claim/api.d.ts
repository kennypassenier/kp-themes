export type ClaimInfo = import('./types.js').ClaimInfo;
export type ClaimPerson = import('./types.js').ClaimPerson;
/** @typedef {import('./types.js').ClaimInfo} ClaimInfo */
/** @typedef {import('./types.js').ClaimPerson} ClaimPerson */
/**
 * Say who is looking. Their button is the live one, their name the held face.
 * @param {Element} list @param {ClaimPerson | null} viewer
 */
export declare function setClaimViewer(list: Element, viewer: ClaimPerson | null): void;
/**
 * Give the assign menu its people (the viewer is added first when missing).
 * @param {Element} list @param {ClaimPerson[]} people
 */
export declare function setClaimPeople(list: Element, people: ClaimPerson[]): void;
/** The filter now shown. @param {Element} list */
export declare function claimFilter(list: Element): string;
/**
 * A push update: the item's claim as the server says it now, without an event.
 * @param {Element} list @param {string} id @param {ClaimInfo} claim
 */
export declare function setClaim(list: Element, id: string, claim: ClaimInfo): void;
