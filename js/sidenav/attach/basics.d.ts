export type Memory = import('../../remember.js').Memory;
export type SidenavContext = import('./context.js').SidenavContext;
export type BasicsFields = {
    backdrop: HTMLElement | null;
    covering: () => boolean;
    doc: Document;
    isOpen: () => boolean;
    launchedByMarkup: boolean;
    memory: Memory | null;
    mode: () => string;
    on: (attribute: string, fallback: boolean) => boolean;
    read: (attribute: string) => string | null;
    restoreFocusTo: Element | null;
    turnEase: () => void;
};
/** @typedef {import('../../remember.js').Memory} Memory */
/** @typedef {import('./context.js').SidenavContext} SidenavContext */
/**
 * What the the panel's readers, its remembered state and the mode it starts in part adds to the table's context.
 *
 * @typedef {{
 *     backdrop: HTMLElement | null;
 *     covering: () => boolean;
 *     doc: Document;
 *     isOpen: () => boolean;
 *     launchedByMarkup: boolean;
 *     memory: Memory | null;
 *     mode: () => string;
 *     on: (attribute: string, fallback: boolean) => boolean;
 *     read: (attribute: string) => string | null;
 *     restoreFocusTo: Element | null;
 *     turnEase: () => void;
 * }} BasicsFields
 */
/**
 * The panel's readers, its remembered state and the mode it starts in.
 *
 * @param {SidenavContext} c
 */
export declare function installBasics(c: SidenavContext): void;
