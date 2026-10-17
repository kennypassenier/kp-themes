// research/kpadopt5-ops: the demo's own wiring. The components are the package's (js/*.js, attached by js/auto.js); this file
// only feeds them sample data, presses their states and writes what they fire into a log.

import { masterDetail, setPaneState } from '../../js/master-detail.js';

/** @param {string} name @param {string} text */
const log = (name, text) => {
    const box = document.querySelector(`[data-ko-log="${name}"]`);
    if (!box) return;
    const lines = box.dataset.koLines ? JSON.parse(box.dataset.koLines) : [];
    lines.push(text);
    while (lines.length > 6) lines.shift();
    box.dataset.koLines = JSON.stringify(lines);
    box.textContent = lines.join('\n');
};

/** A radio-like group of demo buttons: press one, the others release. @param {Element} group @param {Element} button */
const press = (group, button) => {
    for (const b of group.querySelectorAll('button[aria-pressed]')) b.setAttribute('aria-pressed', String(b === button));
};

/** Wait for the module's attach (js/auto.js) of an element. @param {Element} el @param {() => unknown} get */
const until = (el, get) =>
    new Promise((resolve) => {
        const check = () => {
            const v = get();
            if (v) resolve(v);
            else requestAnimationFrame(check);
        };
        check();
    });

// ---------------------------------------------------------------- master-detail
const SECRETS = [
    ['production/database/replica-reader-credentials-for-the-reporting-service', 'Read-only login for the reporting replica', 'Mira Vandenberg'],
    ['production/mail/smtp-relay', 'Relay password for outgoing mail', 'Tom Lambrecht'],
    ['production/storage/backup-bucket-key', 'Access key for the nightly backup bucket', 'Mira Vandenberg'],
    ['staging/database/primary', 'Login for the staging database', 'Joke Peeters'],
    ['staging/queue/broker-token', 'Token for the staging message broker', 'Joke Peeters'],
    ['shared/monitoring/alert-webhook', 'Webhook address for the alert channel', 'Tom Lambrecht'],
    ['shared/ci/deploy-key', 'Deploy key used by the pipeline', 'Mira Vandenberg'],
    ['shared/dns/api-token', 'Token for the DNS provider', 'Joke Peeters'],
];
const HISTORY = [
    ['Changed by Mira Vandenberg', '12/10/2026 14:05'],
    ['Read by the reporting service', '12/10/2026 06:00'],
    ['Created by Tom Lambrecht', '03/05/2026 09:41'],
];

function initMasterDetail() {
    const roots = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-ko-md]')]);
    if (!roots.length) return;
    for (const root of roots) {
        const list = /** @type {HTMLElement} */ (root.querySelector('[data-ko-md-list]'));
        SECRETS.forEach(([name], at) => {
            const li = document.createElement('li');
            li.setAttribute('data-kp-pane-key', String(at));
            li.textContent = name;
            list.append(li);
        });
        const history = root.querySelector('[data-ko-md-history]');
        for (const [what, when] of HISTORY) {
            const li = document.createElement('li');
            li.innerHTML = '<span></span><small></small>';
            /** @type {HTMLElement} */ (li.firstElementChild).textContent = what;
            /** @type {HTMLElement} */ (li.lastElementChild).textContent = when;
            history?.append(li);
        }
    }
    /** @type {Map<HTMLElement, number>} */
    const timers = new Map();
    /** @param {HTMLElement} root @param {number} key */
    const fill = (root, key) => {
        const [name, about, owner] = SECRETS[key] ?? SECRETS[0];
        const heading = /** @type {HTMLElement} */ (root.querySelector('[data-kp-pane-heading]'));
        heading.textContent = name;
        const body = /** @type {HTMLElement} */ (root.querySelector('[data-ko-md-body]'));
        body.innerHTML =
            '<dl class="ko-fields"><dt>Purpose</dt><dd></dd><dt>Owner</dt><dd></dd><dt>Last changed</dt><dd>12/10/2026 14:05</dd><dt>Read</dt><dd>1,284 times</dd></dl>';
        const dds = body.querySelectorAll('dd');
        dds[0].textContent = about;
        dds[1].textContent = owner;
    };
    /** @param {HTMLElement} root @param {number} key */
    const load = (root, key) => {
        const md = masterDetail(root);
        if (!md) return;
        clearTimeout(timers.get(root));
        setPaneState(root, 'loading');
        timers.set(
            root,
            window.setTimeout(() => {
                fill(root, key);
                setPaneState(root, 'ready');
            }, 700),
        );
    };
    for (const root of roots) {
        const name = root.dataset.koMd ?? '';
        root.addEventListener('kp-pane-select', (e) => log('master-detail', `${name}: select ${/** @type {CustomEvent} */ (e).detail.key}`));
        root.addEventListener('kp-pane-open', (e) => {
            const key = Number(/** @type {CustomEvent} */ (e).detail.key);
            log('master-detail', `${name}: open ${key}`);
            load(root, key);
        });
        root.addEventListener('kp-pane-close', (e) => log('master-detail', `${name}: close ${/** @type {CustomEvent} */ (e).detail.pane}`));
        root.addEventListener('kp-pane-retry', () => {
            log('master-detail', `${name}: retry`);
            load(root, Number(masterDetail(root)?.key() ?? 0));
        });
        // Arrow keys change the detail without opening a folded pane: load what the selection moved to.
        root.addEventListener('kp-pane-select', (e) => {
            const key = /** @type {CustomEvent} */ (e).detail.key;
            if (key !== null && !masterDetail(root)?.narrow()) load(root, Number(key));
        });
    }
    for (const button of document.querySelectorAll('[data-ko-md-state]')) {
        button.addEventListener('click', async () => {
            const group = /** @type {Element} */ (button.closest('[role="group"]'));
            press(group, button);
            const state = /** @type {HTMLElement} */ (button).dataset.koMdState;
            for (const root of roots) {
                const md = /** @type {NonNullable<ReturnType<typeof masterDetail>>} */ (await until(root, () => masterDetail(root)));
                clearTimeout(timers.get(root));
                if (state === 'empty') {
                    md.select(null);
                    md.close();
                    setPaneState(root, 'empty');
                } else {
                    if (md.key() === null) md.select('0');
                    const key = Number(md.key());
                    fill(root, key);
                    if (state === 'ready') setPaneState(root, 'ready');
                    else if (state === 'loading') setPaneState(root, 'loading');
                    else setPaneState(root, 'error', { text: 'The vault did not answer. Nothing was changed.' });
                }
            }
        });
    }
    for (const button of document.querySelectorAll('[data-ko-md-narrow]')) {
        button.addEventListener('click', () => {
            press(/** @type {Element} */ (button.closest('[role="group"]')), button);
            for (const root of roots) root.setAttribute('data-kp-narrow', /** @type {HTMLElement} */ (button).dataset.koMdNarrow ?? 'one-pane');
        });
    }
}

initMasterDetail();
