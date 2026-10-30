import { Controller } from '../controller.js';
import { getStrings } from '../strings.js';
import { stackbarParts } from './math.js';
export type StackbarSpec = import('../stackbar.js').StackbarSpec;
export type StackbarDraw = {
    spec: StackbarSpec;
    state: 'ready' | 'loading' | 'empty' | 'error';
    strings: ReturnType<typeof getStrings>;
    lang: string | undefined;
    format: (value: number) => string;
    calc: ReturnType<typeof stackbarParts>;
    pickable: boolean;
    pickedKeys: Set<string>;
    /**
     * the key of the part that had the focus
     */
    focusedKey: string | undefined;
    bar: HTMLElement;
    legendWanted: boolean;
    /**
     * an empty or failed bar is one note over the whole footprint
     */
    noted: boolean;
    /**
     * what the root will hold
     */
    nodes: Node[];
};
/** @typedef {import('../stackbar.js').StackbarSpec} StackbarSpec */
/**
 * Everything one draw reads.
 * @typedef {object} StackbarDraw
 * @property {StackbarSpec} spec
 * @property {'ready' | 'loading' | 'empty' | 'error'} state
 * @property {ReturnType<typeof getStrings>} strings
 * @property {string | undefined} lang
 * @property {(value: number) => string} format
 * @property {ReturnType<typeof stackbarParts>} calc
 * @property {boolean} pickable
 * @property {Set<string>} pickedKeys
 * @property {string | undefined} focusedKey the key of the part that had the focus
 * @property {HTMLElement} bar
 * @property {boolean} legendWanted
 * @property {boolean} noted an empty or failed bar is one note over the whole footprint
 * @property {Node[]} nodes what the root will hold
 */
export declare class StackbarCore extends Controller {
    doc: Document;
    /** How many legend rows the last ready draw had, for the loading legend. */
    parts: number;
    /** The height the bar and its legend had, kept by an empty or failed note. */
    height: number;
    /**
     * @param {HTMLElement} host
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /** @param {string} className @param {string} [tag] */
    make(className: string, tag?: string): HTMLElement;
    /** @param {number} count the legend rows a ready draw has */
    setParts(count: number): void;
    /** Read everything a draw needs from the spec and the page. @param {StackbarSpec} spec @returns {StackbarDraw} */
    context(spec: StackbarSpec): StackbarDraw;
    /** The root's own marks for this state. @param {'ready' | 'loading' | 'empty' | 'error'} state */
    markRoot(state: 'ready' | 'loading' | 'empty' | 'error'): void;
    /** The line over the bar: the title, and the sum over the whole. @param {StackbarDraw} c */
    head(c: StackbarDraw): void;
    /** The footprint of the bar and its legend, kept by an empty or failed note. */
    measure(): void;
    /** The meter's own loading picture at the bar's size, and the legend's waiting lines. @param {StackbarDraw} c */
    drawLoading(c: StackbarDraw): void;
    /** The legend as waiting lines. */
    waitingLegend(): HTMLElement;
    /**
     * Empty or failed: one calm note over the whole footprint, or the track saying it when there is no legend.
     * @param {StackbarDraw} c
     * @returns {boolean} whether the focus was in the note and has to be put back on the root
     */
    drawNote(c: StackbarDraw): boolean;
}
