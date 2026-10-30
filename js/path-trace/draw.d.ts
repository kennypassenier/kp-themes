import { getStrings } from '../strings.js';
import { TraceCore } from './core.js';
export type TraceHop = import('../path-trace.js').TraceHop;
export type Strings = ReturnType<typeof getStrings>;
/** @typedef {import('../path-trace.js').TraceHop} TraceHop */
/** @typedef {ReturnType<typeof getStrings>} Strings */
export declare class TraceDraw extends TraceCore {
    draw(): void;
    /** @param {Strings} s */
    drawEmpty(s: Strings): void;
    /** @param {Strings} s */
    drawError(s: Strings): void;
    /** The step list's items: a title, a note and the verdict as the time. @param {{ hop: TraceHop, state: 'done' | 'failed' | 'skipped' | 'pending' }[]} rows @param {boolean} ghost @param {string} ruleMode @param {Strings} s */
    hopItems(rows: {
        hop: TraceHop;
        state: 'done' | 'failed' | 'skipped' | 'pending';
    }[], ghost: boolean, ruleMode: string, s: Strings): {
        id: string;
        title: string;
        note: string;
        state: "done" | "failed" | "pending" | "skipped";
        time: string;
    }[];
    /** The words the page says, not the step list's own ("done", "failed"), and the deciding rule as a chip. @param {HTMLElement} list @param {{ hop: TraceHop, state: 'done' | 'failed' | 'skipped' | 'pending' }[]} rows @param {string} ruleMode @param {Strings} s */
    dressItems(list: HTMLElement, rows: {
        hop: TraceHop;
        state: 'done' | 'failed' | 'skipped' | 'pending';
    }[], ruleMode: string, s: Strings): void;
    /** @param {TraceHop} hop @param {Strings} s */
    ruleChip(hop: TraceHop, s: Strings): HTMLButtonElement;
    /** The copy and swap buttons under the hops. @param {Strings} s @param {'first-refusal' | 'all'} stop */
    drawFoot(s: Strings, stop: 'first-refusal' | 'all'): void;
}
