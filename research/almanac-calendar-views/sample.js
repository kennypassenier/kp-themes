// research/almanac-calendar-views: the SAMPLE deliveries both views draw from. The live service (4.1.7, up 10 days 3 h on
// 19/10/2026) has accepted and delivered 3 events and failed none; everything below is mock, so the two views agree with each
// other and the page can say so. The calendars and sources follow the real profile files (source ids other than
// home-assistant are mock names).

/** The calendars Almanac manages and the colour (series) each has in the week. */
export const CALENDARS = {
    household: { name: 'Almanac · Huishouden', series: 1 },
    infra: { name: 'Almanac · Infra', series: 2 },
    test: { name: 'almanac-test', series: 3 },
};

export const SOURCES = {
    'home-assistant': { name: 'Home Assistant', calendar: 'household' },
    homelab: { name: 'Homelab', calendar: 'infra' },
    kyu: { name: 'kyu reminders', calendar: 'household' },
    'claude-sessions': { name: 'Claude sessions', calendar: 'infra' },
};

/** The first day Almanac 4.1.7 ran (up 10 days 3 h on 19/10/2026) and the day the sample "now" stands on. */
export const FIRST_DAY = '2026-10-09';
export const TODAY = '2026-10-19';

const pad = (n) => String(n).padStart(2, '0');
const day = (d) => `2026-10-${pad(d)}`;

/**
 * @typedef {{ id: string, source: keyof typeof SOURCES, label: string, eventDay: string, eventAt: string, deliveredDay: string,
 *   deliveredAt: string, result: 'created' | 'updated' | 'failed', reason?: string }} Delivery
 * @type {Delivery[]}
 */
export const DELIVERIES = [];

/** @param {string} id @param {Delivery['source']} source @param {string} label @param {string} eventDay @param {string} eventAt
 *  @param {string} deliveredDay @param {string} deliveredAt @param {Delivery['result']} [result] @param {string} [reason] */
function add(id, source, label, eventDay, eventAt, deliveredDay, deliveredAt, result = 'created', reason) {
    DELIVERIES.push({ id, source, label, eventDay, eventAt, deliveredDay, deliveredAt, result, ...(reason ? { reason } : {}) });
}

// Every night the homelab writes its round and the verified backup (19/10 up to 09:40, the sample "now").
for (let d = 9; d <= 19; d += 1) {
    add(`round-${d}`, 'homelab', 'Nightly update round', day(d), '03:30', day(d), '03:31', d === 17 ? 'updated' : 'created');
    add(
        `backup-${d}`,
        'homelab',
        'Backup verified',
        day(d),
        '04:10',
        day(d),
        '04:12',
        d === 12 ? 'failed' : 'created',
        d === 12 ? 'Google answered 503 Service Unavailable; kept in the journal for the next try' : undefined,
    );
}

// Home Assistant: the household.
const HA = [
    [9, 'Plants watered', '07:30'],
    [10, 'Dishwasher finished', '21:05'],
    [11, 'Plants watered', '07:30'],
    [11, 'Washing machine finished', '10:20'],
    [12, 'Dishwasher finished', '20:55'],
    [13, 'Plants watered', '07:30'],
    [14, 'Dishwasher finished', '21:15'],
    [15, 'Washing machine finished', '09:50'],
    [15, 'Plants watered', '07:30'],
    [16, 'Dishwasher finished', '20:40'],
    [17, 'Plants watered', '07:30'],
    [17, 'Washing machine finished', '11:05'],
    [18, 'Dishwasher finished', '21:20'],
    [19, 'Plants watered', '07:30'],
    [19, 'Dishwasher finished', '08:15'],
];
for (const [d, label, at] of HA) {
    const delivered = `${at.slice(0, 2)}:${pad(Number(at.slice(3)) + 1)}`;
    add(`ha-${d}-${label}`, 'home-assistant', label, day(d), at, day(d), delivered, d === 16 && label === 'Dishwasher finished' ? 'updated' : 'created');
}

// kyu: reminders, some written days ahead.
add('kyu-bins-13', 'kyu', 'Reminder: put the bins out', day(13), '19:00', day(13), '19:02');
add('kyu-doctor-16', 'kyu', 'Reminder: dentist appointment', day(16), '16:30', day(16), '16:31', 'failed', 'Google answered 429 Too Many Requests; kept in the journal for the next try');
add('kyu-bins-20', 'kyu', 'Reminder: put the bins out', day(20), '19:00', day(18), '19:02');
add('kyu-insurance-22', 'kyu', 'Reminder: renew the car insurance', day(22), '09:00', day(15), '21:30');
add('kyu-plumber-23', 'kyu', 'Reminder: call the plumber', day(23), '18:00', day(19), '07:50');

// Claude sessions and the homelab's planned maintenance, written ahead.
add('claude-review-21', 'claude-sessions', 'AI session: review the Almanac screens', day(21), '14:00', day(19), '08:45');
add('maintenance-24', 'homelab', 'Planned: kernel update window', day(24), '03:30', day(17), '22:10');

/** The deliveries that arrived on one day, in delivery order. @param {string} iso */
export const deliveredOn = (iso) => DELIVERIES.filter((d) => d.deliveredDay === iso).sort((a, b) => a.deliveredAt.localeCompare(b.deliveredAt));

/** `2026-10-04` becomes `04/10/2026`. @param {string} iso */
export const human = (iso) => iso.split('-').reverse().join('/');

/** @param {string} dayIso @param {string} at ISO instant with the Brussels offset (summer time ends 25/10/2026 at 03:00). */
export function instant(dayIso, at) {
    const summer = dayIso < '2026-10-25' || (dayIso === '2026-10-25' && at < '03:00');
    return `${dayIso}T${at}:00${summer ? '+02:00' : '+01:00'}`;
}
