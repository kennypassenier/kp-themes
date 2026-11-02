import { Controller } from '../controller.js';
export type SwipeAction = import('./constants.js').SwipeAction;
/** @typedef {import('./constants.js').SwipeAction} SwipeAction */
/** `key:Words:tone` → an action, or null. @param {string | null} text @returns {SwipeAction | null} */
export declare function parseAction(text: string | null): SwipeAction | null;
export declare class SwipeControl extends Controller {
    connect(): void;
    /** A press that may become a swipe, or null. @param {PointerEvent} e */
    start(e: PointerEvent): import("./gesture.js").Gesture | null;
    /** The action of a side, as the list says now. @param {'start' | 'end'} side */
    actionOf(side: 'start' | 'end'): import("./constants.js").SwipeAction | null;
    /** @param {HTMLElement} row @param {SwipeAction} action */
    fire(row: HTMLElement, action: SwipeAction): void;
    /** The one polite line the swipes are said in. */
    makeLive(): HTMLSpanElement;
}
