// research/app-homelab-settings: the host.toml keys the Settings sections draw, and the one way a key becomes a row.
// The keys, their groups, words and defaults are the host's own (core/src/hostconfig.rs); the values are made up.
// A row's editor depends on the key's kind: a switch for a bool, a quantity for an int, a 24-hour time field for the nightly
// hour, tags for a list. Those editors keep their value in their own parts, which the Save bar cannot read, so each row also
// holds a hidden text mirror of the value (the bar tracks the mirror); `bridge()` keeps the two in step both ways.

import { setQuantity } from '../../js/quantity.js';
import { setTime } from '../../js/timefield.js';
import { combobox } from '../../js/combobox.js';
import { attachAll } from '../../js/auto.js';
import { esc } from './common.js';

/**
 * @typedef {object} Field
 * @property {string} key
 * @property {string} group
 * @property {string} label
 * @property {string} help
 * @property {string} def what the host uses when the key is absent
 * @property {'text' | 'url' | 'select' | 'bool' | 'number' | 'hour' | 'window' | 'vmid' | 'tags' | 'table'} editor
 * @property {string} value
 * @property {'browser' | 'confirm' | 'ssh'} access
 * @property {number} [min] @property {number} [max] @property {number} [step] @property {string} [unit] @property {string} [unitOne]
 * @property {string[]} [options]
 * @property {string[]} [suggest] for tags
 */

export const GROUPS = [
    'Nightly round and backups',
    'Notifications',
    'Coverage and monitoring',
    'Gateway and network',
    'Logging',
    'Safety',
];

/** @type {Field[]} */
export const FIELDS = [
    { key: 'backup_hour', group: GROUPS[0], label: 'Nightly hour', help: 'Hour (0-23, host time) of the nightly backup and update round; empty turns it off.', def: 'off', editor: 'hour', value: '02:00', access: 'browser' },
    { key: 'backup_concurrency', group: GROUPS[0], label: 'Backups at once', help: 'How many stack backups the nightly round runs at the same time; each pauses its containers.', def: '3', editor: 'number', value: '3', min: 1, max: 16, unit: 'stacks', unitOne: 'stack', access: 'browser' },
    { key: 'restic_snapshot_timeout_s', group: GROUPS[0], label: 'Snapshot time limit', help: 'How long one snapshot may take before the host gives up on it.', def: '240 min', editor: 'number', value: '240', min: 5, max: 1440, step: 5, unit: 'min', unitOne: 'min', access: 'browser' },
    { key: 'restic_base', group: GROUPS[0], label: 'Backup target', help: 'Where restic writes every repository. A wrong value stops every backup.', def: 'rclone:gdrive:homelab-backups', editor: 'text', value: 'rclone:gdrive:homelab-backups', access: 'confirm' },
    { key: 'retention', group: GROUPS[0], label: 'Snapshot retention', help: 'Tiers of snapshots kept: daily for a week, then every two weeks for two months.', def: '1 day for 7 days, 14 days for 60 days, 60 days for ever', editor: 'table', value: '', access: 'ssh' },
    { key: 'notify_webhook', group: GROUPS[1], label: 'Notification webhook', help: 'Where the host posts its notices (the message hub on CT 109).', def: 'off', editor: 'url', value: 'http://kyu:8080/hook/homelab', access: 'browser' },
    { key: 'dashboard_url', group: GROUPS[1], label: 'Dashboard address', help: 'The address a push links to; without it a push carries no link.', def: 'none: a push carries no link', editor: 'url', value: 'https://admin.kp-soft.dev', access: 'browser' },
    { key: 'prometheus_url', group: GROUPS[2], label: 'Prometheus', help: 'Where the metrics are read from (CT 113).', def: 'not asked', editor: 'url', value: 'http://metrics:9090', access: 'browser' },
    { key: 'loki_vmid', group: GROUPS[2], label: 'Loki container', help: 'The container that runs Loki; asked at the Loki address from pve when empty.', def: 'asked at the Loki address', editor: 'vmid', value: '113', access: 'browser' },
    { key: 'logs_window', group: GROUPS[2], label: 'Log window', help: 'How far back the log page reads by default.', def: '24h', editor: 'window', value: '24', min: 1, max: 168, unit: 'h', unitOne: 'h', access: 'browser' },
    { key: 'gateway_vmid', group: GROUPS[3], label: 'Gateway container', help: 'The container that runs Traefik. A wrong value cuts every route.', def: '104', editor: 'vmid', value: '104', access: 'confirm' },
    { key: 'log_level', group: GROUPS[4], label: 'Log level', help: 'How much the host writes to its journal.', def: 'info', editor: 'select', value: 'info', options: ['warn', 'info', 'debug'], access: 'browser' },
    { key: 'exec_enabled', group: GROUPS[5], label: 'Remote exec', help: 'Whether homelab exec may run commands inside containers. Today a policy the token must not loosen: ssh only.', def: 'false', editor: 'bool', value: 'off', access: 'ssh' },
    { key: 'no_touch', group: GROUPS[5], label: 'No-touch list', help: 'Containers and VMs the host never changes: OPNsense, Home Assistant and two more.', def: '100, 101, 102, 103', editor: 'tags', value: '100,101,102,103', access: 'ssh', suggest: ['100', '101', '102', '103', '104', '105', '106', '108', '109', '112', '113', '118', '120'] },
    { key: 'data_mount_roots', group: GROUPS[5], label: 'Data mount roots', help: 'The directories containers may mount; the fleet\'s own are used when empty.', def: 'the fleet\'s own', editor: 'tags', value: '/appdata,/mnt/media', access: 'ssh', suggest: ['/appdata', '/mnt/media', '/mnt/hdd4tb', '/mnt/hdd18tb'] },
];

/** @param {string} key */
export const fieldOf = (key) => /** @type {Field} */ (FIELDS.find((f) => f.key === key));

const MIRROR = 'data-hl-mirror';

/**
 * The editor of a field, with its mirror.
 * @param {Field} f
 * @param {{ bool?: 'switch' | 'select', lists?: 'tags' | 'text', disabled?: string }} [o]
 */
export function editorHtml(f, { bool = 'switch', lists = 'tags', disabled = '' } = {}) {
    const dis = disabled ? ` disabled data-kp-disabled-reason="${esc(disabled)}"` : '';
    const mirror = (/** @type {string} */ kind) =>
        `<input class="kp-sr-only" ${MIRROR}="${kind}" name="${f.key}" value="${esc(f.value)}" tabindex="-1" aria-hidden="true" />`;
    switch (f.editor) {
        case 'text':
        case 'vmid':
            return `<input class="kp-field__input" type="text" name="${f.key}" value="${esc(f.value)}" aria-label="${esc(f.label)}"${f.editor === 'vmid' ? ' inputmode="numeric"' : ''}${dis} />`;
        case 'url':
            return `<input class="kp-field__input" type="url" name="${f.key}" value="${esc(f.value)}" aria-label="${esc(f.label)}"${dis} />`;
        case 'select':
            return `<select class="kp-field__input" name="${f.key}" aria-label="${esc(f.label)}"${dis}>${(f.options ?? []).map((o) => `<option value="${o}"${o === f.value ? ' selected' : ''}>${o}</option>`).join('')}</select>`;
        case 'bool':
            return bool === 'select'
                ? `<select class="kp-field__input" name="${f.key}" aria-label="${esc(f.label)}"${dis}><option value="off"${f.value === 'off' ? ' selected' : ''}>off</option><option value="on"${f.value === 'on' ? ' selected' : ''}>on</option></select>`
                : `<label class="kp-switch"><input class="kp-switch__input" type="checkbox" role="switch" name="${f.key}"${f.value === 'on' ? ' checked' : ''}${dis} /><span>${f.value === 'on' ? 'On' : 'Off'}</span></label>`;
        case 'number':
        case 'window':
            return `<div class="kp-quantity" data-kp-quantity data-kp-quantity-min="${f.min}" data-kp-quantity-max="${f.max}" data-kp-quantity-step="${f.step ?? 1}" data-kp-quantity-unit="${f.unit}" data-kp-quantity-unit-one="${f.unitOne}" data-kp-quantity-label="${esc(f.label)}"${disabled ? ' data-kp-quantity-disabled' : ''}><input class="kp-quantity__input" value="${f.value}" /></div>${mirror('number')}`;
        case 'hour':
            return `<div class="kp-time" data-kp-time data-kp-value="${f.value}" data-kp-label="${esc(f.label)}" data-kp-time-step="60" data-kp-time-presets="02:00,03:00,04:00" data-kp-time-near="02:00" data-kp-time-clear></div>${mirror('time')}`;
        case 'tags': {
            if (lists === 'text')
                return `<input class="kp-field__input" type="text" name="${f.key}" value="${esc(f.value.split(',').join(', '))}" aria-label="${esc(f.label)}"${dis} />`;
            const chosen = f.value.split(',').filter(Boolean);
            const id = `hl-tags-${f.key}`;
            return `<div class="kp-combobox" data-kp-combobox data-kp-tags data-kp-creatable><label class="kp-sr-only" for="${id}">${esc(f.label)}</label><ul class="kp-tag-list" data-kp-tag-list>${chosen.map((v) => `<li class="kp-tag" data-value="${esc(v)}"><span>${esc(v)}</span><button type="button" class="kp-tag__remove" aria-label="Remove ${esc(v)}">×</button></li>`).join('')}</ul><input class="kp-combobox__input" id="${id}" type="text" role="combobox" aria-expanded="false" aria-controls="${id}-list" autocomplete="off" /><ul class="kp-combobox__list" id="${id}-list" role="listbox" hidden>${(f.suggest ?? []).map((v) => `<li class="kp-combobox__option" role="option" data-kp-option data-value="${esc(v)}">${esc(v)}</li>`).join('')}</ul></div>${mirror('tags')}`;
        }
        default:
            return '';
    }
}

/**
 * One row: the key's name and its words, the editor, and the default.
 * @param {Field} f @param {Parameters<typeof editorHtml>[1]} [o]
 */
export function rowHtml(f, o = {}) {
    const badge =
        f.access === 'confirm'
            ? ' <span class="kp-badge kp-badge--info">type the key to confirm</span>'
            : '';
    return `<div class="kp-formrow" id="hl-row-${f.key}" data-hl-key="${f.key}" data-kp-name="${esc(f.label)}"><div class="kp-formrow__label"><span>${esc(f.label)}</span> <code class="hl-key">${f.key}</code>${badge}<small>${esc(f.help)}</small></div><div class="kp-formrow__control">${editorHtml(f, o)}</div><div class="kp-formrow__aside">default ${esc(f.def)}</div></div>`;
}

/**
 * Keep an editor and its mirror in step, both ways. Marks the editors' own inner fields as not tracked, so the Save bar
 * counts the mirror (one value per row) and nothing twice.
 * @param {HTMLElement} scope
 */
export function bridge(scope) {
    for (const input of scope.querySelectorAll('[data-kp-quantity] input, [data-kp-time] input, [data-kp-combobox] input')) input.setAttribute('data-kp-untracked', '');
    /** @param {Element} row @param {string} value */
    const push = (row, value) => {
        const m = /** @type {HTMLInputElement | null} */ (row.querySelector(`[${MIRROR}]`));
        if (!m || m.value === value) return;
        m.value = value;
        m.dispatchEvent(new Event('input', { bubbles: true }));
        m.dispatchEvent(new Event('change', { bubbles: true }));
    };
    scope.addEventListener('kp-quantity-change', (e) => {
        const row = /** @type {Element} */ (e.target).closest('[data-hl-key]');
        if (row) push(row, String(/** @type {CustomEvent} */ (e).detail.value));
    });
    scope.addEventListener('kp-time-change', (e) => {
        const row = /** @type {Element} */ (e.target).closest('[data-hl-key]');
        if (row) push(row, /** @type {CustomEvent} */ (e).detail.value);
    });
    scope.addEventListener('kp-combobox-change', (e) => {
        const row = /** @type {Element} */ (e.target).closest('[data-hl-key]');
        if (row) push(row, /** @type {CustomEvent} */ (e).detail.values.join(','));
    });
    // The other way: the bar reverts a row by writing its mirror.
    scope.addEventListener('input', (e) => {
        const m = /** @type {HTMLInputElement} */ (e.target);
        if (!(m instanceof HTMLInputElement) || !m.hasAttribute(MIRROR)) return;
        const row = m.closest('[data-hl-key]');
        if (!row) return;
        const kind = m.getAttribute(MIRROR);
        if (kind === 'number') {
            const q = row.querySelector('[data-kp-quantity]');
            if (q) setQuantity(q, Number(m.value));
        } else if (kind === 'time') {
            const t = /** @type {HTMLElement | null} */ (row.querySelector('[data-kp-time]'));
            if (t) setTime(t, m.value, { fire: false });
        } else if (kind === 'tags') {
            const box = row.querySelector('[data-kp-combobox]');
            const handle = box ? combobox(box) : null;
            if (handle && handle.values().join(',') !== m.value) handle.set(m.value.split(',').filter(Boolean));
        }
    });
    // A switch's word follows its state.
    scope.addEventListener('change', (e) => {
        const box = /** @type {HTMLInputElement} */ (e.target);
        if (box instanceof HTMLInputElement && box.matches('.kp-switch__input')) {
            const word = box.parentElement?.querySelector('span');
            if (word) word.textContent = box.checked ? 'On' : 'Off';
        }
    });
}

/** Attach the components under a subtree, then mark its editors. Returns the detach. @param {HTMLElement} el */
export async function wire(el) {
    const off = attachAll(el);
    await off.ready;
    bridge(el);
    return off;
}
