/** A code block js/auto.js fills from its markup. */
export declare const CODE = "[data-kp-code]";
/** How long "Copied" stays, in ms. */
export declare const CODE_COPIED_MS = 1500;
/** How many lines a table cell shows before it folds. */
export declare const CELL_LINES = 3;
/** The lines the body of a loading block is at least tall, and at most when the block says nothing else. */
export declare const LOADING_LINES_MIN = 3;
export declare const LOADING_LINES_MAX = 8;
export type CodeSpec = {
    text?: string;
    title?: string;
    /**
     * shown in the head; 'JSON' (any case) offers Pretty and Raw when the text parses; 'TOML' and 'bash' (sh, shell, zsh) colour the text
     */
    language?: string;
    /**
     * colour TOML and shell text (default true); false leaves it plain [wish-1028]
     */
    highlight?: boolean;
    /**
     * shown in the head, and in the binary sentence
     */
    size?: string;
    /**
     * line numbers
     */
    lines?: boolean;
    /**
     * wrapped from the start (the reader can toggle it)
     */
    wrap?: boolean;
    /**
     * fold past this many lines (0: never)
     */
    maxLines?: number;
    /**
     * the JSON layout to start with (default 'pretty')
     */
    layout?: 'pretty' | 'raw';
    /**
     * the Copy button (default true)
     */
    copy?: boolean;
    truncated?: {
        shown: string;
        total: string;
    };
    state?: 'ready' | 'loading' | 'empty' | 'binary' | 'error';
    /**
     * the sentence of a failed or empty block
     */
    message?: string;
    loadingWords?: string;
    /**
     * a table cell: wrapped, three lines, a muted line for empty and binary [kpadopt5]
     */
    cell?: boolean;
    /**
     * where the rest of a folded cell opens (default inline) [kpadopt5]
     */
    open?: 'inline' | 'dialog';
    /**
     * a link under a binary cell's line [kpadopt5]
     */
    downloadUrl?: string;
};
/**
 * @typedef {object} CodeSpec
 * @property {string} [text]
 * @property {string} [title]
 * @property {string} [language]   shown in the head; 'JSON' (any case) offers Pretty and Raw when the text parses; 'TOML' and 'bash' (sh, shell, zsh) colour the text
 * @property {boolean} [highlight] colour TOML and shell text (default true); false leaves it plain [wish-1028]
 * @property {string} [size]       shown in the head, and in the binary sentence
 * @property {boolean} [lines]     line numbers
 * @property {boolean} [wrap]      wrapped from the start (the reader can toggle it)
 * @property {number} [maxLines]   fold past this many lines (0: never)
 * @property {'pretty' | 'raw'} [layout]  the JSON layout to start with (default 'pretty')
 * @property {boolean} [copy]      the Copy button (default true)
 * @property {{ shown: string, total: string }} [truncated]
 * @property {'ready' | 'loading' | 'empty' | 'binary' | 'error'} [state]
 * @property {string} [message]    the sentence of a failed or empty block
 * @property {string} [loadingWords]
 * @property {boolean} [cell]        a table cell: wrapped, three lines, a muted line for empty and binary [kpadopt5]
 * @property {'inline' | 'dialog'} [open]  where the rest of a folded cell opens (default inline) [kpadopt5]
 * @property {string} [downloadUrl]  a link under a binary cell's line [kpadopt5]
 */
