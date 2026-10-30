import { Controller } from '../controller.js';
export type MenuState = import('./types.js').MenuState;
/** @typedef {import('./types.js').MenuState} MenuState */
export declare class MenuButtonControl extends Controller {
    /** The menu's state, found or built by `connect()`. @type {MenuState} */
    state: MenuState;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /**
     * Filled before it was attached: the options join now, and the controls already built are handed to `decorate`.
     * @param {MenuState} s @param {import('./types.js').MenuButtonOptions} options
     */
    join(s: MenuState, { decorate, strings }: import('./types.js').MenuButtonOptions): void;
    onClick(): void;
    /** @param {KeyboardEvent} event */
    onButtonKey(event: KeyboardEvent): void;
    /** A press on an entry: a disabled one does nothing; any other is announced, and the menu closes unless the page cancels. @param {MouseEvent} event */
    onPick(event: MouseEvent): void;
    /** @param {KeyboardEvent} event */
    onMenuKey(event: KeyboardEvent): void;
}
