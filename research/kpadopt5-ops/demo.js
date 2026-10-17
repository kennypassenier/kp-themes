// research/kpadopt5-ops: the demo's own wiring. The components are the package's (js/*.js, attached by js/auto.js); this file
// only feeds them sample data, presses their states and writes what they fire into a log.

import { connectionOf, setConnection } from '../../js/connection.js';
import { attachTransfers, resetTransfer, setTransfer } from '../../js/transfer.js';
import { noticesOf, setNotices } from '../../js/notices.js';

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

// ---------------------------------------------------------------- connection
function initConnection() {
    const banners = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-ko-conn-banner]')]);
    if (!banners.length) return;
    let pending = 2;
    const readout = document.querySelector('[data-ko-conn-readout]');
    const all = (/** @type {'online' | 'offline' | 'reconnecting' | 'back' | 'refused'} */ state, /** @type {object} */ detail = {}) => {
        for (const b of banners) setConnection(b, state, { pending, ...detail });
    };
    for (const b of banners) {
        b.addEventListener('kp-connection-state', (e) => {
            if (readout) readout.textContent = `State: ${/** @type {CustomEvent} */ (e).detail.state}.`;
        });
        b.addEventListener('kp-connection-retry', (e) => {
            if (readout)
                readout.textContent = `Retry ${/** @type {CustomEvent} */ (e).detail.attempt} (${/** @type {CustomEvent} */ (e).detail.auto ? 'automatic' : 'pressed'}); the app answers.`;
        });
    }
    for (const button of document.querySelectorAll('[data-ko-conn]'))
        button.addEventListener('click', () => {
            switch (/** @type {HTMLElement} */ (button).dataset.koConn) {
                case 'offline':
                    all('offline');
                    break;
                case 'pending':
                    pending += 1;
                    all(connectionOf(banners[0])?.state() ?? 'online', {});
                    for (const b of banners) b.setAttribute('data-kp-pending', String(pending));
                    if (connectionOf(banners[0])?.state() === 'offline') all('offline');
                    break;
                case 'still':
                    all('offline');
                    break;
                case 'blip':
                    all('offline');
                    window.setTimeout(() => all('online'), 1000);
                    break;
                case 'refused':
                    all('refused', { why: 'The server did not accept the change to pump house 7. It was kept; nothing was lost.' });
                    break;
                case 'online':
                    all('online');
                    break;
            }
        });
}

initConnection();

// ---------------------------------------------------------------- transfer
function initTransfer() {
    const groups = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-ko-xfers]')]);
    if (!groups.length) return;
    const MB = 1_000_000;
    /** The demo's own clock: five simulated seconds for each real second. */
    let sim = Date.now();
    let timer = 0;
    let t = 0;
    /** @param {HTMLElement[]} rows */
    const frame = (rows) => {
        const now = () => sim;
        const [a, b, c] = rows;
        if (!a || !b || !c) return;
        if (t <= 50) {
            // A steady 12 MB/s with a little wobble, counted up so the bytes only ever grow.
            const done = Math.min(600 * MB, Math.round(12 * MB * (t + 0.35 * Math.sin(t / 2))));
            setTransfer(a, { done: Math.max(done, a.dataset.koDone ? Number(a.dataset.koDone) : 0), total: 600 * MB, at: sim }, { now });
            a.dataset.koDone = String(done);
        }
        if (t === 51) setTransfer(a, { done: 600 * MB, total: 600 * MB, at: sim }, { now });
        if (t <= 29) setTransfer(b, { done: Math.round(40 * MB * t), at: sim }, { now });
        if (t === 30) setTransfer(b, { done: 40 * MB * 30, total: 40 * MB * 30, at: sim }, { now });
        if (t <= 8) setTransfer(c, { done: 3 * MB * t, total: 900 * MB, at: sim }, { now });
        if (t === 28) setTransfer(c, { failed: 'The connection was reset by the host.', at: sim }, { now });
    };
    const reset = () => {
        window.clearInterval(timer);
        t = 0;
        for (const group of groups) for (const row of group.querySelectorAll('[data-kp-transfer]')) resetTransfer(/** @type {HTMLElement} */ (row));
    };
    for (const button of document.querySelectorAll('[data-ko-xfer]'))
        button.addEventListener('click', () => {
            const kind = /** @type {HTMLElement} */ (button).dataset.koXfer;
            reset();
            if (kind !== 'play') return;
            sim = Date.now();
            timer = window.setInterval(() => {
                t += 1;
                sim += 1000;
                for (const group of groups) frame([...group.querySelectorAll('[data-kp-transfer]')].map((r) => /** @type {HTMLElement} */ (r)));
                if (t >= 60) window.clearInterval(timer);
            }, 200);
        });
    for (const group of groups)
        group.addEventListener('kp-transfer-retry', (e) => {
            const row = /** @type {HTMLElement} */ (e.target);
            setTransfer(row, { done: 0, total: 900 * MB, at: sim }, { now: () => sim });
        });
}

initTransfer();

// ---------------------------------------------------------------- notices
function initNotices() {
    const boxes = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-ko-n]')]);
    if (!boxes.length) return;
    const min = (/** @type {number} */ m) => Date.now() - m * 60_000;
    /** @type {import('../../js/notices.js').Notice[]} */
    let items = [
        {
            key: 'p3',
            severity: 'critical',
            title: 'Pump house 3 is below 2.1 bar',
            since: min(41),
            consequence: 'The homes on the ring main lose pressure first.',
            remedy: 'Open the incident and start the standby pump.',
            fix: { label: 'Open the incident' },
        },
        {
            key: 'p7',
            severity: 'warning',
            title: 'Pump house 7 has sent no reading since 06:00',
            since: min(190),
            consequence: 'Its readings are missing from today’s totals.',
            remedy: 'Restart its modem.',
            fix: { label: 'Restart the modem' },
        },
        {
            key: 'res',
            severity: 'warning',
            title: 'Reservoir South fills slower than forecast',
            since: min(75),
            consequence: '64 % now, 70 % expected by 09:00.',
            remedy: 'Check valve 2 on the next visit.',
        },
        {
            key: 'fw',
            severity: 'info',
            title: 'Firmware 4.2 is out for six field units',
            since: min(1400),
            consequence: 'It fixes the flow meter’s drift after a power cut.',
            remedy: 'Plan the update.',
            fix: { label: 'Plan the update' },
        },
        { key: 'bk', severity: 'info', title: 'The nightly backup finished', since: min(600), consequence: '4.1 GB in 3 min 12 s.', read: true },
        { key: 'c1', severity: 'info', title: 'A new visitor account was created', since: min(2200), read: true },
        { key: 'c2', severity: 'info', title: 'The certificate renews in 12 days', since: min(3000), remedy: 'Nothing to do; it renews by itself.' },
        {
            key: 'c3',
            severity: 'warning',
            title: 'Disk usage on the archive passed 80 %',
            since: min(4000),
            remedy: 'Clear old exports.',
            fix: { label: 'Open the archive' },
        },
    ];
    const sources = [
        { key: 'north', label: 'Northern network' },
        { key: 'south', label: 'Southern network' },
        { key: 'archive', label: 'Archive', muted: true },
    ];
    /** @type {'ready' | 'loading' | 'empty' | 'error'} */
    let state = 'ready';
    let quietOn = false;
    let many = false;
    const quietUntil = () => {
        const d = new Date();
        d.setHours(d.getHours() + 3);
        return d.getTime();
    };
    const push = () => {
        for (const box of boxes) {
            box.toggleAttribute('data-kp-count', many);
            if (many) box.setAttribute('data-kp-count', '134');
            setNotices(box, {
                state,
                items: state === 'ready' ? items : [],
                sources,
                quietUntil: quietOn ? quietUntil() : null,
                error: 'The host did not answer.',
            });
        }
    };
    const all = boxes.map((box) => box);
    for (const box of all) {
        for (const type of [
            'kp-notice-fix',
            'kp-notice-read',
            'kp-notices-read-all',
            'kp-notices-source',
            'kp-notices-retry',
            'kp-notices-end-quiet',
            'kp-notices-open-inbox',
        ])
            box.addEventListener(type, (e) => {
                const d = /** @type {CustomEvent} */ (e).detail;
                log('notices', `${box.dataset.koN}: ${type} ${JSON.stringify(d)}`);
                if (type === 'kp-notices-retry') {
                    state = 'loading';
                    push();
                    window.setTimeout(() => {
                        state = 'ready';
                        for (const b of document.querySelectorAll('[data-ko-n-state]'))
                            b.setAttribute('aria-pressed', String(/** @type {HTMLElement} */ (b).dataset.koNState === 'ready'));
                        push();
                    }, 1200);
                }
                if (type === 'kp-notices-end-quiet') {
                    quietOn = false;
                    for (const b of document.querySelectorAll('[data-ko-n-act=quiet]')) b.setAttribute('aria-pressed', 'false');
                    push();
                }
            });
    }
    void Promise.all(boxes.map((b) => until(b, () => noticesOf(b)))).then(push);
    for (const button of document.querySelectorAll('[data-ko-n-state]'))
        button.addEventListener('click', () => {
            press(/** @type {Element} */ (button.closest('[role="group"]')), button);
            state = /** @type {'ready' | 'loading' | 'empty' | 'error'} */ (/** @type {HTMLElement} */ (button).dataset.koNState);
            push();
        });
    for (const button of document.querySelectorAll('[data-ko-n-act]'))
        button.addEventListener('click', () => {
            const act = /** @type {HTMLElement} */ (button).dataset.koNAct;
            if (act === 'quiet') {
                quietOn = !quietOn;
                button.setAttribute('aria-pressed', String(quietOn));
            } else if (act === 'many') {
                many = !many;
                button.setAttribute('aria-pressed', String(many));
            } else {
                items = [
                    {
                        key: `new-${Date.now()}`,
                        severity: 'critical',
                        title: 'Pump house 5 has stopped',
                        since: Date.now(),
                        consequence: 'Zone 5 has no supply.',
                        remedy: 'Send the standby crew.',
                        fix: { label: 'Open the incident' },
                    },
                    ...items,
                ];
            }
            push();
        });
}

initNotices();
