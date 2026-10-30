// Page descriptor for the "ack-gate" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const ackGateDescriptor = {
        id: 'ack-gate',
        title: 'Acknowledge gate',
        group: 'Feedback',
        classes: ['kp-ack'],
        aliases: ['checked'],
        exports: [],
        intro: 'A warning that holds a button back until a box is ticked: “I read the release notes of 12.1”. The button says why it is off, and a press on it takes you to the first box still open.',
        whenToUse: 'Before an action whose risk the reader must have understood: a major update, a restore over live data. It is a human guard, not a security control; the server checks again. Not for a plain “are you sure”: use a confirm.',
        examples: [
            {
                title: 'A gate and the button it guards',
                why: 'The button carries the reason while it is off; ticking turns it on and the change is announced once.',
                markup: `
<div class="kp-alert kp-alert--warning" data-kp-ack data-kp-ack-for="#doc-ack-go" data-kp-ack-key="jellyfin" data-kp-ack-label="I read the release notes of 12.1" data-kp-ack-link="https://example.com/notes">
<div class="kp-alert__body"><strong>jellyfin 10.11 → 12.1 is a major version.</strong> A major release can change its settings or move its data.</div>
</div>
<button class="kp-button kp-button--primary" type="button" id="doc-ack-go">Update</button>
`,
            },
            {
                title: 'Several gates, one button',
                why: '`data-kp-ack-mode="all"` turns the gates guarding one control into one tick for the lot, for low-risk batches. The first gate also requires its notes link to be opened once (`data-kp-ack-require-link`) before the tick can be set, and its tone is `destructive`. `kp-ack-change` fires on the gate with `{ key, checked, remaining, at }`; ticking the box sets `data-kp-checked` on it.',
                markup: `
<div id="doc-ack-batch">
<div class="kp-alert kp-alert--destructive" data-kp-ack data-kp-ack-for="#doc-ack-batch-go" data-kp-ack-key="restore" data-kp-ack-tone="destructive" data-kp-ack-mode="all" data-kp-ack-label="I understand that the restore overwrites live data" data-kp-ack-link="https://example.com/restore-notes" data-kp-ack-link-label="Read the restore notes" data-kp-ack-require-link>
<div class="kp-alert__body"><strong>Restoring media replaces what is on the disk now.</strong> Files changed since the backup are lost.</div>
</div>
<div class="kp-alert kp-alert--warning" data-kp-ack data-kp-ack-for="#doc-ack-batch-go" data-kp-ack-key="restart" data-kp-ack-mode="all" data-kp-ack-label="I understand that the stack restarts">
<div class="kp-alert__body"><strong>The stack restarts once it is restored.</strong> It is unreachable for about a minute.</div>
</div>
<button class="kp-button kp-button--destructive" type="button" id="doc-ack-batch-go">Restore</button>
</div>
`,
                script: `
import { attachAckGates } from '@kp-soft/themes/js/ack-gate';

const batch = document.getElementById('doc-ack-batch');
attachAckGates(batch);
batch.addEventListener('kp-ack-change', (event) => console.info('ack', event.detail.key, event.detail.checked, event.detail.remaining));
`,
            },
        ],
        variants: [
            { name: 'the script', what: '`attachAckGates(root)` wires every `[data-kp-ack]` and returns a detach; `ackGate(el)` answers the handle of a gate. `ACK_GATE` is the selector; the events are `ACK_EVENT` (`kp-ack-change`, `{ key, checked, remaining, at }`) and `ACK_RETRY_EVENT` (`kp-ack-retry`).' },
            { name: 'data-kp-ack-for / -label / -link / -link-label', what: 'The control(s) to enable (a selector, required), the tick’s words, the notes address and the words of its link (opened in a new tab; opening it ticks nothing for the reader).' },
            { name: 'data-kp-ack-tone / -min-ms / -focus / -key / -locked / -version', what: 'The alert’s tone (`warning` default, `destructive` or `info`); a wait in milliseconds before the tick may be set; whether a press on the off control takes the focus to the first open tick (`off` to stop it); the name of the item in the event and the announcement; a lock while the job runs; and a version that clears the tick when it changes.' },
            { name: 'data-kp-checked', what: 'Written on the gate while its box is ticked.' },
            { name: '.kp-ack__frame / __side / __link / __tick / __label', what: 'The parts: the frame round the alert and the tick, the side that holds the notes link, the link, the label with its checkbox and the sentence of the tick.' },
            { name: '.kp-ack__busy / __problem / __problem-text / __retry', what: 'The loading state (the busy card of a loading table, centred, the height kept), and the failed one: no notes found, with Retry (`data-kp-ack-retry`, `kp-ack-retry`).' },
            { name: 'data-kp-ack-mode', what: '`each` (default): one tick per gate; `all`: one tick for the lot, for low-risk batches.' },
            { name: 'data-kp-ack-reset', what: '`on-change` (default): a changed key, label or version clears the tick; `never`.' },
            { name: 'data-kp-ack-require-link', what: 'The tick stays off until the notes link was opened once; `data-kp-ack-min-ms` waits a time instead.' },
            { name: 'data-kp-state', what: '`loading` (skeleton lines, the height kept), `error` (no notes link found, with Retry on `data-kp-ack-retry`) or `empty` (no gate: hidden, the button simply on).' },
        ],
        accessibility: [
            'Built in — the guarded button keeps `aria-disabled` and its reason, so a press can answer by moving the focus to the first open tick; the change is announced once (“Update enabled”, “Update disabled: 1 release note still to read”); the whole label is the hit area, 44 px on a phone.',
            'Yours — keep the server’s own check, and name the thing read in `data-kp-ack-label`.',
        ],
    };
