import { Controller } from '../controller.js';
export type NewPillOptions = import('../newpill.js').NewPillOptions;
/** @typedef {import('../newpill.js').NewPillOptions} NewPillOptions */
export declare class NewPillCore extends Controller {
    doc: Document;
    view: (Window & typeof globalThis) | null;
    pillOptions: import("../newpill.js").NewPillOptions;
    read: {
        strings: import("../strings/types.js").Strings;
        head: boolean;
        threshold: number;
        unitOne: string;
        unitMany: string;
        keyName: string;
        space: boolean;
        inTbody: boolean;
    };
    strings: import("../strings/types.js").Strings;
    head: boolean;
    pill: HTMLButtonElement;
    number: HTMLSpanElement;
    back: HTMLSpanElement;
    live: HTMLDivElement;
    following: boolean;
    paused: boolean;
    /** The rows that came while the reader was elsewhere. @type {Set<Element>} */
    unseen: Set<Element>;
    /** Whether the scroll in progress is our own, so it does not read as the reader leaving. */
    programmatic: boolean;
    /** In `tbody` mode: the keys of the rows already seen, so a sort or a filter that re-adds them counts none. @type {Set<string>} */
    known: Set<string>;
    lastSaid: number;
    /** @type {number | undefined} */
    sayLater: number | undefined;
    /**
     * @param {HTMLElement} host the scroller
     * @param {NewPillOptions} [options]
     */
    constructor(host: HTMLElement, options?: NewPillOptions);
    /** Set whether the list follows its end and whether the reader paused it. @param {boolean} following @param {boolean} paused */
    setFollowing(following: boolean, paused: boolean): void;
    /** The pill's end, read from the page's options and the attribute. */
    placementNow(): "bottom" | "top";
    /** How many unseen rows are still shown. */
    count(): number;
    atEnd(): boolean;
    /** Scroll to the end the rows arrive at, without it reading as the reader leaving. */
    toEnd(): void;
    /** The buttons that pause and resume this list. */
    toggles(): HTMLElement[];
    /** Whether the list is following and not paused. */
    isFollowing(): boolean;
}
