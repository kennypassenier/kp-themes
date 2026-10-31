// research/gaps-1031: the page's own wiring. Every component is the package's; this file fills each with its app's data (the homelab
// Inbox's questions and notices, its Settings tokens, a stack's secrets and its schedules; kyu's publish snippet) and wires each section's
// controls by that section's own elements, so a section works on any page that shows it. The names, times and token are mock.

import { askQuestion, attachQuestions } from '../../js/question-card.js';
import { attachNotices, setNotices } from '../../js/notices.js';
import { setPasskeys } from '../../js/passkeys.js';
import { attachMasterDetails, setPaneState } from '../../js/master-detail.js';
import { attachWeeks, setWeekEvents, setWeekState } from '../../js/week.js';
import { attachCommands } from '../../js/command.js';
import { attachFootprints } from '../../js/footprint.js';

const $ = (/** @type {string} */ id) => /** @type {HTMLElement | null} */ (document.getElementById(id));
const MINUTE = 60_000;
const DAY = 86_400_000;
const REPLY_MS = 600;

/** Each control group is a set of buttons with `data-pg="<group>"`; a press sets aria-pressed in its group and calls the handler. */
/** @type {Record<string, (value: string, target: HTMLElement | null, button: HTMLElement) => void>} */
const HANDLERS = {};
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('button[data-pg]')) : null;
    const handler = HANDLERS[button?.dataset.pg ?? ''];
    if (!button || !handler) return;
    for (const other of button.parentElement?.querySelectorAll('button[data-pg]') ?? []) other.setAttribute('aria-pressed', String(other === button));
    handler(button.dataset.value ?? '', $(button.dataset.target ?? ''), button);
});
/** @param {string} name @param {(value: string, target: HTMLElement | null, button: HTMLElement) => void} handler */
const on = (name, handler) => {
    HANDLERS[name] = handler;
};
/** The pressed value of a group that drives `target`. @param {string} name @param {string} target @param {string} fallback */
const pressed = (name, target, fallback) =>
    /** @type {HTMLElement | null} */ (document.querySelector(`button[data-pg="${name}"][data-target="${target}"][aria-pressed="true"]`))?.dataset.value ?? fallback;
/** Mark a group's button pressed from the page. @param {string} name @param {string} target @param {string} value */
const press = (name, target, value) => {
    for (const b of document.querySelectorAll(`button[data-pg="${name}"][data-target="${target}"]`))
        b.setAttribute('aria-pressed', String(/** @type {HTMLElement} */ (b).dataset.value === value));
};
/** @param {string} id @param {string} text */
const say = (id, text) => {
    const line = $(id);
    if (line) line.textContent = text;
};

on('width', (value, target) => target?.setAttribute('data-pg-width', value));

/** What each section does with its State control, by the id of the component it drives. @type {Record<string, (value: string) => void>} */
const STATE = {};
on('state', (value, target) => STATE[target?.id ?? '']?.(value));

// ---------------------------------------------------------------- 1 · questions (homelab Inbox, research/app-homelab-inbox)
const QUESTIONS = [
    { id: 'prune', question: 'prune is waiting at “remove 14 old backups”', text: 'The host asks before it deletes 14 backups (3.2 GB) of vaultwarden on pve.', seconds: 74, allow: 'Deletes the 14 oldest backups (3.2 GB) and the prune goes on.' },
    { id: 'restart', question: 'kyu restart is waiting at “stop the message hub”', text: 'Restarting kyu (CT 109) drops its connections for about 10 seconds.', seconds: 52, allow: 'Stops kyu now and starts it again with the new image.' },
    { id: 'prune-immich', question: 'prune is waiting at “remove 9 old backups of immich”', text: 'The host asks before it deletes 9 backups (41.6 GB) of immich on pve.', seconds: 90, allow: 'Deletes the 9 oldest backups (41.6 GB) and the prune goes on.' },
];
const FROZEN = 1_000_000_000;

/** Ask the first `count` questions again, the old cards gone. @param {number} count */
function askAll(count = QUESTIONS.length) {
    const box = $('pg-questions');
    if (!box) return;
    for (const card of box.querySelectorAll(':scope > .kp-question')) card.remove();
    attachQuestions(box.parentElement ?? box);
    for (const q of QUESTIONS.slice(0, count)) {
        askQuestion(
            box,
            {
                id: q.id,
                question: q.question,
                text: q.text,
                deadline: FROZEN + q.seconds * 1000,
                asked: FROZEN - 46_000,
                defaultAnswer: 'stop',
                answers: [
                    { value: 'allow', label: 'Allow', consequence: q.allow, tone: 'primary' },
                    { value: 'stop', label: 'Leave it stopped', consequence: 'Keeps everything as it is; the job stops here.', outcome: 'Stopped. Nothing was deleted.' },
                ],
            },
            { now: () => FROZEN, frozen: true },
        );
    }
    say('pg-questions-log', '');
}
if ($('pg-questions')) {
    askAll();
    on('batch', (value, target) => target?.setAttribute('data-kp-questions-batch', value));
    on('ask', (value) => askAll(Number(value)));
    /** @type {string[]} */
    let heard = [];
    $('pg-questions')?.addEventListener('kp-question-answer', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        heard.push(`${d.id}: ${d.value}`);
        say('pg-questions-log', `The page heard ${heard.length}: ${heard.join(', ')}.`);
        setTimeout(() => d.respond(true), REPLY_MS);
        setTimeout(() => (heard = []), REPLY_MS);
    });
}

// ---------------------------------------------------------------- 2 · notices preview (homelab Inbox pushes)
const PUSHES = [
    { key: 'p1', severity: 'critical', title: 'Backup of vaultwarden failed', ago: 12, consequence: 'Pushed: a failed action is always pushed.', remedy: 'Run the backup again; the last good one is from 30/10/2026 03:00.', fix: 'Run backup' },
    { key: 'p2', severity: 'critical', title: 'HighMemory on pve: 91 % for 20 minutes', ago: 38, consequence: 'Pushed: an alert is always pushed.', remedy: 'immich uses 9.4 GB; restart it or give pve more memory.', fix: 'Restart immich' },
    { key: 'p3', severity: 'warning', title: 'Nightly check: immich is 4 versions behind', ago: 380, consequence: 'Pushed: by default urgent notices and warnings are pushed.' },
    { key: 'p5', severity: 'warning', title: 'Schedule almanac-sync missed its 02:00 run', ago: 460, consequence: 'Pushed: by default urgent notices and warnings are pushed.' },
    { key: 'p4', severity: 'info', title: 'Nightly backup of jellyfin finished', ago: 390, consequence: 'Held for the 09:00 digest: by default only urgent notices and warnings are pushed.' },
];
/** The notices as the homelab pushed them, for the state pressed now. @param {HTMLElement} centre */
function fillNotices(centre) {
    const state = pressed('state', 'pg-notices-slot', 'ready');
    const items = PUSHES.map((p) => ({
        key: p.key,
        severity: /** @type {'critical' | 'warning' | 'info'} */ (p.severity),
        title: p.title,
        since: Date.now() - p.ago * MINUTE,
        consequence: p.consequence,
        ...(p.remedy ? { remedy: p.remedy } : {}),
        ...(p.fix ? { fix: { label: p.fix } } : {}),
        read: p.severity === 'info',
    }));
    setNotices(centre, { state: /** @type {any} */ (state), items: state === 'ready' ? items : [], error: 'The host did not answer.' });
}
/** Notices are drawn by look at attach, so a new look is a new centre; a new state is the same centre, so it keeps its footprint. */
function paintNotices() {
    const slot = $('pg-notices-slot');
    if (!slot) return;
    const centre = document.createElement('div');
    centre.id = 'pg-notices';
    centre.setAttribute('data-kp-notices', '');
    centre.setAttribute('data-kp-notices-look', pressed('look', 'pg-notices-slot', 'preview'));
    centre.setAttribute('data-kp-inbox-href', '#notices-preview');
    centre.setAttribute('data-kp-count-in-title', 'off');
    centre.setAttribute('data-kp-toast-new', 'none');
    centre.setAttribute('data-kp-keys', 'off');
    slot.replaceChildren(centre);
    attachNotices(slot);
    // A centre made after the page's own attach holds its footprint in the empty and failed states as one in the markup does.
    attachFootprints(slot);
    fillNotices(centre);
}
if ($('pg-notices-slot')) {
    paintNotices();
    on('look', () => paintNotices());
    STATE['pg-notices-slot'] = () => {
        const centre = $('pg-notices');
        if (centre) fillNotices(centre);
    };
    $('pg-notices-slot')?.addEventListener('kp-notices-retry', () => {
        press('state', 'pg-notices-slot', 'ready');
        const centre = $('pg-notices');
        if (centre) fillNotices(centre);
    });
}

// ---------------------------------------------------------------- 3 and 4 · ways to sign in (homelab Settings: passkeys and TokenView)
const now = Date.now();
const SCOPES = { all: 'Scope: full access', operate: 'Scope: operate' };
/** @param {boolean} withSlot */
const signInRows = (withSlot) => [
    { key: 'pk-laptop', label: 'Work laptop', kind: /** @type {const} */ ('passkey'), createdAt: now - 41 * DAY, lastUsedAt: now - 2 * MINUTE, current: true },
    { key: 'pk-phone', label: 'Phone', kind: /** @type {const} */ ('passkey'), createdAt: now - 120 * DAY, lastUsedAt: now - 3 * DAY },
    { key: 'tk-legacy', label: 'legacy', kind: /** @type {const} */ ('token'), createdAt: now - 210 * DAY, lastUsedAt: now - 9 * DAY, ...(withSlot ? { extra: SCOPES.all } : {}) },
    { key: 'tk-wsl', label: 'wsl', kind: /** @type {const} */ ('token'), createdAt: now - 33 * DAY, lastUsedAt: now - 5 * 60 * MINUTE, ...(withSlot ? { extra: SCOPES.operate } : {}) },
];
/** The homelab's tokens as TokenView has them: a name and a scope, no last use. */
const tokenRows = () => [
    { key: 'tk-legacy', label: 'legacy', kind: /** @type {const} */ ('token'), createdAt: now - 210 * DAY, extra: SCOPES.all },
    { key: 'tk-wsl', label: 'wsl', kind: /** @type {const} */ ('token'), createdAt: now - 33 * DAY, extra: SCOPES.operate },
    { key: 'tk-kitchen', label: 'kitchen-display', kind: /** @type {const} */ ('token'), createdAt: now - 6 * DAY, extra: SCOPES.operate },
];
const remove = () => new Promise((resolve) => setTimeout(resolve, REPLY_MS));
const PK_WORDS = { emptyTitle: 'No way to sign in yet', emptyText: 'Register a passkey or make a token; it is listed here.', message: 'The host did not answer.' };

/** @param {HTMLElement} el @param {ReturnType<typeof signInRows> | ReturnType<typeof tokenRows>} rows */
function paintPasskeys(el, rows) {
    const state = pressed('state', el.id, 'ready');
    setPasskeys(el, { state: /** @type {any} */ (state), rows: state === 'ready' ? rows : [], remove, register: false, ...PK_WORDS });
}
const slotList = $('pg-pk-slot');
if (slotList) {
    const draw = () => paintPasskeys(slotList, signInRows(pressed('slot', 'pg-pk-slot', 'scope') === 'scope'));
    draw();
    on('slot', () => draw());
    STATE['pg-pk-slot'] = () => draw();
    slotList.addEventListener('kp-passkeys-retry', () => (press('state', 'pg-pk-slot', 'ready'), draw()));
}
const tokenList = $('pg-pk-tokens');
if (tokenList) {
    const draw = () => paintPasskeys(tokenList, tokenRows());
    draw();
    on('rename', (value) => tokenList.setAttribute('data-kp-rename', value));
    on('missing', (value) => tokenList.setAttribute('data-kp-missing-use', value));
    STATE['pg-pk-tokens'] = () => draw();
    tokenList.addEventListener('kp-passkeys-retry', () => (press('state', 'pg-pk-tokens', 'ready'), draw()));
}

// ---------------------------------------------------------------- 5 · a stack's secrets: detail and aside (homelab Secrets)
const layout = $('pg-md');
if (layout) {
    attachMasterDetails(layout.parentElement ?? document);
    const PLATES = {
        empty: { title: 'No secrets yet', text: 'vaultwarden keeps no secret in latch. Add one and it is listed here.' },
        error: { title: 'The secrets could not be read', text: 'latch did not answer. Try again in a moment.' },
    };
    STATE['pg-md'] = (value) => {
        if (value === 'loading') setPaneState(layout, 'loading', { words: 'Reading the secrets' });
        else if (value === 'empty' || value === 'error') setPaneState(layout, value, PLATES[value]);
        else setPaneState(layout, 'ready');
    };
    layout.addEventListener('kp-pane-retry', () => (press('state', 'pg-md', 'ready'), setPaneState(layout, 'ready')));
}

// ---------------------------------------------------------------- 6 · the week of runs (homelab Schedules)
const week = $('pg-week');
if (week) {
    const zone = 'Europe/Brussels';
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    week.setAttribute('data-kp-week-start', today);
    attachWeeks(week.parentElement ?? document);
    const base = Date.parse(`${today}T00:00:00+01:00`);
    /** @param {number} day @param {number} hour @param {number} minute */
    const at = (day, hour, minute = 0) => base + day * DAY + (hour * 60 + minute) * MINUTE;
    /** @type {import('../../js/week.js').WeekEvent[]} */
    const events = [];
    for (let d = 0; d < 7; d += 1) {
        events.push({ id: `bk-vw-${d}`, start: at(d, 2), label: 'vaultwarden', series: 1, detail: 'Backup of vaultwarden, nightly, keeps 14' });
        events.push({ id: `bk-im-${d}`, start: at(d, 2, 30), label: 'immich', series: 1, state: 'off', detail: 'Backup of immich, paused since 28/10/2026: the disk is full' });
        events.push({ id: `sync-${d}`, start: at(d, 6), label: 'almanac-sync', series: 3, state: 'off', detail: 'switched off on 30/10/2026' });
        events.push({ id: `host-${d}`, start: at(d, 3, 30), label: 'Host round', state: 'reference', detail: 'the host checks every stack' });
    }
    events.push({ id: 'prune', start: at(3, 4), label: 'Prune', series: 2, detail: 'keeps the newest 14 of each stack' });
    events.push({ id: 'updates', start: at(5, 21), label: 'Updates', series: 4, state: 'next', detail: 'pulls new images and asks before a restart' });
    const draw = () => {
        const state = pressed('state', 'pg-week', 'ready');
        if (state === 'ready') {
            setWeekState(week, 'ready');
            setWeekEvents(week, events);
        } else setWeekState(week, /** @type {any} */ (state), state === 'empty' ? 'No runs this week' : state === 'error' ? 'The schedules could not be read' : '');
    };
    draw();
    on('off', (value) => week.setAttribute('data-kp-week-off', value));
    STATE['pg-week'] = () => draw();
    week.addEventListener('kp-week-retry', () => (press('state', 'pg-week', 'ready'), draw()));
}

// ---------------------------------------------------------------- 7 · kyu's publish command with its token
const commandSlot = $('pg-command-slot');
const commandTemplate = /** @type {HTMLTemplateElement | null} */ ($('pg-command-template'));
if (commandSlot && commandTemplate) {
    const source = commandTemplate.innerHTML;
    /** The secret's options are read at attach: a new option is a new block. */
    const rebuild = () => {
        commandSlot.innerHTML = source;
        const block = /** @type {HTMLElement} */ (commandSlot.firstElementChild);
        block.setAttribute('data-kp-command-secret-mask', pressed('mask', 'pg-command-slot', 'dots'));
        block.setAttribute('data-kp-command-secret-reveal', pressed('reveal', 'pg-command-slot', 'on'));
        attachCommands(commandSlot);
        say('pg-command-log', '');
    };
    rebuild();
    on('mask', () => rebuild());
    on('reveal', () => rebuild());
    commandSlot.addEventListener('kp-copy', (event) => say('pg-command-log', `Copied: ${/** @type {CustomEvent} */ (event).detail.text}`));
    commandSlot.addEventListener('kp-copy-failed', (event) => say('pg-command-log', `The browser refused the clipboard; it would have copied: ${/** @type {CustomEvent} */ (event).detail.text}`));
}
