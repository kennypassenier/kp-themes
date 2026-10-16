// research/kpadopt4 (data sections): what this page does that the package does not.
//   1. the sample data and the buttons that switch each section between its states;
//   2. the readouts under the live examples;
//   3. the mark table (every look at every size) and the freshness lines' moments.
// Everything drawn is drawn by the package's own functions.
import { setIdmark } from '../../js/idmark.js';
import { setStackbar, STACKBAR_RETRY_EVENT } from '../../js/stackbar.js';
import { setBullets, BULLETS_RETRY_EVENT } from '../../js/bullets.js';
import { setCode } from '../../js/code.js';
import { setAgo } from '../../js/freshness.js';

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

// ---- the freshness lines: a moment a few seconds ago -----------------------------------
for (const line of all('[data-dd-ago]')) setAgo(line, Date.now() - 4000);

// ---- 1 · the mark table -----------------------------------------------------------------
const table = one('[data-dd-mark-table]');
const sizes = ['xs', 'sm', '', 'lg', 'xl'];
const looks = [
    { name: 'Letters', className: '', who: 'Acme Logistics' },
    { name: 'Pattern', className: 'kp-idmark--pattern', who: 'media' },
    { name: 'Round', className: 'kp-idmark--round', who: 'Contoso' },
    { name: 'Corner glyph', className: 'kp-idmark--glyph', who: 'Brightline Health' },
    { name: 'Free hue', className: '', who: 'home-assistant', free: true },
];
table.append(
    Object.assign(document.createElement('b'), { textContent: 'Look' }),
    ...sizes.map((size) => Object.assign(document.createElement('b'), { textContent: size || 'md' })),
);
for (const look of looks) {
    table.append(Object.assign(document.createElement('span'), { className: 'dd-name', textContent: `${look.name} · ${look.who}` }));
    for (const size of sizes) {
        const cell = document.createElement('span');
        const mark = document.createElement('span');
        mark.className = ['kp-idmark', size ? `kp-idmark--${size}` : '', look.className].filter(Boolean).join(' ');
        if (look.free) mark.setAttribute('data-kp-idmark-hue', 'free');
        setIdmark(mark, look.who);
        cell.append(mark);
        table.append(cell);
    }
}

onButtons('data-dd-rename', (name) => {
    const mark = one('[data-dd-renamed]');
    mark.setAttribute('data-kp-idmark', name);
    setIdmark(mark, name);
    one('[data-dd-renamed-name]').textContent = name || 'No name on file';
});

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

// ---- 4 · the key-value grid's loading state ---------------------------------------------
const kv = one('[data-dd-kv-list]');
/** @type {Map<HTMLElement, Node[]>} */
const kvValues = new Map(all('dd', kv).map((dd) => [dd, [...dd.childNodes]]));
onButtons('data-dd-kv', (state) => {
    for (const [dd, nodes] of kvValues) {
        // The page knows how tall each value was, so its waiting line keeps that room (nothing under the list moves).
        dd.style.minBlockSize = state === 'loading' ? `${dd.getBoundingClientRect().height}px` : '';
        if (state === 'loading') {
            const wait = document.createElement('span');
            wait.className = 'kp-kv__wait';
            wait.append(Object.assign(document.createElement('span'), { className: 'kp-skeleton' }));
            dd.replaceChildren(wait);
        } else dd.replaceChildren(...nodes);
    }
    kv.toggleAttribute('aria-busy', state === 'loading');
});

// ---- 5 · the form rows ------------------------------------------------------------------
const retention = /** @type {HTMLInputElement} */ (one('#dd-retention'));
const retentionRow = one('[data-dd-retention]');
const retentionAside = one('[data-dd-retention-aside]');
retention.addEventListener('input', () => {
    retentionRow.setAttribute('data-kp-changed', '');
    retentionAside.replaceChildren(Object.assign(document.createElement('span'), { className: 'kp-badge kp-badge--info', textContent: 'Not saved' }));
});
one('[data-dd-save]').addEventListener('click', () => {
    retentionRow.removeAttribute('data-kp-changed');
    retentionAside.replaceChildren(Object.assign(document.createElement('span'), { textContent: 'Saved 16/10/2026 14:02' }));
});

// ---- 6 · the code blocks ----------------------------------------------------------------
const payload = JSON.stringify({
    topic: 'backup.done',
    id: 'msg-01J9ZK4Q7W',
    at: '2026-10-16T03:12:44Z',
    host: 'pve-01',
    ok: true,
    stats: { files: 18422, bytes: 87312650240, seconds: 1312.4 },
    volumes: ['media', 'photos', 'vault'],
    warnings: [],
    next: null,
    note: 'Nightly copy of every container volume to the NAS, checked after it is written; the NAS was asleep and was woken first.',
});
const request = Array.from({ length: 31 }, (_, i) =>
    i === 0
        ? 'POST /api/v1/notify HTTP/1.1'
        : i < 6
          ? ['Host: kyu.home.example.net', 'Content-Type: application/json', 'Authorization: Bearer ••••••••', 'X-Request-Id: 7c1e9f', ''][i - 1]
          : `line ${i}: {"step":${i},"state":"ok"}`,
).join('\n');
/** @param {string} state */
function drawCode(state) {
    const s = /** @type {any} */ (state);
    for (const el of [one('[data-dd-code-main]'), one('[data-dd-code-phone]')])
        setCode(el, {
            title: 'Payload',
            language: 'JSON',
            size: '612 B',
            lines: true,
            text: payload,
            state: s,
            message: state === 'error' ? 'Could not read the message: it was removed from the queue.' : undefined,
        });
    setCode(one('[data-dd-code-long]'), {
        title: 'Request',
        language: 'HTTP',
        size: '210 KB',
        text: request,
        maxLines: 8,
        truncated: { shown: '64 KB', total: '210 KB' },
        state: s,
    });
}
drawCode('ready');
onButtons('data-dd-code', drawCode);

// ---- 8 · the live numbers ---------------------------------------------------------------
/** @type {Record<string, { value: number, write: (n: number) => string }>} */
const numbers = {
    open: { value: 12, write: (n) => String(n) },
    requests: { value: 1204, write: (n) => new Intl.NumberFormat('en').format(n) },
    euro: { value: 1118204.75, write: (n) => `€ ${new Intl.NumberFormat('nl', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}` },
};
for (const button of all('[data-dd-tick]')) {
    button.addEventListener('click', () => {
        const [name, by] = (button.getAttribute('data-dd-tick') ?? '').split(':');
        const number = numbers[name];
        number.value = Math.round((number.value + Number(by)) * 100) / 100;
        const el = one(`[data-dd-tick-value="${name}"]`);
        // The page writes the new number as it always would (here as text, as a framework re-render does);
        // js/tick.js, attached by js/auto.js for [data-kp-tick], ticks from the number shown to it.
        el.textContent = number.write(number.value);
        one('[data-dd-readout="tick"]').textContent = `Written: ${Object.values(numbers)
            .map((n) => n.write(n.value))
            .join(' · ')}`;
    });
}
