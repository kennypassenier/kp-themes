// Sections 1 to 9: the Settings page.
import { unsavedSaved } from '../../js/unsaved.js';
import { setQuantity } from '../../js/quantity.js';
import { openConfirmation } from '../../js/components.js';
import { toast } from '../../js/overlays.js';
import { attachAll } from '../../js/auto.js';
import { ready, byId, say, stateButtons, pressed, esc, wait } from './common.js';
import { fieldOf, rowHtml, wire } from './settings-form.js';

/** Stage two edits the way a person would: the stepper to 2 and the log level to debug. @param {HTMLElement} scope */
function stageTwo(scope) {
    const q = scope.querySelector('#hl-row-backup_concurrency [data-kp-quantity]');
    if (q) {
        setQuantity(q, 2);
        q.dispatchEvent(new CustomEvent('kp-quantity-change', { bubbles: true, detail: { value: 2, previous: 3, source: 'button' } }));
    }
    const sel = /** @type {HTMLSelectElement | null} */ (scope.querySelector('select[name="log_level"]'));
    if (sel) {
        sel.value = 'debug';
        sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

// ── 1 · the Save bar ──────────────────────────────────────────────────────────────────────────────────────────────
const KEYS_1 = ['backup_hour', 'backup_concurrency', 'restic_snapshot_timeout_s', 'notify_webhook', 'dashboard_url', 'logs_window', 'log_level', 'exec_enabled'];
/** @type {Record<string, string>} */
const REFUSALS = {
    'Backups at once': 'The host allows at most 2 at once while a restore runs.',
    'Log level': 'The host only accepts warn, info or debug here.',
    'Nightly hour': 'A nightly round at that hour would overlap the restore drill.',
};

async function unsavedSection() {
    const scroll = byId('hl-unsaved-scroll');
    if (!scroll) return;
    await ready;
    const hostLine = byId('hl-unsaved-host-line');
    /** @type {(() => void)[]} */
    let offs = [];
    const host = () => pressed('data-hl-unsaved-host') || 'accepts';
    const draw = async () => {
        for (const off of offs.splice(0)) off();
        const placement = pressed('data-hl-unsaved-bar') === 'header' ? 'header' : 'header+sticky';
        const rows = KEYS_1.map((k) => rowHtml(fieldOf(k))).join('');
        scroll.innerHTML = `<header class="kp-page-header"><div class="kp-page-header__inner"><div><h3 class="kp-page-header__title">Host settings</h3><p class="kp-page-header__description">What the host reads from host.toml on pve. Edit a key; nothing is written until you save.</p></div><div class="kp-page-header__actions" id="hl-unsaved-slot"></div></div></header><form class="kp-formrows kp-formrows--lines" id="hl-unsaved-form" action="#">${rows}</form>`;
        offs.push(await wire(scroll));
        const slot = /** @type {HTMLElement} */ (byId('hl-unsaved-slot'));
        slot.innerHTML = `<div class="kp-unsaved" data-kp-unsaved id="hl-unsaved-bar" data-kp-unsaved-for="#hl-unsaved-form" data-kp-name="hl-unsaved" data-kp-dock="container" data-kp-scroll-root="#hl-unsaved-scroll" data-kp-keep="off" data-kp-placement="${placement}"></div>`;
        const off = attachAll(slot);
        await off.ready;
        offs.push(off);
        stageTwo(scroll);
    };
    scroll.addEventListener('kp-unsaved-save', (e) => {
        const changes = /** @type {CustomEvent} */ (e).detail.changes;
        say('hl-unsaved-log', `PUT /api/host/config\n${changes.map((/** @type {any} */ c) => `${c.key}: ${c.was} -> ${c.now}`).join('\n')}`);
        const bar = /** @type {HTMLElement} */ (byId('hl-unsaved-bar'));
        setTimeout(() => {
            /** @type {Record<string, string>} */
            const refused = {};
            if (host() === 'refuses') {
                const hit = changes.find((/** @type {any} */ c) => c.key === 'Backups at once') ?? changes[0];
                if (hit) refused[hit.key] = REFUSALS[hit.key] ?? 'The host refused this value.';
            }
            unsavedSaved(bar, { refused });
        }, 900);
    });
    scroll.addEventListener('kp-unsaved-discard', () => say('hl-unsaved-log', 'Discarded: every key is back to what the host holds.'));
    scroll.addEventListener('kp-unsaved-revert', (e) => say('hl-unsaved-log', `Reverted ${/** @type {CustomEvent} */ (e).detail.key}.`));
    const line = () => {
        if (hostLine) hostLine.textContent = host() === 'accepts' ? 'Takes every key it is sent.' : 'Refuses Backups at once ("at most 2 while a restore runs") and takes the rest.';
    };
    stateButtons('data-hl-unsaved-bar', () => draw());
    stateButtons('data-hl-unsaved-host', line);
    line();
    await draw();
}

// ── 2 · leaving with staged keys ──────────────────────────────────────────────────────────────────────────────────
async function leaveSection() {
    const app = byId('hl-leave-app');
    if (!app) return;
    await ready;
    const KEEP_KEY = `kp-unsaved:${location.pathname}:hl-leave`;
    try {
        sessionStorage.removeItem(KEEP_KEY);
    } catch {}
    /** @type {(() => void)[]} */
    let offs = [];
    let first = true;
    const draw = async () => {
        for (const off of offs.splice(0)) off();
        const keep = pressed('data-hl-leave-keep') === 'off' ? 'off' : 'session';
        const rows = ['backup_concurrency', 'log_level', 'notify_webhook'].map((k) => rowHtml(fieldOf(k))).join('');
        app.innerHTML = `<nav class="hl-miniapp__nav" aria-label="Pages of the dashboard"><b>System</b><a class="hl-miniapp__link" href="?page=settings" aria-current="page">Settings</a><a class="hl-miniapp__link" href="?page=backups">Backups</a><a class="hl-miniapp__link" href="?page=metrics">Metrics</a></nav><div class="hl-miniapp__body"><header class="kp-page-header"><div class="kp-page-header__inner"><div><h3 class="kp-page-header__title">Settings</h3><p class="kp-page-header__description">Change a key, then follow a link on the left.</p></div><div class="kp-page-header__actions" id="hl-leave-slot"></div></div></header><form class="kp-formrows kp-formrows--lines" id="hl-leave-form" action="#">${rows}</form></div>`;
        offs.push(await wire(app));
        const slot = /** @type {HTMLElement} */ (byId('hl-leave-slot'));
        slot.innerHTML = `<div class="kp-unsaved" data-kp-unsaved id="hl-leave-bar" data-kp-unsaved-for="#hl-leave-form" data-kp-name="hl-leave" data-kp-dock="container" data-kp-placement="header" data-kp-keep="${keep}"></div>`;
        const off = attachAll(slot);
        await off.ready;
        offs.push(off);
        if (first) stageTwo(app);
        first = false;
    };
    app.addEventListener('kp-unsaved-leave', (e) => {
        e.preventDefault();
        const href = /** @type {CustomEvent} */ (e).detail.href;
        const link = /** @type {HTMLAnchorElement} */ ([...app.querySelectorAll('a')].find((a) => /** @type {HTMLAnchorElement} */ (a).href === href));
        const bar = /** @type {any} */ (byId('hl-leave-bar'));
        const changes = bar ? /** @type {{ key: string, was: string, now: string }[]} */ (changes_of(app)) : [];
        const where = link?.textContent ?? 'another page';
        /** @type {Parameters<typeof openConfirmation>[1]} */
        const options = {
            initialFocus: 'cancel',
            onAccept: () => say('hl-leave-log', `Leave: the page would open ${where} and drop ${changes.length} staged changes.`),
            onCancel: () => say('hl-leave-log', 'Stay: nothing changed, the keys are still staged.'),
        };
        if (pressed('data-hl-leave-ask') === 'keys') {
            options.phrase = `Leave Settings for ${where}?`;
            options.strings = { confirmAccept: 'Leave and lose them', confirmCancel: 'Stay and keep editing', confirmDescription: 'These staged keys have not been written to the host:' };
            options.loses = changes.map((c) => `${c.key}: ${c.was} to ${c.now}`);
        }
        if (link) openConfirmation(link, options);
    });
    /** @param {HTMLElement} root */
    function changes_of(root) {
        return [...root.querySelectorAll('[data-kp-changed]')].map((row) => ({
            key: row.getAttribute('data-kp-name') ?? '',
            was: row.getAttribute('data-kp-was') ?? '',
            now: /** @type {HTMLInputElement | null} */ (row.querySelector('[data-hl-mirror], input:not([type=hidden]), select'))?.value ?? '',
        }));
    }
    stateButtons('data-hl-leave-ask', () => say('hl-leave-log', 'Press a link on the left.'));
    stateButtons('data-hl-leave-keep', () => draw());
    byId('hl-leave-reload')?.addEventListener('click', async () => {
        say('hl-leave-log', 'Reloaded: the page was drawn again.');
        await draw();
    });
    await draw();
}

// ── 3 · editors ───────────────────────────────────────────────────────────────────────────────────────────────────
async function editorsSection() {
    const form = byId('hl-editors-form');
    if (!form) return;
    await ready;
    /** @type {(() => void) | null} */
    let off = null;
    const report = () => {
        const lines = [...form.querySelectorAll('[data-hl-key]')].map((row) => {
            const key = row.getAttribute('data-hl-key');
            const mirror = /** @type {HTMLInputElement | null} */ (row.querySelector('[data-hl-mirror]'));
            const box = /** @type {HTMLInputElement | null} */ (row.querySelector('.kp-switch__input'));
            const other = /** @type {HTMLInputElement | HTMLSelectElement | null} */ (row.querySelector('select, input.kp-field__input'));
            return `${key} = ${mirror ? mirror.value : box ? (box.checked ? 'on' : 'off') : (other?.value ?? '')}`;
        });
        say('hl-editors-log', lines.join('\n'));
    };
    const draw = async () => {
        off?.();
        const bool = pressed('data-hl-editors-bool') === 'select' ? 'select' : 'switch';
        const lists = pressed('data-hl-editors-lists') === 'text' ? 'text' : 'tags';
        const keys = ['backup_hour', 'backup_concurrency', 'logs_window', 'exec_enabled', 'no_touch', 'data_mount_roots'];
        form.innerHTML = keys.map((k) => rowHtml(fieldOf(k), { bool, lists })).join('');
        off = await wire(form);
        report();
    };
    form.addEventListener('input', report);
    form.addEventListener('change', report);
    stateButtons('data-hl-editors-bool', draw);
    stateButtons('data-hl-editors-lists', draw);
    await draw();
}

// ── 4 · typed key ─────────────────────────────────────────────────────────────────────────────────────────────────
const LOSES = ['Every repository is written to the new place from the next nightly round.', 'The 42 snapshots in rclone:gdrive:homelab-backups stay where they are, unread by the host.', 'A wrong value stops every backup until it is put back.'];

async function typedSection() {
    const main = byId('hl-typed-main');
    if (!main) return;
    await ready;
    /** @type {(() => void) | null} */
    let off = null;
    let current = fieldOf('restic_base').value;
    const host = () => pressed('data-hl-typed-host') || 'accepts';
    const send = async (/** @type {string} */ origin) => {
        say('hl-typed-log', `${origin}: sending restic_base to the host...`);
        await wait(700);
        const row = /** @type {HTMLElement} */ (main.querySelector('#hl-row-restic_base'));
        const note = /** @type {HTMLElement} */ (main.querySelector('#hl-typed-refusal'));
        if (host() === 'refuses') {
            note.hidden = false;
            row.setAttribute('data-kp-state', 'error');
            say('hl-typed-log', 'The host refused: remote gdrive2 does not exist. The row keeps the old value.');
        } else {
            note.hidden = true;
            row.removeAttribute('data-kp-state');
            current = 'rclone:gdrive2:homelab-backups';
            const input = /** @type {HTMLInputElement} */ (row.querySelector('input'));
            input.value = current;
            say('hl-typed-log', 'Accepted: the row shows rclone:gdrive2:homelab-backups at once; the list of keys is updated.');
            toast('Backup target changed to rclone:gdrive2:homelab-backups', { variant: 'success' });
        }
    };
    const draw = () => {
        off?.();
        const any = pressed('data-hl-typed-case') === 'any' ? ' data-kp-type-confirm-case="any"' : '';
        main.innerHTML = `<div class="hl-typed"><form class="kp-formrows kp-formrows--lines" action="#" onsubmit="return false">${rowHtml({ ...fieldOf('restic_base'), value: 'rclone:gdrive2:homelab-backups' })}</form><div class="kp-alert kp-alert--destructive" id="hl-typed-refusal" hidden role="alert"><div class="kp-alert__what">The host refused backup target</div><div class="kp-alert__why">The remote "gdrive2" does not exist in rclone.conf on pve.</div><div class="kp-alert__remedy">Put the old value back, or add the remote on pve first.</div></div><div class="hl-typed__gate"><p class="hl-line">The confirmation as it stands open under the row:</p><template id="hl-typed-loses"><ul class="kp-type-confirm__list">${LOSES.map((l) => `<li>${esc(l)}</li>`).join('')}</ul></template><div data-kp-type-confirm="restic_base" data-kp-type-confirm-for="hl-typed-go" data-kp-type-confirm-loses="hl-typed-loses"${any}></div><div class="hl-actions"><button type="button" class="kp-button kp-button--destructive" id="hl-typed-go" disabled>Change the backup target</button><button type="button" class="kp-button" id="hl-typed-dialog">Open as a dialog</button></div></div></div>`;
        const o = attachAll(main);
        off = o;
        main.querySelector('#hl-typed-go')?.addEventListener('click', () => send('Inline'));
        main.querySelector('#hl-typed-dialog')?.addEventListener('click', (e) => {
            openConfirmation(/** @type {HTMLElement} */ (e.currentTarget), {
                phrase: 'Change the backup target?',
                typeName: 'restic_base',
                anyCase: pressed('data-hl-typed-case') === 'any',
                loses: LOSES,
                acceptLabel: 'Change the backup target',
                onAccept: () => send('Dialog'),
            });
        });
    };
    stateButtons('data-hl-typed-host', () => say('hl-typed-log', `The host will ${host() === 'refuses' ? 'refuse' : 'accept'} the change.`));
    stateButtons('data-hl-typed-case', draw);
    main.addEventListener('kp-type-confirm', (e) => say('hl-typed-log', `Typed "${/** @type {CustomEvent} */ (e).detail.value}": ${/** @type {CustomEvent} */ (e).detail.matched ? 'matches, the button is on' : 'does not match yet, the button stays off'}.`));
    draw();
    await ready;
}

// ── 5 · ssh how-to ────────────────────────────────────────────────────────────────────────────────────────────────
const TOML = `[[retention]]\nevery = "1 day"\nkeep_for = "7 days"\n\n[[retention]]\nevery = "14 days"\nkeep_for = "60 days"\n\n[[retention]]\nevery = "60 days"\nkeep_for = "for ever"`;
const TIERS = [
    ['Every day', 'kept for 7 days'],
    ['Every 14 days', 'kept for 60 days'],
    ['Every 60 days', 'kept for ever'],
];
/** @type {Record<string, string>} */
const SSH_LINE = {
    garuda: 'ssh -t root@pve sudoedit /etc/homelab/host.toml',
    wsl: 'ssh -t root@pve sudoedit /etc/homelab/host.toml',
    powershell: 'ssh -t root@pve "sudoedit /etc/homelab/host.toml"',
};

async function sshSection() {
    const main = byId('hl-ssh-main');
    if (!main) return;
    await ready;
    /** @type {(() => void) | null} */
    let off = null;
    let open = false;
    const draw = () => {
        off?.();
        const term = pressed('data-hl-ssh-term') || 'garuda';
        const view = pressed('data-hl-ssh-view') || 'toml';
        const f = fieldOf('retention');
        const read =
            view === 'toml'
                ? `<figure class="kp-code" data-kp-code data-kp-code-title="retention in host.toml" data-kp-code-language="TOML" data-kp-code-lines><pre class="kp-code__body"><code>${esc(TOML)}</code></pre></figure>`
                : `<dl class="kp-kv hl-tiers">${TIERS.map(([k, v]) => `<div class="kp-kv__row"><dt class="kp-kv__key">${k}</dt><dd class="kp-kv__value">${v}</dd></div>`).join('')}</dl>`;
        main.innerHTML = `<div class="hl-ssh"><div class="hl-ssh__label"><b>${esc(f.label)}</b> <code class="hl-key">${f.key}</code> <span class="kp-badge">changed over ssh</span><p class="hl-line">${esc(f.help)}</p></div><div class="hl-ssh__read">${read}</div><div class="kp-accordion hl-ssh__how"><details class="kp-accordion__item"${open ? ' open' : ''}><summary class="kp-accordion__summary">How to change this</summary><div class="kp-accordion__body"><p class="hl-line">This key is a table: it is edited in the file on pve, and the host reads it again by itself.</p><div class="kp-command" data-kp-command="${term}" data-kp-command-where="pve" data-kp-command-elevated><pre class="kp-command__code"><code>${esc(SSH_LINE[term])}</code></pre></div></div></details></div></div>`;
        off = attachAll(main);
        main.querySelector('details')?.addEventListener('toggle', (e) => (open = /** @type {HTMLDetailsElement} */ (e.currentTarget).open));
    };
    main.addEventListener('kp-copy', () => say('hl-ssh-log', 'Copied the line, without the prompt.'));
    stateButtons('data-hl-ssh-term', draw);
    stateButtons('data-hl-ssh-view', draw);
    open = true;
    draw();
}

export async function initSettings() {
    await Promise.all([unsavedSection(), leaveSection(), editorsSection(), typedSection(), sshSection()]);
}
