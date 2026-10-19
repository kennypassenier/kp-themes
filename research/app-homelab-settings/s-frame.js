// Sections 19 to 24: the frame around every page.
import { attachAll } from '../../js/auto.js';
import { setConnection } from '../../js/connection.js';
import { setTabbarBadge, setTabbarBusy, setTabbarCurrent } from '../../js/tabbar.js';
import { registerShortcuts, configureShortcuts, renderShortcutSheet, ALTGR_KEYS } from '../../js/shortcuts.js';
import { setProblems } from '../../js/problems.js';
import { setCardState } from '../../js/card-state.js';
import { missingLedes } from '../../js/lede.js';
import { ready, byId, say, stateButtons, pressed, esc, wait, count, press } from './common.js';

const AREAS = [
    ['apps', 'Apps'],
    ['inbox', 'Inbox'],
    ['stacks', 'Stacks'],
    ['activity', 'Activity'],
    ['backups', 'Backups'],
    ['system', 'System'],
];

// ── 19 · connection ───────────────────────────────────────────────────────────────────────────────────────────────
async function connectionSection() {
    const box = byId('hl-cn-box');
    if (!box) return;
    await ready;
    /** @type {(() => void) | null} */
    let off = null;
    let attempt = 0;
    const apply = () => {
        const el = box.querySelector('[data-kp-connection]');
        if (!el) return;
        const state = /** @type {'online' | 'offline' | 'reconnecting' | 'back' | 'refused'} */ (pressed('data-hl-cn-state') || 'online');
        const pending = Number(pressed('data-hl-cn-jobs') || 0);
        /** @type {{ pending?: number, why?: string, attempt?: number }} */
        const detail = {};
        if (pending && state !== 'online') detail.pending = pending;
        if (state === 'refused') detail.why = 'host link down: connection refused (pve:8443)';
        if (state === 'reconnecting') detail.attempt = attempt || 2;
        setConnection(el, state, detail);
        const cap = byId('hl-cn-cap');
        if (cap) cap.textContent = `The live stream reports: ${state}${detail.pending ? `, ${count(detail.pending)} jobs waiting to be sent` : ', no jobs waiting'}.`;
    };
    const draw = () => {
        off?.();
        const place = pressed('data-hl-cn-place') || 'bottom';
        box.innerHTML = `<div class="hl-conn__page"><nav class="kp-nav" aria-label="Areas"><span class="kp-nav__brand">Homelab</span><ul class="kp-nav__links">${AREAS.map(([id, l], i) => `<li><a class="kp-nav__link" href="#${id}"${i === 2 ? ' aria-current="page"' : ''}>${l}</a></li>`).join('')}</ul></nav>${place === 'top' ? '' : ''}<div class="kp-connection" data-kp-connection data-kp-placement="${place}" data-kp-connection-source="app" data-kp-connection-grace="0" data-kp-retry-delays="off" data-kp-back-ms="3000"></div><div class="hl-conn__body"><h3>Stacks</h3><p class="hl-line" id="hl-cn-cap"></p><p class="hl-line">11 stacks on pve. The page keeps showing what it last read while the connection is gone.</p><ul class="hl-conn__rows">${['immich', 'jellyfin', 'paperless', 'vaultwarden'].map((s) => `<li><span class="kp-idmark kp-idmark--sm" data-kp-idmark="${s}" aria-hidden="true"></span><b>${s}</b><span class="kp-badge kp-badge--success">running</span></li>`).join('')}</ul></div></div>`;
        off = attachAll(box);
        void off.ready.then(apply);
    };
    box.addEventListener('kp-connection-retry', () => {
        attempt += 1;
        say('hl-cn-log', `Retry now (attempt ${attempt}): reconnecting the live stream...`);
        press('data-hl-cn-state', 'reconnecting');
        apply();
        void wait(1300).then(() => {
            press('data-hl-cn-state', 'back');
            apply();
            say('hl-cn-log', 'First message arrived: back, then online.');
            return wait(3300);
        }).then(() => {
            press('data-hl-cn-state', 'online');
            apply();
        });
    });
    box.addEventListener('kp-connection-state', (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        say('hl-cn-log', `Banner: ${d.previous} -> ${d.state}${d.pending ? `, ${count(d.pending)} jobs waiting` : ''}`);
    });
    stateButtons('data-hl-cn-state', apply);
    stateButtons('data-hl-cn-jobs', apply);
    stateButtons('data-hl-cn-place', draw);
    draw();
}

// ── 20 · folding bar and tab bar ──────────────────────────────────────────────────────────────────────────────────
async function navfoldSection() {
    const barBox = byId('hl-nf-bar');
    const phone = byId('hl-nf-phone');
    if (!barBox || !phone) return;
    await ready;
    /** @type {Array<() => void>} */
    let offs = [];
    const icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M3 14h7v7H3z"/><path d="M14 14h7v7h-7z"/></svg>';
    const badge = (/** @type {number} */ n) => (n > 0 ? ` <span class="kp-badge kp-badge--destructive hl-nf-badge">${count(n)}</span>` : '');
    const draw = () => {
        for (const o of offs.splice(0)) o();
        const n = Number(pressed('data-hl-nf-count') || 0);
        barBox.setAttribute('data-width', pressed('data-hl-nf-width') || 'medium');
        barBox.innerHTML = `<div class="hl-navs__label">Top bar</div><div class="hl-navs__frame"><div class="kp-nav-wrap"><nav class="kp-nav" data-kp-nav-fold aria-label="Areas"><span class="kp-nav__brand">Homelab</span><ul class="kp-nav__links">${AREAS.map(([id, l], i) => `<li${id === 'inbox' ? ' data-kp-nav-keep' : ''}><a class="kp-nav__link" href="#${id}" data-hl-area="${id}"${i === 0 ? ' aria-current="page"' : ''}>${l}${id === 'inbox' ? badge(n) : ''}</a></li>`).join('')}</ul></nav></div></div>`;
        const tabs = [['apps', 'Apps'], ['inbox', 'Inbox'], ['stacks', 'Stacks'], ['activity', 'Activity']];
        phone.innerHTML = `<div class="hl-navs__label">Phone</div><div class="hl-navs__phoneframe"><nav class="kp-tabbar kp-tabbar--static kp-tabbar--always" aria-label="Areas">${tabs.map(([id, l], i) => `<a class="kp-tabbar__tab" href="#${id}" data-kp-tab="${id}"${i === 0 ? ' aria-current="page"' : ''}><span class="kp-tabbar__icon">${icon}</span><span class="kp-tabbar__label">${l}</span></a>`).join('')}<button type="button" class="kp-tabbar__tab kp-tabbar__tab--more"><span class="kp-tabbar__icon kp-tabbar__icon--more" aria-hidden="true"></span><span class="kp-tabbar__label">More</span></button></nav></div>`;
        offs.push(attachAll(barBox), attachAll(phone));
        const bar = /** @type {HTMLElement} */ (phone.querySelector('.kp-tabbar'));
        void Promise.resolve().then(() => {
            setTabbarBadge(/** @type {Element} */ (bar.querySelector('[data-kp-tab="inbox"]')), n);
            setTabbarBusy(/** @type {Element} */ (bar.querySelector('[data-kp-tab="activity"]')), pressed('data-hl-nf-job') === 'running');
        });
    };
    const area = (/** @type {Event} */ e) => {
        const a = /** @type {HTMLElement} */ (e.target).closest('a[href^="#"]');
        if (!a) return;
        e.preventDefault();
        const id = a.getAttribute('data-hl-area') ?? a.getAttribute('data-kp-tab') ?? '';
        for (const l of barBox.querySelectorAll('.kp-nav__link')) l.toggleAttribute('aria-current', l.getAttribute('data-hl-area') === id);
        const bar = phone.querySelector('.kp-tabbar');
        if (bar) setTabbarCurrent(bar, id);
        say('hl-nf-log', `Opened ${id}.`);
    };
    barBox.addEventListener('click', area);
    phone.addEventListener('click', area);
    barBox.addEventListener('kp-nav-fold', (e) => say('hl-nf-log', `Folded behind More: ${/** @type {CustomEvent} */ (e).detail.folded?.length ?? 0} links.`));
    stateButtons('data-hl-nf-width', draw);
    stateButtons('data-hl-nf-count', draw);
    stateButtons('data-hl-nf-job', draw);
    draw();
}

// ── 21 · slim rail ────────────────────────────────────────────────────────────────────────────────────────────────
async function sidenavSection() {
    const shell = byId('hl-sn-shell');
    if (!shell) return;
    await ready;
    /** @type {(() => void) | null} */
    let off = null;
    const item = (/** @type {string} */ icon, /** @type {string} */ label, /** @type {boolean} */ cur = false, /** @type {number} */ n = 0) =>
        `<li><a class="kp-sidenav__link" href="#${label.toLowerCase().replace(/\W+/g, '-')}"${cur ? ' aria-current="page"' : ''}><span class="kp-sidenav__icon" aria-hidden="true">${icon}</span><span class="kp-sidenav__label">${label}</span>${n ? `<span class="kp-sidenav__badge">${count(n)}</span>` : ''}</a></li>`;
    const draw = () => {
        off?.();
        const collapsed = (pressed('data-hl-sn-rail') || 'collapsed') === 'collapsed';
        const hover = pressed('data-hl-sn-open') === 'hover' ? ' data-kp-sidenav-expand-on-hover data-kp-sidenav-hover-delay="150"' : '';
        const acc = pressed('data-hl-sn-groups') === 'accordion' ? ' data-kp-sidenav-accordion' : '';
        shell.innerHTML = `<nav class="kp-sidenav hl-rail" id="hl-sn-nav" aria-label="System pages" data-kp-sidenav-slim${collapsed ? ' data-kp-sidenav-slim-collapsed' : ''}${hover}${acc}><div class="kp-sidenav__header"><p class="kp-sidenav__title" data-kp-sidenav-slim-hide>System</p><p class="kp-sidenav__title" data-kp-sidenav-slim-show aria-hidden="true">S</p></div><div class="kp-sidenav__scroll"><ul class="kp-sidenav__list">${item('▣', 'Host')}${item('∿', 'Metrics', true)}${item('◎', 'Map')}${item('▤', 'Firewall')}${item('⚙', 'Host settings', false, 2)}${item('›_', 'Console')}<li><hr class="kp-sidenav__divider" /></li><li class="kp-sidenav__category" data-kp-sidenav-expanded><button type="button" class="kp-sidenav__category-toggle"><span class="kp-sidenav__icon" aria-hidden="true">⚿</span><span class="kp-sidenav__label">Sign-in and notices</span></button><div class="kp-sidenav__submenu"><ul class="kp-sidenav__list">${item('', 'Sign-in')}${item('', 'Presets')}${item('', 'Notification rules', false, 14)}</ul></div></li></ul></div><div class="kp-sidenav__footer"><button type="button" class="kp-sidenav__link" data-kp-sidenav-slim-toggle aria-controls="hl-sn-nav"><span class="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-hide>«</span><span class="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-show>»</span></button></div></nav><div class="hl-rail__page"><header class="kp-page-header"><div class="kp-page-header__inner"><div><h3 class="kp-page-header__title">Metrics</h3><p class="kp-page-header__description">CPU, memory and disks of pve and the containers, read from Prometheus on CT 113.</p></div></div></header><div class="hl-rail__tiles"><div class="kp-card"><div class="kp-card__stage"><b>CPU</b><p class="hl-line">12 % of 8 cores</p></div></div><div class="kp-card"><div class="kp-card__stage"><b>Memory</b><p class="hl-line">41 GB of 64 GB</p></div></div><div class="kp-card"><div class="kp-card__stage"><b>HDD18TB</b><p class="hl-line">71 % full</p></div></div></div></div>`;
        off = attachAll(shell);
    };
    shell.addEventListener('click', (e) => {
        const a = /** @type {HTMLElement} */ (e.target).closest('a.kp-sidenav__link');
        if (!a) return;
        e.preventDefault();
        say('hl-sn-log', `Opened ${a.querySelector('.kp-sidenav__label')?.textContent}.`);
    });
    shell.addEventListener('kp-sidenav-slim', (e) => say('hl-sn-log', `Rail ${/** @type {CustomEvent} */ (e).detail?.collapsed ? 'collapsed to icons' : 'open'}.`));
    for (const a of ['data-hl-sn-rail', 'data-hl-sn-open', 'data-hl-sn-groups']) stateButtons(a, draw);
    draw();
}

// ── 22 · shortcuts ────────────────────────────────────────────────────────────────────────────────────────────────
async function shortcutsSection() {
    const main = byId('hl-kb-main');
    if (!main) return;
    await ready;
    /** @type {Array<() => void>} */
    let stops = [];
    /** @type {string[]} */
    let warnings = [];
    let revealed = false;
    let tab = 'Overview';
    const page = () => pressed('data-hl-kb-page') || 'stacks';
    const logLines = (/** @type {string} */ extra) => {
        const base = warnings.length ? `Registration warnings:\n${warnings.join('\n')}\n` : 'Registration: no key needs AltGr on a Belgian AZERTY keyboard.\n';
        say('hl-kb-log', base + extra);
    };
    const go = (/** @type {string} */ where) => logLines(`Mock: the page would open ${where}.`);
    const GO = [['u', 'Apps'], ['i', 'Inbox'], ['s', 'Stacks'], ['a', 'Activity'], ['b', 'Backups'], ['y', 'System'], ['e', 'Host settings'], ['x', 'Console']];
    const draw = () => {
        for (const s of stops.splice(0)) s();
        warnings = [];
        const keys = pressed('data-hl-kb-keys') || 'safe';
        configureShortcuts({ layoutGuard: 'warn', unknownHint: true, hintPlace: /** @type {'centre' | 'bottom-centre'} */ (pressed('data-hl-kb-cap') || 'bottom-centre'), onWarn: (m) => warnings.push(`- ${m}`), dev: false });
        document.documentElement.setAttribute('data-kp-shortcuts-hint', pressed('data-hl-kb-cap') || 'bottom-centre');
        main.innerHTML = `<div class="hl-keypage"><div class="hl-keypage__body"><header><h3 id="hl-kb-title">${page() === 'stacks' ? 'Stacks' : 'Secrets'}</h3><p class="hl-line">${page() === 'stacks' ? 'The keys of a stack page: open a tab by number.' : 'The keys of the Secrets page: r reveals the chosen key.'} The chord's cap stands ${(pressed('data-hl-kb-cap') || 'bottom-centre') === 'centre' ? 'in the middle of the screen' : 'at the foot, centred'}.</p></header><div class="kp-tabs hl-keytabs" role="tablist" aria-label="Stack tabs">${['Overview', 'Apps', 'Logs'].map((t) => `<span class="kp-badge${t === tab ? ' kp-badge--info' : ''}" data-hl-tab="${t}">${t}</span>`).join('')}</div><p class="hl-line" id="hl-kb-reveal">${page() === 'secrets' ? (revealed ? 'TRAEFIK_TOKEN: hl_tr_9Vb2KqL7mXc4 (shown)' : 'TRAEFIK_TOKEN: masked') : 'Nothing to reveal on this page.'}</p><div class="hl-keys-legend kp-keys"><span class="kp-keys__item"><kbd class="kp-kbd">g</kbd><kbd class="kp-kbd">s</kbd> Stacks</span><span class="kp-keys__item"><kbd class="kp-kbd">?</kbd> all keys</span><span class="kp-keys__item"><kbd class="kp-kbd">/</kbd> search</span></div></div><dialog class="kp-shortcuts hl-sheet" id="hl-kb-sheet" open data-kp-shortcuts data-kp-shortcuts-live data-kp-primary data-kp-shortcuts-group="Anywhere" aria-labelledby="hl-kb-sheet-t"><h3 class="kp-dialog__title" id="hl-kb-sheet-t">Keyboard shortcuts</h3></dialog></div>`;
        /** @type {import('../../js/shortcuts.js').Shortcut[]} */
        const anywhere = [
            ...GO.map(([k, w]) => ({ keys: `g ${k}`, what: `Go to ${w}`, group: 'Anywhere', run: () => go(w) })),
            { keys: '/', what: 'Search', group: 'Anywhere', run: () => logLines('Mock: the search field has the focus.') },
        ];
        /** @type {import('../../js/shortcuts.js').Shortcut[]} */
        const here = [
            ...[1, 2, 3].map((n) => ({
                keys: `Alt ${n}`,
                what: `Open stack tab ${n}`,
                group: 'On a stack page',
                when: () => page() === 'stacks',
                reason: 'Open a tab: only on a stack page',
                run: () => {
                    tab = ['Overview', 'Apps', 'Logs'][n - 1];
                    logLines(`Mock: opened the tab ${tab}.`);
                    for (const t of main.querySelectorAll('[data-hl-tab]')) t.classList.toggle('kp-badge--info', t.getAttribute('data-hl-tab') === tab);
                },
            })),
            {
                keys: 'r',
                what: 'Reveal the chosen key',
                group: 'On the Secrets page',
                when: () => page() === 'secrets',
                reason: 'Reveal: only on the Secrets page',
                run: () => {
                    revealed = !revealed;
                    const el = byId('hl-kb-reveal');
                    if (el) el.textContent = revealed ? 'TRAEFIK_TOKEN: hl_tr_9Vb2KqL7mXc4 (shown)' : 'TRAEFIK_TOKEN: masked';
                    logLines(`Mock: the key is ${revealed ? 'revealed (and the audit line is written)' : 'hidden'}.`);
                },
            },
            ...(keys === 'safe'
                ? [{ keys: ':', what: 'Focus the console prompt', group: 'On the Console page', when: () => false, reason: 'Console: only on the Console page', run: () => {} }]
                : [
                      { keys: 'Ctrl `', what: 'Open the console', group: 'Old keys', run: () => logLines('Mock: the console.') },
                      { keys: '[', what: 'Previous stack tab', group: 'Old keys', run: () => logLines('Mock: previous tab.') },
                      { keys: ']', what: 'Next stack tab', group: 'Old keys', run: () => logLines('Mock: next tab.') },
                  ]),
        ];
        for (const [scope, list] of /** @type {const} */ ([[main, anywhere], [main, here]])) {
            try {
                stops.push(registerShortcuts(scope, list, { dev: false }));
            } catch (error) {
                warnings.push(`- ${/** @type {Error} */ (error).message}`);
            }
        }
        const sheet = /** @type {HTMLElement} */ (byId('hl-kb-sheet'));
        void attachAll(main).ready.then(() => renderShortcutSheet(sheet));
        logLines(keys === 'safe' ? 'Press g then s.' : `AltGr keys known to the engine: ${ALTGR_KEYS.slice(0, 8).join(' ')} ...`);
    };
    const sim = async (/** @type {string} */ keys) => {
        for (const key of keys.split(' ')) {
            document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
            document.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
            await wait(140);
        }
    };
    for (const b of document.querySelectorAll('[data-hl-press]')) b.addEventListener('click', () => void sim(b.getAttribute('data-hl-press') ?? ''));
    for (const a of ['data-hl-kb-page', 'data-hl-kb-keys', 'data-hl-kb-cap']) stateButtons(a, draw);
    draw();
    void esc;
}

// ── 23 · problems and reasons ─────────────────────────────────────────────────────────────────────────────────────
async function problemsSection() {
    const band = byId('hl-pr-band');
    if (!band) return;
    await ready;
    const fix = (/** @type {string} */ label, /** @type {string} */ what) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'kp-button';
        b.textContent = label;
        b.addEventListener('click', () => say('hl-pr-log', `${label}: ${what}`));
        return b;
    };
    /** @returns {import('../../js/problems.js').Problem[]} */
    const all = () => [
        { key: 'backup-immich', severity: 'critical', what: 'The backups of immich failed two nights in a row', why: 'restic says the repository is locked by another process (since 18/10/2026 02:07).', remedy: 'Unlock the repository on pve, then run the backup again.', command: 'restic -r rclone:gdrive:homelab-backups/immich unlock', action: fix('Run the backup now', 'would start the job on pve') },
        { key: 'disk-hdd4tb', severity: 'critical', what: 'HDD4TB is 91 % full', why: 'The restic repositories grew 140 GB in the last 30 days.', remedy: 'Prune old snapshots or move the repositories to HDD18TB.', action: fix('Open Backups', 'would open the Backups page') },
        { key: 'cert', severity: 'warning', what: 'The certificate of kp-soft.dev expires in 9 days (28/10/2026)', why: 'Traefik could not renew it: the Cloudflare token is read-only.', remedy: 'Replace the token in the gateway .env.', action: fix('Open Secrets', 'would open gateway/traefik/.env') },
        { key: 'version', severity: 'warning', what: 'The dashboard and the host run different versions', why: 'Dashboard 3.75.0, host 3.74.2.', remedy: 'Update the host from the dashboard.', action: fix('Update the host', 'would open the update flow') },
        { key: 'loki', severity: 'warning', what: 'Loki has not received logs from kyu for 3 h', why: 'Alloy on CT 109 stopped after the last update.', remedy: 'Restart Alloy on CT 109.', action: fix('Restart Alloy', 'would restart alloy on CT 109') },
        { key: 'calendar', severity: 'info', what: 'The almanac calendar is not shared', why: 'Almanac cannot read it.', remedy: 'Share it with the service account.', action: fix('Open Almanac', 'would open the almanac page') },
    ];
    const draw = () => {
        const n = Number(pressed('data-hl-pr-count') || 0);
        const mode = pressed('data-hl-pr-mode') || 'each';
        band.setAttribute('data-kp-problems-mode', mode);
        band.setAttribute('data-kp-problems-fold-from', '5');
        const list = n === 2 ? all().slice(0, 2) : n === 6 ? all() : [];
        setProblems(band, list, { mode: /** @type {'each' | 'list' | 'fold'} */ (mode) });
        const b = /** @type {HTMLButtonElement} */ (byId('hl-pr-deploy'));
        const on = pressed('data-hl-pr-button') === 'on';
        b.disabled = !on;
        if (on) b.removeAttribute('data-kp-disabled-reason');
        else b.setAttribute('data-kp-disabled-reason', 'Nothing is staged yet: change a setting first');
        say('hl-pr-log', `${count(list.length)} problems shown, ${mode}.`);
    };
    for (const a of ['data-hl-pr-mode', 'data-hl-pr-count', 'data-hl-pr-button']) stateButtons(a, draw);
    byId('hl-pr-deploy')?.addEventListener('click', () => say('hl-pr-log', 'Deploy all changes: would start the job.'));
    draw();
}

// ── 24 · page states ──────────────────────────────────────────────────────────────────────────────────────────────
async function statesSection() {
    const main = byId('hl-st-main');
    if (!main) return;
    await ready;
    /** @type {(() => void) | null} */
    let off = null;
    const CARDS = [
        ['stacks', 'Stacks', 'Every stack of the fleet and whether it runs.', ['immich', 'jellyfin', 'paperless', 'vaultwarden', 'traefik'].map((s) => `<li class="hl-st-row"><span class="kp-idmark kp-idmark--sm" data-kp-idmark="${s}" aria-hidden="true"></span><b>${s}</b><span class="kp-badge kp-badge--success">running</span></li>`).join('')],
        ['backups', 'Last night\'s backups', 'What the nightly round of 19/10/2026 02:00 backed up.', ['immich 4.2 GB', 'paperless 1.1 GB', 'vaultwarden 12 MB', 'jellyfin 310 MB', 'traefik 3 MB'].map((s) => `<li class="hl-st-row"><b>${s.split(' ')[0]}</b><span>${s.split(' ')[1]} ${s.split(' ')[2] ?? ''}</span></li>`).join('')],
        ['disk', 'Disk space', 'How full the pools of pve are.', ['HDD18TB 71 %', 'HDD4TB 91 %', 'HDD2TB 38 %', 'rpool 54 %', 'SSD cache 12 %'].map((s) => `<li class="hl-st-row"><b>${s.split(' ')[0]}</b><span>${s.split(' ').slice(1).join(' ')}</span></li>`).join('')],
    ];
    const draw = () => {
        off?.();
        const missing = pressed('data-hl-st-lede') === 'missing';
        main.innerHTML = `<header class="hl-st-head"><h3>Overview</h3><p class="kp-lede" data-kp-lede-collapsible="90">The state of the homelab at a glance: what runs, what was backed up last night and how full the disks are. Every card reads from the host by itself and says when it could not.</p></header><div class="hl-st-grid" data-kp-lede-required>${CARDS.map(([id, t, d, rows]) => `<section class="kp-card" id="hl-st-${id}" data-kp-state="ready" aria-labelledby="hl-st-${id}-t"><div class="kp-card__header"><h4 class="kp-card__title" id="hl-st-${id}-t">${t}</h4></div>${id === 'disk' && missing ? '' : `<p class="kp-lede">${d}</p>`}<div class="kp-card__stage"><ul class="hl-st-list kp-card__data">${rows}</ul></div></section>`).join('')}</div>`;
        off = attachAll(main);
        void off.ready.then(apply);
    };
    const apply = () => {
        const state = /** @type {'ready' | 'loading' | 'empty' | 'error'} */ (pressed('data-hl-st-state') || 'ready');
        for (const card of main.querySelectorAll('.kp-card')) {
            if (state === 'empty') setCardState(/** @type {HTMLElement} */ (card), 'empty', { title: 'Nothing to show yet', text: 'The host has not reported anything for this card.' });
            else if (state === 'error') setCardState(/** @type {HTMLElement} */ (card), 'error', { title: 'Could not be read', text: 'The host did not answer in 20 s. Nothing was changed.' });
            else setCardState(/** @type {HTMLElement} */ (card), state);
        }
        const miss = missingLedes(main).map((h) => h.textContent);
        say('hl-st-guard', miss.length ? `${count(miss.length)} section has no description: ${miss.join(', ')}` : 'Every section has a description.');
        say('hl-st-log', `Cards: ${state}.`);
    };
    main.addEventListener('kp-card-retry', () => {
        say('hl-st-log', 'Try again: reading the cards.');
        for (const card of main.querySelectorAll('.kp-card')) setCardState(/** @type {HTMLElement} */ (card), 'loading');
        setTimeout(() => {
            press('data-hl-st-state', 'ready');
            apply();
        }, 1200);
    });
    stateButtons('data-hl-st-state', apply);
    stateButtons('data-hl-st-lede', () => {
        draw();
    });
    draw();
}

export async function initFrame() {
    await Promise.all([connectionSection(), navfoldSection(), sidenavSection(), shortcutsSection(), problemsSection(), statesSection()]);
}
