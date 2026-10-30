// Row groups: collecting, folding, placing and syncing them.
import { DETAIL, GROUP_COUNT, GROUP_ROW, GROUP_TOGGLE, SKELETON_ROW } from '../selectors.js';
import { getStrings } from '../../strings.js';
/** @typedef {import('../../strings/types.js').Strings} Strings */
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the row groups: collecting, folding, placing and syncing them part adds to the table's context.
 *
 * @typedef {{
 *     arrange: (rows: HTMLTableRowElement[]) => HTMLTableRowElement[];
 *     blockOrder: string[];
 *     collectGroups: () => void;
 *     departing: Set<HTMLTableRowElement>;
 *     folded: Set<string>;
 *     givenIds: Set<HTMLTableRowElement>;
 *     groupOf: (row: HTMLTableRowElement) => string | null;
 *     groups: Map<string, HTMLTableRowElement>;
 *     isFolded: (row: HTMLTableRowElement) => boolean;
 *     layoutAtAttach: HTMLTableRowElement[] | null;
 *     placeGroups: () => void;
 *     preparedGroups: Map<HTMLTableRowElement, { span: string | null; hidden: boolean; }>;
 *     syncGroups: (s: Strings) => void;
 *     visibleColumns: () => number;
 * }} GroupsFields
 */

/**
 * Row groups: collecting, folding, placing and syncing them.
 *
 * @param {TableContext} c
 */
export function installGroups(c) {
    const { body, builtDetails, decoratePart, details, glyphs, headers, id, make, rendered, serverMode } = c;

    /** The count of the columns a reader sees. */
    const visibleColumns = () => headers.filter((_, at) => !c.hiddenColumns.has(at)).length;
    c.visibleColumns = visibleColumns;
    // ── Group rows that fold a run of rows [J2] ────────────────────
    // A heading row `tr[data-kp-row-group="g"]` folds the rows marked
    // `data-kp-group-of="g"`. The table keeps a group together under its
    // heading: a sort orders the rows within their group, and the groups,
    // and any run of rows outside a group between them, keep the place
    // the markup gave them. That is the least surprising of the choices:
    // a sort that tore a group apart would leave headings over rows that
    // are not theirs. A filter hides a group whose rows all fail it, and
    // a group split over two pages shows its heading on both. Folded rows
    // still count as matched, so the status line keeps the exact number
    // [R-COUNT]. Not for a server-backed table, whose server orders rows.
    /** Each group's heading row, by group key. @type {Map<string, HTMLTableRowElement>} */
    const groups = new Map();
    c.groups = groups;
    /** The group keys folded now; kept by key, so they outlive a refresh. @type {Set<string>} */
    const folded = new Set();
    c.folded = folded;
    /** Rows of a folding group held shown while their arrival plays backwards. @type {Set<HTMLTableRowElement>} */
    const departing = new Set();
    c.departing = departing;
    /** Every group key seen, so a heading's data-kp-folded counts the first time only. @type {Set<string>} */
    const seenGroups = new Set();
    /** The blocks in the order they stand: a group, or a run of rows outside every group. @type {string[]} */
    c.blockOrder = [];
    /** @type {Map<HTMLTableRowElement, string>} */
    const blockOf = new Map();
    /** A heading's name, read before its toggle went in. @type {Map<HTMLTableRowElement, string>} */
    const groupNames = new Map();
    /** Heading rows this attach prepared, with what detach puts back. @type {Map<HTMLTableRowElement, { span: string | null, hidden: boolean }>} */
    const preparedGroups = new Map();
    c.preparedGroups = preparedGroups;
    /** Member rows this attach gave an id, so their toggle can name them in aria-controls. @type {Set<HTMLTableRowElement>} */
    const givenIds = new Set();
    c.givenIds = givenIds;
    let memberIds = 0;
    /** The group a row belongs to, when that group has a heading row. @param {HTMLTableRowElement} row */
    const groupOf = (row) => {
        const key = row.dataset.kpGroupOf;
        return key !== undefined && groups.has(key) ? key : null;
    };
    c.groupOf = groupOf;
    /** A heading row's fold button, first in its first cell. @param {HTMLTableRowElement} heading */
    const prepareGroup = (heading) => {
        const cell = heading.cells[0];
        if (cell === undefined || heading.querySelector(GROUP_TOGGLE) !== null) return;
        const key = heading.dataset.kpRowGroup ?? '';
        const copy = /** @type {HTMLElement} */ (heading.cloneNode(true));
        for (const slot of copy.querySelectorAll(GROUP_COUNT)) slot.remove();
        const name = heading.dataset.kpGroupLabel ?? (copy.textContent ?? '').replace(/\s+/g, ' ').trim();
        groupNames.set(heading, name);
        preparedGroups.set(heading, { span: heading.cells.length === 1 ? cell.getAttribute('colspan') : null, hidden: heading.hidden === true });
        const button = /** @type {HTMLButtonElement} */ (
            make('button', 'kp-button kp-button--ghost kp-button--sm kp-datatable__expand kp-datatable__group-toggle')
        );
        button.type = 'button';
        button.dataset.kpGroupToggle = '';
        cell.prepend(button);
        decoratePart(button, { kind: 'row-group-toggle', value: key, label: name });
    };
    /** Read the group rows and the blocks from the body as it stands now. */
    const collectGroups = () => {
        if (serverMode) return;
        groups.clear();
        for (const row of body.rows) {
            if (!row.matches(GROUP_ROW)) continue;
            const key = row.dataset.kpRowGroup ?? '';
            if (groups.has(key)) continue;
            groups.set(key, row);
            if (!seenGroups.has(key)) {
                seenGroups.add(key);
                if (row.dataset.kpFolded !== undefined) folded.add(key);
            }
            prepareGroup(row);
        }
        c.blockOrder = [];
        blockOf.clear();
        if (groups.size === 0) return;
        const placed = new Set();
        let loose = 0;
        let inLoose = false;
        for (const row of body.rows) {
            if (row.matches(DETAIL) || row.matches(SKELETON_ROW)) continue;
            /** @type {string} */
            let block;
            if (row.matches(GROUP_ROW)) {
                const key = row.dataset.kpRowGroup ?? '';
                if (groups.get(key) !== row) continue;
                block = `group:${key}`;
            } else {
                const key = groupOf(row);
                if (key !== null) block = `group:${key}`;
                else {
                    if (!inLoose) loose += 1;
                    block = `rows:${loose}`;
                }
            }
            inLoose = block.startsWith('rows:');
            if (!placed.has(block)) {
                placed.add(block);
                c.blockOrder.push(block);
            }
            if (!row.matches(GROUP_ROW)) blockOf.set(row, block);
        }
    };
    c.collectGroups = collectGroups;
    collectGroups();
    /** The body's order at attach, headings included, for detach. */
    const layoutAtAttach = groups.size > 0 ? [...body.rows] : null;
    c.layoutAtAttach = layoutAtAttach;
    /** Rows in the order of their blocks, each block's rows in the order given. @param {HTMLTableRowElement[]} rows */
    const arrange = (rows) => {
        if (c.blockOrder.length === 0) return rows;
        /** @type {Map<string, HTMLTableRowElement[]>} */
        const byBlock = new Map();
        for (const row of rows) {
            const block = blockOf.get(row) ?? '';
            const list = byBlock.get(block);
            if (list === undefined) byBlock.set(block, [row]);
            else list.push(row);
        }
        return [...c.blockOrder, ''].flatMap((block) => byBlock.get(block) ?? []);
    };
    c.arrange = arrange;
    /** Is the row in a folded group? @param {HTMLTableRowElement} row */
    const isFolded = (row) => {
        const key = groupOf(row);
        return key !== null && folded.has(key);
    };
    c.isFolded = isFolded;
    /**
     * Put the body in the order of its blocks: each heading, then its
     * rows, each with its detail. Nothing moves when the order already
     * stands, and a control that held the focus gets it back when it
     * moved, so a refresh leaves the reader where they were [R-LIVE].
     */
    const placeGroups = () => {
        const shownSet = new Set(c.shownRows);
        const allSet = new Set(c.all);
        /** @type {Map<string, HTMLTableRowElement[]>} */
        const byBlock = new Map();
        for (const row of [...c.shownRows, ...rendered.filter((r) => !shownSet.has(r) && allSet.has(r))]) {
            const block = blockOf.get(row) ?? '';
            const list = byBlock.get(block);
            if (list === undefined) byBlock.set(block, [row]);
            else list.push(row);
        }
        /** @type {HTMLTableRowElement[]} */
        const sequence = [];
        for (const block of [...c.blockOrder, '']) {
            const heading = block.startsWith('group:') ? groups.get(block.slice('group:'.length)) : undefined;
            if (heading !== undefined) sequence.push(heading);
            for (const row of byBlock.get(block) ?? []) {
                sequence.push(row);
                const detail = details.get(row);
                if (detail !== undefined) sequence.push(detail);
            }
        }
        const wanted = new Set(sequence);
        const current = [...body.rows].filter((row) => wanted.has(row));
        if (current.length === sequence.length && current.every((row, at) => row === sequence[at])) return;
        const active = document.activeElement;
        const held = active instanceof HTMLElement && body.contains(active) ? active : null;
        // Only rows still in the body are placed: one the page took out (replaced tbody content, then a sort before refresh())
        // stays out, and is never put back beside its replacement [states-check-1019].
        // A detail row built on demand (detailFn) is not in the body yet: it is placed here with the rows, or a grouped table never
        // showed it [HL 143].
        for (const row of sequence) if (row.parentElement === body || (builtDetails.has(row) && row.parentElement === null)) body.append(row);
        if (held !== null && held.isConnected && document.activeElement !== held) held.focus({ preventScroll: true });
    };
    c.placeGroups = placeGroups;
    /** Name each heading's toggle, count its rows and show it where its rows are. @param {ReturnType<typeof getStrings>} s */
    const syncGroups = (s) => {
        if (groups.size === 0) return;
        /** @type {Map<string, number>} */
        const matched = new Map();
        for (const row of c.shownRows) {
            const key = groupOf(row);
            if (key !== null) matched.set(key, (matched.get(key) ?? 0) + 1);
        }
        /** @type {Map<string, string[]>} */
        const onPage = new Map();
        for (const row of c.pageRows) {
            const key = groupOf(row);
            if (key === null) continue;
            if (row.id === '' && row.dataset.kpRowKey !== undefined) {
                memberIds += 1;
                row.id = `${id}-row-${memberIds}`;
                givenIds.add(row);
            }
            const ids = onPage.get(key) ?? [];
            if (row.id !== '') ids.push(row.id);
            onPage.set(key, ids);
        }
        for (const [key, heading] of groups) {
            const count = matched.get(key) ?? 0;
            const open = !folded.has(key);
            // `data-kp-group-always` [kpadopt]: the heading stays with no data row under it (rows still loading, failed, or none).
            heading.hidden = !onPage.has(key) && heading.dataset.kpGroupAlways === undefined;
            const button = heading.querySelector(GROUP_TOGGLE);
            if (button !== null) {
                button.setAttribute('aria-expanded', String(open));
                button.setAttribute('aria-label', s.tableGroupRows(groupNames.get(heading) ?? key, count));
                button.textContent = open ? glyphs.collapse : glyphs.expand;
                const ids = onPage.get(key) ?? [];
                if (ids.length > 0) button.setAttribute('aria-controls', ids.join(' '));
                else button.removeAttribute('aria-controls');
            }
            for (const slot of heading.querySelectorAll(GROUP_COUNT)) slot.textContent = String(count);
            const cell = heading.cells[0];
            if (heading.cells.length === 1 && cell !== undefined) cell.colSpan = visibleColumns();
        }
    };
    c.syncGroups = syncGroups;
}
