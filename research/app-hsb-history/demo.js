// research/app-hsb-history: the page's own wiring. The components are the package's (js/auto.js attaches those present at load,
// this file attaches the ones it draws later); this file only feeds them one consistent sample history, presses their states and
// writes what they fire into a readout.
import { setCardState, CARD_RETRY_EVENT } from '../../js/card-state.js';
import { attachTrendCharts, setTrendData } from '../../js/chart.js';
import { attachSparklines, attachKpiToggles, KPI_TOGGLE_EVENT } from '../../js/kpi.js';
import { attachTicks } from '../../js/tick.js';
import { setUptime, uptimePercent, UPTIME_PICK_EVENT } from '../../js/uptime.js';
import { attachRefresh, refreshOf, setRefreshInterval, REFRESH_EVENT } from '../../js/auto-refresh.js';

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

/** @param {string} selector @param {ParentNode} [root] @returns {HTMLElement[]} */
const all = (selector, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(selector)]);
/** @param {string} selector @returns {HTMLElement} */
const one = (selector) => /** @type {HTMLElement} */ (document.querySelector(selector));

/** What the review dialog sets for a choice, as the page hears it. @param {string} id @param {(value: string) => void} apply */
const onChoice = (id, apply) =>
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id === id) apply(String(detail.value));
    });

/** Set the pressed button of a group of one-of buttons. @param {string} attr @param {string} value */
const press = (attr, value) => {
    for (const b of all(`[${attr}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
};
/** @param {string} attr @param {(value: string) => void} fn */
const wireGroup = (attr, fn) => {
    for (const b of all(`[${attr}]`)) {
        b.addEventListener('click', () => {
            const value = /** @type {string} */ (b.getAttribute(attr));
            press(attr, value);
            fn(value);
        });
    }
};

/* ============================================================ the sample history */

const HOUR = 3_600_000;
/** 19/10/2026 14:40 in Brussels: "now" for every sample on the page. */
const NOW = Date.UTC(2026, 9, 19, 12, 40);
/** 18/10/2026 15:00 in Brussels: the first of the 24 cells. */
const START = Date.UTC(2026, 9, 18, 13, 0);
/** The service began recording at cell 4: 18/10/2026 19:00. */
const FIRST = 4;

const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Brussels',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
});
/** dd/mm/yyyy HH:MM on the Brussels clock. @param {number} ms */
const stamp = (ms) => {
    const p = Object.fromEntries(parts.formatToParts(ms).map((x) => [x.type, x.value]));
    return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
};
/** HH:MM only. @param {number} ms */
const clockOf = (ms) => stamp(ms).slice(11);

/** A small deterministic noise, so every load draws the same history. @param {number} seed */
const rng = (seed) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * @typedef {{ t: number, ok: boolean, ms: number | null, name: string, why: string }} Msg
 * @typedef {{ i: number, r: number, f: number, ms: number, state: 'up' | 'degraded' | 'down' | 'none', uptime: number, incidents: number,
 *   word: string, lines: string[] }} Hour
 * @typedef {{ id: string, unit: string, mock: boolean, names: string[], received: number[], hours: Record<number, Partial<Hour> & { fail?: string, slow?: boolean }>,
 *   msgs: Msg[], buckets: Hour[], down: boolean }} Profile
 */

/** @type {Record<string, Profile>} */
const PROFILES = {
    alertmanager: {
        id: 'alertmanager',
        unit: 'alerts',
        mock: false,
        names: [
            'HostHighCpuLoad on proxmox',
            'DiskSpaceLow on nas',
            'ContainerRestarted jellyfin',
            'CertificateExpiringSoon traefik',
            'BackupJobLate backups-hourly',
            'HighMemoryUsage on lxc-106',
            'TargetDown exporter-pi',
        ],
        received: [2, 1, 3, 0, 0, 1, 0, 0, 1, 0, 0, 1, 2, 4, 3, 2, 5, 3, 2, 1],
        hours: {
            8: { state: 'down', uptime: 0.23, incidents: 1, word: 'Hub down', lines: ['The kyu hub could not be reached from 23:12 to 23:58 (46 min).', 'Nothing could be received.'] },
            11: { state: 'down', uptime: 0.3, incidents: 1, word: 'Denied', lines: ['The hub refused the credentials from 02:00 to 02:42 (42 min).', 'Nothing could be received.'] },
            12: { state: 'degraded', uptime: 0.95, incidents: 1, word: 'Failing', f: 1, fail: 'Home Assistant answered 503 (Service Unavailable)', lines: ['Home Assistant failed one delivery.'] },
            20: { state: 'degraded', uptime: 0.93, incidents: 1, word: 'Failing', f: 1, slow: true, fail: 'Home Assistant did not answer within 5 s, tried 3 times', lines: ['Home Assistant was slow to answer for 4 min.'] },
            22: { state: 'degraded', uptime: 0.93, incidents: 1, word: 'Starting', lines: ['Restarted for an update; starting for 4 min (13:05 to 13:09).'] },
        },
        msgs: [],
        buckets: [],
        down: false,
    },
    'uptime-kuma': {
        id: 'uptime-kuma',
        unit: 'events',
        mock: true,
        names: ['Jellyfin is down', 'Nextcloud is up again', 'Grafana answers slowly', 'Traefik is up again', 'Home Assistant is down'],
        received: [3, 5, 8, 4, 0, 0, 2, 0, 3, 0, 1, 4, 7, 9, 6, 8, 12, 9, 7, 6],
        hours: {
            12: { state: 'down', uptime: 0.1, incidents: 1, word: 'Failing', f: 3, fail: 'Home Assistant refused the connection', lines: ['Home Assistant refused all 3 deliveries.'] },
            19: { state: 'degraded', uptime: 0.97, incidents: 1, word: 'Failing', f: 1, fail: 'Home Assistant answered 502 (Bad Gateway)', lines: ['Home Assistant failed one delivery.'] },
        },
        msgs: [],
        buckets: [],
        down: false,
    },
};

/** Build a profile's messages and hourly records once, from its few special hours. @param {Profile} p @param {number} seed */
function build(p, seed) {
    const rand = rng(seed);
    p.received.forEach((r, k) => {
        const i = FIRST + k;
        const special = p.hours[i] ?? {};
        const f = special.f ?? 0;
        const span = i === 23 ? 40 : 60;
        for (let n = 0; n < r; n++) {
            const minute = Math.floor(((n + 0.5) * span) / r);
            const ok = n < r - f;
            const base = special.slow ? 240 + rand() * 80 : 55 + rand() * 175;
            p.msgs.push({
                t: START + i * HOUR + minute * 60_000,
                ok,
                ms: ok ? Math.round(base) : null,
                name: p.names[Math.floor(rand() * p.names.length)],
                why: ok ? 'Delivered to Home Assistant' : (special.fail ?? 'Home Assistant did not accept it'),
            });
        }
    });
    p.msgs.sort((a, b) => a.t - b.t);
    refresh(p);
}

/** Recompute the 24 hourly records from the messages. @param {Profile} p */
function refresh(p) {
    p.buckets = Array.from({ length: 24 }, (_, i) => {
        if (i < FIRST) return { i, r: 0, f: 0, ms: 0, state: 'none', uptime: 0, incidents: 0, word: 'No data', lines: ['History was not recorded yet.'] };
        const start = START + i * HOUR;
        const inHour = p.msgs.filter((m) => m.t >= start && m.t < start + HOUR);
        const f = inHour.filter((m) => !m.ok).length;
        const ms = inHour.reduce((sum, m) => sum + (m.ms ?? 0), 0);
        const special = p.hours[i];
        /** @type {Hour} */
        const hour = {
            i,
            r: inHour.length,
            f,
            ms,
            state: special?.state ?? (f > 0 ? 'degraded' : 'up'),
            uptime: special?.uptime ?? (f > 0 ? 0.98 : 1),
            incidents: special?.incidents ?? (f > 0 ? 1 : 0),
            word: special?.word ?? (f > 0 ? 'Failing' : 'Working'),
            lines: special?.lines ?? [],
        };
        if (p.down && i === 23) Object.assign(hour, { state: 'down', uptime: 0.17, incidents: 1, word: 'Hub down', lines: ['The kyu hub could not be reached since 14:30.', 'Nothing could be received.'] });
        return hour;
    });
}

build(PROFILES.alertmanager, 7);
build(PROFILES['uptime-kuma'], 11);

/** The four figures of a profile over its recorded hours. @param {Profile} p */
function totals(p) {
    const hours = p.buckets.filter((b) => b.state !== 'none');
    const r = hours.reduce((n, b) => n + b.r, 0);
    const f = hours.reduce((n, b) => n + b.f, 0);
    const d = r - f;
    const ms = hours.reduce((n, b) => n + b.ms, 0);
    const lastFail = [...p.msgs].reverse().find((m) => !m.ok);
    const slow = hours.filter((b) => b.r - b.f > 0).sort((a, b) => b.ms / (b.r - b.f) - a.ms / (a.r - a.f))[0];
    return { r, f, d, avg: d ? Math.round(ms / d) : 0, lastFail, slow, hours };
}

/* The page listens to the model: figures, strips and the feed repaint when it changes. */
/** @type {Set<(p: Profile, msg: Msg) => void>} */
const listeners = new Set();
const clock = { last: NOW };
/** Add a delivered or failed message to a profile "now". @param {Profile} p @param {boolean} ok @returns {Msg} */
function receive(p, ok) {
    clock.last = Math.min(clock.last + 20_000, START + 24 * HOUR - 60_000);
    /** @type {Msg} */
    const msg = {
        t: clock.last,
        ok,
        ms: ok ? 60 + Math.round(Math.random() * 140) : null,
        name: p.names[Math.floor(Math.random() * p.names.length)],
        why: ok ? 'Delivered to Home Assistant' : 'Home Assistant answered 503 (Service Unavailable)',
    };
    p.msgs.push(msg);
    refresh(p);
    for (const fn of listeners) fn(p, msg);
    return msg;
}

/* ============================================================ 1 · key figures */

{
    const card = one('#hh-figures-card');
    const strip = one('[data-hh-strip]:not([data-kp-uptime])');
    const recent = one('[data-hh-recent]');
    const recentTitle = one('[data-hh-recent-title]');
    const out = one('[data-hh-figures-out]');
    let profile = 'alertmanager';
    let look = 'trend';
    let failedOnly = false;
    let state = 'ready';
    /** @type {(() => void)[]} */
    let detachers = [];

    const METRICS = [
        { key: 'received', label: 'Received', value: (/** @type {ReturnType<typeof totals>} */ t) => t.r, series: (/** @type {Hour} */ b) => b.r, unit: (/** @type {Profile} */ p) => p.unit },
        { key: 'delivered', label: 'Delivered', value: (t) => t.d, series: (b) => b.r - b.f, unit: (p) => p.unit },
        { key: 'failed', label: 'Failed', value: (t) => t.f, series: (b) => b.f, unit: (p) => p.unit },
        { key: 'duration', label: 'Average duration', value: (t) => t.avg, series: (b) => (b.r - b.f ? Math.round(b.ms / (b.r - b.f)) : NaN), unit: () => 'ms' },
    ];

    /** The words under a number. @param {string} key @param {Profile} p @param {ReturnType<typeof totals>} t */
    function words(key, p, t) {
        const first = START + FIRST * HOUR;
        if (key === 'received') return `since ${stamp(first)}`;
        if (key === 'delivered') return t.r ? `${uptimePercent(t.d / t.r)}% of received` : 'nothing received yet';
        if (key === 'failed') return t.lastFail ? `last ${stamp(t.lastFail.t)}` : 'none in 24 hours';
        return t.slow ? `slowest hour ${clockOf(START + t.slow.i * HOUR)}, ${Math.round(t.slow.ms / (t.slow.r - t.slow.f))} ms` : 'no delivery yet';
    }

    /** @param {string} key @param {number} v */
    const spoken = (key, v) => (key === 'duration' ? `${v} ms` : `${v} ${PROFILES[profile].unit.replace(/s$/, v === 1 ? '' : 's')}`);

    function points(/** @type {Profile} */ p, /** @type {(typeof METRICS)[number]} */ m) {
        return p.buckets.filter((b) => b.state !== 'none' && Number.isFinite(m.series(b))).map((b) => /** @type {[number, number]} */ ([START + b.i * HOUR, m.series(b)]));
    }

    /** One tile from the page's own templates (the markup lives in demo.html). */
    function tileHtml(/** @type {(typeof METRICS)[number]} */ m, /** @type {Profile} */ p, /** @type {ReturnType<typeof totals>} */ t) {
        const kind = look === 'trend' ? 'trend' : m.key === 'failed' ? 'toggle' : 'plain';
        const template = /** @type {HTMLTemplateElement} */ (one(`template[data-hh-tile="${kind}"]`));
        const fill = {
            key: m.key,
            label: m.label,
            value: String(m.value(t)),
            unit: m.unit(p),
            words: words(m.key, p, t),
            n: String(METRICS.indexOf(m) + 1),
            pressed: String(failedOnly),
            spark: points(p, m)
                .map((x) => x[1])
                .join(' '),
        };
        return template.innerHTML.replace(/\{\{(\w+)\}\}/g, (_, name) => fill[/** @type {keyof typeof fill} */ (name)] ?? '');
    }

    function paintRecent() {
        const p = PROFILES[profile];
        const list = [...p.msgs].reverse().filter((m) => (failedOnly ? !m.ok : true)).slice(0, failedOnly ? 6 : 4);
        recentTitle.textContent = failedOnly ? `Failed deliveries in the last 24 hours (${list.length})` : 'Latest deliveries';
        recent.replaceChildren(
            ...list.map((m) => {
                const li = document.createElement('li');
                li.className = 'hh-row';
                li.innerHTML = `<time datetime="${new Date(m.t).toISOString()}">${stamp(m.t)}</time>
                    <span class="kp-badge ${m.ok ? 'kp-badge--success' : 'kp-badge--destructive'}">${m.ok ? 'Delivered' : 'Failed'}</span>
                    <span class="hh-row__ms">${m.ms === null ? 'no answer' : `${m.ms} ms`}</span>
                    <span class="hh-row__name">${m.name}</span>
                    <span class="hh-row__why">${m.why}</span>`;
                return li;
            }),
        );
    }

    function build() {
        for (const d of detachers) d();
        const p = PROFILES[profile];
        const t = totals(p);
        one('[data-hh-figures-title]').textContent = `Last 24 hours of ${p.id}${p.mock ? ' (mock)' : ''}`;
        strip.innerHTML = METRICS.map((m) => tileHtml(m, p, t)).join('');
        strip.setAttribute('aria-label', `Key figures of ${p.id}`);
        detachers = [attachTicks(strip), attachSparklines(strip), attachKpiToggles(strip)];
        if (look === 'trend') {
            detachers.push(
                attachTrendCharts(strip, {
                    now: () => NOW,
                    format: (/** @type {number} */ v, /** @type {any} */ where) => {
                        const key = /** @type {Element | null} */ (where instanceof Element ? where : null)?.closest('[data-hh-metric]')?.getAttribute('data-hh-metric');
                        return key ? spoken(key, Math.round(v)) : String(Math.round(v));
                    },
                }),
            );
            for (const tile of all('[data-hh-metric]', strip)) {
                const m = /** @type {(typeof METRICS)[number]} */ (METRICS.find((x) => x.key === tile.dataset.hhMetric));
                const figure = /** @type {Element} */ (tile.querySelector('.kp-kpi__chart'));
                setTrendData(figure, { points: points(p, m), step: HOUR });
            }
        }
        paintRecent();
    }

    /** A message arrived: the numbers count to their new value. */
    function update() {
        const p = PROFILES[profile];
        const t = totals(p);
        for (const m of METRICS) {
            const el = strip.querySelector(`[data-hh-value="${m.key}"]`);
            const node = [...(el?.childNodes ?? [])].find((n) => n.nodeType === 3);
            if (node) node.nodeValue = String(m.value(t));
            const w = strip.querySelector(`[data-hh-words="${m.key}"]`);
            if (w) w.textContent = words(m.key, p, t);
            if (look === 'trend') {
                const fig = strip.querySelector(`[data-hh-metric="${m.key}"] .kp-kpi__chart`);
                if (fig) setTrendData(fig, { points: points(p, m), step: HOUR });
            } else {
                strip.querySelector(`[data-hh-metric="${m.key}"] .kp-kpi__spark`)?.setAttribute(
                    'data-kp-spark',
                    points(p, m)
                        .map((x) => x[1])
                        .join(' '),
                );
            }
        }
        paintRecent();
    }

    function apply() {
        if (state === 'ready') {
            setCardState(card, 'ready');
        } else if (state === 'loading') {
            setCardState(card, 'loading');
        } else if (state === 'empty') {
            setCardState(card, 'empty', { title: 'No history recorded yet', text: 'The service has not finished a full hour of recording. The figures appear after the first hour.' });
        } else {
            setCardState(card, 'error', { title: 'Could not read the last 24 hours', text: 'The hourly record did not answer. Nothing is lost: the counters keep running.' });
        }
        press('data-hh-fstate', state);
    }

    wireGroup('data-hh-profile', (v) => {
        profile = v;
        failedOnly = false;
        build();
    });
    wireGroup('data-hh-tiles', (v) => {
        look = v;
        build();
    });
    wireGroup('data-hh-fstate', (v) => {
        state = v;
        apply();
    });
    for (const b of all('[data-hh-send]')) b.addEventListener('click', () => receive(PROFILES[profile], b.dataset.hhSend === 'ok'));
    listeners.add((p) => {
        if (p.id === profile && state === 'ready') update();
    });
    strip.addEventListener(KPI_TOGGLE_EVENT, (event) => {
        failedOnly = Boolean(/** @type {CustomEvent} */ (event).detail?.pressed);
        paintRecent();
    });
    strip.addEventListener('click', (event) => {
        const link = event.target instanceof Element ? event.target.closest('.kp-kpi__link') : null;
        if (!link) return;
        // The sample's links go nowhere: say where they would go.
        event.preventDefault();
        out.textContent = `Opened: ${link.getAttribute('title')}.`;
    });
    card.addEventListener(CARD_RETRY_EVENT, () => {
        state = 'loading';
        apply();
        setTimeout(() => {
            state = 'ready';
            apply();
        }, 1200);
    });
    onChoice('tiles', (v) => {
        look = v;
        press('data-hh-tiles', v);
        build();
    });

    await ready;
    build();
    setTimeout(apply, 900);
}

/* ============================================================ 2 · uptime strips */

{
    const strips = all('.kp-uptime[data-hh-strip]');
    const out = one('[data-hh-uptime-out]');
    let state = 'ready';
    let open = 'info';

    function paint() {
        for (const el of strips) {
            const p = PROFILES[el.dataset.hhStrip ?? 'alertmanager'];
            const periods = p.buckets.map((b) => {
                const at = START + b.i * HOUR;
                const label = stamp(at);
                const delivered = b.r - b.f;
                const figures =
                    b.state === 'none'
                        ? 'No data: the service was not recording yet'
                        : b.r
                          ? `${delivered} of ${b.r} delivered${delivered ? `, ${Math.round(b.ms / delivered)} ms on average` : ''}`
                          : 'nothing to deliver';
                return {
                    key: new Date(at).toISOString(),
                    label,
                    state: b.state,
                    ...(b.state === 'none' ? {} : { uptime: b.uptime, incidents: b.incidents }),
                    tip: b.state === 'none' ? `${label} · No data` : `${label} · ${b.word} · ${figures}`,
                    details: b.state === 'none' ? b.lines : [`Received ${b.r}, delivered ${delivered}, failed ${b.f}.`, ...b.lines],
                };
            });
            el.toggleAttribute('data-kp-uptime-open', open === 'info');
            if (open === 'info') el.setAttribute('data-kp-uptime-open', 'info');
            setUptime(el, {
                label: `${p.id}${p.mock ? ' (mock)' : ''}`,
                periods: state === 'empty' ? [] : periods,
                state: /** @type {'ready' | 'loading' | 'empty' | 'error'} */ (state),
                count: 24,
                from: '24 hours ago',
                to: 'Now',
                error: 'Could not read the hourly history of this profile.',
                open: open === 'info' ? 'info' : undefined,
            });
        }
    }

    wireGroup('data-hh-ustate', (v) => {
        state = v;
        paint();
    });
    wireGroup('data-hh-press', (v) => {
        open = v;
        paint();
    });
    wireGroup('data-hh-now', (v) => {
        PROFILES.alertmanager.down = v === 'down';
        one('#hh-uptime-strips').dataset.hhNow = v;
        refresh(PROFILES.alertmanager);
        paint();
    });
    for (const b of all('[data-hh-open]')) {
        b.addEventListener('click', () => {
            const cells = all('.kp-uptime__cell', strips[0]);
            if (b.dataset.hhOpen === 'info') {
                if (open !== 'info') {
                    open = 'info';
                    press('data-hh-press', 'info');
                    paint();
                }
                // Cell 11 is the 02:00 hour on 19/10/2026 (cell 0 is 18/10/2026 15:00).
                all('.kp-uptime__cell', strips[0])[11]?.click();
            } else {
                cells[20]?.focus();
            }
        });
    }
    onChoice('press', (v) => {
        open = v;
        press('data-hh-press', v);
        paint();
    });
    listeners.add(() => paint());
    for (const el of strips) {
        el.addEventListener(UPTIME_PICK_EVENT, (event) => {
            const d = /** @type {CustomEvent} */ (event).detail;
            out.textContent = `Pressed: ${d.period?.label ?? d.key}.`;
        });
    }
    await ready;
    paint();
}

/* ============================================================ 3 · staying current */

{
    const card = one('#hh-live-card');
    const feed = one('[data-hh-feed]');
    const host = one('[data-hh-chooser-host]');
    const push = one('[data-hh-push]');
    const count = one('[data-hh-live-count]');
    const out = one('[data-hh-live-out]');
    const p = PROFILES.alertmanager;
    let mode = 'refresh';
    let look = 'segmented';
    let state = 'ready';
    let failNext = false;
    /** @type {(() => void) | null} */
    let detach = null;
    /** @type {HTMLElement | null} */
    let chooser = null;
    /** @type {number[]} */
    let burst = [];

    /** @param {Msg} m */
    function rowOf(m) {
        const li = document.createElement('li');
        li.innerHTML = `<time datetime="${new Date(m.t).toISOString()}">${stamp(m.t)}</time>
            <span class="kp-badge ${m.ok ? 'kp-badge--success' : 'kp-badge--destructive'}">${m.ok ? 'Delivered' : 'Failed'}</span>
            <span class="hh-row__ms">${m.ms === null ? 'no answer' : `${m.ms} ms`}</span>
            <span class="hh-row__name">${m.name}</span>`;
        return li;
    }
    const tally = () => {
        count.textContent = `${totals(p).r} alerts in 24 hours`;
    };

    function mountChooser() {
        // Opens at 5 min: while paused the package's Refresh now does nothing (js/auto-refresh.js fire()), so a paused demo would show a dead button.
        const seconds = chooser ? (refreshOf(chooser)?.interval() ?? 300) : 300;
        detach?.();
        host.replaceChildren();
        chooser = document.createElement('div');
        chooser.setAttribute('data-kp-refresh', String(seconds));
        chooser.setAttribute('data-kp-look', look);
        host.append(chooser);
        detach = attachRefresh(host);
        chooser.addEventListener(REFRESH_EVENT, (event) => {
            const d = /** @type {CustomEvent} */ (event).detail;
            out.textContent = `Reading (${d.reason}) …`;
            setTimeout(() => {
                if (failNext) {
                    failNext = false;
                    out.textContent = 'The read failed: the list stays as it was and the control retries.';
                    d.done(false);
                    return;
                }
                for (let n = 0; n < 3; n++) receive(p, true);
                out.textContent = `Read at ${clockOf(clock.last)}: 3 new alerts.`;
                d.done(true);
            }, 700);
        });
    }

    function paintFeed() {
        feed.replaceChildren(...[...p.msgs].reverse().map(rowOf));
        tally();
    }

    function apply() {
        if (state === 'ready') setCardState(card, 'ready');
        else if (state === 'loading') setCardState(card, 'loading');
        else if (state === 'empty') setCardState(card, 'empty', { title: 'No alerts yet', text: 'Alerts from the alertmanager profile appear here as soon as one is delivered.' });
        else setCardState(card, 'error', { title: 'Could not read the latest alerts', text: 'The service did not answer. The list will be read again when you try.' });
        press('data-hh-lstate', state);
    }

    function setMode(v) {
        mode = v;
        press('data-hh-mode', v);
        host.hidden = v === 'push';
        push.hidden = v !== 'push';
        if (v === 'push' && chooser) setRefreshInterval(chooser, 0);
        out.textContent = v === 'push' ? 'Live push: alerts appear as they are delivered.' : 'Reading every 5 min: nothing has been read yet.';
    }

    listeners.add((profile, msg) => {
        if (profile.id !== p.id) return;
        tally();
        if (state === 'empty') return;
        feed.prepend(rowOf(msg));
    });

    wireGroup('data-hh-mode', setMode);
    wireGroup('data-hh-look', (v) => {
        look = v;
        mountChooser();
    });
    wireGroup('data-hh-lstate', (v) => {
        state = v;
        apply();
    });
    onChoice('mode', setMode);
    onChoice('look', (v) => {
        look = v;
        press('data-hh-look', v);
        mountChooser();
    });
    for (const b of all('[data-hh-try]')) {
        b.addEventListener('click', () => {
            const what = b.dataset.hhTry;
            if (what === 'start') {
                setMode('refresh');
                if (chooser) setRefreshInterval(chooser, 30);
            } else if (what === 'scroll') {
                feed.scrollTop = 140;
                out.textContent = 'Scrolled down: new alerts now come in out of sight and are counted.';
            } else if (what === 'burst') {
                if (mode !== 'push') setMode('push');
                for (const id of burst) clearTimeout(id);
                burst = Array.from({ length: 6 }, (_, n) => window.setTimeout(() => receive(p, true), 2000 * (n + 1)));
                out.textContent = 'Live push: six alerts over 12 s.';
            } else if (what === 'menu') {
                if (look !== 'menu') {
                    look = 'menu';
                    press('data-hh-look', 'menu');
                    mountChooser();
                }
                host.querySelector('.kp-refresh__button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            } else if (what === 'fail') {
                failNext = !failNext;
                b.setAttribute('aria-pressed', String(failNext));
            }
        });
    }
    card.addEventListener(CARD_RETRY_EVENT, () => {
        state = 'loading';
        apply();
        setTimeout(() => {
            state = 'ready';
            apply();
        }, 1200);
    });

    await ready;
    paintFeed();
    mountChooser();
    setMode('refresh');
    setTimeout(apply, 900);
}
