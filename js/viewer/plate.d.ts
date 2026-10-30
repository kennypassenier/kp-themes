/**
 * @param {Document} doc
 * @param {'error' | 'unsupported'} state
 * @param {{ message?: string, retry?: () => void, title?: string }} detail
 * @param {readonly import('../viewer.js').ViewerAction[]} actions the viewer's actions, whose ways out an unsupported plate repeats
 * @param {import('../strings.js').Strings} strings
 */
export declare function buildPlate(doc: Document, state: 'error' | 'unsupported', detail: {
    message?: string;
    retry?: () => void;
    title?: string;
}, actions: readonly import('../viewer.js').ViewerAction[], strings: import('../strings.js').Strings): HTMLElement;
