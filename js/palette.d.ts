/** Fired on the palette when a command is chosen. A contract value [TH26]: `{ value, option }`. */
export declare const RUN_EVENT = "kp-palette-run";
/** Fired on the palette or the sheet when it opens or closes: `{ open }`. */
export declare const OPEN_EVENT = "kp-palette-open";
export type Matcher = (optionText: string, query: string) => boolean;
/** @typedef {(optionText: string, query: string) => boolean} Matcher */
/** @type {Record<string, Matcher>} */
export declare const MATCHERS: Record<string, Matcher>;
export type PaletteHandle = {
    element: HTMLDialogElement;
    open: (query?: string) => void;
    close: () => void;
    /**
     * re-filter after the consumer changed the commands
     */
    refresh: () => void;
};
/** The handle for an attached palette or sheet. @param {Element} element */
export declare function palette(element: Element): PaletteHandle | null;
/**
 * Attach every palette and shortcut sheet under `root`.
 *
 * @param {ParentNode} root
 * @param {{ hotkey?: string | null, sheetKey?: string | null, match?: keyof typeof MATCHERS | Matcher, clearOnClose?: boolean, closeOnRun?: boolean, typingSelector?: string }} [options]
 *   Defaults; per element: `data-kp-hotkey` (a letter, or "none"), `data-kp-primary` (this one answers the key when there are several), `data-kp-match`, `data-kp-clear-on-close="false"`, `data-kp-close-on-run="false"`.
 * @returns {(() => void) & { handles: PaletteHandle[] }} detach
 */
export declare function attachPalettes(root?: ParentNode, { hotkey, sheetKey, match, clearOnClose, closeOnRun, typingSelector, }?: {
    hotkey?: string | null;
    sheetKey?: string | null;
    match?: keyof typeof MATCHERS | Matcher;
    clearOnClose?: boolean;
    closeOnRun?: boolean;
    typingSelector?: string;
}): (() => void) & {
    handles: PaletteHandle[];
};
