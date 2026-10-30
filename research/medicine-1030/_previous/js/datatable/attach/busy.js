// The loading overlay, the busy clock and the empty state.
import { leave, leavesState, playClose } from '../../motion.js';
import { scrollersAround, seenAcross } from '../../busy-card.js';
import { getStrings } from '../../strings.js';
/** @typedef {import('../../strings/types.js').Strings} Strings */
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the the loading overlay, the busy clock and the empty state part adds to the table's context.
 *
 * @typedef {{
 *     busySeconds: () => number;
 *     busyWas: string | null;
 *     densityWas: string | null;
 *     drawOverlay: (s: Strings) => void;
 *     emptyHidden: boolean | 'until-found';
 *     emptyWasHidden: boolean | 'until-found';
 *     overlayUnwatch: (() => void) | null;
 *     showEmpty: (hide: boolean) => void;
 *     stopBusyClock: () => void;
 *     total: number;
 * }} BusyFields
 */

/**
 * The loading overlay, the busy clock and the empty state.
 *
 * @param {TableContext} c
 */
export function installBusy(c) {
    const { make, table, wrap } = c;

    const busySeconds = () => Math.max(0, Math.floor((Date.now() - /** @type {number} */ (c.busySince)) / 1000));
    c.busySeconds = busySeconds;
    const stopBusyClock = () => {
        if (c.busyTimer !== null) clearInterval(c.busyTimer);
        c.busyTimer = null;
        c.busyClock = null;
        c.overlayClock = null;
    };
    c.stopBusyClock = stopBusyClock;
    /** Stops the layer following the table's size, while one shows. @type {(() => void) | null} */
    c.overlayUnwatch = null;
    /**
     * The layer over the rows while the table loads [busy overlay]: a
     * large spinner, the status words and the count, centred on the body
     * and hidden from assistive technology, which hears the status line.
     * Absolutely placed in the wrapper, so nothing moves when it comes or
     * goes; the header stays readable above it.
     * @param {ReturnType<typeof getStrings>} s
     */
    const drawOverlay = (s) => {
        c.overlayUnwatch?.();
        c.overlayUnwatch = null;
        if (c.overlayLayer) {
            const toClose = c.overlayLayer;
            c.overlayLayer = null;
            c.overlayClock = null;
            const panel = /** @type {HTMLElement | null} */ (toClose.querySelector('.kp-datatable__busy-panel'));
            if (panel && toClose.isConnected && c.state !== 'loading') {
                // A theme that leaves its states whole (forest: the
                // layer arrived as its leave played backwards) lets the
                // layer leave the way it came (leavesState()); the
                // others close the panel on its own.
                if (leavesState(toClose)) {
                    void leave(toClose);
                } else {
                    toClose.setAttribute('data-kp-closing', '');
                    void playClose(panel).then(() => {
                        toClose.remove();
                    });
                }
            } else {
                toClose.remove();
            }
        }
        // Placed in the wrapper rather than in the box that scrolls, so a
        // panel taller than a few rows never adds a scrollbar there.
        const host = wrap;
        if (c.state !== 'loading' || !c.busyOverlay) return;
        const layer = make('div', 'kp-datatable__busy-overlay');
        layer.setAttribute('aria-hidden', 'true');
        const panel = make('div', 'kp-datatable__busy-panel');
        const spinner = make('span', 'kp-spinner');
        const words = make('span', 'kp-datatable__busy-words');
        words.textContent = c.busyText ?? s.busy;
        panel.append(spinner, words);
        if (c.busySince !== null) {
            c.overlayClock = make('span', 'kp-datatable__busy-clock');
            c.overlayClock.textContent = s.tableBusyElapsed(busySeconds());
            panel.append(c.overlayClock);
        }
        // Measured, and measured again whenever the table or its header
        // changes size: a theme switched after it was drawn, or a font
        // arriving late, moves the header, and the layer must stay under
        // it rather than where the header first was.
        const place = () => {
            const head = table.tHead;
            const hostBox = host.getBoundingClientRect();
            const body = (table.tBodies[0] ?? table).getBoundingClientRect();
            const tableBox = (c.scrollBox ?? table).getBoundingClientRect();
            const top = head === null ? body.top : head.getBoundingClientRect().bottom;
            let from = Math.max(0, Math.round(top - hostBox.top - host.clientTop));
            let to = Math.max(0, Math.round(hostBox.bottom - Math.max(tableBox.bottom, top) - host.clientTop));
            // A table with no rows has no rows to cover: the card stands in the room the table is held at (its first load's footprint,
            // js/footprint.js), down to the status line under it, not on the strip the bare header leaves [hlfour-1019].
            if (c.all.length === 0) {
                const foot = host.querySelector('[data-kp-datatable-status]')?.closest('.kp-datatable__bar') ?? null;
                const footTop = foot !== null && foot.getBoundingClientRect().top >= top ? foot.getBoundingClientRect().top : hostBox.bottom;
                to = Math.max(0, Math.round(hostBox.bottom - footTop - host.clientTop));
            }
            // A table of a row or two is shorter than the panel: the layer lends itself the room the panel needs (and at least half the table, up to 128 px), downwards over
            // the foot, within the host, so the card is never a strip over two rows [states-two-1019].
            const need = Math.max(panel.offsetHeight + 8, Math.min(host.clientHeight / 2, 128));
            if (host.clientHeight - from - to < need) {
                to = Math.max(0, host.clientHeight - from - need);
                // A table with no rows stands near the bottom of its frame: the card then also takes the room above, over the header.
                if (host.clientHeight - from - to < need) from = Math.max(0, host.clientHeight - to - need);
            }
            layer.style.setProperty('--kp-busy-overlay-top', `${from}px`);
            layer.style.setProperty('--kp-busy-overlay-bottom', `${to}px`);
            // A table frame wider than the box that scrolls it (a table in a phone's page scroller) is covered only where it is seen, so the
            // panel is centred on what the reader sees and not on a middle off screen [laststates-1019].
            const innerLeft = hostBox.left + host.clientLeft;
            const seen = seenAcross(host, innerLeft, innerLeft + host.clientWidth);
            // A table narrower than what is seen (a bare table of a header and no rows shrinks to its words, or a table drawn at no
            // width) is not the card's width: the card spans what is seen, 0 px wide it showed no look at all [hlfour-1019].
            const spans = tableBox.width >= seen.right - seen.left - 1;
            layer.style.setProperty(
                '--kp-busy-overlay-left',
                `${Math.max(0, Math.round((spans ? Math.max(tableBox.left, seen.left) : seen.left) - innerLeft))}px`,
            );
            layer.style.setProperty(
                '--kp-busy-overlay-right',
                `${Math.max(0, Math.round(innerLeft + host.clientWidth - (spans ? Math.min(tableBox.right, seen.right) : seen.right)))}px`,
            );
        };
        layer.append(panel);
        host.append(layer);
        place();
        if (typeof ResizeObserver === 'function') {
            const watcher = new ResizeObserver(() => place());
            watcher.observe(host);
            watcher.observe(table);
            if (table.tHead !== null) watcher.observe(table.tHead);
            // Scrolled sideways inside a scrolling ancestor, the part that is seen moves: the card follows it.
            const scrollers = scrollersAround(host);
            for (const scroller of scrollers) scroller.addEventListener('scroll', place, { passive: true });
            c.overlayUnwatch = () => {
                watcher.disconnect();
                for (const scroller of scrollers) scroller.removeEventListener('scroll', place);
            };
        }
        c.overlayLayer = layer;
    };
    c.drawOverlay = drawOverlay;
    /** The server's count, in a server-backed table. */
    c.total = Number.parseInt(wrap.dataset.kpTotal ?? '', 10);
    const emptyWasHidden = c.empty?.hidden ?? false;
    c.emptyWasHidden = emptyWasHidden;
    /** The empty state is leaving now, before it is hidden (leavesState()). */
    let emptyLeaving = false;
    c.emptyHidden = emptyWasHidden;
    /**
     * Show or hide the empty state. In a theme that lets a hidden part
     * leave first it withers before it goes, and what the table wants
     * when that is over (typing went on) is applied then.
     * @param {boolean} hide
     */
    const showEmpty = (hide) => {
        if (c.empty === null) return;
        c.emptyHidden = hide;
        if (emptyLeaving) return;
        if (hide && !c.empty.hidden && c.empty.isConnected && leavesState(c.empty)) {
            emptyLeaving = true;
            void leave(c.empty, { hide: true }).then(() => {
                emptyLeaving = false;
                if (c.empty !== null) c.empty.hidden = c.emptyHidden;
            });
            return;
        }
        c.empty.hidden = hide;
    };
    c.showEmpty = showEmpty;
    const densityWas = wrap.getAttribute('data-density');
    c.densityWas = densityWas;
    const busyWas = wrap.getAttribute('aria-busy');
    c.busyWas = busyWas;
}
