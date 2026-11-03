/**
 * Ask the question next to `anchor`; Discard runs `onAccept`, Keep editing (or Escape) runs `onCancel`.
 * @param {HTMLElement} anchor @param {{ onAccept: () => void, onCancel: () => void }} answers
 */
export declare function openDiscardQuestion(anchor: HTMLElement, { onAccept, onCancel }: {
    onAccept: () => void;
    onCancel: () => void;
}): HTMLDialogElement;
