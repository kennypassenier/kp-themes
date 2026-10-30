// Page descriptor for the "connection" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const connectionDescriptor = {
        id: 'connection',
        title: 'Connection banner',
        group: 'Feedback',
        classes: ['kp-connection'],
        exports: [],
        aliases: ['announce', 'back-ms', 'pending', 'placement', 'retry', 'retry-delays'],
        intro: 'The banner that says the connection is gone: “No connection, 3 changes waiting”, “Reconnecting…”, or “Refused” when the browser is online and the server is not. It sits directly under the navigation bar, pushes the content down instead of covering it, and takes no room at all while the connection is fine.',
        whenToUse: 'A page that keeps working offline or on a stream: a PWA, a dashboard on a live feed. For data that is merely old, use the freshness line; for one failed action, use the toast or the problem alert.',
        examples: [
            {
                title: 'Offline with changes waiting',
                why: 'The markup is the empty box. The app reports what it sees with `setConnection`; `navigator.onLine` alone says nothing about the server, so the source is the app here.',
                markup: `
<div class="kp-connection" data-kp-connection data-kp-connection-source="app" data-kp-retry-delays="off"></div>
`,
                script: `
import { attachConnection, setConnection } from '@kp-soft/themes/js/connection';

const banner = document.querySelector('[data-kp-connection]');
attachConnection(banner.parentElement);
setConnection(banner, 'offline', { pending: 3 });
`,
            },
            {
                title: 'Refused, reconnecting and back',
                why: 'The same banner in its other states. `refused` is the destructive plate: the browser is online and the server refuses, the app’s own sentence is the reason. The buttons below report each state with `setConnection(el, state, { pending, why, attempt })`; `kp-connection-state` fires on every change and `kp-connection-retry` when a try is due, which the app answers with the next `setConnection`.',
                markup: `
<div class="kp-row kp-gap-sm">
<button type="button" class="kp-button" data-doc-connection="refused">Refused</button>
<button type="button" class="kp-button" data-doc-connection="reconnecting">Reconnecting</button>
<button type="button" class="kp-button" data-doc-connection="online">Back online</button>
</div>
<div class="kp-connection" id="doc-connection-states" data-kp-connection data-kp-connection-source="app" data-kp-placement="top" data-kp-retry-delays="off"></div>
`,
                script: `
import { attachConnection, setConnection } from '@kp-soft/themes/js/connection';

const banner = document.getElementById('doc-connection-states');
attachConnection(banner.parentElement);
const reports = {
    refused: () => setConnection(banner, 'refused', { why: 'The server did not accept the change.' }),
    reconnecting: () => setConnection(banner, 'reconnecting', { pending: 3, attempt: 2 }),
    online: () => setConnection(banner, 'online'),
};
for (const button of document.querySelectorAll('[data-doc-connection]')) {
    button.addEventListener('click', () => reports[button.dataset.docConnection]());
}
setConnection(banner, 'refused', { why: 'The server did not accept the change.' });
`,
            },
        ],
        variants: [
            { name: 'the script', what: '`attachConnection(root)` wires every `[data-kp-connection]` and returns a detach; `connectionOf(el)` answers the handle; `setConnection(el, state, { pending, why, attempt })` reports a state. `CONNECTION` is the selector and `CONNECTION_STATES` the five states; the events are `CONNECTION_STATE_EVENT` (`{ state, previous, pending }`) and `CONNECTION_RETRY_EVENT` (`{ attempt, auto }`).' },
            { name: '.kp-connection__band', what: 'The plate inside the banner: a `.kp-alert` (warning offline, destructive refused, success when it is back) with `__mark`, `__body` (`__title`, `__why`, `__meta`: the time to the next try) and `__retry`, the Retry now button.' },
            { name: 'online', what: 'Nothing is drawn and no room is taken.' },
            { name: 'offline', what: 'The warning plate: what, why, what now, the time to the next try and Retry now.' },
            { name: 'reconnecting', what: 'A try is under way, with its attempt number.' },
            { name: 'back', what: 'Success: “Connected again” stays for a moment, then leaves.' },
            { name: 'refused', what: 'The destructive plate: the browser is online and the server refuses; the app’s own sentence is the reason.' },
            { name: 'data-kp-connection-source', what: '`browser`, `app` or `both` (default): which reports count.' },
            { name: 'data-kp-connection-grace', what: 'Milliseconds (3000): a drop shorter than this shows nothing.' },
            { name: 'data-kp-pending', what: 'The number of changes waiting, exact; also `setConnection(el, state, { pending })`.' },
            { name: 'data-kp-placement', what: '`bottom` (default, fixed to the foot of the window) or `top` (in the flow, under the navigation bar). Change it at any time.' },
            { name: 'data-kp-back-ms', what: 'Milliseconds (3000) “Connected again” stays.' },
            { name: 'data-kp-retry', what: '`off` leaves the Retry now button out.' },
            { name: 'data-kp-retry-delays', what: 'Seconds between automatic tries, `3,10,30,60` by default (the last repeats); `off` for none.' },
            { name: 'data-kp-announce', what: '`state` (default) says each change once, politely and going offline assertively; `off`.' },
        ],
        accessibility: [
            'Built in — each change is announced once; going offline is assertive, the rest polite. On a phone the banner is one line plus Retry now.',
            'Yours — report failed fetches and dropped streams with `setConnection`, answer `kp-connection-retry` with a real try, and pass the number of changes that are waiting.',
        ],
    };
