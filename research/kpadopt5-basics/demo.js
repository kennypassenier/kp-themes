// research/kpadopt5-basics: the page's own wiring (mock data; every part is the package's).
import { setProblems } from '../../js/problems.js';

/** @param {string} id @returns {HTMLElement} */
const byId = (id) => /** @type {HTMLElement} */ (document.getElementById(id));

/* ------------------------------------------------------------- problem alert */
{
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
