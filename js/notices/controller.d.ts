import { NoticesView } from './view.js';
export declare class NoticesCentre extends NoticesView {
    /** When `g` was last pressed [ms], for the g-then-i shortcut. */
    gAt: number;
    /** What noticesOf(el) hands the page. @type {import('../notices.js').NoticesHandle} */
    handle: import('../notices.js').NoticesHandle;
    /** @param {HTMLElement} el */
    constructor(el: HTMLElement);
    connect(): void;
    /** @param {string} type @param {object} detail @param {boolean} [cancelable] */
    emit(type: string, detail: object, cancelable?: boolean): boolean;
    /** @param {Event} event */
    onClick(event: Event): void;
    /** Mark one notice read, or unread again. @param {string} key */
    toggleRead(key: string): void;
    readAll(): void;
    /** A source switch flipped. @param {Event} event */
    onChange(event: Event): void;
    /** With `data-kp-read="on-open"`, opening the panel reads everything. @param {ToggleEvent} event */
    onToggle(event: ToggleEvent): void;
    /** The keys: g then i opens the Inbox, m marks the focused notice read. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
}
