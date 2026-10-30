/** A gallery. */
export declare const GALLERY = "[data-kp-gallery]";
/** Fired on the gallery when a picture was opened: `{ id, item }`. */
export declare const GALLERY_OPEN_EVENT = "kp-gallery-open";
/** Fired on the gallery when the lightbox closed: `{ id }`. */
export declare const GALLERY_CLOSE_EVENT = "kp-gallery-close";
/** Fired on the gallery when the Retry of a failed list was pressed. */
export declare const GALLERY_RETRY_EVENT = "kp-gallery-retry";
/** Fired on the gallery when pictures were chosen to add: `{ files }`. */
export declare const GALLERY_ADD_EVENT = "kp-gallery-add";
export declare const GALLERY_PICTURE_FAILED_EVENT = "kp-gallery-picture-failed";
/** The states a gallery can be in. */
export declare const GALLERY_STATES: readonly ['ready', 'loading', 'empty', 'error'];
/** How long the controls stay before they fade, in ms. */
export declare const GALLERY_CHROME_MS = 3000;
/** The most a swipe has to travel sideways to step, in px. */
export declare const SWIPE = 56;
/** How much further than a sideways step a swipe down has to travel to close the lightbox. */
export declare const SWIPE_CLOSE_FACTOR = 1.6;
/** How many waiting tiles a loading gallery shows unless the spec says. */
export declare const DEFAULT_SKELETON = 8;
/** The most originals fetched beside the open one. */
export declare const PRELOAD_MAX = 2;
/** The columns a gallery may be fixed to. */
export declare const COLUMNS_PATTERN: RegExp;
export type GalleryItem = {
    id: string;
    /**
     * the original
     */
    src: string;
    /**
     * the small one (default the original)
     */
    thumb?: string;
    width?: number;
    height?: number;
    alt?: string;
    caption?: string;
    kind?: 'image' | 'video';
    /**
     * a video's still
     */
    poster?: string;
    uploader?: string;
    /**
     * when it was added, in ms
     */
    at?: number;
    bytes?: number;
};
export type GalleryAction = {
    label: string;
    tone?: 'destructive' | 'default';
    run: () => void;
    /**
     * a question: the package's confirmation dialog asks it first
     */
    confirm?: string;
};
export type GallerySpec = {
    items?: readonly GalleryItem[];
    state?: 'ready' | 'loading' | 'empty' | 'error';
    /**
     * the words of the empty and failed plates
     */
    message?: string;
    label?: string;
    actions?: (item: GalleryItem) => readonly GalleryAction[];
    /**
     * show the Add pictures tile (the gallery fires `kp-gallery-add`)
     */
    add?: boolean;
    /**
     * how many waiting tiles a loading gallery shows (default 8)
     */
    skeleton?: number;
};
/**
 * @typedef {object} GalleryItem
 * @property {string} id
 * @property {string} src the original
 * @property {string} [thumb] the small one (default the original)
 * @property {number} [width]
 * @property {number} [height]
 * @property {string} [alt]
 * @property {string} [caption]
 * @property {'image' | 'video'} [kind]
 * @property {string} [poster] a video's still
 * @property {string} [uploader]
 * @property {number} [at] when it was added, in ms
 * @property {number} [bytes]
 */
/**
 * @typedef {object} GalleryAction
 * @property {string} label
 * @property {'destructive' | 'default'} [tone]
 * @property {() => void} run
 * @property {string} [confirm] a question: the package's confirmation dialog asks it first
 */
/**
 * @typedef {object} GallerySpec
 * @property {readonly GalleryItem[]} [items]
 * @property {'ready' | 'loading' | 'empty' | 'error'} [state]
 * @property {string} [message] the words of the empty and failed plates
 * @property {string} [label]
 * @property {(item: GalleryItem) => readonly GalleryAction[]} [actions]
 * @property {boolean} [add] show the Add pictures tile (the gallery fires `kp-gallery-add`)
 * @property {number} [skeleton] how many waiting tiles a loading gallery shows (default 8)
 */
