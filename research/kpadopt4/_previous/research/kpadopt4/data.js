// research/kpadopt4 (data sections, round 2: the share bar and the bullet rows): what this page does that the package
// does not.
//   1. the sample data and the buttons that switch each section between its states;
//   2. the readouts under the live examples, and a Retry that reads again.
// Everything drawn is drawn by the package's own functions. The sections Kenny approved in round 1 left the page
// (research/_review/README.md); their wiring is in _previous/ and in git at c1e907a8.
import { setStackbar, STACKBAR_RETRY_EVENT } from '../../js/stackbar.js';
import { setBullets, BULLETS_RETRY_EVENT } from '../../js/bullets.js';

/** @param {string} selector @param {ParentNode} [root] */
const all = (selector, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(selector)]);
/** @param {string} selector */
const one = (selector) => /** @type {HTMLElement} */ (document.querySelector(selector));

/** Press one button of a group (aria-pressed), the others off. @param {HTMLElement} button */
function pressOnly(button) {
    const group = button.closest('[role="group"]');
    for (const other of all('button[aria-pressed]', group ?? document)) other.setAttribute('aria-pressed', String(other === button));
}

/** @param {string} attr @param {(value: string) => void} run */
function onButtons(attr, run) {
    for (const button of all(`[${attr}]`)) {
        button.addEventListener('click', () => {
            if (button.hasAttribute('aria-pressed')) pressOnly(button);
            run(button.getAttribute(attr) ?? '');
        });
    }
}

// ---- 2 · the share bar ------------------------------------------------------------------
const gb = (/** @type {number} */ value) => `${new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(value)} GB`;
const disk = [
    { key: 'images', label: 'Docker images', value: 41 },
    { key: 'volumes', label: 'Container volumes', value: 18.5 },
    { key: 'snapshots', label: 'Snapshots', value: 12 },
    { key: 'logs', label: '/var/log', value: 6.5 },
    { key: 'system', label: 'System', value: 3.5 },
];
const over = [...disk.slice(0, 4), { key: 'system', label: 'System', value: 53 }];
const many = [
    ...disk,
    { key: 'cache', label: 'Package cache', value: 9 },
    { key: 'swap', label: 'Swap file', value: 8 },
    { key: 'home', label: '/home', value: 7 },
    { key: 'tmp', label: '/tmp', value: 1.2 },
    { key: 'core', label: 'Core dumps', value: 0.9 },
];
/** @param {string} state */
function drawBars(state) {
    for (const el of all('[data-dd-stackbar]')) {
        const main = el.getAttribute('data-dd-stackbar') === 'main' || el.getAttribute('data-dd-stackbar') === 'phone';
        const parts = state === 'over' ? over : state === 'many' ? many : disk;
        setStackbar(el, {
            title: main ? 'Root volume' : undefined,
            total: state === 'many' ? 150 : 120,
            format: gb,
            other: state === 'many' ? 0.02 : 0,
            parts,
            marks: main ? [{ at: 0.8, label: '80 %: the warning level' }] : [],
            legend: main,
            state: state === 'over' || state === 'many' ? 'ready' : /** @type {any} */ (state),
            message: state === 'error' ? 'The host did not answer: the disk could not be read.' : undefined,
        });
    }
}
drawBars('ready');
onButtons('data-dd-bar', drawBars);
// Retry reads again: the bar waits in its loading picture, then the parts arrive.
for (const el of all('[data-dd-stackbar]')) {
    el.addEventListener(STACKBAR_RETRY_EVENT, () => {
        pressOnly(one('[data-dd-bar="loading"]'));
        drawBars('loading');
        setTimeout(() => {
            pressOnly(one('[data-dd-bar="ready"]'));
            drawBars('ready');
        }, 1800);
    });
}
one('[data-dd-stackbar="main"]').addEventListener('kp-stackbar-pick', (event) => {
    const key = /** @type {CustomEvent} */ (event).detail.key;
    one('[data-dd-readout="stackbar"]').textContent = `Picked: ${disk.concat(many).find((part) => part.key === key)?.label ?? key}.`;
});

// ---- 3 · the bullet rows ----------------------------------------------------------------
const applications = [
    { key: 'a1', lead: 'Brightline Health', label: 'Data engineer', detail: 'second interview 21/10/2026 14:00', value: 4 },
    {
        key: 'a2',
        lead: 'Acme Logistics',
        label: 'Senior platform engineer, logistics data and integrations',
        detail: 'due since 02/10/2026',
        value: 31,
    },
    { key: 'a3', lead: 'Contoso', label: 'Backend developer (Rust)', detail: 'due since 11/10/2026', value: 22 },
    { key: 'a4', lead: 'Vereniging voor Duurzame Logistiek Vlaanderen', label: 'Project lead', detail: 'due since 15/10/2026', value: 18 },
    { key: 'a5', lead: 'Fabrikam', label: 'Site reliability engineer', detail: 'no follow-up needed', value: 9 },
    { key: 'a6', lead: 'Northwind', label: 'DevOps engineer', detail: 'no status record: no clock', value: null },
];
/** @param {string} state */
function drawBullets(state) {
    for (const el of all('[data-dd-bullets-list]')) {
        setBullets(el, {
            threshold: 14,
            bad: 21,
            format: (days) => `${days} d`,
            rows: applications.map((row) => ({ ...row, href: `#${row.key}` })),
            state: /** @type {any} */ (state),
            emptyTitle: 'Nothing to follow up.',
            emptyText: 'The clock starts when an application is sent.',
            message: 'Could not read the applications: the server did not answer.',
        });
    }
}
drawBullets('ready');
onButtons('data-dd-bullets', drawBullets);
for (const el of all('[data-dd-bullets-list]')) {
    el.addEventListener(BULLETS_RETRY_EVENT, () => {
        pressOnly(one('[data-dd-bullets="loading"]'));
        drawBullets('loading');
        setTimeout(() => {
            pressOnly(one('[data-dd-bullets="ready"]'));
            drawBullets('ready');
        }, 1800);
    });
    el.addEventListener('click', (event) => {
        const link = event.target instanceof Element ? event.target.closest('a.kp-bullets__link') : null;
        if (!link) return;
        event.preventDefault();
        one('[data-dd-readout="bullets"]').textContent = `Followed: ${link.textContent}.`;
    });
}
