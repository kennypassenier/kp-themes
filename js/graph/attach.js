// Attaches the graph to its element and wires its events.
import { resolveStrings } from '../strings.js';
import { GRAPH, GRAPH_OPTION_ATTRIBUTES } from './constants.js';
import { ZOOM_MAX, ZOOM_MIN, ZOOM_STEP, graphs, isShown, make, svgEl } from './instance.js';
import { dataChild, graphHideKind, graphZoom, setGraphData } from './api.js';
import { graphOptionsOf } from './options.js';
import { keyOf } from './layout.js';
import { drawGraph } from './draw.js';
import { applyView, clampView, fitDrawnLabels, graphChanged, pictureAt, renderDetail, restyleGraph, revealNode, zoomTo } from './view.js';
/** @typedef {import('./options.js').GraphDecorateInfo} GraphDecorateInfo */
/** @typedef {import('./options.js').GraphDetailInfo} GraphDetailInfo */
/** @typedef {import('./instance.js').GraphModel} GraphModel */

/**
 * Build every graph under `root`: a bar with the kinds and Show all, the
 * picture (one tab stop: arrows between nodes, Enter or Space picks, Esc
 * shows all), and the hint under it in the page's flow. A graph's data is the
 * page's: a `script[type="application/json"][data-kp-graph-data]` child, or
 * `setGraphData()` after the attach; until then it shows loading. The options
 * are attributes on the graph (see the top of this file); `detail` is the hook
 * that fills a picked node's details panel.
 * @param {ParentNode} [root]
 * @param {{ decorate?: (part: Element, info: GraphDecorateInfo) => void, strings?: Partial<import('../strings.js').Strings>,
 *   detail?: (info: GraphDetailInfo) => Node | string | null | void }} [options]
 * @returns {() => void} detach
 */
export function attachGraphs(root = document, { decorate, strings, detail } = {}) {
    /** @type {(() => void)[]} */
    const undo = [];
    const s = resolveStrings(strings);
    const hosts = /** @type {HTMLElement[]} */ ([...(root instanceof Element && root.matches(GRAPH) ? [root] : []), ...root.querySelectorAll(GRAPH)]);
    for (const el of hosts) {
        if (graphs.has(el)) continue;
        const doc = el.ownerDocument;
        const view = doc.defaultView;
        const initial = dataChild(el);
        const script = el.querySelector(':scope > script[data-kp-graph-data]');
        const bar = make(doc, 'div', 'kp-graph__bar');
        const legend = make(doc, 'ul', 'kp-graph__kinds');
        legend.setAttribute('aria-label', s.graphKinds);
        legend.hidden = true;
        const showAll = make(doc, 'button', 'kp-button kp-button--sm kp-graph__show-all', s.graphShowAll);
        showAll.type = 'button';
        showAll.title = s.graphShowAllTitle;
        showAll.setAttribute('data-kp-idle', '');
        bar.append(legend, showAll);
        const box = make(doc, 'div', 'kp-graph__box');
        const svg = /** @type {SVGSVGElement} */ (/** @type {unknown} */ (svgEl(doc, 'svg', { class: 'kp-graph__svg', role: 'group' })));
        svg.setAttribute('aria-label', `${el.getAttribute('aria-label') ?? s.graphUnnamed}. ${s.graphHint}`);
        const note = make(doc, 'p', 'kp-graph__note');
        note.setAttribute('role', 'status');
        const plate = make(doc, 'div', 'kp-graph__state');
        plate.hidden = true;
        // The zoom controls and the details panel stand inside the picture; both are hidden until their option is on.
        const zoomBox = make(doc, 'div', 'kp-graph__zoom');
        zoomBox.setAttribute('role', 'group');
        zoomBox.setAttribute('aria-label', s.graphZoom);
        zoomBox.hidden = true;
        const zoomOut = make(doc, 'button', 'kp-button kp-button--sm kp-graph__zoom-out', '−');
        const zoomIn = make(doc, 'button', 'kp-button kp-button--sm kp-graph__zoom-in', '+');
        const zoomReset = make(doc, 'button', 'kp-button kp-button--sm kp-graph__zoom-reset', s.graphZoomReset);
        for (const [button, label] of /** @type {const} */ ([
            [zoomOut, s.graphZoomOut],
            [zoomIn, s.graphZoomIn],
            [zoomReset, s.graphZoomResetTitle],
        ])) {
            button.type = 'button';
            button.title = label;
            button.setAttribute('aria-label', label);
        }
        zoomBox.append(zoomOut, zoomIn, zoomReset);
        const panel = make(doc, 'aside', 'kp-graph__detail');
        panel.setAttribute('role', 'region');
        panel.hidden = true;
        box.append(svg, note, plate, zoomBox, panel);
        const hint = make(doc, 'p', 'kp-graph__hint', s.graphHint);
        // The data child stays (a script draws nothing), so a second attach
        // after a detach reads it again.
        el.replaceChildren(bar, box, hint, ...(script ? [script] : []));
        /** @type {GraphModel} */
        const g = {
            el,
            data: null,
            state: 'loading',
            words: '',
            selected: new Set(),
            hidden: new Set(),
            hover: null,
            focus: null,
            drawnWidth: -1,
            bar,
            showAll,
            legend,
            box,
            svg,
            note,
            plate,
            drawn: false,
            text: '',
            art: null,
            hint,
            decorate,
            strings: s,
            labels: [],
            size: [0, 0],
            options: graphOptionsOf(el),
            world: null,
            at: new Map(),
            view: { k: 1, x: 0, y: 0 },
            zoomBox,
            zoomIn,
            zoomOut,
            zoomReset,
            panel,
            detail: null,
            detailShown: null,
            readyHeight: 0,
            readyWidth: 0,
            ...(detail ? { detailHook: detail } : {}),
        };
        graphs.set(el, g);
        decorate?.(showAll, { kind: 'show-all', host: el, key: keyOf(el) });
        decorate?.(zoomIn, { kind: 'zoom-in', host: el, key: keyOf(el) });
        decorate?.(zoomOut, { kind: 'zoom-out', host: el, key: keyOf(el) });
        decorate?.(zoomReset, { kind: 'zoom-reset', host: el, key: keyOf(el) });
        if (initial) setGraphData(el, initial);
        else drawGraph(g);
        const nodeOf = (/** @type {EventTarget | null} */ target) =>
            /** @type {SVGGElement | null} */ (target instanceof Element ? target.closest('.kp-graph__node') : null);
        const toggle = (/** @type {string} */ id) => {
            if (g.selected.has(id)) g.selected.delete(id);
            else g.selected.add(id);
            // A pick opens that node's details; taking the node out closes them if they were its.
            if (g.options.detail) {
                if (g.selected.has(id)) g.detail = id;
                else if (g.detail === id) g.detail = null;
                renderDetail(g);
            }
            restyleGraph(g);
            graphChanged(g);
        };
        const setHover = (/** @type {string | null} */ id) => {
            if (g.hover === id) return;
            g.hover = id;
            restyleGraph(g);
            graphChanged(g);
        };
        const clear = () => {
            if (g.selected.size === 0 && g.hidden.size === 0 && !g.detail) return false;
            g.selected.clear();
            g.hidden.clear();
            g.detail = null;
            renderDetail(g);
            restyleGraph(g);
            graphChanged(g);
            return true;
        };
        /** Esc closes the details first and keeps the picks; the next Esc shows all. */
        const closeDetail = (/** @type {boolean} */ refocus) => {
            if (!g.detail) return false;
            const id = g.detail;
            g.detail = null;
            renderDetail(g);
            restyleGraph(g);
            graphChanged(g);
            if (refocus) /** @type {SVGGElement | null} */ (svg.querySelector(`[data-kp-id="${CSS.escape(id)}"]`))?.focus();
            return true;
        };
        const order = () => /** @type {SVGGElement[]} */ ([...svg.querySelectorAll('.kp-graph__node')]);
        const focusNode = (/** @type {SVGGElement} */ node) => {
            for (const other of order()) other.setAttribute('tabindex', other === node ? '0' : '-1');
            g.focus = node.getAttribute('data-kp-id');
            node.focus({ preventScroll: false });
            revealNode(g, g.focus);
        };
        /** @param {PointerEvent} event */
        const onOver = (event) => {
            const node = nodeOf(event.target);
            if (node) setHover(node.getAttribute('data-kp-id'));
        };
        /** @param {PointerEvent} event */
        const onOut = (event) => {
            const node = nodeOf(event.target);
            if (node && !node.contains(/** @type {Node | null} */ (event.relatedTarget))) setHover(null);
        };
        /** @param {FocusEvent} event */
        const onFocus = (event) => {
            const node = nodeOf(event.target);
            if (node) {
                g.focus = node.getAttribute('data-kp-id');
                setHover(g.focus);
            }
        };
        /** @param {FocusEvent} event */
        const onBlur = (event) => {
            if (!svg.contains(/** @type {Node | null} */ (event.relatedTarget))) setHover(null);
        };
        /** @param {MouseEvent} event */
        const onClick = (event) => {
            const node = nodeOf(event.target);
            if (!node) return;
            const id = node.getAttribute('data-kp-id') ?? '';
            for (const other of order()) other.setAttribute('tabindex', other === node ? '0' : '-1');
            g.focus = id;
            toggle(id);
        };
        // Zoom and pan [graph-1020]: a view is one transform on the world group, so a hover or a pick still toggles classes only.
        let dragged = false;
        /** @type {Map<number, { x: number, y: number, onNode: boolean }>} */
        const pointers = new Map();
        /** @type {{ x: number, y: number } | null} */
        let panFrom = null;
        /** @type {{ dist: number, k: number, wx: number, wy: number } | null} */
        let pinch = null;
        const pinchStart = () => {
            const [a, b] = [...pointers.values()];
            if (!a || !b) return;
            const mid = pictureAt(g, (a.x + b.x) / 2, (a.y + b.y) / 2);
            pinch = {
                dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
                k: g.view.k,
                wx: (mid.x - g.view.x) / g.view.k,
                wy: (mid.y - g.view.y) / g.view.k,
            };
            panFrom = null;
        };
        /** @param {PointerEvent} event */
        const onDown = (event) => {
            if (!g.options.zoom || (event.pointerType === 'mouse' && event.button !== 0)) return;
            pointers.set(event.pointerId, { x: event.clientX, y: event.clientY, onNode: !!nodeOf(event.target) });
            if (pointers.size === 2) pinchStart();
            else if (pointers.size === 1) {
                dragged = false;
                panFrom = nodeOf(event.target) ? null : { x: event.clientX, y: event.clientY };
            }
        };
        /** @param {PointerEvent} event */
        const onMove = (event) => {
            const known = pointers.get(event.pointerId);
            if (!known || !g.options.zoom) return;
            known.x = event.clientX;
            known.y = event.clientY;
            if (pinch && pointers.size >= 2) {
                const [a, b] = [...pointers.values()];
                if (!a || !b) return;
                const mid = pictureAt(g, (a.x + b.x) / 2, (a.y + b.y) / 2);
                const k = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, (pinch.k * (Math.hypot(a.x - b.x, a.y - b.y) || 1)) / pinch.dist));
                g.view = { k, x: mid.x - pinch.wx * k, y: mid.y - pinch.wy * k };
                clampView(g);
                applyView(g);
                dragged = true;
            } else if (panFrom && pointers.size === 1) {
                const rect = svg.getBoundingClientRect();
                const scale = g.size[0] / (rect.width || g.size[0]);
                const dx = event.clientX - panFrom.x;
                const dy = event.clientY - panFrom.y;
                if (!dragged && Math.hypot(dx, dy) < 4) return;
                if (!dragged) {
                    dragged = true;
                    g.el.setAttribute('data-kp-panning', '');
                    try {
                        svg.setPointerCapture(event.pointerId);
                    } catch {
                        // A pointer that is already gone cannot be captured: the drag simply ends.
                    }
                }
                g.view.x += dx * scale;
                g.view.y += dy * scale;
                panFrom = { x: event.clientX, y: event.clientY };
                clampView(g);
                applyView(g);
            }
        };
        /** @param {PointerEvent} event */
        const onUp = (event) => {
            pointers.delete(event.pointerId);
            if (pointers.size < 2) pinch = null;
            if (pointers.size === 0) {
                panFrom = null;
                g.el.removeAttribute('data-kp-panning');
            }
        };
        /** A drag must not end as a pick. @param {MouseEvent} event */
        const onClickCapture = (event) => {
            if (!dragged) return;
            dragged = false;
            event.stopPropagation();
            event.preventDefault();
        };
        /** @param {WheelEvent} event */
        const onWheel = (event) => {
            if (!g.options.zoom) return;
            event.preventDefault();
            const unit = event.deltaMode === 1 ? 0.05 : event.ctrlKey ? 0.01 : 0.0015;
            const at = pictureAt(g, event.clientX, event.clientY);
            zoomTo(g, g.view.k * Math.exp(-event.deltaY * unit), at.x, at.y);
        };
        /** The keys of a zoomed picture: + - 0 and Shift+arrows. @param {KeyboardEvent} event */
        const zoomKey = (event) => {
            if (!g.options.zoom || event.ctrlKey || event.metaKey || event.altKey) return false;
            const [W, H] = g.size;
            if (event.key === '+' || event.key === '=') zoomTo(g, g.view.k * ZOOM_STEP, W / 2, H / 2, true);
            else if (event.key === '-' || event.key === '_') zoomTo(g, g.view.k / ZOOM_STEP, W / 2, H / 2, true);
            else if (event.key === '0') {
                g.view = { k: 1, x: 0, y: 0 };
                applyView(g, true);
            } else if (event.shiftKey && event.key.startsWith('Arrow')) {
                const step = 56;
                g.view.x += event.key === 'ArrowLeft' ? step : event.key === 'ArrowRight' ? -step : 0;
                g.view.y += event.key === 'ArrowUp' ? step : event.key === 'ArrowDown' ? -step : 0;
                clampView(g);
                applyView(g, true);
            } else return false;
            event.preventDefault();
            return true;
        };
        /** @param {MouseEvent} event */
        const onZoomBox = (event) => {
            const button = event.target instanceof Element ? event.target.closest('button') : null;
            if (!button || button.getAttribute('aria-disabled') === 'true') return;
            graphZoom(el, button === zoomIn ? 'in' : button === zoomOut ? 'out' : 'reset');
        };
        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            const node = nodeOf(event.target);
            if (!node) return;
            if (zoomKey(event)) return;
            const nodes = order();
            const at = nodes.indexOf(node);
            const hasHub = !!svg.querySelector('.kp-graph__node--hub');
            const ringStart = hasHub ? 1 : 0;
            const ringCount = nodes.length - ringStart;
            /** @type {number | null} */
            let to = null;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
                to = at < ringStart ? ringStart : ringStart + ((at - ringStart + 1) % ringCount);
            else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
                to = at < ringStart ? nodes.length - 1 : ringStart + ((at - ringStart - 1 + ringCount) % ringCount);
            else if (event.key === 'Home') to = 0;
            else if (event.key === 'End') to = nodes.length - 1;
            else if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggle(node.getAttribute('data-kp-id') ?? '');
                return;
            } else if (event.key === 'Escape') {
                if (closeDetail(false) || clear()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                return;
            }
            if (to == null || !nodes[to] || ringCount < 1) return;
            event.preventDefault();
            focusNode(nodes[to]);
        };
        /** @param {MouseEvent} event */
        const onKind = (event) => {
            const button = /** @type {HTMLElement | null} */ (event.target instanceof Element ? event.target.closest('[data-kp-kind]') : null);
            if (!button) return;
            const kind = button.dataset.kpKind ?? '';
            graphHideKind(el, kind, !g.hidden.has(kind));
        };
        const onShowAll = () => clear();
        /** @param {MouseEvent} event */
        const onPanel = (event) => {
            if (event.target instanceof Element && event.target.closest('.kp-graph__detail-close')) closeDetail(true);
        };
        /** @param {KeyboardEvent} event */
        const onPanelKey = (event) => {
            if (event.key !== 'Escape' || event.defaultPrevented) return;
            if (closeDetail(true)) {
                event.preventDefault();
                event.stopPropagation();
            }
        };
        /** @param {KeyboardEvent} event */
        const onDocKey = (event) => {
            if (event.key !== 'Escape' || event.defaultPrevented) return;
            if (/** @type {Element | null} */ (event.target)?.closest?.('dialog, input, textarea, select, [role="menu"]')) return;
            if (!closeDetail(false)) clear();
        };
        svg.addEventListener('pointerover', onOver);
        svg.addEventListener('pointerout', onOut);
        svg.addEventListener('focusin', onFocus);
        svg.addEventListener('focusout', onBlur);
        svg.addEventListener('click', onClickCapture, true);
        svg.addEventListener('click', onClick);
        svg.addEventListener('keydown', onKey);
        svg.addEventListener('pointerdown', onDown);
        svg.addEventListener('pointermove', onMove);
        svg.addEventListener('pointerup', onUp);
        svg.addEventListener('pointercancel', onUp);
        svg.addEventListener('wheel', onWheel, { passive: false });
        zoomBox.addEventListener('click', onZoomBox);
        panel.addEventListener('click', onPanel);
        panel.addEventListener('keydown', onPanelKey);
        legend.addEventListener('click', onKind);
        showAll.addEventListener('click', onShowAll);
        doc.addEventListener('keydown', onDocKey);
        // Only a new width redraws: a taller box (a side panel growing beside
        // it) must never rebuild a node under the pointer.
        const sizes = view
            ? new view.ResizeObserver(() => {
                  if (box.clientWidth !== g.drawnWidth) drawGraph(g);
              })
            : null;
        sizes?.observe(box);
        // An option changed on the graph (its attribute): draw it again with the new option. Not a hover, a pick or a hidden kind.
        const options = view ? new view.MutationObserver(() => drawGraph(g)) : null;
        options?.observe(el, { attributes: true, attributeFilter: GRAPH_OPTION_ATTRIBUTES });
        // A web font that arrives after the drawing changes every label's
        // width: fit them again, in place (no node is rebuilt). Names that
        // stand whole need the room measured again, so that mode draws again.
        const onFonts = () => {
            if (g.options.labels === 'below') {
                drawGraph(g);
                return;
            }
            for (const l of g.labels) {
                l.length = l.full.length;
                l.text.textContent = l.full;
            }
            if (isShown(svg)) fitDrawnLabels(g.labels, g.size[0], g.size[1]);
        };
        doc.fonts?.addEventListener('loadingdone', onFonts);
        undo.push(() => {
            doc.fonts?.removeEventListener('loadingdone', onFonts);
            sizes?.disconnect();
            options?.disconnect();
            svg.removeEventListener('pointerover', onOver);
            svg.removeEventListener('pointerout', onOut);
            svg.removeEventListener('focusin', onFocus);
            svg.removeEventListener('focusout', onBlur);
            svg.removeEventListener('click', onClickCapture, true);
            svg.removeEventListener('click', onClick);
            svg.removeEventListener('keydown', onKey);
            svg.removeEventListener('pointerdown', onDown);
            svg.removeEventListener('pointermove', onMove);
            svg.removeEventListener('pointerup', onUp);
            svg.removeEventListener('pointercancel', onUp);
            svg.removeEventListener('wheel', onWheel);
            zoomBox.removeEventListener('click', onZoomBox);
            panel.removeEventListener('click', onPanel);
            panel.removeEventListener('keydown', onPanelKey);
            legend.removeEventListener('click', onKind);
            showAll.removeEventListener('click', onShowAll);
            doc.removeEventListener('keydown', onDocKey);
            graphs.delete(el);
        });
    }
    return () => undo.splice(0).forEach((off) => off());
}
