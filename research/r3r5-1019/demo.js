// research/r3r5-1019: the page's own wiring. The components are the package's (js/auto.js attaches the timelines); this file gives the
// timelines their lanes, runs and moments and the uses maps their relation.
import { setGanttRuns, setGanttPoints, setGanttKinds, setGanttZones, setGanttWindow } from '../../js/gantt.js';
import { setMatrix } from '../../js/heat.js';

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
await ready;

const NOW = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
/** @param {string} id */
const $ = (id) => /** @type {HTMLElement | null} */ (document.getElementById(id));
/** A window that holds still (the bars stand where they are while a section is judged and measured): the last `hours` up to a little past now. @param {HTMLElement} el @param {number} hours */
const still = (el, hours) => setGanttWindow(el, { span: hours * 3600, live: false, to: NOW + 0.08 * hours * HOUR });

// ---- 1 · lane names --------------------------------------------------------------------------------------
{
    const el = $('rr-names');
    if (el) {
        const lanes = [
            { id: 'photos', label: 'Photos and family videos archive', sub: 'Container 111 on the second host' },
            { id: 'vault', label: 'Vaultwarden', sub: 'CT 111' },
            { id: 'db', label: 'Nightly database snapshots', href: '#gantt-names' },
            { id: 'ha', label: 'Home automation configuration and add-ons', sub: 'CT 101, every night' },
        ];
        setGanttRuns(
            el,
            [
                { id: 'n1', lane: 'photos', label: 'Backup', start: NOW - 5 * HOUR, end: NOW - 2.5 * HOUR, state: 'ok' },
                { id: 'n2', lane: 'vault', label: 'Run', start: NOW - 3.5 * HOUR, end: NOW - HOUR, state: 'failed' },
                { id: 'n3', lane: 'db', label: 'Scan', start: NOW - 2.5 * HOUR, end: NOW - 20 * MIN, state: 'ok' },
                { id: 'n4', lane: 'ha', label: 'Sync', start: NOW - 4.5 * HOUR, end: NOW - 2 * HOUR, state: 'ok' },
            ],
            lanes,
        );
        still(el, 6);
    }
}

// ---- 2 · a stretch under a crowded mark -------------------------------------------------------------------
{
    const el = $('rr-zone');
    if (el) {
        const lanes = [
            { id: 'a1', label: 'Attempt 1', sub: 'claimed at 12:00:10' },
            { id: 'a2', label: 'Attempt 2', sub: 'claimed at 12:00:50' },
        ];
        setGanttKinds(el, [{ kind: 'nack', label: 'Refused', shape: 'triangle', tone: 'destructive' }]);
        setGanttRuns(
            el,
            [
                { id: 'z0', lane: 'a1', label: 'Held', start: NOW - 2.4 * HOUR, end: NOW - 1.7 * HOUR, state: 'ok' },
                { id: 'z1', lane: 'a2', label: 'Held', start: NOW - 3 * HOUR, end: NOW - 1.5 * HOUR, state: 'ok' },
            ],
            lanes,
        );
        setGanttPoints(
            el,
            [
                ...[0, 3, 6, 9].map((m, i) => ({ id: `p${i}`, lane: 'a1', at: NOW - 3 * HOUR + m * MIN, kind: 'nack', label: `Refused ${i + 1}` })),
                ...[0, 4].map((m, i) => ({ id: `q${i}`, lane: 'a1', at: NOW - 1.2 * HOUR + m * MIN, kind: 'nack', label: `Refused again ${i + 1}` })),
                { id: 'r1', lane: 'a2', at: NOW - 1.4 * HOUR, kind: 'nack', label: 'Refused' },
            ],
            lanes,
        );
        setGanttZones(el, [
            { id: 'l1', lane: 'a1', from: NOW - 3.2 * HOUR, to: NOW - 2 * HOUR, label: 'Lease', tone: 'info' },
            { id: 'l2', lane: 'a1', from: NOW - 1.3 * HOUR, to: NOW - 0.6 * HOUR, label: 'Lease', tone: 'info' },
            { id: 'l3', lane: 'a2', from: NOW - 3 * HOUR, to: NOW - 1.6 * HOUR, label: 'Lease', tone: 'info' },
        ]);
        still(el, 6);
    }
}

// ---- 3 · twelve lanes --------------------------------------------------------------------------------------
{
    const el = $('rr-frame');
    if (el) {
        const names = ['jellyfin', 'immich', 'paperless', 'vaultwarden', 'grafana', 'kyu', 'traefik', 'homeassistant', 'prometheus', 'loki', 'uptime-kuma', 'media-requests'];
        const lanes = names.map((label, i) => ({ id: label, label, sub: `CT ${101 + i}` }));
        setGanttRuns(
            el,
            names.map((lane, i) => ({
                id: `f${i}`,
                lane,
                label: 'Backup',
                start: NOW - (5.5 - i * 0.3) * HOUR,
                end: NOW - (3 - i * 0.3) * HOUR,
                state: /** @type {'ok' | 'failed'} */ (i === 4 ? 'failed' : 'ok'),
            })),
            lanes,
        );
        still(el, 6);
    }
}

// ---- 4 · the rules and a queued bar --------------------------------------------------------------------------
{
    const el = $('rr-rules');
    if (el) {
        // The queued job starts 2.5 minutes before a quarter-hour rule, so a rule lies under its words at every width.
        const rule = Math.floor((NOW - 25 * MIN) / (15 * MIN)) * 15 * MIN;
        const lanes = [
            { id: 'photos', label: 'Photos' },
            { id: 'updates', label: 'Updates' },
            { id: 'backups', label: 'Backups' },
        ];
        setGanttRuns(
            el,
            [
                { id: 'u1', lane: 'photos', label: 'Backup', start: rule - 35 * MIN, end: rule - 5 * MIN, state: 'ok' },
                { id: 'u2', lane: 'updates', label: 'Update photos', start: rule - 2.5 * MIN, state: 'queued' },
                { id: 'u3', lane: 'backups', label: 'Backup', start: rule - 12 * MIN, end: rule - 3 * MIN, state: 'failed' },
            ],
            lanes,
        );
        still(el, 1);
    }
}

// ---- 5 · the grid view of the uses map -----------------------------------------------------------------------
{
    const el = $('rr-grid');
    if (el) {
        const rows = ['Vaultwarden', 'Photos and family videos archive', 'Nightly database snapshots', 'Jellyfin', 'Grafana'].map((label, i) => ({ key: `s${i}`, label }));
        const columns = ['Backups', 'Vaultwarden', 'Docker registry mirror', 'Monitoring'].map((label, i) => ({ key: `u${i}`, label }));
        setMatrix(el, {
            corner: 'Stack ↓ uses →',
            label: 'Which stack uses which service',
            rows,
            columns,
            cell: (/** @type {string} */ row, /** @type {string} */ column) => ((Number(row.slice(1)) + Number(column.slice(1))) % 3 === 0 ? { tone: 'none' } : { tone: 'ok', label: 'uses it' }),
        });
    }
}

// ---- 6 · lines with a tone and a label -------------------------------------------------------------------------
/** @param {string} id @param {string[]} sources @param {string[]} users @param {Record<string, { tone: 'ok' | 'warn' | 'bad' | 'muted', label: string }>} hits */
const uses = (id, sources, users, hits) => {
    const el = $(id);
    if (!el) return;
    setMatrix(el, {
        view: 'lines',
        label: 'How each stack uses each service',
        sourcesLabel: 'Stacks',
        usersLabel: 'Services',
        rows: sources.map((label, i) => ({ key: `s${i}`, label })),
        columns: users.map((label, i) => ({ key: `u${i}`, label })),
        cell: (/** @type {string} */ row, /** @type {string} */ column) => hits[`${row}>${column}`] ?? null,
    });
};
uses('rr-lines-few', ['Vaultwarden', 'Photos and family videos archive', 'Nightly database snapshots'], ['Backups', 'Monitoring', 'Docker registry mirror'], {
    's0>u0': { tone: 'ok', label: 'writes here' },
    's0>u1': { tone: 'warn', label: 'read only' },
    's1>u0': { tone: 'ok', label: 'writes here' },
    's2>u2': { tone: 'bad', label: 'blocked' },
    's2>u1': { tone: 'muted', label: 'idle' },
});
uses(
    'rr-lines-many',
    ['jellyfin', 'immich', 'paperless', 'vaultwarden', 'grafana'],
    ['Backups', 'Monitoring', 'Docker registry mirror', 'Reverse proxy', 'Log shipping'],
    Object.fromEntries(
        [
            ['s0>u0', 'ok', 'writes here'], ['s0>u1', 'ok', 'scraped'], ['s0>u3', 'ok', 'routed'],
            ['s1>u0', 'warn', 'read only'], ['s1>u2', 'ok', 'pulls images'], ['s1>u4', 'muted', 'idle'],
            ['s2>u0', 'ok', 'writes here'], ['s2>u1', 'bad', 'not scraped'], ['s2>u3', 'ok', 'routed'],
            ['s3>u0', 'ok', 'writes here'], ['s3>u3', 'warn', 'slow'], ['s3>u4', 'ok', 'ships logs'],
            ['s4>u1', 'ok', 'scraped'], ['s4>u2', 'bad', 'blocked'], ['s4>u4', 'ok', 'ships logs'],
        ].map(([pair, tone, label]) => [pair, { tone, label }]),
    ),
);


