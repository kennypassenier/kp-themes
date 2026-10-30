import { Controller } from '../controller.js';
import { getStrings } from '../strings.js';
export type Notice = import('../notices.js').Notice;
export type NoticesModel = import('../notices.js').NoticesModel;
export type NoticesHandle = import('../notices.js').NoticesHandle;
export declare class NoticesView extends Controller {
    doc: Document;
    /** @type {NoticesModel} */
    model: NoticesModel;
    /** Keys read in this page, beside the ones the model says are read. */
    readKeys: Set<any>;
    /** The keys of the last refresh; null before the first, so the first list is not announced as new. @type {Set<string> | null} */
    seen: Set<string> | null;
    /** @type {import('../busy-card.js').BusyCard | null} */
    busy: import('../busy-card.js').BusyCard | null;
    /** The tab title without our count, and whether the count is in it now. */
    baseTitle: string;
    titled: boolean;
    /** The parts, built in connect(). @type {import('./parts.js').NoticeParts} */
    p: import('./parts.js').NoticeParts;
    /** @param {HTMLElement} el */
    constructor(el: HTMLElement);
    look(): string;
    isPage(): boolean;
    items(): import("../notices.js").Notice[];
    /** @param {Notice} n */
    isRead(n: Notice): boolean;
    unread(): import("../notices.js").Notice[];
    /** The number the counter shows: `data-kp-count` when given, else the unread notices. */
    countNow(): number;
    ordered(): import("../notices.js").Notice[];
    /** The end of a quiet time still ahead [epoch ms], or null. */
    quiet(): number | null;
    quietText(): string;
    counterText(): string;
    counterLabel(): string;
    /** @param {NoticesModel} next */
    set(next: NoticesModel): void;
    render(): void;
    /** The counter, the quiet line and the panel's head and foot. @param {ReturnType<typeof getStrings>} t @param {string} st */
    renderHead(t: ReturnType<typeof getStrings>, st: string): void;
    /** The rows when ready, else the empty or error plate in their place. @param {ReturnType<typeof getStrings>} t @param {string} st */
    renderList(t: ReturnType<typeof getStrings>, st: string): void;
    /** @param {ReturnType<typeof getStrings>} t */
    errorPlate(t: ReturnType<typeof getStrings>): HTMLElement;
    /** The theme's busy card over the list while loading. @param {ReturnType<typeof getStrings>} t @param {string} st */
    renderBusy(t: ReturnType<typeof getStrings>, st: string): void;
    /** A switch per source, on the Inbox page only. @param {ReturnType<typeof getStrings>} t */
    renderSources(t: ReturnType<typeof getStrings>): void;
    /** Which row, and which of its controls, has the focus before a render replaces the rows. */
    focusNow(): {
        key: string | null;
        control: string;
    };
    /** Keep the focus where it was across a live refresh. @param {{ key: string | null, control: string }} focus */
    restoreFocus({ key, control }: {
        key: string | null;
        control: string;
    }): void;
    /** "(5) " in front of the tab title while there are unread notices, unless `data-kp-count-in-title="off"`. */
    paintTitle(): void;
    /** New notices are announced once, critical ones assertively; a toast for the severe ones. @param {Notice[]} fresh */
    announce(fresh: Notice[]): void;
}
