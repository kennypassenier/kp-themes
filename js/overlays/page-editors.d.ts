export type EditorOptions = {
    /**
     * the editor; it is dropped once it left the page, and a Discard is released on its next edit
     */
    element: HTMLElement;
    /**
     * true while it holds text the server does not (an error counts as true: asking beats losing text)
     */
    isDirty: () => boolean;
    /**
     * saves it now; runs before the question, and `isDirty()` must tell afterwards whether it worked
     */
    flush?: () => Promise<unknown>;
    /**
     * Discard was chosen: throw the text away
     */
    discard?: () => void;
    /**
     * the text survives a move to another screen: only a reload or closed tab counts it
     */
    reloadOnly?: boolean;
};
/**
 * Register an editor; returns the unregister.
 * @param {EditorOptions} editor
 */
export declare function registerEditor(editor: EditorOptions): () => undefined;
/**
 * The editors that hold unsaved text now, as guard units.
 * @param {{ reload?: boolean }} [options] `reload`: also the ones that survive a screen change
 * @returns {import('./guard-question.js').GuardUnit[]}
 */
export declare function editorUnits({ reload }?: {
    reload?: boolean;
}): import('./guard-question.js').GuardUnit[];
/** @type {[string, (event: Event) => void][]} */
export declare const EDITOR_LISTENERS: [string, (event: Event) => void][];
