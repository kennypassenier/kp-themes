/** The pictures of a gallery. @param {Element} el */
export declare function galleryItems(el: Element): {
    id: string;
    src: string;
    thumb?: string;
    width?: number;
    height?: number;
    alt?: string;
    caption?: string;
    kind?: 'image' | 'video';
    poster?: string;
    uploader?: string;
    at?: number;
    bytes?: number;
}[];
/** The picture a gallery last opened on this device, or null (a gallery nobody wrote holds no pictures to continue to). @param {Element} el */
export declare function galleryLast(el: Element): string | null;
/**
 * Write a gallery.
 * @param {HTMLElement} el
 * @param {import('./constants.js').GallerySpec} spec
 */
export declare function setGallery(el: HTMLElement, spec: import('./constants.js').GallerySpec): void;
/**
 * Mark the add tile off with a reason while an upload runs, or on again with `null`.
 * @param {HTMLElement} el @param {string | null} reason
 */
export declare function setGalleryUploading(el: HTMLElement, reason: string | null): void;
/**
 * Open a picture in the lightbox.
 * @param {HTMLElement} el @param {string} id
 * @returns {import('../viewer.js').ViewerHandle | null}
 */
export declare function openGalleryItem(el: HTMLElement, id: string): import('../viewer.js').ViewerHandle | null;
/**
 * Wire every gallery under `root`: the hash the page opened with opens its picture.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachGalleries(root?: ParentNode): () => void;
/**
 * Open the picture the address names, if this gallery holds it (call after the items are set).
 * @param {HTMLElement} el
 * @returns {boolean}
 */
export declare function openGalleryFromHash(el: HTMLElement): boolean;
