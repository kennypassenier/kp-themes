// research/kpadopt6-social: the sample data of the page and the buttons of its controls. Everything that is shown is the package's own
// module; this file only fills the components, answers the demo's buttons and plays the parts a server would play.
import { getChecklistItems, setChecklistItems, setChecklistState } from '../../../../js/checklist.js';
import { setClaim, setClaimPeople, setClaimViewer } from '../../../../js/claim.js';
import { setQr } from '../../../../js/qr.js';
import { setTime, setTimePresets } from '../../../../js/timefield.js';
import { clearConsole, runConsoleCommand, setConsole, setConsoleComplete, setConsoleContext, setConsoleRun } from '../../../../js/console.js';
import { availabilityAnswers, availabilityDays, availabilityRange, setAvailability, setAvailabilityAnswer } from '../../../../js/availability.js';

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

/** Run once the package's own boot (js/auto.js) has attached everything the page carries. @param {() => void} run */
function onReady(run) {
    const root = document.documentElement;
    if (root.hasAttribute('data-kp-auto-ready')) return run();
    new MutationObserver((_, obs) => {
        if (!root.hasAttribute('data-kp-auto-ready')) return;
        obs.disconnect();
        run();
    }).observe(root, { attributes: true });
}

/** @param {number} ms */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------- claim-row (a packing list)

const KENNY = { id: 'kenny', name: 'Kenny' };
const TOM = { id: 'tom', name: 'Tom' };
const ANNA = { id: 'anna', name: 'Anna' };
const BO = { id: 'bo', name: 'Bo Vandenbroucke-Lemmens' };
const PEOPLE = [KENNY, TOM, ANNA, BO];

/** @returns {import('../../../../js/checklist.js').ChecklistItem[]} */
const packing = () => [
    { id: 'stove', label: 'Gas stove', detail: '1', group: 'Kitchen', claim: { by: [] } },
    { id: 'pots', label: 'Two pots and a frying pan', detail: '3', group: 'Kitchen', claim: { by: [ANNA, TOM] } },
    {
        id: 'coffee',
        label: 'Coffee, filters and the little dripper for the mornings in the tent',
        detail: '1 kg',
        group: 'Kitchen',
        claim: { by: [BO] },
    },
    { id: 'water', label: 'Water cans', detail: '2 x 10 l', group: 'Kitchen', claim: { by: [] } },
    { id: 'tent', label: 'Tent', detail: '1', group: 'Sleeping', claim: { by: [] } },
    { id: 'mats', label: 'Sleeping mats', detail: '4', group: 'Sleeping', claim: { by: [KENNY] } },
    { id: 'lamp', label: 'Lantern', detail: '1', group: 'Sleeping', claim: { by: [TOM] } },
    { id: 'van', label: 'Roof box on the van', detail: '1', group: 'Sleeping', claim: { by: [TOM], locked: 'Already on the van' } },
    { id: 'aid', label: 'First-aid kit', detail: '1', group: 'Safety', claim: { by: [] } },
    { id: 'map', label: 'Paper maps of the Ardennes', detail: '2', group: 'Safety', claim: { by: [ANNA] } },
    { id: 'fire', label: 'Fire extinguisher', detail: '1', group: 'Safety', claim: { by: [] } },
];

const chores = () => [
    { id: 'cook', label: 'Cook on Friday', group: 'Chores', claim: { by: [ANNA] } },
    { id: 'dishes', label: 'Do the dishes', group: 'Chores', claim: { by: [] } },
    { id: 'fire', label: 'Keep the fire going', group: 'Chores', claim: { by: [TOM, BO] } },
    { id: 'drive', label: 'Drive home on Sunday', group: 'Chores', claim: { by: [] } },
];

const lists = {
    main: $('#ks-claim'),
    opt: $('#ks-claim-opt'),
    phone: $('#ks-claim-phone'),
    quiet: $('#ks-claim-quiet'),
    top: $('#ks-claim-top'),
    assign: $('#ks-claim-assign'),
};
/** What every list holds, so a push and a state button reach them all. */
const everyList = () => Object.values(lists).filter(Boolean);
const readout = $('[data-ks-claim-readout]');
let closed = false;

/** The pretend server: answers after a short wait; the Tent was taken first by Tom; the closed trip refuses everything. */
function server(/** @type {CustomEvent} */ event) {
    const d = event.detail;
    if (typeof d.settle !== 'function') return;
    if (readout)
        readout.textContent = `${d.action} ${d.id || 'all open items'}: ${d.by.map((/** @type {{name: string}} */ p) => p.name).join(', ') || 'nobody'}`;
    d.settle(
        (async () => {
            await wait(700);
            if (closed) return { refused: true, error: 'The trip is closed; nothing can change.' };
            if (d.action === 'join' && d.id === 'tent') return { refused: true, by: [TOM] };
            return true;
        })(),
    );
}
for (const list of everyList()) list.addEventListener('kp-claim-change', /** @type {EventListener} */ (server));
$('#ks-claim')?.addEventListener('kp-claim-retry', () => {
    const list = $('#ks-claim');
    if (!list) return;
    setChecklistState(list, 'loading');
    setTimeout(() => {
        setChecklistItems(list, packing());
        setChecklistState(list, 'ready');
        pickState('ready');
    }, 1200);
});

/** @param {string} value */
function pickState(value) {
    const b = $(`[data-ks-claim-state="${value}"]`);
    if (b) pick(b);
}

onReady(() => {
    for (const list of everyList()) {
        setClaimPeople(list, PEOPLE);
        setChecklistItems(list, list === lists.assign ? chores() : packing());
    }
    if (lists.quiet)
        setChecklistItems(
            lists.quiet,
            packing().filter((i) => i.group === 'Kitchen'),
        );
    if (lists.top)
        setChecklistItems(
            lists.top,
            packing().filter((i) => i.group === 'Sleeping'),
        );
    // The phone list shows the whole packing list; the three small ones show a group each.
    for (const button of $$('[data-ks-claim-state]')) {
        button.addEventListener('click', () => {
            pick(button);
            const state = button.getAttribute('data-ks-claim-state') ?? 'ready';
            for (const list of [lists.main, lists.phone]) {
                if (!list) continue;
                if (state === 'empty') {
                    setChecklistItems(list, []);
                    setChecklistState(list, 'ready');
                } else if (state === 'ready') {
                    setChecklistItems(list, packing());
                    setChecklistState(list, 'ready');
                } else if (state === 'error') setChecklistState(list, 'error', 'The packing list could not be read.');
                else setChecklistState(list, 'loading');
            }
        });
    }
    for (const button of $$('[data-ks-claim-viewer]')) {
        button.addEventListener('click', () => {
            pick(button);
            const who = button.getAttribute('data-ks-claim-viewer');
            closed = who === 'locked';
            for (const list of everyList()) {
                setClaimViewer(list, who === 'kenny' || who === 'locked' ? KENNY : null);
                if (who === 'locked') {
                    list.setAttribute('data-kp-claim-disabled', '');
                    list.setAttribute('data-kp-claim-disabled-reason', 'The trip is closed; nothing can change.');
                } else list.removeAttribute('data-kp-claim-disabled');
            }
        });
    }
    $('[data-ks-claim-push]')?.addEventListener('click', () => {
        for (const list of everyList()) {
            const first = getChecklistItems(list).find((i) => !i.claim?.by?.length && !i.claim?.locked);
            if (first) setClaim(list, first.id, { by: [ANNA] });
        }
        if (readout) readout.textContent = 'Anna took the first free item (a push update, no event).';
    });
});

// ---------------------------------------------------------------- availability-grid (who can come)

const AV_PEOPLE = [
    { id: 'kenny', name: 'Kenny', mine: true },
    { id: 'tom', name: 'Tom' },
    { id: 'anna', name: 'Anna' },
    { id: 'bo', name: 'Bo Vandenbroucke-Lemmens' },
    { id: 'lies', name: 'Lies' },
];
const RANGES = [
    availabilityRange('2026-11-06', '2026-11-08'),
    availabilityRange('2026-11-13', '2026-11-15'),
    availabilityRange('2026-11-20', '2026-11-22'),
    availabilityRange('2026-11-27', '2026-12-01'),
];
const DAYS = availabilityDays('2026-11-06', 9);

/** @returns {import('../../../../js/availability.js').AvailabilitySpec} */
const avSpec = (/** @type {{ state?: any, nobody?: boolean, people?: any, unit?: 'day'|'range', switchable?: boolean }} */ opts = {}) => {
    const r = RANGES.map((c) => c.key);
    const days = DAYS.map((c) => c.key);
    const ranges = opts.nobody
        ? {}
        : {
              // Built so every switch shows: most -> r0, everyone -> r1, fewest-no rule -> r1, quorum 3 -> r2, quorum 1 -> r3.
              kenny: { [r[0]]: 'yes', [r[1]]: 'maybe', [r[2]]: 'yes' },
              tom: { [r[0]]: 'yes', [r[1]]: 'maybe', [r[2]]: 'yes' },
              anna: { [r[0]]: 'no', [r[1]]: 'yes', [r[2]]: 'no' },
              bo: { [r[0]]: 'no', [r[1]]: 'maybe', [r[3]]: 'yes' },
              lies: { [r[0]]: 'maybe', [r[1]]: 'maybe', [r[3]]: 'yes' },
          };
    const dayAnswers = opts.nobody
        ? {}
        : {
              kenny: { [days[0]]: 'yes', [days[1]]: 'yes', [days[2]]: 'yes', [days[7]]: 'maybe' },
              tom: { [days[0]]: 'no', [days[1]]: 'yes', [days[2]]: 'yes', [days[7]]: 'yes', [days[8]]: 'yes' },
              anna: { [days[0]]: 'yes', [days[1]]: 'yes', [days[2]]: 'yes', [days[7]]: 'yes' },
              bo: { [days[1]]: 'yes', [days[2]]: 'yes', [days[7]]: 'maybe' },
              lies: { [days[1]]: 'yes', [days[2]]: 'maybe', [days[7]]: 'yes' },
          };
    return {
        unit: opts.unit ?? 'range',
        people: opts.people ?? AV_PEOPLE,
        canSwitchUnit: opts.switchable ?? false,
        sets: { range: { columns: RANGES, answers: ranges }, day: { columns: DAYS, answers: dayAnswers } },
        state: opts.state ?? 'ready',
    };
};

// Every availability grid on the page is wired the same way; the one marked `data-ks-av-main` is the organiser's (it can switch
// between periods and days). The state, server and push buttons act on the grids of their own section, and a grid's readout is
// the one in its own section, so a section that is not on the page (a part holds only the sections it asks) is simply skipped.
const avGrids = $$('[data-kp-availability]');
/** @param {HTMLElement} el */
const avIsMain = (el) => el.hasAttribute('data-ks-av-main');
/** @param {HTMLElement} el the readout of the section the element stands in */
const avReadoutOf = (el) => $('[data-ks-av-readout]', el.closest('section') ?? document);
/** @param {HTMLElement} button the grids of the section a button stands in */
const avGridsOf = (button) => $$('[data-kp-availability]', button.closest('section') ?? document);
let avRefuse = false;
let avChosen = false;
for (const el of avGrids) {
    el.addEventListener('kp-availability-change', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        if (d.restored) return;
        const readout = avReadoutOf(el);
        if (readout) readout.textContent = `${d.person} set ${d.keys.length} cell${d.keys.length === 1 ? '' : 's'} to ${d.answer ?? 'empty'}`;
        d.settle(wait(650).then(() => (avRefuse ? { refused: true } : true)));
    });
    el.addEventListener('kp-availability-choose', (event) => {
        const readout = avReadoutOf(el);
        if (readout) readout.textContent = `Choose: ${/** @type {CustomEvent} */ (event).detail.keys.join(', ')}`;
    });
    el.addEventListener('kp-availability-retry', () => {
        setAvailability(el, avSpec({ state: 'loading', switchable: avIsMain(el) }));
        setTimeout(() => {
            setAvailability(el, avSpec({ switchable: avIsMain(el) }));
            const b = $('[data-ks-av-state="ready"]', el.closest('section') ?? document);
            if (b) pick(b);
        }, 1200);
    });
}

onReady(() => {
    for (const el of avGrids) setAvailability(el, avSpec({ switchable: avIsMain(el) }));
    for (const button of $$('[data-ks-av-state]')) {
        button.addEventListener('click', () => {
            pick(button);
            const state = button.getAttribute('data-ks-av-state') ?? 'ready';
            avChosen = state === 'chosen';
            for (const el of avGridsOf(button)) {
                el.toggleAttribute('data-kp-availability-disabled', avChosen);
                if (avChosen) el.setAttribute('data-kp-disabled-reason', 'The dates are chosen.');
                else el.removeAttribute('data-kp-disabled-reason');
                const sw = avIsMain(el);
                if (state === 'loading') setAvailability(el, avSpec({ state: 'loading', switchable: sw }));
                else if (state === 'empty')
                    setAvailability(el, {
                        ...avSpec({ switchable: sw }),
                        sets: { range: { columns: [], answers: {} }, day: { columns: [], answers: {} } },
                        emptyAction: 'Propose a date',
                    });
                else if (state === 'error') setAvailability(el, avSpec({ state: 'error', switchable: sw }));
                else if (state === 'nobody') setAvailability(el, avSpec({ nobody: true, switchable: sw }));
                else setAvailability(el, avSpec({ switchable: sw }));
            }
        });
    }
    for (const button of $$('[data-ks-av-server]')) {
        button.addEventListener('click', () => {
            pick(button);
            avRefuse = button.getAttribute('data-ks-av-server') === 'refuses';
        });
    }
    for (const push of $$('[data-ks-av-push]')) {
        push.addEventListener('click', () => {
            for (const el of avGridsOf(push)) for (const c of RANGES) if (!availabilityAnswers(el).lies?.[c.key]) setAvailabilityAnswer(el, 'lies', c.key, 'yes');
            const readout = avReadoutOf(push);
            if (readout) readout.textContent = 'Lies answered the empty cells (a push update, no event).';
        });
    }
});

// ---------------------------------------------------------------- qr-code (a link as a code)

const LINK = 'https://kp-soft.dev/invite/7Hq2-nT9a';
const qrMain = $('#ks-qr');
const qrReadout = $('[data-ks-qr-readout]');
for (const code of $$('[data-kp-qr]')) {
    code.addEventListener('kp-qr-copy', () => {
        if (qrReadout) qrReadout.textContent = 'Copied the link.';
    });
}
qrMain?.addEventListener('kp-qr-retry', () => {
    setQr(qrMain, { state: 'loading' });
    setTimeout(() => {
        setQr(qrMain, { value: LINK, state: 'ready' });
        const b = $('[data-ks-qr-state="ready"]');
        if (b) pick(b);
    }, 1200);
});
onReady(() => {
    for (const button of $$('[data-ks-qr-state]')) {
        button.addEventListener('click', () => {
            pick(button);
            const state = button.getAttribute('data-ks-qr-state') ?? 'ready';
            for (const code of [qrMain, $('#ks-qr-phone')]) {
                if (!code) continue;
                code.removeAttribute('data-kp-qr-expires');
                code.removeAttribute('data-kp-qr-reveal');
                if (state === 'loading') setQr(code, { state: 'loading' });
                else if (state === 'empty') setQr(code, { value: '', state: 'empty' });
                else if (state === 'long') setQr(code, { value: `https://kp-soft.dev/export?data=${'abcdefghij'.repeat(260)}`, state: 'ready' });
                else if (state === 'dense') setQr(code, { value: `https://kp-soft.dev/export?data=${'abcdefghij'.repeat(54)}`, state: 'ready' });
                else if (state === 'expired') {
                    code.setAttribute('data-kp-qr-expires', '2026-10-01T00:00:00+02:00');
                    setQr(code, { value: LINK, state: 'ready' });
                } else if (state === 'hidden') {
                    code.setAttribute('data-kp-qr-reveal', 'click');
                    setQr(code, { value: LINK, state: 'ready' });
                } else setQr(code, { value: LINK, state: 'ready' });
            }
        });
    }
});

// ---------------------------------------------------------------- time-field

for (const field of $$('[data-kp-time]')) {
    field.addEventListener('kp-time-change', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        // Each time-field section has its own readout.
        const timeReadout = $('[data-ks-time-readout]', field.closest('section') ?? document);
        if (timeReadout) timeReadout.textContent = `Value: ${d.value || '(empty)'}${d.converted ? ' (read from 12 hours)' : ''}`;
    });
}
const timeMain = $('#ks-time');
timeMain?.addEventListener('kp-time-retry', () => {
    setTimePresets(timeMain, 'loading');
    setTimeout(() => {
        setTimePresets(timeMain, [
            { label: 'Night', value: '03:00' },
            { label: 'Morning', value: '08:00' },
        ]);
        const b = $('[data-ks-time-presets="ready"]');
        if (b) pick(b);
    }, 1200);
});
onReady(() => {
    for (const button of $$('[data-ks-time-state]')) {
        button.addEventListener('click', () => {
            pick(button);
            const state = button.getAttribute('data-ks-time-state') ?? 'ready';
            for (const field of [timeMain, $('#ks-time-phone')]) {
                if (!field) continue;
                field.removeAttribute('data-kp-state');
                field.removeAttribute('disabled');
                field.removeAttribute('data-kp-disabled-reason');
                const input = /** @type {HTMLInputElement | null} */ (field.querySelector('.kp-time__input'));
                if (state === 'ready') setTime(field, '03:00');
                else if (state === 'empty') setTime(field, '');
                else if (state === 'invalid' && input) {
                    input.focus();
                    input.value = '24:00';
                    input.blur();
                } else if (state === 'loading') field.setAttribute('data-kp-state', 'loading');
                else if (state === 'disabled') {
                    field.setAttribute('disabled', '');
                    field.setAttribute('data-kp-disabled-reason', 'The schedule is paused, so its time cannot change.');
                }
            }
        });
    }
    for (const button of $$('[data-ks-time-presets]')) {
        button.addEventListener('click', () => {
            pick(button);
            const state = button.getAttribute('data-ks-time-presets') ?? 'ready';
            if (!timeMain) return;
            if (state === 'ready')
                setTimePresets(timeMain, [
                    { label: 'Night', value: '03:00' },
                    { label: 'Morning', value: '08:00' },
                    { label: 'Evening', value: '19:30' },
                ]);
            else setTimePresets(timeMain, /** @type {'loading' | 'error'} */ (state));
            /** @type {HTMLElement | null} */ (timeMain.querySelector('.kp-time__toggle'))?.click();
        });
    }
    $('[data-ks-time-open]')?.addEventListener('click', () => {
        /** @type {HTMLElement | null} */ (timeMain?.querySelector('.kp-time__toggle'))?.click();
    });
});

// ---------------------------------------------------------------- interactive-console

const conMain = $('#ks-console');
const conReadout = $('[data-ks-con-readout]');
const CONTAINERS = [
    { value: '', label: 'Host (root)' },
    { value: 'nextcloud', label: 'nextcloud' },
    { value: 'jellyfin', label: 'jellyfin' },
];
const LINES = Array.from(
    { length: 40 },
    (_, i) => `-rw-r--r-- 1 root root ${String(1200 + i * 37).padStart(6)} Oct 17 14:0${i % 10} file-${String(i + 1).padStart(2, '0')}.conf`,
);

/** The pretend host: what each sample command does. @type {import('../../../../js/console.js').ConsoleRun} */
function host(command, context) {
    return {
        /** @param {(change: import('../../../../js/console.js').ConsoleChange) => void} handler */
        update(handler) {
            const where = context ? ` in ${context}` : '';
            if (conReadout) conReadout.textContent = `Ran: ${command}${where}`;
            const at = (/** @type {number} */ ms, /** @type {() => void} */ f) => setTimeout(f, ms);
            if (command.startsWith('rm -rf'))
                at(600, () =>
                    handler({
                        state: 'refused',
                        error: 'Removing the root is not allowed on this host.',
                        remedy: 'Run it on a copy of the container instead.',
                    }),
                );
            else if (command.startsWith('mount'))
                at(500, () =>
                    handler({
                        state: 'refused',
                        error: 'Only read-only commands are allowed here.',
                        remedy: 'Ask for write access on the Settings page, then run it again.',
                    }),
                );
            else if (command === 'flaky-job') {
                at(300, () => handler({ state: 'running' }));
                at(2200, () => handler({ state: 'lost' }));
            } else if (command === 'false') at(600, () => handler({ state: 'failed', code: 1 }));
            else if (command === 'true') at(500, () => handler({ state: 'ok', code: 0 }));
            else if (command.startsWith('ls')) at(700, () => handler({ state: 'ok', code: 0, output: LINES.join('\n') }));
            else if (command === 'dump-logs')
                at(700, () => handler({ state: 'ok', code: 0, output: 'line of the log that is quite long\n'.repeat(260) }));
            else if (command.startsWith('ping')) {
                handler({ state: 'running' });
                for (let i = 1; i <= 8; i += 1)
                    at(i * 500, () => handler({ append: `64 bytes from nextcloud: icmp_seq=${i} ttl=64 time=0.${40 + i} ms\n` }));
                at(4400, () => handler({ state: 'ok', code: 0 }));
            } else if (command === 'uptime')
                at(1100, () => handler({ state: 'ok', code: 0, output: ' 14:05:12 up 41 days,  3:12,  1 user,  load average: 0.12, 0.09, 0.05' }));
            else at(800, () => handler({ state: 'failed', code: 127, output: `sh: ${command.split(' ')[0]}: command not found` }));
        },
        cancel() {
            if (conReadout) conReadout.textContent = `Cancelled: ${command}`;
        },
    };
}

onReady(() => {
    for (const id of ['ks-console', 'ks-console-phone', 'ks-console-first', 'ks-console-word', 'ks-console-opt']) {
        const c = $(`#${id}`);
        if (!c) continue;
        setConsoleRun(c, host);
        if (id === 'ks-console' || id === 'ks-console-phone' || id === 'ks-console-opt') setConsoleContext(c, { options: CONTAINERS, value: '', label: 'Container' });
    }
    if (conMain)
        setConsoleComplete(conMain, (prefix) =>
            ['uptime', 'ls -la /etc', 'ping -c 8 nextcloud', 'df -h', 'dump-logs'].filter((c) => c.startsWith(prefix.trim())),
        );
    // The options console starts with two finished commands, so the order, the result, Cancel and the timer have something to act on.
    const seeded = $('#ks-console-opt');
    if (seeded) {
        void runConsoleCommand(seeded, 'true');
        setTimeout(() => void runConsoleCommand(seeded, 'false'), 150);
    }
    // The bar-only console hands its blocks to the page's own list.
    const bar = $('#ks-console-bar');
    const barList = $('[data-ks-barlist]');
    if (bar && barList) {
        setConsoleRun(bar, host);
        bar.addEventListener('kp-console-block', (event) => {
            const b = /** @type {CustomEvent} */ (event).detail.block;
            let row = barList.querySelector(`[data-id="${b.id}"]`);
            if (!row) {
                row = document.createElement('li');
                row.setAttribute('data-id', b.id);
                barList.prepend(row);
            }
            row.textContent = `${b.command}: ${b.state}${b.code !== undefined ? ` (exit ${b.code})` : ''}`;
        });
    }
    for (const button of $$('[data-ks-con-run]')) {
        button.addEventListener('click', () => {
            if (conMain) void runConsoleCommand(conMain, button.getAttribute('data-ks-con-run') ?? '');
        });
    }
    conMain?.addEventListener('kp-console-retry', () => {
        setConsole(conMain, { state: 'loading' });
        setTimeout(() => {
            setConsole(conMain, { state: 'ready' });
            const b = $('[data-ks-con-state="ready"]');
            if (b) pick(b);
        }, 1200);
    });
    for (const button of $$('[data-ks-con-state]')) {
        button.addEventListener('click', () => {
            pick(button);
            const state = button.getAttribute('data-ks-con-state') ?? 'ready';
            for (const c of [conMain, $('#ks-console-phone')]) {
                if (!c) continue;
                c.removeAttribute('disabled');
                c.removeAttribute('data-kp-disabled-reason');
                setConsoleContext(c, { state: 'ready' });
                if (state === 'ready') setConsole(c, { state: 'ready' });
                else if (state === 'empty') {
                    setConsole(c, { state: 'ready' });
                    clearConsole(c, { undo: false });
                } else if (state === 'loading') setConsole(c, { state: 'loading' });
                else if (state === 'error') setConsole(c, { state: 'error' });
                else if (state === 'off') {
                    setConsole(c, { state: 'ready' });
                    c.setAttribute('disabled', '');
                    c.setAttribute('data-kp-disabled-reason', 'Remote exec is off on this host. Turn it on in Settings.');
                } else if (state === 'context') {
                    setConsole(c, { state: 'ready' });
                    setConsoleContext(c, { state: 'loading' });
                }
            }
        });
    }
});

// ---------------------------------------------------------------- live options: a button writes one attribute on its target

for (const button of $$('[data-ks-attr]')) {
    button.addEventListener('click', () => {
        const [selector, name, value] = (button.getAttribute('data-ks-attr') ?? '').split('|');
        pick(button);
        for (const target of $$(selector)) {
            if (value === '-') target.removeAttribute(name);
            else target.setAttribute(name, value);
        }
    });
}

// ---------------------------------------------------------------- the review dialog's default sets
// A choice set only asks for the default (defaults-1017); every other option is a real option of the component, so
// pressing one in the dialog presses the demo's own button that writes that option's attribute.

/** choice id → the attribute selector prefix of the demo's button for its values. */
const REVIEW_OPTIONS = /** @type {Record<string, string>} */ ({
    press: '#ks-av|data-kp-availability-press|',
    best: '#ks-av|data-kp-availability-best|',
    summary: '#ks-av|data-kp-availability-summary|',
    unit: '#ks-av|data-kp-availability-unit-switch|',
    order: '#ks-console-opt|data-kp-console-order|',
    status: '#ks-console-opt|data-kp-console-status|',
    cancel: '#ks-console-opt|data-kp-console-cancel|',
});
document.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent} */ (event).detail;
    const prefix = REVIEW_OPTIONS[id];
    if (!prefix) return;
    // The console's Cancel is on when the attribute is absent ("" on the Offered button) and off with "-".
    const written = id === 'cancel' ? (value === 'on' ? '' : '-') : id === 'unit' ? (value === 'switch' ? 'on' : 'off') : value;
    const button = [...$$('[data-ks-attr]')].find((b) => b.getAttribute('data-ks-attr') === `${prefix}${written}`);
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
});
