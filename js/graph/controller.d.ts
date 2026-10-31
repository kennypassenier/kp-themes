import { Controller } from '../controller.js';
import { GraphPan } from './pan.js';
export type GraphDecorateInfo = import('./options.js').GraphDecorateInfo;
export type GraphDetailInfo = import('./options.js').GraphDetailInfo;
export type GraphModel = import('./instance.js').GraphModel;
export type GraphAttachOptions = {
    decorate?: (part: Element, info: GraphDecorateInfo) => void;
    strings?: Partial<import('../strings.js').Strings>;
    detail?: (info: GraphDetailInfo) => Node | string | null | void;
};
/** One graph: its model is the `graphs` registry entry the setters read; the pointers of a zoom or pan sit on its GraphPan. */
export declare class GraphControl extends Controller {
    /** The model every part reads, its parts made but not yet placed. */
    g: import("./instance.js").GraphModel;
    /** The zoom and pan state of the picture. */
    pan: GraphPan;
    /** @param {HTMLElement} host @param {GraphAttachOptions} [options] */
    constructor(host: HTMLElement, options?: GraphAttachOptions);
    connect(): void;
    /** The picture's listeners: hover, focus, picks, keys, and the zoom and pan forwarded to the GraphPan. */
    wirePicture(): void;
    /** The listeners of the parts around the picture: the zoom buttons, the details panel, the kinds, Show all and Esc on the page. */
    wireParts(): void;
    /** Redraw on a new width or a changed option attribute, and fit the labels again when a web font arrives. */
    watch(): void;
    /**
     * A web font that arrives after the drawing changes every label's width: fit them again, in place (no node is rebuilt). Names
     * that stand whole need the room measured again, so that mode draws again.
     */
    onFonts(): void;
    /** The drawn nodes, hub first, in ring order. */
    order(): SVGGElement[];
    /** Make `node` the one tab stop. @param {SVGGElement} node */
    tabTo(node: SVGGElement): void;
    /** @param {SVGGElement} node */
    focusNode(node: SVGGElement): void;
    /** @param {Event} event */
    onOver(event: Event): void;
    /** @param {PointerEvent} event */
    onOut(event: PointerEvent): void;
    /** @param {Event} event */
    onFocus(event: Event): void;
    /** @param {FocusEvent} event */
    onBlur(event: FocusEvent): void;
    /** @param {Event} event */
    onClick(event: Event): void;
    /** @param {Event} event */
    onZoomBox(event: Event): void;
    /** Arrows walk the ring, Home and End jump, Enter or Space picks, Esc closes the details or shows all. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** Move the focus along the ring (the hub, when there is one, stands before it). @param {KeyboardEvent} event @param {SVGGElement} node */
    walk(event: KeyboardEvent, node: SVGGElement): void;
    /** @param {Event} event */
    onKind(event: Event): void;
    /** @param {KeyboardEvent} event */
    onPanelKey(event: KeyboardEvent): void;
    /** Esc anywhere on the page (outside a dialog, a field or a menu) closes the details, then shows all. @param {KeyboardEvent} event */
    onDocKey(event: KeyboardEvent): void;
}
