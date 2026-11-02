// research/parts-habits-1102: the page's own wiring, part two: the overdue banner's key line with its chords, the Inbox whose rows
// settle when their task leaves, and the project editor's swatch picker. The shared helpers are demo.js's.

import { setKeys } from '../../js/keys.js';
import { attachSettled, clearSettled, settleRow } from '../../js/settled.js';
import { attachSwatches, setSwatches } from '../../js/swatches.js';
import { factNode } from '../../js/task-row.js';
import { $, on, row, say } from './demo.js';
import { COLOURS, INBOX, INBOX_MENU } from './data.js';

// ---------------------------------------------------------------- 3 · chord-keys (Today's overdue banner)
const keys = $('pg-keys');
if (keys) {
    setKeys(keys, [
        [['O', 'T'], 'move them to today', { chord: true }],
        [['O', 'L'], 'open the list', { chord: true }],
        [['Mod', 'Z'], 'undo'],
    ]);
    /** The first key of a chord, while the second may still come. */
    let first = '';
    /** @type {ReturnType<typeof setTimeout> | undefined} */
    let wait;
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey || event.metaKey || event.altKey || (event.target instanceof HTMLElement && event.target.closest('input, textarea, [contenteditable]'))) return;
        const key = event.key.toLowerCase();
        if (first === 'o' && (key === 't' || key === 'l')) say('pg-keys-log', `Heard O then ${key.toUpperCase()}: ${key === 't' ? 'the three tasks move to today' : 'the overdue list opens'}`);
        first = key === 'o' ? 'o' : '';
        clearTimeout(wait);
        wait = setTimeout(() => (first = ''), 1500);
    });
}

// ---------------------------------------------------------------- 4 · settled-row (the Inbox)
const inbox = $('pg-inbox');
if (inbox) {
    const draw = () => {
        inbox.replaceChildren(
            ...INBOX.map((task) => {
                const li = row(task, { menu: INBOX_MENU });
                if (task.settled) li.setAttribute('data-kp-settled', task.settled);
                return li;
            }),
        );
    };
    draw();
    attachSettled(inbox);
    inbox.addEventListener('kp-task-toggle', (event) => {
        const { key, done } = /** @type {CustomEvent<{ key: string, done: boolean }>} */ (event).detail;
        const ticked = event.target instanceof HTMLElement ? event.target : null;
        if (done && ticked) settleRow(ticked, 'Done');
        say('pg-inbox-log', `kp-task-toggle: ${key} done; the row settles as Done`);
    });
    inbox.addEventListener('kp-menu-select', (event) => {
        const { value } = /** @type {CustomEvent<{ value: string }>} */ (event).detail;
        const picked = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('.kp-task-row')) : null;
        if (!picked) return;
        settleRow(picked, value === 'delete' ? 'Deleted' : `Moved to ${value.replace('move:', '')}`);
        say('pg-inbox-log', `⋯ menu: ${picked.dataset.kpRowKey} ${value}; the row settles in place`);
    });
    inbox.addEventListener('kp-settled', (event) => {
        const { key, word } = /** @type {CustomEvent<{ key: string, word: string }>} */ (event).detail;
        say('pg-inbox-log', `kp-settled: ${key} ${word}`);
    });
    on('settled', (value) => {
        if (value === 'leave') say('pg-inbox-log', `Left the list: clearSettled took ${clearSettled(inbox)} settled row(s) out.`);
        else {
            draw();
            say('pg-inbox-log', 'The five rows are back; Buy oat milk is settled again.');
        }
    });
}

// ---------------------------------------------------------------- 5 · swatch-picker (the project editor)
const swatches = $('pg-swatches');
const preview = $('pg-preview');
if (swatches && preview) {
    const showProject = (/** @type {number} */ cat) =>
        preview.replaceChildren(factNode(document, { kind: 'project', text: 'Work', cat }), factNode(document, { kind: 'tag', text: '#work', cat }));
    attachSwatches(swatches);
    setSwatches(swatches, COLOURS, 'blue');
    showProject(8);
    swatches.addEventListener('kp-swatch-change', (event) => {
        const { value, source } = /** @type {CustomEvent<{ value: string, source: string }>} */ (event).detail;
        showProject(COLOURS.findIndex((c) => c.value === value) + 1);
        say('pg-swatches-log', `kp-swatch-change: ${value} (${source})`);
    });
    on('swatch-name', (value, target) => target?.setAttribute('data-kp-swatches-name', value));
}
