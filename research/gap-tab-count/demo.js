// research/gap-tab-count: the page's own wiring. The components are the package's (js/auto.js attaches them); this file hands them
// their data and wires the controls of each section by that section's own elements (DEMO_RULES ch. 2: a section never depends on a
// sibling being on the page). Every section works alone.

import { setTabCount } from '../../js/tabbar.js';
import { setHeat } from '../../js/heat.js';
import { setKeys } from '../../js/keys.js';

/** @param {string} id */
const byId = (id) => document.getElementById(id);

/** Press one button of a group: it is pressed, the others of its group are not. @param {Element} button */
function press(button) {
    const group = button.closest('[role="group"]');
    for (const other of group?.querySelectorAll('[aria-pressed]') ?? []) other.setAttribute('aria-pressed', String(other === button));
}

/**
 * One section's controls: a click on a button that carries `attr` calls `on(value, button)`.
 * @param {string} component the id of the component the controls drive
 * @param {Record<string, (value: string, button: Element) => void>} handlers by data attribute
 */
function wire(component, handlers) {
    const controls = document.querySelector(`[data-review-controls-for="${component}"]`);
    controls?.addEventListener('click', (event) => {
        const button = /** @type {Element} */ (event.target).closest('button');
        if (!button || !controls.contains(button)) return;
        for (const [attr, on] of Object.entries(handlers)) {
            if (!button.hasAttribute(attr)) continue;
            if (button.hasAttribute('aria-pressed')) press(button);
            on(button.getAttribute(attr) ?? '', button);
        }
    });
}

/* ------------------------------------------------------------------ 1. a count on a tab */

const logs = byId('gtc-tab-logs');
const tabs = ['gtc-tab-apps', 'gtc-tab-logs', 'gtc-tab-history'].map(byId);
if (logs) {
    const now = { count: /** @type {number | null} */ (12), zero: false, tone: 'error', state: 'ready', unit: false };
    const draw = () => {
        const options = { tone: /** @type {any} */ (now.tone), zero: now.zero ? /** @type {const} */ ('show') : /** @type {const} */ ('hide') };
        if (now.state === 'ready') setTabCount(logs, now.count, options);
        else setTabCount(logs, /** @type {'loading' | 'error'} */ (now.state), options);
        for (const tab of tabs) tab?.toggleAttribute('data-kp-tab-count-show-unit', now.unit);
    };
    /** A new reading arrived: whatever was counting or failed is over. */
    const settle = () => {
        now.state = 'ready';
        const ready = document.querySelector('[data-review-controls-for="tab-count-component"] [data-gtc-state="ready"]');
        if (ready) press(ready);
    };
    wire('tab-count-component', {
        'data-gtc-count': (value) => {
            settle();
            now.zero = value === '0-shown';
            now.count = value === 'none' ? null : value === '0-shown' ? 0 : Number(value);
            draw();
        },
        'data-gtc-tone': (value) => {
            settle();
            now.tone = value;
            draw();
        },
        'data-gtc-state': (value) => {
            now.state = value;
            draw();
        },
        'data-gtc-unit': (value) => {
            now.unit = value === 'show';
            draw();
        },
    });
    draw();
}

/* ------------------------------------------------------------------ 2. arrow keys over tiles */

const APPS = [
    ['Media', 'jellyfin', 'Movies, shows and music. 4 streams now.', 'running'],
    ['Media', 'sonarr', 'Series: 3 episodes waiting to import.', 'running'],
    ['Media', 'radarr', 'Films: 128 monitored, none missing.', 'running'],
    ['Media', 'prowlarr', 'Indexers shared by sonarr and radarr.', 'running'],
    ['Media', 'qbittorrent', 'Download client. 2 downloads, 18 MB/s.', 'updating'],
    ['Media', 'bazarr', 'Subtitles. Not answering since 22:40.', 'down'],
    ['Media', 'jellyseerr', 'Requests from the family: 2 open.', 'running'],
    ['Platform', 'traefik', 'Edge router: 41 routes, certificates valid.', 'running'],
    ['Platform', 'grafana', 'Dashboards for the host and the stacks.', 'running'],
    ['Platform', 'loki', 'Log store: 6.2 GB, 14 days kept.', 'running'],
    ['Platform', 'prometheus', 'Metrics every 15 s from 11 targets.', 'running'],
    ['Platform', 'uptime-kuma', 'Watches 23 addresses, all up.', 'running'],
    ['Home', 'home-assistant', 'Lights, heating and the plant sensors.', 'running'],
    ['Home', 'mosquitto', 'MQTT broker. Last client left 4 min ago.', 'down'],
    ['Home', 'zigbee2mqtt', '37 devices, 2 with a low battery.', 'running'],
    ['Home', 'node-red', 'Flows for the doorbell and the garage.', 'running'],
    ['Backups', 'restic', 'Nightly snapshots to the second disk.', 'running'],
    ['Backups', 'rclone', 'Weekly copy to the offsite bucket.', 'updating'],
    ['Backups', 'borgmatic', 'Config backups of the Proxmox host.', 'running'],
];
const WORDS = { running: 'Running', updating: 'Updating', down: 'Down' };
const BADGES = { running: 'kp-badge--success', updating: 'kp-badge--warning', down: 'kp-badge--destructive' };

const board = byId('gtc-board');
const component = byId('tile-keys-component');
if (board && component) {
    const search = /** @type {HTMLInputElement} */ (byId('gtc-search'));
    const stars = new Set(['jellyfin', 'traefik']);
    const show = { problem: false };
    const make = (/** @type {string} */ tag, /** @type {string} */ cls = '', /** @type {string} */ text = '') => {
        const node = document.createElement(tag);
        if (cls) node.className = cls;
        if (text) node.textContent = text;
        return node;
    };

    for (const group of [...new Set(APPS.map((app) => app[0]))]) {
        const details = /** @type {HTMLDetailsElement} */ (make('details', 'gtc-group'));
        details.open = true;
        details.dataset.gtcGroup = group.toLowerCase();
        const summary = make('summary', '', group);
        const list = make('ul', 'kp-tiles');
        for (const [, name, text, state] of APPS.filter((app) => app[0] === group)) {
            const tile = make('li', 'kp-card');
            tile.dataset.gtcApp = name;
            tile.dataset.gtcState = state;
            const head = make('div', 'gtc-tile__head');
            const title = make('h3', 'kp-card__title');
            const link = /** @type {HTMLAnchorElement} */ (make('a', 'kp-link', name));
            link.href = `#${name}`;
            link.setAttribute('aria-keyshortcuts', 'S');
            title.append(link);
            head.append(title);
            const body = make('p', 'kp-card__body', text);
            const foot = make('div', 'kp-card__footer gtc-tile__foot');
            const badge = make(
                'span',
                `kp-badge ${BADGES[/** @type {keyof typeof BADGES} */ (state)]}`,
                WORDS[/** @type {keyof typeof WORDS} */ (state)],
            );
            const star = make('button', 'kp-button kp-button--sm kp-button--ghost');
            star.setAttribute('type', 'button');
            star.setAttribute('tabindex', '-1');
            star.setAttribute('data-kp-tile-secondary', '');
            star.setAttribute('aria-label', `Star ${name}`);
            star.setAttribute('aria-pressed', String(stars.has(name)));
            star.textContent = stars.has(name) ? '★' : '☆';
            foot.append(badge, star);
            tile.append(head, body, foot);
            list.append(tile);
        }
        details.append(summary, list);
        board.append(details);
    }
    setKeys(/** @type {HTMLElement} */ (byId('gtc-keyline')), [
        [['←', '↑', '↓', '→'], 'move between tiles'],
        [['Home', 'End'], 'first and last tile'],
        ['S', 'star the tile'],
    ]);

    const tiles = () => /** @type {HTMLElement[]} */ ([...board.querySelectorAll('.kp-card')]);
    const refresh = () => {
        const words = search.value.trim().toLowerCase();
        for (const tile of tiles()) {
            const name = tile.dataset.gtcApp ?? '';
            const matches = (!words || name.includes(words)) && (!show.problem || tile.dataset.gtcState !== 'running');
            tile.hidden = !matches;
        }
        for (const details of board.querySelectorAll('details')) {
            const total = details.querySelectorAll('.kp-card').length;
            const shown = details.querySelectorAll('.kp-card:not([hidden])').length;
            details.hidden = shown === 0;
            const summary = details.querySelector('summary');
            if (summary)
                summary.textContent = `${details.dataset.gtcGroup?.replace(/^./, (c) => c.toUpperCase())} · ${shown === total ? total : `${shown} of ${total}`}`;
        }
    };
    search.addEventListener('input', refresh);

    // The star: S on a focused tile (the star button is not a tab stop of its own), or a click on it.
    const toggleStar = (/** @type {HTMLElement} */ tile) => {
        const star = tile.querySelector('button');
        const name = tile.dataset.gtcApp ?? '';
        if (!star) return;
        if (stars.has(name)) stars.delete(name);
        else stars.add(name);
        star.setAttribute('aria-pressed', String(stars.has(name)));
        star.textContent = stars.has(name) ? '★' : '☆';
    };
    board.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() !== 's' || event.ctrlKey || event.metaKey || event.altKey) return;
        const tile = /** @type {HTMLElement | null} */ ((event.target instanceof Element ? event.target : null)?.closest('.kp-card') ?? null);
        if (!tile) return;
        event.preventDefault();
        toggleStar(tile);
    });
    board.addEventListener('click', (event) => {
        const target = /** @type {Element} */ (event.target);
        // The links open nothing here: this is a sample.
        if (target.closest('a[href^="#"]')) event.preventDefault();
        const star = target.closest('button');
        const tile = /** @type {HTMLElement | null} */ (star?.closest('.kp-card') ?? null);
        if (tile) toggleStar(tile);
    });

    // The readings: what the keys did, said in words.
    const stopsOut = component.querySelector('[data-gtc-stops]');
    const shownOut = component.querySelector('[data-gtc-shown]');
    const focusOut = component.querySelector('[data-gtc-focus-name]');
    let queued = 0;
    const readings = () => {
        queued = 0;
        const shown = tiles().filter((tile) => !tile.hidden && !tile.closest('details:not([open])'));
        const stops = shown.filter((tile) =>
            [...tile.querySelectorAll('a[href], button')].some((el) => /** @type {HTMLElement} */ (el).tabIndex >= 0),
        ).length;
        const links = shown.filter(
            (tile) => tile.querySelector('a[href]') && /** @type {HTMLElement} */ (tile.querySelector('a[href]')).tabIndex >= 0,
        ).length;
        if (stopsOut) stopsOut.textContent = `${links} of ${shown.length}${links === 1 ? ' (the tiles are one stop)' : ''}`;
        if (shownOut) shownOut.textContent = `${shown.length} of ${tiles().length}${stops < 0 ? '' : ''}`;
        const at = /** @type {HTMLElement | null} */ (document.activeElement?.closest?.('.kp-card') ?? null);
        if (focusOut) focusOut.textContent = at && board.contains(at) ? `${at.dataset.gtcApp} (${at.closest('details')?.dataset.gtcGroup})` : 'none';
    };
    const later = () => {
        if (!queued) queued = requestAnimationFrame(readings);
    };
    board.addEventListener('focusin', later);
    board.addEventListener('focusout', later);
    new MutationObserver(later).observe(board, { subtree: true, attributes: true, attributeFilter: ['tabindex', 'hidden', 'open'], childList: true });
    refresh();
    later();

    wire('tile-keys-component', {
        'data-gtc-keys': (value) => {
            if (value === 'off') board.setAttribute('data-kp-tiles-keys', 'off');
            else board.setAttribute('data-kp-tiles-keys', '');
        },
        'data-gtc-focus': () => {
            const stop = /** @type {HTMLElement | null} */ (
                board.querySelector('.kp-card:not([hidden]) a[href][tabindex="0"]') ?? board.querySelector('.kp-card:not([hidden]) a[href]')
            );
            stop?.focus();
        },
        'data-gtc-width': (value) => component.setAttribute('data-gtc-width', value),
        'data-gtc-fold': (value) => {
            const details = /** @type {HTMLDetailsElement | null} */ (board.querySelector('[data-gtc-group="platform"]'));
            if (details) details.open = value === 'open';
        },
        'data-gtc-show': (value) => {
            show.problem = value === 'problem';
            refresh();
        },
    });
}

/* ------------------------------------------------------------------ 3. the legend of the backup grid */

const heat = byId('gtc-heat');
if (heat) {
    const STACKS = ['media', 'home', 'platform', 'monitoring', 'backups', 'scratch'];
    // A phone has room for a week of columns: the axis words keep clear of each other.
    const NIGHTS = matchMedia('(max-width: 600px)').matches ? 7 : 14;
    const FIRST = 20 - NIGHTS; // the last column is 19/10/2026
    const nights = Array.from({ length: NIGHTS }, (_, i) => ({ key: String(i), label: String(FIRST + i) }));
    const missed = (/** @type {string} */ stack, /** @type {number} */ night) =>
        (stack === 'backups' && night + 14 - NIGHTS === 5) || (stack === 'platform' && night + 14 - NIGHTS === 9);
    const nightCell = (/** @type {string} */ stack, /** @type {number} */ night) => {
        if (night === NIGHTS - 1) return { tone: /** @type {const} */ ('future'), label: 'not run yet' };
        if (stack === 'scratch') return { tone: /** @type {const} */ ('none'), label: 'keeps no data by design' };
        if (stack === 'monitoring' && night + 14 - NIGHTS < 4) return { tone: /** @type {const} */ ('before'), label: 'before any history' };
        if (missed(stack, night))
            return { tone: /** @type {const} */ ('bad'), label: 'missed', tip: `${stack}, ${FIRST + night}/10/2026: no snapshot.` };
        return { tone: /** @type {const} */ ('ok'), label: 'backed up' };
    };
    const NIGHT_DATA = {
        label: 'Snapshots per stack per night',
        columns: nights,
        summary: {
            key: 'fleet',
            label: 'Whole fleet',
            cells: nights.map((_, night) => {
                if (night === NIGHTS - 1) return { tone: /** @type {const} */ ('future'), label: 'not run yet' };
                const counted = STACKS.filter((stack) => stack !== 'scratch' && !(stack === 'monitoring' && night + 14 - NIGHTS < 4));
                const ok = counted.filter((stack) => !missed(stack, night)).length;
                return {
                    tone: ok === counted.length ? /** @type {const} */ ('ok') : /** @type {const} */ ('warn'),
                    share: ok / counted.length,
                    label: `${ok} of ${counted.length} backed up`,
                };
            }),
        },
        rows: STACKS.map((stack) => ({
            key: stack,
            label: stack,
            muted: stack === 'scratch',
            cells: nights.map((_, night) => nightCell(stack, night)),
        })),
        legend: [
            { tone: /** @type {const} */ ('ok'), label: 'backed up' },
            { tone: /** @type {const} */ ('warn'), label: 'some missed' },
            { tone: /** @type {const} */ ('bad'), label: 'missed' },
            { tone: /** @type {const} */ ('before'), label: 'before any history' },
            { tone: /** @type {const} */ ('none'), label: 'keeps no data by design' },
        ],
    };

    const HOURS = Array.from({ length: 24 }, (_, i) => ({ key: String(i), label: String(i).padStart(2, '0') }));
    const ROUTES = [
        ['jellyfin.kp-soft.dev', 900, 21],
        ['sonarr.kp-soft.dev', 120, 19],
        ['grafana.kp-soft.dev', 260, 9],
        ['home.kp-soft.dev', 640, 7],
        ['traefik.kp-soft.dev', 60, 12],
    ];
    const NOW_HOUR = 18;
    const requests = (/** @type {number} */ peak, /** @type {number} */ at, /** @type {number} */ hour) =>
        Math.round(peak * (0.08 + 0.92 * Math.exp(-(((hour - at) / 4.5) ** 2))));
    const REQUEST_DATA = {
        label: 'Requests per route per hour, today',
        columns: HOURS,
        rows: ROUTES.map(([route, peak, at]) => ({
            key: String(route),
            label: String(route),
            cells: HOURS.map((_, hour) => {
                if (hour > NOW_HOUR) return { tone: /** @type {const} */ ('future'), label: 'not yet' };
                const n = requests(Number(peak), Number(at), hour);
                return {
                    tone: /** @type {const} */ ('level'),
                    level: n / Number(peak),
                    label: `${n} requests`,
                    tip: `${route}, ${String(hour).padStart(2, '0')}:00: ${n} requests.`,
                };
            }),
        })),
        legend: [
            { ramp: true, less: 'Fewer requests', more: 'More requests' },
            { tone: /** @type {const} */ ('future'), label: 'not yet' },
        ],
    };

    const mode = { data: 'nights', legend: 'keys', grid: 'ready' };
    const drawHeat = () => {
        const data = mode.data === 'nights' ? NIGHT_DATA : REQUEST_DATA;
        // The footprint of a ready grid is held while it loads or fails (the page's part): the legend stays where it was.
        if (mode.grid === 'ready') heat.style.minBlockSize = '';
        setHeat(heat, {
            ...data,
            state: /** @type {'ready' | 'loading' | 'error'} */ (mode.grid),
            message: mode.grid === 'error' ? 'The backup history could not be read. Nothing was changed.' : undefined,
            legend: mode.legend === 'none' ? false : data.legend,
            legendKeys: mode.legend === 'keys',
        });
        if (mode.grid === 'ready') heat.style.minBlockSize = `${Math.ceil(heat.getBoundingClientRect().height)}px`;
    };
    drawHeat();
    wire('heat-legend-component', {
        'data-gtc-data': (value) => {
            mode.data = value;
            mode.grid = 'ready';
            const ready = document.querySelector('[data-review-controls-for="heat-legend-component"] [data-gtc-grid="ready"]');
            if (ready) press(ready);
            drawHeat();
        },
        'data-gtc-legend': (value) => {
            mode.legend = value;
            drawHeat();
        },
        'data-gtc-grid': (value) => {
            mode.grid = value;
            drawHeat();
        },
    });
}

/* ------------------------------------------------------------------ 4. the calm grid's own legend */

const calm = byId('gtc-calm');
if (calm) {
    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => ({ key: label, label }));
    const HABITS = [
        ['Walk', 'xx.xx.x'],
        ['Water the plants', 'x..x..x'],
        ['Stretch', 'xxxx...'],
        ['Read', '.xx.xxx'],
    ];
    const mode = { pause: false, grid: 'ready' };
    const drawCalm = () => {
        setHeat(calm, {
            label: 'Habits this week',
            columns: DAYS,
            state: /** @type {'ready' | 'loading'} */ (mode.grid),
            rows: HABITS.map(([label, pattern]) => ({
                key: label.toLowerCase(),
                label,
                cells: [...pattern].map((c, day) =>
                    mode.pause && day >= 2 && day <= 4
                        ? { tone: /** @type {const} */ ('paused'), label: 'paused' }
                        : c === 'x'
                          ? { tone: /** @type {const} */ ('logged'), label: 'logged' }
                          : { tone: /** @type {const} */ ('quiet'), label: 'nothing logged' },
                ),
            })),
        });
        if (mode.grid === 'ready') calm.style.minBlockSize = `${Math.ceil(calm.getBoundingClientRect().height)}px`;
    };
    drawCalm();
    wire('heat-calm-component', {
        'data-gtc-calm-legend': (value) => {
            // Only the attribute: the grid notices and takes its legend away or puts it back.
            if (value === 'hide') calm.setAttribute('data-kp-legend', 'hide');
            else calm.removeAttribute('data-kp-legend');
        },
        'data-gtc-pause': (value) => {
            mode.pause = value === 'three';
            calm.style.minBlockSize = '';
            drawCalm();
        },
        'data-gtc-calm-grid': (value) => {
            mode.grid = value;
            drawCalm();
        },
    });
}
