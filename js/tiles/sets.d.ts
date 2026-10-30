import { Controller } from '../controller.js';
/**
 * The sets under `root`, each with its grids: by name where the marker has
 * one, else by the marked element.
 * @param {ParentNode} root
 * @returns {Map<unknown, HTMLElement[]>}
 */
export declare function tileSets(root: ParentNode): Map<unknown, HTMLElement[]>;
/**
 * Even one set: every grid's rows at least as tall as the set's tallest
 * visible tile. Each tile is read at its natural height while the grids
 * carry `data-kp-tiles-measuring` (the stylesheet lets their rows size to
 * content for that one synchronous step), and the floor is written only
 * where it changed.
 * @param {HTMLElement[]} grids
 * @returns {number} the floor, in px (0 for a set with no visible tile)
 */
export declare function evenTileSet(grids: HTMLElement[]): number;
/** Every tile set under a root (an element or a whole document), kept even. */
export declare class TileSetWatch extends Controller {
    root: ParentNode;
    view: Window & typeof globalThis;
    doc: Document;
    /** The grids and tiles under observation. @type {Set<Element>} */
    observed: Set<Element>;
    queued: number;
    /** The height each tile was last drawn at, where its next move starts. @type {WeakMap<Element, number>} */
    drawn: WeakMap<Element, number>;
    /** The sets whose tiles are moving now, with their moves. @type {Map<unknown, Animation[]>} */
    moving: Map<unknown, Animation[]>;
    sizes: ResizeObserver;
    /** @param {ParentNode} root @param {Window & typeof globalThis} view */
    constructor(root: ParentNode, view: Window & typeof globalThis);
    connect(): void;
    queue(): void;
    /** @param {Element[]} tiles */
    remember(tiles: Element[]): void;
    /** Observe the grids and tiles there are now, and even every set. @param {boolean} [move] */
    run(move?: boolean): void;
    /**
     * Even one set; with `move`, ease its tiles from where they were drawn to where they now stand.
     * @param {unknown} key @param {HTMLElement[]} grids @param {boolean} move
     */
    even(key: unknown, grids: HTMLElement[], move: boolean): void;
    /**
     * Rows follow the tiles while they move: each tile is held at its eased height (`[data-kp-tiles-easing]`,
     * css/components.css), all of them on one curve, so the rows of every grid stay one height.
     * @param {unknown} key @param {HTMLElement[]} grids @param {Element[]} tiles @param {Map<Element, number>} from @param {number} floor
     */
    ease(key: unknown, grids: HTMLElement[], tiles: Element[], from: Map<Element, number>, floor: number): void;
    /**
     * Even again, in the same task as the change, before a frame of it is drawn: anything inside a set; above a set, only a
     * set or grid that comes or goes, or a fold or `hidden` that shows or hides one. A probe another module draws for an
     * instant beside the board is not a change to the board (js/motion.js reads the theme's motion that way, and a move that
     * answered its own probe never ended).
     * @param {MutationRecord[]} records
     */
    onRecords(records: MutationRecord[]): void;
}
