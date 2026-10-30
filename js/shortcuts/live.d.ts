import { Controller } from '../controller.js';
export type ShortcutBoard = import('./board.js').ShortcutBoard;
/** @typedef {import('./board.js').ShortcutBoard} ShortcutBoard */
export declare class LiveSheet extends Controller {
    connect(): void;
}
