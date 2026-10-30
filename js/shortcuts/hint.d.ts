export type EngineOptions = import('../shortcuts.js').EngineOptions;
/** @typedef {import('../shortcuts.js').EngineOptions} EngineOptions */
export declare class ChordHint {
    config: import("../shortcuts.js").EngineOptions;
    /** @type {HTMLElement | null} */
    el: HTMLElement | null;
    /** @type {number} */
    timer: number;
    /** @param {EngineOptions} config the board's settings, read each time */
    constructor(config: EngineOptions);
    /** @param {string} text @param {string} [role] */
    show(text: string, role?: string): void;
    /** The cap's place: the engine's option, else the root's attribute (read by the stylesheet as well), else centre. */
    place(): void;
    hide(): void;
    /** Run `end` after `ms`, replacing any timer that was running. @param {() => void} end @param {number} ms */
    arm(end: () => void, ms: number): void;
    /** @param {string[]} typed @param {boolean} unknown */
    chord(typed: string[], unknown: boolean): void;
    /** The "…" cap and its words for a screen reader. @param {HTMLElement} hint */
    appendWaiting(hint: HTMLElement): void;
}
