// research/kpadopt5-people: what this page does that the package does not.
//   1. the sample messages;
//   2. the buttons that switch the conversation between its states and options (its options are attributes);
//   3. the pretend server (a message that fails to send).
// Everything drawn is drawn by the package's own functions.
import { setThread, THREAD_RETRY_EVENT, THREAD_ADD_EVENT, THREAD_ACTION_EVENT } from '../../js/thread.js';

/** @param {string} selector @param {ParentNode} [root] */
const all = (selector, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(selector)]);
const sleep = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Press one button of a group (aria-pressed), the others off. @param {HTMLElement} button */
function pressOnly(button) {
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
/** @type {import('../../js/thread.js').ThreadMessage[]} */
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
