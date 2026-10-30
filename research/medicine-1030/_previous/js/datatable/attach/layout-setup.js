// The grid mode, the held height, the cover box and the page-size select.
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the the grid mode, the held height, the cover box and the page-size select part adds to the table's context.
 *
 * @typedef {{
 *     gridMode: boolean;
 *     gridReadout: HTMLElement | null;
 *     sizeLabel: HTMLLabelElement | null;
 *     sizeSelect: HTMLSelectElement | null;
 *     syncCover: () => void;
 * }} LayoutSetupFields
 */

/**
 * The grid mode, the held height, the cover box and the page-size select.
 *
 * @param {TableContext} c
 */
export function installLayoutSetup(c) {
    const { add, make, pager, putUnder, s0, sizes, undo, wrap } = c;

    // ── The grid's position line (#keyboard) ───────────────────────
    const gridMode = wrap.dataset.kpGrid !== undefined;
    c.gridMode = gridMode;
    /** @type {HTMLElement | null} */
    c.gridReadout = null;
    if (gridMode) {
        c.gridReadout = add(make('p', 'kp-datatable__status kp-datatable__grid-readout'));
        c.gridReadout.dataset.kpDatatableGridReadout = '';
        c.gridReadout.setAttribute('aria-live', 'polite');
        c.gridReadout.textContent = s0.tableGridStart;
        putUnder(c.gridReadout);
    }
    // ── A failed slot for any table that wrote none ────────────────
    // Every table can fail, not only one that asks a server: a page that
    // loads its own rows and calls state('failed') or fail() showed only
    // "Showing 0 of 0" [fix-85]. The reason goes in the words.
    if (c.failedSlot === null) {
        // The package's failed plate: the reason at heading size and a normal Retry, filling the table's footprint
        // while the rows are covered (syncCover) [state-plates-1019].
        c.failedSlot = add(make('div', 'kp-alert kp-alert--destructive kp-stateplate kp-stateplate--error'));
        c.failedSlot.dataset.kpDatatableFailed = '';
        c.failedSlot.setAttribute('role', 'alert');
        c.failedSlot.hidden = true;
        const text = make('p', 'kp-stateplate__title');
        text.dataset.kpDatatableFailedReason = '';
        text.textContent = s0.tableFailed;
        const retry = /** @type {HTMLButtonElement} */ (make('button', 'kp-button kp-stateplate__action'));
        retry.type = 'button';
        retry.dataset.kpDatatableRetry = '';
        retry.textContent = s0.tableRetry;
        c.failedSlot.append(text, retry);
        wrap.insertBefore(c.failedSlot, c.tableBlock);
    } else if (!c.failedSlot.classList.contains('kp-stateplate')) {
        // A slot the page wrote is the same plate [state-plates-1019].
        const authored = c.failedSlot;
        authored.classList.add('kp-stateplate', 'kp-stateplate--error');
        undo.push(() => authored.classList.remove('kp-stateplate', 'kp-stateplate--error'));
    }
    if (c.empty === null) {
        // The package's empty plate for a table that wrote no slot: with no rows it showed nothing, a 43 px strip under the
        // header, not the plate [states-check-1019]. Hidden until there is nothing to show (showEmpty).
        c.empty = add(make('div', 'kp-empty kp-stateplate kp-stateplate--empty'));
        c.empty.dataset.kpDatatableEmpty = '';
        c.empty.setAttribute('role', 'status');
        c.empty.hidden = true;
        c.emptyHidden = true;
        const none = make('strong', 'kp-empty__title');
        none.textContent = s0.tableEmpty;
        c.empty.append(none);
        wrap.insertBefore(c.empty, c.tableBlock);
    } else if (!c.empty.classList.contains('kp-stateplate')) {
        const authored = c.empty;
        authored.classList.add('kp-stateplate', 'kp-stateplate--empty');
        undo.push(() => authored.classList.remove('kp-stateplate', 'kp-stateplate--empty'));
    }
    if (c.empty !== null && c.state !== 'ready') {
        // A table that starts loading (or failed) has not found "nothing": an authored, visible empty slot is hidden at once.
        // Left visible, the first render withered it with leave(), about a second of a false claim [HL 145]. Detach restores it.
        c.empty.hidden = true;
        c.emptyHidden = true;
    }
    if (c.empty !== null && c.empty.querySelector('.kp-empty__title, .kp-stateplate__title') === null) {
        // A slot with words but no title gets the plate's heading (the dictionary's "Nothing found."), the words below it.
        const authored = c.empty;
        const heading = make('strong', 'kp-empty__title');
        heading.textContent = s0.tableEmpty;
        authored.prepend(heading);
        undo.push(() => heading.remove());
    }
    if (c.empty !== null) {
        // Words a page wrote bare in the slot are the plate's body text, so the plate centres them with its title.
        for (const node of [...c.empty.childNodes]) {
            if (node.nodeType !== Node.TEXT_NODE || (node.textContent ?? '').trim() === '') continue;
            const words = make('span', 'kp-stateplate__text');
            node.replaceWith(words);
            words.append(node);
            undo.push(() => words.replaceWith(node));
        }
    }
    if (c.failedSlot !== null && c.failedSlot.querySelector('.kp-stateplate__title') === null) {
        // A failed slot a page wrote gets the plate's heading: its reason element, else the dictionary's words [states-check-1019].
        const authoredFailed = c.failedSlot;
        const reason = authoredFailed.querySelector('[data-kp-datatable-failed-reason]');
        if (reason !== null) {
            reason.classList.add('kp-stateplate__title');
            undo.push(() => reason.classList.remove('kp-stateplate__title'));
        } else {
            const heading = make('strong', 'kp-stateplate__title');
            heading.dataset.kpDatatableFailedReason = '';
            heading.textContent = s0.tableFailed;
            authoredFailed.prepend(heading);
            undo.push(() => heading.remove());
        }
    }
    // ── The plate takes the table's place ───────────────────────────
    // A failed table, and a table with nothing to show, is not a notice under a table that is still drawn: the rows are
    // covered and the plate fills the height the table had with its rows (the last height it was measured at while it showed
    // rows), centred, with its normal-size action. Covered, not removed: the rows and their state stay in the document.
    // [state-plates-1019, Kenny 2026-10-16 "de hele grootte van de component gebruiken"]
    let heldHeight = 0;
    const coverBox = /** @type {HTMLElement} */ (c.tableBlock);
    const coverSizes =
        typeof ResizeObserver === 'function'
            ? new ResizeObserver(() => {
                  if (coverBox.hasAttribute('data-kp-state-covered')) return;
                  const height = coverBox.getBoundingClientRect().height;
                  if (height > 0 && c.state === 'ready' && c.all.length > 0) heldHeight = height;
              })
            : null;
    coverSizes?.observe(coverBox);
    undo.push(() => {
        coverSizes?.disconnect();
        coverBox.removeAttribute('data-kp-state-covered');
        wrap.removeAttribute('data-kp-state-covered');
        for (const slot of [c.failedSlot, c.empty]) slot?.style.removeProperty('--kp-datatable-held');
    });
    const syncCover = () => {
        const failedNow = c.state === 'failed' && c.failedSlot !== null;
        const emptyNow = !failedNow && c.empty !== null && !c.emptyHidden;
        coverBox.toggleAttribute('data-kp-state-covered', failedNow || emptyNow);
        // js/footprint.js holds the whole table's loaded height while a plate stands in the rows' place.
        if (failedNow || emptyNow) wrap.setAttribute('data-kp-state-covered', failedNow ? 'error' : 'empty');
        else wrap.removeAttribute('data-kp-state-covered');
        for (const slot of [c.failedSlot, c.empty]) {
            if (slot === null) continue;
            const mine = (slot === c.failedSlot && failedNow) || (slot === c.empty && emptyNow);
            if (mine && heldHeight > 0) slot.style.setProperty('--kp-datatable-held', `${Math.round(heldHeight)}px`);
            else slot.style.removeProperty('--kp-datatable-held');
        }
    };
    c.syncCover = syncCover;
    // ── The page-size choice ───────────────────────────────────────
    /** @type {HTMLLabelElement | null} */
    c.sizeLabel = null;
    /** @type {HTMLSelectElement | null} */
    c.sizeSelect = null;
    if (pager !== null && sizes.length > 0) {
        c.sizeLabel = /** @type {HTMLLabelElement} */ (make('label', 'kp-datatable__label'));
        c.sizeSelect = /** @type {HTMLSelectElement} */ (make('select', 'kp-field__input kp-datatable__select kp-datatable__page-size'));
        c.sizeSelect.dataset.kpDatatablePageSize = '';
        c.sizeSelect.setAttribute('aria-label', s0.tableRowsPerPage);
        for (const n of sizes) {
            const option = /** @type {HTMLOptionElement} */ (make('option'));
            option.value = String(n);
            option.textContent = String(n);
            c.sizeSelect.append(option);
        }
        c.sizeSelect.value = String(c.size);
        c.sizeLabel.append(s0.tableRowsPerPage, ' ', c.sizeSelect);
    }
}
