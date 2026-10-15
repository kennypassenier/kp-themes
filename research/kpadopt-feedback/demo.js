// The demo's wiring: the try-buttons, the sample data and the readouts.
// The components are the package's own (js/overlays.js, js/steplist.js);
// everything named kf* here is mock.
import { TOAST_HIDE_EVENT, TOAST_PAUSE_EVENT, TOAST_SHOW_EVENT, toast } from '../../js/overlays.js';
import { STEPLIST_EVENT, attachSteplists, buildSteplist, setStep } from '../../js/steplist.js';

/** @param {string} selector @param {ParentNode} [root] @returns {HTMLElement[]} */
const all = (selector, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(selector)]);
/** @param {string} id @returns {HTMLElement} */
const byId = (id) => /** @type {HTMLElement} */ (document.getElementById(id));
const stamp = () => new Date().toLocaleTimeString('en-GB', { hour12: false });

/* ------------------------------------------------------------------ Toast */

const region = byId('kf-live');
const log = byId('kf-toast-log');
/** @param {string} line */
const say = (line) => {
    const lines = (log.textContent ?? '').split('\n').filter(Boolean);
    lines.push(`${stamp()}  ${line}`);
    log.textContent = lines.slice(-6).join('\n');
};
region.addEventListener(TOAST_SHOW_EVENT, (e) => say(`shown: ${/** @type {CustomEvent} */ (e).detail.text}`));
region.addEventListener(TOAST_HIDE_EVENT, () => say('gone'));
region.addEventListener(TOAST_PAUSE_EVENT, (e) =>
    say(/** @type {CustomEvent} */ (e).detail.paused ? 'clock stopped (pointer or focus on it)' : 'clock running again (leaves after the linger)'),
);

/** @type {Record<string, () => unknown>} */
const TOASTS = {
    plain: () => toast('Saved. The handover note is visible to the day shift.', { region, ms: 6000 }),
    success: () => toast('Incident INC-4471 closed.', { region, className: 'kp-toast kp-toast--success', ms: 6000 }),
    info: () => toast('Pump house 4 reports again after 12 minutes.', { region, className: 'kp-toast kp-toast--info', ms: 6000 }),
    warning: () => toast('Pressure on line 2 is 0.3 bar under its limit.', { region, className: 'kp-toast kp-toast--warning', ms: 6000 }),
    destructive: () => toast('Line 2 was taken out of service.', { region, className: 'kp-toast kp-toast--destructive', ms: 6000 }),
    error: () =>
        toast('The export stopped at 03:12, after 41 of 60 files.', { region, className: 'kp-toast kp-toast--error', ms: 10000, close: true }),
    assertive: () => toast('Pump 2 tripped. Open the lock-out form now.', { live: 'assertive', className: 'kp-toast kp-toast--error', sticky: true }),
    sticky: () =>
        toast('Update 3.76.0 is ready. It restarts the dashboard for about ten seconds.', {
            region,
            sticky: true,
            action: { label: 'Open', onClick: () => say('Open pressed') },
        }),
    undo: () => toast('Alarm threshold deleted.', { region, close: true, ms: 15000, action: { label: 'Undo', onClick: () => say('Undo pressed') } }),
    long: () =>
        toast(
            'The nightly export of the pressure telemetry for pump house 4 did not finish. It stopped at 03:12, after 41 of the 60 files had been written, and the files that were written are complete and can be used as they are.',
            { region, close: true, ms: 12000, action: { label: 'Run again', onClick: () => say('Run again pressed') } },
        ),
    short: () => toast('Hover me: I leave in 3 s unless you do.', { region, ms: 3000, linger: 1500 }),
    nopause: () => toast('This one ignores the pointer (pause: false), 4 s.', { region, ms: 4000, pause: false }),
    stack: () => {
        for (const n of [1, 2, 3, 4, 5]) toast(`Stack message ${n} of 5 (the stage keeps three)`, { region, ms: 8000, max: 3 });
    },
};
for (const button of all('[data-kf-toast]')) button.addEventListener('click', () => TOASTS[button.dataset.kfToast ?? 'plain']?.());
byId('kf-toast-clear').addEventListener('click', () => {
    for (const el of all('.kp-toast', region)) /** @type {any} */ (el).dismiss?.();
});

/* -------------------------------------------------------------- Step list */

attachSteplists(document);

const ROWS = [
    { id: 'pull', title: 'Pull the images', note: 'Fetches what changed from the registry' },
    { id: 'stop', title: 'Stop the old containers', note: 'Waits for open requests to finish' },
    { id: 'migrate', title: 'Migrate the database', note: 'Runs the schema changes, once' },
    { id: 'start', title: 'Start the new containers', note: 'One at a time, health checked' },
    { id: 'verify', title: 'Check the dashboard answers', note: 'Three requests, all must pass' },
];

const runBox = byId('kf-run');
const hear = byId('kf-hear');
let run = 0;
/** @type {HTMLOListElement} */
let list;
const mount = () => {
    run += 1;
    list = buildSteplist(ROWS, { label: 'Update progress' });
    runBox.replaceChildren(list);
    attachSteplists(runBox);
};
mount();

// A visible copy of what the status region says, for judging the wording.
new MutationObserver(() => {
    const text = (runBox.querySelector('.kp-steplist__live')?.textContent ?? '').trim();
    if (text) hear.textContent = `Heard: “${text}”`;
}).observe(runBox, { subtree: true, childList: true, characterData: true });
document.addEventListener(STEPLIST_EVENT, () => {});

/** @param {number} ms */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/** @param {boolean} fail */
async function play(fail) {
    const mine = run;
    mount();
    const started = run;
    hear.textContent = '';
    let index = 0;
    for (const row of ROWS) {
        if (run !== started || mine > run) return;
        setStep(list, row.id, { state: 'running' });
        const ms = 900 + index * 250;
        await sleep(ms);
        if (run !== started) return;
        if (fail && row.id === 'migrate') {
            setStep(list, row.id, { state: 'failed', note: 'Column “site_id” already exists', time: `${(ms / 1000).toFixed(1)} s` });
            for (const rest of ROWS.slice(index + 1)) setStep(list, rest.id, { state: 'skipped' });
            return;
        }
        setStep(list, row.id, { state: 'done', time: `${(ms / 1000).toFixed(1)} s` });
        index += 1;
    }
}
byId('kf-run-ok').addEventListener('click', () => void play(false));
byId('kf-run-fail').addEventListener('click', () => void play(true));
byId('kf-run-reset').addEventListener('click', () => {
    mount();
    hear.textContent = '';
});

/* -------------------------------------------------------------- Diff hunks */

/**
 * @typedef {{ no: number | null, mark: ' ' | '+' | '-', text: string }} Line
 * @typedef {{ head: string, context?: string, lines: Line[] }} Hunk
 */
/** @type {Record<string, Hunk[]>} */
const DIFFS = {
    three: [
        {
            head: '@@ -4,7 +4,7 @@',
            context: '[site]',
            lines: [
                { no: 4, mark: ' ', text: '[site]' },
                { no: 5, mark: ' ', text: 'name = "Pump house 4"' },
                { no: 6, mark: ' ', text: 'region = "north"' },
                { no: 7, mark: '-', text: 'timezone = "UTC"' },
                { no: 7, mark: '+', text: 'timezone = "Europe/Brussels"' },
                { no: 8, mark: ' ', text: '' },
                { no: 9, mark: ' ', text: '[line.2]' },
            ],
        },
        {
            head: '@@ -11,8 +11,8 @@',
            context: '[line.2]',
            lines: [
                { no: 11, mark: ' ', text: 'gauge = "wall, eye level, east side"' },
                { no: 12, mark: '-', text: 'low_pressure_bar = 1.5' },
                { no: 12, mark: '+', text: 'low_pressure_bar = 2.0' },
                { no: 13, mark: '-', text: 'drop_window_minutes = 60' },
                { no: 13, mark: '+', text: 'drop_window_minutes = 30' },
                { no: 14, mark: ' ', text: 'high_pressure_bar = 4.5' },
            ],
        },
        {
            head: '@@ -27,6 +27,7 @@',
            context: '[lockout]',
            lines: [
                { no: 27, mark: ' ', text: 'requires_signature = true' },
                { no: 28, mark: '-', text: 'reopen_by = "anyone on shift"' },
                { no: 28, mark: '+', text: 'reopen_by = "the person who signed the lock-out, or the site manager, and nobody else on the rota"' },
                { no: 29, mark: ' ', text: 'log_to = "audit"' },
            ],
        },
    ],
    long: [
        {
            head: '@@ -1202,5 +1202,5 @@',
            context: 'export async function reconcileTelemetryWindowsAcrossPumpHousesAndLines(options: ReconcileOptions): Promise<Reconciliation>',
            lines: [
                { no: 1202, mark: ' ', text: '    const windows = await loadWindows(options.from, options.to);' },
                { no: 1203, mark: '-', text: '    return merge(windows, { strict: false });' },
                { no: 1203, mark: '+', text: '    return merge(windows, { strict: true });' },
            ],
        },
    ],
    bare: [
        {
            head: '@@ -1 +1 @@',
            lines: [
                { no: 1, mark: '-', text: 'retention_days = 30' },
                { no: 1, mark: '+', text: 'retention_days = 90' },
            ],
        },
    ],
    empty: [{ head: '@@ -40,0 +40,0 @@', lines: [] }],
};
for (const pre of all('[data-kf-diff]')) {
    pre.replaceChildren();
    for (const hunk of DIFFS[pre.dataset.kfDiff ?? 'three'] ?? []) {
        const header = document.createElement('div');
        header.className = 'kp-diff__hunk';
        header.append(hunk.context ? `${hunk.head} ` : hunk.head);
        if (hunk.context) {
            const context = document.createElement('span');
            context.className = 'kp-diff__hunk-context';
            context.textContent = hunk.context;
            header.append(context);
        }
        pre.append(header);
        for (const line of hunk.lines) {
            const row = document.createElement('span');
            row.className = 'kp-diff__line';
            row.dataset.kind = line.mark === '+' ? 'added' : line.mark === '-' ? 'removed' : 'same';
            const number = document.createElement('span');
            number.className = 'kp-diff__number';
            number.textContent = String(line.no ?? '');
            const sign = document.createElement('span');
            sign.className = 'kp-diff__sign';
            sign.textContent = line.mark;
            const text = document.createElement('span');
            text.textContent = line.text;
            row.append(number, sign, text);
            pre.append(row);
        }
    }
}
