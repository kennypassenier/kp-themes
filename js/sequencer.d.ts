/** The editable sequencers. */
export declare const SEQUENCER = "[data-kp-sequencer]";
/** Fired after an edit is dropped: `detail` `{ items, changed, source, total }`. */
export declare const SEQUENCER_CHANGE_EVENT = "kp-sequencer-change";
/** Fired when the selected item changes: `detail` `{ id }` (null when none). */
export declare const SEQUENCER_SELECT_EVENT = "kp-sequencer-select";
/** Fired when an edit was refused: `detail` `{ id, reason, blocker }`. */
export declare const SEQUENCER_REFUSE_EVENT = "kp-sequencer-refuse";
/** Fired when the Retry of the failed plate is pressed. */
export declare const SEQUENCER_RETRY_EVENT = "kp-sequencer-retry";
/** What one unit is, in seconds. */
export declare const SEQUENCER_UNITS: Readonly<{
    second: 1;
    minute: 60;
    hour: 3600;
    day: 86400;
    week: 604800;
}>;
/** The overlap rules. */
export declare const SEQUENCER_OVERLAPS: readonly string[];
/** The zoom limits. */
export declare const SEQUENCER_ZOOM_MIN = 0.5;
export declare const SEQUENCER_ZOOM_MAX = 16;
export type SequencerUnit = 'second' | 'minute' | 'hour' | 'day' | 'week';
export type SequencerOverlap = 'refuse' | 'push' | 'allow';
export type SequencerItem = {
    /**
     * what the page calls the item
     */
    id: string;
    /**
     * the lane's id
     */
    lane: string;
    /**
     * what it is, one line
     */
    label: string;
    /**
     * where it begins, in the unit
     */
    start: number;
    /**
     * how long it takes, in the unit
     */
    duration: number;
    /**
     * the id of the item it starts together with ("runs alongside")
     */
    with?: string | null;
    /**
     * its colour (default: the lane's)
     */
    series?: 1 | 2 | 3 | 4 | 5;
    /**
     * more words about the item, kept for the page (not drawn)
     */
    detail?: string;
    /**
     * cannot be moved or resized
     */
    locked?: boolean;
};
export type SequencerLane = {
    id: string;
    label: string;
};
export type SequencerChangeItem = {
    id: string;
    lane: string;
    start: number;
    duration: number;
    with: string | null;
};
export type SequencerRefusal = 'unknown' | 'locked' | 'overlap' | 'edge' | 'lane' | 'cycle';
export type SequencerPlan = {
    ok: boolean;
    items: SequencerItem[];
    changed: string[];
    pushed: string[];
    reason: SequencerRefusal | null;
    blocker: string | null;
};
export type SequencerEdit = {
    id: string;
    kind: 'move' | 'resize-start' | 'resize-end';
    start?: number;
    end?: number;
    lane?: string;
};
export type SequencerOptions = {
    /**
     * the snap step (default 1)
     */
    step?: number;
    /**
     * default `refuse`
     */
    overlap?: SequencerOverlap;
    /**
     * snap to the edges of other items (default true)
     */
    edges?: boolean;
    /**
     * how far an edge pulls, in the unit (default 0)
     */
    reach?: number;
    /**
     * items may change lane (default true)
     */
    laneMove?: boolean;
    /**
     * the lane ids in order, to refuse an unknown lane and to step through them
     */
    lanes?: readonly string[] | null;
    /**
     * the window's end: an edit does not push the end of what it moves past it (default none)
     */
    max?: number;
    /**
     * a move that changes nothing because it was clamped is refused (`edge`), for the keyboard
     */
    strict?: boolean;
};
export type SequencerKeyAction = {
    kind: 'move' | 'resize-start' | 'resize-end';
    by: number;
} | {
    kind: 'lane';
    by: number;
} | {
    kind: 'drop';
} | {
    kind: 'cancel';
};
export type SequencerState = 'loading' | 'ready' | 'empty' | 'error';
export type Strings = import('./strings.js').Strings;
export type SequencerAttachOptions = {
    /**
     * any of the dictionary's words, for these sequencers only
     */
    strings?: Partial<Strings>;
};
/**
 * The unit a word names: `minute`, `min`, `m`, `hours`, `d` … null when it names none.
 * @param {unknown} word
 * @returns {{ name: SequencerUnit, seconds: number } | null}
 */
export declare function sequencerUnit(word: unknown): {
    name: SequencerUnit;
    seconds: number;
} | null;
/**
 * Snap a value to the grid of `step`, or to the nearest of `candidates` (the edges of other items) when one is within `reach`.
 * @param {number} value
 * @param {number} step
 * @param {readonly number[]} [candidates]
 * @param {number} [reach]
 * @returns {number}
 */
export declare function sequencerSnap(value: number, step: number, candidates?: readonly number[], reach?: number): number;
/**
 * Clean what a page gave: strings for ids, numbers for times, a `with` that names another item (a dangling one, one that names
 * itself and a cycle are dropped).
 * @param {readonly Partial<SequencerItem>[]} raw
 * @returns {SequencerItem[]}
 */
export declare function sequencerClean(raw: readonly Partial<SequencerItem>[]): SequencerItem[];
/**
 * The ids linked to `id`, itself included: everything its `with` chains connect to it, in both directions.
 * @param {readonly SequencerItem[]} items @param {string} id
 * @returns {Set<string>}
 */
export declare function sequencerGroup(items: readonly SequencerItem[], id: string): Set<string>;
/**
 * Plan an edit: where the items end up when `edit` is applied, or why it cannot be. Pure: `items` is never changed.
 * Move: the item and everything linked to it move by the same amount (the item alone changes lane). Resize end: the item's
 * duration. Resize start: the start of the item and of everything linked to it moves, their ends stay. Every value snaps to
 * `step` and to other items' edges within `reach`; nothing starts before 0; the overlap rule settles the rest.
 * @param {readonly SequencerItem[]} items
 * @param {SequencerEdit} edit
 * @param {SequencerOptions} [options]
 * @returns {SequencerPlan}
 */
export declare function sequencerPlan(items: readonly SequencerItem[], edit: SequencerEdit, options?: SequencerOptions): SequencerPlan;
/**
 * Make `id` run alongside `partnerId`: it (and what runs alongside it) moves to the partner's start; the overlap rule settles the
 * rest. A partner whose chain leads back to the item is refused (`cycle`). Pure.
 * @param {readonly SequencerItem[]} items @param {string} id @param {string} partnerId @param {SequencerOptions} [options]
 * @returns {SequencerPlan}
 */
export declare function sequencerLink(items: readonly SequencerItem[], id: string, partnerId: string, options?: SequencerOptions): SequencerPlan;
/** Let `id` run on its own. Pure. @param {readonly SequencerItem[]} items @param {string} id @returns {SequencerPlan} */
export declare function sequencerUnlink(items: readonly SequencerItem[], id: string): SequencerPlan;
/**
 * What a key does to the item that is picked up. Arrows move by the step (Ctrl: ten steps), Shift+arrows resize the end,
 * Ctrl+Shift+arrows the start, Alt+Up/Down change lane, Enter or Space drops, Escape puts back. `by` of a move or resize is in
 * the unit, positive toward the end of the axis; `rtl` swaps left and right.
 * @param {{ key: string, shiftKey?: boolean, ctrlKey?: boolean, metaKey?: boolean, altKey?: boolean }} e
 * @param {{ step?: number, rtl?: boolean }} [options]
 * @returns {SequencerKeyAction | null}
 */
export declare function sequencerKey(e: {
    key: string;
    shiftKey?: boolean;
    ctrlKey?: boolean;
    metaKey?: boolean;
    altKey?: boolean;
}, { step, rtl }?: {
    step?: number;
    rtl?: boolean;
}): SequencerKeyAction | null;
/**
 * The plan a key makes of the picked-up item (see sequencerKey): one step on the grid, no edge snap, refused (`edge`) when
 * nothing could change.
 * @param {readonly SequencerItem[]} items @param {string} id
 * @param {Exclude<SequencerKeyAction, { kind: 'drop' } | { kind: 'cancel' }>} action
 * @param {SequencerOptions} [options]
 * @returns {SequencerPlan}
 */
export declare function sequencerApplyKey(items: readonly SequencerItem[], id: string, action: Exclude<SequencerKeyAction, {
    kind: 'drop';
} | {
    kind: 'cancel';
}>, options?: SequencerOptions): SequencerPlan;
/**
 * A row of its lane for every item: the first where nothing in the way. Items that do not overlap all take row 0.
 * @param {readonly SequencerItem[]} items @param {readonly string[]} laneIds
 * @returns {{ rows: Map<string, number>, counts: Map<string, number> }}
 */
export declare function sequencerRows(items: readonly SequencerItem[], laneIds: readonly string[]): {
    rows: Map<string, number>;
    counts: Map<string, number>;
};
/** The end of the last item, 0 when there is none. @param {readonly SequencerItem[]} items */
export declare function sequencerTotalOf(items: readonly SequencerItem[]): number;
/**
 * The window that holds a plan: the longest of `minSpan` and the plan with some room, rounded up to a whole step.
 * @param {number} total @param {number} minSpan @param {number} step
 */
export declare function sequencerWindow(total: number, minSpan: number, step: number): number;
/**
 * The axis ticks of a window `span` long (in the unit) drawn `room` px wide: the step (in the unit) and the values.
 * @param {number} span @param {number} room @param {number} unitSeconds @param {number} [gap] the px a label needs
 * @returns {{ step: number, values: number[] }}
 */
export declare function sequencerTicks(span: number, room: number, unitSeconds: number, gap?: number): {
    step: number;
    values: number[];
};
/** A zoom kept inside the limits, to the hundredth. @param {number} zoom */
export declare function sequencerClampZoom(zoom: number): number;
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
    busy: import('./busy-card.js').BusyCard | null;
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
/**
 * Attach every `[data-kp-sequencer]` under `root`. Returns a detach.
 * @param {ParentNode} [root]
 * @param {SequencerAttachOptions} [options]
 * @returns {() => void}
 */
export declare function attachSequencers(root?: ParentNode, options?: SequencerAttachOptions): () => void;
/**
 * Give the sequencer its items and lanes. Items are kept by id: a bar that stays is the same element, so a refresh keeps focus and
 * selection. Without `lanes` the lanes already given stay; a lane an item names that no lane does is added with its id as its
 * name. An edit in progress is not disturbed: the set is applied when it ends. No event: the page asked.
 * @param {Element} el
 * @param {Partial<SequencerItem>[]} items
 * @param {SequencerLane[]} [lanes]
 */
export declare function setSequencerItems(el: Element, items: Partial<SequencerItem>[], lanes?: SequencerLane[]): void;
/**
 * The items as the page last saw them: `{ id, lane, start, duration, with }` each, in the sequencer's unit.
 * @param {Element} el
 * @returns {SequencerChangeItem[]}
 */
export declare function getSequencerItems(el: Element): SequencerChangeItem[];
/**
 * The end of the last item, in the unit.
 * @param {Element} el
 * @returns {number}
 */
export declare function getSequencerTotal(el: Element): number;
/**
 * The state of the whole: `loading` (the busy card), `empty`, `error` (the plate, with its Retry as `kp-sequencer-retry`), `ready`.
 * `words` is the plate's title, `text` its sentence.
 * @param {Element} el
 * @param {SequencerState} state
 * @param {string} [words]
 * @param {{ text?: string, art?: Node | string | null }} [more]
 */
export declare function setSequencerState(el: Element, state: SequencerState, words?: string, { text, art }?: {
    text?: string;
    art?: Node | string | null;
}): void;
/**
 * Put the line for now at a point of the plan, in the unit; null takes it away.
 * @param {Element} el
 * @param {number | null} at
 */
export declare function setSequencerNow(el: Element, at: number | null): void;
/**
 * Set the zoom (1 fits the plot to its box); the window keeps its middle.
 * @param {Element} el
 * @param {number} zoom
 */
export declare function setSequencerZoom(el: Element, zoom: number): void;
/**
 * The zoom as it stands.
 * @param {Element} el
 * @returns {number}
 */
export declare function getSequencerZoom(el: Element): number;
/**
 * Select an item (or none) as a click would; no change event.
 * @param {Element} el
 * @param {string | null} id
 */
export declare function setSequencerSelection(el: Element, id: string | null): void;
