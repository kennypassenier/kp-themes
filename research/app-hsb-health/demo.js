// research/app-hsb-health: the page's own wiring. The components are the package's (js/auto.js attaches them); this file only
// feeds them sample data, presses their states and writes what they fire into a readout.
//
// The sample: HTTPSwitchboard accepts a message in one shape and delivers it in another. The real profile is "alertmanager"
// (kyu topic alerts.raw, subscription switchboard, to a Home Assistant webhook); "uptime-kuma" (POST /uptime-kuma) is a mock.
// A profile is starting, working, failing, denied or hub-down. The webhook's path is a credential and is never shown.

import { setAttention } from '../../js/attention.js';
import { connectionOf, setConnection } from '../../js/connection.js';
import { humanDuration, setAgo } from '../../js/freshness.js';
import { PROBLEM_DISMISS_EVENT, setProblems } from '../../js/problems.js';
import { attachArt } from '../../js/art.js';
import { setCardState } from '../../js/card-state.js';
import { getStrings, setStrings } from '../../js/strings.js';

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

/** @param {string} id @returns {HTMLElement} */
const byId = (id) => /** @type {HTMLElement} */ (document.getElementById(id));

/** Press a state button: exactly one of the group is pressed. @param {string} attribute @param {(value: string) => void} apply */
function stateButtons(attribute, apply) {
    const buttons = /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll(`[${attribute}]`)]);
    const mark = (/** @type {string} */ value) => {
        for (const b of buttons) b.setAttribute('aria-pressed', String(b.getAttribute(attribute) === value));
    };
    for (const button of buttons)
        button.addEventListener('click', () => {
            const value = button.getAttribute(attribute) ?? '';
            mark(value);
            apply(value);
        });
    return mark;
}

/** What the review dialog sets for a choice, as the section hears it. @param {string} id @param {(value: string) => void} apply */
function onChoice(id, apply) {
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id === id) apply(String(detail.value));
    });
}

// ── the app's own words, over the dictionary's (the package takes them through setStrings) ──
setStrings({
    agoNever: (verb) => (verb === 'last delivery' ? 'no delivery yet' : `not ${verb} yet`),
    connOffline: 'The kyu hub is unreachable',
    connOfflineWhy: 'Messages cannot be fetched until the hub answers. The switchboard keeps trying by itself.',
    connReconnecting: 'Reaching the kyu hub…',
    connReconnectingWhy: 'Trying to reach the hub now.',
    connPending: (n) => `${n} ${n === 1 ? 'message' : 'messages'} waiting on the hub`,
    connBack: 'Connected to the kyu hub again',
    connBackWhy: 'Messages are being fetched.',
    connBackSending: (n) => `Delivering ${n} waiting ${n === 1 ? 'message' : 'messages'}`,
    connRefused: 'The kyu hub refused our credentials',
    connRefusedWhy: 'The switchboard’s token was not accepted. Re-issue it.',
});

// ── the sample: what each health state means, in words ──
/**
 * @typedef {'working' | 'starting' | 'failing' | 'denied' | 'hub-down'} Health
 * @typedef {{ severity: 'critical' | 'warning' | 'info', title: string, text: string, what: string, why: string, remedy: string, command?: string, fix: string }} Words
 */
/** @type {Record<string, Partial<Record<Health, Words>>>} */
const WORDS = {
    alertmanager: {
        denied: {
            severity: 'critical',
            title: 'alertmanager: the kyu hub refused our credentials',
            text: 'No alert can be fetched from alerts.raw until the token is re-issued.',
            what: 'alertmanager: the kyu hub refused our credentials',
            why: 'The hub did not accept the switchboard’s token for the subscription “switchboard”, so it cannot read the topic alerts.raw.',
            remedy: 'Re-issue the switchboard’s kyu token, then recheck the profiles.',
            fix: 'Recheck profiles',
        },
        'hub-down': {
            severity: 'critical',
            title: 'alertmanager: the kyu hub cannot be reached',
            text: 'Nothing arrives on alerts.raw while the hub does not answer.',
            what: 'alertmanager: the kyu hub cannot be reached',
            why: 'The switchboard reads alerts.raw from the hub, and the hub does not answer.',
            remedy: 'Check that kyu is running on CT 109.',
            command: 'systemctl status kyu',
            fix: 'Check again',
        },
        failing: {
            severity: 'warning',
            title: 'alertmanager: deliveries to Home Assistant are failing',
            text: '3 messages are waiting on the hub and are tried again.',
            what: 'alertmanager: deliveries to Home Assistant are failing',
            why: 'Home Assistant on homeassistant.lan:8123 did not accept the last 3 deliveries. The messages wait on the hub and are tried again.',
            remedy: 'Check that Home Assistant is up, then read the switchboard’s log.',
            command: 'journalctl -u http-switchboard',
            fix: 'Check again',
        },
        starting: {
            severity: 'info',
            title: 'alertmanager has not tried yet',
            text: 'Nothing was tried since the service started or since the last recheck.',
            what: 'alertmanager has not tried yet',
            why: 'Nothing was tried since the service started or since the last recheck.',
            remedy: 'Nothing to fix: it turns to working with the next message.',
            fix: 'Recheck profiles',
        },
    },
    'uptime-kuma': {
        failing: {
            severity: 'warning',
            title: 'uptime-kuma (mock): deliveries to Home Assistant are failing',
            text: 'The last 2 deliveries from POST /uptime-kuma were not accepted.',
            what: 'uptime-kuma (mock): deliveries to Home Assistant are failing',
            why: 'Home Assistant did not accept the last 2 deliveries from POST /uptime-kuma.',
            remedy: 'Check that Home Assistant is up, then read the switchboard’s log.',
            command: 'journalctl -u http-switchboard',
            fix: 'Check again',
        },
        starting: {
            severity: 'info',
            title: 'uptime-kuma (mock) has not tried yet',
            text: 'Nothing was tried since the service started or since the last recheck.',
            what: 'uptime-kuma (mock) has not tried yet',
            why: 'Nothing was tried since the service started or since the last recheck.',
            remedy: 'Nothing to fix: it turns to working with the next message.',
            fix: 'Recheck profiles',
        },
    },
};

/** A button of the kit's own look. @param {string} label @param {string} key */
function fixButton(label, key) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'kp-button kp-button--secondary kp-button--sm';
    button.textContent = label;
    button.setAttribute('data-hs-fix', key);
    return button;
}

// ───────────────────────────────────────────────────────── 1 · attention band
{
    /** @type {{ am: Health, ak: Health }} */
    const health = { am: 'denied', ak: 'starting' };
    const band = byId('hs-band');
    const phone = byId('hs-band-phone');
    const clear = byId('hs-clear');
    /** One set of items per band: a button is one node and stands in one place. */
    const itemsNow = () => {
        /** @type {import('../../js/attention.js').AttentionItem[]} */
        const items = [];
        // Handed over in the wrong order on purpose: the band puts the worst first itself.
        for (const [profile, key] of /** @type {const} */ ([['uptime-kuma', 'ak'], ['alertmanager', 'am']])) {
            const w = WORDS[profile][health[key]];
            if (!w) continue;
            items.push({ key: profile, severity: w.severity, title: w.title, text: w.text, action: fixButton('See the fix', profile) });
        }
        return items;
    };
    const paint = () => {
        setAttention(band, itemsNow());
        const forPhone = itemsNow();
        setAttention(phone, forPhone);
        clear.hidden = forPhone.length > 0;
    };
    const markA = stateButtons('data-hs-att-a', (v) => {
        health.am = /** @type {Health} */ (v);
        paint();
    });
    const markK = stateButtons('data-hs-att-k', (v) => {
        health.ak = /** @type {Health} */ (v);
        paint();
    });
    markA(health.am);
    markK(health.ak);
    await ready;
    paint();
    byId('attention').addEventListener('click', (event) => {
        const button = /** @type {HTMLElement} */ (event.target).closest('[data-hs-fix]');
        if (!button) return;
        byId('hs-att-readout').textContent = `Pressed “See the fix” for ${button.getAttribute('data-hs-fix')}: the page scrolls to its problem alert.`;
    });
}

// ───────────────────────────────────────────────────────── 2 · problem alert
{
    /** @param {string} key @param {Health} health @param {{ id?: string, dismissible?: boolean }} [extra] */
    const problem = (key, health, extra = {}) => {
        const w = /** @type {Words} */ (WORDS[key][health]);
        return {
            key: extra.id ?? key,
            severity: w.severity,
            what: w.what,
            why: w.why,
            remedy: w.remedy,
            command: w.command,
            action: fixButton(w.fix, extra.id ?? key),
            dismissible: extra.dismissible ?? false,
        };
    };
    /** Each set is a function, so each container gets its own buttons. @type {Record<string, () => import('../../js/problems.js').Problem[]>} */
    const SETS = {
        denied: () => [problem('alertmanager', 'denied')],
        'hub-down': () => [problem('alertmanager', 'hub-down')],
        failing: () => [problem('alertmanager', 'failing')],
        starting: () => [problem('alertmanager', 'starting', { dismissible: true })],
        both: () => [problem('alertmanager', 'denied'), problem('uptime-kuma', 'failing')],
        all: () => [
            problem('alertmanager', 'hub-down', { id: 'sample-hub-down' }),
            problem('alertmanager', 'denied', { id: 'sample-denied' }),
            problem('alertmanager', 'failing', { id: 'sample-failing' }),
            problem('alertmanager', 'starting', { id: 'sample-starting', dismissible: true }),
        ],
        none: () => [],
    };
    const live = byId('hs-problems');
    const phone = byId('hs-problems-phone');
    let current = 'both';
    /** Keys the reader closed, so the next paint leaves them out. @type {Set<string>} */
    const closed = new Set();
    const paint = () => {
        setProblems(live, SETS[current]().filter((p) => !closed.has(p.key)));
        setProblems(phone, SETS[current]().filter((p) => !closed.has(p.key)).slice(0, 2));
    };
    /** @param {string} attribute @param {string | null} value */
    const both = (attribute, value) => {
        for (const el of [live, phone]) {
            if (value === null) el.removeAttribute(attribute);
            else el.setAttribute(attribute, value);
        }
    };
    stateButtons('data-hs-prob', (v) => {
        current = v;
        closed.clear();
        paint();
    });
    const markMode = stateButtons('data-hs-mode', (v) => both('data-kp-problems-mode', v));
    stateButtons('data-hs-fold', (v) => both('data-kp-problems-fold-from', v));
    stateButtons('data-hs-look', (v) => both('data-kp-problem-layout', v === 'inline' ? 'inline' : null));
    onChoice('hs-problem-mode', (v) => {
        both('data-kp-problems-mode', v);
        markMode(v);
    });
    await ready;
    paint();
    byId('problem').addEventListener(PROBLEM_DISMISS_EVENT, (event) => {
        const key = /** @type {CustomEvent} */ (event).detail?.key;
        closed.add(key);
        paint();
        byId('hs-prob-readout').textContent = 'The note was closed. A real fault cannot be closed until it is fixed.';
    });
    byId('problem').addEventListener('click', (event) => {
        const button = /** @type {HTMLElement} */ (event.target).closest('[data-hs-fix]');
        if (!button) return;
        byId('hs-prob-readout').textContent = `Pressed “${button.textContent}”: the page rechecks; the problem leaves when the profile really recovers.`;
    });
}

// ───────────────────────────────────────────────────────── 3 · freshness
{
    const a = byId('hs-ago-a');
    const k = byId('hs-ago-k');
    await ready;
    setAgo(a, Date.now() - 180_000);
    setAgo(k, null);
    stateButtons('data-hs-last', (v) => setAgo(a, v === 'never' ? null : Date.now() - Number(v) * 1000));
    stateButtons('data-hs-quiet', (v) => {
        a.setAttribute('data-kp-stale-after', v);
        byId('hs-quiet-a').textContent = `Quiet time allowed: ${humanDuration(Number(v))}`;
    });
    const markLast = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-hs-last]')]);
    document.querySelector('[data-hs-arrive]')?.addEventListener('click', () => {
        setAgo(a, Date.now());
        setAgo(k, Date.now());
        for (const b of markLast) b.setAttribute('aria-pressed', String(b.getAttribute('data-hs-last') === '0'));
    });
}

// ───────────────────────────────────────────────────────── 4 · connection banner
{
    const banners = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-hs-banner]')]);
    const readout = byId('hs-conn-readout');
    let pending = 3;
    /** What the mock hub is doing: 'refused' keeps refusing, anything else answers again on the next try. */
    let bad = '';
    const REFUSED = 'The hub did not accept the switchboard’s token for the subscription “switchboard”. Nothing was lost.';
    /** @param {'online' | 'offline' | 'reconnecting' | 'back' | 'refused'} state @param {object} [detail] */
    const all = (state, detail = {}) => {
        for (const b of banners) setConnection(b, state, { pending, ...detail });
    };
    await ready;
    for (const b of banners) {
        b.addEventListener('kp-connection-state', (e) => {
            readout.textContent = `State: ${/** @type {CustomEvent} */ (e).detail.state}.`;
        });
        b.addEventListener('kp-connection-retry', (e) => {
            const attempt = /** @type {CustomEvent} */ (e).detail.attempt;
            readout.textContent = `Try ${attempt} (${/** @type {CustomEvent} */ (e).detail.auto ? 'automatic' : 'pressed'}); the mock hub answers in a moment.`;
            all('reconnecting', { attempt });
            window.setTimeout(() => {
                if (bad === 'refused') all('refused', { why: REFUSED });
                else {
                    bad = '';
                    all('online');
                }
            }, 1200);
        });
    }
    for (const button of document.querySelectorAll('[data-hs-conn]'))
        button.addEventListener('click', () => {
            switch (/** @type {HTMLElement} */ (button).dataset.hsConn) {
                case 'offline':
                    bad = 'offline';
                    all('offline');
                    break;
                case 'reconnecting':
                    all('reconnecting', { attempt: 2 });
                    break;
                case 'refused':
                    bad = 'refused';
                    all('refused', { why: REFUSED });
                    break;
                case 'online':
                    bad = '';
                    all('online');
                    break;
                case 'blip':
                    all('offline');
                    window.setTimeout(() => all('online'), 1000);
                    break;
            }
        });
    stateButtons('data-hs-pending', (v) => {
        pending = Number(v);
        for (const b of banners) {
            b.setAttribute('data-kp-pending', v);
            const state = connectionOf(b)?.state();
            if (state && state !== 'online') setConnection(b, state, { pending });
        }
    });
    const place = (/** @type {string} */ v) => {
        for (const b of banners) b.setAttribute('data-kp-placement', v);
    };
    const markPlace = stateButtons('data-hs-place', place);
    onChoice('hs-connection-placement', (v) => {
        place(v);
        markPlace(v);
    });
}

// ───────────────────────────────────────────────────────── 5 · profiles area states
{
    const cards = [byId('hs-card'), byId('hs-card-phone')];
    const readout = byId('hs-states-readout');
    let errorLook = 'drawing';
    let state = 'ready';

    const rows = `<ul class="hs-profiles" aria-label="Profiles">
        <li class="hs-profile">
            <span class="hs-profile__name"><b>alertmanager</b><span class="hs-profile__route">kyu alerts.raw → Home Assistant</span></span>
            <span class="hs-profile__figures"><span>received 1284 · delivered 1281 · failed 3</span></span>
            <span class="hs-profile__fresh"><span class="kp-badge kp-badge--success">Working</span></span>
        </li>
        <li class="hs-profile">
            <span class="hs-profile__name"><b>uptime-kuma</b><span class="hs-profile__route">POST /uptime-kuma → Home Assistant (mock)</span></span>
            <span class="hs-profile__figures"><span>received 0 · delivered 0 · failed 0</span></span>
            <span class="hs-profile__fresh"><span class="kp-badge kp-badge--info">Starting</span></span>
        </li>
    </ul>`;
    for (const card of cards) /** @type {HTMLElement} */ (card.querySelector('[data-hs-rows]')).innerHTML = rows;

    /** The page's own note for a card: the package’s empty plate with a drawing (CardStateOptions has no art). @param {HTMLElement} card @param {string | null} html */
    const ownNote = (card, html) => {
        const stage = /** @type {HTMLElement} */ (card.querySelector(':scope > .kp-card__stage'));
        for (const old of stage.querySelectorAll(':scope > .kp-card__state')) old.remove();
        if (html === null) return;
        const note = document.createElement('div');
        note.className = 'kp-card__state';
        note.setAttribute('role', 'status');
        note.innerHTML = html;
        stage.append(note);
        // A note made after the boot is attached by the page that made it (js/auto.js only reads what the page carried).
        attachArt(note);
    };
    const emptyNote = `<div class="kp-empty kp-card__empty" data-kp-art="none">
        <p class="kp-empty__title">No profiles are configured</p>
        <p class="kp-empty__body">A profile says where messages come from and where they go. Add one and recheck.</p>
        <div class="kp-card__state-actions"><button type="button" class="kp-button" data-hs-add>Show how to add one</button></div>
    </div>`;
    const errorNote = () => `<div class="kp-empty kp-card__empty" data-kp-art="error">
        <p class="kp-empty__title">The profiles could not be read</p>
        <p class="kp-empty__body">The status service did not answer in time. Nothing was changed.</p>
        <div class="kp-card__state-actions"><button type="button" class="kp-button" data-kp-card-retry>${getStrings().cardRetry}</button></div>
    </div>`;

    const markState = stateButtons('data-hs-state', (v) => show(v));
    const markLook = stateButtons('data-hs-errlook', (v) => {
        errorLook = v;
        if (state === 'error') show('error');
    });
    /** @param {string} next */
    function show(next) {
        state = next;
        markState(next);
        for (const card of cards) {
            if (next === 'ready') setCardState(card, 'ready');
            else if (next === 'loading') setCardState(card, 'loading', { words: 'Reading the profiles…' });
            else if (next === 'empty') {
                ownNote(card, emptyNote);
                setCardState(card, 'empty');
            } else if (errorLook === 'alert') {
                ownNote(card, null);
                setCardState(card, 'error', { title: 'The profiles could not be read', text: 'The status service did not answer in time. Nothing was changed.' });
            } else {
                ownNote(card, errorNote());
                setCardState(card, 'error');
            }
        }
    }
    onChoice('hs-error-look', (v) => {
        errorLook = v;
        markLook(v);
        if (state === 'error') show('error');
    });
    await ready;
    for (const card of cards) {
        card.addEventListener('kp-card-retry', () => {
            readout.textContent = 'Try again pressed: reading the profiles once more.';
            show('loading');
            window.setTimeout(() => show('ready'), 1400);
        });
    }
    byId('states').addEventListener('click', (event) => {
        if (/** @type {HTMLElement} */ (event.target).closest('[data-hs-add]'))
            readout.textContent = 'Pressed “Show how to add one”: the page opens the guide to profile files.';
    });
}
