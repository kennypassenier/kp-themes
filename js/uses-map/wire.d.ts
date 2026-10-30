import { Controller } from '../controller.js';
import { UsesLines } from './lines.js';
export type UsesModel = import('./model.js').UsesModel;
/** @typedef {import('./model.js').UsesModel} UsesModel */
export declare class UsesWire extends Controller {
    m: import("./model.js").UsesModel;
    root: HTMLElement;
    list: HTMLElement;
    memory: import("./memory.js").UsesMemory;
    drawn: UsesLines;
    /**
     * @param {UsesModel} m the model of the draw
     * @param {HTMLElement} root the drawn `.kp-uses`
     * @param {Element} svg
     * @param {HTMLElement} list the phone's list
     */
    constructor(m: UsesModel, root: HTMLElement, svg: Element, list: HTMLElement);
    cards(): HTMLElement[];
    /** @param {string} key */
    nodeEl(key: string): HTMLElement | null;
    connect(): void;
    listenAll(): void;
    collapsed(): boolean;
    applyCollapse(): void;
    lightWhat(): void;
    /** @param {string | null} key */
    pin(key: string | null): void;
    /** The one tab stop. @param {HTMLElement} card */
    stopAt(card: HTMLElement): void;
    /** @param {Event} event */
    hoverTarget(event: Event): string | null;
    /** @param {Event} event */
    onOver(event: Event): void;
    /** @param {Event} event */
    onOut(event: Event): void;
    /** @param {FocusEvent} event */
    onFocusIn(event: FocusEvent): void;
    /** @param {Event} event */
    onClick(event: Event): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
}
