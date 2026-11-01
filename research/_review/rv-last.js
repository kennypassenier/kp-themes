// The review dialog's "Last: approved · Undo" line [ux-1101, review-tools]. A verdict is one arrow press that moves on, so the dialog
// says what the last one was and takes it back with a press, instead of leaving W (the key) as the only way. rv-keys.js owns the undo
// stack and the undo itself; this only draws the newest entry of the stack and calls `undo` when the button is pressed.

/** The verdict words an entry's label begins with, in the order they are tried ("not approved" before "approved"). */
const VERDICT_WORDS = ['not approved', 'approved', 'none of these', 'picked'];

/** What the line says about an undo entry: its verdict word, with the count of a bulk approval. @param {{ kind?: string, keys?: string[], label?: string }} entry */
export function lastWords(entry) {
    if (entry.kind === 'bulk') return `approved ${entry.keys?.length ?? 0} (bulk)`;
    const label = entry.label ?? '';
    return VERDICT_WORDS.find((word) => label.startsWith(word)) ?? 'answered';
}

/**
 * @param {HTMLElement} slot  where the line goes: the verdict panel's foot
 * @param {{ undo: () => void }} actions
 * @returns {{ paint: (top: { kind?: string, keys?: string[], label?: string } | undefined, enabled: boolean) => void }}
 */
export function mountLast(slot, { undo }) {
    const line = document.createElement('p');
    line.className = 'rvk-last';
    line.hidden = true;
    const words = document.createElement('span');
    words.className = 'rvk-last__words';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'kp-button kp-button--sm kp-button--ghost rvk-last__undo';
    button.textContent = 'Undo';
    button.addEventListener('click', () => undo());
    line.append(words, document.createTextNode(' · '), button);
    slot.prepend(line);
    return {
        paint(top, enabled) {
            line.hidden = !enabled || top === undefined;
            if (line.hidden || top === undefined) return;
            words.textContent = `Last: ${lastWords(top)}`;
            line.title = top.label ?? '';
        },
    };
}
