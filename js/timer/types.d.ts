export type TimerState = {
    id: string;
    name: string;
    /**
     * the length it was started with (plus what was added)
     */
    seconds: number;
    /**
     * seconds left, now
     */
    remaining: number;
    /**
     * epoch ms it ends at while running, else null
     */
    endsAt: number | null;
    state: 'running' | 'paused' | 'done';
    /**
     * the sentence spoken when it ends, if the list speaks
     */
    say?: string;
};
export type Timer = {
    id: string;
    name: string;
    /**
     * ms
     */
    total: number;
    /**
     * epoch ms, while running
     */
    endsAt: number | null;
    /**
     * ms, while paused or done
     */
    left: number;
    state: 'running' | 'paused' | 'done';
    /**
     * the last minute was said
     */
    warned: boolean;
    /**
     * the sentence spoken when it ends ('' = the dictionary's)
     */
    say: string;
    ring: ReturnType<typeof setInterval> | null;
    card: HTMLElement;
};
/**
 * @typedef {object} TimerState
 * @property {string} id
 * @property {string} name
 * @property {number} seconds  the length it was started with (plus what was added)
 * @property {number} remaining  seconds left, now
 * @property {number | null} endsAt  epoch ms it ends at while running, else null
 * @property {'running' | 'paused' | 'done'} state
 * @property {string} [say]  the sentence spoken when it ends, if the list speaks
 */
/**
 * @typedef {object} Timer
 * @property {string} id
 * @property {string} name
 * @property {number} total  ms
 * @property {number | null} endsAt  epoch ms, while running
 * @property {number} left  ms, while paused or done
 * @property {'running' | 'paused' | 'done'} state
 * @property {boolean} warned  the last minute was said
 * @property {string} say  the sentence spoken when it ends ('' = the dictionary's)
 * @property {ReturnType<typeof setInterval> | null} ring
 * @property {HTMLElement} card
 */
export {};
