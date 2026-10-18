// research/almanac-try-source: the page's own wiring. Every component is the package's; this file hands them their data
// (from engine.js, a port of Almanac's dry-run), wires the state and case buttons and applies the dialog's choices live.

import { setCardState } from '../../js/card-state.js';
import { setCode } from '../../js/code.js';
import { setTrace, trace } from '../../js/path-trace.js';
import { jsonField } from '../../js/json-field.js';
import { attachCommands } from '../../js/command.js';
import { attachPatterns } from '../../js/patterns.js';
import { statePlate } from '../../js/state-plate.js';
import { SAMPLES, calendarHolds, curlFor, diffLines, dryRun, hunksOf, parseRequest, profileToml, refusalWords, sourceById, specRows } from './engine.js';

/** Resolves once js/auto.js has attached everything the page carries. */
const ready = new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});
await ready;

const $ = (/** @type {string} */ id) => document.getElementById(id);
/** @param {unknown} text */
const esc = (text) => String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c);
let serial = 0;

/** A group of buttons with `data-<attr>`: the pressed one is marked, `run(value)` does the work. */
function wireGroup(attr, run) {
    const camel = attr.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    for (const button of document.querySelectorAll(`[data-${attr}]`)) {
        button.addEventListener('click', () => {
            for (const other of button.closest('[role="group"]')?.querySelectorAll(`[data-${attr}]`) ?? []) other.setAttribute('aria-pressed', String(other === button));
            run(/** @type {HTMLElement} */ (button).dataset[camel] ?? '');
        });
    }
}
/** A source picker (the package's segmented control). */
function wirePicker(id, run) {
    $(id)?.addEventListener('kp-segmented-change', (event) => run(/** @type {CustomEvent} */ (event).detail.value));
}
/** The dialog's choices, applied live; `table[choice id](value)`. */
function wireChoices(table) {
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        table[detail?.id]?.(String(detail.value));
    });
}
/** Copy buttons and ids dropped into the page after load. */
const attachCopies = (/** @type {Element} */ root) => attachPatterns(root);
const copyable = (/** @type {string} */ value) => {
    const id = `ps-copy-${(serial += 1)}`;
    return `<span class="kp-copyable"><span class="kp-copyable__value" id="${id}">${esc(value)}</span><button type="button" class="kp-button kp-button--ghost kp-copyable__button" data-kp-copy="${id}">Copy</button></span>`;
};
const alertHtml = (/** @type {string} */ label, /** @type {string} */ text) => `<span><span class="kp-alert__label">${esc(label)}: </span>${esc(text)}</span>`;
/** @param {HTMLElement} alert @param {'info' | 'success' | 'warning' | 'destructive'} tone */
function setAlert(alert, tone, label, text) {
    alert.className = `kp-alert kp-alert--${tone}`;
    alert.setAttribute('role', tone === 'destructive' ? 'alert' : 'status');
    alert.innerHTML = alertHtml(label, text);
}

// ---- 1 · Source profile ------------------------------------------------------------------------------------------------------
if ($('profile-component')) {
    let source = 'home-assistant';
    let lines = true;
    const kv = /** @type {HTMLElement} */ ($('profile-kv'));
    const card = /** @type {HTMLElement} */ ($('profile-card'));
    const KV = { columns: 'kp-kv kp-kv--columns kp-kv--lines', lines: 'kp-kv kp-kv--lines', stack: 'kp-kv kp-kv--stack' };
    const draw = () => {
        const s = /** @type {NonNullable<ReturnType<typeof sourceById>>} */ (sourceById(source));
        /** @type {HTMLElement} */ ($('profile-title')).textContent = `Profile of ${s.id}`;
        const badge = /** @type {HTMLElement} */ ($('profile-badge'));
        badge.textContent = s.real ? 'Real source' : 'Sample source name';
        badge.className = s.real ? 'kp-badge kp-badge--success' : 'kp-badge';
        const row = (label, value) => `<div class="kp-kv__row"><dt>${label}</dt><dd>${value}</dd></div>`;
        kv.innerHTML = [
            row('Source id', copyable(s.id)),
            row('Calendar', esc(s.calendar)),
            row('Calendar id (sample)', copyable(s.calendarId)),
            row('Time zone', esc(s.timezone)),
            row('Default length', `${s.minutes} minutes`),
            row('Schema version', '2'),
            row('File', copyable(`profiles/${s.id}.toml`)),
        ].join('');
        attachCopies(kv);
        setCode(/** @type {HTMLElement} */ ($('profile-toml')), { text: profileToml(s), title: 'Profile file', language: 'TOML', lines, wrap: true, size: `${profileToml(s).length} B` });
    };
    draw();
    wirePicker('profile-picker', (value) => {
        source = value;
        draw();
    });
    const reload = document.createElement('button');
    reload.type = 'button';
    reload.className = 'kp-button kp-button--primary';
    reload.textContent = 'Reload profiles from disk';
    reload.addEventListener('click', () => {
        setCardState(card, 'loading');
        setTimeout(() => setCardState(card, 'ready'), 900);
    });
    const states = {
        ready: () => setCardState(card, 'ready'),
        loading: () => setCardState(card, 'loading'),
        empty: () => setCardState(card, 'empty', { title: 'No sources loaded', text: 'Almanac serves a source only when its profile file is in profiles/.', action: reload }),
        error: () => setCardState(card, 'error', { title: 'Could not read the profile', text: `profiles/${source}.toml did not load. Nothing else is affected.` }),
    };
    wireGroup('ps-profile-state', (value) => states[value]?.());
    card.addEventListener('kp-card-retry', () => {
        setCardState(card, 'loading');
        setTimeout(() => setCardState(card, 'ready'), 900);
        for (const b of document.querySelectorAll('[data-ps-profile-state]')) b.setAttribute('aria-pressed', String(b.getAttribute('data-ps-profile-state') === 'ready'));
    });
    wireChoices({
        'kv-layout': (value) => (kv.className = KV[value] ?? KV.columns),
        'toml-lines': (value) => {
            lines = value !== 'off';
            draw();
        },
    });
}

// ---- 2 · Event editor ----------------------------------------------------------------------------------------------------------
if ($('editor-component')) {
    let source = 'home-assistant';
    const area = /** @type {HTMLTextAreaElement} */ ($('editor-body'));
    const card = /** @type {HTMLElement} */ ($('editor-card'));
    const answer = /** @type {HTMLElement} */ ($('editor-answer'));
    const tryButton = /** @type {HTMLButtonElement} */ ($('editor-try'));
    const idle = () => setAlert(answer, 'info', 'Note', 'Nothing tried yet. Press Try it.');
    // The schema check: the field hands the page a value that parses; Almanac's own parse refuses what it would refuse.
    area.addEventListener('kp-json-validate', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail.schema?.title !== 'EventRequest') return;
        const parsed = parseRequest(detail.value);
        if (!parsed.ok) detail.refuse(parsed.why);
    });
    area.addEventListener('kp-json-state', (event) => {
        const { state, message } = /** @type {CustomEvent} */ (event).detail;
        const ok = state === 'valid';
        tryButton.disabled = !ok;
        if (ok) tryButton.removeAttribute('data-kp-disabled-reason');
        else tryButton.setAttribute('data-kp-disabled-reason', state === 'empty' ? 'Paste or pick an event call first' : `Fix the call first: ${message ?? 'it is not valid'}`);
    });
    const load = (key) => {
        area.value = SAMPLES[key].text;
        area.dispatchEvent(new Event('input', { bubbles: true }));
        idle();
    };
    load('home');
    wireGroup('ps-sample', load);
    wirePicker('editor-picker', (value) => {
        source = value;
        idle();
    });
    const ask = () => {
        const value = jsonField(area)?.value();
        if (value === undefined) return;
        setCardState(card, 'loading');
        setTimeout(() => {
            const result = dryRun(source, value);
            if (result.http === 200) {
                const s = sourceById(source);
                setAlert(answer, 'success', 'Accepted (200)', `Would write "${result.body.event.summary}" to ${s?.calendar}. Nothing was written.`);
            } else setAlert(answer, 'destructive', `Refused (${result.http})`, refusalWords(result.body));
            setCardState(card, 'ready');
            for (const b of document.querySelectorAll('[data-ps-editor-state]')) b.setAttribute('aria-pressed', String(b.getAttribute('data-ps-editor-state') === 'ready'));
        }, 700);
    };
    $('editor-form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!tryButton.disabled) ask();
    });
    wireGroup('ps-editor-state', (value) => {
        if (value === 'ready') setCardState(card, 'ready');
        else if (value === 'loading') setCardState(card, 'loading');
        else setCardState(card, 'error', { title: 'Almanac did not answer', text: 'The dry-run call timed out. Your event call is still in the field.' });
    });
    card.addEventListener('kp-card-retry', () => {
        setCardState(card, 'loading');
        setTimeout(() => setCardState(card, 'ready'), 800);
        for (const b of document.querySelectorAll('[data-ps-editor-state]')) b.setAttribute('aria-pressed', String(b.getAttribute('data-ps-editor-state') === 'ready'));
    });
    wireChoices({
        'json-indent': (value) => area.setAttribute('data-kp-json-indent', value),
        'json-format': (value) => area.setAttribute('data-kp-json-format', value),
        'json-check': (value) => area.setAttribute('data-kp-json-check', value),
        'json-gutter': (value) => area.setAttribute('data-kp-json-gutter', value === 'off' ? 'false' : 'true'),
    });
}

// ---- 3 · Path trace -------------------------------------------------------------------------------------------------------------
if ($('trace-component')) {
    const el = /** @type {HTMLElement} */ ($('ps-trace'));
    const answer = /** @type {HTMLElement} */ ($('trace-answer'));
    const body = /** @type {HTMLElement} */ ($('trace-body'));
    const http = /** @type {HTMLElement} */ ($('trace-http'));
    const HA = JSON.parse(SAMPLES.home.text);
    const CASES = {
        accepted: () => dryRun('home-assistant', HA),
        unknown: () => dryRun('home-assistant', JSON.parse(SAMPLES.unknown.text)),
        notitle: () => dryRun('home-assistant', JSON.parse(SAMPLES.notitle.text)),
        endbefore: () => dryRun('home-assistant', { ...HA, end: '2026-08-28T08:00:00+00:00' }),
        nosource: () => dryRun('everything', HA),
        client: () => dryRun('home-assistant', HA, { as: 'client' }),
    };
    let current = 'accepted';
    const draw = () => {
        const result = CASES[current]();
        setTrace(el, result.hops);
        http.textContent = `HTTP ${result.http}`;
        http.className = result.http === 200 ? 'kp-badge kp-badge--success' : 'kp-badge kp-badge--destructive';
        if (result.http === 200) setAlert(answer, 'success', 'Accepted', `Almanac would write this event to ${sourceById('home-assistant')?.calendar}. Nothing was written.`);
        else setAlert(answer, 'destructive', `Refused (${result.http})`, refusalWords(result.body));
        // The event is left out of the accepted answer here: it is the next section's subject (and a JSON block of nested objects
        // would put a closing brace against its comma).
        const shown = result.http === 200 ? { ...result.body, event: 'left out here, see the result' } : result.body;
        setCode(body, { text: JSON.stringify(shown, null, 2), title: `Answer · HTTP ${result.http}`, language: 'JSON', lines: true, wrap: true });
    };
    draw();
    wireGroup('ps-case', (value) => {
        current = value;
        draw();
    });
    const markState = (value) => {
        for (const b of document.querySelectorAll('[data-ps-trace-state]')) b.setAttribute('aria-pressed', String(b.getAttribute('data-ps-trace-state') === value));
    };
    wireGroup('ps-trace-state', (value) => {
        const handle = trace(el);
        if (value === 'ready') {
            draw();
        } else if (value === 'running') {
            handle?.setState('running');
            setAlert(answer, 'info', 'Asking', 'Almanac is checking the call.');
            setCode(body, { text: '', title: 'Answer', language: 'JSON', state: 'loading', loadingWords: 'Waiting for the answer' });
        } else if (value === 'empty') {
            handle?.setState('empty');
            setAlert(answer, 'info', 'Note', 'Pick a case to see the path of its call.');
            setCode(body, { text: '', title: 'Answer', language: 'JSON', state: 'empty', message: 'No answer yet' });
        } else {
            handle?.setState('error', { message: 'Almanac did not answer the dry-run call.' });
            setAlert(answer, 'destructive', 'Failed', 'Almanac did not answer in time.');
            setCode(body, { text: '', title: 'Answer', language: 'JSON', state: 'error', message: 'There is no answer to show' });
        }
    });
    el.addEventListener('kp-trace-retry', () => {
        trace(el)?.setState('running');
        setTimeout(() => {
            draw();
            markState('ready');
        }, 900);
    });
    el.addEventListener('kp-trace-rule', () => answer.focus());
    const attr = (name) => (value) => el.setAttribute(name, value);
    wireChoices({
        'trace-stop': attr('data-kp-trace-stop'),
        'trace-verdict': attr('data-kp-trace-verdict'),
        'trace-rule': attr('data-kp-trace-rule'),
        'trace-layout': attr('data-kp-trace-layout'),
    });
}

// ---- 4 · Result -------------------------------------------------------------------------------------------------------------------
if ($('result-component')) {
    const card = /** @type {HTMLElement} */ ($('result-card'));
    const badge = /** @type {HTMLElement} */ ($('result-badge'));
    const note = /** @type {HTMLElement} */ ($('result-note'));
    const specArea = /** @type {HTMLElement} */ ($('result-spec-area'));
    const diffArea = /** @type {HTMLElement} */ ($('result-diff-area'));
    const curlArea = /** @type {HTMLElement} */ ($('result-curl-area'));
    const specTitle = /** @type {HTMLElement} */ ($('result-spec-title'));
    const diffTitle = /** @type {HTMLElement} */ ($('result-diff-title'));
    const source = /** @type {NonNullable<ReturnType<typeof sourceById>>} */ (sourceById('home-assistant'));
    const HA = JSON.parse(SAMPLES.home.text);
    const EVERYTHING = JSON.parse(SAMPLES.everything.text);
    const OUTCOMES = {
        create: { payload: EVERYTHING, holds: 'none' },
        update: { payload: HA, holds: 'changed' },
        same: { payload: HA, holds: 'same' },
        refused: { payload: JSON.parse(SAMPLES.unknown.text), holds: 'none' },
    };
    let outcome = 'create';
    let context = 'all';
    let jq = false;
    const row = (label, value) => `<div class="kp-kv__row"><dt>${label}</dt><dd>${value}</dd></div>`;
    const draw = () => {
        const { payload, holds } = OUTCOMES[outcome];
        const result = dryRun(source.id, payload);
        const diffBox = (child) => diffArea.replaceChildren(child);
        if (result.http !== 200) {
            badge.textContent = 'Refused';
            badge.className = 'kp-badge kp-badge--destructive';
            setAlert(note, 'destructive', `Refused (${result.http})`, refusalWords(result.body));
            specTitle.textContent = 'The answer';
            diffTitle.textContent = 'Against the calendar';
            specArea.innerHTML = '<figure class="kp-code" data-kp-code id="result-refusal"></figure>';
            setCode(/** @type {HTMLElement} */ (specArea.firstElementChild), { text: JSON.stringify(result.body, null, 2), title: `Answer · HTTP ${result.http}`, language: 'JSON', lines: true, wrap: true });
            diffBox(statePlate(document, { kind: 'empty', title: 'Nothing to compare', text: 'The call was refused, so no event would be written.' }));
        } else {
            const event = result.body.event;
            const existing = calendarHolds(event.extendedProperties?.private.almanac_source_id, holds);
            const rows = diffLines(existing, event);
            const changed = rows.filter((r) => r.kind !== 'same').length;
            badge.textContent = !existing ? 'Would create' : changed ? 'Would update' : 'No change';
            badge.className = `kp-badge ${!existing ? 'kp-badge--success' : changed ? 'kp-badge--info' : 'kp-badge--warning'}`;
            if (!existing) setAlert(note, 'success', 'New event', `Nothing in ${source.calendar} carries this marker yet, so Almanac would create the event. Nothing was written.`);
            else if (changed) setAlert(note, 'info', 'Update', `${source.calendar} already holds this event; Almanac would change ${rows.filter((r) => r.kind === 'added').length} of its ${rows.filter((r) => r.kind !== 'removed').length} lines. Nothing was written.`);
            else setAlert(note, 'warning', 'No change', `${source.calendar} already holds exactly this event; sending it again changes nothing.`);
            specTitle.textContent = 'The event';
            diffTitle.textContent = !existing ? 'Against the calendar: nothing there yet' : 'Against the event in the calendar';
            specArea.innerHTML = `<dl class="kp-kv kp-kv--lines" aria-label="The calendar event">${specRows(event, source)
                .map(([label, value]) => row(esc(label), label === 'Marker' ? copyable(value) : esc(value)))
                .join('')}</dl>`;
            attachCopies(specArea);
            const shown = context === 'hunks' ? hunksOf(rows, 2) : [{ header: '', rows }];
            if (!shown.length) {
                diffBox(statePlate(document, { kind: 'empty', title: 'No differences', text: 'Every line of the event is already in the calendar.' }));
            } else {
                const pre = document.createElement('pre');
                pre.className = 'kp-diff ps-diff';
                pre.tabIndex = 0;
                pre.setAttribute('aria-label', 'Changes against the calendar event');
                pre.innerHTML = shown
                    .map(
                        (h) =>
                            (h.header ? `<div class="kp-diff__hunk">${esc(h.header)}</div>` : '') +
                            h.rows
                                .map(
                                    (r) =>
                                        `<span class="kp-diff__line" data-kind="${r.kind}"><span class="kp-diff__number">${r.newNo ?? r.oldNo}</span><span class="kp-diff__sign">${r.kind === 'added' ? '+' : r.kind === 'removed' ? '-' : ' '}</span><span>${esc(r.text)}</span></span>`,
                                )
                                .join(''),
                    )
                    .join('');
                diffBox(pre);
            }
        }
        const command = document.createElement('div');
        command.className = 'kp-command';
        command.setAttribute('data-kp-command', 'bash');
        command.setAttribute('data-kp-command-where', 'a shell with ALMANAC_URL and ALMANAC_TOKEN set');
        command.innerHTML = '<pre class="kp-command__code"><code></code></pre>';
        /** @type {HTMLElement} */ (command.querySelector('code')).textContent = curlFor(source.id, JSON.parse(JSON.stringify(payload)), jq);
        curlArea.replaceChildren(command);
        attachCommands(curlArea);
    };
    draw();
    wireGroup('ps-outcome', (value) => {
        outcome = value;
        draw();
    });
    const markState = (value) => {
        for (const b of document.querySelectorAll('[data-ps-result-state]')) b.setAttribute('aria-pressed', String(b.getAttribute('data-ps-result-state') === value));
    };
    wireGroup('ps-result-state', (value) => {
        if (value === 'ready') setCardState(card, 'ready');
        else if (value === 'loading') setCardState(card, 'loading');
        else if (value === 'empty') setCardState(card, 'empty', { title: 'Nothing tried yet', text: 'Write an event call in the editor and press Try it; the result shows here.', action: null });
        else setCardState(card, 'error', { title: 'Could not ask Almanac', text: 'The dry-run call did not get an answer.' });
    });
    card.addEventListener('kp-card-retry', () => {
        setCardState(card, 'loading');
        setTimeout(() => {
            setCardState(card, 'ready');
            markState('ready');
        }, 900);
    });
    wireChoices({
        'diff-context': (value) => {
            context = value;
            draw();
        },
        'curl-jq': (value) => {
            jq = value === 'on';
            draw();
        },
    });
}
