import { getStrings } from '../strings.js';
export type Memory = import('./format.js').Memory;
export type CapturedRequest = import('./format.js').CapturedRequest;
export type InspectorOptions = import('./format.js').InspectorOptions;
export type Strings = ReturnType<typeof getStrings>;
/**
 * @param {HTMLElement} el @param {Memory} memory @param {CapturedRequest} request @param {number} index its place among the shown
 * @param {number} slot its place among all, for its key
 */
export declare function drawRequest(el: HTMLElement, memory: Memory, request: CapturedRequest, index: number, slot: number): HTMLDetailsElement;
