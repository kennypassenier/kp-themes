// research/app-homelab-schedules: the page's own wiring. The components are the package's (js/auto.js attaches the ones the
// markup carries, this file attaches the ones it draws); the file only feeds them sample data, presses their states and
// writes what they fire into a readout. Every sample is mock: fourteen schedules on a homelab fleet, the host's nightly round
// at 02:00, the job numbers.

import { setStrings } from '../../js/strings.js';

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

/** @param {string} id @param {string} text */
const say = (id, text) => {
    const out = document.getElementById(id);
    if (out) out.textContent = text;
};

/** Press a state button: exactly one of the group is pressed. @param {string} attribute @param {(value: string) => void} apply */
function stateButtons(attribute, apply) {
    const buttons = /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll(`[${attribute}]`)]);
    for (const button of buttons) {
        button.addEventListener('click', () => {
            press(attribute, button.getAttribute(attribute) ?? '');
            apply(button.getAttribute(attribute) ?? '');
        });
    }
}

/** @param {string} attribute @param {string} value */
function press(attribute, value) {
    for (const b of document.querySelectorAll(`[${attribute}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attribute) === value));
}

/** @param {number} n exact, with a thousands separator */
const count = (n) => n.toLocaleString('en-GB');
const pad = (/** @type {number} */ n) => String(n).padStart(2, '0');

// ── the host's clock: Europe/Brussels ──────────────────────────────────────────────────────────────────────────
const ZONE = 'Europe/Brussels';
const MIN = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKDAY_NAMES = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const zoneFormat = new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONE,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'short',
});

/** The wall clock of the host at a moment. @param {number} ms @returns {{ y: number, m: number, d: number, hh: number, mm: number, wd: number }} wd 0 = Monday */
function parts(ms) {
    /** @type {Record<string, string>} */
    const p = {};
    for (const x of zoneFormat.formatToParts(new Date(ms))) p[x.type] = x.value;
    return { y: +p.year, m: +p.month, d: +p.day, hh: +p.hour % 24, mm: +p.minute, wd: WEEKDAYS.indexOf(p.weekday) };
}

/** The moment a wall-clock minute of the host names (the first of two in the repeated autumn hour). @returns {number} */
function instant(/** @type {number} */ y, /** @type {number} */ m, /** @type {number} */ d, /** @type {number} */ hh, /** @type {number} */ mm) {
    const want = Date.UTC(y, m - 1, d, hh, mm);
    let guess = want;
    for (let i = 0; i < 3; i++) {
        const p = parts(guess);
        guess += want - Date.UTC(p.y, p.m - 1, p.d, p.hh, p.mm);
    }
    return guess;
}

/** dd/mm/yyyy HH:mm in the host's clock. @param {number} ms */
function dateTime(ms) {
    const p = parts(ms);
    return `${pad(p.d)}/${pad(p.m)}/${p.y} ${pad(p.hh)}:${pad(p.mm)}`;
}
/** "Tue 20/10/2026 03:30". @param {number} ms */
const withWeekday = (ms) => `${WEEKDAYS[parts(ms).wd]} ${dateTime(ms)}`;
/** "2 h 13 min", "35 min", "3 days": the coarsest honest distance. @param {number} ms */
function distance(ms) {
    const min = Math.round(ms / MIN);
    if (min < 1) return 'less than a minute';
    if (min < 60) return `${min} min`;
    if (min < 48 * 60) return `${Math.floor(min / 60)} h ${pad(min % 60)} min`;
    return `${Math.round(min / 1440)} days`;
}

const NOW = Date.now();
const midnightOf = (/** @type {number} */ ms) => {
    const p = parts(ms);
    return instant(p.y, p.m, p.d, 0, 0);
};
const TODAY = midnightOf(NOW);

// ── the sample schedules (mock) ────────────────────────────────────────────────────────────────────────────────
/** @typedef {{ every: 'day', at: string } | { every: 'week', days: number[], at: string } | { every: 'once', date: string, at: string }} When */
/** @typedef {{ id: string, stack: string, action: string, when: When, enabled: boolean, note: string, history: string }} Schedule history: 14 slots, oldest first: r ran, s skipped, m missed, - no slot yet */

const ACTIONS = {
    backup: { label: 'Back up', series: 1 },
    update: { label: 'Update', series: 2 },
    patch: { label: 'Patch the fleet', series: 3 },
    deploy: { label: 'Deploy', series: 4 },
    'restore-test': { label: 'Restore test', series: 5 },
};
const NIGHTLY = '02:00';

/** @type {Schedule[]} */
const BASE = [
    { id: 's01', stack: 'immich', action: 'backup', when: { every: 'day', at: '12:00' }, enabled: true, note: 'Photos land during the day', history: 'rrrrrrrrrrrrrr' },
    { id: 's02', stack: 'vaultwarden', action: 'backup', when: { every: 'day', at: '03:30' }, enabled: true, note: 'Passwords: never skip', history: 'rrrrrrrrrrrrrr' },
    { id: 's03', stack: 'paperless', action: 'backup', when: { every: 'week', days: [0, 3], at: '03:30' }, enabled: true, note: 'Scans arrive Mondays and Thursdays', history: 'rrrrmrrrrrrrrr' },
    { id: 's04', stack: 'host', action: 'patch', when: { every: 'week', days: [6], at: '22:00' }, enabled: true, note: 'apt dist-upgrade every container', history: 'rrrrrrrrsrrrrr' },
    { id: 's05', stack: 'jellyfin', action: 'update', when: { every: 'week', days: [5], at: '05:00' }, enabled: true, note: 'Pinned to the 10.11 line', history: 'rrrrrrrrrrrrrr' },
    { id: 's06', stack: 'grafana', action: 'update', when: { every: 'week', days: [5], at: '05:00' }, enabled: true, note: '', history: 'rrrrrrrrrrrsrr' },
    { id: 's07', stack: 'prometheus', action: 'restore-test', when: { every: 'week', days: [2], at: '04:00' }, enabled: false, note: 'Off while metrics is rebuilt (CT 113)', history: 'rrrrrrrrrr----' },
    { id: 's08', stack: 'traefik', action: 'backup', when: { every: 'day', at: '02:00' }, enabled: true, note: 'Same minute as the nightly round', history: 'rrrrrsrrrrrrrr' },
    { id: 's09', stack: 'kyu', action: 'backup', when: { every: 'week', days: [0, 1, 2, 3, 4], at: '18:00' }, enabled: true, note: 'CT 109, after working hours', history: 'rrrrrrrrrrrrrr' },
    { id: 's10', stack: 'loki', action: 'deploy', when: { every: 'once', date: ymd(TODAY + 6 * DAY), at: '20:00' }, enabled: true, note: 'Release outside working hours', history: '-------------' + '-' },
    { id: 's11', stack: 'syncthing', action: 'backup', when: { every: 'day', at: '04:15' }, enabled: true, note: 'CT 108', history: 'rrrrrrrrrrmrrr' },
    { id: 's12', stack: 'almanac', action: 'backup', when: { every: 'week', days: [5, 6], at: '09:00' }, enabled: true, note: 'CT 112, weekend only', history: 'rrrrrrrrrrrrrr' },
    { id: 's13', stack: 'inbox', action: 'update', when: { every: 'week', days: [2], at: '21:30' }, enabled: true, note: 'CT 118', history: 'rrrrrrrrrrrrrr' },
    { id: 's14', stack: 'metrics', action: 'restore-test', when: { every: 'week', days: [0], at: '06:00' }, enabled: true, note: 'CT 113: a restore must work, not just exist', history: 'rrrrrrrrrrrrsr' },
];

/** @param {number} ms YYYY-MM-DD in the host's clock */
function ymd(ms) {
    const p = parts(ms);
    return `${p.y}-${pad(p.m)}-${pad(p.d)}`;
}

const STACKS = ['immich', 'paperless', 'vaultwarden', 'jellyfin', 'traefik', 'prometheus', 'grafana', 'loki', 'syncthing', 'kyu', 'almanac', 'inbox', 'metrics', 'admin'];

/** A fleet of 140: the 14 above, then the same shapes on numbered clones, so counts past 99 are real. @param {number} size @returns {Schedule[]} */
function fleet(size) {
    if (size <= BASE.length) return BASE.slice(0, size);
    /** @type {Schedule[]} */
    const out = [...BASE];
    for (let i = BASE.length; i < size; i++) {
        const src = BASE[i % BASE.length];
        const copy = Math.floor(i / BASE.length) + 1;
        const at = src.when.at.split(':').map(Number);
        const minutes = (at[0] * 60 + at[1] + 7 * copy) % 1440;
        const when = { ...src.when, at: `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}` };
        out.push({ ...src, id: `s${String(i + 1).padStart(3, '0')}`, stack: `${src.stack}-${copy}`, when: /** @type {When} */ (when), history: src.history });
    }
    return out;
}

/** The runs of a schedule in [from, to), oldest first. @param {When} when @param {number} from @param {number} to @returns {number[]} */
function runsBetween(when, from, to) {
    const [h, m] = when.at.split(':').map(Number);
    if (when.every === 'once') {
        const x = /^(\d{4})-(\d{2})-(\d{2})$/.exec(when.date);
        if (!x) return [];
        const t = instant(+x[1], +x[2], +x[3], h, m);
        return t >= from && t < to ? [t] : [];
    }
    const a = parts(from);
    const days = Math.ceil((to - from) / DAY) + 2;
    /** @type {number[]} */
    const out = [];
    for (let k = -1; k <= days; k++) {
        const c = new Date(Date.UTC(a.y, a.m - 1, a.d + k));
        const wd = (c.getUTCDay() + 6) % 7;
        if (when.every === 'week' && !when.days.includes(wd)) continue;
        const t = instant(c.getUTCFullYear(), c.getUTCMonth() + 1, c.getUTCDate(), h, m);
        if (t >= from && t < to && !out.includes(t)) out.push(t);
    }
    return out.sort((x, y) => x - y);
}

/** The next `n` runs strictly after a moment. @param {When} when @param {number} after @param {number} n */
function nextRuns(when, after, n) {
    /** @type {number[]} */
    const out = [];
    let from = after + 1;
    for (let i = 0; i < 60 && out.length < n; i++) {
        out.push(...runsBetween(when, from, from + 7 * DAY));
        if (when.every === 'once') break;
        from += 7 * DAY;
    }
    return out.slice(0, n);
}

/** The cadence in words. @param {When} w */
function cadence(w) {
    if (w.every === 'day') return `every day at ${w.at}`;
    if (w.every === 'once') {
        const [y, m, d] = w.date.split('-');
        return `once on ${d}/${m}/${y} at ${w.at}`;
    }
    const d = [...w.days].sort();
    const text =
        d.length === 7 ? 'every day' : d.join() === '0,1,2,3,4' ? 'on weekdays' : d.join() === '5,6' ? 'at the weekend' : `on ${d.map((x) => WEEKDAYS[x]).join(', ')}`;
    return `${text} at ${w.at}`;
}

/** @param {Schedule} s */
const titleOf = (s) => `${ACTIONS[/** @type {keyof typeof ACTIONS} */ (s.action)].label} · ${s.stack === 'host' ? 'the whole host' : s.stack}`;

/** A short cadence for a cell or a lane: "Daily 03:30", "Mon, Thu 03:30", "Weekend 09:00". @param {When} w */
function shortWhen(w) {
    if (w.every === 'day') return `Daily ${w.at}`;
    if (w.every === 'once') return `${w.date.split('-').reverse().slice(0, 2).join('/')} ${w.at}`;
    const d = [...w.days].sort();
    const text = d.length === 7 ? 'Daily' : d.join() === '0,1,2,3,4' ? 'Weekdays' : d.join() === '5,6' ? 'Weekend' : d.map((x) => WEEKDAYS[x]).join(', ');
    return `${text} ${w.at}`;
}
/** Action and stack as short as a lane label can be. @param {Schedule} s */
const laneOf = (s) => `${s.action === 'patch' ? 'Patch' : ACTIONS[/** @type {keyof typeof ACTIONS} */ (s.action)].label} · ${s.stack === 'host' ? 'pve' : s.stack}`;

/** Another schedule (or the host's nightly round) that starts in the very same minute as this slot. @param {Schedule[]} all @param {Schedule} s @param {number} slot */
function clashOf(all, s, slot) {
    const p = parts(slot);
    if (`${pad(p.hh)}:${pad(p.mm)}` === NIGHTLY && s.id !== 'nightly') return "the host's nightly round";
    for (const o of all) {
        if (o.id === s.id || !o.enabled) continue;
        if (runsBetween(o.when, slot, slot + 1).length) return titleOf(o);
    }
    return null;
}

// ── week ───────────────────────────────────────────────────────────────────────────────────────────────────────
if (document.getElementById('week-component')) {
    const { setWeekEvents, setWeekLegend, setWeekState, WEEK_OPEN_EVENT } = await import('../../js/week.js');
    await ready;
    const el = /** @type {HTMLElement} */ (document.getElementById('hs-week'));
    const all = BASE;
    let off = 'dimmed';
    let data = 'ready';
    let timer = 0;

    const events = () => {
        /** @type {import('../../js/week.js').WeekEvent[]} */
        const out = [];
        const from = TODAY - 14 * DAY;
        const to = TODAY + 63 * DAY;
        const upcoming = all
            .filter((s) => s.enabled)
            .flatMap((s) => nextRuns(s.when, NOW, 1).map((at) => ({ s, at })))
            .sort((a, b) => a.at - b.at)[0];
        for (const s of all) {
            if (!s.enabled && off === 'hidden') continue;
            for (const at of runsBetween(s.when, from, to)) {
                const clash = clashOf(all, s, at);
                out.push({
                    id: `${s.id}@${at}`,
                    start: at,
                    label: s.stack === 'host' ? 'whole host' : s.stack,
                    series: /** @type {1 | 2 | 3 | 4 | 5} */ (ACTIONS[/** @type {keyof typeof ACTIONS} */ (s.action)].series),
                    ...(!s.enabled ? { state: /** @type {'off'} */ ('off') } : upcoming && upcoming.s.id === s.id && upcoming.at === at ? { state: /** @type {'next'} */ ('next') } : {}),
                    detail: `${withWeekday(at)} · ${cadence(s.when)}${s.enabled ? '' : ' · turned off'}${clash ? ` · same minute as ${clash}` : ''}`,
                });
            }
        }
        for (let d = -14; d < 63; d++) {
            const at = runsBetween({ every: 'day', at: NIGHTLY }, TODAY + d * DAY, TODAY + (d + 1) * DAY)[0];
            if (at) out.push({ id: `nightly@${at}`, start: at, label: 'Host nightly round', series: 5, state: 'reference', detail: `${withWeekday(at)} · backups and updates of the host itself, for reference` });
        }
        return out;
    };

    const draw = () => {
        window.clearTimeout(timer);
        if (data === 'ready') {
            setWeekEvents(el, events());
            setWeekState(el, 'ready');
        } else if (data === 'loading') setWeekState(el, 'loading');
        else if (data === 'empty') {
            setWeekEvents(el, []);
            setWeekState(el, 'empty', 'No schedule has a run in this week.');
        } else setWeekState(el, 'error', 'The schedules could not be read: the host did not answer.');
    };
    setWeekLegend(el, Object.values(ACTIONS).map((a) => ({ series: /** @type {1 | 2 | 3 | 4 | 5} */ (a.series), label: a.label })));
    draw();

    stateButtons('data-hs-week-data', (v) => {
        data = v;
        draw();
    });
    stateButtons('data-hs-week-off', (v) => {
        off = v;
        press('data-hs-week-off', v);
        if (data === 'ready') setWeekEvents(el, events());
    });
    stateButtons('data-hs-week-width', (v) => {
        document.getElementById('hs-weekbox')?.toggleAttribute('data-phone', v === 'phone');
    });
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id !== 'week-off-default') return;
        off = detail.value === 'hidden' ? 'hidden' : 'dimmed';
        press('data-hs-week-off', off);
        if (data === 'ready') setWeekEvents(el, events());
    });
    el.addEventListener(WEEK_OPEN_EVENT, (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        say('hs-week-log', `kp-week-open ${d.source}\n${d.event.label}, ${d.event.detail}: the page would scroll to its row in the table`);
    });
    el.addEventListener('kp-week-retry', () => {
        data = 'loading';
        press('data-hs-week-data', 'loading');
        draw();
        timer = window.setTimeout(() => {
            data = 'ready';
            press('data-hs-week-data', 'ready');
            draw();
        }, 1400);
    });
    // The clock of every other section reads the same data.
    document.addEventListener('hs-change', () => data === 'ready' && setWeekEvents(el, events()));
}

// ── the next run ───────────────────────────────────────────────────────────────────────────────────────────────
if (document.getElementById('next-component')) {
    await ready;
    const { countdownOf, COUNTDOWN_END_EVENT } = await import('../../js/countdown.js');
    const { setRuns } = await import('../../js/runs.js');
    const { setCardState } = await import('../../js/card-state.js');
    const card = /** @type {HTMLElement} */ (document.getElementById('hs-hero'));
    const countdown = /** @type {HTMLElement} */ (document.getElementById('hs-countdown'));
    const then = /** @type {HTMLElement} */ (document.getElementById('hs-then'));
    const all = BASE;
    let which = 'planned';
    let clock = 'stopped';
    /** @type {Set<string>} */
    const skipped = new Set();
    let job = 4412;
    let timer = 0;

    /** @returns {{ s: Schedule, at: number } | null} */
    const upcoming = () => {
        if (which === 'none') return null;
        if (which === 'soon') return { s: all[1], at: Date.now() + 8000 };
        /** @type {{ s: Schedule, at: number }[]} */
        const list = [];
        for (const s of all) {
            if (!s.enabled) continue;
            for (const at of nextRuns(s.when, NOW, 4)) if (!skipped.has(`${s.id}@${at}`)) list.push({ s, at });
        }
        list.sort((a, b) => a.at - b.at);
        return list[0] ?? null;
    };

    const draw = () => {
        window.clearTimeout(timer);
        const next = upcoming();
        const note = /** @type {HTMLElement} */ (document.getElementById('hs-hero-note'));
        note.textContent = '';
        if (!next) {
            setCardState(card, 'empty', { title: 'No run planned', text: 'Every schedule is off or has no further run. Turn one on in the table.' });
            return;
        }
        setCardState(card, 'ready');
        const { s, at } = next;
        say('hs-hero-title', titleOf(s));
        say('hs-hero-when', `${withWeekday(at)} · ${cadence(s.when)}`);
        const clockObj = countdownOf(countdown);
        clockObj?.reset(Math.max(1, Math.round((at - Date.now()) / 1000)));
        if (clock === 'running') clockObj?.start();
        /** @type {{ at: number, conflict?: string }[]} */
        const runs = nextRuns(s.when, at, 3).map((x) => {
            const clash = clashOf(all, s, x);
            return clash ? { at: x, conflict: `Same minute as ${clash}` } : { at: x };
        });
        setRuns(then, runs, { reason: 'This was the last run of the schedule.' });
    };

    draw();
    countdown.addEventListener(COUNTDOWN_END_EVENT, () => {
        const next = upcoming();
        if (!next) return;
        job += 1;
        const note = /** @type {HTMLElement} */ (document.getElementById('hs-hero-note'));
        note.textContent = `Started just now as job ${job}; it runs on Activity. Moving on to the next schedule.`;
        timer = window.setTimeout(() => {
            which = 'planned';
            press('data-hs-next-case', 'planned');
            press('data-hs-next-clock', 'stopped');
            clock = 'stopped';
            draw();
        }, 3200);
    });
    stateButtons('data-hs-next-case', (v) => {
        which = v;
        if (v === 'soon') {
            clock = 'running';
            press('data-hs-next-clock', 'running');
        }
        draw();
    });
    stateButtons('data-hs-next-clock', (v) => {
        clock = v;
        const c = countdownOf(countdown);
        if (v === 'running') c?.start();
        else c?.pause();
    });
    stateButtons('data-hs-next-data', (v) => {
        window.clearTimeout(timer);
        if (v === 'ready') draw();
        else if (v === 'loading') setCardState(card, 'loading');
        else setCardState(card, 'error', { title: 'The next run could not be read', text: 'The host did not answer. The schedules are unchanged.' });
    });
    card.addEventListener('kp-card-retry', () => {
        setCardState(card, 'loading');
        press('data-hs-next-data', 'loading');
        timer = window.setTimeout(() => {
            press('data-hs-next-data', 'ready');
            draw();
        }, 1300);
    });
    document.getElementById('hs-run-now')?.addEventListener('click', () => {
        const next = upcoming();
        if (!next) return;
        const note = /** @type {HTMLElement} */ (document.getElementById('hs-hero-note'));
        note.textContent = `Would start ${titleOf(next.s)} now as job ${job + 1}; the schedule keeps its slot at ${next.at ? dateTime(next.at) : ''}.`;
    });
    document.getElementById('hs-skip')?.addEventListener('click', () => {
        const next = upcoming();
        if (!next || which === 'soon') return;
        skipped.add(`${next.s.id}@${next.at}`);
        draw();
        const after = upcoming();
        const note = /** @type {HTMLElement} */ (document.getElementById('hs-hero-note'));
        note.textContent = `Skipped ${withWeekday(next.at)}. Only this run: ${titleOf(next.s)} stays on.${after ? '' : ''}`;
        document.dispatchEvent(new CustomEvent('hs-change'));
    });
}

// ── the schedule form ───────────────────────────────────────────────────────────────────────────────────────────
/** @typedef {{ every: string, action: string, stack: string, days: string[], date: string, at: string, note: string }} Draft */

let uid = 0;
/** @param {Schedule | null} s @returns {Draft} */
function draftOf(s) {
    if (!s) return { action: 'backup', stack: 'jellyfin', every: 'day', days: ['tue', 'fri'], date: '', at: '03:00', note: '' };
    const w = s.when;
    return {
        action: s.action,
        stack: s.stack,
        every: w.every,
        days: w.every === 'week' ? w.days.map((d) => WEEKDAY_NAMES[d]) : [],
        date: w.every === 'once' ? w.date.split('-').reverse().join('/') : '',
        at: w.at,
        note: s.note,
    };
}

/** The html of a drawer's content: head with the unsaved bar, the sentence form, the preview, the foot. @param {number} n @param {string} title */
function drawerHtml(n, title) {
    const opt = (/** @type {string} */ v, /** @type {string} */ label) => `<option value="${v}">${label}</option>`;
    return `
    <header class="kp-drawer__head">
        <h3 class="kp-dialog__title" id="hs-ft-${n}">${title}</h3>
        <p class="kp-drawer__desc">Complete the sentence. The host plans in its own clock (Europe/Brussels).</p>
        <div class="hs-unsavedslot"><div class="kp-unsaved" data-kp-unsaved data-kp-unsaved-for="#hs-f-${n}" data-kp-name="hs-f-${n}" data-kp-placement="header" data-kp-keep="off" data-kp-warn-leave="off" id="hs-u-${n}"></div></div>
    </header>
    <div class="kp-drawer__body hs-drawerbody">
        <form class="hs-form" id="hs-f-${n}" action="#" novalidate>
            <fieldset class="kp-sentence" data-kp-sentence>
                <legend class="kp-sr-only">Schedule</legend>
                <p class="kp-sentence__text">
                    Run
                    <span class="kp-sentence__field"><select name="action" aria-label="What to run">${Object.entries(ACTIONS)
                        .map(([v, a]) => opt(v, a.label.toLowerCase()))
                        .join('')}</select></span>
                    on
                    <span class="kp-sentence__field" data-hs-stackfield><select name="stack" aria-label="Which stack">${['host', ...STACKS].map((v) => opt(v, v === 'host' ? 'the whole host' : v)).join('')}</select></span>
                    <span class="kp-sentence__field"><select name="every" aria-label="How often">${opt('day', 'every day')}${opt('week', 'every week')}${opt('once', 'once')}</select></span><span class="kp-sentence__when" data-kp-show-when="every=week">
                        on
                        <span class="kp-sentence__field" data-kp-block><span class="kp-weekdays" data-kp-weekdays data-kp-presets="false" data-kp-summary="false" aria-label="Run on"></span></span></span><span class="kp-sentence__when" data-kp-show-when="every=once" hidden>
                        on
                        <span class="kp-sentence__field"><input name="date" size="10" placeholder="dd/mm/yyyy" aria-label="Date (dd/mm/yyyy)" /></span></span>
                    at
                    <span class="kp-sentence__field"><span class="kp-time" data-kp-time data-kp-time-look="inline" data-kp-time-step="15" data-kp-name="at" data-kp-label="At (24 hours)" data-kp-time-presets="Nightly + 1 h=03:00,Lunch=12:00,Evening=22:00" data-kp-time-near="02:00" data-kp-time-near-width="20"></span></span>.
                </p>
            </fieldset>
            <div class="kp-formrow hs-noterow">
                <div class="kp-formrow__label">Note<small>Shown in the table, never used by the host</small></div>
                <div class="kp-formrow__control"><input class="kp-field__input" name="note" aria-label="Note" maxlength="120" /></div>
            </div>
            <div class="hs-clash" data-hs-clash hidden>
                <div class="kp-alert kp-alert--warning" role="status" data-kp-semantic><span><span class="kp-alert__label">Warning: </span><span data-hs-clash-text></span></span></div>
                <button type="button" class="kp-button" data-hs-clash-move>Move 15 minutes later</button>
            </div>
            <div class="hs-preview">
                <div class="kp-runs" data-kp-runs data-kp-time-zone="${ZONE}" data-hs-preview></div>
            </div>
        </form>
    </div>
    <footer class="kp-drawer__foot hs-drawerfoot">
        <button type="button" class="kp-button" data-hs-close>Close</button>
    </footer>`;
}

// The time field's own module.
const timeModule = await import('../../js/timefield.js');
const sentenceModule = await import('../../js/sentence.js');
const weekdaysModule = await import('../../js/weekdays.js');
const unsavedModule = await import('../../js/unsaved.js');
const runsModule = await import('../../js/runs.js');

/**
 * Build the form into `host` and return its controller.
 * @param {HTMLElement} host
 * @param {{ title: string, schedule: Schedule | null, answer: () => string, onClose: () => void, log: (text: string) => void, stacksLoading: () => boolean }} o
 */
function buildForm(host, o) {
    const n = ++uid;
    host.innerHTML = drawerHtml(n, o.title);
    const form = /** @type {HTMLFormElement} */ (host.querySelector('form'));
    const d = draftOf(o.schedule);
    const set = (/** @type {string} */ name, /** @type {string} */ v) => {
        const c = /** @type {HTMLInputElement | HTMLSelectElement | null} */ (form.elements.namedItem(name));
        if (c) c.value = v;
    };
    set('action', d.action);
    set('stack', d.stack);
    set('every', d.every);
    set('date', d.date);
    set('note', d.note);
    const weekdays = /** @type {HTMLElement} */ (form.querySelector('[data-kp-weekdays]'));
    weekdays.setAttribute('data-kp-value', d.days.join(','));
    const timeEl = /** @type {HTMLElement} */ (form.querySelector('[data-kp-time]'));
    timeEl.setAttribute('data-kp-value', d.at);

    sentenceModule.attachSentences(host);
    weekdaysModule.attachWeekdays(host);
    timeModule.attachTimes(host);
    runsModule.attachRuns(host);
    unsavedModule.attachUnsaved(host);
    const bar = /** @type {HTMLElement} */ (host.querySelector('[data-kp-unsaved]'));
    const preview = /** @type {HTMLElement} */ (host.querySelector('[data-hs-preview]'));
    const clash = /** @type {HTMLElement} */ (host.querySelector('[data-hs-clash]'));
    const stackField = /** @type {HTMLElement} */ (host.querySelector('[data-hs-stackfield]'));

    /** @returns {When | null} */
    const whenNow = () => {
        const every = /** @type {HTMLSelectElement} */ (form.elements.namedItem('every')).value;
        const at = timeModule.timeValue(timeEl);
        if (!/^\d\d:\d\d$/.test(at)) return null;
        if (every === 'day') return { every: 'day', at };
        if (every === 'week') {
            const days = weekdaysModule.weekdaysOf(weekdays).filter((x) => typeof x === 'number').map((x) => (Number(x) + 6) % 7);
            return days.length ? { every: 'week', days, at } : null;
        }
        const m = /^(\d\d)\/(\d\d)\/(\d{4})$/.exec(/** @type {HTMLInputElement} */ (form.elements.namedItem('date')).value.trim());
        return m ? { every: 'once', date: `${m[3]}-${m[2]}-${m[1]}`, at } : null;
    };

    const refresh = () => {
        const when = whenNow();
        const action = /** @type {HTMLSelectElement} */ (form.elements.namedItem('action')).value;
        const stack = /** @type {HTMLSelectElement} */ (form.elements.namedItem('stack')).value;
        if (!when) {
            runsModule.setRuns(preview, [], {
                reason: 'Pick the days, a date and a time to see the next runs.',
            });
            clash.hidden = true;
            return;
        }
        /** @type {Schedule} */
        const me = { id: o.schedule?.id ?? 'new', stack, action, when, enabled: true, note: '', history: '' };
        const others = BASE.filter((s) => s.id !== me.id);
        let found = '';
        const times = nextRuns(when, Date.now(), 5).map((t) => {
            const c = clashOf([...others, me], me, t);
            if (c && !found) found = `${withWeekday(t)} starts in the same minute as ${c}.`;
            return c ? { at: t, conflict: `Same minute as ${c}` } : { at: t };
        });
        runsModule.setRuns(preview, times, { reason: 'No run is left: the date has passed.' });
        clash.hidden = !found;
        const text = clash.querySelector('[data-hs-clash-text]');
        if (text) text.textContent = found;
    };
    form.addEventListener('input', refresh);
    form.addEventListener('change', refresh);
    form.addEventListener('kp-weekdays-change', refresh);
    form.addEventListener('kp-time-change', refresh);
    form.addEventListener('submit', (e) => e.preventDefault());
    host.querySelector('[data-hs-clash-move]')?.addEventListener('click', () => {
        const at = timeModule.timeValue(timeEl).split(':').map(Number);
        const next = (at[0] * 60 + at[1] + 15) % 1440;
        timeModule.setTime(timeEl, `${pad(Math.floor(next / 60))}:${pad(next % 60)}`, { fire: true });
        refresh();
    });
    stackField.toggleAttribute('data-hs-stacks', true);
    const stacks = () => sentenceModule.setSentenceFieldState(stackField, o.stacksLoading() ? 'loading' : 'ready');
    stacks();

    bar.addEventListener('kp-unsaved-save', (event) => {
        event.preventDefault();
        unsavedModule.setUnsavedSaving(bar, true);
        window.setTimeout(() => {
            const changes = unsavedModule.unsaved(bar)?.changes() ?? [];
            if (o.answer() === 'refused' && changes.length) {
                const key = changes[changes.length - 1].key;
                unsavedModule.unsavedSaved(bar, { refused: { [key]: 'The host cannot plan this: it is inside the maintenance window of pve (Sun 22:00 to 23:00).' } });
                o.log(`kp-unsaved-save\nthe host refused ${key}: it stays marked with its reason`);
            } else {
                unsavedModule.unsavedSaved(bar);
                o.log(`kp-unsaved-save\nsaved ${changes.length} ${changes.length === 1 ? 'change' : 'changes'}: PUT /data/schedules`);
            }
        }, 700);
    });
    bar.addEventListener('kp-unsaved-discard', () => o.log('kp-unsaved-discard\nevery value is back; Undo is offered for six seconds'));

    /** Close asks first when there are changes: a click outside never loses them. */
    const close = () => {
        const dirty = unsavedModule.unsaved(bar)?.changes().length ?? 0;
        if (!dirty) return o.onClose();
        import('../../js/components.js').then(({ openConfirmation }) => {
            const button = /** @type {HTMLElement} */ (host.querySelector('[data-hs-close]'));
            openConfirmation(button, {
                phrase: `Close and lose ${dirty} ${dirty === 1 ? 'change' : 'changes'}?`,
                acceptLabel: 'Close and lose them',
                initialFocus: 'cancel',
                onAccept: () => {
                    unsavedModule.discardUnsaved(bar);
                    o.onClose();
                },
            });
        });
    };
    host.querySelector('[data-hs-close]')?.addEventListener('click', close);
    window.setTimeout(() => unsavedModule.markUnsavedClean(bar), 150);
    refresh();
    return { close, refresh, stacks, element: host, bar, form };
}

if (document.getElementById('form-component')) {
    await ready;
    const inline = /** @type {HTMLElement} */ (document.getElementById('hs-form-inline'));
    const dialog = /** @type {HTMLDialogElement} */ (document.getElementById('hs-drawer'));
    let which = 'new';
    let answer = 'ok';
    let stacksState = 'ready';
    /** @type {ReturnType<typeof buildForm> | null} */
    let live = null;
    /** @type {ReturnType<typeof buildForm> | null} */
    let modal = null;

    const schedule = () => (which === 'edit' ? BASE[1] : which === 'collide' ? BASE[2] : null);
    const title = () => (which === 'new' ? 'New schedule' : `Edit schedule: ${titleOf(/** @type {Schedule} */ (schedule()))}`);
    const log = (/** @type {string} */ t) => say('hs-form-log', t);
    const options = () => ({ title: title(), schedule: schedule(), answer: () => answer, log, stacksLoading: () => stacksState === 'loading' });

    const mountInline = () => {
        inline.innerHTML = '';
        const panel = document.createElement('div');
        panel.className = 'kp-drawer hs-drawerpanel';
        inline.append(panel);
        live = buildForm(panel, {
            ...options(),
            onClose: () => {
                log('Closed. The page would slide the drawer away; the sample opens it again fresh.');
                mountInline();
            },
        });
    };
    mountInline();

    stateButtons('data-hs-form-case', (v) => {
        which = v;
        mountInline();
    });
    stateButtons('data-hs-form-answer', (v) => {
        answer = v;
    });
    stateButtons('data-hs-form-stacks', (v) => {
        stacksState = v;
        live?.stacks();
        modal?.stacks();
    });
    document.getElementById('hs-form-open-drawer')?.addEventListener('click', () => {
        modal = buildForm(dialog, {
            ...options(),
            onClose: () => dialog.close(),
        });
        dialog.showModal();
    });
    // Esc and a click on the backdrop ask first when something changed.
    dialog.addEventListener('cancel', (event) => {
        if ((modal && unsavedModule.unsaved(modal.bar)?.changes().length) ?? 0) {
            event.preventDefault();
            modal?.close();
        }
    });
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog && modal) modal.close();
    });
}

// ── where the form opens ─────────────────────────────────────────────────────────────────────────────────────────
if (document.getElementById('surface-component')) {
    await ready;
    const { masterDetail, setPaneState, PANE_SELECT_EVENT, PANE_RETRY_EVENT } = await import('../../js/master-detail.js');
    const root = /** @type {HTMLElement} */ (document.getElementById('hs-panes'));
    const frame = /** @type {HTMLElement} */ (document.querySelector('[data-hs-surface-frame]'));
    const list = /** @type {HTMLElement} */ (document.getElementById('hs-pane-list'));
    const body = /** @type {HTMLElement} */ (document.getElementById('hs-pane-body'));
    const side = /** @type {HTMLElement} */ (document.getElementById('hs-sidedrawer'));
    let mode = 'drawer';
    let data = 'ready';
    /** @type {string | null} */
    let current = null;
    /** @type {ReturnType<typeof buildForm> | null} */
    let form = null;

    list.innerHTML = BASE.map(
        (s) =>
            `<li role="option" data-kp-pane-key="${s.id}"><span class="hs-pane__what"><b>${titleOf(s)}</b><small>${cadence(s.when)}${s.enabled ? '' : ' · off'}</small></span></li>`,
    ).join('');
    const handle = masterDetail(root);

    const showForm = (/** @type {string} */ id) => {
        const s = BASE.find((x) => x.id === id);
        if (!s) return;
        current = id;
        const target = mode === 'drawer' ? side : body;
        const other = mode === 'drawer' ? body : side;
        other.innerHTML = '';
        side.hidden = mode !== 'drawer';
        const heading = root.querySelector('[data-kp-pane-heading]');
        if (heading) heading.textContent = mode === 'drawer' ? '' : titleOf(s);
        form = buildForm(target, {
            title: `Edit schedule: ${titleOf(s)}`,
            schedule: s,
            answer: () => 'ok',
            stacksLoading: () => false,
            log: () => {},
            onClose: () => {
                side.hidden = true;
                side.innerHTML = '';
                current = null;
                handle?.select(null);
            },
        });
    };

    root.addEventListener(PANE_SELECT_EVENT, (event) => {
        const key = /** @type {CustomEvent} */ (event).detail?.key;
        if (!key || key === current) return;
        const dirty = form ? (unsavedModule.unsaved(form.bar)?.changes().length ?? 0) : 0;
        if (dirty) {
            event.preventDefault?.();
            form?.close();
            return;
        }
        showForm(key);
    });

    const apply = () => {
        frame.setAttribute('data-surface', mode);
        press('data-hs-surface', mode);
        side.hidden = mode !== 'drawer' || !current;
        if (current) showForm(current);
    };
    stateButtons('data-hs-surface', (v) => {
        mode = v;
        apply();
    });
    stateButtons('data-hs-surface-data', (v) => {
        data = v;
        if (v === 'ready') {
            setPaneState(root, current && mode === 'beside' ? 'ready' : 'empty', { title: 'Pick a schedule', text: 'Choose one in the list to change it.' });
        } else if (v === 'loading') setPaneState(root, 'loading');
        else setPaneState(root, 'error', { title: 'The schedule could not be read', text: 'The host did not answer. Nothing was changed.', actionLabel: 'Retry' });
    });
    root.addEventListener(PANE_RETRY_EVENT, () => {
        setPaneState(root, 'loading');
        window.setTimeout(() => {
            press('data-hs-surface-data', 'ready');
            setPaneState(root, 'empty', { title: 'Pick a schedule', text: 'Choose one in the list to change it.' });
        }, 1200);
    });
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id !== 'edit-surface') return;
        mode = detail.value === 'beside' ? 'beside' : 'drawer';
        apply();
    });
    setPaneState(root, 'empty', { title: 'Pick a schedule', text: 'Choose one in the list to change it.' });
    void data;
}

// ── the table ───────────────────────────────────────────────────────────────────────────────────────────────────
if (document.getElementById('table-component')) {
    await ready;
    const { dataTable } = await import('../../js/datatable.js');
    const { setUptime, attachUptimes } = await import('../../js/uptime.js');
    const { setSelectionBusy, setSelectionResult, attachSelectionBars } = await import('../../js/selection-bar.js');
    const { undoToast } = await import('../../js/undo-toast.js');
    const { attachDataTables } = await import('../../js/datatable.js');
    const slot = /** @type {HTMLElement} */ (document.getElementById('hs-table-slot'));
    let bar = /** @type {HTMLElement} */ (document.getElementById('hs-bar'));
    const bed = /** @type {HTMLElement} */ (document.getElementById('hs-toastbed'));
    const TABLE_HTML = `                        <div
                            class="kp-selection"
                            data-kp-selection
                            data-kp-selection-for="hs-table"
                            data-kp-placement="sticky-top"
                            aria-label="Selected schedules"
                            id="hs-bar"
                        >
                            <div class="kp-selection__actions">
                                <button type="button" class="kp-button" data-kp-selection-action="off">Turn off</button>
                                <button type="button" class="kp-button" data-kp-selection-action="on">Turn on</button>
                            </div>
                        </div>
                        <div
                            class="kp-datatable"
                            data-kp-datatable
                            data-kp-cards
                            data-kp-page-size="10"
                            data-kp-remember="homelab-schedules"
                            data-kp-sort-multi
                            data-kp-busy-overlay
                            id="hs-table"
                        >
                            <div class="kp-datatable__bar">
                                <input class="kp-datatable__search" type="search" data-kp-datatable-search aria-label="Search the schedules" placeholder="Search a stack or an action" />
                                <select class="kp-field__input kp-datatable__select" data-kp-datatable-scope aria-label="Search in"></select>
                            </div>
                            <div class="kp-table-wrap">
                                <table class="kp-table">
                                    <caption class="kp-sr-only">
                                        All schedules
                                    </caption>
                                    <thead>
                                        <tr>
                                            <th scope="col"><input class="kp-field__check" type="checkbox" data-kp-select-all aria-label="Select every schedule on this page" /></th>
                                            <th scope="col" data-kp-sort="text" data-kp-filter="choice">On</th>
                                            <th scope="col" data-kp-sort="text" data-kp-filter="choice">What</th>
                                            <th scope="col" data-kp-sort="text">When</th>
                                            <th scope="col" data-kp-sort="number">Next run</th>
                                            <th scope="col">Last 14</th>
                                            <th scope="col"><span class="kp-sr-only">Actions</span></th>
                                        </tr>
                                    </thead>
                                    <tbody id="hs-tbody"></tbody>
                                </table>
                            </div>
                            <div class="kp-empty hs-empty" data-kp-datatable-empty hidden>
                                <p class="kp-empty__title">No schedules yet</p>
                                <p class="kp-empty__body">Nothing runs on its own apart from the host's nightly round at 02:00. Start from one of these, or make your own.</p>
                                <div class="kp-actions hs-templates" role="group" aria-label="Starting points" id="hs-templates"></div>
                            </div>
                            <div class="kp-datatable__bar">
                                <p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p>
                                <div class="kp-datatable__pager" data-kp-datatable-pager></div>
                            </div>
                        </div>
`;
    /** The table owns the rows it has seen, so a new set of rows is a new table: built again, attached again. */
    /** @type {(() => void) | null} */
    let detachBar = null;
    const mountTable = () => {
        slot.innerHTML = TABLE_HTML;
        attachDataTables(slot);
        detachBar = attachSelectionBars(slot);
        bar = /** @type {HTMLElement} */ (document.getElementById('hs-bar'));
    };
    mountTable();
    let tbody = /** @type {HTMLElement} */ (document.getElementById('hs-tbody'));
    let tableEl = /** @type {HTMLElement} */ (document.getElementById('hs-table'));
    let size = 14;
    let data = 'ready';
    let bulk = 'ok';
    let timer = 0;
    /** @type {Schedule[]} */
    let rows = fleet(size).map((s) => ({ ...s }));
    /** @type {Set<string>} */
    const deleting = new Set();

    /** The 14 slots of a schedule as uptime periods. @param {Schedule} s */
    const periods = (s) => {
        const past = runsBetween(s.when, NOW - 400 * DAY, NOW).slice(-14);
        const out = [];
        const h = s.history.padStart(14, '-').slice(-14);
        const missing = 14 - past.length;
        for (let i = 0; i < 14; i++) {
            const slot = past[i - missing];
            const c = h[i];
            if (!slot || c === '-') {
                out.push({ key: `n${i}`, label: 'No slot yet', state: /** @type {'none'} */ ('none') });
                continue;
            }
            const state = c === 'r' ? 'up' : c === 's' ? 'degraded' : 'down';
            const label = dateTime(slot);
            const jobNo = 4300 + ((s.id.charCodeAt(2) * 31 + i * 7) % 600);
            out.push({
                key: String(slot),
                label,
                state: /** @type {'up' | 'degraded' | 'down'} */ (state),
                tip: c === 'r' ? `Ran ${label} as job ${jobNo}` : c === 's' ? `Skipped ${label}: the stack was busy` : `Missed ${label}: the host was down`,
            });
        }
        return out;
    };

    const rowHtml = (/** @type {Schedule} */ s) => {
        const next = s.enabled ? nextRuns(s.when, NOW, 1)[0] : undefined;
        const nextText = !s.enabled ? 'off' : next ? dateTime(next) : 'no further run';
        const act = ACTIONS[/** @type {keyof typeof ACTIONS} */ (s.action)].label;
        return `<tr data-kp-row-key="${s.id}">
            <td><input class="kp-field__check" type="checkbox" data-kp-select-row aria-label="Select ${titleOf(s)}" data-kp-label="${titleOf(s)}" /></td>
            <td data-kp-filter-value="${s.enabled ? 'on' : 'off'}" data-kp-sort-value="${s.enabled ? 0 : 1}"><label class="kp-switch"><input class="kp-switch__input" type="checkbox" role="switch" ${s.enabled ? 'checked' : ''} data-hs-switch="${s.id}" /><span class="kp-switch__state" aria-hidden="true"></span><span class="kp-sr-only">${titleOf(s)} turned on</span></label></td>
            <td data-kp-filter-value="${act}" data-kp-sort-value="${titleOf(s)}"><b>${act}</b> · ${s.stack === 'host' ? 'the whole host' : s.stack}</td>
            <td>${cadence(s.when)}</td>
            <td class="kp-numeric" data-kp-sort-value="${next ?? 9e15}">${nextText}</td>
            <td><div class="kp-uptime hs-strip" data-kp-uptime data-kp-uptime-count="14" data-kp-uptime-label="" data-hs-uptime="${s.id}"></div></td>
            <td><div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm" data-kp-action="edit" data-hs-act="edit" data-hs-id="${s.id}">Edit…</button><button type="button" class="kp-button kp-button--sm" data-kp-action="run" data-hs-act="run" data-hs-id="${s.id}">Run now</button><button type="button" class="kp-button kp-button--sm kp-button--destructive" data-kp-action="delete" data-hs-act="delete" data-hs-id="${s.id}">Delete</button></div></td>
        </tr>`;
    };

    const paintStrips = () => {
        attachUptimes(tbody);
        for (const el of tbody.querySelectorAll('[data-hs-uptime]:not([data-hs-painted])')) {
            el.setAttribute('data-hs-painted', '');
            const s = rows.find((x) => x.id === el.getAttribute('data-hs-uptime'));
            if (s) setUptime(/** @type {HTMLElement} */ (el), { label: '', periods: periods(s), open: 'info' });
        }
    };

    const templates = [
        { t: 'Back up a busy stack during the day', says: 'Every day at 12:00, on top of the nightly round.' },
        { t: 'Patch the fleet weekly', says: 'apt dist-upgrade every container, Sunday at 22:00.' },
        { t: 'Deploy later', says: 'Once, at a time you pick: a release outside working hours.' },
        { t: 'Test a restore every Monday', says: 'Restores the newest backup into a scratch container at 06:00, so a backup is proven, not assumed.' },
    ];
    const tiles = /** @type {HTMLElement} */ (document.getElementById('hs-templates'));
    tiles.innerHTML = templates
        .map((x, i) => `<button type="button" class="kp-action" data-hs-template="${i}"><strong class="kp-action__title">${x.t}</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">${x.says}</span></button>`)
        .join('');
    import('../../js/action-tiles.js').then((m) => m.attachActionTiles(tiles));

    const handle = () => dataTable(tableEl);
    /** Swap the rows the way the table expects: each old row removed, the new ones added, then refresh(). @param {string} html */
    const replaceRows = (html) => {
        mountTable();
        tbody = /** @type {HTMLElement} */ (document.getElementById('hs-tbody'));
        tableEl = /** @type {HTMLElement} */ (document.getElementById('hs-table'));
        tbody.insertAdjacentHTML('beforeend', html);
    };
    const draw = () => {
        window.clearTimeout(timer);
        if (data === 'ready') {
            replaceRows(rows.map(rowHtml).join(''));
            handle()?.state('ready');
            handle()?.refresh();
            paintStrips();
        } else if (data === 'loading') {
            handle()?.busy({ text: 'Reading the schedules', overlay: true });
            handle()?.state('loading');
        } else if (data === 'empty') {
            replaceRows('');
            handle()?.state('ready');
            handle()?.refresh();
        } else {
            handle()?.fail('The schedules could not be read: the host did not answer.');
        }
    };
    draw();

    stateButtons('data-hs-table-data', (v) => {
        data = v;
        draw();
    });
    stateButtons('data-hs-table-fleet', (v) => {
        size = +v;
        rows = fleet(size).map((s) => ({ ...s }));
        data = 'ready';
        press('data-hs-table-data', 'ready');
        draw();
    });
    stateButtons('data-hs-table-bulk', (v) => {
        bulk = v;
    });
    // Only the strips of the rows on screen are drawn; the next page draws its own as it comes.
    slot.addEventListener('kp-datatable-view', () => window.requestAnimationFrame(paintStrips));
    slot.addEventListener('kp-datatable-retry', () => {
        data = 'loading';
        press('data-hs-table-data', 'loading');
        draw();
        timer = window.setTimeout(() => {
            data = 'ready';
            press('data-hs-table-data', 'ready');
            draw();
        }, 1400);
    });
    tiles.addEventListener('click', (event) => {
        const b = /** @type {HTMLElement | null} */ ((/** @type {Element} */ (event.target)).closest('[data-hs-template]'));
        if (b) say('hs-table-log', `The form opens filled in from: ${templates[+(b.getAttribute('data-hs-template') ?? 0)].t}`);
    });

    // Bulk turn on and off, with a refusal on one row.
    document.addEventListener('kp-selection-action', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        if (d?.bar && d.bar !== bar) return;
        const action = d.action;
        const items = /** @type {{ key: string, label: string }[]} */ (d.items ?? []);
        if (!items.length) return;
        const verb = action === 'off' ? 'Turning off' : 'Turning on';
        setSelectionBusy(bar, `${verb} ${items.length}…`);
        window.setTimeout(() => {
            /** @type {{ key: string, reason: string }[]} */
            const refused = bulk === 'refuse' ? [{ key: items[items.length - 1].key, reason: 'the host holds it while a job of this stack is running' }] : [];
            for (const it of items) {
                if (refused.some((r) => r.key === it.key)) continue;
                const s = rows.find((x) => x.id === it.key);
                if (s) s.enabled = action !== 'off';
            }
            setSelectionBusy(bar, null);
            setSelectionResult(bar, { done: items.length - refused.length, refused });
            const checks = tbody.querySelectorAll('[data-hs-switch]');
            for (const c of checks) {
                const s = rows.find((x) => x.id === c.getAttribute('data-hs-switch'));
                if (s) /** @type {HTMLInputElement} */ (c).checked = s.enabled;
            }
            say('hs-table-log', `kp-selection-action ${action}\n${items.length - refused.length} of ${items.length} schedules ${action === 'off' ? 'turned off' : 'turned on'}${refused.length ? `; refused: ${refused[0].reason}` : ''}`);
            document.dispatchEvent(new CustomEvent('hs-change'));
        }, 900);
    });

    // Row buttons and the switch.
    slot.addEventListener('click', (event) => {
        const b = /** @type {HTMLElement | null} */ ((/** @type {Element} */ (event.target)).closest('[data-hs-act]'));
        if (!b) return;
        const id = b.getAttribute('data-hs-id') ?? '';
        const s = rows.find((x) => x.id === id);
        if (!s) return;
        const act = b.getAttribute('data-hs-act');
        if (act === 'edit') say('hs-table-log', `The drawer opens with ${titleOf(s)}.`);
        else if (act === 'run') say('hs-table-log', `Would start ${titleOf(s)} now as job 4413; the schedule keeps its next slot.`);
        else {
            const index = rows.indexOf(s);
            rows = rows.filter((x) => x.id !== id);
            deleting.add(id);
            draw();
            undoToast(`${titleOf(s)} deleted`, {
                region: bed,
                ms: 6000,
                clock: 'ring',
                key: 'Mod+Z',
                leave: 'commit',
                commit: () => {
                    deleting.delete(id);
                    say('hs-table-log', `DELETE /data/schedules/${id}`);
                },
                undo: () => {
                    rows.splice(index, 0, s);
                    deleting.delete(id);
                    draw();
                },
            });
            bed.querySelector('.hs-toastbed__empty')?.setAttribute('hidden', '');
        }
    });
    slot.addEventListener('change', (event) => {
        const c = /** @type {HTMLInputElement} */ (event.target);
        const id = c.getAttribute?.('data-hs-switch');
        if (!id) return;
        const s = rows.find((x) => x.id === id);
        if (!s) return;
        s.enabled = c.checked;
        say('hs-table-log', `PUT /data/schedules/${id}: enabled ${c.checked}`);
        document.dispatchEvent(new CustomEvent('hs-change'));
    });
}

// ── pause until ─────────────────────────────────────────────────────────────────────────────────────────────────
if (document.getElementById('pause-component')) {
    await ready;
    const { attachSnoozes, setSnoozedUntil, setSnoozeBusy, SNOOZE_EVENT, SNOOZE_END_EVENT } = await import('../../js/snooze.js');
    const { setRuns } = await import('../../js/runs.js');
    setStrings({
        snoozeTrigger: 'Pause until…',
        snoozeChange: 'Paused: change',
        snoozeSaving: 'Pausing…',
        snoozeNone: 'Running',
        snoozeEnd: 'Resume now',
        snoozeUntil: (m) => `Paused until ${m}`,
    });
    const host = /** @type {HTMLElement} */ (document.getElementById('hs-snooze-host'));
    const runsEl = /** @type {HTMLElement} */ (document.getElementById('hs-pause-runs'));
    const s = BASE[0];
    let look = 'menu';
    let state = 'running';
    /** @type {number | null} */
    let until = null;
    let timer = 0;

    const note = () => {
        const text = state === 'fails' ? 'Saving will fail: the next pause is refused by the host and the schedule keeps running.' : state === 'paused' ? 'Paused: the runs inside the pause are skipped.' : 'Running: every run happens on time.';
        say('hs-pause-note', text);
        document.getElementById('pause-component')?.setAttribute('data-state', state);
    };
    const drawRuns = () => {
        note();
        const times = nextRuns(s.when, NOW, 8);
        setRuns(
            runsEl,
            times.map((at) => (until && at < until ? { at, conflict: 'Skipped: the schedule is paused' } : { at })),
            { reason: 'No run is left.' },
        );
    };

    const mountSnooze = () => {
        host.innerHTML = '';
        const el = document.createElement('div');
        el.className = 'kp-snooze';
        el.setAttribute('data-kp-snooze', '');
        el.setAttribute('data-kp-snooze-choices', 'tomorrow monday next-week pick');
        el.setAttribute('data-kp-snooze-morning', '09:00');
        el.setAttribute('data-kp-snooze-max', '30d');
        el.setAttribute('data-kp-look', look);
        el.id = 'hs-snooze';
        host.append(el);
        attachSnoozes(host);
        if (until) setSnoozedUntil(el, until);
        el.addEventListener(SNOOZE_EVENT, (event) => {
            const d = /** @type {CustomEvent} */ (event).detail;
            setSnoozeBusy(el, true);
            say('hs-pause-log', `kp-snooze ${d.choice}\nPUT /data/schedules/${s.id}: paused_until ${new Date(d.until).toISOString()}`);
            timer = window.setTimeout(() => {
                setSnoozeBusy(el, false);
                if (state === 'fails') {
                    say('hs-pause-log', 'The host refused the pause: it did not answer. The schedule is still running.');
                    return;
                }
                until = d.until;
                state = 'paused';
                press('data-hs-pause-state', 'paused');
                setSnoozedUntil(el, until);
                drawRuns();
            }, 900);
        });
        el.addEventListener(SNOOZE_END_EVENT, () => {
            until = null;
            state = 'running';
            press('data-hs-pause-state', 'running');
            setSnoozedUntil(el, null);
            drawRuns();
        });
        return el;
    };
    let el = mountSnooze();
    drawRuns();

    stateButtons('data-hs-pause-look', (v) => {
        look = v;
        el = mountSnooze();
    });
    stateButtons('data-hs-pause-state', (v) => {
        window.clearTimeout(timer);
        state = v;
        if (v === 'paused') {
            const t = new Date(TODAY + 7 * DAY);
            until = instant(parts(t.getTime()).y, parts(t.getTime()).m, parts(t.getTime()).d, 9, 0);
        } else if (v === 'running') until = null;
        setSnoozedUntil(el, until);
        drawRuns();
    });
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id !== 'pause-look') return;
        look = detail.value === 'chips' ? 'chips' : 'menu';
        press('data-hs-pause-look', look);
        el = mountSnooze();
    });
}

// ── the busy hours ──────────────────────────────────────────────────────────────────────────────────────────────
/** Starts per weekday and hour, and the clashes. @param {Schedule[]} all @param {boolean} moved */
function busyMap(all, moved) {
    const list = all.map((s) => ({ ...s, when: { ...s.when } }));
    if (moved) {
        // The two paperless/vaultwarden backups and the traefik backup move 15 minutes later.
        for (const id of ['s03', 's06', 's08']) {
            const s = list.find((x) => x.id === id);
            if (s) {
                const [h, m] = s.when.at.split(':').map(Number);
                const t = h * 60 + m + 15;
                s.when = /** @type {When} */ ({ ...s.when, at: `${pad(Math.floor(t / 60) % 24)}:${pad(t % 60)}` });
            }
        }
    }
    const from = TODAY - ((parts(TODAY).wd) * DAY);
    /** @type {{ at: number, s: Schedule | null }[][][]} */
    const grid = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => []));
    for (const s of list) {
        if (!s.enabled) continue;
        for (const at of runsBetween(s.when, from, from + 7 * DAY)) {
            const p = parts(at);
            grid[p.wd][p.hh].push({ at, s });
        }
    }
    for (let wd = 0; wd < 7; wd++) {
        const at = runsBetween({ every: 'day', at: NIGHTLY }, from + wd * DAY, from + (wd + 1) * DAY)[0];
        if (at) grid[wd][parts(at).hh].push({ at, s: null });
    }
    /** @type {{ wd: number, at: number, a: string, b: string, move: Schedule | null }[]} */
    const clashes = [];
    for (let wd = 0; wd < 7; wd++) {
        for (let hh = 0; hh < 24; hh++) {
            const cell = grid[wd][hh];
            for (let i = 0; i < cell.length; i++)
                for (let j = i + 1; j < cell.length; j++)
                    if (cell[i].at === cell[j].at) {
                        const who = (/** @type {{ s: Schedule | null }} */ x) => (x.s ? titleOf(x.s) : "the host's nightly round");
                        clashes.push({ wd, at: cell[i].at, a: who(cell[i]), b: who(cell[j]), move: cell[i].s ?? cell[j].s });
                    }
        }
    }
    return { grid, clashes, from };
}

if (document.getElementById('collisions-component')) {
    await ready;
    const { setHeat } = await import('../../js/heat.js');
    const el = /** @type {HTMLElement} */ (document.getElementById('hs-collision-heat'));
    const list = /** @type {HTMLElement} */ (document.getElementById('hs-clashes'));
    let data = 'ready';
    let moved = false;
    let timer = 0;

    const draw = () => {
        window.clearTimeout(timer);
        const every = window.innerWidth < 700 ? 6 : 3;
        const columns = Array.from({ length: 24 }, (_, h) => ({ key: String(h), label: h % every === 0 ? pad(h) : '' }));
        if (data === 'loading') return setHeat(el, { columns, rows: [], state: 'loading', skeleton: { rows: 7, columns: 24 } });
        if (data === 'empty') return setHeat(el, { columns, rows: [], state: 'empty', message: 'No schedules yet, so nothing starts.' });
        if (data === 'error') return setHeat(el, { columns, rows: [], state: 'error', message: 'The schedules could not be read.' });
        const { grid, clashes } = busyMap(BASE, moved);
        setHeat(el, {
            label: 'Schedule starts by weekday and hour',
            every,
            columns,
            rows: grid.map((day, wd) => ({
                key: WEEKDAYS[wd],
                label: WEEKDAYS[wd],
                cells: day.map((cell, hh) => {
                    const same = clashes.some((c) => c.wd === wd && parts(c.at).hh === hh);
                    const names = cell.map((x) => `${x.s ? titleOf(x.s) : "Host's nightly round"} ${dateTime(x.at).slice(11)}`);
                    const where = `${WEEKDAYS[wd]} ${pad(hh)}:00 to ${pad(hh)}:59`;
                    if (!cell.length) return { tone: /** @type {'none'} */ ('none'), label: `${where}: nothing starts` };
                    if (same) return { tone: /** @type {'bad'} */ ('bad'), label: `${where}: ${cell.length} starts, two in the same minute`, tip: names.join('\n') };
                    if (cell.length > 1) return { tone: /** @type {'warn'} */ ('warn'), label: `${where}: ${cell.length} starts in the same hour`, tip: names.join('\n') };
                    return { tone: /** @type {'ok'} */ ('ok'), label: `${where}: 1 start`, tip: names.join('\n') };
                }),
            })),
            summary: {
                key: 'all',
                label: 'Starts',
                cells: Array.from({ length: 24 }, (_, hh) => {
                    const n = grid.reduce((sum, day) => sum + day[hh].length, 0);
                    const most = Math.max(1, ...Array.from({ length: 24 }, (_, h) => grid.reduce((sum, day) => sum + day[h].length, 0)));
                    return { tone: /** @type {'ok'} */ ('ok'), share: n / most, label: `${pad(hh)}:00: ${n} ${n === 1 ? 'start' : 'starts'} in the week` };
                }),
            },
        });
        /** The same pair at the same time of day on several days is one line. */
        /** @type {Map<string, { days: number[], at: number, a: string, b: string, move: Schedule | null }>} */
        const groups = new Map();
        for (const c of clashes) {
            const key = `${c.a}|${c.b}|${dateTime(c.at).slice(11)}`;
            const g = groups.get(key);
            if (g) g.days.push(c.wd);
            else groups.set(key, { days: [c.wd], at: c.at, a: c.a, b: c.b, move: c.move });
        }
        const list2 = [...groups.values()];
        const when = (/** @type {{ days: number[], at: number }} */ g) => {
            const time = dateTime(g.at).slice(11);
            const d = [...g.days].sort();
            return d.length === 7 ? `Every day at ${time}` : `${d.map((x) => WEEKDAYS[x]).join(', ')} at ${time}`;
        };
        list.setAttribute('aria-label', `${list2.length} clashes`);
        list.innerHTML = list2.length
            ? list2
                  .map(
                      (c) =>
                          `<li><span class="hs-clashes__when">${when(c)}</span><span class="hs-clashes__who"><b>${c.a}</b> and <b>${c.b}</b></span>${
                              c.move ? `<button type="button" class="kp-button kp-button--sm" data-hs-move>Move ${titleOf(c.move)} 15 minutes later</button>` : '<span></span>'
                          }</li>`,
                  )
                  .join('')
            : '<li class="hs-clashes__ok"><span class="hs-clashes__when">No clashes</span><span class="hs-clashes__who">Nothing starts in the same minute as anything else.</span><span></span></li>';
    };
    draw();
    window.matchMedia('(max-width: 43.75rem)').addEventListener('change', draw);
    stateButtons('data-hs-col-data', (v) => {
        data = v;
        draw();
    });
    stateButtons('data-hs-col-fix', (v) => {
        moved = v === 'yes';
        data = 'ready';
        press('data-hs-col-data', 'ready');
        draw();
    });
    list.addEventListener('click', (event) => {
        if (!(/** @type {Element} */ (event.target)).closest('[data-hs-move]')) return;
        moved = true;
        press('data-hs-col-fix', 'yes');
        draw();
    });
    el.addEventListener('kp-heat-retry', () => {
        data = 'loading';
        draw();
        timer = window.setTimeout(() => {
            data = 'ready';
            press('data-hs-col-data', 'ready');
            draw();
        }, 1400);
    });
}

// ── coverage ────────────────────────────────────────────────────────────────────────────────────────────────────
if (document.getElementById('coverage-component')) {
    await ready;
    const { setMatrix } = await import('../../js/heat.js');
    const el = /** @type {HTMLElement} */ (document.getElementById('hs-coverage'));
    let data = 'ready';
    let show = 'all';
    let timer = 0;
    const acts = ['backup', 'update', 'restore-test'];

    /** What a stack has: the schedule for each action. @param {string} stack @param {string} action */
    const has = (stack, action) => BASE.find((s) => s.stack === stack && s.action === action && s.enabled);
    const gaps = () => STACKS.filter((st) => !has(st, 'backup'));

    const draw = () => {
        window.clearTimeout(timer);
        const stacks = show === 'gaps' ? gaps() : STACKS;
        const n = gaps().length;
        say('hs-cov-summary', `${n} ${n === 1 ? 'stack has' : 'stacks have'} no backup schedule: ${gaps().join(', ')}.`);
        const columns = acts.map((a) => ({ key: a, label: ACTIONS[/** @type {keyof typeof ACTIONS} */ (a)].label }));
        if (data === 'loading') return setMatrix(el, { rows: stacks.slice(0, 5).map((s) => ({ key: s, label: s })), columns, state: 'loading', skeleton: 3, cell: () => ({}) });
        if (data === 'empty') return setMatrix(el, { rows: [], columns: [], state: 'empty', message: 'No stacks known to the host.' });
        if (data === 'error') return setMatrix(el, { rows: [], columns: [], state: 'error', message: 'The stacks could not be read.' });
        setMatrix(el, {
            corner: 'Stack ↓ Action →',
            view: 'grid',
            rows: stacks.map((s) => ({ key: s, label: s, tone: /** @type {'muted' | 'bad'} */ (has(s, 'backup') ? 'muted' : 'bad') })),
            columns,
            cell: (row, column) => {
                const s = has(row, column);
                if (s) return { tone: 'ok', text: shortWhen(s.when), label: `${row}: ${ACTIONS[/** @type {keyof typeof ACTIONS} */ (column)].label}, ${cadence(s.when)}` };
                if (column === 'backup') return { tone: 'bad', text: 'No backup schedule', label: `${row} has no backup schedule` };
                return { tone: 'none', label: `${row}: no ${ACTIONS[/** @type {keyof typeof ACTIONS} */ (column)].label.toLowerCase()} schedule` };
            },
        });
    };
    draw();
    stateButtons('data-hs-cov-data', (v) => {
        data = v;
        draw();
    });
    stateButtons('data-hs-cov-show', (v) => {
        show = v;
        data = 'ready';
        press('data-hs-cov-data', 'ready');
        draw();
    });
    el.addEventListener('kp-matrix-pick', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        say('hs-cov-log', d.colKey === 'backup' && !has(d.rowKey, 'backup') ? `The form opens for ${d.rowKey}, action Back up.` : `${d.rowKey}, ${d.colKey}: the page would open that schedule.`);
    });
    el.addEventListener('kp-uses-retry', () => {
        data = 'loading';
        draw();
        timer = window.setTimeout(() => {
            data = 'ready';
            press('data-hs-cov-data', 'ready');
            draw();
        }, 1400);
    });
}

// ── history ─────────────────────────────────────────────────────────────────────────────────────────────────────
if (document.getElementById('history-component')) {
    await ready;
    const { setGanttRuns, setGanttState, setGanttLegend, setGanttPoints, setGanttKinds, GANTT_OPEN_EVENT } = await import('../../js/gantt.js');
    const el = /** @type {HTMLElement} */ (document.getElementById('hs-gantt'));
    const dialog = /** @type {HTMLDialogElement} */ (document.getElementById('hs-job'));
    let data = 'ready';
    let timer = 0;
    const HISTORY_IDS = ['s01', 's02', 's03', 's04', 's05', 's06', 's08'];
    const lanes = BASE.filter((s) => HISTORY_IDS.includes(s.id)).map((s) => ({ id: s.id, label: laneOf(s), sub: shortWhen(s.when) }));

    /** @type {Map<string, import('../../js/gantt.js').GanttRun & { job: number, schedule: Schedule }>} */
    const runIndex = new Map();
    const build = () => {
        /** @type {import('../../js/gantt.js').GanttRun[]} */
        const out = [];
        /** @type {import('../../js/gantt.js').GanttPoint[]} */
        const points = [];
        let job = 4400;
        for (const s of BASE) {
            if (!HISTORY_IDS.includes(s.id)) continue;
            const slots = runsBetween(s.when, NOW - 7 * DAY, NOW);
            const history = runsBetween(s.when, NOW - 400 * DAY, NOW).slice(-14);
            slots.forEach((at, i) => {
                const flag = s.history[s.history.length - slots.length + i] ?? 'r';
                job += 1;
                const ACT = ACTIONS[/** @type {keyof typeof ACTIONS} */ (s.action)];
                if (flag === 's' || flag === 'm') {
                    points.push({ id: `p${job}`, lane: s.id, at, kind: flag === 's' ? 'skipped' : 'missed', label: titleOf(s), detail: flag === 's' ? `Skipped ${dateTime(at)}: the stack was busy` : `Missed ${dateTime(at)}: the host was down` });
                    return;
                }
                const minutes = s.action === 'patch' ? 52 : s.action === 'update' ? 24 : s.action === 'restore-test' ? 17 : 9 + ((job * 7) % 16);
                const failed = s.id === 's09' && i === slots.length - 1 && false;
                const run = {
                    id: `j${job}`,
                    lane: s.id,
                    label: `${ACT.label} · ${s.stack}`,
                    start: at + 8_000,
                    end: at + 8_000 + minutes * MIN,
                    state: /** @type {'ok' | 'failed'} */ (failed ? 'failed' : 'ok'),
                    series: /** @type {1 | 2 | 3 | 4 | 5} */ (ACT.series),
                    detail: `Job ${job} started by the schedule, ${minutes} min`,
                };
                out.push(run);
                runIndex.set(run.id, { ...run, job, schedule: s });
            });
            void history;
        }
        // One run that failed, so a failure is part of the picture (mock).
        const victim = out.find((r) => r.lane === 's05');
        if (victim) {
            victim.state = 'failed';
            victim.detail = 'The image pull was refused: the registry rate limit was reached.';
            delete (/** @type {any} */ (victim)).series;
        }
        return { out, points };
    };

    const draw = () => {
        window.clearTimeout(timer);
        if (data === 'ready') {
            const { out, points } = build();
            setGanttKinds(el, [
                { kind: 'skipped', label: 'Skipped', shape: 'ring', tone: 'warning' },
                { kind: 'missed', label: 'Missed', shape: 'triangle', tone: 'destructive' },
            ]);
            setGanttRuns(el, out, lanes);
            setGanttPoints(el, points, lanes);
            setGanttLegend(el, Object.values(ACTIONS).map((a) => ({ series: /** @type {1 | 2 | 3 | 4 | 5} */ (a.series), label: a.label })));
            setGanttState(el, 'ready');
        } else if (data === 'loading') setGanttState(el, 'loading');
        else if (data === 'empty') {
            setGanttRuns(el, [], lanes);
            setGanttState(el, 'empty', 'Nothing has run in this window.');
        } else setGanttState(el, 'error', 'The history could not be read: the host did not answer.');
    };
    draw();

    /** @param {import('../../js/gantt.js').GanttRun} run @param {Schedule} s @param {number} job */
    const openJob = (run, s, job) => {
        const start = +run.start;
        const end = +(run.end ?? start);
        dialog.innerHTML = `
            <header class="kp-dialog__head"><h2 class="kp-dialog__title" id="hs-job-title">Job ${job}</h2><button type="button" class="kp-icon-button kp-dialog__close" aria-label="Close job ${job}" data-kp-dialog-close>✕</button></header>
            <div class="kp-dialog__body">
                <dl class="kp-kv kp-kv--lines hs-jobkv">
                    <div class="kp-kv__row"><dt>Action</dt><dd>${ACTIONS[/** @type {keyof typeof ACTIONS} */ (s.action)].label}</dd></div>
                    <div class="kp-kv__row"><dt>Stack</dt><dd>${s.stack === 'host' ? 'the whole host' : s.stack}</dd></div>
                    <div class="kp-kv__row"><dt>Started by</dt><dd>the schedule, ${cadence(s.when)}</dd></div>
                    <div class="kp-kv__row"><dt>Started</dt><dd><span class="kp-timestamp">${dateTime(start)}</span></dd></div>
                    <div class="kp-kv__row"><dt>Ended</dt><dd><span class="kp-timestamp">${dateTime(end)}</span></dd></div>
                    <div class="kp-kv__row"><dt>Took</dt><dd>${distance(end - start)}</dd></div>
                    <div class="kp-kv__row"><dt>State</dt><dd><span class="kp-badge ${run.state === 'failed' ? 'kp-badge--destructive' : 'kp-badge--success'}">${run.state === 'failed' ? 'failed' : 'worked'}</span> ${run.detail ?? ''}</dd></div>
                </dl>
            </div>
            <footer class="kp-dialog__foot"><a class="kp-button" href="#activity">Open it on Activity</a><button type="button" class="kp-button kp-button--primary" data-kp-dialog-close>Close</button></footer>`;
        dialog.showModal();
        dialog.querySelectorAll('[data-kp-dialog-close]').forEach((b) => b.addEventListener('click', () => dialog.close()));
    };
    el.addEventListener(GANTT_OPEN_EVENT, (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        if (d.run) {
            const known = runIndex.get(d.run.id);
            if (known) {
                say('hs-hist-log', `kp-gantt-open ${d.source}\n${d.run.label}: the job dialog opens (job ${known.job})`);
                openJob(d.run, known.schedule, known.job);
            }
        } else if (d.point) say('hs-hist-log', `kp-gantt-open ${d.source}\n${d.point.detail}`);
    });
    stateButtons('data-hs-hist-data', (v) => {
        data = v;
        draw();
    });
    document.querySelector('[data-hs-hist-job]')?.addEventListener('click', () => {
        const first = [...runIndex.values()].sort((a, b) => +b.start - +a.start)[0];
        if (first) openJob(first, first.schedule, first.job);
    });
    el.addEventListener('kp-gantt-retry', () => {
        data = 'loading';
        press('data-hs-hist-data', 'loading');
        draw();
        timer = window.setTimeout(() => {
            data = 'ready';
            press('data-hs-hist-data', 'ready');
            draw();
        }, 1400);
    });
}
