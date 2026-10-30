import { Controller } from '../controller.js';
export type TraceHop = import('../path-trace.js').TraceHop;
export type TraceState = 'ready' | 'running' | 'empty' | 'error';
/** @typedef {import('../path-trace.js').TraceHop} TraceHop */
/** @typedef {'ready' | 'running' | 'empty' | 'error'} TraceState */
export declare class TraceCore extends Controller {
    doc: Document;
    summary: HTMLElement;
    stage: HTMLElement;
    foot: HTMLElement;
    /** @type {readonly TraceHop[]} */
    hops: readonly TraceHop[];
    /** @type {TraceState} */
    state: TraceState;
    message: string;
    /** @type {import('../busy-card.js').BusyCard | null} */
    busy: import('../busy-card.js').BusyCard | null;
    /** The height of the last ready trace, held while another state stands in its place [px]. */
    kept: number;
    /**
     * @param {HTMLElement} host
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /** @param {string} tag @param {string} className */
    made(tag: string, className: string): HTMLElement;
    /** An attribute of the host with a default. @param {string} name @param {string} fallback */
    attr(name: string, fallback: string): string;
    /** Whether a hop's verdict ends the packet at the first refusal or counts each hop on its own. @returns {'first-refusal' | 'all'} */
    stop(): 'first-refusal' | 'all';
    /** The hops were given: the trace is ready. @param {readonly TraceHop[]} hops */
    takeHops(hops: readonly TraceHop[]): void;
    /** The height of what was drawn is kept for the states that stand in its place. */
    keepHeight(): void;
    /** @param {TraceState} next @param {string} message */
    takeState(next: TraceState, message: string): void;
    clearBusy(): void;
    /** The theme's busy card over the placeholder hops. @param {HTMLElement} list */
    openBusy(list: HTMLElement): void;
}
