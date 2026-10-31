export type GraphModel = import('./instance.js').GraphModel;
/** The pointers, the pan start, the pinch and the drag flag of one graph; the controller forwards the picture's events here. */
export declare class GraphPan {
    g: import("./instance.js").GraphModel;
    /** Whether the press that is ending moved the view, so its click is not a pick. */
    dragged: boolean;
    /** The pointers down on the picture. @type {Map<number, { x: number, y: number, onNode: boolean }>} */
    pointers: Map<number, {
        x: number;
        y: number;
        onNode: boolean;
    }>;
    /** Where the last pan step was, while the background is dragged. @type {{ x: number, y: number } | null} */
    panFrom: {
        x: number;
        y: number;
    } | null;
    /** The zoom and world point a two-finger pinch started from. @type {{ dist: number, k: number, wx: number, wy: number } | null} */
    pinch: {
        dist: number;
        k: number;
        wx: number;
        wy: number;
    } | null;
    /** @param {GraphModel} g */
    constructor(g: GraphModel);
    /** Two pointers are down: remember the zoom and the world point under their middle. */
    pinchStart(): void;
    /** @param {PointerEvent} event */
    onDown(event: PointerEvent): void;
    /** @param {PointerEvent} event */
    onMove(event: PointerEvent): void;
    /** Zoom by how far the two pointers moved apart, about the world point they started on. @param {{ dist: number, k: number, wx: number, wy: number }} pinch */
    pinchMove(pinch: {
        dist: number;
        k: number;
        wx: number;
        wy: number;
    }): void;
    /** Pan by how far the pointer moved, once it passed the drag threshold. @param {PointerEvent} event @param {{ x: number, y: number }} from */
    panMove(event: PointerEvent, from: {
        x: number;
        y: number;
    }): void;
    /** @param {PointerEvent} event */
    startDrag(event: PointerEvent): void;
    /** @param {PointerEvent} event */
    onUp(event: PointerEvent): void;
    /** A drag must not end as a pick. @param {MouseEvent} event */
    onClickCapture(event: MouseEvent): void;
    /** @param {WheelEvent} event */
    onWheel(event: WheelEvent): void;
    /** The keys of a zoomed picture: + - 0 and Shift+arrows; true when the key was one of them. @param {KeyboardEvent} event */
    zoomKey(event: KeyboardEvent): boolean;
}
