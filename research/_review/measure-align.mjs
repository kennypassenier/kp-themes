// Measures, in Firefox, whether a demo's compositions sit on a grid: Kenny, 2026-10-19 06:43, after rejecting seven
// settings sections in two project demos ("HOE VAAK MOET IK NOG ZEGGEN OM ALLES DEFTIG VERTICAAL TE ALIGNEN EN GRID TE
// GEBRUIKEN IPV LINKS ALIGNEN???"; "de tweede kolom ziet er totaal niet uniform uit"; "de Send test knop is niet
// verticaal aligned met de knoppen Format Minify etc"). A written rule was not enough, so the rule is measured.
//
// The in-page function `measureAlign` is imported by measure-gaps.mjs, which every round already runs before a push,
// and runs here on its own too. It is a measuring script, not a test. Within one section it fails, with the elements and
// the distance in px:
//
//  A. Columns. A row group is an element with two or more stacked children of one kind (same tag and first class) that
//     each lay two or more cells side by side, or a grid whose rows are subgrids (the kp-formgrid). Cells of one role
//     (same tag and first class, or the same position) must start on one x edge and end on one x edge in every row
//     (tolerance 1 px); the first control in a cell (field, select, stepper, button...) must start on one edge, and the
//     controls of one column may end on at most two edges (a field that fills its track, and one short step).
//  B. Rows. In every row whose cells stand side by side, the first line of every cell (a control's box, or a text's
//     first line) is centred on the label's first line, or shares its baseline (tolerance 1 px). A control taller than
//     twice the control height is read by its first line band.
//  C. Buttons. Two buttons of the composition that stand side by side on one line (their boxes overlap by at least
//     three quarters of the shorter one) share a top, a centre or a bottom (tolerance 1 px): "Send test" beside
//     "Format" is held to this. A button that is not on screen (inside a hidden, clipped or scrolled-out box, or at no
//     opacity) is not compared, and neither are two buttons that merely overlap a little, in different columns or rows.
//  B2. A label block of several lines (a label with a note) does not hang under cells that stand on its first line only.
//  H. Stacks. A form, settings or key-value row never puts its action or a fact's value under its label on the label's
//     start edge (the phone layout Kenny rejected 2026-10-19 11:22: "niet alles links alignen").
//  D. Tracks. A group of buttons under a row group, inside its width, starts on one of that group's column edges or ends
//     on one (tolerance 1 px). A segmented control's own box is its edge: its items sit inside its padding.
//     A group of buttons that stands in a box narrower than the row group above (a phone-width frame under a full-width band,
//     whose folded rows are no rows to `kids()`) is in another column and is not compared with the band's edges [measure-tools-1019].
//     A cell's own buttons (table, grid, console, status list), a combobox's input (not its status line) and a radio tile's
//     tile (not its inner radio) are the edges a reader sees; measure-gaps.mjs skips marks scrolled out of a scrolling log.
//     A `.kp-action-list` row names its buttons' roles (`data-kp-action`): a button is compared with the same role's button of
//     the other rows, not with its row's first button, since a row without the first role leaves column 1 empty and its one
//     button stands in column 2 by design (one role, one column) [hltools-1019, homelab 75].
//     Nothing inside a closed `<details>` (its summary aside) is on screen and nothing in it is measured [hltools-1019, homelab 83].
//  E/F. Fields fill their track; columns side by side start on one line.
//  G. No two buttons overlap; a `.kp-snooze` lies on one grid (trigger, End snooze and status on shared tracks, every part
//     the whole width of its element, no part taller than its content) [snooze-width, 2026-10-19 11:22].
//  Scopes (align-dialogs-1019). Every open `dialog`, `[role="dialog"]`, `.kp-drawer`, `.kp-sheet` and open `[popover]` is a
//     scope of its own: A to H run inside it as if it were a section, the outer section does not measure its contents, and
//     a line reads "<section> › dialog <name>". A dialog open at load is measured as it stands; a closed one is opened by
//     its `[data-kp-dialog]` or `[popovertarget]` button (measureAlignOpened) and closed again. A dialog a demo opens only
//     from script (no opener attribute) is not reached.
//
// Run (a static server on the repository root first):
//   node research/_review/measure-align.mjs <port> <research/topic/demo.html> [themes=formal] [widths=1280,390] [ids]
// An app behind a login or serving its own kp-themes copy: --url <page url> (instead of <port> <page>), --cookie n=v,
// --login-form url,userField,passField,submit (KP_LOGIN_USER/KP_LOGIN_PASS), --storage-state <file>, --assets-from
// <prefix>=<dir>, --ignore-https-errors; see cli-context.mjs and README.md. The page needs data-review-item sections.
import { fileURLToPath } from 'node:url';
import { launch, locate, OPTIONS_USAGE, parseArgs } from './cli-context.mjs';

/** Tolerance in px (Kenny's brief: "beyond 1 px"). */
export const ALIGN_TOLERANCE = 1;

/**
 * In the page: every alignment fault of one section. Self-contained, so it can be handed to page.evaluate.
 * @param {[number, string, boolean?]} args tolerance, the id of the one section to measure, and whether to report only the
 *   open dialogs, sheets, drawers and popovers inside it (the second pass after their openers were pressed)
 * @returns {string[]}
 */
export function measureAlign([tol, only, dialogsOnly = false]) {
    const root = document.querySelector(`[data-review-item="${CSS.escape(only)}"]`);
    if (!root) return [];
    // Every open dialog, sheet, drawer and popover inside the section is a scope of its own (chassis-rs, 2026-10-19: the
    // approved clients-manage dialog had a head 14.3 px off its tiles and a danger band 4.6 px off its actions, and the
    // section scope saw the dialog's parent, so neither showed): its checks run as if it were a section, and the outer
    // section does not measure its contents. Reported as "<section> › dialog <name>".
    const SCOPE = 'dialog, [role="dialog"], .kp-drawer, .kp-sheet, [popover]';
    const isOpenScope = (/** @type {Element} */ el) => {
        if (el.closest('[hidden], template, .cat-judge, [data-review-controls]')) return false;
        if (el.matches('dialog') && !(/** @type {HTMLDialogElement} */ (el).open)) return false;
        if (el.hasAttribute('popover') && !el.matches(':popover-open')) return false;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return r.width > 0.5 && r.height > 0.5 && cs.visibility !== 'hidden' && cs.display !== 'none';
    };
    const scopeName = (/** @type {Element} */ el) => {
        const by = (el.getAttribute('aria-labelledby') || '').split(' ').map((i) => document.getElementById(i)?.textContent || '').join(' ');
        const t = (el.getAttribute('aria-label') || by || el.querySelector('h1, h2, h3, [class*="__title"]')?.textContent || el.id || String(el.classList[0] || el.tagName.toLowerCase()))
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 40);
        const kind = el.hasAttribute('popover') ? 'popover' : el.matches('.kp-drawer') ? 'drawer' : el.matches('.kp-sheet') ? 'sheet' : 'dialog';
        return `${kind} ${t}`;
    };
    /** @type {[Element, string][]} */
    const scopes = dialogsOnly ? [] : [[root, only]];
    for (const el of root.querySelectorAll(SCOPE)) if (isOpenScope(el)) scopes.push([el, `${only} › ${scopeName(el)}`]);
    /** @type {string[]} */
    const all0 = [];
    for (const [el, label] of scopes) all0.push(...measureScope(el, label));
    return [...new Set(all0)];

    /** @param {Element} section @param {string} id */
    function measureScope(section, id) {
    /** @type {string[]} */
    const res = [];
    // The review machinery and the demo's prose are not the composition.
    const CHROME =
        '.cat-judge, [data-review-controls], [data-review-look], .rv-block-tools, [class*="expected"], [class*="__head"] > p, .kp-sr-only, [hidden], [aria-hidden="true"], dialog:not([open]), template';
    // Content of a closed <details> (a "How to change this" fold) is not on screen; its <summary> is [hltools-1019, homelab 83].
    const inClosedFold = (/** @type {Element} */ el) => {
        for (let a = /** @type {Element | null} */ (el), via = null; a && a !== section.parentElement; via = a, a = a.parentElement)
            if (a.tagName === 'DETAILS' && !(/** @type {HTMLDetailsElement} */ (a).open) && !(via && via.tagName === 'SUMMARY')) return true;
        return false;
    };
    const inChrome = (/** @type {Element} */ el) => {
        if (el.closest(CHROME) || inClosedFold(el)) return true;
        // The contents of an open dialog, sheet, drawer or popover inside this scope belong to that scope.
        const nested = el.closest(SCOPE);
        return !!nested && nested !== section && section.contains(nested);
    };
    const shown = (/** @type {Element} */ el) => {
        const r = el.getBoundingClientRect();
        if (r.width < 0.5 || r.height < 0.5) return false;
        const cs = getComputedStyle(el);
        return cs.visibility !== 'hidden' && cs.display !== 'none';
    };
    /**
     * The element can be seen: no box above it hides it (no opacity, a clipping box it lies outside of, such as a log
     * scrolled past it, a datatable's scroller, or a folded panel), so a button in it is no part of the composition
     * [formgrid-notes-1019; homelab 57, 58].
     * @param {Element} el
     */
    const onScreen = (el) => {
        const r = el.getBoundingClientRect();
        for (let a = /** @type {Element | null} */ (el); a && a !== section.parentElement; a = a.parentElement) {
            const cs = getComputedStyle(a);
            if (cs.opacity === '0' || cs.visibility === 'hidden' || cs.display === 'none' || cs.contentVisibility === 'hidden') return false;
            if (a === el) continue;
            if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
            const ar = a.getBoundingClientRect();
            if (r.bottom <= ar.top + 0.5 || r.top >= ar.bottom - 0.5 || r.right <= ar.left + 0.5 || r.left >= ar.right - 0.5) return false;
        }
        return true;
    };
    /** The children of an element as the layout sees them: display: contents opened up. @param {Element} el */
    const kids = (el) => {
        /** @type {Element[]} */
        const out = [];
        for (const c of el.children) {
            if (getComputedStyle(c).display === 'contents') out.push(...kids(c));
            else if (shown(c) && !inChrome(c) && getComputedStyle(c).position !== 'absolute' && getComputedStyle(c).position !== 'fixed') out.push(c);
        }
        return out;
    };
    const firstClass = (/** @type {Element} */ el) => String(el.classList[0] || '');
    const sig = (/** @type {Element} */ el) => `${el.tagName.toLowerCase()}${firstClass(el) ? `.${firstClass(el)}` : ''}`;
    const name = (/** @type {Element} */ el) => {
        const t = (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 28);
        return `${sig(el)}${t ? ` "${t}"` : ''}`;
    };
    const px = (/** @type {number} */ n) => `${Math.round(n * 10) / 10}`;
    const CONTROL =
        '.kp-code, .kp-command, .kp-jsonfield, .kp-type-confirm, .kp-refresh__chooser, input:not([type="hidden"]), select, textarea, button, [role="switch"], [role="combobox"], .kp-switch, .kp-quantity, .kp-time, .kp-segmented, .kp-field__input, .kp-combobox, .kp-secret, .kp-button';
    const MARK = 'input[type="checkbox"], input[type="radio"], [role="switch"], .kp-switch';
    const hasKp = (/** @type {Element} */ el) =>
        !!el.querySelector('[class^="kp-"], [class*=" kp-"], input, select, textarea, button') || /(^| )kp-/.test(el.className);
    const controlH = parseFloat(getComputedStyle(section).getPropertyValue('--kp-control-height')) * 16 || 36;

    /** The first line of text in an element: its rect and its baseline. @param {Element} el */
    const firstLine = (el) => {
        const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n; (n = walk.nextNode());) {
            if (!n.textContent?.trim()) continue;
            const p = /** @type {HTMLElement} */ (n.parentElement);
            if (inChrome(p) || !shown(p) || !onScreen(p)) continue;
            // Visually hidden words (a slim rail's clipped label, an sr-only span written as clip-path) are no line.
            if (/inset\(50%\)/.test(getComputedStyle(p).clipPath)) continue;
            const range = document.createRange();
            range.selectNodeContents(n);
            const rect = [...range.getClientRects()].find((r) => r.width > 0.5 && r.height > 0.5);
            if (!rect) continue;
            // An empty inline-block's bottom edge is the baseline of the line it stands on.
            const probe = document.createElement('span');
            probe.style.cssText = 'display:inline-block;width:0;height:0;margin:0;padding:0;border:0;vertical-align:baseline';
            p.insertBefore(probe, n);
            const base = probe.getBoundingClientRect().bottom;
            probe.remove();
            return { rect, base, el: p };
        }
        return null;
    };
    /** Where a cell's first line stands: its first control, or its first text line. @param {Element} cell */
    const anchor = (cell) => {
        let ctl = cell.matches(CONTROL) ? cell : [...cell.querySelectorAll(CONTROL)].find((c) => shown(c) && !inChrome(c) && onScreen(c));
        // A combobox keeps its status line ("11 results") under the input: the field is the input, the line is its help.
        if (ctl?.matches('.kp-combobox')) ctl = ctl.querySelector('.kp-combobox__input, [role="combobox"]') ?? ctl;
        const line = firstLine(cell);
        if (ctl) {
            const cr = ctl.getBoundingClientRect();
            // The control comes first when it stands above or level with the first text.
            if (!line || cr.top <= line.rect.top + tol || ctl.contains(line.el)) {
                // A tall control (a code block, a JSON field, a text area) is read by its first line: its first row of parts
                // (a head, a tool row) when it has one, else one control height from its top.
                const head = cr.height > controlH * 2 ? kids(ctl)[0] : null;
                const hr = head && head.getBoundingClientRect().height < controlH * 2 ? head.getBoundingClientRect() : null;
                const band =
                    cr.height > controlH * 2
                        ? hr
                            ? { top: hr.top, bottom: hr.bottom }
                            : { top: cr.top, bottom: cr.top + controlH }
                        : { top: cr.top, bottom: cr.bottom };
                // A control with words of its own (a switch's state, a button, a stepper's unit) has a baseline to read.
                const own = firstLine(ctl);
                return {
                    kind: 'control',
                    centre: (band.top + band.bottom) / 2,
                    base: own && own.rect.top < band.bottom ? own.base : null,
                    what: name(ctl),
                };
            }
        }
        if (line) return { kind: 'text', centre: (line.rect.top + line.rect.bottom) / 2, base: line.base, what: name(line.el) };
        const r = cell.getBoundingClientRect();
        return { kind: 'box', centre: (r.top + Math.min(r.bottom, r.top + controlH)) / 2, base: null, what: name(cell) };
    };
    const overlapY = (/** @type {DOMRect} */ a, /** @type {DOMRect} */ b) => Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    const sideBySide = (/** @type {Element[]} */ cells) => {
        for (let i = 0; i < cells.length; i++)
            for (let j = i + 1; j < cells.length; j++) {
                const a = cells[i].getBoundingClientRect();
                const b = cells[j].getBoundingClientRect();
                if (overlapY(a, b) > 1 && (a.right <= b.left + tol || b.right <= a.left + tol)) return true;
            }
        return false;
    };
    /** Spread of a list of numbers, and the two that differ most. @param {{v:number,label:string}[]} xs */
    const spread = (xs) => {
        const s = [...xs].sort((a, b) => a.v - b.v);
        return { d: s[s.length - 1].v - s[0].v, lo: s[0], hi: s[s.length - 1] };
    };
    /** Distinct values with tol clustering. @param {number[]} xs */
    const clusters = (xs) => {
        const s = [...xs].sort((a, b) => a - b);
        /** @type {number[]} */
        const out = [];
        for (const v of s) if (!out.length || v - out[out.length - 1] > tol) out.push(v);
        return out;
    };

    /** A row that spans every column of a grid and lays itself on the same tracks (a subgrid). @param {Element} g @param {Element} r */
    const isSubgridRow = (g, r) => {
        const gs = getComputedStyle(g);
        const rs = getComputedStyle(r);
        if (gs.display !== 'grid' || rs.display !== 'grid') return false;
        if (/subgrid/.test(rs.gridTemplateColumns)) return true;
        const n = gs.gridTemplateColumns.split(' ').length;
        return (
            n > 1 &&
            rs.gridTemplateColumns.split(' ').length === n &&
            Math.abs(r.getBoundingClientRect().width - g.getBoundingClientRect().width) <= tol + 2 * parseFloat(gs.paddingLeft || '0')
        );
    };

    /** The cell is laid on the row's first baseline by the layout itself. @param {Element} el */
    const byBaseline = (el) => {
        const self = getComputedStyle(el).alignSelf;
        const parent = el.parentElement ? getComputedStyle(el.parentElement).alignItems : '';
        return /baseline/.test(self) || (/^(auto|normal)$/.test(self) && /baseline/.test(parent));
    };

    /** A radio or a checkbox drawn as a tile or an option is controlled by its tile: the tile is the edge a reader sees. @param {Element | undefined} c */
    const tileOf = (c) => (c?.matches(MARK) ? (c.closest('.kp-field__option, label.kp-tile') ?? c) : c);

    // ---- A and B: row groups -------------------------------------------------------------------------------------
    const all = [section, ...section.querySelectorAll('*')].filter((el) => !inChrome(el) && shown(el));
    /** @type {{el: Element, rows: Element[]}[]} */
    const groups = [];
    const seenRows = new Set();
    for (const g of all) {
        const ch = kids(g);
        if (!ch.length) continue;
        /** @type {Map<string, Element[]>} */
        const bySig = new Map();
        for (const c of ch) {
            const k = sig(c);
            if (!bySig.has(k)) bySig.set(k, []);
            bySig.get(k)?.push(c);
        }
        for (const [, rows] of bySig) {
            // One row is a group too when it is a subgrid of a grid (kp-formrows, kp-kv, kp-formgrid with one row).
            const subgridRows = rows.filter((r) => isSubgridRow(g, r));
            if (rows.length < 2 && !subgridRows.length) continue;
            // Stacked: no two of them side by side.
            const rects = rows.map((r) => r.getBoundingClientRect());
            let stacked = true;
            for (let i = 1; i < rects.length && stacked; i++) if (overlapY(rects[i - 1], rects[i]) > 1) stacked = false;
            if (!stacked) continue;
            // Each a row of cells (at least two cells, and the composition's own parts inside).
            const ok = rows.filter(
                (r) => kids(r).length >= 2 && hasKp(r) && !r.matches('li.kp-code__line, .kp-code__line, tr, thead, tbody, p, ul, ol'),
            );
            if (ok.length < 1 || (ok.length < 2 && !subgridRows.length)) continue;
            if (!ok.some((r) => sideBySide(kids(r)))) continue;
            if (ok.some((r) => seenRows.has(r))) continue;
            ok.forEach((r) => seenRows.add(r));
            groups.push({ el: g, rows: ok });
        }
    }

    for (const { el: g, rows } of groups) {
        const gname = name(g).replace(/ ".*$/, '');
        /** @type {Map<string, {row: number, cell: Element}[]>} */
        const roles = new Map();
        rows.forEach((row, ri) => {
            const cells = kids(row);
            const counts = new Map();
            cells.forEach((c, ci) => {
                const s = firstClass(c) ? sig(c) : `${sig(c)}#${ci}`;
                const n = (counts.get(s) || 0) + 1;
                counts.set(s, n);
                const key = n > 1 ? `${s}~${n}` : s;
                if (!roles.has(key)) roles.set(key, []);
                roles.get(key)?.push({ row: ri, cell: c });
            });
        });
        // The phone fold of a form grid [formgrid-phone-1019]: a switch stands beside its label in the actions track (the edge
        // where every Reset ends), and a hint runs to the end of the row when the row has no action of its own. Those cells
        // are placed on purpose, so each is compared with its own kind: a switch with nothing, a hint under a Reset with the
        // hints under a Reset.
        const folded =
            g.matches('.kp-formgrid') &&
            g.getBoundingClientRect().width < 36 * parseFloat(getComputedStyle(document.documentElement).fontSize) &&
            !/^(never|always)$/.test(g.getAttribute('data-kp-formgrid-stack') || '');
        if (folded)
            for (const [role, list] of [...roles]) {
                if (/control/.test(role)) {
                    const keep = list.filter(({ cell }) => !(kids(cell).length === 1 && kids(cell)[0].matches('.kp-switch')));
                    if (keep.length !== list.length) roles.set(role, keep);
                } else if (/label/.test(role)) {
                    // The label of a switch row stops where its switch stands.
                    const keep = list.filter(
                        ({ row }) => !kids(rows[row]).some((c) => kids(c).length === 1 && kids(c)[0].matches('.kp-switch')),
                    );
                    if (keep.length !== list.length) roles.set(role, keep);
                } else if (/value|aside/.test(role)) {
                    const withAction = list.filter(({ row }) => !!rows[row].querySelector(':scope > .kp-formgrid__actions > *'));
                    const without = list.filter((x) => !withAction.includes(x));
                    roles.set(role, withAction);
                    roles.set(`${role} (no action)`, without);
                }
            }
        for (const [role0, list] of roles) {
            if (list.length < 2) continue;
            const role = role0;
            const starts = spread(list.map(({ row, cell }) => ({ v: cell.getBoundingClientRect().left, label: `row ${row + 1}` })));
            if (starts.d > tol)
                res.push(
                    `${id}: ${gname}: ${role} starts at x ${px(starts.lo.v)} in ${starts.lo.label} and x ${px(starts.hi.v)} in ${starts.hi.label} (${px(starts.d)} px apart)`,
                );
            const ends = spread(list.map(({ row, cell }) => ({ v: cell.getBoundingClientRect().right, label: `row ${row + 1}` })));
            if (ends.d > tol)
                res.push(
                    `${id}: ${gname}: ${role} ends at x ${px(ends.lo.v)} in ${ends.lo.label} and x ${px(ends.hi.v)} in ${ends.hi.label} (${px(ends.d)} px apart)`,
                );
            // The first control of each cell of this role. A cell whose buttons name their role (`data-kp-action`, a
            // `.kp-action-list` row) holds one column per role: every named button is compared with the same role's button of
            // the other rows, never with the row's first button, so a row missing the first role (its one button stands in
            // column 2 by design) is not "controls apart" [hltools-1019, homelab 75].
            /** @type {{row: number, ctl: Element | null, key: string}[]} */
            const ctlsAll = [];
            for (const { row, cell } of list) {
                const named = [...cell.querySelectorAll('[data-kp-action]')].filter((c) => shown(c) && !inChrome(c) && onScreen(c));
                if (named.length) {
                    for (const c of named) ctlsAll.push({ row, ctl: c, key: c.getAttribute('data-kp-action') || '' });
                    continue;
                }
                const ctl = tileOf(
                    cell.matches(CONTROL) ? cell : [...cell.querySelectorAll(CONTROL)].find((c) => shown(c) && !inChrome(c) && onScreen(c)),
                );
                if (ctl && ctl !== cell) ctlsAll.push({ row, ctl, key: '' });
            }
            /** @type {Map<string, typeof ctlsAll>} */
            const byKey = new Map();
            for (const x of ctlsAll) byKey.set(x.key, [...(byKey.get(x.key) ?? []), x]);
            for (const [key, ctls] of byKey) {
            const role = key ? `${role0} "${key}"` : role0;
            if (ctls.length >= 2) {
                const cs = spread(
                    ctls.map(({ row, ctl }) => ({
                        v: /** @type {Element} */ (ctl).getBoundingClientRect().left,
                        label: `row ${row + 1} ${name(/** @type {Element} */ (ctl))}`,
                    })),
                );
                // A stack of buttons centred on one axis is aligned on that axis: Kenny, 2026-10-05, "the phone view can center
                // the buttons, left alignment doesn't look nice" (the action list under 30rem). Narrowed to buttons that all
                // share one centre (align-pkg-1019); fields and any left-aligned column still answer to the start edge.
                const centredStack =
                    ctls.every(({ ctl }) => /** @type {Element} */ (ctl).matches('button, .kp-button')) &&
                    spread(
                        ctls.map(({ row, ctl }) => {
                            const r = /** @type {Element} */ (ctl).getBoundingClientRect();
                            return { v: (r.left + r.right) / 2, label: `row ${row + 1}` };
                        }),
                    ).d <= tol;
                if (cs.d > tol && !centredStack)
                    res.push(
                        `${id}: ${gname}: the ${role} controls start ${px(cs.d)} px apart: x ${px(cs.lo.v)} (${cs.lo.label}) and x ${px(cs.hi.v)} (${cs.hi.label})`,
                    );
                const wide = ctls.filter(
                    ({ ctl }) =>
                        !(/** @type {Element} */ (ctl).matches(`${MARK}, button, .kp-button`)) &&
                        /** @type {Element} */ (ctl).getBoundingClientRect().width > 64,
                );
                const endsAt = clusters(wide.map(({ ctl }) => /** @type {Element} */ (ctl).getBoundingClientRect().right));
                if (endsAt.length > 2)
                    res.push(
                        `${id}: ${gname}: the ${role} controls end on ${endsAt.length} different edges (x ${endsAt.map(px).join(', ')}); a field fills its track and a short control takes one fixed step`,
                    );
            }
            }
        }
        // B: every cell's first line on the label's first line.
        rows.forEach((row, ri) => {
            const cells = kids(row);
            if (!sideBySide(cells)) return;
            // The label is the first cell with words: a mark, an icon or an identity chip before it is not a label.
            const li = cells.findIndex(
                (c) => (c.textContent || '').trim() && !c.matches('[class*="mark"], [class*="icon"], [class*="idmark"], [class*="badge"]'),
            );
            if (li < 0) return;
            const label = cells[li];
            const la = anchor(label);
            const lr = label.getBoundingClientRect();
            // B2: a label block of several lines (a label with a note under it) beside cells that stand on its first line
            // only hangs under the row: the row reads as offset from its own label (Kenny, 2026-10-19 11:22, settings:
            // "de eerste input en de items daarachter op de eerste rij zijn niet verticaal aligned met de eerste kolom").
            const beside = cells
                .slice(li + 1)
                .filter(
                    (c) => overlapY(lr, c.getBoundingClientRect()) > 1 && (c.textContent?.trim() || c.querySelector(CONTROL) || c.matches(CONTROL)),
                );
            const lline = firstLine(label);
            // Form rows only (a label cell of a form, settings or key-value row): an alert's sentence that wraps beside
            // its actions is a text, not a label block.
            const formRow =
                row.matches('.kp-formgrid__row, .kp-formrow, .kp-kv__row') && label.matches('.kp-formgrid__label, .kp-formrow__label, dt, label');
            if (formRow && beside.length && lline && lr.height > lline.rect.height * 1.5) {
                const ob = Math.max(...beside.map((c) => c.getBoundingClientRect().bottom));
                const ot = Math.min(...beside.map((c) => c.getBoundingClientRect().top));
                const dCentre = (lr.top + lr.bottom) / 2 - (ot + ob) / 2;
                if (lr.bottom - ob > tol && Math.abs(dCentre) > tol)
                    res.push(
                        `${id}: ${gname} row ${ri + 1}: the label ${la.what} is a block ${px(lr.height)} px high and hangs ${px(lr.bottom - ob)} px under the cells beside it, which stand on its first line only (centres ${px(dCentre)} px apart): centre the row on the label block`,
                    );
            }
            for (const c of cells.slice(li + 1)) {
                const cr = c.getBoundingClientRect();
                if (overlapY(lr, cr) <= 1) continue;
                if (!c.textContent?.trim() && !c.querySelector(CONTROL) && !c.matches(CONTROL)) continue;
                const a = anchor(c);
                const dc = Math.abs(a.centre - la.centre);
                const db = a.base != null && la.base != null ? Math.abs(a.base - la.base) : Infinity;
                // A field has no text node to read its baseline from: when the row lays both cells on their first
                // baseline (align-self resolves to baseline), the engine holds them on one line.
                if (a.base == null && byBaseline(label) && byBaseline(c) && dc > tol) continue;
                // Centred as blocks: a one-line cell on the centre of a label block of several lines is a composition too.
                if (Math.abs((cr.top + cr.bottom) / 2 - (lr.top + lr.bottom) / 2) <= tol && cr.height <= controlH * 1.5) continue;
                if (dc > tol && db > tol)
                    res.push(
                        `${id}: ${gname} row ${ri + 1}: ${a.what} is ${px(Math.min(dc, db))} px off the label ${la.what} (centre ${px(a.centre - la.centre)} px${db !== Infinity ? `, baseline ${px((a.base ?? 0) - (la.base ?? 0))} px` : ''})`,
                    );
            }
        });
    }

    // ---- H: no form row is a stack on one left edge ---------------------------------------------------------------------
    // (Kenny, 2026-10-19 11:22, phone: "Grid gebruiken, niet alles links alignen, maak het mooi!": at 390 px every row of
    // the settings read label, control, value and Reset under each other, all from one left edge.) In a form row, a
    // settings row or a key-value row, the row's action (its actions cell, or a cell of buttons only) and a fact's value
    // never stand under the row's label on the label's start edge: the action takes its own track (at the end of the
    // label's line), the fact and its value share a line. `.kp-kv--stack` asks for label over value and is left out.
    const ROWISH = '.kp-formgrid__row, .kp-formrow, .kp-kv__row';
    for (const row of all.filter((el) => el.matches(ROWISH) && !el.closest('.kp-kv--stack'))) {
        const cells = kids(row);
        const li = cells.findIndex(
            (c) => (c.textContent || '').trim() && !c.matches('[class*="mark"], [class*="icon"], [class*="idmark"], [class*="badge"]'),
        );
        if (li < 0) continue;
        const label = cells[li];
        const lr = label.getBoundingClientRect();
        for (const c of cells.slice(li + 1)) {
            if (!(c.textContent || '').trim()) continue;
            const inner = kids(c);
            const isAction =
                c.matches('.kp-formgrid__actions, .kp-button') ||
                (inner.length > 0 && inner.every((k) => k.matches('button, .kp-button, a.kp-button')));
            const isValue = row.matches('.kp-kv__row') && c.matches('dd');
            if (!isAction && !isValue) continue;
            const first = (isAction && inner[0]) || c;
            const fr = first.getBoundingClientRect();
            if (fr.top >= lr.bottom - tol && Math.abs(fr.left - lr.left) <= tol)
                res.push(
                    `${id}: ${sig(row)} ${name(label)}: ${isAction ? 'the action' : 'the value'} ${name(first)} stands under its label on the same start edge (x ${px(fr.left)}), a stack on one left edge: ${isAction ? "give the action its own track, at the end of the label's line" : 'a fact and its value share one line'}`,
                );
        }
    }

    // ---- C: buttons side by side share a top, a centre or a bottom --------------------------------------------------
    // Action buttons only: a calendar day, a heat cell, a tag's remove, a segment or a stepper's step is a part of its
    // component, measured with it.
    const PARTS =
        '.kp-time, .kp-combobox, .kp-tag-list, .kp-tag, .kp-quantity, .kp-segmented, .kp-calendar, .kp-heat, table, [role="grid"], [role="tablist"], .kp-tabbar, .kp-pagination';
    const buttons = all.filter(
        (el) => el.matches('.kp-button') && !el.parentElement?.closest('button, .kp-button') && !el.closest(PARTS) && onScreen(el),
    );
    for (let i = 0; i < buttons.length; i++)
        for (let j = i + 1; j < buttons.length; j++) {
            const a = buttons[i].getBoundingClientRect();
            const b = buttons[j].getBoundingClientRect();
            // Standing on one line: the boxes share at least three quarters of the shorter one. Two buttons of different
            // columns (or of a column and the next row) that overlap by a few px by chance are not a pair
            // [formgrid-notes-1019; chassis-rs]; "Send test" 9 px off "Format" (a quarter of 36 px) still is.
            if (overlapY(a, b) < 0.75 * Math.min(a.height, b.height)) continue;
            if (!(a.right <= b.left + tol || b.right <= a.left + tol)) continue;
            const dt = Math.abs(a.top - b.top);
            const dm = Math.abs((a.top + a.bottom) / 2 - (b.top + b.bottom) / 2);
            const db = Math.abs(a.bottom - b.bottom);
            if (dt > tol && dm > tol && db > tol)
                res.push(
                    `${id}: ${name(buttons[i])} (y ${px(a.top)} to ${px(a.bottom)}) and ${name(buttons[j])} (y ${px(b.top)} to ${px(b.bottom)}) stand side by side ${px(Math.min(dt, dm, db))} px off one line (tops ${px(dt)} px apart)`,
                );
        }

    // ---- D: a button group under a row group starts or ends on its tracks ------------------------------------------
    const groupsOfButtons = all.filter((el) => {
        const k = kids(el);
        return (
            k.length >= 1 &&
            k.every((c) => c.matches('button, .kp-button, a.kp-button')) &&
            !el.matches('button, .kp-button') &&
            !seenRows.has(el) &&
            // A cell's own buttons (a row's expander, its action, a strip of nights) belong to the table: a datatable that scrolls
            // inside a max height has a box shorter than its rows, so rows scrolled out of it read as "under" the table.
            !el.closest('table, [role="grid"], .kp-table-wrap') &&
            !el.closest('.kp-code__head, .kp-command__head, .kp-secret, [role="toolbar"], .kp-console, .kp-statuslist') &&
            kids(el).every(onScreen)
        );
    });
    for (const bg of groupsOfButtons) {
        // Inside a row of a row group: that row's own cells are measured by A.
        if ([...seenRows].some((r) => r.contains(bg))) continue;
        const br = bg.getBoundingClientRect();
        // A segmented control is one box: its own padding (4 px) is its edge, not its first and last item, which sit
        // inside that padding [formgrid-notes-1019]. A segmented that is off the tracks is still caught, by its box.
        const own = bg.matches('.kp-segmented');
        const first = (own ? bg : kids(bg)[0]).getBoundingClientRect();
        const last = (own ? bg : kids(bg)[kids(bg).length - 1]).getBoundingClientRect();
        // The nearest row group above, whose width holds the button group.
        let best = null;
        for (const gr of groups) {
            const r = gr.el.getBoundingClientRect();
            if (r.bottom > br.top + tol) continue;
            if (first.left < r.left - tol || last.right > r.right + tol) continue;
            // A frame of its own (a phone-width mock stacked under a full-width band) is another column, not a row of the band:
            // when the buttons stand in a box that is narrower than the group and does not contain it, the band's edges are not theirs.
            let framed = false;
            for (let a = bg.parentElement; a && a !== section.parentElement && !a.contains(gr.el); a = a.parentElement)
                if (a.getBoundingClientRect().width < r.width - tol) framed = true;
            if (framed) continue;
            if (!best || r.bottom > best.r.bottom) best = { gr, r };
        }
        if (!best) continue;
        /** @type {number[]} */
        const edges = [best.r.left, best.r.right];
        for (const row of best.gr.rows) for (const c of kids(row)) edges.push(c.getBoundingClientRect().left, c.getBoundingClientRect().right);
        const on = (/** @type {number} */ x) => edges.some((e) => Math.abs(e - x) <= tol);
        if (!on(first.left) && !on(last.right)) {
            const near = Math.min(...edges.map((e) => Math.abs(e - first.left)));
            const words = kids(bg)
                .map((b) => (b.textContent || '').trim())
                .join(', ')
                .slice(0, 48);
            res.push(
                `${id}: buttons "${words}" start at x ${px(first.left)}, off the column edges of ${name(best.gr.el).replace(/ ".*$/, '')} above (x ${clusters(edges).map(px).join(', ')}; ${px(near)} px from the nearest)`,
            );
        }
    }
    // ---- E: buttons of one label in one column share one size ---------------------------------------------------------
    /** @type {Map<string, Element[]>} */
    const byWord = new Map();
    for (const b of buttons) {
        const w = (b.textContent || '').replace(/\s+/g, ' ').trim();
        if (!w) continue;
        if (!byWord.has(w)) byWord.set(w, []);
        byWord.get(w)?.push(b);
    }
    for (const [w, list] of byWord) {
        for (let i = 0; i < list.length; i++)
            for (let j = i + 1; j < list.length; j++) {
                const a = list[i].getBoundingClientRect();
                const b = list[j].getBoundingClientRect();
                const column = Math.abs(a.left - b.left) <= tol || Math.abs(a.right - b.right) <= tol;
                if (!column) continue;
                const dw = Math.abs(a.width - b.width);
                const dh = Math.abs(a.height - b.height);
                if (dw > tol || dh > tol)
                    res.push(
                        `${id}: two "${w.slice(0, 24)}" buttons in one column differ in size: ${px(a.width)} by ${px(a.height)} and ${px(b.width)} by ${px(b.height)} px`,
                    );
            }
    }

    /** A box with a ground or a border of its own. */
    const plated = (/** @type {Element} */ el) => {
        const cs = getComputedStyle(el);
        return cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(cs.borderTopWidth) > 0;
    };

    // ---- G: a field fills its place -------------------------------------------------------------------------------
    // (chassis-rs, 2026-10-19: `.kp-field__input` stopped at its 448 px cap, 47 px short of the card's inner edge, while
    // the label, the help and every other block ran to it.) A field, select, textarea or combobox that stands alone on its
    // line ends where its stacked siblings end, or where its grid cell ends; a short field (number, time, date,
    // `--short`) is a step of its own and is left out.
    const FIELD =
        '.kp-field__input:not(.kp-field__input--short):not([type="number"]):not([type="time"]):not([type="date"]):not([type="checkbox"]):not([type="radio"]), .kp-combobox';
    for (const f of all.filter(
        (el) =>
            el.matches(FIELD) &&
            !el.closest(PARTS.replace('.kp-combobox, ', '')) &&
            !el.parentElement?.closest('.kp-combobox, .kp-time, .kp-quantity, .kp-refresh, .kp-formgrid__buttons, [role="toolbar"]'),
    )) {
        const fr = f.getBoundingClientRect();
        // The field's own wrapper (a `.kp-field` with its label and help) ends where the field ends: measure the wrapper
        // against what stands around it.
        let box = /** @type {Element} */ (f);
        while (
            box.parentElement &&
            box.parentElement !== section &&
            Math.abs(box.parentElement.getBoundingClientRect().right - fr.right) <= tol &&
            !plated(box.parentElement) &&
            !box.parentElement.matches('.kp-formgrid__control, .kp-formrow__control, [data-kp-formgrid-span], dd')
        )
            box = box.parentElement;
        const parent = box.parentElement;
        if (!parent) continue;
        const sibs = kids(parent).filter((k) => k !== box);
        // Not alone on its line: something stands beside it.
        if (sibs.some((k) => overlapY(k.getBoundingClientRect(), fr) > 1)) continue;
        const pcs = getComputedStyle(parent);
        const inner = parent.getBoundingClientRect().right - parseFloat(pcs.paddingRight) - parseFloat(pcs.borderRightWidth);
        const runs = sibs.map((k) => k.getBoundingClientRect().right).filter((r) => r > fr.right + tol);
        const cell =
            parent.matches('.kp-formgrid__control, .kp-formrow__control, [data-kp-formgrid-span]') || /grid/.test(pcs.display) || plated(parent);
        const target = runs.length ? Math.max(...runs) : cell ? inner : null;
        if (target != null && target - fr.right > tol && Math.abs(target - inner) <= tol + 0.5)
            res.push(
                `${id}: ${name(f)}${box !== f ? ` (in ${sig(box)})` : ''} ends ${px(target - fr.right)} px short of ${runs.length ? 'the blocks above and below it' : 'its cell'} (x ${px(fr.right)} against x ${px(target)}): a field fills its track`,
            );
    }

    // ---- F: columns side by side start on one line -----------------------------------------------------------------
    // A grid or flex container whose blocks stand side by side: the first line of each block (its first control, or its
    // first text line) lines up with its neighbours by top, centre or baseline; two plated blocks (a ground or a border)
    // may line up by their own top edges instead. A row of a row group is measured by B, an aside is the demo's readout.
    // The page's own composition: inside a package component the component's own layout is judged with it.
    const LAYOUT = /^kp-(card|formgrid|stack|row|autogrid|sidebar|page|section|center|shell|dialog__body|split)/;
    const inComponent = (/** @type {Element} */ el) => {
        for (let a = /** @type {Element | null} */ (el); a && a !== section; a = a.parentElement)
            if ([...a.classList].some((k) => k.startsWith('kp-') && !LAYOUT.test(k))) return true;
        return false;
    };
    for (const c of all) {
        const cs = getComputedStyle(c);
        if (!/grid|flex/.test(cs.display) || seenRows.has(c) || inComponent(c)) continue;
        if (
            c.matches(
                'button, .kp-button, label, p, li, summary, a, [class*="badge"], [class*="__head"], .kp-code__line, .kp-segmented, .kp-quantity, .kp-switch, .kp-time, .kp-combobox, .kp-field__option',
            ) ||
            c.closest('button, .kp-button, p, label, summary')
        )
            continue;
        const blocks = kids(c).filter((k) => !k.matches('aside, [role="complementary"]') && (k.textContent?.trim() || k.querySelector(CONTROL)));
        if (blocks.length < 2) continue;
        for (let i = 0; i + 1 < blocks.length; i++) {
            const a = blocks[i];
            const b = blocks[i + 1];
            const ar = a.getBoundingClientRect();
            const br = b.getBoundingClientRect();
            if (overlapY(ar, br) <= 1 || !(ar.right <= br.left + tol)) continue;
            // Only blocks of more than one line: a mark beside its word is measured by measure-gaps.
            if (ar.height < controlH * 1.5 && br.height < controlH * 1.5) continue;
            if (plated(a) && plated(b) && Math.abs(ar.top - br.top) <= tol) continue;
            // A collapsed icon rail has no text line to share with the page beside it: its icons are its composition
            // (homelab gap 51, 2026-10-19).
            if (
                [a, b].some(
                    (k) =>
                        k.matches('[data-kp-sidenav-slim-collapsed], [data-kp-sidenav-slim-collapsed] *') ||
                        k.querySelector('[data-kp-sidenav-slim-collapsed]'),
                )
            )
                continue;
            // A plate beside open text: the plate's top on the text's first line top is a composition too.
            const fa = firstLine(a);
            const fb = firstLine(b);
            if (plated(a) !== plated(b) && fa && fb && Math.abs((plated(a) ? ar.top : fa.rect.top) - (plated(b) ? br.top : fb.rect.top)) <= tol)
                continue;
            const la = anchor(a);
            const lb = anchor(b);
            const ta = firstLine(a);
            const tb = firstLine(b);
            const dTop = ta && tb && la.kind === 'text' && lb.kind === 'text' ? Math.abs(ta.rect.top - tb.rect.top) : Infinity;
            const dc = Math.abs(la.centre - lb.centre);
            const db = la.base != null && lb.base != null ? Math.abs(la.base - lb.base) : Infinity;
            if (dc > tol && db > tol && dTop > tol)
                res.push(
                    `${id}: ${name(c).replace(/ ".*$/, '')}: the column ${name(b)} starts ${px(Math.min(dc, db, dTop))} px off the column ${name(a)} beside it (first lines: ${la.what} and ${lb.what})`,
                );
        }
    }
    // ---- G: buttons never overlap, and a snooze picker lies on its grid -----------------------------------------------
    // Kenny, 2026-10-19 11:22 (snooze-width): "De helft van de knoppen overlaps en vele dingen zijn verticaal veel te hoog
    // en horizontaal veel te kort! gebruik de hele ruimte van het element!".
    //  G1. No two buttons of the composition overlap by more than the tolerance in both directions.
    //  G2. A `.kp-snooze`: its trigger, End snooze and status line are tracks of ONE grid: the status line and a button that
    //      stands alone on its line fill the picker's width; two buttons on one line are equal in width and height and fill
    //      the width together; and no part is taller than its own content (a button one line of text plus its padding, the
    //      status line its own lines) and the picker has no empty band under its last part.
    const btns = [...section.querySelectorAll('button, .kp-button, [role="button"]')].filter((b) => shown(b) && !inChrome(b) && onScreen(b));
    for (let i = 0; i < btns.length; i++)
        for (let j = i + 1; j < btns.length; j++) {
            const a = btns[i];
            const b = btns[j];
            if (a.contains(b) || b.contains(a)) continue;
            const ar = a.getBoundingClientRect();
            const br = b.getBoundingClientRect();
            const ox = Math.min(ar.right, br.right) - Math.max(ar.left, br.left);
            const oy = Math.min(ar.bottom, br.bottom) - Math.max(ar.top, br.top);
            if (ox > tol && oy > tol) res.push(`${id}: ${name(a)} and ${name(b)} overlap by ${px(ox)} x ${px(oy)} px`);
        }
    for (const snooze of section.querySelectorAll('.kp-snooze')) {
        if (!shown(snooze) || inChrome(snooze)) continue;
        const sr = snooze.getBoundingClientRect();
        const parts = [
            ...snooze.querySelectorAll('.kp-snooze__trigger, .kp-snooze__end, .kp-snooze__status, .kp-snooze__chips'),
        ].filter(shown);
        const where = `the snooze picker (${px(sr.width)} px wide)`;
        const rowsOf = [];
        for (const part of parts.filter((q) => !q.matches('.kp-snooze__status'))) {
            const r = part.getBoundingClientRect();
            let row = rowsOf.find((x) => Math.abs(x.top - r.top) <= tol);
            if (!row) rowsOf.push((row = { top: r.top, items: [] }));
            row.items.push({ part, r });
        }
        for (const row of rowsOf) {
            const left = Math.min(...row.items.map((x) => x.r.left));
            const right = Math.max(...row.items.map((x) => x.r.right));
            if (Math.abs(left - sr.left) > tol || Math.abs(right - sr.right) > tol)
                res.push(
                    `${id}: ${where}: ${row.items.map((x) => name(x.part)).join(' + ')} cover x ${px(left - sr.left)} to ${px(right - sr.left)} of ${px(sr.width)} px: every part uses the whole width of its element`,
                );
            if (row.items.length > 1) {
                const w = row.items[0].r.width;
                const h = row.items[0].r.height;
                for (const x of row.items)
                    if (Math.abs(x.r.width - w) > tol || Math.abs(x.r.height - h) > tol)
                        res.push(
                            `${id}: ${where}: ${name(x.part)} is ${px(x.r.width)} x ${px(x.r.height)} px beside ${px(w)} x ${px(h)} px: buttons on one line share one track size`,
                        );
            }
        }
        for (const part of parts.filter((q) => q.matches('.kp-snooze__status'))) {
            const r = part.getBoundingClientRect();
            if (Math.abs(r.width - sr.width) > tol)
                res.push(`${id}: ${where}: the status line is ${px(r.width)} px wide: it spans the picker's tracks`);
            const cs = getComputedStyle(part);
            const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
            const lines = Math.max(1, Math.round(r.height / lh));
            if (r.height > lh * lines + tol) res.push(`${id}: ${where}: the status line is ${px(r.height)} px high for ${lines} line(s)`);
        }
        for (const part of parts.filter((q) => q.matches('.kp-snooze__trigger, .kp-snooze__end'))) {
            const r = part.getBoundingClientRect();
            const cs = getComputedStyle(part);
            const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
            const content = part.scrollHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
            const need = Math.max(lh, content) + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
            if (r.height > need + 12) res.push(`${id}: ${name(part)} is ${px(r.height)} px high, its content needs ${px(need)} px: no taller than its content`);
        }
        const bottom = Math.max(...[...snooze.children].filter(shown).map((c) => c.getBoundingClientRect().bottom));
        if (parts.length && sr.bottom - bottom > tol + 0.5)
            res.push(`${id}: ${where}: ${px(sr.bottom - bottom)} px of empty band under its last part`);
    }
    return [...new Set(res)];
    }
}

/**
 * Playwright side: the faults of one section, its open dialogs included, then the ones its opener buttons show
 * (`[data-kp-dialog]`, `[popovertarget]`): each closed target is opened by its button, measured as a scope of its own,
 * and closed again. A dialog a demo only opens from script is not reached: report that limit, do not guess.
 * @param {import('playwright-core').Page} page @param {string} id @returns {Promise<string[]>}
 */
export async function measureAlignOpened(page, id) {
    let out = await page.evaluate(measureAlign, /** @type {[number, string]} */ ([ALIGN_TOLERANCE, id]));
    const sel = `[data-review-item="${id.replace(/"/g, '\\"')}"]`;
    const count = await page.evaluate((q) => {
        const root = document.querySelector(q);
        if (!root) return 0;
        const list = [...root.querySelectorAll('[data-kp-dialog], [popovertarget]')];
        list.forEach((b, i) => b.setAttribute('data-align-opener', String(i)));
        return list.length;
    }, sel);
    for (let i = 0; i < count; i++) {
        const opener = page.locator(`${sel} [data-align-opener="${i}"]`);
        const usable = await opener.evaluate((b) => {
            const r = b.getBoundingClientRect();
            const target = b.getAttribute('data-kp-dialog') ?? b.getAttribute('popovertarget');
            const t = target ? document.getElementById(target) : null;
            const open = t ? (t instanceof HTMLDialogElement ? t.open : t.matches(':popover-open')) : true;
            return r.width > 0.5 && r.height > 0.5 && !(/** @type {HTMLButtonElement} */ (b).disabled) && !!t && !open && !b.closest('dialog[open]');
        });
        if (!usable) continue;
        try {
            await opener.scrollIntoViewIfNeeded({ timeout: 1000 });
            await opener.click({ timeout: 1500 });
        } catch {
            continue;
        }
        await page.waitForTimeout(500);
        out = out.concat(await page.evaluate(measureAlign, /** @type {[number, string, boolean]} */ ([ALIGN_TOLERANCE, id, true])));
        // Close only the target this opener opened: the section's own dialogs, open at load, stay open for the next section.
        await page.keyboard.press('Escape');
        await opener.evaluate((b) => {
            const t = document.getElementById(b.getAttribute('data-kp-dialog') ?? b.getAttribute('popovertarget') ?? '');
            if (t instanceof HTMLDialogElement && t.open) t.close();
            else if (t?.matches(':popover-open')) t.hidePopover();
        });
        await page.waitForTimeout(300);
    }
    return [...new Set(out)];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const { positional, opts } = parseArgs(process.argv.slice(2));
    const where = locate(positional, opts);
    const [themeArg = 'formal', widthArg = '1280,390', idArg = ''] = where.rest;
    if (!where.page) {
        console.error(`usage: node research/_review/measure-align.mjs <port> <research/topic/demo.html> [themes] [widths] [section ids] ${OPTIONS_USAGE}`);
        process.exit(2);
    }
    const browser = await launch(new URL(where.page).origin, opts);
    let found = 0;
    for (const width of widthArg.split(',').map(Number))
        for (const theme of themeArg.split(',')) {
            const page = await browser.newPage({ viewport: { width, height: 900 } });
            const response = await page.goto(where.urlFor(theme));
            if (!response || !response.ok()) {
                console.error(
                    `${where.label} answered ${response ? response.status() : 'nothing'}; is this worktree's server on that port?`,
                );
                process.exit(2);
            }
            await page.waitForTimeout(1500);
            const ids = idArg
                ? idArg.split(',')
                : await page.evaluate(() =>
                      [...document.querySelectorAll('[data-review-item]')].map((s) => String(s.getAttribute('data-review-item'))),
                  );
            /** @type {string[]} */
            let out = [];
            for (const id of ids) {
                await page.evaluate(
                    (i) => document.querySelector(`[data-review-item="${i}"]`)?.scrollIntoView({ block: 'start', behavior: 'instant' }),
                    id,
                );
                await page.waitForTimeout(150);
                out = out.concat(await measureAlignOpened(page, id));
            }
            found += out.length;
            console.log(`${theme} ${width}: ${out.length ? `${out.length} alignment fault(s)` : 'aligned'}`);
            for (const line of out) console.log(`  ${line}`);
            await page.close();
        }
    await browser.close();
    process.exit(found ? 1 : 0);
}
