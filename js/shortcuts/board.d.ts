import { ChordHint } from './hint.js';
export type Entry = import('../shortcuts.js').Entry;
export type EngineOptions = import('../shortcuts.js').EngineOptions;
export type Pending = {
    candidates: Entry[];
    index: number;
    at: number;
    shown: string;
};
/** @typedef {import('../shortcuts.js').Entry} Entry */
/** @typedef {import('../shortcuts.js').EngineOptions} EngineOptions */
/** @typedef {{ candidates: Entry[], index: number, at: number, shown: string }} Pending */
export declare class ShortcutBoard {
    /** @type {Required<Pick<EngineOptions, 'chordMs' | 'layoutGuard' | 'typingSelector' | 'unknownHint'>> & EngineOptions} */
    config: Required<Pick<EngineOptions, 'chordMs' | 'layoutGuard' | 'typingSelector' | 'unknownHint'>> & EngineOptions;
    /** @type {Set<Entry>} */
    entries: Set<Entry>;
    /** The next registration's rank, so keys keep the order they were registered in. */
    order: number;
    /** @type {Pending | null} */
    pending: Pending | null;
    listening: boolean;
    queued: boolean;
    hint: ChordHint;
    handler: (event: KeyboardEvent) => void;
    constructor();
    /** Change the engine's defaults for the whole page. @param {EngineOptions} next */
    configure(next: EngineOptions): void;
    /** @returns {boolean} */
    inDevelopment(): boolean;
    /** @param {string} message */
    warn(message: string): void;
    /** @param {EventTarget | null} target */
    typing(target: EventTarget | null): boolean;
    /** The entries whose scope is on screen. */
    active(): import("../shortcuts.js").Entry[];
    /** The active entries whose first step this event presses. @param {KeyboardEvent} event */
    startedBy(event: KeyboardEvent): import("../shortcuts.js").Entry[];
    /** The registered shortcuts, for a consumer's own listing. @returns {{ keys: string, what: string, group: string, scope: string, available: boolean }[]} */
    list(): {
        keys: string;
        what: string;
        group: string;
        scope: string;
        available: boolean;
    }[];
    /** Tells the page whether a chord waits for its next key. */
    announcePending(): void;
    /**
     * Whether the engine would take this key: a chord waits for its next key, or a registered shortcut that is on screen
     * starts with it (a letter not while a person types in a field).
     * @param {KeyboardEvent} event
     * @returns {boolean}
     */
    claims(event: KeyboardEvent): boolean;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** Drop the chord and its cap. */
    clearChord(): void;
    /** @param {KeyboardEvent} event */
    handleKey(event: KeyboardEvent): void;
    /** The chord's next key matched nothing: say so if asked, then let the key begin a shortcut of its own. @param {Pending} live @param {KeyboardEvent} event @param {number} now */
    chordMissed(live: Pending, event: KeyboardEvent, now: number): void;
    /** More than one step is left: show the cap and wait for the next key. @param {Entry[]} more @param {number} index @param {Pending | null} live @param {KeyboardEvent} event @param {number} now */
    waitForNext(more: Entry[], index: number, live: Pending | null, event: KeyboardEvent, now: number): void;
    /** Run the first available shortcut of a finished chord. @param {Entry[]} done @param {KeyboardEvent} event */
    runFirst(done: Entry[], event: KeyboardEvent): void;
    /** @param {KeyboardEvent} event @param {number} now */
    startFresh(event: KeyboardEvent, now: number): void;
    /** The key listener goes on with the first registration. */
    listen(): void;
    /** ... and off with the last. */
    unlisten(): void;
    /** Refill every live sheet once, after the current task. */
    queueSheets(): void;
}
