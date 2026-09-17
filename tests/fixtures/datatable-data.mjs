// The incidents both channels of tests/fixtures/datatable.html show [gap-13].
//
// One dataset, imported by the framework-free half (which writes it into
// the table as a server would) and by the React half (which is handed it
// as rows), so one suite drives both and neither can pass on data the
// other does not have [AR7].

const SITES = ['Main gate', 'Pump house 4', 'Cold store', 'Weighbridge', 'Boiler room'];
const STATUSES = ['Open', 'Watching', 'Closed'];
/** Declared out of their meaning's order on purpose, so an alphabetical sort and a sort by order disagree. */
const SEVERITIES = ['High', 'Low', 'Critical', 'Medium'];
const NOTES = [
    'Barrier arm stuck half-open after the power dip.',
    'Seen from the gate by the night shift; no fault in daylight.',
    'Temperature logger stopped sending at 02:10.',
    'Display flickers when the cabin heater is on.',
    'Pilot light goes out when the loading door opens.',
];

/** The severity order a column declares, low to high. */
export const SEVERITY_ORDER = ['Low', 'Medium', 'High', 'Critical'];

/** @type {{ ref: string, site: string, status: string, severity: string, hours: number, opened: string, note: string }[]} */
export const INCIDENTS = Array.from({ length: 30 }, (_, i) => ({
    ref: `INC-${String(4400 + i)}`,
    site: SITES[i % SITES.length] ?? '',
    status: STATUSES[i % STATUSES.length] ?? '',
    severity: SEVERITIES[i % SEVERITIES.length] ?? '',
    hours: ((i * 7) % 50) + 1,
    opened: `2026-08-${String(i + 1).padStart(2, '0')}`,
    note: NOTES[(i * 3) % NOTES.length] ?? '',
}));
