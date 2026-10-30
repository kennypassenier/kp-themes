import { Controller } from '../controller.js';
import { ChangeTracker } from './changes.js';
import { ChangeKeeper } from './keeper.js';
import { ChangesPanel } from './panel.js';
import { BarDock } from './dock.js';
import { LeaveGuard } from './leave.js';
export type UnsavedChange = import('./config.js').UnsavedChange;
export type UnsavedHandle = import('./config.js').UnsavedHandle;
/** @typedef {import('./config.js').UnsavedChange} UnsavedChange */
/** @typedef {import('./config.js').UnsavedHandle} UnsavedHandle */
/** An unsaved-changes bar. */
export declare class UnsavedController extends Controller {
    el: HTMLElement;
    doc: Document;
    win: Window & typeof globalThis;
    s: import("../strings/types.js").Strings;
    /** The bar's id, and what its markup asks for. Both are read in `connect()`. */
    id: string;
    settings: {
        scope: HTMLElement;
        placement: string;
        dockInContainer: boolean;
        scrollRoot: Element | null;
        auto: boolean;
        warn: string | undefined;
        keepAttribute: string | undefined;
        exclude: string;
        undoMs: number;
        saveLabel: string | undefined;
        storeKey: string;
    };
    parts: {
        bar: HTMLElement;
        none: HTMLElement;
        chip: HTMLButtonElement;
        discard: HTMLButtonElement;
        save: HTMLButtonElement;
        more: HTMLElement;
        moreButton: HTMLButtonElement;
        panel: HTMLElement;
        headTitle: HTMLElement;
        first: HTMLButtonElement;
        list: HTMLElement;
        problem: HTMLElement;
        live: HTMLElement;
    };
    tracker: ChangeTracker;
    keeper: ChangeKeeper;
    panel: ChangesPanel;
    dock: BarDock;
    guard: LeaveGuard;
    /** Whether the page is saving, and how many changes it was sent. */
    saving: boolean;
    savedCount: number;
    /** The count last painted; -1 before the first paint, so the first paint raises no event. */
    lastCount: number;
    announceTimer: number;
    /** What the last Discard changed, for Undo. @type {{ control: HTMLInputElement, value: string }[]} */
    undoStack: {
        control: HTMLInputElement;
        value: string;
    }[];
    /** The handle the page gets back from `unsaved(el)`. @type {UnsavedHandle | null} */
    handle: UnsavedHandle | null;
    /**
     * @param {HTMLElement} host the bar
     * @param {import('./config.js').UnsavedConfig} [options]
     */
    constructor(host: HTMLElement, options?: import('./config.js').UnsavedConfig);
    /** The scratch region read out to screen readers. */
    get live(): HTMLElement;
    connect(): void;
    /** Undo what `connect()` put on the host itself. */
    release(): void;
    /** Build the bar into the host and give its menu button life. */
    mount(): void;
    /** The listeners on the bar's own buttons, the scope and the document. */
    wire(): void;
    /** @param {Event} event */
    onEdit(event: Event): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** @param {PointerEvent} event */
    onOutside(event: PointerEvent): void;
    /** Bring the whole bar in line with the changes now. */
    paint(): void;
    /** Close the list and take the visitor to the changed row. @param {UnsavedChange} ch */
    jump(ch: UnsavedChange): void;
    /** Put one change back, unless the page cancels it. @param {UnsavedChange} ch */
    revertOne(ch: UnsavedChange): void;
    /** Put every changed value back and offer Undo. */
    discard(): void;
    /** Ask the page to save; if it does not cancel, the bar goes to work. */
    save(): void;
    /** The page's answer to Save. @param {{ refused?: Record<string, string> }} [result] */
    saved(result?: {
        refused?: Record<string, string>;
    }): void;
    /** Take what the form holds now as the saved values. */
    markClean(): void;
    /** @param {boolean} next */
    setSaving(next: boolean): void;
    /** The handle the page gets back. @returns {UnsavedHandle} */
    makeHandle(): UnsavedHandle;
}
