// The chart's mutable state and the elements it draws into.
import { DATA } from '../api.js';
import { dataInMarkup, h } from '../dom.js';
import { chartHeight, valueFormat } from '../attach.js';
import { chartState } from '../state.js';
/** @typedef {import('../words.js').ChartData} ChartData */
/** @typedef {import('../words.js').ChartDecorate} ChartDecorate */
/** @typedef {import('../words.js').ChartPoint} ChartPoint */
/** @typedef {import('../words.js').ChartTimeContext} ChartTimeContext */
/** @typedef {import('../words.js').ChartTimeStyle} ChartTimeStyle */
/** @typedef {import('../words.js').ChartValueWhere} ChartValueWhere */
/** @typedef {import('./context.js').PlotContext} PlotContext */

/**
 * What the the chart's mutable state and the elements it draws into part adds to the table's context.
 *
 * @typedef {{
 *     annKey: HTMLElement;
 *     axisMemo: { key: string; axis: { stride: number; ticks: number[]; }; };
 *     behind: boolean;
 *     brush: { x0: number; x1: number; } | null;
 *     clip: string;
 *     cursor: number | null;
 *     data: ChartData;
 *     decorate: ChartDecorate | undefined;
 *     doc: Document;
 *     drawnFor: string;
 *     drawnKey: () => string;
 *     drawnWindow: string;
 *     fmt: (v: number, where: ChartValueWhere) => string;
 *     geo: { x: (t: number) => number; inv: (px: number) => number; W: number; P: { l: number; r: number; t: number; b: number; }; from: number; to: number; svg: SVGSVGElement; } | null;
 *     held: boolean;
 *     hint: HTMLElement;
 *     hot: number | null;
 *     items: { button: HTMLElement; value: HTMLElement; }[];
 *     key: () => string | undefined;
 *     keyMemo: string;
 *     kindsOff: Set<string>;
 *     label: () => string;
 *     legend: HTMLElement;
 *     medians: { si: number; label: string; v: number; }[];
 *     note: HTMLElement;
 *     parts: HTMLElement[];
 *     pin: HTMLElement;
 *     pinWord: HTMLElement;
 *     pinned: number | null;
 *     plot: HTMLElement;
 *     points: ChartPoint[][];
 *     readout: HTMLElement;
 *     release: HTMLElement;
 *     sel: Set<number>;
 *     showAll: HTMLElement;
 *     shown: string;
 *     skeleton: boolean;
 *     strings: { plot: (label: string) => string; spark: (label: string) => string; sources: (label: string) => string; source: (label: string) => string; showAll: string; showAllTitle: string; hintPointer: string; hintTouch: string; pinned: string; release: string; change: string; open: string; mark: (label: string, time: string) => string; zoomed: (from: string, to: string) => string; zoomedSpan: (span: string) => string; zoomedByEnds: boolean; reset: string; resetTitle: string; up: string; down: string; same: string; now: string; empty: string; retry: string; trendFailed: string; onePoint: string; loading: string; pinnedOutside: string; today: string; yesterday: string; trendKeys: string; median: string; few: (have: number, need: number, unit: string) => string; fewUnit: string; keyLabel: string; kindTone: (tone: string) => string; runsKey: string; markBand: (label: string, from: string, until: string) => string; bandWhen: (from: string, until: string) => string; edgeBefore: (count: number) => string; edgeAfter: (count: number) => string; kindOn: (kind: string) => string; };
 *     time: (ms: number, style: ChartTimeStyle, ctx: ChartTimeContext) => string;
 *     tip: HTMLElement;
 *     tipEvents: HTMLElement;
 *     tipFoot: HTMLElement;
 *     tipMedian: HTMLElement;
 *     tipRows: HTMLElement;
 *     tipTime: HTMLElement;
 * }} SetupFields
 */

/**
 * The chart's mutable state and the elements it draws into.
 *
 * @param {PlotContext} c
 */
export function installSetup(c) {
    const { ctx, host, locale } = c;

    const doc = host.ownerDocument;
    c.doc = doc;
    const { strings, time, decorate } = ctx;
    c.strings = strings;
    c.time = time;
    c.decorate = decorate;
    /** @type {ChartData} */
    c.data = DATA.get(host) ?? dataInMarkup(host) ?? { series: [] };
    /** @type {ChartPoint[][]} */
    c.points = [];
    const fmt = valueFormat(locale, ctx, () => c.data);
    c.fmt = fmt;
    /** @type {Set<number>} */
    c.sel = new Set();
    /** @type {number | null} */
    c.hot = null;
    /** @type {number | null} */
    c.pinned = null;
    /** @type {number | null} */
    c.cursor = null;
    /** @type {{ x0: number, x1: number } | null} */
    c.brush = null;
    const clip = `kp-chart-clip-${++chartState.clipIds}`;
    c.clip = clip;
    const label = () => c.data.label ?? host.getAttribute('aria-label') ?? '';
    c.label = label;
    const key = () => c.data.key ?? host.getAttribute('data-kp-key') ?? undefined;
    c.key = key;
    /** The time axis of the last window drawn: a hover redraws, the window stays. */
    c.axisMemo = { key: '', axis: { stride: 0, ticks: /** @type {number[]} */ ([]) } };
    /** The state the plot shows instead of lines, and its words, as last drawn. */
    c.shown = '';
    /** The window ('from to') the plot was last drawn in; '' while it shows a state instead. */
    c.drawnWindow = '';
    /** What the plot was last drawn for: its width, its height and the host attributes that change the drawing. */
    c.drawnFor = '';
    /** Held back while off screen (see ChartOptions.lazy); true from the moment a draw was skipped until the next. */
    c.held = false;
    c.behind = false;
    const drawnKey = () =>
        `${plot.clientWidth} ${chartHeight(host, c.data)} ${host.hasAttribute('data-kp-chart-loading')} ${host.getAttribute('data-kp-chart-sources')}`;
    c.drawnKey = drawnKey;
    host.classList.add('kp-chart');
    const plot = h(doc, 'div', { class: 'kp-chart__plot', tabindex: '0', role: 'application' });
    c.plot = plot;
    // The tooltip's parts stay: a live update changes their words, so a
    // focused ✕ keeps its focus.
    const tipTime = h(doc, 'b');
    c.tipTime = tipTime;
    const release = h(doc, 'button', { type: 'button', class: 'kp-chart__release', 'aria-label': strings.release, title: strings.release }, '✕');
    c.release = release;
    const pinWord = h(doc, 'span');
    c.pinWord = pinWord;
    const pin = h(doc, 'span', { class: 'kp-chart__pin' }, pinWord, release);
    c.pin = pin;
    const tipRows = h(doc, 'div', { class: 'kp-chart__tip-rows' });
    c.tipRows = tipRows;
    const tipFoot = h(doc, 'p', { class: 'kp-chart__tip-foot' }, strings.change);
    c.tipFoot = tipFoot;
    const tipEvents = h(doc, 'div', { class: 'kp-chart__tip-events' });
    c.tipEvents = tipEvents;
    const tip = h(doc, 'div', { class: 'kp-chart__tip' }, h(doc, 'p', { class: 'kp-chart__tip-head' }, tipTime, pin), tipRows, tipFoot, tipEvents);
    c.tip = tip;
    tip.hidden = true;
    const note = h(doc, 'p', { class: 'kp-chart__note' }, strings.onePoint);
    c.note = note;
    note.hidden = true;
    const readout = h(doc, 'p', { class: 'kp-chart__readout kp-sr-only', 'aria-live': 'polite' });
    c.readout = readout;
    const legend = h(doc, 'div', { class: 'kp-chart__legend', role: 'group' });
    c.legend = legend;
    const showAll = h(doc, 'button', { type: 'button', class: 'kp-chart__show-all', title: strings.showAllTitle }, strings.showAll);
    c.showAll = showAll;
    showAll.hidden = true;
    const hint = h(
        doc,
        'p',
        { class: 'kp-chart__hint' },
        h(doc, 'span', { 'data-kp-when': 'pointer' }, strings.hintPointer),
        h(doc, 'span', { 'data-kp-when': 'touch' }, strings.hintTouch),
    );
    c.hint = hint;
    // The key above the plot [kpadopt5-people]: the kinds of event the data holds, each a switch.
    const annKey = h(doc, 'div', { class: 'kp-chart__annkey', role: 'group' });
    c.annKey = annKey;
    annKey.hidden = true;
    /** The kinds the reader switched off. @type {Set<string>} */
    const kindsOff = new Set();
    c.kindsOff = kindsOff;
    /** What the key was last built from, so a redraw keeps the focused switch. */
    c.keyMemo = '';
    /** The median of each shown source, as last drawn. @type {{ si: number, label: string, v: number }[]} */
    c.medians = [];
    const tipMedian = h(doc, 'p', { class: 'kp-chart__tip-median' });
    c.tipMedian = tipMedian;
    tipMedian.hidden = true;
    tip.append(tipMedian);
    const parts = [annKey, plot, tip, note, readout, legend, hint];
    c.parts = parts;
    host.append(...parts);
    /** @type {{ button: HTMLElement, value: HTMLElement }[]} */
    c.items = [];
    /** The legend row holds skeletons while the chart loads. */
    c.skeleton = false;
    /** @type {null | { x: (t: number) => number, inv: (px: number) => number, W: number, P: { l: number, r: number, t: number, b: number }, from: number, to: number, svg: SVGSVGElement }} */
    c.geo = null;
}
