import { Controller } from '../controller.js';
import { toggleGroup } from './group.js';
export declare class ToggleParts extends Controller {
    button: HTMLElement;
    doc: Document;
    s: import("../strings/types.js").Strings;
    /** @type {HTMLElement | null} */
    label: HTMLElement | null;
    /** The tick, kept in step with `data-kp-pressed-mark` while the toggle lives. @type {HTMLElement | null} */
    mark: HTMLElement | null;
    /** @type {HTMLElement | null} */
    count: HTMLElement | null;
    /** @type {HTMLElement | null} */
    hint: HTMLElement | null;
    /** The refusal's word, laid over the button while it is shown. @type {HTMLElement | null} */
    refusedWord: HTMLElement | null;
    /** The spinner, laid over the button while it works. @type {HTMLElement | null} */
    spinner: HTMLElement | null;
    /** @type {number | undefined} */
    sayTimer: number | undefined;
    /** @param {HTMLElement} button @param {import('../toggle.js').ToggleOptions} [options] */
    constructor(button: HTMLElement, options?: import('../toggle.js').ToggleOptions);
    /** Set an attribute the page left out, and take it off again on detach. @param {string} name @param {string} value */
    stamp(name: string, value: string): void;
    /** The words are wrapped only when there is something to put beside them, so a plain toggle keeps its markup. */
    ensureLabel(): void;
    syncMark(): void;
    makeCount(): void;
    /** A count made by the page's script (setCount) on a toggle whose markup had none. */
    ensureCount(): void;
    /** The refusal's word over the button, with the app's reason as its title. @param {string} word @param {string} [message] */
    showRefused(word: string, message?: string): void;
    /** @param {string} [message] */
    hideRefused(message?: string): void;
    makeHint(): void;
    /** The exact number beside the label, a skeleton while it is counted, or none. @param {number | 'loading' | null} n */
    writeCount(n: number | 'loading' | null): void;
    writeHint(): void;
    labelText(): string;
    /** The group's live line (or the parent's, for a lone toggle), made once per container. @param {ReturnType<typeof toggleGroup>} g */
    regionOf(g: ReturnType<typeof toggleGroup>): HTMLElement | null;
    /** @param {string} text */
    say(text: string): void;
    /** The Clear button and its count, kept in step by whichever member changed last. */
    paintClear(): void;
    /** Everything off but the All member (a Clear press, or pressing All). @param {HTMLElement} from */
    clearGroup(from: HTMLElement): void;
    /** The press; ToggleControl gives it. @param {HTMLElement} _member @param {boolean} [_forceClear] */
    press(_member: HTMLElement, _forceClear?: boolean): void;
    /** @param {boolean} on */
    setBusy(on: boolean): void;
}
