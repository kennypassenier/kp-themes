// research/app-homelab-backups: the Console and host log sections' wiring. The components are the package's; this file feeds
// them the sample shell (shelldata.js) and shows what they fire. Every section runs only when it is on the page.

import { $, $$, has, count, pad, stateButtons, onChoice, ready, mount, matrixRetry } from './shared.js';
import * as S from './shelldata.js';
import { setCardState, CARD_RETRY_EVENT } from '../../js/card-state.js';
import { setKeys } from '../../js/keys.js';
import { setConsole, setConsoleRun, setConsoleComplete, setConsoleContext, runConsoleCommand, clearConsole, consoleBlocks, CONSOLE_RETRY_EVENT, CONSOLE_BLOCK_EVENT } from '../../js/console.js';

await ready;

// A shell line is longer than a phone: console output wraps there instead of scrolling sideways (the reader can still toggle Wrap).
new MutationObserver(() => {
    for (const f of document.querySelectorAll('.kp-console__output:not([data-kp-code-wrap])')) f.setAttribute('data-kp-code-wrap', '');
}).observe(document.body, { childList: true, subtree: true });

const OFF_REASON = 'Remote exec is off (exec_enabled = false, changed over ssh only)';
let seq = 0;

/** Give a console its targets, completions and the emulator. @param {HTMLElement} el @param {{ rebootRefused?: boolean }} [opts] */
function wireConsole(el, opts = {}) {
    setConsoleContext(el, { label: 'Run in', options: S.TARGETS, value: 'pve' });
    setConsoleComplete(el, (prefix) => S.COMPLETE.filter((w) => w.startsWith(prefix)));
    setConsoleRun(el, (command, context) => S.simulate(command, context, opts));
}

/** The four states of a console. @param {HTMLElement} el @param {string} v */
function consoleState(el, v) {
    if (v === 'off') {
        el.setAttribute('disabled', '');
        el.setAttribute('data-kp-disabled-reason', OFF_REASON);
        return;
    }
    el.removeAttribute('disabled');
    el.removeAttribute('data-kp-disabled-reason');
    setConsole(el, v === 'error' ? { state: 'error', message: 'The host did not answer. Nothing was run.' } : { state: /** @type {any} */ (v) });
}

/** A log row. @param {S.Line} l */
const row = (l) => `<li class="hb-logrow" data-level="${l.level}"><time class="kp-numeric">${S.stamp(l.ts)}</time><span class="hb-src"><i class="hb-src__mark" data-kp-source="${l.source}" aria-hidden="true"></i>${l.source}</span><span class="kp-badge kp-badge--${l.level === 'error' ? 'destructive' : l.level === 'warn' ? 'warning' : ''}">${l.level === 'warn' ? 'warning' : l.level}</span><span class="hb-logrow__text">${l.text}</span></li>`;

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 1. the console
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('sh-console-component')) {
    const root = $('#sh-console-component');
    const el = $('[data-kp-console]', root);
    const read = $('[data-hb-sc-read]', root);
    wireConsole(el);
    setKeys($('[data-hb-sc-keys]', root), [['↑', 'earlier command'], ['Tab', 'complete'], [':', 'jump to the prompt'], [['Ctrl', 'L'], 'clear (with undo)'], ['Enter', 'run']]);
    for (const c of ['uptime', 'df -h /', 'ls /missing']) await runConsoleCommand(el, c);
    const tell = () => (read.textContent = `${count(consoleBlocks(el).length)} commands in this tab.`);
    el.addEventListener(CONSOLE_BLOCK_EVENT, tell);
    tell();
    el.addEventListener(CONSOLE_RETRY_EVENT, () => {
        pressed('ready');
        consoleState(el, 'ready');
    });
    const pressed = stateButtons('data-hb-sc-data', (v) => consoleState(el, v));
    const setOrder = (/** @type {string} */ v) => el.setAttribute('data-kp-console-order', v);
    const pressedO = stateButtons('data-hb-sc-order', setOrder);
    onChoice('sh-order', (v) => {
        pressedO(v);
        setOrder(v);
    });
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 2. safety
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('sh-safety-component')) {
    const root = $('#sh-safety-component');
    const el = $('[data-kp-console]', root);
    const chips = $('[data-hb-sf-chips]', root);
    const read = $('[data-hb-sf-read]', root);
    let refuse = true;
    const CORE = ['rm', 'reboot', 'shutdown', 'mkfs', 'dd', 'kill -9'];
    const WIDE = CORE.concat(['systemctl stop', 'pct stop', 'docker rm']);
    const rx = (/** @type {string[]} */ ws) => `/^\\s*(${ws.join('|')})\\b/`;
    const words = (/** @type {string} */ v) => {
        const ws = v === 'wide' ? WIDE : CORE;
        el.setAttribute('data-kp-console-confirm', rx(ws));
        chips.innerHTML = ws.map((w) => `<span class="kp-badge">${w}</span>`).join('');
        read.textContent = `${count(ws.length)} commands wait for a second press.`;
    };
    setConsoleContext(el, { label: 'Run in', options: S.TARGETS, value: 'pve' });
    setConsoleComplete(el, (p) => S.COMPLETE.filter((w) => w.startsWith(p)));
    setConsoleRun(el, (c, ctx) => S.simulate(c, ctx, { rebootRefused: refuse }));
    words('core');
    stateButtons('data-hb-sf-answer', (v) => {
        refuse = v === 'refuse';
        root.dataset.hbAnswer = v;
        read.textContent = refuse ? 'The host will refuse reboot and shutdown.' : 'The host will allow reboot and shutdown after the second press.';
    });
    const pressedW = stateButtons('data-hb-sf-words', words);
    onChoice('sh-confirm-words', (v) => {
        pressedW(v);
        words(v);
    });
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 3. clear, run again, download
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('sh-session-component')) {
    const root = $('#sh-session-component');
    const el = $('[data-kp-console]', root);
    const read = $('[data-hb-ss-read]', root);
    wireConsole(el);
    let last = 'uptime';
    for (const c of ['uptime', 'hostname']) await runConsoleCommand(el, c);
    el.addEventListener(CONSOLE_BLOCK_EVENT, (e) => {
        const b = /** @type {CustomEvent} */ (e).detail.block;
        if (b?.command) last = b.command;
    });
    $('[data-hb-ss-clear]', root).addEventListener('click', () => {
        clearConsole(el, { undo: true });
        read.textContent = 'Screen cleared. Undo is in the toast for 6 seconds; Up still recalls your commands.';
    });
    $('[data-hb-ss-again]', root).addEventListener('click', () => {
        void runConsoleCommand(el, last);
        read.textContent = `Run again: ${last}`;
    });
    $('[data-hb-ss-save]', root).addEventListener('click', () => {
        const blocks = consoleBlocks(el);
        const text = blocks.map((b) => `# ${b.context}\n$ ${b.command}\n${b.output}\n[${b.state}${b.code === undefined ? '' : `, exit ${b.code}`}]`).join('\n\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
        a.download = `host-console-19-10-2026-1405.txt`;
        a.click();
        URL.revokeObjectURL(a.href);
        read.textContent = `Downloaded host-console-19-10-2026-1405.txt: ${count(blocks.length)} blocks, ${count(text.length)} characters.`;
    });
    $('[data-hb-ss-stream]', root).addEventListener('click', () => void runConsoleCommand(el, 'journalctl -f'));
    el.addEventListener(CONSOLE_RETRY_EVENT, () => {
        pressed('ready');
        consoleState(el, 'ready');
    });
    const pressed = stateButtons('data-hb-ss-data', (v) => consoleState(el, v));
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 4. pane or bar
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('sh-mode-component')) {
    const { setCode } = await import('../../js/code.js');
    const { newPill } = await import('../../js/newpill.js');
    const root = $('#sh-mode-component');
    const logCard = $('.kp-card', root);
    const log = $('[data-hb-sm-log]', root);
    const read = $('[data-hb-sm-read]', root);
    const slot = $('.hb-console', root);
    const markup = slot.innerHTML;
    let mode = 'full';
    let state = 'ready';
    const lines = S.LOG.slice(-14);

    const drawLog = () => {
        log.innerHTML = state === 'ready' ? lines.map(row).join('') : '';
        newPill(log)?.resume();
    };
    const wire = async () => {
        slot.innerHTML = markup;
        const el = $('[data-kp-console]', slot);
        el.setAttribute('data-kp-console-mode', mode);
        await mount(slot, slot.innerHTML);
        wireConsole(slot.querySelector('[data-kp-console]') ?? el);
        const live = /** @type {HTMLElement} */ (slot.querySelector('[data-kp-console]'));
        live.addEventListener(CONSOLE_BLOCK_EVENT, async (e) => {
            if (mode !== 'bar') return;
            const b = /** @type {CustomEvent} */ (e).detail.block;
            let li = log.querySelector(`[data-hb-block="${b.id}"]`);
            if (!li) {
                li = document.createElement('li');
                li.className = 'hb-logblock';
                li.setAttribute('data-hb-block', b.id);
                li.innerHTML = '<span class="kp-badge" data-hb-chip></span><figure class="kp-code" data-kp-code></figure>';
                log.append(li);
                await mount(/** @type {HTMLElement} */ (li), /** @type {HTMLElement} */ (li).innerHTML);
            }
            const chip = /** @type {HTMLElement} */ (li.querySelector('[data-hb-chip]'));
            chip.textContent = b.state === 'ok' || b.state === 'failed' ? `exit ${b.code ?? ''}` : b.state;
            chip.className = `kp-badge kp-badge--${b.state === 'ok' ? 'success' : b.state === 'failed' || b.state === 'refused' ? 'destructive' : 'warning'}`;
            setCode(/** @type {HTMLElement} */ (li.querySelector('[data-kp-code]')), { text: `$ ${b.command}\n${b.output || b.error || ''}`, language: 'Shell', maxLines: 8, copy: true });
            newPill(log)?.jump();
        });
    };
    const setMode = async (/** @type {string} */ v) => {
        mode = v;
        pressedM(v);
        read.textContent = v === 'bar' ? 'Bar: commands appear in the log, in time order.' : 'Pane: commands appear in the console under the log.';
        await wire();
    };
    const paint = () => {
        if (state === 'ready') setCardState(logCard, 'ready');
        else setCardState(logCard, /** @type {any} */ (state), { words: 'Reading the log…', title: 'The log is empty', text: 'The host has not logged anything yet.' });
        drawLog();
    };
    logCard.addEventListener(CARD_RETRY_EVENT, () => {
        pressed('ready');
        state = 'ready';
        paint();
    });
    const pressed = stateButtons('data-hb-sm-data', (v) => {
        state = v;
        paint();
    });
    const pressedM = stateButtons('data-hb-sm-mode', (v) => void setMode(v));
    onChoice('sh-console-mode', (v) => void setMode(v));
    drawLog();
    void mount(log, log.innerHTML);
    await wire();
    read.textContent = 'Pane: commands appear in the console under the log.';
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 5. the log, follow and pill
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('sh-log-component')) {
    const { newPill, FOLLOW_EVENT } = await import('../../js/newpill.js');
    const root = $('#sh-log-component');
    const card = $('.kp-card', root);
    const log = $('[data-hb-sl-log]', root);
    const levels = $('[data-hb-sl-levels]', root);
    const read = $('[data-hb-sl-read]', root);
    /** @type {S.Line[]} */
    const all = [...S.LOG];
    let shown = new Set();
    let follow = 'follow';
    let state = 'ready';
    const n = (/** @type {string} */ l) => all.filter((x) => x.level === l).length;

    const chips = () => {
        levels.innerHTML = `<button class="kp-button" type="button" data-kp-toggle data-kp-toggle-all data-kp-look="chip" aria-pressed="${shown.size === 0}" data-kp-count="${all.length}">All</button>
            <button class="kp-button" type="button" data-kp-toggle data-kp-look="chip" data-kp-toggle-value="error" aria-pressed="${shown.has('error')}" data-kp-count="${n('error')}">Error</button>
            <button class="kp-button" type="button" data-kp-toggle data-kp-look="chip" data-kp-toggle-value="warn" aria-pressed="${shown.has('warn')}" data-kp-count="${n('warn')}">Warning</button>
            <button class="kp-button" type="button" data-kp-toggle data-kp-look="chip" data-kp-toggle-value="info" aria-pressed="${shown.has('info')}" data-kp-count="${n('info')}">Info</button>`;
        return mount(levels, levels.innerHTML);
    };
    const filtered = () => all.filter((l) => shown.size === 0 || shown.has(l.level));
    const draw = () => {
        const rows = filtered();
        log.innerHTML = state === 'ready' ? rows.slice(-120).map(row).join('') : '';
        void mount(log, log.innerHTML).then(() => {
            const h = newPill(log);
            if (follow === 'manual') h?.pause();
            else h?.resume();
        });
        read.textContent = state === 'ready' ? `${count(rows.length)} of ${count(all.length)} lines match; the newest ${count(Math.min(120, rows.length))} are drawn.` : '';
    };
    levels.addEventListener('kp-toggle-changed', (e) => {
        shown = new Set(/** @type {CustomEvent} */ (e).detail.pressedKeys ?? []);
        draw();
    });
    log.addEventListener(FOLLOW_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        if (d.unseen > 0) read.textContent = `${count(d.unseen)} new ${d.unseen === 1 ? 'line' : 'lines'} out of sight.`;
    });
    let streaming = false;
    $('[data-hb-sl-stream]', root).addEventListener('click', () => {
        if (streaming || state !== 'ready') return;
        streaming = true;
        for (let k = 1; k <= 12; k++)
            window.setTimeout(() => {
                /** @type {S.Line} */
                const l = { i: all.length + 1, ts: S.LOG[S.LOG.length - 1].ts + k * 8000, source: S.SOURCES[k % S.SOURCES.length], level: k % 5 === 0 ? 'warn' : 'info', text: 'streamed line ' + k + ' of 12' };
                all.push(l);
                if (shown.size === 0 || shown.has(l.level)) log.insertAdjacentHTML('beforeend', row(l));
                if (k === 12) streaming = false;
            }, k * 500);
    });
    card.addEventListener(CARD_RETRY_EVENT, () => {
        pressed('ready');
        state = 'ready';
        setCardState(card, 'ready');
        draw();
    });
    const pressed = stateButtons('data-hb-sl-data', (v) => {
        state = v;
        if (v === 'ready') setCardState(card, 'ready');
        else setCardState(card, /** @type {any} */ (v), { words: 'Reading the log…', title: 'The log is empty', text: 'The host has not logged anything yet.' });
        draw();
    });
    const pressedF = stateButtons('data-hb-sl-follow', (v) => {
        follow = v;
        draw();
    });
    onChoice('sh-log-follow', (v) => {
        pressedF(v);
        follow = v;
        draw();
    });
    await chips();
    draw();
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 6. density
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('sh-density-component')) {
    const { setUptime, UPTIME_PICK_EVENT } = await import('../../js/uptime.js');
    const { setHeat, HEAT_PICK_EVENT, HEAT_ROW_EVENT } = await import('../../js/heat.js');
    const root = $('#sh-density-component');
    const host = $('[data-hb-sd-host]', root);
    const list = $('[data-hb-sd-lines]', root);
    const read = $('[data-hb-sd-read]', root);
    const card = $('.kp-card', root);
    const FIRST = Date.parse('2026-10-19T03:00:00+02:00');
    const BUCKET = 5 * 60000;
    const N = Math.ceil((S.LOG[S.LOG.length - 1].ts - FIRST) / BUCKET);
    /** @type {S.Line[][]} */
    const buckets = Array.from({ length: N }, () => []);
    for (const l of S.LOG) buckets[Math.min(N - 1, Math.floor((l.ts - FIRST) / BUCKET))].push(l);
    const rank = { info: 0, warn: 1, error: 2 };
    const worst = (/** @type {S.Line[]} */ ls) => ls.reduce((a, l) => (rank[l.level] > rank[a] ? l.level : a), /** @type {S.Line['level']} */ ('info'));
    const hhmm = (/** @type {number} */ i) => {
        const t = new Date(FIRST + i * BUCKET);
        return `${pad(t.getHours())}:${pad(t.getMinutes())}`;
    };
    let form = 'strip';
    let state = 'ready';
    /** @type {Set<string>} */
    let sources = new Set();
    let picked = 2; // 03:10, the nightly round

    const showLines = (/** @type {number} */ i) => {
        picked = i;
        const ls = (buckets[i] ?? []).filter((l) => sources.size === 0 || sources.has(l.source));
        list.innerHTML = ls.slice(0, 10).map(row).join('') || '<li class="hb-logrow hb-logrow--none">No lines in these five minutes.</li>';
        void mount(list, list.innerHTML);
        read.textContent = `Jumped to ${hhmm(i)}: ${count(ls.length)} ${ls.length === 1 ? 'line' : 'lines'}${ls.length > 10 ? ', the first 10 listed' : ''}; the worst is ${ls.length ? worst(ls) : 'nothing'}.`;
    };
    const draw = async () => {
        if (form === 'strip') {
            host.innerHTML = '<div class="kp-uptime" data-kp-uptime data-kp-uptime-count="133"></div>';
            await mount(host, host.innerHTML);
            const w = state === 'ready' ? buckets.map((ls, i) => ({ key: String(i), label: `${hhmm(i)}`, state: /** @type {'up' | 'degraded' | 'down' | 'none'} */ (ls.length === 0 ? 'none' : worst(ls) === 'error' ? 'down' : worst(ls) === 'warn' ? 'degraded' : 'up'), tip: `${hhmm(i)}: ${count(ls.length)} lines, worst ${ls.length ? worst(ls) : 'none'}` })) : [];
            setUptime($('[data-kp-uptime]', host), { label: 'Lines per five minutes', periods: w, from: '19/10/2026 03:00', to: '14:05', count: 133, state: /** @type {any} */ (state), error: 'The log could not be read.', open: 'info' });
        } else {
            host.innerHTML = '<div class="kp-heat" data-kp-heat data-kp-heat-toggle></div>';
            await mount(host, host.innerHTML);
            const heat = $('.kp-heat', host);
            setHeat(heat, {
                label: 'Log lines per source per five minutes',
                columns: buckets.map((_, i) => ({ key: String(i), label: i % 12 === 0 ? hhmm(i).slice(0, 2) : '', minor: i % 12 !== 0 })),
                rows: S.SOURCES.map((s) => ({
                    key: s,
                    label: s,
                    pressed: sources.has(s),
                    cells: buckets.map((ls, i) => {
                        const mine = ls.filter((l) => l.source === s);
                        const w = mine.length ? worst(mine) : null;
                        return { tone: /** @type {'ok' | 'warn' | 'bad' | 'none'} */ (w === null ? 'none' : w === 'error' ? 'bad' : w === 'warn' ? 'warn' : 'ok'), label: `${s}, ${hhmm(i)}: ${count(mine.length)} lines`, tip: `${s} · ${hhmm(i)}: ${count(mine.length)} lines${w ? `, worst ${w}` : ''}` };
                    }),
                })),
                toggle: true,
                state: /** @type {any} */ (state),
                message: state === 'error' ? 'The log could not be read.' : 'The host has not logged anything yet.',
                skeleton: { rows: S.SOURCES.length, columns: 40 },
            });
            if (state === 'error') matrixRetry(heat, () => (pressed('ready'), (state = 'ready'), void draw()));
        }
        if (state === 'ready') showLines(picked);
        else read.textContent = '';
    };
    host.addEventListener(UPTIME_PICK_EVENT, (e) => showLines(Number(/** @type {CustomEvent} */ (e).detail.period.key)));
    host.addEventListener(HEAT_PICK_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        if (d.picked) showLines(Number(d.colKey));
    });
    host.addEventListener(HEAT_ROW_EVENT, (e) => {
        sources = new Set(/** @type {CustomEvent} */ (e).detail.keys);
        showLines(picked);
    });
    host.addEventListener('kp-uptime-retry', () => (pressed('ready'), (state = 'ready'), void draw()));
    const pressed = stateButtons('data-hb-sd-data', (v) => {
        state = v;
        void draw();
    });
    const pressedF = stateButtons('data-hb-sd-form', (v) => {
        form = v;
        void draw();
    });
    onChoice('sh-density-form', (v) => {
        pressedF(v);
        form = v;
        void draw();
    });
    void card;
    await draw();
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 7. keys
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('sh-keys-component')) {
    const { registerShortcuts, renderShortcutSheet, listShortcuts } = await import('../../js/shortcuts.js');
    const root = $('#sh-keys-component');
    const read = $('[data-hb-sk-read]', root);
    const log = $('[data-hb-sk-log]', root);
    const dlg = /** @type {HTMLDialogElement} */ ($('[data-hb-sk-dlg]', root));
    let guard = /** @type {'warn' | 'refuse'} */ ('warn');
    setKeys($('[data-hb-sk-caps]', root), [[':', 'jump to the prompt'], [['g', 'l'], 'go to the log'], [['g', 'c'], 'go to the console'], [['Ctrl', 'L'], 'clear the console'], ['?', 'every key']]);
    registerShortcuts('sh-keys-page', [
        { keys: 'g l', what: 'Go to the host log', group: 'Shell', run: () => (read.textContent = 'Went to the log.') },
        { keys: 'g c', what: 'Go to the console', group: 'Shell', run: () => (read.textContent = 'Went to the console: the prompt takes focus.') },
        { keys: 'Mod L', what: 'Clear the console (with undo)', group: 'Shell', run: () => (read.textContent = 'The console was cleared; Undo is offered.') },
    ]);
    /** @type {(() => void)[]} */
    let undo = [];
    $('[data-hb-sk-old]', root).addEventListener('click', () => {
        undo.forEach((u) => u());
        undo = [];
        const said = /** @type {string[]} */ ([]);
        const original = console.error;
        console.error = (...a) => said.push(a.join(' ').replace('[kp-shortcuts] ', ''));
        try {
            undo.push(
                registerShortcuts(
                    'sh-keys-old',
                    [
                        { keys: 'Mod `', what: 'Toggle the console pane (the old key)', group: 'The old shell', run: () => {} },
                        { keys: '[', what: 'Earlier block (the old key)', group: 'The old shell', run: () => {} },
                    ],
                    { layoutGuard: guard, dev: false, onWarn: (m) => said.push(m) },
                ),
            );
        } finally {
            console.error = original;
        }
        const reg = listShortcuts().filter((s) => s.scope === 'sh-keys-old').length;
        log.textContent = `${guard === 'warn' ? 'Warned' : 'Refused'}: ${said.join(' ') || 'nothing said'} (${count(reg)} of 2 old keys registered)`;
    });
    $('[data-hb-sk-sheet]', root).addEventListener('click', () => {
        renderShortcutSheet(dlg);
        dlg.showModal();
    });
    dlg.addEventListener('click', (e) => e.target === dlg && dlg.close());
    const setGuard = (/** @type {string} */ v) => {
        guard = /** @type {any} */ (v);
        root.dataset.hbGuard = v;
        read.textContent = v === 'warn' ? 'Guard: warn. A key that needs AltGr is kept and a sentence says so.' : 'Guard: refuse. A key that needs AltGr is not registered.';
    };
    const pressed = stateButtons('data-hb-sk-guard', setGuard);
    onChoice('sh-guard', (v) => {
        pressed(v);
        setGuard(v);
    });
    read.textContent = 'Press g then l, or Show every shortcut.';
}
