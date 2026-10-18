// research/kyu-11-topic-subs: the sample data of the page and the buttons of its controls. Everything that is shown is the package's
// own module; this file only fills the table, answers the demo's buttons and plays the parts the kyu hub would play (all of it mock).
import { attachSecrets, revealSecret, hideSecret } from '../../js/patterns.js';
import { attachLedes } from '../../js/lede.js';
import { setIdmark } from '../../js/idmark.js';
import { setStep } from '../../js/steplist.js';
import { setCardState } from '../../js/card-state.js';
import { setProblems } from '../../js/problems.js';
import { setMenu, openMenu, closeMenu, MENU_SELECT_EVENT } from '../../js/menu-button.js';
import { dataTable } from '../../js/datatable.js';
import { undoToast } from '../../js/undo-toast.js';
import { toast } from '../../js/overlays.js';
import { openConfirmation } from '../../js/components.js';

/** @param {string} sel @param {ParentNode} [root] @returns {HTMLElement | null} */
const $ = (sel, root = document) => /** @type {HTMLElement | null} */ (root.querySelector(sel));
/** @param {string} sel @param {ParentNode} [root] @returns {HTMLElement[]} */
const $$ = (sel, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(sel)]);
/** @param {number} ms */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Run once the package's own boot (js/auto.js) has attached everything the page carries. @param {() => void} run */
function onReady(run) {
    const root = document.documentElement;
    if (root.hasAttribute('data-kp-auto-ready')) return run();
    new MutationObserver((_, observer) => {
        if (!root.hasAttribute('data-kp-auto-ready')) return;
        observer.disconnect();
        run();
    }).observe(root, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
}

/** Press one button of a group: it is on, its siblings are off. @param {string} group @param {string} value */
function press(group, value) {
    for (const b of $$(`[data-ks-opt="${group}"]`)) b.setAttribute('aria-pressed', String(b.dataset.value === value));
}

// ---------------------------------------------------------------- the option registry
// Every control group is `data-ks-opt="<id>"` buttons; the review dialog's choice sets fire the same ids through review:choice.
/** @type {Record<string, (value: string) => void>} */
const APPLY = {};
/** @param {string} id @param {(value: string) => void} fn */
const option = (id, fn) => {
    APPLY[id] = (value) => {
        press(id, value);
        fn(value);
    };
};
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-ks-opt]') : null;
    if (button instanceof HTMLElement) APPLY[button.dataset.ksOpt ?? '']?.(button.dataset.value ?? '');
});
document.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent} */ (event).detail;
    APPLY[id]?.(String(value));
});

// ---------------------------------------------------------------- the mock hub
const BASE = 'https://kyu.example';
/** A made-up token: this demo is mock data. */
const TOKEN = 'kyu_mock_7d41c0e9a2b8f3156e0d94ab';

/** @typedef {{ name: string, state: 'active' | 'flagged' | 'archived', backlog: number, claimed: number, dead: number, lapsed: number, oldest: string | null, policy: string }} Sub */
/** @type {Sub[]} */
const SUBS = [
    { name: 'desktop', state: 'flagged', backlog: 3, claimed: 0, dead: 1, lapsed: 0, oldest: '2026-10-18T22:15', policy: 'lease 30 s <i>(default)</i>, 5 attempts <i>(default)</i>' },
    { name: 'phone', state: 'active', backlog: 0, claimed: 0, dead: 0, lapsed: 2, oldest: null, policy: 'lease 30 s <i>(default)</i>, 5 attempts <i>(default)</i>' },
    { name: 'kyu-runner', state: 'active', backlog: 112, claimed: 4, dead: 0, lapsed: 7, oldest: '2026-10-19T13:41', policy: 'lease 2 min, 10 attempts, ttl 7 days' },
    { name: 'almanac', state: 'active', backlog: 8, claimed: 1, dead: 0, lapsed: 0, oldest: '2026-10-19T09:30', policy: 'lease 30 s <i>(default)</i>, 3 attempts' },
    { name: 'archive', state: 'archived', backlog: 0, claimed: 0, dead: 0, lapsed: 0, oldest: null, policy: 'lease 30 s <i>(default)</i>, 5 attempts <i>(default)</i>' },
];
/** The state each subscription started in, for "put back". */
const START = new Map(SUBS.map((s) => [s.name, s.state]));
/** @param {string} iso 2026-10-19T13:41 */
const dmy = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)} ${iso.slice(11, 16)}`;
/** The words of a count: exact, with a thousands separator. @param {number} n */
const num = (n) => n.toLocaleString('en-GB');
const waiting = (/** @type {Sub} */ s) => s.backlog + s.claimed;

/** @param {Sub} s */
const badge = (s) =>
    `<span class="kp-badge${s.state === 'active' ? ' kp-badge--success' : s.state === 'flagged' ? ' kp-badge--warning' : ''}">${s.state}</span>`;

/** The rows' parts that do not change with the state. @param {Sub} s */
function rowHtml(s) {
    const oldest = s.oldest
        ? `<time datetime="${s.oldest}">${dmy(s.oldest)}</time>`
        : '<span class="ks-quiet">nothing waiting</span>';
    return `
        <td data-label="Name"><span class="ks-name"><span class="kp-idmark kp-idmark--sm" data-kp-idmark="${s.name}" aria-hidden="true"></span><a href="#sub-${s.name}" data-ks-open="${s.name}">${s.name}</a></span></td>
        <td data-label="State" data-ks-state-cell>${badge(s)}</td>
        <td data-label="Backlog" class="kp-text-end">${num(s.backlog)}</td>
        <td data-label="In flight" class="kp-text-end">${num(s.claimed)}</td>
        <td data-label="Dead" class="kp-text-end">${s.dead > 0 ? `<span class="kp-badge kp-badge--destructive">${num(s.dead)}</span>` : '0'}</td>
        <td data-label="Lapsed" class="kp-text-end">${num(s.lapsed)}</td>
        <td data-label="Oldest unacked" data-kp-sort-value="${s.oldest ?? ''}">${oldest}</td>
        <td data-label="Policy" class="ks-policy">${s.policy}</td>
        <td class="ks-col-actions">
            <div class="kp-row-actions">
                <button type="button" class="kp-button kp-button--sm" data-kp-action="archive" data-ks-archive data-kp-disabled-reason="${s.name} is already archived">Archive</button>
                <button type="button" class="kp-button kp-button--sm kp-button--destructive" data-kp-action="delete" data-ks-delete data-kp-destructive
                    data-kp-confirm="Delete subscription ${s.name} and its delivery history?" data-kp-confirm-type="${s.name}"
                    data-kp-confirm-loses="ks-loses-${s.name}"
                    data-kp-disabled-reason="Archive ${s.name} first: only an archived subscription can be deleted">Delete</button>
                <div class="kp-menu-button" data-kp-menu-button data-kp-action="more" data-ks-menu="${s.name}">
                    <button type="button" class="kp-button kp-button--sm" aria-label="More for ${s.name}">More ▾</button>
                    <div class="kp-menu kp-menu--rich" role="menu" aria-label="More for ${s.name}"></div>
                </div>
            </div>
        </td>`;
}

/** @type {Map<string, HTMLTableRowElement>} */
const ROWS = new Map();
const tbody = /** @type {HTMLElement} */ ($('[data-ks-rows]'));
for (const s of SUBS) {
    const tr = document.createElement('tr');
    tr.dataset.kpKey = s.name;
    tr.dataset.ksSub = s.name;
    tr.innerHTML = rowHtml(s);
    tbody.append(tr);
    ROWS.set(s.name, tr);
}
tbody.setAttribute('data-kp-idmark-set', '');

/** What a delete would lose, as the typed confirmation lists it. @param {Sub} s */
function losesTemplate(s) {
    let t = /** @type {HTMLTemplateElement | null} */ ($(`#ks-loses-${s.name}`));
    if (!t) {
        t = document.createElement('template');
        t.id = `ks-loses-${s.name}`;
        document.body.append(t);
    }
    const n = s.backlog + s.claimed + s.dead;
    t.innerHTML = `<ul><li>The delivery history of <b>${s.name}</b> (${num(n)} ${n === 1 ? 'message' : 'messages'} still held)</li><li>Its policy: ${s.policy.replace(/<\/?i>/g, '')}</li></ul>`;
}

/** The menu of one subscription. @param {Sub} s */
function menuGroups(s) {
    const gone = s.state === 'archived';
    return [
        {
            group: 'Look',
            items: [
                {
                    label: s.dead > 0 ? `Dead letters (${s.dead})` : 'Dead letters',
                    hint: s.dead > 0 ? 'Last: eerste echte bericht' : 'Messages that gave up after too many tries',
                    disabled: s.dead > 0 ? null : `Nothing died on ${s.name}`,
                    value: 'dead',
                },
                {
                    label: 'Oldest unacked message',
                    hint: 'The message that has waited longest',
                    disabled: waiting(s) > 0 ? null : `Nothing is waiting on ${s.name}`,
                    value: 'oldest',
                },
            ],
        },
        {
            group: 'Use',
            items: [
                {
                    label: 'Copy receive command',
                    hint: 'Without the token',
                    disabled: gone ? `${s.name} is archived and no longer delivers` : null,
                    value: 'copy-receive',
                },
                {
                    label: 'Copy acknowledge command',
                    hint: 'Without the token',
                    disabled: gone ? `${s.name} is archived and no longer delivers` : null,
                    value: 'copy-ack',
                },
            ],
        },
    ];
}

/** @param {HTMLElement} wrapper @param {string} name */
const fillMenu = (wrapper, name) => {
    const s = SUBS.find((x) => x.name === name);
    if (s) setMenu(wrapper, menuGroups(s));
};

/** Bring a table row in step with its subscription. @param {Sub} s */
function paintRow(s) {
    const tr = ROWS.get(s.name);
    if (!tr) return;
    tr.dataset.state = s.state;
    const cell = $('[data-ks-state-cell]', tr);
    if (cell) cell.innerHTML = badge(s);
    const archive = /** @type {HTMLButtonElement} */ ($('[data-ks-archive]', tr));
    const del = /** @type {HTMLButtonElement} */ ($('[data-ks-delete]', tr));
    const archived = s.state === 'archived';
    archive.disabled = archived;
    del.disabled = !archived;
    losesTemplate(s);
    const wrapper = $('[data-ks-menu]', tr);
    if (wrapper) fillMenu(wrapper, s.name);
}

for (const s of SUBS) {
    losesTemplate(s);
    const tr = ROWS.get(s.name);
    if (!tr) continue;
    tr.dataset.state = s.state;
    const archived = s.state === 'archived';
    /** @type {HTMLButtonElement} */ ($('[data-ks-archive]', tr)).disabled = archived;
    /** @type {HTMLButtonElement} */ ($('[data-ks-delete]', tr)).disabled = !archived;
    const wrapper = $('[data-ks-menu]', tr);
    if (wrapper) fillMenu(wrapper, s.name);
}

// ---------------------------------------------------------------- 1 · the page header
const header = /** @type {HTMLElement} */ ($('#ks-header-component'));
const ago = /** @type {HTMLElement} */ ($('[data-ks-ago]', header));
const mark = /** @type {HTMLElement} */ ($('[data-ks-mark]', header));
const lede = /** @type {HTMLElement} */ ($('[data-ks-lede]', header));
const ledeHost = /** @type {HTMLElement} */ (lede.parentElement);
const setAgo = (/** @type {number} */ secondsAgo, verb) => {
    ago.setAttribute('datetime', new Date(Date.now() - secondsAgo * 1000).toISOString());
    ago.setAttribute('data-kp-ago-verb', verb);
};
setAgo(12, 'updated');
let detachLede = attachLedes(ledeHost);

option('hd-state', (value) => {
    header.dataset.ksState = value;
    const loading = value === 'loading';
    for (const el of $$('[data-ks-live]', header)) el.hidden = loading;
    for (const el of $$('[data-ks-skeleton]', header)) el.hidden = !loading;
    if (value === 'quiet') setAgo(3 * 86400, 'last message');
    else if (value === 'filled') setAgo(12, 'updated');
});
option('hd-mark', (value) => {
    mark.classList.toggle('kp-idmark--pattern', value === 'pattern');
    mark.classList.toggle('kp-idmark--glyph', value === 'glyph');
    setIdmark(mark, 'notify.kenny');
});
option('hd-lede', (value) => {
    detachLede();
    if (value === 'folded') lede.setAttribute('data-kp-lede-collapsible', '140');
    else lede.removeAttribute('data-kp-lede-collapsible');
    detachLede = attachLedes(ledeHost);
});

// ---------------------------------------------------------------- 2 · send and receive
const send = /** @type {HTMLElement} */ ($('#ks-send-component'));
const journey = /** @type {HTMLElement} */ ($('[data-ks-journey]', send));
const fields = $$('[data-ks-secret]', send);
const SECRET = { ttl: 10, by: 'click', token: 'hidden' };

/** The working command of one field, token included. @param {string} id */
function workingCommand(id) {
    const auth = `-H 'authorization: Bearer ${TOKEN}'`;
    const url = `${BASE}/t/notify.kenny`;
    switch (id) {
        case 'publish':
            return `curl -s ${auth} -H 'content-type: application/json' -d '{"title":"eerste echte bericht","body":"hello from HA"}' ${url}`;
        case 'receive-raw':
            return `curl -s ${auth} -D- -o message.body "${url}/next?as=desktop"`;
        case 'receive-envelope':
            return `curl -s ${auth} "${url}/next?as=desktop&envelope=json"`;
        default:
            return `curl -s -X POST ${auth} "${url}/ack/<id>?as=desktop"`;
    }
}

// The token is in the page only while it is shown: the field asks, the hub (here: this function) answers.
send.addEventListener('kp-secret-request', (event) => {
    const { respond, fail } = /** @type {CustomEvent} */ (event).detail;
    const field = /** @type {HTMLElement} */ (event.target);
    event.preventDefault();
    if (SECRET.token === 'reading') return; // never answered: the field stays in its reading state
    if (SECRET.token === 'failed') return void setTimeout(() => fail(new Error('the hub did not answer in time')), 400);
    setTimeout(() => respond(workingCommand(field.dataset.ksSecret ?? '')), 250);
});

/** @type {Map<HTMLElement, () => void>} */
const detachField = new Map();
/** Attach one secret field with the current settings. @param {HTMLElement} field */
function attachField(field) {
    field.setAttribute('data-kp-secret', '');
    field.setAttribute('data-kp-secret-ttl', String(SECRET.ttl));
    if (SECRET.by === 'hold') field.setAttribute('data-kp-secret-reveal-on', 'hold');
    else field.removeAttribute('data-kp-secret-reveal-on');
    detachField.set(field, attachSecrets(field));
}
for (const field of fields) attachField(field);
/** Re-attach every field, as a setting that is read when a field is built changes. */
function reattachFields() {
    for (const field of fields) {
        hideSecret(field);
        detachField.get(field)?.();
        attachField(field);
    }
    if (SECRET.token === 'locked') lockFields(true);
}
/** @param {boolean} on */
function lockFields(on) {
    for (const field of fields) {
        if (on) field.setAttribute('data-kp-secret-disabled', 'Only the owner of this hub can read its token.');
        else field.removeAttribute('data-kp-secret-disabled');
    }
}
const words = () => {
    const el = $('[data-ks-ttl-words]', send);
    if (!el) return;
    el.textContent =
        SECRET.by === 'hold' ? 'only while you hold the button' : SECRET.ttl === 0 ? 'until you press Hide' : `for ${SECRET.ttl} seconds`;
};
words();

option('sd-ttl', (value) => {
    SECRET.ttl = Number(value);
    reattachFields();
    words();
});
option('sd-by', (value) => {
    SECRET.by = value;
    reattachFields();
    words();
});
option('sd-token', (value) => {
    SECRET.token = value;
    lockFields(value === 'locked');
    for (const field of fields) {
        hideSecret(field);
        if (value === 'reading' || value === 'failed') revealSecret(field);
    }
});

const STEPS = ['publish', 'receive', 'ack'];
let minute = 0;
const startOver = () => {
    minute = 0;
    STEPS.forEach((id, i) => setStep(journey, id, { state: i === 0 ? 'current' : 'pending', time: '' }));
};
send.addEventListener('kp-copy', (event) => {
    const step = /** @type {HTMLElement} */ (event.target).closest('[data-ks-step]')?.getAttribute('data-ks-step');
    if (!step) return;
    minute += 1;
    setStep(journey, step, { state: 'done', time: `19/10/2026 14:0${minute}` });
    const next = STEPS.find((id) => $(`[data-kp-step-id="${id}"]`, journey)?.getAttribute('data-state') !== 'done');
    if (next) setStep(journey, next, { state: 'current' });
});
$('[data-ks-start-over]', send)?.addEventListener('click', startOver);

option('sd-state', (value) => {
    setCardState(send, /** @type {any} */ (value), {
        words: 'Building the commands',
        title: 'Could not build the commands',
        text: 'The hub did not answer within ten seconds, so there is nothing to copy yet.',
    });
});
send.addEventListener('kp-card-retry', async () => {
    APPLY['sd-state']('loading');
    await wait(1400);
    APPLY['sd-state']('ready');
});

// ---------------------------------------------------------------- 3 · the warning on a topic nobody reads
const bootstrap = /** @type {HTMLElement} */ ($('#ks-bootstrap-component'));
const problems = /** @type {HTMLElement} */ ($('[data-ks-problems]', bootstrap));
setProblems(problems, [
    {
        key: 'nobody-polled',
        what: 'Nobody has polled newsflash.items yet',
        why: 'A subscription only starts existing when it first polls, and it receives only what is published after that.',
        remedy: 'Run the receive command once before you publish the message you want it to see, or add &from=beginning to pick up what the topic still retains.',
        command: `curl -s -H "authorization: Bearer $KYU_TOKEN" "${BASE}/t/newsflash.items/next?as=my-consumer&from=beginning"`,
        severity: 'warning',
    },
]);
option('bs-state', (value) => {
    setCardState(bootstrap, /** @type {any} */ (value), {
        words: 'Checking who reads the topic',
        title: value === 'empty' ? 'A reader has polled newsflash.items' : 'Could not check who reads this topic',
        text: value === 'empty' ? 'desktop polled 12 s ago, so there is nothing to warn about.' : 'The hub did not answer within ten seconds.',
    });
});
bootstrap.addEventListener('kp-card-retry', async () => {
    APPLY['bs-state']('loading');
    await wait(1400);
    APPLY['bs-state']('ready');
});

// ---------------------------------------------------------------- 4 · the subscriptions table
const subs = /** @type {HTMLElement} */ ($('#ks-subs-component'));
const filterGroup = /** @type {HTMLElement} */ ($('[data-ks-filter]', subs));
const subsLog = /** @type {HTMLElement} */ ($('[data-ks-subs-log]', subs));
const U = { clock: 'ring', ms: 6000, mode: 'defer', server: 'accept' };
const DL = { server: 'accept', anyCase: false };
/** @param {HTMLElement} el @param {string} text */
const say = (el, text) => (el.textContent = text);

const STATES = ['active', 'flagged', 'archived'];
const present = () => SUBS.filter((s) => ROWS.get(s.name)?.isConnected);
/** The filter's exact counts and the card's total, from the rows that are there. */
function updateCounts() {
    const here = present();
    const counts = { all: here.length, ...Object.fromEntries(STATES.map((st) => [st, here.filter((s) => s.state === st).length])) };
    for (const item of $$('.kp-segmented__item', filterGroup)) {
        const count = $('.kp-segmented__count', item);
        if (count) count.textContent = String(counts[/** @type {keyof typeof counts} */ (item.dataset.value ?? 'all')] ?? 0);
    }
    const total = $('[data-ks-sub-total]', subs);
    if (total) total.textContent = `${here.length} ${here.length === 1 ? 'subscription' : 'subscriptions'}`;
}

let table = /** @type {ReturnType<typeof dataTable>} */ (null);
onReady(() => {
    // The tooltip wrapper of a button that can be off stands in the row's button box: it carries the button's role, so the
    // fixed columns keep their names.
    for (const anchor of $$('.kp-row-actions > .kp-tooltip-anchor', subs)) {
        const role = anchor.querySelector('[data-kp-action]')?.getAttribute('data-kp-action');
        if (role) anchor.setAttribute('data-kp-action', role);
    }
    table = dataTable(/** @type {HTMLElement} */ ($('[data-ks-table]', subs)));
    table?.density('compact');
});
const refreshTable = () => {
    updateCounts();
    table?.refresh();
};

filterGroup.addEventListener('kp-segmented-change', (event) => {
    const { value, values } = /** @type {CustomEvent} */ (event).detail;
    const on = filterGroup.getAttribute('data-kp-segmented') === 'single' ? (value && value !== 'all' ? [value] : []) : values;
    table?.filter(1, on.length ? on : null);
});

option('sb-state', (value) => {
    if (value === 'empty') {
        setCardState(subs, 'empty', { title: 'Nothing has polled this topic yet', text: 'A subscription shows up here the first time something polls notify.kenny.' });
    } else {
        setCardState(subs, /** @type {any} */ (value), {
            words: 'Reading the subscriptions',
            title: 'Could not read the subscriptions',
            text: 'The hub did not answer within ten seconds.',
        });
    }
});
subs.addEventListener('kp-card-retry', async () => {
    APPLY['sb-state']('loading');
    await wait(1400);
    APPLY['sb-state']('ready');
});
option('sb-density', (value) => table?.density(/** @type {any} */ (value)));
option('sb-look', (value) => filterGroup.classList.toggle('kp-segmented--chips', value === 'chips'));
option('sb-mode', (value) => {
    table?.filter(1, null);
    filterGroup.setAttribute('data-kp-segmented', value);
    filterGroup.setAttribute('role', value === 'single' ? 'radiogroup' : 'group');
    for (const item of $$('.kp-segmented__item', filterGroup)) {
        const all = item.dataset.value === 'all';
        if (value === 'single') {
            item.removeAttribute('aria-pressed');
            item.removeAttribute('data-kp-segmented-all');
            item.setAttribute('role', 'radio');
            item.setAttribute('aria-checked', String(all));
            item.tabIndex = all ? 0 : -1;
        } else {
            item.removeAttribute('role');
            item.removeAttribute('aria-checked');
            item.setAttribute('aria-pressed', String(all));
            item.tabIndex = 0;
            if (all) item.setAttribute('data-kp-segmented-all', '');
        }
    }
});

/** Archive or restore one subscription in the data and on its row. @param {Sub} s @param {Sub['state']} state */
function setSubState(s, state) {
    s.state = state;
    paintRow(s);
    refreshTable();
}

/**
 * Archive with Undo: the page changes at once, the hub hears it when the window closes (or at once, in revert mode).
 * @param {{ name: string, apply: () => void, restore: () => void, bed: HTMLElement, log: HTMLElement }} job
 */
async function archiveWithUndo({ name, apply, restore, bed, log }) {
    const revert = U.mode === 'revert';
    const refuse = () => new Error(`the hub refused: ${name} polled 12 s ago, so it is still in use`);
    apply();
    if (revert) {
        say(log, `Server: archiving ${name}…`);
        await wait(250);
        if (U.server === 'refuse') {
            restore();
            say(log, `Server refused to archive ${name}: it polled 12 s ago.`);
            toast(`Not done: ${name} polled 12 s ago, so it is still in use`, { region: bed, live: 'assertive', sticky: true });
            return;
        }
        say(log, `Server: archived ${name}.`);
    } else say(log, `${name} archived on the page; the hub is told when the window closes.`);
    undoToast(`${name} archived`, {
        region: bed,
        ms: U.ms,
        clock: /** @type {any} */ (U.clock),
        mode: /** @type {any} */ (U.mode),
        max: 3,
        commit: async () => {
            await wait(250);
            if (U.server === 'refuse') throw refuse();
            say(log, `Server: archived ${name}.`);
        },
        undo: () => {
            restore();
            say(log, revert ? `Server: restored ${name}.` : `Undone: nothing reached the server for ${name}.`);
        },
    });
}

subs.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const tr = target?.closest('tr[data-ks-sub]');
    const s = SUBS.find((x) => x.name === tr?.getAttribute('data-ks-sub'));
    if (!target || !tr || !s) return;
    if (target.closest('[data-ks-archive]')) {
        const before = s.state;
        void archiveWithUndo({
            name: s.name,
            apply: () => setSubState(s, 'archived'),
            restore: () => setSubState(s, before),
            bed: /** @type {HTMLElement} */ ($('[data-ks-bed="subs"]', subs)),
            log: subsLog,
        });
    } else if (target.closest('[data-ks-delete]')) {
        void deleteSub(s, /** @type {HTMLElement} */ ($('[data-ks-bed="subs"]', subs)), subsLog);
    } else if (target.closest('[data-ks-open]')) {
        event.preventDefault();
        say(subsLog, `Mock: this opens /t/notify.kenny/dashboard/subs/${s.name}.`);
    }
});

/** The hub deletes a subscription, or refuses. @param {Sub} s @param {HTMLElement} bed @param {HTMLElement} log @param {() => void} [after] */
async function deleteSub(s, bed, log, after) {
    say(log, `Server: deleting ${s.name}…`);
    await wait(350);
    if (DL.server === 'refuse') {
        say(log, `Server refused to delete ${s.name}: a client polled it 12 s ago.`);
        toast(`${s.name} was not deleted: a client polled it 12 s ago`, { region: bed, live: 'assertive', sticky: true });
        return;
    }
    ROWS.get(s.name)?.remove();
    refreshTable();
    if (present().length === 0) APPLY['sb-state']('empty'), press('sb-state', 'empty');
    say(log, `Server: deleted ${s.name}.`);
    toast(`${s.name} deleted`, { region: bed, ms: 4000 });
    after?.();
}

$('[data-ks-subs-reset]', subs)?.addEventListener('click', () => {
    for (const s of SUBS) {
        const tr = ROWS.get(s.name);
        if (tr && !tr.isConnected) tbody.append(tr);
        s.state = START.get(s.name) ?? s.state;
        paintRow(s);
    }
    refreshTable();
    APPLY['sb-state']('ready');
    say(subsLog, 'Mock data. The five subscriptions are back.');
});

// ---------------------------------------------------------------- 5 · the row menu
const menus = /** @type {HTMLElement} */ ($('#ks-menu-component'));
const rowWrappers = () => $$('[data-ks-menu]', menus);
const fillAll = (/** @type {'filled' | 'loading' | 'empty'} */ kind) => {
    for (const w of rowWrappers()) {
        if (kind === 'loading') setMenu(w, 'loading');
        else if (kind === 'empty') setMenu(w, []);
        else fillMenu(w, w.dataset.ksMenu ?? '');
    }
};
fillAll('filled');
option('rm-content', (value) => fillAll(/** @type {any} */ (value)));
option('rm-menu', (value) => {
    for (const w of rowWrappers()) {
        if (value === 'open') openMenu(w, { focus: 'none' });
        else closeMenu(w);
    }
});
document.addEventListener(MENU_SELECT_EVENT, (event) => {
    const { value } = /** @type {CustomEvent} */ (event).detail;
    const name = /** @type {HTMLElement} */ (event.target).closest('[data-ks-menu]')?.getAttribute('data-ks-menu') ?? '';
    const log = subs.contains(/** @type {Node} */ (event.target)) ? subsLog : null;
    const text = {
        dead: `Mock: shows the dead letters of ${name}.`,
        oldest: `Mock: jumps to the oldest unacked message of ${name}.`,
        'copy-receive': `Copied the receive command for ${name}, without the token (mock).`,
        'copy-ack': `Copied the acknowledge command for ${name}, without the token (mock).`,
    }[/** @type {'dead'} */ (value)];
    if (text && log) say(log, text);
    if (text && !log) toast(text, { ms: 3000, region: $('[data-ks-bed="subs"]', subs) });
});

// ---------------------------------------------------------------- 6 · Archive with Undo
const archiveDemo = /** @type {HTMLElement} */ ($('#ks-archive-component'));
const archiveLog = /** @type {HTMLElement} */ ($('[data-ks-archive-log]', archiveDemo));
const settingsLine = () => {
    const clock = { ring: 'a ring clock', bar: 'a rule clock', text: 'the seconds in words', none: 'no clock' }[/** @type {'ring'} */ (U.clock)];
    const when = U.mode === 'revert' ? 'the archive at once, Undo reverses it' : 'the archive after the window';
    const el = $('[data-ks-settings]', archiveDemo);
    if (el) el.textContent = `The next toast: ${clock}, Undo for ${U.ms / 1000} s, ${when}.`;
    archiveDemo.dataset.ksClock = U.clock;
    archiveDemo.dataset.ksMs = String(U.ms);
    archiveDemo.dataset.ksMode = U.mode;
};
option('ar-clock', (value) => ((U.clock = value), settingsLine()));
option('ar-ms', (value) => ((U.ms = Number(value)), settingsLine()));
option('ar-mode', (value) => ((U.mode = value), settingsLine()));
option('ar-server', (value) => (U.server = value));
/** @param {HTMLElement} li @param {string} state */
const paintItem = (li, state) => {
    li.dataset.state = state;
    const b = /** @type {HTMLElement} */ ($('[data-ks-badge]', li));
    b.textContent = state;
    b.className = `kp-badge${state === 'active' ? ' kp-badge--success' : ''}`;
    /** @type {HTMLButtonElement} */ ($('[data-ks-archive-item]', li)).disabled = state === 'archived';
};
archiveDemo.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('[data-ks-archive-reset]')) {
        for (const li of $$('li[data-ks-item]', archiveDemo)) paintItem(li, 'active');
        say(archiveLog, 'The server has not been called yet.');
        return;
    }
    const li = target?.closest('li[data-ks-item]');
    if (!li || !target?.closest('[data-ks-archive-item]')) return;
    const before = li.dataset.state ?? 'active';
    void archiveWithUndo({
        name: li.dataset.ksItem ?? '',
        apply: () => paintItem(li, 'archived'),
        restore: () => paintItem(li, before),
        bed: /** @type {HTMLElement} */ ($('[data-ks-bed="archive"]', archiveDemo)),
        log: archiveLog,
    });
});

// ---------------------------------------------------------------- 7 · Delete with a typed name
const del = /** @type {HTMLElement} */ ($('#ks-delete-component'));
const typed = /** @type {HTMLElement} */ ($('[data-ks-typed]', del));
const delButton = /** @type {HTMLButtonElement} */ ($('#ks-delete-button', del));
const delBed = /** @type {HTMLElement} */ ($('[data-ks-bed="delete"]', del));
const delLog = /** @type {HTMLElement} */ ($('[data-ks-delete-log]', del));
const ARCHIVE_SUB = /** @type {Sub} */ (SUBS.find((s) => s.name === 'archive'));
option('dl-server', (value) => (DL.server = value));
option('dl-case', (value) => {
    DL.anyCase = value === 'any';
    typed.setAttribute('data-kp-type-confirm-case', DL.anyCase ? 'any' : 'exact');
    const input = $('input', typed);
    if (input) input.dispatchEvent(new Event('input', { bubbles: true }));
});
let gone = false;
delButton.addEventListener('click', async () => {
    if (delButton.disabled || gone) return;
    say(delLog, 'Server: deleting archive…');
    await wait(350);
    if (DL.server === 'refuse') {
        say(delLog, 'Server refused to delete archive: a client polled it 12 s ago.');
        toast('archive was not deleted: a client polled it 12 s ago', { region: delBed, live: 'assertive', sticky: true });
        return;
    }
    gone = true;
    ROWS.get('archive')?.remove();
    refreshTable();
    say(delLog, 'Server: deleted archive. The list above no longer shows it.');
    toast('archive deleted', { region: delBed, ms: 4000 });
    const input = /** @type {HTMLInputElement | null} */ ($('input', typed));
    if (input) input.value = '';
    delButton.disabled = true;
});
$('[data-ks-delete-reset]', del)?.addEventListener('click', () => {
    gone = false;
    const tr = ROWS.get('archive');
    if (tr && !tr.isConnected) tbody.append(tr);
    refreshTable();
    say(delLog, 'The server has not been called yet.');
    const input = /** @type {HTMLInputElement | null} */ ($('input', typed));
    if (input) {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
});
option('dl-dialog', (value) => {
    del.dataset.ksDialog = value;
    for (const d of $$('dialog.kp-confirm')) d.close('cancel');
    if (value === 'shown') {
        const dialog = openConfirmation(delButton, {
            phrase: 'Delete subscription archive and its delivery history?',
            typeName: 'archive',
            anyCase: DL.anyCase,
            acceptLabel: 'Delete subscription',
            loses: [`The delivery history of archive (3 messages still held)`, `Its policy: lease 30 s, 5 attempts`],
            onAccept: () => delButton.click(),
            onCancel: () => press('dl-dialog', 'hidden'),
        });
        dialog.addEventListener('close', () => press('dl-dialog', 'hidden'), { once: true });
    }
});
void ARCHIVE_SUB;

// Defaults are the pressed buttons at load.
onReady(() => {
    updateCounts();
});
