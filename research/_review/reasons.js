// Reason chips on a reject (kit-flow-1018): under a row's "Not approved" box, a few small chips (spacing, colour, motion,
// wrong state, off-theme, broken). A click or the key 1 to 6 adds the tag to the row's note, a second one takes it away.
// Nothing is required: a reject without a chip or a note stays valid (Kenny, 2026-10-06 23:09). The option `chips`
// (flow.js, default on) shows or hides them at runtime. The tag goes through the note's own `input` event, so the
// verdict, the state and the journal take it exactly as if it was typed.
import { loadStyle, onOptions, options } from './flow.js';

export const REASONS = Object.freeze([
    { id: 'spacing', label: 'Spacing' },
    { id: 'colour', label: 'Colour' },
    { id: 'motion', label: 'Motion' },
    { id: 'wrong-state', label: 'Wrong state' },
    { id: 'off-theme', label: 'Off-theme' },
    { id: 'broken', label: 'Broken' },
]);

const tagOf = (/** @type {{ id: string }} */ reason) => `[${reason.id}]`;

/**
 * Adds the chips to one row. @param {HTMLElement} row @param {HTMLInputElement} box the "Not approved" box
 * @param {HTMLTextAreaElement} note
 */
export function attachReasons(row, box, note) {
    loadStyle();
    const group = document.createElement('div');
    group.className = 'kf-chips';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Reasons for not approving, optional');
    group.dataset.kfChips = '';
    const chips = REASONS.map((reason, i) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'kf-chip';
        chip.dataset.kfReason = reason.id;
        chip.innerHTML = '<kbd aria-hidden="true"></kbd><span></span>';
        /** @type {HTMLElement} */ (chip.querySelector('kbd')).textContent = String(i + 1);
        /** @type {HTMLElement} */ (chip.querySelector('span')).textContent = reason.label;
        chip.setAttribute('aria-keyshortcuts', String(i + 1));
        chip.addEventListener('click', () => toggle(i));
        group.append(chip);
        return chip;
    });
    function paint() {
        for (const [i, chip] of chips.entries()) chip.setAttribute('aria-pressed', String(note.value.includes(tagOf(REASONS[i]))));
        group.hidden = !options().chips || !box.checked;
    }
    function toggle(i) {
        const tag = tagOf(REASONS[i]);
        note.value = note.value.includes(tag)
            ? note.value
                  .replace(tag, '')
                  .replace(/\s{2,}/g, ' ')
                  .trim()
            : `${note.value.trim()}${note.value.trim() ? ' ' : ''}${tag}`;
        note.hidden = false;
        note.dispatchEvent(new Event('input', { bubbles: true }));
        paint();
    }
    row.dataset.kfReasons = '';
    /** @type {any} */ (row).kfToggleReason = toggle;
    note.before(group);
    box.addEventListener('change', paint);
    note.addEventListener('input', paint);
    onOptions(paint);
    paint();
}

/*
 * Keys 1 to 6: the row the focus is in, else the only rejected row in view, else the first rejected one. Off inside a
 * text field, with a modifier, or while the option is off. Physical keys, so they work on AZERTY's unshifted top row.
 */
document.addEventListener(
    'keydown',
    (event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || !options().chips) return;
        const match = /^(?:Digit|Numpad)([1-6])$/.exec(event.code);
        if (!match) return;
        const dialog = document.querySelector('dialog[open]');
        if (!dialog) return;
        const from = /** @type {HTMLElement} */ (event.target);
        if (from.matches?.('textarea, input:not([type="checkbox"]):not([type="radio"]):not([type="button"]), select')) return;
        const rows = [...dialog.querySelectorAll('[data-kf-reasons]')].filter((r) => r.querySelector('[data-rv-reject]:checked'));
        const row = rows.find((r) => r.contains(from)) ?? rows[0];
        if (!row) return;
        event.preventDefault();
        event.stopPropagation();
        /** @type {any} */ (row).kfToggleReason(Number(match[1]) - 1);
    },
    true,
);
