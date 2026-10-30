import { Controller } from '../controller.js';
export type GalleryItem = import('./constants.js').GalleryItem;
export type GallerySpec = import('./constants.js').GallerySpec;
/** @typedef {import('./constants.js').GalleryItem} GalleryItem */
/** @typedef {import('./constants.js').GallerySpec} GallerySpec */
/** A gallery. It lives as long as its element: written by `update()`, never detached. */
export declare class Gallery extends Controller {
    el: HTMLElement;
    /** The pictures. @type {GalleryItem[]} */
    items: GalleryItem[];
    /** What the page last gave: the items' state, the words, the actions. @type {GallerySpec} */
    spec: GallerySpec;
    /** The busy card laid over a loading gallery. @type {import('../busy-card.js').BusyCard | null} */
    card: import('../busy-card.js').BusyCard | null;
    /** The reason the add tile is off, else null. @type {string | null} */
    uploading: string | null;
    /** The open lightbox's viewer. @type {import('../viewer.js').ViewerHandle | null} */
    viewer: import('../viewer.js').ViewerHandle | null;
    /** The id of the picture the lightbox shows. @type {string | null} */
    openId: string | null;
    /** @param {HTMLElement} host */
    constructor(host: HTMLElement);
    /** The key a gallery remembers its last picture under. */
    rememberKey(): string | null;
    /** The picture this gallery last opened on this device, or null. */
    last(): string | null;
    /** Take what the page gave. Items given without a state mean the data arrived: ready (or empty), not still loading. @param {GallerySpec} spec */
    remember(spec: GallerySpec): void;
    /**
     * Write the gallery.
     * @param {GallerySpec} spec
     */
    update(spec: GallerySpec): void;
    /** The card covers the whole gallery, not the strip of skeleton lines the grid is while it loads [t56-statefix-1018, S10]. @param {boolean} loading @param {HTMLElement} [grid] */
    syncCard(loading: boolean, grid?: HTMLElement): void;
    /** Mark the add tile off with a reason while an upload runs, or on again with `null`. @param {string | null} reason */
    setUploading(reason: string | null): void;
    /** Open a picture in the lightbox. @param {string} id @returns {import('../viewer.js').ViewerHandle | null} */
    openItem(id: string): import('../viewer.js').ViewerHandle | null;
}
