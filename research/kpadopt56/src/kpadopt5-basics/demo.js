// research/kpadopt5-basics: the page's own wiring (mock data; every part is the package's).
import { setCalm, isCalm } from '../../../../js/calm.js';
import { registerShortcuts } from '../../../../js/shortcuts.js';
import { setCardState } from '../../../../js/card-state.js';
import { setProblems } from '../../../../js/problems.js';
import { runFlashButton, FLASH_EVENT } from '../../../../js/flash.js';
import { tickTo } from '../../../../js/tick.js';
import { toast } from '../../../../js/overlays.js';

/** @param {string} id @returns {HTMLElement} */
const byId = (id) => /** @type {HTMLElement} */ (document.getElementById(id));
const stamp = () => new Date().toLocaleTimeString('en-GB', { hour12: false });
/** @param {HTMLElement} log @param {string} line */
const say = (log, line) => {
    const lines = (log.textContent ?? '').split('\n').filter(Boolean);
    lines.push(`${stamp()}  ${line}`);
    log.textContent = lines.slice(-5).join('\n');
};
const wait = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ------------------------------------------------------------------ calm mode */
if (document.getElementById('kb-calm-readout')) {
    const readout = byId('kb-calm-readout');
    const scopeGroup = byId('kb-calm-scope');
    const show = () => {
        const root = document.documentElement;
        readout.textContent = isCalm()
            ? `html[data-kp-calm] is on, scope "${root.getAttribute('data-kp-calm-scope') ?? 'effects'}"`
            : 'html[data-kp-calm] is off';
    };
    document.documentElement.addEventListener('kp-calm-change', show);
    show();
    scopeGroup.addEventListener('kp-segmented-change', (event) => {
        const value = /** @type {CustomEvent} */ (event).detail.value;
        setCalm(isCalm(), { scope: value, remember: false, announce: false });
        show();
    });
    byId('kb-calm-toast').addEventListener('click', () => toast('Saved. This toast arrives the theme’s way.', { ms: 3500 }));
    const count = byId('kb-calm-count');
    let high = false;
    byId('kb-calm-tick').addEventListener('click', () => {
        high = !high;
        tickTo(count, high ? '1.290' : '1.204');
    });
    // The loading card of the sample plays from the first frame; this only keeps it loading.
    setCardState(byId('kb-calm-card'), 'loading', { words: 'Reading the schedules…' });
}

/* ------------------------------------------------------------ shortcut engine */
if (document.getElementById('kb-keys-log')) {
    const log = byId('kb-keys-log');
    const list = byId('kb-keys-list');
    const rows = [...list.querySelectorAll('li')];
    let at = 0;
    const select = (/** @type {number} */ next) => {
        at = Math.max(0, Math.min(rows.length - 1, next));
        rows[at].focus();
    };
    const ticked = () => rows.filter((row) => row.getAttribute('aria-selected') === 'true');
    registerShortcuts('page', [
        { keys: 'g i', what: 'Go to the Inbox', group: 'Anywhere', run: () => say(log, 'g i · went to the Inbox') },
        { keys: 'g h', what: 'Go to Home', group: 'Anywhere', run: () => say(log, 'g h · went to Home') },
        { keys: 'g c', what: 'Go to the Console', group: 'Anywhere', run: () => say(log, 'g c · went to the Console') },
    ]);
    registerShortcuts(list, [
        { keys: 'j', what: 'Next row', group: 'In the list', run: () => select(at + 1) },
        { keys: 'k', what: 'Previous row', group: 'In the list', run: () => select(at - 1) },
        {
            keys: 'x',
            what: 'Select the row',
            group: 'In the list',
            run: () => {
                const row = rows[at];
                row.setAttribute('aria-selected', row.getAttribute('aria-selected') === 'true' ? 'false' : 'true');
                say(log, `x · ${ticked().length} selected`);
            },
        },
        {
            keys: 'Shift D',
            what: 'Delete the selected rows',
            group: 'In the list',
            when: () => ticked().length > 0,
            reason: 'Select a row first (x)',
            run: () => say(log, `Shift D · deleted ${ticked().length}`),
        },
    ]);
    list.addEventListener('focusin', (event) => {
        const row = /** @type {HTMLElement} */ (event.target).closest('li');
        if (row) at = rows.indexOf(/** @type {HTMLLIElement} */ (row));
    });
    byId('kb-keys-altgr').addEventListener('click', () => {
        const stop = registerShortcuts('altgr-demo', [{ keys: ']', what: 'Next tab', run: () => undefined }], {
            onWarn: (message) => say(log, `warning for the developer: ${message}`),
        });
        setTimeout(stop, 0);
    });
    byId('kb-keys-clash').addEventListener('click', () => {
        try {
            registerShortcuts('page', [{ keys: 'g i', what: 'Something else', run: () => undefined }], { dev: true });
        } catch (error) {
            say(log, `development error: ${/** @type {Error} */ (error).message}`);
        }
    });
    byId('kb-keys-hint').addEventListener('change', (event) => {
        // The optional "No shortcut on g x" line.
        import('../../../../js/shortcuts.js').then((m) => m.configureShortcuts({ unknownHint: /** @type {HTMLInputElement} */ (event.target).checked }));
    });
}

/* ------------------------------------------------------------------- the lede */
if (document.getElementById('kb-lede-card')) {
    const card = byId('kb-lede-card');
    const state = byId('kb-lede-states');
    const set = (/** @type {string} */ value) => {
        if (value === 'ready') setCardState(card, 'ready');
        else if (value === 'loading') setCardState(card, 'loading', { words: 'Reading the schedules…' });
        else if (value === 'empty') setCardState(card, 'empty', { title: 'No schedules yet', text: 'A schedule starts a job at fixed times.' });
        else setCardState(card, 'error', { title: 'The schedules could not be read', text: 'The service did not answer in time.' });
    };
    state.addEventListener('kp-segmented-change', (event) => set(/** @type {CustomEvent} */ (event).detail.value));
    card.addEventListener('kp-card-retry', () => {
        set('loading');
        setTimeout(() => set('ready'), 1200);
    });
    set('ready');
}

/* ------------------------------------------------------------- problem alert */
if (document.getElementById('kb-problems-live')) {
    const fix = (/** @type {string} */ label, /** @type {string} */ key) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'kp-button kp-button--secondary kp-button--sm';
        button.textContent = label;
        button.setAttribute('data-kb-fix', key);
        return button;
    };
    const base = () => [
        {
            key: 'calendar',
            severity: 'critical',
            what: 'The calendar is not shared',
            why: 'Almanac cannot read “Family” without the share.',
            remedy: 'Share the calendar with the service account, then check again.',
            action: fix('Check again', 'calendar'),
        },
        {
            key: 'token',
            severity: 'warning',
            what: 'The access token ends in 3 days',
            why: 'A new one is issued by hand.',
            remedy: 'Run this on the server, then restart the service.',
            command: 'chassis token renew --service almanac',
            action: fix('Renew now', 'token'),
        },
        {
            key: 'disk',
            severity: 'warning',
            what: 'The backup disk is 91% full',
            why: 'Nightly backups stop at 100%.',
            remedy: 'Delete old snapshots or add space.',
            action: fix('Open the backups', 'disk'),
        },
        {
            key: 'dns',
            severity: 'info',
            what: 'The DNS record has no AAAA entry',
            why: 'Phones on IPv6-only networks use the slower path.',
            remedy: 'Add the record when convenient.',
        },
        {
            key: 'tz',
            severity: 'info',
            what: 'The time zone is not set',
            why: 'Times are shown in UTC.',
            remedy: 'Choose one in the settings.',
            action: fix('Open the settings', 'tz'),
        },
        { key: 'ntp', severity: 'info', what: 'The clock source is the default' },
    ];
    /** The container is configured by its attributes only: the component re-renders when one changes. */
    const live = byId('kb-problems-live');
    const modeGroup = byId('kb-problems-mode');
    const foldFrom = /** @type {HTMLInputElement} */ (byId('kb-problems-fold-from'));
    const readout = byId('kb-problems-readout');
    let problems = base();
    const show = () => {
        const mode = live.getAttribute('data-kp-problems-mode');
        const from = live.getAttribute('data-kp-problems-fold-from');
        readout.textContent = `data-kp-problems-mode="${mode}"${from ? ` data-kp-problems-fold-from="${from}"` : ''}, ${problems.length} problem${problems.length === 1 ? '' : 's'}`;
    };
    new MutationObserver(show).observe(live, { attributes: true });
    setProblems(live, problems);
    show();
    modeGroup.addEventListener('kp-segmented-change', (event) => {
        live.setAttribute('data-kp-problems-mode', /** @type {CustomEvent} */ (event).detail.value);
    });
    foldFrom.addEventListener('input', () => {
        const n = Number.parseInt(foldFrom.value, 10);
        if (n >= 2 && n <= 9) live.setAttribute('data-kp-problems-fold-from', String(n));
    });
    document.addEventListener('click', (event) => {
        const button = /** @type {HTMLElement} */ (event.target).closest('[data-kb-fix]');
        if (!button || button.closest('[data-kp-problems]') !== live) return;
        problems = problems.filter((p) => p.key !== button.getAttribute('data-kb-fix'));
        setProblems(live, problems);
        show();
    });
    byId('kb-problems-reset').addEventListener('click', () => {
        problems = base();
        setProblems(live, problems);
        show();
    });
    byId('kb-problems-clear').addEventListener('click', () => {
        problems = [];
        setProblems(live, problems);
        show();
    });
    // Standalone examples, one problem each.
    setProblems(byId('kb-problems-one'), base().slice(0, 1), { mode: 'each' });
    setProblems(
        byId('kb-problems-dismiss'),
        [
            {
                key: 'seen',
                severity: 'info',
                what: 'A new version is available',
                why: 'It adds the problem alert.',
                remedy: 'Update when the next job has finished.',
                dismissible: true,
            },
        ],
        { mode: 'each' },
    );
    setProblems(byId('kb-problems-phone'), base().slice(0, 2), { mode: 'each' });
    byId('kb-problems-inline').setAttribute('data-kp-problem-layout', 'inline');
    setProblems(byId('kb-problems-inline'), base().slice(1, 3), { mode: 'each' });
}

/* -------------------------------------------------------------- flash button */
if (document.getElementById('kb-flash-ran')) {
    const sentence = {
        error: 'The client has no address on file.',
        remedy: 'Add one under Clients, then send the test again.',
    };
    const ran = byId('kb-flash-ran');
    let runs = 0;
    const work = {
        ok: async () => {
            await wait(900);
            return 'Sent';
        },
        refused: async () => {
            await wait(900);
            return sentence;
        },
        toast: async () => {
            await wait(700);
            return sentence;
        },
        once: async () => {
            runs += 1;
            ran.textContent = `The work ran ${runs} time${runs === 1 ? '' : 's'}.`;
            await wait(1400);
            return 'Done';
        },
        copy: async () => {
            await wait(250);
            return 'Copied';
        },
    };
    for (const button of document.querySelectorAll('[data-kb-work]')) {
        const name = button.getAttribute('data-kb-work') ?? '';
        button.addEventListener('click', () => void runFlashButton(/** @type {HTMLElement} */ (button), /** @type {any} */ (work)[name]));
    }
    // Widths measured live: rest, busy and result are one width.
    const widths = byId('kb-flash-widths');
    const probe = byId('kb-flash-probe');
    /** @type {Record<string, number>} */
    const seen = {};
    probe.addEventListener(FLASH_EVENT, (event) => {
        const state = /** @type {CustomEvent} */ (event).detail.state;
        seen[state] = Math.round(probe.getBoundingClientRect().width * 10) / 10;
        widths.textContent = ['rest', 'busy', 'success', 'refused']
            .filter((name) => name in seen)
            .map((name) => `${name} ${seen[name]} px`)
            .join(' · ');
    });
    seen.rest = Math.round(probe.getBoundingClientRect().width * 10) / 10;
    widths.textContent = `rest ${seen.rest} px`;
    // Play every button in turn once.
    byId('kb-flash-all').addEventListener('click', () => {
        for (const button of document.querySelectorAll('[data-kb-work]:not([data-kb-skip])')) /** @type {HTMLElement} */ (button).click();
    });
}
