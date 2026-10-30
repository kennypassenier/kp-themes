// Pointer, keyboard and focus handling of the plot.
import { indexAt } from '../selection.js';
/** @typedef {import('./context.js').PlotContext} PlotContext */

/**
 * Pointer, keyboard and focus handling of the plot.
 *
 * @param {PlotContext} c
 */
export function installPointer(c) {
    const { announce, draw, group, plot, range, setSel, tip, visible } = c;

    /** @param {PointerEvent} e */
    const timeAt = (e) => {
        if (!c.geo) return null;
        return c.geo.inv(e.clientX - c.geo.svg.getBoundingClientRect().left);
    };
    plot.addEventListener('pointerdown', (e) => {
        if (!c.geo || e.button !== 0) return;
        const mark = /** @type {Element} */ (e.target).closest?.('.kp-chart__mark');
        if (mark) {
            c.pinned = Number(mark.getAttribute('data-at'));
            group.cursor(c.pinned, c.state);
            announce();
            return;
        }
        const left = e.clientX - c.geo.svg.getBoundingClientRect().left;
        c.brush = { x0: left, x1: left };
        plot.setPointerCapture?.(e.pointerId);
    });
    /** @param {PointerEvent} e */
    const onPointer = (e) => {
        if (!c.geo) return;
        if (c.brush) {
            c.brush.x1 = Math.max(c.geo.P.l, Math.min(c.geo.W - c.geo.P.r, e.clientX - c.geo.svg.getBoundingClientRect().left));
            draw();
            return;
        }
        // Over a marker the crosshair snaps to its event.
        const mark = /** @type {Element} */ (e.target).closest?.('.kp-chart__mark');
        const t = mark ? Number(mark.getAttribute('data-at')) : timeAt(e);
        if (t == null || t < c.geo.from || t > c.geo.to) return;
        group.cursor(t, c.state);
    };
    // Entering takes the crosshair at once: the move that brought the
    // pointer may have reached the chart it left last.
    plot.addEventListener('pointerenter', onPointer);
    plot.addEventListener('pointermove', onPointer);
    plot.addEventListener('pointerup', (e) => {
        if (!c.brush || !c.geo) return;
        const b = c.brush;
        c.brush = null;
        if (Math.abs(b.x1 - b.x0) > 6) {
            c.pinned = null;
            group.setZoom({ from: c.geo.inv(Math.min(b.x0, b.x1)), to: c.geo.inv(Math.max(b.x0, b.x1)) });
        } else {
            const t = timeAt(e);
            if (t == null) return;
            c.pinned = c.pinned != null && Math.abs(c.geo.x(c.pinned) - c.geo.x(t)) < 4 ? null : t;
            draw();
            announce();
        }
    });
    plot.addEventListener('pointercancel', () => {
        c.brush = null;
        draw();
    });
    // Leaving clears the crosshair only while this chart has it: the
    // pointer may already have moved it on another chart of the group.
    plot.addEventListener('pointerleave', () => {
        if (!c.brush && group.owner === c.state) group.cursor(null, c.state);
    });
    plot.addEventListener('dblclick', () => group.setZoom(null));
    plot.addEventListener('keydown', (e) => {
        const si = visible().find((i) => c.points[i].length > 0);
        const pts = si == null ? null : c.points[si];
        if (!pts) return;
        let k = indexAt(pts, c.pinned ?? c.cursor ?? pts[pts.length - 1][0]);
        const step = e.shiftKey ? 10 : 1;
        if (e.key === 'ArrowLeft') k -= step;
        else if (e.key === 'ArrowRight') k += step;
        else if (e.key === 'Home') k = 0;
        else if (e.key === 'End') k = pts.length - 1;
        else if (e.key === 'Enter') {
            e.preventDefault();
            // Nothing under the crosshair yet: pin the newest point.
            const at = c.cursor ?? pts[k][0];
            c.pinned = c.pinned != null ? null : at;
            group.cursor(at, c.state);
            announce();
            return;
        } else if (e.key === 'Escape') {
            e.stopPropagation();
            if (c.pinned != null) c.pinned = null;
            else if (c.sel.size) setSel(new Set());
            else if (group.zoom) group.setZoom(null);
            draw();
            return;
        } else return;
        e.preventDefault();
        // Within the window on view (a zoom keeps the crosshair inside it).
        const win = range();
        k = Math.max(0, Math.min(pts.length - 1, k));
        if (win) {
            while (k > 0 && pts[k][0] > win.to) k--;
            while (k < pts.length - 1 && pts[k][0] < win.from) k++;
        }
        const t = pts[k][0];
        if (c.pinned != null) c.pinned = t;
        group.cursor(t, c.state);
        announce();
    });
    plot.addEventListener('focus', () => {
        if (c.cursor != null || !plot.matches(':focus-visible')) return;
        const win = range();
        if (win) group.cursor(win.to, c.state);
        announce();
    });
    plot.addEventListener('blur', (e) => {
        // Into the pinned tooltip (its ✕, an event's link) the reading stays.
        if (c.pinned == null && group.owner === c.state && !tip.contains(/** @type {Node | null} */ (e.relatedTarget))) group.cursor(null, c.state);
    });
}
