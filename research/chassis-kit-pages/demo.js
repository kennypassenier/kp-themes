// research/chassis-kit-pages/demo.js: renders each section's stage from the kit's page functions, hydrates the components that are
// fed from script (problems, uptime, requests, passkeys, tab badges, connection) and wires the section's own controls and choices.
// A section is wired by its own elements: a page that holds only some of the sections (a lane) runs the same file.
import { attachAll } from '../../js/auto.js';
import { setProblems } from '../../js/problems.js';
import { setUptime } from '../../js/uptime.js';
import { setRequests, setRequestsState } from '../../js/request-inspector.js';
import { setIdmark } from '../../js/idmark.js';
import { setPasskeys } from '../../js/passkeys.js';
import { setTabbarBadge } from '../../js/tabbar.js';
import { setConnection } from '../../js/connection.js';
import { setCardState } from '../../js/card-state.js';
import { runFlashButton } from '../../js/flash.js';
import { toast } from '../../js/overlays.js';
import { DATA, NOW, app, shortcutSheet, palette, clientState, idleDays, agoWords, esc } from './kit.js';
import { statusPage, sectionsPage, clientsPage, manageDialog, issueDialog, onboardingPage, passkeysPage, qrPage, loginPage, errorPage, SAMPLE_TOKEN } from './kit-pages.js';

/** The choices Kenny set in the review dialog, kept across re-renders: id → value. @type {Record<string, string>} */
const choice = { 'problems-mode': 'each', 'list-look': 'table', 'remove-confirm': 'dialog' };

const sleep = (/** @type {number} */ ms) => new Promise((r) => setTimeout(r, ms));
/** @param {string} text */
const say = (text) => toast(text, { ms: 3200 });

/* ------------------------------------------------------------------------------------------------ the views -- */

/** @type {Record<string, (d: DOMStringMap, uid: string) => string>} */
const VIEWS = {
    'shell-bar'(d, uid) {
        const open = palette(`${uid}-open`, { open: true, page: 'clients' });
        const sheet = shortcutSheet(`${uid}-keys`, true);
        return app(uid, 'clients', `<div class="ck-pair">${open}${sheet}</div>`, { hotkey: true, page: 'clients' });
    },
    'shell-phone'(d, uid) {
        const counts = d.ckCount === 'none' ? {} : { clients: Number(d.ckCount) };
        const body = `<div class="kp-ops ck-ops"><header class="kp-ops__head kp-page-header"><div class="kp-page-header__inner"><div><h1 class="kp-page-header__title">Clients</h1><p class="kp-page-header__description">Every program that calls this service has its own token.</p></div></div></header>
        <div class="kp-ops__body"><section class="kp-card" data-kp-span="12"><h2 class="kp-card__title">Registered clients (${DATA.clients.length})</h2><ul class="kp-statuslist" aria-label="Clients">${DATA.clients
            .slice(0, 5)
            .map(
                (c) =>
                    `<li class="kp-statusrow" data-state="${c.active ? 'ok' : 'empty'}" data-kp-status-id="${esc(c.name)}"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">${esc(c.name)}</span><span class="kp-statusrow__detail">${!c.active ? 'revoked' : c.last_used_at ? `last used ${esc(agoWords(c.last_used_at))}` : 'not used yet'}</span></span></li>`,
            )
            .join('')}</ul></section></div></div>`;
        return app(uid, 'clients', body, { tabs: counts });
    },
    login: (d, uid) => loginPage(uid, { state: /** @type {any} */ (d.ckState), passkeys: d.ckPasskeys === 'on' }),
    'status-page': (d, uid) =>
        app(uid, 'status', statusPage(uid, { state: /** @type {any} */ (d.ckState), update: /** @type {any} */ (d.ckUpdate), problems: /** @type {any} */ (choice['problems-mode']) }), {
            tabs: { status: d.ckState === 'degraded' ? DATA.problems.length : null },
        }),
    'status-sections': (d, uid) => sectionsPage(uid, { state: /** @type {any} */ (d.ckState) }),
    'clients-list'(d, uid) {
        const state = d.ckState === 'idle' ? 'ready' : d.ckState;
        const body = clientsPage(uid, { state: /** @type {any} */ (state), filter: d.ckState === 'idle' ? 'idle' : '', cards: choice['list-look'] === 'cards' || d.ckWidth === 'phone' }) + issueDialog(`${uid}-issue`, { open: false });
        return app(uid, 'clients', body, { tabs: { clients: clientsIdle() || null } });
    },
    'clients-issue': (d, uid) => issueDialog(uid, { step: /** @type {any} */ (d.ckStep) }),
    'clients-manage'(d, uid) {
        const client = d.ckClient === 'revoked' ? DATA.clients.find((c) => !c.active) : DATA.clients[0];
        return manageDialog(uid, { client, requests: /** @type {any} */ (d.ckRequests) });
    },
    'clients-first': (d, uid) => app(uid, 'clients', onboardingPage(uid, { step: /** @type {any} */ (Number(d.ckStep)) }) + issueDialog(`${uid}-issue`, { open: false })),
    'passkeys-list': (d, uid) => app(uid, 'passkeys', passkeysPage(uid, { state: /** @type {any} */ (d.ckState), confirm: /** @type {any} */ (choice['remove-confirm']) })),
    'passkeys-qr': (d, uid) => app(uid, 'passkeys', qrPage(uid, { state: /** @type {any} */ (d.ckCode) })),
    'error-page': (d, uid) => errorPage(uid, { status: /** @type {any} */ (Number(d.ckStatus)) }),
};

/** How many clients need a look: the exact number on the Clients tab. */
const clientsIdle = () => DATA.clients.filter((c) => clientState(c) === 'idle').length;

/* ----------------------------------------------------------------------------------------------- hydration -- */

/** The captured requests in the inspector's own words. @param {boolean} [withTest] */
function requestsFor(withTest = false) {
    const list = DATA.requests.map((r) => ({
        at: r.at,
        method: r.method,
        path: r.path,
        status: r.status,
        headers: r.headers,
        body: r.body,
        bodyBytes: r.body_bytes,
        truncated: r.truncated,
        source: r.headers.some(([k]) => k === 'x-chassis-test') ? 'test' : 'client',
    }));
    if (withTest)
        list.unshift({ at: new Date(NOW).toISOString(), method: 'POST', path: '/v1/messages', status: 202, headers: [['authorization', '***'], ['content-type', 'application/json']], body: '{"hello":"from the dashboard"}', bodyBytes: 30, truncated: false, source: 'test' });
    return list;
}

/** @type {Map<Element, () => void>} */
const detaches = new Map();

/** @param {HTMLElement} stage */
async function hydrate(stage) {
    for (const box of stage.querySelectorAll('[data-ck-problems]')) {
        const items = JSON.parse(box.getAttribute('data-ck-problems') ?? '[]').map((/** @type {any} */ p, /** @type {number} */ i) => ({ key: `p${i}`, severity: i === 0 ? 'critical' : 'warning', ...p }));
        setProblems(/** @type {HTMLElement} */ (box), items);
    }
    for (const box of stage.querySelectorAll('[data-ck-idle]')) {
        const names = JSON.parse(box.getAttribute('data-ck-idle') ?? '[]');
        const show = document.createElement('button');
        show.type = 'button';
        show.className = 'kp-button';
        show.setAttribute('data-ck-filter-set', 'idle');
        show.textContent = 'Show them';
        setProblems(
            /** @type {HTMLElement} */ (box),
            names.length
                ? [
                      {
                          key: 'idle',
                          severity: 'warning',
                          what: `${names.length} ${names.length === 1 ? 'client has' : 'clients have'} not called in 30 days or more`,
                          why: names.join(', '),
                          remedy: 'Revoke the ones no program uses any more; a revoked token stops working at once.',
                          action: show,
                      },
                  ]
                : [],
        );
    }
    for (const el of stage.querySelectorAll('[data-ck-uptime]')) setUptime(/** @type {HTMLElement} */ (el), { label: 'inbox', periods: JSON.parse(el.getAttribute('data-ck-uptime') ?? '[]') });
    for (const el of stage.querySelectorAll('[data-ck-requests]')) {
        const host = /** @type {HTMLElement} */ (el);
        const state = host.getAttribute('data-ck-requests') ?? 'ready';
        host.addEventListener('kp-requests-retry', () => setRequestsState(host, 'ready'));
        host.addEventListener('kp-requests-test', () => say('Sent a test: it appears in the list.'));
        setRequests(host, state === 'empty' ? [] : requestsFor());
        if (state === 'loading') setRequestsState(host, 'loading');
        else if (state === 'empty') setRequestsState(host, 'empty');
        else if (state === 'error') setRequestsState(host, 'error', { message: 'The service did not answer.' });
        else setRequestsState(host, 'ready');
    }
    for (const el of stage.querySelectorAll('[data-ck-passkeys]')) {
        const { rows } = JSON.parse(el.getAttribute('data-ck-passkeys') ?? '{}');
        const mapped = rows.map((/** @type {any} */ r) => ({ key: r.id, label: r.label, kind: 'passkey', createdAt: Date.parse(r.created_at), lastUsedAt: r.last_used_at ? Date.parse(r.last_used_at) : null, current: Boolean(r.current) }));
        setPasskeys(/** @type {HTMLElement} */ (el), {
            now: () => NOW,
            markCurrent: true,
            protectLast: 'off',
            rows: mapped,
            remove: async () => {
                await sleep(500);
            },
            rename: async () => {
                await sleep(400);
            },
        });
    }
    for (const el of stage.querySelectorAll('[data-ck-secret]')) {
        el.addEventListener('kp-secret-request', (/** @type {Event} */ e) => {
            e.preventDefault();
            const { respond } = /** @type {CustomEvent} */ (e).detail;
            setTimeout(() => respond(SAMPLE_TOKEN), 450);
        });
    }
    for (const bar of stage.querySelectorAll('.ck-tabbar')) {
        const count = Number(/** @type {HTMLElement} */ (stage).dataset.ckCount);
        const tab = bar.querySelector('[data-kp-tab="clients"]');
        if (tab && Number.isFinite(count) && count > 0) setTabbarBadge(/** @type {HTMLElement} */ (tab), count);
    }
    for (const banner of stage.querySelectorAll('[data-kp-connection]')) {
        const s = stage.dataset.ckConnection ?? 'online';
        const b = /** @type {HTMLElement} */ (banner);
        if (s === 'reconnecting') setConnection(b, 'reconnecting', { pending: 3, attempt: 2 });
        else if (s === 'refused') setConnection(b, 'refused', { why: 'The service answered 503 to the last request.' });
        else if (s === 'offline') setConnection(b, 'offline', { pending: 3 });
        else setConnection(b, 'online');
    }
    for (const input of stage.querySelectorAll('.kp-palette[open] .kp-palette__input')) {
        if (stage.dataset.ckQuery === 'typed') {
            /** @type {HTMLInputElement} */ (input).value = 'rev ho';
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
    for (const card of stage.querySelectorAll('.kp-card[data-ck-card]')) {
        const state = card.getAttribute('data-kp-state') ?? 'ready';
        setCardState(/** @type {HTMLElement} */ (card), /** @type {any} */ (state), { words: 'Reading…', title: state === 'empty' ? 'Nothing to show yet' : 'This section could not be read', text: state === 'empty' ? 'It fills when the service has something to report.' : 'The service did not answer in time. Nothing was changed.', action: state === 'empty' ? undefined : 'Try again' });
    }
    for (const bar of stage.querySelectorAll('.kp-refresh')) {
        bar.addEventListener('kp-refresh', (/** @type {Event} */ e) => setTimeout(() => /** @type {CustomEvent} */ (e).detail.done(true), 350));
    }
    applyChoices(stage);
    // The idle filter, when the section opens on it.
    const pressed = stage.querySelector('[data-ck-filter][aria-pressed="true"]');
    if (pressed) filterBy(stage, /** @type {HTMLElement} */ (pressed).dataset.ckFilter ?? '');
}

/** What the filter figures search for in the table. */
const FILTER_WORDS = { 'in use': 'active', idle: 'idle', new: 'not used yet', revoked: 'revoked' };

/** @param {HTMLElement} stage @param {string} key */
function filterBy(stage, key) {
    const search = /** @type {HTMLInputElement | null} */ (stage.querySelector('[data-kp-datatable-search]'));
    for (const tile of stage.querySelectorAll('[data-ck-filter]')) tile.setAttribute('aria-pressed', String(tile.getAttribute('data-ck-filter') === key));
    if (!search) return;
    search.value = key ? (/** @type {Record<string,string>} */ (FILTER_WORDS)[key] ?? key) : '';
    search.dispatchEvent(new Event('input', { bubbles: true }));
}

/** The choices of the review dialog, applied to what is on screen. @param {ParentNode} root */
function applyChoices(root) {
    for (const el of root.querySelectorAll('[data-kp-problems]')) if (el.closest('[data-ck-view="status-page"]')) el.setAttribute('data-kp-problems-mode', choice['problems-mode']);
    for (const el of root.querySelectorAll('.kp-datatable')) {
        if (!el.closest('[data-ck-view="clients-list"]')) continue;
        if (choice['list-look'] === 'cards' || /** @type {HTMLElement | null} */ (el.closest('.ck-stage'))?.dataset.ckWidth === 'phone') el.setAttribute('data-kp-cards', '');
        else el.removeAttribute('data-kp-cards');
    }
    for (const el of root.querySelectorAll('[data-kp-passkeys]')) el.setAttribute('data-kp-confirm', choice['remove-confirm']);
}

/* ------------------------------------------------------------------------------------------------- render -- */

/** @param {HTMLElement} stage */
async function render(stage) {
    const view = stage.dataset.ckView ?? '';
    const make = VIEWS[view];
    if (!make) return;
    detaches.get(stage)?.();
    stage.innerHTML = make(stage.dataset, view);
    const detach = attachAll(stage);
    detaches.set(stage, () => /** @type {any} */ (detach)());
    await /** @type {any} */ (detach).ready;
    await hydrate(stage);
}

/** Set one control of a stage and draw it again. @param {HTMLElement} stage @param {string} key @param {string} value */
function setState(stage, key, value) {
    const prop = `ck${key[0].toUpperCase()}${key.slice(1)}`;
    stage.dataset[prop] = value;
    stage.setAttribute(`data-ck-${key}`, value);
    const section = stage.closest('[data-review-item]');
    for (const b of section?.querySelectorAll(`[data-ck-set="${key}"]`) ?? []) b.setAttribute('aria-pressed', String(b.getAttribute('data-ck-value') === value));
    return render(stage);
}

document.addEventListener('click', (event) => {
    const t = event.target instanceof Element ? event.target : null;
    if (!t) return;
    const control = t.closest('[data-ck-set]');
    if (control) {
        const stage = /** @type {HTMLElement | null} */ (document.getElementById(control.closest('[data-review-controls]')?.getAttribute('data-review-controls-for') ?? ''));
        if (stage) setState(stage, control.getAttribute('data-ck-set') ?? '', control.getAttribute('data-ck-value') ?? '');
        return;
    }
    const stage = /** @type {HTMLElement | null} */ (t.closest('.ck-stage'));
    if (!stage) return;
    const tile = t.closest('[data-ck-filter]');
    if (tile) {
        filterBy(stage, tile.getAttribute('aria-pressed') === 'true' ? '' : (tile.getAttribute('data-ck-filter') ?? ''));
        return;
    }
    const show = t.closest('[data-ck-filter-set]');
    if (show) {
        filterBy(stage, show.getAttribute('data-ck-filter-set') ?? '');
        return;
    }
    const manage = t.closest('[data-ck-manage]');
    if (manage) {
        event.preventDefault();
        openManage(stage, manage.getAttribute('data-ck-manage') ?? '');
        return;
    }
    const peek = t.closest('[data-ck-peek]');
    if (peek) {
        const input = /** @type {HTMLInputElement | null} */ (peek.closest('.kp-formgrid__row')?.querySelector('input'));
        if (input) {
            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            peek.textContent = show ? 'Hide' : 'Show';
            peek.setAttribute('aria-pressed', String(show));
        }
        return;
    }
    if (t.closest('[data-ck-retry], [data-kp-datatable-retry]')) {
        const key = stage.dataset.ckView === 'status-page' ? 'state' : 'state';
        setState(stage, key, 'healthy' === stage.dataset.ckState || stage.dataset.ckView === 'status-page' ? 'healthy' : 'ready');
        return;
    }
    const link = t.closest('a[href^="#"]');
    if (link && stage.contains(link)) {
        event.preventDefault();
        say(`Opens ${link.textContent?.trim() || 'the page'} in the real dashboard.`);
        return;
    }
    if (t.closest('.ck-logout')) say('Logs you out of this browser.');
    if (t.closest('[data-ck-back]')) say('Goes back one page in the browser.');
});

/** A modal manage dialog for one client, opened from the list. @param {HTMLElement} stage @param {string} id */
async function openManage(stage, id) {
    const client = DATA.clients.find((c) => c.id === id);
    if (!client) return;
    stage.querySelector('[data-ck-modal]')?.remove();
    const host = document.createElement('div');
    host.setAttribute('data-ck-modal', '');
    host.innerHTML = manageDialog(`${stage.dataset.ckView}-m`, { client, open: false });
    stage.append(host);
    const detach = attachAll(host);
    await /** @type {any} */ (detach).ready;
    await hydrate(host);
    const dialog = /** @type {HTMLDialogElement} */ (host.querySelector('dialog'));
    dialog.addEventListener('close', () => host.remove());
    dialog.showModal();
}

// A flash button runs a short piece of work and says how it went. The work here is a pause: the demo has no server.
document.addEventListener('click', (event) => {
    const b = event.target instanceof Element ? event.target.closest('[data-kp-flash-button]') : null;
    if (!b || b.hasAttribute('disabled')) return;
    const stage = /** @type {HTMLElement | null} */ (b.closest('.ck-stage'));
    const taken = stage?.dataset.ckStep === 'taken' && stage.dataset.ckView === 'clients-issue';
    const login = b.textContent?.includes('passkey');
    void runFlashButton(/** @type {HTMLElement} */ (b), async () => {
        await sleep(800);
        if (taken) return { error: 'A client named home-assistant already exists', remedy: 'Pick another name, or open that client.' };
        if (login) return { error: 'No passkey was offered', remedy: 'Use the login token below.' };
        const note = b.getAttribute('data-ck-toast');
        if (note) {
            say(note);
            return undefined;
        }
        if (b.hasAttribute('data-ck-send')) {
            const host = stage?.querySelector('[data-kp-requests]');
            if (host) setRequests(/** @type {HTMLElement} */ (host), requestsFor(true));
            return 'Sent';
        }
        return undefined;
    });
});

/** The client card of the issue dialog follows what is typed: name, topic, the mark, and the empty words when a field is empty. */
document.addEventListener('input', (event) => {
    const input = event.target instanceof HTMLInputElement ? event.target : null;
    const key = input?.getAttribute('data-ck-live-in');
    if (!input || !key) return;
    const dialog = input.closest('dialog');
    const card = dialog?.querySelector('[data-ck-live-card]');
    if (!card) return;
    const target = /** @type {HTMLElement | null} */ (card.querySelector(`[data-ck-live-${key}]`));
    if (target) target.textContent = input.value.trim() || (target.getAttribute('data-ck-empty') ?? '');
    const name = /** @type {HTMLInputElement | null} */ (dialog?.querySelector('[data-ck-live-in="name"]'));
    const mark = /** @type {HTMLElement | null} */ (card.querySelector('[data-ck-live-mark]'));
    if (mark) setIdmark(mark, name?.value.trim() || 'new client');
    card.classList.toggle('ck-prev--empty', !name?.value.trim());
});

document.addEventListener('submit', (event) => {
    const form = event.target;
    if (form instanceof HTMLFormElement && form.closest('.ck-stage')) event.preventDefault();
});

/** A choice of the review dialog: set it, and show it on every section it concerns. */
document.addEventListener('review:choice', (event) => {
    const d = /** @type {CustomEvent} */ (event).detail;
    if (!d || !(d.id in choice)) return;
    choice[d.id] = String(d.value);
    applyChoices(document);
});

// A client's idle days, for anyone who reads the page's own data.
globalThis.ckIdleDays = idleDays;

for (const stage of document.querySelectorAll('.ck-stage')) await render(/** @type {HTMLElement} */ (stage));
