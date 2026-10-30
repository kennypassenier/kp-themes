import { UploadCore } from './core.js';
export declare class UploadZone extends UploadCore {
    /** What the page gets back, the same object every time. @type {import('../upload.js').UploadHandle} */
    handle: import('../upload.js').UploadHandle;
    /**
     * @param {HTMLElement} host
     * @param {import('./core.js').UploadOptions} [options]
     */
    constructor(host: HTMLElement, options?: import('./core.js').UploadOptions);
    connect(): void;
    onChange(): void;
    /** @param {Event} event */
    onListClick(event: Event): void;
    /**
     * The zone takes the drag at its first event. Before, only dragover was
     * answered: dragenter went uncancelled and set nothing, and the HTML
     * drag-and-drop model then makes the body the drop target, so the zone
     * need never see a dragover — Kenny dragged a real file over the live
     * zone and saw no change (second nostromo pass, 2026-09-13).
     *
     * @param {DragEvent} event
     */
    onDragEnter(event: DragEvent): void;
    /** @param {DragEvent} event */
    onDragOver(event: DragEvent): void;
    /**
     * Leaving for a child of the zone is not leaving: an icon inside a
     * consumer's zone would otherwise switch the state off under the pointer.
     *
     * @param {DragEvent} event
     */
    onDragLeave(event: DragEvent): void;
    /** @param {DragEvent} event */
    onDrop(event: DragEvent): void;
}
