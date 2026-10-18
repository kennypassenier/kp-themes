// research/kpadopt6-ops: the page's own wiring. The components are the package's (js/auto.js attaches them); this file only
// feeds them sample data, presses their states and writes what they fire into a readout.

/** Resolves once js/auto.js has attached everything the page carries. */
export const ready = new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});

/**
 * Write the last event a component fired into the readout beside it.
 * @param {string} selector a component root
 * @param {string} type the event name
 * @param {string} log the readout's id
 * @param {(detail: any) => string} [say]
 */
export function readout(selector, type, log, say = (detail) => JSON.stringify(detail)) {
    const out = document.getElementById(log);
    if (!out) return;
    for (const el of document.querySelectorAll(selector)) {
        el.addEventListener(type, (event) => {
            out.textContent = `${type}\n${say(/** @type {CustomEvent} */ (event).detail)}`;
        });
    }
}

/** Press a state button: exactly one of the group is pressed. @param {string} attribute the data attribute on the buttons @param {(value: string) => void} apply */
export function stateButtons(attribute, apply) {
    const buttons = /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll(`[${attribute}]`)]);
    for (const button of buttons) {
        button.addEventListener('click', () => {
            for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
            apply(button.getAttribute(attribute) ?? '');
        });
    }
}

/** What the review dialog sets for a choice, as the section hears it. @param {string} id @param {(value: string) => void} apply */
export function onChoice(id, apply) {
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id === id) apply(String(detail.value));
    });
}

await ready;

// ── toggle button ──
{
    const { attachToggles, toggle, togglePressedKeys } = await import('../../../../js/toggle.js');
    const word = (/** @type {any} */ d) =>
        `${d.button.textContent.trim().replace(/\s+/g, ' ')} ${d.pressed ? 'on' : 'off'}${d.group ? `; on in ${d.group}: ${d.pressedKeys.join(', ') || 'none'}` : ''}`;
    readout('[data-kv-toggle-single] > [data-kp-toggle]:first-child', 'kp-toggle', 'kv-toggle-single-log', word);
    readout('#kv-toggle-filters', 'kp-toggle-changed', 'kv-toggle-filters-log', (d) => `pressedKeys: ${d.pressedKeys.join(', ') || '(none: all)'}`);
    readout('#kv-toggle-single', 'kp-toggle-changed', 'kv-toggle-single-log2', (d) => `range: ${d.pressedKeys.join(', ') || 'none'}`);

    // Which lines the level filters show: the real number, never "9+".
    const counts = { error: 12, warning: 31, info: 95 };
    const shown = document.getElementById('kv-toggle-filters-shown');
    const filters = document.getElementById('kv-toggle-filters');
    const paintShown = () => {
        if (!shown || !filters) return;
        const keys = togglePressedKeys(/** @type {HTMLElement} */ (filters.querySelector('[data-kp-toggle]')));
        const n = keys.length === 0 ? 138 : keys.reduce((sum, k) => sum + (counts[/** @type {'error'} */ (k)] ?? 0), 0);
        shown.textContent = `Showing ${n} lines${keys.length ? ` (${keys.join(' and ')})` : ''}.`;
    };
    filters?.addEventListener('kp-toggle-changed', paintShown);

    // The tick is a choice: the toggles carry it as the attribute a consumer's own markup would, and the module follows.
    /** @param {string} mark */
    const setMark = (mark) => {
        for (const button of document.querySelectorAll('#toggle [data-kp-toggle]')) {
            if (mark === 'check') button.setAttribute('data-kp-pressed-mark', 'check');
            else button.removeAttribute('data-kp-pressed-mark');
        }
        for (const b of document.querySelectorAll('[data-kv-mark]')) b.setAttribute('aria-pressed', String(b.getAttribute('data-kv-mark') === mark));
    };
    stateButtons('data-kv-mark', setMark);
    onChoice('toggle-pressed-mark', setMark);

    // The app that takes a second, or refuses.
    const asyncButton = document.getElementById('kv-toggle-async');
    let refuse = false;
    asyncButton?.addEventListener('kp-toggle', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        const log = document.getElementById('kv-toggle-async-log');
        if (log) log.textContent = `kp-toggle: asked for ${detail.pressed ? 'on' : 'off'}; the app is working…`;
        detail.wait(
            new Promise((resolve, reject) =>
                setTimeout(() => {
                    if (refuse) {
                        if (log) log.textContent = 'The app refused: pinning needs the admin role.';
                        reject(new Error('Pinning needs the admin role.'));
                    } else {
                        if (log) log.textContent = 'The app accepted.';
                        resolve(undefined);
                    }
                }, 1100),
            ),
        );
    });
    for (const b of document.querySelectorAll('[data-kv-refuse]'))
        b.addEventListener('click', () => {
            refuse = !refuse;
            b.setAttribute('aria-pressed', String(refuse));
        });
    for (const b of document.querySelectorAll('[data-kv-count]'))
        b.addEventListener('click', () => {
            const v = b.getAttribute('data-kv-count');
            const target = document.getElementById('kv-toggle-count');
            if (target) toggle(target)?.setCount(v === 'loading' ? 'loading' : Number(v));
        });
    void attachToggles;
}

// ── the palette that finds words in any order ──
{
    const { palette } = await import('../../../../js/palette.js');
    const main = document.getElementById('kv-intent-pal');
    const states = document.getElementById('kv-intent-states');
    const phone = document.getElementById('kv-intent-phone');

    /** Type into a palette's input as a person would: the input event does the filtering. @param {HTMLElement | null} dialog @param {string} text */
    const typeInto = (dialog, text) => {
        const input = dialog?.querySelector('input');
        if (!(input instanceof HTMLInputElement)) return;
        input.value = text;
        input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    for (const b of document.querySelectorAll('[data-kv-query]'))
        b.addEventListener('click', () => typeInto(main, b.getAttribute('data-kv-query') ?? ''));
    for (const b of document.querySelectorAll('[data-kv-query2]'))
        b.addEventListener('click', () => typeInto(states, b.getAttribute('data-kv-query2') ?? ''));

    for (const b of document.querySelectorAll('[data-kv-typed]'))
        b.addEventListener('click', async () => {
            const text = b.getAttribute('data-kv-typed') ?? '';
            typeInto(main, '');
            for (let at = 1; at <= text.length; at++) {
                await new Promise((resolve) => setTimeout(resolve, 150));
                typeInto(main, text.slice(0, at));
            }
        });

    const log = document.getElementById('kv-intent-log');
    main?.addEventListener('kp-palette-run', (event) => {
        if (log) log.textContent = `kp-palette-run\n${JSON.stringify({ value: /** @type {CustomEvent} */ (event).detail.value })}`;
    });

    /** @param {string} look */
    const setMarkLook = (look) => {
        for (const el of [main, states, phone]) {
            if (!el) continue;
            el.removeAttribute('data-kp-mark-look');
            el.removeAttribute('data-kp-highlight');
            if (look === 'wash') el.setAttribute('data-kp-mark-look', 'wash');
            if (look === 'none') el.setAttribute('data-kp-highlight', 'off');
            palette(el)?.refresh();
        }
        for (const b of document.querySelectorAll('[data-kv-mark-look]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-kv-mark-look') === look));
    };
    stateButtons('data-kv-mark-look', setMarkLook);
    onChoice('intent-mark', setMarkLook);

    /** @param {string} state */
    const setState = (state) => {
        if (!states) return;
        palette(states)?.setState(/** @type {'ready' | 'loading' | 'error'} */ (state), { message: 'The host did not answer.' });
        for (const b of document.querySelectorAll('[data-kv-intent-state]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-kv-intent-state') === state));
    };
    stateButtons('data-kv-intent-state', setState);
    states?.addEventListener('kp-palette-retry', () => setState('ready'));
    stateButtons('data-kv-cap', (cap) => {
        states?.setAttribute('data-kp-max-shown', cap);
        if (states) palette(states)?.refresh();
    });
}

// ── version jump chip ──
{
    const { setVersionDelta, summarizeDeltas } = await import('../../../../js/version-delta.js');
    const table = document.getElementById('kv-version-table');
    const chips = () => /** @type {HTMLElement[]} */ ([...document.querySelectorAll('#kv-version-table .kp-badge--version')]);
    const heading = document.getElementById('kv-version-heading');
    let bigMinor = true;

    /** The cell sorts by its chip, so the list sorts the risky first; the heading counts the list exactly. */
    const paint = () => {
        for (const chip of chips()) {
            const cell = chip.closest('td');
            if (cell) cell.setAttribute('data-kp-sort-value', chip.getAttribute('data-kp-sort-value') ?? '0');
        }
        const list = chips().map((chip) => ({
            from: chip.getAttribute('data-kp-version-from'),
            to: chip.getAttribute('data-kp-version-to'),
            app: chip.getAttribute('data-kp-version-app') ?? '',
        }));
        if (heading) heading.textContent = `Updates: ${summarizeDeltas(list, { bigMinorApps: bigMinor ? ['immich'] : [], scheme: 'numbers' }).text}`;
    };
    // The chips are drawn by js/auto.js; the page reads them once they are.
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    paint();
    const log = document.getElementById('kv-version-log');
    table?.addEventListener('kp-version-copy', (event) => {
        if (log) log.textContent = `kp-version-copy\n${JSON.stringify(/** @type {CustomEvent} */ (event).detail)}`;
    });

    /** @param {string} show */
    const setShow = (show) => {
        for (const chip of chips()) chip.setAttribute('data-kp-version-show', show);
        for (const b of document.querySelectorAll('[data-kv-version-show]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-kv-version-show') === show));
        requestAnimationFrame(paint);
    };
    stateButtons('data-kv-version-show', setShow);
    onChoice('version-show', setShow);
    for (const b of document.querySelectorAll('[data-kv-big-minor]'))
        b.addEventListener('click', () => {
            bigMinor = !bigMinor;
            b.setAttribute('aria-pressed', String(bigMinor));
            if (table) {
                if (bigMinor) table.setAttribute('data-kp-version-big-minor', 'immich');
                else table.removeAttribute('data-kp-version-big-minor');
            }
            // The list is read when a chip is drawn: touch each so it draws again.
            for (const chip of chips()) chip.setAttribute('data-kp-version-big-at', 'first');
            requestAnimationFrame(paint);
        });

    const live = document.getElementById('kv-version-live');
    stateButtons('data-kv-version-state', (state) => {
        if (live)
            setVersionDelta(live, {
                state: /** @type {'loading' | 'error' | 'ready'} */ (state),
                error: state === 'error' ? 'The release server did not answer' : '',
            });
    });
}

// ── acknowledge gate ──
{
    const { ackGate } = await import('../../../../js/ack-gate.js');
    const log = document.getElementById('kv-ack-log');
    document.getElementById('kv-ack-grid')?.addEventListener('kp-ack-change', (event) => {
        if (log) log.textContent = `kp-ack-change\n${JSON.stringify(/** @type {CustomEvent} */ (event).detail)}`;
    });
    /** @param {string} mode */
    const setMode = (mode) => {
        for (const id of ['kv-ack-1', 'kv-ack-2']) document.getElementById(id)?.setAttribute('data-kp-ack-mode', mode);
        for (const b of document.querySelectorAll('[data-kv-ack-mode]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-kv-ack-mode') === mode));
    };
    stateButtons('data-kv-ack-mode', setMode);
    onChoice('ack-mode', setMode);
    for (const b of document.querySelectorAll('[data-kv-ack-bump]'))
        b.addEventListener('click', () => {
            const gate = document.getElementById('kv-ack-1');
            gate?.setAttribute('data-kp-ack-version', '12.2');
            gate?.setAttribute('data-kp-ack-label', 'I read the release notes of 12.2');
        });
    for (const b of document.querySelectorAll('[data-kv-ack-lock]'))
        b.addEventListener('click', () => {
            const on = b.getAttribute('aria-pressed') !== 'true';
            b.setAttribute('aria-pressed', String(on));
            for (const id of ['kv-ack-1', 'kv-ack-2']) {
                const gate = document.getElementById(id);
                if (gate) ackGate(gate)?.setLocked(on);
            }
        });
    stateButtons('data-kv-ack-state', (state) => {
        for (const id of ['kv-ack-3', 'kv-ack-4']) {
            const gate = document.getElementById(id);
            if (gate) ackGate(gate)?.setState(/** @type {'ready' | 'loading' | 'error' | 'empty'} */ (state));
        }
    });
    for (const id of ['kv-ack-3', 'kv-ack-4'])
        document.getElementById(id)?.addEventListener('kp-ack-retry', () => {
            for (const g of ['kv-ack-3', 'kv-ack-4']) {
                const gate = document.getElementById(g);
                if (gate) ackGate(gate)?.setState('ready');
            }
            for (const b of document.querySelectorAll('[data-kv-ack-state]'))
                b.setAttribute('aria-pressed', String(b.getAttribute('data-kv-ack-state') === 'ready'));
        });
}

// ── dependency list ──
{
    const { setDeplist, deplist } = await import('../../../../js/deplist.js');
    const rows = [
        { from: 'immich', to: 'paperless' },
        { from: 'paperless', to: 'postgres', state: 'running' },
        { from: 'paperless', to: 'redis', state: 'running' },
        { from: 'immich', to: 'postgres', state: 'running' },
        { from: 'immich', to: 'redis', state: 'stopped' },
        { from: 'vault', to: 'postgres', state: 'running' },
        { from: 'gateway', to: 'vault', state: 'running' },
        { from: 'jellyfin', to: 'gateway', state: 'running' },
        { from: 'sonarr', to: 'jellyfin', state: 'unknown' },
        { from: 'radarr', to: 'jellyfin', state: 'unknown' },
        { from: 'café-kiosk', to: 'gateway', state: 'running' },
        { from: 'calendar', to: 'postgres', state: 'running' },
    ];
    const main = document.getElementById('kv-deplist');
    const cycle = [{ from: 'redis', to: 'paperless' }];
    let withCycle = false;
    const fill = () => main && setDeplist(main, withCycle ? [...rows, ...cycle] : rows);
    fill();

    /** @param {string} arrange */
    const arrangeTo = (arrange) => {
        if (!main) return;
        main.setAttribute('data-kp-dep-order', arrange === 'numbers' ? 'numbers' : 'none');
        if (arrange === 'by-to') main.setAttribute('data-kp-dep-group', 'by-to');
        else main.removeAttribute('data-kp-dep-group');
        for (const b of document.querySelectorAll('[data-kv-dep-arrange]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-kv-dep-arrange') === arrange));
    };
    stateButtons('data-kv-dep-arrange', arrangeTo);
    onChoice('dep-arrange', arrangeTo);
    for (const b of document.querySelectorAll('[data-kv-dep-extra]'))
        b.addEventListener('click', () => {
            const on = b.getAttribute('aria-pressed') !== 'true';
            b.setAttribute('aria-pressed', String(on));
            const kind = b.getAttribute('data-kv-dep-extra');
            if (!main) return;
            if (kind === 'link') {
                if (on) main.setAttribute('data-kp-dep-link', '#stack-{name}');
                else main.removeAttribute('data-kp-dep-link');
            } else if (kind === 'states') main.toggleAttribute('data-kp-dep-states', on);
            else {
                withCycle = on;
                fill();
            }
        });

    const states = document.getElementById('kv-deplist-states');
    const four = rows.slice(0, 4);
    if (states) setDeplist(states, four);
    const phone = document.getElementById('kv-deplist-phone');
    if (phone)
        setDeplist(phone, [
            { from: 'paperless', to: 'postgres', state: 'running' },
            { from: 'immich-machine-learning-worker', to: 'paperless', state: 'stopped' },
            { from: 'café-kiosk', to: 'gateway', state: 'unknown' },
        ]);
    /** @param {string} state */
    const setState = (state) => {
        if (!states) return;
        if (state === 'ready') setDeplist(states, four);
        else deplist(states)?.setState(/** @type {'loading' | 'empty' | 'error'} */ (state), { message: 'The host did not answer.' });
        for (const b of document.querySelectorAll('[data-kv-dep-state]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-kv-dep-state') === state));
    };
    stateButtons('data-kv-dep-state', setState);
    states?.addEventListener('kp-deplist-retry', () => setState('ready'));
}

// ── path of a connection ──
{
    const { setTrace, trace } = await import('../../../../js/path-trace.js');
    const scenes = {
        blocked: [
            { title: 'tv', note: 'IoT network', verdict: 'allowed' },
            { title: 'Firewall', note: 'tcp 8096', verdict: 'refused', rule: 'IoT to media' },
            { title: 'Jellyfin', note: 'media container', verdict: 'allowed' },
            { title: 'Media network', note: 'where it lives', verdict: 'allowed' },
        ],
        allowed: [
            { title: 'laptop', note: 'LAN', verdict: 'allowed' },
            { title: 'Firewall', note: 'tcp 8096', verdict: 'allowed', rule: 'LAN to media' },
            { title: 'Traefik', note: 'the edge', verdict: 'allowed' },
            { title: 'Jellyfin', note: 'media network', verdict: 'allowed' },
        ],
        unknown: [
            { title: 'phone', note: 'guest Wi-Fi', verdict: 'allowed' },
            { title: 'Firewall', note: 'tcp 443', verdict: 'allowed', rule: 'Guest to edge' },
            { title: 'Traefik', note: 'not measured yet', verdict: 'unknown' },
            { title: 'Paperless', note: 'documents network', verdict: 'unknown' },
        ],
    };
    const main = document.getElementById('kv-trace');
    let scene = /** @type {keyof typeof scenes} */ ('blocked');
    if (main) setTrace(main, scenes[scene]);
    const log = document.getElementById('kv-trace-log');
    for (const type of ['kp-trace-rule', 'kp-trace-swap'])
        main?.addEventListener(type, (event) => {
            if (log) log.textContent = `${type}\n${JSON.stringify(/** @type {CustomEvent} */ (event).detail ?? {})}`;
        });
    stateButtons('data-kv-trace-scene', (value) => {
        scene = /** @type {keyof typeof scenes} */ (value);
        if (main) setTrace(main, scenes[scene]);
    });
    /** @param {string} name @param {string} attribute @param {(v: string) => string | null} [map] */
    const bindAttr = (name, attribute, map = (v) => v) => {
        stateButtons(`data-kv-trace-${name}`, (value) => {
            const v = map(value);
            if (!main) return;
            if (v === null) main.removeAttribute(attribute);
            else main.setAttribute(attribute, v);
        });
    };
    bindAttr('verdict', 'data-kp-trace-verdict', (v) => (v === 'both' ? null : v));
    bindAttr('layout', 'data-kp-trace-layout', (v) => (v === 'auto' ? null : v));
    bindAttr('rule', 'data-kp-trace-rule', (v) => (v === 'chip' ? null : v));
    onChoice('trace-verdict', (value) => {
        for (const b of document.querySelectorAll('[data-kv-trace-verdict]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-kv-trace-verdict') === value));
        if (value === 'both') main?.removeAttribute('data-kp-trace-verdict');
        else main?.setAttribute('data-kp-trace-verdict', value);
    });
    for (const b of document.querySelectorAll('[data-kv-trace-stop]'))
        b.addEventListener('click', () => {
            const on = b.getAttribute('aria-pressed') !== 'true';
            b.setAttribute('aria-pressed', String(on));
            if (on) main?.setAttribute('data-kp-trace-stop', 'all');
            else main?.removeAttribute('data-kp-trace-stop');
        });

    const states = document.getElementById('kv-trace-states');
    if (states) setTrace(states, scenes.blocked);
    const phone = document.getElementById('kv-trace-phone');
    if (phone)
        setTrace(phone, [
            ...scenes.blocked.slice(0, 3),
            { title: 'Paperless document-consumption worker', note: 'documents network', verdict: 'allowed' },
        ]);
    /** @param {string} state */
    const setState = (state) => {
        if (!states) return;
        if (state === 'ready') setTrace(states, scenes.blocked);
        else trace(states)?.setState(/** @type {'running' | 'empty' | 'error'} */ (state), { message: 'The firewall did not answer.' });
        for (const b of document.querySelectorAll('[data-kv-trace-state]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-kv-trace-state') === state));
    };
    stateButtons('data-kv-trace-state', setState);
    states?.addEventListener('kp-trace-retry', () => setState('ready'));
}

// ── entity card ──
{
    const { setEntityGrid, setEntityGridState } = await import('../../../../js/entity-card.js');
    const { openMenu, closeMenu, setMenu } = await import('../../../../js/menu-button.js');
    const acts = [
        { id: 'restart', label: 'Restart' },
        { id: 'logs', label: 'Logs' },
        { id: 'update', label: 'Update' },
        { id: 'remove', label: 'Remove', danger: true },
    ];
    const meters = (/** @type {number} */ cpu, /** @type {number} */ ram, /** @type {string} */ text) => [
        { label: 'CPU', value: cpu },
        { label: 'RAM', value: ram, text },
        { label: 'Disk', value: 0.41 },
    ];
    /** The buttons come only from the data: none, two, four (three stand, the fourth goes in More) or a mix on one grid. */
    let actionMode = 'four';
    /** @param {number} at */
    const actionsFor = (at) =>
        actionMode === 'none'
            ? []
            : actionMode === 'two'
              ? acts.slice(0, 2)
              : actionMode === 'mixed'
                ? [acts, [], acts.slice(0, 2), acts, acts.slice(0, 1), []][at % 6]
                : acts;
    /** @type {() => import('../../../../js/entity-card.js').EntityData[]} */
    const make = () => makeBase().map((d, at) => ({ ...d, actions: actionsFor(at) }));
    /** @type {() => import('../../../../js/entity-card.js').EntityData[]} */
    const makeBase = () => [
        {
            key: 'media',
            name: 'media',
            vmid: '106',
            state: { label: 'running', tone: 'success' },
            figures: [
                { value: '3/5', label: 'apps up' },
                { value: '12', label: 'restarts' },
            ],
            flags: [{ label: 'update available', tone: 'warning' }],
            meters: meters(0.34, 0.71, '5.6 of 8 GB'),
            actions: acts,
        },
        {
            key: 'vault',
            name: 'vault',
            vmid: '110',
            state: { label: 'running', tone: 'success' },
            figures: [
                { value: '2/2', label: 'apps up' },
                { value: '0', label: 'restarts' },
            ],
            flags: [],
            meters: meters(0.08, 0.22, '0.9 of 4 GB'),
            actions: acts,
        },
        {
            key: 'gateway',
            name: 'gateway',
            vmid: '101',
            state: { label: 'degraded', tone: 'warning' },
            figures: [
                { value: '4/5', label: 'apps up' },
                { value: '31', label: 'restarts' },
            ],
            flags: [
                { label: 'update available', tone: 'warning' },
                { label: 'backup is old', tone: 'destructive' },
                { label: 'pinned image' },
                { label: 'no healthcheck' },
                { label: 'port 8443 open' },
            ],
            meters: meters(0.82, 0.93, '7.4 of 8 GB'),
            actions: acts,
        },
        {
            key: 'paperless',
            name: 'paperless',
            vmid: '112',
            state: { label: 'running', tone: 'success' },
            figures: [
                { value: '3/3', label: 'apps up' },
                { value: '1', label: 'restarts' },
            ],
            flags: [{ label: 'pinned image' }],
            meters: meters(0.12, 0.35, '2.8 of 8 GB'),
            actions: acts,
        },
        {
            key: 'immich',
            name: 'immich-machine-learning-worker-with-a-long-name',
            vmid: '114',
            state: { label: 'stopped', tone: 'destructive' },
            figures: [
                { value: '0/4', label: 'apps up' },
                { value: '1534', label: 'restarts' },
            ],
            flags: [{ label: 'stopped by hand' }],
            meters: meters(0, 0, '0 of 16 GB'),
            actions: acts,
        },
        {
            key: 'café-kiosk',
            name: 'café-kiosk',
            vmid: '120',
            state: { label: 'running', tone: 'success' },
            figures: [
                { value: '1/1', label: 'apps up' },
                { value: '2', label: 'restarts' },
            ],
            flags: [],
            meters: meters(0.05, 0.18, '0.7 of 4 GB'),
            actions: acts,
        },
    ];
    const grid = document.getElementById('kv-entity-grid');
    const log = document.getElementById('kv-entity-log');
    /** @param {string} text */
    const say = (text) => {
        if (log) log.textContent = text;
    };
    if (grid) {
        grid.setAttribute('data-kp-entity-meters', '2');
        setEntityGrid(grid, make());
        grid.addEventListener('kp-entity-action', (e) => say(`kp-entity-action\n${JSON.stringify(/** @type {CustomEvent} */ (e).detail)}`));
        grid.addEventListener('kp-entity-flag', (e) => say(`kp-entity-flag\n${JSON.stringify(/** @type {CustomEvent} */ (e).detail)}`));
        grid.addEventListener('kp-entity-tick', () => {
            const keys = [...grid.querySelectorAll('.is-ticked')].map((c) => c.getAttribute('data-kp-entity-key'));
            say(`ticked: ${keys.join(', ') || 'none'}`);
        });
    }
    for (const b of document.querySelectorAll('[data-kv-entity-opt]'))
        b.addEventListener('click', () => {
            const on = b.getAttribute('aria-pressed') !== 'true';
            b.setAttribute('aria-pressed', String(on));
            const kind = b.getAttribute('data-kv-entity-opt');
            if (!grid) return;
            if (kind === 'selectable') {
                grid.toggleAttribute('data-kp-selectable', on);
                grid.toggleAttribute('data-kp-select-keys', on);
            } else if (kind === 'flags') grid.setAttribute('data-kp-entity-flags-max', on ? '1' : '3');
            else if (kind === 'compact') grid.setAttribute('data-kp-density', on ? 'compact' : 'comfortable');
            else grid.toggleAttribute('data-kp-entity-link', on) || null;
            if (kind === 'link') {
                if (on) grid.setAttribute('data-kp-entity-link', '#stack-{key}');
                else grid.removeAttribute('data-kp-entity-link');
            }
        });
    /** @param {string} n */
    const setMeters = (n) => {
        grid?.setAttribute('data-kp-entity-meters', n);
        for (const b of document.querySelectorAll('[data-kv-entity-meters]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-kv-entity-meters') === n));
    };
    stateButtons('data-kv-entity-meters', setMeters);
    /** @param {string} mode */
    const setActions = (mode) => {
        actionMode = mode;
        if (grid) setEntityGrid(grid, make());
        for (const b of document.querySelectorAll('[data-kv-entity-actions]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-kv-entity-actions') === mode));
    };
    stateButtons('data-kv-entity-actions', setActions);
    /** @param {string} n */
    const setInline = (n) => {
        grid?.setAttribute('data-kp-entity-inline', n);
        for (const b of document.querySelectorAll('[data-kv-entity-inline]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-kv-entity-inline') === n));
    };
    stateButtons('data-kv-entity-inline', setInline);
    onChoice('entity-inline', setInline);
    for (const b of document.querySelectorAll('[data-kv-entity-refresh]'))
        b.addEventListener('click', () => {
            if (!grid) return;
            const list = make();
            const first = list[0];
            first.meters = meters(0.55 + Math.random() * 0.1, 0.72, '5.8 of 8 GB');
            first.flags = [{ label: 'update available', tone: 'warning' }, { label: 'restarted just now' }];
            const same = grid.firstElementChild;
            setEntityGrid(grid, list);
            say(`A live refresh: the first card is ${grid.firstElementChild === same ? 'the same element' : 'a new element'}.`);
        });
    const compare = document.getElementById('kv-entity-compare');
    if (compare)
        setMenu(compare, [
            {
                group: '',
                items: [
                    { label: 'Restart', value: 'restart' },
                    { label: 'Logs', value: 'logs' },
                    { label: 'Update', value: 'update' },
                    { label: 'Remove', value: 'remove', danger: true },
                ],
            },
        ]);
    const wrappers = () =>
        [grid?.querySelector('[data-kp-key="media-more"]'), grid?.querySelector('[data-kp-key="gateway-flags"]'), compare].filter(Boolean);
    for (const b of document.querySelectorAll('[data-kv-entity-menu]'))
        b.addEventListener('click', () => {
            const which = b.getAttribute('data-kv-entity-menu');
            for (const w of wrappers()) closeMenu(/** @type {HTMLElement} */ (w));
            const target =
                which === 'more'
                    ? grid?.querySelector('[data-kp-key="media-more"]')
                    : which === 'flags'
                      ? grid?.querySelector('[data-kp-key="gateway-flags"]')
                      : which === 'compare'
                        ? compare
                        : null;
            if (target) openMenu(/** @type {HTMLElement} */ (target), { focus: 'first' });
        });

    const cards = document.getElementById('kv-entity-cards');
    const three = make().slice(0, 3);
    const drawCards = (/** @type {string} */ mode) => {
        if (!cards) return;
        const list = three.map((d) => ({ ...d }));
        if (mode === 'states') {
            list[0] = { ...list[0], status: 'loading' };
            list[1] = { ...list[1], status: 'empty' };
            list[2] = { ...list[2], status: 'error', error: 'The host did not answer' };
        }
        setEntityGrid(cards, list);
        for (const b of document.querySelectorAll('[data-kv-entity-card]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-kv-entity-card') === mode));
    };
    drawCards('ready');
    stateButtons('data-kv-entity-card', drawCards);
    cards?.addEventListener('kp-entity-retry', () => drawCards('ready'));

    const gs = document.getElementById('kv-entity-gstates');
    const four = make().slice(0, 4);
    if (gs) setEntityGrid(gs, four);
    const phone = document.getElementById('kv-entity-phone');
    if (phone) setEntityGrid(phone, make().slice(0, 2));
    stateButtons('data-kv-entity-gstate', (state) => {
        if (!gs) return;
        if (state === 'ready') setEntityGrid(gs, four);
        else
            setEntityGridState(gs, /** @type {'loading' | 'empty' | 'error'} */ (state), {
                count: 4,
                message: state === 'error' ? 'The host did not answer.' : undefined,
            });
    });
    gs?.addEventListener('kp-entity-grid-retry', () => {
        setEntityGrid(gs, four);
        for (const b of document.querySelectorAll('[data-kv-entity-gstate]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-kv-entity-gstate') === 'ready'));
    });
}
