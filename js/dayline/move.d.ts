export type Placed = import('./constants.js').Placed;
export type MoveHost = {
    grid: HTMLElement;
    rowsTotal: () => number;
    /**
     * rows in an hour
     */
    perHour: () => number;
    placed: (id: string) => Placed | undefined;
    /**
     * stand the block on a row and say its time
     */
    show: (p: Placed, row: number) => void;
    /**
     * a finished move to another row
     */
    commit: (p: Placed, row: number, source: 'pointer' | 'keyboard') => void;
    /**
     * the move was taken back: the block on its own row again, said
     */
    putBack: (p: Placed) => void;
};
/** The keyboard walk on a handle, one per day timeline. */
export declare class KeyWalk {
    host: MoveHost;
    /** @type {{ p: Placed, row: number } | null} */
    walk: {
        p: Placed;
        row: number;
    } | null;
    /** @type {ReturnType<typeof setTimeout> | undefined} */
    timer: ReturnType<typeof setTimeout> | undefined;
    /** @param {MoveHost} host */
    constructor(host: MoveHost);
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): undefined;
    /** The walk becomes one change. */
    finish(): void;
    /** The walk is put back. */
    cancel(): void;
    stop(): void;
}
/**
 * One drag from a press on a handle: the block follows the pointer in whole rows until it is let go (a change) or Escape is
 * pressed (put back). Returns nothing; its listeners go with the drag.
 * @param {PointerEvent} down @param {MoveHost} host
 */
export declare function dragFrom(down: PointerEvent, host: MoveHost): void;
