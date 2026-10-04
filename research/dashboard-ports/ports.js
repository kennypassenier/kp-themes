// Behaviour for the components ported from the admin dashboard (round one,
// 2026-10-04), written as it would land in js/: pure exports, nothing runs
// on import, every attach function takes a root and returns a detach, and
// what it acts on is declared in markup (classes and data-kp-* attributes),
// never named by an app.
//
//   attachActionColumns(root)   row buttons on columns a list shares [port-1]
//   attachSparklines(root)      `svg[data-kp-spark]` drawn from its numbers [port-3]
//   attachKpiToggles(root)      a `.kp-kpi--toggle` presses and says so [port-3]
//   attachAttention(root)       an attention band kept worst first [port-5]
//   setStateWord(el, word)      a state word that keeps its width [port-7]

/* ------------------------------------------------------ action columns */

/** A row's button box. */
export const ROW_ACTIONS = '.kp-row-actions';

/** A list or table whose rows' buttons share columns. */
export const ACTION_LIST = '.kp-action-list, table';

/**
 * The roles of one row's buttons: the button's `data-kp-action` when it has
 * one, else its place from the row's end (`end-0` is the last); a role met
 * twice in one row is numbered.
 * @param {{ role?: string | null }[]} buttons in row order
 * @returns {string[]}
 */
export function rowRoles(buttons) {
    /** @type {Map<string, number>} */
    const seen = new Map();
    return buttons.map((button, at) => {
        const base = button.role || `end-${buttons.length - 1 - at}`;
        const count = (seen.get(base) ?? 0) + 1;
        seen.set(base, count);
        return count > 1 ? `${base}#${count}` : base;
    });
}

/**
 * One column order for every row: each row's roles keep their order, and a
 * role first met in a later row goes right after the role before it.
 * @param {string[][]} rows
 * @returns {string[]}
 */
export function mergeRoles(rows) {
    /** @type {string[]} */
    const order = [];
    for (const roles of rows) {
        let at = -1;
        for (const role of roles) {
            const found = order.indexOf(role);
            if (found >= 0) at = found;
            else {
                order.splice(at + 1, 0, role);
                at += 1;
            }
        }
    }
    return order;
}

/**
 * Lay one list's or table's button boxes on shared columns.
 *
 * A list (`.kp-action-list`) is a CSS subgrid, so the browser sizes the
 * columns; this only names each button's column and the list's count, and
 * only when a button carries a role (by position the stylesheet needs no
 * help). A table cannot be a subgrid: there each role's widest button is
 * measured and the widths are written on the table.
 * @param {Element} list
 */
export function fitActionColumns(list) {
    if (!(list instanceof HTMLElement)) return;
    const isTable = list instanceof HTMLTableElement;
    const boxes = /** @type {HTMLElement[]} */ ([...list.querySelectorAll(ROW_ACTIONS)]).filter(
        (box) => box.closest(ACTION_LIST) === list,
    );
    const rows = boxes.map((box) => /** @type {HTMLElement[]} */ ([...box.children]).filter((child) => !child.hidden));
    const roles = rows.map((row) => rowRoles(row.map((button) => ({ role: button.dataset.kpAction ?? null }))));
    const order = mergeRoles(roles);
    const named = rows.some((row) => row.some((button) => button.dataset.kpAction !== undefined));

    for (const row of rows) for (const button of row) button.style.removeProperty('--kp-action-col');
    for (const name of ['--kp-action-count', '--kp-action-widths', '--kp-action-stack']) list.style.removeProperty(name);
    if (order.length === 0 || (!isTable && !named)) return;

    if (isTable) {
        // Every button at its own size first, then the widest per role.
        list.dataset.kpActionMeasuring = '';
        const widths = order.map(() => 0);
        rows.forEach((row, r) =>
            row.forEach((button, b) => {
                const k = order.indexOf(roles[r][b]);
                widths[k] = Math.max(widths[k], button.getBoundingClientRect().width);
            }),
        );
        delete list.dataset.kpActionMeasuring;
        list.style.setProperty('--kp-action-widths', widths.map((w) => `${Math.ceil(w)}px`).join(' '));
        list.style.setProperty('--kp-action-stack', `${Math.ceil(Math.max(...widths))}px`);
    } else {
        list.style.setProperty('--kp-action-count', String(order.length));
    }
    rows.forEach((row, r) => row.forEach((button, b) => button.style.setProperty('--kp-action-col', String(order.indexOf(roles[r][b]) + 1))));
}

/**
 * Keep every list's and table's row buttons on shared columns under `root`:
 * fitted now, and again, once per frame, when a row's buttons change, the
 * theme changes or a font arrives (a table's widths are measured).
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachActionColumns(root = document) {
    const doc = root instanceof Document ? root : (root.ownerDocument ?? document);
    const view = doc.defaultView;
    if (!view) return () => {};
    const fitAll = () => {
        const lists = new Set([...root.querySelectorAll(ROW_ACTIONS)].map((box) => box.closest(ACTION_LIST)));
        for (const list of lists) if (list) fitActionColumns(list);
    };
    let queued = 0;
    const queue = () => {
        if (queued) return;
        queued = view.requestAnimationFrame(() => {
            queued = 0;
            fitAll();
        });
    };
    /** @param {Node} node */
    const touches = (node) => {
        const el = node instanceof Element ? node : node.parentElement;
        return el !== null && (el.closest(ROW_ACTIONS) !== null || el.querySelector(ROW_ACTIONS) !== null);
    };
    // Children and text only: the column writes are style changes, so the
    // watcher never wakes itself.
    const rows = new view.MutationObserver((records) => {
        if (records.some((r) => touches(r.target) || [...r.addedNodes, ...r.removedNodes].some(touches))) queue();
    });
    rows.observe(root instanceof Document ? root.documentElement : /** @type {Node} */ (root), {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['hidden', 'data-kp-action'],
    });
    const theme = new view.MutationObserver(queue);
    theme.observe(doc.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    doc.fonts?.addEventListener?.('loadingdone', queue);
    fitAll();
    return () => {
        rows.disconnect();
        theme.disconnect();
        doc.fonts?.removeEventListener?.('loadingdone', queue);
        if (queued) view.cancelAnimationFrame(queued);
    };
}

/* ----------------------------------------------------------- sparklines */

/** An inline SVG drawn from the numbers in its attribute. */
export const SPARK = 'svg[data-kp-spark]';

/**
 * A sparkline's two paths in a `width` × `height` box: the line, and the
 * area under it. Fewer than two finite numbers draw nothing; a flat series
 * is drawn through the middle.
 * @param {readonly number[]} values oldest first
 * @param {{ width?: number, height?: number }} [box]
 * @returns {{ line: string, area: string }}
 */
export function sparkPaths(values, { width = 100, height = 28 } = {}) {
    const points = values.filter((v) => Number.isFinite(v));
    if (points.length < 2) return { line: '', area: '' };
    const low = Math.min(...points);
    const high = Math.max(...points);
    const pad = 1.5;
    const y = (/** @type {number} */ v) => (high === low ? height / 2 : pad + (1 - (v - low) / (high - low)) * (height - 2 * pad));
    const x = (/** @type {number} */ at) => (at / (points.length - 1)) * width;
    const line = points.map((v, at) => `${at === 0 ? 'M' : 'L'}${x(at).toFixed(2)},${y(v).toFixed(2)}`).join(' ');
    return { line, area: `${line} L${width},${height} L0,${height} Z` };
}

/**
 * Draw one sparkline into `svg` from `values`.
 * @param {SVGSVGElement} svg
 * @param {readonly number[]} values
 */
export function drawSparkline(svg, values) {
    const ns = 'http://www.w3.org/2000/svg';
    const { line, area } = sparkPaths(values);
    svg.setAttribute('viewBox', '0 0 100 28');
    svg.setAttribute('preserveAspectRatio', 'none');
    if (!svg.hasAttribute('role')) svg.setAttribute('aria-hidden', 'true');
    const areaPath = svg.ownerDocument.createElementNS(ns, 'path');
    areaPath.setAttribute('class', 'kp-kpi__spark-area');
    areaPath.setAttribute('d', area);
    const linePath = svg.ownerDocument.createElementNS(ns, 'path');
    linePath.setAttribute('class', 'kp-kpi__spark-line');
    linePath.setAttribute('d', line);
    svg.replaceChildren(areaPath, linePath);
}

/** @param {string | null} text @returns {number[]} */
const numbersIn = (text) => (text ?? '').split(/[\s,]+/).filter(Boolean).map(Number);

/**
 * Draw every `svg[data-kp-spark="12 14 13 …"]` under `root`, and redraw one
 * whenever its numbers change.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachSparklines(root = document) {
    const doc = root instanceof Document ? root : (root.ownerDocument ?? document);
    const view = doc.defaultView;
    for (const svg of root.querySelectorAll(SPARK)) drawSparkline(/** @type {SVGSVGElement} */ (svg), numbersIn(svg.getAttribute('data-kp-spark')));
    if (!view) return () => {};
    const watch = new view.MutationObserver((records) => {
        for (const record of records) {
            const svg = /** @type {Element} */ (record.target);
            if (svg.matches(SPARK)) drawSparkline(/** @type {SVGSVGElement} */ (svg), numbersIn(svg.getAttribute('data-kp-spark')));
        }
    });
    watch.observe(root instanceof Document ? root.documentElement : /** @type {Node} */ (root), {
        subtree: true,
        attributes: true,
        attributeFilter: ['data-kp-spark'],
    });
    return () => watch.disconnect();
}

/* ---------------------------------------------------------- KPI toggles */

/** A KPI tile that turns a filter on this page on or off. */
export const KPI_TOGGLE = 'button.kp-kpi--toggle';

/** Fired on the tile, bubbling, after it was pressed: `detail.pressed`. */
export const KPI_TOGGLE_EVENT = 'kp-kpi-toggle';

/**
 * Wire every KPI toggle under `root`: a click flips `aria-pressed` and fires
 * `kp-kpi-toggle`; the page does the filtering. A tile marked
 * `data-kp-kpi-owned` is left to the page (a framework that keeps the
 * pressed state itself).
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachKpiToggles(root = document) {
    /** @param {Event} event */
    const onClick = (event) => {
        const tile = /** @type {Element | null} */ (event.target instanceof Element ? event.target.closest(KPI_TOGGLE) : null);
        if (!tile || tile.hasAttribute('data-kp-kpi-owned')) return;
        const pressed = tile.getAttribute('aria-pressed') !== 'true';
        tile.setAttribute('aria-pressed', String(pressed));
        tile.dispatchEvent(new CustomEvent(KPI_TOGGLE_EVENT, { bubbles: true, detail: { pressed } }));
    };
    for (const tile of root.querySelectorAll(KPI_TOGGLE)) if (!tile.hasAttribute('aria-pressed')) tile.setAttribute('aria-pressed', 'false');
    root.addEventListener('click', onClick);
    return () => root.removeEventListener('click', onClick);
}

/* ------------------------------------------------------- attention band */

/** The band, and the severities it orders by, worst first. */
export const ATTENTION = '.kp-attention';
export const SEVERITIES = /** @type {const} */ (['critical', 'warning', 'info']);

/**
 * Put a band's items in severity order in the DOM (a stable sort: two
 * problems of one severity keep the order the page gave them).
 * @param {Element} band
 */
export function sortAttention(band) {
    const items = /** @type {HTMLElement[]} */ ([...band.children]).filter((el) => el.classList.contains('kp-attention__item'));
    const rank = (/** @type {HTMLElement} */ el) => {
        const at = SEVERITIES.indexOf(/** @type {any} */ (el.dataset.kpSeverity));
        return at < 0 ? SEVERITIES.length : at;
    };
    const sorted = [...items].sort((a, b) => rank(a) - rank(b));
    if (sorted.every((el, at) => el === items[at])) return;
    for (const el of sorted) band.append(el);
}

/**
 * Keep every attention band under `root` worst first, now and whenever an
 * item arrives or changes severity. The band hides itself in CSS when it
 * holds nothing.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachAttention(root = document) {
    const doc = root instanceof Document ? root : (root.ownerDocument ?? document);
    const view = doc.defaultView;
    const bands = [...root.querySelectorAll(ATTENTION)];
    for (const band of bands) sortAttention(band);
    if (!view) return () => {};
    const watchers = bands.map((band) => {
        const watch = new view.MutationObserver(() => {
            watch.disconnect();
            sortAttention(band);
            watch.observe(band, options);
        });
        const options = { childList: true, subtree: true, attributes: true, attributeFilter: ['data-kp-severity'] };
        watch.observe(band, options);
        return watch;
    });
    return () => watchers.forEach((w) => w.disconnect());
}

/* ----------------------------------------------------------- state word */

/**
 * Show `word` in a `.kp-state-word`, adding it to the words it keeps room
 * for when it is new, so the width never shrinks back under a later word.
 * @param {HTMLElement} el
 * @param {string} word
 */
export function setStateWord(el, word) {
    const words = (el.getAttribute('data-kp-words') ?? '').split('\n').filter(Boolean);
    if (!words.includes(word)) el.setAttribute('data-kp-words', [...words, word].join('\n'));
    el.textContent = word;
}
