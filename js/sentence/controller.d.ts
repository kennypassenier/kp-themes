import { Controller } from '../controller.js';
export type ComputedFn = import('../sentence.js').ComputedFn;
export type SentenceHandle = import('../sentence.js').SentenceHandle;
export declare class Sentence extends Controller {
    doc: Document;
    id: string;
    /** What a narrow line does: `wrap` (a wide field takes its own line), `stack` or `flow`. */
    narrow: string;
    ratio: number;
    /** The functions behind the computed fields, by `data-kp-sentence-computed`. @type {Map<string, ComputedFn>} */
    fns: Map<string, ComputedFn>;
    /** Whether a throwing computed function was already reported: once per sentence, not on every keystroke. */
    warnedComputed: boolean;
    timer: number;
    /** The polite live region that reads the summary. */
    live: HTMLParagraphElement;
    /** @type {HTMLElement | null} */
    reasonLine: HTMLElement | null;
    /** The line under the sentence. @type {HTMLElement} */
    line: HTMLElement;
    /** What sentence(el) hands the page. @type {SentenceHandle} */
    handle: SentenceHandle;
    /** @param {HTMLElement} el @param {{ computed?: Record<string, ComputedFn> }} [options] */
    constructor(el: HTMLElement, options?: {
        computed?: Record<string, ComputedFn>;
    });
    connect(): void;
    /**
     * A select in a sentence opens the package's drawn list (the combobox's own plate, js/combobox.js), not the browser's,
     * which Firefox paints from the transparent field: almost black in formal [Kenny, 2026-10-17 22:09].
     * `data-kp-select="native"` on a select keeps the browser's.
     */
    drawSelects(): void;
    /** The line under the sentence, the reason a disabled one is off, and the summary a screen reader hears. */
    mountLines(): void;
    /** Every control has a name of its own: the words before it when the page gave none. */
    nameControls(): void;
    /** Show the phrases whose condition holds, hide the others and take their controls out of reach. */
    phrases(): void;
    /** A field that is more of the line than it may be takes a line of its own. */
    place(): void;
    /** Work every computed field out from the controls as they stand. */
    compute(): void;
    /** One computed function; one that throws is reported once and its field shows the dash. @param {string} name @param {ComputedFn} fn @param {Record<string, string | null>} values */
    run(name: string, fn: ComputedFn, values: Record<string, string | null>): string | number | null | undefined;
    refresh(): void;
    /** @param {string} name @param {ComputedFn | null} fn */
    setCompute(name: string, fn: ComputedFn | null): void;
    say(): void;
    onChange(): void;
    /** Enter in the last field submits the form the sentence is (or is in). @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
}
