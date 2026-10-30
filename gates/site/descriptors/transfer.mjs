// Page descriptor for the "transfer" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const transferDescriptor = {
        id: 'transfer',
        title: 'Transfer progress',
        group: 'Feedback',
        classes: ['kp-transfer'],
        exports: [],
        aliases: ['announce', 'bytes-base', 'eta-after', 'fold-at', 'linger', 'narrow', 'rate-window', 'show', 'stall-after', 'stalled'],
        intro: 'A progress bar with a file name, “1.2 GB of 4.1 GB”, “12 MB/s” and “about 3 min left”. It extends the progress bar and the progress group. The app reports raw numbers; the component computes the speed and the time left, and aligns the columns of several transfers.',
        whenToUse: 'An upload, a download or a copy of known size. For work with no size use the spinner; for steps use the step list.',
        examples: [
            {
                title: 'A backup being copied',
                why: 'The app reports `{ done, total, at }`; two reports are enough for a rate.',
                markup: `
<div class="kp-progress-group kp-progress-group--transfer">
<div class="kp-progress__wrap" data-kp-transfer data-kp-transfer-name="backup-2026-10-12.tar.zst"></div>
</div>
`,
                script: `
import { attachTransfers, setTransfer } from '@kp-soft/themes/js/transfer';

const row = document.querySelector('[data-kp-transfer]');
attachTransfers(row.parentElement);
const now = Date.now();
setTransfer(row, { done: 1000000000, total: 4100000000, at: now - 5000 });
setTransfer(row, { done: 1200000000, total: 4100000000, at: now });
`,
            },
            {
                title: 'Stalled, failed, done and a size nobody knows',
                why: 'The same row in its other states. No new byte for ten seconds is “stalled” (a warning, the time left hidden); `failed` ends the transfer with the app’s own sentence and a Retry that fires `kp-transfer-retry`; a transfer that reaches its total says “4.1 GB in 3 min 12 s” and, after the linger, fires `kp-transfer-leave`; without a total the row says what it knows, “1.2 GB so far”, and “size unknown”.',
                markup: `
<div class="kp-progress-group kp-progress-group--transfer" id="doc-transfer-states" data-kp-linger="0">
<div class="kp-progress__wrap" data-kp-transfer id="doc-transfer-stalled"></div>
<div class="kp-progress__wrap" data-kp-transfer id="doc-transfer-failed"></div>
<div class="kp-progress__wrap" data-kp-transfer id="doc-transfer-done"></div>
<div class="kp-progress__wrap" data-kp-transfer id="doc-transfer-unknown"></div>
</div>
`,
                script: `
import { attachTransfers, setTransfer } from '@kp-soft/themes/js/transfer';

attachTransfers(document.getElementById('doc-transfer-states'));
const base = Date.now();
const clock = { now: () => base };
setTransfer(document.getElementById('doc-transfer-stalled'), { name: 'photos.tar.zst', done: 2000000000, total: 4000000000, at: base - 30000 }, clock);
setTransfer(document.getElementById('doc-transfer-stalled'), { done: 2000000000, total: 4000000000, at: base }, clock);
setTransfer(document.getElementById('doc-transfer-failed'), { name: 'media.tar.zst', done: 1500000000, total: 6000000000, at: base - 4000 }, clock);
setTransfer(document.getElementById('doc-transfer-failed'), { failed: 'The disk is full', at: base }, clock);
setTransfer(document.getElementById('doc-transfer-done'), { name: 'docs.tar.zst', done: 0, total: 4100000000, at: base - 192000 }, clock);
setTransfer(document.getElementById('doc-transfer-done'), { done: 4100000000, total: 4100000000, at: base }, clock);
setTransfer(document.getElementById('doc-transfer-unknown'), { name: 'stream.log', done: 1200000000, at: base - 5000 }, clock);
setTransfer(document.getElementById('doc-transfer-unknown'), { done: 1260000000, at: base }, clock);
`,
            },
        ],
        variants: [
            { name: 'the script', what: '`attachTransfers(root)` wires every `[data-kp-transfer]` and returns a detach; `setTransfer(row, { done, total, at, name, failed }, { now })` reports progress (the first report starts the transfer, a report that reaches `total` ends it); `resetTransfer(row)` clears a row for a new try; `transferRate(samples, windowS)` and `transferEta(seconds)` are the two calculations, exported for a page that draws its own reading. `TRANSFER` is the selector.' },
            { name: 'events', what: '`kp-transfer-done` `{ total, ms }`, `kp-transfer-retry` and `kp-transfer-leave` (`TRANSFER_DONE_EVENT`, `TRANSFER_RETRY_EVENT`, `TRANSFER_LEAVE_EVENT`), bubbling from the row.' },
            { name: '.kp-progress__rate / __eta', what: 'The two parts the transfer adds to the progress bar’s label, track and value: “12 MB/s” and “about 3 min left”, in tabular figures and in columns shared by every row of the group.' },
            { name: '.kp-transfer__failure / __retry / __voice', what: 'The failed note with the app’s reason, its Retry, and the line only a screen reader hears (25, 50, 75 and 100 percent).' },
            { name: 'data-kp-transfer-name', what: 'The file’s name, written in the label.' },
            { name: 'data-kp-rate-window', what: 'Seconds (5): the moving average; a single sample jumps.' },
            { name: 'data-kp-eta-after', what: 'Seconds (3): no time left until that much has been measured (“estimating…”).' },
            { name: 'data-kp-stall-after', what: 'Seconds (10): no new byte for this long is “stalled”.' },
            { name: 'data-kp-bytes-base', what: '`1000` (default) or `1024`.' },
            { name: 'data-kp-show', what: 'The parts of the reading: `done,total,rate,eta,percent`, all by default.' },
            { name: 'data-kp-linger', what: 'Seconds a finished transfer stays; 30, 0 keeps it.' },
            { name: 'data-kp-transfer-unknown', what: 'Written on the row while the total is unknown: the bar is one full band that breathes in place instead of a busy sweep that restarts.' },
            { name: 'data-kp-transfer-settle', what: 'Written for a moment when the size turns out: the bar settles from where the breathing was into the finished bar.' },
            { name: 'data-kp-announce', what: '`state` (default) says 25, 50, 75 and 100 percent; `off`.' },
            { name: 'data-kp-fold-at', what: 'On the group: the width (46rem) below which the name stands on its own line and the numbers under the bar.' },
            { name: 'states', what: 'Running, estimating, stalled (warning plate), done (“4.1 GB in 3 min 12 s”), failed (the app’s reason and Retry) and total unknown (an indeterminate bar).' },
        ],
        accessibility: [
            'Built in — the bar carries the progress ARIA; a screen reader hears 25, 50, 75 and 100 percent, never every second; the figures are tabular so they do not jitter.',
            'Yours — report real byte counts, answer `kp-transfer-retry` with a new try and pass the app’s own sentence in `failed`.',
        ],
    };
