// research/app-hsb-align: the page's own wiring. The components are the package's (js/auto.js attaches them); this file feeds them
// the sample data of the approved HTTPSwitchboard demos (alertmanager reads alerts.raw from the kyu hub and delivers to a Home
// Assistant webhook; uptime-kuma is a mock that takes POST /uptime-kuma) and builds the markup the real status page builds
// (web/dashboard.js, health.js, history.js, reloads.js, translate.js). Nothing here moves anything: the layout is page.css.

import { setAttention } from '../../js/attention.js';
import { setProblems } from '../../js/problems.js';
import { setAgo } from '../../js/freshness.js';
import { setStrings } from '../../js/strings.js';
import { setEntityGrid } from '../../js/entity-card.js';
import { setTrace } from '../../js/path-trace.js';
import { setMeter } from '../../js/kpi.js';
import { setMenu } from '../../js/menu-button.js';
import { setCode } from '../../js/code.js';
import { setCardState } from '../../js/card-state.js';
import { attachHoverCards } from '../../js/hovercard.js';

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

const byId = (/** @type {string} */ id) => /** @type {HTMLElement} */ (document.getElementById(id));
const el = (/** @type {string} */ tag, /** @type {string} */ className = '', /** @type {string} */ text = '') => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
};
const count = (/** @type {number} */ n) => n.toLocaleString('en-GB');
const seconds = (/** @type {number} */ ms) => (ms % 1000 === 0 ? `${ms / 1000} s` : `${(ms / 1000).toFixed(1)} s`);
const said = (/** @type {number[]} */ list) => (list.length > 1 ? `${list.slice(0, -1).map(seconds).join(', ')} and ${seconds(/** @type {number} */ (list.at(-1)))}` : seconds(list[0] ?? 0));

/** One profile of the snapshot, the shape web/dashboard.js reads. */
const PROFILES = [
    {
        name: 'alertmanager',
        state: 'denied',
        received: 1284,
        delivered: 1281,
        failed: 3,
        avg_ms: 149,
        last_success_unix: Math.floor(Date.now() / 1000) - 180,
        source: { kind: 'kyu', label: 'alerts.raw', sub: 'subscription switchboard', path: 'alerts.raw' },
        sink: { kind: 'url', label: 'homeassistant.lan:8123', path: null },
        content_type: 'application/json',
        template: 'alertmanager-to-ha',
        timeout_ms: 5000,
        retries: 3,
        pauses_ms: [1000, 2000, 4000],
        budget_ms: 27000,
        lease_ms: 60000,
        max_attempts: 5,
    },
    {
        name: 'uptime-kuma',
        state: 'starting',
        received: 0,
        delivered: 0,
        failed: 0,
        avg_ms: null,
        last_success_unix: null,
        source: { kind: 'http', label: '/uptime-kuma', sub: 'POST', path: '/uptime-kuma' },
        sink: { kind: 'url', label: 'homeassistant.lan:8123', path: null },
        content_type: 'application/json',
        template: 'uptime-kuma-to-ha',
        timeout_ms: 10000,
        retries: 4,
        pauses_ms: [1000, 2000, 4000, 8000],
        budget_ms: 65000,
        lease_ms: null,
        max_attempts: null,
    },
];
const HEALTH_WORD = { working: 'working', starting: 'starting', failing: 'failing', denied: 'denied', 'hub-down': 'hub down' };
const HEALTH_TONE = { working: 'success', starting: 'info', failing: 'destructive', denied: 'destructive', 'hub-down': 'warning' };

// The app's own words over the package's dictionary: a profile with no delivery says "no delivery yet" (web/profiles.js).
setStrings({ agoNever: (/** @type {string} */ verb) => (verb === 'last delivery' ? 'no delivery yet' : `not ${verb} yet`) });

await ready;

// ───────────────────────────────────────────── 1 · the band beside the alerts
{
    const band = byId('hsa-band');
    const problems = byId('hsa-problems');
    const button = (/** @type {string} */ label) => {
        const b = el('button', 'kp-button kp-button--secondary kp-button--sm', label);
        b.type = 'button';
        return b;
    };
    const items = [
        {
            key: 'alertmanager',
            severity: /** @type {'critical'} */ ('critical'),
            title: 'alertmanager: the kyu hub refused our credentials',
            text: 'No message can be fetched from alerts.raw until the token is re-issued.',
            why: 'The hub did not accept the switchboard’s token for the subscription “switchboard”, so it cannot read the topic alerts.raw.',
            remedy: 'Re-issue the switchboard’s kyu token, then recheck the profiles.',
            fix: 'Recheck profiles',
        },
        {
            key: 'uptime-kuma',
            severity: /** @type {'info'} */ ('info'),
            title: 'uptime-kuma has not tried yet',
            text: 'Nothing was tried since the service started or since the last recheck.',
            why: 'Nothing was tried since the service started or since the last recheck.',
            remedy: 'Nothing to fix: it turns to working with the next message.',
            fix: 'Recheck profiles',
        },
    ];
    setAttention(
        band,
        items.map((i) => ({ key: i.key, severity: i.severity, title: i.title, text: i.text, action: button('See the fix') })),
    );
    setProblems(
        problems,
        items.map((i) => ({
            key: i.key,
            severity: i.severity,
            what: i.title,
            why: i.why,
            remedy: i.remedy,
            action: button(i.fix),
            dismissible: i.key === 'uptime-kuma',
        })),
    );
    byId('hsa-top').style.setProperty('--hsa-rows', String(items.length));
}

// ───────────────────────────────────────────── 2 · the profile rows
setAgo(byId('hsa-ago-a'), Date.now() - 180_000);
setAgo(byId('hsa-ago-k'), null);

// ───────────────────────────────────────────── 3 · Last 24 hours
{
    // The page's label for the refresh chooser stands in the bar's first track, as the app's "Page refresh" does.
    const bar = byId('hsa-h24-grid').querySelector('.kp-refresh__bar');
    if (bar) {
        bar.prepend(el('b', 'kp-formgrid__label hsa-refresh-label', 'Page refresh'));
    }
    const stamp = (/** @type {number} */ ms) => {
        const d = new Date(ms);
        const p = (/** @type {number} */ n) => String(n).padStart(2, '0');
        return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
    };
    const base = new Date(2026, 9, 19, 14, 20).getTime();
    const recent = [
        { at: base, ok: true, ms: 175 },
        { at: base - 2_100_000, ok: true, ms: 114 },
        { at: base - 3_900_000, ok: false, ms: null },
        { at: base - 5_700_000, ok: true, ms: 1204 },
    ];
    const list = document.querySelector('[data-hsa-recent]');
    list?.replaceChildren(
        ...recent.map((m) => {
            const li = el('li');
            li.innerHTML = `<time datetime="${new Date(m.at).toISOString()}">${stamp(m.at)}</time>
                <span class="kp-badge ${m.ok ? 'kp-badge--success' : 'kp-badge--destructive'}">${m.ok ? 'Delivered' : 'Failed'}</span>
                <span class="hsa-rows__ms">${m.ms === null ? 'no answer' : `${count(m.ms)} ms`}</span>
                <span class="hsa-rows__why">${m.ok ? 'Accepted by the destination' : 'Not accepted by the destination, retries used up'}</span>`;
            return li;
        }),
    );
}

// ───────────────────────────────────────────── the choice buttons: one pressed at a time
for (const group of document.querySelectorAll('.hsa-choices')) {
    const buttons = [...group.querySelectorAll('button')];
    for (const b of buttons) b.addEventListener('click', () => buttons.forEach((o) => o.setAttribute('aria-pressed', String(o === b))));
}

// ───────────────────────────────────────────── 5 · the profile cards
{
    const grid = byId('hsa-grid');
    const entity = (/** @type {(typeof PROFILES)[number]} */ p) => {
        const settled = p.delivered + p.failed;
        const share = settled === 0 ? null : p.delivered / settled;
        /** @type {{ label: string, tone?: 'success' | 'warning' | 'destructive' | 'info' }[]} */
        const flags = [{ label: p.source.kind === 'kyu' ? 'kyu topic' : 'HTTP POST' }, { label: 'HTTP webhook' }];
        if (p.state === 'denied') flags.push({ label: 'credentials refused', tone: 'destructive' });
        return {
            key: p.name,
            name: p.name,
            state: { label: HEALTH_WORD[/** @type {keyof typeof HEALTH_WORD} */ (p.state)], tone: /** @type {'success' | 'warning' | 'destructive' | 'info'} */ (HEALTH_TONE[/** @type {keyof typeof HEALTH_TONE} */ (p.state)]) },
            figures: [
                { value: count(p.delivered), label: 'Delivered' },
                { value: count(p.failed), label: 'Failed' },
                { value: p.avg_ms === null ? 'none yet' : `${count(p.avg_ms)} ms`, label: 'Average' },
            ],
            flags,
            meters: [
                {
                    label: 'Delivered',
                    value: share,
                    ...(share !== null && share < 0.99 ? { tone: /** @type {'warning'} */ ('warning') } : {}),
                    text: share === null ? 'Nothing tried yet' : `${(Math.floor(share * 1000) / 10).toFixed(1)} % delivered`,
                },
            ],
            actions: [
                { id: 'recheck', label: 'Recheck this profile' },
                { id: 'copy-test', label: 'Copy test command' },
                { id: 'try', label: 'Try a translation' },
            ],
        };
    };
    setEntityGrid(grid, PROFILES.map(entity));
    for (const p of PROFILES) {
        const card = grid.querySelector(`[data-kp-entity-key="${CSS.escape(p.name)}"]`);
        if (!card) continue;
        const line = el('div', 'hsa-fresh-line');
        const time = el('time', 'kp-ago');
        time.setAttribute('data-kp-ago', '');
        time.setAttribute('data-kp-ago-verb', 'last delivery');
        time.setAttribute('data-kp-stale-after', '86400');
        time.setAttribute('data-kp-ago-announce', 'state');
        line.append(time, el('span', 'hsa-quiet', 'Quiet time allowed: 1 day'));
        card.append(line);
        setAgo(time, p.last_success_unix === null ? null : p.last_success_unix * 1000);
    }
}

// ───────────────────────────────────────────── 6 · the path of a profile
{
    const trace = byId('hsa-trace');
    /** @type {Record<string, keyof typeof HEALTH_WORD>} */
    const health = { alertmanager: 'denied', 'uptime-kuma': 'starting' };
    let profile = 'alertmanager';
    /** The hops of one profile, as web/dashboard.js hopsOf makes them. @param {(typeof PROFILES)[number]} p @param {string} st */
    const hopsOf = (p, st) => {
        const base = st === 'starting' ? 'unknown' : 'allowed';
        const door = st === 'denied' || st === 'hub-down' ? 'refused' : base;
        const last = st === 'failing' ? 'refused' : base;
        const kyu = p.source.kind === 'kyu';
        return [
            { title: 'Sender', note: kyu ? 'publishes to the hub' : 'holds a sender token', verdict: base },
            {
                title: p.source.label,
                note: st === 'denied' ? 'the hub refused our credentials' : st === 'hub-down' ? 'the hub cannot be reached' : p.source.sub,
                verdict: door,
                ...(door === 'refused' ? { rule: st === 'denied' ? 'Credentials refused' : 'Hub unreachable' } : {}),
            },
            { title: 'Translation', note: `${p.content_type} from the profile's template`, verdict: base },
            { title: p.sink.label, note: 'destination', verdict: last, ...(last === 'refused' ? { rule: 'Receiver failing' } : {}) },
        ];
    };
    const draw = () => {
        const p = /** @type {(typeof PROFILES)[number]} */ (PROFILES.find((x) => x.name === profile));
        const st = health[profile];
        byId('hsa-trace-name').textContent = p.name;
        byId('hsa-trace-name').setAttribute('data-hsa-profile', p.name);
        const badge = byId('hsa-trace-badge');
        badge.textContent = HEALTH_WORD[st];
        badge.className = `kp-badge kp-badge--${HEALTH_TONE[st]} hsa-badge`;
        setTrace(trace, hopsOf(p, st));
        for (const b of document.querySelectorAll('[data-hsa-health]')) b.setAttribute('aria-pressed', String(b.getAttribute('data-hsa-health') === st));
        for (const b of document.querySelectorAll('[data-hsa-pick2]')) b.setAttribute('aria-pressed', String(b.getAttribute('data-hsa-pick2') === profile));
    };
    draw();
    for (const b of document.querySelectorAll('[data-hsa-pick2]'))
        b.addEventListener('click', () => {
            profile = b.getAttribute('data-hsa-pick2') ?? profile;
            draw();
        });
    for (const b of document.querySelectorAll('[data-hsa-health]'))
        b.addEventListener('click', () => {
            health[profile] = /** @type {keyof typeof HEALTH_WORD} */ (b.getAttribute('data-hsa-health'));
            draw();
        });
}

// ───────────────────────────────────────────── 7 · the settings cards
{
    const stage = byId('hsa-stage');
    const code = (/** @type {string} */ text) => el('code', 'kp-id', text);
    for (const [i, p] of PROFILES.entries()) {
        // A form grid that takes its rows from the stage (data-kp-formgrid-rows="subgrid", gapform-1019): Source beside Source.
        const card = el('article', 'kp-card kp-formgrid hsa-profile');
        card.setAttribute('data-kp-formgrid-rows', 'subgrid');
        card.setAttribute('data-kp-formgrid-lines', 'lines');
        const head = el('header', 'hsa-head');
        head.setAttribute('data-kp-formgrid-span', 'all');
        const title = el('h3', 'kp-card__title', p.name);
        title.id = `hsa-p-${i}`;
        card.setAttribute('aria-labelledby', title.id);
        const hasLease = p.lease_ms !== null;
        const inline = el('span', 'kp-meter kp-meter--inline kp-meter--over-spill');
        const badge = el('span', 'kp-badge');
        head.append(title, inline, badge);
        const dl = el('dl', 'kp-kv');
        /** @type {Record<string, HTMLElement>} */
        const dd = {};
        for (const label of ['Source', 'Destination host', 'Content type', 'Timeout', 'Retries', 'Max attempts', 'Lease', 'Retry budget']) {
            const row = el('div', 'kp-kv__row');
            dd[label] = el('dd');
            row.append(el('dt', '', label), dd[label]);
            dl.append(row);
        }
        const kyu = p.source.kind === 'kyu';
        dd['Source'].append(kyu ? 'kyu topic ' : 'HTTP ', code(p.source.label));
        dd['Destination host'].append(code(p.sink.label), ' ', el('span', 'hsa-quiet', '(path hidden)'));
        dd['Content type'].append(code(p.content_type));
        dd['Timeout'].append(`${seconds(p.timeout_ms)} per try`);
        dd['Retries'].append(String(p.retries));
        dd['Max attempts'].append(p.max_attempts === null ? 'Not used: an HTTP source has no hub' : `${p.max_attempts} hand-outs by the hub, then a dead letter`);
        dd['Lease'].append(p.lease_ms === null ? 'None: an HTTP source holds no lease' : seconds(p.lease_ms));
        const budget = dd['Retry budget'];
        budget.className = 'hsa-budget';
        const words = el('span');
        const meter = el('span', 'kp-meter kp-meter--over-spill');
        const tries = p.timeout_ms * (p.retries + 1);
        const pauses = p.pauses_ms.reduce((a, b) => a + b, 0);
        const sum = el('span', 'hsa-quiet', `${p.retries + 1} tries of ${seconds(p.timeout_ms)} is ${seconds(tries)}, plus pauses of ${said(p.pauses_ms)} is ${seconds(pauses)}.`);
        budget.append(words, meter, sum);
        if (p.lease_ms === null) {
            words.textContent = `${seconds(p.budget_ms)} in the worst case, with no lease to fit in`;
            meter.hidden = true;
            inline.hidden = true;
            badge.hidden = true;
        } else {
            const share = p.budget_ms / p.lease_ms;
            const over = p.budget_ms > p.lease_ms;
            setMeter(meter, { value: share, mark: 1, tone: over ? 'destructive' : null, label: 'of the lease', markLabel: 'the lease' });
            setMeter(inline, { value: share, tone: over ? 'destructive' : null, label: 'of the lease' });
            words.textContent = `${seconds(p.budget_ms)} of ${seconds(p.lease_ms)} lease (${Math.round(share * 100)} %)`;
            badge.textContent = over ? 'Over budget' : 'Within the lease';
            badge.className = `kp-badge ${over ? 'kp-badge--destructive' : 'kp-badge--success'}`;
        }
        card.append(head, dl);
        stage.append(card);
    }
}

// ───────────────────────────────────────────── 8 · the recheck table
{
    const rows = [
        { name: 'alertmanager', lease: 60, budget: 27 },
        { name: 'uptime-kuma', lease: null, budget: 65 },
        { name: 'jellyfin', lease: 30, budget: 9 },
    ];
    for (const r of rows) {
        const cell = document.querySelector(`[data-hsa-budget="${r.name}"]`);
        if (!cell) continue;
        if (r.lease === null) {
            cell.replaceChildren(el('span', 'hsa-budget__words', `No lease (${r.budget} s worst case)`));
            continue;
        }
        const share = r.budget / r.lease;
        const meter = el('span', 'kp-meter kp-meter--inline kp-meter--over-spill');
        const words = el('span', 'hsa-budget__words', `${Math.round(share * 100)} % of the lease`);
        cell.replaceChildren(meter, words);
        setMeter(meter, { value: share, tone: share > 1 ? 'destructive' : null, label: 'of the lease' });
    }
    for (const wrapper of document.querySelectorAll('.hsa-table [data-kp-menu-button]')) {
        const name = wrapper.closest('[data-hsa-row]')?.getAttribute('data-hsa-row') ?? '';
        setMenu(wrapper, [
            {
                group: name,
                items: [
                    { label: 'Recheck this profile', hint: 'Puts it back to starting', value: 'recheck' },
                    { label: 'Copy test command', hint: 'A command that renders one sample message without sending it', value: 'copy' },
                    { label: 'Try a translation', hint: 'Renders one sample message here, without sending it', value: 'try' },
                ],
            },
        ]);
    }
}

// ───────────────────────────────────────────── 9 · reloads
{
    const list = byId('hsa-reloads-list');
    const stamp = (/** @type {number} */ ms) => {
        const d = new Date(ms);
        const p = (/** @type {number} */ n) => String(n).padStart(2, '0');
        return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
    };
    const t0 = new Date(2026, 9, 19, 13, 52).getTime();
    const OUTCOME = {
        applied: ['kp-badge kp-badge--success', 'Applied'],
        'needs-restart': ['kp-badge kp-badge--warning', 'Needs a restart'],
        invalid: ['kp-badge kp-badge--destructive', 'Invalid'],
    };
    const reloads = [
        { at: t0, outcome: 'invalid', headline: 'Refused: the profile file is not valid', detail: 'Line 14: the template of uptime-kuma does not close its brace. Nothing changed.' },
        { at: t0 - 5_400_000, outcome: 'applied', headline: 'Changed: alertmanager', detail: 'The next message already uses the new version.' },
        { at: t0 - 21_600_000, outcome: 'needs-restart', headline: 'Nothing changed', detail: 'The listen address changed. The service keeps running as it started; restart it to apply the change.' },
        { at: t0 - 90_000_000, outcome: 'applied', headline: 'No profile changed', detail: 'The file was read again and holds the same profiles as before.' },
    ];
    list.replaceChildren(
        ...reloads.map((r) => {
            const li = el('li', 'kp-timeline__item');
            const marker = el('span', 'kp-timeline__marker');
            marker.setAttribute('aria-hidden', 'true');
            const body = el('span', 'hsa-reload');
            const time = el('time', 'kp-timeline__when', stamp(r.at));
            time.dateTime = new Date(r.at).toISOString();
            const outcome = el('span', 'hsa-reload__outcome');
            const [cls, word] = OUTCOME[/** @type {keyof typeof OUTCOME} */ (r.outcome)];
            outcome.append(el('span', cls, word));
            const what = el('span', 'hsa-reload__what');
            what.append(el('span', '', r.headline), el('span', '', r.detail));
            body.append(time, outcome, what);
            li.append(marker, body);
            return li;
        }),
    );
    setProblems(byId('hsa-reloads-alert'), [
        {
            key: 'reload-invalid',
            severity: 'warning',
            what: `The latest reload (${stamp(t0)}) was refused`,
            why: 'Line 14: the template of uptime-kuma does not close its brace. The service keeps running on the last good version, so nothing is lost.',
            remedy: 'Correct the profile file, then reload again.',
            command: 'systemctl reload http-switchboard',
        },
    ]);
}

// ───────────────────────────────────────────── 10 · the names and their hover card
{
    const find = (/** @type {string} */ name) => PROFILES.find((p) => p.name === name);
    const fill = (/** @type {Element} */ anchor) => {
        const p = find(anchor.getAttribute('data-hsa-profile') ?? '');
        if (!p) return null;
        const kyu = p.source.kind === 'kyu';
        /** @type {[string, string][]} */
        const rows = [
            ['Status', HEALTH_WORD[/** @type {keyof typeof HEALTH_WORD} */ (p.state)]],
            ['Source', `${p.source.label}${kyu ? ` (${p.source.sub})` : ''}`],
            ['Destination host', p.sink.label],
            ['Content type', p.content_type],
            ['Template', p.template],
            ['Received', count(p.received)],
            ['Delivered', count(p.delivered)],
            ['Failed', count(p.failed)],
            ['Last success', p.last_success_unix === null ? 'none yet' : '3 min ago'],
        ];
        const dl = el('dl', 'kp-kv hsa-card-kv');
        for (const [label, value] of rows) {
            const row = el('div', 'kp-kv__row');
            row.append(el('dt', '', label), el('dd', '', value));
            dl.append(row);
        }
        return dl;
    };
    for (const b of document.querySelectorAll('[data-hsa-names-health]'))
        b.addEventListener('click', () => {
            const st = /** @type {keyof typeof HEALTH_WORD} */ (b.getAttribute('data-hsa-names-health'));
            PROFILES[0].state = st;
            const badge = document.querySelector('[data-hsa-names-badge="alertmanager"]');
            if (badge) {
                badge.textContent = HEALTH_WORD[st];
                badge.className = `kp-badge kp-badge--${HEALTH_TONE[st]}`;
            }
            for (const o of document.querySelectorAll('[data-hsa-names-health]')) o.setAttribute('aria-pressed', String(o === b));
        });
    const cards = attachHoverCards(document, { fill });
    const isName = (/** @type {EventTarget | null} */ t) => t instanceof Element && t.closest('[data-hsa-profile]') !== null;
    const plateOf = (/** @type {EventTarget | null} */ t) => (t instanceof Element ? t.closest('.hsa-card') : null);
    // Room under the names while their card is open, so a review frame as tall as its content does not cut it off; given when a
    // name is rested on or focused, taken back after the card has left.
    let settle = 0;
    const grant = (/** @type {EventTarget | null} */ t) => {
        window.clearTimeout(settle);
        plateOf(t)?.classList.add('hsa-names-wrap--room');
        cards.card.removeAttribute('data-rv-off');
    };
    const release = () => {
        window.clearTimeout(settle);
        settle = window.setTimeout(() => {
            if (cards.anchor() === null && !document.querySelector('[data-hsa-profile]:hover, [data-hsa-profile]:focus'))
                for (const plate of document.querySelectorAll('.hsa-names-wrap--room')) plate.classList.remove('hsa-names-wrap--room');
        }, 600);
    };
    document.addEventListener('pointerover', (e) => isName(e.target) && grant(e.target), true);
    document.addEventListener('pointerout', (e) => isName(e.target) && release(), true);
    document.addEventListener('focusin', (e) => isName(e.target) && grant(e.target), true);
    document.addEventListener('focusout', (e) => isName(e.target) && release(), true);
}

// ───────────────────────────────────────────── 11 · Try a translation
const MESSAGE = {
    receiver: 'switchboard',
    status: 'firing',
    alerts: [
        {
            status: 'firing',
            labels: { alertname: 'DiskAlmostFull', instance: 'ct106:9100', severity: 'warning', job: 'node', mountpoint: '/' },
            annotations: { summary: 'ct106 root disk is 91 % full' },
            startsAt: '2026-10-19T06:12:30.000Z',
            fingerprint: '3f9a1c0be2d41a77',
        },
    ],
    groupLabels: { alertname: 'DiskAlmostFull' },
    externalURL: 'http://alertmanager.lan:9093',
    version: '4',
};
const TEMPLATE = [
    '{',
    '  "alert": {{ alerts.0.labels.alertname | tojson }},',
    '  "status": {{ alerts.0.status | tojson }},',
    '  "severity": {{ alerts.0.labels.severity | default("warning") | tojson }},',
    '  "instance": {{ alerts.0.labels.instance | default("unknown") | tojson }},',
    '  "count": {{ alerts | length }},',
    '  "summary": {{ alerts | map(attribute="annotations.summary") | join("; ") | tojson }}',
    '}',
].join('\n');
const BODY = {
    alert: 'DiskAlmostFull',
    status: 'firing',
    severity: 'warning',
    instance: 'ct106:9100',
    count: 1,
    summary: 'ct106 root disk is 91 % full',
};
{
    const area = /** @type {HTMLTextAreaElement} */ (byId('hsa-message'));
    area.value = JSON.stringify(MESSAGE, null, 2);
    area.dispatchEvent(new Event('input', { bubbles: true }));
    setCode(byId('hsa-template'), { text: TEMPLATE, title: 'Template of alertmanager', language: 'minijinja', lines: true, wrap: true, maxLines: 8, state: 'ready' });
    setCode(byId('hsa-body'), { text: JSON.stringify(BODY, null, 2), title: 'Translated body', language: 'JSON', lines: true, state: 'ready' });
    setCardState(byId('hsa-result'), 'ready');
}

// ───────────────────────────────────────────── 12 · the diff
{
    const before = JSON.stringify(MESSAGE, null, 2).split('\n');
    const after = JSON.stringify(BODY, null, 2).split('\n');
    const diff = byId('hsa-diff');
    let removed = 0;
    let added = 0;
    const rows = [
        ...before.map((text, i) => ({ kind: 'removed', n: i + 1, text })),
        ...after.map((text, i) => ({ kind: 'added', n: i + 1, text })),
    ];
    diff.replaceChildren(
        ...rows.map((r) => {
            const line = el('span', 'kp-diff__line');
            line.setAttribute('data-kind', r.kind);
            if (r.kind === 'removed') removed += 1;
            else added += 1;
            line.append(el('span', 'kp-diff__number', String(r.n)), el('span', 'kp-diff__sign', r.kind === 'added' ? '+' : '-'), el('span', '', r.text));
            return line;
        }),
    );
    diff.setAttribute('aria-label', `Changes from the received message to the delivered body: ${removed} lines removed, ${added} lines added`);
    byId('hsa-diffcount').textContent = `${removed} lines removed · ${added} lines added`;
}
