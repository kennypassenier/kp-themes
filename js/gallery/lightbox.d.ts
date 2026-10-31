import { Controller } from '../controller.js';
export type Gallery = import('./gallery.js').Gallery;
/** @typedef {import('./gallery.js').Gallery} Gallery */
/** One opening of the lightbox. It lives until the viewer closes, and `destroy()` undoes what it wired. */
export declare class Lightbox extends Controller {
    gallery: import("./gallery.js").Gallery;
    el: HTMLElement;
    id: string;
    doc: Document;
    view: Window;
    strings: import("../strings/types.js").Strings;
    locale: string;
    /** The gallery's pictures, shared: a Retry replaces one in place. */
    items: import("./constants.js").GalleryItem[];
    at: number;
    loop: boolean;
    preload: number;
    zoomOn: boolean;
    chromeMode: string;
    infoMode: string;
    hashOn: boolean;
    prefix: string;
    extraActions: string[];
    /** Whether this opening pushed a history entry, and whether the back button closed it. */
    pushed: boolean;
    closedByHistory: boolean;
    chromeTimer: number;
    /** A swipe on a phone while a finger is down: where it started, and whether one runs. */
    swipe: {
        x: number;
        y: number;
        on: boolean;
    };
    viewer: import("../viewer.js").ViewerHandle;
    picture: HTMLElement;
    info: HTMLElement;
    figure: HTMLElement;
    previous: HTMLButtonElement;
    next: HTMLButtonElement;
    /** @param {Gallery} gallery @param {string} id the picture to open */
    constructor(gallery: Gallery, id: string);
    /** The address of a picture. @param {string} itemId */
    hashOf(itemId: string): string;
    /** The keys the lightbox answers, listed in the `?` sheet. */
    keyBindings(): ({
        keys: string;
        what: string;
        group: string;
        run: () => void;
        when: () => boolean;
    } | {
        when?: undefined;
        keys: string;
        what: string;
        group: string;
        run: () => void;
    })[];
    /** Open the viewer on the picture and wire it. @returns {import('../viewer.js').ViewerHandle} */
    open(): import('../viewer.js').ViewerHandle;
    /** The viewer closed: undo the wiring, give the address back, say so, and put the focus on the tile. */
    onClose(): void;
    /** A wide edge zone with its arrow button. @param {'previous' | 'next'} side @param {string} label @param {string} glyph */
    addZone(side: 'previous' | 'next', label: string, glyph: string): HTMLButtonElement;
    /** @param {number} by */
    canGo(by: number): boolean;
    /** @param {number} by */
    go(by: number): void;
    /** @param {number} index */
    to(index: number): void;
    /** @param {'in' | 'out' | 'toggle'} how @param {PointerEvent | MouseEvent} [event] */
    zoom(how: 'in' | 'out' | 'toggle', event?: PointerEvent | MouseEvent): void;
    toggleFull(): void;
    /** Remember the picture on this device, when the gallery was told to. @param {string} itemId */
    remember(itemId: string): void;
    /** Show the picture at `at`: its title, position, actions, info and the image or video itself. */
    show(): void;
    /** What happens when the picture of `item` would not load: a plate with Retry in the stage. @param {import('./constants.js').GalleryItem} item */
    failed(item: import('./constants.js').GalleryItem): void;
    /** @param {import('./constants.js').GalleryItem} item */
    buildVideo(item: import('./constants.js').GalleryItem): HTMLVideoElement;
    /** @param {import('./constants.js').GalleryItem} item */
    buildImage(item: import('./constants.js').GalleryItem): HTMLImageElement;
}
