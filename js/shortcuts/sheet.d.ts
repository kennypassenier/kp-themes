export type ShortcutBoard = import('./board.js').ShortcutBoard;
export type Row = {
    keys: string;
    what: string;
    off: boolean;
    reason: string;
};
export type Group = {
    group: string;
    rows: Row[];
    scoped: boolean;
};
/**
 * Write the sheet's body from the registry: groups of rows, the scope's own keys first, the palette's and the sheet's
 * keys in a fixed first group, a dimmed row for a key that is not available now, an empty plate when nothing is
 * registered.
 *
 * @param {ShortcutBoard} board
 * @param {HTMLElement} sheet
 */
export declare function renderSheet(board: ShortcutBoard, sheet: HTMLElement): void;
