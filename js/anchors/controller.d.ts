import { AnchorMarks } from './marks.js';
export declare class AnchorBox extends AnchorMarks {
    /** The notice of a hash without a place. @type {HTMLElement | null} */
    notice: HTMLElement | null;
    waitTimer: number;
    /** The place a link landed on, while it is marked. @type {HTMLElement | null} */
    lit: HTMLElement | null;
    litTimer: number;
    /** The timers that take "Copied" off the marks. @type {number[]} */
    timers: number[];
    /** Whether a scan is queued for the end of this task. */
    scheduled: boolean;
    /** @param {HTMLElement} box @param {import('../anchors.js').AnchorOptions} [options] */
    constructor(box: HTMLElement, options?: import('../anchors.js').AnchorOptions);
    connect(): void;
    takeDown(): void;
    changed(): void;
    clearNotice(): void;
    /** Open every closed `<details>` around the place, unless the container says not to. @param {HTMLElement} target */
    reveal(target: HTMLElement): void;
    /** @param {string} id @returns {boolean} whether there was a place to land */
    land(id: string): boolean;
    /** Mark the place a link landed on for a moment. @param {HTMLElement} target */
    light(target: HTMLElement): void;
    /** The notice of a hash without a place, with Show all, which drops the hash. @param {string} id */
    showMissing(id: string): void;
    idOfHash(): string;
    /** Land on the hash, waiting for a place that is still being drawn. */
    arrive(): void;
    /** A press copies; with Shift, as a Markdown link. @param {Event} event */
    onClick(event: Event): Promise<void>;
    /** The `y l` provider: a way to copy the focused row's link, or null when no row of this container is focused. */
    copyFocused(): (() => undefined) | null;
    /** @param {HTMLElement} el @param {HTMLButtonElement} button @param {boolean} [markdownWanted] */
    copyLink(el: HTMLElement, button: HTMLButtonElement, markdownWanted?: boolean): Promise<void>;
    /** The mark says Copied (a tick on a row) or that it failed, and the voice says it. @param {HTMLElement} el @param {HTMLButtonElement} button @param {boolean} ok */
    showCopied(el: HTMLElement, button: HTMLButtonElement, ok: boolean): void;
}
