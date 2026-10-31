import { Controller } from '../controller.js';
export type ConsoleRun = import('./types.js').ConsoleRun;
/** One console: its state is the `STATE` registry entry every part reads; the order and the new-pill watch sit on the instance. */
export declare class ConsoleControl extends Controller {
    st: import("./types.js").ConsoleState;
    run: import("./types.js").ConsoleRun | undefined;
    complete: ((prefix: string) => string[] | Promise<string[]>) | undefined;
    /** The order the console is drawn in, so a change of it moves the bar. */
    order: string;
    /** Stops the new-pill watch of the body; it is made again when the order turns. */
    stopPill: () => void;
    /** The console's parts, found once drawAll() has drawn them in connect(). */
    parts: {
        body: HTMLElement;
        form: HTMLFormElement;
        input: HTMLInputElement;
        select: HTMLSelectElement;
        complete: HTMLElement;
    };
    /** @param {HTMLElement} host @param {{ run?: ConsoleRun, complete?: (prefix: string) => string[] | Promise<string[]> }} [options] */
    constructor(host: HTMLElement, options?: {
        run?: ConsoleRun;
        complete?: (prefix: string) => string[] | Promise<string[]>;
    });
    connect(): void;
    /** The keys, through the engine: the clear key, and the one that jumps to the prompt from anywhere. */
    keys(): import("../shortcuts.js").Shortcut[];
    /** An option changed (its attribute): the console is drawn again; a new order moves the bar and the new-pill watch. */
    onOptions(): void;
    /** @param {string} now the new order */
    reorder(now: string): void;
    /** Up and Down walk the history, Esc closes the completions or clears the line, Tab completes, a key drops a pending confirm. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): Promise<void>;
    /** Walk the history; the line typed before the walk comes back at its end. @param {KeyboardEvent} event */
    walk(event: KeyboardEvent): void;
    /** One completion fills the line; several are offered as buttons and counted aloud. @param {string[]} found */
    offer(found: string[]): void;
    /** A block's tool, a completion, Retry, or the earlier blocks. @param {Event} event */
    onClick(event: Event): void;
}
