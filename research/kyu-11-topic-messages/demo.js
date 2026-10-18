// research/kyu-11-topic-messages: the page's own wiring. Every component is the package's (js/auto.js attaches what the page carries);
// this file fills the lists with mock data, answers the state buttons and the choice sets, and plays the parts a kyu server would play.
import { setProblems } from '../../js/problems.js';
import { dataTable } from '../../js/datatable.js';
import { setCode, attachCodes } from '../../js/code.js';
import { masterDetail, setPaneState } from '../../js/master-detail.js';
import { openViewer } from '../../js/viewer.js';
import { runFlashButton } from '../../js/flash.js';
import { undoToast } from '../../js/undo-toast.js';
import { setSelectionBusy, setSelectionResult, setSelectionRules } from '../../js/selection-bar.js';
import { refreshOf, setRefreshInterval } from '../../js/auto-refresh.js';
import { statePlate } from '../../js/state-plate.js';
import { openBusyCard } from '../../js/busy-card.js';
import { attachArt } from '../../js/art.js';

/** @param {string} sel @param {ParentNode} [root] @returns {HTMLElement | null} */
const $ = (sel, root = document) => /** @type {HTMLElement | null} */ (root.querySelector(sel));
/** @param {string} sel @param {ParentNode} [root] @returns {HTMLElement[]} */
const $$ = (sel, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(sel)]);
/** @param {number} ms */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/** @param {string} tag @param {string} [className] @param {string} [text] */
function make(tag, className = '', text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}
/** The exact number, with the thousands grouped: 12,408. @param {number} n */
const count = (n) => n.toLocaleString('en-GB');

/** Press one button of a group: it is on, its siblings are off. @param {Element} button */
function pick(button) {
    const group = button.closest('[role="group"]');
    if (!group) return;
    for (const b of group.querySelectorAll('button[aria-pressed]')) b.setAttribute('aria-pressed', String(b === button));
}

/**
 * A group of state buttons: one is pressed, the page applies it.
 * @param {string} attribute the data attribute that holds the button's value
 * @param {(value: string, button: HTMLElement) => void} apply
 */
function stateButtons(attribute, apply) {
    for (const button of $$(`[${attribute}]`)) {
        button.addEventListener('click', () => {
            pick(button);
            apply(button.getAttribute(attribute) ?? '', button);
        });
    }
}

/**
 * What the review dialog sets for a choice, as its section hears it.
 * @param {string} id @param {(value: string) => void} apply
 */
function onChoice(id, apply) {
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id === id) apply(String(detail.value));
    });
}

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

// ---------------------------------------------------------------- the stage: one footprint for every state of a region

/**
 * A region that keeps its box in every state: the filled content stays in its place (hidden while a plate or the busy card
 * stands over it), and a plate or the theme's busy card fills the same box.
 * @param {HTMLElement} host a `.k11-stage`
 */
function stage(host) {
    const plate = /** @type {HTMLElement} */ ($('[data-k11-plate]', host));
    /** @type {import('../../js/busy-card.js').BusyCard | null} */
    let card = null;
    const clear = () => {
        card?.remove();
        card = null;
        plate.hidden = true;
        plate.replaceChildren();
        plate.removeAttribute('data-kp-art');
        host.removeAttribute('data-k11-state');
    };
    return {
        ready: clear,
        /** @param {string} words */
        loading(words) {
            clear();
            host.setAttribute('data-k11-state', 'loading');
            card = openBusyCard(host, { words, area: () => [host], arrive: false });
        },
        /** @param {HTMLElement} node @param {string} [art] */
        plate(node, art) {
            clear();
            host.setAttribute('data-k11-state', 'plate');
            if (art) {
                node.setAttribute('data-kp-art', art);
                attachArt(node);
            }
            plate.append(node);
            plate.hidden = false;
        },
    };
}

// ---------------------------------------------------------------- the mock data (kyu's real shape)

/** "17/10/2026 20:14" (Brussels, summer time) as the ISO moment a machine reads. @param {string} local */
function isoOf(local) {
    const [d, t] = local.split(' ');
    const [dd, mm, yyyy] = d.split('/').map(Number);
    const [hh, mi] = t.split(':').map(Number);
    return new Date(Date.UTC(yyyy, mm - 1, dd, hh - 2, mi)).toISOString();
}

// A flat report of 38 lines when laid out: the package's code block gives every bracket and comma its own span, so a nested
// payload would put `},` and `],` side by side at 0 px (reported as a package gap); this sample stays flat.
const LONG_REPORT = JSON.stringify(
    Object.fromEntries([
        ['report', 'nightly'],
        ['host', 'ct-106'],
        ['generated', '2026-10-17T03:00:11+02:00'],
        ['ok', false],
        ...['media', 'vault', 'backup', 'monitoring', 'dns', 'mail', 'wiki', 'photos'].flatMap((name, i) => [
            [`${name}_state`, i === 2 || i === 5 ? 'stopped' : 'running'],
            [`${name}_cpu`, [0.4, 0.1, 0, 1.2, 0.1, 0, 0.3, 2.8][i]],
            [`${name}_mem_mb`, [412, 96, 0, 733, 41, 0, 205, 1290][i]],
            [`${name}_restarts`, [0, 0, 5, 1, 0, 3, 0, 0][i]],
        ]),
    ]),
);
const TAIL = Array.from({ length: 24 }, (_, i) => `20:${String(i).padStart(2, '0')}:07 INFO worker ${i % 4} handled job ${4000 + i}`)
    .join('\n')
    .slice(0, 1000);

/**
 * @typedef {{ id: string, when: string, sub: string, tries: number, why: string, text: string, attrs?: Record<string, string> }} Dead
 * @type {Dead[]}
 */
const DEAD = [
    { id: '4f2a', when: '17/10/2026 20:14', sub: 'desktop', tries: 5, why: 'desktop answered 503 on all 5 attempts', text: '{"title":"eerste echte bericht","body":"hello from HA"}' },
    { id: '4f29', when: '17/10/2026 20:09', sub: 'desktop', tries: 5, why: 'desktop answered 503 on all 5 attempts', text: '{"title":"Backup finished","body":"12 stacks, 3.2 GB, no errors","priority":"low"}' },
    { id: '4f21', when: '17/10/2026 19:58', sub: 'desktop', tries: 5, why: 'desktop answered 503 on all 5 attempts', text: LONG_REPORT },
    { id: '4e90', when: '17/10/2026 19:44', sub: 'phone', tries: 5, why: 'phone nacked it 5 times: payload not understood', text: 'backup ok' },
    { id: '4e7c', when: '17/10/2026 18:30', sub: 'kyu-runner', tries: 5, why: 'lease ran out 5 times (30 s)', text: TAIL, attrs: { 'data-kp-truncated': '1000/4000' } },
    {
        id: '4e51',
        when: '17/10/2026 18:12',
        sub: 'kyu-runner',
        tries: 5,
        why: 'lease ran out 5 times (30 s)',
        text: '',
        attrs: { 'data-kp-binary-size': '2100', 'data-kp-download': 'data:application/octet-stream;base64,AAAA' },
    },
    { id: '4d10', when: '17/10/2026 16:40', sub: 'almanac', tries: 3, why: 'Google Calendar refused it (HTTP 403)', text: '{"event":"Dentist","start":"2026-10-21T14:30:00+02:00","calendar":"kenny"}' },
    { id: '4c02', when: '16/10/2026 23:05', sub: 'archive', tries: 5, why: 'archive was archived while it waited', text: '' },
    { id: '4c01', when: '16/10/2026 22:51', sub: 'archive', tries: 5, why: 'archive was archived while it waited', text: '{"title":"Disk 71 percent full","body":"ct-106"}' },
    { id: '4bf7', when: '16/10/2026 21:20', sub: 'archive', tries: 5, why: 'archive was archived while it waited', text: '{"title":"Certificate renewed","host":"traefik"}' },
    { id: '4bd3', when: '16/10/2026 19:02', sub: 'archive', tries: 5, why: 'archive was archived while it waited', text: '{"title":"Queue drained","queue":"mail"}' },
    { id: '4b90', when: '15/10/2026 08:15', sub: 'archive', tries: 5, why: 'archive was archived while it waited', text: '{"title":"Upstream timeout","body":"mirror"}' },
];
const SUB_OF = new Map(DEAD.map((d) => [`dead-${d.id}`, d.sub]));
const TOTAL_DEAD = 110;

/**
 * A payload as a table cell.
 * @param {string} text @param {Record<string, string>} [attrs]
 */
function cellFigure(text, attrs = {}) {
    const fig = make('figure', 'kp-code kp-code--cell');
    fig.setAttribute('data-kp-code', '');
    fig.setAttribute('data-kp-code-language', 'auto');
    for (const [k, v] of Object.entries(attrs)) fig.setAttribute(k, v);
    const pre = make('pre');
    pre.append(make('code', '', text));
    fig.append(pre);
    return fig;
}

// ---------------------------------------------------------------- 1 · problems

void (async () => {
    const live = $('#k11-problems-live');
    const host = $('#k11-problems-comp .k11-stage');
    const readout = $('[data-k11-problems-readout]');
    if (live && host) {
        const view = stage(host);
        /** @param {string} s */
        const fix = (s) => `Requeue ${s}`;
        const ALL = [
            {
                key: 'desktop',
                severity: 'critical',
                what: '3 messages died on desktop',
                why: 'desktop answered 503 on all 5 attempts. The last one died on 17/10/2026 20:14.',
                remedy: 'Start the desktop app, then requeue them.',
                button: fix('3'),
            },
            {
                key: 'phone',
                severity: 'warning',
                what: '1 message died on phone',
                why: 'phone nacked it 5 times: the payload was not understood.',
                remedy: 'Fix what sends it, then requeue the message, or delete it.',
                button: fix('1'),
            },
            {
                key: 'runner',
                severity: 'warning',
                what: '2 messages died on kyu-runner',
                why: 'Their lease ran out 5 times; the runner needed more than 30 s.',
                remedy: 'Raise the lease to 60 s, then requeue them.',
                button: fix('2'),
            },
            {
                key: 'almanac',
                severity: 'warning',
                what: '1 message died on almanac',
                why: 'Google Calendar refused it (HTTP 403).',
                remedy: 'Share the calendar with the service account, then run:',
                command: 'kyu requeue notify.kenny --subscription almanac',
                button: fix('1'),
            },
            {
                key: 'archive',
                severity: 'info',
                what: '104 messages died on archive',
                why: 'archive was archived while they were waiting.',
                remedy: 'Unarchive archive and requeue them, or delete them.',
                button: fix('104'),
            },
            {
                key: 'oldest',
                severity: 'info',
                what: 'The oldest dead letter is 4 days old',
                why: 'Dead letters are kept for 30 days and then pruned.',
                remedy: 'Requeue or delete it before 14/11/2026.',
                button: 'Show it',
            },
        ];
        const state = { n: 3, region: 'ready', gone: /** @type {Set<string>} */ (new Set()) };
        const items = () => ALL.slice(0, state.n).filter((p) => !state.gone.has(p.key));
        const draw = () => {
            const list = items();
            if (state.n === 0 || list.length === 0) {
                setProblems(live, []);
                const empty = statePlate(document, {
                    kind: 'empty',
                    title: 'Nothing has died',
                    text: 'Every message on notify.kenny was delivered or is still waiting.',
                });
                view.plate(empty, 'done');
                return;
            }
            view.ready();
            setProblems(
                live,
                list.map((p) => {
                    const button = make('button', 'kp-button', p.button);
                    button.type = 'button';
                    button.setAttribute('data-k11-fix', p.key);
                    return { key: p.key, severity: /** @type {any} */ (p.severity), what: p.what, why: p.why, remedy: p.remedy, command: p.command, action: button };
                }),
            );
        };
        const region = (/** @type {string} */ next) => {
            state.region = next;
            if (next === 'loading') view.loading('Reading the dead letters…');
            else if (next === 'failed')
                view.plate(
                    statePlate(document, {
                        kind: 'error',
                        title: 'Could not read the dead letters',
                        text: 'kyu did not answer within 10 s. Nothing was changed.',
                        actionLabel: 'Try again',
                        onAction: () => {
                            const ready = $('[data-k11-problems-region="ready"]');
                            if (ready) {
                                pick(ready);
                                region('ready');
                            }
                        },
                    }),
                );
            else draw();
        };
        draw();
        stateButtons('data-k11-problems', (value) => {
            state.n = value === 'none' ? 0 : Number(value);
            state.gone.clear();
            if (state.region === 'ready') draw();
            if (readout) readout.textContent = value === 'none' ? 'Nothing has died.' : `${value} problem${value === '1' ? '' : 's'} shown.`;
        });
        stateButtons('data-k11-problems-region', region);
        live.addEventListener('click', async (event) => {
            const button = event.target instanceof Element ? event.target.closest('[data-k11-fix]') : null;
            if (!(button instanceof HTMLElement)) return;
            const key = button.getAttribute('data-k11-fix') ?? '';
            const p = ALL.find((a) => a.key === key);
            if (!p) return;
            if (key === 'oldest') {
                if (readout) readout.textContent = 'Show it: the table below scrolls to dead letter 4b90.';
                return;
            }
            button.setAttribute('data-kp-flash-words', 'Requeued,Refused');
            await runFlashButton(button, async () => {
                await sleep(700);
                return 'Requeued';
            });
            await sleep(700);
            state.gone.add(key);
            if (readout) readout.textContent = `${p.what}: requeued. The other problems closed up.`;
            if (state.region === 'ready') draw();
        });
        onChoice('problems-mode', (v) => live.setAttribute('data-kp-problems-mode', v));
        onChoice('problems-fold-from', (v) => live.setAttribute('data-kp-problems-fold-from', v));
    }
})();

// ---------------------------------------------------------------- 2 · the dead-letter table

/** Undo-toast bed of a section. @param {string} name */
const bed = (name) => $(`[data-k11-bed="${name}"]`);

void (async () => {
    const root = $('#k11-dead');
    const body = $('[data-k11-dead-body]');
    if (root && body) {
        const tbody = body;
        const mode = { open: 'inline' };
        /** @param {Dead} d */
        function deadRow(d) {
            const row = make('tr');
            row.setAttribute('data-kp-row-key', `dead-${d.id}`);
            row.setAttribute('data-kp-anchor', `dead-${d.id}`);
            row.setAttribute('data-kp-row-label', `Dead letter ${d.id}`);
            row.innerHTML =
                `<td data-label="Died" data-kp-sort-value="${isoOf(d.when)}"><div class="k11-when"><time class="kp-ago" data-kp-ago data-kp-ago-verb="" datetime="${isoOf(d.when)}">2 days ago</time><small></small></div></td>` +
                `<td data-label="Subscription" data-kp-filter-value="${d.sub}"><b></b></td>` +
                `<td data-label="Tries" class="kp-text-end"></td>` +
                `<td data-label="Why it died"></td>` +
                `<td data-label="Payload"></td>` +
                `<td data-label="Actions"><div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm" data-kp-action="requeue" data-k11-row="requeue">Requeue</button><button type="button" class="kp-button kp-button--sm kp-button--destructive" data-kp-action="delete" data-k11-row="delete">Delete</button></div></td>`;
            /** @type {HTMLElement} */ (row.querySelector('small')).textContent = d.when;
            /** @type {HTMLElement} */ (row.querySelector('b')).textContent = d.sub;
            /** @type {HTMLElement} */ (row.children[2]).textContent = String(d.tries);
            /** @type {HTMLElement} */ (row.children[3]).textContent = d.why;
            /** @type {HTMLElement} */ (row.children[4]).append(cellFigure(d.text, { ...(d.attrs ?? {}), 'data-kp-code-open': mode.open }));
            return row;
        }
        const fill = () => {
            tbody.replaceChildren(...DEAD.map(deadRow));
        };
        fill();

        await ready;
        const dt = dataTable(root);
        const refresh = () => dt?.refresh();
        /** @type {HTMLElement | null} */
        const wrap = root.closest('[data-kp-anchors]');
        let stateNow = 'ready';

        // Rows: requeue (the row leaves) and delete (the row leaves, with Undo).
        tbody.addEventListener('click', async (event) => {
            const button = event.target instanceof Element ? event.target.closest('[data-k11-row]') : null;
            const row = button?.closest('tr');
            if (!(button instanceof HTMLElement) || !row) return;
            if (button.getAttribute('data-k11-row') === 'requeue') {
                button.setAttribute('data-kp-flash-words', 'Requeued,Refused');
                await runFlashButton(button, async () => {
                    await sleep(600);
                    return 'Requeued';
                });
                await sleep(500);
                row.remove();
                refresh();
                return;
            }
            const next = row.nextElementSibling;
            row.remove();
            refresh();
            undoToast(`Dead letter ${row.getAttribute('data-kp-row-key')?.replace('dead-', '')} deleted`, {
                region: bed('dead'),
                ms: 6000,
                max: 3,
                commit: () => Promise.resolve(),
                undo: () => {
                    tbody.insertBefore(row, next && next.isConnected ? next : null);
                    refresh();
                },
            });
        });

        // Table states.
        const toState = (/** @type {string} */ value) => {
            if (!dt) return;
            if ((value === 'ready' || value === 'loading' || value === 'failed') && tbody.children.length === 0 && stateNow === 'empty') fill();
            if (value === 'ready' && tbody.children.length < DEAD.length && stateNow !== 'ready' && stateNow !== 'loading') fill();
            stateNow = value;
            if (value === 'empty') {
                tbody.replaceChildren();
                dt.state('ready');
                refresh();
            } else if (value === 'loading') dt.state('loading');
            else if (value === 'failed') dt.fail('kyu did not answer within 10 s. Nothing was changed.');
            else {
                dt.state('ready');
                refresh();
            }
        };
        stateButtons('data-k11-dead-state', toState);
        root.addEventListener('kp-datatable-retry', () => {
            const ready = $('[data-k11-dead-state="ready"]');
            if (ready) pick(ready);
            toState('ready');
        });

        // The first payload on its own.
        stateButtons('data-k11-dead-first', (value) => {
            const td = tbody.querySelector('tr td:nth-child(5)');
            if (!td) return;
            const first = DEAD[0];
            const fig = cellFigure(first.text, { 'data-kp-code-open': mode.open, ...(value === 'loading' ? { 'data-kp-code-state': 'loading' } : {}) });
            td.replaceChildren(fig);
            attachCodes(td);
            if (value === 'error') setCode(fig, { cell: true, state: 'error', message: 'Could not read this payload.' });
        });

        // Links to a dead letter: one that is here, one that was requeued.
        for (const button of $$('[data-k11-dead-link]')) {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-k11-dead-link') === 'here' ? '#dead-4f2a' : '#dead-4b00';
                if (location.hash === target) location.hash = '';
                location.hash = target;
            });
        }

        // Choices.
        onChoice('dead-code-open', (v) => {
            mode.open = v;
            for (const row of $$('tr', tbody)) {
                const id = row.getAttribute('data-kp-row-key')?.replace('dead-', '');
                const d = DEAD.find((x) => x.id === id);
                const td = row.children[4];
                if (!d || !td) continue;
                if (!d.attrs?.['data-kp-truncated'] && d.text.length < 200) continue;
                td.replaceChildren(cellFigure(d.text, { ...(d.attrs ?? {}), 'data-kp-code-open': v }));
                attachCodes(td);
            }
        });
        onChoice('dead-anchor-show', (v) => wrap?.setAttribute('data-kp-anchor-show', v));
        onChoice('dead-anchor-copy', (v) => wrap?.setAttribute('data-kp-anchor-copy', v));
    }
})();

// ---------------------------------------------------------------- 3 · bulk requeue and delete [server]

void (async () => {
    const root = $('#k11-bulk');
    const body = $('[data-k11-bulk-body]');
    const cards = $('[data-k11-bulk-cards]');
    const bar = $('#k11-bulk-bar');
    const phoneBar = $('#k11-bulk-bar-phone');
    if (root && body && cards && bar && phoneBar) {
        const tbody = body;
        const state = { outcome: 'ok', table: 'ready' };
        /** @param {Dead} d */
        const bulkRow = (d) => {
            const row = make('tr');
            row.setAttribute('data-kp-row-key', `dead-${d.id}`);
            row.setAttribute('data-kp-row-label', d.id);
            row.innerHTML =
                `<td data-label="Select"><input class="kp-field__check" type="checkbox" data-kp-select-row aria-label="Select dead letter ${d.id}" /></td>` +
                `<td data-label="Dead letter"><b></b></td><td data-label="Subscription"></td><td data-label="Why it died"></td>`;
            /** @type {HTMLElement} */ (row.querySelector('b')).textContent = d.id;
            /** @type {HTMLElement} */ (row.children[2]).textContent = d.sub;
            /** @type {HTMLElement} */ (row.children[3]).textContent = d.why;
            return row;
        };
        /** @param {Dead} d */
        const bulkCard = (d) => {
            const li = make('li');
            li.setAttribute('data-kp-row-key', `dead-${d.id}`);
            li.setAttribute('data-kp-row-label', d.id);
            li.innerHTML = `<input class="kp-field__check" type="checkbox" data-kp-select-row aria-label="Select dead letter ${d.id}" /><span><b class="k11-card-id"></b><br /><span class="k11-muted"></span></span>`;
            /** @type {HTMLElement} */ (li.querySelector('b')).textContent = `${d.id} · ${d.sub}`;
            /** @type {HTMLElement} */ (li.querySelector('.k11-muted')).textContent = d.why;
            return li;
        };
        const fill = () => {
            tbody.replaceChildren(...DEAD.map(bulkRow));
            cards.replaceChildren(...DEAD.slice(0, 6).map(bulkCard));
        };
        fill();

        await ready;
        const dt = dataTable(root);
        const rules = {
            requeue: (/** @type {{ key: string }[]} */ items) => {
                const archived = items.filter((i) => SUB_OF.get(i.key) === 'archive').length;
                return archived ? `${archived} of ${items.length} are on archive, which is archived: unarchive it first` : null;
            },
        };
        for (const b of [bar, phoneBar]) setSelectionRules(b, rules);

        /** @param {HTMLElement} target */
        const act = (target) =>
            target.addEventListener('kp-selection-action', (event) => {
                const detail = /** @type {CustomEvent} */ (event).detail;
                /** @type {string[]} */
                const keys = detail.keys;
                const phone = target === phoneBar;
                const rowsOf = () => (phone ? $$('li', cards) : $$('tr', tbody)).filter((r) => keys.includes(r.getAttribute('data-kp-row-key') ?? ''));
                if (detail.action === 'delete') {
                    const rows = rowsOf();
                    const places = rows.map((r) => r.nextElementSibling);
                    for (const r of rows) {
                        const box = /** @type {HTMLInputElement | null} */ (r.querySelector('[data-kp-select-row]'));
                        if (box) {
                            box.checked = false;
                            box.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                    for (const r of rows) r.remove();
                    if (!phone) dt?.refresh();
                    undoToast(`${keys.length} dead letter${keys.length === 1 ? '' : 's'} deleted`, {
                        region: bed('bulk'),
                        ms: detail.undoMs ?? 6000,
                        max: 3,
                        commit: () => Promise.resolve(),
                        undo: () => {
                            rows.forEach((r, i) => (phone ? cards : tbody).insertBefore(r, places[i] && places[i]?.isConnected ? places[i] : null));
                            if (!phone) dt?.refresh();
                        },
                    });
                    return;
                }
                setSelectionBusy(target, `Requeueing ${keys.length}…`);
                setTimeout(() => {
                    const refused = state.outcome === 'refuse' && keys.length > 0 ? [{ key: keys[0], reason: 'desktop is still down' }] : [];
                    setSelectionBusy(target, '');
                    setSelectionResult(target, { done: keys.length - refused.length, refused });
                }, 1100);
            });
        act(bar);
        act(phoneBar);

        const bulkSay = $('[data-k11-bulk-readout]');
        stateButtons('data-k11-bulk-outcome', (v) => {
            state.outcome = v;
            if (bulkSay) bulkSay.textContent = v === 'ok' ? 'Next action: the server does it for every row.' : 'Next action: the server refuses the first row (desktop is still down).';
        });
        const toState = (/** @type {string} */ value) => {
            if (!dt) return;
            if (state.table === 'empty' && value !== 'empty') fill();
            state.table = value;
            if (value === 'empty') {
                tbody.replaceChildren();
                dt.state('ready');
                dt.refresh();
            } else if (value === 'loading') dt.state('loading');
            else if (value === 'failed') dt.fail('kyu did not answer within 10 s. Nothing was changed.');
            else {
                dt.state('ready');
                dt.refresh();
            }
        };
        stateButtons('data-k11-bulk-state', toState);
        root.addEventListener('kp-datatable-retry', () => {
            const ready = $('[data-k11-bulk-state="ready"]');
            if (ready) pick(ready);
            toState('ready');
        });
        for (const b of $$('[data-k11-bulk-reset]')) {
            b.addEventListener('click', () => {
                fill();
                const ready = $('[data-k11-bulk-state="ready"]');
                if (ready) pick(ready);
                state.table = 'ready';
                dt?.state('ready');
                dt?.refresh();
            });
        }

        // Choices: every option is the component's own attribute, read when it is used.
        onChoice('bulk-placement', (v) => bar.setAttribute('data-kp-placement', v));
        onChoice('bulk-names', (v) => {
            bar.setAttribute('data-kp-selection-names', v);
            phoneBar.setAttribute('data-kp-selection-names', v);
        });
        onChoice('bulk-max', (v) => {
            bar.setAttribute('data-kp-selection-max', v);
            phoneBar.setAttribute('data-kp-selection-max', v);
        });
        onChoice('bulk-range', (v) => root.setAttribute('data-kp-select-range', v));
        onChoice('bulk-arrows', (v) => {
            root.setAttribute('data-kp-select-arrows', v);
            cards.setAttribute('data-kp-select-arrows', v);
        });
        onChoice('bulk-allkey', (v) => {
            root.setAttribute('data-kp-select-all-key', v);
            cards.setAttribute('data-kp-select-all-key', v);
        });
    }
})();

// ---------------------------------------------------------------- 4 · recent messages (master-detail)

/**
 * @typedef {{ n: number, sub: string, when: string, size: string, text: string, binary?: boolean }} Message
 * @type {Message[]}
 */
const MESSAGES = [
    { n: 12408, sub: 'desktop', when: '17/10/2026 20:14', size: '1.2 kB', text: LONG_REPORT },
    { n: 12407, sub: 'phone', when: '17/10/2026 20:12', size: '58 B', text: '{"title":"eerste echte bericht","body":"hello from HA"}' },
    { n: 12406, sub: 'almanac', when: '17/10/2026 20:09', size: '96 B', text: '{"event":"Dentist","start":"2026-10-21T14:30:00+02:00","calendar":"kenny"}' },
    { n: 12405, sub: 'desktop', when: '17/10/2026 20:03', size: '2.1 kB', text: '', binary: true },
    { n: 12404, sub: 'kyu-runner', when: '17/10/2026 19:58', size: '71 B', text: '{"job":"backup.nightly","stacks":12,"gb":3.2}' },
    { n: 12403, sub: 'phone', when: '17/10/2026 19:50', size: '49 B', text: '{"title":"Queue drained","queue":"mail"}' },
    { n: 12402, sub: 'desktop', when: '17/10/2026 19:44', size: '9 B', text: 'backup ok' },
    { n: 12401, sub: 'archive', when: '17/10/2026 19:40', size: '67 B', text: '{"title":"Certificate renewed","host":"traefik"}' },
    { n: 12400, sub: 'kyu-runner', when: '17/10/2026 19:31', size: '54 B', text: '{"job":"health.check","ok":true}' },
    { n: 12399, sub: 'almanac', when: '17/10/2026 19:12', size: '80 B', text: '{"event":"Car service","start":"2026-10-28T09:00:00+01:00"}' },
    { n: 12398, sub: 'phone', when: '17/10/2026 18:55', size: '63 B', text: '{"title":"Disk 71 percent full","body":"ct-106"}' },
    { n: 12397, sub: 'desktop', when: '17/10/2026 18:30', size: '0 B', text: '' },
];

/** The viewer, shared by the master-detail's "Open large" and the viewer section. */
const viewerState = { payload: 'long', state: 'ready', size: 'wide', plan: 'Next open: the 38-line payload, ready.', opener: /** @type {HTMLElement | null} */ (null) };
/** @type {import('../../js/viewer.js').ViewerHandle | null} */
let openedViewer = null;

/** @param {{ n: number, text: string, size: string, binary?: boolean, when?: string }} m */
function openPayload(m, opener = viewerState.opener) {
    openedViewer?.close();
    const binary = Boolean(m.binary);
    const name = `message-${m.n}.${binary ? 'bin' : 'json'}`;
    const blob = new Blob([binary ? new Uint8Array(16) : m.text], { type: binary ? 'application/octet-stream' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const viewer = openViewer({
        title: `Message #${count(m.n)}`,
        desc: binary ? 'A binary payload: kyu cannot show it as text.' : 'Shown as JSON, laid out. Raw is one press away.',
        facts: `${binary ? 'Binary' : 'JSON'} · ${m.size} · ${m.when ?? '17/10/2026 20:14'}`,
        size: /** @type {'wide' | 'full'} */ (viewerState.size),
        opener,
        actions: [
            {
                kind: 'copy',
                label: 'Copy payload',
                run: () => {
                    const button = viewer.foot.querySelector('[data-kp-viewer-action="copy"]');
                    if (!(button instanceof HTMLElement)) return;
                    button.setAttribute('data-kp-flash-words', 'Copied,Refused');
                    void runFlashButton(button, async () => {
                        try {
                            await navigator.clipboard.writeText(m.text);
                            return 'Copied';
                        } catch {
                            return { error: 'Your browser blocked copying.', remedy: 'Select the text and press Ctrl+C.' };
                        }
                    });
                },
            },
            { kind: 'download', href: url, name },
        ],
        onClose: () => {
            URL.revokeObjectURL(url);
            if (openedViewer === viewer) openedViewer = null;
            const out = $('[data-k11-viewer-readout]');
            if (out) out.textContent = `Closed. ${viewerState.plan}`;
        },
    });
    openedViewer = viewer;
    const out = $('[data-k11-viewer-readout]');
    if (out) out.textContent = `Open: message #${count(m.n)}, ${viewerState.state}.`;
    if (binary || viewerState.state === 'unsupported') {
        viewer.setState('unsupported', { message: `This payload is binary (${m.size}); it cannot be shown as text. You can still download it.` });
        return viewer;
    }
    const fig = make('figure', 'kp-code');
    fig.setAttribute('data-kp-code', '');
    viewer.setContent(fig);
    setCode(fig, { text: m.text, title: 'Payload', language: 'JSON', lines: true, maxLines: 0, state: m.text === '' ? 'empty' : 'ready' });
    if (viewerState.state === 'loading') viewer.setState('loading');
    else if (viewerState.state === 'error')
        viewer.setState('error', {
            message: 'kyu did not answer. The payload was not read.',
            retry: () => {
                viewer.setState('loading');
                setTimeout(() => viewer.setState('ready'), 900);
            },
        });
    return viewer;
}

void (async () => {
    const roots = $$('[data-k11-md]');
    if (roots.length) {
        /** @param {Message} m */
        const listItem = (m, at) => {
            const li = make('li');
            li.setAttribute('role', 'option');
            li.setAttribute('data-kp-pane-key', String(at));
            const wrap = make('span', 'k11-msg');
            wrap.append(make('b', '', `#${count(m.n)}`), make('small', '', `${m.sub} · ${m.when.slice(11)}`));
            wrap.append(make('code', '', m.binary ? 'binary, 2.1 kB' : m.text === '' ? 'empty payload' : m.text));
            li.append(wrap);
            return li;
        };
        for (const root of roots) $('[data-k11-md-items]', root)?.append(...MESSAGES.map(listItem));

        /** @param {HTMLElement} root @param {number} at */
        const fill = (root, at) => {
            const m = MESSAGES[at] ?? MESSAGES[0];
            const heading = $('[data-kp-pane-heading]', root);
            if (heading) heading.textContent = `Message #${count(m.n)}`;
            const body = $('[data-k11-md-body]', root);
            if (!body) return;
            body.replaceChildren();
            const facts = make('dl', 'k11-facts');
            for (const [k, v] of [
                ['Published', m.when],
                ['Subscription', m.sub],
                ['Size', m.size],
                ['Deliveries', '1 of 1 acknowledged'],
            ]) {
                facts.append(make('dt', '', k), make('dd', '', v));
            }
            const fig = make('figure', 'kp-code');
            fig.setAttribute('data-kp-code', '');
            const actions = make('div', 'k11-detail-actions');
            const open = make('button', 'kp-button', 'Open large');
            open.type = 'button';
            open.addEventListener('click', () => openPayload(m, open));
            actions.append(open);
            body.append(facts, fig, actions);
            setCode(fig, {
                text: m.text,
                title: 'Payload',
                language: 'JSON',
                lines: true,
                maxLines: 12,
                size: m.size,
                state: m.binary ? 'binary' : m.text === '' ? 'empty' : 'ready',
            });
        };

        await ready;
        /** @param {HTMLElement} root @param {string} name */
        const select = (root, name) => {
            const md = masterDetail(root);
            if (!md) return;
            if (name === 'ready') {
                if (md.key() === null) md.select('0');
                fill(root, Number(md.key() ?? 0));
                setPaneState(root, 'ready');
            } else if (name === 'empty') {
                md.select(null);
                md.close();
                setPaneState(root, 'empty', { title: 'Pick a message on the left', text: 'Its payload shows here.' });
            } else if (name === 'loading') {
                if (md.key() === null) md.select('0');
                setPaneState(root, 'loading', { words: 'Reading the message…' });
            } else {
                if (md.key() === null) md.select('0');
                setPaneState(root, 'error', { title: 'Could not read the message', text: 'kyu did not answer. Nothing was changed.' });
            }
        };
        for (const root of roots) {
            const md = masterDetail(root);
            if (md) {
                md.select('0');
                fill(root, 0);
                setPaneState(root, 'ready');
            }
            const load = (/** @type {Event} */ event) => {
                const key = /** @type {CustomEvent} */ (event).detail?.key;
                if (key === null || key === undefined) return;
                fill(root, Number(key));
                setPaneState(root, 'ready');
            };
            root.addEventListener('kp-pane-select', load);
            root.addEventListener('kp-pane-open', load);
            root.addEventListener('kp-pane-retry', () => select(root, 'ready'));
        }
        stateButtons('data-k11-md-detail', (value) => {
            for (const root of roots) select(root, value);
        });

        // The list in its states, over the list pane.
        /** @type {Map<HTMLElement, import('../../js/busy-card.js').BusyCard | null>} */
        const cards = new Map();
        stateButtons('data-k11-md-list', (value) => {
            for (const root of roots) {
                const pane = $('[data-kp-pane="list"]', root);
                const ul = $('[data-k11-md-items]', root);
                if (!pane || !ul) continue;
                pane.style.position = 'relative';
                cards.get(root)?.remove();
                cards.delete(root);
                for (const old of $$('[data-k11-listplate]', pane)) old.remove();
                ul.style.visibility = value === 'ready' ? '' : 'hidden';
                if (value === 'loading') cards.set(root, openBusyCard(pane, { words: 'Reading the messages…', area: () => [pane], arrive: false }));
                else if (value !== 'ready') {
                    const holder = make('div');
                    holder.setAttribute('data-k11-listplate', '');
                    const plate =
                        value === 'empty'
                            ? statePlate(document, { kind: 'empty', title: 'No messages yet', text: 'Messages published to notify.kenny show here.' })
                            : statePlate(document, {
                                  kind: 'error',
                                  title: 'Could not read the messages',
                                  text: 'kyu did not answer.',
                                  actionLabel: 'Try again',
                                  onAction: () => {
                                      const ready = $('[data-k11-md-list="ready"]');
                                      ready?.click();
                                  },
                              });
                    if (value === 'empty') {
                        plate.setAttribute('data-kp-art', 'none');
                        attachArt(plate);
                    }
                    holder.append(plate);
                    pane.append(holder);
                }
            }
        });
        onChoice('recent-narrow', (v) => {
            for (const root of roots) root.setAttribute('data-kp-narrow', v);
        });
    }
})();

// ---------------------------------------------------------------- 5 · the live list (pill and refresh)

void (async () => {
    const list = $('#k11-live-list');
    const host = $('#k11-live-comp .k11-stage');
    const refresh = $('#k11-live-refresh');
    const total = $('#k11-live-count');
    const readout = $('[data-k11-live-readout]');
    if (list && host && refresh && total) {
        const view = stage(host);
        const state = { n: 12408, bring: 0, fail: false };
        /** @param {number} number @param {number} ageSeconds */
        const row = (number, ageSeconds) => {
            const li = make('li');
            const wrap = make('span', 'k11-msg');
            const ago = make('time', 'kp-ago');
            ago.setAttribute('data-kp-ago', '');
            ago.setAttribute('data-kp-ago-verb', '');
            ago.setAttribute('datetime', new Date(Date.now() - ageSeconds * 1000).toISOString());
            ago.textContent = 'just now';
            const small = make('small');
            small.append(ago);
            const subs = ['desktop', 'phone', 'almanac', 'kyu-runner'];
            wrap.append(make('b', '', `#${count(number)}`), small);
            wrap.append(make('code', '', `{"title":"${['Backup finished', 'Queue drained', 'Disk 71 percent full', 'Certificate renewed'][number % 4]}","to":"${subs[number % 4]}"}`));
            li.append(wrap);
            return li;
        };
        for (let i = 0; i < 16; i += 1) list.append(row(state.n - i, 40 + i * 190));
        const say = () => {
            total.textContent = `Messages on notify.kenny: ${count(state.n)}`;
        };

        await ready;
        const handle = refreshOf(refresh);
        refresh.addEventListener('kp-refresh', (event) => {
            const detail = /** @type {CustomEvent} */ (event).detail;
            setTimeout(() => {
                if (state.fail) {
                    detail.done(false);
                    return;
                }
                const frag = document.createDocumentFragment();
                for (let i = 0; i < state.bring; i += 1) {
                    state.n += 1;
                    const li = row(state.n, 2);
                    li.setAttribute('data-new', '');
                    frag.prepend(li);
                    setTimeout(() => li.removeAttribute('data-new'), 2500);
                }
                list.prepend(frag);
                say();
                detail.done(true);
            }, 700);
        });
        list.addEventListener('kp-follow-change', (event) => {
            const d = /** @type {CustomEvent<{ following: boolean, paused: boolean, unseen: number }>} */ (event).detail;
            if (readout)
                readout.textContent = d.following
                    ? 'Following the newest message.'
                    : `Not following: ${count(d.unseen)} new message${d.unseen === 1 ? '' : 's'} out of sight.`;
        });
        stateButtons('data-k11-live-bring', (v) => (state.bring = Number(v)));
        stateButtons('data-k11-live-server', (v) => (state.fail = v === 'fail'));
        stateButtons('data-k11-live-list', (value) => {
            if (value === 'ready') view.ready();
            else if (value === 'loading') view.loading('Reading the messages…');
            else if (value === 'empty') view.plate(statePlate(document, { kind: 'empty', title: 'No messages yet', text: 'Messages published to notify.kenny show here.' }), 'none');
            else
                view.plate(
                    statePlate(document, {
                        kind: 'error',
                        title: 'Could not read the messages',
                        text: 'kyu did not answer.',
                        actionLabel: 'Try again',
                        onAction: () => $('[data-k11-live-list="ready"]')?.click(),
                    }),
                );
        });
        onChoice('live-since', (v) => list.setAttribute('data-kp-since-left', v));
        onChoice('live-interval', (v) => {
            if (handle) setRefreshInterval(refresh, Number(v));
        });
    }
})();

// ---------------------------------------------------------------- 6 · the viewer

void (async () => {
    const open = $('[data-k11-viewer-open]');
    if (open) {
        viewerState.opener = open;
        const PAYLOADS = {
            short: { n: 12407, text: '{"title":"eerste echte bericht","body":"hello from HA"}', size: '58 B' },
            long: { n: 12408, text: JSON.stringify(JSON.parse(LONG_REPORT), null, 2), size: '1.2 kB' },
            binary: { n: 12405, text: '', size: '2.1 kB', binary: true },
        };
        const now = () => openPayload(PAYLOADS[/** @type {'short'} */ (viewerState.payload)]);
        const words = { short: 'the short payload', long: 'the 38-line payload', binary: 'the binary payload' };
        const stateWords = { ready: 'ready', loading: 'loading', error: 'failed' };
        const plan = () => {
            viewerState.plan = `Next open: ${words[/** @type {'short'} */ (viewerState.payload)]}, ${stateWords[/** @type {'ready'} */ (viewerState.state)]}.`;
            const out = $('[data-k11-viewer-readout]');
            if (out && !openedViewer) out.textContent = viewerState.plan;
        };
        plan();
        open.addEventListener('click', now);
        stateButtons('data-k11-viewer-payload', (v) => {
            viewerState.payload = v;
            plan();
        });
        stateButtons('data-k11-viewer-state', (v) => {
            viewerState.state = v;
            plan();
        });
        onChoice('viewer-size', (v) => (viewerState.size = v));
    }
})();

// ---------------------------------------------------------------- 7 · replay [server]

void (async () => {
    const button = $('#k11-replay-button');
    const fig = $('#k11-replay-code');
    const facts = $('[data-k11-replay-facts]');
    if (button && fig && facts) {
        const state = { outcome: 'ok', message: 'json' };
        const paint = () => {
            const binary = state.message === 'binary';
            facts.replaceChildren();
            for (const [k, v] of [
                ['Message', binary ? '#12,405' : '#12,407'],
                ['Topic', 'notify.kenny'],
                ['Subscription', binary ? 'desktop' : 'phone'],
                ['Published', binary ? '17/10/2026 20:03' : '17/10/2026 20:12'],
                ['Size', binary ? '2.1 kB' : '58 B'],
            ])
                facts.append(make('dt', '', k), make('dd', '', v));
            setCode(fig, {
                text: binary ? '' : '{"title":"eerste echte bericht","body":"hello from HA"}',
                title: 'Payload',
                language: 'JSON',
                maxLines: 8,
                size: binary ? '2.1 kB' : undefined,
                state: binary ? 'binary' : 'ready',
            });
        };
        paint();
        await ready;
        paint();
        const replaySay = $('[data-k11-replay-readout]');
        stateButtons('data-k11-replay-outcome', (v) => {
            state.outcome = v;
            if (replaySay) replaySay.textContent = { ok: 'Next replay: kyu accepts it.', refuse: 'Next replay: kyu refuses it (the topic is archived).', down: 'Next replay: kyu does not answer.' }[/** @type {'ok'} */ (v)];
        });
        stateButtons('data-k11-replay-message', (v) => {
            state.message = v;
            paint();
        });
        button.addEventListener('click', () =>
            runFlashButton(button, async () => {
                await sleep(900);
                if (state.outcome === 'down') throw new Error('kyu did not answer. Nothing was published.');
                if (state.outcome === 'refuse') return { error: 'notify.kenny is archived.', remedy: 'Unarchive the topic, then replay again.' };
                return { word: 'Replayed', line: 'Published again as #12,409. Every active subscription will receive it.' };
            }),
        );
        onChoice('replay-refusal', (v) => button.setAttribute('data-kp-refusal', v));
        onChoice('replay-width', (v) => button.setAttribute('data-kp-width', v));
    }
})();

// ---------------------------------------------------------------- 8 · publish a test message

void (async () => {
    const form = /** @type {HTMLFormElement | null} */ ($('#k11-publish-form'));
    const area = /** @type {HTMLTextAreaElement | null} */ ($('#k11-publish-body'));
    const send = $('#k11-publish-send');
    if (form && area && send) {
        const SAMPLES = {
            valid: '{\n  "title": "Test",\n  "body": "hello from the publish box"\n}',
            broken: '{\n  "title": "Test"\n  "body": "a comma is missing above"\n}',
            long: JSON.stringify(
                Array.from({ length: 9 }, (_, i) => ({ id: 3001 + i, name: ['media', 'vault', 'backup', 'monitoring', 'dns', 'mail', 'wiki', 'ci', 'photos'][i], running: i % 3 !== 0 })),
                null,
                2,
            ),
            empty: '',
        };
        const state = { outcome: 'ok' };
        form.addEventListener('submit', (event) => event.preventDefault());
        await ready;
        const set = (/** @type {string} */ text) => {
            area.value = text;
            area.dispatchEvent(new Event('input', { bubbles: true }));
            area.dispatchEvent(new Event('blur'));
        };
        stateButtons('data-k11-publish-sample', (v) => set(SAMPLES[/** @type {'valid'} */ (v)] ?? ''));
        const publishSay = $('[data-k11-publish-readout]');
        stateButtons('data-k11-publish-outcome', (v) => {
            state.outcome = v;
            if (publishSay) publishSay.textContent = { ok: 'Next publish: kyu accepts it.', refuse: 'Next publish: kyu refuses it (the topic is archived).', down: 'Next publish: kyu does not answer.' }[/** @type {'ok'} */ (v)];
        });
        form.addEventListener('kp-form-valid', () => {
            void runFlashButton(send, async () => {
                await sleep(900);
                if (state.outcome === 'down') throw new Error('kyu did not answer. Nothing was published.');
                if (state.outcome === 'refuse') return { error: 'notify.kenny is archived.', remedy: 'Unarchive the topic, then publish again.' };
                return { word: 'Published', line: 'Published as #12,409.' };
            });
        });
        onChoice('publish-json', (v) => area.setAttribute('data-kp-json', v));
        onChoice('publish-format', (v) => area.setAttribute('data-kp-json-format', v));
        onChoice('publish-check', (v) => area.setAttribute('data-kp-json-check', v));
        onChoice('publish-indent', (v) => area.setAttribute('data-kp-json-indent', v));
        onChoice('publish-gutter', (v) => area.setAttribute('data-kp-json-gutter', v === 'false' ? 'false' : 'true'));
        onChoice('publish-counter', (v) => {
            area.setAttribute('data-kp-counter', v);
            area.dispatchEvent(new Event('input', { bubbles: true }));
        });
    }
})();
