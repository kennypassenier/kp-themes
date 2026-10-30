export type SequencerChangeItem = import('./units.js').SequencerChangeItem;
export type SequencerItem = import('./units.js').SequencerItem;
export type SequencerLane = import('./units.js').SequencerLane;
export type SequencerOptions = import('./units.js').SequencerOptions;
export type SequencerOverlap = import('./units.js').SequencerOverlap;
export type SequencerPlan = import('./units.js').SequencerPlan;
export type SequencerState = import('./units.js').SequencerState;
export type SequencerUnit = import('./units.js').SequencerUnit;
export type Strings = import('./units.js').Strings;
export type SequencerModel = {
    el: HTMLElement;
    strings: Strings;
    id: string;
    /**
     * the toolbar
     */
    bar: HTMLElement;
    zoomGroup: HTMLElement;
    /**
     * out, fit, in
     */
    zoomButtons: HTMLButtonElement[];
    zoomValue: HTMLElement;
    total: HTMLElement;
    frame: HTMLElement;
    scroll: HTMLElement;
    body: HTMLElement;
    axis: HTMLElement;
    lines: HTMLElement;
    /**
     * the bars
     */
    layer: HTMLElement;
    /**
     * the line for now, the end of the plan, the guide and the readout
     */
    plot: HTMLElement;
    nowLine: HTMLElement;
    endLine: HTMLElement;
    guide: HTMLElement;
    readout: HTMLElement;
    plate: HTMLElement;
    selection: HTMLElement;
    selectionText: HTMLElement;
    linkButton: HTMLButtonElement;
    unlinkButton: HTMLButtonElement;
    cancelButton: HTMLButtonElement;
    hint: HTMLElement;
    help: HTMLElement;
    announcer: HTMLElement;
    /**
     * a hidden label that wraps, to ask whether a name fits its bar
     */
    measure: HTMLElement;
    /**
     * a hidden label on one line, to ask how wide a name is
     */
    ruler: HTMLElement;
    /**
     * a hidden box one row tall and one pad wide, to read both in px
     */
    probe: HTMLElement;
    rowPx: number;
    padPx: number;
    unit: {
        name: SequencerUnit;
        seconds: number;
    };
    step: number;
    overlap: SequencerOverlap;
    edges: boolean;
    laneMove: boolean;
    editable: boolean;
    minSpan: number;
    /**
     * committed
     */
    items: SequencerItem[];
    /**
     * what is drawn (items, or the draft of an edit in progress)
     */
    view: SequencerItem[];
    lanes: SequencerLane[];
    rows: {
        rows: Map<string, number>;
        counts: Map<string, number>;
    };
    span: number;
    zoom: number;
    nowAt: number | null;
    state: SequencerState;
    stateWords: string;
    stateText: string;
    stateArt: Node | string | null;
    plateKey: string;
    laneKey: string;
    tickKey: string;
    laneEls: HTMLElement[];
    laneTops: {
        id: string;
        top: number;
    }[];
    bars: Map<string, HTMLButtonElement>;
    outsides: Map<string, HTMLElement>;
    joins: Map<string, HTMLElement>;
    selected: string | null;
    /**
     * the item that holds the tab stop
     */
    focusId: string | null;
    linking: string | null;
    /**
     * an item picked up with the keyboard
     */
    kb: {
        id: string;
        before: SequencerItem[];
    } | null;
    press: {
        id: string;
        edge: 'start' | 'end' | 'body';
        x: number;
        y: number;
        pointer: number;
        grab: number;
        bar: HTMLButtonElement;
        moved: boolean;
        before: SequencerItem[];
        refused: boolean;
        lanes: {
            id: string;
            top: number;
            bottom: number;
        }[];
        last: SequencerPlan | null;
        edgeX: number;
    } | null;
    pending: {
        items: Partial<SequencerItem>[];
        lanes: SequencerLane[] | undefined;
    } | null;
    busy: import('../busy-card.js').BusyCard | null;
    leaving: Promise<void> | null;
    touches: Map<number, {
        x: number;
    }>;
    pinch: {
        dist: number;
        zoom: number;
    } | null;
    scrollTimer: number;
    frameTimer: number;
    drawn: boolean;
    observer: ResizeObserver | null;
};
/** @typedef {import('./units.js').SequencerChangeItem} SequencerChangeItem */
/** @typedef {import('./units.js').SequencerItem} SequencerItem */
/** @typedef {import('./units.js').SequencerLane} SequencerLane */
/** @typedef {import('./units.js').SequencerOptions} SequencerOptions */
/** @typedef {import('./units.js').SequencerOverlap} SequencerOverlap */
/** @typedef {import('./units.js').SequencerPlan} SequencerPlan */
/** @typedef {import('./units.js').SequencerState} SequencerState */
/** @typedef {import('./units.js').SequencerUnit} SequencerUnit */
/** @typedef {import('./units.js').Strings} Strings */
/**
 * @typedef {object} SequencerModel
 * @property {HTMLElement} el
 * @property {Strings} strings
 * @property {string} id
 * @property {HTMLElement} bar the toolbar
 * @property {HTMLElement} zoomGroup
 * @property {HTMLButtonElement[]} zoomButtons out, fit, in
 * @property {HTMLElement} zoomValue
 * @property {HTMLElement} total
 * @property {HTMLElement} frame
 * @property {HTMLElement} scroll
 * @property {HTMLElement} body
 * @property {HTMLElement} axis
 * @property {HTMLElement} lines
 * @property {HTMLElement} layer the bars
 * @property {HTMLElement} plot the line for now, the end of the plan, the guide and the readout
 * @property {HTMLElement} nowLine
 * @property {HTMLElement} endLine
 * @property {HTMLElement} guide
 * @property {HTMLElement} readout
 * @property {HTMLElement} plate
 * @property {HTMLElement} selection
 * @property {HTMLElement} selectionText
 * @property {HTMLButtonElement} linkButton
 * @property {HTMLButtonElement} unlinkButton
 * @property {HTMLButtonElement} cancelButton
 * @property {HTMLElement} hint
 * @property {HTMLElement} help
 * @property {HTMLElement} announcer
 * @property {HTMLElement} measure a hidden label that wraps, to ask whether a name fits its bar
 * @property {HTMLElement} ruler a hidden label on one line, to ask how wide a name is
 * @property {HTMLElement} probe a hidden box one row tall and one pad wide, to read both in px
 * @property {number} rowPx
 * @property {number} padPx
 * @property {{ name: SequencerUnit, seconds: number }} unit
 * @property {number} step
 * @property {SequencerOverlap} overlap
 * @property {boolean} edges
 * @property {boolean} laneMove
 * @property {boolean} editable
 * @property {number} minSpan
 * @property {SequencerItem[]} items committed
 * @property {SequencerItem[]} view what is drawn (items, or the draft of an edit in progress)
 * @property {SequencerLane[]} lanes
 * @property {{ rows: Map<string, number>, counts: Map<string, number> }} rows
 * @property {number} span
 * @property {number} zoom
 * @property {number | null} nowAt
 * @property {SequencerState} state
 * @property {string} stateWords
 * @property {string} stateText
 * @property {Node | string | null} stateArt
 * @property {string} plateKey
 * @property {string} laneKey
 * @property {string} tickKey
 * @property {HTMLElement[]} laneEls
 * @property {{ id: string, top: number }[]} laneTops
 * @property {Map<string, HTMLButtonElement>} bars
 * @property {Map<string, HTMLElement>} outsides
 * @property {Map<string, HTMLElement>} joins
 * @property {string | null} selected
 * @property {string | null} focusId the item that holds the tab stop
 * @property {string | null} linking
 * @property {{ id: string, before: SequencerItem[] } | null} kb an item picked up with the keyboard
 * @property {{ id: string, edge: 'start' | 'end' | 'body', x: number, y: number, pointer: number, grab: number, bar: HTMLButtonElement, moved: boolean, before: SequencerItem[], refused: boolean, lanes: { id: string, top: number, bottom: number }[], last: SequencerPlan | null, edgeX: number } | null} press
 * @property {{ items: Partial<SequencerItem>[], lanes: SequencerLane[] | undefined } | null} pending
 * @property {import('../busy-card.js').BusyCard | null} busy
 * @property {Promise<void> | null} leaving
 * @property {Map<number, { x: number }>} touches
 * @property {{ dist: number, zoom: number } | null} pinch
 * @property {number} scrollTimer
 * @property {number} frameTimer
 * @property {boolean} drawn
 * @property {ResizeObserver | null} observer
 */
/** @type {WeakMap<Element, SequencerModel>} */
export declare const sequencers: WeakMap<Element, SequencerModel>;
/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {Document} doc @param {K} tag @param {string} [className] @param {string} [text]
 * @returns {HTMLElementTagNameMap[K]}
 */
export declare const make: <K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, className?: string, text?: string) => HTMLElementTagNameMap[K];
/** @param {number} n */
export declare const px: (n: number) => string;
/** @param {SequencerModel} c @param {number} value */
export declare const words: (c: SequencerModel, value: number) => string;
/** The item as a screen reader and the selection line say it. @param {SequencerModel} c @param {SequencerItem} item */
export declare function summary(c: SequencerModel, item: SequencerItem): string;
/** @param {SequencerModel} c @param {string} id */
export declare const labelOf: (c: SequencerModel, id: string) => string;
/** Say something politely, even the same sentence twice. @param {SequencerModel} c @param {string} text */
export declare function announce(c: SequencerModel, text: string): void;
/** @param {SequencerModel} c @param {string} name @param {unknown} detail */
export declare const emit: (c: SequencerModel, name: string, detail: unknown) => boolean;
/** @param {SequencerModel} c @param {SequencerItem[]} list @returns {SequencerChangeItem[]} */
export declare const outItems: (c: SequencerModel, list: SequencerItem[]) => SequencerChangeItem[];
/** The options as the attributes say them. @param {SequencerModel} c */
export declare function readOptions(c: SequencerModel): void;
/** The options a plan takes. @param {SequencerModel} c @param {{ max?: number, reach?: number, edges?: boolean }} [more] @returns {SequencerOptions} */
export declare const planOptions: (c: SequencerModel, more?: {
    max?: number;
    reach?: number;
    edges?: boolean;
}) => SequencerOptions;
