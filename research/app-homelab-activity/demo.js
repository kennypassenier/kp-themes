// research/app-homelab-activity: the page's own wiring. The components are the package's (js/auto.js attaches the ones the
// markup carries); this file feeds them the sample fleet, presses their states and keeps the filter tags in step with
// what a range, a day or a stack means for the History table.
import { FLEET, NOW, fillTable, tookText, secondsOf, dayTitle } from './table.js';
import { STACKS, HOUR, MIN, dayKeyOf, midnight, stepsOf, jobs as makeJobs, took, when, dayText } from './data.js';
import { attachGantts, setGanttRuns, setGanttPoints, setGanttKinds, setGanttZones, setGanttLegend, setGanttState, setGanttSelection } from '../../js/gantt.js';
import { setHeat, setHeatPick, setHeatRows } from '../../js/heat.js';
import { setToolbarActive } from '../../js/toolbar.js';
import { tickTo } from '../../js/tick.js';
import { dataTable } from '../../js/datatable.js';
import { buildSteplist, setStep, attachSteplists } from '../../js/steplist.js';
import { setCode } from '../../js/code.js';
import { setStackbar } from '../../js/stackbar.js';
import { setProblems } from '../../js/problems.js';
import { attachTimerDiscs, timerDiscOf } from '../../js/timer-disc.js';
import { statePlate } from '../../js/state-plate.js';
import { openBusyCard } from '../../js/busy-card.js';

const DAY = 24 * HOUR;

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

const $ = (/** @type {string} */ id) => /** @type {HTMLElement} */ (document.getElementById(id));

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
/** @param {string} attribute @param {string} value */
const press = (attribute, value) => {
    for (const b of document.querySelectorAll(`[${attribute}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attribute) === value));
};
/** Change a number and let it tick. @param {string} id @param {number} n */
const tickText = (id, n) => tickTo($(id), n.toLocaleString('en-GB'));
/** The word for a count. @param {number} n @param {string} one @param {string} many */
const plural = (n, one, many) => `${n.toLocaleString('en-GB')} ${n === 1 ? one : many}`;

/**
 * Cover a data area with the theme's own empty or failed plate (or take it away with kind null).
 * @param {HTMLElement} host a `.hx-cover` @param {'empty' | 'error' | null} kind @param {string} [title] @param {string} [text] @param {() => void} [retry]
 */
function cover(host, kind, title = '', text = '', retry) {
    host.querySelector(':scope > .hx-plate')?.remove();
    if (!kind) return;
    const layer = document.createElement('div');
    layer.className = 'hx-plate';
    layer.append(statePlate(document, { kind, title, text, ...(retry ? { actionLabel: 'Retry', onAction: retry } : {}) }));
    host.append(layer);
}

await ready;

const OPS = FLEET.ops;
const FROM14 = FLEET.today - 13 * DAY;

// ── 1. the timeline ────────────────────────────────────────────────────────────────────────────────────────────
if (document.getElementById('timeline-component')) {
    const el = $('hx-tl');
    const bar = $('hx-tl-bar');
    const lanes = [
        { id: 'ops', label: 'By hand', sub: 'what you pressed' },
        { id: 'nightly', label: 'Scheduled', sub: 'backups, updates' },
    ];
    const ops14 = OPS.filter((o) => o.start >= FROM14);
    const byKey = new Map(OPS.map((o) => [o.key, o]));

    /** The nightly lane draws one bar per round, not one per stack. */
    const rounds = new Map();
    for (const o of ops14) {
        if (o.lane !== 'nightly') continue;
        const id = `round-${dayKeyOf(o.start)}-${o.action === 'Nightly backup' ? 'backup' : 'update'}`;
        rounds.set(id, [...(rounds.get(id) ?? []), o]);
    }
    const runs = [
        ...ops14
            .filter((o) => o.lane === 'ops')
            .map((o) => ({
                id: o.key,
                lane: 'ops',
                label: `${o.action} · ${o.stack}`,
                start: o.start,
                ...(o.end ? { end: o.end } : {}),
                state: /** @type {'ok' | 'failed' | 'running'} */ (o.state === 'done' ? 'ok' : o.state),
                detail: `${o.key}, by ${o.by}${o.error ? `. ${o.error}` : ''}`,
                series: /** @type {const} */ (3),
            })),
        ...[...rounds].map(([id, list]) => {
            const failed = list.filter((o) => o.state === 'failed');
            const first = list[list.length - 1];
            const last = list[0];
            const backup = list[0].action === 'Nightly backup';
            return {
                id,
                lane: 'nightly',
                label: backup ? 'Nightly backup round' : 'Scheduled image updates',
                start: first.start,
                end: last.end ?? NOW,
                state: /** @type {'ok' | 'failed'} */ (failed.length ? 'failed' : 'ok'),
                detail: `${plural(list.length, 'stack', 'stacks')}${failed.length ? `, ${failed.length} failed: ${failed.map((o) => o.stack).join(', ')}` : ', all fine'}`,
                series: /** @type {1 | 2} */ (backup ? 1 : 2),
            };
        }),
    ];
    const points = ops14
        .filter((o) => o.state === 'failed')
        .map((o) => ({ id: o.key, lane: o.lane, at: o.end ?? o.start, kind: 'failed', label: `${o.stack}: ${o.action} failed`, detail: o.error }));
    const paint = () => {
        setGanttRuns(el, runs, lanes);
        setGanttPoints(el, points, lanes);
        setGanttKinds(el, [{ kind: 'failed', label: 'A stack failed', shape: 'diamond', tone: 'destructive' }]);
        setGanttLegend(el, [
            { series: 1, label: 'Nightly backup round' },
            { series: 2, label: 'Scheduled image updates' },
            { series: 3, label: 'Operator action' },
        ]);
    };
    paint();

    /** @type {{ from: number, to: number } | null} */
    let range = null;
    const inView = () => ops14.filter((o) => !range || (o.start >= range.from && o.start <= range.to));
    const facts = (animate) => {
        const list = inView();
        const failed = list.filter((o) => o.state === 'failed').length;
        if (animate) {
            tickText('hx-tl-n', list.length);
            tickText('hx-tl-failed', failed);
        } else {
            $('hx-tl-n').textContent = list.length.toLocaleString('en-GB');
            $('hx-tl-failed').textContent = failed.toLocaleString('en-GB');
        }
        $('hx-tl-state').textContent = range
            ? `${plural(list.length, 'operation', 'operations')} from ${when(range.from)} to ${when(range.to)}`
            : `${plural(list.length, 'operation', 'operations')} in the last 14 days`;
    };
    facts(false);
    /** @param {{ from: number, to: number } | null} next */
    const apply = (next) => {
        range = next;
        setToolbarActive(bar, next ? [{ id: 'range', label: `From the timeline: ${when(next.from)} to ${when(next.to)}` }] : []);
        facts(true);
    };
    el.addEventListener('kp-gantt-select', (event) => {
        const { from, to } = /** @type {CustomEvent} */ (event).detail;
        apply(from != null && to != null ? { from, to } : null);
    });
    const lift = () => {
        setGanttSelection(el, null);
        apply(null);
    };
    bar.addEventListener('kp-toolbar-remove', lift);
    bar.addEventListener('kp-toolbar-clear', lift);

    /** @param {string} id */
    const open = (id) => {
        const o = byKey.get(id);
        const text = $('hx-tl-opened');
        if (o) text.textContent = `${o.action} on ${o.stack}, ${when(o.start)}, ${o.state === 'done' ? 'done' : o.state}, ${tookText(o)}. On the dashboard this opens its row in the History.`;
        else {
            const list = rounds.get(id);
            text.textContent = list
                ? `${list[0].action === 'Nightly backup' ? 'Nightly backup round' : 'Scheduled image updates'} of ${dayText(list[0].start)}: ${plural(list.length, 'stack', 'stacks')}. On the dashboard this opens the first of its rows.`
                : id;
        }
    };
    el.addEventListener('kp-gantt-open', (event) => open(/** @type {CustomEvent} */ (event).detail.id));
    $('hx-tl-select').addEventListener('click', () => {
        const next = { from: FLEET.today - 4 * HOUR, to: FLEET.today + 7 * HOUR };
        setGanttSelection(el, next);
        apply(next);
    });
    $('hx-tl-clear').addEventListener('click', lift);
    $('hx-tl-open').addEventListener('click', () => {
        const failed = ops14.find((o) => o.state === 'failed' && o.stack === 'immich');
        if (failed) open(failed.key);
    });
    $('hx-tl-card').addEventListener('click', () => {
        const bars = /** @type {HTMLElement[]} */ ([...el.querySelectorAll('.kp-gantt__run')]);
        const target = bars.find((b) => /failed/i.test(b.getAttribute('aria-label') ?? '')) ?? bars[0];
        target?.focus({ preventScroll: true });
    });
    const retryTl = () => {
        press('data-hx-tl-data', 'ready');
        setData('ready');
    };
    const setData = (/** @type {string} */ value) => {
        cover($('hx-tl-cover'), null);
        if (value === 'ready') {
            paint();
            setGanttState(el, 'ready');
        } else if (value === 'loading') setGanttState(el, 'loading');
        else {
            // Nothing to draw: the lanes and the points are emptied, so the words stand over a bare plot.
            setGanttRuns(el, [], lanes);
            setGanttPoints(el, [], lanes);
            if (value === 'empty') setGanttState(el, 'empty', 'Nothing ran in the last 14 days');
            else setGanttState(el, 'error', 'The history could not be read');
            if (value === 'empty') cover($('hx-tl-cover'), 'empty', 'Nothing has run in the last 14 days', 'Every update, apply, restart and backup is drawn here as soon as it starts.');
            else cover($('hx-tl-cover'), 'error', 'The history could not be read', 'The host answered 503 and nothing was changed.', retryTl);
        }
    };
    stateButtons('data-hx-tl-data', setData);
}

// ── 2. the grid of stacks by day ───────────────────────────────────────────────────────────────────────────────
if (document.getElementById('heat-component')) {
    const el = $('hx-heat');
    const bar = $('hx-ht-bar');
    let days = 14;
    let data = 'ready';
    /** @type {string | null} */
    let day = null;
    /** @type {Set<string>} */
    const stacks = new Set();
    /** @type {Map<string, { n: number, f: number, kinds: Set<string> }>} */
    const cellOf = new Map();
    for (const o of OPS) {
        const k = `${o.stack}|${dayKeyOf(o.start)}`;
        const c = cellOf.get(k) ?? { n: 0, f: 0, kinds: new Set() };
        c.n += 1;
        if (o.state === 'failed') {
            c.f += 1;
            c.kinds.add(o.action);
        }
        cellOf.set(k, c);
    }
    const dayKeys = (/** @type {number} */ n) => Array.from({ length: n }, (_, i) => FLEET.today - (n - 1 - i) * DAY);

    const spec = () => {
        const list = dayKeys(days);
        const every = window.innerWidth < 700 ? (days > 14 ? 7 : 3) : days > 14 ? 3 : 1;
        // The axis names every `every`-th day counting back from today, so the last label is always today.
        // A day that is not named on the axis has no label at all (hidden labels would still be text on the page).
        const columns = list.map((d, i) => {
            const minor = (list.length - 1 - i) % every !== 0;
            return { key: dayKeyOf(d + HOUR), label: minor ? '' : String(Number(dayKeyOf(d + HOUR).slice(8))), minor };
        });
        const rows = STACKS.map((s) => ({
            key: s.name,
            label: s.name,
            cells: columns.map((c) => {
                const cell = cellOf.get(`${s.name}|${c.key}`);
                const date = dayText(Date.parse(`${c.key}T12:00:00Z`));
                if (!cell) return { tone: /** @type {'none'} */ ('none'), label: 'not touched', aria: `${s.name}, ${date}: not touched` };
                const words = `${plural(cell.n, 'operation', 'operations')}${cell.f ? `, ${cell.f} failed (${[...cell.kinds].join(', ')})` : ', all fine'}`;
                return { tone: /** @type {'ok' | 'bad'} */ (cell.f ? 'bad' : 'ok'), label: words, aria: `${s.name}, ${date}: ${words}`, tip: `${s.name}, ${date}: ${words}.` };
            }),
        }));
        const summary = {
            key: 'fleet',
            label: 'Fleet',
            cells: columns.map((c) => {
                const ran = STACKS.filter((s) => cellOf.has(`${s.name}|${c.key}`));
                const bad = ran.filter((s) => (cellOf.get(`${s.name}|${c.key}`)?.f ?? 0) > 0).length;
                if (!ran.length) return { tone: /** @type {'none'} */ ('none'), label: 'nothing ran', aria: `Fleet, ${dayText(Date.parse(`${c.key}T12:00:00Z`))}: nothing ran` };
                return bad
                    ? { tone: /** @type {'bad'} */ ('bad'), share: Math.max(bad / ran.length, 0.18), label: `${bad} of ${ran.length} stacks that ran had a failure`, aria: `Fleet, ${dayText(Date.parse(`${c.key}T12:00:00Z`))}: ${bad} of ${ran.length} stacks that ran had a failure` }
                    : { tone: /** @type {'ok'} */ ('ok'), share: 1, label: `all ${ran.length} stacks that ran were fine`, aria: `Fleet, ${dayText(Date.parse(`${c.key}T12:00:00Z`))}: all ${ran.length} stacks that ran were fine` };
            }),
        };
        return { columns, rows, summary, every: 1, toggle: true, picked: day, label: `Operations per stack per day, last ${days} days` };
    };
    const matches = () => OPS.filter((o) => o.start >= FLEET.today - (days - 1) * DAY && (!day || dayKeyOf(o.start) === day) && (!stacks.size || stacks.has(o.stack)));
    const chips = () => {
        const tags = [
            ...(day ? [{ id: 'day', label: `Day: ${dayText(Date.parse(`${day}T12:00:00Z`))}` }] : []),
            ...[...stacks].map((s) => ({ id: `stack:${s}`, label: `Stack: ${s}` })),
        ];
        setToolbarActive(bar, tags);
        const n = matches().length;
        $('hx-ht-state').textContent = tags.length
            ? `${plural(n, 'operation', 'operations')} would be listed in the History`
            : `${plural(OPS.filter((o) => o.start >= FLEET.today - (days - 1) * DAY).length, 'operation', 'operations')} in the last ${days} days. Press a day or a stack name.`;
    };
    const draw = () => {
        cover($('hx-ht-cover'), null);
        if (data === 'ready') setHeat(el, spec());
        else if (data === 'loading') setHeat(el, { state: 'loading', skeleton: { rows: STACKS.length, columns: days }, label: 'Operations per stack per day, loading' });
        else if (data === 'empty') {
            setHeat(el, { state: 'empty', message: 'Nothing has run yet, so there is nothing to compare.', label: 'Operations per stack per day' });
            cover($('hx-ht-cover'), 'empty', 'Nothing has run yet', 'Once stacks have been updated or backed up, each day shows here.');
        } else {
            setHeat(el, { state: 'error', message: 'The history could not be read.', label: 'Operations per stack per day' });
            cover($('hx-ht-cover'), 'error', 'The history could not be read', 'The host answered 503 and nothing was changed.', () => {
                data = 'ready';
                press('data-hx-ht-data', 'ready');
                draw();
            });
        }
        chips();
    };
    draw();
    window.matchMedia('(max-width: 700px)').addEventListener('change', draw);
    el.addEventListener('kp-heat-pick', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        day = d.picked ? d.colKey : null;
        chips();
    });
    el.addEventListener('kp-heat-row', (event) => {
        stacks.clear();
        for (const k of /** @type {CustomEvent} */ (event).detail.keys) stacks.add(k);
        chips();
    });
    const clear = () => {
        day = null;
        stacks.clear();
        setHeatPick(el, null);
        setHeatRows(el, []);
        chips();
    };
    bar.addEventListener('kp-toolbar-remove', (event) => {
        const id = String(/** @type {CustomEvent} */ (event).detail?.id ?? '');
        if (id === 'day') {
            day = null;
            setHeatPick(el, null);
        } else if (id.startsWith('stack:')) {
            stacks.delete(id.slice(6));
            setHeatRows(el, [...stacks]);
        }
        chips();
    });
    bar.addEventListener('kp-toolbar-clear', clear);
    $('hx-ht-clear').addEventListener('click', clear);
    $('hx-ht-day').addEventListener('click', () => {
        day = dayKeyOf(FLEET.today - DAY + HOUR);
        setHeatPick(el, day);
        chips();
    });
    $('hx-ht-stack').addEventListener('click', () => {
        stacks.add('immich');
        setHeatRows(el, [...stacks]);
        chips();
    });
    stateButtons('data-hx-ht-window', (value) => {
        days = Number(value);
        day = null;
        draw();
    });
    stateButtons('data-hx-ht-data', (value) => {
        data = value;
        draw();
    });
}

// ── 3. the History ─────────────────────────────────────────────────────────────────────────────────────────────
if (document.getElementById('history-component')) {
    const table = $('hx-table');
    const bar = $('hx-hi-bar');
    const feed = $('hx-feed');
    const dt = dataTable(table);
    const wrap = /** @type {HTMLElement} */ (table.querySelector('.kp-table-wrap'));
    let narrow = 'none';
    let view = 'table';
    let data = 'ready';
    /** @type {import('../../js/busy-card.js').BusyCard | null} */
    let feedBusy = null;
    const yesterday = FLEET.today - DAY;
    const RANGE = { from: yesterday + 18 * HOUR, to: FLEET.today + 7 * HOUR };
    const DAYKEY = dayKeyOf(yesterday + HOUR);

    const current = () => {
        if (narrow === 'range') return OPS.filter((o) => o.start >= RANGE.from && o.start <= RANGE.to);
        if (narrow === 'day') return OPS.filter((o) => dayKeyOf(o.start) === DAYKEY);
        if (narrow === 'stack') return OPS.filter((o) => o.stack === 'immich');
        return OPS;
    };
    const tagFor = () =>
        narrow === 'range'
            ? [{ id: 'range', label: `From the timeline: ${when(RANGE.from)} to ${when(RANGE.to)}` }]
            : narrow === 'day'
              ? [{ id: 'day', label: `Day from the grid: ${dayText(yesterday + HOUR)}` }]
              : narrow === 'stack'
                ? [{ id: 'stack', label: 'Stack from the grid: immich' }]
                : [];

    const feedHtml = (/** @type {import('./data.js').Op[]} */ list) => {
        if (!list.length) return '';
        const shownDays = [...new Set(list.map((o) => dayKeyOf(o.start)))].slice(0, 3);
        const shown = list.filter((o) => shownDays.includes(dayKeyOf(o.start)));
        let html = '<ul class="kp-action-list kp-action-list--lead" style="--kp-action-count: 1" aria-label="Operations, newest first">';
        let day = '';
        for (const o of shown) {
            const k = dayKeyOf(o.start);
            if (k !== day) {
                day = k;
                html += `<li class="kp-action-list__group"><h4>${dayTitle(midnight(o.start))}</h4></li>`;
            }
            const tone = o.state === 'failed' ? 'destructive' : o.state === 'running' ? 'info' : 'success';
            const word = o.state === 'failed' ? 'Failed' : o.state === 'running' ? 'Running' : 'Done';
            const steps = stepsOf(o, NOW)
                .map((s) => `${s.state === 'done' ? 'done   ' : s.state === 'failed' ? 'FAILED ' : s.state === 'skipped' ? 'skipped' : s.state}  ${s.title}${s.state === 'skipped' ? '' : ` (${took(s.seconds)})`}`)
                .join('\n');
            html +=
                `<li data-kp-state="${o.state === 'failed' ? 'failed' : o.state === 'running' ? 'active' : 'done'}">` +
                `<span class="kp-action-list__lead"><span class="kp-badge kp-badge--${tone}">${word}</span></span>` +
                `<div class="kp-action-list__main"><strong class="kp-action-list__title">${o.action} · ${o.stack}</strong>` +
                `<span class="kp-action-list__meta"><span>${when(o.start)}</span><span>by ${o.by}</span><span>${tookText(o)}</span></span>` +
                `<details class="kp-accordion__item kp-accordion__item--bare kp-action-list__more"><summary>Steps</summary><pre class="kp-action-list__payload">${steps}${o.error ? `\n\n${o.error}` : ''}</pre></details></div></li>`;
        }
        html += '</ul>';
        const older = list.length - shown.length;
        return `${html}<p class="hx-muted hx-feed__more">${older ? `${plural(older, 'older operation is', 'older operations are')} not listed here. The table pages through all of them.` : 'That is every operation in this range.'}</p>`;
    };

    const paintFeed = () => {
        feedBusy?.remove();
        feedBusy = null;
        feed.replaceChildren();
        if (data === 'loading') feedBusy = openBusyCard(feed, { words: 'Reading the history…', area: () => [feed] });
        else if (data === 'ready' && current().length) feed.insertAdjacentHTML('beforeend', feedHtml(current()));
    };

    const paint = () => {
        setToolbarActive(bar, tagFor());
        const list = data === 'empty' ? [] : current();
        $('hx-hi-state').textContent = tagFor().length
            ? `${plural(list.length, 'operation', 'operations')} of ${OPS.length.toLocaleString('en-GB')} are listed`
            : `${plural(OPS.length, 'operation', 'operations')} in the last 30 days`;
        fillTable(list);
        dt?.refresh();
        cover($('hx-hi-cover'), null);
        if (data === 'loading') {
            dt?.state('loading');
            dt?.busy({ text: 'Reading the history…', since: Date.now(), overlay: true });
        } else {
            dt?.busy(null);
            dt?.state('ready');
            if (data === 'error')
                cover($('hx-hi-cover'), 'error', 'The history could not be read', 'The host answered 503 Service Unavailable. Nothing was changed.', () => {
                    data = 'ready';
                    press('data-hx-hi-data', 'ready');
                    paint();
                });
            else if (!list.length)
                cover($('hx-hi-cover'), 'empty', data === 'empty' ? 'Nothing has run yet' : 'No operation matches', data === 'empty' ? 'Every update, apply, restart and backup is listed here as soon as it starts.' : 'Remove the tag above the table to see every operation again.');
        }
        const covered = data === 'error' || !list.length;
        table.hidden = view !== 'table' || covered;
        feed.hidden = view !== 'feed' || covered;
        paintFeed();
    };
    paint();

    // A row opens: its facts, its steps, and for a failed one the error as a code block with Copy.
    const byKey = new Map(OPS.map((o) => [o.key, o]));
    table.addEventListener('kp-datatable-expand', (event) => {
        const { key, open, cell } = /** @type {CustomEvent} */ (event).detail;
        const o = byKey.get(key);
        if (!open || !o || !cell || cell.dataset.filled) return;
        cell.dataset.filled = '1';
        const steps = stepsOf(o, NOW);
        const root = document.createElement('div');
        root.className = 'hx-detail';
        const facts = [
            ['Operation', o.key],
            ['Started', when(o.start)],
            ['Finished', o.end ? when(o.end) : 'still running'],
            ['Took', tookText(o)],
            ['By', o.by],
            ['Container', `CT ${o.ct}`],
        ];
        root.innerHTML = `<dl class="kp-kv">${facts.map(([k, v]) => `<div class="kp-kv__row"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
        const list = buildSteplist(
            steps.map((s) => ({ id: s.id, title: s.title, note: s.note, state: s.state, ...(s.state === 'skipped' || s.state === 'pending' ? {} : { time: took(s.seconds) }) })),
            { label: `Steps of ${o.key}` },
        );
        root.append(list);
        if (o.error) {
            const code = document.createElement('div');
            code.className = 'kp-code hx-detail__wide';
            root.append(code);
            const failedStep = steps.find((s) => s.state === 'failed');
            setCode(code, {
                text: `${when(o.start)}  ${o.action.toLowerCase()} on ${o.stack} started\n${when(o.start + 20_000)}  step "${failedStep?.title ?? ''}" started\n${when(o.end ?? o.start)}  ${o.error}\n${when(o.end ?? o.start)}  step failed, the following steps were skipped`,
                title: 'Last lines of the log',
                language: 'log',
                maxLines: 6,
            });
        }
        cell.replaceChildren(root);
        attachSteplists(root);
    });

    stateButtons('data-hx-hi-view', (value) => {
        view = value;
        paint();
    });
    stateButtons('data-hx-hi-narrow', (value) => {
        narrow = value;
        paint();
    });
    stateButtons('data-hx-hi-data', (value) => {
        data = value;
        paint();
    });
    const clearNarrow = () => {
        narrow = 'none';
        press('data-hx-hi-narrow', 'none');
        paint();
    };
    bar.addEventListener('kp-toolbar-remove', clearNarrow);
    bar.addEventListener('kp-toolbar-clear', clearNarrow);
    table.addEventListener('kp-datatable-retry', () => {
        data = 'ready';
        press('data-hx-hi-data', 'ready');
        paint();
    });

    const target = OPS.find((o) => o.stack === 'immich' && o.state === 'failed');
    $('hx-hi-open').addEventListener('click', () => {
        if (!target || !dt) return;
        if (view !== 'table') {
            view = 'table';
            press('data-hx-hi-view', 'table');
        }
        if (narrow !== 'none' && narrow !== 'stack') clearNarrow();
        else paint();
        dt.fold([]);
        const keys = dt.view().keys;
        const index = keys.indexOf(target.key);
        const size = dt.view().pageSize;
        if (index >= 0) dt.page(Math.floor(index / size));
        dt.expand([target.key]);
        const row = table.querySelector(`[data-kp-row-key="${target.key}"]`);
        if (row) wrap.scrollTop = Math.max(0, /** @type {HTMLElement} */ (row).offsetTop - 80);
    });
    $('hx-hi-close').addEventListener('click', () => dt?.expand([]));

    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id !== 'activity-history-view') return;
        view = detail.value === 'feed' ? 'feed' : 'table';
        press('data-hx-hi-view', view);
        paint();
    });
}

// ── 4. the Jobs timeline ───────────────────────────────────────────────────────────────────────────────────────
if (document.getElementById('jobs-component')) {
    const el = $('hx-jobs');
    /** @type {import('./data.js').Job[]} */
    const list = makeJobs(NOW);
    let next = 2000;
    let data = 'ready';
    /** @type {{ from: number, to: number } | null} */
    let selection = null;
    let win = { from: NOW - 6 * HOUR, to: NOW };
    const ctOf = (/** @type {string} */ s) => STACKS.find((x) => x.name === s)?.ct;
    const names = ['jellyfin', 'immich', 'paperless', 'vaultwarden', 'grafana', 'kyu'];
    const lanes = names.map((s) => ({ id: s, label: s, sub: `CT ${ctOf(s)}` }));
    const waited = (/** @type {import('./data.js').Job} */ j) => (j.started ?? Date.now()) - j.queued;

    const paint = () => {
        setGanttRuns(
            el,
            list.map((j) => ({
                id: `job-${j.job}`,
                lane: j.stack,
                label: `${j.action} · ${j.stack}`,
                start: j.state === 'queued' ? j.queued : (j.started ?? j.queued),
                ...(j.finished ? { end: j.finished } : {}),
                state: /** @type {'queued' | 'running' | 'ok' | 'failed'} */ (j.state === 'done' ? 'ok' : j.state),
                detail: `Job #${j.job}, by ${j.by}. ${j.state === 'queued' ? `Waiting since ${when(j.queued)}.` : `Waited ${took(waited(j) / 1000)} before it started.`}${j.error ? ` ${j.error}.` : ''}`,
            })),
            lanes,
        );
        zones();
        facts(false);
    };
    /** The waiting bands that lie wholly inside the window, so none starts left of the plot. */
    const zones = () =>
        setGanttZones(
            el,
            list
                .filter((j) => j.started && waited(j) >= 8_000 && j.queued >= win.from)
                .map((j) => ({ id: `wait-${j.job}`, lane: j.stack, from: j.queued, to: /** @type {number} */ (j.started), label: `waited ${took(waited(j) / 1000)}`, tone: /** @type {'muted'} */ ('muted') })),
        );
    const view = () => selection ?? win;
    const facts = (animate = true) => {
        const v = view();
        const inV = list.filter((j) => (j.finished ?? Infinity) >= v.from && j.queued <= v.to);
        const live = list.filter((j) => j.state === 'queued' || j.state === 'running').length;
        const longest = inV.reduce((m, j) => Math.max(m, waited(j)), 0);
        if (animate) {
            tickText('hx-jb-n', inV.length);
            tickText('hx-jb-live', live);
        } else {
            $('hx-jb-n').textContent = inV.length.toLocaleString('en-GB');
            $('hx-jb-live').textContent = live.toLocaleString('en-GB');
        }
        $('hx-jb-wait').textContent = inV.length ? took(longest / 1000) : 'none';
    };
    paint();
    el.addEventListener('kp-gantt-select', (event) => {
        const { from, to } = /** @type {CustomEvent} */ (event).detail;
        selection = from != null && to != null ? { from, to } : null;
        facts();
    });
    el.addEventListener('kp-gantt-window', (event) => {
        const { from, to } = /** @type {CustomEvent} */ (event).detail;
        win = { from, to };
        zones();
        facts();
    });
    el.addEventListener('kp-gantt-open', (event) => {
        const j = list.find((x) => `job-${x.job}` === /** @type {CustomEvent} */ (event).detail.id);
        if (j)
            $('hx-jb-opened').textContent = `Job #${j.job}, ${j.action.toLowerCase()} on ${j.stack}, ${j.state === 'queued' ? `waiting since ${when(j.queued)}` : `${j.state} (started ${when(j.started ?? j.queued)})`}. On the dashboard this opens the job dialog (section 5).`;
    });

    /** One worker: when a job ends, the oldest queued one starts. */
    const promote = () => {
        if (list.some((j) => j.state === 'running')) return;
        const queued = list.filter((j) => j.state === 'queued').sort((a, b) => a.queued - b.queued)[0];
        if (queued) {
            queued.state = 'running';
            queued.started = Date.now();
        }
    };
    const finish = (/** @type {'done' | 'failed'} */ as) => {
        const running = list.filter((j) => j.state === 'running').sort((a, b) => (a.started ?? 0) - (b.started ?? 0))[0];
        if (!running) return;
        running.state = as;
        running.finished = Date.now();
        if (as === 'failed') running.error = 'Container did not become healthy within 120 s';
        promote();
        paint();
    };
    const pick = () => names[(next += 3) % names.length];
    $('hx-jb-start').addEventListener('click', () => {
        const now = Date.now();
        next += 1;
        list.push({ job: next, stack: pick(), action: 'Update images', by: 'kenny', queued: now - 2000, started: now, finished: null, state: list.some((j) => j.state === 'running') ? 'queued' : 'running', ...(list.some((j) => j.state === 'running') ? { started: null } : {}) });
        paint();
    });
    $('hx-jb-queue').addEventListener('click', () => {
        next += 1;
        list.push({ job: next, stack: pick(), action: 'Apply changes', by: 'kenny', queued: Date.now(), started: null, finished: null, state: 'queued' });
        promote();
        paint();
    });
    $('hx-jb-finish').addEventListener('click', () => finish('done'));
    $('hx-jb-fail').addEventListener('click', () => finish('failed'));
    const setData = (/** @type {string} */ value) => {
        data = value;
        cover($('hx-jb-cover'), null);
        if (value === 'ready') {
            paint();
            setGanttState(el, 'ready');
        } else if (value === 'loading') setGanttState(el, 'loading');
        else {
            setGanttRuns(el, [], lanes);
            setGanttZones(el, []);
            setGanttState(el, value === 'empty' ? 'empty' : 'error', value === 'empty' ? 'No job in the last 24 hours' : 'The jobs could not be read');
            if (value === 'empty') cover($('hx-jb-cover'), 'empty', 'No job in the last 24 hours', 'A job is listed here as soon as it is queued.');
            else
                cover($('hx-jb-cover'), 'error', 'The jobs could not be read', 'The host answered 503 and nothing was changed.', () => {
                    press('data-hx-jb-data', 'ready');
                    setData('ready');
                });
        }
    };
    stateButtons('data-hx-jb-data', setData);
    void data;
}

// ── 5. one job ─────────────────────────────────────────────────────────────────────────────────────────────────
if (document.getElementById('job-component')) {
    const frame = $('job-component');
    const stepsHost = $('hx-jd-steps-host');
    const disc = $('hx-jd-disc');
    const MEDIAN = 320;
    const PLAN = [
        ['pull', 'Pull the images', 'Fetches what changed from the registry', 138],
        ['stop', 'Stop the containers', 'Waits for a clean shutdown', 24],
        ['start', 'Start the containers', 'Recreates them on the new images', 41],
        ['health', 'Wait for the health check', 'The stack has to answer before this counts', 63],
    ];
    const CUM = PLAN.reduce((acc, p) => [...acc, acc[acc.length - 1] + Number(p[3])], [0]);
    const ERROR = 'Error response from daemon: driver failed programming external connectivity on endpoint immich-server: Bind for 0.0.0.0:2283 failed: port is already allocated';
    let outcome = 'running';
    let data = 'ready';
    let clock = 0;
    /** @type {import('../../js/busy-card.js').BusyCard | null} */
    let busy = null;
    // The disc runs on a clock fifteen times quicker than the wall, so a 4 min countdown plays in 16 s.
    const SPEED = 15;
    const sim = () => performance.now() * SPEED;
    disc.setAttribute('data-kp-timer-disc', '5m20s');
    attachTimerDiscs($('hx-jd-disc-host'), { now: sim });

    /** @param {number} e elapsed seconds, @param {boolean} fails */
    const stateAt = (e, fails) =>
        PLAN.map((p, i) => {
            if (fails && i === 2 && e >= CUM[2]) return 'failed';
            if (fails && i > 2 && e >= CUM[2]) return 'skipped';
            if (e >= CUM[i + 1]) return 'done';
            if (e >= CUM[i]) return 'running';
            return 'pending';
        });
    const list = buildSteplist(
        PLAN.map((p) => ({ id: String(p[0]), title: String(p[1]), note: String(p[2]), state: /** @type {'pending'} */ ('pending') })),
        { label: 'Steps of the update' },
    );
    stepsHost.append(list);
    attachSteplists(stepsHost);

    /** @param {number} e elapsed seconds @param {boolean} fails @param {boolean} animate */
    const show = (e, fails, animate) => {
        const states = stateAt(e, fails);
        PLAN.forEach((p, i) => {
            const s = states[i];
            const time = s === 'done' ? took(Number(p[3])) : s === 'failed' ? took(9) : '';
            setStep(list, String(p[0]), { state: /** @type {any} */ (s), time });
        });
        const done = states.filter((s) => s === 'done').length;
        if (animate) tickText('hx-jd-steps', done);
        else $('hx-jd-steps').textContent = String(done);
        $('hx-jd-took').textContent = took(fails ? Math.min(e, CUM[2] + 9) : Math.min(e, CUM[4]));
        const parts = PLAN.map((p, i) => ({ key: String(p[0]), label: String(p[1]), value: states[i] === 'done' ? Number(p[3]) : states[i] === 'failed' ? 9 : states[i] === 'running' ? Math.max(0, e - CUM[i]) : 0 })).filter((p) => p.value > 0);
        setStackbar($('hx-jd-bar'), {
            title: 'Where the time went',
            total: Math.max(MEDIAN, parts.reduce((s, p) => s + p.value, 0)),
            format: (v) => took(v),
            restLabel: outcome === 'running' ? 'Still to come (estimate)' : 'Under the median',
            parts: parts.map((p) => (fails && p.key === 'start' ? { ...p, tone: /** @type {'destructive'} */ ('destructive') } : p)),
            marks: [{ at: Math.min(1, MEDIAN / Math.max(MEDIAN, parts.reduce((s, p) => s + p.value, 0))), label: `median ${took(MEDIAN)}` }],
        });
    };

    const badge = $('hx-jd-badge');
    const delta = $('hx-jd-delta');
    const settle = () => {
        window.clearInterval(clock);
        const running = outcome === 'running';
        const fails = outcome === 'failed';
        $('hx-jd-sub').textContent = `Started by kenny on ${when(NOW - 150_000)}, container CT 107${fails ? '' : ''}`;
        badge.className = `kp-badge kp-badge--${fails ? 'destructive' : running ? 'info' : 'success'}`;
        badge.textContent = fails ? 'failed' : running ? 'running' : 'done';
        $('hx-jd-median').textContent = took(MEDIAN);
        const elapsed = running ? 150 : fails ? CUM[2] + 9 : CUM[4];
        show(elapsed, fails, false);
        const diff = fails ? null : CUM[4] - MEDIAN;
        delta.hidden = running || fails;
        if (diff !== null && !running) {
            delta.className = `kp-badge kp-badge--${diff > 0 ? 'warning' : 'success'}`;
            delta.textContent = `${took(Math.abs(diff))} ${diff > 0 ? 'slower' : 'faster'}`;
        }
        const clk = timerDiscOf(disc);
        disc.hidden = !running;
        if (running && clk) {
            clk.reset(MEDIAN - 150);
            $('hx-jd-disc-text').textContent = `About ${Math.round((MEDIAN - 150) / 60)} min left (an estimate from the median, not a promise)`;
        } else if (fails) $('hx-jd-disc-text').textContent = `Stopped after ${took(elapsed)}. No time left to estimate.`;
        else $('hx-jd-disc-text').textContent = `Finished in ${took(elapsed)}, ${took(Math.abs(CUM[4] - MEDIAN))} ${CUM[4] > MEDIAN ? 'slower' : 'faster'} than the median.`;
        setProblems(
            $('hx-jd-problems'),
            fails
                ? [
                      {
                          key: 'port',
                          what: 'The update stopped at "Start the containers"',
                          why: 'Port 2283 is already in use by another container on this host, so immich-server could not start.',
                          remedy: 'Stop the container that holds the port, then run the update again.',
                          command: 'docker ps --filter publish=2283',
                          severity: 'critical',
                      },
                  ]
                : [],
        );
        const code = $('hx-jd-code');
        code.hidden = !fails;
        if (fails) setCode(code, { text: `${when(NOW - 171_000)}  step "Start the containers" started\n${when(NOW - 162_000)}  ${ERROR}\n${when(NOW - 162_000)}  step failed, 1 step skipped`, title: 'Last lines of the log', language: 'log', maxLines: 6 });
    };

    const play = () => {
        window.clearInterval(clock);
        outcome = 'running';
        press('data-hx-jd-outcome', 'running');
        settle();
        const clk = timerDiscOf(disc);
        const t0 = performance.now();
        clk?.reset(MEDIAN);
        clk?.start();
        $('hx-jd-disc-text').textContent = 'About 5 min left, shown 15 times faster than real time';
        const steps0 = 0;
        void steps0;
        let last = '';
        clock = window.setInterval(() => {
            const e = ((performance.now() - t0) * SPEED) / 1000;
            const key = stateAt(e, false).join();
            show(Math.min(e, CUM[4]), false, key !== last);
            last = key;
            const left = Math.max(0, MEDIAN - e);
            $('hx-jd-disc-text').textContent = left > 0 ? `About ${Math.max(1, Math.round(left / 60))} min left, shown 15 times faster than real time` : 'Past the median';
            if (e >= CUM[4]) {
                window.clearInterval(clock);
                clk?.pause();
                outcome = 'done';
                press('data-hx-jd-outcome', 'done');
                settle();
            }
        }, 120);
    };

    const plate = $('hx-jd-plate');
    const layer = () => {
        busy?.remove();
        busy = null;
        plate.hidden = data !== 'error';
        plate.replaceChildren();
        if (data === 'loading') busy = openBusyCard(frame, { words: 'Reading the job…', area: () => [frame] });
        if (data === 'error')
            plate.append(
                statePlate(document, {
                    kind: 'error',
                    title: 'The job could not be read',
                    text: 'The host answered 503 and nothing was changed.',
                    actionLabel: 'Retry',
                    onAction: () => {
                        data = 'ready';
                        press('data-hx-jd-data', 'ready');
                        layer();
                    },
                }),
            );
    };
    settle();
    stateButtons('data-hx-jd-outcome', (value) => {
        outcome = value;
        settle();
    });
    stateButtons('data-hx-jd-data', (value) => {
        data = value;
        layer();
    });
    $('hx-jd-play').addEventListener('click', play);
}
