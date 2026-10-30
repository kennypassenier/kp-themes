// Page descriptor for the "thread" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const threadDescriptor = {
        id: 'thread',
        title: 'Conversation',
        group: 'Content',
        classes: ['kp-thread'],
        exports: [],
        aliases: ['dir', 'first', 'fold', 'fold-lines', 'message'],
        intro: 'A conversation in bubbles: `in` on the start side, `out` on the end side and `system` as a centred line, with day dividers, attachments, grouped headers and a Jump to newest button. Each bubble is an article called “From Acme HR, 13/10/2026 14:02”.',
        whenToUse: 'The correspondence of a dossier, a ticket or an application. For events with no sender use the timeline.',
        examples: [
            {
                title: 'Three messages',
                why: 'The markup is the empty box; the page hands over the messages with `setThread`.',
                markup: `
<div class="kp-thread" data-kp-thread></div>
`,
                script: `
import { attachThreads, setThread } from '@kp-soft/themes/js/thread';

const thread = document.querySelector('[data-kp-thread]');
attachThreads(thread.parentElement);
setThread(thread, {
    messages: [
        { key: 'm1', dir: 'in', sender: 'Acme HR', at: Date.parse('2026-10-13T14:02:00+02:00'), text: 'Thanks for applying. Could we talk on Thursday?' },
        { key: 'm2', dir: 'out', at: Date.parse('2026-10-13T15:10:00+02:00'), text: 'Happy to. Thursday at 10:00 works.', attachments: [{ name: 'cv.pdf', size: 184000, href: '/cv.pdf' }] },
        { key: 's1', dir: 'system', at: Date.parse('2026-10-14T09:00:00+02:00'), text: 'Status changed to Interview' },
    ],
});
`,
            },
            {
                title: 'A longer thread: folds, groups, attachments, a failed message and an action',
                why: 'Consecutive messages of one side from one sender within `group` minutes share one header; a day divider (“Monday 13/10/2026”) sits between days. Older messages keep their first `foldLines` lines behind “Show all N lines” while the newest is whole (`fold: \'newest\'`; `\'full\'` or a number are the other looks), and `kp-thread-fold` carries `{ key, expanded }`. A message may carry `attachments`, a `status` of `sending` (faded) or `failed` with `error` (“Not sent: why” and Retry, `kp-thread-retry` with `{ key }`), and the thread’s `actions` put a button on every bubble that fires `kp-thread-action` with `{ key, id }`. `avatar: \'both\'` shows the sender’s mark on both sides. The thread scrolls inside its box and offers Jump to newest when it is scrolled away.',
                markup: `
<div class="kp-thread" id="doc-thread-long" data-kp-thread data-kp-thread-fold-lines="2" data-kp-thread-avatar="both"></div>
<pre class="kp-code-block" id="doc-thread-log" aria-live="polite">Press Retry, Rename or Show all.</pre>
`,
                script: `
import { THREAD_ACTION_EVENT, THREAD_FOLD_EVENT, THREAD_RETRY_EVENT, attachThreads, setThread } from '@kp-soft/themes/js/thread';

const thread = document.getElementById('doc-thread-long');
const log = document.getElementById('doc-thread-log');
attachThreads(thread.parentElement);
const at = (day, time) => Date.parse('2026-10-' + day + 'T' + time + ':00+02:00');
const messages = [
    { key: 'm1', dir: 'in', sender: 'Acme HR', at: at('13', '14:02'), text: 'Thanks for applying.' },
    { key: 'm2', dir: 'in', sender: 'Acme HR', at: at('13', '14:04'), text: 'Could we talk on Thursday?' },
    { key: 'm3', dir: 'out', at: at('13', '15:10'), text: 'Happy to. Thursday at 10:00 works.', attachments: [{ name: 'cv.pdf', size: 184000, href: '#cv' }, { name: 'letter.pdf', size: 52000, href: '#letter' }] },
    { key: 'm4', dir: 'in', sender: 'Acme HR', at: at('13', '16:30'), text: 'Great.\\nPlease bring a portfolio.\\nWe have a room on the second floor.\\nAsk at the desk for Sam.\\nParking is behind the building.' },
    { key: 's1', dir: 'system', at: at('14', '09:00'), text: 'Status changed to Interview' },
    { key: 'm5', dir: 'out', at: at('14', '09:20'), text: 'Will do. One question about the dress code.', status: 'failed', error: 'No connection' },
];
const draw = () =>
    setThread(thread, { label: 'Correspondence with Acme', messages, actions: [{ id: 'rename', label: 'Rename' }] });
draw();
thread.addEventListener(THREAD_FOLD_EVENT, (event) => (log.textContent = THREAD_FOLD_EVENT + ' { key: ' + event.detail.key + ', expanded: ' + event.detail.expanded + ' }'));
thread.addEventListener(THREAD_ACTION_EVENT, (event) => (log.textContent = THREAD_ACTION_EVENT + ' { key: ' + event.detail.key + ', id: ' + event.detail.id + ' }'));
thread.addEventListener(THREAD_RETRY_EVENT, (event) => {
    log.textContent = THREAD_RETRY_EVENT + ' { key: ' + event.detail.key + ' }';
    messages.find((m) => m.key === event.detail.key).status = 'sending';
    draw();
    setTimeout(() => {
        delete messages.find((m) => m.key === event.detail.key).status;
        draw();
    }, 1200);
});
`,
            },
            {
                title: 'Newest first, plain bubbles, and the states',
                why: '`order: \'newest\'` puts the newest on top; `bubble` is `tinted` (your own on a wash of the primary colour), `plain` (both on the card plate, yours only at the end of the row) or `filled`; `days: false` leaves the dividers out; `avatar: \'none\'` the marks. `loading` keeps the box and shows one waiting bubble on each side; `empty` (“No messages yet” and Add, `kp-thread-add`; `add: false` leaves the button out) and `error` (Retry, `kp-thread-retry` without a key; `retry: false` leaves it out) fill the box, centred.',
                markup: `
<div class="kp-stack">
<div class="kp-row kp-flex-wrap kp-gap-sm" role="group" aria-label="States">
<button type="button" class="kp-button" data-doc-thread-state="ready">Ready</button>
<button type="button" class="kp-button" data-doc-thread-state="loading">Loading</button>
<button type="button" class="kp-button" data-doc-thread-state="empty">Empty</button>
<button type="button" class="kp-button" data-doc-thread-state="error">Could not read</button>
</div>
<div class="kp-thread" id="doc-thread-states" data-kp-thread></div>
</div>
`,
                script: `
import { THREAD_ADD_EVENT, THREAD_RETRY_EVENT, attachThreads, setThread } from '@kp-soft/themes/js/thread';

const thread = document.getElementById('doc-thread-states');
attachThreads(thread.parentElement);
const at = (day, time) => Date.parse('2026-10-' + day + 'T' + time + ':00+02:00');
const messages = [
    { key: 'a', dir: 'in', sender: 'Sam Peeters', at: at('13', '14:02'), text: 'Could we talk on Thursday?' },
    { key: 'b', dir: 'out', at: at('13', '15:10'), text: 'Thursday at 10:00 works.' },
    { key: 'c', dir: 'in', sender: 'Sam Peeters', at: at('14', '09:00'), text: 'See you then.' },
];
const draw = (state) =>
    setThread(thread, {
        messages: state === 'empty' ? [] : messages,
        state,
        order: 'newest',
        bubble: 'plain',
        message: 'The conversation could not be read. Try again in a minute.',
    });
draw('ready');
for (const button of document.querySelectorAll('[data-doc-thread-state]')) {
    button.addEventListener('click', () => draw(button.getAttribute('data-doc-thread-state')));
}
thread.addEventListener(THREAD_RETRY_EVENT, () => {
    draw('loading');
    setTimeout(() => draw('ready'), 1000);
});
thread.addEventListener(THREAD_ADD_EVENT, () => draw('ready'));
`,
            },
        ],
        variants: [
            { name: 'data-kp-thread-order', what: '`oldest` (default, like mail) or `newest`.' },
            { name: 'data-kp-thread-fold', what: 'How a long message is shown: `newest` (default: the newest whole, older ones keep their first lines), `full`, or a number N that folds every message longer than N lines.' },
            { name: 'data-kp-thread-fold-lines', what: 'Lines an older message keeps; 3.' },
            { name: 'data-kp-thread-group', what: 'Minutes (5): consecutive messages of one side from one sender within it share one header.' },
            { name: 'data-kp-thread-days', what: '`off` leaves the day dividers out.' },
            { name: 'data-kp-thread-avatar', what: '`in` (default), `both` or `none`: the sender’s mark beside the bubble.' },
            { name: 'data-kp-thread-bubble', what: 'How the sides are told apart: `tinted` (default), `plain` or `filled`.' },
            { name: 'groupMessages, dayLabel and threadOptions', what: '`groupMessages(messages, minutes)` splits messages (oldest first) into the runs that share one header: the same side and sender, the same day, each within the minutes of the one before, system lines alone; `dayLabel(ms, locale)` is “Monday 13/10/2026”; `threadOptions(el, spec)` is the options as drawn: the spec first, then the attribute, then the default.' },
            { name: 'kp-thread-retry, -add, -action and -fold', what: 'Retry carries `{ key }` for a message that was not sent and nothing for a thread that could not be read; Add is the empty thread’s button; Action carries `{ key, id }`; Fold carries `{ key, expanded }`.' },
            { name: 'THREAD_TIME_ZONE and the `thread…` strings', what: 'Every time is written in Europe/Brussels as dd/mm/yyyy HH:mm; every word the thread adds (the day divider, Show all N lines, Copy text, Jump to newest, Sending…, Not sent, the states) is in the dictionary under `thread…`.' },
            { name: 'per message', what: '`attachments`, `status` (`sending`, or `failed` with Retry) and `actions` (`{ id, label }` buttons that fire `kp-thread-action`).' },
            { name: 'states', what: '`loading` (one waiting bubble on each side), `empty` (“No messages yet” and Add) and `error` (Retry) fill the box.' },
        ],
        accessibility: [
            'Built in — times are dd/mm/yyyy HH:mm in Europe/Brussels with the exact moment in each header; every bubble has a Copy text button; long words and addresses wrap anywhere; a long thread scrolls inside its box.',
            'Yours — give each message a stable key, and answer `kp-thread-retry` by sending it again.',
        ],
    };
