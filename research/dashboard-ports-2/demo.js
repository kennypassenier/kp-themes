// The demo page's own wiring: the sample data, the option buttons, and what
// each section's try-buttons do. The proposal itself is ports2.js.
import {
    attachCalendars,
    attachGraphs,
    attachKpiStrips,
    attachMenuButtons,
    attachTrendCharts,
    CALENDAR_PICK_EVENT,
    dayKey,
    formatDay,
    formatMoment,
    GRAPH_CHANGE_EVENT,
    kpiColumns,
    MENU_SELECT_EVENT,
    setCalendarDays,
    setCalendarLegend,
    setCalendarState,
    setGraphData,
    setGraphState,
    setMenu,
    setMeter,
    setTrendData,
    shouldStartTour,
    startTour,
    tourMemoryKey,
} from './ports2.js';

/** @param {string} selector @param {ParentNode} [root] @returns {HTMLElement[]} */
const all = (selector, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(selector)]);

/** 04/10/2026 14:40 in Brussels: "now" for every sample on the page. */
const NOW = Date.parse('2026-10-04T12:40:00Z');
const MINUTE = 60_000;
const DAY = 86_400_000;
let clock = NOW;
const now = () => clock;

/* ================================================================ options */

/** What each option does to the page. @type {Record<string, (value: string) => void>} */
const APPLY = {
    headings: (value) => all('.kp-menu--rich').forEach((menu) => menu.classList.toggle('kp-menu--plain-headings', value === 'plain')),
    reason: (value) => {
        for (const wrapper of all('[data-kp-menu-button]')) {
            if (value === 'add') wrapper.dataset.kpMenuReason = 'add';
            else delete wrapper.dataset.kpMenuReason;
        }
        fillMenus();
    },
    mark: (value) => all('.kp-meter, .kp-kpi__meter').forEach((m) => m.classList.toggle('kp-meter--notch', value === 'notch')),
    over: (value) => all('.kp-meter, .kp-kpi__meter').forEach((m) => m.classList.toggle('kp-meter--hatch-over', value === 'hatch')),
    lone: (value) => all('.kp-kpis[data-kp-kpis-columns]').forEach((strip) => strip.classList.toggle('kp-kpis--centre-last', value === 'centre')),
    note: (value) => {
        for (const tile of all('.kp-kpi--trend')) {
            const note = tile.querySelector('[data-dp-note]');
            if (!note) continue;
            if (value === 'value') {
                note.className = 'kp-kpi__note';
                tile.querySelector('.kp-kpi__value')?.append(note);
            } else {
                note.className = 'kp-kpi__label-note';
                tile.querySelector('.kp-kpi__label')?.append(note);
            }
        }
    },
    readout: (value) => all('.kp-kpi__chart').forEach((figure) => (figure.dataset.kpSparkReadout = value)),
    glyph: (value) => all('.kp-calendar').forEach((cal) => cal.classList.toggle('kp-calendar--marks', value === 'mark')),
    pads: (value) => all('.kp-calendar').forEach((cal) => cal.classList.toggle('kp-calendar--adjacent', value === 'adjacent')),
    colour: (value) => all('.kp-graph').forEach((graph) => graph.classList.toggle('kp-graph--plain-nodes', value === 'plain')),
    legend: (value) => all('.kp-graph').forEach((graph) => graph.classList.toggle('kp-graph--legend-below', value === 'below')),
    highlight: (value) => {
        spotlight = value === 'dim';
        for (const target of all('[data-kp-tour-target]')) target.toggleAttribute('data-kp-tour-spotlight', spotlight);
    },
    'help-list': (value) => all('.kp-help__list').forEach((list) => list.classList.toggle('kp-help__list--stacked', value === 'stacked')),
};

/** @param {string} name @param {string} value */
const choose = (name, value) => {
    APPLY[name]?.(value);
    for (const button of all(`[data-dp-preview="${name}"] [data-value]`)) button.setAttribute('aria-pressed', String(button.dataset.value === value));
};

for (const group of all('[data-dp-preview]')) {
    group.addEventListener('click', (event) => {
        const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('[data-value]')) : null;
        if (button?.dataset.value) choose(group.dataset.dpPreview ?? '', button.dataset.value);
    });
}

// A tick in the review dialog shows that option on the page too.
document.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: string, value: string }>} */ (event).detail;
    choose(id, value);
});

/** A group of try-buttons where one is on at a time. @param {HTMLElement} button */
const pressOnly = (button) => {
    for (const sibling of all('[aria-pressed]', /** @type {ParentNode} */ (button.parentElement))) sibling.setAttribute('aria-pressed', String(sibling === button));
};

/* ===================================================== 1 · menu button */

/** @type {import('./ports2.js').MenuGroup[]} */
const MENU = [
    {
        group: 'Run',
        items: [
            { label: 'Restart the pumps', hint: 'Stop and start both pumps, one after the other', value: 'restart' },
            { label: 'Switch to the spare pump', hint: 'Run on pump 2 while pump 1 rests', value: 'spare' },
            {
                label: 'Run a pressure test',
                hint: 'Close the ring main valve and measure for ten minutes',
                disabled: 'Not while a field engineer is on site',
                value: 'test',
            },
        ],
    },
    {
        group: 'Readings',
        items: [
            { label: 'Open the readings on Charts', hint: 'Pressure and flow for the last 24 hours', href: '#trend-tile', value: 'charts' },
            { label: 'Recalibrate the sensors…', hint: 'Set the pressure sensors to the reference gauge', value: 'recalibrate' },
        ],
    },
    {
        group: 'Records',
        items: [
            { label: 'Print the site sheet', hint: 'One page with the pumps, the valves and the contacts', value: 'print' },
            { label: 'Archive this pump house…', hint: 'Take it off the network; its readings are kept', danger: true, value: 'archive' },
        ],
    },
];

/** The refill: the test may run now, and a new action joined. @type {import('./ports2.js').MenuGroup[]} */
const MENU_REFILLED = [
    {
        group: 'Run',
        items: [
            MENU[0].items[0],
            MENU[0].items[1],
            { label: 'Run a pressure test', hint: 'Close the ring main valve and measure for ten minutes', value: 'test' },
            { label: 'Silence the door alarm', hint: 'For one hour; it sounds again if the door stays open', value: 'silence' },
        ],
    },
    MENU[1],
    MENU[2],
];

/** Twenty-four actions in four groups: the menu scrolls inside itself. @type {import('./ports2.js').MenuGroup[]} */
const MENU_MANY = ['Run', 'Readings', 'Records', 'People'].map((group, g) => ({
    group,
    items: Array.from({ length: 6 }, (_, i) => ({
        label: `${group} action ${i + 1}`,
        hint: `What ${group.toLowerCase()} action ${i + 1} does, in one line`,
        value: `${g}-${i}`,
        ...(i === 3 ? { disabled: 'Only for the shift lead' } : {}),
    })),
}));

/** @type {import('./ports2.js').MenuGroup[] | 'loading'} */
let menuNow = MENU;
const fillMenus = () => {
    for (const wrapper of all('[data-dp-menu-target]')) setMenu(wrapper, menuNow);
    for (const wrapper of all('[data-dp-menu-single]'))
        setMenu(wrapper, [{ group: 'Run', items: [{ label: 'Read the level now', hint: 'Ask the sensor for a reading outside its minute', value: 'read' }] }]);
};

attachMenuButtons(document);
fillMenus();

let escapes = 0;
let lastPick = 'Nothing picked yet.';
const menuLog = document.querySelector('[data-dp-menu-log]');
const writeMenuLog = () => {
    if (menuLog) menuLog.textContent = `${lastPick} The page's own Escape listener heard ${escapes} ${escapes === 1 ? 'press' : 'presses'}.`;
};
document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    escapes += 1;
    writeMenuLog();
});
document.addEventListener(MENU_SELECT_EVENT, (event) => {
    const { value, item } = /** @type {CustomEvent<{ value: string, item: HTMLElement }>} */ (event).detail;
    lastPick = `Picked: ${item.querySelector('.kp-menu__label')?.textContent} (${value}).`;
    writeMenuLog();
});

/** @type {number | undefined} */
let refillTimer;
for (const button of all('[data-dp-menu]')) {
    button.addEventListener('click', () => {
        const what = button.dataset.dpMenu;
        clearTimeout(refillTimer);
        if (what === 'refill') {
            lastPick = 'A refill comes in 3 s: open a menu and wait; it shows once the menu closes.';
            writeMenuLog();
            refillTimer = window.setTimeout(() => {
                menuNow = menuNow === MENU_REFILLED ? MENU : MENU_REFILLED;
                fillMenus();
                lastPick = 'Refilled (an open menu keeps its entries until it closes).';
                writeMenuLog();
            }, 3000);
            return;
        }
        menuNow = what === 'loading' ? 'loading' : what === 'many' ? MENU_MANY : what === 'empty' ? [] : MENU;
        fillMenus();
    });
}

/* ============================================================ 2 · meter */

/** @type {[string, import('./ports2.js').Meter][]} */
const METER_CASES = [
    ['Reservoir North, against its target', { value: 0.62, mark: 0.8, label: 'full', markLabel: 'the target level' }],
    ['Booked tonight, past the end', { value: 0.58, mark: 1.3, label: 'running now', markLabel: 'booked for tonight' }],
    ['Empty, with a mark', { value: 0, mark: 0.5, label: 'used', markLabel: 'the weekly limit' }],
    ['Full', { value: 1, mark: 0.9, label: 'full', markLabel: 'the target level' }],
    ['The value past the end', { value: 1.12, label: 'of the plan used' }],
    ['Mark at the start', { value: 0.3, mark: 0, label: 'used', markLabel: 'the floor' }],
    ['Mark at the end', { value: 0.3, mark: 1, label: 'used', markLabel: 'the ceiling' }],
    ['Warning', { value: 0.78, mark: 0.8, tone: 'warning', label: 'full', markLabel: 'the overflow alarm' }],
    ['Destructive', { value: 0.93, mark: 0.8, tone: 'destructive', label: 'full', markLabel: 'the overflow alarm' }],
    ['Not measured', { value: null }],
    ['Loading', { loading: true }],
];

const meterRows = document.querySelector('[data-dp-meter-rows]');
/** @type {{ el: HTMLElement, meter: import('./ports2.js').Meter, words?: HTMLElement }[]} */
const meters = [];
for (const [label, meter] of METER_CASES) {
    const tr = document.createElement('tr');
    const name = document.createElement('td');
    name.textContent = label;
    const cell = document.createElement('td');
    const el = document.createElement('span');
    el.className = 'kp-meter';
    cell.append(el);
    const words = document.createElement('td');
    tr.append(name, cell, words);
    meterRows?.append(tr);
    meters.push({ el, meter, words });
}

/** @param {HTMLElement} strip */
const meterTiles = (strip) => {
    strip.innerHTML = `
        <div class="kp-kpi">
            <span class="kp-kpi__label">Reservoir North</span>
            <span class="kp-kpi__value">62<small>%</small></span>
            <span class="kp-kpi__trend">full · the mark is the target level, 80 %</span>
            <span class="kp-kpi__meter" data-dp-meter="reservoir"></span>
        </div>
        <div class="kp-kpi" data-kp-tone="destructive">
            <span class="kp-kpi__label">Pump capacity</span>
            <span class="kp-kpi__value">93<small>%</small></span>
            <span class="kp-kpi__trend">running · the mark is what is booked tonight</span>
            <span class="kp-kpi__meter" data-dp-meter="booked"></span>
        </div>
        <div class="kp-kpi">
            <span class="kp-kpi__label">Treatment plant</span>
            <span class="kp-kpi__value">4 210<small>m³</small></span>
            <span class="kp-kpi__trend"><span class="kp-meter kp-meter--inline" data-dp-meter="plant"></span>41 % of today's plan, plan to 55 % by now</span>
        </div>`;
};
for (const strip of all('[data-dp-meter-tiles]')) meterTiles(strip);

let booked = false;
let meterLoading = false;
const paintMeters = () => {
    for (const { el, meter, words } of meters) {
        setMeter(el, meterLoading ? { loading: true } : meter);
        if (words) words.textContent = el.getAttribute('aria-valuetext') ?? '';
    }
    for (const el of all('[data-dp-meter="reservoir"]'))
        setMeter(el, meterLoading ? { loading: true } : { value: 0.62, mark: 0.8, label: 'full', markLabel: 'the target level' });
    for (const el of all('[data-dp-meter="booked"]'))
        setMeter(el, meterLoading ? { loading: true } : { value: 0.93, mark: booked ? 1.3 : 0.8, label: 'running', markLabel: 'booked for tonight' });
    for (const el of all('[data-dp-meter="plant"]'))
        setMeter(el, meterLoading ? { loading: true } : { value: 0.41, mark: 0.55, label: "of today's plan", markLabel: 'planned by now' });
    for (const trend of all('[data-dp-meter="booked"]')) {
        const words = trend.parentElement?.querySelector('.kp-kpi__trend');
        if (words) words.textContent = booked ? 'running · 130 % of it booked tonight' : 'running · the mark is what is booked tonight';
    }
    // The first row follows the button too, so the table shows the words change.
    meters[0].meter = booked
        ? { value: 0.62, mark: 1.3, label: 'full', markLabel: 'the target level' }
        : { value: 0.62, mark: 0.8, label: 'full', markLabel: 'the target level' };
};
paintMeters();
for (const button of all('[data-dp-meter]')) {
    if (!button.matches('button')) continue;
    button.addEventListener('click', () => {
        const on = button.getAttribute('aria-pressed') !== 'true';
        button.setAttribute('aria-pressed', String(on));
        if (button.dataset.dpMeter === 'book') booked = on;
        else meterLoading = on;
        paintMeters();
        // A meter rebuilt its mark: the options on view apply to it too.
        const pressedValue = (/** @type {string} */ name) => document.querySelector(`[data-dp-preview="${name}"] [aria-pressed="true"]`)?.getAttribute('data-value') ?? '';
        APPLY.mark(pressedValue('mark'));
        APPLY.over(pressedValue('over'));
    });
}

/* ======================================================= 3 · KPI strip */

const FIGURES = [
    ['Pressure', '3.1', 'bar', 'two pumps running'],
    ['Flow', '412', 'm³/h', 'into the ring main'],
    ['Reservoir North', '71', '%', 'target 80 %'],
    ['Reservoir South', '64', '%', 'target 80 %'],
    ['Open incidents', '2', '', 'one needs a visit'],
    ['Readings late', '1', '', 'pump house 7, since 06:00'],
    ['Energy today', '1 834', 'kWh', 'night tariff from 22:00'],
    ['Visits planned', '3', '', 'this week'],
];
/** @param {number} n */
const figureTiles = (n) =>
    FIGURES.slice(0, n)
        .map(
            ([label, value, unit, trend]) =>
                `<div class="kp-kpi"><span class="kp-kpi__label">${label}</span><span class="kp-kpi__value">${value}${unit ? `<small>${unit}</small>` : ''}</span><span class="kp-kpi__trend">${trend}</span></div>`,
        )
        .join('');

const strip = /** @type {HTMLElement | null} */ (document.querySelector('[data-dp-strip]'));
const stage = /** @type {HTMLElement | null} */ (document.querySelector('[data-dp-strip-stage]'));
const stripOut = document.querySelector('[data-dp-strip-out]');
let tileCount = 5;
const describeStrip = () => {
    if (!strip || !stripOut) return;
    requestAnimationFrame(() => {
        const columns = Number(strip.style.getPropertyValue('--kp-kpis-columns')) || 1;
        const spans = strip.hasAttribute('data-kp-kpis-span-last');
        const rows = [];
        for (let left = tileCount; left > 0; left -= columns) rows.push(Math.min(columns, left));
        const width = Math.round(strip.getBoundingClientRect().width);
        stripOut.textContent =
            `${tileCount} ${tileCount === 1 ? 'tile' : 'tiles'} in ${width} px: ${columns} ${columns === 1 ? 'column' : 'columns'}, ` +
            `${rows.length === 1 ? 'one row' : `rows ${rows.join(' + ')}`}` +
            (spans ? '; no allowed count avoids a lone tile, so the last one takes the option below.' : ', no tile alone.');
    });
};
if (strip) {
    strip.innerHTML = figureTiles(tileCount);
    new ResizeObserver(describeStrip).observe(strip);
}
for (const button of all('[data-dp-strip-count] [data-value]')) {
    button.addEventListener('click', () => {
        pressOnly(button);
        tileCount = Number(button.dataset.value);
        if (strip) strip.innerHTML = figureTiles(tileCount);
        describeStrip();
    });
}
for (const button of all('[data-dp-strip-width] [data-value]')) {
    button.addEventListener('click', () => {
        pressOnly(button);
        const value = button.dataset.value;
        stage?.style.setProperty('--dp-strip-width', value === 'full' ? 'none' : `${value}px`);
        describeStrip();
    });
}
for (const phone of all('[data-dp-strip-phone]')) phone.innerHTML = figureTiles(5);
// Every strip on the page with a column list, the trend tiles' too.
attachKpiStrips(document);

/** The spec's acceptance table: tiles, width, columns, span. @type {[number, number, number, boolean][]} */
const CASES = [
    [5, 1400, 5, false],
    [4, 600, 2, false],
    [5, 700, 3, false],
    [7, 700, 3, true],
    [8, 700, 3, false],
    [5, 358, 2, true],
    [6, 358, 2, false],
    [1, 500, 1, false],
];
const caseRows = document.querySelector('[data-dp-strip-cases]');
for (const [n, width, columns, span] of CASES) {
    const got = kpiColumns(n, width, { allowed: 'all 3 2 1', minTilePx: 160, gapPx: 16 });
    const rows = [];
    for (let left = n; left > 0; left -= got.columns) rows.push(Math.min(got.columns, left));
    const tr = document.createElement('tr');
    const ok = got.columns === columns && got.spanLast === span;
    for (const text of [String(n), `${width} px`, String(got.columns), rows.join(' + '), got.spanLast ? 'yes' : 'no', ok ? 'yes' : `no (spec: ${columns})`])
        tr.append(Object.assign(document.createElement('td'), { textContent: text }));
    caseRows?.append(tr);
}

/* ====================================================== 4 · trend tile */

/** Noise from the time alone, so every load draws the same line. @param {number} t @param {number} k */
const noise = (t, k) => {
    const v = Math.sin((t / MINUTE) * 12.9898 + k * 78.233) * 43758.5453;
    return v - Math.floor(v) - 0.5;
};
/** The network's demand at `t` on the Brussels clock: a morning and an evening peak. @param {number} t */
const demand = (t) => {
    const h = ((t / 3_600_000 + 2) % 24 + 24) % 24;
    return 0.55 + 0.4 * Math.exp(-((h - 7.5) ** 2) / 3) + 0.3 * Math.exp(-((h - 19) ** 2) / 4) - 0.25 * Math.exp(-((h - 3.5) ** 2) / 5);
};

const STEP = 10 * MINUTE;
/**
 * @typedef {{ key: string, label: string, unit: string, digits: number, colour: number, context: string,
 *   at: (t: number) => number, from?: number, until?: number }} Figure
 */
/** @type {Figure[]} */
const TREND_FIGURES = [
    { key: 'pressure', label: 'Pressure', unit: 'bar', digits: 2, colour: 1, context: 'two pumps', at: (t) => 3.6 - 0.6 * demand(t) + 0.04 * noise(t, 1) },
    {
        key: 'flow',
        label: 'Flow into the network',
        unit: 'm³/h',
        digits: 0,
        colour: 2,
        context: 'into the ring main',
        at: (t) => 420 * demand(t) + 12 * noise(t, 2),
        until: NOW - 40 * MINUTE,
    },
    { key: 'north', label: 'Reservoir North', unit: '%', digits: 0, colour: 3, context: 'of its height', at: (t) => 72 - 9 * demand(t) + noise(t, 3) },
    { key: 'temp', label: 'Pump temperature', unit: '°C', digits: 0, colour: 4, context: 'hottest pump', at: (t) => 41 + 9 * demand(t) + noise(t, 4) },
];

/** @param {Figure} f */
const pointsOf = (f) => {
    const end = Math.min(clock, f.until ?? Infinity);
    const start = f.from ?? clock - DAY;
    const last = start + Math.floor((end - start) / STEP) * STEP;
    /** @type {[number, number][]} */
    const points = [];
    for (let t = start; t <= last; t += STEP) points.push([t, Number(f.at(t).toFixed(f.digits))]);
    return points;
};

/** @param {Figure} f @param {number} v */
const fmt = (f, v) => `${v.toFixed(f.digits)}${f.unit === '%' || f.unit === '°C' ? '' : ' '}${f.unit}`;

/** One tile's markup: the label with its note, the corner link, the number, the line of words, the trend. @param {Figure} f @param {string} suffix */
const trendTile = (f, suffix) => `
    <div class="kp-kpi kp-kpi--trend" data-dp-figure="${f.key}">
        <span class="kp-kpi__label">${f.label} <span class="kp-kpi__label-note" data-dp-note>avg 15 min</span></span>
        <a class="kp-kpi__link" href="#trend-tile" title="Open ${f.label} on Charts"><span class="kp-kpi__link-word">Charts</span> ↗</a>
        <span class="kp-kpi__value"><span class="kp-skeleton" style="--kp-skeleton-height: 1.75rem; inline-size: 3ch"></span></span>
        <span class="kp-kpi__trend"><span class="kp-skeleton" style="inline-size: 80%"></span></span>
        <figure class="kp-kpi__chart" data-kp-chart="spark" data-kp-spark-head="none" data-kp-spark-axis="relative" data-kp-spark-readout="float"
            aria-label="${f.label}, last 24 hours${suffix}" style="--kp-chart-series: var(--chart-${f.colour})"></figure>
    </div>`;

/** Fill a tile's number and words from its points (or its state). @param {HTMLElement} tile @param {Figure} f @param {[number, number][] | null} points */
const paintTile = (tile, f, points) => {
    const value = /** @type {HTMLElement} */ (tile.querySelector('.kp-kpi__value'));
    const words = /** @type {HTMLElement} */ (tile.querySelector('.kp-kpi__trend'));
    const note = tile.querySelector('[data-dp-note]');
    if (!points) {
        value.innerHTML = '<span class="kp-skeleton" style="--kp-skeleton-height: 1.75rem; inline-size: 3ch"></span>';
        words.innerHTML = '<span class="kp-skeleton" style="inline-size: 80%"></span>';
    } else if (!points.length) {
        value.textContent = '—';
        words.textContent = 'no trend: the readings store did not answer';
        tile.title = 'No trend: the readings store did not answer at 14:40';
    } else {
        const recent = points.slice(-2).map((p) => p[1]);
        const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const peak = Math.max(...points.map((p) => p[1]));
        value.textContent = avg.toFixed(f.digits);
        if (f.unit) value.append(Object.assign(document.createElement('small'), { textContent: f.unit }));
        words.innerHTML = `now <b>${fmt(f, points.at(-1)?.[1] ?? 0)}</b> · peak ${fmt(f, peak)} · ${f.context}`;
    }
    if (note && note.parentElement === value) value.append(note);
};

/** @type {{ tile: HTMLElement, f: Figure, state: 'filled' | 'loading' | 'none' | 'one' }[]} */
const tiles = [];
for (const strip of all('[data-dp-trend-strip]')) {
    const which = strip.dataset.dpTrendStrip;
    if (which === 'states') {
        /** @type {[Figure, 'loading' | 'none' | 'one' | 'filled'][]} */
        const states = [
            [{ ...TREND_FIGURES[0], key: 'loading', label: 'Pressure, pump house 2' }, 'loading'],
            [{ ...TREND_FIGURES[0], key: 'none', label: 'Pressure, pump house 7' }, 'none'],
            [{ ...TREND_FIGURES[2], key: 'one', label: 'Reservoir East', context: 'measured since 14:30' }, 'one'],
            [{ ...TREND_FIGURES[2], key: 'south', label: 'Reservoir South', context: 'measured since this morning', from: Date.parse('2026-10-04T05:00:00Z') }, 'filled'],
        ];
        strip.innerHTML = states.map(([f]) => trendTile(f, '')).join('');
        states.forEach(([f, state], i) => tiles.push({ tile: /** @type {HTMLElement} */ (strip.children[i]), f, state }));
    } else {
        const suffix = which === 'phone' ? ', phone width' : '';
        strip.innerHTML = TREND_FIGURES.map((f) => trendTile(f, suffix)).join('');
        TREND_FIGURES.forEach((f, i) => tiles.push({ tile: /** @type {HTMLElement} */ (strip.children[i]), f, state: 'filled' }));
    }
}
attachTrendCharts(document.getElementById('trend-tile') ?? document, {
    now,
    format: (value, figure) => {
        const f = tiles.find((t) => t.tile.contains(figure))?.f;
        return f ? fmt(f, value) : String(value);
    },
});

let trendLoading = false;
const paintTrends = () => {
    for (const { tile, f, state } of tiles) {
        const figure = /** @type {HTMLElement} */ (tile.querySelector('.kp-kpi__chart'));
        const loading = state === 'loading' || (trendLoading && state === 'filled');
        /** @type {[number, number][] | null} */
        const points = loading ? null : state === 'none' ? [] : state === 'one' ? [[clock - 10 * MINUTE, 71]] : pointsOf(f);
        paintTile(tile, f, points);
        setTrendData(figure, points ? { points, step: STEP } : null);
    }
};
paintTrends();

const trendOut = document.querySelector('[data-dp-trend-out]');
document.getElementById('trend-tile')?.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('.kp-kpi__link') : null;
    if (!link) return;
    // The sample's links go nowhere: say where they would go.
    event.preventDefault();
    if (trendOut) trendOut.textContent = `Opened: ${link.getAttribute('title')}.`;
});
for (const button of all('[data-dp-trend]')) {
    button.addEventListener('click', () => {
        if (button.dataset.dpTrend === 'live') clock += 10 * MINUTE;
        else {
            trendLoading = button.getAttribute('aria-pressed') !== 'true';
            button.setAttribute('aria-pressed', String(trendLoading));
        }
        paintTrends();
    });
}

/* ======================================================== 5 · calendar */

const SERVICES = [
    'Readings database',
    'Field gateway',
    'Reports',
    'Maps',
    'Alarm relay',
    'Work orders',
    'Invoices',
    'Telemetry archive',
    'Mail relay',
];
const OLDEST = '2026-08-10';
const TODAY = dayKey(NOW);
/** Was `service` backed up the night of `iso`? The same answer on every load. @param {string} iso @param {number} service */
const backedUp = (iso, service) => {
    if (iso === '2026-09-17') return false; // the night of the power cut
    if (iso === TODAY && lateArrived === false && service >= 7) return false; // two copies still running
    const h = Math.sin(Number(iso.replaceAll('-', '')) * 0.731 + service * 12.17) * 9999;
    return h - Math.floor(h) > 0.04;
};
let lateArrived = false;
/** The night's snapshot of a service: 02:00 in Brussels and a few minutes per service. @param {string} iso @param {number} service */
const snapshotAt = (iso, service) => Date.parse(`${iso}T00:00:00Z`) + service * 3 * MINUTE;

/** @returns {Record<string, import('./ports2.js').DayState>} */
const historyDays = () => {
    /** @type {Record<string, import('./ports2.js').DayState>} */
    const days = {};
    for (let t = Date.parse('2026-06-01T12:00:00Z'); dayKey(t) <= TODAY; t += DAY) {
        const iso = dayKey(t);
        if (iso < OLDEST) {
            days[iso] = { tone: 'before', label: 'before the first backup was kept' };
            continue;
        }
        const missing = SERVICES.filter((_, i) => !backedUp(iso, i));
        const done = SERVICES.length - missing.length;
        days[iso] = {
            tone: done === SERVICES.length ? 'ok' : done === 0 ? 'bad' : 'warn',
            count: `${done}/${SERVICES.length}`,
            label: `${done} of ${SERVICES.length} services backed up${missing.length && done ? `; missing: ${missing.join(', ')}` : ''}`,
        };
    }
    return days;
};

attachCalendars(document.getElementById('calendar') ?? document, { now });
const LEGEND = /** @type {{ tone: import('./ports2.js').DayTone, label: string }[]} */ ([
    { tone: 'ok', label: 'Every service backed up' },
    { tone: 'warn', label: 'Some missing' },
    { tone: 'bad', label: 'None backed up' },
    { tone: 'muted', label: 'Nothing to back up' },
    { tone: 'future', label: 'Still to come' },
    { tone: 'before', label: 'Before the first backup' },
]);
const calendarEls = all('[data-dp-calendar]');
for (const el of calendarEls) {
    setCalendarLegend(el, LEGEND);
    setCalendarDays(el, historyDays());
}

/** The page's own detail of a picked night. @param {HTMLElement} aside @param {string | null} iso */
const paintDetail = (aside, iso) => {
    if (!iso) {
        aside.innerHTML = "<p>Pick a day to see every service's own state that night.</p>";
        return;
    }
    const heading = Object.assign(document.createElement('h3'), { textContent: formatDay(iso) });
    const list = document.createElement('ul');
    if (iso > TODAY) list.append(Object.assign(document.createElement('li'), { textContent: 'A night still to come.' }));
    else if (iso < OLDEST) list.append(Object.assign(document.createElement('li'), { textContent: 'Before the first backup was kept.' }));
    else
        SERVICES.forEach((name, i) => {
            const li = document.createElement('li');
            const b = Object.assign(document.createElement('b'), { textContent: name });
            const ok = backedUp(iso, i);
            const span = Object.assign(document.createElement('span'), {
                textContent: ok ? `backed up ${formatMoment(snapshotAt(iso, i))}` : 'no backup that night',
            });
            if (!ok) li.dataset.dpMissing = '';
            li.append(b, span);
            list.append(li);
        });
    aside.replaceChildren(heading, list);
};
/** @type {Record<string, string | null>} */
const picked = { wide: null, narrow: null };
for (const aside of all('[data-dp-detail]')) paintDetail(aside, null);
for (const el of calendarEls) {
    el.addEventListener(CALENDAR_PICK_EVENT, (event) => {
        const which = el.dataset.dpCalendar ?? '';
        picked[which] = /** @type {CustomEvent<{ date: string }>} */ (event).detail.date;
        const aside = /** @type {HTMLElement | null} */ (document.querySelector(`[data-dp-detail="${which}"]`));
        if (aside) paintDetail(aside, picked[which]);
    });
}
for (const button of all('[data-dp-cal]')) {
    button.addEventListener('click', () => {
        const what = button.dataset.dpCal;
        if (what === 'live') {
            lateArrived = true;
            for (const el of calendarEls) setCalendarDays(el, historyDays());
            for (const aside of all('[data-dp-detail]')) paintDetail(aside, picked[aside.dataset.dpDetail ?? '']);
            return;
        }
        pressOnly(button);
        for (const el of calendarEls) {
            if (what === 'loading') setCalendarState(el, 'loading', `Reading the backups of ${SERVICES.length} services: 4 of ${SERVICES.length} read.`);
            else if (what === 'empty') setCalendarState(el, 'empty', 'No service keeps data, so there is nothing to check.');
            else if (what === 'error') setCalendarState(el, 'error', `None of the ${SERVICES.length} services could be read: the backup store did not answer.`);
            else {
                setCalendarState(el, 'ready');
                setCalendarDays(el, historyDays());
            }
        }
    });
}

/* =========================================================== 6 · graph */

/** @type {import('./ports2.js').GraphKind[]} */
const KINDS = [
    { kind: 'telemetry', label: 'Telemetry', hint: 'Readings sent to the control centre every minute', style: 'solid', colour: 'var(--chart-1)' },
    { kind: 'control', label: 'Remote control', hint: 'Commands from the control centre to the site', style: 'dash', colour: 'var(--chart-2)' },
    { kind: 'radio', label: 'Radio link', hint: 'A spare path over radio for when the line is down', style: 'dot', colour: 'var(--chart-4)' },
    { kind: 'planned', label: 'Planned', hint: 'A link that is ordered but not live yet', style: 'long-dash', colour: 'var(--muted-foreground)' },
    { kind: 'unused', label: 'Not used here', hint: 'A kind no link on this network has; the legend leaves it out', style: 'solid', colour: 'var(--chart-5)' },
];

let weights = false;
let liveTick = 0;
/** @returns {import('./ports2.js').GraphData} */
const network = () => {
    const sites = [
        ['ph1', 'Pump house 1', 'two pumps, ring main west'],
        ['ph2', 'Pump house 2', 'one pump, the old town'],
        ['ph3', 'Pump house 3', 'two pumps, ring main north'],
        ['ph4', 'Pump house 4', 'two pumps, the harbour'],
        ['ph5', 'Pump house 5', 'one pump, the hills'],
        ['ph6', 'Pump house 6', 'being built, live in November'],
        ['north', 'Reservoir North', 'level sensor and an inlet valve'],
        ['south', 'Reservoir South', 'level sensor and an inlet valve'],
        ['plant', 'Treatment plant', 'where the water comes from'],
    ];
    /** @type {import('./ports2.js').GraphNode[]} */
    const nodes = [
        { id: 'centre', label: 'Control centre', description: 'where every reading arrives', weight: weights ? 1 : null },
        ...sites.map(([id, label, description], i) => ({
            id,
            label,
            description: id === 'ph5' ? `${description}; its settings on site differ from the plan` : description,
            flag: id === 'ph5' ? /** @type {const} */ ('mismatch') : null,
            weight: weights ? ((i * 37 + liveTick * 13) % 100) / 100 : null,
        })),
        { id: 'weather', label: 'Weather service', description: 'an address outside the network', external: true },
        { id: 'energy', label: 'Energy supplier', description: 'an address outside the network', external: true },
    ];
    /** @type {import('./ports2.js').GraphEdge[]} */
    const edges = [
        ...sites.filter(([id]) => id !== 'ph6').map(([id]) => ({ from: id, to: 'centre', kind: 'telemetry', detail: 'readings every minute' })),
        { from: 'centre', to: 'ph1', kind: 'control', detail: 'pump start and stop' },
        { from: 'centre', to: 'ph3', kind: 'control', detail: 'pump start and stop, valve' },
        { from: 'centre', to: 'plant', kind: 'control', detail: 'intake rate' },
        { from: 'ph3', to: 'ph4', kind: 'radio', detail: 'spare path' },
        { from: 'ph4', to: 'centre', kind: 'radio', detail: 'spare path' },
        { from: 'centre', to: 'ph6', kind: 'planned', detail: 'fibre ordered' },
        { from: 'centre', to: 'energy', kind: 'planned', detail: 'tariff feed ordered' },
        { from: 'weather', to: 'centre', kind: 'telemetry', detail: liveTick % 2 ? 'rain radar every 5 min' : 'rain radar every 10 min' },
    ];
    return { nodes, edges, kinds: KINDS, hub: 'centre' };
};
/** Fifteen nodes, most with fourteen-letter names, some longer. @returns {import('./ports2.js').GraphData} */
const longNetwork = () => {
    const names = [
        'Booster site A',
        'Booster site B',
        'Booster site C',
        'Reservoir North-East high zone',
        'Booster site E',
        'Booster site F',
        'Treatment plant on the river',
        'Booster site H',
        'Booster site I',
        'Booster site J',
        'Booster site K',
        'Pumping station by the harbour',
        'Booster site M',
        'Booster site N',
    ];
    /** @type {import('./ports2.js').GraphNode[]} */
    const nodes = [
        { id: 'hub', label: 'Control centre', description: 'where every reading arrives' },
        ...names.map((label, i) => ({ id: `n${i}`, label, description: `site ${i + 1}`, weight: weights ? (i % 5) / 4 : null })),
    ];
    /** @type {import('./ports2.js').GraphEdge[]} */
    const edges = names.map((_, i) => ({ from: `n${i}`, to: 'hub', kind: i % 4 === 3 ? 'radio' : 'telemetry' }));
    edges.push({ from: 'hub', to: 'n2', kind: 'control' }, { from: 'hub', to: 'n2', kind: 'planned' });
    return { nodes, edges, kinds: KINDS, hub: 'hub' };
};

attachGraphs(document.getElementById('graph') ?? document);
const graphEls = all('[data-dp-graph-el]');
let longNames = false;
const fillGraphs = () => {
    for (const el of graphEls) setGraphData(el, longNames ? longNetwork() : network());
};
fillGraphs();
const graphOut = document.querySelector('[data-dp-graph-out]');
graphEls[0]?.addEventListener(GRAPH_CHANGE_EVENT, (event) => {
    const { selected, hiddenKinds } = /** @type {CustomEvent<{ selected: string[], hiddenKinds: string[] }>} */ (event).detail;
    const data = longNames ? longNetwork() : network();
    const name = (/** @type {string} */ id) => data.nodes.find((n) => n.id === id)?.label ?? id;
    const kind = (/** @type {string} */ k) => KINDS.find((x) => x.kind === k)?.label ?? k;
    if (graphOut)
        graphOut.textContent =
            (selected.length ? `Picked: ${selected.map(name).join(', ')}.` : 'Nothing picked.') +
            (hiddenKinds.length ? ` Hidden: ${hiddenKinds.map(kind).join(', ')}.` : ' Every kind of link is shown.');
});
for (const button of all('[data-dp-graph]')) {
    button.addEventListener('click', () => {
        const what = button.dataset.dpGraph;
        if (what === 'long' || what === 'weights') {
            const on = button.getAttribute('aria-pressed') !== 'true';
            button.setAttribute('aria-pressed', String(on));
            if (what === 'long') longNames = on;
            else weights = on;
            fillGraphs();
        } else if (what === 'live') {
            liveTick += 1;
            fillGraphs();
        } else if (what === 'loading') graphEls.forEach((el) => setGraphState(el, 'loading'));
        else if (what === 'empty') graphEls.forEach((el) => setGraphState(el, 'empty', 'Nothing to draw yet: no site has reported to the control centre.'));
        else if (what === 'error') graphEls.forEach((el) => setGraphState(el, 'error', 'The network could not be read: the control centre did not answer.'));
    });
}

/* ========================================================== 7 · help, tour */

let spotlight = false;
const MEMORY = 'dashboard-ports-2';
const help = /** @type {HTMLDialogElement | null} */ (document.querySelector('[data-dp-help]'));
const helpOpen = /** @type {HTMLElement | null} */ (document.querySelector('[data-dp-help-open]'));
const tourOut = document.querySelector('[data-dp-tour-out]');

/** @param {(name: string) => string} at @returns {import('./ports2.js').TourStep[]} */
const tourSteps = (at) => [
    { target: at('areas'), title: 'The areas', text: 'Five areas, always in the same place: the overview, the pump houses, their readings, incidents and backups.' },
    { target: at('search'), title: 'Search', text: 'Find a pump house by its name or its number; Ctrl K does the same from anywhere.' },
    { target: at('readings'), title: 'Readings today', text: 'How the network did since midnight; a dip in pressure shows here first.' },
    { target: at('map'), title: 'The map', text: 'Which site talks to which. (This page has no map, so this step is left out and the count says five.)' },
    { target: at('incidents'), title: 'Open incidents', text: 'What needs someone, and who is on it.' },
    { target: at('help'), title: 'Help', text: 'Everything here again, with the words this site uses. The tour starts from Help too.' },
];

const remembered = () => {
    try {
        return localStorage.getItem(tourMemoryKey(MEMORY)) === '1';
    } catch {
        return false;
    }
};
const sayTour = (/** @type {string} */ first) => {
    if (!tourOut) return;
    const auto = shouldStartTour({ search: location.search, remembered: remembered(), automated: navigator.webdriver });
    tourOut.textContent =
        `${first} Taken before: ${remembered() ? 'yes' : 'no'}. ` +
        `On a visit like this one it would start by itself: ${auto == null ? (navigator.webdriver ? 'no, this browser is driven by a script' : 'no, it was taken before') : 'yes (this demo waits for a button instead)'}.`;
};
sayTour('No tour yet.');

/** @param {'desktop' | 'phone'} where @param {HTMLElement | null} [returnFocus] */
const runTour = (where, returnFocus) => {
    const steps = tourSteps((name) => (where === 'phone' ? `[data-dp-tour-phone="${name}"]` : `[data-dp-tour-step="${name}"]`));
    let shown = 0;
    const tour = startTour(steps, {
        remember: MEMORY,
        spotlight,
        returnFocus,
        onEnd: (finished) => sayTour(finished ? `The tour ran to the end (${shown} steps).` : 'The tour was ended early.'),
    });
    shown = steps.filter((s) => typeof s.target === 'string' && document.querySelector(s.target)).length;
    if (!tour) sayTour('No step had its part on the page, so the tour did not start.');
};

helpOpen?.addEventListener('click', () => help?.showModal());
document.querySelector('[data-dp-help-close]')?.addEventListener('click', () => help?.close());
document.querySelector('[data-dp-help-tour]')?.addEventListener('click', () => {
    help?.close();
    runTour('desktop', helpOpen);
});
for (const button of all('[data-dp-tour]')) {
    button.addEventListener('click', () => {
        const what = button.dataset.dpTour;
        if (what === 'forget') {
            try {
                localStorage.removeItem(tourMemoryKey(MEMORY));
            } catch {
                // No storage: nothing was remembered.
            }
            sayTour('Forgotten.');
        } else runTour(what === 'phone' ? 'phone' : 'desktop');
    });
}

// The drawer as a phone shows it: a copy of Help, without its ids.
const copy = document.querySelector('[data-dp-help-copy]');
if (copy && help) {
    copy.innerHTML = help.innerHTML;
    for (const el of all('[id]', copy)) el.removeAttribute('id');
    for (const el of all('[data-dp-help-tour], [data-dp-help-close]', copy)) {
        el.removeAttribute('data-dp-help-tour');
        el.removeAttribute('data-dp-help-close');
    }
    copy.setAttribute('inert', '');
    copy.setAttribute('aria-label', 'Help, as a phone shows it');
}

// `?tour` starts it, as a consumer's first visit would.
if (new URLSearchParams(location.search).has('tour')) runTour('desktop');
