// research/app-homelab-backups: the Host and System sections' wiring. The components are the package's; this file feeds
// them the sample host (hostdata.js) and shows what they fire. Every section runs only when it is on the page.

import { $, $$, has, count, pad, stateButtons, onChoice, ready, mount, tableShell, tableState, BADGE } from './shared.js';
import * as H from './hostdata.js';
import { setCardState, CARD_RETRY_EVENT } from '../../js/card-state.js';

await ready;

/** The sample clock: the page never reads the real one. */
const clock = (/** @type {number} */ plusMs = 0) => {
    const t = new Date(H.NOW + plusMs);
    return `${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`;
};

/** Press the states of a card-backed area. @param {HTMLElement} card @param {string} v @param {{ words: string, title: string, text: string }} w */
const cardState = (card, v, w) => setCardState(card, /** @type {any} */ (v), v === 'ready' ? undefined : { words: w.words, title: v === 'empty' ? w.title : 'It could not be read', text: v === 'empty' ? w.text : 'The host did not answer within 10 s. Nothing was changed.' });

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 1. disk and thin pool
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('ho-disk-component')) {
    const { setStackbar, STACKBAR_PICK_EVENT, STACKBAR_RETRY_EVENT } = await import('../../js/stackbar.js');
    const root = $('#ho-disk-component');
    const rootBar = $('[data-hb-di-root]', root);
    const poolBar = $('[data-hb-di-pool]', root);
    const rootRead = $('[data-hb-di-root-read]', root);
    const poolRead = $('[data-hb-di-pool-read]', root);
    let state = 'ready';
    let promise = 'part';
    const over = H.PROMISED_GB - H.POOL_GB;

    const draw = () => {
        const bad = state === 'error';
        setStackbar(rootBar, {
            title: 'Root volume',
            total: H.ROOT.total,
            format: H.gb,
            restLabel: 'Free',
            marks: [{ at: 0.8, label: '80 % warning level' }],
            parts: H.ROOT.parts.map(([label, value]) => ({ key: String(label), label: String(label), value: Number(value) })),
            state: /** @type {any} */ (state),
            message: bad ? 'The root volume could not be read.' : 'Nothing has been measured on this volume yet.',
        });
        const guests = H.GUESTS.filter((g) => g.diskWritten > 0).sort((a, b) => b.diskWritten - a.diskWritten);
        /** @type {import('../../js/stackbar.js').StackbarPart[]} */
        const parts = guests.map((g) => ({ key: `ct${g.vmid}`, label: `${g.name} (${g.kind === 'unmanaged' ? 'VM' : 'CT'} ${g.vmid})`, value: g.diskWritten, tip: `${g.name}: ${H.gb(g.diskWritten)} written of ${H.gb(g.diskSize)} promised` }));
        if (promise === 'part') parts.push({ key: 'promised', label: 'Promised, not written yet', value: H.PROMISED_GB - H.WRITTEN_GB, tone: 'warning' });
        setStackbar(poolBar, {
            title: 'Thin pool "data"',
            total: H.POOL_GB,
            format: H.gb,
            other: 0.02,
            restLabel: 'Free in the pool',
            marks: promise === 'part' ? [] : [{ at: 0.9, label: '90 % full' }],
            parts,
            state: /** @type {any} */ (state),
            message: bad ? 'The thin pool could not be read.' : 'No guest has written anything yet.',
        });
        rootRead.textContent = state === 'ready' ? `${H.gb(H.ROOT.parts.reduce((a, p) => a + Number(p[1]), 0))} of ${H.gb(H.ROOT.total)} used.` : '';
        poolRead.textContent = state === 'ready' ? `${H.gb(H.WRITTEN_GB)} written of ${H.POOL_GB} GB; ${H.gb(H.PROMISED_GB)} promised, ${over} GB more than the pool holds.` : '';
    };
    draw();
    for (const bar of [rootBar, poolBar]) {
        bar.addEventListener(STACKBAR_PICK_EVENT, (e) => {
            const k = /** @type {CustomEvent} */ (e).detail.key;
            (bar === rootBar ? rootRead : poolRead).textContent = `Pressed: ${k}.`;
        });
        bar.addEventListener(STACKBAR_RETRY_EVENT, () => {
            state = 'ready';
            pressed('ready');
            draw();
        });
    }
    const pressed = stateButtons('data-hb-di-data', (v) => {
        state = v;
        draw();
    });
    const pressedP = stateButtons('data-hb-di-promise', (v) => {
        promise = v;
        root.dataset.hbPromise = v;
        draw();
    });
    onChoice('ho-promise', (v) => {
        promise = v;
        root.dataset.hbPromise = v;
        pressedP(v);
        draw();
    });
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 2. the doctor
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('ho-checks-component')) {
    const { buildStatusList, setStatus, countStatus, STATUS_RETRY_EVENT } = await import('../../js/statusrow.js');
    const { setIndeterminate } = await import('../../js/progressbar.js');
    const root = $('#ho-checks-component');
    const card = $('.kp-card', root);
    let host = $('[data-hb-ck-host]', root);
    const read = $('[data-hb-ck-read]', root);
    const bar = $('[data-hb-ck-progress]', root);
    const elapsed = $('[data-hb-ck-elapsed]', root);
    const again = $('[data-hb-ck-again]', root);
    /** @type {number[]} */
    let timers = [];
    let tick = 0;

    const rows = (/** @type {boolean} */ loading = false) =>
        H.DOCTOR.map((c) => ({ id: c.id, label: c.label, state: /** @type {any} */ (loading ? 'loading' : c.state), detail: loading ? 'reading…' : c.detail, fix: loading ? '' : (c.fix ?? '') }));
    const summary = () => {
        const c = countStatus(host);
        if (c.loading > 0) return `${count(c.total - c.loading)} of ${count(c.total)} checks read`;
        return `${count(c.ok)} of ${count(c.total)} checks pass, ${count(c.warn)} with a reservation, ${count(c.failed)} failed`;
    };
    const paint = async (/** @type {boolean} */ loading = false) => {
        const next = buildStatusList(rows(loading), { label: 'Host checks' });
        next.setAttribute('data-hb-ck-host', '');
        host.replaceWith(next);
        host = next;
        const { attachStatusLists } = await import('../../js/statusrow.js');
        attachStatusLists(card);
        read.textContent = summary();
    };
    const stop = () => {
        timers.forEach(clearTimeout);
        timers.forEach(clearInterval);
        timers = [];
        setIndeterminate(bar, false);
        elapsed.textContent = '';
    };
    const reading = async () => {
        stop();
        setCardState(card, 'ready');
        await paint(true);
        setIndeterminate(bar, true);
        tick = 0;
        timers.push(window.setInterval(() => (elapsed.textContent = `reading, ${++tick} s of about 30 s (played faster here)`), 1000));
        H.DOCTOR.forEach((c, i) =>
            timers.push(
                window.setTimeout(() => {
                    setStatus(host, c.id, { state: c.state, detail: c.detail, fix: c.fix ?? '' });
                    read.textContent = summary();
                    if (i === H.DOCTOR.length - 1) stop();
                }, 700 * (i + 1) + (i === 2 ? 900 : 0)),
            ),
        );
    };
    const set = stateButtons('data-hb-ck-data', async (v) => {
        stop();
        if (v === 'reading') return void reading();
        if (v === 'ready') {
            setCardState(card, 'ready');
            return void paint();
        }
        cardState(card, v, { words: 'Reading the host checks…', title: 'The host has no checks yet', text: 'The first read after the host starts fills this list.' });
        read.textContent = '';
    });
    again.addEventListener('click', () => {
        set('reading');
        void reading();
    });
    root.addEventListener(STATUS_RETRY_EVENT, (e) => {
        const id = /** @type {CustomEvent} */ (e).detail.id;
        setStatus(host, id, { state: 'loading', detail: 'reading…', fix: '' });
        timers.push(
            window.setTimeout(() => {
                const c = H.DOCTOR.find((x) => x.id === id);
                if (c) setStatus(host, id, { state: c.state, detail: c.detail, fix: c.fix ?? '' });
                read.textContent = summary();
            }, 1400),
        );
    });
    card.addEventListener(CARD_RETRY_EVENT, () => {
        set('ready');
        setCardState(card, 'ready');
        void paint();
    });
    await paint();
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 3. one refresh control
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('ho-refresh-component')) {
    const { setRefreshInterval } = await import('../../js/auto-refresh.js');
    const root = $('#ho-refresh-component');
    const control = $('[data-hb-rf-control]', root);
    const kpiHost = $('[data-hb-rf-kpis]', root);
    const log = $('[data-hb-rf-log]', root);
    const read = $('[data-hb-rf-read]', root);
    const dlg = /** @type {HTMLDialogElement} */ ($('[data-hb-rf-dlg]', root));
    let works = true;
    let reads = 0;
    const series = {
        cpu: [18, 22, 19, 31, 27, 24, 20, 26, 35, 29, 22, 19, 23, 28, 24, 21, 25, 30, 27, 22, 20, 24, 26, 23],
        mem: [61, 61, 62, 62, 63, 63, 64, 64, 64, 65, 65, 64, 64, 65, 66, 66, 66, 67, 67, 67, 68, 68, 68, 69],
        disk: Array.from({ length: 24 }, () => 53),
        temp: [49, 48, 49, 51, 50, 52, 53, 52, 51, 54, 53, 52, 51, 50, 52, 53, 54, 53, 52, 51, 52, 53, 54, 54],
    };
    const tiles = [
        ['cpu', 'CPU', '%', 'of 12 threads', 'warning'],
        ['mem', 'Memory', '%', '21.4 of 31.0 GiB', 'warning'],
        ['disk', 'Root disk', '%', '50.1 of 94 GB', 'warning'],
        ['temp', 'Temperature', '°C', 'limit 85 °C', 'warning'],
    ];
    const paintKpis = () => {
        kpiHost.innerHTML = `<div class="kp-kpis" role="group" aria-label="Host figures">${tiles
            .map(([k, label, unit, note]) => {
                const s = /** @type {number[]} */ (series[/** @type {keyof typeof series} */ (k)]);
                return `<div class="kp-kpi"><span class="kp-kpi__label">${label}</span><span class="kp-kpi__value">${s[s.length - 1]}<small>${unit}</small></span><span class="kp-kpi__trend">${note}</span><svg class="kp-kpi__spark" data-kp-spark="${s.join(' ')}"></svg></div>`;
            })
            .join('')}</div>`;
    };
    paintKpis();
    void mount(kpiHost, kpiHost.innerHTML);
    const line = (/** @type {string} */ text, /** @type {boolean} */ ok) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="kp-badge kp-badge--${ok ? 'success' : 'destructive'}">${ok ? 'read' : 'failed'}</span> <span class="kp-numeric">${clock(reads * 30000)}</span> ${text}`;
        log.prepend(li);
        while (log.children.length > 4) log.lastElementChild?.remove();
    };
    line('host figures, guests and checks, in one read', true);

    control.addEventListener('kp-refresh', (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        reads++;
        window.setTimeout(() => {
            d.done(works);
            if (works) {
                for (const k of Object.keys(series)) {
                    const s = /** @type {number[]} */ (series[/** @type {keyof typeof series} */ (k)]);
                    const last = /** @type {number} */ (s[s.length - 1]);
                    s.push(k === 'disk' ? last : Math.max(1, last + ((reads * 7 + s.length * 3) % 5) - 2));
                    s.shift();
                }
                paintKpis();
                void mount(kpiHost, kpiHost.innerHTML);
                line(`host figures, guests and checks (${d.reason})`, true);
                read.textContent = `${count(reads)} ${reads === 1 ? 'refresh' : 'refreshes'} so far; each read the host figures, the guests and the checks at once.`;
            } else {
                line('nothing: the host did not answer, the figures stay as they were', false);
                read.textContent = 'The last refresh failed; the figures above are from the one before.';
            }
        }, 450);
    });
    $('[data-hb-rf-dialog]', root).addEventListener('click', () => dlg.showModal());
    $('[data-hb-rf-close]', root).addEventListener('click', () => dlg.close());
    const setLook = (/** @type {string} */ v) => {
        control.setAttribute('data-kp-look', v);
        setRefreshInterval(control, Number(control.getAttribute('data-kp-refresh') ?? 30));
    };
    stateButtons('data-hb-rf-reads', (v) => {
        works = v === 'works';
        root.dataset.hbReads = v;
        read.textContent = works ? 'The next refreshes will read the host.' : 'The next refreshes will fail: the figures stay, the control retries with a back-off.';
    });
    const pressedL = stateButtons('data-hb-rf-look', setLook);
    onChoice('ho-refresh-look', (v) => {
        pressedL(v);
        setLook(v);
    });
    read.textContent = 'The control refreshes by itself; press Refresh now or R to see a read.';
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 4. the containers
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('ho-containers-component')) {
    const { dataTable, EXPAND_EVENT } = await import('../../js/datatable.js');
    const { setBarCell } = await import('../../js/barcell.js');
    const { setEntityGrid, setEntityGridState } = await import('../../js/entity-card.js');
    const { setBullets } = await import('../../js/bullets.js');
    const { SEGMENTED_EVENT, setSegmentedValues } = await import('../../js/segmented.js');
    const root = $('#ho-containers-component');
    const host = $('[data-hb-cn-host]', root);
    const read = $('[data-hb-cn-read]', root);
    const seg = $('[data-hb-cn-seg]', root);
    let view = 'table';
    let state = 'ready';
    const share = (/** @type {H.Guest} */ g) => (g.ramUsed === null ? null : g.ramUsed / g.ramMax);

    const rowsHtml = () =>
        H.GUESTS.map(
            (g) => `<tr data-kp-row-key="${g.vmid}">
        <td data-label="Guest" data-kp-sort-value="${g.vmid}"><b>${g.name}</b> <span class="hb-ct">${g.kind === 'unmanaged' && g.vmid <= 101 ? 'VM' : 'CT'} ${g.vmid}</span></td>
        <td data-label="Stack">${g.stack ?? '—'}</td>
        <td data-label="State" data-kp-filter-value="${g.status}"><span class="kp-badge kp-badge--${g.status === 'running' ? 'success' : ''}">${g.status}</span></td>
        <td data-label="CPU" data-kp-sort-value="${g.cpuPct ?? -1}"><span class="kp-bar-cell" data-hb-cpu="${g.vmid}"></span></td>
        <td data-label="Memory" data-kp-sort-value="${share(g) ?? -1}"><span class="kp-bar-cell" data-hb-mem="${g.vmid}"></span></td>
        <td data-label="Lock">${g.lock}</td>
        <td data-label="Kind" data-kp-filter-value="${g.kind}">${g.kind}</td></tr>`,
        ).join('');
    const tableHtml = (empty = false) =>
        tableShell({
            id: 'hb-cn-table',
            remember: 'hb-ho-guests',
            caption: 'Guests on pve',
            attrs: 'data-kp-expandable data-kp-sort-multi="click"',
            head: `<th scope="col" data-kp-sort="number">Guest</th><th scope="col" data-kp-sort="text">Stack</th><th scope="col" data-kp-sort="text" data-kp-filter="choice">State</th>
                <th scope="col" data-kp-sort="number">CPU</th><th scope="col" data-kp-sort="number">Memory</th><th scope="col" data-kp-sort="text">Lock</th><th scope="col" data-kp-sort="text" data-kp-filter="choice">Kind</th>`,
            body: empty ? '' : rowsHtml(),
            emptyTitle: 'No guests on this host',
            emptyText: 'Create a stack and its container shows here.',
            none: 'The guests could not be read',
        });
    const table = () => /** @type {import('../../js/datatable.js').DataTableHandle} */ (dataTable($('[data-kp-datatable]', host)));

    const cards = () =>
        H.GUESTS.map((g) => ({
            key: String(g.vmid),
            name: g.name,
            vmid: String(g.vmid),
            state: { label: g.status, tone: g.status === 'running' ? 'success' : undefined },
            figures: [{ value: g.stack ?? g.kind, label: 'stack' }, { value: g.lock === '—' ? 'none' : g.lock, label: 'lock' }],
            flags: g.kind === 'unmanaged' ? [{ label: 'not managed', tone: 'warning' }] : [],
            meters: [
                { label: 'CPU', value: g.cpuPct === null ? null : g.cpuPct / 100 },
                { label: 'RAM', value: share(g), text: g.ramUsed === null ? undefined : `${H.gib(g.ramUsed)} of ${H.gib(g.ramMax)}` },
            ],
            actions: [{ id: 'log', label: 'Open its log' }, { id: 'stack', label: 'Open stack', disabled: g.stack ? undefined : 'This guest is not a stack' }],
        }));

    const paint = async () => {
        read.textContent = '';
        host.setAttribute('data-hb-view', view);
        if (view === 'table') {
            await mount(host, tableHtml(state === 'empty'));
            for (const g of H.GUESTS) {
                const cpu = host.querySelector(`[data-hb-cpu="${g.vmid}"]`);
                const mem = host.querySelector(`[data-hb-mem="${g.vmid}"]`);
                if (cpu) setBarCell(/** @type {HTMLElement} */ (cpu), { value: g.cpuPct === null ? null : g.cpuPct / 100, text: g.cpuPct === null ? '—' : `${g.cpuPct} %`, sortValue: g.cpuPct ?? -1, label: 'of the CPU' });
                if (mem) setBarCell(/** @type {HTMLElement} */ (mem), { value: share(g), text: g.ramUsed === null ? '—' : `${H.gib(g.ramUsed)} of ${H.gib(g.ramMax)}`, sortValue: share(g) ?? -1, warnAt: 0.75, badAt: 0.9, label: 'of its memory' });
            }
            tableState(table(), state);
            if (state === 'ready') read.textContent = `${count(H.GUESTS.length)} guests: ${count(H.GUESTS.filter((g) => g.status === 'running').length)} running.`;
        } else if (view === 'cards') {
            host.innerHTML = '<div class="kp-entity-grid" data-kp-entity-grid data-kp-entity-link="#{key}" role="list"></div>';
            await mount(host, host.innerHTML);
            const grid = $('[data-kp-entity-grid]', host);
            if (state === 'ready') setEntityGrid(grid, /** @type {any} */ (cards()));
            else setEntityGridState(grid, /** @type {any} */ (state), { message: 'The host did not answer. Nothing was changed.', title: 'No guests on this host' });
            if (state === 'ready') read.textContent = `${count(H.GUESTS.length)} cards of one height.`;
        } else {
            host.innerHTML = '<div class="kp-bullets" data-kp-bullets></div>';
            await mount(host, host.innerHTML);
            const el = $('.kp-bullets', host);
            const running = H.GUESTS.filter((g) => g.ramUsed !== null);
            setBullets(el, {
                threshold: 0.75,
                bad: 0.9,
                max: 1,
                format: (v) => `${Math.round(v * 100)} %`,
                rows: state === 'ready' ? running.map((g) => ({ key: String(g.vmid), lead: `CT ${g.vmid}`, label: g.name, detail: `${H.gib(g.ramUsed ?? 0)} of ${H.gib(g.ramMax)}`, value: share(g), pick: true })) : [],
                state: /** @type {any} */ (state === 'ready' ? 'ready' : state),
                message: 'The memory figures could not be read.',
                emptyTitle: 'No guest is running',
                emptyText: 'A running guest shows its memory share here.',
                loadingRows: 8,
                loadingWords: 'Reading the guests…',
            });
            if (state === 'ready') read.textContent = `Memory share of ${count(running.length)} running guests, worst first; amber from 75 %.`;
        }
    };
    host.addEventListener(EXPAND_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        if (!d.open || !d.cell || d.cell.childElementCount > 0) return;
        const g = H.GUESTS.find((x) => String(x.vmid) === String(d.key));
        if (!g) return;
        const box = document.createElement('div');
        box.className = 'hb-detail hb-grid';
        box.innerHTML = `<p class="hb-c8">${g.name} is ${g.status}${g.lock !== '—' ? `, locked by ${g.lock}` : ''}. ${g.ramUsed === null ? 'It is not running, so it has no CPU or memory figures.' : `It uses ${H.gib(g.ramUsed)} of its ${H.gib(g.ramMax)} and ${g.cpuPct} % of the CPU.`} Its disk holds ${H.gb(g.diskWritten)} of ${H.gb(g.diskSize)}.</p>
            <div class="hb-c4 hb-pill-row"><button type="button" class="kp-button kp-button--sm" ${g.stack ? '' : 'disabled data-kp-disabled-reason="This guest is not a stack"'}>Open stack</button><button type="button" class="kp-button kp-button--sm">Open its log</button></div>`;
        d.cell.append(box);
    });
    host.addEventListener('kp-datatable-retry', () => void set('ready'));
    host.addEventListener('kp-entity-grid-retry', () => void set('ready'));
    host.addEventListener('kp-bullets-retry', () => void set('ready'));
    host.addEventListener('kp-bullets-pick', (e) => (read.textContent = `Pressed: guest ${/** @type {CustomEvent} */ (e).detail.key}: it would open its detail.`));
    host.addEventListener('kp-entity-action', (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        read.textContent = `${d.id === 'log' ? 'Open its log' : 'Open stack'} on guest ${d.key}.`;
    });
    const pressedS = stateButtons('data-hb-cn-data', (v) => void set(v));
    const set = async (/** @type {string} */ v) => {
        state = v;
        pressedS(v);
        await paint();
    };
    const pressedV = stateButtons('data-hb-cn-view', (v) => void setView(v));
    const setView = async (/** @type {string} */ v) => {
        view = v;
        pressedV(v);
        setSegmentedValues(seg, [v]);
        await paint();
    };
    seg.addEventListener(SEGMENTED_EVENT, (e) => void setView(/** @type {CustomEvent} */ (e).detail.value ?? 'table'));
    onChoice('ho-containers-view', (v) => void setView(v));
    await paint();
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 5. the System landing
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('ho-landing-component')) {
    const { buildStatusList, setStatus, STATUS_RETRY_EVENT, attachStatusLists } = await import('../../js/statusrow.js');
    const { setAgo } = await import('../../js/freshness.js');
    const root = $('#ho-landing-component');
    const card = $('.kp-card', root);
    const tilesHost = $('[data-hb-ld-tiles]', root);
    const attn = $('[data-hb-ld-attn]', root);
    const read = $('[data-hb-ld-read]', root);
    let state = 'ready';
    let fold = false;
    const TILES = [
        ['host', 'Host', 'The machine everything runs on: disks, the thin pool, the guests and the daily checks.', 'ok', 'Host reachable', 'answered in 4 ms'],
        ['backups', 'Backups', 'Every stack against every night, the repositories and the restore wizard.', 'warn', 'Last night', '11 of 12 stacks backed up'],
        ['firewall', 'Firewall', 'Which stack may reach which, and the rule that decides.', 'warn', 'Firewalls', '1 stack without one, 2 differ from their files'],
        ['metrics', 'Metrics', 'Charts of the host and the stacks, with the nightly backup marked.', 'ok', 'Scrape targets', 'all 6 answer'],
        ['map', 'Map', 'The network drawn as it is: stacks, links and mismatches.', 'ok', 'Stacks', '11 stacks, 37 firewall rules'],
        ['tools', 'Tools', 'Versions, the look-and-script check and the console of the host.', 'ok', 'Versions', 'dashboard 3.75.0, host 3.74.2: 1 update'],
    ];

    /** @type {Record<string, HTMLElement>} */
    const lists = {};
    const build = (/** @type {string} */ st) => {
        tilesHost.innerHTML = `<ul class="kp-tiles">${TILES.map(
            ([k, title, lede, tone]) => `<li class="kp-card" data-hb-tile="${k}">
            <h3 class="kp-card__title">${title}</h3>
            <p class="kp-lede" ${fold ? 'data-kp-lede-collapsible="40"' : ''}>${lede}</p>
            <div class="kp-card__body" data-hb-live="${k}"></div>
            <div class="kp-card__footer hb-tile-foot"><time class="kp-ago" data-kp-ago data-kp-ago-verb="read" data-hb-ago="${k}"></time><a class="kp-button kp-button--sm kp-button--ghost" href="#${k}">Open ${title}</a></div></li>`,
        ).join('')}</ul>`;
        for (const [k, , , tone, name, live] of TILES) {
            const failed = st === 'failed' && k === 'metrics';
            const list = buildStatusList([{ id: k, label: failed ? 'Scrape targets' : String(name), state: /** @type {any} */ (st === 'loading' ? 'loading' : failed ? 'failed' : tone === 'warn' ? 'warn' : 'ok'), detail: st === 'loading' ? 'reading…' : failed ? 'did not answer within 10 s' : String(live) }], { label: `${k} live line`, single: true });
            $(`[data-hb-live="${k}"]`, tilesHost).append(list);
            lists[k] = list;
            setAgo($(`[data-hb-ago="${k}"]`, tilesHost), Date.now() - 12000 - TILES.findIndex((t) => t[0] === k) * 7000);
        }
        attachStatusLists(tilesHost);
        void mount(tilesHost, tilesHost.innerHTML);
    };
    const attnHtml = () => `<div class="kp-attention" role="region" aria-label="Needs attention">${[
        ['critical', 'Unattended upgrades have failed for 3 days', 'apt is locked by process 4411 on pve.'],
        ['warning', `Thin pool promised ${Math.round((H.PROMISED_GB / H.POOL_GB) * 100)} %`, `${H.gb(H.PROMISED_GB)} promised on a ${H.POOL_GB} GB pool.`],
    ].map(([sev, what, why]) => `<div class="kp-alert kp-alert--${sev === 'critical' ? 'destructive' : 'warning'} kp-attention__item" role="${sev === 'critical' ? 'alert' : 'status'}" data-kp-severity="${sev}"><span class="kp-attention__icon" aria-hidden="true">!</span><div class="kp-attention__text"><strong><span class="kp-sr-only">${sev === 'critical' ? 'Critical' : 'Warning'}: </span>${what}</strong><span>${why}</span></div><div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm" data-hb-open-host>Open Host</button></div></div>`).join('')}</div>`;
    const paint = async (/** @type {string} */ st) => {
        state = st;
        setCardState(card, 'ready');
        await mount(attn, st === 'clear' ? '<div class="kp-attention" role="region" aria-label="Needs attention"></div>' : attnHtml());
        build(st === 'clear' ? 'ready' : st);
        read.textContent = st === 'loading' ? '' : st === 'failed' ? '5 of 6 areas answered; Metrics did not.' : st === 'clear' ? 'Everything is fine: no problem is mirrored.' : '6 areas; 2 problems on the host.';
    };
    root.addEventListener(STATUS_RETRY_EVENT, (e) => {
        const id = /** @type {CustomEvent} */ (e).detail.id;
        setStatus(lists[id] ?? tilesHost, id, { state: 'loading', detail: 'reading…' });
        window.setTimeout(() => {
            setStatus(lists[id] ?? tilesHost, id, { state: 'ok', detail: String(TILES.find((t) => t[0] === id)?.[5]) });
            read.textContent = '6 of 6 areas answered.';
            pressed('ready');
        }, 1400);
    });
    attn.addEventListener('click', (e) => {
        if (/** @type {HTMLElement} */ (e.target).closest('[data-hb-open-host]')) read.textContent = 'Open Host: goes to the Host page.';
    });
    const pressed = stateButtons('data-hb-ld-data', (v) => void paint(v));
    onChoice('ho-lede', (v) => {
        fold = v === 'fold';
        void paint(state);
    });
    await paint('ready');
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 6. versions
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('ho-version-component')) {
    const { summarizeDeltas, setVersionDelta } = await import('../../js/version-delta.js');
    const { renderDiagnostics } = await import('../../js/diagnostics.js');
    const root = $('#ho-version-component');
    const card = $('.kp-card', root);
    const list = $('[data-hb-vs-list]', root);
    const read = $('[data-hb-vs-read]', root);
    const diag = $('[data-hb-vs-diag-host]', root);
    let show = 'both';
    let state = 'ready';

    const html = () => `<ul class="hb-vlist" role="list">${H.VERSIONS.map(
        (v) => `<li><span class="hb-vlist__name">${v.label}</span>
        <span class="kp-badge kp-badge--version" data-hb-chip="${v.key}" data-kp-version-from="${v.from}" data-kp-version-to="${v.to}" ${v.app ? `data-kp-version-app="${v.app}"` : ''} data-kp-version-show="${show}" ${v.key === 'themes' ? 'data-kp-version-href="https://github.com/kennypassenier/kp-themes/releases/tag/v{to}"' : ''}></span>
        <span class="hb-vlist__note">${v.note}</span></li>`,
    ).join('')}</ul>`;
    const paint = async () => {
        await mount(list, html());
        for (const chip of $$('[data-hb-chip]', list)) {
            if (state !== 'ready') setVersionDelta(chip, { from: chip.getAttribute('data-kp-version-from') ?? '', to: chip.getAttribute('data-kp-version-to') ?? '', state: /** @type {any} */ (state), error: 'could not check' });
        }
        const s = summarizeDeltas(H.VERSIONS.map((v) => ({ from: v.from, to: v.to, app: v.app })), { bigMinorApps: ['immich'] });
        read.textContent = state === 'ready' ? s.text : '';
    };
    const sides = {
        match: [{ version: '11.0.0', themes: ['formal', 'dark'] }, { version: '11.0.0', themes: ['formal', 'dark'] }],
        'stylesheet-behind': [{ version: '10.1.1', themes: ['formal', 'dark'] }, { version: '11.0.0', themes: ['formal', 'dark'] }],
        'script-behind': [{ version: '11.0.0', themes: ['formal', 'dark'] }, { version: '10.1.1', themes: ['formal', 'dark'] }],
        'themes-differ': [{ version: '11.0.0', themes: ['formal', 'dark', 'pastel'] }, { version: '11.0.0', themes: ['formal', 'dark', 'deco'] }],
        'no-version': [{ version: null, themes: ['formal', 'dark'] }, { version: '11.0.0', themes: ['formal', 'dark'] }],
    };
    const drawDiag = (/** @type {keyof typeof sides} */ k) => renderDiagnostics(diag, { stylesheet: sides[k][0], script: sides[k][1] });
    stateButtons('data-hb-vs-diag', (v) => drawDiag(/** @type {any} */ (v)));
    drawDiag('match');
    const pressedS = stateButtons('data-hb-vs-data', (v) => {
        state = v;
        void paint();
    });
    void pressedS;
    const pressedH = stateButtons('data-hb-vs-show', (v) => {
        show = v;
        void paint();
    });
    onChoice('ho-version-show', (v) => {
        show = v;
        pressedH(v);
        void paint();
    });
    void card;
    await paint();
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 7. the line to the host
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('ho-link-component')) {
    const { setUptime } = await import('../../js/uptime.js');
    const root = $('#ho-link-component');
    const card = $('.kp-card', root);
    const host = $('[data-hb-lk-host]', root);
    const read = $('[data-hb-lk-read]', root);
    let form = 'strip';
    let state = 'ready';
    /** @type {(number | null)[]} */
    const pings = [...H.PINGS];

    const periods = () =>
        pings.map((ms, i) => ({
            key: `p${i}-${ms}`,
            label: i === pings.length - 1 ? 'Now' : `${pings.length - 1 - i} pings ago`,
            state: /** @type {'up' | 'degraded' | 'down'} */ (ms === null ? 'down' : ms > 30 ? 'degraded' : 'up'),
            tip: ms === null ? `${clock((i - pings.length + 1) * 30000)}: no answer within 5 s` : `${clock((i - pings.length + 1) * 30000)}: answered in ${ms} ms${ms > 30 ? ' (slow)' : ''}`,
        }));
    const paint = async () => {
        const answered = pings.filter((p) => p !== null).length;
        if (form === 'strip') {
            host.innerHTML = '<div class="kp-uptime" data-kp-uptime data-kp-uptime-count="12" data-kp-uptime-fit="scroll"></div>';
            await mount(host, host.innerHTML);
            setUptime($('[data-kp-uptime]', host), {
                label: 'Line to pve',
                periods: state === 'ready' ? periods() : [],
                from: '12 pings ago',
                to: 'Now',
                count: 12,
                state: /** @type {any} */ (state === 'ready' ? 'ready' : state),
                error: 'The ping history could not be read.',
                open: 'info',
            });
        } else {
            const vals = pings.map((p) => p ?? 0);
            host.innerHTML = `<div class="hb-spark"><svg class="kp-kpi__spark" data-kp-spark="${vals.join(' ')}" aria-label="Answer time of the last ${pings.length} pings"></svg><p class="hb-readout">Answer time in ms; a lost ping is drawn as 0. Slowest: 38 ms.</p></div>`;
            await mount(host, host.innerHTML);
        }
        read.textContent = state === 'ready' ? `${count(answered)} of ${count(pings.length)} answered; slowest ${Math.max(...pings.map((p) => p ?? 0))} ms.` : '';
    };
    $('[data-hb-lk-ping]', root).addEventListener('click', () => {
        pings.push(4 + (pings.length % 3));
        pings.shift();
        void paint();
    });
    const pressedD = stateButtons('data-hb-lk-data', (v) => {
        state = v;
        if (v === 'ready') setCardState(card, 'ready');
        else if (v === 'loading' || v === 'empty' || v === 'error') {
            setCardState(card, 'ready');
        }
        void paint();
    });
    void pressedD;
    const pressedF = stateButtons('data-hb-lk-form', (v) => {
        form = v;
        void paint();
    });
    onChoice('ho-link-form', (v) => {
        form = v;
        pressedF(v);
        void paint();
    });
    await paint();
}
