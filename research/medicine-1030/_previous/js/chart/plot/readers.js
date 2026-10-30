// Small readers of the chart's state: visible series, window, tones and options.
import { HOUR } from '../time.js';
import { CHART_SELECT_EVENT } from '../constants.js';
import { decorateWith } from '../dom.js';
/** @typedef {import('../words.js').ChartEvent} ChartEvent */
/** @typedef {import('../words.js').ChartWindow} ChartWindow */
/** @typedef {import('./context.js').PlotContext} PlotContext */

/**
 * What the small readers of the chart's state: visible series, window, tones and options part adds to the table's context.
 *
 * @typedef {{
 *     decorateOwn: () => void;
 *     kindOf: (ev: ChartEvent) => string;
 *     kindWord: (kind: string) => string;
 *     option: () => { median: boolean; medianWords: string; runs: boolean; minPoints: number; minUnit: string; key: boolean; band: 'tint' | 'hatch' | 'bracket'; };
 *     range: () => ChartWindow | null;
 *     setSel: (next: Set<number>) => void;
 *     shownEvents: () => ChartEvent[];
 *     toneOf: (ev: ChartEvent) => 'critical' | 'warning' | 'info';
 *     visible: () => number[];
 * }} ReadersFields
 */

/**
 * Small readers of the chart's state: visible series, window, tones and options.
 *
 * @param {PlotContext} c
 */
export function installReaders(c) {
    const { decorate, group, host, key, kindsOff, plot, release, showAll, strings } = c;

    const visible = () => c.points.map((_, i) => i).filter((i) => c.sel.size === 0 || c.sel.has(i));
    c.visible = visible;
    /** @returns {ChartWindow | null} */
    const range = () => {
        if (group.zoom) return group.zoom;
        const first = Math.min(...c.points.map((p) => p[0]?.[0] ?? Infinity));
        const to = c.data.to ?? group.end() ?? Math.max(...c.points.map((p) => p[p.length - 1]?.[0] ?? -Infinity));
        let from = c.data.from ?? (group.span != null ? to - group.span : first);
        // One reading and no range: an hour up to it, so its dot is drawn.
        if (from === to && c.data.from == null) from = to - HOUR;
        return Number.isFinite(from) && Number.isFinite(to) && to > from ? { from, to } : null;
    };
    c.range = range;
    /** @param {Set<number>} next */
    const setSel = (next) => {
        c.sel = next;
        host.dispatchEvent(new CustomEvent(CHART_SELECT_EVENT, { bubbles: true, detail: { on: [...c.sel].sort((a, b) => a - b) } }));
    };
    c.setSel = setSel;
    /** Mark the chart's own controls again (its key may have changed). */
    const decorateOwn = () => {
        decorateWith(decorate, plot, { kind: 'plot', host, key: key() });
        decorateWith(decorate, showAll, { kind: 'show-all', host, key: key() });
        decorateWith(decorate, release, { kind: 'release', host, key: key() });
    };
    c.decorateOwn = decorateOwn;
    /** @param {ChartEvent} ev the tone an event is drawn in: its own, else its kind's, else info */
    const toneOf = (ev) => ev.tone ?? (ev.kind ? c.data.kinds?.[ev.kind]?.tone : undefined) ?? 'info';
    c.toneOf = toneOf;
    /** @param {ChartEvent} ev the key item an event belongs to: its kind, else its tone */
    const kindOf = (ev) => ev.kind ?? toneOf(ev);
    c.kindOf = kindOf;
    /** @param {string} kind */
    const kindWord = (kind) =>
        c.data.kinds?.[kind]?.label ?? (kind === 'info' || kind === 'warning' || kind === 'critical' ? strings.kindTone(kind) : kind);
    c.kindWord = kindWord;
    /** The events the key has not switched off. */
    const shownEvents = () => (c.data.events ?? []).filter((ev) => !kindsOff.has(kindOf(ev)));
    c.shownEvents = shownEvents;
    /** Reads a chart option from the data, else from the element's attribute. */
    const option = () => {
        const attr = (/** @type {string} */ name) => host.getAttribute(`data-kp-chart-${name}`);
        const medianAttr = attr('median');
        const median = c.data.median ?? (medianAttr !== null && medianAttr !== 'off');
        const min = Number(c.data.minPoints ?? attr('min-points'));
        return {
            median: median !== false,
            medianWords: typeof c.data.median === 'string' ? c.data.median : (attr('median-label') ?? ''),
            runs: (c.data.runs ?? attr('runs')) === 'mark',
            minPoints: Number.isFinite(min) && min > 0 ? Math.floor(min) : 0,
            minUnit: c.data.minUnit ?? attr('min-unit') ?? '',
            key: c.data.annotationKey ?? attr('annotation-key') !== 'off',
            band: /** @type {'tint' | 'hatch' | 'bracket'} */ (
                (c.data.band ?? attr('band')) === 'hatch' ? 'hatch' : (c.data.band ?? attr('band')) === 'bracket' ? 'bracket' : 'tint'
            ),
        };
    };
    c.option = option;
}
