export type SidenavContext = import('./context.js').SidenavContext;
export type ControlsFields = {
    chord: {
        key: string;
        ctrl: boolean;
        meta: boolean;
        alt: boolean;
        shift: boolean;
        aria: string;
    } | null;
    onCategory: (event: Event) => void;
    onEsc: (event: KeyboardEvent) => void;
    onShortcut: (event: KeyboardEvent) => void;
    onSlimClick: (event: Event) => void;
    onToggleClick: (event: Event) => void;
};
/** @typedef {import('./context.js').SidenavContext} SidenavContext */
/**
 * What the the shortcut, the category toggles and the clicks of the panel part adds to the table's context.
 *
 * @typedef {{
 *     chord: { key: string; ctrl: boolean; meta: boolean; alt: boolean; shift: boolean; aria: string; } | null;
 *     onCategory: (event: Event) => void;
 *     onEsc: (event: KeyboardEvent) => void;
 *     onShortcut: (event: KeyboardEvent) => void;
 *     onSlimClick: (event: Event) => void;
 *     onToggleClick: (event: Event) => void;
 * }} ControlsFields
 */
/**
 * The shortcut, the category toggles and the clicks of the panel.
 *
 * @param {SidenavContext} c
 */
export declare function installControls(c: SidenavContext): void;
