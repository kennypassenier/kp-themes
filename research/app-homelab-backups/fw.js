// research/app-homelab-backups: the Firewall sections' wiring. The components are the package's; this file feeds them the
// sample firewall (fwdata.js) and shows what they fire. Every section runs only when it is on the page.

import { $, $$, has, count, stateButtons, onChoice, ready, mount, tableShell, tableState, BADGE, matrixRetry } from './shared.js';
import * as D from './fwdata.js';
import { setMatrix, setMatrixLit, setMatrixPick, MATRIX_PICK_EVENT, MATRIX_LIGHT_EVENT } from '../../js/heat.js';
import { dataTable, EXPAND_EVENT } from '../../js/datatable.js';
import { setAgo } from '../../js/freshness.js';

await ready;

const NAMES = D.FW_STACKS.map((s) => ({ key: s.key, label: s.key }));
const PHONE_HEIGHT = 'min-block-size';

/** A matrix cell in the page's colours. @param {D.Cell} c @param {'calm' | 'caution'} tone */
function cellView(c, tone) {
    const words = D.cellWords(c);
    if (c.state === 'open') return { tone: /** @type {const} */ ('bad'), text: 'all', label: words, tip: words };
    if (c.state === 'some')
        return { tone: /** @type {'ok' | 'warn'} */ (tone === 'calm' ? 'ok' : 'warn'), text: D.cellText(c), label: words, tip: words, ringed: c.stoppedAtSource.length > 0 };
    return c.stoppedAtSource.length
        ? { tone: /** @type {const} */ ('bad'), label: words, tip: words, ringed: true }
        : { tone: /** @type {const} */ ('muted'), label: words, tip: words };
}

/** @param {{ cells?: Map<string, D.Cell>, tone?: 'calm' | 'caution', label: string, state?: string, message?: string, extra?: object, view?: 'grid' | 'lines' }} o */
function matrixSpec({ cells = D.CELL, tone = 'calm', label, state = 'ready', message, extra = {} }) {
    return /** @type {import('../../js/heat.js').MatrixSpec} */ ({
        corner: 'from ↓ to →',
        rows: NAMES,
        columns: NAMES,
        label,
        state: /** @type {any} */ (state),
        message,
        skeleton: NAMES.length,
        cell: (r, c) => (r === c ? undefined : cellView(/** @type {D.Cell} */ (cells.get(`${r}>${c}`)), tone)),
        ...extra,
    });
}

const stateBadge = (/** @type {D.FwStack} */ s) => {
    const st = D.fwState(s);
    return `<span class="kp-badge kp-badge--${BADGE[st.tone]}">${st.word}</span>`;
};
const mark = (/** @type {string} */ k) => `<span class="kp-idmark kp-idmark--pattern" data-kp-idmark="${k}" aria-hidden="true"></span>`;

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 1. totals
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('fw-totals-component')) {
    const root = $('#fw-totals-component');
    const kpiHost = $('[data-hb-fw-kpis]', root);
    const tableHost = $('[data-hb-fw-table]', root);
    const matrix = $('[data-hb-fw-matrix]', root);
    const shown = $('[data-hb-fw-shown]', root);
    const pickRead = $('[data-hb-fw-pick]', root);
    const K = D.kpis();
    let tone = /** @type {'calm' | 'caution'} */ ('calm');
    let state = 'ready';
    /** @type {Set<string>} */
    const on = new Set();
    const SETS = { none: K.none, differs: K.differs, open: K.openTargets };

    const reaches = (/** @type {string} */ k) => D.CELLS.filter((c) => c.from === k && c.state === 'some').length;
    const reachedBy = (/** @type {string} */ k) => D.CELLS.filter((c) => c.to === k && c.state !== 'none').length;

    const kpis = (busy = false) => `<div class="kp-kpis" role="group" aria-label="Firewall at a glance">
        <div class="kp-kpi" ${busy ? 'aria-busy="true"' : ''}>
            <span class="kp-kpi__label">In force</span>
            <span class="kp-kpi__value">${busy ? '…' : `${K.protected}<small>of ${K.total}</small>`}</span>
            <span class="kp-kpi__trend">${busy ? 'Reading pve' : 'stacks with a firewall that pve enforces'}</span>
            ${busy ? '' : `<span class="kp-kpi__meter" role="meter" aria-label="In force: ${K.protected} of ${K.total}" aria-valuenow="${Math.round((K.protected / K.total) * 100)}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${K.protected / K.total}"></span>`}
        </div>
        ${[
            ['none', 'No firewall', K.none.length, K.none.join(', '), 'destructive'],
            ['differs', 'Live differs from files', K.differs.length, K.differs.join(', '), 'warning'],
            ['open', 'Open paths', K.open, `to ${K.openTargets.join(' and ')}`, 'warning'],
        ]
            .map(
                ([k, label, n, note, t]) => `<button type="button" class="kp-kpi kp-kpi--toggle" aria-pressed="${on.has(String(k))}" data-kp-tone="${t}" data-hb-kpi="${k}" ${busy ? 'aria-busy="true" disabled' : ''}>
            <span class="kp-kpi__label">${label}</span>
            <span class="kp-kpi__hint" aria-hidden="true"><span data-kp-when="off">Filter</span><span data-kp-when="on">Filtering ×</span></span>
            <span class="kp-kpi__value">${busy ? '…' : count(Number(n))}</span>
            <span class="kp-kpi__trend">${busy ? 'Reading pve' : note}</span>
        </button>`,
            )
            .join('')}
    </div>`;

    const rows = () =>
        D.FW_STACKS.map(
            (s) => `<tr data-kp-row-key="${s.key}">
        <td data-label="Stack" data-kp-filter-value="${s.key}">${mark(s.key)} <b>${s.key}</b> <span class="hb-ct">CT ${s.ct}</span></td>
        <td data-label="Firewall" data-kp-filter-value="${D.fwState(s).word}">${stateBadge(s)}</td>
        <td data-label="Inbound">${s.policyIn}</td>
        <td data-label="Outbound">${s.policyOut}</td>
        <td data-label="Rules" class="kp-text-end kp-numeric">${count(D.RULES.filter((r) => r.stack === s.key).length)}</td>
        <td data-label="Reaches" class="kp-text-end kp-numeric">${count(reaches(s.key))}</td>
        <td data-label="Reached by" class="kp-text-end kp-numeric">${count(reachedBy(s.key))}</td></tr>`,
        ).join('');

    const tableHtml = (empty = false) =>
        tableShell({
            id: 'hb-fw-stack-table',
            remember: 'hb-fw-stacks',
            caption: 'Stacks and their firewalls',
            head: `<th scope="col" data-kp-sort="text" data-kp-filter="choice">Stack</th>
                <th scope="col" data-kp-sort="text" data-kp-filter="choice" data-kp-sort-order="no firewall,declared but not in force,live differs from files,in force">Firewall</th>
                <th scope="col" data-kp-sort="text">Inbound</th><th scope="col" data-kp-sort="text">Outbound</th>
                <th scope="col" data-kp-sort="number" class="kp-text-end">Rules</th>
                <th scope="col" data-kp-sort="number" class="kp-text-end">Reaches</th>
                <th scope="col" data-kp-sort="number" class="kp-text-end">Reached by</th>`,
            body: empty ? '' : rows(),
            emptyTitle: 'No stack has a firewall declared',
            emptyText: 'Declare one in a stack file and the next apply puts it in force.',
            none: 'The firewalls could not be read',
        });

    const table = () => /** @type {import('../../js/datatable.js').DataTableHandle} */ (dataTable($('[data-kp-datatable]', tableHost)));

    const applyFilter = async () => {
        const keys = [...new Set([...on].flatMap((k) => SETS[/** @type {keyof typeof SETS} */ (k)]))];
        if (state === 'ready') {
            table().filter(0, keys.length ? keys : null);
            setMatrixLit(matrix, keys);
        }
        shown.textContent = state !== 'ready' ? '' : keys.length ? `Showing ${count(keys.length)} of ${count(K.total)} stacks: ${keys.join(', ')}.` : `Showing all ${count(K.total)} stacks.`;
    };

    const paint = async () => {
        kpiHost.innerHTML = '';
        await mount(kpiHost, kpis(state === 'loading'));
        await mount(tableHost, tableHtml(state === 'empty'));
        const dt = table();
        tableState(dt, state);
        setMatrix(
            matrix,
            matrixSpec({
                tone,
                label: 'Which stack can reach which',
                state: state === 'empty' ? 'empty' : state,
                message: state === 'error' ? 'The firewall rules could not be read.' : 'No stack has a firewall declared yet.',
            }),
        );
        if (state === 'error') matrixRetry(matrix, () => void setState('ready'));
        pickRead.textContent = state === 'ready' ? 'Press a cell to read it in words.' : '';
        await applyFilter();
    };

    kpiHost.addEventListener('kp-kpi-toggle', (e) => {
        const tile = /** @type {HTMLElement} */ (/** @type {Event} */ (e).target).closest('[data-hb-kpi]');
        const k = tile?.getAttribute('data-hb-kpi');
        if (!k) return;
        if (/** @type {CustomEvent} */ (e).detail.pressed) on.add(k);
        else on.delete(k);
        void applyFilter();
    });
    root.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && on.size) {
            on.clear();
            for (const t of $$('[data-hb-kpi]', kpiHost)) t.setAttribute('aria-pressed', 'false');
            void applyFilter();
        }
    });
    matrix.addEventListener(MATRIX_PICK_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        const c = D.CELL.get(`${d.rowKey}>${d.colKey}`);
        pickRead.textContent = c ? D.cellWords(c) : '';
    });
    root.addEventListener('kp-datatable-retry', () => void setState('ready'));

    const setSt = stateButtons('data-hb-fw-data', (v) => void setState(v));
    /** @param {string} v */
    async function setState(v) {
        state = v;
        setSt(v);
        await paint();
    }
    const setTone = stateButtons('data-hb-fw-tone', (v) => {
        tone = /** @type {typeof tone} */ (v);
        setMatrix(matrix, matrixSpec({ tone, label: 'Which stack can reach which' }));
        void applyFilter();
    });
    onChoice('fw-reach-tone', (v) => {
        setTone(v);
        tone = /** @type {typeof tone} */ (v);
        setMatrix(matrix, matrixSpec({ tone, label: 'Which stack can reach which' }));
        void applyFilter();
    });
    void MATRIX_LIGHT_EVENT;
    await paint();
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 2. the trace
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('fw-trace-component')) {
    const { trace, setTrace, traceSummary, TRACE_RULE_EVENT, TRACE_SWAP_EVENT, TRACE_RETRY_EVENT } = await import('../../js/path-trace.js');
    const { combobox, CHANGE_EVENT } = await import('../../js/combobox.js');
    const root = $('#fw-trace-component');
    const t = $('[data-hb-trace]', root);
    const matrix = $('[data-hb-tr-matrix]', root);
    const read = $('[data-hb-tr-read]', root);
    const portSel = /** @type {HTMLSelectElement} */ ($('[data-hb-tr-port]', root));
    const fromBox = $('#hb-tr-from', root).closest('.kp-combobox');
    const toBox = $('#hb-tr-to', root).closest('.kp-combobox');
    let from = 'admin';
    let to = 'kyu';
    let port = 'any';
    let stop = /** @type {'first-refusal' | 'all'} */ ('first-refusal');
    let state = 'ready';

    portSel.replaceChildren(new Option('Any port the rules allow', 'any'), ...D.ALL_PORTS.map((p) => new Option(p, p)));

    const draw = () => {
        const h = trace(t);
        t.setAttribute('data-kp-trace-stop', stop);
        if (state === 'loading') return h?.setState('running');
        if (state === 'error') return h?.setState('error', { message: 'The firewall did not answer. Nothing was changed.' });
        if (state === 'empty' || from === to) {
            read.textContent = from === to ? 'Pick two different stacks.' : '';
            return h?.setState('empty');
        }
        const hops = D.hopsOf(from, to, port);
        setTrace(t, hops);
        h?.setState('ready');
        setTrace(t, hops);
        read.textContent = traceSummary(hops, stop);
        setMatrixPick(matrix, { row: from, column: to });
    };
    const put = () => {
        combobox(/** @type {HTMLElement} */ (fromBox))?.set([from]);
        combobox(/** @type {HTMLElement} */ (toBox))?.set([to]);
        const own = D.ALL_PORTS.includes(port) || port === 'any';
        portSel.value = own ? port : 'any';
    };
    setMatrix(matrix, matrixSpec({ label: 'Pick a pair to trace' }));
    put();
    draw();

    fromBox?.addEventListener(CHANGE_EVENT, (e) => {
        from = /** @type {CustomEvent} */ (e).detail.value || from;
        port = 'any';
        put();
        draw();
    });
    toBox?.addEventListener(CHANGE_EVENT, (e) => {
        to = /** @type {CustomEvent} */ (e).detail.value || to;
        port = 'any';
        put();
        draw();
    });
    portSel.addEventListener('change', () => {
        port = portSel.value;
        draw();
    });
    matrix.addEventListener(MATRIX_PICK_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        from = d.rowKey;
        to = d.colKey;
        port = 'any';
        put();
        draw();
    });
    t.addEventListener(TRACE_SWAP_EVENT, () => {
        [from, to] = [to, from];
        port = 'any';
        put();
        draw();
    });
    t.addEventListener(TRACE_RULE_EVENT, (e) => {
        read.textContent = `The rule chip "${/** @type {CustomEvent} */ (e).detail.rule}" was pressed: the Rules table opens that row.`;
    });
    t.addEventListener(TRACE_RETRY_EVENT, () => void setSt('ready'));
    const pressed = stateButtons('data-hb-tr-data', (v) => {
        state = v;
        draw();
    });
    const setSt = (/** @type {string} */ v) => {
        state = v;
        pressed(v);
        draw();
    };
    const pressedStop = stateButtons('data-hb-tr-stop', (v) => {
        stop = /** @type {typeof stop} */ (v);
        draw();
    });
    onChoice('fw-trace-stop', (v) => {
        stop = /** @type {typeof stop} */ (v);
        pressedStop(v);
        draw();
    });
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 3. the rules
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('fw-rules-component')) {
    const root = $('#fw-rules-component');
    const host = $('[data-hb-ru-table]', root);
    const toggles = $('[data-hb-ru-toggles]', root);
    const read = $('[data-hb-ru-read]', root);
    let state = 'ready';
    let folded = false;
    const acc = D.RULES.filter((r) => r.action === 'ACCEPT').length;
    const drop = D.RULES.length - acc;

    const line = (/** @type {D.Rule} */ r) => {
        const key = `${r.stack}:${r.dir}:${r.n}`;
        return `<tr data-kp-row-key="${key}" data-kp-group-of="${r.dir}">
            <td data-label="Rule" class="kp-numeric">#${r.n}</td>
            <td data-label="Stack" data-kp-filter-value="${r.stack}"><b>${r.stack}</b></td>
            <td data-label="Action" data-kp-filter-value="${r.action}"><span class="kp-badge kp-badge--${r.action === 'ACCEPT' ? 'success' : 'destructive'}">${r.action}</span></td>
            <td data-label="Peer">${r.peer}</td>
            <td data-label="Ports" class="kp-numeric">${r.ports ? `${r.proto} ${r.ports}` : 'any'}</td>
            <td data-label="Why">${r.note}</td>
            <td data-label="In force">${r.enabled ? 'yes' : 'no'}</td></tr>`;
    };
    const head = (/** @type {'in' | 'out'} */ dir) => {
        return `<tr data-kp-row-group="${dir}"><th scope="rowgroup" colspan="8"><b>${dir === 'in' ? 'Inbound' : 'Outbound'}</b> <span class="kp-badge" data-kp-group-count></span> <span class="kp-text-muted">${dir === 'in' ? 'what may reach the stack' : 'what the stack may open'}</span></th></tr>`;
    };
    const html = (empty = false) =>
        tableShell({
            id: 'hb-fw-rule-table',
            maxHeight: '38rem',
            remember: 'hb-fw-rules',
            caption: 'Firewall rules, grouped inbound and outbound',
            attrs: 'data-kp-expandable data-kp-expand-single data-kp-column-menu data-kp-sort-multi="click"',
            head: `<th scope="col" data-kp-sort="number">#</th><th scope="col" data-kp-sort="text" data-kp-filter="choice">Stack</th>
                <th scope="col" data-kp-sort="text" data-kp-filter="choice">Action</th><th scope="col" data-kp-sort="text">Peer</th>
                <th scope="col" data-kp-sort="text">Ports</th><th scope="col" data-kp-sort="text">Why</th><th scope="col" data-kp-sort="text">In force</th>`,
            body: empty ? '' : head('in') + D.RULES.filter((r) => r.dir === 'in').map(line).join('') + head('out') + D.RULES.filter((r) => r.dir === 'out').map(line).join(''),
            emptyTitle: 'No rules yet',
            emptyText: 'Declare a firewall in a stack file to see its rules here.',
            none: 'The rules could not be read',
        });
    const table = () => /** @type {import('../../js/datatable.js').DataTableHandle} */ (dataTable($('[data-kp-datatable]', host)));

    const chips = () => {
        toggles.innerHTML = `<button class="kp-button" type="button" data-kp-toggle data-kp-toggle-all data-kp-look="chip" aria-pressed="true" data-kp-count="${D.RULES.length}">All</button>
            <button class="kp-button" type="button" data-kp-toggle data-kp-look="chip" data-kp-toggle-value="ACCEPT" data-kp-count="${acc}">ACCEPT</button>
            <button class="kp-button" type="button" data-kp-toggle data-kp-look="chip" data-kp-toggle-value="DROP" data-kp-count="${drop}">DROP</button>`;
    };
    chips();

    const detail = (/** @type {D.Rule} */ r) => {
        const pairs = D.CELLS.filter((c) => (r.dir === 'out' ? r.stack === c.from && r.peers.includes(c.to) : r.stack === c.to && r.peers.includes(c.from)));
        const box = document.createElement('div');
        box.className = 'hb-detail';
        box.innerHTML = `<p><b>${r.action === 'ACCEPT' ? 'Lets through' : 'Drops'}</b>: ${r.note}.${r.enabled ? '' : ' <b>Not in force</b>: this stack\'s firewall is declared but pve does not enforce it.'}</p>
            <p>${pairs.length ? `Decides ${count(pairs.length)} ${pairs.length === 1 ? 'pair' : 'pairs'}: ${pairs.map((c) => D.cellWords(c)).join(' ')}` : `Names ${r.peer}, which is not a stack, so it decides no pair of the matrix.`}</p>`;
        return box;
    };
    host.addEventListener(EXPAND_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        if (!d.open || !d.cell || d.cell.childElementCount > 0) return;
        const [stack, dir, n] = String(d.key).split(':');
        const r = D.RULES.find((x) => x.stack === stack && x.dir === dir && String(x.n) === n);
        if (r) d.cell.append(detail(r));
    });

    const paint = async () => {
        await mount(host, html(state === 'empty'));
        tableState(table(), state);
        if (folded && state === 'ready') table().fold(['in', 'out']);
        read.textContent = state === 'ready' ? `${count(D.RULES.length)} rules: ${count(acc)} ACCEPT, ${count(drop)} DROP.` : '';
    };
    toggles.addEventListener('kp-toggle-changed', (e) => {
        const keys = /** @type {CustomEvent} */ (e).detail.pressedKeys ?? [];
        if (state === 'ready') table().filter(2, keys.length ? keys : null);
    });
    host.addEventListener('kp-datatable-retry', () => void setSt('ready'));
    const pressed = stateButtons('data-hb-ru-data', (v) => void setSt(v));
    const setSt = async (/** @type {string} */ v) => {
        state = v;
        pressed(v);
        await paint();
    };
    const pressedG = stateButtons('data-hb-ru-groups', (v) => {
        folded = v === 'folded';
        root.dataset.hbGroups = v;
        if (state === 'ready') table().fold(folded ? ['in', 'out'] : []);
    });
    onChoice('fw-rules-groups', (v) => {
        folded = v === 'folded';
        root.dataset.hbGroups = v;
        pressedG(v);
        if (state === 'ready') table().fold(folded ? ['in', 'out'] : []);
    });
    await paint();
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 4. matrix or lines
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('fw-lines-component')) {
    const { SEGMENTED_EVENT, setSegmentedValues } = await import('../../js/segmented.js');
    const { USES_PIN_EVENT } = await import('../../js/uses-map.js');
    const root = $('#fw-lines-component');
    const m = $('[data-hb-li-matrix]', root);
    const read = $('[data-hb-li-read]', root);
    const seg = $('[data-hb-li-view]', root);
    let view = /** @type {'grid' | 'lines'} */ ('grid');
    let state = 'ready';
    const K = D.kpis();
    m.setAttribute('data-kp-lines-shape', 'curve');

    const nodes = D.FW_STACKS.map((s) => ({
        key: s.key,
        label: s.key,
        sub: !D.inForce(s) ? 'no firewall: every stack reaches it' : `CT ${s.ct}, ${D.RULES.filter((r) => r.stack === s.key).length} rules`,
        tone: !D.inForce(s) ? 'bad' : undefined,
    }));
    const draw = () => {
        setMatrix(m, {
            ...matrixSpec({ label: 'Which stack reaches which', state: state === 'empty' ? 'empty' : state, message: state === 'error' ? 'The firewall rules could not be read.' : 'No stack has a firewall declared yet.' }),
            view,
            rows: nodes,
            columns: nodes,
            cell: view === 'lines' ? (r, c) => (r !== c && D.CELL.get(`${r}>${c}`)?.state === 'some' ? { tone: 'ok' } : null) : matrixSpec({ label: '' }).cell,
            countLabel: (n) => `${n} ${n === 1 ? 'stack' : 'stacks'}`,
            sourcesLabel: 'Sources',
            usersLabel: 'Reached stacks',
        });
        read.textContent = state === 'ready' ? (view === 'lines' ? `Lines: ${count(D.CELLS.filter((c) => c.state === 'some').length)} paths with named ports; the ${count(K.open)} open paths to ${K.openTargets.join(' and ')} are not drawn.` : 'Grid: every pair with its ports.') : '';
    };
    draw();
    seg.addEventListener(SEGMENTED_EVENT, (e) => {
        view = /** @type {CustomEvent} */ (e).detail.value === 'lines' ? 'lines' : 'grid';
        draw();
    });
    m.addEventListener(USES_PIN_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        const out = D.CELLS.filter((c) => c.from === d.key && c.state === 'some').length;
        const into = D.CELLS.filter((c) => c.to === d.key && c.state !== 'none').length;
        read.textContent = d.pinned ? `${d.key} pinned: it reaches ${count(out)} ${out === 1 ? 'stack' : 'stacks'} and is reached by ${count(into)}.` : 'Nothing pinned.';
    });
    m.addEventListener('kp-uses-retry', () => {
        state = 'ready';
        pressed('ready');
        draw();
    });
    const pressed = stateButtons('data-hb-li-data', (v) => {
        state = v;
        draw();
    });
    stateButtons('data-hb-li-shape', (v) => m.setAttribute('data-kp-lines-shape', v));
    onChoice('fw-view', (v) => {
        view = v === 'lines' ? 'lines' : 'grid';
        setSegmentedValues(seg, [view]);
        draw();
    });
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 5. live against files
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('fw-live-component')) {
    const { SEGMENTED_EVENT, setSegmentedValues } = await import('../../js/segmented.js');
    const root = $('#fw-live-component');
    const m = $('[data-hb-lv-matrix]', root);
    const attn = $('[data-hb-lv-attn]', root);
    const read = $('[data-hb-lv-read]', root);
    const seg = $('[data-hb-lv-mode]', root);
    let mode = 'differences';
    let state = 'ready';
    setAgo($('[data-hb-lv-ago]', root), Date.now() - 42000);
    const diffs = D.CELLS.filter((c) => D.differs(c.from, c.to));

    const spec = () => {
        if (mode === 'live') return matrixSpec({ label: 'What pve enforces now' });
        if (mode === 'files') return matrixSpec({ cells: D.FILE_CELL, label: 'What the stack files declare' });
        return matrixSpec({
            label: 'Pairs where live and files differ',
            extra: {
                cell: (/** @type {string} */ r, /** @type {string} */ c) => {
                    if (r === c) return undefined;
                    const live = /** @type {D.Cell} */ (D.CELL.get(`${r}>${c}`));
                    const files = /** @type {D.Cell} */ (D.FILE_CELL.get(`${r}>${c}`));
                    if (!D.differs(r, c)) return { tone: 'muted', label: 'same live and in the files', tip: 'Live and files agree.' };
                    const words = `${r} to ${c}. Live: ${D.cellText(live) || 'blocked'}. Files: ${D.cellText(files) || 'blocked'}.`;
                    return { tone: 'warn', text: '≠', label: words, tip: words };
                },
            },
        });
    };
    const attnHtml = () =>
        `<div class="kp-attention" role="region" aria-label="Firewalls that differ">
        ${[
            ['immich', 'critical', 'immich: its file declares a firewall that is not in force on CT 110', 'Every container may reach it on every port until it is applied.', 'Compare…'],
            ['metrics', 'warning', 'metrics: a rule runs on CT 113 that no file declares', 'admin may open 9090, added by hand on 12/10/2026. The next apply would remove it.', 'Compare…'],
        ]
            .map(
                ([k, sev, what, why, fix]) => `<div class="kp-alert kp-alert--${sev === 'critical' ? 'destructive' : 'warning'} kp-attention__item" role="${sev === 'critical' ? 'alert' : 'status'}" data-kp-severity="${sev}">
            <span class="kp-attention__icon" aria-hidden="true">!</span>
            <div class="kp-attention__text"><strong><span class="kp-sr-only">${sev === 'critical' ? 'Critical' : 'Warning'}: </span>${what}</strong><span>${why}</span></div>
            <div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm" data-hb-compare="${k}">${fix}</button></div></div>`,
            )
            .join('')}
    </div>`;
    const draw = async () => {
        await mount(attn, state === 'ready' ? attnHtml() : '<div class="kp-attention" role="region" aria-label="Firewalls that differ"></div>');
        setMatrix(m, {
            ...spec(),
            state: /** @type {any} */ (state === 'empty' ? 'empty' : state),
            message: state === 'error' ? 'pve did not answer. Nothing was changed.' : 'Nothing differs: the stack files and pve agree.',
        });
        if (state === 'error')
            matrixRetry(m, () => {
                state = 'ready';
                pressed('ready');
                void draw();
            });
        read.textContent = state === 'ready' ? `${count(diffs.length)} pairs differ between live and the files.` : '';
    };
    attn.addEventListener('click', (e) => {
        const b = /** @type {HTMLElement} */ (e.target).closest('[data-hb-compare]');
        if (!b) return;
        mode = 'differences';
        setSegmentedValues(seg, [mode]);
        void draw().then(() => {
            setMatrixLit(m, [b.getAttribute('data-hb-compare') ?? '']);
            read.textContent = `${b.getAttribute('data-hb-compare')} lit: ${count(diffs.filter((c) => c.to === b.getAttribute('data-hb-compare')).length)} differing pairs point at it.`;
        });
    });
    seg.addEventListener(SEGMENTED_EVENT, (e) => {
        mode = /** @type {CustomEvent} */ (e).detail.value ?? 'differences';
        void draw();
    });
    const pressed = stateButtons('data-hb-lv-data', (v) => {
        state = v;
        void draw();
    });
    onChoice('fw-live-mode', (v) => {
        mode = v;
        setSegmentedValues(seg, [mode]);
        void draw();
    });
    await draw();
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 6. the guard
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('fw-guard-component')) {
    const { ackGate } = await import('../../js/ack-gate.js');
    const root = $('#fw-guard-component');
    const chips = $('[data-hb-gd-chips]', root);
    const gate = $('[data-hb-gd-gate]', root);
    const warn = $('[data-hb-gd-warning]', root);
    const go = $('[data-hb-gd-go]', root);
    const read = $('[data-hb-gd-read]', root);
    let current = 'traefik';
    let state = 'ready';

    const card = (/** @type {D.FwStack} */ s) =>
        `${s.key} · CT ${s.ct} · ${s.ip}. ${D.fwState(s).word}. Inbound ${s.policyIn}, outbound ${s.policyOut}, ${D.RULES.filter((r) => r.stack === s.key).length} rules. ${s.matches && s.enforced ? 'Live matches the files.' : 'Live does not match the files.'}${s.mgmt ? ` Management open: ${s.mgmt}.` : ''}`;
    chips.innerHTML = D.FW_STACKS.map(
        (s) => `<button class="kp-button" type="button" data-kp-toggle data-kp-look="chip" data-kp-toggle-value="${s.key}" aria-pressed="${s.key === current}" data-kp-hovercard="${card(s)}">${s.key}</button>`,
    ).join('');
    void mount(chips, chips.innerHTML);

    const paint = () => {
        const s = /** @type {D.FwStack} */ (D.FW.get(current));
        const busy = state !== 'ready';
        root.setAttribute('aria-busy', String(state === 'loading'));
        if (s.mgmt && !busy) {
            gate.setAttribute('data-kp-ack-key', `mgmt-${s.key}`);
            warn.innerHTML = `<strong>${s.key} has its management open: ${s.mgmt}.</strong> A rule change you make here reaches every container on the LAN.`;
            ackGate(gate)?.setState('ready');
        } else {
            ackGate(gate)?.setState('empty');
        }
        go.disabled = busy;
        if (busy) go.setAttribute('data-kp-disabled-reason', state === 'loading' ? 'The stack is still being read' : state === 'empty' ? 'No stack to edit' : 'The stack could not be read');
        else go.removeAttribute('data-kp-disabled-reason');
        read.textContent = busy ? (state === 'loading' ? 'Reading the stack…' : state === 'empty' ? 'No stack has a firewall to edit yet.' : 'The stack could not be read. Nothing was changed.') : `${s.key}: ${D.fwState(s).word}${s.mgmt ? ', management open' : ''}.`;
    };
    chips.addEventListener('kp-toggle-changed', (e) => {
        const keys = /** @type {CustomEvent} */ (e).detail.pressedKeys ?? [];
        if (keys[0]) current = keys[0];
        ackGate(gate)?.set(false);
        paint();
    });
    go.addEventListener('click', () => {
        read.textContent = `Edit rules… on ${current}: opens the rule editor of ${current}.`;
    });
    stateButtons('data-hb-gd-data', (v) => {
        state = v;
        paint();
    });
    paint();
}
