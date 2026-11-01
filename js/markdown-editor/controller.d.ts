import { Controller } from '../controller.js';
export declare class MarkdownEditor extends Controller {
    strings: import("../strings/types.js").Strings;
    area: HTMLTextAreaElement;
    preview: HTMLElement;
    tabs: HTMLElement;
    /** What a narrow editor shows: the text or the preview. @type {'write' | 'preview'} */
    view: 'write' | 'preview';
    /** The frame a preview waits for, so a burst of typing draws it once. */
    frame: number;
    /** @param {HTMLElement} host @param {{ strings?: Partial<import('../strings.js').Strings> }} [options] */
    constructor(host: HTMLElement, options?: {
        strings?: Partial<import('../strings.js').Strings>;
    });
    connect(): void;
    /** The Write / Preview tabs of a narrow editor. */
    buildTabs(): HTMLElement;
    /**
     * `data-kp-md-preview`: `side` (default: beside the text when wide, a tab when narrow), `tabs` (always a tab) or `off`.
     * @returns {'side' | 'tabs' | 'off'}
     */
    mode(): 'side' | 'tabs' | 'off';
    /** Lay out for the editor's own width and mode. */
    layout(): void;
    /** Draw the preview in the next frame, once however often the text changed. */
    schedule(): void;
    /** The preview, with ticking boxes; a box that had the focus has it again after the draw. */
    render(): void;
    /**
     * Make one change as one step the browser's undo takes back (`insertText`), or, where that is not offered, by hand with an
     * `input` event so the page hears it all the same.
     * @param {import('./edits.js').Edit} edit
     */
    apply({ from, to, text, select }: import('./edits.js').Edit): void;
    /** One tool. @param {string} id */
    use(id: string): void;
    /** @param {Event} event */
    onTool(event: Event): void;
    /** @param {'write' | 'preview'} view */
    show(view: 'write' | 'preview'): void;
    /** @param {KeyboardEvent} event */
    onBarKey(event: KeyboardEvent): void;
    /** Mod+B, Mod+I, Mod+K, and Enter in a list. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** A box ticked in the preview: its line in the text changes, heard by the page as `input`. @param {CustomEvent} event */
    onTick(event: CustomEvent): void;
}
