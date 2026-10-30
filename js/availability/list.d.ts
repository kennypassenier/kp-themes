export type AvailabilityPerson = import('./types.js').AvailabilityPerson;
/**
 * A loading list per column holds the data table's busy card, centred over the whole list; any other state holds none.
 * @param {HTMLElement} root @param {HTMLElement} body @param {boolean} on
 */
export declare function syncListCard(root: HTMLElement, body: HTMLElement, on: boolean): void;
/**
 * A list per column, the same data for a narrow screen. `waiting`: the rows stand without answers, for a loading state.
 * @param {HTMLElement} root @param {AvailabilityPerson[]} people @param {boolean} [waiting]
 */
export declare function columnsList(root: HTMLElement, people: AvailabilityPerson[], waiting?: boolean): HTMLElement;
