// Page descriptor for the "passkeys" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const passkeysDescriptor = {
        id: 'passkeys',
        title: 'Ways to sign in',
        group: 'Data',
        classes: ['kp-passkeys'],
        exports: [],
        aliases: ['passkey', 'never-used-after', 'protect-last', 'refuse-look'],
        intro: 'The list of ways to sign in: passkeys, magic links, passwords and tokens. One row each with its icon, its name, when it was added and, in words, when it was last used; a “This device” badge on the one in use; Rename and Remove in two fixed columns. The only way in is protected from removal.',
        whenToUse: 'An account page. For a list of API keys use the secret and copyable parts; for a plain table of records, the data table.',
        examples: [
            {
                title: 'Two ways in',
                why: 'The markup is the empty box. The page hands over the rows and the functions that remove and rename; a rejection shows the server’s reason on the row.',
                markup: `
<div class="kp-passkeys" data-kp-passkeys data-kp-protect-last="refuse"></div>
`,
                script: `
import { attachPasskeys, setPasskeys } from '@kp-soft/themes/js/passkeys';

const list = document.querySelector('[data-kp-passkeys]');
attachPasskeys(list.parentElement);
setPasskeys(list, {
    rows: [
        { key: 'pk1', label: 'Work laptop', kind: 'passkey', createdAt: Date.parse('2026-08-02T09:00:00+02:00'), lastUsedAt: Date.now() - 3600000, current: true },
        { key: 'pk2', label: 'Phone', kind: 'passkey', createdAt: Date.parse('2026-03-11T18:40:00+01:00'), lastUsedAt: Date.parse('2026-04-01T08:00:00+02:00') },
    ],
    remove: async () => {},
    rename: async () => {},
});
`,
            },
            {
                title: 'Four kinds, a refusal, an unused way and the options',
                why: '`kind` is `passkey`, `magic-link`, `password` or `token`, each with its own glyph; the list is sorted with the one in use first, then by last use (`sortPasskeys`). A way unused for `neverUsedAfter` days (90 by default; `unusedDays(row, now, limit)` is the count) is flagged as a candidate to remove. `now` is the clock, here fixed so the example does not age. When `remove` rejects, its message is the server’s reason and shows on the row, which stays. Removing the only way in is refused (`protectLast: \'refuse\'`): `refuseLook` is `button` (Remove stays, held off, the reason under the name) or `note` (the reason takes the button’s place). Press Remove on the other rows: the first asks in a dialog, and the token’s removal is refused by the page.',
                markup: `
<div class="kp-passkeys" id="doc-passkeys-kinds" data-kp-passkeys data-kp-confirm="dialog" data-kp-never-used-after="90"></div>
<pre class="kp-code-block" id="doc-passkeys-log" aria-live="polite">Press Rename or Remove.</pre>
`,
                script: `
import { PASSKEYS_REMOVE_EVENT, PASSKEYS_RENAME_EVENT, attachPasskeys, setPasskeys } from '@kp-soft/themes/js/passkeys';

const list = document.getElementById('doc-passkeys-kinds');
const log = document.getElementById('doc-passkeys-log');
attachPasskeys(list.parentElement);
const now = Date.parse('2026-10-18T12:00:00+02:00');
setPasskeys(list, {
    now: () => now,
    markCurrent: true,
    refuseLook: 'button',
    rows: [
        { key: 'pk1', label: 'Work laptop', kind: 'passkey', createdAt: Date.parse('2026-08-02T09:00:00+02:00'), lastUsedAt: now - 3_600_000, current: true },
        { key: 'ml', label: 'Magic link to anna@example.org', kind: 'magic-link', createdAt: Date.parse('2026-05-20T10:00:00+02:00'), lastUsedAt: now - 9 * 86_400_000 },
        { key: 'pw', label: 'Password', kind: 'password', createdAt: Date.parse('2025-11-02T10:00:00+01:00'), lastUsedAt: now - 140 * 86_400_000 },
        { key: 'tok', label: 'Backup token', kind: 'token', createdAt: Date.parse('2026-01-02T10:00:00+01:00'), lastUsedAt: null },
    ],
    remove: async (row) => {
        log.textContent = 'remove(' + row.key + ')';
        if (row.kind === 'token') throw new Error('The server could not reach the token store. Try again in a minute.');
    },
    rename: async (row, label) => (log.textContent = 'rename(' + row.key + ', ' + JSON.stringify(label) + ')'),
});
// Without remove and rename the page answers the cancelable events itself.
list.addEventListener(PASSKEYS_REMOVE_EVENT, (event) => (log.textContent = PASSKEYS_REMOVE_EVENT + ' { key: ' + event.detail.key + ' }'));
list.addEventListener(PASSKEYS_RENAME_EVENT, (event) => (log.textContent = PASSKEYS_RENAME_EVENT + ' { key: ' + event.detail.key + ' }'));
`,
            },
            {
                title: 'Only one way in: refused as a button, as a note, or behind a typed name',
                why: 'The same last way in three times. `refuse` keeps Remove on the row, held off, with the reason under the name; `refuse` with `refuseLook: \'note\'` puts the reason where the button was; `confirm` lets it through behind a typed name and a warning, and `confirm: \'type-name\'` asks for the exact name for every removal, not only for the one in use. `markCurrent: false` leaves the “This device” badge out.',
                markup: `
<div class="kp-stack">
<div class="kp-passkeys" id="doc-passkeys-a" data-kp-passkeys data-kp-protect-last="refuse"></div>
<div class="kp-passkeys" id="doc-passkeys-b" data-kp-passkeys data-kp-protect-last="refuse" data-kp-refuse-look="note" data-kp-mark-current="off"></div>
<div class="kp-passkeys" id="doc-passkeys-c" data-kp-passkeys data-kp-protect-last="confirm" data-kp-confirm="type-name"></div>
</div>
`,
                script: `
import { attachPasskeys, setPasskeys } from '@kp-soft/themes/js/passkeys';

const only = [{ key: 'pk1', label: 'Phone', kind: 'passkey', createdAt: Date.parse('2026-03-11T18:40:00+01:00'), lastUsedAt: Date.parse('2026-10-18T08:00:00+02:00'), current: true }];
for (const id of ['doc-passkeys-a', 'doc-passkeys-b', 'doc-passkeys-c']) {
    const list = document.getElementById(id);
    attachPasskeys(list.parentElement);
    setPasskeys(list, { now: () => Date.parse('2026-10-18T12:00:00+02:00'), rows: only, remove: async () => {}, rename: async () => {} });
}
`,
            },
            {
                title: 'Loading, empty, could not read, and not over https',
                why: '`state: \'loading\'` keeps the rows’ geometry as waiting rows under the busy card (`loadingRows`, `loadingWords`); `empty` (“No passkey registered yet” and Register, `kp-passkeys-register`; `register: false` leaves the button out) and `error` (the sentence in `message` and Retry, `kp-passkeys-retry`; `retry: false` leaves it out) fill the whole footprint of the list, centred; `insecure: true` puts a warning with what to do next above the list, because passkeys need https.',
                markup: `
<div class="kp-stack">
<div class="kp-row kp-flex-wrap kp-gap-sm" role="group" aria-label="States">
<button type="button" class="kp-button" data-doc-passkeys-state="ready">Ready</button>
<button type="button" class="kp-button" data-doc-passkeys-state="loading">Loading</button>
<button type="button" class="kp-button" data-doc-passkeys-state="empty">Empty</button>
<button type="button" class="kp-button" data-doc-passkeys-state="error">Could not read</button>
<button type="button" class="kp-button" data-doc-passkeys-state="insecure">Not https</button>
</div>
<div class="kp-passkeys" id="doc-passkeys-states" data-kp-passkeys></div>
</div>
`,
                script: `
import { PASSKEYS_REGISTER_EVENT, PASSKEYS_RETRY_EVENT, attachPasskeys, setPasskeys } from '@kp-soft/themes/js/passkeys';

const list = document.getElementById('doc-passkeys-states');
attachPasskeys(list.parentElement);
const rows = [
    { key: 'pk1', label: 'Work laptop', kind: 'passkey', createdAt: Date.parse('2026-08-02T09:00:00+02:00'), lastUsedAt: Date.parse('2026-10-18T08:00:00+02:00'), current: true },
    { key: 'pk2', label: 'Phone', kind: 'passkey', createdAt: Date.parse('2026-03-11T18:40:00+01:00'), lastUsedAt: Date.parse('2026-10-10T08:00:00+02:00') },
];
const draw = (state) =>
    setPasskeys(list, {
        now: () => Date.parse('2026-10-18T12:00:00+02:00'),
        rows: state === 'empty' ? [] : rows,
        state: state === 'insecure' ? 'ready' : state,
        insecure: state === 'insecure',
        message: 'The ways to sign in could not be read. Try again in a minute.',
        remove: async () => {},
        rename: async () => {},
    });
draw('ready');
for (const button of document.querySelectorAll('[data-doc-passkeys-state]')) {
    button.addEventListener('click', () => draw(button.getAttribute('data-doc-passkeys-state')));
}
list.addEventListener(PASSKEYS_RETRY_EVENT, () => {
    draw('loading');
    setTimeout(() => draw('ready'), 1000);
});
list.addEventListener(PASSKEYS_REGISTER_EVENT, () => draw('ready'));
`,
            },
        ],
        variants: [
            { name: 'data-kp-protect-last', what: '`refuse` (default: Remove stays held off with the reason), `confirm` (through behind a typed name and a warning) or `off`.' },
            { name: 'data-kp-confirm', what: 'How a removal is confirmed: `dialog` (default) or `type-name`. The one in use always needs the exact name typed.' },
            { name: 'data-kp-refuse-look', what: 'How the refusal reads: `button` (default: Remove stays on the row, held off, reason under the name) or `note` (the reason takes its place).' },
            { name: 'data-kp-mark-current', what: '`off` leaves the “This device” badge out.' },
            { name: 'data-kp-never-used-after', what: 'Days (90): a way not used for that long is flagged as a candidate to remove; 0 never flags.' },
            { name: 'sortPasskeys, unusedDays and passkeyOptions', what: '`sortPasskeys(rows)` is the list’s order (the one in use first, then the most recently used, a way never used last); `unusedDays(row, now, limit)` is the whole days a way has gone unused, or `null` when it was used within the limit or the flag is off; `passkeyOptions(el, spec)` is the options as drawn: the spec first, then the attribute, then the default.' },
            { name: 'kp-passkeys-register, -retry, -remove and -rename', what: 'Register and Retry are the buttons of the empty and failed lists. Remove (`{ key, row }`) and Rename (`{ key, row, label }`) are cancelable and fire only when the page gave no `remove` or `rename`: `preventDefault` means the page does it and calls `setPasskeys` again.' },
            { name: 'PASSKEY_KINDS and the `passkeys…` strings', what: 'The four kinds, each with one glyph from one set; and every word of the list (the badge, the last-used sentence, the refusals, the dialogs and the states) is in the dictionary under `passkeys…`.' },
            { name: 'states', what: '`loading` keeps the rows’ geometry as waiting rows; `empty` (“No passkey registered yet” and Register) and `error` (Retry) fill the list’s whole footprint; `insecure` puts a warning above the list, because passkeys need https.' },
        ],
        accessibility: [
            'Built in — a refusal is said beside the button, never only by the button being dead; the exact moment of last use is in the tooltip, in Europe/Brussels; the list is sorted with the one in use on top, then by last use.',
            'Yours — pass `remove` and `rename` that call the server and reject with a sentence, or handle the cancelable `kp-passkeys-remove` and `kp-passkeys-rename` yourself.',
        ],
    };
