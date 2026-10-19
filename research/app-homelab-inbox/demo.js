// research/app-homelab-inbox: the page's own wiring. The components are the package's (js/auto.js attaches what the markup
// carries; what this file draws later it attaches itself); this file only feeds them sample data, presses their states and
// writes what they fire into a readout. All data is mock, in the shapes the homelab dashboard reads (admin/web/js).
import { attachActionColumns, attachRowKeys, removeRow, setRowBusy } from '../../js/actions.js';
import { ackGate, attachAckGates } from '../../js/ack-gate.js';
import { attachDisabledReasons } from '../../js/reason.js';
import { setCardState } from '../../js/card-state.js';
import { setFacetItems, setFacetValues } from '../../js/facets.js';
import { runFlashButton } from '../../js/flash.js';
import { setFocusSteps, setFocusStepsState } from '../../js/focus-steps.js';
import { setHeat } from '../../js/heat.js';
import { setKeys } from '../../js/keys.js';
import { setNotices } from '../../js/notices.js';
import { setProblems } from '../../js/problems.js';
import { askQuestion, attachQuestions, questionOf } from '../../js/question-card.js';
import { attachRowSelect } from '../../js/row-select.js';
import { attachSelectionBars, getSelection, setSelectionBusy, setSelectionResult, setSelectionRules } from '../../js/selection-bar.js';
import { getSegmentedTri, setSegmentedItems, setSegmentedTri, setSegmentedValues } from '../../js/segmented.js';
import { registerShortcuts } from '../../js/shortcuts.js';
import { attachSnoozes, setSnoozeBusy, setSnoozedUntil } from '../../js/snooze.js';
import { setTime, timeMinutes, timeValue } from '../../js/timefield.js';
import { undoToast } from '../../js/undo-toast.js';
import { toast } from '../../js/overlays.js';
import { attachVersionDeltas } from '../../js/version-delta.js';
import { setWeekdays, weekdaysOf } from '../../js/weekdays.js';

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

// ── small helpers ────────────────────────────────────────────────────────────────────────────────────────────────
/** @param {string} tag @param {Record<string, string> | null} [attrs] @param {...(Node | string | null | undefined)} kids */
const h = (tag, attrs = null, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs ?? {})) el.setAttribute(k, v);
    for (const kid of kids) if (kid !== null && kid !== undefined) el.append(kid);
    return el;
};
/** @param {string} label @param {Record<string, string>} [attrs] */
const button = (label, attrs = {}) => h('button', { type: 'button', class: 'kp-button kp-button--sm', ...attrs }, label);
/** @param {string} id @param {string} text */
const say = (id, text) => {
    const out = document.getElementById(id);
    if (out) out.textContent = text;
};
const wait = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));
/** @param {string} id */
const $ = (id) => /** @type {HTMLElement} */ (document.getElementById(id));
/** Press a state button: exactly one of the group is pressed. @param {string} attribute @param {(value: string) => void} apply */
function stateButtons(attribute, apply) {
    const buttons = /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll(`[${attribute}]`)]);
    for (const b of buttons) {
        b.addEventListener('click', () => {
            for (const other of buttons) other.setAttribute('aria-pressed', String(other === b));
            apply(b.getAttribute(attribute) ?? '');
        });
    }
}
/** @param {string} attribute @param {string} value */
const press = (attribute, value) => {
    for (const b of document.querySelectorAll(`[${attribute}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attribute) === value));
};
/** @param {HTMLElement} el @param {string} name @param {(event: CustomEvent) => void} fn */
const on = (el, name, fn) => el.addEventListener(name, (event) => fn(/** @type {CustomEvent} */ (event)));

const ZONE = 'Europe/Brussels';
/** dd/mm/yyyy HH:mm, 24 hours, Brussels. @param {number} ms */
const stamp = (ms) =>
    new Intl.DateTimeFormat('en-GB', { timeZone: ZONE, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
        .format(ms)
        .replace(',', '');
/** The demo clock: Monday 19/10/2026 09:41 in Brussels. */
const NOW = Date.parse('2026-10-19T09:41:00+02:00');
const NOW_ISO = '2026-10-19T09:41:00+02:00';
const plural = (/** @type {number} */ n, /** @type {string} */ one, /** @type {string} */ many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

await ready;

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 1 · the Inbox list
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if ($('inbox-component')) {
    const card = $('hi-inbox-card');
    const list = $('hi-inbox');
    const chips = $('hi-kinds-chips');
    const facets = $('hi-kinds-facets');

    const KINDS = [
        { value: 'ask', label: 'Questions' },
        { value: 'fail', label: 'Failures' },
        { value: 'update', label: 'Updates' },
        { value: 'setup', label: 'Setup' },
        { value: 'check', label: 'Checks' },
    ];
    const WORD = { ask: 'Question', fail: 'Failure', update: 'Update', setup: 'Setup', check: 'Check' };
    const BADGE = { ask: 'kp-badge kp-badge--warning', fail: 'kp-badge kp-badge--destructive', update: 'kp-badge kp-badge--info', setup: 'kp-badge', check: 'kp-badge' };
    const BAR = { bad: 'failed', warn: 'warn', new: 'new' };
    const GROUPS = ['Urgent', 'Updates', 'Setup', 'Checks', 'Snoozed'];

    /** @typedef {{ key: string, kind: 'ask' | 'fail' | 'update' | 'setup' | 'check', sev: 'bad' | 'warn' | 'new', group: string, title: string, text: string, meta: string[], act: string, noSeen?: boolean, fixable?: boolean, problem?: object, apps?: { app: string, from: string, to: string }[], until?: number }} Item */
    /** @returns {Item[]} */
    const items0 = () => [
        {
            key: 'ask:41',
            kind: 'ask',
            sev: 'warn',
            group: 'Urgent',
            title: 'prune is waiting at “remove 14 old backups”',
            text: 'The host asks before it deletes 14 backups (3.2 GB) of vaultwarden on pve.',
            meta: ['Host question', 'asked 19/10/2026 09:38', '2 min 10 s left to answer'],
            act: 'Answer',
            noSeen: true,
        },
        {
            key: 'fail:backup-vaultwarden',
            kind: 'fail',
            sev: 'bad',
            group: 'Urgent',
            title: 'Backups of vaultwarden failed twice',
            text: 'The last two runs stopped at the upload: the backup target refused the connection.',
            meta: ['Backups', 'vaultwarden on CT 111', '12 min ago'],
            act: 'Retry backup',
            fixable: true,
            problem: {
                key: 'backup-vaultwarden',
                what: 'The upload to the backup target was refused twice',
                why: 'The target at nas.lan:9000 answered 403 to both runs; its access key expired on 18/10/2026.',
                remedy: 'Renew the key on the NAS, store it in the vault, then run the backup again.',
                command: 'homelab backup run vaultwarden --retry',
                severity: 'critical',
            },
        },
        {
            key: 'fail:cert-jellyfin',
            kind: 'fail',
            sev: 'warn',
            group: 'Urgent',
            title: 'The certificate for jellyfin.kp-soft.dev expires in 6 days',
            text: 'Traefik should have renewed it on 16/10/2026 and did not.',
            meta: ['Traefik', 'jellyfin', '3 h ago'],
            act: 'Renew now',
            fixable: true,
            problem: {
                key: 'cert-jellyfin',
                what: 'The renewal of jellyfin.kp-soft.dev did not run',
                why: 'The DNS challenge timed out three times in a row.',
                remedy: 'Run the renewal by hand; if it fails again look at the Cloudflare token.',
                command: 'homelab traefik renew jellyfin.kp-soft.dev',
                severity: 'warning',
            },
        },
        {
            key: 'update:apps',
            kind: 'update',
            sev: 'new',
            group: 'Updates',
            title: '3 apps have a newer version',
            text: 'Each is backed up first; Roll back puts the old version back.',
            meta: ['From the nightly fleet check', 'measured 19/10/2026 03:12'],
            act: 'Update',
            noSeen: false,
            apps: [
                { app: 'jellyfin', from: '10.11.11', to: '12.1' },
                { app: 'immich', from: '1.118.2', to: '1.122.0' },
                { app: 'paperless', from: '2.12.1', to: '2.12.3' },
            ],
        },
        {
            key: 'setup:noenv',
            kind: 'setup',
            sev: 'warn',
            group: 'Setup',
            title: '2 stacks have no sealed env on the host',
            text: 'almanac (CT 112) and syncthing (CT 108): the containers run, but the host’s vault holds no copy of their secrets, so a lost container could not get them back.',
            meta: ['Setup', 'almanac, syncthing'],
            act: 'Push env to vault',
        },
        {
            key: 'check:restore-vaultwarden',
            kind: 'check',
            sev: 'new',
            group: 'Checks',
            title: 'Check: restore one file from last night’s vaultwarden backup into a scratch folder and open it',
            text: 'Only a person can confirm this one. “Not now” asks again in 7 days.',
            meta: ['Check', 'vaultwarden', 'never answered'],
            act: 'Answer',
        },
        {
            key: 'fail:paperless-ocr',
            kind: 'fail',
            sev: 'warn',
            group: 'Urgent',
            title: 'paperless OCR queue has been stuck for 3 hours',
            text: '14 documents wait; the worker stopped answering at 06:40.',
            meta: ['paperless on CT 114'],
            act: 'Restart worker',
            fixable: true,
            until: Date.parse('2026-10-20T09:00:00+02:00'),
        },
    ];

    /** @type {Item[]} */
    let items = items0();
    /** @type {Set<string> | null} null is every kind */
    let kinds = null;
    let data = 'ready';
    let seenFails = false;
    let loadTimer = 0;

    const visible = () => items.filter((i) => !kinds || kinds.has(i.kind));
    const countsByKind = () => Object.fromEntries(KINDS.map((k) => [k.value, items.filter((i) => i.kind === k.value).length]));
    const waiting = () => items.filter((i) => !i.until);

    const paintHead = () => {
        const snoozed = items.length - waiting().length;
        say('hi-inbox-count', `${plural(waiting().length, 'item')} waiting${snoozed ? ` · ${snoozed} snoozed` : ''}`);
        const counts = countsByKind();
        setSegmentedItems(
            chips,
            KINDS.map((k) => ({ value: k.value, label: k.label, count: counts[k.value] })),
        );
        setSegmentedValues(chips, kinds ?? []);
        setFacetItems(
            facets,
            KINDS.map((k) => ({ value: k.value, label: k.label, count: counts[k.value], checked: !kinds || kinds.has(k.value) })),
        );
        if (!kinds) setFacetValues(facets, null);
    };

    /** @param {Item} item */
    const rowEl = (item) => {
        const snoozed = Boolean(item.until);
        const lead = h('span', { class: 'kp-action-list__lead' }, h('span', { class: BADGE[item.kind] }, WORD[item.kind]));
        const metaParts = snoozed ? [...item.meta, `Snoozed until ${stamp(/** @type {number} */ (item.until))}`] : item.meta;
        const meta = h('span', { class: 'kp-action-list__meta' }, ...metaParts.map((m) => h('span', null, m)));
        const main = h('div', { class: 'kp-action-list__main' }, h('strong', { class: 'kp-action-list__title' }, item.title), h('span', { class: 'kp-action-list__text' }, item.text), meta);
        if (item.apps) {
            const apps = h('div', { class: 'hi-apps' });
            for (const a of item.apps)
                apps.append(
                    h(
                        'span',
                        { class: 'hi-app' },
                        h('b', null, a.app),
                        h('span', { class: 'kp-badge kp-badge--version', 'data-kp-version-from': a.from, 'data-kp-version-to': a.to, 'data-kp-version-app': a.app }),
                    ),
                );
            main.append(apps);
        }
        if (item.problem) {
            const box = h('div', { class: 'kp-problems', 'data-kp-problems': '' });
            const more = h(
                'details',
                { class: 'kp-accordion__item kp-accordion__item--bare kp-action-list__more' },
                h('summary', null, 'What went wrong'),
                box,
            );
            main.append(more);
            // Drawn when the fold opens, so a closed row holds no hidden text.
            more.addEventListener('toggle', () => {
                if (/** @type {HTMLDetailsElement} */ (more).open && !box.childElementCount) setProblems(box, [/** @type {any} */ (item.problem)]);
            });
        }
        const snoozeCell = snoozed
            ? button('End snooze', { 'data-kp-action': 'snooze', 'data-hi-end': '' })
            : h('div', { class: 'kp-snooze', 'data-kp-snooze': '', 'data-kp-look': 'menu', 'data-kp-action': 'snooze', 'data-kp-now': NOW_ISO, 'data-kp-snooze-choices': '1h 4h tonight tomorrow monday pick', 'data-kp-snooze-morning': '09:00' });
        const actions = h(
            'div',
            { class: 'kp-row-actions' },
            snoozeCell,
            button(item.act, { 'data-kp-action': 'act', 'data-hi-act': '', ...(item.sev === 'bad' ? { class: 'kp-button kp-button--sm kp-button--primary' } : {}) }),
            item.noSeen ? null : button('Mark seen', { 'data-kp-action': 'seen', 'data-hi-seen-btn': '' }),
        );
        return h('li', { 'data-key': item.key, 'data-kp-state': BAR[item.sev], 'data-hi-kind': item.kind }, lead, main, actions);
    };

    const groupEl = (/** @type {string} */ name) => h('li', { class: 'kp-action-list__group', 'data-hi-group': name }, h('h4', null, name));

    const drawRows = () => {
        const shown = visible();
        const nodes = [];
        for (const g of GROUPS) {
            const here = shown.filter((i) => (i.until ? 'Snoozed' : i.group) === g);
            if (!here.length) continue;
            nodes.push(groupEl(g), ...here.map(rowEl));
        }
        list.replaceChildren(...nodes);
        attachVersionDeltas(list);
        attachSnoozes(list, { now: () => NOW });
        attachActionColumns(card);
        attachRowKeys(card);
    };

    const showEmpty = (/** @type {boolean} */ filtered) => {
        if (filtered) {
            const clear = button('Show every kind', { 'data-hi-clear-kinds': '' });
            clear.addEventListener('click', () => {
                kinds = null;
                draw();
            });
            setCardState(card, 'empty', { title: 'Nothing of these kinds', text: 'Every item that matches the chips is done or snoozed.', action: clear });
        } else {
            setCardState(card, 'empty', { title: 'Nothing needs you', text: 'Every question is answered and every failure fixed. New items appear here by themselves.' });
        }
    };

    function draw() {
        window.clearTimeout(loadTimer);
        paintHead();
        drawRows();
        if (data === 'loading') setCardState(card, 'loading', { words: 'Reading the Inbox…' });
        else if (data === 'error') setCardState(card, 'error', { title: 'The Inbox could not be read', text: 'The host did not answer within 20 seconds.' });
        else if (data === 'empty') showEmpty(false);
        else if (!items.length) showEmpty(false);
        else if (!visible().length) showEmpty(true);
        else setCardState(card, 'ready');
    }
    draw();

    const reload = () => {
        data = 'loading';
        press('data-hi-data', 'loading');
        draw();
        loadTimer = window.setTimeout(() => {
            data = 'ready';
            press('data-hi-data', 'ready');
            draw();
        }, 1400);
    };
    on(card, 'kp-card-retry', reload);

    // the filters: chips and facets say the same thing
    on(chips, 'kp-segmented-change', (e) => {
        const v = /** @type {string[]} */ (e.detail.values);
        kinds = v.length ? new Set(v) : null;
        draw();
    });
    on(facets, 'kp-facet-change', (e) => {
        const v = /** @type {string[]} */ (e.detail.values);
        kinds = v.length === KINDS.length ? null : new Set(v);
        draw();
    });
    const filterLook = (/** @type {string} */ look) => {
        chips.hidden = look !== 'chips';
        facets.hidden = look !== 'facets';
        press('data-hi-filter', look);
    };
    filterLook('chips');
    stateButtons('data-hi-filter', filterLook);
    document.addEventListener('review:choice', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        if (d?.id === 'inbox-kind-filter') filterLook(d.value === 'facets' ? 'facets' : 'chips');
    });

    stateButtons('data-hi-data', (v) => {
        data = v;
        draw();
    });
    stateButtons('data-hi-seen', (v) => {
        seenFails = v === 'fails';
    });
    document.querySelector('[data-hi-reset="inbox"]')?.addEventListener('click', () => {
        items = items0();
        kinds = null;
        data = 'ready';
        seenFails = false;
        press('data-hi-data', 'ready');
        press('data-hi-seen', 'works');
        draw();
        say('hi-inbox-log', 'All seven items are back.');
    });

    // the rows
    /** @param {HTMLElement} row */
    const itemOf = (row) => items.find((i) => i.key === row.dataset.key);
    /** Take a finished row out, with its group heading when it was the last of the group. @param {HTMLElement} row */
    const takeOut = async (row) => {
        const before = row.previousElementSibling;
        const after = row.nextElementSibling;
        const alone = before?.classList.contains('kp-action-list__group') && (!after || after.classList.contains('kp-action-list__group'));
        await removeRow(row);
        items = items.filter((i) => i.key !== row.dataset.key);
        if (alone && before) before.remove();
        paintHead();
        if (!items.length) showEmpty(false);
        else if (!visible().length) showEmpty(true);
    };

    /** @param {HTMLElement} row @param {HTMLElement} btn */
    const markSeen = async (row, btn) => {
        if (row.getAttribute('aria-busy') === 'true') return;
        setRowBusy(row, true, btn);
        await wait(1000);
        if (seenFails) {
            seenFails = false;
            press('data-hi-seen', 'works');
            setRowBusy(row, false);
            say('hi-inbox-log', 'Could not mark it seen: the host did not answer. The row is back as it was.');
            return;
        }
        await takeOut(row);
        say('hi-inbox-log', `POST /api/inbox/seen {"key":"${row.dataset.key}"}  →  marked seen.`);
    };

    list.addEventListener('click', async (event) => {
        const t = event.target instanceof Element ? event.target : null;
        const row = /** @type {HTMLElement | null} */ (t?.closest('#hi-inbox > li:not(.kp-action-list__group)'));
        if (!row || !t) return;
        const item = itemOf(row);
        const seen = /** @type {HTMLElement | null} */ (t.closest('[data-hi-seen-btn]'));
        const act = /** @type {HTMLElement | null} */ (t.closest('[data-hi-act]'));
        const end = t.closest('[data-hi-end]');
        if (seen) return void (await markSeen(row, seen));
        if (end && item) {
            item.until = undefined;
            say('hi-inbox-log', `DELETE /api/inbox/snooze {"key":"${item.key}"}  →  back in the list.`);
            draw();
            return;
        }
        if (act && item) {
            if (row.getAttribute('aria-busy') === 'true') return;
            if (item.fixable) {
                setRowBusy(row, true, act);
                await wait(1200);
                await takeOut(row);
                say('hi-inbox-log', `POST /api/fix {"key":"${item.key}"}  →  fixed; the row folds away.`);
            } else if (item.kind === 'ask') say('hi-inbox-log', 'Opens the question card with its clock (section 3).');
            else if (item.kind === 'update') say('hi-inbox-log', 'Opens the Update flow for the 3 apps: a tick per major version, a backup first.');
            else if (item.kind === 'setup') say('hi-inbox-log', 'Opens the push-env dialog for almanac and syncthing.');
            else say('hi-inbox-log', 'Opens the check (section 4), one question on the screen.');
        }
    });
    list.addEventListener('kp-row-open', (event) => {
        const row = /** @type {HTMLElement} */ (/** @type {CustomEvent} */ (event).detail.row);
        say('hi-inbox-log', `Opened: ${row.querySelector('.kp-action-list__title')?.textContent}`);
    });
    // a snooze choice: the row moves to Snoozed (needs a server field for one row; mock)
    list.addEventListener('kp-snooze', async (event) => {
        const e = /** @type {CustomEvent} */ (event);
        const picker = /** @type {HTMLElement} */ (e.target);
        const row = /** @type {HTMLElement | null} */ (picker.closest('#hi-inbox > li'));
        const item = row && itemOf(row);
        if (!row || !item) return;
        setSnoozeBusy(picker, true);
        await wait(700);
        item.until = Date.parse(e.detail.until);
        say('hi-inbox-log', `PUT /api/inbox/snooze {"key":"${item.key}","until":"${e.detail.until}"}  →  snoozed until ${stamp(item.until)}.`);
        draw();
    });

    // the keys: j / k walk, Enter opens (the list); s snoozes and d marks seen the row under the focus
    setKeys(
        $('hi-inbox-keys'),
        /** @type {any} */ ([
            [['j', 'k'], 'Next and previous row'],
            ['Enter', 'Open'],
            ['s', 'Remind me later'],
            ['d', 'Mark seen'],
        ]),
    );
    const focused = () => /** @type {HTMLElement | null} */ (document.activeElement?.closest('#hi-inbox > li:not(.kp-action-list__group)') ?? null);
    registerShortcuts($('hi-inbox-card'), [
        {
            keys: 's',
            what: 'Remind me later',
            group: 'Inbox',
            run: () => {
                const row = focused();
                const trigger = /** @type {HTMLElement | null} */ (row?.querySelector('.kp-snooze button, [data-hi-end]'));
                if (!trigger) return false;
                trigger.click();
                return undefined;
            },
        },
        {
            keys: 'd',
            what: 'Mark seen',
            group: 'Inbox',
            run: () => {
                const row = focused();
                const btn = /** @type {HTMLElement | null} */ (row?.querySelector('[data-hi-seen-btn]'));
                if (!row || !btn) return false;
                void markSeen(row, btn);
                return undefined;
            },
        },
    ]);
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 2 · bulk triage
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if ($('bulk-component')) {
    const bar = $('hi-bulk-bar');
    const list = $('hi-bulk');
    const bed = $('hi-bulk-bed');
    const BAD = { fail: 'kp-badge kp-badge--destructive', warn: 'kp-badge kp-badge--warning', info: 'kp-badge' };
    const ROWS = () => [
        { key: 'n1', kind: 'fail', word: 'Failure', state: 'failed', title: 'Backup of vaultwarden failed', text: 'The target refused the connection (403).', meta: ['vaultwarden', '12 min ago'], fixable: true },
        { key: 'n2', kind: 'fail', word: 'Failure', state: 'failed', title: 'Backup of paperless failed', text: 'The target refused the connection (403).', meta: ['paperless', '12 min ago'], fixable: true },
        { key: 'n3', kind: 'warn', word: 'Missed', state: 'warn', title: 'Schedule almanac-sync missed its 02:00 run on 19/10/2026', text: 'The host was restarting; the run was skipped, not queued.', meta: ['almanac on CT 112', '7 h ago'], fixable: true },
        { key: 'n4', kind: 'info', word: 'Done', state: 'new', title: 'Nightly backup of jellyfin finished', text: '41.2 GB in 12 min 8 s.', meta: ['jellyfin', '19/10/2026 03:12'] },
        { key: 'n5', kind: 'info', word: 'Done', state: 'new', title: 'Certificate for grafana.kp-soft.dev renewed', text: 'Valid until 17/01/2027.', meta: ['traefik', '19/10/2026 02:40'] },
        { key: 'n6', kind: 'warn', word: 'Host', state: 'warn', title: 'prometheus was restarted by the host (out of memory)', text: 'It used 2.1 GB of its 2 GB limit.', meta: ['prometheus on CT 113', '19/10/2026 01:55'] },
        { key: 'n7', kind: 'info', word: 'Done', state: 'new', title: 'grafana updated from 11.2.0 to 11.3.1', text: 'Backed up first; healthy after 14 s.', meta: ['grafana', '18/10/2026 22:30'] },
        { key: 'n8', kind: 'info', word: 'Host', state: 'new', title: 'syncthing finished scanning 18,402 files', text: 'No conflicts.', meta: ['syncthing on CT 108', '18/10/2026 21:12'] },
        { key: 'n9', kind: 'info', word: 'Host', state: 'new', title: 'loki compacted 6 days of logs', text: 'Freed 3.4 GB.', meta: ['loki', '18/10/2026 20:05'] },
        { key: 'n10', kind: 'info', word: 'Host', state: 'new', title: 'Disk pve/local-lvm is at 71 %', text: 'Under the 80 % line that raises a warning.', meta: ['pve', '18/10/2026 18:00'] },
    ];
    /** @type {ReturnType<typeof ROWS>} */
    let rows = ROWS();
    let refuse = false;
    const FIXABLE = () => new Set(rows.filter((r) => r.fixable).map((r) => r.key));

    const rowEl = (/** @type {ReturnType<typeof ROWS>[number]} */ r) =>
        h(
            'li',
            { 'data-kp-row-key': r.key, 'data-kp-state': r.state, 'data-kp-row-label': r.title },
            h(
                'span',
                { class: 'kp-action-list__lead' },
                h('input', { class: 'kp-field__check', type: 'checkbox', 'data-kp-select-row': '', value: r.key, 'aria-label': `Select ${r.title}` }),
            ),
            h(
                'div',
                { class: 'kp-action-list__main' },
                h('strong', { class: 'kp-action-list__title' }, r.title),
                h('span', { class: 'kp-action-list__text' }, r.text),
                h('span', { class: 'kp-action-list__meta' }, h('span', { class: BAD[r.kind] }, r.word), ...r.meta.map((m) => h('span', null, m))),
            ),
        );
    const count = () => say('hi-bulk-count', `${rows.filter((r) => !r.gone).length} shown · 37 match`);
    const draw = () => {
        list.replaceChildren(...rows.map(rowEl));
        attachRowSelect(list.parentElement ?? document);
        attachSelectionBars(bar.parentElement ?? document);
        count();
    };
    draw();
    setSelectionRules(bar, {
        fix: (selected) => {
            const ok = FIXABLE();
            const n = selected.filter((i) => ok.has(i.key)).length;
            return n === selected.length ? '' : `${n} of ${selected.length} can be fixed`;
        },
    });
    setKeys(
        $('hi-bulk-keys'),
        /** @type {any} */ ([
            [['j', 'k'], 'Move the ring'],
            ['x', 'Tick the row'],
            [['Shift', 'x'], 'Tick a run'],
            [['Ctrl', 'A'], 'Tick all shown'],
            ['Esc', 'Untick all'],
        ]),
    );

    /** @param {string[]} keys */
    const tick = (keys) => {
        for (const box of /** @type {NodeListOf<HTMLInputElement>} */ (list.querySelectorAll('[data-kp-select-row]'))) {
            const want = keys.includes(box.value);
            if (box.checked !== want) {
                box.checked = want;
                box.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    };
    for (const b of document.querySelectorAll('[data-hi-pick]'))
        b.addEventListener('click', () => {
            const kind = b.getAttribute('data-hi-pick');
            const live = rows.filter((r) => !r.gone).map((r) => r.key);
            tick(kind === 'all' ? live : kind === 'failures' ? live.filter((k) => FIXABLE().has(k)) : []);
        });
    stateButtons('data-hi-fix', (v) => {
        refuse = v === 'refuses';
    });
    document.querySelector('[data-hi-reset="bulk"]')?.addEventListener('click', () => {
        rows = ROWS();
        refuse = false;
        press('data-hi-fix', 'works');
        draw();
        say('hi-bulk-log', 'All ten notices are back.');
    });

    /** Hide rows now, commit after the clock; Undo shows them again. @param {string[]} keys @param {string} text @param {string} request @param {number} ms */
    const deferred = (keys, text, request, ms) => {
        const els = keys.map((k) => /** @type {HTMLElement | null} */ (list.querySelector(`[data-kp-row-key="${k}"]`))).filter(Boolean);
        for (const el of /** @type {HTMLElement[]} */ (els)) {
            const box = /** @type {HTMLInputElement | null} */ (el.querySelector('[data-kp-select-row]'));
            if (box?.checked) {
                box.checked = false;
                box.dispatchEvent(new Event('change', { bubbles: true }));
            }
            el.hidden = true;
        }
        undoToast(text, {
            region: bed,
            ms,
            max: 3,
            commit: async () => {
                rows = rows.filter((r) => !keys.includes(r.key));
                for (const el of /** @type {HTMLElement[]} */ (els)) el.remove();
                count();
                say('hi-bulk-log', `${request}  →  sent after the clock ended.`);
            },
            undo: () => {
                for (const el of /** @type {HTMLElement[]} */ (els)) el.hidden = false;
                say('hi-bulk-log', 'Undone before the clock ended: nothing was sent.');
            },
        });
    };

    bar.addEventListener('kp-selection-action', (event) => {
        const { action, keys, undoMs } = /** @type {CustomEvent} */ (event).detail;
        if (action === 'seen') {
            deferred(keys, `${plural(keys.length, 'notice')} marked seen`, `POST /api/inbox/seen {"keys":[${keys.length} keys]}`, undoMs);
            return;
        }
        if (action === 'fix') {
            setSelectionBusy(bar, `Fixing ${keys.length}…`);
            window.setTimeout(() => {
                const refused = refuse ? [{ key: keys[0], reason: 'the backup target is full' }] : [];
                const done = keys.filter((k) => !refused.some((r) => r.key === k));
                setSelectionBusy(bar, null);
                setSelectionResult(bar, { done: done.length, refused });
                for (const k of done) {
                    const li = /** @type {HTMLElement | null} */ (list.querySelector(`[data-kp-row-key="${k}"]`));
                    if (li) void removeRow(li);
                }
                rows = rows.filter((r) => !done.includes(r.key));
                count();
                say('hi-bulk-log', `POST /api/fix {"keys":[${keys.length} keys]}  →  ${done.length} done, ${refused.length} refused.`);
            }, 1600);
        }
    });
    const snoozeBar = $('hi-bulk-snooze');
    snoozeBar.addEventListener('kp-snooze', (event) => {
        const e = /** @type {CustomEvent} */ (event);
        const keys = getSelection(bar).keys;
        if (!keys.length) return;
        deferred(keys, `${plural(keys.length, 'notice')} snoozed until ${stamp(Date.parse(e.detail.until))}`, `PUT /api/inbox/snooze {"keys":[${keys.length} keys],"until":"${e.detail.until}"}`, 6000);
    });
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 3 · a question from the host
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if ($('question-component')) {
    const stage = $('hi-questions');
    const FROZEN = 1_000_000_000;
    const still = () => FROZEN;
    let look = 'ring';
    let clock = 'still';
    let refuses = false;
    let counter = 0;

    const POOL = [
        {
            id: 'prune',
            question: 'prune is waiting at “remove 14 old backups”',
            text: 'The host asks before it deletes 14 backups (3.2 GB) of vaultwarden on pve.',
            seconds: 74,
            mutating: 'I know this deletes 14 backups (3.2 GB)',
            allow: { consequence: 'Deletes the 14 oldest backups (3.2 GB) and the prune goes on.', outcome: 'Allowed. The prune goes on and deletes 14 backups.' },
            stop: { consequence: 'Keeps every backup; the prune stops here and runs again at 03:00 tonight.', outcome: 'Stopped. Nothing was deleted.' },
        },
        {
            id: 'restart',
            question: 'kyu restart is waiting at “stop the message hub”',
            text: 'Restarting kyu (CT 109) drops its connections for about 10 seconds.',
            seconds: 52,
            mutating: '',
            allow: { consequence: 'Stops kyu now and starts it again with the new image.', outcome: 'Allowed. kyu restarts now.' },
            stop: { consequence: 'Leaves kyu running on the old image; the update waits for tomorrow.', outcome: 'Stopped. kyu keeps running.' },
        },
        {
            id: 'prune-immich',
            question: 'prune is waiting at “remove 9 old backups of immich”',
            text: 'The host asks before it deletes 9 backups (41.6 GB) of immich on pve.',
            seconds: 90,
            mutating: 'I know this deletes 9 backups (41.6 GB)',
            allow: { consequence: 'Deletes the 9 oldest backups (41.6 GB) and the prune goes on.', outcome: 'Allowed. The prune goes on and deletes 9 backups.' },
            stop: { consequence: 'Keeps every backup; the prune stops here and runs again at 03:00 tonight.', outcome: 'Stopped. Nothing was deleted.' },
        },
    ];
    /** @type {{ spec: (typeof POOL)[number], live?: number }[]} */
    let asked = [];

    const updateCount = () => {
        const open = [...stage.querySelectorAll('.kp-question')].filter((c) => ['waiting', 'urgent', 'refused', 'sending'].includes(c.getAttribute('data-kp-state') ?? ''));
        say('hi-q-count', `${plural(open.length, 'question')} waiting`);
        const all = $('hi-q-all');
        const none = open.length === 0;
        all.toggleAttribute('disabled', none);
        if (none) all.setAttribute('data-kp-disabled-reason', 'No question is waiting');
        else all.removeAttribute('data-kp-disabled-reason');
    };

    /** @param {(typeof asked)[number]} entry */
    const mount = (entry) => {
        const { spec } = entry;
        const wrap = h('div', { class: 'hi-qitem' });
        const box = h('div', { 'data-kp-questions': '', 'data-kp-title': 'off' });
        wrap.append(box);
        stage.append(wrap);
        const live = clock === 'running' || entry.live !== undefined;
        const seconds = entry.live ?? spec.seconds;
        const base = live ? Date.now() : FROZEN;
        askQuestion(
            box,
            {
                id: spec.id,
                question: spec.question,
                text: spec.text,
                deadline: base + seconds * 1000,
                asked: base - 46_000,
                countdown: /** @type {'ring' | 'bar' | 'text'} */ (look),
                defaultAnswer: 'stop',
                answers: [
                    { value: 'allow', label: 'Allow', consequence: spec.allow.consequence, outcome: spec.allow.outcome, tone: 'primary' },
                    { value: 'stop', label: 'Leave it stopped', consequence: spec.stop.consequence, outcome: spec.stop.outcome },
                ],
            },
            live ? {} : { now: still, frozen: true },
        );
        if (spec.mutating) {
            const gate = h(
                'div',
                {
                    class: 'kp-alert kp-alert--warning hi-qgate',
                    'data-kp-ack': '',
                    'data-kp-ack-for': `#kp-question-${spec.id} .kp-question__button[data-kp-value="allow"]`,
                    'data-kp-ack-key': spec.id,
                    'data-kp-ack-label': spec.mutating,
                },
                h('div', { class: 'kp-alert__body' }, h('strong', null, 'Allow changes data. '), 'It cannot be undone from here; the backups are gone once the prune goes on.'),
            );
            wrap.append(gate);
            attachAckGates(wrap);
        }
        attachQuestions(box);
        updateCount();
    };

    const rebuild = () => {
        stage.replaceChildren();
        for (const entry of asked) mount(entry);
        updateCount();
    };
    const reset = () => {
        counter = 0;
        asked = POOL.slice(0, 2).map((spec) => ({ spec }));
        rebuild();
        say('hi-q-log', 'The two questions are back.');
    };
    reset();
    new MutationObserver(updateCount).observe(stage, { subtree: true, attributes: true, attributeFilter: ['data-kp-state'], childList: true });
    attachDisabledReasons($('hi-q-all').parentElement ?? document);

    stage.addEventListener('kp-question-answer', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        say('hi-q-log', `kp-question-answer ${JSON.stringify({ id: d.id, value: d.value })}  →  the host ${refuses ? 'refuses it' : 'accepts it'}.`);
        window.setTimeout(() => (refuses ? d.respond(false, 'the host did not answer') : d.respond(true)), 900);
    });
    stage.addEventListener('kp-question-expire', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        say('hi-q-log', `kp-question-expire ${JSON.stringify(d)}  →  nobody answered, the safe answer was applied.`);
    });
    stage.addEventListener('kp-question-dismiss', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        asked = asked.filter((a) => a.spec.id !== d.id);
        const wrap = stage.querySelector(`#kp-question-${d.id}`)?.closest('.hi-qitem');
        window.setTimeout(() => wrap?.remove(), 400);
    });

    stateButtons('data-hi-clock-look', (v) => {
        look = v;
        rebuild();
    });
    stateButtons('data-hi-clock', (v) => {
        clock = v;
        rebuild();
    });
    stateButtons('data-hi-host', (v) => {
        refuses = v === 'refuses';
    });
    document.addEventListener('review:choice', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        if (d?.id !== 'question-clock') return;
        look = d.value;
        press('data-hi-clock-look', look);
        rebuild();
    });
    for (const b of document.querySelectorAll('[data-hi-ask]'))
        b.addEventListener('click', () => {
            const kind = b.getAttribute('data-hi-ask');
            if (kind === 'reset') return reset();
            counter += 1;
            const base = POOL[(counter + 1) % POOL.length];
            const spec = { ...base, id: `${base.id}-${counter}` };
            const entry = kind === 'short' ? { spec, live: 12 } : { spec };
            asked.push(entry);
            mount(entry);
            say('hi-q-log', kind === 'short' ? 'A question that waits 12 seconds, counting for real: watch it become urgent and end.' : 'Another question asked.');
        });
    $('hi-q-all').addEventListener('click', () => {
        let n = 0;
        for (const c of stage.querySelectorAll('.kp-question')) {
            if (!['waiting', 'urgent', 'refused'].includes(c.getAttribute('data-kp-state') ?? '')) continue;
            const handle = questionOf(c);
            if (handle) {
                handle.answer('stop');
                n += 1;
            }
        }
        say('hi-q-log', `Left ${plural(n, 'question')} stopped, each with its own safe answer (mock: the package has no batch answer).`);
    });
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 4 · manual checks
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if ($('checks-component')) {
    const root = $('hi-checks');
    const CHECKS = [
        { id: 'restore-vaultwarden', stack: 'vaultwarden', text: 'Restore one file from last night’s vaultwarden backup into a scratch folder. Does it open?', previous: 'ok' },
        { id: 'ups-test', stack: 'pve', text: 'Pull the power cord of the UPS for 10 seconds. Does pve keep running?', previous: 'ok' },
        { id: 'nas-snapshot', stack: 'syncthing', text: 'Open the NAS and look at today’s snapshot. Is it there and not empty?', previous: 'fail' },
    ];
    const steps = () =>
        CHECKS.map((c) => ({
            text: c.text,
            note: `About ${c.stack}`,
            answer: {
                id: c.id,
                kind: /** @type {const} */ ('choice'),
                previous: c.previous,
                choices: [
                    { value: 'ok', label: 'It works' },
                    { value: 'fail', label: 'It fails' },
                ],
            },
        }));
    const start = () => {
        setFocusSteps(root, /** @type {any} */ (steps()));
        say('hi-checks-log', 'Answer a check; what the page would send shows here.');
    };
    start();
    on(root, 'kp-focus-steps-answer', (e) => {
        const d = e.detail;
        const what = d.source === 'skip' ? 'asks again on 26/10/2026 (7 days)' : d.value === 'fail' ? 'becomes a Failure in the Inbox' : 'closes the check';
        say('hi-checks-log', `PUT /api/checks/${d.id} {"answer":"${d.value}"}  →  ${what}.`);
    });
    on(root, 'kp-focus-steps-done', (e) => {
        const answers = e.detail.answers ?? {};
        const fails = Object.values(answers).filter((a) => /** @type {any} */ (a)?.value === 'fail').length;
        say('hi-checks-log', `Done: ${plural(e.detail.total, 'answer')} sent. ${plural(fails, 'check')} will appear as a Failure in the Inbox.`);
    });
    stateButtons('data-hi-checks', (v) => {
        if (v === 'ready') start();
        setFocusStepsState(root, /** @type {'loading' | 'error' | 'ready'} */ (v), 'The checks could not be read: the host did not answer.');
    });
    document.querySelector('[data-hi-checks-restart]')?.addEventListener('click', () => {
        press('data-hi-checks', 'ready');
        setFocusStepsState(root, 'ready');
        start();
    });
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 5 · delivery
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if ($('delivery-component')) {
    const card = $('hi-delivery-card');
    const bed = $('hi-delivery-bed');
    const chip = $('hi-push-state');
    const digest = $('hi-digest');
    let snoozeEl = $('hi-snooze');
    const state = { push: true, until: /** @type {number | null} */ (null), digest: '09:00', relay: 'accepts', look: 'chips' };

    const paintState = () => {
        let text = 'Push on · not snoozed';
        let tone = 'kp-badge--success';
        if (!state.push) {
            text = 'Push off';
            tone = '';
        } else if (state.until && state.until > NOW) {
            text = `Snoozed until ${stamp(state.until)}`;
            tone = 'kp-badge--warning';
        }
        chip.textContent = text;
        chip.className = `kp-badge ${tone} kp-state-word kp-state-word--center`.replace(/\s+/g, ' ');
        $('hi-push-open').hidden = !state.push;
        $('hi-push-on').hidden = state.push;
    };
    paintState();

    // the snooze picker
    const wireSnooze = () => {
        snoozeEl.addEventListener('kp-snooze', async (event) => {
            const e = /** @type {CustomEvent} */ (event);
            setSnoozeBusy(snoozeEl, true);
            await wait(700);
            setSnoozeBusy(snoozeEl, false);
            if (state.relay === 'refuses') {
                say('hi-delivery-log', 'PUT /api/notify/snooze  →  refused: the push relay did not answer. Nothing was snoozed.');
                return;
            }
            state.until = Date.parse(e.detail.until);
            setSnoozedUntil(snoozeEl, state.until);
            paintState();
            say('hi-delivery-log', `PUT /api/notify/snooze {"minutes":${Math.round((state.until - NOW) / 60000)}}  →  snoozed until ${stamp(state.until)}.`);
        });
        snoozeEl.addEventListener('kp-snooze-end', () => {
            state.until = null;
            setSnoozedUntil(snoozeEl, null);
            paintState();
            say('hi-delivery-log', 'PUT /api/notify/snooze {"minutes":0}  →  snooze ended.');
        });
    };
    wireSnooze();
    /** Switch the picker's look: the picker reads it once, so it is made again. @param {string} look */
    const setLook = (look) => {
        state.look = look;
        const fresh = /** @type {HTMLElement} */ (snoozeEl.cloneNode(false));
        fresh.removeAttribute('data-kp-snooze-attached');
        fresh.removeAttribute('data-kp-snoozed-state');
        fresh.removeAttribute('aria-busy');
        fresh.setAttribute('data-kp-look', look);
        if (state.until && state.until > NOW) fresh.setAttribute('data-kp-snoozed-until', new Date(state.until).toISOString());
        else fresh.removeAttribute('data-kp-snoozed-until');
        snoozeEl.replaceWith(fresh);
        snoozeEl = fresh;
        attachSnoozes(fresh.parentElement ?? document, { now: () => NOW });
        wireSnooze();
        press('data-hi-snooze-look', look);
    };
    stateButtons('data-hi-snooze-look', setLook);
    document.addEventListener('review:choice', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        if (d?.id === 'rules-snooze-look') setLook(d.value === 'menu' ? 'menu' : 'chips');
    });

    // the digest: saves as you change it, with Undo
    let lastSaved = state.digest;
    digest.addEventListener('kp-time-change', (event) => {
        const e = /** @type {CustomEvent} */ (event);
        const next = String(e.detail.value || '');
        if (!next || next === lastSaved) return;
        const previous = lastSaved;
        if (state.relay === 'refuses') {
            setTime(digest, previous);
            toast(`Not saved: the push relay did not answer. The digest stays at ${previous}.`, { region: bed, ms: 6000 });
            say('hi-delivery-log', `PUT /api/notify/digest {"digest_at":"${next}"}  →  refused. The field is back at ${previous}.`);
            return;
        }
        lastSaved = next;
        say('hi-delivery-log', `PUT /api/notify/digest {"digest_at":"${next}"}  →  saved.`);
        undoToast(`Digest set to ${next}`, {
            mode: 'revert',
            region: bed,
            ms: 6000,
            max: 2,
            undo: () => {
                lastSaved = previous;
                setTime(digest, previous);
                say('hi-delivery-log', `PUT /api/notify/digest {"digest_at":"${previous}"}  →  undone, back at ${previous}.`);
            },
        });
    });

    // push off behind a tick
    const gate = $('hi-push-gate');
    const open = $('hi-push-open');
    open.addEventListener('click', () => {
        gate.hidden = false;
        open.setAttribute('aria-expanded', 'true');
        gate.scrollIntoView({ block: 'nearest' });
    });
    $('hi-push-keep').addEventListener('click', () => {
        gate.hidden = true;
        open.setAttribute('aria-expanded', 'false');
        ackGate(gate)?.set(false);
        open.focus();
    });
    $('hi-push-off').addEventListener('click', () => {
        if (state.relay === 'refuses') {
            say('hi-delivery-log', 'PUT /api/notify/push {"push":false}  →  refused: the push relay did not answer.');
            return;
        }
        state.push = false;
        gate.hidden = true;
        open.setAttribute('aria-expanded', 'false');
        ackGate(gate)?.set(false);
        paintState();
        $('hi-push-on').focus();
        say('hi-delivery-log', 'PUT /api/notify/push {"push":false}  →  push is off.');
    });
    $('hi-push-on').addEventListener('click', () => {
        state.push = true;
        paintState();
        open.focus();
        say('hi-delivery-log', 'PUT /api/notify/push {"push":true}  →  push is on.');
    });

    // the test push: the first press works, a refusal says what to do
    const test = $('hi-test');
    test.addEventListener('click', () => {
        void runFlashButton(test, async () => {
            await wait(800);
            if (state.relay === 'refuses') {
                say('hi-delivery-log', 'POST /api/notify/test  →  refused.');
                return { error: 'The push relay did not answer.', remedy: 'Check that kyu on CT 109 is running, then try again.', word: 'Refused' };
            }
            say('hi-delivery-log', 'POST /api/notify/test  →  one push sent to 2 phones (mock endpoint).');
            return 'Sent';
        });
    });

    stateButtons('data-hi-relay', (v) => {
        state.relay = v;
    });
    stateButtons('data-hi-delivery', (v) => {
        if (v === 'loading') setCardState(card, 'loading', { words: 'Reading the rules…' });
        else if (v === 'error') setCardState(card, 'error', { title: 'The rules could not be read', text: 'The host did not answer within 20 seconds.' });
        else setCardState(card, 'ready');
    });
    on(card, 'kp-card-retry', () => {
        setCardState(card, 'loading', { words: 'Reading the rules…' });
        window.setTimeout(() => {
            press('data-hi-delivery', 'ready');
            setCardState(card, 'ready');
        }, 1400);
    });
    document.querySelector('[data-hi-reset="delivery"]')?.addEventListener('click', () => {
        state.push = true;
        state.until = null;
        state.relay = 'accepts';
        lastSaved = '09:00';
        setTime(digest, '09:00');
        setSnoozedUntil(snoozeEl, null);
        gate.hidden = true;
        open.setAttribute('aria-expanded', 'false');
        ackGate(gate)?.set(false);
        press('data-hi-relay', 'accepts');
        paintState();
        say('hi-delivery-log', 'The rules are back: push on, no snooze, digest at 09:00.');
    });
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 6 · routing
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if ($('routing-component')) {
    const card = $('hi-routing-card');
    const tri = $('hi-tri');
    const stacksEl = $('hi-stacks');
    const preview = $('hi-preview');
    const KIND = [
        { value: 'action_done', label: 'action done' },
        { value: 'action_failed', label: 'action failed' },
        { value: 'action_deferred', label: 'action deferred' },
        { value: 'schedule_missed', label: 'schedule missed' },
        { value: 'incident', label: 'incident' },
        { value: 'host_event', label: 'host' },
        { value: 'fleet_check', label: 'nightly check' },
        { value: 'alert', label: 'alert' },
        { value: 'alert_resolved', label: 'alert resolved' },
    ];
    const STACKS = [
        ['jellyfin', 3],
        ['immich', 12],
        ['paperless', 5],
        ['vaultwarden', 2],
        ['traefik', 1],
        ['prometheus', 0],
        ['grafana', 0],
        ['loki', 4],
        ['kyu', 0],
        ['almanac', 7],
        ['syncthing', 1],
        ['inbox', 0],
        ['metrics', 2],
        ['admin', 0],
    ];
    const PUSHES = [
        { key: 'p1', kind: 'action_failed', stack: 'vaultwarden', severity: 'critical', title: 'Backup of vaultwarden failed', ago: 12 },
        { key: 'p2', kind: 'alert', stack: 'prometheus', severity: 'critical', title: 'HighMemory on pve: 91 % for 20 minutes', ago: 38 },
        { key: 'p3', kind: 'fleet_check', stack: 'immich', severity: 'warning', title: 'Nightly check: immich is 4 versions behind', ago: 380 },
        { key: 'p4', kind: 'action_done', stack: 'jellyfin', severity: 'info', title: 'Nightly backup of jellyfin finished', ago: 390 },
        { key: 'p5', kind: 'schedule_missed', stack: 'almanac', severity: 'warning', title: 'Schedule almanac-sync missed its 02:00 run', ago: 460 },
    ];
    const kindLabel = Object.fromEntries(KIND.map((k) => [k.value, k.label]));
    let data = 'ready';
    /** @type {Set<string>} */
    let muted = new Set();
    let always = new Set(['action_failed', 'incident', 'alert']);
    let digestOnly = new Set(['action_done', 'alert_resolved']);

    const outcome = (/** @type {(typeof PUSHES)[number]} */ p) => {
        if (muted.has(p.stack)) return { pushed: false, why: `Not pushed: ${p.stack} is muted.` };
        if (digestOnly.has(p.kind)) return { pushed: false, why: `Held for the 09:00 digest: ${kindLabel[p.kind]} is digest only.` };
        if (always.has(p.kind)) return { pushed: true, why: `Pushed: ${kindLabel[p.kind]} is always pushed.` };
        return p.severity === 'info' ? { pushed: false, why: 'Held for the 09:00 digest: by default only urgent notices and warnings are pushed.' } : { pushed: true, why: 'Pushed: by default urgent notices and warnings are pushed.' };
    };
    const paintPreview = () => {
        const state = data === 'ready' ? 'ready' : data;
        setNotices(preview, {
            state: /** @type {any} */ (state),
            items:
                data === 'ready'
                    ? PUSHES.map((p) => {
                          const o = outcome(p);
                          return { key: p.key, severity: /** @type {any} */ (p.severity), title: p.title, since: Date.now() - p.ago * 60_000, consequence: o.why, read: !o.pushed, source: p.stack };
                      })
                    : [],
            sources: [],
            error: 'The host did not answer.',
        });
    };
    const paintStacks = () => {
        say('hi-routing-count', `${STACKS.length - muted.size} of ${STACKS.length} stacks push`);
        setFacetItems(
            stacksEl,
            STACKS.map(([name, n]) => ({ value: String(name), label: String(name), count: Number(n), pattern: String(name), checked: !muted.has(String(name)) })),
        );
        setFacetValues(
            stacksEl,
            STACKS.map(([name]) => String(name)).filter((n) => !muted.has(n)),
        );
    };
    const paintKinds = () => {
        setSegmentedItems(
            tri,
            KIND.map((k) => ({ value: k.value, label: k.label, state: always.has(k.value) ? 'include' : digestOnly.has(k.value) ? 'exclude' : 'any' })),
        );
        setSegmentedTri(tri, { include: always, exclude: digestOnly });
    };
    const drawAll = () => {
        paintKinds();
        paintStacks();
        paintPreview();
    };
    drawAll();
    $('hi-tri-say').textContent = 'Always pushed wakes you. Digest only waits for the morning. By default, a notice is pushed when it is urgent or a warning.';
    $('hi-stacks-say').textContent = 'Unread counts are exact. “Only” switches every other stack off.';

    on(tri, 'kp-segmented-change', () => {
        const v = getSegmentedTri(tri);
        always = new Set(v.include);
        digestOnly = new Set(v.exclude);
        say('hi-routing-log', `PUT /api/notify/routing {"push":[${v.include.map((x) => `"${x}"`).join(',')}],"digest_only":[${v.exclude.map((x) => `"${x}"`).join(',')}]}  (mock: no such field yet)`);
        paintPreview();
    });
    on(stacksEl, 'kp-facet-change', (e) => {
        const on_ = new Set(/** @type {string[]} */ (e.detail.values));
        muted = new Set(STACKS.map(([n]) => String(n)).filter((n) => !on_.has(n)));
        say('hi-routing-count', `${STACKS.length - muted.size} of ${STACKS.length} stacks push`);
        say('hi-routing-log', `PUT /api/notify/settings {"muted_stacks":[${[...muted].map((x) => `"${x}"`).join(',')}]}  →  one request for the whole list (${e.detail.source}).`);
        paintPreview();
    });
    stateButtons('data-hi-routing', (v) => {
        data = v;
        if (v === 'loading') setCardState(card, 'loading', { words: 'Reading the rules…' });
        else if (v === 'error') setCardState(card, 'error', { title: 'The rules could not be read', text: 'The host did not answer within 20 seconds.' });
        else if (v === 'empty') setCardState(card, 'empty', { title: 'No stacks yet', text: 'Stacks appear here once the host knows them.' });
        else setCardState(card, 'ready');
        paintPreview();
    });
    on(card, 'kp-card-retry', () => {
        data = 'loading';
        setCardState(card, 'loading', { words: 'Reading the rules…' });
        window.setTimeout(() => {
            data = 'ready';
            press('data-hi-routing', 'ready');
            setCardState(card, 'ready');
            paintPreview();
        }, 1400);
    });
    stateButtons('data-hi-start', (v) => {
        muted = v === 'quiet' ? new Set(['immich', 'almanac', 'loki']) : new Set();
        paintStacks();
        paintPreview();
        say('hi-routing-log', v === 'quiet' ? 'immich, almanac and loki are muted: they send the most notices and never need you at night.' : 'Every stack pushes.');
    });
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 7 · quiet hours
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if ($('quiet-component')) {
    const card = $('hi-quiet-card');
    const heat = $('hi-q-heat');
    const bed = $('hi-quiet-bed');
    const fromEl = $('hi-q-from');
    const untilEl = $('hi-q-until');
    const daysEl = $('hi-q-days');
    // pushes of the last 14 days by hour (sum 153; weekdays carry 3 in 4)
    const HOURS = [2, 3, 5, 12, 6, 3, 3, 6, 8, 14, 9, 8, 7, 7, 9, 8, 8, 9, 8, 6, 3, 2, 4, 3];
    const total = HOURS.reduce((a, b) => a + b, 0);
    const STACKS = ['jellyfin', 'immich', 'paperless', 'vaultwarden', 'traefik', 'prometheus'];
    const WEIGHT = [0.15, 0.2, 0.1, 0.2, 0.15, 0.2];
    /** Spread an hour's total over the six stacks, whole numbers, largest remainder first (rotating by hour). @param {number} hour */
    const spread = (hour) => {
        const n = HOURS[hour];
        const raw = WEIGHT.map((w) => w * n);
        const out = raw.map(Math.floor);
        let left = n - out.reduce((a, b) => a + b, 0);
        const order = raw.map((v, i) => ({ i, r: v - Math.floor(v) + ((i + hour) % 6) * 1e-6 })).sort((a, b) => b.r - a.r);
        for (const { i } of order) {
            if (left <= 0) break;
            out[i] += 1;
            left -= 1;
        }
        return out;
    };
    const CELLS = HOURS.map((_, hour) => spread(hour));
    const MAX = Math.max(...CELLS.flat());
    const narrow = () => window.matchMedia('(max-width: 40rem)').matches;
    window.matchMedia('(max-width: 40rem)').addEventListener('change', () => draw());

    const state = { data: 'ready', from: '22:00', until: '07:00', days: [0, 1, 2, 3, 4, 5, 6], saved: '22:00-07:00' };

    /** Whether an hour 0 to 23 falls inside the window (it may wrap past midnight). @param {number} hour */
    const held = (hour) => {
        const a = timeMinutes(state.from);
        const b = timeMinutes(state.until);
        const m = hour * 60;
        if (a === b) return false;
        return a < b ? m >= a && m < b : m >= a || m < b;
    };
    const dayShare = () => {
        const wd = state.days.filter((d) => d >= 1 && d <= 5).length;
        const we = state.days.filter((d) => d === 0 || d === 6).length;
        return { wd: wd / 5, we: we / 2 };
    };

    const draw = () => {
        const { wd, we } = dayShare();
        let heldTotal = 0;
        // On a phone three hours share a column: 24 columns are 12 px each there and their names touch.
        const step = narrow() ? 3 : 1;
        const blocks = HOURS.map((_, i) => i).filter((i) => i % step === 0);
        const cols = blocks.map((i) => ({ key: `h${i}`, label: String(i).padStart(2, '0') }));
        const sum = (/** @type {number} */ i, /** @type {(h: number) => number} */ f) => Array.from({ length: step }, (_, k) => f(i + k)).reduce((x, y) => x + y, 0);
        const heldBlock = (/** @type {number} */ i) => Array.from({ length: step }, (_, k) => held(i + k)).filter(Boolean).length * 2 >= step;
        const maxBlock = Math.max(...blocks.map((i) => sum(i, (h) => HOURS[h])));
        const maxCell = Math.max(...blocks.flatMap((i) => STACKS.map((_, r) => sum(i, (h) => CELLS[h][r]))));
        const words = (/** @type {number} */ i) => (step === 1 ? `at ${String(i).padStart(2, '0')}:00` : `from ${String(i).padStart(2, '0')}:00 to ${String((i + 3) % 24).padStart(2, '0')}:00`);
        const rows = STACKS.map((name, r) => ({
            key: name,
            label: name,
            cells: blocks.map((i) => {
                const n = sum(i, (h) => CELLS[h][r]);
                const isHeld = heldBlock(i);
                return {
                    tone: /** @type {any} */ (isHeld ? 'muted' : n === 0 ? 'none' : 'level'),
                    level: n / maxCell,
                    label: `${plural(n, 'push', 'pushes')} ${words(i)}${isHeld ? ', held by quiet hours' : ''}`,
                };
            }),
        }));
        const summary = {
            key: 'all',
            label: 'Every stack',
            cells: blocks.map((i) => {
                const n = sum(i, (h) => HOURS[h]);
                const isHeld = heldBlock(i);
                return { tone: /** @type {any} */ (isHeld ? 'muted' : 'ok'), share: n / maxBlock, label: `${plural(n, 'push', 'pushes')} ${words(i)}${isHeld ? ', held by quiet hours' : ''}` };
            }),
        };
        for (let h = 0; h < 24; h += 1) if (held(h)) heldTotal += HOURS[h] * (0.75 * wd + 0.25 * we);
        if (state.data === 'ready') setHeat(heat, { columns: cols, every: 3, summary, rows, label: 'Pushes of the last 14 days by stack and hour' });
        else if (state.data === 'loading') setHeat(heat, { state: 'loading', skeleton: { rows: 6, columns: cols.length }, columns: cols, every: 3, label: 'Pushes of the last 14 days' });
        else if (state.data === 'empty') setHeat(heat, { state: 'empty', message: 'No pushes in the last 14 days', rows: [], label: 'Pushes of the last 14 days' });
        else setHeat(heat, { state: 'error', message: 'The pushes could not be read', rows: [], label: 'Pushes of the last 14 days' });
        const n = Math.round(heldTotal);
        const partial = state.days.length !== 7 || false;
        $('hi-q-held').textContent =
            state.data !== 'ready'
                ? ''
                : `${partial ? 'About ' : ''}${n} of ${total} pushes would have been held (${((n / total) * 100).toFixed(1)} %).`;
        const next = timeMinutes(state.until) <= timeMinutes(state.from) ? 'the next morning' : '';
        $('hi-q-next').textContent = next;
        say('hi-quiet-say', state.days.length ? `Quiet ${state.from} to ${state.until}` : 'No days picked');
    };
    draw();

    const read = () => {
        state.from = timeValue(fromEl) || state.from;
        state.until = timeValue(untilEl) || state.until;
        state.days = /** @type {number[]} */ (weekdaysOf(daysEl).filter((d) => typeof d === 'number'));
    };
    let lastSaved = JSON.stringify([state.from, state.until, state.days]);
    const save = () => {
        read();
        draw();
        if (!state.days.length) {
            say('hi-quiet-log', 'No day picked: the window is not saved. Pick at least one day.');
            return;
        }
        const before = lastSaved;
        const now_ = JSON.stringify([state.from, state.until, state.days]);
        if (before === now_) return;
        lastSaved = now_;
        say('hi-quiet-log', `PUT /api/notify/quiet {"from":"${state.from}","until":"${state.until}","days":[${state.days.join(',')}],"let_through":${/** @type {HTMLInputElement} */ ($('hi-q-through')).checked}}  (mock: no such field yet)`);
        undoToast(`Quiet hours set: ${state.from} to ${state.until}`, {
            mode: 'revert',
            region: bed,
            ms: 6000,
            max: 2,
            undo: () => {
                const [f, u, d] = JSON.parse(before);
                setTime(fromEl, f);
                setTime(untilEl, u);
                setWeekdays(daysEl, d);
                lastSaved = before;
                read();
                draw();
                say('hi-quiet-log', 'Undone: the window is back as it was.');
            },
        });
    };
    for (const el of [fromEl, untilEl]) el.addEventListener('kp-time-change', save);
    daysEl.addEventListener('kp-weekdays-change', save);
    $('hi-q-through').addEventListener('change', () => say('hi-quiet-log', `Questions and failures ${/** @type {HTMLInputElement} */ ($('hi-q-through')).checked ? 'still push' : 'are held too'} during the quiet hours.`));

    const WINDOWS = {
        nights: ['22:00', '07:00', [0, 1, 2, 3, 4, 5, 6]],
        work: ['09:00', '17:00', [1, 2, 3, 4, 5]],
        weekend: ['00:00', '23:30', [0, 6]],
    };
    stateButtons('data-hi-window', (v) => {
        const [f, u, d] = /** @type {[string, string, number[]]} */ (WINDOWS[/** @type {'nights'} */ (v)]);
        setTime(fromEl, f);
        setTime(untilEl, u);
        setWeekdays(daysEl, d);
        save();
    });
    stateButtons('data-hi-quiet', (v) => {
        state.data = v;
        if (v === 'loading') setCardState(card, 'loading', { words: 'Reading the pushes…' });
        else if (v === 'error') setCardState(card, 'error', { title: 'The pushes could not be read', text: 'The host did not answer within 20 seconds.' });
        else if (v === 'empty') setCardState(card, 'empty', { title: 'No pushes yet', text: 'The last 14 days hold no push to plan quiet hours around.' });
        else setCardState(card, 'ready');
        draw();
    });
    on(card, 'kp-card-retry', () => {
        setCardState(card, 'loading', { words: 'Reading the pushes…' });
        window.setTimeout(() => {
            state.data = 'ready';
            press('data-hi-quiet', 'ready');
            setCardState(card, 'ready');
            draw();
        }, 1400);
    });
}
