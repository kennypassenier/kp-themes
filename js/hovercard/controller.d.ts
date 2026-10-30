import { HoverCardTouch } from './touch.js';
export declare class HoverCard extends HoverCardTouch {
    /** The detach function, with the card's members on it. @type {import('../hovercard.js').HoverCardHandle} */
    handle: import('../hovercard.js').HoverCardHandle;
    /**
     * @param {Document | Element} root
     * @param {import('../hovercard.js').HoverCardOptions} [options]
     */
    constructor(root: Document | Element, options?: import('../hovercard.js').HoverCardOptions);
    connect(): void;
    /** The detach function a page gets, with the card's members on it. @returns {import('../hovercard.js').HoverCardHandle} */
    makeHandle(): import('../hovercard.js').HoverCardHandle;
    /** @param {PointerEvent} event */
    onOver(event: PointerEvent): void;
    /** @param {PointerEvent} event */
    onOut(event: PointerEvent): void;
    onCardEnter(): void;
    /** @param {PointerEvent} event */
    onCardLeave(event: PointerEvent): void;
    /** @param {FocusEvent} event */
    onFocusIn(event: FocusEvent): void;
    /** @param {FocusEvent} event */
    onFocusOut(event: FocusEvent): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
}
