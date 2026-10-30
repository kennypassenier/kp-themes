export type UptimePeriod = {
    /**
     * stable id of the period (an ISO day or hour)
     */
    key: string;
    /**
     * its name as a person reads it ("14/10/2026", "14:00")
     */
    label: string;
    state: 'up' | 'degraded' | 'down' | 'none';
    /**
     * the share of the period the service was up, 0 to 1, when measured
     */
    uptime?: number;
    /**
     * how many incidents began in it
     */
    incidents?: number;
    /**
     * the hover card's text; else the label, the state and the figures
     */
    tip?: string;
    /**
     * the period's own page: the cell is a link to it (or, with `open: 'info'`, its quick info links it)
     */
    href?: string;
    /**
     * lines for the period's quick info (what happened, how long), with `open: 'info'`
     */
    details?: string[];
};
export type UptimeSpec = {
    /**
     * oldest first
     */
    periods?: UptimePeriod[];
    /**
     * default `ready` (or `empty` without periods)
     */
    state?: 'ready' | 'loading' | 'empty' | 'error';
    /**
     * the strip's title (the service); else `data-kp-uptime-label`
     */
    label?: string;
    /**
     * the axis's start word when every period is shown ("90 days ago"); else the first period's label
     */
    from?: string;
    /**
     * the axis's end word ("Today"); else the latest period's label
     */
    to?: string;
    /**
     * how many cells a loading or empty strip waits with; else `data-kp-uptime-count`, else 90
     */
    count?: number;
    /**
     * the error state's sentence (the failed plate's heading); else the dictionary's
     */
    error?: string;
    /**
     * the empty state's heading, and the failed state's when `error` is not given; else the dictionary's
     */
    message?: string;
    /**
     * the plate's sentence under the heading, empty or failed (a failure says the package's own when none is given)
     */
    text?: string;
    /**
     * a picture over the heading of the empty and failed plates
     */
    art?: Node | string | null;
    /**
     * a press opens the period's quick info; else `data-kp-uptime-open`
     */
    open?: 'info';
};
export type UptimeFigures = {
    /**
     * periods with data
     */
    measured: number;
    /**
     * the window's share up, 0 to 1; null without data
     */
    share: number | null;
    incidents: number;
    counts: Record<'up' | 'degraded' | 'down' | 'none', number>;
};
/**
 * @typedef {object} UptimePeriod
 * @property {string} key       stable id of the period (an ISO day or hour)
 * @property {string} label     its name as a person reads it ("14/10/2026", "14:00")
 * @property {'up' | 'degraded' | 'down' | 'none'} state
 * @property {number} [uptime]  the share of the period the service was up, 0 to 1, when measured
 * @property {number} [incidents] how many incidents began in it
 * @property {string} [tip]     the hover card's text; else the label, the state and the figures
 * @property {string} [href]    the period's own page: the cell is a link to it (or, with `open: 'info'`, its quick info links it)
 * @property {string[]} [details] lines for the period's quick info (what happened, how long), with `open: 'info'`
 */
/**
 * @typedef {object} UptimeSpec
 * @property {UptimePeriod[]} [periods] oldest first
 * @property {'ready' | 'loading' | 'empty' | 'error'} [state] default `ready` (or `empty` without periods)
 * @property {string} [label]   the strip's title (the service); else `data-kp-uptime-label`
 * @property {string} [from]    the axis's start word when every period is shown ("90 days ago"); else the first period's label
 * @property {string} [to]      the axis's end word ("Today"); else the latest period's label
 * @property {number} [count]   how many cells a loading or empty strip waits with; else `data-kp-uptime-count`, else 90
 * @property {string} [error]   the error state's sentence (the failed plate's heading); else the dictionary's
 * @property {string} [message] the empty state's heading, and the failed state's when `error` is not given; else the dictionary's
 * @property {string} [text]    the plate's sentence under the heading, empty or failed (a failure says the package's own when none is given)
 * @property {Node | string | null} [art] a picture over the heading of the empty and failed plates
 * @property {'info'} [open]    a press opens the period's quick info; else `data-kp-uptime-open`
 */
/**
 * @typedef {object} UptimeFigures
 * @property {number} measured   periods with data
 * @property {number | null} share  the window's share up, 0 to 1; null without data
 * @property {number} incidents
 * @property {Record<'up' | 'degraded' | 'down' | 'none', number>} counts
 */
export {};
