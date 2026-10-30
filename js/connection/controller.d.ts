import { Controller } from '../controller.js';
export type ConnectionState = import('../connection.js').ConnectionState;
export type ConnectionDetail = import('../connection.js').ConnectionDetail;
/** @typedef {import('../connection.js').ConnectionState} ConnectionState */
/** @typedef {import('../connection.js').ConnectionDetail} ConnectionDetail */
export declare class ConnectionBanner extends Controller {
    doc: Document;
    view: Window;
    parts: {
        band: HTMLElement;
        mark: HTMLElement;
        title: HTMLElement;
        why: HTMLElement;
        meta: HTMLElement;
        retry: HTMLButtonElement;
        voice: HTMLElement;
    };
    /** @type {ConnectionState} */
    shown: ConnectionState;
    pending: number;
    attempt: number;
    nextAt: number;
    graceTimer: number;
    backTimer: number;
    tickTimer: number;
    leaving: boolean;
    refusedWhy: string;
    /** What the page gets back, the same object every time. @type {import('../connection.js').ConnectionHandle} */
    handle: import('../connection.js').ConnectionHandle;
    /**
     * @param {HTMLElement} host
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    stopTick(): void;
    pendingText(): string;
    /** The time to the next try is redrawn; when it has come, the try is made. */
    countdown(): void;
    /** @param {boolean} auto */
    tryNow(auto: boolean): void;
    /** The automatic try is planned: after the next delay, the last one repeating. */
    scheduleTry(): void;
    /** The band's tone and mark for a state. @param {ConnectionState} state */
    paintBand(state: ConnectionState): void;
    /** @param {ConnectionState} state */
    draw(state: ConnectionState): void;
    show(): void;
    hide(): void;
    /** The app reports what it sees. @param {ConnectionState} state @param {ConnectionDetail} [detail] */
    set(state: ConnectionState, detail?: ConnectionDetail): void;
    /** Offline, refused or reconnecting: shown now, or after the grace for a short drop. @param {ConnectionState} state */
    setTrouble(state: ConnectionState): void;
    /** Back online: "Connected again" for a moment, when anything was shown. */
    setOnline(): void;
}
