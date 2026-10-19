// Sections 10 to 18: signing in, secrets.
import { attachAll } from '../../js/auto.js';
import { setPasskeys } from '../../js/passkeys.js';
import { setQr } from '../../js/qr.js';
import { hideSecret, revealSecret } from '../../js/patterns.js';
import { undoToast } from '../../js/undo-toast.js';
import { setPaneState, masterDetail } from '../../js/master-detail.js';
import { deplist } from '../../js/deplist.js';
import { setMatrix } from '../../js/heat.js';
import { setStatus, countStatus } from '../../js/statusrow.js';
import { ready, byId, say, stateButtons, pressed, esc, wait, dateTime, NOW, DAY, HOUR, MIN, count } from './common.js';

// ── 10 · passkeys ─────────────────────────────────────────────────────────────────────────────────────────────────
const KEYS_ALL = () => [
    { key: 'pk-garuda', label: 'Garuda laptop', kind: /** @type {'passkey'} */ ('passkey'), createdAt: NOW - 46 * DAY, lastUsedAt: NOW - 12 * MIN, current: true },
    { key: 'pk-pixel', label: 'Pixel phone', kind: /** @type {'passkey'} */ ('passkey'), createdAt: NOW - 31 * DAY, lastUsedAt: NOW - 3 * DAY },
    { key: 'pk-old', label: 'Old laptop', kind: /** @type {'passkey'} */ ('passkey'), createdAt: NOW - 301 * DAY, lastUsedAt: NOW - 140 * DAY },
    { key: 'pk-yubi', label: 'YubiKey 5C', kind: /** @type {'passkey'} */ ('passkey'), createdAt: NOW - 20 * DAY, lastUsedAt: null },
];

async function passkeysSection() {
    const el = byId('hl-pk-list');
    if (!el) return;
    await ready;
    /** @type {ReturnType<typeof KEYS_ALL>} */
    let rows = KEYS_ALL();
    const draw = () => {
        const data = pressed('data-hl-pk-data') || 'ready';
        const one = pressed('data-hl-pk-ways') === 'one';
        const last = /** @type {'refuse' | 'confirm' | 'off'} */ (pressed('data-hl-pk-last') || 'refuse');
        const confirm = /** @type {'dialog' | 'type-name'} */ (pressed('data-hl-pk-confirm') || 'dialog');
        const shown = one ? rows.filter((r) => r.current) : rows;
        const line = byId('hl-pk-line');
        if (line)
            line.textContent = `Removing the last way in is ${last === 'refuse' ? 'refused' : last === 'confirm' ? 'allowed behind the typed name' : 'treated like any other removal'}; a removal is confirmed ${confirm === 'dialog' ? 'in a dialog' : 'by typing the name'}.`;
        setPasskeys(el, {
            rows: data === 'empty' ? [] : shown,
            state: data === 'loading' ? 'loading' : data === 'error' ? 'error' : data === 'empty' ? 'empty' : 'ready',
            message: 'The host did not answer in 20 s. Nothing was changed.',
            register: true,
            retry: true,
            insecure: data === 'insecure',
            protectLast: last,
            confirm,
            neverUsedAfter: 90,
            remove: async (row) => {
                say('hl-pk-log', `DELETE /api/passkeys/${row.key}`);
                await wait(500);
                rows = rows.filter((r) => r.key !== row.key);
            },
            rename: async (row, label) => {
                say('hl-pk-log', `PATCH /api/passkeys/${row.key} {"label":"${label}"} (sample answer: the chassis kit does not rename yet)`);
                await wait(300);
                rows = rows.map((r) => (r.key === row.key ? { ...r, label } : r));
            },
        });
    };
    el.addEventListener('kp-passkeys-register', () => {
        say('hl-pk-log', 'Register: the page would start the browser\'s own passkey dialog.');
        rows = [{ key: `pk-${rows.length}`, label: 'New passkey', kind: 'passkey', createdAt: Date.now(), lastUsedAt: Date.now() }];
        draw();
    });
    el.addEventListener('kp-passkeys-retry', () => {
        say('hl-pk-log', 'Retry: reading the passkeys again.');
        const was = pressed('data-hl-pk-data');
        setPasskeys(el, { state: 'loading' });
        setTimeout(() => {
            void was;
            document.querySelector('[data-hl-pk-data="ready"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }, 1200);
    });
    for (const a of ['data-hl-pk-data', 'data-hl-pk-ways', 'data-hl-pk-last', 'data-hl-pk-confirm']) stateButtons(a, () => { if (a === 'data-hl-pk-ways') rows = KEYS_ALL(); draw(); });
    draw();
}

// ── 11 · tokens ───────────────────────────────────────────────────────────────────────────────────────────────────
async function tokensSection() {
    const el = byId('hl-tk-list');
    if (!el) return;
    await ready;
    const scopeBox = /** @type {HTMLElement} */ (byId('hl-tk-scopes'));
    const madeBox = /** @type {HTMLElement} */ (byId('hl-tk-made'));
    const base = () => [
        { key: 'tk-cli', label: 'homelab CLI', kind: /** @type {'token'} */ ('token'), createdAt: NOW - 51 * DAY, lastUsedAt: NOW - 4 * MIN, scope: 'operate' },
        { key: 'tk-kyu', label: 'kyu-runner', kind: /** @type {'token'} */ ('token'), createdAt: NOW - 22 * DAY, lastUsedAt: NOW - 38 * MIN, scope: 'operate' },
        { key: 'tk-grafana', label: 'grafana', kind: /** @type {'token'} */ ('token'), createdAt: NOW - 90 * DAY, lastUsedAt: NOW - 2 * HOUR, scope: 'read' },
    ];
    const legacy = () => ({ key: 'tk-legacy', label: 'Legacy token (HOMELAB_TOKEN)', kind: /** @type {'token'} */ ('token'), createdAt: NOW - 400 * DAY, lastUsedAt: NOW - 9 * DAY, scope: 'all' });
    let rows = base();
    const draw = () => {
        const cleared = pressed('data-hl-tk-legacy') === 'cleared';
        const list = cleared ? rows : [...rows, legacy()];
        setPasskeys(el, {
            rows: list,
            register: false,
            protectLast: 'off',
            markCurrent: false,
            neverUsedAfter: 90,
            remove: async (row) => {
                if (row.key === 'tk-legacy') throw new Error('Cleared over ssh only: the dashboard may not remove it.');
                say('hl-tk-log', `DELETE /api/tokens/${row.key}`);
                await wait(400);
                rows = rows.filter((r) => r.key !== row.key);
                drawScopes();
            },
        });
        drawScopes();
        drawMade();
    };
    const drawScopes = () => {
        const cleared = pressed('data-hl-tk-legacy') === 'cleared';
        const list = cleared ? rows : [...rows, legacy()];
        scopeBox.innerHTML = `<h4 class="hl-comp__title">Scope</h4>${list.map((r) => `<div class="hl-tokens__scope"><span>${esc(r.label)}</span><span class="kp-badge">${r.scope}</span></div>`).join('')}`;
    };
    const drawMade = () => {
        const made = pressed('data-hl-tk-made') === 'made';
        madeBox.innerHTML = made
            ? `<h4 class="hl-comp__title">Shown once</h4><div class="kp-secret" data-kp-secret data-kp-secret-ttl="0" data-kp-secret-label="New token for grafana" data-kp-secret-value="hl_pat_Qe81mZt5RwV0aLp3Xc7NbT4yKs9Dh2Uj"></div><p class="hl-line">Copy it now: it is not shown again. The host keeps only its SHA-256.</p>`
            : `<h4 class="hl-comp__title">New token</h4><button type="button" class="kp-button kp-button--primary" id="hl-tk-make">Make a token</button><p class="hl-line">The value is shown once, when it is made.</p>`;
        void attachAll(madeBox).ready.then(() => {
            const f = madeBox.querySelector('[data-kp-secret]');
            if (f && made) revealSecret(f);
        });
        madeBox.querySelector('#hl-tk-make')?.addEventListener('click', () => document.querySelector('[data-hl-tk-made="made"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    };
    stateButtons('data-hl-tk-made', drawMade);
    stateButtons('data-hl-tk-legacy', draw);
    draw();
}

// ── 12 · QR ───────────────────────────────────────────────────────────────────────────────────────────────────────
async function qrSection() {
    const el = byId('hl-qr');
    if (!el) return;
    await ready;
    const LINK = 'https://admin.kp-soft.dev/settings?section=sign-in&register=7Hq2k9Wm';
    const draw = () => {
        const state = pressed('data-hl-qr-state') || 'ready';
        el.setAttribute('data-kp-qr-modules', pressed('data-hl-qr-modules') || 'square');
        el.setAttribute('data-kp-qr-reveal', pressed('data-hl-qr-reveal') || 'shown');
        el.setAttribute('data-kp-qr-retry', '');
        if (state === 'loading') setQr(el, { state: 'loading' });
        else if (state === 'error') setQr(el, { state: 'error', message: 'The host could not make a registration link.' });
        else {
            el.setAttribute('data-kp-qr-expires', state === 'expired' ? new Date(Date.now() - 1000).toISOString() : new Date(Date.now() + 10 * MIN).toISOString());
            setQr(el, { value: LINK, state: 'ready' });
        }
    };
    el.addEventListener('kp-qr-copy', () => say('hl-qr-log', 'Copied the link.'));
    el.addEventListener('kp-qr-expired', () => say('hl-qr-log', 'The code expired and was withdrawn.'));
    el.addEventListener('kp-qr-retry', () => {
        say('hl-qr-log', 'Making a new link...');
        setQr(el, { state: 'loading' });
        setTimeout(() => document.querySelector('[data-hl-qr-state="ready"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true })), 1000);
    });
    for (const a of ['data-hl-qr-state', 'data-hl-qr-modules', 'data-hl-qr-reveal']) stateButtons(a, draw);
    draw();
}

// ── 13 · reveal ───────────────────────────────────────────────────────────────────────────────────────────────────
const SECRET_ROWS = [
    ['traefik', 'gateway/traefik/.env', 'TRAEFIK_TOKEN', 'hl_tr_9Vb2KqL7mXc4ZtR8sWb3'],
    ['paperless', 'paperless/.env', 'POSTGRES_PASSWORD', 'pg-Kd82-hQ4z-LmX9-TvR1'],
    ['vaultwarden', 'vaultwarden/.env', 'ADMIN_TOKEN', '$argon2id$v=19$m=65540,t=3,p=4$Qe81'],
    ['immich', 'immich/.env', 'DB_PASSWORD', 'im-4Zt5-RwV0-aLp3-Xc7N'],
    ['grafana', 'metrics/grafana/.env', 'GF_SECURITY_ADMIN_PASSWORD', ''],
];

async function revealSection() {
    const list = byId('hl-rv-list');
    if (!list) return;
    await ready;
    /** @type {(() => void) | null} */
    let off = null;
    const draw = () => {
        off?.();
        const hold = pressed('data-hl-rv-on') === 'hold' ? ' data-kp-secret-reveal-on="hold"' : '';
        list.innerHTML = SECRET_ROWS.map(([stack, file, key, value], i) => {
            const label = `${file} ${key}`;
            const off = value === '' ? ' data-kp-secret-disabled="Locked while a write is staged for metrics"' : '';
            return `<div class="hl-secret-row"><div class="hl-secret-row__name"><span class="kp-idmark kp-idmark--sm" data-kp-idmark="${stack}" aria-hidden="true"></span><span class="hl-secret-row__what"><b>${esc(file)}</b><code class="hl-key">${key}</code></span></div><div class="hl-secret-row__field"><div class="kp-secret" data-kp-secret data-kp-secret-ttl="30" data-kp-secret-mask="12" data-kp-secret-label="${esc(label)}" data-hl-ref="${i}"${hold}${off}></div><p class="hl-line hl-secret-row__audit" id="hl-rv-audit-${i}"></p></div></div>`;
        }).join('');
        off = attachAll(list);
        say('hl-rv-log', 'Nothing read yet.');
    };
    /** @param {number} i @param {string} text */
    const audit = (i, text) => {
        if ((pressed('data-hl-rv-audit') || 'row') === 'row') say(`hl-rv-audit-${i}`, text);
        const log = byId('hl-rv-log');
        if (log) log.textContent = `${text}\n${log.textContent === 'Nothing read yet.' ? '' : log.textContent}`.trim();
    };
    list.addEventListener('kp-secret-request', (e) => {
        const field = /** @type {HTMLElement} */ (e.target);
        const i = Number(field.getAttribute('data-hl-ref'));
        const { respond, fail, purpose } = /** @type {CustomEvent} */ (e).detail;
        e.preventDefault();
        setTimeout(() => {
            if ((pressed('data-hl-rv-reads') || 'work') === 'fail') {
                fail(new Error('The vault is sealed until it is unlocked on pve.'));
                return;
            }
            respond(SECRET_ROWS[i][3]);
            audit(i, `Kenny ${purpose === 'copy' ? 'copied' : 'revealed'} ${SECRET_ROWS[i][1]} ${SECRET_ROWS[i][2]} on ${dateTime(Date.now())}`);
        }, 700);
    });
    byId('hl-rv-hideall')?.addEventListener('click', () => {
        for (const f of list.querySelectorAll('[data-kp-secret]')) hideSecret(f);
        say('hl-rv-log', `Hidden all.\n${byId('hl-rv-log')?.textContent ?? ''}`.trim());
    });
    for (const a of ['data-hl-rv-on', 'data-hl-rv-reads', 'data-hl-rv-audit']) stateButtons(a, draw);
    draw();
}

// ── 14 · master-detail ────────────────────────────────────────────────────────────────────────────────────────────
const STACKS = [
    ['traefik', 6], ['paperless', 5], ['vaultwarden', 4], ['immich', 5], ['jellyfin', 3], ['grafana', 4], ['prometheus', 2], ['loki', 2], ['kyu', 7], ['almanac', 4], ['syncthing', 1],
];
const KEYS_OF = (/** @type {string} */ s) => {
    const n = Number(STACKS.find((x) => x[0] === s)?.[1] ?? 0);
    const names = ['TOKEN', 'DB_PASSWORD', 'ADMIN_TOKEN', 'SECRET_KEY', 'SMTP_PASSWORD', 'API_KEY', 'REDIS_PASSWORD'];
    return names.slice(0, n).map((k, i) => ({ key: `${s.toUpperCase()}_${k}`, file: i < 3 ? `${s}/.env` : `${s}/secrets.env`, read: !(s === 'kyu' && i === 6) }));
};

async function masterSection() {
    const box = byId('hl-md-box');
    if (!box) return;
    await ready;
    /** @type {(() => void) | null} */
    let off = null;
    /** @type {string | null} */
    let current = null;
    let aside = true;
    const draw = async () => {
        off?.();
        const phone = pressed('data-hl-md-width') === 'phone';
        aside = (pressed('data-hl-md-aside') || 'shown') === 'shown';
        box.setAttribute('data-phone', String(phone));
        box.innerHTML = `<div class="kp-split kp-split--panes" data-kp-master-detail data-kp-pane-widths="${aside ? '15rem 1fr 18rem' : '15rem 1fr'}" data-kp-pane-history="off" id="hl-md-root"><section class="kp-split__pane" data-kp-pane="list" aria-label="Stacks"><ul class="kp-pane__list" role="listbox" aria-label="Stacks">${STACKS.map(([s, n]) => `<li role="option" data-kp-pane-key="${s}"><span class="hl-pane-item"><span class="kp-idmark kp-idmark--sm" data-kp-idmark="${s}" aria-hidden="true"></span><b>${s}</b><span class="kp-badge">${count(Number(n))}</span></span></li>`).join('')}</ul></section><section class="kp-split__pane" data-kp-pane="detail" aria-label="Keys of the stack"><h3 data-kp-pane-heading tabindex="-1"></h3><div class="kp-pane__body" id="hl-md-body"></div></section>${aside ? '<aside class="kp-split__pane" data-kp-pane="aside" aria-label="Change"><h3 class="hl-comp__title">Staged change</h3><p class="hl-line" id="hl-md-staged">Nothing staged. Paste a new value for a key and press Stage.</p><button type="button" class="kp-button" disabled data-kp-disabled-reason="Stage a key first">Write 0 keys</button></aside>' : ''}</div>`;
        off = attachAll(box);
        await off.ready;
        const root = /** @type {HTMLElement} */ (byId('hl-md-root'));
        root.addEventListener('kp-pane-select', (e) => {
            current = /** @type {CustomEvent} */ (e).detail.key;
            showKeys();
        });
        root.addEventListener('kp-pane-retry', () => {
            setPaneState(root, 'loading');
            setTimeout(() => {
                press0('ready');
            }, 1000);
        });
        applyData();
    };
    const press0 = (/** @type {string} */ v) => document.querySelector(`[data-hl-md-data="${v}"]`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const showKeys = () => {
        const root = /** @type {HTMLElement} */ (byId('hl-md-root'));
        if (!current) return;
        const heading = root.querySelector('[data-kp-pane-heading]');
        if (heading) heading.textContent = `${current} keys`;
        const body = /** @type {HTMLElement} */ (byId('hl-md-body'));
        body.innerHTML = `<ul class="hl-keyrows">${KEYS_OF(current).map((k) => `<li class="hl-keyrow"><span class="kp-idmark kp-idmark--xs" data-kp-idmark="${esc(k.file)}" aria-hidden="true"></span><span class="hl-keyrow__name"><b>${k.key}</b><code class="hl-key">${k.file}</code></span><span class="kp-badge ${k.read ? 'kp-badge--success' : 'kp-badge--destructive'}">${k.read ? 'read' : 'not read'}</span></li>`).join('')}</ul>`;
        void attachAll(body).ready;
        setPaneState(root, 'ready');
        say('hl-md-log', `Opened ${current}: ${count(KEYS_OF(current).length)} keys.`);
    };
    const applyData = () => {
        const root = /** @type {HTMLElement} */ (byId('hl-md-root'));
        const data = pressed('data-hl-md-data') || 'ready';
        if (data === 'loading') setPaneState(root, 'loading');
        else if (data === 'error') setPaneState(root, 'error', { title: 'The keys could not be read', text: 'The host did not answer. Nothing was changed.', actionLabel: 'Retry' });
        else if (data === 'empty') setPaneState(root, 'empty', { title: 'This stack has no secrets', text: 'No .env file with keys was found for it.' });
        else if (current) showKeys();
        else setPaneState(root, 'empty', { title: 'Pick a stack', text: 'Choose one in the list to read its keys.' });
    };
    stateButtons('data-hl-md-data', applyData);
    stateButtons('data-hl-md-width', draw);
    stateButtons('data-hl-md-aside', draw);
    draw();
    void masterDetail;
}

// ── 15 · write with undo ──────────────────────────────────────────────────────────────────────────────────────────
async function writeSection() {
    const main = byId('hl-wr-main');
    if (!main) return;
    await ready;
    /** @type {(() => void) | null} */
    let off = null;
    const steps = (/** @type {string[]} */ s) => `<ol class="kp-steplist" aria-label="Writing the keys" id="hl-wr-steps">${[['paste', 'Paste', 'The new values, into the drawer'], ['stage', 'Stage', 'Kept in the page until you write'], ['write', 'Write', 'Sent to the host, then the stack is restarted']].map(([id, t, n], i) => `<li class="kp-steplist__item" data-state="${s[i]}" data-kp-step-id="${id}"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">${t}</span><span class="kp-steplist__note">${n}</span></span></li>`).join('')}</ol>`;
    const draw = (/** @type {string[]} */ s = ['done', 'done', 'pending']) => {
        off?.();
        main.innerHTML = `<div class="hl-write__grid"><div class="hl-write__steps">${steps(s)}</div><div class="hl-write__act"><p class="hl-line">Staged for <b>gateway/traefik/.env</b>: TRAEFIK_TOKEN and CF_DNS_API_TOKEN.</p><p class="hl-line" id="hl-wr-mode">Leaving the page while the write is pending: ${({ commit: 'writes it now', cancel: 'cancels it', carry: 'carries the toast across an in-app navigation' })[pressed('data-hl-wr-leave') || 'commit']}. The host ${(pressed('data-hl-wr-host') || 'accepts') === 'accepts' ? 'accepts the write' : 'refuses the write'}.</p><div class="hl-actions"><button type="button" class="kp-button kp-button--primary" id="hl-wr-go">Write 2 keys</button><button type="button" class="kp-button" id="hl-wr-leave">Leave this page now</button></div><div class="hl-toastbed" id="hl-wr-bed"><p class="hl-toastbed__empty">The toast appears here, inside the page.</p></div></div></div>`;
        off = attachAll(main);
        byId('hl-wr-go')?.addEventListener('click', write);
        byId('hl-wr-leave')?.addEventListener('click', () => {
            say('hl-wr-log', `The page is left (an in-app navigation, "${pressed('data-hl-wr-leave')}" on a pending write).`);
            location.hash = `#left-${Date.now()}`;
        });
    };
    const setStep = (/** @type {string} */ id, /** @type {string} */ state) => main.querySelector(`[data-kp-step-id="${id}"]`)?.setAttribute('data-state', state);
    const write = () => {
        setStep('write', 'running');
        const bed = /** @type {HTMLElement} */ (byId('hl-wr-bed'));
        const refuse = (pressed('data-hl-wr-host') || 'accepts') === 'refuses';
        const leave = /** @type {'commit' | 'cancel' | 'carry'} */ (pressed('data-hl-wr-leave') || 'commit');
        say('hl-wr-log', 'Held back for 5 s; nothing has reached the host.');
        const t = undoToast('2 keys written to gateway/traefik/.env', {
            mode: 'defer',
            ms: 5000,
            clock: 'ring',
            key: 'Mod+Z',
            leave,
            region: bed,
            failed: 'Not written: the host refused the file.',
            commit: async () => {
                await wait(400);
                if (refuse) throw new Error('refused');
                say('hl-wr-log', 'PUT /api/secrets/gateway/.env\nTRAEFIK_TOKEN, CF_DNS_API_TOKEN written; traefik restarted.');
                setStep('write', 'done');
            },
            undo: () => {
                say('hl-wr-log', 'Undone: nothing was sent.');
                setStep('write', 'pending');
            },
            restore: () => {
                say('hl-wr-log', 'The host refused: the two keys are staged again.');
                setStep('write', 'failed');
            },
        });
        void t.done.then((r) => {
            if (r === 'left') say('hl-wr-log', 'The page was left while the write was pending: it was written now, not lost.');
        });
    };
    stateButtons('data-hl-wr-leave', () => draw());
    stateButtons('data-hl-wr-host', () => draw());
    draw();
}

// ── 16 · restart order ────────────────────────────────────────────────────────────────────────────────────────────
async function restartsSection() {
    const el = byId('hl-rs-list');
    if (!el) return;
    await ready;
    const ROWS = [
        { from: 'paperless', to: 'postgres', state: /** @type {'running'} */ ('running') },
        { from: 'paperless', to: 'redis', state: /** @type {'running'} */ ('running') },
        { from: 'immich', to: 'postgres', state: /** @type {'running'} */ ('running') },
        { from: 'immich', to: 'redis', state: /** @type {'stopped'} */ ('stopped') },
        { from: 'immich', to: 'immich-ml', state: /** @type {'running'} */ ('running') },
        { from: 'vaultwarden', to: 'traefik', state: /** @type {'running'} */ ('running') },
        { from: 'grafana', to: 'prometheus', state: /** @type {'unknown'} */ ('unknown') },
        { from: 'grafana', to: 'loki', state: /** @type {'running'} */ ('running') },
        { from: 'kyu', to: 'almanac', state: /** @type {'running'} */ ('running') },
        { from: 'almanac', to: 'kyu', state: /** @type {'running'} */ ('running') },
    ];
    const draw = () => {
        const state = pressed('data-hl-rs-state') || 'ready';
        el.setAttribute('data-kp-dep-order', pressed('data-hl-rs-order') || 'numbers');
        el.setAttribute('data-kp-dep-direction', pressed('data-hl-rs-dir') || 'from-reaches-to');
        el.setAttribute('data-kp-dep-heading', '{n} restarts when gateway/traefik/.env changes');
        el.setAttribute('data-kp-dep-link', '/stacks/{name}');
        el.setAttribute('data-kp-dep-states', '');
        el.setAttribute('data-kp-dep-empty', 'Nothing restarts when this file changes.');
        el.setAttribute('data-kp-dep-copy', '');
        el.setAttribute('data-kp-dep-rows', '8');
        const h = deplist(el);
        if (!h) return;
        const items = state === 'cycle' ? ROWS : ROWS.filter((r) => !(r.from === 'almanac'));
        if (state === 'loading') h.setState('loading');
        else if (state === 'empty') h.setState('empty');
        else if (state === 'error') h.setState('error', { message: 'The restart plan could not be read.' });
        else {
            h.set(items);
            h.setState('ready');
        }
    };
    el.addEventListener('kp-deplist-retry', () => {
        say('hl-rs-log', 'Retry: reading the restart plan again.');
        deplist(el)?.setState('loading');
        setTimeout(() => document.querySelector('[data-hl-rs-state="ready"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true })), 1000);
    });
    for (const a of ['data-hl-rs-state', 'data-hl-rs-order', 'data-hl-rs-dir']) stateButtons(a, draw);
    draw();
}

// ── 17 · uses map ─────────────────────────────────────────────────────────────────────────────────────────────────
async function usesSection() {
    const el = byId('hl-us-map');
    if (!el) return;
    await ready;
    /** @type {import('../../js/uses-map.js').UsesNode[]} */
    const files = [
        { key: 'traefik-env', label: 'gateway/traefik/.env', sub: 'CF_DNS_API_TOKEN, TRAEFIK_TOKEN', glyph: 'text' },
        { key: 'paperless-env', label: 'paperless/.env', sub: 'POSTGRES_PASSWORD, SECRET_KEY', glyph: 'text' },
        { key: 'immich-env', label: 'immich/.env', sub: 'DB_PASSWORD', glyph: 'text' },
        { key: 'restic-env', label: 'shared/restic.env', sub: 'RESTIC_PASSWORD', glyph: 'text' },
        { key: 'grafana-env', label: 'metrics/grafana/.env', sub: 'GF_SECURITY_ADMIN_PASSWORD', glyph: 'text' },
        { key: 'old-env', label: 'jellyfin/.env.old', sub: 'left over from the move', glyph: 'text', ghost: true, dashed: true },
    ];
    /** @type {import('../../js/uses-map.js').UsesNode[]} */
    const apps = ['traefik', 'paperless', 'paperless-db', 'immich', 'immich-db', 'grafana', 'restic (nightly round)'].map((a) => ({ key: a, label: a }));
    /** @type {Record<string, string[]>} */
    const uses = { 'traefik-env': ['traefik'], 'paperless-env': ['paperless', 'paperless-db'], 'immich-env': ['immich', 'immich-db'], 'restic-env': ['restic (nightly round)', 'paperless', 'immich'], 'grafana-env': ['grafana'], 'old-env': [] };
    const spec = {
        corner: 'file ↓ app →',
        rows: files,
        columns: apps,
        cell: (/** @type {string} */ r, /** @type {string} */ c) => (uses[r]?.includes(c) ? { tone: /** @type {'ok'} */ ('ok'), label: 'reads it' } : { tone: /** @type {'none'} */ ('none') }),
        countLabel: (/** @type {number} */ n) => `${n} ${n === 1 ? 'app' : 'apps'}`,
        sourcesLabel: 'Files',
        usersLabel: 'Apps',
    };
    const draw = () => {
        const state = pressed('data-hl-us-state') || 'ready';
        el.setAttribute('data-kp-lines-side', pressed('data-hl-us-side') || 'sources-left');
        el.setAttribute('data-kp-lines-shape', pressed('data-hl-us-shape') || 'curve');
        if (state === 'ready') setMatrix(el, { ...spec, view: 'lines' });
        else if (state === 'loading') setMatrix(el, { ...spec, view: 'lines', state: 'loading', skeleton: 5 });
        else if (state === 'empty') setMatrix(el, { view: 'lines', rows: [], columns: [], state: 'empty', message: 'No .env file is read by an app yet' });
        else setMatrix(el, { view: 'lines', rows: [], columns: [], state: 'error', message: 'The .env files could not be read' });
    };
    el.addEventListener('kp-uses-pin', (e) => say('hl-us-log', JSON.stringify({ key: /** @type {CustomEvent} */ (e).detail.key, pinned: /** @type {CustomEvent} */ (e).detail.pinned, related: /** @type {CustomEvent} */ (e).detail.related })));
    el.addEventListener('kp-uses-retry', () => {
        setMatrix(el, { ...spec, view: 'lines', state: 'loading', skeleton: 5 });
        setTimeout(() => document.querySelector('[data-hl-us-state="ready"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true })), 1200);
    });
    for (const a of ['data-hl-us-state', 'data-hl-us-side', 'data-hl-us-shape']) stateButtons(a, draw);
    draw();
}

// ── 18 · per-stack reads ──────────────────────────────────────────────────────────────────────────────────────────
async function readsSection() {
    const listEl = byId('hl-rd-list');
    if (!listEl) return;
    await ready;
    const NAMES = ['traefik', 'jellyfin', 'immich', 'paperless', 'vaultwarden', 'prometheus', 'grafana', 'loki', 'kyu', 'almanac', 'syncthing'];
    /** @type {Record<string, string>} */
    const WHY = { immich: 'The host did not answer in 20 s', kyu: 'The vault of CT 109 is sealed' };
    /** @type {(() => void) | null} */
    let off = null;
    /** @type {Record<string, string>} */
    let retryWhy = {};
    const sum = () => {
        const n = countStatus(listEl);
        const el = byId('hl-rd-sum');
        if (el) el.textContent = `${count(n.ok)} of ${count(n.total)} stacks read${n.failed ? `, ${count(n.failed)} failed` : ''}${n.loading ? `, ${count(n.loading)} reading` : ''}`;
    };
    const draw = () => {
        off?.();
        const mode = pressed('data-hl-rd-reads') || 'some';
        listEl.innerHTML = NAMES.map((n) => {
            const state = mode === 'all' ? 'ok' : mode === 'busy' ? 'loading' : n in WHY ? 'failed' : n === 'syncthing' ? 'empty' : 'ok';
            const detail = state === 'failed' ? WHY[n] : state === 'empty' ? 'This stack has no secrets file' : state === 'loading' ? 'Reading' : `${count(3 + (n.length % 5))} keys read`;
            return `<li class="kp-statusrow" data-state="${state}" data-kp-status-id="${n}"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label"><span class="kp-idmark kp-idmark--xs" data-kp-idmark="${n}" aria-hidden="true"></span> ${n}</span><span class="kp-statusrow__detail">${esc(detail)}</span></span></li>`;
        }).join('');
        off = attachAll(listEl);
        retryWhy = {};
        sum();
    };
    listEl.addEventListener('kp-status-retry', (e) => {
        const id = /** @type {CustomEvent} */ (e).detail.id;
        setStatus(listEl, id, { state: 'loading', detail: 'Reading again' });
        say('hl-rd-log', `Retry ${id}: reading only this stack again.`);
        sum();
        setTimeout(() => {
            if ((pressed('data-hl-rd-retry') || 'works') === 'works') setStatus(listEl, id, { state: 'ok', detail: `${count(4)} keys read` });
            else setStatus(listEl, id, { state: 'failed', detail: 'The host still did not answer (second try)' });
            sum();
        }, 1100);
    });
    void retryWhy;
    stateButtons('data-hl-rd-reads', draw);
    stateButtons('data-hl-rd-retry', () => say('hl-rd-log', 'The next Retry will ' + ((pressed('data-hl-rd-retry') || 'works') === 'works' ? 'work.' : 'fail again.')));
    draw();
}

export async function initSecrets() {
    await Promise.all([passkeysSection(), tokensSection(), qrSection(), revealSection(), masterSection(), writeSection(), restartsSection(), usesSection(), readsSection()]);
}
