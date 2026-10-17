// research/kpadopt5-rows: the sample data of the page and the buttons of its controls. Everything that is shown is the package's own
// module; this file only fills the lists, answers the demo's buttons and plays the parts a server would play.

/** @param {string} sel @param {ParentNode} [root] @returns {HTMLElement | null} */
const $ = (sel, root = document) => /** @type {HTMLElement | null} */ (root.querySelector(sel));
/** @param {string} sel @param {ParentNode} [root] @returns {HTMLElement[]} */
const $$ = (sel, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(sel)]);

/** Press one button of a group: it is on, its siblings are off. @param {HTMLElement} button */
function pick(button) {
    const group = button.closest('[role="group"]');
    if (!group) return;
    for (const b of group.querySelectorAll('button[aria-pressed]')) b.setAttribute('aria-pressed', String(b === button));
}

/** @param {string} tag @param {string} className @param {string} [text] */
function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

const pad = (/** @type {number} */ n) => String(n).padStart(2, '0');
const clock = (/** @type {Date} */ d) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

// ---------------------------------------------------------------- the log (the pill)

const MESSAGES = [
    'backup finished',
    'health check passed',
    'container restarted',
    'certificate renewed',
    'disk 71 percent full',
    'upstream timeout',
    'queue drained',
    'job scheduled',
];

function wireLogs() {
    const log = $('#k5-log');
    const phone = $('#k5-log-phone');
    const list = $('#k5-messages');
    if (!log) return;
    let level = 'all';
    let n = 0;
    const empty = make('li', 'k5-log__empty', 'Nothing logged yet.');
    empty.setAttribute('data-kp-newpill-skip', '');
    empty.hidden = true;
    log.append(empty);
    /** @param {HTMLElement} target @param {number} count @param {boolean} [filtered] */
    const add = (target, count, filtered = true) => {
        const frag = document.createDocumentFragment();
        for (let i = 0; i < count; i += 1) {
            n += 1;
            const li = make('li', '');
            const err = n % 7 === 0;
            const when = new Date(Date.now() - (count - i) * 1000);
            li.dataset.level = err ? 'error' : 'info';
            li.innerHTML = `<span>${clock(when).slice(0, 8)}</span><span class="k5-log__level" data-level="${err ? 'error' : 'info'}">${err ? 'ERROR' : 'INFO'}</span><span></span>`;
            /** @type {HTMLElement} */ (li.lastElementChild).textContent = err
                ? `${MESSAGES[n % MESSAGES.length]} (line ${n})`
                : `${MESSAGES[n % MESSAGES.length]} (line ${n})`;
            if (filtered && level === 'error' && !err) li.hidden = true;
            frag.append(li);
        }
        empty.hidden = true;
        target.insertBefore(frag, empty);
    };
    add(log, 40);
    if (phone) {
        const empty2 = make('li', 'k5-log__empty', 'Nothing logged yet.');
        empty2.hidden = true;
        phone.append(empty2);
        for (let i = 0; i < 14; i += 1) {
            n += 1;
            const li = make('li', '');
            li.innerHTML = `<span>${clock(new Date()).slice(0, 8)}</span><span class="k5-log__level" data-level="info">INFO</span><span>${MESSAGES[n % MESSAGES.length]}</span>`;
            phone.insertBefore(li, empty2);
        }
    }
    if (list) {
        for (const [who, what] of [
            ['Anna', 'The backup is done.'],
            ['Bram', 'Disk 71 percent full on ct-106.'],
            ['Carla', 'Certificate renewed.'],
            ['Dirk', 'Queue drained.'],
            ['Eva', 'Health check passed.'],
            ['Floor', 'Upstream timeout on the mirror.'],
        ]) {
            const li = make('li', '');
            li.innerHTML = `<b></b><span></span>`;
            /** @type {HTMLElement} */ (li.firstElementChild).textContent = who;
            /** @type {HTMLElement} */ (li.lastElementChild).textContent = what;
            list.append(li);
        }
    }
    const readout = $('[data-k5-follow-readout]');
    log.addEventListener('kp-follow-change', (event) => {
        const d = /** @type {CustomEvent<{ following: boolean, paused: boolean, unseen: number }>} */ (event).detail;
        if (readout)
            readout.textContent = d.following
                ? 'Following the latest line.'
                : d.paused
                  ? `Paused. ${d.unseen} new lines out of sight.`
                  : `Not following: ${d.unseen} new lines out of sight.`;
    });
    let timer = 0;
    document.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target : null;
        const addBtn = target?.closest('[data-k5-add]');
        if (addBtn) add(log, Number(addBtn.getAttribute('data-k5-add')));
        if (target?.closest('[data-k5-add-phone]') && phone) {
            for (let i = 0; i < 5; i += 1) {
                n += 1;
                const li = make('li', '');
                li.innerHTML = `<span>${clock(new Date()).slice(0, 8)}</span><span class="k5-log__level" data-level="info">INFO</span><span>${MESSAGES[n % MESSAGES.length]}</span>`;
                phone.insertBefore(li, phone.lastElementChild);
            }
        }
        if (target?.closest('[data-k5-message]') && list) {
            const li = make('li', '');
            li.innerHTML = `<b></b><span></span>`;
            /** @type {HTMLElement} */ (li.firstElementChild).textContent = ['Anna', 'Bram', 'Carla'][list.children.length % 3];
            /** @type {HTMLElement} */ (li.lastElementChild).textContent = `A new message at ${clock(new Date())}.`;
            list.prepend(li);
        }
        if (target?.closest('[data-k5-clear]')) {
            for (const li of $$('li:not(.k5-log__empty)', log)) li.remove();
            empty.hidden = false;
        }
        const lv = target?.closest('[data-k5-level]');
        if (lv) {
            pick(/** @type {HTMLElement} */ (lv));
            level = lv.getAttribute('data-k5-level') ?? 'all';
            for (const li of $$('li[data-level]', log)) li.hidden = level === 'error' && li.dataset.level !== 'error';
        }
        const since = target?.closest('[data-k5-since]');
        if (since) {
            pick(/** @type {HTMLElement} */ (since));
            log.setAttribute('data-kp-since-left', since.getAttribute('data-k5-since') === 'on' ? 'on' : 'off');
        }
        const run = target?.closest('[data-k5-run]');
        if (run) {
            const on = run.getAttribute('aria-pressed') !== 'true';
            run.setAttribute('aria-pressed', String(on));
            clearInterval(timer);
            if (on) {
                const stop = Date.now() + 10000;
                timer = window.setInterval(() => {
                    add(log, 1);
                    if (Date.now() > stop) {
                        clearInterval(timer);
                        run.setAttribute('aria-pressed', 'false');
                    }
                }, 700);
            }
        }
    });
}

// ---------------------------------------------------------------- the JSON box

const SAMPLES = {
    valid: '{\n  "topic": "backup.done",\n  "ok": true,\n  "stacks": 12\n}',
    broken: '{\n  "topic": "backup.done"\n  "ok": true,\n  "stacks": 12\n}',
    long: JSON.stringify(
        Array.from({ length: 8 }, (_, i) => ({
            id: 3001 + i,
            name: ['media', 'vault', 'backup', 'monitoring', 'dns', 'mail', 'wiki', 'ci'][i],
            running: i % 3 !== 0,
        })),
        null,
        2,
    ),
    empty: '',
    text: 'hello, this is plain text',
};

function wireJson() {
    const area = /** @type {HTMLTextAreaElement | null} */ ($('#k5-json-a'));
    const free = /** @type {HTMLTextAreaElement | null} */ ($('#k5-json-b'));
    const phone = /** @type {HTMLTextAreaElement | null} */ ($('#k5-json-p'));
    const form = $('[data-k5-json-form]');
    const sent = $('[data-k5-sent]');
    if (!area || !free || !phone || !form || !sent) return;
    const send = /** @type {HTMLButtonElement} */ ($('[data-k5-send]'));
    const set = (/** @type {HTMLTextAreaElement} */ el, /** @type {string} */ text) => {
        el.value = text;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('blur'));
    };
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const bad = [...form.querySelectorAll('textarea')].find((t) => !t.checkValidity());
        sent.hidden = false;
        if (bad) {
            bad.focus();
            sent.textContent = 'Not sent: fix the JSON first.';
            return;
        }
        const bytes = new TextEncoder().encode(area.value + free.value).length;
        sent.textContent = `Sent ${bytes} bytes.`;
    });
    document.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target : null;
        const sample = target?.closest('[data-k5-sample]');
        if (sample) {
            pick(/** @type {HTMLElement} */ (sample));
            set(area, SAMPLES[/** @type {keyof typeof SAMPLES} */ (sample.getAttribute('data-k5-sample') ?? 'empty')]);
            set(free, sample.getAttribute('data-k5-sample') === 'text' ? 'plain text is fine here' : SAMPLES.valid);
            // The 390 px box takes the same sample, so Long can be scrolled there too.
            set(phone, SAMPLES[/** @type {keyof typeof SAMPLES} */ (sample.getAttribute('data-k5-sample') ?? 'empty')]);
        }
        const check = target?.closest('[data-k5-check]');
        if (check) {
            pick(/** @type {HTMLElement} */ (check));
            for (const t of [area, free, phone]) t.setAttribute('data-kp-json-check', check.getAttribute('data-k5-check') ?? 'input');
        }
        const format = target?.closest('[data-k5-format]');
        if (format) {
            pick(/** @type {HTMLElement} */ (format));
            for (const t of [area, free, phone]) t.setAttribute('data-kp-json-format', format.getAttribute('data-k5-format') ?? 'button');
        }
        const field = target?.closest('[data-k5-field]');
        if (field) {
            pick(/** @type {HTMLElement} */ (field));
            const kind = field.getAttribute('data-k5-field');
            for (const t of [area, free]) {
                t.readOnly = kind === 'sending';
                t.disabled = kind === 'disabled';
            }
            send.disabled = kind !== 'normal';
            send.textContent = kind === 'sending' ? 'Sending…' : 'Send';
        }
    });
}

wireLogs();
wireJson();
