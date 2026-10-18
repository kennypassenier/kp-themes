// research/kpadopt5-people: what this page does that the package does not.
//   1. the sample people, photos (small drawings), messages, ways to sign in and readings;
//   2. the buttons that switch each section between its states and options;
//   3. the pretend server (a removal that is refused, a message that fails to send).
// Everything drawn is drawn by the package's own functions.
import { setIdmarkGroup } from '../../../../js/idmark.js';
import { setPasskeys, PASSKEYS_REGISTER_EVENT, PASSKEYS_RETRY_EVENT } from '../../../../js/passkeys.js';
import { setThread, THREAD_RETRY_EVENT, THREAD_ADD_EVENT, THREAD_ACTION_EVENT } from '../../../../js/thread.js';
import { setChartData } from '../../../../js/chart.js';

/** @param {string} selector @param {ParentNode} [root] */
const all = (selector, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(selector)]);
const sleep = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Press one button of a group (aria-pressed), the others off. @param {HTMLElement} button */
function pressOnly(button) {
    if (!button) return; // its section is not on this page
    const group = button.closest('[role="group"]');
    for (const other of all('button[aria-pressed]', group ?? document)) other.setAttribute('aria-pressed', String(other === button));
}

/** @param {string} attr @param {(value: string, button: HTMLElement) => void} run */
function onButtons(attr, run) {
    for (const button of all(`[${attr}]`)) {
        button.addEventListener('click', () => {
            if (button.hasAttribute('aria-pressed')) pressOnly(button);
            run(button.getAttribute(attr) ?? '', button);
        });
    }
}

// ---- the sample content: the same on every load, in every time zone ------------------------------
/** Saturday 17 October 2026, 12:00 in Brussels (10:00 UTC): the page's "now". */
const NOW = Date.UTC(2026, 9, 17, 10, 0);
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
/** A Brussels (summer time, +2 h) wall-clock time. @param {number} y @param {number} m 1 to 12 @param {number} d @param {number} h @param {number} min */
const brussels = (y, m, d, h, min) => Date.UTC(y, m - 1, d, h - 2, min);

/** A small drawing of a head and shoulders, as a data address: a made-up portrait, not a real face. @param {number} hue @param {number} skin */
function portrait(hue, skin) {
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
        `<rect width="64" height="64" fill="hsl(${hue} 42% 80%)"/>` +
        `<circle cx="32" cy="25" r="11" fill="hsl(${skin} 45% 62%)"/>` +
        `<path d="M9 64c2-17 12-23 23-23s21 6 23 23z" fill="hsl(${(hue + 150) % 360} 38% 38%)"/>` +
        `</svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** @type {{ name: string, hue: number, skin: number, status?: 'online' | 'away' | 'busy' }[]} */
const PEOPLE = [
    { name: 'Ada Lovelace', hue: 210, skin: 28, status: 'online' },
    { name: 'Grace Hopper', hue: 28, skin: 22, status: 'away' },
    { name: 'Alan Turing', hue: 150, skin: 30 },
    { name: 'Katherine Johnson', hue: 320, skin: 18, status: 'busy' },
    { name: 'Margaret Hamilton', hue: 260, skin: 26 },
    { name: 'Dennis Ritchie', hue: 80, skin: 24 },
    { name: 'Barbara Liskov', hue: 350, skin: 20 },
    { name: 'Tim Berners-Lee', hue: 180, skin: 27 },
];
const photoOf = (/** @type {{ hue: number, skin: number }} */ p) => portrait(p.hue, p.skin);

// ---- 1 · avatar ----------------------------------------------------------------------------------
/**
 * @param {{ name: string, src?: string, size?: string, round?: boolean, status?: string, frame?: string, skeleton?: boolean, pattern?: boolean, glyph?: boolean }} o
 */
function makeMark({ name, src, size = '', round = false, status, frame, skeleton, pattern, glyph }) {
    const mark = document.createElement('span');
    mark.className = ['kp-idmark', size ? `kp-idmark--${size}` : '', round ? 'kp-idmark--round' : '', pattern ? 'kp-idmark--pattern' : '', glyph ? 'kp-idmark--glyph' : '', skeleton ? 'kp-skeleton kp-skeleton--block' : '']
        .filter(Boolean)
        .join(' ');
    mark.setAttribute('data-kp-idmark', name);
    if (src) mark.setAttribute('data-kp-idmark-src', src);
    if (status) mark.setAttribute('data-kp-idmark-status', status);
    if (frame) mark.setAttribute('data-kp-idmark-frame', frame);
    mark.setAttribute('data-kp-idmark-loading', 'eager');
    mark.setAttribute('aria-hidden', 'true');
    return mark;
}

let frame = 'edge';
const table = document.querySelector('[data-kp5-mark-table]');
const sizes = ['sm', '', 'lg', 'xl'];
const rows = [
    { label: 'With a photo', person: PEOPLE[0], photo: true },
    { label: 'No photo, letters', person: PEOPLE[1], photo: false },
    { label: 'Photo that fails', person: PEOPLE[2], photo: 'broken' },
    { label: 'Waiting', person: PEOPLE[3], skeleton: true },
    { label: 'No name', person: { name: '' }, photo: false },
];
/** @type {HTMLElement[]} */
const photoMarks = [];
if (table) {
    table.append(
        Object.assign(document.createElement('b'), { textContent: 'Look' }),
        ...sizes.map((size) => Object.assign(document.createElement('b'), { textContent: size || 'md' })),
    );
    for (const row of rows) {
        table.append(Object.assign(document.createElement('span'), { className: 'kp5-name', textContent: row.label }));
        for (const size of sizes) {
            const cell = document.createElement('span');
            const person = /** @type {{ name: string, hue?: number, skin?: number }} */ (row.person);
            const src = row.photo === true ? photoOf(/** @type {any} */ (person)) : row.photo === 'broken' ? './missing/portrait.jpg' : undefined;
            const mark = makeMark({ name: person.name, src, size, round: true, skeleton: row.skeleton, frame });
            if (row.photo === true) photoMarks.push(mark);
            cell.append(mark);
            table.append(cell);
        }
    }
}

// Status, and the other looks of the mark.
const statusRow = document.querySelector('[data-kp5-status-row]');
if (statusRow) {
    for (const person of PEOPLE.slice(0, 4)) {
        const wrap = document.createElement('span');
        wrap.className = 'kp-idmark-name';
        const status = person.status ?? 'online';
        const word = document.createElement('span');
        word.textContent = `${person.name}, ${status}`;
        wrap.append(makeMark({ name: person.name, src: photoOf(person), size: 'lg', round: true, status, frame }), word);
        statusRow.append(wrap);
    }
}
const looksRow = document.querySelector('[data-kp5-looks-row]');
if (looksRow) {
    const look = (/** @type {string} */ text, /** @type {HTMLElement} */ mark) => {
        const wrap = document.createElement('span');
        wrap.className = 'kp-idmark-name';
        const word = document.createElement('span');
        word.textContent = text;
        wrap.append(mark, word);
        looksRow.append(wrap);
    };
    look('Extra small, one letter', makeMark({ name: 'Acme Logistics', size: 'xs' }));
    look('Pattern', makeMark({ name: 'media', pattern: true, size: 'lg' }));
    look('Corner glyph', makeMark({ name: 'Brightline Health', glyph: true, size: 'lg' }));
    look('Round, photo', makeMark({ name: 'Contoso', src: portrait(40, 25), round: true, size: 'lg', frame }));
    look('Square, photo', makeMark({ name: 'Northwind Traders', src: portrait(200, 29), size: 'lg', frame }));
    const current = makeMark({ name: 'Ada Lovelace', src: photoOf(PEOPLE[0]), round: true, frame });
    current.setAttribute('aria-current', 'true');
    look('Current one in a list', current);
}

// Groups.
const eight = document.querySelector('[data-kp5-group="eight"]');
if (eight) {
    setIdmarkGroup(/** @type {HTMLElement} */ (eight), PEOPLE.map((p) => ({ name: p.name, src: photoOf(p), status: p.status ?? 'none' })), { max: 4 });
    // The list is shown open, so it is judged without pressing anything.
    const more = eight.querySelector('button.kp-idmark-group__more');
    if (more instanceof HTMLElement) more.click();
}
const many = document.querySelector('[data-kp5-group="many"]');
if (many) {
    const crowd = Array.from({ length: 120 }, (_, i) => {
        const p = PEOPLE[i % PEOPLE.length];
        return { name: i < PEOPLE.length ? p.name : `${p.name} ${Math.floor(i / PEOPLE.length) + 1}`, src: i < 6 ? photoOf(p) : undefined };
    });
    setIdmarkGroup(/** @type {HTMLElement} */ (many), crowd, { max: 4 });
}

// Beside a name (desk and phone).
for (const box of all('[data-kp5-names]')) {
    for (const person of [PEOPLE[0], { ...PEOPLE[4], name: 'Margaret Hamilton-Brightwater-Montgomery, head of flight software' }, PEOPLE[2]]) {
        const wrap = document.createElement('span');
        wrap.className = 'kp-idmark-name kp-idmark-name--wrap';
        const text = document.createElement('span');
        text.textContent = person.name;
        wrap.append(makeMark({ name: person.name, src: photoOf(person), round: true, frame }), text);
        box.append(wrap);
    }
}

document.querySelector('[data-kp5-replay]')?.addEventListener('click', async () => {
    for (const mark of photoMarks) {
        const src = mark.getAttribute('data-kp-idmark-src');
        if (!src) continue;
        mark.removeAttribute('data-kp-idmark-src');
        await sleep(120);
        mark.setAttribute('data-kp-idmark-src', src);
    }
});
/** @param {string} value */
function applyFrame(value) {
    frame = value;
    for (const mark of all('.kp-idmark[data-kp-idmark-src]')) mark.setAttribute('data-kp-idmark-frame', value);
    for (const button of all('[data-kp5-frame]')) button.setAttribute('aria-pressed', String(button.getAttribute('data-kp5-frame') === value));
}
onButtons('data-kp5-frame', applyFrame);
document.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: string, value: string }>} */ (event).detail;
    if (id === 'avatar-frame') applyFrame(value);
    if (id === 'passkey-refuse-look') {
        refuseLook = value === 'note' ? 'note' : 'button';
        drawPasskeys();
    }
    if (id === 'thread-bubble') {
        bubble = value === 'plain' || value === 'filled' ? value : 'tinted';
        drawThreads();
    }
    if (id === 'chart-band-look') applyBand(value);
});

// ---- 2 · ways to sign in -------------------------------------------------------------------------
/** @type {import('../../../../js/passkeys.js').PasskeyRow[]} */
const WAYS = [
    { key: 'pk1', label: 'Work laptop', kind: 'passkey', createdAt: brussels(2026, 3, 2, 9, 14), lastUsedAt: NOW - 20 * MIN, current: true },
    { key: 'pk2', label: 'Phone (fingerprint)', kind: 'passkey', createdAt: brussels(2026, 5, 10, 18, 40), lastUsedAt: NOW - 2 * DAY },
    { key: 'pk3', label: 'Email sign-in link', kind: 'magic-link', createdAt: brussels(2026, 2, 1, 8, 5), lastUsedAt: NOW - 40 * DAY },
    { key: 'pk4', label: 'Old tablet', kind: 'passkey', createdAt: brussels(2025, 11, 11, 20, 30), lastUsedAt: NOW - 120 * DAY },
    { key: 'pk5', label: 'Recovery token', kind: 'token', createdAt: brussels(2026, 9, 20, 11, 2), lastUsedAt: null },
];
const LONG_WAYS = WAYS.map((w, i) =>
    i === 1
        ? { ...w, label: 'Phone with the fingerprint reader that I keep on the kitchen table next to the coffee machine, the long name test' }
        : w,
);
let pkState = 'ready';
let pkLast = 'refuse';
let pkConfirm = 'dialog';
/** @type {'button' | 'note'} */
let refuseLook = 'button';
let ways = WAYS.map((w) => ({ ...w }));
const pkLog = document.querySelector('[data-kp5-pk-log]');
const logPk = (/** @type {string} */ text) => {
    if (pkLog) pkLog.textContent = text;
};

function drawPasskeys() {
    for (const box of all('[data-kp5-passkeys]')) {
        /** @type {import('../../../../js/passkeys.js').PasskeysSpec} */
        const spec = {
            rows: ways,
            now: () => NOW,
            protectLast: /** @type {any} */ (pkLast),
            confirm: /** @type {any} */ (pkConfirm),
            refuseLook,
            insecure: pkState === 'insecure',
            state: pkState === 'loading' || pkState === 'empty' || pkState === 'error' ? /** @type {any} */ (pkState) : 'ready',
            message: 'Your ways to sign in could not be read. Check the connection and try again.',
            remove: async (row) => {
                logPk(`Asking the server to remove “${row.label}”…`);
                await sleep(900);
                if (row.key === 'pk5') {
                    logPk('The server refused: the recovery token is in use.');
                    throw new Error('A sign-in with this token is still pending. Try again in a few minutes.');
                }
                ways = ways.filter((w) => w.key !== row.key);
                logPk(`Removed “${row.label}”: ${ways.length} left.`);
            },
            rename: async (row, label) => {
                await sleep(500);
                ways = ways.map((w) => (w.key === row.key ? { ...w, label } : w));
                logPk(`Renamed to “${label}”.`);
            },
        };
        setPasskeys(box, spec);
    }
}
/** @param {string} state */
function setPkState(state) {
    pkState = state;
    ways =
        state === 'one'
            ? [{ ...WAYS[0] }]
            : state === 'long'
              ? LONG_WAYS.map((w) => ({ ...w }))
              : WAYS.map((w) => ({ ...w }));
    drawPasskeys();
}
onButtons('data-kp5-pk-state', setPkState);
onButtons('data-kp5-pk-last', (value) => {
    pkLast = value;
    drawPasskeys();
});
onButtons('data-kp5-pk-confirm', (value) => {
    pkConfirm = value;
    drawPasskeys();
});
document.addEventListener(PASSKEYS_RETRY_EVENT, () => setPkState('loading'));
document.addEventListener(PASSKEYS_REGISTER_EVENT, () => {
    ways = WAYS.slice(0, 1).map((w) => ({ ...w }));
    pkState = 'ready';
    drawPasskeys();
    logPk('A passkey was registered (pretend).');
});
// The first frame shows the loading card; the list arrives once.
pkState = 'loading';
document.querySelector('[data-kp5-pk-state="loading"]')?.setAttribute('aria-pressed', 'true');
drawPasskeys();
setTimeout(() => {
    if (pkState === 'loading') {
        pressOnly(/** @type {HTMLElement} */ (document.querySelector('[data-kp5-pk-state="ready"]')));
        setPkState('ready');
    }
}, 1800);

// ---- conversation ----------------------------------------------------------------------------
/** @param {number} n @param {string} prefix */
const lines = (n, prefix) => Array.from({ length: n }, (_, i) => `${prefix} ${i + 1}`).join('\n');
const SIGNATURE = '\n\nKind regards,\nSam Verbeke\nSenior Recruiter, Acme Logistics\nTel +32 2 555 01 23 · Brussels';
const INVITE =
    'Hello,\n\nThank you for the time you took on Tuesday. The team liked the way you talked through the routing problem, and we would like to invite you for a final round.\n\n' +
    'The day looks like this:\n' +
    [
        '09:30  Arrival and coffee with the team',
        '10:00  A conversation with the head of engineering',
        '11:00  A practical session on a real routing bug',
        '12:30  Lunch with two future colleagues',
        '13:30  A talk about growth and how we plan work',
        '14:30  Questions from you, as many as you have',
        '15:00  Wrap-up with HR about the offer process',
    ].join('\n') +
    '\n\nPlease bring a laptop if you prefer your own setup; otherwise we have one ready. The address is Rue de la Loi 100, Brussels, 4th floor, and the reception will have your name.\n\n' +
    'If anything in the schedule does not suit you, tell us and we will move it around. We would like you to be comfortable.\n\nLooking forward to it.' +
    SIGNATURE;
const OLDER_MAIL =
    'Hello,\n\nThank you for applying for the data engineer position. We received your CV and portfolio and our team has gone through them carefully.\n\n' +
    lines(10, 'Question about your experience, number') +
    '\n\nCould you answer these before Thursday? A short answer to each is enough.' +
    SIGNATURE +
    '\n\n> On Monday, 12/10/2026 you wrote:\n> ' +
    lines(6, 'Quoted line').replaceAll('\n', '\n> ');
/** @type {import('../../../../js/thread.js').ThreadMessage[]} */
const MESSAGES = [
    { key: 's1', dir: 'system', at: brussels(2026, 10, 12, 9, 12), text: 'Application sent to Acme Logistics' },
    {
        key: 'm1',
        dir: 'in',
        sender: 'Acme Logistics',
        at: brussels(2026, 10, 12, 10, 30),
        text: 'Thanks for applying. We will review your CV this week.',
    },
    { key: 'm2', dir: 'in', sender: 'Acme Logistics', at: brussels(2026, 10, 12, 10, 32), text: 'Could you also share a link to your portfolio?' },
    {
        key: 'm3',
        dir: 'out',
        at: brussels(2026, 10, 12, 14, 5),
        text: 'Sure. The portfolio is at portfolio.example/people/ada/projects/routing-optimiser/case-study/2026/very-long-address-that-has-no-break-at-all-in-it and the CV is attached.',
        attachments: [
            { name: 'cv-ada-lovelace.pdf', size: 184_300, href: '#cv' },
            { name: 'portfolio-case-studies-routing-and-forecasting.zip', size: 3_412_000, href: '#zip' },
        ],
    },
    { key: 's2', dir: 'system', at: brussels(2026, 10, 13, 9, 0), text: 'Status changed to Interview' },
    { key: 'm4', dir: 'in', sender: 'Acme Logistics', at: brussels(2026, 10, 13, 9, 41), text: OLDER_MAIL },
    { key: 'm5', dir: 'out', at: brussels(2026, 10, 13, 11, 10), text: 'Thursday at 14:00 works for me. I will answer the questions before that.' },
    { key: 'm6', dir: 'in', sender: 'Acme Logistics', at: brussels(2026, 10, 16, 15, 20), text: INVITE },
];
let thState = 'ready';
let thMessages = MESSAGES.map((m) => ({ ...m }));
let sentCount = 0;
const thLog = document.querySelector('[data-kp5-th-log]');
const logTh = (/** @type {string} */ text) => {
    if (thLog) thLog.textContent = text;
};

function drawThreads() {
    for (const box of all('[data-kp5-thread]')) {
        setThread(box, {
            messages: thState === 'empty' ? [] : thMessages,
            state: thState === 'loading' || thState === 'empty' || thState === 'error' ? /** @type {any} */ (thState) : 'ready',
            message: 'The conversation could not be read. Check the connection and try again.',
            actions: [{ id: 'rename', label: 'Rename' }],
            label: 'Conversation with Acme Logistics',
        });
    }
}
/** @param {string} state */
function setThState(state) {
    thState = state;
    drawThreads();
}
onButtons('data-kp5-th-state', setThState);
// The five options are attributes of the component, switched at runtime: the thread redraws by itself.
/** @param {string} name @param {string} value */
const setOption = (name, value) => {
    for (const box of all('[data-kp5-thread]')) box.setAttribute(`data-kp-thread-${name}`, value);
    logTh(`data-kp-thread-${name}="${value}"`);
};
onButtons('data-kp5-th-fold', (value) => setOption('fold', value));
onButtons('data-kp5-th-order', (value) => setOption('order', value));
onButtons('data-kp5-th-avatar', (value) => setOption('avatar', value));
onButtons('data-kp5-th-days', (value) => setOption('days', value));
onButtons('data-kp5-th-bubble', (value) => setOption('bubble', value));

/** Send a reply: faded and "Sending…", then a normal bubble, or "Not sent". @param {boolean} fails */
async function send(fails) {
    sentCount += 1;
    const key = `r${sentCount}`;
    const at = NOW - 40 * MIN + sentCount * MIN;
    const text = fails
        ? 'Can we move the final round to Friday? Thursday has become difficult for me.'
        : 'Thank you for the schedule. I will be there at 09:30 and I will bring my own laptop.';
    thMessages = [...thMessages, { key, dir: 'out', at, text, status: 'sending' }];
    thState = 'ready';
    drawThreads();
    await sleep(1400);
    thMessages = thMessages.map((m) =>
        m.key === key ? (fails ? { ...m, status: 'failed', error: 'no connection to the mail server.' } : { ...m, status: 'sent' }) : m,
    );
    drawThreads();
    logTh(fails ? 'The message could not be sent (pretend). Press Retry on it.' : 'The reply was sent (pretend).');
}
onButtons('data-kp5-th-send', (value) => void send(value === 'fail'));
document.addEventListener(THREAD_RETRY_EVENT, async (event) => {
    const key = /** @type {CustomEvent<{ key?: string }>} */ (event).detail?.key;
    if (!key) {
        setThState('loading');
        await sleep(1500);
        setThState('ready');
        pressOnly(/** @type {HTMLElement} */ (document.querySelector('[data-kp5-th-state="ready"]')));
        return;
    }
    thMessages = thMessages.map((m) => (m.key === key ? { ...m, status: 'sending' } : m));
    drawThreads();
    await sleep(1200);
    thMessages = thMessages.map((m) => (m.key === key ? { ...m, status: 'sent', error: undefined } : m));
    drawThreads();
    logTh('The message was sent on the second try (pretend).');
});
document.addEventListener(THREAD_ADD_EVENT, () => {
    thMessages = MESSAGES.slice(0, 2).map((m) => ({ ...m }));
    setThState('ready');
    pressOnly(/** @type {HTMLElement} */ (document.querySelector('[data-kp5-th-state="ready"]')));
});
document.addEventListener(THREAD_ACTION_EVENT, (event) => {
    const { key, id } = /** @type {CustomEvent<{ key: string, id: string }>} */ (event).detail;
    logTh(`The page got “${id}” for message ${key}.`);
});
thState = 'loading';
document.querySelector('[data-kp5-th-state="loading"]')?.setAttribute('aria-pressed', 'true');
drawThreads();
setTimeout(() => {
    if (thState === 'loading') {
        pressOnly(/** @type {HTMLElement} */ (document.querySelector('[data-kp5-th-state="ready"]')));
        setThState('ready');
    }
}, 1800);

// ---- 4 · chart markers ---------------------------------------------------------------------------
const CHART_NOW = Date.UTC(2026, 9, 17, 10, 0);
/** Noise from the time alone. @param {number} t @param {number} k */
const noise = (t, k) => {
    const v = Math.sin((t / 60_000) * 12.9898 + k * 78.233) * 43758.5453;
    return v - Math.floor(v) - 0.5;
};
/** @param {string} chart @param {Partial<import('../../../../js/chart.js').ChartData>} [extra] */
function chartData(chart, extra = {}) {
    if (chart === 'events') {
        const to = CHART_NOW - 12 * HOUR;
        const from = to - 72 * HOUR;
        /** Pressure falls through the evening peak and rises at night. */
        const value = (/** @type {number} */ t) => 3.7 - 0.5 * Math.max(0, Math.sin(((t / HOUR) % 24) / 24 * Math.PI * 2 - 1.2)) + 0.12 * noise(t, 2);
        const points = /** @type {[number, number][]} */ ([]);
        for (let t = from - 6 * HOUR; t <= to + 12 * HOUR; t += HOUR) points.push([t, value(t)]);
        return {
            unit: 'bar',
            from,
            to,
            height: 190,
            series: [{ label: 'Pump house 1', points }],
            kinds: {
                operation: { label: 'An operation the host ran', tone: 'info' },
                update: { label: 'An update', tone: 'warning' },
                failure: { label: 'A failure', tone: 'critical' },
                window: { label: 'A maintenance window', tone: 'warning' },
            },
            events: [
                { at: from - 30 * HOUR, label: 'Backup', kind: 'operation' },
                { at: from - 8 * HOUR, label: 'Backup', kind: 'operation' },
                { at: from + 9 * HOUR, label: 'Backup finished', kind: 'operation' },
                { at: from + 22 * HOUR, label: 'Firmware 4.2 installed', kind: 'update' },
                { at: from + 33 * HOUR, until: from + 38 * HOUR, label: 'Maintenance window: pump house 1', kind: 'window' },
                { at: from + 50 * HOUR, label: 'Pressure sensor lost contact', kind: 'failure' },
                { at: from + 60 * HOUR, label: 'Backup finished', kind: 'operation' },
                { at: to + 5 * HOUR, label: 'Firmware 4.3 installed', kind: 'update' },
            ],
            ...extra,
        };
    }
    if (chart === 'runs') {
        const to = CHART_NOW;
        const from = to - 28 * DAY;
        const mood = [3, 4, 3, 4, 3, 4, 4, 2, 2, 1, 2, 2, 1, 2, 2, 3, 4, 3, 4, 4, 5, 4, 4, 5, 4, 5, 4, 5];
        return {
            from,
            to,
            height: 190,
            yMax: 5,
            unit: '',
            series: [{ label: 'Mood', points: mood.map((v, i) => /** @type {[number, number]} */ ([from + (i + 0.5) * DAY, v])) }],
            ...extra,
        };
    }
    const to = CHART_NOW;
    const hours = [6.5, 7.2, 5.9, 7.8, 8.1, 6.4, 7.0, 7.4];
    const keep = extra.series ? 0 : 3;
    const series = extra.series ?? [{ label: 'Sleep', points: hours.slice(0, keep).map((v, i) => /** @type {[number, number]} */ ([to - (keep - i) * DAY, v])) }];
    return { from: to - 7 * DAY, to, height: 190, yMax: 10, unit: 'h', series };
}
let chartStateNow = 'ready';
let band = 'tint';
let few = 'few';
function drawCharts() {
    for (const figure of all('[data-kp5-chart]')) {
        const kind = figure.getAttribute('data-kp5-chart') ?? '';
        figure.toggleAttribute('data-kp-chart-loading', chartStateNow === 'loading');
        figure.setAttribute('data-kp-chart-band', band);
        if (kind === 'few' && few === 'enough') {
            const to = CHART_NOW;
            const hours = [6.5, 7.2, 5.9, 7.8, 8.1, 6.4, 7.0];
            setChartData(figure, chartData('few', { series: [{ label: 'Sleep', points: hours.map((v, i) => /** @type {[number, number]} */ ([to - (hours.length - i) * DAY, v])) }] }));
        } else if (chartStateNow === 'error' && kind !== 'few') {
            setChartData(figure, { ...chartData(kind), error: 'The readings could not be read. Check the connection and try again.', series: [] });
        } else setChartData(figure, chartData(kind));
        if (chartStateNow === 'loading' && kind !== 'few') figure.setAttribute('data-kp-chart-loading', '');
    }
}
drawCharts();
onButtons('data-kp5-ch-state', (value) => {
    chartStateNow = value;
    drawCharts();
});
onButtons('data-kp5-ch-median', (value) => {
    for (const figure of all('[data-kp5-chart]')) {
        if (value === 'on') figure.setAttribute('data-kp-chart-median', '');
        else figure.setAttribute('data-kp-chart-median', 'off');
    }
    drawCharts();
});
onButtons('data-kp5-ch-runs', (value) => {
    for (const figure of all('[data-kp5-chart="runs"]')) figure.setAttribute('data-kp-chart-runs', value);
    drawCharts();
});
/** @param {string} value */
function applyBand(value) {
    band = value === 'hatch' || value === 'bracket' ? value : 'tint';
    for (const button of all('[data-kp5-ch-band]')) button.setAttribute('aria-pressed', String(button.getAttribute('data-kp5-ch-band') === band));
    drawCharts();
}
onButtons('data-kp5-ch-band', applyBand);
onButtons('data-kp5-ch-few', (value) => {
    few = value;
    drawCharts();
});
