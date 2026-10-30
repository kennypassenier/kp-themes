// Page descriptor for the "request-inspector" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const requestInspectorDescriptor = {
        id: 'request-inspector',
        title: 'Request inspector',
        group: 'Data',
        classes: ['kp-inspector'],
        exports: [],
        aliases: ['request', 'requests', 'secrets-in-copy'],
        intro: 'A foldable block for each HTTP request a service captured: the method, the path, the status in its tone and in words, and when. Opened, it shows the headers as key and value, the body as code, “showing the first N of M”, and Copy as curl, as JSON or as the body. Secret headers are masked on screen and in a copy.',
        whenToUse: 'Debugging webhooks, client calls and delivery attempts. For a log that streams use the log; for one payload use the code block.',
        examples: [
            {
                title: 'Two captured requests',
                why: 'The markup is the card; the page hands over the requests with `setRequests`. The failed one is open by default.',
                markup: `
<div class="kp-card kp-inspector" data-kp-requests data-kp-requests-open="failed"></div>
`,
                script: `
import { attachRequestInspectors, setRequests } from '@kp-soft/themes/js/request-inspector';

const box = document.querySelector('[data-kp-requests]');
attachRequestInspectors(box.parentElement);
setRequests(box, [
    { at: '2026-10-17T20:18:03+02:00', method: 'POST', path: '/hooks/backup', status: 202, headers: { 'content-type': 'application/json', authorization: 'Bearer 4f9a' }, body: '{"ok":true}', bodyBytes: 11, source: 'client' },
    { at: '2026-10-17T20:21:40+02:00', method: 'POST', path: '/hooks/restore', status: 500, headers: { 'content-type': 'application/json' }, body: '{"error":"volume busy"}', bodyBytes: 23, source: 'client' },
]);
`,
            },
            {
                title: 'Loading, empty and failed',
                why: '`setRequestsState(el, state, { message })` puts the list in one of the card’s four states. Loading lays the busy card over at least three rows, an empty list says so with Send test (`kp-requests-test`), a failed one has the destructive plate with Retry (`kp-requests-retry`).',
                markup: `
<div class="kp-stack kp-gap-md">
<div class="kp-card kp-inspector" data-kp-requests id="doc-req-loading"></div>
<div class="kp-card kp-inspector" data-kp-requests id="doc-req-empty"></div>
<div class="kp-card kp-inspector" data-kp-requests id="doc-req-failed"></div>
</div>
`,
                script: `
import { attachRequestInspectors, setRequestsState } from '@kp-soft/themes/js/request-inspector';

attachRequestInspectors(document.getElementById('doc-req-loading').parentElement);
setRequestsState(document.getElementById('doc-req-loading'), 'loading');
setRequestsState(document.getElementById('doc-req-empty'), 'empty');
setRequestsState(document.getElementById('doc-req-failed'), 'error', { message: 'The service did not answer.' });
`,
            },
            {
                title: 'Holding its height in a state',
                why: 'Loaded, the component is as high as its rows. Loading, empty or failed it keeps that height as a minimum, so the page under it does not jump twice; the first load has nothing remembered and is left alone. A very tall list holds a screen, not its full length (the cap is set on the host or any ancestor; it is 12 rem here to show it). Press the states.',
                markup: `
<div class="kp-stack kp-gap-md" id="doc-fp-requests">
<div class="kp-row kp-gap-sm" role="group" aria-label="State">
<button type="button" class="kp-button kp-button--sm" data-doc-state="ready">Ready</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="loading">Loading</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="empty">Empty</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="error">Failed</button>
</div>
<div class="kp-card kp-inspector" data-kp-requests id="doc-fp-requests-host" style="--kp-footprint-max: 14rem"></div>
</div>
`,
                script: `
import { attachRequestInspectors, setRequests, setRequestsState } from '@kp-soft/themes/js/request-inspector';
const root = document.getElementById('doc-fp-requests');
const host = document.getElementById('doc-fp-requests-host');
attachRequestInspectors(root);
const requests = [
    { at: '2026-10-17T20:18:03+02:00', method: 'POST', path: '/hooks/backup', status: 202, headers: { 'content-type': 'application/json' }, body: '{"ok":true}', bodyBytes: 11, source: 'client' },
    { at: '2026-10-17T20:21:40+02:00', method: 'POST', path: '/hooks/restore', status: 500, headers: { 'content-type': 'application/json' }, body: '{"error":"volume busy"}', bodyBytes: 23, source: 'client' },
    { at: '2026-10-17T20:25:12+02:00', method: 'GET', path: '/health', status: 200, headers: {}, body: 'ok', bodyBytes: 2, source: 'client' },
];
const draw = (state) => {
    if (state === 'ready') { setRequests(host, requests); setRequestsState(host, 'ready'); }
    else { if (state === 'empty') setRequests(host, []); setRequestsState(host, state, { message: 'The service did not answer.' }); }
};
for (const button of root.querySelectorAll('[data-doc-state]')) {
    button.addEventListener('click', () => draw(button.dataset.docState));
}
draw('ready');
`,
            },
        ],
        variants: [
            { name: 'toCurl / toJson', what: '`toCurl(request, { mask, secretHeaders, origin })` and `toJson(request, { mask, secretHeaders })` (js/request-inspector.js) are what the copy buttons use: a request as a curl command or as JSON, the secret headers drawn as ******** unless `mask` is false. A page that sends a request on can call them too.' },
            { name: '.kp-inspector__…', what: 'The parts of a request: `__row` (the fold), `__method`, `__status`, `__path`, `__source`, `__time`, then opened `__body`, `__heading`, `__headers`, `__secret` (a masked value), `__actions`; and around the list `__bar` with `__filter` and `__count`, `__list`, `__older` (“Show N older”) and `__nomatch`.' },
            { name: 'the bar', what: 'The filter bar and its segments scroll inside the card when they are wider than it; the page never scrolls sideways.' },
            { name: 'data-kp-secret-headers', what: 'Header names masked on screen and in a copy; authorization, cookie, set-cookie, x-api-key and proxy-authorization by default.' },
            { name: 'data-kp-secrets-in-copy', what: '`masked` (default: a copy carries ******** and a separate “Copy curl with secrets” button carries the real values), `masked-only` or `real`.' },
            { name: 'data-kp-requests-open', what: '`none` (default: every request folded), `failed` (the 4xx and 5xx are open) or `first`.' },
            { name: 'data-kp-requests-max', what: 'How many show before “Show N older”; 20, newest first.' },
            { name: 'data-kp-copy-as', what: 'The copy buttons, `curl,json,body` by default.' },
            { name: 'data-kp-requests-test', what: '`false` leaves the Send test button out of the empty list.' },
            { name: 'loading, empty, error', what: '`setRequestsState` lays the busy card over at least three rows; an empty list says so with Send test; a failed one has Retry.' },
        ],
        accessibility: [
            'Built in — each request is an accordion item with its status in words, not only in colour; times are dd/mm/yyyy HH:MM with the exact moment in the title.',
            'Yours — send the headers and body as the service saw them and list the header names that are secret; the masking is only as good as that list.',
        ],
    };
