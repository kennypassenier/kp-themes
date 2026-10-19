// research/app-hsb-profiles: the page's own wiring. The components are the package's (js/auto.js attaches them); this
// file only feeds them sample data, presses their states and writes what they fire into a readout.

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

/** @param {string} id @param {string} text */
const say = (id, text) => {
    const out = document.getElementById(id);
    if (out) out.textContent = text;
};

/** @param {number} n exact, with a thousands separator */
const count = (n) => n.toLocaleString('en-GB');

// ── the sample data (mock) ─────────────────────────────────────────────────────────────────────────────────────
/** The two profiles. The destination is shown as a host only: the webhook path is a credential. */
const PROFILES = {
    alertmanager: {
        key: 'alertmanager',
        source: 'kyu topic alerts.raw',
        sourceSub: 'subscription switchboard',
        sourceKind: 'kyu topic',
        door: 'kyu topic alerts.raw',
        doorNote: 'subscription switchboard',
        sender: 'Alertmanager',
        destination: 'Home Assistant',
        host: 'homeassistant.lan:8123',
        contentType: 'application/json',
        template: 'Alertmanager JSON to alert, status, severity, instance, count, summary',
        hasHub: true,
        mock: false,
    },
    'uptime-kuma': {
        key: 'uptime-kuma',
        source: 'POST /uptime-kuma',
        sourceSub: 'HTTP, no hub',
        sourceKind: 'HTTP POST',
        door: 'POST /uptime-kuma',
        doorNote: 'door of HTTPSwitchboard',
        sender: 'Uptime Kuma',
        destination: 'Home Assistant',
        host: 'homeassistant.lan:8123',
        contentType: 'application/json',
        template: 'Uptime Kuma heartbeat to monitor, status, message',
        hasHub: false,
        mock: true,
    },
};

/** @typedef {'working' | 'starting' | 'failing' | 'denied' | 'hubdown'} Health */

const HEALTH_WORD = { working: 'working', starting: 'starting', failing: 'failing', denied: 'denied', hubdown: 'hub down' };
const HEALTH_TONE = { working: 'success', starting: 'info', failing: 'destructive', denied: 'destructive', hubdown: 'warning' };

/**
 * What a profile reads under a scenario. uptime-kuma has no hub, so it ignores Denied and Hub down.
 * @param {keyof typeof PROFILES} key @param {Health} scenario
 * @returns {{ state: Health, received: number, delivered: number, failed: number, avgMs: number | null, last: string | null }}
 */
function healthOf(key, scenario) {
    const state = !PROFILES[key].hasHub && (scenario === 'denied' || scenario === 'hubdown') ? 'working' : scenario;
    if (state === 'starting') return { state, received: 0, delivered: 0, failed: 0, avgMs: null, last: null };
    if (key === 'alertmanager') {
        if (state === 'failing') return { state, received: 1303, delivered: 1284, failed: 19, avgMs: 212, last: '19/10/2026 06:58' };
        return { state, received: 1288, delivered: 1284, failed: 4, avgMs: 212, last: '19/10/2026 07:42' };
    }
    if (state === 'failing') return { state, received: 112, delivered: 96, failed: 16, avgMs: 143, last: '19/10/2026 07:12' };
    return { state, received: 96, delivered: 96, failed: 0, avgMs: 143, last: '19/10/2026 07:51' };
}

/** The share delivered, cut and never rounded up. @param {{ delivered: number, failed: number }} h */
const share = (h) => (h.delivered + h.failed === 0 ? null : h.delivered / (h.delivered + h.failed));
/** @param {number} v */
const percent = (v) => `${(Math.floor(v * 1000) / 10).toFixed(1)} %`;

await ready;

// ── the profiles view ──────────────────────────────────────────────────────────────────────────────────────────
if (document.getElementById('profiles-component')) {
    const { setEntityGrid, setEntityGridState } = await import('../../js/entity-card.js');
    const { setMatrix } = await import('../../js/heat.js');
    const { attachHoverCards } = await import('../../js/hovercard.js');
    const grid = /** @type {HTMLElement} */ (document.getElementById('hp-grid'));
    const map = /** @type {HTMLElement} */ (document.getElementById('hp-map'));
    let view = 'cards';
    /** @type {Health} */
    let scenario = 'working';
    let data = 'ready';
    /** @type {Set<string>} profiles put back to starting by their own Recheck */
    const rechecked = new Set();
    let timer = 0;

    const current = (/** @type {keyof typeof PROFILES} */ key) => healthOf(key, rechecked.has(key) ? 'starting' : scenario);

    const entities = () =>
        /** @type {(keyof typeof PROFILES)[]} */ (Object.keys(PROFILES)).map((key) => {
            const p = PROFILES[key];
            const h = current(key);
            const s = share(h);
            /** @type {{ label: string, tone?: 'success' | 'warning' | 'destructive' | 'info' }[]} */
            const flags = [{ label: p.sourceKind }, { label: 'HA webhook' }];
            if (h.state === 'failing') flags.push({ label: 'messages waiting on the hub', tone: 'destructive' });
            if (h.state === 'denied') flags.push({ label: 'credentials refused', tone: 'destructive' });
            if (h.state === 'hubdown') flags.push({ label: 'hub unreachable', tone: 'warning' });
            if (p.mock) flags.push({ label: 'mock profile', tone: 'info' });
            return {
                key,
                name: p.key,
                state: { label: HEALTH_WORD[h.state], tone: /** @type {'success' | 'warning' | 'destructive' | 'info'} */ (HEALTH_TONE[h.state]) },
                figures: [
                    { value: count(h.delivered), label: 'Delivered' },
                    { value: count(h.failed), label: 'Failed' },
                    { value: h.avgMs === null ? 'none yet' : `${h.avgMs} ms`, label: 'Average' },
                ],
                flags,
                meters: [
                    {
                        label: 'Delivered',
                        value: s,
                        ...(s !== null && s < 0.99 ? { tone: /** @type {'warning'} */ ('warning') } : {}),
                        text: s === null ? 'Nothing tried yet' : `${percent(s)} delivered`,
                    },
                ],
                actions: [
                    { id: 'recheck', label: 'Recheck this profile' },
                    { id: 'copy-test', label: 'Copy test command' },
                ],
            };
        });

    const mapSpec = () => {
        const toneOf = (/** @type {keyof typeof PROFILES} */ key, /** @type {'source' | 'dest'} */ side) => {
            const st = current(key).state;
            if (st === 'starting') return 'muted';
            if (side === 'source') return st === 'denied' || st === 'hubdown' ? 'bad' : 'ok';
            return st === 'failing' ? 'bad' : st === 'denied' || st === 'hubdown' ? 'muted' : 'ok';
        };
        const keys = /** @type {(keyof typeof PROFILES)[]} */ (Object.keys(PROFILES));
        return {
            corner: 'Source to destination',
            rows: keys.map((key) => ({
                key: `src-${key}`,
                label: PROFILES[key].source,
                sub: `profile ${key}, ${PROFILES[key].sourceSub}`,
                tone: toneOf(key, 'source'),
                dashed: current(key).state === 'starting',
            })),
            columns: keys.map((key) => ({
                key: `dst-${key}`,
                label: `Home Assistant for ${key}`,
                sub: PROFILES[key].host,
                tone: toneOf(key, 'dest'),
            })),
            cell: (/** @type {string} */ row, /** @type {string} */ column) =>
                row.slice(4) === column.slice(4) ? { tone: 'ok', label: 'delivers' } : { tone: 'none' },
            countLabel: (/** @type {number} */ n) => `${n} ${n === 1 ? 'profile' : 'profiles'}`,
            sourcesLabel: 'Sources',
            usersLabel: 'Destinations',
        };
    };

    /** Put the hover card on every card name, drawn or redrawn. */
    const nameCards = () => {
        for (const name of grid.querySelectorAll('.kp-entity__name')) {
            name.setAttribute('data-kp-hovercard', '');
            name.setAttribute('data-hp-profile', name.textContent?.trim() ?? '');
        }
    };

    const draw = () => {
        window.clearTimeout(timer);
        grid.hidden = view !== 'cards';
        map.hidden = view !== 'map';
        if (data === 'ready') {
            setEntityGrid(grid, entities());
            setMatrix(map, { ...mapSpec(), view: 'lines' });
        } else if (data === 'loading') {
            setEntityGridState(grid, 'loading', { count: 2 });
            setMatrix(map, { ...mapSpec(), view: 'lines', state: 'loading', skeleton: 2 });
        } else if (data === 'empty') {
            setEntityGridState(grid, 'empty', {
                title: 'No profiles yet',
                message: 'Profiles are read from the configuration on disk. Add one and reload.',
                actionLabel: 'Reload profiles',
            });
            setMatrix(map, { view: 'lines', rows: [], columns: [], state: 'empty', message: 'No profiles yet' });
        } else {
            setEntityGridState(grid, 'error', { title: 'The profiles could not be read', message: 'The configuration on disk is not readable.' });
            setMatrix(map, { view: 'lines', rows: [], columns: [], state: 'error', message: 'The profiles could not be read' });
        }
        nameCards();
    };
    draw();

    const press = (/** @type {string} */ attr, /** @type {string} */ value) => {
        for (const b of document.querySelectorAll(`[${attr}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
    };
    /** Load again: loading for a moment, then the data. */
    const reload = () => {
        data = 'loading';
        press('data-hp-data', 'loading');
        draw();
        timer = window.setTimeout(() => {
            data = 'ready';
            press('data-hp-data', 'ready');
            draw();
        }, 1400);
    };

    stateButtons('data-hp-view', (value) => {
        view = value === 'map' ? 'map' : 'cards';
        draw();
    });
    stateButtons('data-hp-health', (value) => {
        scenario = /** @type {Health} */ (value);
        rechecked.clear();
        draw();
    });
    stateButtons('data-hp-data', (value) => {
        data = value;
        draw();
    });
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id !== 'profiles-default-view') return;
        view = detail.value === 'map' ? 'map' : 'cards';
        press('data-hp-view', view);
        draw();
    });

    grid.addEventListener('kp-entity-action', (event) => {
        const { key, id } = /** @type {CustomEvent} */ (event).detail;
        if (id === 'recheck') {
            rechecked.add(key);
            draw();
            say('hp-log', `kp-entity-action\n${JSON.stringify({ key, id })}: ${key} is back to starting`);
        } else {
            const command = `curl -X POST http://switchboard.lan/${key} -H 'Content-Type: application/json' -d @sample.json`;
            navigator.clipboard?.writeText(command).catch(() => {});
            say('hp-log', `kp-entity-action\n${JSON.stringify({ key, id })}: ${command}`);
        }
    });
    grid.addEventListener('kp-entity-new', reload);
    grid.addEventListener('kp-entity-grid-retry', reload);
    map.addEventListener('kp-uses-retry', reload);
    map.addEventListener('kp-uses-pin', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        say('hp-log', `kp-uses-pin\n${JSON.stringify({ key: d.key, side: d.side, pinned: d.pinned, related: d.related })}`);
    });
    void attachHoverCards;
}

// ── the path of one profile ─────────────────────────────────────────────────────────────────────────────────────
if (document.getElementById('trace-component')) {
    const { setTrace, trace } = await import('../../js/path-trace.js');
    const el = /** @type {HTMLElement} */ (document.getElementById('hp-trace'));
    let profile = /** @type {keyof typeof PROFILES} */ ('alertmanager');
    /** @type {Health} */
    let scenario = 'working';
    let data = 'ready';

    /** @param {keyof typeof PROFILES} key @param {Health} wanted */
    const hops = (key, wanted) => {
        const p = PROFILES[key];
        const st = healthOf(key, wanted).state;
        /** @type {'allowed' | 'refused' | 'unknown'} */
        const base = st === 'starting' ? 'unknown' : 'allowed';
        const door = st === 'denied' || st === 'hubdown' ? 'refused' : base;
        const last = st === 'failing' ? 'refused' : base;
        return [
            { title: p.sender, note: 'sender', verdict: base },
            {
                title: p.door,
                note: st === 'denied' ? 'the hub refused our credentials' : st === 'hubdown' ? 'the hub cannot be reached' : p.doorNote,
                verdict: door,
                ...(door === 'refused' ? { rule: st === 'denied' ? 'Credentials refused' : 'Hub unreachable' } : {}),
            },
            { title: 'Translation', note: key === 'alertmanager' ? 'six fields for Home Assistant' : 'three fields for Home Assistant', verdict: base },
            {
                title: p.destination,
                note: p.host,
                verdict: last,
                ...(last === 'refused' ? { rule: 'Receiver failing' } : {}),
            },
        ];
    };

    const draw = () => {
        const st = healthOf(profile, scenario).state;
        const name = document.getElementById('hp-trace-name');
        if (name) name.textContent = profile;
        const badge = document.getElementById('hp-trace-badge');
        if (badge) {
            badge.textContent = HEALTH_WORD[st];
            badge.className = `kp-badge kp-badge--${HEALTH_TONE[st]}`;
        }
        if (data === 'ready') setTrace(el, hops(profile, scenario));
        else {
            if (!trace(el)) setTrace(el, hops(profile, scenario));
            trace(el)?.setState(/** @type {'running' | 'empty' | 'error'} */ (data), { message: 'The profile could not be read.' });
        }
    };
    draw();

    stateButtons('data-hp-trace-profile', (value) => {
        profile = /** @type {keyof typeof PROFILES} */ (value);
        draw();
    });
    stateButtons('data-hp-trace-health', (value) => {
        scenario = /** @type {Health} */ (value);
        draw();
    });
    stateButtons('data-hp-trace-data', (value) => {
        data = value;
        draw();
    });
    el.addEventListener('kp-trace-rule', (event) => say('hp-trace-log', `kp-trace-rule\n${JSON.stringify(/** @type {CustomEvent} */ (event).detail)}`));
    el.addEventListener('kp-trace-retry', () => {
        data = 'running';
        for (const b of document.querySelectorAll('[data-hp-trace-data]')) b.setAttribute('aria-pressed', String(b.getAttribute('data-hp-trace-data') === 'running'));
        draw();
        window.setTimeout(() => {
            data = 'ready';
            for (const b of document.querySelectorAll('[data-hp-trace-data]')) b.setAttribute('aria-pressed', String(b.getAttribute('data-hp-trace-data') === 'ready'));
            draw();
        }, 1400);
    });
}

// ── the card on a profile name ──────────────────────────────────────────────────────────────────────────────────
if (document.getElementById('hover-component')) {
    const { attachHoverCards } = await import('../../js/hovercard.js');
    /** @type {Health} */
    let scenario = 'working';

    /** The full shape of a profile, built as nodes: a card is never filled with markup text. @param {Element} anchor */
    const fill = (anchor) => {
        const key = /** @type {keyof typeof PROFILES | undefined} */ (anchor.getAttribute('data-hp-profile') ?? undefined);
        const p = key ? PROFILES[key] : undefined;
        if (!key || !p) return null;
        const h = healthOf(key, scenario);
        const rows = [
            ['Status', HEALTH_WORD[h.state]],
            ['Source', `${p.source}${p.hasHub ? ` (${p.sourceSub})` : ''}`],
            ['Destination', `${p.destination}, ${p.host}`],
            ['Content type', p.contentType],
            ['Template', p.template],
            ['Received', count(h.received)],
            ['Delivered', count(h.delivered)],
            ['Failed', count(h.failed)],
            ['Last success', h.last ?? 'none yet'],
        ];
        const dl = document.createElement('dl');
        dl.className = 'kp-kv hp-card-kv';
        for (const [label, value] of rows) {
            const row = document.createElement('div');
            row.className = 'kp-kv__row';
            const dt = document.createElement('dt');
            dt.textContent = label ?? '';
            const dd = document.createElement('dd');
            dd.textContent = value ?? '';
            row.append(dt, dd);
            dl.append(row);
        }
        return dl;
    };
    // One card per page; auto.js attached it, this hands it the `fill` and returns the same handle.
    const cards = attachHoverCards(document, { fill });
    const box = /** @type {HTMLElement} */ (document.getElementById('hover-component'));
    const names = () => /** @type {HTMLElement[]} */ ([...box.querySelectorAll('[data-hp-profile]')]);
    const isName = (/** @type {EventTarget | null} */ t) => t instanceof Element && box.contains(t) && t.closest('[data-hp-profile]') !== null;

    // Room for the card. In the review dialog the section stands in a frame as tall as its content, and the card (fixed to
    // the frame's window) would be cut off or squeezed to a scrolling sliver. The room is given when a name is rested on
    // or focused, the card is placed again once the frame has grown, and the room is taken back after the card has left.
    let settle = 0;
    const room = (/** @type {boolean} */ on) => box.classList.toggle('hp-frame--room', on);
    const release = () => {
        window.clearTimeout(settle);
        settle = window.setTimeout(() => {
            if (cards.anchor() === null && !names().some((n) => n.matches(':hover, :focus'))) room(false);
        }, 600);
    };
    const grant = () => {
        window.clearTimeout(settle);
        room(true);
        // The review dialog isolates a section in its frame by setting aside every sibling of the section's ancestors with
        // `data-rv-off` (display: none), and the one shared card, a child of <body> made at boot, is such a sibling: it
        // opened (hidden=false) and was never drawn. Its host is not set aside.
        cards.card.removeAttribute('data-rv-off');
    };
    document.addEventListener('pointerover', (e) => isName(e.target) && grant(), true);
    document.addEventListener('pointerout', (e) => isName(e.target) && release(), true);
    document.addEventListener('focusin', (e) => isName(e.target) && grant(), true);
    document.addEventListener('focusout', (e) => isName(e.target) && release(), true);
    document.addEventListener('kp-hovercard', (e) => {
        const { open, anchor } = /** @type {CustomEvent} */ (e).detail;
        if (!isName(anchor)) return;
        // The button of the profile whose card is on screen is the one pressed, however the card was opened or closed.
        const key = anchor.getAttribute('data-hp-profile');
        for (const b of document.querySelectorAll('[data-hp-hover-open]')) b.setAttribute('aria-pressed', String(open && b.getAttribute('data-hp-hover-open') === key));
        if (!open) return release();
        grant();
        // The frame follows the room within a frame or two (its window resizes); the card is placed once more then.
        let placed = false;
        const again = () => {
            if (placed) return;
            placed = true;
            window.removeEventListener('resize', again);
            requestAnimationFrame(() => cards.anchor() && cards.refresh());
        };
        window.addEventListener('resize', again);
        window.setTimeout(again, 350);
    });

    const paintBadges = () => {
        for (const badge of document.querySelectorAll('[data-hp-hover-badge]')) {
            const key = /** @type {keyof typeof PROFILES} */ (badge.getAttribute('data-hp-hover-badge'));
            const st = healthOf(key, scenario).state;
            badge.textContent = HEALTH_WORD[st];
            badge.className = `kp-badge kp-badge--${HEALTH_TONE[st]}`;
        }
    };
    // A press on Health leaves the focus where it is, so an opened card stays on screen and shows the new state at once.
    for (const b of document.querySelectorAll('[data-hp-hover-health]')) b.addEventListener('mousedown', (e) => e.preventDefault());
    stateButtons('data-hp-hover-health', (value) => {
        scenario = /** @type {Health} */ (value);
        paintBadges();
        if (cards.anchor()) cards.refresh();
    });

    // "Show the card": a keyboard focus on the name opens the card at once, so the opened state is on screen. The pressed
    // state itself follows the card (the kp-hovercard handler above), so Escape or a click elsewhere un-presses it.
    for (const button of /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll('[data-hp-hover-open]')])) {
        button.addEventListener('click', () => {
            const key = button.getAttribute('data-hp-hover-open');
            const anchor = /** @type {HTMLElement | null} */ (box.querySelector(`[data-hp-profile="${key}"]`));
            if (button.getAttribute('aria-pressed') === 'true') {
                cards.hide();
                anchor?.blur();
            } else {
                grant();
                anchor?.focus({ preventScroll: true });
            }
        });
    }
}
