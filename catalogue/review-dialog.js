// The review dialog: one block at a time, by keyboard (Kenny, 2026-09-15
// [scope-89], built from research/review-dialog/demo.html with his choices
// [scope-90]). A large dialog of one fixed size, 92% of the window wide and
// 90% high whatever block it holds, opened from a button on every judged block
// or from the page's bar. The block itself moves into the dialog's stage and
// back, so its behaviour stays attached; the stage scrolls and never gives its
// size back to the dialog.
//
// Every new item puts the cursor in the note, at the end of any draft. Up
// approves and Down rejects, a rejection only with text in the note (the
// refusal of judging.js). Left and Right move to the previous or next block on
// the page while the note is empty, and move the caret once it holds text
// (variant b). After a verdict the next block without one in its theme comes
// in; after the last, the dialog stays open and says so. Escape closes it and
// returns to the block on the page; Tab stays inside.
//
// Verdicts, notes and hashes are judging.js's own: the dialog calls the same
// `record` as the panel under the block, with the hash read at the block's
// place on the page, and writes its note under the same keys.
import { ENGINE, engineLabel } from './engine.js';
import { noteFor, setNote, themeLabel } from './review-state.js';

/**
 * @typedef {object} DialogItem  one judged block as judging.js holds it
 * @property {import('./judging.js').Entry} entry
 * @property {HTMLElement} panel
 * @property {HTMLElement} badge
 * @property {HTMLElement} reviewNote
 * @property {boolean} judged
 * @property {boolean} staged
 */

const KEYS_TEXT =
    'Left/Right move to another block while the note is empty, and the cursor once it has text. Up approves, Down rejects with a note. Escape closes.';

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * @param {{
 *   items: DialogItem[],
 *   record: (item: DialogItem, verdict: 'approved' | 'rejected') => boolean,
 *   refresh: () => void,
 *   themeOf: (item: DialogItem) => string,
 *   hashOf: (item: DialogItem) => string | undefined,
 *   refusal: string,
 * }} options
 */
export function mountReviewDialog({ items, record, refresh, themeOf, hashOf, refusal }) {
    if (!items.length) return;

    const dialog = document.createElement('dialog');
    dialog.className = 'kp-dialog cat-review-dialog';
    dialog.id = 'cat-review-dialog';
    dialog.setAttribute('aria-labelledby', 'cat-review-dialog-title');
    dialog.innerHTML = `
        <div class="cat-review-dialog__head" data-cat-dialog-chrome>
            <p class="cat-review-dialog__position" data-cat-dialog-position></p>
            <h2 class="kp-dialog__title" id="cat-review-dialog-title" data-cat-dialog-title></h2>
            <span class="kp-badge" data-cat-dialog-theme></span>
            <span class="kp-badge" data-cat-dialog-state></span>
            <button type="button" class="kp-button kp-button--ghost kp-dialog__close" aria-label="Close the review dialog (Escape)" data-cat-dialog-close>✕</button>
        </div>
        <div class="cat-review-dialog__grid">
            <div class="cat-review-dialog__stage" data-cat-dialog-stage></div>
            <div class="cat-review-dialog__side" data-cat-dialog-chrome>
                <div class="cat-look" data-cat-dialog-look></div>
                <div data-cat-dialog-review-note></div>
                <div class="kp-field cat-review-dialog__field">
                    <label class="kp-field__label" for="cat-review-dialog-note" data-cat-dialog-note-label>Note</label>
                    <textarea class="kp-field__input kp-field__input--multiline" id="cat-review-dialog-note" rows="4" aria-describedby="cat-review-dialog-keys" data-cat-dialog-note></textarea>
                    <p class="kp-field__error" id="cat-review-dialog-refused" role="alert" data-cat-dialog-refused hidden></p>
                </div>
                <div class="cat-review-dialog__actions">
                    <button type="button" class="kp-button" data-cat-dialog-go="-1">← Previous</button>
                    <button type="button" class="kp-button" data-cat-dialog-go="1">Next →</button>
                    <button type="button" class="kp-button kp-button--primary" data-cat-dialog-verdict="approved">↑ Approve</button>
                    <button type="button" class="kp-button kp-button--destructive" data-cat-dialog-verdict="rejected">↓ Not approved</button>
                </div>
                <p class="cat-review-dialog__meta" id="cat-review-dialog-keys">${KEYS_TEXT}</p>
                <p class="cat-review-dialog__meta" role="status" aria-live="polite" data-cat-dialog-live></p>
            </div>
        </div>`;
    document.body.append(dialog);
    const $ = (selector) => /** @type {HTMLElement} */ (dialog.querySelector(selector));
    const note = /** @type {HTMLTextAreaElement} */ ($('[data-cat-dialog-note]'));
    const field = $('.cat-review-dialog__field');
    const refused = $('[data-cat-dialog-refused]');
    refused.textContent = refusal;
    const stage = $('[data-cat-dialog-stage]');
    const live = $('[data-cat-dialog-live]');

    // The page's way in: one button in its bar, one on every block.
    const bar = document.querySelector('.cat-bar');
    const opener = document.createElement('button');
    opener.type = 'button';
    opener.className = 'kp-button kp-button--primary';
    opener.setAttribute('data-cat-dialog-open', '');
    opener.textContent = 'Review in a dialog';
    const spacer = bar?.querySelector('.cat-bar__spacer');
    if (spacer) spacer.after(opener);
    else bar?.append(opener);
    for (const item of items) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'kp-button kp-button--ghost kp-button--sm';
        button.setAttribute('data-cat-dialog-block', '');
        button.textContent = 'Review in a dialog';
        button.addEventListener('click', () => open(item));
        item.panel.querySelector('.cat-judge__actions')?.append(button);
    }

    /** @type {DialogItem | null} */
    let current = null;
    /** Where the block stands on the page while it is in the dialog. */
    const away = document.createElement('p');
    away.className = 'cat-note cat-review-dialog__away';
    away.textContent = 'This block is in the review dialog now.';

    /** The blocks on the page, in order: what Left and Right move through. */
    const sequence = () => items.filter((item) => item === current || !item.entry.root.hidden);

    function showRefusal(on) {
        refused.hidden = !on;
        field.classList.toggle('kp-field--invalid', on);
        if (on) {
            note.setAttribute('aria-invalid', 'true');
            note.setAttribute('aria-describedby', 'cat-review-dialog-refused cat-review-dialog-keys');
        } else {
            note.removeAttribute('aria-invalid');
            note.setAttribute('aria-describedby', 'cat-review-dialog-keys');
        }
    }

    /** The header and the side for the block in the dialog. */
    function paint() {
        const item = /** @type {DialogItem} */ (current);
        const theme = themeOf(item);
        const list = sequence();
        const left = items.filter((i) => !i.judged).length;
        $('[data-cat-dialog-position]').textContent = `${list.indexOf(item) + 1} of ${list.length} · ${left} left to judge`;
        $('[data-cat-dialog-title]').textContent = item.entry.title;
        $('[data-cat-dialog-theme]').textContent = `${themeLabel(theme)} · ${engineLabel(ENGINE)}`;
        // The panel's own badge, as the page shows it.
        const state = $('[data-cat-dialog-state]');
        state.className = item.badge.className.replace(/\s*cat-judge__badge/, '');
        state.textContent = item.badge.textContent.replace(/\s+/g, ' ').trim();
        $('[data-cat-dialog-note-label]').textContent = `Note for ${themeLabel(theme)}`;
    }

    /** Put `item` in the dialog; the one there goes back to its place. */
    function show(item) {
        if (current && current !== item) putBack(current);
        if (current !== item) {
            current = item;
            item.staged = true;
            item.entry.root.hidden = false;
            item.entry.root.before(away);
            stage.append(item.entry.root);
        }
        stage.scrollTo(0, 0);
        const look = item.entry.root.querySelector(':scope > .cat-look');
        $('[data-cat-dialog-look]').innerHTML = look?.innerHTML ?? '';
        $('[data-cat-dialog-look]').scrollTop = 0;
        $('[data-cat-dialog-review-note]').replaceChildren(item.reviewNote.cloneNode(true));
        note.value = noteFor(item.entry.notePage, item.entry.noteBlock, themeOf(item));
        showRefusal(false);
        refresh();
        paint();
        // Every new item: the cursor in the note, at the end of any draft.
        note.focus({ preventScroll: true });
        note.setSelectionRange(note.value.length, note.value.length);
    }

    function putBack(item) {
        item.staged = false;
        if (away.isConnected) away.replaceWith(item.entry.root);
        current = null;
    }

    function open(item) {
        live.textContent = '';
        if (!dialog.open) dialog.showModal();
        show(item);
    }

    opener.addEventListener('click', () => {
        const first = items.find((item) => !item.judged) ?? sequence()[0] ?? items[0];
        open(first);
        if (first.judged) live.textContent = endMessage(first);
    });

    const endMessage = (item) => `Every block is judged in ${themeLabel(themeOf(item))}. Escape closes the dialog.`;

    dialog.addEventListener('close', (event) => {
        if (event.target !== dialog || !current) return;
        const item = current;
        putBack(item);
        refresh();
        // Back to the block on the page; one that left it once judged hands
        // over to the next block still on the page, or to the bar's button.
        const at = items.indexOf(item);
        const back = [...items.slice(at), ...items.slice(0, at)].find((i) => !i.entry.root.hidden);
        if (back) {
            back.entry.root.scrollIntoView({ block: 'start' });
            /** @type {HTMLElement | null} */ (back.panel.querySelector('[data-cat-dialog-block]'))?.focus({ preventScroll: true });
        } else {
            opener.focus();
        }
    });

    function give(verdict) {
        const item = /** @type {DialogItem} */ (current);
        if (verdict === 'rejected' && !note.value.trim()) {
            showRefusal(true);
            live.textContent = '';
            note.focus();
            return;
        }
        if (!hashOf(item)) {
            live.textContent = 'This block is still being read; press again in a moment.';
            return;
        }
        record(item, verdict);
        live.textContent = `${verdict === 'approved' ? 'Approved' : 'Not approved'}: ${item.entry.title}.`;
        // The next block not yet judged in its theme, after this one.
        const at = items.indexOf(item);
        for (let step = 1; step < items.length; step += 1) {
            const next = items[(at + step) % items.length];
            if (!next.judged) return show(next);
        }
        // None left: the dialog stays open on this block and says so.
        note.value = noteFor(item.entry.notePage, item.entry.noteBlock, themeOf(item));
        showRefusal(false);
        paint();
        live.textContent = endMessage(item);
    }

    function go(step) {
        const list = sequence();
        const at = list.indexOf(/** @type {DialogItem} */ (current));
        live.textContent = '';
        show(list[(at + step + list.length) % list.length]);
    }

    function trapTab(event) {
        const all = [...dialog.querySelectorAll(FOCUSABLE)].filter(
            (el) => el.getClientRects().length && !el.closest('[inert], [hidden], [popover]:not(:popover-open)'),
        );
        if (!all.length) return;
        const first = /** @type {HTMLElement} */ (all[0]);
        const last = /** @type {HTMLElement} */ (all[all.length - 1]);
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    dialog.addEventListener('keydown', (event) => {
        const target = /** @type {Element} */ (event.target);
        // A modal dialog opened by the block under review is its own. A
        // dialog drawn open in the block (`<dialog open>`) is not modal and
        // is part of the block.
        const inner = target.closest('dialog');
        if (inner !== dialog && inner?.matches(':modal')) return;
        if (event.key === 'Tab') return trapTab(event);
        const inNote = target === note;
        const inChrome = inNote || target === dialog || Boolean(target.matches('button') && target.closest('[data-cat-dialog-chrome]'));
        // Escape from the dialog's own controls closes it. Left to the
        // browser, Firefox gave the key to the frozen <dialog open> inside the
        // Dialog block and the review dialog stayed open (measured in the
        // demo). Inside the block, a menu or a popover takes Escape first.
        if (event.key === 'Escape') {
            if (inChrome || (!event.defaultPrevented && !stage.querySelector(':popover-open'))) {
                event.preventDefault();
                dialog.close();
            }
            return;
        }
        // Inside the block, the arrows are the component's.
        if (!inChrome || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            give(event.key === 'ArrowUp' ? 'approved' : 'rejected');
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            // Variant b [scope-90]: another block only while the note is
            // empty; with text the arrows move the caret. On a dialog button
            // there is no caret to move.
            if (inNote && note.value.trim()) return;
            event.preventDefault();
            go(event.key === 'ArrowLeft' ? -1 : 1);
        }
    });

    note.addEventListener('input', () => {
        const item = /** @type {DialogItem} */ (current);
        setNote(item.entry.notePage, item.entry.noteBlock, themeOf(item), note.value);
        if (note.value.trim()) showRefusal(false);
    });

    dialog.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target : null;
        if (!target?.closest('[data-cat-dialog-chrome]')) return;
        if (target.closest('[data-cat-dialog-close]')) return dialog.close();
        const goButton = target.closest('[data-cat-dialog-go]');
        if (goButton) return go(Number(goButton.getAttribute('data-cat-dialog-go')));
        const verdictButton = target.closest('[data-cat-dialog-verdict]');
        if (verdictButton) give(/** @type {'approved' | 'rejected'} */ (verdictButton.getAttribute('data-cat-dialog-verdict')));
    });
}
