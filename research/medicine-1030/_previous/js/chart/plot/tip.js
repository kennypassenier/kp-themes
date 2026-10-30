// The legend repaint, the tooltip and what the chart announces.
import { hourChange, indexAt } from '../selection.js';
import { HOUR, MINUTE } from '../time.js';
import { h } from '../dom.js';
import { paintSeries } from '../attach.js';
/** @typedef {import('./context.js').PlotContext} PlotContext */

/**
 * What the the legend repaint, the tooltip and what the chart announces part adds to the table's context.
 *
 * @typedef {{
 *     announce: () => void;
 *     paintLegend: () => void;
 *     paintTip: () => void;
 * }} TipFields
 */

/**
 * The legend repaint, the tooltip and what the chart announces.
 *
 * @param {PlotContext} c
 */
export function installTip(c) {
    const {
        doc,
        fmt,
        group,
        host,
        label,
        locale,
        medianWords,
        option,
        pin,
        pinWord,
        readout,
        showAll,
        shownEvents,
        strings,
        time,
        tip,
        tipEvents,
        tipFoot,
        tipMedian,
        tipRows,
        tipTime,
        toneOf,
        visible,
    } = c;
    c.paintLegend = paintLegend;
    c.paintTip = paintTip;
    c.announce = announce;

    function paintLegend() {
        const t = c.pinned ?? c.cursor;
        c.data.series.forEach((series, si) => {
            const it = c.items[si];
            if (!it) return;
            const on = c.sel.size === 0 || c.sel.has(si);
            const pts = c.points[si];
            const v = pts.length === 0 ? null : t != null ? pts[indexAt(pts, t)][1] : pts[pts.length - 1][1];
            it.button.setAttribute('aria-pressed', String(c.sel.has(si)));
            it.button.toggleAttribute('data-kp-off', !on);
            it.value.textContent = series.total != null && t == null ? series.total.toLocaleString(locale) : v == null ? '' : fmt(v, 'legend');
        });
        showAll.hidden = c.sel.size === 0;
    }
    /**
     * What is under the crosshair at `t`, for the tooltip and the readout;
     * for a pin outside the window only the sources whose readings still
     * reach it (within an hour), not a reading from another time.
     * @param {number} t @param {boolean} [strict]
     */
    const rowsAt = (t, strict = false) =>
        visible()
            .filter((si) => {
                const p = c.points[si];
                return p.length > 0 && (!strict || (t >= p[0][0] - HOUR && t <= p[p.length - 1][0] + HOUR));
            })
            .map((si) => {
                const k = indexAt(c.points[si], t);
                return { si, label: c.data.series[si].label || label(), v: c.points[si][k][1], d: hourChange(c.points[si], k) };
            })
            .sort((a, b) => b.v - a.v);
    /** The events within reach of `t`: a thirtieth of the window. @param {number} t */
    const eventsNear = (t) => {
        if (!c.geo) return [];
        const reach = (c.geo.to - c.geo.from) / 30;
        return shownEvents().filter((ev) =>
            ev.until != null && ev.until > ev.at ? t >= ev.at - reach && t <= ev.until + reach : Math.abs(ev.at - t) < reach,
        );
    };
    /** @param {number} d */
    const change = (d) => (d === 0 ? '±0' : `${d > 0 ? '▲' : '▼'} ${fmt(Math.abs(d), 'delta')}`);
    function paintTip() {
        // Only the chart the crosshair was moved on shows its tooltip, or a
        // pinned one: a redraw of the whole group (a zoom, a live update)
        // pops up no other.
        const t = c.pinned ?? (group.owner === c.state ? c.cursor : null);
        if (t == null || !c.geo) {
            tip.hidden = true;
            return;
        }
        // A pin the window moved past (a live update while pinned) stays,
        // docked, until it is released.
        const outside = t < c.geo.from || t > c.geo.to;
        if (outside && c.pinned == null) {
            tip.hidden = true;
            return;
        }
        tipTime.textContent = time(Math.round(t / MINUTE) * MINUTE, 'full', {});
        pin.hidden = c.pinned == null;
        pinWord.textContent = outside ? strings.pinnedOutside : strings.pinned;
        const rows = rowsAt(t, outside).map((r) => {
            const swatch = h(doc, 'i', { class: 'kp-chart__swatch', 'aria-hidden': 'true' });
            paintSeries(swatch, c.data.series[r.si], r.si);
            const row = h(
                doc,
                'div',
                { class: 'kp-chart__tip-row' },
                swatch,
                h(doc, 'span', {}, r.label),
                h(doc, 'span', { class: 'kp-chart__num' }, fmt(r.v, 'tip')),
                h(
                    doc,
                    'span',
                    { class: 'kp-chart__num kp-chart__delta', 'data-kp-direction': r.d > 0 ? 'up' : r.d < 0 ? 'down' : null },
                    change(r.d),
                ),
            );
            if (c.hot === r.si) row.setAttribute('data-kp-state', 'hot');
            return row;
        });
        tipRows.replaceChildren(...rows);
        tipRows.hidden = rows.length === 0;
        tipFoot.hidden = rows.length === 0;
        tipEvents.replaceChildren(
            ...eventsNear(t).map((ev) => {
                const line = h(
                    doc,
                    'p',
                    { class: 'kp-chart__tip-event' },
                    h(doc, 'i', { class: 'kp-chart__dot', 'data-kp-tone': toneOf(ev), 'aria-hidden': 'true' }),
                    ev.until != null && ev.until > ev.at
                        ? `${strings.bandWhen(time(ev.at, 'clock', {}), time(ev.until, 'clock', {}))} ${ev.label}`
                        : `${time(ev.at, 'clock', {})} ${ev.label}`,
                );
                if (c.pinned != null && ev.href) line.append(h(doc, 'a', { href: ev.href }, strings.open));
                return line;
            }),
        );
        // On a phone the median's words are not on the plot: the tooltip carries them.
        tipMedian.hidden = c.medians.length === 0;
        if (c.medians.length)
            tipMedian.textContent = c.medians
                .map((m) => `${c.medians.length > 1 ? `${m.label}: ` : ''}${medianWords(option())} ${fmt(m.v, 'tip')}`)
                .join('; ');
        tip.hidden = false;
        tip.toggleAttribute('data-kp-pinned', c.pinned != null);
        tip.toggleAttribute('data-kp-outside', outside);
        // Beside the crosshair, on whichever side has room, never past the
        // chart's edge; docked, in the corner away from it; a pin outside
        // the window at the edge it left by.
        const room = host.clientWidth || c.geo.W;
        const w = Math.min(tip.offsetWidth || 240, room);
        const px = outside ? (t < c.geo.from ? 0 : room) : c.geo.x(t);
        const left = outside ? (t < c.geo.from ? 0 : room - w) : px + 14 + w > room ? px - w - 14 : px + 14;
        tip.style.setProperty('--kp-chart-tip-x', `${Math.max(0, Math.min(room - w, left))}px`);
        tip.setAttribute('data-kp-side', px > room / 2 ? 'start' : 'end');
    }
    /** Say what is under the crosshair (keys and pins only: a pointer would talk too much). */
    function announce() {
        const t = c.pinned ?? c.cursor;
        if (t == null) return;
        const outside = c.geo != null && (t < c.geo.from || t > c.geo.to);
        const said = rowsAt(t, outside).map(
            (r) =>
                `${r.label} ${fmt(r.v, 'readout')}, ${r.d > 0 ? strings.up : r.d < 0 ? strings.down : strings.same}${r.d ? ` ${fmt(Math.abs(r.d), 'readout')}` : ''}`,
        );
        const near = eventsNear(t).map((ev) => `${ev.label} ${time(ev.at, 'clock', {})}`);
        for (const m of c.medians) near.push(`${medianWords(option())} ${fmt(m.v, 'readout')}`);
        const head = `${time(t, 'full', {})}${c.pinned == null ? '' : outside ? ` ${strings.pinnedOutside}` : ` (${strings.pinned})`}`;
        readout.textContent = [head, ...said, ...near].join('; ');
    }
}
