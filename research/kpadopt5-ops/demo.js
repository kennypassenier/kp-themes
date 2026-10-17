// research/kpadopt5-ops: the demo's own wiring. The components are the package's (js/*.js, attached by js/auto.js); this file
// only feeds them sample data, presses their states and writes what they fire into a log.

import { setAgo } from '../../js/freshness.js';
import { setAttention } from '../../js/attention.js';
import { setCardState } from '../../js/card-state.js';
import { setMenu } from '../../js/menu-button.js';
import { masterDetail, setPaneState } from '../../js/master-detail.js';

/** @param {string} name @param {string} text */
const log = (name, text) => {
    const box = document.querySelector(`[data-ko-log="${name}"]`);
    if (!box) return;
    const lines = box.dataset.koLines ? JSON.parse(box.dataset.koLines) : [];
    lines.push(text);
    while (lines.length > 6) lines.shift();
    box.dataset.koLines = JSON.stringify(lines);
    box.textContent = lines.join('\n');
};

/** A radio-like group of demo buttons: press one, the others release. @param {Element} group @param {Element} button */
const press = (group, button) => {
    for (const b of group.querySelectorAll('button[aria-pressed]')) b.setAttribute('aria-pressed', String(b === button));
};

/** Wait for the module's attach (js/auto.js) of an element. @param {Element} el @param {() => unknown} get */
const until = (el, get) =>
    new Promise((resolve) => {
        const check = () => {
            const v = get();
            if (v) resolve(v);
            else requestAnimationFrame(check);
        };
        check();
    });

// ---------------------------------------------------------------- ops-page
const OPS_CARDS = [
    [
        8,
        'Latest readings',
        ['Pump house 1: 3.4 bar, 52 m³/h', 'Pump house 2: 3.1 bar, 48 m³/h', 'Pump house 3: 2.1 bar, 12 m³/h', 'Pump house 4: 3.6 bar, 61 m³/h'],
    ],
    [4, 'Planned visits', ['Tomorrow 09:00: pump house 7', 'Friday 13:30: pump house 3']],
    [6, 'Pressure, last 24 hours', ['Lowest 2.1 bar at 06:10', 'Highest 3.8 bar at 19:45']],
    [6, 'Flow, last 24 hours', ['Lowest 21 m³/h at 03:20', 'Highest 98 m³/h at 18:05', 'Total 1,284 m³']],
    [4, 'Reservoir North', ['64 % full', 'Expected 70 % by 09:00']],
    [4, 'Reservoir South', ['81 % full']],
    [4, 'Reservoir East', ['47 % full', 'Filling', 'Valve 2 open']],
    [3, 'Alarms today', ['1']],
    [3, 'Calls today', ['4']],
    [3, 'Visits today', ['2']],
    [3, 'Readings missing', ['1']],
];

/** Skeleton lines for a KPI tile while it waits: the tile keeps its size. @param {Element} tile */
const skeletonTile = (tile) => {
    tile.dataset.koHtml ??= tile.innerHTML;
    tile.innerHTML = '<span class="kp-skeleton"></span><span class="kp-skeleton"></span><span class="kp-skeleton"></span>';
    tile.setAttribute('aria-busy', 'true');
};
/** @param {Element} tile */
const restoreTile = (tile) => {
    if (tile.dataset.koHtml !== undefined) tile.innerHTML = tile.dataset.koHtml;
    tile.removeAttribute('aria-busy');
};

function initOpsPage() {
    const pages = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-ko-ops]')]);
    if (!pages.length) return;
    /** @param {HTMLElement} page */
    const attention = (page, on = true, error = false) => {
        const band = /** @type {HTMLElement | null} */ (page.querySelector('[data-ko-ops-attention]'));
        if (!band) return;
        const retry = document.createElement('button');
        retry.type = 'button';
        retry.className = 'kp-button kp-button--sm';
        retry.textContent = error ? 'Retry' : 'Restart the modem';
        if (error) retry.addEventListener('click', () => setState('ready'));
        setAttention(
            band,
            error
                ? [
                      {
                          key: 'page',
                          severity: 'critical',
                          title: 'The pump houses could not be read',
                          text: 'The network did not answer. What is shown is from earlier.',
                          action: retry,
                      },
                  ]
                : on
                  ? [
                        {
                            key: 'seven',
                            severity: 'warning',
                            title: 'Pump house 7 has sent no reading since 06:00',
                            text: 'The unit answers a ping; its modem may need a restart.',
                            action: retry,
                        },
                    ]
                  : [],
        );
    };
    let band = true;
    /** @type {'ready' | 'loading' | 'error'} */
    let state = 'ready';
    const phoneCount = 4;
    for (const page of pages) {
        const body = /** @type {HTMLElement} */ (page.querySelector('[data-ko-ops-body]'));
        const phone = page.hasAttribute('data-ko-ops-phone');
        OPS_CARDS.slice(0, phone ? phoneCount : OPS_CARDS.length).forEach(([span, title, lines]) => {
            const card = document.createElement('section');
            card.className = 'kp-card';
            card.setAttribute('data-kp-state', 'ready');
            card.setAttribute('data-kp-span', String(span));
            card.setAttribute('data-kp-loading-words', 'Reading…');
            const header = document.createElement('div');
            header.className = 'kp-card__header';
            const h = document.createElement('h2');
            h.className = 'kp-card__title';
            h.textContent = title;
            header.append(h);
            const stage = document.createElement('div');
            stage.className = 'kp-card__stage';
            const data = document.createElement('div');
            data.className = 'kp-card__data';
            for (const line of lines) {
                const p = document.createElement('p');
                p.style.margin = '0 0 0.25rem';
                p.textContent = line;
                data.append(p);
            }
            stage.append(data);
            card.append(header, stage);
            body.append(card);
        });
        for (const ago of page.querySelectorAll('[data-ko-ago]')) setAgo(/** @type {HTMLElement} */ (ago), Date.now() - 12000);
        const more = page.querySelector('[data-ko-ops-more]');
        if (more)
            setMenu(more, [
                {
                    group: '',
                    items: [
                        { label: 'Export readings', hint: 'A file of every reading', attrs: { 'data-kp-ops-narrow': '' } },
                        { label: 'Import from a file…', hint: 'Add pump houses in bulk' },
                        { label: 'Print the overview', hint: 'One page, as it is now' },
                    ],
                },
            ]);
        attention(page);
    }
    /** @param {'ready' | 'loading' | 'error'} next */
    function setState(next) {
        state = next;
        for (const page of pages) {
            page.setAttribute('data-kp-state', next);
            for (const tile of page.querySelectorAll('.kp-kpi')) (next === 'loading' ? skeletonTile : restoreTile)(tile);
            for (const card of page.querySelectorAll('.kp-card'))
                setCardState(/** @type {HTMLElement} */ (card), next === 'loading' ? 'loading' : 'ready');
            attention(page, band && next !== 'error', next === 'error');
        }
        for (const b of document.querySelectorAll('[data-ko-ops-state]'))
            b.setAttribute('aria-pressed', String(/** @type {HTMLElement} */ (b).dataset.koOpsState === next));
    }
    for (const button of document.querySelectorAll('[data-ko-ops-state]'))
        button.addEventListener('click', () =>
            setState(/** @type {'ready' | 'loading' | 'error'} */ (/** @type {HTMLElement} */ (button).dataset.koOpsState)),
        );
    for (const button of document.querySelectorAll('[data-ko-ops-band]'))
        button.addEventListener('click', () => {
            press(/** @type {Element} */ (button.closest('[role="group"]')), button);
            band = /** @type {HTMLElement} */ (button).dataset.koOpsBand === 'one';
            for (const page of pages) attention(page, band && state !== 'error', state === 'error');
        });
    for (const button of document.querySelectorAll('[data-ko-ops-sticky]'))
        button.addEventListener('click', () => {
            press(/** @type {Element} */ (button.closest('[role="group"]')), button);
            for (const page of pages) page.setAttribute('data-kp-ops-sticky', /** @type {HTMLElement} */ (button).dataset.koOpsSticky ?? 'toolbar');
        });
    const readout = document.querySelector('[data-ko-ops-readout]');
    const probe = document.createElement('div');
    probe.className = 'kp-ops';
    probe.hidden = true;
    document.body.append(probe);
    const say = (/** @type {string} */ width) => {
        probe.setAttribute('data-kp-ops-width', width);
        probe.hidden = false;
        const max = getComputedStyle(probe).maxInlineSize;
        probe.hidden = true;
        if (readout) readout.textContent = max === 'none' ? 'At most: the whole width of the window' : `At most: ${max} at this window`;
    };
    say('80vw');
    for (const button of document.querySelectorAll('[data-ko-ops-width]'))
        button.addEventListener('click', () => {
            press(/** @type {Element} */ (button.closest('[role="group"]')), button);
            const width = /** @type {HTMLElement} */ (button).dataset.koOpsWidth ?? '80vw';
            for (const page of pages) page.setAttribute('data-kp-ops-width', width);
            say(width);
        });
    for (const button of document.querySelectorAll('[data-ko-ops-density]'))
        button.addEventListener('click', () => {
            press(/** @type {Element} */ (button.closest('[role="group"]')), button);
            for (const page of pages) page.setAttribute('data-kp-density', /** @type {HTMLElement} */ (button).dataset.koOpsDensity ?? 'comfortable');
        });
}

initOpsPage();

// ---------------------------------------------------------------- master-detail
const SECRETS = [
    ['production/database/replica-reader-credentials-for-the-reporting-service', 'Read-only login for the reporting replica', 'Mira Vandenberg'],
    ['production/mail/smtp-relay', 'Relay password for outgoing mail', 'Tom Lambrecht'],
    ['production/storage/backup-bucket-key', 'Access key for the nightly backup bucket', 'Mira Vandenberg'],
    ['staging/database/primary', 'Login for the staging database', 'Joke Peeters'],
    ['staging/queue/broker-token', 'Token for the staging message broker', 'Joke Peeters'],
    ['shared/monitoring/alert-webhook', 'Webhook address for the alert channel', 'Tom Lambrecht'],
    ['shared/ci/deploy-key', 'Deploy key used by the pipeline', 'Mira Vandenberg'],
    ['shared/dns/api-token', 'Token for the DNS provider', 'Joke Peeters'],
];
const HISTORY = [
    ['Changed by Mira Vandenberg', '12/10/2026 14:05'],
    ['Read by the reporting service', '12/10/2026 06:00'],
    ['Created by Tom Lambrecht', '03/05/2026 09:41'],
];

function initMasterDetail() {
    const roots = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-ko-md]')]);
    if (!roots.length) return;
    for (const root of roots) {
        const list = /** @type {HTMLElement} */ (root.querySelector('[data-ko-md-list]'));
        SECRETS.forEach(([name], at) => {
            const li = document.createElement('li');
            li.setAttribute('data-kp-pane-key', String(at));
            li.textContent = name;
            list.append(li);
        });
        const history = root.querySelector('[data-ko-md-history]');
        for (const [what, when] of HISTORY) {
            const li = document.createElement('li');
            li.innerHTML = '<span></span><small></small>';
            /** @type {HTMLElement} */ (li.firstElementChild).textContent = what;
            /** @type {HTMLElement} */ (li.lastElementChild).textContent = when;
            history?.append(li);
        }
    }
    /** @type {Map<HTMLElement, number>} */
    const timers = new Map();
    /** @param {HTMLElement} root @param {number} key */
    const fill = (root, key) => {
        const [name, about, owner] = SECRETS[key] ?? SECRETS[0];
        const heading = /** @type {HTMLElement} */ (root.querySelector('[data-kp-pane-heading]'));
        heading.textContent = name;
        const body = /** @type {HTMLElement} */ (root.querySelector('[data-ko-md-body]'));
        body.innerHTML =
            '<dl class="ko-fields"><dt>Purpose</dt><dd></dd><dt>Owner</dt><dd></dd><dt>Last changed</dt><dd>12/10/2026 14:05</dd><dt>Read</dt><dd>1,284 times</dd></dl>';
        const dds = body.querySelectorAll('dd');
        dds[0].textContent = about;
        dds[1].textContent = owner;
    };
    /** @param {HTMLElement} root @param {number} key */
    const load = (root, key) => {
        const md = masterDetail(root);
        if (!md) return;
        clearTimeout(timers.get(root));
        setPaneState(root, 'loading');
        timers.set(
            root,
            window.setTimeout(() => {
                fill(root, key);
                setPaneState(root, 'ready');
            }, 700),
        );
    };
    for (const root of roots) {
        const name = root.dataset.koMd ?? '';
        root.addEventListener('kp-pane-select', (e) => log('master-detail', `${name}: select ${/** @type {CustomEvent} */ (e).detail.key}`));
        root.addEventListener('kp-pane-open', (e) => {
            const key = Number(/** @type {CustomEvent} */ (e).detail.key);
            log('master-detail', `${name}: open ${key}`);
            load(root, key);
        });
        root.addEventListener('kp-pane-close', (e) => log('master-detail', `${name}: close ${/** @type {CustomEvent} */ (e).detail.pane}`));
        root.addEventListener('kp-pane-retry', () => {
            log('master-detail', `${name}: retry`);
            load(root, Number(masterDetail(root)?.key() ?? 0));
        });
        // Arrow keys change the detail without opening a folded pane: load what the selection moved to.
        root.addEventListener('kp-pane-select', (e) => {
            const key = /** @type {CustomEvent} */ (e).detail.key;
            if (key !== null && !masterDetail(root)?.narrow()) load(root, Number(key));
        });
    }
    for (const button of document.querySelectorAll('[data-ko-md-state]')) {
        button.addEventListener('click', async () => {
            const group = /** @type {Element} */ (button.closest('[role="group"]'));
            press(group, button);
            const state = /** @type {HTMLElement} */ (button).dataset.koMdState;
            for (const root of roots) {
                const md = /** @type {NonNullable<ReturnType<typeof masterDetail>>} */ (await until(root, () => masterDetail(root)));
                clearTimeout(timers.get(root));
                if (state === 'empty') {
                    md.select(null);
                    md.close();
                    setPaneState(root, 'empty');
                } else {
                    if (md.key() === null) md.select('0');
                    const key = Number(md.key());
                    fill(root, key);
                    if (state === 'ready') setPaneState(root, 'ready');
                    else if (state === 'loading') setPaneState(root, 'loading');
                    else setPaneState(root, 'error', { text: 'The vault did not answer. Nothing was changed.' });
                }
            }
        });
    }
    for (const button of document.querySelectorAll('[data-ko-md-narrow]')) {
        button.addEventListener('click', () => {
            press(/** @type {Element} */ (button.closest('[role="group"]')), button);
            for (const root of roots) root.setAttribute('data-kp-narrow', /** @type {HTMLElement} */ (button).dataset.koMdNarrow ?? 'one-pane');
        });
    }
}

initMasterDetail();
