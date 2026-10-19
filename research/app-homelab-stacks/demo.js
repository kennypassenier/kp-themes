// research/app-homelab-stacks: the page's own wiring. The components are the package's (js/auto.js attaches them); this
// file feeds them sample data (sample.js), presses their states and writes what they fire into a readout. Each section is
// wired by its own elements, so a page that holds one section alone (the review dialog's lanes) works.
import { setEntityGrid, setEntityGridState, ENTITY_ACTION_EVENT, ENTITY_NEW_EVENT } from '../../js/entity-card.js';
import { setBarCell, attachBarCells } from '../../js/barcell.js';
import { attachIdmarks } from '../../js/idmark.js';
import { dataTable } from '../../js/datatable.js';
import { attachSelectionBars, getSelection, setSelectionBusy, setSelectionResult, setSelectionRules } from '../../js/selection-bar.js';
import { undoToast } from '../../js/undo-toast.js';
import { openConfirmation } from '../../js/components.js';
import { setBullets } from '../../js/bullets.js';
import { setStackbar, STACKBAR_PICK_EVENT } from '../../js/stackbar.js';
import { setHeat, HEAT_PICK_EVENT, HEAT_ROW_EVENT } from '../../js/heat.js';
import { setCardState } from '../../js/card-state.js';
import { setFacetItems, setFacetCounts, setFacetValues, FACET_EVENT, attachFacets } from '../../js/facets.js';
import { attachHoverCards } from '../../js/hovercard.js';
import { attachMenuButtons, MENU_SELECT_EVENT } from '../../js/menu-button.js';
import { setUptime, UPTIME_PICK_EVENT } from '../../js/uptime.js';
import { matchIntent } from '../../js/intent.js';
import { getSegmentedValues, setSegmentedValues, SEGMENTED_EVENT } from '../../js/segmented.js';
import { setToolbarActive, TOOLBAR_REMOVE_EVENT, TOOLBAR_CLEAR_EVENT } from '../../js/toolbar.js';
import { attachVersionDeltas, summarizeDeltas, releaseUrl, versionLevel } from '../../js/version-delta.js';
import { setMatrix, MATRIX_PICK_EVENT } from '../../js/heat.js';
import { buildStatusList, setStatus, countStatus, attachStatusLists, STATUS_RETRY_EVENT } from '../../js/statusrow.js';
import { setProblems } from '../../js/problems.js';
import { setDeplist } from '../../js/deplist.js';
import { setMeter } from '../../js/kpi.js';
import { setChartData } from '../../js/chart.js';
import { setCode } from '../../js/code.js';
import { buildSteplist, setStep, attachSteplists } from '../../js/steplist.js';
import { setPipeline, setPipelineState } from '../../js/pipeline.js';
import { attachSentences } from '../../js/sentence.js';
import { attachAckGates } from '../../js/ack-gate.js';
import * as S from './sample.js';

/** Resolves once js/auto.js has attached everything the page carries. */
const ready = new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});
await ready;

const { STACKS, NOW, stamp, dateOf, timeOf, count, plural, gb, byName, appsOf } = S;
/** @param {string} id */
const byId = (id) => document.getElementById(id);
/** @param {string} id @param {string} text */
const say = (id, text) => {
    const out = byId(id);
    if (out) out.textContent = text;
};
/** Press a state button: exactly one of the group is pressed. @param {string} attribute @param {(value: string) => void} apply */
function stateButtons(attribute, apply) {
    const buttons = /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll(`[${attribute}]`)]);
    for (const button of buttons) {
        button.addEventListener('click', () => {
            for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
            apply(button.getAttribute(attribute) ?? '');
        });
    }
}
/** A one-shot button group. @param {string} attribute @param {(value: string) => void} apply */
function actionButtons(attribute, apply) {
    for (const button of document.querySelectorAll(`[${attribute}]`)) button.addEventListener('click', () => apply(button.getAttribute(attribute) ?? ''));
}
/** Mark one button of a group pressed without firing it. */
function press(attribute, value) {
    for (const b of document.querySelectorAll(`[${attribute}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attribute) === value));
}
/** @param {string} tag @param {Record<string, string> | null} [attrs] @param {...(Node | string)} kids */
function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs ?? {})) el.setAttribute(k, v);
    el.append(...kids);
    return el;
}
const esc = (/** @type {string} */ s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** One shared hover card for the page: each section adds a filler that answers for its own anchors (undefined = not mine). @type {((anchor: HTMLElement) => any)[]} */
const hoverFills = [];
attachHoverCards(document, { selector: '[data-kp-hovercard]', fill: (anchor) => { for (const f of hoverFills) { const r = f(anchor); if (r !== undefined) return r; } return null; } });

/** A hover card's facts on the form grid: a title, then label | value rows that share their edges. @param {string} title @param {[string, string, string?][]} rows */
function facts(title, rows) {
    const dl = h('dl', { class: 'kp-kv' }, ...rows.map(([k, v, cls]) => h('div', { class: 'kp-kv__row' }, h('dt', null, k), h('dd', cls ? { class: cls } : null, v))));
    return h('div', { class: 'kp-formgrid sk-hovercard', 'data-kp-formgrid-stack': 'never' }, h('b', { class: 'kp-formgrid__heading' }, title), dl);
}
const wait = (/** @type {number} */ ms) => new Promise((r) => setTimeout(r, ms));
const mark = (/** @type {string} */ name) => `<span class="kp-idmark kp-idmark--sm" data-kp-idmark="${esc(name)}" aria-hidden="true"></span>`;

/** Put a custom block inside a card that carries the four data states. @param {HTMLElement} el @returns {HTMLElement} */
function stageOf(el) {
    const card = h('section', { class: 'kp-card sk-card', 'data-kp-state': 'ready' }, h('div', { class: 'kp-card__stage' }, h('div', { class: 'kp-card__data' })));
    el.replaceWith(card);
    /** @type {HTMLElement} */ (card.querySelector('.kp-card__data')).append(el);
    return card;
}
/** Tick exactly these keys in a list or table. @param {ParentNode} root @param {string[]} keys */
function tick(root, keys) {
    for (const box of /** @type {NodeListOf<HTMLInputElement>} */ (root.querySelectorAll('[data-kp-select-row]'))) {
        const row = box.closest('[data-kp-row-key]');
        const want = !box.disabled && keys.includes(row?.getAttribute('data-kp-row-key') ?? box.value);
        if (box.checked !== want) {
            box.checked = want;
            box.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
}
const stateWord = (/** @type {string} */ w, words = 'running\nneeds attention\nparked') => `<span class="kp-state-word" data-kp-words="${esc(words)}">${esc(w)}</span>`;
const STATE_WORD = (/** @type {S.Stack} */ s) => (s.state === 'attention' ? 'needs attention' : s.state);
const lastOf = (/** @type {S.Stack} */ s) => S.lastBackup(s);
const cpuShare = (/** @type {S.Stack} */ s) => Math.min(0.95, s.cpu * 4);
const barRam = (/** @type {HTMLElement} */ cell, /** @type {S.Stack} */ s) =>
    setBarCell(cell, { value: s.state === 'parked' ? null : s.ram, text: s.state === 'parked' ? 'off' : `${Math.round(s.ram * 100)} %`, sortValue: s.ram * 100, warnAt: 0.75, badAt: 0.9, mark: 0.8, markLabel: 'alert at 80 %', label: 'of its memory allowance' });
const barPct = (/** @type {HTMLElement} */ cell, /** @type {number | null} */ v, /** @type {number} */ sv = (v ?? 0) * 100) => setBarCell(cell, { value: v, text: v == null ? 'off' : `${Math.round(v * 100)} %`, sortValue: sv, warnAt: 0.75, badAt: 0.9 });
const ERR = 'The host pve did not answer: connection refused.';

// ═══ fleet-cards ═════════════════════════════════════════════════════════════════════════════════════════════
if (byId('fleet-cards-component')) {
    const grid = /** @type {HTMLElement} */ (byId('sk-cards'));
    let show = 'all';
    let data = 'ready';
    const staleStacks = new Set(S.STALE.map((x) => x.stack));
    const entity = (/** @type {S.Stack} */ s) => {
        const parked = s.state === 'parked';
        const { up, total } = appsOf(s);
        return {
            key: s.name,
            name: s.name,
            vmid: String(s.ct),
            state: { label: STATE_WORD(s), tone: /** @type {'success' | 'warning' | 'info'} */ (s.state === 'attention' ? 'warning' : parked ? 'info' : 'success') },
            figures: [
                { value: parked ? '0' : `${up}/${total}`, label: 'Apps up' },
                { value: String(s.restarts), label: 'Restarts' },
                { value: parked ? 'off' : `${Math.round(s.cpu * 100 * 10) / 10} %`, label: 'CPU' },
            ],
            flags: [
                ...(staleStacks.has(s.name) ? [{ label: 'update available', tone: /** @type {'warning'} */ ('warning') }] : []),
                ...(s.restarts >= 5 ? [{ label: 'restart loop', tone: /** @type {'destructive'} */ ('destructive') }] : []),
                ...(parked ? [{ label: 'parked' }] : []),
            ],
            meters: [{ label: 'RAM', value: parked ? null : s.ram, mark: 0.8, ...(s.ram >= 0.9 ? { tone: /** @type {'destructive'} */ ('destructive') } : s.ram >= 0.8 ? { tone: /** @type {'warning'} */ ('warning') } : {}), text: parked ? 'Not running' : `${s.ramGb} of ${s.allowGb} GB` }],
            actions: [
                { id: 'deploy', label: 'Deploy', ...(parked ? { disabled: `${s.parkedNote}: unpark it first` } : {}) },
                { id: 'backup', label: 'Back up now' },
            ],
        };
    };
    const draw = () => {
        if (data === 'loading') return setEntityGridState(grid, 'loading', { count: 6 });
        if (data === 'error') return setEntityGridState(grid, 'error', { message: ERR });
        if (data === 'empty') return setEntityGridState(grid, 'empty', { title: 'No stacks yet', message: 'Add a stack to the repository and it appears here.', actionLabel: 'New stack' });
        const list = STACKS.filter((s) => (show === 'all' ? true : show === 'parked' ? s.state === 'parked' : s.state === 'attention'));
        setEntityGrid(grid, list.map(entity));
    };
    stateButtons('data-sk-cards-show', (v) => ((show = v), draw()));
    stateButtons('data-sk-cards-data', (v) => ((data = v), draw()));
    grid.addEventListener(ENTITY_ACTION_EVENT, (e) => {
        const { key, id } = /** @type {CustomEvent} */ (e).detail;
        say('sk-cards-log', `POST /api/stacks/${key}/${id === 'deploy' ? 'deploy' : 'backup'}  (sample: nothing is sent)`);
    });
    stateButtons('data-sk-fleet-open', (v) => say('sk-cards-note', v === 'table' ? 'The Stacks page opens with the table; this cards view is one press away.' : 'The Stacks page opens with these cards; the table is one press away.'));
    grid.addEventListener('kp-entity-grid-retry', () => say('sk-cards-log', 'Retry pressed: the page would read the fleet again.'));
    grid.addEventListener(ENTITY_NEW_EVENT, () => say('sk-cards-log', 'New stack pressed: the page would open the new-stack dialog.'));
    draw();
}

// ═══ fleet-table ═════════════════════════════════════════════════════════════════════════════════════════════
if (byId('fleet-table-component')) {
    const table = /** @type {HTMLElement} */ (byId('sk-table'));
    const rows = /** @type {HTMLElement} */ (byId('sk-table-rows'));
    let group = 'state';
    let data = 'ready';
    const COLS = 9;
    const row = (/** @type {S.Stack} */ s, /** @type {string | null} */ g) => {
        const { up, total } = appsOf(s);
        const last = lastOf(s);
        const apps = s.apps.map((a) => `<li><span class="kp-action-list__main"><strong class="kp-action-list__title">${esc(a.name)}</strong><span class="kp-action-list__text kp-mono">${esc(a.image)}</span></span> ${stateWord(a.state === 'up' ? 'up' : a.state === 'unwatched' ? 'not watched' : a.state === 'deploying' ? 'deploying' : 'failing', 'up\nfailing\nnot watched\ndeploying')}</li>`).join('');
        const backups = S.backupsOf(s).map((b) => `<div class="kp-kv__row"><dt>${stamp(b.at)}</dt><dd>${gb(b.size)}</dd></div>`).join('') || '<div class="kp-kv__row"><dt>none</dt><dd>parked stacks are not backed up</dd></div>';
        return `<tr data-kp-row-key="${s.name}"${g ? ` data-kp-group-of="${g}"` : ''}>
            <td data-label="Stack" data-kp-sort-value="${s.name}"><span class="sk-nowrap sk-pair"><a href="#hub" data-sk-hub="${s.name}">${mark(s.name)} <b>${s.name}</b></a><span class="kp-timestamp">CT ${s.ct}</span></span></td>
            <td data-label="State" data-kp-sort-value="${STATE_WORD(s)}" data-kp-filter-value="${STATE_WORD(s)}">${stateWord(STATE_WORD(s))}</td>
            <td class="kp-text-end" data-label="Apps up" data-kp-sort-value="${total ? up / total : 0}">${s.state === 'parked' ? '0' : up}/${total}</td>
            <td class="kp-text-end" data-label="Restarts" data-kp-sort-value="${s.restarts}">${s.restarts}</td>
            <td data-label="RAM"><span class="kp-bar-cell" data-sk-ram="${s.name}"></span></td>
            <td data-label="CPU"><span class="kp-bar-cell" data-sk-cpu="${s.name}"></span></td>
            <td data-label="Last backup" data-kp-sort-value="${last ? last.at : 0}" class="sk-nowrap">${last ? stamp(last.at) : 'none'}</td>
            <td data-label="Preset" data-kp-filter-value="${s.preset}">${s.preset}</td>
        </tr>
        <tr data-kp-row-detail><td colspan="${COLS}"><div class="sk-detail">
            <div><h4>Apps</h4><ul class="kp-action-list">${apps}</ul></div>
            <div class="sk-detail__side"><h4>Last three backups</h4><div class="kp-formgrid" data-kp-formgrid-stack="never"><dl class="kp-kv">${backups}</dl></div><h4>CPU</h4><p>${s.state === 'parked' ? 'Not running.' : `${Math.round(s.cpu * 1000) / 10} % of its cores now; the 24-hour line waits for the package.`}</p></div>
        </div></td></tr>`;
    };
    const head = (/** @type {string} */ g, /** @type {string} */ label, folded = false) => `<tr data-kp-row-group="${g}"${folded ? ' data-kp-folded' : ''}><th scope="rowgroup" colspan="${COLS}">${esc(label)} <span class="kp-badge" data-kp-group-count></span></th></tr>`;
    const draw = () => {
        const handle = dataTable(table);
        if (data === 'loading') return handle?.state('loading');
        if (data === 'error') return handle?.fail(ERR);
        handle?.state('ready');
        const list = data === 'empty' ? [] : STACKS;
        let html = '';
        if (group === 'state') {
            for (const [g, label] of /** @type {const} */ ([['attention', 'Needs attention'], ['running', 'Running'], ['parked', 'Parked']])) {
                const members = list.filter((s) => (g === 'attention' ? s.state === 'attention' : g === 'running' ? s.state === 'running' : s.state === 'parked'));
                if (members.length) html += head(g, label, g === 'parked') + members.map((s) => row(s, g)).join('');
            }
        } else if (group === 'preset') {
            for (const p of S.PRESETS) {
                const members = list.filter((s) => s.preset === p.key);
                if (members.length) html += head(p.key, `Preset ${p.label}`) + members.map((s) => row(s, p.key)).join('');
            }
        } else html = list.map((s) => row(s, null)).join('');
        rows.innerHTML = html;
        for (const el of /** @type {NodeListOf<HTMLElement>} */ (rows.querySelectorAll('[data-sk-ram]'))) barRam(el, byName(el.dataset.skRam ?? ''));
        for (const el of /** @type {NodeListOf<HTMLElement>} */ (rows.querySelectorAll('[data-sk-cpu]'))) {
            const s = byName(el.dataset.skCpu ?? '');
            barPct(el, s.state === 'parked' ? null : cpuShare(s));
        }
        attachIdmarks(rows);
        handle?.refresh();
    };
    stateButtons('data-sk-table-group', (v) => ((group = v), draw()));
    stateButtons('data-sk-table-data', (v) => ((data = v), draw()));
    table.addEventListener('click', (e) => {
        const a = /** @type {HTMLElement | null} */ ((/** @type {HTMLElement} */ (e.target)).closest('[data-sk-hub]'));
        if (a) {
            e.preventDefault();
            say('sk-table-log', `Navigate to /stacks/${a.dataset.skHub} (the stack page).`);
        }
    });
    table.addEventListener('kp-datatable-expand', (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        if (d.open) say('sk-table-log', `Opened ${d.key}: its apps, last three backups and CPU show in the row.`);
    });
    draw();
}

// ═══ fleet-batch ═════════════════════════════════════════════════════════════════════════════════════════════
if (byId('fleet-batch-component')) {
    const root = /** @type {HTMLElement} */ (byId('fleet-batch-component'));
    const table = /** @type {HTMLElement} */ (byId('sk-batch'));
    const rows = /** @type {HTMLElement} */ (byId('sk-batch-rows'));
    const bar = /** @type {HTMLElement} */ (byId('sk-batch-bar'));
    const bed = byId('sk-batch-bed');
    let refuse = false;
    let safety = 'undo';
    const busy = new Map();
    const draw = () => {
        rows.innerHTML = STACKS.map((s) => {
            const { up, total } = appsOf(s);
            const last = lastOf(s);
            return `<tr data-kp-row-key="${s.name}" data-kp-row-label="${s.name}">
                <td><input type="checkbox" class="kp-field__check" data-kp-select-row value="${s.name}" aria-label="Select ${s.name}" /></td>
                <td data-label="Stack" data-kp-sort-value="${s.name}"><span class="sk-pair">${mark(s.name)}<b>${s.name}</b><span class="kp-timestamp">CT ${s.ct}</span></span></td>
                <td data-label="State" data-kp-sort-value="${STATE_WORD(s)}" data-sk-state="${s.name}">${stateWord(busy.get(s.name) ?? STATE_WORD(s), 'running\nneeds attention\nparked\ndeploying\nstopped')}</td>
                <td class="kp-text-end" data-label="Apps up" data-kp-sort-value="${total ? up / total : 0}">${s.state === 'parked' ? '0' : up}/${total}</td>
                <td data-label="Last backup" data-kp-sort-value="${last ? last.at : 0}" class="sk-nowrap">${last ? stamp(last.at) : 'none'}</td></tr>`;
        }).join('');
        attachIdmarks(rows);
        dataTable(table)?.refresh();
        attachSelectionBars(table);
    };
    draw();
    setSelectionRules(bar, {
        deploy: (items) => {
            const ok = items.filter((i) => byName(i.key).state !== 'parked');
            return ok.length === items.length ? '' : `${ok.length} of ${items.length} can be deployed`;
        },
        stop: (items) => (items.some((i) => i.key === 'traefik') ? 'traefik carries every other stack: stop it on its own page' : ''),
    });
    const setWord = (/** @type {string[]} */ keys, /** @type {string | null} */ w) => {
        for (const k of keys) {
            if (w) busy.set(k, w);
            else busy.delete(k);
            const cell = rows.querySelector(`[data-sk-state="${k}"] .kp-state-word`);
            if (cell) cell.textContent = w ?? STATE_WORD(byName(k));
        }
    };
    const finish = (/** @type {string[]} */ keys, /** @type {string} */ verb) => {
        const refused = refuse && keys.includes('loki') ? [{ key: 'loki', reason: 'the host has no memory left for it' }] : [];
        const done = keys.filter((k) => !refused.some((r) => r.key === k));
        setWord(keys, null);
        setSelectionBusy(bar, null);
        setSelectionResult(bar, { done: done.length, refused });
        say('sk-batch-log', `POST /api/stacks/${verb} {"stacks":[${keys.join(',')}]}  ->  ${done.length} done, ${refused.length} refused.`);
    };
    const sendLater = (/** @type {string[]} */ keys, /** @type {string} */ verb, /** @type {string} */ word) => {
        setSelectionBusy(bar, `${word} ${keys.length}...`);
        setWord(keys, word === 'Stopping' ? 'stopped' : 'deploying');
        window.setTimeout(() => finish(keys, verb), 1400);
    };
    bar.addEventListener('kp-selection-action', (event) => {
        const { action, keys, button } = /** @type {CustomEvent} */ (event).detail;
        const n = keys.length;
        if (action === 'backup') return sendLater(keys, 'backup', 'Backing up');
        if (action === 'stop') {
            openConfirmation(button, { phrase: `Stop ${plural(n, 'stack')}? They will be unreachable until started again.`, acceptLabel: 'Stop', onAccept: () => sendLater(keys, 'stop', 'Stopping') });
            return;
        }
        if (safety === 'confirm') {
            openConfirmation(button, { phrase: `Deploy ${plural(n, 'stack')}: ${keys.join(', ')}?`, acceptLabel: 'Deploy', onAccept: () => sendLater(keys, 'deploy', 'Deploying') });
            return;
        }
        setWord(keys, 'deploying');
        say('sk-batch-log', `Waiting ten seconds before POST /api/stacks/deploy for ${plural(n, 'stack')}; Undo takes it back.`);
        undoToast(`Deploying ${plural(n, 'stack')}`, {
            region: bed,
            ms: 10000,
            clock: 'ring',
            commit: () => finish(keys, 'deploy'),
            undo: () => {
                setWord(keys, null);
                say('sk-batch-log', 'Undone before the clock ended: nothing was sent.');
            },
        });
    });
    actionButtons('data-sk-batch-pick', (v) => tick(table, v === 'attention' ? ['immich', 'loki'] : v === 'mixed' ? ['loki', 'immich', 'wiki'] : v === 'all' ? STACKS.map((s) => s.name) : []));
    stateButtons('data-sk-batch-server', (v) => (refuse = v === 'refuses'));
    stateButtons('data-sk-batch-safety', (v) => (safety = v));
    void root;
}

// ═══ fleet-hungry ════════════════════════════════════════════════════════════════════════════════════════════
if (byId('fleet-hungry-component')) {
    const list = /** @type {HTMLElement} */ (byId('sk-hungry'));
    const split = /** @type {HTMLElement} */ (byId('sk-disk-split'));
    let measure = 'ram';
    let data = 'ready';
    let only = /** @type {string | null} */ (null);
    const running = STACKS.filter((s) => s.state !== 'parked');
    const val = (/** @type {S.Stack} */ s) => Math.round((measure === 'ram' ? s.ram : measure === 'cpu' ? cpuShare(s) : s.disk) * 100);
    const draw = () => {
        const state = data === 'ready' ? 'ready' : /** @type {'loading' | 'empty' | 'error'} */ (data);
        const rows = running.filter((s) => !only || s.name === only).sort((a, b) => val(b) - val(a)).slice(0, only ? 1 : 5).map((s) => ({ key: s.name, label: s.name, lead: s.name, value: val(s), figure: `${val(s)} %`, detail: measure === 'ram' ? `${s.ramGb} of ${s.allowGb} GB` : `CT ${s.ct}`, pick: true }));
        setBullets(list, { threshold: 75, bad: 90, max: 100, sort: 'worst', rows, state, message: ERR, emptyTitle: 'No stack is running', emptyText: 'Start a stack and it is ranked here.', loadingRows: 8, loadingWords: 'Reading the fleet' });
        setStackbar(split, { title: 'Root volume, 240 GB', total: 240, format: (v) => `${v} GB`, restLabel: 'Free space', marks: [{ at: 0.85, label: '85 % alert' }], parts: S.ROOT_USERS, state: state === 'empty' ? 'empty' : state, message: state === 'empty' ? 'The host reports no filesystems.' : ERR, label: 'Who fills the root disk' });
        say('sk-hungry-line', only ? `Only ${only}. Press the bar again or Show all to see every stack.` : `The 5 of ${count(running.length)} running stacks that use the most, worst ${measure === 'ram' ? 'memory' : measure === 'cpu' ? 'CPU' : 'disk'} first.`);
    };
    stateButtons('data-sk-hungry-measure', (v) => ((measure = v), draw()));
    stateButtons('data-sk-hungry-data', (v) => ((data = v), draw()));
    split.addEventListener(STACKBAR_PICK_EVENT, (e) => {
        const key = /** @type {CustomEvent} */ (e).detail.key;
        if (STACKS.some((s) => s.name === key)) {
            only = only === key ? null : key;
            say('sk-hungry-log', only ? `Narrowed the ranking to ${key}.` : 'Showing every stack again.');
            draw();
        } else say('sk-hungry-log', `${key} is not a stack, so it does not narrow the ranking.`);
    });
    list.addEventListener('kp-bullets-pick', (e) => say('sk-hungry-log', `Open /stacks/${/** @type {CustomEvent} */ (e).detail.key} (the stack page).`));
    draw();
}

// ═══ fleet-nights ════════════════════════════════════════════════════════════════════════════════════════════
if (byId('fleet-nights-component')) {
    const grid = /** @type {HTMLElement} */ (byId('sk-nights'));
    let win = 14;
    let data = 'ready';
    // On a phone the grid shows the last 7 nights, so every night name keeps clear of the next; wide, the window is the choice.
    const narrowNow = () => window.matchMedia('(max-width: 40rem)').matches;
    const shown = () => (narrowNow() ? Math.min(7, win) : win);
    const count = shown;
    const everyFor = () => {
        if (narrowNow()) return 1;
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const room = grid.clientWidth - parseFloat(getComputedStyle(grid).getPropertyValue('--kp-heat-label') || '0') * rem;
        return Math.max(2, Math.ceil((3.5 * rem) / (Math.max(1, room) / shown())) + 1);
    };
    let seen = 0;
    new ResizeObserver(() => {
        if (Math.round(grid.clientWidth) !== seen) draw();
    }).observe(grid);
    const draw = () => {
        seen = Math.round(grid.clientWidth);
        if (data !== 'ready') return setHeat(grid, { columns: [], rows: [], state: /** @type {'loading' | 'empty' | 'error'} */ (data), message: data === 'empty' ? 'No backups are recorded yet.' : ERR, skeleton: { rows: 8, columns: 14 }, label: 'Backups per stack per night' });
        const step = everyFor();
        const cols = Array.from({ length: count() }, (_, i) => {
            const t = NOW - (count() - 1 - i) * S.DAY;
            return { key: String(i), label: narrowNow() ? String(new Date(t).getDate()).padStart(2, '0') : S.shortDate(t), minor: !(i === count() - 1 || (i % step === 0 && count() - 1 - i >= step)) };
        });
        const per = STACKS.map((s) => ({ s, n: S.nightsOf(s, count()) }));
        setHeat(grid, {
            label: 'Backups per stack per night',
            columns: cols,
            toggle: true,
            summary: {
                key: 'all', label: 'Missed per night',
                cells: cols.map((_, i) => {
                    const m = per.filter((p) => p.n[i] === 'bad').length;
                    const active = per.filter((p) => p.n[i] !== 'none').length;
                    return { tone: m ? 'bad' : 'ok', share: m ? m / active : 1, label: `${m} of ${active} stacks missed`, tip: `${S.dateOf(NOW - (count() - 1 - i) * S.DAY)}: ${m} of ${active} stacks missed` };
                }),
            },
            rows: per.map(({ s, n }) => ({
                key: s.name, label: s.name, muted: s.state === 'parked',
                cells: n.map((v, i) => ({ tone: v === 'ok' ? 'ok' : v === 'bad' ? 'bad' : 'paused', label: v === 'ok' ? 'backed up' : v === 'bad' ? 'missed' : 'paused', tip: `${s.name}, ${S.dateOf(NOW - (count() - 1 - i) * S.DAY)}: ${v === 'ok' ? 'backed up' : v === 'bad' ? 'missed' : 'paused (parked)'}` })),
            })),
        });
    };
    const list = (/** @type {string} */ html) => {
        const el = byId('sk-nights-list');
        if (el) el.innerHTML = html;
    };
    grid.addEventListener(HEAT_PICK_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        if (!d.picked || d.colKey == null) return list('');
        const s = byName(d.rowKey);
        const t = NOW - (count() - 1 - Number(d.colKey)) * S.DAY;
        const v = S.nightsOf(s, count())[Number(d.colKey)];
        list(`<ul class="kp-action-list"><li><span class="kp-action-list__main"><strong class="kp-action-list__title">${esc(s.name)} on ${S.dateOf(t)}</strong><span class="kp-action-list__text">${v === 'ok' ? `Backed up at 03:00, ${gb(S.backupsOf(s)[0]?.size ?? 0.5)}` : v === 'bad' ? 'Missed: the backup target was full at 03:00.' : 'Paused: the stack is parked.'}</span></span></li></ul>`);
        say('sk-nights-log', `Stacks table filtered to ${s.name}, night ${S.dateOf(t)}.`);
    });
    grid.addEventListener(HEAT_ROW_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        const key = d.pressed ? d.key : null;
        if (!key) return list('');
        const s = byName(key);
        list(`<ul class="kp-action-list">${S.backupsOf(s).map((b) => `<li><span class="kp-action-list__main"><strong class="kp-action-list__title">${esc(s.name)}, ${stamp(b.at)}</strong><span class="kp-action-list__text">${gb(b.size)}</span></span></li>`).join('') || '<li>No backups: parked.</li>'}</ul>`);
        say('sk-nights-log', `Stacks table filtered to ${s.name}.`);
    });
    stateButtons('data-sk-nights-window', (v) => ((win = Number(v)), list(''), draw()));
    stateButtons('data-sk-nights-data', (v) => ((data = v), draw()));
    draw();
}

// ═══ apps-launcher ═══════════════════════════════════════════════════════════════════════════════════════════
if (byId('apps-launcher-component')) {
    const card = stageOf(/** @type {HTMLElement} */ (byId('sk-launcher')));
    const root = /** @type {HTMLElement} */ (byId('sk-launcher'));
    const WORDS = 'answers\nfailing\ndown\ndeploying\nnot watched';
    const wordOf = (/** @type {S.App} */ a, /** @type {S.Stack} */ s) => (s.state === 'parked' || a.state === 'unwatched' ? 'not watched' : a.state === 'up' ? 'answers' : a.state === 'deploying' ? 'deploying' : a.name === 'loki' ? 'down' : 'failing');
    const all = STACKS.flatMap((s) => s.apps.map((a) => ({ s, a, w: wordOf(a, s) })));
    let values = /** @type {string[] | null} */ (null);
    let data = 'ready';
    const facets = h('div', { class: 'kp-facets', 'data-kp-facets': '', 'data-kp-facets-all': 'Everything', role: 'group', 'aria-label': 'State of the apps' }, h('ul', { class: 'kp-facets__list' }));
    const body = h('div', { class: 'sk-launcher__body' });
    root.replaceChildren(facets, body);
    attachFacets(root);
    const items = ['answers', 'failing', 'down', 'deploying', 'not watched'];
    setFacetItems(facets, items.map((v) => ({ value: v, label: v })));
    setFacetCounts(facets, Object.fromEntries(items.map((v) => [v, all.filter((x) => x.w === v).length])));
    const drawBody = () => {
        const shown = all.filter((x) => !values || values.length === 0 || values.includes(x.w));
        const groups = STACKS.map((s) => ({ s, tiles: shown.filter((x) => x.s === s) })).filter((g) => g.tiles.length);
        body.innerHTML = groups
            .map(({ s, tiles }) => {
                const ok = tiles.filter((t) => t.w === 'answers').length;
                return `<div class="sk-group"><h3 class="sk-group__name">${mark(s.name)} ${s.name} <span class="kp-badge">${tiles.length}</span></h3>
                <div class="kp-menu-button" data-kp-menu-button data-kp-key="open-${s.name}"><button type="button" class="kp-button kp-button--sm">Open ▾</button>
                    <div class="kp-menu kp-menu--rich" role="menu" aria-label="Apps of ${s.name}" hidden>
                        <button type="button" role="menuitem" class="kp-menu__item" tabindex="-1" data-kp-value="${s.name}"${ok ? '' : ' aria-disabled="true"'}><span class="kp-menu__label">Open the ${ok} ${ok === 1 ? 'app' : 'apps'} that answer</span><span class="kp-menu__hint">${ok ? 'each in its own tab' : 'none of them answers now'}</span></button>
                    </div></div>
                <div class="kp-actions" role="group" aria-label="Apps of ${s.name}">${tiles
                    .map(({ a, w }) => `<a class="kp-action sk-tile" href="#open" data-kp-hovercard data-sk-app="${s.name}/${a.name}"><strong class="kp-action__title">${mark(a.name)} ${esc(a.name)}</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">${stateWord(w, WORDS)}</span></a>`)
                    .join('')}</div></div>`;
            })
            .join('');
        attachIdmarks(body);
        attachMenuButtons(body);
        if (!groups.length) setCardState(card, 'empty', { title: 'No app is in this state', text: 'Pick Everything to see all the apps again.' });
        else if (data === 'ready') setCardState(card, 'ready');
    };
    const draw = () => {
        if (data === 'loading') return setCardState(card, 'loading', { words: 'Reading the watch state' });
        if (data === 'error') return setCardState(card, 'error', { title: 'Could not read the apps', text: ERR });
        if (data === 'empty') return setCardState(card, 'empty', { title: 'No apps yet', text: 'Stacks that declare an app show it here.' });
        setCardState(card, 'ready');
        drawBody();
    };
    facets.addEventListener(FACET_EVENT, (e) => {
        values = /** @type {CustomEvent} */ (e).detail.values;
        const all5 = values && values.length === items.length;
        if (all5) values = null;
        if (data === 'ready') drawBody();
    });
    hoverFills.push((anchor) => {
        if (!anchor.matches('[data-sk-app]')) return undefined;
        {
            const [sn, an] = (anchor.dataset.skApp ?? '/').split('/');
            const s = byName(sn);
            const a = s.apps.find((x) => x.name === an);
            if (!a) return null;
            const w = wordOf(a, s);
            const line = w === 'failing' || w === 'down' ? `${w} since ${stamp(a.since ?? NOW)}, ${a.why}` : w === 'deploying' ? `${a.why} since ${timeOf(a.since ?? NOW)}` : w === 'not watched' ? 'No probe is configured for this app.' : `answers: ${a.health}`;
            return facts(an, [['Stack', sn], ['Now', line], ['Image', a.image, 'kp-mono']]);
        }
    });
    stateButtons('data-sk-apps-show', (v) => {
        const next = v === 'trouble' ? ['failing', 'down'] : v === 'unwatched' ? ['not watched'] : null;
        setFacetValues(facets, next);
        values = next;
        if (data === 'ready') drawBody();
    });
    stateButtons('data-sk-apps-data', (v) => ((data = v), draw()));
    body.addEventListener('click', (e) => {
        const t = /** @type {HTMLElement | null} */ ((/** @type {HTMLElement} */ (e.target)).closest('[data-sk-app]'));
        if (t) {
            e.preventDefault();
            say('sk-apps-log', `Open ${t.dataset.skApp} in a new tab (sample: nothing opens).`);
        }
    });
    body.addEventListener(MENU_SELECT_EVENT, (e) => say('sk-apps-log', `Open all the answering apps of ${/** @type {CustomEvent} */ (e).detail?.value ?? 'the stack'}, each in its own tab (sample).`));
    drawBody();
}

// ═══ apps-uptime ═════════════════════════════════════════════════════════════════════════════════════════════
if (byId('apps-uptime-component')) {
    const host = /** @type {HTMLElement} */ (byId('sk-strips'));
    let unit = 'days';
    let data = 'ready';
    const targets = ['immich', 'loki', 'jellyfin'].flatMap((n) => byName(n).apps.map((a) => ({ s: byName(n), a })));
    const hash = (/** @type {number} */ n) => ((Math.imul(n ^ 0x9e3779b9, 0x85ebca6b) >>> 0) % 1000) / 1000;
    const periods = (/** @type {S.Stack} */ s, /** @type {S.App} */ a) => {
        const seed = s.ct * 13 + a.name.length;
        const n = unit === 'days' ? 90 : 48;
        return Array.from({ length: n }, (_, i) => {
            const back = n - 1 - i;
            const t = unit === 'days' ? NOW - back * S.DAY : NOW - back * S.HOUR;
            const label = unit === 'days' ? S.dateOf(t) : `${S.dateOf(t)} ${S.timeOf(t)}`;
            let state = /** @type {'up' | 'degraded' | 'down' | 'none'} */ ('up');
            if (a.state === 'unwatched' || back > n - 4) state = 'none';
            else if (a.name === 'loki' && unit === 'days' && back % 6 < 2 && back < 30) state = 'down';
            else if (a.name === 'loki' && unit === 'hours' && back % 9 < 2) state = 'down';
            else if (a.name === 'immich-machine-learning' && back < (unit === 'days' ? 3 : 3)) state = 'degraded';
            else if (hash(seed + back) > 0.985) state = 'degraded';
            return { key: String(t), label, state, ...(state === 'none' ? {} : { uptime: state === 'up' ? 1 : state === 'degraded' ? 0.93 : 0.42 }), ...(state === 'down' ? { incidents: 1, details: [`${a.name} did not answer on ${label}`, 'The container was killed: out of memory'] } : state === 'degraded' ? { incidents: 1, details: [`${a.name} answered slowly on ${label}`] } : {}) };
        });
    };
    const draw = () => {
        host.replaceChildren();
        let last = '';
        for (const { s, a } of targets) {
            if (last !== s.name) {
                host.append(h('p', { class: 'sk-strips__group' }, `Stack ${s.name}`));
                last = s.name;
            }
            const strip = h('div', { class: 'kp-uptime', 'data-kp-uptime': '', 'data-kp-uptime-count': unit === 'days' ? '90' : '48', 'data-kp-uptime-label': a.name });
            host.append(h('div', { class: 'sk-strip' }, strip));
            const ps = periods(s, a);
            if (data === 'ready') {
                setUptime(strip, { label: a.name, periods: ps, from: unit === 'days' ? '90 days ago' : '48 hours ago', to: unit === 'days' ? 'Today' : 'Now', open: 'info' });
            } else setUptime(strip, { label: a.name, periods: [], state: /** @type {'loading' | 'empty' | 'error'} */ (data), count: unit === 'days' ? 90 : 48, error: ERR });
        }
    };
    stateButtons('data-sk-uptime-window', (v) => ((unit = v), draw()));
    stateButtons('data-sk-uptime-data', (v) => ((data = v), draw()));
    host.addEventListener(UPTIME_PICK_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        say('sk-uptime-log', `${d.key}: ${d.period?.label} is ${d.period?.state}.`);
    });
    draw();
}

// ═══ presets-gallery ═════════════════════════════════════════════════════════════════════════════════════════
if (byId('presets-gallery-component')) {
    const grid = /** @type {HTMLElement} */ (byId('sk-presets'));
    const bar = /** @type {HTMLElement} */ (byId('sk-presets-bar'));
    const search = /** @type {HTMLInputElement} */ (byId('sk-presets-search'));
    const chips = /** @type {HTMLElement} */ (byId('sk-presets-needs'));
    let mode = 'intent';
    let data = 'ready';
    const entity = (/** @type {S.Preset} */ p) => ({
        key: p.key, name: p.label,
        state: { label: p.isDefault ? 'default preset' : 'preset', tone: /** @type {'success' | 'info'} */ (p.isDefault ? 'success' : 'info') },
        figures: [{ value: `${p.ram} GB`, label: 'RAM' }, { value: String(p.cores), label: 'Cores' }, { value: `${p.disk} GB`, label: 'Disk' }],
        flags: [...(p.gpu ? [{ label: 'GPU', tone: /** @type {'info'} */ ('info') }] : []), ...(p.vpn ? [{ label: 'VPN', tone: /** @type {'info'} */ ('info') }] : [])],
        actions: [{ id: 'use', label: 'Use' }, { id: 'edit', label: 'Edit' }],
    });
    const needs = () => getSegmentedValues(chips).filter((v) => v === 'gpu' || v === 'vpn');
    const match = (/** @type {S.Preset} */ p) => {
        const q = search.value.trim();
        const okText = !q || (mode === 'intent' ? matchIntent(`${p.label} ${p.blurb} ${p.words}`, q, { typo: 1 }) : p.label.includes(q.toLowerCase()));
        return okText && needs().every((n) => (n === 'gpu' ? p.gpu : p.vpn));
    };
    const draw = () => {
        const tags = [...needs().map((n) => ({ id: n, label: `Needs: ${n.toUpperCase()}` })), ...(search.value.trim() ? [{ id: 'q', label: `Search: ${search.value.trim()}` }] : [])];
        setToolbarActive(bar, tags);
        if (data === 'loading') return setEntityGridState(grid, 'loading', { count: 6 });
        if (data === 'error') return setEntityGridState(grid, 'error', { message: ERR });
        if (data === 'empty') return setEntityGridState(grid, 'empty', { title: 'No presets yet', message: 'Add a preset file and it appears here.', actionLabel: 'New preset' });
        const list = S.PRESETS.filter(match);
        say('sk-presets-count', `${list.length} of ${S.PRESETS.length} presets`);
        if (!list.length) return setEntityGridState(grid, 'empty', { title: 'No preset matches', message: `Nothing matches "${search.value.trim()}". Fewer words or another spelling may.`, actionLabel: 'Clear the search' });
        setEntityGrid(grid, list.map(entity));
    };
    search.addEventListener('input', draw);
    chips.addEventListener(SEGMENTED_EVENT, draw);
    bar.addEventListener(TOOLBAR_REMOVE_EVENT, (e) => {
        const id = /** @type {CustomEvent} */ (e).detail.id;
        if (id === 'q') search.value = '';
        else setSegmentedValues(chips, needs().filter((n) => n !== id));
        draw();
    });
    bar.addEventListener(TOOLBAR_CLEAR_EVENT, () => {
        search.value = '';
        setSegmentedValues(chips, []);
        draw();
    });
    grid.addEventListener(ENTITY_NEW_EVENT, () => {
        search.value = '';
        setSegmentedValues(chips, []);
        draw();
        say('sk-presets-log', 'Cleared the search.');
    });
    grid.addEventListener(ENTITY_ACTION_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        say('sk-presets-log', d.id === 'use' ? `Use preset ${d.key}: the page would open the stack form with it filled in.` : `Edit ${d.key}.yml: the page would open the preset editor.`);
    });
    stateButtons('data-sk-presets-mode', (v) => ((mode = v), draw()));
    actionButtons('data-sk-presets-try', (v) => {
        search.value = v;
        draw();
    });
    stateButtons('data-sk-presets-data', (v) => ((data = v), draw()));
    draw();
}

// ═══ presets-compare ═════════════════════════════════════════════════════════════════════════════════════════
if (byId('presets-compare-component')) {
    const pick = /** @type {HTMLElement} */ (byId('sk-pick'));
    const rows = /** @type {HTMLElement} */ (byId('sk-pick-rows'));
    const bar = /** @type {HTMLElement} */ (byId('sk-compare-bar'));
    const out = card0();
    const cost = /** @type {HTMLElement} */ (byId('sk-cost'));
    let costOf = 'media';
    let data = 'ready';
    function card0() {
        return stageOf(/** @type {HTMLElement} */ (byId('sk-compare')));
    }
    const compareEl = /** @type {HTMLElement} */ (byId('sk-compare'));
    let chosen = /** @type {string[]} */ ([]);
    const FIELDS = /** @type {[string, (p: S.Preset) => string][]} */ ([
        ['RAM', (p) => `${p.ram} GB`], ['Cores', (p) => String(p.cores)], ['Disk', (p) => `${p.disk} GB`], ['Swap', (p) => (p.swap ? `${p.swap} MB` : 'none')],
        ['GPU', (p) => (p.gpu ? 'passed through' : 'no')], ['VPN', (p) => (p.vpn ? 'all traffic' : 'no')], ['Nesting', (p) => (p.nesting ? 'allowed' : 'off')], ['Backup', (p) => p.backup],
    ]);
    const hint = () => {
        compareEl.innerHTML = '<div class="kp-empty"><p class="kp-empty__title">Nothing to compare yet</p><p>Tick two or three presets and press Compare.</p></div>';
    };
    const compare = (/** @type {string[]} */ keys) => {
        const ps = keys.map((k) => /** @type {S.Preset} */ (S.PRESETS.find((p) => p.key === k)));
        compareEl.innerHTML = `<div class="kp-table-wrap"><table class="kp-table"><caption class="kp-sr-only">Presets side by side</caption><thead><tr><th scope="col">Setting</th>${ps.map((p) => `<th scope="col">${esc(p.label)}</th>`).join('')}</tr></thead><tbody>${FIELDS.map(([name, f]) => {
            const vals = ps.map(f);
            const differs = new Set(vals).size > 1;
            return `<tr${differs ? ' data-differs' : ''}><th scope="row">${name}${differs ? ' <span class="kp-sr-only">(differs)</span>' : ''}</th>${vals.map((v) => `<td>${esc(v)}</td>`).join('')}</tr>`;
        }).join('')}</tbody></table></div>`;
        say('sk-compare-log', `Compared ${ps.map((p) => p.label).join(', ')}: ${FIELDS.filter(([, f]) => new Set(ps.map(f)).size > 1).length} of ${FIELDS.length} settings differ.`);
    };
    const drawCost = () => {
        const p = /** @type {S.Preset} */ (S.PRESETS.find((x) => x.key === costOf));
        const total = S.COMMITTED_GB + p.ram;
        const over = total / S.HOST_RAM_GB >= 0.8;
        setStackbar(cost, {
            title: `What would the ${p.label} preset cost? Host memory, ${S.HOST_RAM_GB} GB`, total: S.HOST_RAM_GB, format: (v) => `${v} GB`, restLabel: 'Free', marks: [{ at: 0.8, label: '80 % of the host' }],
            summary: `${S.HOST_RAM_GB - total} GB would stay free`,
            parts: [{ key: 'now', label: 'Allowed today', value: S.COMMITTED_GB }, { key: 'preset', label: `Plus ${p.label}`, value: p.ram, ...(over ? { tone: /** @type {'warning'} */ ('warning') } : {}) }],
            state: data === 'loading' ? 'loading' : data === 'error' ? 'error' : 'ready', message: ERR,
        });
    };
    const draw = () => {
        const handle = dataTable(pick);
        if (data === 'loading') {
            handle?.state('loading');
            setCardState(out, 'loading', { words: 'Reading the presets' });
        } else if (data === 'error') {
            handle?.fail(ERR);
            setCardState(out, 'error', { title: 'Could not read the presets', text: ERR });
        } else {
            handle?.state('ready');
            setCardState(out, 'ready');
            rows.innerHTML = (data === 'empty' ? [] : S.PRESETS)
                .map((p) => `<tr data-kp-row-key="${p.key}" data-kp-row-label="${p.label}"><td><input type="checkbox" class="kp-field__check" data-kp-select-row value="${p.key}" aria-label="Select ${p.label}" /></td><td data-label="Preset" data-kp-sort-value="${p.label}"><b>${p.label}</b>${p.isDefault ? ' <span class="kp-badge kp-badge--success">default</span>' : ''}</td><td data-label="What it is for">${esc(p.blurb)}</td><td class="kp-text-end" data-label="RAM" data-kp-sort-value="${p.ram}">${p.ram} GB</td><td class="kp-text-end" data-label="Cores" data-kp-sort-value="${p.cores}">${p.cores}</td></tr>`)
                .join('');
            handle?.refresh();
            attachSelectionBars(pick);
            tick(pick, chosen);
            if (chosen.length >= 2 && chosen.length <= 3) compare(chosen);
            else hint();
        }
        drawCost();
    };
    setSelectionRules(bar, { compare: (items) => (items.length < 2 ? 'Tick at least two presets to compare' : items.length > 3 ? 'Compare at most three presets at a time' : '') });
    bar.addEventListener('kp-selection-change', (e) => (chosen = /** @type {CustomEvent} */ (e).detail.keys));
    bar.addEventListener('kp-selection-action', (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        if (d.action === 'compare') compare(d.keys);
    });
    actionButtons('data-sk-compare-pick', (v) => tick(pick, v === 'three' ? ['light', 'media', 'ml'] : v === 'two' ? ['database', 'build'] : []));
    stateButtons('data-sk-compare-cost', (v) => ((costOf = v), drawCost()));
    stateButtons('data-sk-compare-data', (v) => ((data = v), draw()));
    draw();
}

// ═══ retired-table ═══════════════════════════════════════════════════════════════════════════════════════════
if (byId('retired-table-component')) {
    const table = /** @type {HTMLElement} */ (byId('sk-retired'));
    const rows = /** @type {HTMLElement} */ (byId('sk-retired-rows'));
    let age = 'all';
    let data = 'ready';
    const biggest = Math.max(...S.RETIRED.map((r) => r.repo + r.appdata));
    const draw = () => {
        const handle = dataTable(table);
        const list = S.RETIRED.filter((r) => age === 'all' || S.ageDays(r.at) > 90);
        const shown = data === 'empty' ? [] : list;
        const repo = shown.reduce((t, r) => t + r.repo, 0);
        const app = shown.reduce((t, r) => t + r.appdata, 0);
        const total = repo + app;
        byId('sk-retired-total')?.replaceChildren(`${total.toFixed(1)}`, h('small', null, 'GB'));
        say('sk-retired-sub', `${plural(shown.length, 'stack')}${age === 'old' ? ', older than 90 days' : ''}`);
        setStackbar(/** @type {HTMLElement} */ (byId('sk-retired-split')), {
            title: `Retired data keeps ${total.toFixed(1)} GB`, format: (v) => `${v.toFixed(1)} GB`, legend: true, label: 'What retired data keeps',
            parts: [{ key: 'repo', label: 'In backups (restic)', value: repo }, { key: 'app', label: 'In app data', value: app }],
            state: data === 'loading' ? 'loading' : data === 'error' ? 'error' : shown.length ? 'ready' : 'empty', message: data === 'error' ? ERR : 'Nothing is retired.',
        });
        if (data === 'loading') return handle?.state('loading');
        if (data === 'error') return handle?.fail(ERR);
        handle?.state('ready');
        rows.innerHTML = shown
            .map((r) => `<tr data-kp-row-key="${r.name}"><td data-label="Stack" data-kp-sort-value="${r.name}">${mark(r.name)} <b>${r.name}</b></td>
                <td data-label="Retired on" data-kp-sort-value="${r.at}" class="sk-nowrap">${stamp(r.at)}</td><td class="kp-text-end" data-label="Age" data-kp-sort-value="${S.ageDays(r.at)}">${plural(S.ageDays(r.at), 'day')}</td>
                <td data-label="Size"><span class="kp-bar-cell" data-sk-size="${r.name}"></span></td>
                <td class="kp-text-end" data-label="Snapshots" data-kp-sort-value="${r.snapshots}">${r.snapshots}</td><td data-label="Newest snapshot" data-kp-sort-value="${r.newest}" class="sk-nowrap">${stamp(r.newest)}</td>
                <td data-label="Retired by">${r.by}</td><td data-label="Vault">${r.vault ? 'yes' : 'no'}</td></tr>`)
            .join('');
        for (const el of /** @type {NodeListOf<HTMLElement>} */ (rows.querySelectorAll('[data-sk-size]'))) {
            const r = /** @type {S.Retired} */ (S.RETIRED.find((x) => x.name === el.dataset.skSize));
            setBarCell(el, { value: (r.repo + r.appdata) / biggest, text: gb(r.repo + r.appdata), sortValue: r.repo + r.appdata, tone: null, label: 'of the biggest retired stack' });
        }
        attachIdmarks(rows);
        handle?.refresh();
    };
    stateButtons('data-sk-retired-age', (v) => ((age = v), draw()));
    stateButtons('data-sk-retired-data', (v) => ((data = v), draw()));
    draw();
}

// ═══ retired-wipe ════════════════════════════════════════════════════════════════════════════════════════════
if (byId('retired-wipe-component')) {
    const table = /** @type {HTMLElement} */ (byId('sk-wipe'));
    const rows = /** @type {HTMLElement} */ (byId('sk-wipe-rows'));
    const bar = /** @type {HTMLElement} */ (byId('sk-wipe-bar'));
    let list = [...S.RETIRED];
    let refuse = false;
    const draw = () => {
        rows.innerHTML = list
            .map((r) => `<tr data-kp-row-key="${r.name}" data-kp-row-label="${r.name}"><td><input type="checkbox" class="kp-field__check" data-kp-select-row value="${r.name}" aria-label="Select ${r.name}"${r.locked ? ' disabled' : ''} /></td>
                <td data-label="Stack" data-kp-sort-value="${r.name}">${mark(r.name)} <b>${r.name}</b></td><td class="kp-text-end" data-label="Age" data-kp-sort-value="${S.ageDays(r.at)}">${plural(S.ageDays(r.at), 'day')}</td>
                <td data-label="Size"><span class="kp-bar-cell" data-sk-size="${r.name}"></span></td>
                <td data-label="Can it be wiped now?">${r.locked ? `<span class="kp-badge kp-badge--warning">Not now</span> ${esc(r.locked)}` : '<span class="kp-badge kp-badge--success">Yes</span>'}</td></tr>`)
            .join('');
        for (const el of /** @type {NodeListOf<HTMLElement>} */ (rows.querySelectorAll('[data-sk-size]'))) {
            const r = /** @type {S.Retired} */ (S.RETIRED.find((x) => x.name === el.dataset.skSize));
            setBarCell(el, { value: (r.repo + r.appdata) / 18.5, text: gb(r.repo + r.appdata), sortValue: r.repo + r.appdata, tone: null });
        }
        attachIdmarks(rows);
        dataTable(table)?.refresh();
        attachSelectionBars(table);
        summary([]);
    };
    const sizeOf = (/** @type {string[]} */ keys) => list.filter((r) => keys.includes(r.name)).reduce((t, r) => t + r.repo + r.appdata, 0);
    const summary = (/** @type {string[]} */ keys) => say('sk-wipe-total', keys.length ? `${plural(keys.length, 'stack')} ticked keep ${gb(sizeOf(keys))} that would be gone for good.` : `${plural(list.length, 'retired stack')} keep ${gb(sizeOf(list.map((r) => r.name)))} in all.`);
    bar.addEventListener('kp-selection-change', (e) => summary(/** @type {CustomEvent} */ (e).detail.keys));
    bar.addEventListener('kp-selection-action', (e) => {
        const { keys, button } = /** @type {CustomEvent} */ (e).detail;
        const chosen = list.filter((r) => keys.includes(r.name));
        openConfirmation(button, {
            phrase: `Wipe ${plural(chosen.length, 'retired stack')} for good? This cannot be undone.`,
            typeName: chosen.length === 1 ? chosen[0].name : `wipe ${chosen.length} stacks`,
            loses: chosen.map((r) => `${r.name}: ${gb(r.repo)} of backups (${r.snapshots} snapshots) and ${gb(r.appdata)} of app data`),
            acceptLabel: 'Wipe',
            onAccept: () => {
                setSelectionBusy(bar, `Wiping ${chosen.length}...`);
                window.setTimeout(() => {
                    const refused = refuse && keys.includes('plex') ? [{ key: 'plex', reason: 'a restore from it is still running' }] : [];
                    const done = keys.filter((/** @type {string} */ k) => !refused.some((r) => r.key === k));
                    list = list.filter((r) => !done.includes(r.name));
                    setSelectionBusy(bar, null);
                    draw();
                    setSelectionResult(bar, { done: done.length, refused });
                    say('sk-wipe-log', `DELETE /api/retired {"stacks":[${keys.join(',')}]}  ->  ${done.length} wiped, ${refused.length} refused.`);
                }, 1200);
            },
        });
    });
    actionButtons('data-sk-wipe-pick', (v) => tick(table, v === 'two' ? ['nextcloud-old', 'plex'] : v === 'all' ? list.filter((r) => !r.locked).map((r) => r.name) : []));
    stateButtons('data-sk-wipe-server', (v) => (refuse = v === 'refuses'));
    actionButtons('data-sk-wipe-reset', () => {
        list = [...S.RETIRED];
        draw();
        say('sk-wipe-log', 'The six retired stacks are back.');
    });
    draw();
}

// ═══ hub-overview ════════════════════════════════════════════════════════════════════════════════════════════
if (byId('hub-overview-component')) {
    const panel0 = /** @type {HTMLElement} */ (byId('sk-hub-panel-0'));
    const card = stageOf(/** @type {HTMLElement} */ (panel0.firstElementChild));
    const chart = /** @type {HTMLElement} */ (byId('sk-hub-chart'));
    const host = /** @type {HTMLElement} */ (byId('sk-hub-checks'));
    const kpis = /** @type {HTMLElement} */ (byId('sk-hub-kpis'));
    let name = 'immich';
    let data = 'ready';
    const rowsOf = (/** @type {S.Stack} */ s) => {
        const { up, total } = appsOf(s);
        const bad = s.apps.find((a) => a.state === 'degraded');
        const stale = S.STALE.find((x) => x.stack === s.name);
        const memBad = s.ram >= 0.9;
        return [
            { id: 'containers', label: 'Containers are running', state: /** @type {const} */ ('ok'), detail: `${up} of ${total} apps up` },
            bad && !memBad
                ? { id: 'probes', label: 'Every probe answers', state: /** @type {const} */ ('failed'), detail: `${bad.name}: ${bad.why}, since ${stamp(bad.since ?? NOW)}`, fix: 'Restart the worker: the model cache is corrupt. Run the command below; it recreates only that container.' }
                : bad
                  ? { id: 'probes', label: 'Every probe answers', state: /** @type {const} */ ('failed'), detail: `${bad.name}: ${bad.why}`, fix: 'The container is killed for memory. Raise the memory limit to 6 GB in the stack file and apply.' }
                  : { id: 'probes', label: 'Every probe answers', state: /** @type {const} */ ('ok'), detail: 'all probes answered within 2 s' },
            { id: 'backup', label: 'Backed up last night', state: /** @type {const} */ ('ok'), detail: `${stamp(S.lastBackup(s)?.at ?? NOW)}, ${gb(S.lastBackup(s)?.size ?? 0.3)}` },
            { id: 'disk', label: 'Disk is below 80 %', state: /** @type {const} */ ('ok'), detail: `${Math.round(s.disk * 100)} % of the volume` },
            memBad ? { id: 'memory', label: 'Memory is below its limit', state: /** @type {const} */ ('failed'), detail: `${Math.round(s.ram * 100)} % of ${s.allowGb} GB; killed ${s.restarts} times in 24 h`, fix: 'Raise the memory limit of the stack, or lower loki\'s retention so it holds less in memory.' } : { id: 'memory', label: 'Memory is below its limit', state: /** @type {const} */ ('ok'), detail: `${Math.round(s.ram * 100)} % of ${s.allowGb} GB` },
            { id: 'image', label: 'Images are current', state: stale ? /** @type {const} */ ('warn') : /** @type {const} */ ('ok'), detail: stale ? `${stale.app} ${stale.from} can go to ${stale.to}` : 'nothing waiting', ...(stale ? { fix: `Open the Update page for ${s.name} and read the notes first.` } : {}) },
            { id: 'firewall', label: 'Firewall rules are loaded', state: /** @type {const} */ ('ok'), detail: 'declared and enforced' },
        ];
    };
    const draw = () => {
        if (data === 'loading') return setCardState(card, 'loading', { words: 'Running the checks' });
        if (data === 'error') return setCardState(card, 'error', { title: 'Could not run the checks', text: ERR });
        if (data === 'empty') return setCardState(card, 'empty', { title: 'No checks for this stack', text: 'A stack with no apps has nothing to check.' });
        setCardState(card, 'ready');
        const s = byName(name);
        const rows = rowsOf(s);
        host.replaceChildren(buildStatusList(rows, { label: `Health checks of ${name}`, retry: true, single: true }));
        attachStatusLists(host);
        const c = countStatus(/** @type {Element} */ (host.firstElementChild));
        say('sk-hub-count', `${c.ok} of ${c.total} checks pass`);
        const failing = rows.filter((r) => r.state === 'failed');
        setProblems(/** @type {Element} */ (byId('sk-hub-problems')), failing.map((r) => ({ key: r.id, what: r.label.replace('Every probe answers', 'A probe does not answer').replace('Memory is below its limit', 'The stack runs out of memory'), why: r.detail, remedy: r.fix, command: `homelab deploy ${name}`, severity: /** @type {'critical'} */ ('critical') })), { mode: 'fold', foldFrom: 3 });
        kpis.innerHTML = `<div class="kp-kpi"><span class="kp-kpi__label">Disk</span><span class="kp-kpi__value">${Math.round(s.disk * 100)}<small>%</small></span><span class="kp-kpi__trend">alert at 80 %</span><span class="kp-kpi__meter" id="sk-hub-meter"></span></div>
            <div class="kp-kpi"><span class="kp-kpi__label">Restarts in 24 h</span><span class="kp-kpi__value">${s.restarts}</span><svg class="kp-kpi__spark" data-kp-spark="${[0, 0, 1, 0, 0, 2, 0, 0, s.restarts > 2 ? 4 : 0, 0, s.restarts, 0].join(' ')}" role="img" aria-label="Restarts per two hours"></svg></div>
            <div class="kp-kpi"><span class="kp-kpi__label">Apps up</span><span class="kp-kpi__value">${appsOf(s).up}<small>of ${appsOf(s).total}</small></span><span class="kp-kpi__trend">${s.apps.filter((a) => a.state === 'unwatched').length} not watched</span></div>`;
        setMeter(/** @type {HTMLElement} */ (byId('sk-hub-meter')), { value: s.disk, mark: 0.8, markLabel: 'alert at 80 %', ...(s.disk >= 0.8 ? { tone: /** @type {'warning'} */ ('warning') } : {}) });
        import('../../js/kpi.js').then((m) => m.attachSparklines(kpis));
        const uses = S.EDGES.filter((e) => e.from === name).map((e) => ({ from: name, to: e.to, state: /** @type {'running'} */ ('running') }));
        const usedBy = S.EDGES.filter((e) => e.to === name).map((e) => ({ from: e.from, to: name, state: /** @type {'running'} */ ('running') }));
        setDeplist(/** @type {HTMLElement} */ (byId('sk-hub-deps')), [...uses, ...usedBy].filter((x, i, a) => a.findIndex((y) => y.from === x.from && y.to === x.to) === i));
    };
    const drawChart = () => {
        const s = byName(name);
        if (data === 'loading') return chart.setAttribute('data-kp-chart-loading', '');
        if (data === 'error') return setChartData(chart, { label: 'Resources', series: [], error: ERR });
        if (data === 'empty') return setChartData(chart, { label: 'Resources', series: [{ label: 'CPU', points: [] }] });
        const pts = (/** @type {number} */ base, /** @type {number} */ amp, /** @type {number} */ seed) => Array.from({ length: 145 }, (_, i) => /** @type {[number, number]} */ ([NOW - (144 - i) * 10 * 60000, Math.max(0.5, Math.round((base + amp * Math.sin(i / 11 + seed) + (i > 100 && name !== 'jellyfin' ? amp * 0.9 : 0) + ((i * seed) % 7) * 0.2) * 10) / 10)]));
        setChartData(chart, {
            label: 'Resources of the stack, last 24 hours', key: 'hub', unitKind: 'percent', yMax: 100, from: NOW - 24 * S.HOUR, to: NOW,
            series: [{ label: 'CPU', points: pts(s.cpu * 100 * 2, 4, 1) }, { label: 'Memory', points: pts(s.ram * 100 - 6, 3, 2) }, { label: 'Disk', points: pts(s.disk * 100, 0.3, 3) }],
            kinds: { deploy: { label: 'Deploy', tone: 'info' } },
            events: [{ at: NOW - 5 * S.HOUR - 40 * 60000, label: 'Deployed 3.75.0 by Kenny', kind: 'deploy' }, { at: NOW - 19 * S.HOUR, label: 'Applied by Claude: memory limit changed', kind: 'deploy' }],
        });
    };
    host.addEventListener(STATUS_RETRY_EVENT, (e) => {
        const id = /** @type {CustomEvent} */ (e).detail.id;
        const list = /** @type {Element} */ (host.firstElementChild);
        const row = rowsOf(byName(name)).find((r) => r.id === id);
        setStatus(list, id, { state: 'loading', detail: 'reading again...' });
        window.setTimeout(() => {
            if (row) setStatus(list, id, { state: row.state, detail: row.detail });
        }, 900);
        say('sk-hub-log', `GET /api/stacks/${name}/checks/${id}: only this check is read again.`);
    });
    byId('sk-hub-problems')?.addEventListener('click', (e) => {
        if ((/** @type {HTMLElement} */ (e.target)).closest('[data-kp-copy], .kp-command')) say('sk-hub-log', `Copied: homelab deploy ${name}`);
    });
    panel0.parentElement?.addEventListener('click', (e) => {
        if ((/** @type {HTMLElement} */ (e.target)).closest('#sk-hub-tab-1')) window.setTimeout(drawChart, 80);
    });
    stateButtons('data-sk-hub-stack', (v) => ((name = v), draw(), drawChart()));
    stateButtons('data-sk-hub-data', (v) => ((data = v), draw(), drawChart()));
    draw();
}

// ═══ hub-apps ════════════════════════════════════════════════════════════════════════════════════════════════
if (byId('hub-apps-component')) {
    const table = /** @type {HTMLElement} */ (byId('sk-appstab'));
    const rows = /** @type {HTMLElement} */ (byId('sk-appstab-rows'));
    let name = 'immich';
    let data = 'ready';
    const draw = () => {
        const handle = dataTable(table);
        if (data === 'loading') return handle?.state('loading');
        if (data === 'error') return handle?.fail(ERR);
        handle?.state('ready');
        const s = byName(name);
        const list = data === 'empty' ? [] : s.apps;
        rows.innerHTML = list
            .map((a) => {
                const w = a.state === 'up' ? 'up' : a.state === 'unwatched' ? 'not watched' : a.state === 'deploying' ? 'deploying' : 'failing';
                return `<tr data-kp-row-key="${a.name}"><td data-label="App" data-kp-sort-value="${a.name}">${mark(a.name)} <b>${a.name}</b></td><td data-label="State" data-kp-sort-value="${w}" data-kp-filter-value="${w}">${stateWord(w, 'up\nfailing\nnot watched\ndeploying')}</td>
                <td data-label="Image" class="kp-mono" data-kp-sort-value="${a.image}">${esc(a.image.split('/').pop() ?? a.image)}</td><td class="kp-text-end" data-label="Restarts in 24 h" data-kp-sort-value="${a.restarts}">${a.restarts}</td><td data-label="Health">${esc(a.health)}</td></tr>
                <tr data-kp-row-detail><td colspan="6"><div class="sk-detail"><div class="kp-formgrid" data-kp-formgrid-stack="never"><dl class="kp-kv"><div class="kp-kv__row"><dt>Image</dt><dd class="kp-mono">${esc(a.image)}</dd></div><div class="kp-kv__row"><dt>Digest</dt><dd class="kp-mono">${esc(a.digest)}</dd></div><div class="kp-kv__row"><dt>Ports</dt><dd class="kp-mono">${esc(a.ports)}</dd></div><div class="kp-kv__row"><dt>Restarts</dt><dd>${a.restarts} in 24 h</dd></div><div class="kp-kv__row"><dt>Health</dt><dd>${esc(a.health)}</dd></div></dl></div>
                <div class="sk-detail__side"><figure class="kp-code" data-kp-code data-sk-log="${a.name}"><pre class="kp-code__body"><code></code></pre></figure></div></div></td></tr>`;
            })
            .join('');
        for (const el of /** @type {NodeListOf<HTMLElement>} */ (rows.querySelectorAll('[data-sk-log]'))) {
            const a = s.apps.find((x) => x.name === el.dataset.skLog);
            setCode(el, { title: 'Last three log lines', language: 'log', text: (a?.log ?? []).join('\n'), wrap: true, copy: true });
        }
        attachIdmarks(rows);
        handle?.refresh();
    };
    stateButtons('data-sk-apps-stack', (v) => ((name = v), draw()));
    stateButtons('data-sk-appstab-density', (v) => dataTable(table)?.density(/** @type {'comfortable' | 'compact'} */ (v)));
    stateButtons('data-sk-appstab-data', (v) => ((data = v), draw()));
    table.addEventListener('kp-datatable-expand', (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        if (d.open) say('sk-appstab-log', `Opened ${d.key}.`);
    });
    draw();
}

// ═══ hub-backups ═════════════════════════════════════════════════════════════════════════════════════════════
if (byId('hub-backups-component')) {
    const strips = /** @type {HTMLElement} */ (byId('sk-backups-strips'));
    const heat = /** @type {HTMLElement} */ (byId('sk-backups-heat'));
    let view = 'strips';
    let name = 'immich';
    let data = 'ready';
    const nightsFor = (/** @type {S.Stack} */ s, /** @type {S.App} */ a, /** @type {number} */ n) => {
        const base = S.nightsOf(s, n);
        const keep = a.name.includes('redis') ? 9 : n;
        return base.map((v, i) => (n - 1 - i >= keep ? 'none' : v));
    };
    const draw = () => {
        strips.hidden = view !== 'strips';
        heat.hidden = view !== 'heat';
        const s = byName(name);
        const apps = s.apps.filter((a) => a.state !== 'unwatched' || true);
        if (view === 'strips') {
            strips.replaceChildren();
            for (const a of apps) {
                const strip = h('div', { class: 'kp-uptime', 'data-kp-uptime': '', 'data-kp-uptime-count': '14', 'data-kp-uptime-label': a.name });
                strips.append(h('div', { class: 'sk-strip' }, strip));
                if (data !== 'ready') {
                    setUptime(strip, { label: a.name, periods: [], state: /** @type {'loading' | 'empty' | 'error'} */ (data), count: 14, error: ERR });
                    continue;
                }
                const ns = nightsFor(s, a, 14);
                const ps = ns.map((v, i) => {
                    const t = NOW - (13 - i) * S.DAY - 6 * S.HOUR - 41 * 60000;
                    return { key: String(t), label: S.dateOf(t), state: /** @type {'up' | 'down' | 'none'} */ (v === 'ok' ? 'up' : v === 'bad' ? 'down' : 'none'), ...(v === 'bad' ? { details: [`Missed on ${stamp(t)}: the backup target was full`, `Restore would open on ${S.dateOf(t - S.DAY)} 03:00`] } : v === 'none' ? { tip: `${S.dateOf(t)}: before the oldest kept backup, nothing to restore` } : {}) };
                });
                setUptime(strip, { label: a.name, periods: ps, from: '14 nights ago', to: 'Last night', open: 'info' });
            }
        } else {
            if (data !== 'ready') return setHeat(heat, { columns: [], rows: [], state: /** @type {'loading' | 'empty' | 'error'} */ (data), message: data === 'empty' ? 'No backups are recorded yet.' : ERR, skeleton: { rows: 4, columns: 14 }, label: 'Backups per app per night' });
            const cols = Array.from({ length: 30 }, (_, i) => ({ key: String(i), label: S.shortDate(NOW - (29 - i) * S.DAY), minor: i % 2 === 1 }));
            setHeat(heat, {
                label: 'Backups per app per night', columns: cols, every: 5,
                rows: apps.map((a) => ({ key: a.name, label: a.name, cells: nightsFor(s, a, 30).map((v, i) => ({ tone: v === 'ok' ? 'ok' : v === 'bad' ? 'bad' : 'before', label: v === 'ok' ? 'backed up' : v === 'bad' ? 'missed' : 'before the oldest kept backup', tip: `${a.name}, ${S.dateOf(NOW - (29 - i) * S.DAY)}` })) })),
            });
        }
    };
    strips.addEventListener(UPTIME_PICK_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        say('sk-backups-log', d.period?.state === 'down' ? `Restore would open on ${d.period.label}, preselected, for ${d.key ?? 'this app'}.` : `${d.period?.label}: ${d.period?.state === 'none' ? 'before the oldest kept backup, nothing to restore.' : 'backed up.'}`);
    });
    heat.addEventListener(HEAT_PICK_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        if (d.picked) say('sk-backups-log', `Restore would open for ${d.rowKey} on night ${d.colKey}, preselected.`);
    });
    stateButtons('data-sk-backups-view', (v) => ((view = v), draw()));
    stateButtons('data-sk-backups-stack', (v) => ((name = v), draw()));
    stateButtons('data-sk-backups-data', (v) => ((data = v), draw()));
    draw();
}

// ═══ apply-plan ══════════════════════════════════════════════════════════════════════════════════════════════
if (byId('apply-plan-component')) {
    const table = /** @type {HTMLElement} */ (byId('sk-plan'));
    const rows = /** @type {HTMLElement} */ (byId('sk-plan-rows'));
    const bar = /** @type {HTMLElement} */ (byId('sk-plan-bar'));
    const words = /** @type {HTMLElement} */ (byId('sk-plan-words'));
    const form = /** @type {HTMLElement} */ (byId('sk-plan-sentence'));
    let data = 'ready';
    let destroyMode = 'alone';
    let keys = /** @type {string[]} */ ([]);
    const lines = (/** @type {S.PlanRow} */ p) => {
        const { add, del } = S.plusMinus(p);
        return `<span class="sk-pair"><span class="sk-add">+${add}</span><span class="sk-del">&minus;${del}</span></span>`;
    };
    const diffHtml = (/** @type {S.PlanRow} */ p) =>
        p.files.length
            ? p.files
                  .map((f) => {
                      const pm = S.filePlusMinus(f);
                      return `<div class="sk-diff"><div class="sk-diff__file"><span>${esc(f.path)}</span><span class="sk-add">+${pm.add}</span><span class="sk-del">&minus;${pm.del}</span></div><pre class="kp-diff" aria-label="Changes to ${esc(f.path)}">${f.hunks
                          .map((hk) => `<div class="kp-diff__hunk">${esc(hk.header)}${hk.context ? ` <span class="kp-diff__hunk-context">${esc(hk.context)}</span>` : ''}</div>${hk.lines.map(([kind, n, text]) => `<span class="kp-diff__line" data-kind="${kind}"><span class="kp-diff__number">${n}</span><span class="kp-diff__sign">${kind === 'added' ? '+' : kind === 'removed' ? '-' : ' '}</span><span>${esc(text)}</span></span>`).join('')}`)
                          .join('')}</pre></div>`;
                  })
                  .join('')
            : '<p class="sk-pane__line">No file changed since the last apply.</p>';
    const draw = () => {
        const handle = dataTable(table);
        if (data === 'loading') return handle?.state('loading');
        if (data === 'error') return handle?.fail(ERR);
        handle?.state('ready');
        const plan = data === 'empty' ? [] : S.PLAN;
        rows.innerHTML = plan
            .map((p) => {
                const pm = S.plusMinus(p);
                return `<tr data-kp-row-key="${p.key}" data-kp-row-label="${p.stack}"><td><input type="checkbox" class="kp-field__check" data-kp-select-row value="${p.key}" aria-label="Select ${p.stack}"${p.action === 'skip' ? ' disabled' : ''} /></td>
                <td data-label="Stack" data-kp-sort-value="${p.stack}">${mark(p.stack)} <b>${p.stack}</b></td>
                <td data-label="Action" data-kp-sort-value="${p.action}"><span class="kp-badge ${p.action === 'destroy' ? 'kp-badge--destructive' : p.action === 'new' ? 'kp-badge--success' : p.action === 'skip' ? '' : 'kp-badge--info'}">${p.action}</span></td>
                <td data-label="What changed">${esc(p.note)}</td><td class="kp-text-end" data-label="Files" data-kp-sort-value="${p.files.length}">${p.files.length}</td><td class="kp-text-end sk-nowrap" data-label="Lines" data-kp-sort-value="${pm.add + pm.del}">${lines(p)}</td></tr>
                <tr data-kp-row-detail><td colspan="7">${diffHtml(p)}</td></tr>`;
            })
            .join('');
        attachIdmarks(rows);
        handle?.refresh();
        attachSelectionBars(table);
        tick(table, destroyMode === 'ticked' ? ['jellyfin', 'immich', 'loki', 'wiki2', 'paperless', 'homepage'] : ['jellyfin', 'immich', 'loki', 'wiki2', 'paperless']);
    };
    const sentence = () => {
        const dep = keys.filter((k) => S.PLAN.find((p) => p.key === k)?.action !== 'destroy');
        const news = dep.filter((k) => S.PLAN.find((p) => p.key === k)?.action === 'new').length;
        const des = keys.length - dep.length;
        const sel = /** @type {HTMLSelectElement | null} */ (form.querySelector('select'));
        const keep = sel?.value ?? 'yes';
        words.innerHTML = `Will deploy <b>${dep.length}</b> ${dep.length === 1 ? 'stack' : 'stacks'} (${news} new), destroy <b>${des}</b>, <span class="kp-sentence__field"><select name="backup" aria-label="Backups before applying"><option value="yes"${keep === 'yes' ? ' selected' : ''}>back up first</option><option value="skip"${keep === 'skip' ? ' selected' : ''}>skip backups</option></select></span>.`;
        attachSentences(form.parentElement ?? document);
    };
    setSelectionRules(bar, { apply: (items) => (destroyMode === 'alone' && items.some((i) => i.key === 'homepage') && items.length > 1 ? 'A destroy never rides along with a deploy: untick homepage, or apply it on its own' : '') });
    bar.addEventListener('kp-selection-change', (e) => {
        keys = /** @type {CustomEvent} */ (e).detail.keys;
        const onlyD = destroyMode === 'alone' && keys.length === 1 && keys[0] === 'homepage';
        /** @type {HTMLElement} */ (bar.querySelector('[data-kp-selection-action="apply"]')).hidden = onlyD;
        /** @type {HTMLElement} */ (bar.querySelector('[data-kp-selection-action="destroy"]')).hidden = !onlyD;
        sentence();
    });
    bar.addEventListener('kp-selection-action', (e) => {
        const { action, button, keys: ks } = /** @type {CustomEvent} */ (e).detail;
        if (action === 'destroy' || (action === 'apply' && ks.includes('homepage'))) {
            openConfirmation(button, { phrase: 'Destroy the stack homepage?', typeName: 'homepage', loses: ['1 container: homepage', '/srv/homepage/config (0.4 GB)'], acceptLabel: 'Destroy homepage', onAccept: () => say('sk-plan-log', `POST /api/apply {"stacks":[${ks.join(',')}],"confirm":"homepage"}`) });
        } else say('sk-plan-log', `POST /api/apply {"stacks":[${ks.join(',')}],"backup":"${form.querySelector('select')?.value ?? 'yes'}"}  (sample: nothing is sent)`);
    });
    form.addEventListener('kp-sentence-change', () => say('sk-plan-log', `Backups before applying: ${form.querySelector('select')?.value === 'skip' ? 'skipped' : 'taken first'}.`));
    actionButtons('data-sk-plan-pick', (v) => tick(table, v === 'safe' ? ['jellyfin', 'immich', 'loki', 'wiki2', 'paperless'] : v === 'mixed' ? ['jellyfin', 'immich', 'loki', 'wiki2', 'paperless', 'homepage'] : []));
    stateButtons('data-sk-plan-destroy', (v) => ((destroyMode = v), draw()));
    stateButtons('data-sk-plan-data', (v) => ((data = v), draw()));
    draw();
    sentence();
}

// ═══ apply-run ═══════════════════════════════════════════════════════════════════════════════════════════════
if (byId('apply-run-component')) {
    const host = /** @type {HTMLElement} */ (byId('sk-run-list'));
    const bar = /** @type {HTMLElement} */ (byId('sk-run-time'));
    const TIMES = [['jellyfin', 80], ['immich', 95], ['loki', 130], ['wiki2', 40], ['paperless', 35]];
    const fmt = (/** @type {number} */ s) => `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, '0')} s`.replace('0 min ', '');
    let outcome = 'ok';
    let token = 0;
    let list = /** @type {Element} */ (document.body);
    const build = () => {
        host.replaceChildren(buildSteplist(TIMES.map(([k]) => ({ id: String(k), title: String(k), note: 'Queued', state: /** @type {const} */ ('pending') })), { label: 'Apply, stack by stack' }));
        list = /** @type {Element} */ (host.firstElementChild);
        attachSteplists(host);
        setStackbar(bar, { title: `This batch takes about ${fmt(TIMES.reduce((t, x) => t + Number(x[1]), 0))}`, format: fmt, legend: true, label: 'Time per stack', parts: TIMES.map(([k, v]) => ({ key: String(k), label: String(k), value: Number(v) })) });
        say('sk-run-now', 'Ready: nothing has started.');
        host.querySelector('.sk-run-retry')?.remove();
    };
    const run = async (/** @type {string[]} */ only = TIMES.map(([k]) => String(k))) => {
        const me = ++token;
        const go = /** @type {HTMLButtonElement} */ (byId('sk-run-go'));
        go.disabled = true;
        let ok = 0;
        let failed = 0;
        for (const key of only) {
            if (me !== token) return;
            const fails = outcome === 'fail' && key === 'loki';
            say('sk-run-now', `Running now: ${key} (${only.indexOf(key) + 1} of ${only.length})`);
            const t0 = Date.now();
            for (const [word, ms] of /** @type {[string, number][]} */ ([['Pulling the image', 650], ['Restarting', 650], ['Checking it answers', 800]])) {
                if (me !== token) return;
                setStep(list, key, { state: 'running', note: word });
                say('sk-run-log', `${key}: ${word.toLowerCase()}`);
                await wait(ms);
            }
            const secs = Math.round(Number(TIMES.find((x) => x[0] === key)?.[1] ?? 40) * 0.45);
            if (fails) {
                failed++;
                setStep(list, key, { state: 'failed', note: 'Failed: out of memory 8 s after the restart. Fix: raise the memory limit to 6 GB (it is in this plan) and retry this stack only.', time: `${secs} s` });
                say('sk-run-log', `${key}: failed, out of memory 8 s after the restart`);
            } else {
                ok++;
                setStep(list, key, { state: 'done', note: 'Answers', time: `${secs} s` });
                say('sk-run-log', `${key}: done in ${secs} s (${Math.round((Date.now() - t0) / 100) / 10} s here)`);
            }
        }
        if (me !== token) return;
        say('sk-run-now', failed ? `${ok} applied, ${failed} failed. The ones that worked stay applied.` : `${ok} applied.`);
        go.disabled = false;
        if (failed) {
            const retry = h('button', { type: 'button', class: 'kp-button sk-run-retry' }, 'Retry loki only');
            retry.addEventListener('click', () => {
                retry.remove();
                outcome = 'ok';
                press('data-sk-run-outcome', 'ok');
                setStep(list, 'loki', { state: 'pending', note: 'Queued', time: '' });
                void run(['loki']);
            });
            host.append(retry);
        }
    };
    actionButtons('data-sk-run', (v) => {
        token++;
        build();
        byId('sk-run-go')?.removeAttribute('disabled');
        if (v === 'play') void run();
    });
    byId('sk-run-go')?.addEventListener('click', () => {
        token++;
        build();
        void run();
    });
    stateButtons('data-sk-run-outcome', (v) => ((outcome = v), token++, build(), byId('sk-run-go')?.removeAttribute('disabled')));
    byId('sk-run-destroy')?.addEventListener('click', () => say('sk-run-log', 'POST /api/apply {"stacks":["homepage"],"confirm":"homepage"}  (sample: nothing is sent)'));
    build();
}

// ═══ update-notes ════════════════════════════════════════════════════════════════════════════════════════════
if (byId('update-notes-component')) {
    const table = /** @type {HTMLElement} */ (byId('sk-notes'));
    const rows = /** @type {HTMLElement} */ (byId('sk-notes-rows'));
    const bar = /** @type {HTMLElement} */ (byId('sk-notes-bar'));
    const gates = /** @type {HTMLElement} */ (byId('sk-notes-gates'));
    let guard = 'alone';
    let data = 'ready';
    const list = S.STALE.map((x) => (x.key === 'syncthing' ? { ...x, to: 'latest' } : x));
    const level = (/** @type {S.Stale} */ x) => versionLevel(x.from, x.to, {});
    const SORT = { downgrade: 4, major: 3, minor: 2, patch: 1, other: 0, same: 0, unknown: 0 };
    const draw = () => {
        const handle = dataTable(table);
        if (data === 'loading') return handle?.state('loading');
        if (data === 'error') return handle?.fail(ERR);
        handle?.state('ready');
        const shown = data === 'empty' ? [] : list;
        const sum = summarizeDeltas(shown.map((x) => ({ from: x.from, to: x.to })), {});
        say('sk-notes-summary', shown.length ? `${plural(shown.length, 'update')} waiting: ${sum.text}` : 'Everything is up to date.');
        rows.innerHTML = shown
            .map((x) => {
                const url = releaseUrl(x.upstream, x.to);
                return `<tr data-kp-row-key="${x.key}" data-kp-row-label="${x.app}"><td><input type="checkbox" class="kp-field__check" data-kp-select-row value="${x.key}" aria-label="Select ${x.app}" /></td>
                <td data-label="App" data-kp-sort-value="${x.app}"><span class="sk-pair">${mark(x.app)}<b>${x.app}</b><span class="kp-timestamp">${x.stack}</span></span></td>
                <td data-label="Jump" data-kp-sort-value="${SORT[level(x)]}"><span class="kp-badge kp-badge--version" data-kp-version-from="${x.from}" data-kp-version-to="${x.to}"${url ? ` data-kp-version-href="${url}"` : ''} data-kp-version-app="${x.app}"></span></td>
                <td class="kp-text-end" data-label="Waiting" data-kp-sort-value="${x.age}">${plural(x.age, 'day')}</td>
                <td data-label="Note">${x.to === 'latest' ? 'A moving tag: it runs what the tag points at now.' : level(x) === 'major' ? `Major: read the notes first. ${x.users.length ? `Used by ${x.users.join(', ')}.` : ''}` : x.users.length ? `Used by ${x.users.join(', ')}.` : 'Nothing depends on it.'}</td></tr>`;
            })
            .join('');
        attachIdmarks(rows);
        attachVersionDeltas(rows);
        handle?.refresh();
        attachSelectionBars(table);
    };
    const syncGates = (/** @type {string[]} */ keys) => {
        const majors = list.filter((x) => keys.includes(x.key) && level(x) === 'major');
        for (const g of /** @type {NodeListOf<HTMLElement>} */ (gates.querySelectorAll('[data-kp-ack]'))) if (!majors.some((m) => m.key === g.dataset.kpAckKey)) g.remove();
        for (const m of majors) {
            if (gates.querySelector(`[data-kp-ack-key="${m.key}"]`)) continue;
            const g = h('div', { class: 'kp-alert kp-alert--warning', 'data-kp-ack': '', 'data-kp-ack-for': '#sk-notes-go', 'data-kp-ack-key': m.key, 'data-kp-ack-mode': 'all', 'data-kp-ack-label': `I read the release notes of ${m.to}`, 'data-kp-ack-link': releaseUrl(m.upstream, m.to) ?? '', 'data-kp-ack-min-ms': '4000' }, h('div', { class: 'kp-alert__body' }, h('strong', null, `${m.app} ${m.from} to ${m.to} is a major version. `), 'It can change settings or move data.'));
            gates.append(g);
        }
        attachAckGates(gates);
    };
    setSelectionRules(bar, {
        update: (items) => {
            const majors = items.filter((i) => list.find((x) => x.key === i.key && level(x) === 'major'));
            return guard === 'alone' && majors.length && items.length > 1 ? `A major update needs its own read: update ${majors[0].label} on its own` : '';
        },
    });
    bar.addEventListener('kp-selection-change', (e) => syncGates(/** @type {CustomEvent} */ (e).detail.keys));
    bar.addEventListener('kp-selection-action', (e) => say('sk-notes-log', `POST /api/update {"apps":[${/** @type {CustomEvent} */ (e).detail.keys.join(',')}],"major_read":${/** @type {CustomEvent} */ (e).detail.keys.some((/** @type {string} */ k) => list.find((x) => x.key === k && level(x) === 'major')) ? 'true' : 'false'}}  (sample)`));
    table.parentElement?.addEventListener('click', (e) => {
        const a = /** @type {HTMLAnchorElement | null} */ ((/** @type {HTMLElement} */ (e.target)).closest('a[href^="http"]'));
        if (a) {
            e.preventDefault();
            say('sk-notes-log', `Would open ${a.getAttribute('href')} in a new tab (not opened in this demo).`);
        }
    });
    actionButtons('data-sk-notes-pick', (v) => tick(table, v === 'major' ? ['jellyfin'] : v === 'two' ? ['jellyfin', 'grafana'] : v === 'safe' ? list.filter((x) => level(x) !== 'major').map((x) => x.key) : []));
    stateButtons('data-sk-notes-guard', (v) => {
        guard = v;
        const keys = getSelection(bar).keys;
        tick(table, []);
        tick(table, keys);
    });
    stateButtons('data-sk-notes-data', (v) => ((data = v), draw()));
    draw();
}

// ═══ update-run ══════════════════════════════════════════════════════════════════════════════════════════════
if (byId('update-run-component')) {
    const board = /** @type {HTMLElement} */ (byId('sk-board'));
    const stepsEl = /** @type {HTMLElement} */ (byId('sk-steps'));
    const logEl = /** @type {HTMLElement} */ (byId('sk-upd-log'));
    const LANES = [{ key: 'notes', label: 'Notes', tone: /** @type {const} */ (1) }, { key: 'backup', label: 'Back up', tone: /** @type {const} */ (2) }, { key: 'update', label: 'Update', tone: /** @type {const} */ (3) }, { key: 'verify', label: 'Verify', tone: /** @type {const} */ (4) }, { key: 'done', label: 'Done', tone: /** @type {const} */ (5) }];
    const APPS = [['immich-server', 'immich', 'to 1.119.0'], ['immich-ml', 'immich', 'to 1.119.0'], ['paperless-ngx', 'paperless', 'to 2.14.0'], ['traefik', 'traefik', 'to v3.1.6'], ['loki', 'loki', 'to 3.2.1']];
    let layout = 'board';
    let outcome = 'ok';
    let token = 0;
    let at = new Map(APPS.map(([a]) => [a, 0]));
    let failed = /** @type {Set<string>} */ (new Set());
    let text = '';
    const card = (/** @type {string[]} */ a) => ({ id: a[0], lane: failed.has(a[0]) ? 'verify' : LANES[at.get(a[0]) ?? 0].key, title: a[0], sub: a[1], meta: failed.has(a[0]) ? 'failed: 502 after 2 min' : a[2], mark: a[0].slice(0, 2).toUpperCase() });
    const draw = () => {
        setPipeline(board, { lanes: LANES, cards: APPS.map(card) });
        stepsEl.replaceChildren(...APPS.map(([a, s]) => h('div', { class: 'sk-pane' }, h('h3', { class: 'sk-pane__title' }, a), buildSteplist(LANES.slice(0, 4).map((l, i) => ({ id: l.key, title: l.label, note: ['Notes and impact read', 'Snapshot taken', 'Pull and restart', 'Waits for the check'][i], state: failed.has(a) && i === 3 ? /** @type {const} */ ('failed') : (at.get(a) ?? 0) > i ? /** @type {const} */ ('done') : (at.get(a) ?? 0) === i ? /** @type {const} */ ('running') : /** @type {const} */ ('pending') })), { label: `Steps of ${a}` }))));
        attachSteplists(stepsEl);
        board.hidden = layout !== 'board';
        stepsEl.hidden = layout !== 'steps';
        setCode(logEl, { title: 'Update log', language: 'log', text: text || 'Nothing has started.', maxLines: 14, wrap: true, copy: true });
        const done = APPS.filter(([a]) => (at.get(a) ?? 0) >= 4).length;
        say('sk-upd-summary', failed.size ? `${done} updated, ${failed.size} stopped in Verify.` : done === APPS.length ? `${done} updated.` : text ? `${done} of ${APPS.length} updated so far.` : 'Nothing has started.');
    };
    const reset = () => {
        token++;
        at = new Map(APPS.map(([a]) => [a, 0]));
        failed = new Set();
        text = '';
        draw();
    };
    const play = async () => {
        reset();
        const me = token;
        for (let step = 0; step < 4 + APPS.length; step++) {
            for (let i = 0; i < APPS.length; i++) {
                const a = APPS[i][0];
                const target = Math.min(4, step - i + 1);
                if (target > (at.get(a) ?? 0) && !failed.has(a)) {
                    const next = (at.get(a) ?? 0) + 1;
                    if (outcome === 'fail' && a === 'loki' && next === 4) {
                        failed.add(a);
                        text += `${timeOf(NOW + step * 60000)}  ERR  loki: GET /ready returned 502 after 2 min\n${timeOf(NOW + step * 60000)}  ERR  loki: container exited with code 137 (out of memory)\n`;
                    } else {
                        at.set(a, next);
                        text += `${timeOf(NOW + step * 60000)}  INF  ${a}: ${LANES[next - 1].label.toLowerCase()} finished\n`;
                    }
                }
            }
            draw();
            await wait(650);
            if (me !== token) return;
        }
    };
    actionButtons('data-sk-upd-run', (v) => (v === 'play' ? void play() : reset()));
    stateButtons('data-sk-upd-layout', (v) => ((layout = v), draw()));
    stateButtons('data-sk-upd-outcome', (v) => ((outcome = v), reset()));
    board.addEventListener('kp-pipeline-open', (e) => say('sk-upd-summary', `Opened ${/** @type {CustomEvent} */ (e).detail.id}: the page would show its log.`));
    draw();
}

// ═══ map-panel ═══════════════════════════════════════════════════════════════════════════════════════════════
if (byId('map-panel-component')) {
    const nodes = /** @type {HTMLElement} */ (byId('sk-nodes'));
    const card = stageOf(/** @type {HTMLElement} */ (byId('sk-panel')));
    const panel = /** @type {HTMLElement} */ (byId('sk-panel'));
    let picked = 'prometheus';
    let mode = 'normal';
    let order = 'numbers';
    let data = 'ready';
    const usesOf = (/** @type {string} */ n) => [...S.EDGES.filter((e) => e.from === n && e.kind !== 'route').map((e) => ({ other: e.to, kind: e.kind })), ...S.EDGES.filter((e) => e.to === n && e.kind === 'route').map((e) => ({ other: e.from, kind: e.kind }))];
    const usedBy = (/** @type {string} */ n) => [...S.EDGES.filter((e) => e.to === n && e.kind !== 'route').map((e) => ({ other: e.from, kind: e.kind })), ...S.EDGES.filter((e) => e.from === n && e.kind === 'route').map((e) => ({ other: e.to, kind: e.kind }))];
    const stateOf = (/** @type {string} */ n) => /** @type {'running' | 'stopped'} */ (byName(n).state === 'parked' ? 'stopped' : 'running');
    const affected = (/** @type {string} */ n) => [...new Set(usedBy(n).map((x) => x.other))];
    const drawNodes = () => {
        nodes.innerHTML = S.MAP_STACKS.map((n) => `<button type="button" class="kp-button sk-node" aria-pressed="${n === picked}" data-kp-hovercard data-sk-node="${n}"${mode === 'blast' && affected(picked).includes(n) ? ' data-ring' : ''}>${mark(n)}<span><b>${n}</b><br /><span class="kp-timestamp">CT ${byName(n).ct}</span></span></button>`).join('');
        attachIdmarks(nodes);
    };
    const drawPanel = () => {
        if (data === 'loading') return setCardState(card, 'loading', { words: 'Reading the topology' });
        if (data === 'error') return setCardState(card, 'error', { title: 'Could not read the topology', text: ERR });
        if (data === 'empty') return setCardState(card, 'empty', { title: 'No connections known', text: 'Declare what this stack talks to in its firewall rules.' });
        setCardState(card, 'ready');
        const s = byName(picked);
        const u = usesOf(picked);
        const b = usedBy(picked);
        const aff = affected(picked);
        panel.innerHTML = `<div class="sk-panel__head">${mark(picked)}<h3>${picked}</h3>${stateWord(STATE_WORD(s))}</div>
            <p class="sk-pane__line">CT ${s.ct} on pve, ${Math.round((S.TRAFFIC[/** @type {keyof typeof S.TRAFFIC} */ (picked)] ?? 0) * 100)} % of the busiest stack's gateway traffic.</p>
            ${mode === 'blast' ? `<div class="kp-alert kp-alert--warning" role="status"><div class="kp-alert__body"><strong>Stopping ${picked} ${aff.length ? `cuts ${plural(aff.length, 'stack')} off` : 'cuts nothing off'}.</strong> ${aff.length ? aff.join(', ') : 'No other stack depends on it.'}</div></div>` : ''}
            <h4>${picked} uses</h4><div class="kp-deplist" data-kp-deplist id="sk-dep-uses"${order === 'kind' ? ' data-kp-dep-order="none"' : ''}></div>
            <h4>Used by</h4><div class="kp-deplist" data-kp-deplist id="sk-dep-by"${order === 'kind' ? ' data-kp-dep-order="none"' : ''}></div>`;
        attachIdmarks(panel);
        const lab = (/** @type {{ kind: S.EdgeKind }} */ x) => (order === 'kind' ? S.EDGE_LABEL[x.kind] : undefined);
        setDeplist(/** @type {HTMLElement} */ (byId('sk-dep-uses')), u.map((x) => ({ from: picked, to: x.other, state: stateOf(x.other), ...(lab(x) ? { label: lab(x) } : {}) })));
        setDeplist(/** @type {HTMLElement} */ (byId('sk-dep-by')), b.map((x) => ({ from: x.other, to: picked, state: stateOf(x.other), ...(lab(x) ? { label: lab(x) } : {}) })));
        say('sk-panel-log', `${picked}: uses ${u.length}, used by ${b.length}${mode === 'blast' ? `, stopping it cuts off ${aff.length}` : ''}.`);
    };
    const draw = () => (drawNodes(), drawPanel());
    nodes.addEventListener('click', (e) => {
        const b = /** @type {HTMLElement | null} */ ((/** @type {HTMLElement} */ (e.target)).closest('[data-sk-node]'));
        if (b) {
            picked = b.dataset.skNode ?? picked;
            draw();
            /** @type {HTMLElement | null} */ (nodes.querySelector(`[data-sk-node="${picked}"]`))?.focus();
        }
    });
    hoverFills.push((anchor) => {
        if (!anchor.matches('[data-sk-node]')) return undefined;
        {
            const n = anchor.dataset.skNode ?? '';
            const s = byName(n);
            return facts(n, [['Container', `CT ${s.ct}`], ['Image', s.apps[0].image, 'kp-mono'], ['CPU', `${Math.round(s.cpu * 1000) / 10} %`], ['Traffic', `${Math.round((S.TRAFFIC[/** @type {keyof typeof S.TRAFFIC} */ (n)] ?? 0) * 100)} % of the busiest`]]);
        }
    });
    stateButtons('data-sk-panel-mode', (v) => ((mode = v), draw()));
    stateButtons('data-sk-panel-data', (v) => ((data = v), drawPanel()));
    stateButtons('data-sk-panel-order', (v) => ((order = v), drawPanel()));
    draw();
    void order;
}

// ═══ map-matrix ══════════════════════════════════════════════════════════════════════════════════════════════
if (byId('map-matrix-component')) {
    const el = /** @type {HTMLElement} */ (byId('sk-matrix'));
    let view = 'grid';
    let show = 'all';
    let data = 'ready';
    const TONE = { declared: 'ok', planned: 'warn', open: 'bad', named: 'muted', route: 'level' };
    const nodesOf = S.MAP_STACKS.map((k) => ({ key: k, label: k, sub: `CT ${byName(k).ct}` }));
    const legend = byId('sk-matrix-legend');
    if (legend) legend.innerHTML = Object.entries(S.EDGE_LABEL).map(([k, l]) => `<li><span class="kp-heat__swatch" data-kp-tone="${TONE[/** @type {keyof typeof TONE} */ (k)]}"></span><b>${k}</b><span>${l}</span></li>`).join('');
    const draw = () => {
        setMatrix(el, {
            corner: 'from (row) to (column)', label: 'Which stack reaches which', view: /** @type {'grid' | 'lines'} */ (view),
            rows: nodesOf, columns: nodesOf,
            state: data === 'ready' ? 'ready' : /** @type {'loading' | 'empty' | 'error'} */ (data), message: data === 'error' ? ERR : 'No connection is known yet.', skeleton: 14,
            cell: (row, col) => {
                if (row === col) return undefined;
                const e = S.EDGES.find((x) => x.from === row && x.to === col);
                if (!e || (show === 'open' && e.kind !== 'open' && e.kind !== 'named')) return { tone: 'none', label: `${row} does not reach ${col}` };
                return { tone: /** @type {any} */ (TONE[e.kind]), text: e.kind, label: `${row} reaches ${col}: ${S.EDGE_LABEL[e.kind]}` };
            },
            countLabel: (n) => `${n} ${n === 1 ? 'stack' : 'stacks'}`, sourcesLabel: 'Stacks that reach out', usersLabel: 'Stacks reached',
        });
    };
    el.addEventListener(MATRIX_PICK_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        say('sk-matrix-log', `${d.rowKey} reaches ${d.colKey}: ${S.EDGES.find((x) => x.from === d.rowKey && x.to === d.colKey)?.kind ?? 'no connection'}.`);
    });
    el.addEventListener('kp-matrix-light', (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        if (d.key) {
            const out = S.EDGES.filter((x) => x.from === d.key).length;
            const inn = S.EDGES.filter((x) => x.to === d.key).length;
            say('sk-matrix-log', `${d.key}: uses ${plural(out, 'stack')}, used by ${plural(inn, 'stack')}.`);
        }
    });
    stateButtons('data-sk-matrix-view', (v) => ((view = v), draw()));
    stateButtons('data-sk-matrix-show', (v) => ((show = v), draw()));
    stateButtons('data-sk-matrix-data', (v) => ((data = v), draw()));
    draw();
}

// ═══ map-capacity ════════════════════════════════════════════════════════════════════════════════════════════
if (byId('map-capacity-component')) {
    const table = /** @type {HTMLElement} */ (byId('sk-cap-table'));
    const rows = /** @type {HTMLElement} */ (byId('sk-cap-rows'));
    const bullets = /** @type {HTMLElement} */ (byId('sk-cap-bullets'));
    let layout = 'table';
    let measure = 'ram';
    let data = 'ready';
    const share = (/** @type {typeof S.CAPACITY[number]} */ c, /** @type {string} */ m) => (m === 'ram' ? c.ram : m === 'cpu' ? Math.min(0.95, c.cpu / 6 * 4) : c.disk);
    const draw = () => {
        table.hidden = layout !== 'table';
        bullets.hidden = layout !== 'bullets';
        if (layout === 'table') {
            const handle = dataTable(table);
            if (data === 'loading') return handle?.state('loading');
            if (data === 'error') return handle?.fail(ERR);
            handle?.state('ready');
            rows.innerHTML = (data === 'empty' ? [] : S.CAPACITY).map((c) => `<tr data-kp-row-key="${c.key}"><td data-label="Stack" data-kp-sort-value="${c.key}">${mark(c.key)} <b>${c.key}</b></td><td data-label="Memory"><span class="kp-bar-cell" data-sk-c="ram:${c.key}"></span></td><td data-label="CPU"><span class="kp-bar-cell" data-sk-c="cpu:${c.key}"></span></td><td data-label="Disk"><span class="kp-bar-cell" data-sk-c="disk:${c.key}"></span></td></tr>`).join('');
            for (const el of /** @type {NodeListOf<HTMLElement>} */ (rows.querySelectorAll('[data-sk-c]'))) {
                const [m, k] = (el.dataset.skC ?? ':').split(':');
                const c = /** @type {typeof S.CAPACITY[number]} */ (S.CAPACITY.find((x) => x.key === k));
                const v = share(c, m);
                setBarCell(el, { value: v, text: `${Math.round(v * 100)} %`, sortValue: v * 100, warnAt: 0.75, badAt: 0.9 });
            }
            attachIdmarks(rows);
            handle?.refresh();
        } else {
            const state = data === 'ready' ? 'ready' : /** @type {'loading' | 'empty' | 'error'} */ (data);
            setBullets(bullets, { threshold: 75, bad: 90, max: 100, sort: 'worst', state, message: ERR, emptyTitle: 'No stack is running', emptyText: 'Start a stack and it is ranked here.', loadingRows: 8, rows: S.CAPACITY.map((c) => ({ key: c.key, label: c.key, lead: c.key, value: Math.round(share(c, measure) * 100), figure: `${Math.round(share(c, measure) * 100)} %`, pick: true })) });
        }
    };
    bullets.addEventListener('kp-bullets-pick', (e) => say('sk-cap-log', `Open /stacks/${/** @type {CustomEvent} */ (e).detail.key} (the stack page).`));
    stateButtons('data-sk-cap-layout', (v) => ((layout = v), draw()));
    stateButtons('data-sk-cap-measure', (v) => ((measure = v), draw()));
    stateButtons('data-sk-cap-data', (v) => ((data = v), draw()));
    draw();
}

// ═══ map-disk ════════════════════════════════════════════════════════════════════════════════════════════════
if (byId('map-disk-component')) {
    const chart = /** @type {HTMLElement} */ (byId('sk-disk-chart'));
    const who = /** @type {HTMLElement} */ (byId('sk-disk-who'));
    let fs = 'root';
    let data = 'ready';
    const draw = () => {
        const f = /** @type {S.Filesystem} */ (S.FILESYSTEMS.find((x) => x.key === fs));
        const days = S.daysToFull(f);
        const fullAt = NOW + days * S.DAY;
        say('sk-disk-line', data === 'ready' ? `${f.label}: ${Math.round(f.now * 1000) / 10} % used, full in ${plural(days, 'day')} (${S.dateOf(fullAt)}) at the pace of the last 30 days.` : '');
        setStackbar(who, { title: 'Who fills the root disk, 240 GB', total: 240, format: (v) => `${v} GB`, restLabel: 'Free space', marks: [{ at: 0.85, label: '85 % alert' }], parts: S.ROOT_USERS, label: 'Who fills the root disk', state: fs !== 'root' ? 'empty' : data === 'loading' ? 'loading' : data === 'error' ? 'error' : data === 'empty' ? 'empty' : 'ready', message: fs !== 'root' ? 'The split by stack is known for the host root only.' : data === 'error' ? ERR : 'The host reports no filesystems.' });
        if (data === 'loading') return chart.setAttribute('data-kp-chart-loading', '');
        if (data === 'error') return setChartData(chart, { label: 'Disk used', series: [], error: ERR });
        if (data === 'empty') return setChartData(chart, { label: 'Disk used', series: [{ label: f.label, points: [] }] });
        const to = NOW + Math.min(days, 45) * S.DAY + 2 * S.DAY;
        const atEnd = Math.min(100, Math.round((f.now + f.perDay * ((to - NOW) / S.DAY)) * 1000) / 10);
        setChartData(chart, {
            label: `Disk used: ${f.label}`, key: 'disk', unitKind: 'percent', yMax: 100, threshold: f.alert * 100, from: NOW - 30 * S.DAY, to,
            series: [{ label: f.label, points: S.diskHistory(f) }, { label: 'Projected', colour: 'var(--destructive)', points: [[NOW, Math.round(f.now * 1000) / 10], [Math.min(fullAt, to), Math.min(fullAt, to) === fullAt ? 100 : atEnd]] }],
            kinds: { full: { label: 'Full', tone: 'critical' } },
            events: fullAt <= to ? [{ at: fullAt, label: `Full in ${plural(days, 'day')} (${S.dateOf(fullAt)})`, kind: 'full', tone: 'critical' }] : [],
        });
    };
    chart.addEventListener('kp-chart-select', () => say('sk-disk-log', 'A source was switched on or off.'));
    stateButtons('data-sk-disk-fs', (v) => ((fs = v), draw()));
    stateButtons('data-sk-disk-data', (v) => ((data = v), draw()));
    draw();
}

// ═══ map-stale ═══════════════════════════════════════════════════════════════════════════════════════════════
if (byId('map-stale-component')) {
    const table = /** @type {HTMLElement} */ (byId('sk-stale'));
    const rows = /** @type {HTMLElement} */ (byId('sk-stale-rows'));
    const bar = /** @type {HTMLElement} */ (byId('sk-stale-bar'));
    let refuse = false;
    let data = 'ready';
    const SORT = { downgrade: 4, major: 3, minor: 2, patch: 1, other: 0, same: 0, unknown: 0 };
    const lvl = (/** @type {S.Stale} */ x) => versionLevel(x.from, x.to, {});
    const draw = () => {
        const handle = dataTable(table);
        if (data === 'loading') return handle?.state('loading');
        if (data === 'error') return handle?.fail(ERR);
        handle?.state('ready');
        const shown = data === 'empty' ? [] : S.STALE;
        rows.innerHTML = shown
            .map((x) => `<tr data-kp-row-key="${x.key}" data-kp-row-label="${x.app}"><td><input type="checkbox" class="kp-field__check" data-kp-select-row value="${x.key}" aria-label="Select ${x.app}" /></td>
                <td data-label="App" data-kp-sort-value="${x.app}"><span class="sk-pair">${mark(x.app)}<b>${x.app}</b><span class="kp-timestamp">${x.stack}</span></span></td><td data-label="Image" class="kp-mono" data-kp-sort-value="${x.image}">${esc(x.image)}</td>
                <td data-label="Jump" data-kp-sort-value="${SORT[lvl(x)]}"><span class="kp-badge kp-badge--version" data-kp-version-from="${x.from}" data-kp-version-to="${x.to}" data-kp-version-app="${x.app}"></span></td>
                <td class="kp-text-end" data-label="Waiting" data-kp-sort-value="${x.age}">${plural(x.age, 'day')}</td></tr>
                <tr data-kp-row-detail><td colspan="6"><div class="sk-detail"><div><h4>Used by</h4>${x.users.length ? `<div class="kp-deplist" data-kp-deplist data-sk-dep="${x.key}"></div>` : '<p class="sk-pane__line">Nothing depends on this image.</p>'}</div><div class="sk-detail__side"><h4>Release notes</h4><p class="sk-pane__line">${esc(releaseUrl(x.upstream, x.to) ?? 'no address known')}</p></div></div></td></tr>`)
            .join('');
        for (const el of /** @type {NodeListOf<HTMLElement>} */ (rows.querySelectorAll('[data-sk-dep]'))) {
            const x = /** @type {S.Stale} */ (S.STALE.find((y) => y.key === el.dataset.skDep));
            setDeplist(el, x.users.map((u) => ({ from: u, to: x.app, state: /** @type {'running'} */ ('running') })));
        }
        attachIdmarks(rows);
        attachVersionDeltas(rows);
        handle?.refresh();
        attachSelectionBars(table);
    };
    setSelectionRules(bar, {
        update: (items) => {
            const majors = items.filter((i) => S.STALE.find((x) => x.key === i.key && lvl(x) === 'major'));
            return majors.length && items.length > 1 ? `A major update needs its own read: update ${majors[0].label} on its own` : '';
        },
    });
    bar.addEventListener('kp-selection-action', (e) => {
        const { keys } = /** @type {CustomEvent} */ (e).detail;
        const refused = refuse && keys.includes('immich-ml') ? [{ key: 'immich-ml', reason: 'its stack is being applied right now' }] : [];
        setSelectionBusy(bar, `Sending ${keys.length}...`);
        window.setTimeout(() => {
            setSelectionBusy(bar, null);
            setSelectionResult(bar, { done: keys.length - refused.length, refused });
            say('sk-stale-log', `Go to /update?all=1&only=${keys.join(',')}  ->  ${keys.length - refused.length} accepted, ${refused.length} refused.`);
        }, 900);
    });
    actionButtons('data-sk-stale-pick', (v) => tick(table, v === 'immich' ? ['immich-server', 'immich-ml', 'paperless'] : v === 'major' ? ['immich-server', 'immich-ml', 'paperless', 'jellyfin'] : []));
    stateButtons('data-sk-stale-server', (v) => (refuse = v === 'refuses'));
    stateButtons('data-sk-stale-data', (v) => ((data = v), draw()));
    draw();
}

// ═══ the choices of the review dialog: each option presses the control that already drives the component ════════
const CHOICES = {
    'fleet-default-view': 'data-sk-fleet-open', 'fleet-deploy-safety': 'data-sk-batch-safety', 'fleet-hungry-measure': 'data-sk-hungry-measure', 'fleet-nights-window': 'data-sk-nights-window',
    'presets-search': 'data-sk-presets-mode', 'hub-apps-density': 'data-sk-appstab-density', 'hub-backups-view': 'data-sk-backups-view', 'apply-destroy': 'data-sk-plan-destroy',
    'update-major-guard': 'data-sk-notes-guard', 'update-run-layout': 'data-sk-upd-layout', 'map-deplist-order': 'data-sk-panel-order', 'map-matrix-view': 'data-sk-matrix-view', 'map-capacity-layout': 'data-sk-cap-layout',
};
document.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent} */ (event).detail ?? {};
    const attribute = /** @type {Record<string, string>} */ (CHOICES)[id];
    if (attribute) /** @type {HTMLElement | null} */ (document.querySelector(`[${attribute}="${value}"]`))?.click();
});
