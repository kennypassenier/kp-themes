export type LogLine = {
    /**
     * what makes a line the same line when it arrives twice
     */
    id?: string | number;
    /**
     * when it was written
     */
    ts: number | string | Date;
    /**
     * the stack or unit that wrote it
     */
    source?: string;
    /**
     * debug, info, notice, warning, error or critical (or a common alias)
     */
    level: string;
    /**
     * the text
     */
    message: string;
};
export type LogViewerSpec = {
    /**
     * replaces the buffer
     */
    lines?: LogLine[];
    state?: 'ready' | 'loading' | 'error';
    /**
     * the failed plate's sentence: the host's own reason ("Loki did not answer: connection refused"), in place of the package's;
     * an empty string takes it back (`data-kp-log-error`) [wish-1120, homelab 115]
     */
    message?: string;
    /**
     * the failed plate's heading, in place of "Could not read the log" (`data-kp-log-error-title`)
     */
    errorTitle?: string;
    max?: number;
    wrap?: boolean;
    time?: 'time' | 'datetime' | 'off';
    level?: 'debug' | 'info' | 'warning' | 'error';
    search?: string;
    searchOnly?: boolean;
};
export type Kept = {
    id: string;
    ts: number;
    source: string;
    level: string;
    message: string;
};
export type ViewerState = {
    lines: Kept[];
    nodes: Map<string, HTMLElement>;
    dropped: number;
    serial: number;
    sig: string;
    matches: HTMLElement[];
    at: number;
    card: import('../busy-card.js').BusyCard | null;
    off: (() => void)[];
    said: string;
    tools: string;
    highlighted: string;
};
/**
 * @typedef {object} LogLine
 * @property {string | number} [id] what makes a line the same line when it arrives twice
 * @property {number | string | Date} ts when it was written
 * @property {string} [source] the stack or unit that wrote it
 * @property {string} level debug, info, notice, warning, error or critical (or a common alias)
 * @property {string} message the text
 */
/**
 * @typedef {object} LogViewerSpec
 * @property {LogLine[]} [lines] replaces the buffer
 * @property {'ready' | 'loading' | 'error'} [state]
 * @property {string} [message] the failed plate's sentence: the host's own reason ("Loki did not answer: connection refused"), in place of the package's;
 *   an empty string takes it back (`data-kp-log-error`) [wish-1120, homelab 115]
 * @property {string} [errorTitle] the failed plate's heading, in place of "Could not read the log" (`data-kp-log-error-title`)
 * @property {number} [max]
 * @property {boolean} [wrap]
 * @property {'time' | 'datetime' | 'off'} [time]
 * @property {'debug' | 'info' | 'warning' | 'error'} [level]
 * @property {string} [search]
 * @property {boolean} [searchOnly]
 */
/** @typedef {{ id: string, ts: number, source: string, level: string, message: string }} Kept */
/** @typedef {{ lines: Kept[], nodes: Map<string, HTMLElement>, dropped: number, serial: number, sig: string, matches: HTMLElement[], at: number, card: import('../busy-card.js').BusyCard | null, off: (() => void)[], said: string, tools: string, highlighted: string }} ViewerState */
export {};
