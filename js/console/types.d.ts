export type ConsoleChange = {
    state?: 'sending' | 'queued' | 'running' | 'ok' | 'failed' | 'refused' | 'cancelled' | 'lost';
    /**
     * the exit code
     */
    code?: number;
    /**
     * replaces the output
     */
    output?: string;
    /**
     * adds to the output
     */
    append?: string;
    /**
     * a refusal's what
     */
    error?: string;
    /**
     * a refusal's what now
     */
    remedy?: string;
};
export type ConsoleJob = {
    update: (handler: (change: ConsoleChange) => void) => void;
    cancel?: () => void;
};
export type ConsoleRun = (command: string, context: string) => ConsoleJob | Promise<ConsoleJob>;
export type ConsoleBlock = {
    id: string;
    command: string;
    context: string;
    state: ConsoleChange['state'];
    code?: number;
    output: string;
    error?: string;
    remedy?: string;
    startedAt: number;
    endedAt?: number;
    collapsed: boolean;
    truncated?: boolean;
    total?: number;
};
export type ConsoleState = {
    run: ConsoleRun | null;
    complete: ((prefix: string) => string[] | Promise<string[]>) | null;
    blocks: ConsoleBlock[];
    jobs: Map<string, ConsoleJob>;
    history: string[];
    at: number;
    draft: string;
    spec: {
        state?: string;
        message?: string;
    };
    context: {
        options: {
            value: string;
            label: string;
        }[];
        value: string;
        state: string;
        label: string;
    };
    card: import('../busy-card.js').BusyCard | null;
    tick: number;
    pending: string | null;
    pendingTimer: number;
    off: (() => void)[];
    showAll: boolean;
    said: string;
    barState: string;
    hintHeight: number;
};
/**
 * @typedef {object} ConsoleChange
 * @property {'sending' | 'queued' | 'running' | 'ok' | 'failed' | 'refused' | 'cancelled' | 'lost'} [state]
 * @property {number} [code]  the exit code
 * @property {string} [output]  replaces the output
 * @property {string} [append]  adds to the output
 * @property {string} [error]  a refusal's what
 * @property {string} [remedy]  a refusal's what now
 */
/**
 * @typedef {object} ConsoleJob
 * @property {(handler: (change: ConsoleChange) => void) => void} update
 * @property {() => void} [cancel]
 */
/** @typedef {(command: string, context: string) => ConsoleJob | Promise<ConsoleJob>} ConsoleRun */
/**
 * @typedef {object} ConsoleBlock
 * @property {string} id
 * @property {string} command
 * @property {string} context
 * @property {ConsoleChange['state']} state
 * @property {number} [code]
 * @property {string} output
 * @property {string} [error]
 * @property {string} [remedy]
 * @property {number} startedAt
 * @property {number} [endedAt]
 * @property {boolean} collapsed
 * @property {boolean} [truncated]
 * @property {number} [total]
 */
/** @typedef {{ run: ConsoleRun | null, complete: ((prefix: string) => string[] | Promise<string[]>) | null, blocks: ConsoleBlock[], jobs: Map<string, ConsoleJob>, history: string[], at: number, draft: string, spec: { state?: string, message?: string }, context: { options: { value: string, label: string }[], value: string, state: string, label: string }, card: import('../busy-card.js').BusyCard | null, tick: number, pending: string | null, pendingTimer: number, off: (() => void)[], showAll: boolean, said: string, barState: string, hintHeight: number }} ConsoleState */
export {};
