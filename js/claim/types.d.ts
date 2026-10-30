export type ClaimPerson = {
    id: string;
    name: string;
};
export type ClaimInfo = {
    /**
     * who brings it
     */
    by?: ClaimPerson | ClaimPerson[] | null;
    /**
     * the reason nobody can change it ("Already packed in the van")
     */
    locked?: string;
};
export type ClaimDetail = {
    id: string;
    action: 'join' | 'leave' | 'assign' | 'unassign' | 'restore' | 'take-all';
    /**
     * who the change is about
     */
    person: ClaimPerson | null;
    /**
     * who bring it after the change
     */
    by: ClaimPerson[];
    previousBy: ClaimPerson[];
    /**
     * hold the row on its spinner until the server has answered
     */
    settle: (answer: Promise<unknown>) => void;
};
export type ClaimState = {
    viewer: ClaimPerson | null;
    people: ClaimPerson[];
    busy: Set<string>;
    refused: Map<string, number>;
    filter: string;
    said: string;
};
/**
 * @typedef {object} ClaimPerson
 * @property {string} id
 * @property {string} name
 */
/**
 * What an item carries as `claim`. `by` may also be one person or null.
 * @typedef {object} ClaimInfo
 * @property {ClaimPerson | ClaimPerson[] | null} [by]  who brings it
 * @property {string} [locked]  the reason nobody can change it ("Already packed in the van")
 */
/**
 * @typedef {object} ClaimDetail
 * @property {string} id
 * @property {'join' | 'leave' | 'assign' | 'unassign' | 'restore' | 'take-all'} action
 * @property {ClaimPerson | null} person  who the change is about
 * @property {ClaimPerson[]} by  who bring it after the change
 * @property {ClaimPerson[]} previousBy
 * @property {(answer: Promise<unknown>) => void} settle  hold the row on its spinner until the server has answered
 */
/** @typedef {{ viewer: ClaimPerson | null, people: ClaimPerson[], busy: Set<string>, refused: Map<string, number>, filter: string, said: string }} ClaimState */
export {};
